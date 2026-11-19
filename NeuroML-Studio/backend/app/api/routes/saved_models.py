import os
from typing import List
from fastapi import APIRouter, Depends
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.database.models import User
from app.core.dependencies import get_current_user
from app.schemas.model import TrainedModelResponse
from app.services.model_service import ModelService

router = APIRouter(prefix="/models", tags=["Saved Models"])

@router.get("/", response_model=List[TrainedModelResponse])
def get_all_models(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    models = ModelService.get_user_models(current_user, db)
    return [
        TrainedModelResponse(
            id=m.id,
            model_name=m.model_name,
            algorithm=m.algorithm,
            problem_type=m.problem_type,
            target_column=m.target_column,
            dataset_id=m.dataset_id,
            dataset_name=m.dataset.dataset_name if m.dataset else "Dataset",
            feature_columns=m.feature_columns,
            metrics=m.metrics,
            created_at=m.created_at,
            duration=m.metrics.get("training_duration", "1.5s")
        )
        for m in models
    ]

@router.get("/{model_id}", response_model=TrainedModelResponse)
def get_model_by_id(
    model_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    m = ModelService.get_model(model_id, current_user, db)
    return TrainedModelResponse(
        id=m.id,
        model_name=m.model_name,
        algorithm=m.algorithm,
        problem_type=m.problem_type,
        target_column=m.target_column,
        dataset_id=m.dataset_id,
        dataset_name=m.dataset.dataset_name if m.dataset else "Dataset",
        feature_columns=m.feature_columns,
        metrics=m.metrics,
        created_at=m.created_at,
        duration=m.metrics.get("training_duration", "1.5s")
    )

@router.delete("/{model_id}")
def delete_model(
    model_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    ModelService.delete_model(model_id, current_user, db)
    return {"message": "Model and associated artifacts deleted successfully."}

@router.get("/{model_id}/download")
def download_model_artifact(
    model_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    file_path = ModelService.get_download_path(model_id, current_user, db)
    filename = os.path.basename(file_path)
    return FileResponse(
        path=file_path,
        filename=filename,
        media_type="application/octet-stream"
    )
