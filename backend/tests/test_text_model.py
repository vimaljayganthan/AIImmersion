import os
import pytest
import pandas as pd
from app.models.text_model import TextFaultClassifier, CATEGORIES

def test_categories_constant():
    """Verify that all 8 standardized mechanical fault categories are defined."""
    assert len(CATEGORIES) == 8
    assert "Battery / Starting System" in CATEGORIES
    assert "Braking System" in CATEGORIES
    assert "Engine & Valvetrain" in CATEGORIES
    assert "Cooling System" in CATEGORIES
    assert "Electrical & Sensors" in CATEGORIES
    assert "Transmission & Clutch" in CATEGORIES
    assert "Fuel System" in CATEGORIES
    assert "Tyres & Suspension" in CATEGORIES


def test_text_model_training_and_loading(tmp_path):
    """Test full training pipeline and disk serialization on a clean dataset."""
    sample_data = {
        "symptom_text": [
            "starter clicks rapidly when pressing ignition button",
            "loud screeching and squealing from front brake pads",
            "ticking sound from cylinder head and valve clearance",
            "engine coolant boiling and overheating in traffic",
            "fuse blowing and dashboard lights flickering",
            "clutch slipping rpm rising without acceleration",
            "fuel injector clogged and strong petrol smell",
            "front tyre wobbling and fork suspension leaking oil",
        ],
        "fault_category": CATEGORIES,
        "noise_type": ["clicking", "squeal", "ticking", "hissing", "humming", "slipping", "sputter", "wobble"],
        "starting_behavior": ["clicking", "normal", "normal", "normal", "normal", "normal", "hard_start", "normal"],
        "warning_light": ["battery", "brake", "engine", "temp", "abs", "none", "fuel", "none"],
        "vehicle_type": ["Bike"] * 8
    }
    df = pd.DataFrame(sample_data)

    model_dir = str(tmp_path / "saved_models")
    clf = TextFaultClassifier(model_dir=model_dir)

    assert not clf.is_trained()
    results = clf.train(df)

    assert clf.is_trained()
    assert results["samples_trained"] == 8
    assert results["feature_count"] > 0
    assert len(results["classes"]) == 8

    # Load from saved artifacts
    clf2 = TextFaultClassifier(model_dir=model_dir)
    assert clf2.load() is True
    assert sorted(clf2.classes_) == sorted(CATEGORIES)


@pytest.mark.parametrize("symptom,expected_top_category", [
    ("Starter motor clicking rapidly when pushing ignition switch battery dead", "Battery / Starting System"),
    ("High pitched squealing screeching noise whenever front brake lever is pulled brake pads worn", "Braking System"),
    ("Engine valve clearance out of spec loud ticking noise from cylinder head valves", "Engine & Valvetrain"),
    ("Radiator fan is not spinning and coolant temperature warning light glows red in traffic", "Cooling System"),
    ("Headlights flicker intermittently power windows roll up slowly alternator voltage drops", "Electrical & Sensors"),
    ("Clutch slipping RPM shoots high when twisting throttle but bike does not accelerate", "Transmission & Clutch"),
    ("Fuel injector clogged and strong smell of raw petrol fuel leaking from injector rail", "Fuel System"),
    ("Front wheel wobbling shaking violently uneven tire tread wear and fork oil seal leaking", "Tyres & Suspension"),
])
def test_text_model_real_inference(loaded_text_classifier, symptom, expected_top_category):
    """Verify authentic ML predictions across all 8 mechanical fault categories."""
    probs, evidence = loaded_text_classifier.predict_proba(symptom, "Yamaha R15")

    assert isinstance(probs, dict)
    assert len(probs) == 8
    total_prob = sum(probs.values())
    assert 0.99 <= total_prob <= 1.01

    # Check that highest probability category matches expected domain class
    top_cat = max(probs.items(), key=lambda x: x[1])[0]
    assert top_cat == expected_top_category
    assert probs[top_cat] > 0.15


def test_text_model_edge_case_empty_string(loaded_text_classifier):
    """Verify inference handling when empty string is passed."""
    probs, evidence = loaded_text_classifier.predict_proba("", "")
    assert isinstance(probs, dict)
    assert len(probs) == 8
    total_prob = sum(probs.values())
    assert 0.99 <= total_prob <= 1.01
    assert evidence == []


def test_text_model_edge_case_unknown_vocabulary(loaded_text_classifier):
    """Verify inference handling when out-of-vocabulary gibberish is passed."""
    probs, evidence = loaded_text_classifier.predict_proba("zyxwvutsrqponmlkjihgfedcba flarp glorp", "UnknownMake")
    assert isinstance(probs, dict)
    assert len(probs) == 8
    total_prob = sum(probs.values())
    assert 0.99 <= total_prob <= 1.01
    assert evidence == []


def test_text_model_edge_case_special_characters_and_numbers(loaded_text_classifier):
    """Verify inference handling with numbers and punctuation only."""
    probs, evidence = loaded_text_classifier.predict_proba("1234567890 !@#$%^&*()_+=-~`", "")
    assert isinstance(probs, dict)
    assert len(probs) == 8
    total_prob = sum(probs.values())
    assert 0.99 <= total_prob <= 1.01


def test_text_model_edge_case_very_long_text(loaded_text_classifier):
    """Verify inference handling with very long text payload (>5,000 characters)."""
    long_text = "The engine is making a loud clicking and knocking sound " * 100
    probs, evidence = loaded_text_classifier.predict_proba(long_text, "Hero Splendor")
    assert isinstance(probs, dict)
    assert len(probs) == 8
    total_prob = sum(probs.values())
    assert 0.99 <= total_prob <= 1.01
    assert len(evidence) > 0


def test_text_model_unloaded_error(tmp_path):
    """Verify that calling predict_proba without a trained/saved model raises RuntimeError."""
    empty_dir = str(tmp_path / "empty_models")
    clf = TextFaultClassifier(model_dir=empty_dir)
    with pytest.raises(RuntimeError) as exc_info:
        clf.predict_proba("Starter motor broken")
    assert "TextFaultClassifier is not trained or loaded" in str(exc_info.value)
