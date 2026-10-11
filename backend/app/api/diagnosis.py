import os
import json
import logging
from typing import Optional, Dict, Any, List
from fastapi import APIRouter, UploadFile, File, Form, HTTPException, status
from pydantic import BaseModel

from ..services.diagnosis_service import diagnosis_service
from ..schemas.diagnosis import (
    DiagnosisResponse,
    ModelInfo,
    ModelEvaluationMetrics,
    PipelineRequest,
    PipelineResponse,
    PipelineStage1,
    PipelineStage2,
    PipelineStage3,
    PipelineStage4,
    PipelineModelSummary,
    FeatureWeight,
    ClassProbability,
    HealthResponse
)

# Setup Logger
logger = logging.getLogger("AutoSenseML")
logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")

router = APIRouter(prefix="/api", tags=["Diagnosis"])

SEVERITY_MAPPING = {
    "Battery / Starting System": "Moderate",
    "Braking System": "Critical",
    "Engine & Valvetrain": "High",
    "Cooling System": "High",
    "Electrical & Sensors": "Moderate",
    "Transmission & Clutch": "Moderate",
    "Fuel System": "Critical",
    "Tyres & Suspension": "High"
}

RECOMMENDATION_MAPPING = {
    "Battery / Starting System": "Measure battery resting voltage (>12.4V) and inspect starter relay & terminal contacts.",
    "Braking System": "Inspect brake pad thickness (replace if <3mm) and check rotor surface for scoring/glazing.",
    "Engine & Valvetrain": "Perform cylinder compression test and check valve clearances & spark plug firing.",
    "Cooling System": "Perform radiator pressure test, inspect coolant levels, and verify electric fan activation.",
    "Electrical & Sensors": "Connect OBD-II scanner to read DTC fault codes and test alternator output (13.8V - 14.4V).",
    "Transmission & Clutch": "Inspect clutch cable adjustment, fluid condition, and check for clutch disc slippage.",
    "Fuel System": "Check fuel rail delivery pressure and clean clogged fuel injector nozzles.",
    "Tyres & Suspension": "Check cold tyre pressures, inspect tread wear depth, and check fork dampers / bearings."
}

class JsonDiagnosisRequest(BaseModel):
    symptoms: Optional[str] = None
    vehicle_context: Optional[str] = None

@router.get("/health", response_model=HealthResponse)
async def api_health_check():
    """
    Health check endpoint verifying FastAPI status and ML model availability.
    """
    clf = diagnosis_service.text_classifier
    is_loaded = clf.is_trained() or (clf.model is not None and clf.vectorizer is not None)
    return HealthResponse(
        status="ok",
        service="AutoSense ML Backend",
        model_loaded=is_loaded,
        model_name="AutoSense Fault Classifier",
        model_version="1.0"
    )

