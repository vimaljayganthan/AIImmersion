import { Diagnosis, Vehicle } from '../../types';

export interface SymptomDiagnosisInput {
  symptoms: string;
  vehicle: Partial<Vehicle>;
  additionalContext?: {
    startedWhen?: string;
    frequency?: string;
    startsReliably?: boolean;
    warningLights?: boolean;
    unusualSmell?: boolean;
    recentService?: boolean;
  };
  imageFiles?: File[] | Blob[] | string[];
  audioFile?: File | Blob | string;
}

export interface AiServiceAdapter {
  symptomDiagnosis(input: SymptomDiagnosisInput): Promise<Diagnosis>;
  imageDiagnosis(imageUrl: string, vehicle: Partial<Vehicle>): Promise<Partial<Diagnosis>>;
  audioAnalysis(audioUrl: string, vehicle: Partial<Vehicle>): Promise<Partial<Diagnosis>>;
  costEstimation(diagnosisTitle: string, vehicleModel: string): Promise<Diagnosis['estimatedCost']>;
  maintenancePrediction(vehicle: Vehicle): Promise<{ recommendations: string[]; priority: string }>;
  assistantResponse(
    query: string,
    context: { vehicle?: Vehicle; previousDiagnoses?: Diagnosis[] }
  ): Promise<{
    message: string;
    suggestedAction?: { label: string; type: 'diagnosis' | 'mechanic' | 'upload' };
  }>;
}

export * from './mockAiService';
export * from './apiAiService';
export { apiAiService as aiService } from './apiAiService';

