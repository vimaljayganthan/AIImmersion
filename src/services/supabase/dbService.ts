import { supabase, isSupabaseConfigured } from '../../config/supabase';
import {
  Vehicle,
  Diagnosis,
  Booking,
  Mechanic,
  ServiceRecord,
  MaintenanceRecord,
  NotificationItem,
  Review,
  Part,
  User,
  BookingStatus,
} from '../../types';
import {
  DEMO_USERS,
  DEMO_VEHICLES,
  DEMO_MECHANICS,
  DEMO_DIAGNOSES,
  DEMO_BOOKINGS,
  DEMO_SERVICE_RECORDS,
  DEMO_MAINTENANCE_RECORDS,
  DEMO_NOTIFICATIONS,
  DEMO_PARTS,
} from '../../database/mockData';

// Helper to check for table errors or missing schema
const handleDbError = (context: string, error: any) => {
  if (error) {
    console.warn(`[DriveIQ Supabase DB] ${context} error:`, error.message || error);
    return true;
  }
  return false;
};

// ==============================================================================
// 1. VEHICLES REPOSITORY
// ==============================================================================
export const vehiclesService = {
  async getVehicles(ownerId?: string): Promise<Vehicle[]> {
    if (!isSupabaseConfigured()) return DEMO_VEHICLES;

    try {
      let query = supabase.from('vehicles').select('*').order('created_at', { ascending: false });
      if (ownerId) {
        query = query.eq('owner_id', ownerId);
      }
      const { data, error } = await query;
      if (handleDbError('getVehicles', error) || !data || data.length === 0) {
        return DEMO_VEHICLES;
      }

      return data.map((v) => ({
        id: v.id,
        ownerId: v.owner_id,
        make: v.make,
        model: v.model,
        year: v.year,
        fuelType: v.fuel_type,
        engineCapacity: v.engine_capacity,
        mileage: v.mileage,
        regNumber: v.reg_number,
        vin: v.vin,
        color: v.color,
        healthScore: v.health_score,
        lastServicedAt: v.last_serviced_at,
        createdAt: v.created_at,
      }));
    } catch (err) {
      console.warn('[DriveIQ Supabase] Fetch vehicles failed, fallback to local', err);
      return DEMO_VEHICLES;
    }
  },

  async addVehicle(vehicle: Omit<Vehicle, 'id' | 'createdAt'>): Promise<Vehicle | null> {
    if (!isSupabaseConfigured()) {
      const newV: Vehicle = {
        ...vehicle,
        id: `veh_${Date.now()}`,
        createdAt: new Date().toISOString(),
      };
      return newV;
    }

    try {
      const payload = {
        owner_id: vehicle.ownerId,
        make: vehicle.make,
        model: vehicle.model,
        year: vehicle.year,
        fuel_type: vehicle.fuelType,
        engine_capacity: vehicle.engineCapacity,
        mileage: vehicle.mileage,
        reg_number: vehicle.regNumber,
        vin: vehicle.vin,
        color: vehicle.color,
        health_score: vehicle.healthScore || 100,
        last_serviced_at: vehicle.lastServicedAt,
      };

      const { data, error } = await supabase.from('vehicles').insert([payload]).select().single();
      if (handleDbError('addVehicle', error) || !data) {
        return {
          ...vehicle,
          id: `veh_${Date.now()}`,
          createdAt: new Date().toISOString(),
        };
      }

      return {
        id: data.id,
        ownerId: data.owner_id,
        make: data.make,
        model: data.model,
        year: data.year,
        fuelType: data.fuel_type,
        engineCapacity: data.engine_capacity,
        mileage: data.mileage,
        regNumber: data.reg_number,
        vin: data.vin,
        color: data.color,
        healthScore: data.health_score,
        lastServicedAt: data.last_serviced_at,
        createdAt: data.created_at,
      };
    } catch (err) {
      return {
        ...vehicle,
        id: `veh_${Date.now()}`,
        createdAt: new Date().toISOString(),
      };
    }
  },

  async updateMileage(vehicleId: string, mileage: number): Promise<boolean> {
    if (!isSupabaseConfigured()) return true;
    const { error } = await supabase.from('vehicles').update({ mileage }).eq('id', vehicleId);
    return !error;
  },
};