@router.post("/ml/pipeline", response_model=PipelineResponse)
async def run_ml_pipeline(req: PipelineRequest):
    """
    Executes the 4-Stage Machine Learning Diagnostic Pipeline.

    Architecture & Processing Stages:
    - Stage 1 (Text Preprocessing & Normalization): Lowercases text, cleans punctuation,
      and tokenizes into alphabetic linguistic units (filtering terms of length <= 2).
    - Stage 2 (Sparse TF-IDF Feature Extraction): Computes Term Frequency-Inverse Document
      Frequency vector over the 600+ automotive vocabulary; extracts active non-zero feature weights.
    - Stage 3 (Ensemble Classification & Probabilistic Inference): Runs a 150-estimator Random Forest
      classifier to compute posterior class probabilities across all 8 automotive diagnostic categories.
    - Stage 4 (Mechanical Advisory & Severity Synthesis): Maps the top predicted category to
      actionable mechanical inspection guidance, severity classification, and component diagnostics.

    Returns:
        PipelineResponse containing structured data for all 4 pipeline stages.
    """
    symptom = req.symptom.strip()
    if not symptom:
        logger.warning("Rejected ML pipeline request: empty symptom text.")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Please enter a vehicle symptom."
        )

    logger.info("ML pipeline request received: '%s'", symptom[:80])

    clf = diagnosis_service.text_classifier
    if not clf.model or not clf.vectorizer:
        logger.info("Loading saved model artifacts into memory...")
        clf.load()

    if not clf.model or not clf.vectorizer:
        logger.error("ML model files could not be loaded.")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="ML model is unavailable. Check model configuration."
        )

    # 1. Text Preprocessing & Tokenization
    combined = f"{symptom} {req.vehicle_context}".strip().lower()
    raw_tokens = [t.strip(",.!?\"'()") for t in combined.split()]
    tokens = [t for t in raw_tokens if len(t) > 2 and t.isalpha()]
    logger.info("Text preprocessing completed: %d tokens extracted", len(tokens))

    # 2. TF-IDF Feature Extraction
    vec = clf.vectorizer.transform([combined])
    feat_names = clf.vectorizer.get_feature_names_out()
    vocab_size = len(feat_names)

    nonzero_indices = vec.indices
    nonzero_weights = vec.data

    top_features: List[FeatureWeight] = [
        FeatureWeight(term=str(feat_names[idx]), weight=round(float(weight), 4))
        for idx, weight in sorted(zip(nonzero_indices, nonzero_weights), key=lambda x: x[1], reverse=True)
    ]
    logger.info("TF-IDF feature extraction completed: %d active features from vocab of %d", len(top_features), vocab_size)

    # 3. Model Prediction & Probabilities
    probabilities = clf.model.predict_proba(vec)[0]
    classes = list(clf.model.classes_)

    class_probs: List[ClassProbability] = [
        ClassProbability(
            class_name=cat,
            category=cat,
            probability=round(float(p), 4),
            percentage=round(float(p) * 100, 1)
        )
        for cat, p in sorted(zip(classes, probabilities), key=lambda x: x[1], reverse=True)
    ]

    top_cat = class_probs[0].class_name
    top_confidence = class_probs[0].probability
    logger.info("Model inference completed: Predicted '%s' with probability %.4f", top_cat, top_confidence)

    # 4. Final Diagnosis Mapping
    diagnosis_title = f"Possible {top_cat} Issue"
    if top_cat == "Battery / Starting System":
        diagnosis_title = "Possible Weak Battery / Starter Circuit Issue"
    elif top_cat == "Braking System":
        diagnosis_title = "Brake Friction Pad Degradation / Hydraulic Wear"
    elif top_cat == "Engine & Valvetrain":
        diagnosis_title = "Engine Combustion / Valve Clearance Abnormality"
    elif top_cat == "Cooling System":
        diagnosis_title = "Cooling Inefficiency / Thermal Overheating"
    elif top_cat == "Electrical & Sensors":
        diagnosis_title = "Electrical Circuitry / Sensor Malfunction"
    elif top_cat == "Transmission & Clutch":
        diagnosis_title = "Possible Clutch / Transmission Issue"
    elif top_cat == "Fuel System":
        diagnosis_title = "Fuel Delivery / Pressure Inconsistency"
    elif top_cat == "Tyres & Suspension":
        diagnosis_title = "Suspension Damping / Tyre Degradation"

    severity = SEVERITY_MAPPING.get(top_cat, "Moderate")
    recommendation = RECOMMENDATION_MAPPING.get(top_cat, "Inspect vehicle with a certified mechanic.")

    s1 = PipelineStage1(
        name="Preprocessing",
        normalized_text=combined,
        tokens=tokens,
        token_count=len(tokens)
    )
    s2 = PipelineStage2(
        name="Feature Vector",
        method="TF-IDF",
        vocabulary_size=vocab_size,
        non_zero_features=len(nonzero_indices),
        top_features=top_features[:8]
    )
    s3 = PipelineStage3(
        name="Model Prediction",
        model="Random Forest Classifier",
        prediction=top_cat,
        probability=round(float(top_confidence), 4),
        class_probabilities=class_probs,
        probabilities=class_probs
    )
    s4 = PipelineStage4(
        name="Final Diagnosis",
        diagnosis=diagnosis_title,
        confidence=round(float(top_confidence), 4),
        severity=severity,
        recommendation=recommendation
    )

    print(f"[AutoSenseML] ML PIPELINE STAGE 3: {s3.model_dump(by_alias=True)}")
    print(f"[AutoSenseML] ML PIPELINE STAGE 4: {s4.model_dump()}")

    return PipelineResponse(
        success=True,
        input={"symptom": symptom, "vehicle_context": req.vehicle_context or ""},
        stage1=s1,
        stage2=s2,
        stage3=s3,
        stage4=s4,
        model=PipelineModelSummary(
            name="AutoSense Fault Classifier",
            version="1.0",
            type="TF-IDF + Random Forest Classifier (150 Estimators)",
            feature_count=vocab_size,
            classes_count=len(classes),
            classes=classes
        )
    )

