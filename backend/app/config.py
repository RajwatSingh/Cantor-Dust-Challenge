from pydantic_settings import BaseSettings
from pathlib import Path

class Settings(BaseSettings):
    """Application configuration"""
    
    # Model settings
    MODEL_PATH: str = "../models/best_model.pth"
    MODEL_VERSION: str = "v0.1.0"
    MODEL_ARCHITECTURE: str = "efficientnet_b0"
    
    # Inference settings
    MAX_FILE_SIZE_MB: int = 10
    ALLOWED_EXTENSIONS: set = {".jpg", ".jpeg", ".png"}
    IMAGE_SIZE: int = 224
    
    # Confidence thresholds [1]
    HIGH_CONFIDENCE_THRESHOLD: float = 0.90
    LOW_CONFIDENCE_THRESHOLD: float = 0.70
    
    # Database
    DATABASE_URL: str = "sqlite:///./brain_tumor_diagnosis.db"
    
    # Device
    DEVICE: str = "cpu"  
    
    class Config:
        env_file = ".env"

settings = Settings()
