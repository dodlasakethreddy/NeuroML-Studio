from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.database.models import User
from app.core.dependencies import get_current_user
from app.schemas.model import ModelComparisonResponse
from app.services.evaluation_service import EvaluationService

router = APIRouter(prefix="/models", tags=["Model Comparison"])

@router.get("/compare/{training_job_id}", response_model=ModelComparisonResponse)
def compare_models_in_job(
    training_job_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    comparison = EvaluationService.compare_job_models(training_job_id, current_user, db)
    return ModelComparisonResponse(**comparison)
