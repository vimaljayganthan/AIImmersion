import { Diagnosis, Vehicle } from '../../types';
import { SymptomDiagnosisInput, AiServiceAdapter } from './index';
import { mockAiService } from './mockAiService';
import { API_BASE_URL } from '../../config/api';

export interface HealthResponse {
  status: string;
  service: string;
  model_loaded: boolean;
  model_name: string;
  model_version: string;
}

export interface FeatureWeight {
  term: string;
  weight: number;
}

export interface ClassProbability {
  class?: string;
  category?: string;
  probability: number;
  percentage?: number;
}

export interface PipelineStage1 {
  name: string;
  normalized_text: string;
  tokens: string[];
  token_count: number;
}

export interface PipelineStage2 {
  name: string;
  method: string;
  vocabulary_size: number;
  non_zero_features?: number;
  top_features: FeatureWeight[];
}

export interface PipelineStage3 {
  name: string;
  model: string;
  prediction: string;
  probability?: number;
  class_probabilities?: ClassProbability[];
  probabilities?: ClassProbability[];
}

export interface PipelineStage4 {
  name: string;
  diagnosis: string;
  confidence: number;
  severity: 'Low' | 'Moderate' | 'High' | 'Critical' | string;
  recommendation: string;
}

export interface PipelineResponse {
  success: boolean;
  input: {
    symptom: string;
    vehicle_context?: string;
  };
  stage1: PipelineStage1;
  stage2: PipelineStage2;
  stage3: PipelineStage3;
  stage4: PipelineStage4;
  model: {
    name: string;
    version: string;
    type?: string;
    model_type?: string;
    training_samples?: number;
    feature_count?: number;
    classes_count?: number;
    classes?: string[];
  };
}

export interface BackendDiagnosisResponse {
  diagnosis: string;
  primary_category: string;
  confidence: number;
  severity: 'Low' | 'Moderate' | 'High' | 'Critical';
  reasoning: string[];
  evidence: Array<{
    category: string;
    modality: string;
    observation: string;
    confidence_contribution: number;
    technical_detail?: string;
  }>;
  recommendation: string[];
  safety_warning?: string | null;
  estimated_cost_range: string;
  modalities: {
    text: boolean;
    audio: boolean;
    image: boolean;
  };
  modality_breakdown: Array<{
    modality: string;
    weight: number;
    raw_confidence: number;
    predicted_category: string;
  }>;
  category_probabilities: Record<string, number>;
  model: {
    name: string;
    version: string;
    type?: string;
    model_type?: string;
    dataset_source?: string;
    training_samples?: number;
    feature_count?: number;
    classes_count?: number;
    classes?: string[];
  };
  disclaimer: string;
}

export interface ModelEvaluationData {
  model_name: string;
  evaluation_date: string;
  overall_accuracy: number;
  macro_precision: number;
  macro_recall: number;
  macro_f1: number;
  weighted_f1: number;
  classes: string[];
  confusion_matrix: number[][];
  per_class_metrics: Record<string, {
    precision: number;
    recall: number;
    f1_score: number;
    support: number;
  }>;
  feature_importances_top: Array<{ feature: string; importance: number }>;
  dataset_distribution: Record<string, number>;
  is_prototype: boolean;
}

/**
 * Executes a network fetch request with a strict timeout and granular error classification.
 * Prevents requests from hanging indefinitely on network failure, handles status codes,
 * and safely unwraps json.
 */
async function fetchWithTimeout(
  url: string,
  options: RequestInit = {},
  timeoutMs = 12000
): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(id);
    return response;
  } catch (error: any) {
    clearTimeout(id);
    if (error.name === 'AbortError') {
      throw new Error(`Diagnostic request timed out after ${timeoutMs / 1000}s. Backend service may be overloaded or offline.`);
    }
    if (error instanceof TypeError && error.message.toLowerCase().includes('fetch')) {
      throw new Error(`Network connection error: Unable to reach DriveIQ API at ${url}. Please verify connection.`);
    }
    throw error;
  }
}