// ==============================================================================
// 2. DIAGNOSES REPOSITORY
// ==============================================================================
export const diagnosesService = {
  async getDiagnoses(userId?: string): Promise<Diagnosis[]> {
    if (!isSupabaseConfigured()) return DEMO_DIAGNOSES;

    try {
      let query = supabase.from('diagnoses').select('*').order('created_at', { ascending: false });
      if (userId) {
        query = query.eq('user_id', userId);
      }
      const { data, error } = await query;
      if (handleDbError('getDiagnoses', error) || !data || data.length === 0) {
        return DEMO_DIAGNOSES;
      }

      return data.map((d) => ({
        id: d.id,
        vehicleId: d.vehicle_id,
        userId: d.user_id,
        title: d.title,
        category: d.category,
        severity: d.severity,
        confidence: d.confidence,
        possibleCauses: d.possible_causes || [],
        reasoning: d.reasoning || [],
        recommendation: d.recommendation || {},
        estimatedCost: d.estimated_cost || {},
        safetyWarning: d.safety_warning,
        inputSymptoms: d.input_symptoms,
        additionalContext: d.additional_context,
        mediaUrls: d.media_urls,
        evidence: d.evidence,
        modalitiesUsed: d.modalities_used,
        modalityBreakdown: d.modality_breakdown,
        categoryProbabilities: d.category_probabilities,
        modelInfo: d.model_info,
        mechanicFeedback: d.mechanic_feedback,
        status: d.status,
        createdAt: d.created_at,
      }));
    } catch (err) {
      return DEMO_DIAGNOSES;
    }
  },

  async saveDiagnosis(diag: Omit<Diagnosis, 'id' | 'createdAt'>): Promise<Diagnosis | null> {
    if (!isSupabaseConfigured()) {
      return {
        ...diag,
        id: `diag_${Date.now()}`,
        createdAt: new Date().toISOString(),
      };
    }

    try {
      const payload = {
        vehicle_id: diag.vehicleId,
        user_id: diag.userId,
        title: diag.title,
        category: diag.category,
        severity: diag.severity,
        confidence: diag.confidence,
        possible_causes: diag.possibleCauses,
        reasoning: diag.reasoning,
        recommendation: diag.recommendation,
        estimated_cost: diag.estimatedCost,
        safety_warning: diag.safetyWarning,
        input_symptoms: diag.inputSymptoms,
        additional_context: diag.additionalContext,
        media_urls: diag.mediaUrls,
        evidence: diag.evidence,
        modalities_used: diag.modalitiesUsed,
        modality_breakdown: diag.modalityBreakdown,
        category_probabilities: diag.categoryProbabilities,
        model_info: diag.modelInfo,
        mechanic_feedback: diag.mechanicFeedback,
        status: diag.status || 'preliminary',
      };

      const { data, error } = await supabase.from('diagnoses').insert([payload]).select().single();
      if (handleDbError('saveDiagnosis', error) || !data) {
        return {
          ...diag,
          id: `diag_${Date.now()}`,
          createdAt: new Date().toISOString(),
        };
      }

      return {
        id: data.id,
        vehicleId: data.vehicle_id,
        userId: data.user_id,
        title: data.title,
        category: data.category,
        severity: data.severity,
        confidence: data.confidence,
        possibleCauses: data.possible_causes,
        reasoning: data.reasoning,
        recommendation: data.recommendation,
        estimatedCost: data.estimated_cost,
        safetyWarning: data.safety_warning,
        inputSymptoms: data.input_symptoms,
        additionalContext: data.additional_context,
        mediaUrls: data.media_urls,
        evidence: data.evidence,
        modalitiesUsed: data.modalities_used,
        modalityBreakdown: data.modality_breakdown,
        categoryProbabilities: data.category_probabilities,
        modelInfo: data.model_info,
        mechanicFeedback: data.mechanic_feedback,
        status: data.status,
        createdAt: data.created_at,
      };
    } catch (err) {
      return {
        ...diag,
        id: `diag_${Date.now()}`,
        createdAt: new Date().toISOString(),
      };
    }
  },
};

