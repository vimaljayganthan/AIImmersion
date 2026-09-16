from typing import Dict, List, Tuple, Optional, Any
from ..schemas.diagnosis import ModalityFlags, ModalityWeight, DiagnosticEvidence

CATEGORIES = [
    "Battery / Starting System",
    "Braking System",
    "Engine & Valvetrain",
    "Cooling System",
    "Electrical & Sensors",
    "Transmission & Clutch",
    "Fuel System",
    "Tyres & Suspension"
]

# Baseline modality importance prior: Text NLP (0.40) > Acoustic Analysis (0.35) > Visual Inspection (0.25)
BASE_WEIGHTS = {
    "text": 0.40,
    "audio": 0.35,
    "image": 0.25
}

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

REPAIR_COST_ESTIMATES = {
    "Battery / Starting System": "₹1,200 – ₹3,800",
    "Braking System": "₹800 – ₹2,500",
    "Engine & Valvetrain": "₹3,500 – ₹12,000",
    "Cooling System": "₹1,500 – ₹4,500",
    "Electrical & Sensors": "₹600 – ₹2,200",
    "Transmission & Clutch": "₹2,000 – ₹6,500",
    "Fuel System": "₹1,000 – ₹4,000",
    "Tyres & Suspension": "₹1,200 – ₹5,000"
}

RECOMMENDATIONS = {
    "Battery / Starting System": [
        "Measure terminal resting voltage (should be > 12.4V) and load test the battery.",
        "Inspect battery cable terminals for lead sulfate corrosion and tighten clamps.",
        "Test starter solenoid continuity and ignition starter relay."
    ],
    "Braking System": [
        "Inspect brake pad friction lining thickness (replace if < 3mm).",
        "Check brake fluid level in master reservoir and test moisture contamination.",
        "Check disc rotors for lateral runout, heat glazing, or deep friction grooves."
    ],
    "Engine & Valvetrain": [
        "Perform cylinder compression test and check spark plug firing gaps / fouling.",
        "Inspect valve tappet clearances according to OEM service manual specifications.",
        "Inspect engine oil level, viscosity, and check for metal shavings on dipstick."
    ],
    "Cooling System": [
        "Perform cooling system pressure test to locate coolant leaks in hoses and radiator core.",
        "Verify radiator electric fan activation at operating temperature threshold (95°C+).",
        "Inspect water pump pulley shaft for bearing play or coolant weeping."
    ],
    "Electrical & Sensors": [
        "Connect OBD-II diagnostic scanner to read active and pending DTC fault codes.",
        "Test alternator DC voltage output under load (should deliver 13.8V – 14.4V).",
        "Inspect vehicle grounding strap cables and main fuse box connections."
    ],
    "Transmission & Clutch": [
        "Check clutch cable free play adjustment or hydraulic clutch slave cylinder pressure.",
        "Inspect gearbox transmission fluid level, color, and burnt friction smell.",
        "Examine drive chain tension and sprocket tooth wear (motorcycle) or clutch plate slip."
    ],
    "Fuel System": [
        "Check fuel rail operating pressure with a mechanical gauge.",
        "Inspect fuel injector spray atomization pattern and clean injector nozzles.",
        "Replace inline fuel filter and verify fuel tank breather valve isn't vapor-locked."
    ],
    "Tyres & Suspension": [
        "Check cold tyre inflation pressures and inspect tread depth across all grooves.",
        "Inspect front fork seals / shock absorber dampers for hydraulic fluid leakage.",
        "Check steering head stem bearings and front wheel hub bearings for excessive play."
    ]
}

SAFETY_WARNINGS = {
    "Braking System": "CRITICAL SAFETY RISK: Compromised braking performance significantly increases stopping distance. Do not drive at high speeds. Immediate workshop inspection required.",
    "Fuel System": "FIRE / SAFETY HAZARD: Leaking fuel or pressurized fuel system faults pose an immediate ignition hazard. Avoid open flames and have the vehicle towed if fuel is visibly dripping.",
    "Cooling System": "OVERHEATING RISK: Continued operation with an active cooling fault can warp cylinder heads or cause catastrophic engine seizure. Shut down engine if temperature gauge enters red zone.",
    "Engine & Valvetrain": "MECHANICAL RISK: Internal engine knocking or severe misfire may cause piston or valve damage. Seek mechanical diagnosis promptly."
}

