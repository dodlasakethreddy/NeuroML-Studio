from typing import Dict, Any
import pandas as pd
import numpy as np
from fastapi import HTTPException
from sqlalchemy.orm import Session
from app.database.models import User
from app.services.dataset_service import DatasetService
from app.schemas.preprocessing import PreprocessingConfig
from app.ml.preprocessing import separate_feature_types, build_preprocessor

class PreprocessingService:

    @staticmethod
    def apply_preprocessing(
        dataset_id: str,
        config: PreprocessingConfig,
        user: User,
        db: Session
    ) -> Dict[str, Any]:
        dataset = DatasetService.get_dataset(dataset_id, user, db)
        df = pd.read_csv(dataset.file_path)

        original_rows = len(df)
        original_cols = len(df.columns)

        # 1. Duplicate handling
        dropped_duplicates = 0
        if config.remove_duplicates:
            duplicates_mask = df.duplicated()
            dropped_duplicates = int(duplicates_mask.sum())
            df = df.drop_duplicates()

        # 2. Selected features filter
        if config.selected_features and len(config.selected_features) > 0:
            cols_to_keep = [col for col in config.selected_features if col in df.columns]
            if config.target_column and config.target_column in df.columns and config.target_column not in cols_to_keep:
                cols_to_keep.append(config.target_column)
            if cols_to_keep:
                df = df[cols_to_keep]

        # 3. Handle missing values
        dropped_missing = 0
        if config.missing_values.lower() == "drop":
            before_drop = len(df)
            df = df.dropna()
            dropped_missing = before_drop - len(df)

        # 4. Feature separation
        features = [col for col in df.columns if col != config.target_column]
        num_cols, cat_cols = separate_feature_types(df, features)

        # 5. Build and dry-fit preprocessor to test transformations
        preprocessor = build_preprocessor(
            numerical_cols=num_cols,
            categorical_cols=cat_cols,
            missing_strategy=config.missing_values,
            encoding_method=config.encoding,
            scaling_method=config.scaling
        )

        X = df[features]
        try:
            X_transformed = preprocessor.fit_transform(X)
            transformed_feature_names = preprocessor.get_feature_names_out().tolist()
            new_col_count = len(transformed_feature_names)
        except Exception as e:
            raise HTTPException(
                status_code=400,
                detail=f"Preprocessing pipeline error: {str(e)}"
            )

        # Partitioning calculation
        test_ratio = config.train_test_split
        train_ratio = 1.0 - test_ratio
        total_remaining = len(df)
        train_rows = int(total_remaining * train_ratio)
        test_rows = total_remaining - train_rows

        # Format transformed preview sample (first 10 rows)
        if hasattr(X_transformed, "toarray"):
            X_transformed = X_transformed.toarray()
        
        sample_df = pd.DataFrame(
            X_transformed[:10],
            columns=transformed_feature_names[:X_transformed.shape[1]]
        ).round(3)

        return {
            "dataset_id": dataset.id,
            "message": "Preprocessing transformations verified and fitted successfully.",
            "summary": {
                "original_rows": original_rows,
                "remaining_rows": total_remaining,
                "dropped_duplicates": dropped_duplicates,
                "dropped_missing": dropped_missing,
                "original_columns": original_cols,
                "processed_columns": new_col_count,
                "train_rows": train_rows,
                "test_rows": test_rows,
                "train_split_pct": int(train_ratio * 100),
                "test_split_pct": int(test_ratio * 100),
                "numerical_features_count": len(num_cols),
                "categorical_features_count": len(cat_cols),
                "scaling_applied": config.scaling,
                "encoding_applied": config.encoding,
                "imputation_applied": config.missing_values
            },
            "preview_rows": sample_df.replace({np.nan: None}).to_dict(orient="records")
        }
