import pytest
from fastapi.testclient import TestClient

def test_unknown_or_gibberish_symptom_handling(client: TestClient):
    """
    Test that submitting unknown, out-of-vocabulary, or gibberish symptoms
    does not cause an unhandled crash (500) and returns a valid probabilistic prediction.
    """
    gibberish_payload = {
        "symptom": "asdfghjk qwerty zxcvbnm 123456789 unknown_token_xyz",
        "vehicle_context": "Custom Prototype Vehicle"
    }
    response = client.post("/api/ml/pipeline", json=gibberish_payload)
    assert response.status_code == 200
    data = response.json()

    assert data["success"] is True
    assert "stage3" in data
    assert "stage4" in data
    # Model should still produce a valid prediction from prior distributions
    assert data["stage3"]["prediction"] in data["model"]["classes"]
    assert 0.0 <= data["stage3"]["probability"] <= 1.0


def test_special_characters_and_punctuation_normalization(client: TestClient):
    """
    Test that symptoms containing excessive punctuation, emojis, and symbols
    are properly normalized in Stage 1 tokenization.
    """
    payload = {
        "symptom": "***!!! ENGINE CLICKING ???? @@@ BATTERY 100% DEAD ####",
        "vehicle_context": "Hero Splendor"
    }
    response = client.post("/api/ml/pipeline", json=payload)
    assert response.status_code == 200
    data = response.json()

    tokens = data["stage1"]["tokens"]
    assert isinstance(tokens, list)
    # Punctuation should be stripped
    for t in tokens:
        assert t.isalpha()
    assert data["stage3"]["prediction"] == "Battery / Starting System"


def test_extreme_input_length_handling(client: TestClient):
    """
    Test handling of large symptom descriptions (1,000+ words).
    """
    long_symptom = "Brake pedal feels extremely spongy and travels all the way to floorboard. " * 50
    response = client.post("/api/ml/pipeline", json={"symptom": long_symptom, "vehicle_context": "Toyota Innova"})
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["stage3"]["prediction"] == "Braking System"


def test_probability_distribution_integrity(client: TestClient):
    """
    Verify that class probabilities returned by the ML pipeline sum up to ~1.0
    and that all probability values lie strictly between 0 and 1.
    """
    payload = {
        "symptom": "White smoke billowing from exhaust tailpipe with sweet burnt coolant smell",
        "vehicle_context": "Honda City"
    }
    response = client.post("/api/ml/pipeline", json=payload)
    assert response.status_code == 200
    data = response.json()

    class_probs = data["stage3"]["class_probabilities"]
    assert len(class_probs) == 8  # 8 fault classes in AutoSense

    total_prob = sum(item["probability"] for item in class_probs)
    assert 0.98 <= total_prob <= 1.02  # allowing slight rounding tolerance

    for cp in class_probs:
        assert 0.0 <= cp["probability"] <= 1.0
        assert 0.0 <= cp["percentage"] <= 100.0


def test_multimodal_empty_corrupted_files_graceful_recovery(client: TestClient):
    """
    Test that uploading zero-byte or corrupt audio/image files falls back gracefully
    to text-only diagnosis without 500 crashes.
    """
    files = {
        "audio": ("corrupt.wav", b"", "audio/wav"),
        "image": ("corrupt.jpg", b"NOT_AN_IMAGE", "image/jpeg")
    }
    data = {
        "symptoms": "Clutch slips severely under heavy acceleration and engine revs freely without speed increase",
        "vehicle_context": "Bajaj Pulsar 220"
    }
    response = client.post("/api/diagnosis", data=data, files=files)
    assert response.status_code == 200
    res_data = response.json()

    assert res_data["primary_category"] == "Transmission & Clutch"
    assert res_data["confidence"] > 0
    assert len(res_data["reasoning"]) > 0


def test_model_info_endpoint_metadata(client: TestClient):
    """
    Test that GET /api/model-info returns complete architectural metadata.
    """
    response = client.get("/api/model-info")
    assert response.status_code == 200
    info = response.json()

    assert "name" in info
    assert "version" in info
    assert "classes" in info
    assert len(info["classes"]) == 8
    assert "Battery / Starting System" in info["classes"]
    assert "Braking System" in info["classes"]
    assert "Cooling System" in info["classes"]
    assert "Engine & Valvetrain" in info["classes"]
