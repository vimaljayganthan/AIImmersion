import os
import sys
import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Ensure backend directory is in path
backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from app.api.diagnosis import router as diagnosis_router
from app.api.assistant import router as assistant_router
from app.services.diagnosis_service import diagnosis_service
from app.schemas.diagnosis import HealthResponse

# Logging configuration
logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("AutoSenseMain")

app = FastAPI(
    title="AutoSense AI — Multimodal Diagnostic Engine API",
    description="Real Machine Learning backend for Vehicle Fault Classification using NLP, Acoustic Analysis, Computer Vision, and Multimodal Late Fusion.",
    version="1.0.0"
)

# Enable CORS for React Frontend (Vite on 5173 / localhost)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "*",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(diagnosis_router)
app.include_router(assistant_router)

@app.get("/health", response_model=HealthResponse)
def health():
    clf = diagnosis_service.text_classifier
    is_loaded = clf.is_trained() or (clf.model is not None and clf.vectorizer is not None)
    return HealthResponse(
        status="ok",
        service="AutoSense ML Backend",
        model_loaded=is_loaded,
        model_name="AutoSense Fault Classifier",
        model_version="1.0"
    )

@app.get("/")
def root():
    return {
        "status": "online",
        "service": "AutoSense AI Diagnostic Engine",
        "version": "1.0.0",
        "endpoints": [
            "/health",
            "/api/health",
            "/api/ml/pipeline",
            "/api/diagnosis",
            "/api/model-info",
            "/api/model-evaluation"
        ]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
