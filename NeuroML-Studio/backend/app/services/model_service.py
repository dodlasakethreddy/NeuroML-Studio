import os
from typing import List, Dict, Any
from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from app.database.models import User, TrainedModel

class ModelService:

    @staticmethod
    def get_user_models(user: User, db: Session) -> List[TrainedModel]:
        return db.query(TrainedModel).filter(TrainedModel.user_id == user.id).order_by(TrainedModel.created_at.desc()).all()

    @staticmethod
    def get_model(model_id: str, user: User, db: Session) -> TrainedModel:
        model = db.query(TrainedModel).filter(TrainedModel.id == model_id).first()
        if not model:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Model not found")
        if model.user_id != user.id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied to this model")
        return model

    @staticmethod
    def delete_model(model_id: str, user: User, db: Session) -> bool:
        model = ModelService.get_model(model_id, user, db)
        
        # Remove file on disk safely
        if os.path.exists(model.model_path):
            try:
                os.remove(model.model_path)
            except Exception:
                pass

        db.delete(model)
        db.commit()
        return True

    @staticmethod
    def get_download_path(model_id: str, user: User, db: Session) -> str:
        model = ModelService.get_model(model_id, user, db)
        if not os.path.exists(model.model_path):
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Model artifact missing from storage")
        return model.model_path