class MultimodalFusionEngine:
    """
    Late Multimodal Decision Fusion Engine for DriveIQ Fault Diagnostics.

    Fusion Algorithm:
    1. Modality Detection: Identifies active modalities from provided unimodal probabilities (text, audio, image).
    2. Dynamic Re-normalization: Re-calculates normalized weights W_m = W_m_base / sum(W_active)
       ensuring total active weight strictly sums to 1.0.
    3. Weighted Convex Combination: Fused Probability P_fused(c) = sum(W_m * P_m(c)) across all categories c.
    4. Consensus Boosting: When 2+ independent modalities identify the same top candidate category,
       a confidence bonus is applied (up to 0.95 cap) to reflect multimodal cross-validation agreement.
    5. Actionable Mechanical Synthesis: Automatically maps predicted primary category to severity grade,
       estimated repair cost band (INR), OEM diagnostic recommendations, and safety alerts.
    """
    @staticmethod
    def fuse(
        text_probs: Optional[Dict[str, float]],
        text_evidence: Optional[List[str]],
        audio_probs: Optional[Dict[str, float]],
        audio_evidence: Optional[List[str]],
        image_probs: Optional[Dict[str, float]],
        image_evidence: Optional[List[str]],
        vehicle_context: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        flags = ModalityFlags(
            text=bool(text_probs),
            audio=bool(audio_probs),
            image=bool(image_probs)
        )

        active_modalities = []
        if flags.text: active_modalities.append("text")
        if flags.audio: active_modalities.append("audio")
        if flags.image: active_modalities.append("image")

        if not active_modalities:
            raise ValueError("At least one modality (text, audio, or image) must be provided.")

        # Calculate dynamic normalized weights
        total_active_weight = sum(BASE_WEIGHTS[m] for m in active_modalities)
        normalized_weights = {m: BASE_WEIGHTS[m] / total_active_weight for m in active_modalities}

        fused_probs: Dict[str, float] = {cat: 0.0 for cat in CATEGORIES}
        modality_breakdown: List[ModalityWeight] = []
        all_evidence: List[DiagnosticEvidence] = []
        reasoning_bullets: List[str] = []

        # 1. Process Text
        if flags.text and text_probs:
            top_text_cat = max(text_probs.items(), key=lambda x: x[1])[0]
            top_text_prob = text_probs[top_text_cat]
            w = normalized_weights["text"]
            
            for cat, p in text_probs.items():
                fused_probs[cat] += w * p
            
            modality_breakdown.append(ModalityWeight(
                modality="Text Symptoms (NLP)",
                weight=round(w, 3),
                raw_confidence=round(top_text_prob, 3),
                predicted_category=top_text_cat
            ))
            
            if text_evidence:
                for ev in text_evidence:
                    all_evidence.append(DiagnosticEvidence(
                        category=top_text_cat,
                        modality="Text",
                        observation=ev,
                        confidence_contribution=round(top_text_prob * w, 3),
                        technical_detail="TF-IDF N-gram feature representation matched in trained Random Forest"
                    ))
                    reasoning_bullets.append(f"Symptom text analysis: {ev}")

        # 2. Process Audio
        if flags.audio and audio_probs:
            top_audio_cat = max(audio_probs.items(), key=lambda x: x[1])[0]
            top_audio_prob = audio_probs[top_audio_cat]
            w = normalized_weights["audio"]

            for cat, p in audio_probs.items():
                fused_probs[cat] += w * p

            modality_breakdown.append(ModalityWeight(
                modality="Acoustic Analysis (librosa)",
                weight=round(w, 3),
                raw_confidence=round(top_audio_prob, 3),
                predicted_category=top_audio_cat
            ))

            if audio_evidence:
                for ev in audio_evidence:
                    all_evidence.append(DiagnosticEvidence(
                        category=top_audio_cat,
                        modality="Audio",
                        observation=ev,
                        confidence_contribution=round(top_audio_prob * w, 3),
                        technical_detail="Librosa feature extraction (MFCCs, Spectral Centroid, ZCR)"
                    ))
                    reasoning_bullets.append(ev)

        # 3. Process Image
        if flags.image and image_probs:
            top_image_cat = max(image_probs.items(), key=lambda x: x[1])[0]
            top_image_prob = image_probs[top_image_cat]
            w = normalized_weights["image"]

            for cat, p in image_probs.items():
                fused_probs[cat] += w * p

            modality_breakdown.append(ModalityWeight(
                modality="Computer Vision (OpenCV)",
                weight=round(w, 3),
                raw_confidence=round(top_image_prob, 3),
                predicted_category=top_image_cat
            ))

            if image_evidence:
                for ev in image_evidence:
                    all_evidence.append(DiagnosticEvidence(
                        category=top_image_cat,
                        modality="Image",
                        observation=ev,
                        confidence_contribution=round(top_image_prob * w, 3),
                        technical_detail="OpenCV HSV color clustering and Canny edge gradient analysis"
                    ))
                    reasoning_bullets.append(ev)

        # Normalize fused probabilities
        fused_total = sum(fused_probs.values())
        if fused_total > 0:
            norm_fused = {k: round(v / fused_total, 4) for k, v in fused_probs.items()}
        else:
            norm_fused = {k: round(1.0 / len(CATEGORIES), 4) for k in CATEGORIES}

        # Select primary category
        primary_category = max(norm_fused.items(), key=lambda x: x[1])[0]
        primary_confidence = norm_fused[primary_category]

        # Multimodal consensus bonus / penalty:
        # If multiple modalities agree on the same category, slight boost to confidence
        agreeing_modalities = sum(1 for m in modality_breakdown if m.predicted_category == primary_category)
        if len(active_modalities) > 1 and agreeing_modalities > 1:
            primary_confidence = min(0.95, primary_confidence * 1.08)
            reasoning_bullets.append(f"Multimodal Consensus: High correlation across {agreeing_modalities} distinct input modalities confirming {primary_category}.")

        # Determine Diagnosis title
        diagnosis_title = f"Possible {primary_category} Fault"
        if primary_category == "Battery / Starting System":
            diagnosis_title = "Possible Weak Battery / Starter Circuit Issue"
        elif primary_category == "Braking System":
            diagnosis_title = "Brake Friction Lining Wear / Hydraulic Degradation"
        elif primary_category == "Engine & Valvetrain":
            diagnosis_title = "Engine Combustion / Valve Clearance Abnormality"
        elif primary_category == "Cooling System":
            diagnosis_title = "Cooling System Inefficiency / Thermal Overheating"
        elif primary_category == "Electrical & Sensors":
            diagnosis_title = "Electrical Circuitry / Sensor Malfunction"
        elif primary_category == "Transmission & Clutch":
            diagnosis_title = "Transmission Slip / Clutch Wear"
        elif primary_category == "Fuel System":
            diagnosis_title = "Fuel Delivery / Pressure Inconsistency"
        elif primary_category == "Tyres & Suspension":
            diagnosis_title = "Suspension Damping / Tyre Tread Degradation"

        severity = SEVERITY_MAPPING.get(primary_category, "Moderate")
        cost_range = REPAIR_COST_ESTIMATES.get(primary_category, "₹1,000 – ₹4,000")
        recommendations = RECOMMENDATIONS.get(primary_category, ["Inspect vehicle with a certified mechanic."])
        safety_warning = SAFETY_WARNINGS.get(primary_category)

        return {
            "diagnosis": diagnosis_title,
            "primary_category": primary_category,
            "confidence": round(primary_confidence, 2),
            "severity": severity,
            "reasoning": reasoning_bullets,
            "evidence": all_evidence,
            "recommendation": recommendations,
            "safety_warning": safety_warning,
            "estimated_cost_range": cost_range,
            "modalities": flags,
            "modality_breakdown": modality_breakdown,
            "category_probabilities": norm_fused
        }