// ==============================================================================
// 3. BOOKINGS REPOSITORY
// ==============================================================================
export const bookingsService = {
  async getBookings(filter?: { userId?: string; mechanicId?: string }): Promise<Booking[]> {
    if (!isSupabaseConfigured()) return DEMO_BOOKINGS;

    try {
      let query = supabase.from('bookings').select('*').order('created_at', { ascending: false });
      if (filter?.userId) query = query.eq('user_id', filter.userId);
      if (filter?.mechanicId) query = query.eq('mechanic_id', filter.mechanicId);

      const { data, error } = await query;
      if (handleDbError('getBookings', error) || !data || data.length === 0) {
        return DEMO_BOOKINGS;
      }

      return data.map((b) => ({
        id: b.id,
        bookingReference: b.booking_reference,
        vehicleId: b.vehicle_id,
        userId: b.user_id,
        mechanicId: b.mechanic_id,
        diagnosisId: b.diagnosis_id,
        problemSummary: b.problem_summary,
        aiPreliminaryAssessment: b.ai_preliminary_assessment,
        serviceType: b.service_type,
        appointmentDate: b.appointment_date,
        timeSlot: b.time_slot,
        status: b.status,
        notes: b.notes,
        estimatedTotal: b.estimated_total ? Number(b.estimated_total) : undefined,
        createdAt: b.created_at,
      }));
    } catch (err) {
      return DEMO_BOOKINGS;
    }
  },

  async createBooking(booking: Omit<Booking, 'id' | 'createdAt'>): Promise<Booking | null> {
    if (!isSupabaseConfigured()) {
      return {
        ...booking,
        id: `book_${Date.now()}`,
        createdAt: new Date().toISOString(),
      };
    }

    try {
      const payload = {
        booking_reference: booking.bookingReference,
        vehicle_id: booking.vehicleId,
        user_id: booking.userId,
        mechanic_id: booking.mechanicId,
        diagnosis_id: booking.diagnosisId,
        problem_summary: booking.problemSummary,
        ai_preliminary_assessment: booking.aiPreliminaryAssessment,
        service_type: booking.serviceType,
        appointment_date: booking.appointmentDate,
        time_slot: booking.timeSlot,
        status: booking.status,
        notes: booking.notes,
        estimated_total: booking.estimatedTotal,
      };

      const { data, error } = await supabase.from('bookings').insert([payload]).select().single();
      if (handleDbError('createBooking', error) || !data) {
        return {
          ...booking,
          id: `book_${Date.now()}`,
          createdAt: new Date().toISOString(),
        };
      }

      return {
        id: data.id,
        bookingReference: data.booking_reference,
        vehicleId: data.vehicle_id,
        userId: data.user_id,
        mechanicId: data.mechanic_id,
        diagnosisId: data.diagnosis_id,
        problemSummary: data.problem_summary,
        aiPreliminaryAssessment: data.ai_preliminary_assessment,
        serviceType: data.service_type,
        appointmentDate: data.appointment_date,
        timeSlot: data.time_slot,
        status: data.status,
        notes: data.notes,
        estimatedTotal: data.estimated_total ? Number(data.estimated_total) : undefined,
        createdAt: data.created_at,
      };
    } catch (err) {
      return {
        ...booking,
        id: `book_${Date.now()}`,
        createdAt: new Date().toISOString(),
      };
    }
  },

  async updateBookingStatus(bookingId: string, status: BookingStatus): Promise<boolean> {
    if (!isSupabaseConfigured()) return true;
    const { error } = await supabase.from('bookings').update({ status }).eq('id', bookingId);
    return !error;
  },
};

// ==============================================================================
// 4. MECHANICS REPOSITORY
// ==============================================================================
export const mechanicsService = {
  async getMechanics(): Promise<Mechanic[]> {
    if (!isSupabaseConfigured()) return DEMO_MECHANICS;

    try {
      const { data, error } = await supabase.from('mechanics').select('*').order('rating', { ascending: false });
      if (handleDbError('getMechanics', error) || !data || data.length === 0) {
        return DEMO_MECHANICS;
      }

      return data.map((m) => ({
        id: m.id,
        userId: m.user_id,
        name: m.name,
        workshopName: m.workshop_name,
        rating: Number(m.rating),
        reviewCount: m.review_count,
        distanceKm: 2.5, // Computed or default
        experienceYears: m.experience_years,
        phone: m.phone,
        address: m.address,
        workingHours: m.working_hours,
        specializations: m.specializations || [],
        servicesOffered: m.services_offered || [],
        hourlyRate: Number(m.hourly_rate),
        isVerified: m.is_verified,
        avatar: m.avatar_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
        vehicleTypes: m.vehicle_types || ['Bike', 'Car'],
      }));
    } catch (err) {
      return DEMO_MECHANICS;
    }
  },
};

