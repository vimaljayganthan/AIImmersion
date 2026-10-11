import os
import sys
import logging
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException
from fastapi.responses import JSONResponse

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
    title="DriveIQ / AutoSense AI — Multimodal Diagnostic Engine API",
    description="Production Machine Learning backend for Vehicle Fault Classification using NLP, Acoustic Analysis, Computer Vision, and Multimodal Late Fusion.",
    version="1.0.0"
)

# Centralized Exception Handlers for safe, consistent error responses
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """Handles schema validation errors, returning structured 422 responses without leaking internals."""
    logger.warning("Validation error on %s %s: %s", request.method, request.url.path, exc.errors())
    return JSONResponse(
        status_code=422,
        content={
            "success": False,
            "error": "Request validation failed",
            "detail": exc.errors(),
            "code": "VALIDATION_ERROR"
        }
    )

@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(request: Request, exc: StarletteHTTPException):
    """Handles HTTPExceptions with consistent format while preserving the detail field for client contract."""
    logger.warning("HTTP error %d on %s %s: %s", exc.status_code, request.method, request.url.path, exc.detail)
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "error": exc.detail,
            "detail": exc.detail,
            "code": f"HTTP_{exc.status_code}"
        }
    )

@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception):
    """Catch-all for internal processing failures; logs full stack trace securely while masking raw tracebacks from clients."""
    logger.exception("Unhandled server exception on %s %s: %s", request.method, request.url.path, exc)
    return JSONResponse(
        status_code=500,
        content={
            "success": False,
            "error": "Internal diagnostic engine error. Please check server logs.",
            "detail": "Internal server error occurred during diagnostic processing.",
            "code": "INTERNAL_SERVER_ERROR"
        }
    )

# Enable CORS for React Frontend (Vite on 5173/5174/3000 / localhost)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5174",
        "http://localhost:5175",
        "http://127.0.0.1:5175",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:8000",
        "http://127.0.0.1:8000",
    ],
    allow_origin_regex=r"^https?://(localhost|127\.0\.0\.1)(:\d+)?$",
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
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)

