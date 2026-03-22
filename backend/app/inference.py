import torch
import torchvision.transforms as transforms
from PIL import Image
import timm
import time
import hashlib
from .config import settings

class BrainTumorClassifier:
    """Model inference wrapper"""
    
    def __init__(self):
        self.device = torch.device(settings.DEVICE)
        self.model = None
        self.transform = self._get_transform()
        self.class_names = ['healthy', 'tumor']
        self.load_model()
    
    def _get_transform(self):
        """Image preprocessing pipeline"""
        return transforms.Compose([
            transforms.Resize((settings.IMAGE_SIZE, settings.IMAGE_SIZE)),
            transforms.ToTensor(),
            transforms.Normalize(
                mean=[0.485, 0.456, 0.406],
                std=[0.229, 0.224, 0.225]
            )
        ])
    
    def load_model(self):
        """Load trained model checkpoint"""
        try:
            # Load checkpoint
            checkpoint = torch.load(
                settings.MODEL_PATH,
                map_location=self.device
            )
            
            # Create model architecture
            self.model = timm.create_model(
                settings.MODEL_ARCHITECTURE,
                pretrained=False,
                num_classes=2
            )
            
            # Load weights directly - keys match perfectly!
            self.model.load_state_dict(
                checkpoint['model_state_dict'],
                strict=True
            )
            
            self.model.to(self.device)
            self.model.eval()
            
            print(f"✓ Model loaded: {settings.MODEL_VERSION}")
            print(f"✓ Best val accuracy: {checkpoint['val_acc']:.2f}%")
            
        except Exception as e:
            raise RuntimeError(f"Failed to load model: {str(e)}")
    
    def determine_confidence(self, probability: float) -> tuple[str, bool]:
        """
        Determine confidence level and human review requirement [1]
        
        Returns:
            confidence_level: 'high', 'medium', or 'low'
            requires_review: True if low confidence
        """
        if probability >= settings.HIGH_CONFIDENCE_THRESHOLD or \
           probability <= (1 - settings.HIGH_CONFIDENCE_THRESHOLD):
            return "high", False
        elif probability >= settings.LOW_CONFIDENCE_THRESHOLD and \
             probability <= (1 - settings.LOW_CONFIDENCE_THRESHOLD):
            return "medium", False
        else:
            return "low", True  # Flag for human review [1]
    
    def predict(self, image: Image.Image, filename: str) -> dict:
        """
        Run inference on uploaded image [1]
        
        Returns structured prediction with all required fields [1]
        """
        start_time = time.time()
        
        # Preprocess image
        image_tensor = self.transform(image).unsqueeze(0).to(self.device)
        
        # Inference
        with torch.no_grad():
            outputs = self.model(image_tensor)
            probabilities = torch.softmax(outputs, dim=1)
            tumor_prob = probabilities[0][1].item()
            predicted_class = 1 if tumor_prob > 0.5 else 0
        
        # Calculate inference time
        inference_time_ms = int((time.time() - start_time) * 1000)
        
        # Determine confidence and review flag [1]
        confidence, requires_review = self.determine_confidence(tumor_prob)
        
        # Generate image hash for audit trail
        image_hash = hashlib.md5(image.tobytes()).hexdigest()
        
        return {
            "predicted_label": self.class_names[predicted_class],
            "tumor_probability": round(tumor_prob, 4),
            "confidence": confidence,
            "requires_human_review": requires_review,
            "model_version": settings.MODEL_VERSION,
            "inference_time_ms": inference_time_ms,
            "filename": filename,
            "image_hash": image_hash
        }

# Global model instance
classifier = BrainTumorClassifier()
