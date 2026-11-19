from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.database.models import User
from app.core.dependencies import get_current_user
from app.schemas.preprocessing import PreprocessingConfig, PreprocessingResponse
from app.services.preprocessing_service import PreprocessingService

router = APIRouter(prefix="/preprocessing", tags=["Preprocessing"])

@router.post("/{dataset_id}", response_model=PreprocessingResponse)
def preprocess_dataset(
    dataset_id: str,
    config: PreprocessingConfig,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    result = PreprocessingService.apply_preprocessing(
        dataset_id=dataset_id,
        config=config,
        user=current_user,
        db=db
    )
    return PreprocessingResponse(**result)
