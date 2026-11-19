from typing import List
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.database.models import User
from app.core.dependencies import get_current_user
from app.schemas.prediction import (
    PredictionRequest,
    PredictionResponse,
    PredictionHistoryItem,
)
from app.services.prediction_service import PredictionService

router = APIRouter(prefix="/predictions", tags=["Predictions"])

@router.post("/{model_id}", response_model=PredictionResponse, status_code=status.HTTP_200_OK)
def make_prediction(
    model_id: str,
    req: PredictionRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    result = PredictionService.run_prediction(
        model_id=model_id,
        input_data=req.inputs,
        user=current_user,
        db=db
    )
    return PredictionResponse(**result)

@router.get("/history", response_model=List[PredictionHistoryItem])
def get_prediction_history(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    history = PredictionService.get_user_prediction_history(current_user, db)
    return [PredictionHistoryItem(**item) for item in history]
