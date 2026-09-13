import os
import joblib
import numpy as np
import pandas as pd
from typing import Dict, Tuple, List, Any
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.ensemble import RandomForestClassifier

DEFAULT_MODEL_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "saved_models")

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
    def __init__(self, model_dir: str = DEFAULT_MODEL_DIR):
        self.model_dir = model_dir
        self.vectorizer_path = os.path.join(model_dir, "tfidf_vectorizer.joblib")
        self.model_path = os.path.join(model_dir, "text_rf_model.joblib")
        self.vectorizer: Optional[TfidfVectorizer] = None
        self.model: Optional[RandomForestClassifier] = None
        self.classes_: List[str] = CATEGORIES
        self.feature_names_: List[str] = []

    def is_trained(self) -> bool:
        return os.path.exists(self.vectorizer_path) and os.path.exists(self.model_path)

    def load(self) -> bool:
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
        Combines symptom_text with supplementary context (noise_type, starting_behavior, warning_light).
        """
        os.makedirs(self.model_dir, exist_ok=True)
        
        # Build enriched text representation
        enriched_texts = []
        for _, row in df.iterrows():
            text_parts = [
                str(row.get("symptom_text", "")),
                f"noise {row.get('noise_type', '')}" if pd.notna(row.get("noise_type")) else "",
                f"starting {row.get('starting_behavior', '')}" if pd.notna(row.get("starting_behavior")) else "",
                f"warning {row.get('warning_light', '')}" if pd.notna(row.get("warning_light")) else "",
                f"vehicle {row.get('vehicle_type', '')}" if pd.notna(row.get("vehicle_type")) else ""
            ]
            enriched_texts.append(" ".join(filter(None, text_parts)))

        y = df["fault_category"].values

        self.vectorizer = TfidfVectorizer(
            ngram_range=(1, 2),
            max_features=500,
            sublinear_tf=True,
            stop_words="english"
        )
        X = self.vectorizer.fit_transform(enriched_texts)

        self.model = RandomForestClassifier(
            n_estimators=120,
            max_depth=15,
            random_state=42,
            class_weight="balanced"
        )
        self.model.fit(X, y)
        self.classes_ = list(self.model.classes_)
        self.feature_names_ = list(self.vectorizer.get_feature_names_out())

        joblib.dump(self.vectorizer, self.vectorizer_path)
        joblib.dump(self.model, self.model_path)

        return {
            "samples_trained": len(df),
            "feature_count": len(self.feature_names_),
            "classes": self.classes_
        }

    def predict_proba(self, text: str, vehicle_context: str = "") -> Tuple[Dict[str, float], List[str]]:
        """
        Predicts class probabilities from symptom description and context.
        Returns:
            - Dict of {category: probability}
            - List of highlighted top matching diagnostic token features
        """
        if not self.model or not self.vectorizer:
            if not self.load():
                raise RuntimeError("TextFaultClassifier is not trained or loaded.")

        combined_text = f"{text} {vehicle_context}".strip().lower()
        vec = self.vectorizer.transform([combined_text])
        probabilities = self.model.predict_proba(vec)[0]

        prob_dict = {cat: float(prob) for cat, prob in zip(self.classes_, probabilities)}

        # Find significant extracted TF-IDF tokens from the input
        feature_array = np.array(self.feature_names_)
        tfidf_sorting = np.argsort(vec.toarray()).flatten()[::-1]
        top_n = vec.toarray().flatten()[tfidf_sorting][:6]
        top_features = feature_array[tfidf_sorting][:6]
        
        extracted_evidence = [
            f"Key diagnostic signal identified: '{feat}' (TF-IDF weight: {weight:.2f})"
            for feat, weight in zip(top_features, top_n)
            if weight > 0.05
        ]

        return prob_dict, extracted_evidence
