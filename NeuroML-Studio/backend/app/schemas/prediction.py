from datetime import datetime
from typing import Dict, Any, Optional, List, Union
from pydantic import BaseModel

class PredictionRequest(BaseModel):
    inputs: Dict[str, Any]

class ProbabilityItem(BaseModel):
    label: str
    value: float
    percent: str

class PredictionResponse(BaseModel):
    id: str
    model_id: str
    model_name: str
    algorithm: str
    problem_type: str
    timestamp: str
    inputs: Dict[str, Any]
    predicted_result: Union[str, float, int]
    prediction_probability: Optional[Union[float, List[ProbabilityItem]]] = None
    latency_ms: str
    status: str = "Success"

class PredictionHistoryItem(BaseModel):
    id: str
    model_id: str
    model_name: str
    algorithm: str
    dataset_name: Optional[str] = None
    timestamp: str
    inputs: Dict[str, Any]
    prediction: str
    confidence: Optional[float] = None
    latency: str
    status: str
