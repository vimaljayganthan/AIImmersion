from typing import List, Dict, Optional, Any
from pydantic import BaseModel, Field

class ModalityFlags(BaseModel):
    text: bool = False
    audio: bool = False
    image: bool = False

class ModalityWeight(BaseModel):
    modality: str
    weight: float
    raw_confidence: float
    predicted_category: str

class DiagnosticEvidence(BaseModel):
    category: str
    modality: str
    observation: str
    confidence_contribution: float
    technical_detail: Optional[str] = None

class ModelInfo(BaseModel):
    name: str = "AutoSense Fault Classifier"
    version: str = "1.0"
    type: str = "TF-IDF + Random Forest Classifier (150 Estimators)"
    model_type: Optional[str] = "TF-IDF + Random Forest Classifier (Late Multimodal Fusion)"
    dataset_source: Optional[str] = "AutoSense Structured Vehicle Fault Dataset (Prototype/Dev)"
    training_samples: int = 99
    feature_count: int = 600
    classes_count: int = 8
    classes: List[str] = []
    trained_at: Optional[str] = None

class DiagnosisResponse(BaseModel):
    diagnosis: str
    primary_category: str
    confidence: float
    severity: str  # "Low" | "Moderate" | "High" | "Critical"
    reasoning: List[str]
    evidence: List[DiagnosticEvidence]
    recommendation: List[str]
    safety_warning: Optional[str] = None
    estimated_cost_range: str
    modalities: ModalityFlags
    modality_breakdown: List[ModalityWeight]
    category_probabilities: Dict[str, float]
    model: ModelInfo
    disclaimer: str = "This is a machine learning preliminary assessment. Always consult a certified automotive mechanic for safety-critical inspections."

class ClassMetric(BaseModel):
    precision: float
    recall: float
    f1_score: float
    support: int

class ModelEvaluationMetrics(BaseModel):
    model_name: str
    evaluation_date: str
    overall_accuracy: float
    macro_precision: float
    macro_recall: float
    macro_f1: float
    weighted_f1: float
    classes: List[str]
    confusion_matrix: List[List[int]]
    per_class_metrics: Dict[str, ClassMetric]
    feature_importances_top: List[Dict[str, Any]]
    dataset_distribution: Dict[str, int]
    is_prototype: bool = False

# ML Pipeline Inspector Schemas
class PipelineRequest(BaseModel):
    symptom: str = Field(..., min_length=1, description="Vehicle symptom description text")
    vehicle_context: Optional[str] = Field("", description="Optional vehicle make/model/mileage context")

class PipelineStage1(BaseModel):
    name: str = "Preprocessing"
    normalized_text: str
    tokens: List[str]
    token_count: int

class FeatureWeight(BaseModel):
    term: str
    weight: float

class PipelineStage2(BaseModel):
    name: str = "Feature Vector"
    method: str = "TF-IDF"
    vocabulary_size: int
    non_zero_features: int = 0
    top_features: List[FeatureWeight]

class ClassProbability(BaseModel):
    class_name: str = Field(..., alias="class", serialization_alias="class")
    category: Optional[str] = None
    probability: float
    percentage: Optional[float] = None

    model_config = {"populate_by_name": True}

class PipelineStage3(BaseModel):
    name: str = "Model Prediction"
    model: str = "Random Forest Classifier"
    prediction: str
    probability: float
    class_probabilities: List[ClassProbability]
    probabilities: Optional[List[ClassProbability]] = None

    model_config = {"populate_by_name": True}

class PipelineStage4(BaseModel):
    name: str = "Final Diagnosis"
    diagnosis: str
    confidence: float
    severity: str
    recommendation: str

class PipelineModelSummary(BaseModel):
    name: str = "AutoSense Fault Classifier"
    version: str = "1.0"
    type: Optional[str] = None
    feature_count: Optional[int] = None
    classes_count: Optional[int] = None
    classes: Optional[List[str]] = None

class PipelineResponse(BaseModel):
    success: bool = True
    input: Dict[str, str]
    stage1: PipelineStage1
    stage2: PipelineStage2
    stage3: PipelineStage3
    stage4: PipelineStage4
    model: PipelineModelSummary

class HealthResponse(BaseModel):
    status: str = "ok"
    service: str = "AutoSense ML Backend"
    model_loaded: bool = True
    model_name: str = "AutoSense Fault Classifier"
    model_version: str = "1.0"
