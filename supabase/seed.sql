-- ==============================================================================
-- DRIVEIQ PLATFORM - INITIAL SEED DATA FOR SUPABASE
-- Production-ready seed data matching DriveIQ data models
-- ==============================================================================

-- 1. USERS
INSERT INTO public.users (id, role, name, email, phone, location, avatar_url)
VALUES
    ('a0000000-0000-0000-0000-000000000001', 'owner', 'Alex Sharma', 'owner@driveiq.ai', '+91 98765 43210', 'Indiranagar, Bengaluru', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'),
    ('a0000000-0000-0000-0000-000000000002', 'mechanic', 'Rajesh Kumar', 'mechanic@driveiq.ai', '+91 91234 56789', 'Koramangala, Bengaluru', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'),
    ('a0000000-0000-0000-0000-000000000003', 'admin', 'Dr. Sarah Chen', 'admin@driveiq.ai', '+91 99887 76655', 'Platform HQ, Bengaluru', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150')
ON CONFLICT (email) DO UPDATE SET
    name = EXCLUDED.name,
    phone = EXCLUDED.phone,
    location = EXCLUDED.location,
    role = EXCLUDED.role;

-- 2. VEHICLES
INSERT INTO public.vehicles (id, owner_id, make, model, year, fuel_type, engine_capacity, mileage, reg_number, vin, color, health_score, last_serviced_at)
VALUES
    ('b0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'Yamaha', 'MT-15 V2', 2023, 'Petrol', '155cc', 14200, 'KA-01-EQ-9876', 'ME4RG1234NP567890', 'Metallic Black', 88, '2026-06-10T00:00:00Z'),
    ('b0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 'Honda', 'City ZX', 2021, 'Petrol', '1.5L i-VTEC', 42500, 'KA-03-MB-4521', 'MAKGM6650LN102938', 'Platinum White Pearl', 76, '2026-04-18T00:00:00Z')
ON CONFLICT (id) DO NOTHING;

-- 3. MECHANICS
INSERT INTO public.mechanics (id, user_id, name, workshop_name, rating, review_count, experience_years, phone, address, latitude, longitude, working_hours, hourly_rate, is_verified, avatar_url, vehicle_types, specializations, services_offered)
VALUES
    ('c0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000002', 'Rajesh Kumar', 'Kumar Motors Workshop', 4.9, 142, 14, '+91 91234 56789', '80ft Road, 4th Block, Koramangala, Bengaluru', 12.9352, 77.6245, '08:30 AM - 07:30 PM', 550.00, true, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', '["Bike", "Car"]'::jsonb, '["Engine Diagnostics", "Brake Overhaul", "Electrical & ECU", "Clutch Replacement"]'::jsonb, '["Full Periodic Service", "AI Diagnostic Verification", "Brake Pad & Rotor Replacement", "Clutch Plate Overhaul", "Battery & Electrical Diagnostic", "Coolant Flush & Thermostat Replacement"]'::jsonb),
    ('c0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000002', 'Sunil Deshmukh', 'Apex Speed & Performance', 4.8, 98, 11, '+91 98765 12345', '100ft Road, Indiranagar, Bengaluru', 12.9784, 77.6408, '09:00 AM - 08:00 PM', 650.00, true, 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', '["Bike", "Car"]'::jsonb, '["Fuel Injection Calibration", "Suspension Tuning", "Acoustic Noise Isolation", "Radiator Repair"]'::jsonb, '["ECU Scanning & Remapping", "Acoustic NVH Diagnostic Inspection", "Suspension Strut Rebuild", "Transmission Fluid Service"]'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- 4. SPARE PARTS INVENTORY
INSERT INTO public.parts (id, name, part_number, category, compatible_models, price, in_stock, stock_count)
VALUES
    ('d0000000-0000-0000-0000-000000000001', 'High Performance Sintered Front Brake Pads', 'BP-YAM-MT15-F', 'Brakes', '["Yamaha MT-15", "Yamaha R15 V4"]'::jsonb, 850.00, true, 24),
    ('d0000000-0000-0000-0000-000000000002', 'Heavy Duty Starter Solenoid Relay (12V 30A)', 'REL-STARTER-12V', 'Electrical', '["Yamaha MT-15", "KTM Duke 200", "Bajaj Pulsar NS200"]'::jsonb, 420.00, true, 18),
    ('d0000000-0000-0000-0000-000000000003', 'OEM Complete Clutch Friction Plate Set', 'CLU-SET-YAM-155', 'Transmission', '["Yamaha MT-15", "Yamaha R15 V3", "Yamaha R15 V4"]'::jsonb, 1850.00, true, 12),
    ('d0000000-0000-0000-0000-000000000004', 'Automotive 82°C Engine Thermostat Valve', 'THM-HON-CITY-82', 'Cooling System', '["Honda City 2014-2023", "Honda Amaze"]'::jsonb, 1150.00, true, 9),
    ('d0000000-0000-0000-0000-000000000005', 'Maintenance Free AGM 12V 5Ah Battery', 'BAT-EXIDE-12V5AH', 'Battery', '["Yamaha MT-15", "Royal Enfield Hunter 350", "KTM 250"]'::jsonb, 1950.00, true, 15),
    ('d0000000-0000-0000-0000-000000000006', 'High Efficiency Engine Air Filter Element', 'AF-HON-CITY-1.5', 'Filters', '["Honda City 2020-2024"]'::jsonb, 650.00, true, 30)
ON CONFLICT (part_number) DO NOTHING;

-- 5. DIAGNOSES SEED
INSERT INTO public.diagnoses (id, vehicle_id, user_id, title, category, severity, confidence, possible_causes, reasoning, recommendation, estimated_cost, safety_warning, input_symptoms, additional_context, evidence, modalities_used, modality_breakdown, category_probabilities, model_info, status)
VALUES
    (
        'e0000000-0000-0000-0000-000000000001',
        'b0000000-0000-0000-0000-000000000001',
        'a0000000-0000-0000-0000-000000000001',
        'Starter Motor Relay Rapid Clicking / Voltage Drop',
        'Electrical & Starter System',
        'high',
        92,
        '[{"name": "Discharged or Weak 12V Battery Under Starter Load", "confidence": 0.88, "description": "Terminal voltage collapsing below 9.6V during ignition key engagement causing starter solenoid rapid chatter."}, {"name": "Oxidized Starter Relay / High Resistance Terminal", "confidence": 0.72, "description": "Corrosion on 30A starter relay leads impeding inrush current to starter motor windings."}]'::jsonb,
        '["Acoustic 12Hz rapid rhythmic metallic click matches classic solenoid armature pulsation.", "Reported electrical symptom (dash lights dimming when starter button is depressed) indicates high internal resistance in battery plates."]'::jsonb,
        '{"priority": "high", "action": "Perform 12V battery load test using multimeter; check terminal lead tightness and inspect 30A starter solenoid.", "avoid": "Do not continuously hold the ignition starter button for more than 5 seconds as it can overheat starter brushes."}'::jsonb,
        '{"min": 600, "max": 2400, "currency": "INR", "partsCost": 1950, "labourCost": 350, "inspectionCost": 100}'::jsonb,
        'Vehicle may stall or fail to restart if turned off in heavy traffic.',
        'Rapid clicking sound when pressing starter button, bike refuses to crank or start, headlights dim visibly.',
        '{"startsReliably": false, "warningLights": true, "startedWhen": "Yesterday morning after rainfall"}'::jsonb,
        '[{"category": "Acoustics", "modality": "Audio", "observation": "12Hz Solenoid Chattering Signature Detected", "confidence_contribution": 0.94}, {"category": "Text Telemetry", "modality": "Text", "observation": "Starting Failure + Dimming Load Pattern", "confidence_contribution": 0.90}]'::jsonb,
        '{"text": true, "audio": true, "image": false}'::jsonb,
        '[{"modality": "Acoustic Waveform", "weight": 0.60, "raw_confidence": 0.94, "predicted_category": "Electrical & Starter"}, {"modality": "Natural Language Symptom", "weight": 0.40, "raw_confidence": 0.90, "predicted_category": "Electrical & Starter"}]'::jsonb,
        '{"Electrical & Starter": 0.92, "Battery": 0.85, "Engine Mechanical": 0.05}'::jsonb,
        '{"name": "DriveIQ Fault Classifier", "version": "2.4", "model_type": "TF-IDF + Random Forest (Late Multimodal Fusion)"}'::jsonb,
        'preliminary'
    )
ON CONFLICT (id) DO NOTHING;

-- 6. BOOKINGS SEED
INSERT INTO public.bookings (id, booking_reference, vehicle_id, user_id, mechanic_id, diagnosis_id, problem_summary, ai_preliminary_assessment, service_type, appointment_date, time_slot, status, notes, estimated_total)
VALUES
    (
        'f0000000-0000-0000-0000-000000000001',
        'DIQ-2026-8891',
        'b0000000-0000-0000-0000-000000000001',
        'a0000000-0000-0000-0000-000000000001',
        'c0000000-0000-0000-0000-000000000001',
        'e0000000-0000-0000-0000-000000000001',
        'Starter motor clicking and ignition failure verification',
        'High probability of battery terminal voltage drop or starter relay oxidation (92% Confidence).',
        'Electrical & Starter Diagnosis',
        CURRENT_DATE + INTERVAL '2 days',
        '10:30 AM - 11:30 AM',
        'accepted',
        'Customer reported symptoms started after heavy rain. AI report attached.',
        2300.00
    )
ON CONFLICT (booking_reference) DO NOTHING;

-- 7. SERVICE RECORDS SEED
INSERT INTO public.service_records (id, vehicle_id, mechanic_id, mechanic_name, workshop_name, service_date, title, final_cost, parts_replaced, labour_cost, mechanic_notes, mileage_at_service, next_service_due_mileage)
VALUES
    (
        'a1000000-0000-0000-0000-000000000001',
        'b0000000-0000-0000-0000-000000000001',
        'c0000000-0000-0000-0000-000000000001',
        'Rajesh Kumar',
        'Kumar Motors Workshop',
        '2026-06-10',
        '10,000 km Periodic Service + Synthetic Oil Change',
        2450.00,
        '[{"name": "Yamalube 10W-40 Fully Synthetic Oil", "cost": 1150}, {"name": "OEM Oil Filter Element", "cost": 180}, {"name": "Chain Cleaner & Lubricant Lube", "cost": 320}]'::jsonb,
        800.00,
        'Engine oil replaced with fully synthetic 10W40. Drive chain cleaned, slack adjusted to 25mm. Front & rear brake pads measured at 3.8mm remaining.',
        10150,
        15000
    )
ON CONFLICT (id) DO NOTHING;

-- 8. MAINTENANCE RECORDS SEED
INSERT INTO public.maintenance_records (id, vehicle_id, title, component, status, due_mileage, estimated_km_remaining, due_date, last_checked_date, recommendation)
VALUES
    ('a2000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', '15,000 km Scheduled Service', 'General Periodic Maintenance', 'upcoming', 15000, 800, CURRENT_DATE + INTERVAL '25 days', CURRENT_DATE - INTERVAL '10 days', 'Engine oil change, air filter replacement, spark plug gap check and brake pad inspection.'),
    ('a2000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000001', 'Brake Fluid Dot 4 Flush', 'Hydraulic Brake Lines', 'healthy', 20000, 5800, CURRENT_DATE + INTERVAL '120 days', CURRENT_DATE - INTERVAL '40 days', 'Brake fluid moisture content is within optimal range (1.2%). Next flush due at 20,000 km.')
ON CONFLICT (id) DO NOTHING;

-- 9. NOTIFICATIONS SEED
INSERT INTO public.notifications (id, user_id, title, message, type, is_read, link_url)
VALUES
    ('a3000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'Booking Confirmed by Workshop', 'Kumar Motors Workshop has accepted your appointment for Electrical & Starter Diagnosis on Thursday at 10:30 AM.', 'success', false, '/owner/bookings'),
    ('a3000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 'Maintenance Reminder', 'Your Yamaha MT-15 V2 is 800 km away from its scheduled 15,000 km periodic service interval.', 'alert', false, '/owner/maintenance')
ON CONFLICT (id) DO NOTHING;

-- 10. REVIEWS SEED
INSERT INTO public.reviews (id, mechanic_id, user_id, user_name, user_avatar, rating, comment)
VALUES
    ('a4000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'Alex Sharma', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', 5, 'Rajesh quickly verified the AI diagnostic report for my clutch issue. Replaced parts with transparent pricing and zero surprise charges! Highly recommend.'),
    ('a4000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'Priya Menon', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', 5, 'Clean workshop, digital job card, and excellent turnaround time for periodic maintenance.')
ON CONFLICT (id) DO NOTHING;
