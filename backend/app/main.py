from fastapi import FastAPI, File, UploadFile, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from PIL import Image
import io
from pathlib import Path
from typing import List

from .inference import classifier
from .database import get_db, log_inference, InferenceLog
from .models import PredictionResponse, InferenceHistory
from .config import settings

app = FastAPI(
    title="Brain Tumor Classification API",
    description="AI-powered CT scan analysis (prototype - not for clinical use)",
    version=settings.MODEL_VERSION
)

# Enable CORS for frontend [1]
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure properly in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    """Health check endpoint"""
    return {
        "status": "running",
        "model_version": settings.MODEL_VERSION,
        "message": "Brain Tumor Classification API"
    }

@app.post("/predict", response_model=PredictionResponse)
async def predict(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    """
    Image upload and inference endpoint [1]
    
    Validates file type, size, and decoding [1]
    Returns structured JSON with all required fields [1]
    """
    
    # Validate file extension [1]
    file_ext = Path(file.filename).suffix.lower()
    if file_ext not in settings.ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid file type. Allowed: {settings.ALLOWED_EXTENSIONS}"
        )
    
    # Read file content
    contents = await file.read()
    
    # Validate file size [1]
    file_size_mb = len(contents) / (1024 * 1024)
    if file_size_mb > settings.MAX_FILE_SIZE_MB:
        raise HTTPException(
            status_code=400,
            detail=f"File too large. Maximum size: {settings.MAX_FILE_SIZE_MB}MB"
        )
    
    # Validate image decoding [1]
    try:
        image = Image.open(io.BytesIO(contents)).convert('RGB')
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=f"Failed to decode image: {str(e)}"
        )
    
    # Run inference
    try:
        prediction = classifier.predict(image, file.filename)
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Inference failed: {str(e)}"
        )
    
    # Log to audit database [1]
    log_inference(db, prediction)
    
    return prediction

@app.get("/history", response_model=List[InferenceHistory])
def get_history(
    limit: int = 50,
    db: Session = Depends(get_db)
):
    """
    Retrieve inference history/audit log [1]
    """
    logs = db.query(InferenceLog).order_by(
        InferenceLog.timestamp.desc()
    ).limit(limit).all()
    
    return logs

@app.delete("/history")
def clear_history(db: Session = Depends(get_db)):
    """
    Completely wipe the audit log (Admin only in production)
    """
    try:
        # Delete all rows in the InferenceLog table
        db.query(InferenceLog).delete()
        db.commit()
        return {"message": "History cleared successfully", "status": "success"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to clear history: {str(e)}")

@app.get("/stats")
def get_stats(db: Session = Depends(get_db)):
    """Summary statistics for monitoring"""
    total = db.query(InferenceLog).count()
    flagged = db.query(InferenceLog).filter(
        InferenceLog.requires_human_review == True
    ).count()
    
    return {
        "total_inferences": total,
        "flagged_for_review": flagged,
        "review_rate": round(flagged / total * 100, 2) if total > 0 else 0
    }
