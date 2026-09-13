#!/usr/bin/env python3
import os
import sys
import pandas as pd

# Add backend directory to sys.path
backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, backend_dir)

from app.models.text_model import TextFaultClassifier

def main():
    print("==================================================")
    print("AUTOSENSE AI — TEXT MODEL TRAINING PIPELINE")
    print("==================================================")
    
    dataset_path = os.path.join(backend_dir, "app", "data", "vehicle_faults_dataset.csv")
    if not os.path.exists(dataset_path):
        print(f"Error: Dataset not found at {dataset_path}")
        sys.exit(1)
        
    df = pd.read_csv(dataset_path)
    print(f"Loaded dataset: {len(df)} records across {df['fault_category'].nunique()} fault categories.")
    print("Class distribution:")
    for cat, count in df["fault_category"].value_counts().items():
        print(f"  - {cat}: {count} samples")

    print("\nTraining TF-IDF Vectorizer + Random Forest Classifier...")
    model_dir = os.path.join(backend_dir, "app", "saved_models")
    classifier = TextFaultClassifier(model_dir=model_dir)
    results = classifier.train(df)

    print("\nTraining completed successfully!")
    print(f"Saved artifacts to: {model_dir}")
    print(f"Total vocabulary n-grams: {results['feature_count']}")
    print("==================================================")

if __name__ == "__main__":
    main()
