from datetime import datetime
from typing import List, Dict, Any, Optional
from pydantic import BaseModel

class TrainedModelResponse(BaseModel):
    id: str
    model_name: str
    algorithm: str
    problem_type: str
    target_column: str
    dataset_id: str
    dataset_name: Optional[str] = None
    feature_columns: List[str]
    metrics: Dict[str, Any]
    created_at: datetime
    duration: Optional[str] = None
    is_best: Optional[bool] = False

    class Config:
        from_attributes = True

class ModelComparisonItem(BaseModel):
    id: str
    name: str
    algorithm: str
    metrics: Dict[str, Any]
    duration: str
    is_best: bool = False
    confusion_matrix: Optional[Dict[str, Any]] = None

class ModelComparisonResponse(BaseModel):
    training_job_id: str
    problem_type: str
    dataset_name: str
    best_model: Optional[ModelComparisonItem] = None
    models: List[ModelComparisonItem]
    chart_data: List[Dict[str, Any]]
