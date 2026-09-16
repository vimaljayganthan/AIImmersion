import os
import joblib
import numpy as np
import pandas as pd
from typing import Dict, Tuple, List, Any, Optional
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.ensemble import RandomForestClassifier

DEFAULT_MODEL_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "saved_models")

# Standardized fault taxonomy across the DriveIQ ecosystem (8 distinct mechanical categories)
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

class TextFaultClassifier:
    """
    Natural Language Vehicle Diagnostic Fault Classifier.

    AIML Pipeline Architecture:
    1. Text Preprocessing: Ingests unstructured driver symptom descriptions enriched with
       optional vehicle context (noise characteristics, starting behavior, dashboard warning indicators).
    2. Tokenization & N-Gram Feature Extraction: Generates unigrams and bigrams (1, 2)
       to capture multi-word diagnostic phrases (e.g., 'clicking sound', 'black smoke', 'loss of power').
    3. TF-IDF Representation: Applies sublinear term-frequency scaling and English stop-word filtering
       to down-weight non-informative words and highlight domain-specific diagnostic terms.
    4. Random Forest Classification: Employs an ensemble of 120 randomized decision trees
       with balanced class weighting to handle class imbalances across the 8 mechanical fault categories.
    5. Diagnostic Inference & Signal Highlighting: Computes calibrated posterior class probabilities
       and extracts the top influential TF-IDF feature tokens matching the input text.
    """
    def __init__(self, model_dir: str = DEFAULT_MODEL_DIR):
        self.model_dir = model_dir
        self.vectorizer_path = os.path.join(model_dir, "tfidf_vectorizer.joblib")
        self.model_path = os.path.join(model_dir, "text_rf_model.joblib")
        self.vectorizer: Optional[TfidfVectorizer] = None
        self.model: Optional[RandomForestClassifier] = None
        self.classes_: List[str] = CATEGORIES
        self.feature_names_: List[str] = []

    def is_trained(self) -> bool:
        """Verifies whether serialized model artifacts exist on disk."""
        return os.path.exists(self.vectorizer_path) and os.path.exists(self.model_path)

    def load(self) -> bool:
        """
        Loads the pre-trained TF-IDF Vectorizer and Random Forest model from disk into memory.
        Returns True if loaded successfully, False otherwise.
        """
        try:
            if self.is_trained():
                self.vectorizer = joblib.load(self.vectorizer_path)
                self.model = joblib.load(self.model_path)
                self.classes_ = list(self.model.classes_)
                self.feature_names_ = list(self.vectorizer.get_feature_names_out())
                return True
        except Exception as e:
            print(f"[TextModel] Error loading saved model: {e}")
        return False

    def train(self, df: pd.DataFrame) -> Dict[str, Any]:
        """
        Trains the TF-IDF Vectorizer + Random Forest Classifier on structured vehicle text data.

        Pipeline Steps:
        - Enriches raw symptom text with structured metadata (noise_type, starting_behavior, warning_light, vehicle_type).
        - Fits TfidfVectorizer with unigram and bigram ranges (1, 2) and max_features=600.
        - Trains a Random Forest Classifier with 150 estimators and balanced class weights.
        - Persists artifacts (tfidf_vectorizer.joblib, text_rf_model.joblib) to the model directory.

        Args:
            df: Pandas DataFrame containing columns 'symptom_text', 'fault_category', and optional context fields.

        Returns:
            Dictionary summarizing training metrics (sample count, vocabulary size, class count).
        """
        os.makedirs(self.model_dir, exist_ok=True)
        
        # Build enriched text representation combining raw symptoms and meaningful vehicle signals
        enriched_texts = []
        for _, row in df.iterrows():
            parts = [str(row.get("symptom_text", ""))]
            noise = str(row.get("noise_type", "")).strip()
            if noise and noise.lower() != "none":
                parts.append(noise)
            warning = str(row.get("warning_light", "")).strip()
            if warning and warning.lower() != "none":
                parts.append(warning)
            starting = str(row.get("starting_behavior", "")).strip()
            if starting and starting.lower() not in ["none", "normal"]:
                parts.append(starting)
            vehicle = str(row.get("vehicle_type", "")).strip()
            if vehicle and vehicle.lower() != "none":
                parts.append(vehicle)
            enriched_texts.append(" ".join(filter(None, parts)))

        y = df["fault_category"].values

        # 1. Feature Extraction: N-gram (1,2) TF-IDF Vectorizer with sublinear TF scaling
        self.vectorizer = TfidfVectorizer(
            ngram_range=(1, 2),
            max_features=600,
            sublinear_tf=True,
            stop_words="english"
        )
        X = self.vectorizer.fit_transform(enriched_texts)

        # 2. Classifier: Random Forest with 150 estimators and balanced class weights
        self.model = RandomForestClassifier(
            n_estimators=150,
            max_depth=None,
            random_state=42,
            class_weight="balanced"
        )
        self.model.fit(X, y)
        self.classes_ = list(self.model.classes_)
        self.feature_names_ = list(self.vectorizer.get_feature_names_out())

        # 3. Serialize trained model artifacts
        joblib.dump(self.vectorizer, self.vectorizer_path)
        joblib.dump(self.model, self.model_path)

        return {
            "samples_trained": len(df),
            "feature_count": len(self.feature_names_),
            "classes": self.classes_
        }

    def predict_proba(self, text: str, vehicle_context: str = "") -> Tuple[Dict[str, float], List[str]]:
        """
        Performs genuine Random Forest inference on symptom text.

        Args:
            text: Raw driver symptom description (e.g., 'Starter clicking rapidly when pushing ignition button').
            vehicle_context: Optional vehicle model or state details (e.g., 'Yamaha R15 150cc Petrol 24000km').

        Returns:
            - Dict mapping each fault category to its calculated probability [0.0 - 1.0].
            - List of diagnostic token evidence strings explaining which keywords contributed to the inference.
        """
        if not self.model or not self.vectorizer:
            if not self.load():
                raise RuntimeError("TextFaultClassifier is not trained or loaded. Run training script first.")

        combined_text = f"{text} {vehicle_context}".strip().lower()
        vec = self.vectorizer.transform([combined_text])
        probabilities = self.model.predict_proba(vec)[0]

        prob_dict = {cat: float(prob) for cat, prob in zip(self.classes_, probabilities)}

        # Find significant extracted TF-IDF tokens from the input
        feature_array = np.array(self.feature_names_)
        vec_array = vec.toarray().flatten()
        tfidf_sorting = np.argsort(vec_array)[::-1]
        top_indices = tfidf_sorting[:6]
        top_weights = vec_array[top_indices]
        top_features = feature_array[top_indices]
        
        extracted_evidence = [
            f"Key diagnostic signal identified: '{feat}' (TF-IDF weight: {weight:.2f})"
            for feat, weight in zip(top_features, top_weights)
            if weight > 0.05
        ]

        return prob_dict, extracted_evidence
