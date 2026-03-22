from sqlalchemy import create_engine, Column, Integer, String, Float, Boolean, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime
from .config import settings

# Create database engine
engine = create_engine(settings.DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class InferenceLog(Base):
    __tablename__ = "inference_logs"
    
    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String, index=True)
    image_hash = Column(String)  # Optional: for duplicate detection
    predicted_label = Column(String)
    tumor_probability = Column(Float)
    confidence = Column(String)
    requires_human_review = Column(Boolean)
    model_version = Column(String)
    inference_time_ms = Column(Integer)
    timestamp = Column(DateTime, default=datetime.utcnow)
    user_id = Column(String, default="demo_user")  # Mock user for now

# Create tables
Base.metadata.create_all(bind=engine)

def get_db():
    """Dependency for database sessions"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def log_inference(db, prediction_data: dict):
    """
    Persist inference to audit log [1]
    """
    log_entry = InferenceLog(**prediction_data)
    db.add(log_entry)
    db.commit()
    db.refresh(log_entry)
    return log_entry
