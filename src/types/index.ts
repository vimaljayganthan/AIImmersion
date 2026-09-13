export type UserRole = 'owner' | 'mechanic' | 'admin';

export interface User {
  id: string;
  role: UserRole;
  name: string;
  email: string;
  avatar?: string;
  phone?: string;
  location?: string;
  createdAt: string;
}

export interface Vehicle {
  id: string;
  ownerId: string;
  make: string;
  model: string;
  year: number;
  fuelType: 'Petrol' | 'Diesel' | 'Electric' | 'Hybrid';
  engineCapacity: string; // e.g. "155cc" or "1.2L"
  mileage: number; // in km
  regNumber: string;
  vin?: string;
  color?: string;
  healthScore: number; // 0-100%
  lastServicedAt?: string;
  createdAt: string;
}

export interface DiagnosisCause {
  name: string;
  confidence: number;
  description?: string;
}

export interface DiagnosisRecommendation {
  priority: 'low' | 'medium' | 'high' | 'urgent';
  action: string;
  avoid: string;
}

export interface EstimatedCost {
  min: number;
  max: number;
  currency: string;
  partsCost?: number;
  labourCost?: number;
  inspectionCost?: number;
}

export interface Diagnosis {
  id: string;
  vehicleId: string;
  userId: string;
  title: string;
  category: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  confidence: number; // 0 - 100
  possibleCauses: DiagnosisCause[];
  reasoning: string[];
  recommendation: DiagnosisRecommendation;
  estimatedCost: EstimatedCost;
  safetyWarning?: string | null;
  inputSymptoms: string;
  additionalContext?: {
    frequency?: string;
    startedWhen?: string;
    startsReliably?: boolean;
    warningLights?: boolean;
    unusualSmell?: boolean;
    recentService?: boolean;
  };
  mediaUrls?: string[];
  evidence?: Array<{
    category: string;
    modality: string;
    observation: string;
    confidence_contribution?: number;
    technical_detail?: string;
  }>;
  modalitiesUsed?: {
    text: boolean;
    audio: boolean;
    image: boolean;
  };
  modalityBreakdown?: Array<{
    modality: string;
    weight: number;
    raw_confidence: number;
    predicted_category: string;
  }>;
  categoryProbabilities?: Record<string, number>;
  modelInfo?: {
    name: string;
    version: string;
    model_type?: string;
    dataset_source?: string;
    training_samples?: number;
    feature_count?: number;
  };
  mechanicFeedback?: {
    mechanicId: string;
    agreed: boolean;
    mechanicNotes: string;
    actualDiagnosis?: string;
  };
  status: 'preliminary' | 'verified_by_mechanic' | 'resolved';
  createdAt: string;
}

export interface DiagnosisMedia {
  id: string;
  diagnosisId: string;
  mediaType: 'image' | 'audio';
  fileUrl: string;
  description?: string;
  uploadedAt: string;
}

export interface Mechanic {
  id: string;
  userId: string;
  name: string;
  workshopName: string;
  rating: number;
  reviewCount: number;
  distanceKm: number;
  experienceYears: number;
  phone: string;
  address: string;
  workingHours: string;
  specializations: string[];
  servicesOffered: string[];
  hourlyRate: number;
  isVerified: boolean;
  avatar: string;
  vehicleTypes: ('Bike' | 'Car' | 'Commercial')[];
}

export type BookingStatus = 
  | 'pending'
  | 'accepted'
  | 'vehicle_received'
  | 'diagnosing'
  | 'repairing'
  | 'quality_check'
  | 'completed'
  | 'cancelled';

export interface Booking {
  id: string;
  bookingReference: string;
  vehicleId: string;
  userId: string;
  mechanicId: string;
  diagnosisId?: string;
  problemSummary: string;
  aiPreliminaryAssessment?: string;
  serviceType: string;
  appointmentDate: string;
  timeSlot: string;
  status: BookingStatus;
  notes?: string;
  estimatedTotal?: number;
  createdAt: string;
}

export interface ServiceRecord {
  id: string;
  bookingId?: string;
  vehicleId: string;
  mechanicId: string;
  mechanicName: string;
  workshopName: string;
  serviceDate: string;
  title: string;
  finalCost: number;
  partsReplaced: Array<{ name: string; cost: number }>;
  labourCost: number;
  mechanicNotes: string;
  mileageAtService: number;
  nextServiceDueMileage: number;
}

export interface MaintenanceRecord {
  id: string;
  vehicleId: string;
  title: string;
  component: string;
  status: 'due_soon' | 'upcoming' | 'healthy';
  dueMileage?: number;
  estimatedKmRemaining?: number;
  dueDate?: string;
  lastCheckedDate: string;
  recommendation: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'alert' | 'success' | 'warning';
  read: boolean;
  link?: string;
  createdAt: string;
}

export interface Review {
  id: string;
  mechanicId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Part {
  id: string;
  name: string;
  partNumber: string;
  category: string;
  compatibleModels: string[];
  price: number;
  inStock: boolean;
  stockCount: number;
}

export interface Invoice {
  id: string;
  bookingId: string;
  serviceRecordId: string;
  totalAmount: number;
  partsTotal: number;
  labourTotal: number;
  taxes: number;
  paidStatus: 'paid' | 'unpaid' | 'pending';
  invoiceDate: string;
}

export interface AIConversationMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  suggestedAction?: {
    label: string;
    type: 'diagnosis' | 'mechanic' | 'upload';
  };
}