class ApiAiService implements AiServiceAdapter {
  /**
   * Performs multimodal vehicle diagnosis via FastAPI backend with resilient fallbacks.
   * Handles timeouts, network failures, invalid responses, and payload parsing.
   */
  async symptomDiagnosis(input: SymptomDiagnosisInput): Promise<Diagnosis> {
    const vehicleContext = input.vehicle
      ? `${input.vehicle.make || ''} ${input.vehicle.model || ''} ${input.vehicle.year || ''} ${input.vehicle.fuelType || ''} ${input.vehicle.mileage ? input.vehicle.mileage + 'km' : ''}`.trim()
      : '';

    try {
      const formData = new FormData();
      if (input.symptoms) {
        formData.append('symptoms', input.symptoms);
      }
      if (vehicleContext) {
        formData.append('vehicle_context', vehicleContext);
      }

      // Append audio if available
      if (input.audioFile) {
        if (input.audioFile instanceof Blob) {
          formData.append('audio', input.audioFile, 'engine_sound.webm');
        }
      }

      // Append image if available
      if (input.imageFiles && input.imageFiles.length > 0) {
        const firstImg = input.imageFiles[0];
        if (firstImg instanceof Blob) {
          formData.append('image', firstImg, 'vehicle_component.jpg');
        }
      }

      const res = await fetchWithTimeout(`${API_BASE_URL}/api/diagnosis`, {
        method: 'POST',
        body: formData,
      }, 12000);

      if (!res.ok) {
        let errorMessage = `ML Backend returned status ${res.status}`;
        try {
          const errData = await res.json();
          errorMessage = errData.error || errData.detail || errorMessage;
        } catch {
          // Response body was empty or non-JSON
        }
        throw new Error(errorMessage);
      }

      const data: BackendDiagnosisResponse = await res.json();

      if (!data || !data.diagnosis || !data.primary_category) {
        throw new Error('Received malformed or empty diagnosis payload from backend.');
      }

      const parseCost = (rangeStr: string) => {
        const matches = rangeStr.match(/(\d[\d,]*)/g);
        if (matches && matches.length >= 2) {
          const min = parseInt(matches[0].replace(/,/g, ''), 10);
          const max = parseInt(matches[1].replace(/,/g, ''), 10);
          return { min, max, currency: '₹', labourCost: Math.round(min * 0.4), partsCost: Math.round(min * 0.6) };
        }
        return { min: 1000, max: 3500, currency: '₹', labourCost: 400, partsCost: 1200 };
      };

      const severityMap: Record<string, 'low' | 'medium' | 'high' | 'critical'> = {
        Low: 'low',
        Moderate: 'medium',
        High: 'high',
        Critical: 'critical',
      };

      const possibleCauses = Object.entries(data.category_probabilities || {})
        .sort(([, a], [, b]) => b - a)
        .slice(0, 4)
        .map(([name, prob]) => ({
          name,
          confidence: Math.round(prob * 100),
          description: `Machine learning category likelihood: ${(prob * 100).toFixed(1)}%`,
        }));

      return {
        id: 'diag-' + Date.now(),
        vehicleId: input.vehicle?.id || 'v1',
        userId: input.vehicle?.ownerId || 'u1',
        title: data.diagnosis,
        category: data.primary_category,
        severity: severityMap[data.severity] || 'medium',
        confidence: Math.round(data.confidence * 100),
        possibleCauses: possibleCauses.length > 0 ? possibleCauses : [
          { name: data.primary_category, confidence: Math.round(data.confidence * 100) }
        ],
        reasoning: data.reasoning || [],
        evidence: data.evidence || [],
        recommendation: {
          priority: data.severity === 'Critical' ? 'urgent' : data.severity === 'High' ? 'high' : 'medium',
          action: (data.recommendation && data.recommendation[0]) || 'Inspect vehicle at a certified service center.',
          avoid: data.severity === 'Critical' ? 'Do not drive at high speeds or under load.' : 'Avoid ignoring symptoms.',
        },
        estimatedCost: parseCost(data.estimated_cost_range || ''),
        safetyWarning: data.safety_warning,
        inputSymptoms: input.symptoms,
        additionalContext: input.additionalContext,
        modalitiesUsed: data.modalities,
        modalityBreakdown: data.modality_breakdown || [],
        categoryProbabilities: data.category_probabilities || {},
        modelInfo: {
          name: data.model?.name || 'AutoSense Fault Classifier',
          version: data.model?.version || '1.0',
          model_type: data.model?.model_type || 'Random Forest Classifier',
          dataset_source: data.model?.dataset_source || 'Multi-Modal Vehicle Fault Dataset',
          training_samples: data.model?.training_samples,
          feature_count: data.model?.feature_count,
        },
        status: 'preliminary',
        createdAt: new Date().toISOString(),
      };
    } catch (err) {
      console.warn('[ApiAiService] FastAPI backend unreachable or errored, using fallback:', err);
      return mockAiService.symptomDiagnosis(input);
    }
  }

