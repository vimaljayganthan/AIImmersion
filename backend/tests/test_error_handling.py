import os
import json
import pytest
from fastapi.testclient import TestClient

def test_missing_body_validation_422(client: TestClient):
    """Test that requests with completely missing body return 422 Unprocessable Entity."""
    response = client.post("/api/ml/pipeline", json={})
    assert response.status_code == 422
    data = response.json()
    assert "detail" in data


def test_assistant_chat_empty_string_422_or_400(client: TestClient):
    """Test that POST /api/assistant/chat with empty string message returns validation/bad request error."""
    response = client.post("/api/assistant/chat", json={"message": ""})
    assert response.status_code in [400, 422]
    data = response.json()
    assert "detail" in data


def test_invalid_http_method_405(client: TestClient):
    """Test that calling an invalid HTTP method returns 405 Method Not Allowed."""
    response = client.delete("/api/ml/pipeline")
    assert response.status_code == 405


def test_nonexistent_route_404(client: TestClient):
    """Test that non-existent API routes return 404 Not Found."""
    response = client.get("/api/nonexistent_endpoint_route")
    assert response.status_code == 404


def test_diagnosis_empty_form_data_400(client: TestClient):
    """Test that POST /api/diagnosis without any form parameters returns 400."""
    response = client.post("/api/diagnosis", data={"symptoms": ""})
    assert response.status_code == 400
    data = response.json()
    assert "detail" in data
    assert "at least one diagnostic input" in data["detail"].lower()


def test_model_evaluation_missing_file_404(client: TestClient, monkeypatch, tmp_path):
    """Test that GET /api/model-evaluation returns 404 if the json file is missing."""
    import app.api.diagnosis as diag_module

    fake_missing_path = str(tmp_path / "nonexistent_eval.json")
    monkeypatch.setattr(os.path, "join", lambda *args: fake_missing_path if "model_evaluation.json" in args else os.path.join(*args))

    response = client.get("/api/model-evaluation")
    assert response.status_code == 404
    assert "not found" in response.json()["detail"].lower()
