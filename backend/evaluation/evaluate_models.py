#!/usr/bin/env python3
import os
import sys
import json
import numpy as np
import pandas as pd
from datetime import datetime
from sklearn.model_selection import StratifiedKFold, cross_val_predict
from sklearn.metrics import classification_report, confusion_matrix, accuracy_score
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.ensemble import RandomForestClassifier

backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, backend_dir)

def main():
    print("==================================================")
    print("AUTOSENSE AI — MODEL EVALUATION & VALIDATION")
    print("==================================================")

    dataset_path = os.path.join(backend_dir, "app", "data", "vehicle_faults_dataset.csv")
    if not os.path.exists(dataset_path):
        print(f"Error: Dataset not found at {dataset_path}")
        sys.exit(1)

    df = pd.read_csv(dataset_path)
    print(f"Evaluating on {len(df)} samples across {df['fault_category'].nunique()} classes.")

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

    vectorizer = TfidfVectorizer(
        ngram_range=(1, 2),
        max_features=600,
        sublinear_tf=True,
        stop_words="english"
    )
    X = vectorizer.fit_transform(enriched_texts)

    rf = RandomForestClassifier(
        n_estimators=150,
        max_depth=None,
        random_state=42,
        class_weight="balanced"
    )

    # 5-fold Stratified Cross-Validation
    cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
    y_pred = cross_val_predict(rf, X, y, cv=cv)

    # Fit once on full dataset to get feature importances
    rf.fit(X, y)
    classes = list(rf.classes_)
    
    # Calculate real metrics
    acc = float(accuracy_score(y, y_pred))
    report = classification_report(y, y_pred, output_dict=True, zero_division=0)
    cm = confusion_matrix(y, y_pred, labels=classes).tolist()

    # Top feature importances
    importances = rf.feature_importances_
    feat_names = vectorizer.get_feature_names_out()
    top_indices = np.argsort(importances)[::-1][:12]
    top_features = [
        {"feature": str(feat_names[i]), "importance": round(float(importances[i]), 4)}
        for i in top_indices
    ]

    per_class_metrics = {}
    for cls_name in classes:
        if cls_name in report:
            per_class_metrics[cls_name] = {
                "precision": round(float(report[cls_name]["precision"]), 3),
                "recall": round(float(report[cls_name]["recall"]), 3),
                "f1_score": round(float(report[cls_name]["f1-score"]), 3),
                "support": int(report[cls_name]["support"])
            }

    distribution = {str(k): int(v) for k, v in df["fault_category"].value_counts().items()}

    evaluation_data = {
        "model_name": "AutoSense TF-IDF + Random Forest Classifier",
        "evaluation_date": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "overall_accuracy": round(acc, 3),
        "macro_precision": round(float(report["macro avg"]["precision"]), 3),
        "macro_recall": round(float(report["macro avg"]["recall"]), 3),
        "macro_f1": round(float(report["macro avg"]["f1-score"]), 3),
        "weighted_f1": round(float(report["weighted avg"]["f1-score"]), 3),
        "classes": classes,
        "confusion_matrix": cm,
        "per_class_metrics": per_class_metrics,
        "feature_importances_top": top_features,
        "dataset_distribution": distribution,
        "is_prototype": False
    }

    output_dir = os.path.join(backend_dir, "app", "saved_models")
    os.makedirs(output_dir, exist_ok=True)
    eval_file = os.path.join(output_dir, "model_evaluation.json")

    with open(eval_file, "w") as f:
        json.dump(evaluation_data, f, indent=2)

    print(f"\nOverall Stratified 5-Fold Accuracy: {acc * 100:.1f}%")
    print(f"Macro F1-Score: {report['macro avg']['f1-score']:.3f}")
    print(f"Weighted F1-Score: {report['weighted avg']['f1-score']:.3f}")
    print(f"\nEvaluation metrics successfully written to: {eval_file}")
    print("==================================================")

if __name__ == "__main__":
    main()