// ==============================================================================
// 5. SPARE PARTS REPOSITORY
// ==============================================================================
export const partsService = {
  async getParts(): Promise<Part[]> {
    if (!isSupabaseConfigured()) return DEMO_PARTS;

    try {
      const { data, error } = await supabase.from('parts').select('*').order('name');
      if (handleDbError('getParts', error) || !data || data.length === 0) {
        return DEMO_PARTS;
      }

      return data.map((p) => ({
        id: p.id,
        name: p.name,
        partNumber: p.part_number,
        category: p.category,
        compatibleModels: p.compatible_models || [],
        price: Number(p.price),
        inStock: p.in_stock,
        stockCount: p.stock_count,
      }));
    } catch (err) {
      return DEMO_PARTS;
    }
  },
};

// ==============================================================================
// 6. SERVICE RECORDS & MAINTENANCE REPOSITORY
// ==============================================================================
export const maintenanceService = {
  async getServiceRecords(vehicleId?: string): Promise<ServiceRecord[]> {
    if (!isSupabaseConfigured()) return DEMO_SERVICE_RECORDS;

    try {
      let query = supabase.from('service_records').select('*').order('service_date', { ascending: false });
      if (vehicleId) query = query.eq('vehicle_id', vehicleId);
      const { data, error } = await query;
      if (handleDbError('getServiceRecords', error) || !data || data.length === 0) {
        return DEMO_SERVICE_RECORDS;
      }

      return data.map((s) => ({
        id: s.id,
        bookingId: s.booking_id,
        vehicleId: s.vehicle_id,
        mechanicId: s.mechanic_id,
        mechanicName: s.mechanic_name,
        workshopName: s.workshop_name,
        serviceDate: s.service_date,
        title: s.title,
        finalCost: Number(s.final_cost),
        partsReplaced: s.parts_replaced || [],
        labourCost: Number(s.labour_cost),
        mechanicNotes: s.mechanic_notes,
        mileageAtService: s.mileage_at_service,
        nextServiceDueMileage: s.next_service_due_mileage,
      }));
    } catch (err) {
      return DEMO_SERVICE_RECORDS;
    }
  },

  async getMaintenanceRecords(vehicleId?: string): Promise<MaintenanceRecord[]> {
    if (!isSupabaseConfigured()) return DEMO_MAINTENANCE_RECORDS;

    try {
      let query = supabase.from('maintenance_records').select('*');
      if (vehicleId) query = query.eq('vehicle_id', vehicleId);
      const { data, error } = await query;
      if (handleDbError('getMaintenanceRecords', error) || !data || data.length === 0) {
        return DEMO_MAINTENANCE_RECORDS;
      }

      return data.map((m) => ({
        id: m.id,
        vehicleId: m.vehicle_id,
        title: m.title,
        component: m.component,
        status: m.status,
        dueMileage: m.due_mileage,
        estimatedKmRemaining: m.estimated_km_remaining,
        dueDate: m.due_date,
        lastCheckedDate: m.last_checked_date,
        recommendation: m.recommendation,
      }));
    } catch (err) {
      return DEMO_MAINTENANCE_RECORDS;
    }
  },
};

// ==============================================================================
// 7. NOTIFICATIONS REPOSITORY
// ==============================================================================
export const notificationsService = {
  async getNotifications(userId?: string): Promise<NotificationItem[]> {
    if (!isSupabaseConfigured()) return DEMO_NOTIFICATIONS;

    try {
      let query = supabase.from('notifications').select('*').order('created_at', { ascending: false });
      if (userId) query = query.eq('user_id', userId);
      const { data, error } = await query;
      if (handleDbError('getNotifications', error) || !data || data.length === 0) {
        return DEMO_NOTIFICATIONS;
      }

      return data.map((n) => ({
        id: n.id,
        userId: n.user_id,
        title: n.title,
        message: n.message,
        type: n.type,
        read: n.is_read,
        link: n.link_url,
        createdAt: n.created_at,
      }));
    } catch (err) {
      return DEMO_NOTIFICATIONS;
    }
  },

  async markAsRead(notificationId: string): Promise<boolean> {
    if (!isSupabaseConfigured()) return true;
    const { error } = await supabase.from('notifications').update({ is_read: true }).eq('id', notificationId);
    return !error;
  },
};
