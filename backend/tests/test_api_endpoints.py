import io
import pytest
from fastapi.testclient import TestClient

def test_root_endpoint(client: TestClient):
    """Test GET / endpoint returns online status and endpoint list."""
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "online"
    assert "AutoSense" in data["service"] or "DriveIQ" in data["service"]
    assert isinstance(data["endpoints"], list)


def test_health_endpoints(client: TestClient):
    """Test both GET /health and GET /api/health."""
    for path in ["/health", "/api/health"]:
        response = client.get(path)
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "ok"
        assert data["model_loaded"] is True
        assert "model_name" in data


def test_ml_pipeline_endpoint_valid(client: TestClient):
    """Test POST /api/ml/pipeline with valid vehicle symptom text."""
    payload = {
        "symptom": "Starter motor clicking rapidly when pressing ignition switch battery dead",
        "vehicle_context": "Yamaha R15"
    }
    response = client.post("/api/ml/pipeline", json=payload)
    assert response.status_code == 200
    data = response.json()

    assert data["success"] is True
    assert "stage1" in data
    assert "stage2" in data
    assert "stage3" in data
    assert "stage4" in data
    assert "model" in data

    # Stage 1 Preprocessing check
    assert data["stage1"]["name"] == "Preprocessing"
    assert data["stage1"]["token_count"] > 0
    assert isinstance(data["stage1"]["tokens"], list)

    # Stage 2 Feature Vector check
    assert data["stage2"]["method"] == "TF-IDF"
    assert data["stage2"]["vocabulary_size"] > 0
    assert isinstance(data["stage2"]["top_features"], list)

    # Stage 3 Model Prediction check
    assert data["stage3"]["prediction"] == "Battery / Starting System"
    assert data["stage3"]["probability"] > 0.15
    assert len(data["stage3"]["class_probabilities"]) == 8

    # Stage 4 Diagnosis check
    assert "Battery" in data["stage4"]["diagnosis"] or "Starter" in data["stage4"]["diagnosis"]
    assert data["stage4"]["severity"] == "Moderate"
    assert len(data["stage4"]["recommendation"]) > 0


def test_ml_pipeline_empty_symptom_400(client: TestClient):
    """Test POST /api/ml/pipeline with empty symptom returns 400 Bad Request."""
    response = client.post("/api/ml/pipeline", json={"symptom": "   ", "vehicle_context": ""})
    assert response.status_code == 400
    assert "symptom" in response.json()["detail"].lower()


def test_legacy_model_lab_predict(client: TestClient):
    """Test POST /api/model-lab/predict backward compatible route."""
    response = client.post("/api/model-lab/predict", json={"symptom": "Brake pads worn down to metal backing plate loud metallic squeal"})
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["stage3"]["prediction"] == "Braking System"


def test_diagnosis_endpoint_text_only(client: TestClient):
    """Test POST /api/diagnosis multipart form with text symptom only."""
    form_data = {
        "symptoms": "Radiator fan is not spinning and coolant temperature warning light glows red in traffic",
        "vehicle_context": "Hyundai i20"
    }
    response = client.post("/api/diagnosis", data=form_data)
    assert response.status_code == 200
    data = response.json()

    assert data["primary_category"] == "Cooling System"
    assert data["severity"] == "High"
    assert data["modalities"]["text"] is True
    assert data["modalities"]["audio"] is False
    assert data["modalities"]["image"] is False
    assert len(data["evidence"]) > 0
    assert "model" in data


