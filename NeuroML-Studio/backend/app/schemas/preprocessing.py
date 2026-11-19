from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field

class PreprocessingConfig(BaseModel):
    target_column: Optional[str] = None
    missing_values: str = Field(default="median", description="mean, median, mode, drop, or constant")
    remove_duplicates: bool = Field(default=True)
    encoding: str = Field(default="one_hot", description="one_hot or ordinal")
    scaling: str = Field(default="standard", description="standard, minmax, robust, or none")
    train_test_split: float = Field(default=0.2, ge=0.05, le=0.5, description="Test split ratio (e.g. 0.2)")
    selected_features: Optional[List[str]] = None

class PreprocessingResponse(BaseModel):
    dataset_id: str
    message: str
    summary: Dict[str, Any]
    preview_rows: List[Dict[str, Any]]
