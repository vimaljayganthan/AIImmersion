import pytest
from app.models.image_model import ImageFaultAnalyzer, CATEGORIES

def test_image_analyzer_init():
    analyzer = ImageFaultAnalyzer()
    assert analyzer.is_prototype is True
    assert analyzer.classes_ == CATEGORIES


def test_image_feature_extraction_valid(generate_image_bytes):
    """Test OpenCV computer vision feature extraction on synthetic test image."""
    analyzer = ImageFaultAnalyzer()
    img_bytes = generate_image_bytes(pattern="neutral", width=150, height=150)

    features = analyzer.extract_visual_features(img_bytes)

    assert features.get("success") is True
    assert features["dimensions"] == "150x150"
    assert "mean_brightness" in features
    assert "contrast_std" in features
    assert "edge_density" in features
    assert "warning_amber_ratio" in features
    assert "warning_red_ratio" in features


def test_image_predict_proba_amber_warning(generate_image_bytes):
    """Test visual classification for amber dashboard warning lamp."""
    analyzer = ImageFaultAnalyzer()
    img_bytes = generate_image_bytes(pattern="amber_warning")

    probs, evidence, features = analyzer.predict_proba(img_bytes)

    assert isinstance(probs, dict)
    assert len(probs) == 8
    total = sum(probs.values())
    assert 0.99 <= total <= 1.01

    assert probs["Electrical & Sensors"] > 0.25
    assert any("Amber luminous cluster" in ev or "indicator" in ev for ev in evidence)


def test_image_predict_proba_red_warning(generate_image_bytes):
    """Test visual classification for red dashboard warning lamp."""
    analyzer = ImageFaultAnalyzer()
    img_bytes = generate_image_bytes(pattern="red_warning")

    probs, evidence, features = analyzer.predict_proba(img_bytes)

    assert isinstance(probs, dict)
    assert len(probs) == 8
    total = sum(probs.values())
    assert 0.99 <= total <= 1.01

    assert probs["Braking System"] > probs["Tyres & Suspension"]
    assert any("red spectrum cluster" in ev.lower() for ev in evidence)


def test_image_predict_proba_high_edges(generate_image_bytes):
    """Test visual classification for high edge density (tread wear/grooves)."""
    analyzer = ImageFaultAnalyzer()
    img_bytes = generate_image_bytes(pattern="high_edges")

    probs, evidence, features = analyzer.predict_proba(img_bytes)

    assert isinstance(probs, dict)
    assert len(probs) == 8
    total = sum(probs.values())
    assert 0.99 <= total <= 1.01

    assert probs["Tyres & Suspension"] > 0.20
    assert any("edge density" in ev.lower() for ev in evidence)


def test_image_edge_case_empty_bytes():
    """Verify graceful handling and uniform probability fallback on empty image input."""
    analyzer = ImageFaultAnalyzer()
    probs, evidence, features = analyzer.predict_proba(b"")

    assert isinstance(probs, dict)
    assert len(probs) == 8
    total = sum(probs.values())
    assert 0.99 <= total <= 1.01
    assert "Image could not be processed by OpenCV." in evidence


def test_image_edge_case_corrupted_bytes():
    """Verify graceful handling when non-image corrupted byte data is provided."""
    analyzer = ImageFaultAnalyzer()
    corrupt_bytes = b"NOT_A_VALID_JPEG_HEADER_CORRUPT_BYTES_DATA_STREAM"
    probs, evidence, features = analyzer.predict_proba(corrupt_bytes)

    assert isinstance(probs, dict)
    assert len(probs) == 8
    total = sum(probs.values())
    assert 0.99 <= total <= 1.01
    assert "Image could not be processed by OpenCV." in evidence
