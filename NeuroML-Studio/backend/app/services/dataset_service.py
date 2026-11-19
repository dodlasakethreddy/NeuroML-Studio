import os
import uuid
from typing import List, Dict, Any, Optional
import pandas as pd
import numpy as np
from fastapi import UploadFile, HTTPException, status
from sqlalchemy.orm import Session
from app.core.config import settings
from app.database.models import Dataset, User

def format_file_size(size_bytes: int) -> str:
    for unit in ['B', 'KB', 'MB', 'GB']:
        if size_bytes < 1024.0:
            return f"{size_bytes:.1f} {unit}"
        size_bytes /= 1024.0
    return f"{size_bytes:.1f} GB"

class DatasetService:

    @staticmethod
    async def upload_dataset(file: UploadFile, user: User, db: Session) -> Dataset:
        # Validate extension
        filename = file.filename or "dataset.csv"
        if not filename.lower().endswith(".csv"):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Only CSV files (.csv) are accepted."
            )

        # Read file content and validate size
        content = await file.read()
        file_size = len(content)
        max_bytes = settings.MAX_UPLOAD_SIZE_MB * 1024 * 1024
        if file_size > max_bytes:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"File exceeds maximum allowed size of {settings.MAX_UPLOAD_SIZE_MB} MB."
            )

        # User directory
        user_dir = os.path.join(settings.DATASETS_DIR, f"user_{user.id}")
        os.makedirs(user_dir, exist_ok=True)

        dataset_id = str(uuid.uuid4())
        safe_filename = f"{dataset_id}_{filename.replace(' ', '_')}"
        file_path = os.path.join(user_dir, safe_filename)

        with open(file_path, "wb") as f:
            f.write(content)

        # Parse with Pandas to extract metadata and validate CSV
        try:
            df = pd.read_csv(file_path)
        except Exception as e:
            if os.path.exists(file_path):
                os.remove(file_path)
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Malformed CSV file. Could not parse table: {str(e)}"
            )

        if df.empty or len(df.columns) == 0:
            if os.path.exists(file_path):
                os.remove(file_path)
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="The uploaded CSV file is empty or has no columns."
            )

        # Extract column metadata
        columns_meta = []
        for col in df.columns:
            is_num = pd.api.types.is_numeric_dtype(df[col])
            missing_count = int(df[col].isna().sum())
            unique_count = int(df[col].nunique(dropna=True))
            sample_val = df[col].dropna().iloc[0] if not df[col].dropna().empty else None
            
            # Format sample if numpy
            if isinstance(sample_val, (np.integer, np.floating)):
                sample_val = sample_val.item()

            columns_meta.append({
                "name": str(col),
                "type": "Numeric" if is_num else "Categorical",
                "missing": missing_count,
                "unique": unique_count,
                "sample": sample_val
            })

        # Save to DB
        db_dataset = Dataset(
            id=dataset_id,
            user_id=user.id,
            dataset_name=filename,
            file_path=file_path,
            rows=len(df),
            columns=len(df.columns),
            column_metadata=columns_meta
        )
        db.add(db_dataset)
        db.commit()
        db.refresh(db_dataset)

        return db_dataset

    @staticmethod
    def get_user_datasets(user: User, db: Session) -> List[Dataset]:
        return db.query(Dataset).filter(Dataset.user_id == user.id).order_by(Dataset.uploaded_at.desc()).all()

    @staticmethod
    def get_dataset(dataset_id: str, user: User, db: Session) -> Dataset:
        dataset = db.query(Dataset).filter(Dataset.id == dataset_id).first()
        if not dataset:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Dataset not found")
        if dataset.user_id != user.id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied to this dataset")
        return dataset

    @staticmethod
    def delete_dataset(dataset_id: str, user: User, db: Session) -> bool:
        dataset = DatasetService.get_dataset(dataset_id, user, db)
        # Delete file on disk
        if os.path.exists(dataset.file_path):
            try:
                os.remove(dataset.file_path)
            except Exception:
                pass
        db.delete(dataset)
        db.commit()
        return True

    @staticmethod
    def get_preview(dataset_id: str, user: User, db: Session, n_rows: int = 15) -> Dict[str, Any]:
        dataset = DatasetService.get_dataset(dataset_id, user, db)
        if not os.path.exists(dataset.file_path):
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Dataset file missing on disk")
        
        df = pd.read_csv(dataset.file_path, nrows=n_rows)
        # Replace NaN with None for valid JSON serialization
        preview_data = df.replace({np.nan: None}).to_dict(orient="records")

        return {
            "dataset_id": dataset.id,
            "dataset_name": dataset.dataset_name,
            "total_rows": dataset.total_rows,
            "total_columns": dataset.total_columns,
            "headers": list(df.columns),
            "preview_rows": preview_data,
            "columns_metadata": dataset.columns_metadata
        }

    @staticmethod
    def get_statistics(dataset_id: str, user: User, db: Session) -> Dict[str, Any]:
        dataset = DatasetService.get_dataset(dataset_id, user, db)
        df = pd.read_csv(dataset.file_path)

        # Missing values & duplicates
        missing_total = int(df.isna().sum().sum())
        duplicate_rows = int(df.duplicated().sum())

        # Numerical statistics
        num_cols = df.select_dtypes(include=[np.number]).columns
        num_stats = {}
        if len(num_cols) > 0:
            desc = df[num_cols].describe().replace({np.nan: None}).to_dict()
            for col, stats in desc.items():
                num_stats[col] = {
                    "count": stats.get("count", 0),
                    "mean": round(stats.get("mean", 0), 3) if stats.get("mean") is not None else 0,
                    "std": round(stats.get("std", 0), 3) if stats.get("std") is not None else 0,
                    "min": stats.get("min", 0),
                    "p25": stats.get("25%", 0),
                    "p50": stats.get("50%", 0),
                    "p75": stats.get("75%", 0),
                    "max": stats.get("max", 0)
                }

        # Categorical statistics
        cat_cols = df.select_dtypes(exclude=[np.number]).columns
        cat_stats = {}
        for col in cat_cols:
            val_counts = df[col].value_counts(dropna=False).head(10).to_dict()
            cat_stats[col] = {
                "unique": int(df[col].nunique(dropna=True)),
                "top": str(df[col].mode().iloc[0]) if not df[col].mode().empty else None,
                "top_freq": int(df[col].value_counts().iloc[0]) if not df[col].empty else 0,
                "value_counts": {str(k): int(v) for k, v in val_counts.items()}
            }

        return {
            "dataset_id": dataset.id,
            "dataset_name": dataset.dataset_name,
            "total_rows": dataset.total_rows,
            "total_columns": dataset.total_columns,
            "missing_values": missing_total,
            "duplicate_rows": duplicate_rows,
            "numerical_statistics": num_stats,
            "categorical_statistics": cat_stats,
            "columns_metadata": dataset.columns_metadata
        }

    @staticmethod
    def get_correlation(dataset_id: str, user: User, db: Session) -> Dict[str, Any]:
        dataset = DatasetService.get_dataset(dataset_id, user, db)
        df = pd.read_csv(dataset.file_path)
        num_df = df.select_dtypes(include=[np.number])

        if num_df.empty or len(num_df.columns) < 2:
            return {"dataset_id": dataset.id, "columns": [], "matrix": []}

        # Limit to top 15 numeric columns for clean chart visualization
        cols = list(num_df.columns[:15])
        corr_matrix = num_df[cols].corr().fillna(0).round(3)

        return {
            "dataset_id": dataset.id,
            "columns": cols,
            "matrix": corr_matrix.values.tolist()
        }

    @staticmethod
    def get_distribution(dataset_id: str, column: str, user: User, db: Session) -> Dict[str, Any]:
        dataset = DatasetService.get_dataset(dataset_id, user, db)
        df = pd.read_csv(dataset.file_path)

        if column not in df.columns:
            raise HTTPException(status_code=400, detail=f"Column '{column}' does not exist in dataset.")

        series = df[column].dropna()
        is_num = pd.api.types.is_numeric_dtype(series)

        distribution_data = []
        if is_num and series.nunique() > 15:
            # Create histogram bins
            counts, bin_edges = np.histogram(series, bins=10)
            for i in range(len(counts)):
                label = f"{bin_edges[i]:.1f}-{bin_edges[i+1]:.1f}"
                distribution_data.append({"name": label, "count": int(counts[i])})
        else:
            # Value counts
            top_counts = series.value_counts().head(15)
            for val, count in top_counts.items():
                distribution_data.append({"name": str(val), "count": int(count)})

        return {
            "dataset_id": dataset.id,
            "column": column,
            "column_type": "Numeric" if is_num else "Categorical",
            "distribution": distribution_data
        }

    @staticmethod
    def get_column_statistics(dataset_id: str, column: str, user: User, db: Session) -> Dict[str, Any]:
        dataset = DatasetService.get_dataset(dataset_id, user, db)
        df = pd.read_csv(dataset.file_path)

        if column not in df.columns:
            raise HTTPException(status_code=400, detail=f"Column '{column}' does not exist in dataset.")

        col_data = df[column]
        is_num = pd.api.types.is_numeric_dtype(col_data)

        stats = {
            "name": column,
            "type": "Numeric" if is_num else "Categorical",
            "count": int(col_data.count()),
            "missing": int(col_data.isna().sum()),
            "unique": int(col_data.nunique(dropna=True))
        }

        if is_num:
            stats.update({
                "mean": round(float(col_data.mean()), 3) if not col_data.dropna().empty else None,
                "std": round(float(col_data.std()), 3) if not col_data.dropna().empty else None,
                "min": float(col_data.min()) if not col_data.dropna().empty else None,
                "p25": float(col_data.quantile(0.25)) if not col_data.dropna().empty else None,
                "median": float(col_data.median()) if not col_data.dropna().empty else None,
                "p75": float(col_data.quantile(0.75)) if not col_data.dropna().empty else None,
                "max": float(col_data.max()) if not col_data.dropna().empty else None
            })
        else:
            stats.update({
                "top": str(col_data.mode().iloc[0]) if not col_data.mode().empty else None,
                "top_freq": int(col_data.value_counts().iloc[0]) if not col_data.empty else 0
            })

        return {
            "dataset_id": dataset.id,
            "column": column,
            "statistics": stats
        }
