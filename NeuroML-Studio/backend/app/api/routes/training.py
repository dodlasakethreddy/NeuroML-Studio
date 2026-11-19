from typing import List
from fastapi import APIRouter, Depends, BackgroundTasks, status
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.database.models import User
from app.core.dependencies import get_current_user
from app.schemas.training import (
    TrainingRequest,
    TrainingJobResponse,
    TrainingJobDetailResponse,
    TrainingHistoryItem,
)
from app.services.training_service import TrainingService

router = APIRouter(prefix="/training", tags=["Model Training"])

@router.post("/start", response_model=TrainingJobResponse, status_code=status.HTTP_201_CREATED)
def start_model_training(
    req: TrainingRequest,
    background_tasks: BackgroundTasks,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Create the job in Pending state
    job = TrainingService.start_training_job(req, current_user, db)

    # Dispatch training asynchronously to background task
    background_tasks.add_task(
        TrainingService.run_background_training,
        job.id,
        current_user.id,
        req
    )

    return TrainingJobResponse(
        job_id=job.id,
        status=job.status,
        dataset_id=job.dataset_id,
        problem_type=job.problem_type,
        target_column=job.target_column,
        selected_algorithms=job.algorithms,
        started_at=job.started_at,
        completed_at=job.completed_at,
        error_message=job.error_message,
        trained_models_count=0
    )

@router.get("/history", response_model=List[TrainingHistoryItem])
def get_training_history(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    history = TrainingService.get_user_training_history(current_user, db)
    return [TrainingHistoryItem(**item) for item in history]

@router.get("/{job_id}", response_model=TrainingJobDetailResponse)
def get_training_job_status(
    job_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    status_dict = TrainingService.get_job_status(job_id, current_user, db)
    return TrainingJobDetailResponse(**status_dict)
