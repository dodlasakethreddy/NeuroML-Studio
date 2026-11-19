from typing import List
from fastapi import APIRouter, Depends, UploadFile, File, Query, status
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.database.models import User
from app.core.dependencies import get_current_user
from app.services.dataset_service import DatasetService
from app.schemas.dataset import (
    DatasetResponse,
    DatasetPreviewResponse,
    DatasetStatisticsResponse,
    CorrelationResponse,
    DistributionResponse,
    ColumnStatisticsResponse,
)

router = APIRouter(prefix="/datasets", tags=["Datasets"])

@router.post("/upload", response_model=DatasetResponse, status_code=status.HTTP_201_CREATED)
async def upload_dataset(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    dataset = await DatasetService.upload_dataset(file, current_user, db)
    return DatasetResponse(
        id=dataset.id,
        dataset_name=dataset.dataset_name,
        total_rows=dataset.rows,
        total_columns=dataset.columns,
        columns_metadata=dataset.column_metadata,
        uploaded_at=dataset.uploaded_at,
        file_size_formatted="Ready"
    )

@router.get("/", response_model=List[DatasetResponse])
def get_all_datasets(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    datasets = DatasetService.get_user_datasets(current_user, db)
    return [
        DatasetResponse(
            id=d.id,
            dataset_name=d.dataset_name,
            total_rows=d.rows,
            total_columns=d.columns,
            columns_metadata=d.column_metadata,
            uploaded_at=d.uploaded_at
        )
        for d in datasets
    ]

@router.get("/{dataset_id}", response_model=DatasetResponse)
def get_dataset_by_id(
    dataset_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    d = DatasetService.get_dataset(dataset_id, current_user, db)
    return DatasetResponse(
        id=d.id,
        dataset_name=d.dataset_name,
        total_rows=d.rows,
        total_columns=d.columns,
        columns_metadata=d.column_metadata,
        uploaded_at=d.uploaded_at
    )

@router.get("/{dataset_id}/preview", response_model=DatasetPreviewResponse)
def get_dataset_preview(
    dataset_id: str,
    limit: int = Query(15, ge=1, le=100),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    preview = DatasetService.get_preview(dataset_id, current_user, db, n_rows=limit)
    return DatasetPreviewResponse(**preview)

@router.get("/{dataset_id}/statistics", response_model=DatasetStatisticsResponse)
def get_dataset_statistics(
    dataset_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    stats = DatasetService.get_statistics(dataset_id, current_user, db)
    return DatasetStatisticsResponse(**stats)

@router.get("/{dataset_id}/correlation", response_model=CorrelationResponse)
def get_dataset_correlation(
    dataset_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    corr = DatasetService.get_correlation(dataset_id, current_user, db)
    return CorrelationResponse(**corr)

@router.get("/{dataset_id}/distribution", response_model=DistributionResponse)
def get_dataset_distribution(
    dataset_id: str,
    column: str = Query(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    dist = DatasetService.get_distribution(dataset_id, column, current_user, db)
    return DistributionResponse(**dist)

@router.get("/{dataset_id}/column-statistics", response_model=ColumnStatisticsResponse)
def get_column_statistics(
    dataset_id: str,
    column: str = Query(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    stats = DatasetService.get_column_statistics(dataset_id, column, current_user, db)
    return ColumnStatisticsResponse(**stats)

@router.delete("/{dataset_id}")
def delete_dataset(
    dataset_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    DatasetService.delete_dataset(dataset_id, current_user, db)
    return {"message": "Dataset successfully deleted."}
