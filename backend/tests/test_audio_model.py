import pytest
from app.models.audio_model import AudioFaultAnalyzer, CATEGORIES

def test_audio_analyzer_init():
    analyzer = AudioFaultAnalyzer()
    assert analyzer.is_prototype is True
    assert analyzer.classes_ == CATEGORIES


def test_audio_feature_extraction_valid(generate_wav_bytes):
    """Test authentic librosa acoustic feature extraction on valid WAV audio bytes."""
    analyzer = AudioFaultAnalyzer()
    wav_bytes = generate_wav_bytes(freq_hz=1000.0, duration_sec=1.5, volume=0.5)

    features = analyzer.extract_features(wav_bytes)

    assert features.get("success") is True
    assert "duration_seconds" in features
    assert features["duration_seconds"] > 1.0
    assert features["sampling_rate"] == 22050
    assert "rms_energy" in features
    assert "zero_crossing_rate" in features
    assert "spectral_centroid_hz" in features
    assert "spectral_bandwidth_hz" in features
    assert "mfcc_summary" in features
    assert len(features["mfcc_summary"]) == 5


def test_audio_predict_proba_high_frequency_squeal(generate_wav_bytes):
    """Test high frequency audio signal (>3000 Hz) mapping to Braking / Cooling System."""
    analyzer = AudioFaultAnalyzer()
    # 3500 Hz high pitched screech
    wav_bytes = generate_wav_bytes(freq_hz=3500.0, duration_sec=1.0, volume=0.8)

    probs, evidence, features = analyzer.predict_proba(wav_bytes)

    assert isinstance(probs, dict)
    assert len(probs) == 8
    total = sum(probs.values())
    assert 0.99 <= total <= 1.01

    assert probs["Braking System"] > probs["Fuel System"]
    assert len(evidence) > 0
    assert any("High-frequency spectral energy" in ev or "friction" in ev for ev in evidence)


def test_audio_predict_proba_low_frequency_clicks(generate_wav_bytes):
    """Test low frequency audio signal (<1000 Hz) mapping to Battery / Starting System."""
    analyzer = AudioFaultAnalyzer()
    # 300 Hz low pitch click/tone with low volume
    wav_bytes = generate_wav_bytes(freq_hz=300.0, duration_sec=0.5, volume=0.04)

    probs, evidence, features = analyzer.predict_proba(wav_bytes)

    assert isinstance(probs, dict)
    assert len(probs) == 8
    total = sum(probs.values())
    assert 0.99 <= total <= 1.01

    assert probs["Battery / Starting System"] > 0.30
    assert len(evidence) > 0


def test_audio_edge_case_empty_bytes():
    """Verify graceful handling and uniform probability fallback on empty audio input."""
    analyzer = AudioFaultAnalyzer()
    probs, evidence, features = analyzer.predict_proba(b"")

    assert isinstance(probs, dict)
    assert len(probs) == 8
    total = sum(probs.values())
    assert 0.99 <= total <= 1.01
    assert "Audio file unreadable or corrupt." in evidence


def test_audio_edge_case_corrupted_bytes():
    """Verify graceful handling when non-audio corrupted byte data is provided."""
    analyzer = AudioFaultAnalyzer()
    corrupt_bytes = b"NOT_A_REAL_WAV_HEADER_CORRUPT_BYTES_DATA_STREAM_12345"
    probs, evidence, features = analyzer.predict_proba(corrupt_bytes)

    assert isinstance(probs, dict)
    assert len(probs) == 8
    total = sum(probs.values())
    assert 0.99 <= total <= 1.01
    assert "Audio file unreadable or corrupt." in evidence
