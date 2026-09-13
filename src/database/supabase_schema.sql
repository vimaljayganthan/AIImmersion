-- ==============================================================================
-- DRIVEIQ PLATFORM - PRODUCTION SUPABASE POSTGRESQL SCHEMA
-- Fully relational, indexed, with RLS policies and timestamp triggers
-- ==============================================================================

-- 0. EXTENSIONS & SETUP
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Automatic timestamp update function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role VARCHAR(20) NOT NULL CHECK (role IN ('owner', 'mechanic', 'admin')),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(30),
    avatar_url TEXT,
    location VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);

DROP TRIGGER IF EXISTS trg_users_updated_at ON public.users;
CREATE TRIGGER trg_users_updated_at
BEFORE UPDATE ON public.users
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 2. VEHICLES TABLE
CREATE TABLE IF NOT EXISTS public.vehicles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    make VARCHAR(100) NOT NULL,
    model VARCHAR(100) NOT NULL,
    year INT NOT NULL CHECK (year BETWEEN 1900 AND 2100),
    fuel_type VARCHAR(50) NOT NULL CHECK (fuel_type IN ('Petrol', 'Diesel', 'Electric', 'Hybrid')),
    engine_capacity VARCHAR(50) NOT NULL,
    mileage INT NOT NULL DEFAULT 0,
    reg_number VARCHAR(50) NOT NULL,
    vin VARCHAR(100),
    color VARCHAR(50),
    health_score INT NOT NULL DEFAULT 100 CHECK (health_score BETWEEN 0 AND 100),
    last_serviced_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_vehicles_owner ON public.vehicles(owner_id);
CREATE INDEX IF NOT EXISTS idx_vehicles_reg ON public.vehicles(reg_number);

DROP TRIGGER IF EXISTS trg_vehicles_updated_at ON public.vehicles;
CREATE TRIGGER trg_vehicles_updated_at
BEFORE UPDATE ON public.vehicles
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 3. MECHANICS & WORKSHOPS TABLE
CREATE TABLE IF NOT EXISTS public.mechanics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    workshop_name VARCHAR(255) NOT NULL,
    rating NUMERIC(3,2) DEFAULT 5.0 CHECK (rating BETWEEN 0.0 AND 5.0),
    review_count INT DEFAULT 0,
    experience_years INT DEFAULT 0,
    phone VARCHAR(30) NOT NULL,
    address TEXT NOT NULL,
    latitude NUMERIC(9,6),
    longitude NUMERIC(9,6),
    working_hours VARCHAR(100) DEFAULT '09:00 AM - 07:00 PM',
    hourly_rate NUMERIC(10,2) DEFAULT 500.00,
    is_verified BOOLEAN DEFAULT FALSE,
    avatar_url TEXT,
    vehicle_types JSONB DEFAULT '["Bike", "Car"]'::jsonb,
    specializations JSONB DEFAULT '[]'::jsonb,
    services_offered JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_mechanics_user ON public.mechanics(user_id);
CREATE INDEX IF NOT EXISTS idx_mechanics_rating ON public.mechanics(rating);

DROP TRIGGER IF EXISTS trg_mechanics_updated_at ON public.mechanics;
CREATE TRIGGER trg_mechanics_updated_at
BEFORE UPDATE ON public.mechanics
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 4. MECHANIC SPECIALIZATIONS (Normalized auxiliary table)
CREATE TABLE IF NOT EXISTS public.mechanic_specializations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    mechanic_id UUID NOT NULL REFERENCES public.mechanics(id) ON DELETE CASCADE,
    specialization VARCHAR(100) NOT NULL,
    vehicle_type VARCHAR(50) NOT NULL CHECK (vehicle_type IN ('Bike', 'Car', 'Commercial'))
);

CREATE INDEX IF NOT EXISTS idx_specializations_mechanic ON public.mechanic_specializations(mechanic_id);

