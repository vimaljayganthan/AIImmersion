import os
import sys
import io
import wave
import struct
import math
import cv2
import numpy as np
import pytest
from fastapi.testclient import TestClient

# Ensure backend root is added to sys.path
backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from app.main import app
from app.models.text_model import TextFaultClassifier, CATEGORIES
from app.models.audio_model import AudioFaultAnalyzer
from app.models.image_model import ImageFaultAnalyzer
from app.models.fusion import MultimodalFusionEngine
from app.services.diagnosis_service import diagnosis_service


@pytest.fixture(scope="session")
def client():
    """
    Provides a FastAPI TestClient instance for endpoint integration tests.
    """
    return TestClient(app)


@pytest.fixture(scope="session")
def loaded_text_classifier():
    """
    Ensures that the real TextFaultClassifier is loaded with genuine trained model weights.
    """
    clf = TextFaultClassifier()
    if not clf.is_trained():
        import pandas as pd
        csv_path = os.path.join(backend_dir, "app", "data", "vehicle_faults_dataset.csv")
        df = pd.read_csv(csv_path)
        clf.train(df)
    else:
        clf.load()
    return clf


@pytest.fixture
def generate_wav_bytes():
    """
    Factory fixture to generate authentic in-memory WAV audio bytes with controllable frequency and duration.
    """
    def _create_wav(freq_hz: float = 440.0, duration_sec: float = 1.0, sample_rate: int = 22050, volume: float = 0.5) -> bytes:
        num_samples = int(sample_rate * duration_sec)
        buffer = io.BytesIO()
        with wave.open(buffer, "wb") as wav_file:
            wav_file.setnchannels(1)  # Mono
            wav_file.setsampwidth(2)  # 16-bit
            wav_file.setframerate(sample_rate)
            
            for i in range(num_samples):
                t = float(i) / sample_rate
                # Sine wave with small harmonic
                val = volume * math.sin(2.0 * math.pi * freq_hz * t)
                val += 0.2 * volume * math.sin(4.0 * math.pi * freq_hz * t)
                # Clip to 16-bit range
                val = max(-1.0, min(1.0, val))
                sample = int(val * 32767.0)
                wav_file.writeframesraw(struct.pack("<h", sample))
        
        return buffer.getvalue()

    return _create_wav


@pytest.fixture
def generate_image_bytes():
    """
    Factory fixture to generate authentic in-memory JPEG image bytes with controllable visual patterns.
    """
    def _create_image(pattern: str = "neutral", width: int = 200, height: int = 200) -> bytes:
        img = np.zeros((height, width, 3), dtype=np.uint8)

        if pattern == "amber_warning":
            # Dark dashboard with bright amber warning lamp (BGR: [0, 165, 255])
            img[:] = (30, 30, 30)
            cv2.circle(img, (width // 2, height // 2), min(width, height) // 3, (0, 165, 255), -1)
        elif pattern == "red_warning":
            # Dark dashboard with bright red warning lamp (BGR: [0, 0, 255])
            img[:] = (30, 30, 30)
            cv2.circle(img, (width // 2, height // 2), min(width, height) // 3, (0, 0, 255), -1)
        elif pattern == "high_edges":
            # High frequency grid / grooves (e.g., tyre tread or rotor scoring)
            img[:] = (120, 120, 120)
            for x in range(0, width, 6):
                cv2.line(img, (x, 0), (x, height), (255, 255, 255), 2)
            for y in range(0, height, 6):
                cv2.line(img, (0, y), (width, y), (0, 0, 0), 2)
        elif pattern == "dark_seepage":
            # Low reflectance dark soot/fluid puddle
            img[:] = (25, 25, 25)
            cv2.circle(img, (width // 2, height // 2), min(width, height) // 4, (10, 10, 10), -1)
        else:
            # Neutral gray surface
            img[:] = (128, 128, 128)

        _, encoded = cv2.imencode(".jpg", img)
        return encoded.tobytes()

    return _create_image
