import pytest
from app.models.fusion import MultimodalFusionEngine, CATEGORIES, BASE_WEIGHTS

def test_fusion_text_only():
    """Test unimodal late fusion with text probabilities only."""
    text_probs = {cat: 0.05 for cat in CATEGORIES}
    text_probs["Battery / Starting System"] = 0.65
    text_evidence = ["Starter clicking detected in symptom NLP."]

    result = MultimodalFusionEngine.fuse(
        text_probs=text_probs,
        text_evidence=text_evidence,
        audio_probs=None,
        audio_evidence=None,
        image_probs=None,
        image_evidence=None
    )

    assert result["primary_category"] == "Battery / Starting System"
    assert result["modalities"].text is True
    assert result["modalities"].audio is False
    assert result["modalities"].image is False
    assert len(result["modality_breakdown"]) == 1
    assert result["modality_breakdown"][0].weight == 1.0
    assert result["severity"] == "Moderate"
    assert "₹" in result["estimated_cost_range"]
    assert len(result["recommendation"]) > 0


def test_fusion_bimodal_text_and_audio():
    """Test bimodal fusion with text and audio signals."""
    text_probs = {cat: 0.05 for cat in CATEGORIES}
    text_probs["Braking System"] = 0.65
    text_evidence = ["Brake squeal text symptom"]

    audio_probs = {cat: 0.05 for cat in CATEGORIES}
    audio_probs["Braking System"] = 0.65
    audio_evidence = ["High-frequency screech detected in acoustic analysis"]

    result = MultimodalFusionEngine.fuse(
        text_probs=text_probs,
        text_evidence=text_evidence,
        audio_probs=audio_probs,
        audio_evidence=audio_evidence,
        image_probs=None,
        image_evidence=None
    )

    assert result["primary_category"] == "Braking System"
    assert result["modalities"].text is True
    assert result["modalities"].audio is True
    assert result["modalities"].image is False

    # Check normalized weights (0.40 / 0.75 and 0.35 / 0.75)
    breakdown = {m.modality: m.weight for m in result["modality_breakdown"]}
    assert round(sum(breakdown.values()), 2) == 1.0
    assert result["severity"] == "Critical"
    assert result["safety_warning"] is not None


def test_fusion_trimodal_all_modalities():
    """Test trimodal late fusion with text, audio, and visual modalities."""
    text_probs = {cat: 0.05 for cat in CATEGORIES}
    text_probs["Engine & Valvetrain"] = 0.65

    audio_probs = {cat: 0.05 for cat in CATEGORIES}
    audio_probs["Engine & Valvetrain"] = 0.65

    image_probs = {cat: 0.05 for cat in CATEGORIES}
    image_probs["Engine & Valvetrain"] = 0.65

    result = MultimodalFusionEngine.fuse(
        text_probs=text_probs,
        text_evidence=["Ticking valvetrain noise"],
        audio_probs=audio_probs,
        audio_evidence=["Percussive tapping acoustic harmonics"],
        image_probs=image_probs,
        image_evidence=["Dark engine seepage patch"]
    )

    assert result["primary_category"] == "Engine & Valvetrain"
    assert result["modalities"].text is True
    assert result["modalities"].audio is True
    assert result["modalities"].image is True
    assert len(result["modality_breakdown"]) == 3

    # Weights in trimodal should be 0.40, 0.35, 0.25
    weights = [m.weight for m in result["modality_breakdown"]]
    assert round(sum(weights), 2) == 1.0

    # Cross-modal consensus bonus should be present
    assert any("Multimodal Consensus" in r for r in result["reasoning"])


def test_fusion_edge_case_no_modalities_error():
    """Verify that calling fuse with zero modalities raises ValueError."""
    with pytest.raises(ValueError) as exc_info:
        MultimodalFusionEngine.fuse(
            text_probs=None,
            text_evidence=None,
            audio_probs=None,
            audio_evidence=None,
            image_probs=None,
            image_evidence=None
        )
    assert "At least one modality" in str(exc_info.value)