-- 5. DIAGNOSES TABLE (AIML Multi-Modal Predictions)
CREATE TABLE IF NOT EXISTS public.diagnoses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vehicle_id UUID NOT NULL REFERENCES public.vehicles(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    severity VARCHAR(20) NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    confidence INT NOT NULL CHECK (confidence BETWEEN 0 AND 100),
    possible_causes JSONB NOT NULL DEFAULT '[]'::jsonb,
    reasoning JSONB NOT NULL DEFAULT '[]'::jsonb,
    recommendation JSONB NOT NULL DEFAULT '{}'::jsonb,
    estimated_cost JSONB NOT NULL DEFAULT '{}'::jsonb,
    safety_warning TEXT,
    input_symptoms TEXT NOT NULL,
    additional_context JSONB DEFAULT '{}'::jsonb,
    media_urls JSONB DEFAULT '[]'::jsonb,
    evidence JSONB DEFAULT '[]'::jsonb,
    modalities_used JSONB DEFAULT '{"text": true, "audio": false, "image": false}'::jsonb,
    modality_breakdown JSONB DEFAULT '[]'::jsonb,
    category_probabilities JSONB DEFAULT '{}'::jsonb,
    model_info JSONB DEFAULT '{"name": "DriveIQ Fault Classifier", "version": "1.0"}'::jsonb,
    mechanic_feedback JSONB DEFAULT NULL,
    status VARCHAR(50) DEFAULT 'preliminary' CHECK (status IN ('preliminary', 'verified_by_mechanic', 'resolved')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_diagnoses_vehicle ON public.diagnoses(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_diagnoses_user ON public.diagnoses(user_id);
CREATE INDEX IF NOT EXISTS idx_diagnoses_status ON public.diagnoses(status);
CREATE INDEX IF NOT EXISTS idx_diagnoses_created ON public.diagnoses(created_at DESC);

DROP TRIGGER IF EXISTS trg_diagnoses_updated_at ON public.diagnoses;
CREATE TRIGGER trg_diagnoses_updated_at
BEFORE UPDATE ON public.diagnoses
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 6. DIAGNOSIS MEDIA ATTACHMENTS
CREATE TABLE IF NOT EXISTS public.diagnosis_media (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    diagnosis_id UUID NOT NULL REFERENCES public.diagnoses(id) ON DELETE CASCADE,
    media_type VARCHAR(20) NOT NULL CHECK (media_type IN ('image', 'audio')),
    file_url TEXT NOT NULL,
    description TEXT,
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_diagnosis_media_diagnosis ON public.diagnosis_media(diagnosis_id);

-- 7. BOOKINGS TABLE
CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_reference VARCHAR(50) UNIQUE NOT NULL,
    vehicle_id UUID NOT NULL REFERENCES public.vehicles(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    mechanic_id UUID NOT NULL REFERENCES public.mechanics(id) ON DELETE CASCADE,
    diagnosis_id UUID REFERENCES public.diagnoses(id) ON DELETE SET NULL,
    problem_summary TEXT NOT NULL,
    ai_preliminary_assessment TEXT,
    service_type VARCHAR(100) NOT NULL,
    appointment_date DATE NOT NULL,
    time_slot VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'vehicle_received', 'diagnosing', 'repairing', 'quality_check', 'completed', 'cancelled')),
    notes TEXT,
    estimated_total NUMERIC(10,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_bookings_user ON public.bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_mechanic ON public.bookings(mechanic_id);
CREATE INDEX IF NOT EXISTS idx_bookings_vehicle ON public.bookings(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(status);

DROP TRIGGER IF EXISTS trg_bookings_updated_at ON public.bookings;
CREATE TRIGGER trg_bookings_updated_at
BEFORE UPDATE ON public.bookings
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 8. SERVICE RECORDS TABLE
CREATE TABLE IF NOT EXISTS public.service_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
    vehicle_id UUID NOT NULL REFERENCES public.vehicles(id) ON DELETE CASCADE,
    mechanic_id UUID NOT NULL REFERENCES public.mechanics(id) ON DELETE CASCADE,
    mechanic_name VARCHAR(255) NOT NULL,
    workshop_name VARCHAR(255) NOT NULL,
    service_date DATE NOT NULL,
    title VARCHAR(255) NOT NULL,
    final_cost NUMERIC(10,2) NOT NULL,
    parts_replaced JSONB DEFAULT '[]'::jsonb,
    labour_cost NUMERIC(10,2) NOT NULL DEFAULT 0,
    mechanic_notes TEXT,
    mileage_at_service INT NOT NULL,
    next_service_due_mileage INT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_service_records_vehicle ON public.service_records(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_service_records_mechanic ON public.service_records(mechanic_id);

-- 9. MAINTENANCE RECORDS TABLE
CREATE TABLE IF NOT EXISTS public.maintenance_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vehicle_id UUID NOT NULL REFERENCES public.vehicles(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    component VARCHAR(100) NOT NULL,
    status VARCHAR(50) NOT NULL CHECK (status IN ('due_soon', 'upcoming', 'healthy')),
    due_mileage INT,
    estimated_km_remaining INT,
    due_date DATE,
    last_checked_date DATE NOT NULL,
    recommendation TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_maintenance_vehicle ON public.maintenance_records(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_maintenance_status ON public.maintenance_records(status);

-- 10. NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('info', 'alert', 'success', 'warning')),
    is_read BOOLEAN DEFAULT FALSE,
    link_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON public.notifications(is_read);

-- 11. REVIEWS TABLE
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    mechanic_id UUID NOT NULL REFERENCES public.mechanics(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    user_name VARCHAR(255) NOT NULL,
    user_avatar TEXT,
    rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_reviews_mechanic ON public.reviews(mechanic_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user ON public.reviews(user_id);

-- 12. SPARE PARTS INVENTORY TABLE
CREATE TABLE IF NOT EXISTS public.parts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    part_number VARCHAR(100) UNIQUE NOT NULL,
    category VARCHAR(100) NOT NULL,
    compatible_models JSONB DEFAULT '[]'::jsonb,
    price NUMERIC(10,2) NOT NULL,
    in_stock BOOLEAN DEFAULT TRUE,
    stock_count INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_parts_category ON public.parts(category);
CREATE INDEX IF NOT EXISTS idx_parts_sku ON public.parts(part_number);

-- 13. INVOICES TABLE
CREATE TABLE IF NOT EXISTS public.invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
    service_record_id UUID REFERENCES public.service_records(id) ON DELETE SET NULL,
    total_amount NUMERIC(10,2) NOT NULL,
    parts_total NUMERIC(10,2) NOT NULL DEFAULT 0,
    labour_total NUMERIC(10,2) NOT NULL DEFAULT 0,
    taxes NUMERIC(10,2) NOT NULL DEFAULT 0,
    paid_status VARCHAR(50) DEFAULT 'unpaid' CHECK (paid_status IN ('paid', 'unpaid', 'pending')),
    invoice_date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_invoices_booking ON public.invoices(booking_id);

-- 14. AI CONVERSATIONS TABLE
CREATE TABLE IF NOT EXISTS public.ai_conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE SET NULL,
    messages JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_ai_conv_user ON public.ai_conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_conv_vehicle ON public.ai_conversations(vehicle_id);

-- 15. USER SETTINGS & PREFERENCES TABLE
CREATE TABLE IF NOT EXISTS public.user_settings (
    user_id UUID PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
    profile JSONB NOT NULL DEFAULT '{}'::jsonb,
    ai_preferences JSONB NOT NULL DEFAULT '{}'::jsonb,
    notification_preferences JSONB NOT NULL DEFAULT '{}'::jsonb,
    appearance_preferences JSONB NOT NULL DEFAULT '{}'::jsonb,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mechanics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mechanic_specializations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.diagnoses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.diagnosis_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.maintenance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;

-- Permissive public/authenticated access policies for development and production API access
DO $$
DECLARE
    t text;
BEGIN
    FOR t IN 
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name IN (
            'users', 'vehicles', 'mechanics', 'mechanic_specializations', 
            'diagnoses', 'diagnosis_media', 'bookings', 'service_records', 
            'maintenance_records', 'notifications', 'reviews', 'parts', 
            'invoices', 'ai_conversations', 'user_settings'
        )
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS "Allow full access to %I" ON public.%I', t, t);
        EXECUTE format('CREATE POLICY "Allow full access to %I" ON public.%I FOR ALL USING (true) WITH CHECK (true)', t, t);
    END LOOP;
END $$;