def test_diagnosis_endpoint_multimodal(client: TestClient, generate_wav_bytes, generate_image_bytes):
    """Test POST /api/diagnosis with text, audio, and image multipart files."""
    form_data = {
        "symptoms": "High pitched squeal when braking",
        "vehicle_context": "Royal Enfield Classic 350"
    }
    wav_bytes = generate_wav_bytes(freq_hz=3200.0, duration_sec=1.0)
    img_bytes = generate_image_bytes(pattern="red_warning")

    files = {
        "audio": ("brake_sound.wav", io.BytesIO(wav_bytes), "audio/wav"),
        "image": ("dashboard.jpg", io.BytesIO(img_bytes), "image/jpeg")
    }

    response = client.post("/api/diagnosis", data=form_data, files=files)
    assert response.status_code == 200
    data = response.json()

    assert data["modalities"]["text"] is True
    assert data["modalities"]["audio"] is True
    assert data["modalities"]["image"] is True
    assert len(data["modality_breakdown"]) == 3
    assert data["primary_category"] == "Braking System"


def test_diagnosis_endpoint_missing_all_inputs_400(client: TestClient):
    """Test POST /api/diagnosis with no inputs returns 400 Bad Request."""
    response = client.post("/api/diagnosis", data={})
    assert response.status_code == 400
    assert "at least one diagnostic input" in response.json()["detail"].lower()


def test_diagnosis_json_endpoint(client: TestClient):
    """Test POST /api/diagnosis-json with valid JSON payload."""
    payload = {
        "symptoms": "Clutch slipping on acceleration",
        "vehicle_context": "KTM Duke 200"
    }
    response = client.post("/api/diagnosis-json", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["primary_category"] == "Transmission & Clutch"


def test_diagnosis_json_empty_symptom_400(client: TestClient):
    """Test POST /api/diagnosis-json with empty symptoms returns 400 Bad Request."""
    response = client.post("/api/diagnosis-json", json={"symptoms": "  "})
    assert response.status_code == 400


def test_model_info_endpoint(client: TestClient):
    """Test GET /api/model-info returns complete model metadata."""
    response = client.get("/api/model-info")
    assert response.status_code == 200
    data = response.json()
    assert "name" in data
    assert "version" in data
    assert data["classes_count"] == 8
    assert len(data["classes"]) == 8


def test_model_evaluation_endpoint(client: TestClient):
    """Test GET /api/model-evaluation returns cross-validation metrics."""
    response = client.get("/api/model-evaluation")
    assert response.status_code == 200
    data = response.json()
    assert "overall_accuracy" in data
    assert "macro_f1" in data
    assert "confusion_matrix" in data
    assert "per_class_metrics" in data


def test_assistant_chat_safety_warning(client: TestClient):
    """Test POST /api/assistant/chat triggers safety warning on hazard keywords."""
    payload = {"message": "Thick black smoke and fire under the vehicle hood"}
    response = client.post("/api/assistant/chat", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["type"] == "safety_warning"
    assert "SAFETY WARNING" in data["message"]


def test_assistant_chat_greeting(client: TestClient):
    """Test POST /api/assistant/chat returns greeting response."""
    payload = {"message": "Hello"}
    response = client.post("/api/assistant/chat", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["type"] == "text"
    assert "AutoSense" in data["message"] or "assistant" in data["message"]


def test_assistant_chat_gratitude(client: TestClient):
    """Test POST /api/assistant/chat returns gratitude response."""
    payload = {"message": "Thank you very much"}
    response = client.post("/api/assistant/chat", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["type"] == "text"
    assert "welcome" in data["message"].lower()


def test_assistant_chat_maintenance(client: TestClient):
    """Test POST /api/assistant/chat returns maintenance schedule response."""
    payload = {"message": "How often should I service and change engine oil?"}
    response = client.post("/api/assistant/chat", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["type"] == "maintenance"
    assert "Engine Oil" in data["message"]


def test_assistant_chat_diagnosis_inference(client: TestClient):
    """Test POST /api/assistant/chat triggers ML diagnosis inference on symptoms."""
    payload = {
        "message": "Brake pedal goes all the way to floor with squealing sound",
        "conditions": ["metallic friction noise"]
    }
    response = client.post("/api/assistant/chat", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["type"] == "diagnosis"
    assert data["diagnosis"]["category"] == "Braking System"
