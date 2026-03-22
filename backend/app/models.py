from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional

class PredictionResponse(BaseModel):
    predicted_label: str = Field(..., description="Predicted class: 'healthy' or 'tumor'")
    tumor_probability: float = Field(..., description="Probability of tumor class (0-1)")
    confidence: str = Field(..., description="Confidence level: 'high', 'medium', or 'low'")
    requires_human_review: bool = Field(..., description="Whether prediction needs human review")
    model_version: str = Field(..., description="Model version used for inference")
    inference_time_ms: int = Field(..., description="Time taken for inference in milliseconds")

class InferenceHistory(BaseModel):
    id: int
    filename: str
    predicted_label: str
    tumor_probability: float
    confidence: str
    requires_human_review: bool
    model_version: str
    timestamp: datetime
    
    class Config:
        from_attributes = True
