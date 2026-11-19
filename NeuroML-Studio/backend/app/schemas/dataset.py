from datetime import datetime
from typing import List, Dict, Any, Optional
from pydantic import BaseModel

class ColumnMeta(BaseModel):
    name: str
    type: str  # Numerical, Categorical, Datetime, etc.
    missing: int
    unique: int
    sample: Optional[Any] = None

class DatasetResponse(BaseModel):
    id: str
    dataset_name: str
    total_rows: int
    total_columns: int
    columns_metadata: List[Dict[str, Any]]
    uploaded_at: datetime
    file_size_formatted: Optional[str] = None

    class Config:
        from_attributes = True

class DatasetPreviewResponse(BaseModel):
    dataset_id: str
    dataset_name: str
    total_rows: int
    total_columns: int
    headers: List[str]
    preview_rows: List[Dict[str, Any]]
    columns_metadata: List[Dict[str, Any]]

class DatasetStatisticsResponse(BaseModel):
    dataset_id: str
    dataset_name: str
    total_rows: int
    total_columns: int
    missing_values: int
    duplicate_rows: int
    numerical_statistics: Dict[str, Dict[str, Any]]
    categorical_statistics: Dict[str, Dict[str, Any]]
    columns_metadata: List[Dict[str, Any]]

class CorrelationResponse(BaseModel):
    dataset_id: str
    columns: List[str]
    matrix: List[List[float]]

class DistributionDataPoint(BaseModel):
    name: str
    count: int

class DistributionResponse(BaseModel):
    dataset_id: str
    column: str
    column_type: str
    distribution: List[DistributionDataPoint]

class ColumnStatisticsResponse(BaseModel):
    dataset_id: str
    column: str
    statistics: Dict[str, Any]
