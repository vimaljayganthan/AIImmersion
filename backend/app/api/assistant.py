import logging
from typing import Optional, List, Dict, Any
from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, Field

from ..services.diagnosis_service import diagnosis_service

logger = logging.getLogger("AutoSenseAssistant")

router = APIRouter(prefix="/api/assistant", tags=["AI Assistant"])

class ChatMessagePayload(BaseModel):
    message: str = Field(..., min_length=1, description="User chat message")
    vehicle_context: Optional[Any] = Field("", description="Vehicle context string or object")
    session_id: Optional[str] = Field("", description="Conversation session ID")
    conditions: Optional[List[str]] = Field(default_factory=list, description="Accumulated symptoms and conditions")

class AssistantAction(BaseModel):
    label: str
    type: str
    payload: Optional[str] = None

class ChatResponse(BaseModel):
    type: str  # "text" | "question" | "diagnosis" | "safety_warning" | "maintenance" | "booking"
    message: str
    options: Optional[List[str]] = None
    suggested_actions: Optional[List[AssistantAction]] = None
    diagnosis: Optional[Dict[str, Any]] = None

@router.post("/chat", response_model=ChatResponse)
async def assistant_chat(payload: ChatMessagePayload):
    """
    Contextual Vehicle AI Assistant Endpoint.
    Classifies intent, evaluates multi-turn symptom state, checks safety heuristics,
    and integrates directly with the ML Fault Classifier.
    """
    raw = payload.message.strip()
    q = raw.lower()

    if not raw:
        raise HTTPException(status_code=400, detail="Message cannot be empty.")

    logger.info("Assistant chat query: '%s'", raw[:80])

    # 1. Critical Safety Heuristics
    safety_triggers = ["smoke", "fire", "burning", "brakes failed", "brake failure", "fuel leak", "petrol leak", "steering locked"]
    if any(k in q for k in safety_triggers):
        return ChatResponse(
            type="safety_warning",
            message=(
                "CRITICAL SAFETY WARNING: Your description indicates a critical vehicle condition (smoke, fire hazard, or loss of braking/fuel control).\n\n"
                "• Safely bring the vehicle to an immediate halt and turn off the ignition.\n"
                "• Do not attempt to continue operating the vehicle.\n"
                "• Contact certified roadside assistance or a verified workshop immediately."
            ),
            suggested_actions=[
                AssistantAction(label="Find Verified Mechanic", type="mechanic"),
                AssistantAction(label="Run Full AI Diagnosis", type="diagnosis")
            ]
        )

    # 2. Greetings
    if q in ["hi", "hello", "hey", "good morning", "good evening", "namaste"]:
        return ChatResponse(
            type="text",
            message=f"Hello! I am AutoSense AI, your vehicle diagnostic assistant. What symptom, noise, or warning indicator are you noticing with your vehicle?",
            suggested_actions=[
                AssistantAction(label="Clicking sound when starting", type="input", payload="Clicking sound when starting the bike"),
                AssistantAction(label="Engine is overheating", type="input", payload="Engine is overheating and boiling coolant"),
                AssistantAction(label="Brake squealing sound", type="input", payload="High pitched squealing sound from front brakes"),
                AssistantAction(label="Clutch slipping", type="input", payload="Clutch slipping RPM shoots high without acceleration")
            ]
        )

    # 3. Gratitude
    if any(t in q for t in ["thanks", "thank you", "ok thanks", "got it"]):
        return ChatResponse(
            type="text",
            message="You are very welcome! If any other symptoms arise or you'd like a full service inspection, let me know. Safe driving!",
            suggested_actions=[
                AssistantAction(label="Start New Diagnosis", type="input", payload="I am noticing a new problem")
            ]
        )

    # 4. Maintenance Questions
    if "service" in q and any(k in q for k in ["often", "when", "schedule", "interval", "oil"]):
        return ChatResponse(
            type="maintenance",
            message=(
                "AutoSense Recommended Service Schedule:\n\n"
                "• Engine Oil & Filter: Inspect every 1,500 km; replace every 3,000–5,000 km.\n"
                "• Brake Pads & Fluid: Inspect pad wear (>2.5mm); flush DOT-4 fluid every 2 years.\n"
                "• Drive Chain / Transmission: Clean & lube every 500 km; adjust clutch free-play.\n"
                "• Spark Plug & Air Filter: Clean filter every 4,000 km; replace plug every 12,000 km."
            ),
            suggested_actions=[
                AssistantAction(label="Schedule Preventative Service", type="mechanic"),
                AssistantAction(label="Diagnose Specific Symptom", type="input", payload="My vehicle has a specific problem")
            ]
        )

    # 5. Diagnostic ML Inference
    combined = " ".join([raw] + (payload.conditions or []))
    clf = diagnosis_service.text_classifier
    if not clf.model or not clf.vectorizer:
        clf.load()

    if clf.model and clf.vectorizer:
        vec = clf.vectorizer.transform([combined.lower()])
        probs = clf.model.predict_proba(vec)[0]
        classes = list(clf.model.classes_)
        sorted_pairs = sorted(zip(classes, probs), key=lambda x: x[1], reverse=True)
        top_cat, top_p = sorted_pairs[0]

        return ChatResponse(
            type="diagnosis",
            message=(
                f"Based on your symptoms, the leading candidate fault is **{top_cat}** "
                f"({int(top_p * 100)}% model probability).\n\n"
                f"Recommended Next Step: Inspect component state and verify electrical/mechanical tolerances."
            ),
            diagnosis={
                "category": top_cat,
                "confidence": round(float(top_p), 4),
                "top_classes": [{"category": c, "probability": round(float(p), 4)} for c, p in sorted_pairs[:4]]
            },
            suggested_actions=[
                AssistantAction(label="View Full ML Inspector", type="diagnosis"),
                AssistantAction(label="Book Verified Mechanic", type="mechanic")
            ]
        )

    return ChatResponse(
        type="text",
        message=f"I have noted your description: '{raw}'. Describe what happens when you operate the vehicle to help narrow down the cause.",
        suggested_actions=[
            AssistantAction(label="Start Full Diagnosis", type="diagnosis")
        ]
    )