  /**
   * Health Check calling FastAPI backend with timeout protection
   */
  async checkHealth(): Promise<HealthResponse | null> {
    try {
      const res = await fetchWithTimeout(`${API_BASE_URL}/health`, {}, 5000);
      if (res.ok) return await res.json();
    } catch (e) {
      // Backend is offline or timed out
    }
    return null;
  }

  /**
   * Runs the ML Pipeline Inspector (POST /api/ml/pipeline) with validated timeout
   */
  async runMlPipeline(symptom: string, vehicleContext: string = ''): Promise<PipelineResponse> {
    const trimmed = symptom.trim();
    if (!trimmed) {
      throw new Error('Please enter a vehicle symptom.');
    }

    const res = await fetchWithTimeout(`${API_BASE_URL}/api/ml/pipeline`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        symptom: trimmed,
        vehicle_context: vehicleContext,
      }),
    }, 10000);

    if (!res.ok) {
      let errDetail = `ML Backend returned status ${res.status}`;
      try {
        const errData = await res.json();
        errDetail = errData.error || errData.detail || errDetail;
      } catch {
        // Response body empty or non-JSON
      }
      throw new Error(errDetail);
    }

    const result: PipelineResponse = await res.json();

    if (!result || !result.stage3 || !result.stage4) {
      throw new Error('ML Pipeline returned invalid stage results.');
    }

    return result;
  }

  /**
   * Fetches authentic Stratified Cross-Validation evaluation metrics from FastAPI
   */
  async getModelEvaluation(): Promise<ModelEvaluationData | null> {
    try {
      const res = await fetchWithTimeout(`${API_BASE_URL}/api/model-evaluation`, {}, 8000);
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('Failed to fetch model evaluation from API:', e);
    }
    return null;
  }

  async imageDiagnosis(imageUrl: string, vehicle: Partial<Vehicle>): Promise<Partial<Diagnosis>> {
    return mockAiService.imageDiagnosis(imageUrl, vehicle);
  }

  async audioAnalysis(audioUrl: string, vehicle: Partial<Vehicle>): Promise<Partial<Diagnosis>> {
    return mockAiService.audioAnalysis(audioUrl, vehicle);
  }

  async costEstimation(diagnosisTitle: string, vehicleModel: string): Promise<Diagnosis['estimatedCost']> {
    return mockAiService.costEstimation(diagnosisTitle, vehicleModel);
  }

  async maintenancePrediction(vehicle: Vehicle): Promise<{ recommendations: string[]; priority: string }> {
    return mockAiService.maintenancePrediction(vehicle);
  }

  async assistantResponse(
    query: string,
    context: { vehicle?: Vehicle; previousDiagnoses?: Diagnosis[] }
  ): Promise<{
    message: string;
    suggestedAction?: { label: string; type: 'diagnosis' | 'mechanic' | 'upload' };
  }> {
    return mockAiService.assistantResponse(query, context);
  }
}

export const apiAiService = new ApiAiService();