class LegacyLabPredictRequest(BaseModel):
    text: Optional[str] = None
    symptom: Optional[str] = None
    vehicle_context: Optional[str] = ""

@router.post("/model-lab/predict")
async def model_lab_step_by_step(req: LegacyLabPredictRequest):
    """
    Backward-compatible route for pipeline inspection.
    """
    symptom_text = req.symptom or req.text or ""
    return await run_ml_pipeline(PipelineRequest(symptom=symptom_text, vehicle_context=req.vehicle_context))

@router.post("/diagnosis", response_model=DiagnosisResponse)
async def perform_diagnosis(
    symptoms: Optional[str] = Form(None),
    vehicle_context: Optional[str] = Form(None),
    audio: Optional[UploadFile] = File(None),
    image: Optional[UploadFile] = File(None)
):
    """
    Multimodal Vehicle Fault Diagnosis Endpoint (Late Decision Fusion).

    Accepts any combination of text symptom description, engine acoustic audio recording (.wav/.webm),
    and component diagnostic images (.jpg/.png).

    Late Fusion Methodology:
    - Text Stream: TF-IDF feature extraction + Random Forest inference (weight ~0.40).
    - Audio Stream: Acoustic feature extraction (MFCCs, spectral centroid, RMS energy) (weight ~0.35).
    - Visual Stream: Color thresholding, Canny edge density, and component texture analysis (weight ~0.25).
    - The late fusion engine dynamically normalizes weights based on provided modalities,
      aggregates class likelihoods, checks confidence thresholds, and computes comprehensive evidence.

    Returns:
        DiagnosisResponse with primary fault, confidence, reasoning, evidence, and cost estimate.
    """
    audio_bytes = None
    if audio:
        try:
            audio_bytes = await audio.read()
        except Exception as e:
            logger.error("Error reading audio upload: %s", e)

    image_bytes = None
    if image:
        try:
            image_bytes = await image.read()
        except Exception as e:
            logger.error("Error reading image upload: %s", e)

    if not symptoms and not audio_bytes and not image_bytes:
        raise HTTPException(
            status_code=400,
            detail="At least one diagnostic input (symptoms text, audio recording, or image) is required."
        )

    try:
        response = diagnosis_service.diagnose(
            symptoms=symptoms,
            vehicle_context=vehicle_context,
            audio_bytes=audio_bytes,
            image_bytes=image_bytes
        )
        return response
    except Exception as e:
        logger.error("Diagnostic pipeline error: %s", e)
        raise HTTPException(status_code=500, detail=f"Diagnostic pipeline error: {str(e)}")

@router.post("/diagnosis-json", response_model=DiagnosisResponse)
async def perform_diagnosis_json(req: JsonDiagnosisRequest):
    if not req.symptoms or not req.symptoms.strip():
        raise HTTPException(status_code=400, detail="Symptom text is required.")

    return diagnosis_service.diagnose(
        symptoms=req.symptoms,
        vehicle_context=req.vehicle_context
    )

@router.get("/model-info", response_model=ModelInfo)
async def get_model_info():
    return diagnosis_service.get_model_info()

@router.get("/model-evaluation", response_model=ModelEvaluationMetrics)
async def get_model_evaluation():
    eval_file = os.path.join(
        os.path.dirname(os.path.dirname(__file__)),
        "saved_models",
        "model_evaluation.json"
    )
    if not os.path.exists(eval_file):
        raise HTTPException(status_code=404, detail="Model evaluation file not found. Run evaluate_models.py first.")

    with open(eval_file, "r") as f:
        data = json.load(f)
    return data
