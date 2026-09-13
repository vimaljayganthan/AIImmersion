import os
from typing import Optional, Dict, Any, List
import pandas as pd

from ..models.text_model import TextFaultClassifier
from ..models.audio_model import AudioFaultAnalyzer
from ..models.image_model import ImageFaultAnalyzer
from ..models.fusion import MultimodalFusionEngine
from ..schemas.diagnosis import DiagnosisResponse, ModelInfo

class DiagnosisService:
    def __init__(self):
        self.text_classifier = TextFaultClassifier()
        self.audio_analyzer = AudioFaultAnalyzer()
        self.image_analyzer = ImageFaultAnalyzer()
        self._ensure_models_loaded()

    def _ensure_models_loaded(self):
        if not self.text_classifier.is_trained():
            dataset_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data", "vehicle_faults_dataset.csv")
            if os.path.exists(dataset_path):
                print("[DiagnosisService] Training text classifier on startup dataset...")
                df = pd.read_csv(dataset_path)
                self.text_classifier.train(df)
            else:
                print(f"[DiagnosisService] Warning: Dataset not found at {dataset_path}")
        else:
            self.text_classifier.load()

    def get_model_info(self) -> ModelInfo:
        return ModelInfo(
            name="AutoSense Multimodal Diagnostic Engine",
            version="1.0.0",
            model_type="TF-IDF + Random Forest Classifier (Late Multimodal Fusion)",
            dataset_source="AutoSense Structured Vehicle Fault Dataset (Prototype/Dev)",
            training_samples=80,
            feature_count=len(self.text_classifier.feature_names_) if self.text_classifier.feature_names_ else 250,
            classes_count=len(self.text_classifier.classes_),
            classes=self.text_classifier.classes_
        )

    def diagnose(
        self,
        symptoms: Optional[str] = None,
        vehicle_context: Optional[str] = None,
        audio_bytes: Optional[bytes] = None,
        image_bytes: Optional[bytes] = None
    ) -> DiagnosisResponse:
        text_probs = None
        text_evidence = None
        audio_probs = None
        audio_evidence = None
        image_probs = None
        image_evidence = None

        # 1. Process text if provided
        if symptoms and symptoms.strip():
            text_probs, text_evidence = self.text_classifier.predict_proba(
                symptoms.strip(),
                vehicle_context or ""
            )

        # 2. Process audio if provided
        if audio_bytes and len(audio_bytes) > 100:
            audio_probs, audio_evidence, _ = self.audio_analyzer.predict_proba(audio_bytes)

        # 3. Process image if provided
        if image_bytes and len(image_bytes) > 100:
            image_probs, image_evidence, _ = self.image_analyzer.predict_proba(image_bytes)

        # 4. Multimodal Fusion
        fusion_result = MultimodalFusionEngine.fuse(
            text_probs=text_probs,
            text_evidence=text_evidence,
            audio_probs=audio_probs,
            audio_evidence=audio_evidence,
            image_probs=image_probs,
            image_evidence=image_evidence,
            vehicle_context={"context": vehicle_context}
        )

        model_info = self.get_model_info()

        return DiagnosisResponse(
            diagnosis=fusion_result["diagnosis"],
            primary_category=fusion_result["primary_category"],
            confidence=fusion_result["confidence"],
            severity=fusion_result["severity"],
            reasoning=fusion_result["reasoning"],
            evidence=fusion_result["evidence"],
            recommendation=fusion_result["recommendation"],
            safety_warning=fusion_result["safety_warning"],
            estimated_cost_range=fusion_result["estimated_cost_range"],
            modalities=fusion_result["modalities"],
            modality_breakdown=fusion_result["modality_breakdown"],
            category_probabilities=fusion_result["category_probabilities"],
            model=model_info
        )

diagnosis_service = DiagnosisService()
