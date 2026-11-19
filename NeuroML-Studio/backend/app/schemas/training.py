from datetime import datetime
from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field

class TrainingRequest(BaseModel):
    dataset_id: str
    problem_type: str = Field(..., description="Classification or Regression")
    target_column: str
    selected_features: List[str]
    algorithms: List[str] = Field(..., min_length=1, description="List of algorithm IDs or names")
    test_size: float = Field(default=0.2, ge=0.05, le=0.5)
    random_state: int = Field(default=42)
    hyperparameters: Optional[Dict[str, Dict[str, Any]]] = Field(default_factory=dict)

class TrainingJobResponse(BaseModel):
    job_id: str
    status: str
    dataset_id: str
    problem_type: str
    target_column: str
    selected_algorithms: List[str]
    started_at: datetime
    completed_at: Optional[datetime] = None
    error_message: Optional[str] = None
    trained_models_count: int = 0

    class Config:
        from_attributes = True

class TrainingJobDetailResponse(BaseModel):
    job_id: str
    status: str
    dataset_id: str
    dataset_name: Optional[str] = None
    problem_type: str
    target_column: str
    selected_algorithms: List[str]
    started_at: datetime
    completed_at: Optional[datetime] = None
    error_message: Optional[str] = None
    models: List[Dict[str, Any]] = []

class TrainingHistoryItem(BaseModel):
    id: str
    modelName: str
    algorithm: str
    datasetName: str
    problemType: str
    target: str
    trainingDate: str
    duration: str
    metrics: Dict[str, Any]
    status: str
    hyperparameters: Optional[Dict[str, Any]] = None
