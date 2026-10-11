# DriveIQ — Intelligent Vehicle Diagnostics & Service Platform

[![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=black)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110+-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Scikit-Learn](https://img.shields.io/badge/Scikit--Learn-1.4+-F7931E?logo=scikit-learn&logoColor=white)](https://scikit-learn.org/)
[![Vitest](https://img.shields.io/badge/Vitest-5.0+-6E9F18?logo=vitest&logoColor=white)](https://vitest.dev/)
[![Pytest](https://img.shields.io/badge/Pytest-9.0+-0A9EDC?logo=pytest&logoColor=white)](https://docs.pytest.org/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL_15-3ECF8E?logo=supabase&logoColor=white)](https://supabase.com/)

**DriveIQ** is an enterprise-grade, multimodal intelligent automotive diagnosis and workshop service-management platform. It unifies authentic machine learning inference (NLP symptom classification, acoustic spectral analysis, and computer vision warning lamp detection), transparent repair cost estimation, verified mechanic discovery, digital job card tracking, and full cloud database persistence via Supabase PostgreSQL.

---

## 📑 Table of Contents

1. [Project Overview](#1-project-overview)
2. [Problem Statement](#2-problem-statement)
3. [Solution Overview](#3-solution-overview)
4. [System Architecture](#4-system-architecture)
5. [Technology Stack](#5-technology-stack)
6. [Project Structure](#6-project-structure)
7. [Installation & Setup](#7-installation--setup)
8. [Environment Variables](#8-environment-variables)
9. [Running Frontend](#9-running-frontend)
10. [Running Backend](#10-running-backend)
11. [Database Setup](#11-database-setup)
12. [AI/ML Diagnostic Pipeline](#12-aiml-diagnostic-pipeline)
13. [API Documentation](#13-api-documentation)
14. [Database Schema](#14-database-schema)
15. [Error Handling & Error Boundaries](#15-error-handling--error-boundaries)
16. [Testing & Quality Assurance](#16-testing--quality-assurance)
17. [Test Cases & Verification Matrix](#17-test-cases--verification-matrix)
18. [How to Run Tests](#18-how-to-run-tests)
19. [Expected Test Results](#19-expected-test-results)
20. [Future Improvements](#20-future-improvements)

---

## 1. Project Overview

DriveIQ bridges the critical trust and technical gap between vehicle owners, automotive workshops, and fleet operators. Rather than relying on static questionnaires or opaque repair quotes, DriveIQ employs a **Multimodal Late-Fusion Machine Learning Engine** running alongside a **Contextual Vehicle AI Assistant**. 

Drivers describe symptoms in natural language, record engine audio sounds, or upload dashboard photos. DriveIQ breaks down the fault probability across 8 major automotive subsystems, provides transparent labor/parts cost projections, and facilitates seamless 1-click appointment booking with verified local mechanics.

---

## 2. Problem Statement

Automotive maintenance suffers from four chronic industry problems:
1. **Information Asymmetry**: Vehicle owners struggle to articulate mechanical problems accurately and frequently face inflated repair estimates from unvetted workshops.
2. **Delayed Intervention**: Subtle mechanical acoustic cues (e.g., valve tappet ticking, worn brake pad squeal, alternator bearing hum) are ignored until catastrophic component failure occurs.
3. **Fragmented Workflows**: Diagnostic scanning, price estimation, mechanic discovery, booking, and service record keeping exist in isolated, non-interoperable tools.
4. **Opaque Diagnostic Logic**: Most automotive software treats diagnostics as a "black box" without explaining feature weights, probability distributions, or underlying mechanical evidence.

---

## 3. Solution Overview

DriveIQ resolves these challenges through an integrated 3-portal architecture:
- **Vehicle Owner Portal (`/owner`)**: Digital garage fleet management, 4-stage ML diagnostic inspector, contextual multi-turn AI assistant, transparent cost breakdown, and instant workshop booking.
- **Mechanic Pro Portal (`/mechanic`)**: Real-time workshop bay Kanban manager (`pending` → `accepted` → `vehicle_received` → `diagnosing` → `repairing` → `quality_check` → `completed`), AI diagnosis verification, inventory management, and invoice tracking.
- **SuperAdmin Console (`/admin`)**: Ecosystem oversight, telemetry audit, Stratified 5-Fold Cross-Validation metrics inspection, user/mechanic directory controls, and platform revenue monitoring.

---

## 4. System Architecture

```
                       ┌─────────────────────────────────────────┐
                       │          DriveIQ Main Entry             │
                       │          http://localhost:5173          │
                       └────────────────────┬────────────────────┘
                                            │
         ┌──────────────────────────────────┼──────────────────────────────────┐
         ▼                                  ▼                                  ▼
┌───────────────────┐              ┌───────────────────┐              ┌───────────────────┐
│   Vehicle Owner   │              │   Mechanic Pro    │              │   SuperAdmin      │
│      Portal       │              │      Portal       │              │     Console       │
│      /owner       │              │    /mechanic      │              │     /admin        │
└────────┬──────────┘              └────────┬──────────┘              └────────┬──────────┘
         │                                  │                                  │
         ├► My Garage & Fleet               ├► Active Bay Kanban               ├► Platform Overview
         ├► Multimodal AI Scan              ├► Incoming Bookings               ├► User & Garage Registry
         ├► Contextual AI Assistant         ├► Job Cards & Inspections         ├► Fleet Health Audit
         ├► Repair Cost Estimator           ├► Parts Inventory & Stock         ├► ML Model Telemetry
         ├► Verified Mechanic Booking       ├► Customer Directory              ├► Database Health
         └► Service Records & History       └► Earnings & Invoice Tracking     └► System Configuration
                                            │
                                            ▼
                     ┌──────────────────────────────────────────────┐
                     │          DriveIQ Service Layer               │
                     │  - apiAiService (FastAPI client + fallback)  │
                     │  - dbService (Supabase Repository Layer)     │
                     │  - AuthContext (RBAC & Session Manager)      │
                     └───────────────┬──────────────┬───────────────┘
                                     │              │
                   HTTP/REST (Port 8000)            PostgreSQL / REST
                                     ▼              ▼
                     ┌──────────────────────┐  ┌────────────────────┐
                     │   FastAPI Backend    │  │ Supabase Cloud DB  │
                     │ - TF-IDF NLP         │  │ - 15 Indexed Tables│
                     │ - Random Forest      │  │ - RLS Security     │
                     │ - Acoustic Feature   │  │ - Cascade Triggers │
                     │ - Vision Processing  │  │ - Storage Buckets  │
                     │ - Late Fusion Engine │  └────────────────────┘
                     └──────────────────────┘
```

---

## 5. Technology Stack

| Layer | Technologies | Purpose |
| :--- | :--- | :--- |
| **Frontend UI** | React 18.3, TypeScript 5.6, Vite 6.0, Tailwind CSS 3.4 | High-performance SPA with strict typing and responsive layout |
| **Icons & Design** | Lucide React, Glassmorphism, Slate Design System | Visual indicators, status badges, interactive cards |
| **State Management** | React Context (`AuthContext`, `DataContext`, `SettingsContext`) | Decoupled domain state with synchronized localStorage fallback |
| **Frontend Testing** | Vitest 5.0, React Testing Library 16.3, JSDOM 30.1 | Unit testing for auth, vehicles, bookings, diagnoses, error boundaries |
| **Backend API** | Python 3.10+, FastAPI, Uvicorn, Pydantic v2, Python-Multipart | Asynchronous high-throughput diagnostic REST API |
| **Machine Learning** | Scikit-Learn 1.4+, Pandas, NumPy, Joblib | TF-IDF Vectorizer, Random Forest (150 estimators), multiclass inference |
| **Signal & Vision** | Librosa, Soundfile, OpenCV Python, Pillow | Acoustic spectral feature extraction (MFCCs), visual edge/color analysis |
| **Backend Testing** | Pytest 9.1+, HTTPX, FastAPI TestClient | Full test suite covering endpoints, ML pipelines, error handling, fusion |
| **Database & Auth** | Supabase (PostgreSQL 15), RLS Policies, Triggers | Relational data persistence with automatic timestamp triggers and foreign keys |

---

## 6. Project Structure

```
.
├── backend/                              # Python FastAPI & AIML Diagnostic Subsystem
│   ├── app/
│   │   ├── api/
│   │   │   ├── assistant.py             # AI Assistant multi-turn chat (/api/assistant/chat)
│   │   │   └── diagnosis.py             # ML pipeline & diagnosis endpoints (/api/diagnosis, /api/ml/pipeline)
│   │   ├── data/
│   │   │   └── vehicle_faults_dataset.csv # Structured 8-category vehicle faults training dataset
│   │   ├── models/
│   │   │   ├── audio_model.py           # Librosa acoustic feature extractor & analyzer
│   │   │   ├── fusion.py                # Late Multimodal Decision Fusion Engine
│   │   │   ├── image_model.py           # OpenCV computer vision feature extractor & analyzer
│   │   │   └── text_model.py            # TF-IDF Vectorizer + Random Forest text classifier
│   │   ├── saved_models/
│   │   │   ├── model_evaluation.json    # Stratified 5-Fold cross-validation metrics
│   │   │   ├── text_rf_model.joblib     # Serialized Random Forest model artifact
│   │   │   └── tfidf_vectorizer.joblib  # Serialized TF-IDF vectorizer artifact
│   │   ├── schemas/
│   │   │   └── diagnosis.py             # Pydantic request/response schemas
│   │   ├── services/
│   │   │   └── diagnosis_service.py     # Multimodal orchestration service
│   │   └── main.py                      # FastAPI entry point, CORS, and centralized exception handlers
│   ├── evaluation/
│   │   └── evaluate_models.py           # Stratified 5-fold cross-validation evaluation script
│   ├── tests/                           # Pytest test suite (61 tests)
│   │   ├── __init__.py
│   │   ├── conftest.py                  # Pytest fixtures (TestClient, synthetic WAV/JPEG generators)
│   │   ├── test_api_endpoints.py        # Integration tests for all REST routes
│   │   ├── test_audio_model.py          # Acoustic feature extraction & classification tests
│   │   ├── test_diagnosis_cases.py      # Edge cases, unknown symptoms, probability integrity
│   │   ├── test_error_handling.py       # 400/404/405/422/500 status code & failure tests
│   │   ├── test_fusion.py               # Late multimodal decision fusion tests
│   │   ├── test_image_model.py          # OpenCV visual processing tests
│   │   └── test_text_model.py           # NLP TF-IDF & Random Forest unit tests
│   ├── training/
│   │   ├── train_audio_model.py         # Acoustic model training interface
│   │   ├── train_image_model.py         # Vision model training interface
│   │   └── train_text_model.py          # Text classifier training pipeline
│   └── requirements.txt                 # Pinned Python backend dependencies
├── src/                                  # React 18 TypeScript Frontend
│   ├── auth/                            # Authentication context, modal, and ProtectedRoute guards
│   ├── components/                      # UI components (Cards, Badges, Modals, Charts, ErrorBoundary)
│   │   └── common/
│   │       └── ErrorBoundary.tsx        # Branded React Error Boundary with recovery actions & telemetry
│   ├── config/                          # API and Supabase client configuration
│   ├── context/                         # Global state management (DataContext, SettingsContext)
│   ├── database/                        # Database schemas, mock fallback data, seed scripts
│   ├── layouts/                         # DashboardLayout with nested ErrorBoundary around Outlet
│   ├── pages/                           # Role-based application views
│   │   ├── admin/                       # SuperAdmin console views
│   │   ├── auth/                        # Login & Registration views
│   │   ├── mechanic/                    # Mechanic Pro portal views
│   │   ├── owner/                       # Vehicle Owner portal views
│   │   └── settings/                    # Global user settings views
│   ├── services/                        # API adapters (FastAPI client, Supabase database client)
│   │   ├── ai/                          # apiAiService, mockAiService, assistantEngine
│   │   └── supabase/                    # dbService repository layer
│   ├── test/                            # Vitest + React Testing Library test suite (35 tests)
│   │   ├── setup.ts                     # Test setup and Supabase mocking
│   │   ├── auth.test.ts                 # Authentication & RBAC unit tests
│   │   ├── bookings.test.ts             # Service booking lifecycle unit tests
│   │   ├── diagnosis.test.ts            # Diagnostic pipeline & AI adapter unit tests
│   │   ├── errorBoundary.test.tsx       # Error Boundary rendering & recovery unit tests
│   │   └── vehicles.test.ts             # Vehicle management unit tests
│   ├── types/                           # Shared TypeScript domain interfaces
│   ├── App.tsx                          # React router definition
│   └── main.tsx                         # Frontend DOM mount wrapped in ErrorBoundary
├── supabase/                            # Supabase cloud schema migrations & seed data
│   ├── schema.sql                       # Full PostgreSQL schema with tables, indexes, triggers
│   ├── seed.sql                         # Seed data for demo garages and mechanics
│   └── setup_full.sql                   # Complete setup bundle
├── package.json                         # Node dependencies & test scripts
├── vite.config.ts                       # Vite & Vitest configuration
└── tsconfig.json                        # TypeScript compiler configuration
```

---

## 7. Installation & Setup

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **Python**: v3.10.0 or higher
- **pip**: v23.0+

### Clone & Install Dependencies

```bash
# 1. Clone repository
git clone https://github.com/vimaljayganthan/AIImmersion.git
cd "AI Immersion 1"

# 2. Install Frontend Node Dependencies
npm install

# 3. Install Backend Python Dependencies
cd backend
pip install -r requirements.txt
cd ..
```

---

## 8. Environment Variables

Create a `.env` file in the project root directory:

```env
# Backend API Base URL
VITE_ML_API_URL=http://localhost:8000

# Supabase PostgreSQL Configuration
VITE_SUPABASE_URL=https://scgzcxslqewxqewblkwc.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_UAPy5l8W57aMMHbggyKjfw_MvHtJI8j
```

> **Note on Offline Resilience**: If Supabase credentials are not provided or if the remote database is unreachable, DriveIQ automatically activates its built-in repository fallback layer (`mockData.ts`), ensuring zero crashes during local development, test execution, or offline evaluation.

---

## 9. Running Frontend

Start the Vite development server:

```bash
npm run dev
```

The application will start on **http://localhost:5173**.

To create a production bundle:
```bash
npm run build
```

---

## 10. Running Backend

Start the FastAPI Uvicorn server:

```bash
cd backend
python3 -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

The backend API will be available at **http://localhost:8000**.
- **Interactive Swagger Documentation**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **Interactive ReDoc Documentation**: [http://localhost:8000/redoc](http://localhost:8000/redoc)

---

## 11. Database Setup

DriveIQ is powered by a relational PostgreSQL database hosted on Supabase.

1. Navigate to your [Supabase Dashboard](https://supabase.com/).
2. Open the **SQL Editor**.
3. Execute the schema definitions from [supabase/schema.sql](file:///Users/vimaljayganthan/Documents/AI%20Immersion%201/supabase/schema.sql).
4. Optionally run [supabase/seed.sql](file:///Users/vimaljayganthan/Documents/AI%20Immersion%201/supabase/seed.sql) to populate initial demo vehicles, workshops, and parts inventory.

---

## 12. AI/ML Diagnostic Pipeline

The core machine learning engine runs a **4-Stage Deterministic Pipeline** coupled with **Late Multimodal Decision Fusion**:

```
                       User Symptom Description
                                   │
                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│ STAGE 1: Text Preprocessing & Tokenization                             │
│ - Lowercase text normalization & punctuation stripping                │
│ - Extraction of alphabetic tokens with length > 2                      │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │
                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│ STAGE 2: Sparse TF-IDF Feature Extraction                              │
│ - (1, 2) N-gram range extraction (unigrams & bigrams)                  │
│ - Sublinear term frequency scaling: 1 + log(tf)                        │
│ - Matches against 600-term automotive diagnostic vocabulary            │
│ - Extracts active nonzero feature weights                              │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │
                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│ STAGE 3: Ensemble Classification & Probabilistic Inference             │
│ - 150-estimator Random Forest Classifier with balanced class weights   │
│ - Computes posterior probability distribution P(Category | Symptoms)  │
│ - Evaluates 8 discrete mechanical subsystems                           │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │
                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│ STAGE 4: Mechanical Advisory & Severity Synthesis                      │
│ - Identifies primary fault category and confidence percentage          │
│ - Assigns severity level (Low, Moderate, High, Critical)               │
│ - Generates OEM-aligned mechanical inspection recommendations         │
│ - Projects itemized parts and labor cost range                         │
└────────────────────────────────────────────────────────────────────────┘
```

### Multimodal Late-Decision Fusion Formula

When audio or image files are uploaded alongside text, unimodal likelihoods are combined using dynamic confidence-weighted late fusion:

$$P_{fused}(c) = \frac{W_{text} \cdot P_{text}(c) + W_{audio} \cdot P_{audio}(c) + W_{image} \cdot P_{image}(c)}{W_{text} + W_{audio} + W_{image}} + B_{consensus}(c)$$

- **Base Weights**: Text NLP ($W_{text} = 0.40$), Acoustic Waveform ($W_{audio} = 0.35$), Visual Inspection ($W_{image} = 0.25$).
- **Dynamic Normalization**: If a modality is omitted or corrupt, its weight drops to $0.0$, and the remaining active weights are scaled to sum to $1.0$.
- **Consensus Bonus**: If two or more independent modalities agree on the same fault category, a calibrated consensus bonus $B_{consensus} = +0.08$ is added before final softmax normalization.

---

## 13. API Documentation

Every endpoint documented below exists in the actual FastAPI codebase (`backend/app/api/`).

### 1. Health Check
- **Method**: `GET`
- **Route**: `/health` (also aliased at `/api/health`)
- **Purpose**: Verify service health, FastAPI runtime, and ML model loaded status.
- **Authentication**: None (Public)
- **Request Parameters**: None
- **Success Response (200 OK)**:
  ```json
  {
    "status": "ok",
    "service": "AutoSense ML Backend",
    "model_loaded": true,
    "model_name": "AutoSense Fault Classifier",
    "model_version": "1.0"
  }
  ```
- **Possible Responses**:
  - `200 OK`: Service operational.

---

### 2. Service Root & Endpoint Directory
- **Method**: `GET`
- **Route**: `/`
- **Purpose**: Service discovery and available endpoint listing.
- **Authentication**: None (Public)
- **Success Response (200 OK)**:
  ```json
  {
    "status": "online",
    "service": "AutoSense AI Diagnostic Engine",
    "version": "1.0.0",
    "endpoints": [
      "/health",
      "/api/health",
      "/api/ml/pipeline",
      "/api/diagnosis",
      "/api/model-info",
      "/api/model-evaluation"
    ]
  }
  ```

---

### 3. ML Diagnostic Pipeline Execution
- **Method**: `POST`
- **Route**: `/api/ml/pipeline`
- **Purpose**: Execute the 4-stage machine learning pipeline and return step-by-step telemetry.
- **Authentication**: None (Public)
- **Request Body (`application/json`)**:
  ```json
  {
    "symptom": "Starter motor clicking rapidly when pressing ignition switch battery dead",
    "vehicle_context": "Yamaha R15 2022 Petrol 18000km"
  }
  ```
- **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "input": {
      "symptom": "Starter motor clicking rapidly when pressing ignition switch battery dead",
      "vehicle_context": "Yamaha R15 2022 Petrol 18000km"
    },
    "stage1": {
      "name": "Preprocessing",
      "normalized_text": "starter motor clicking rapidly when pressing ignition switch battery dead yamaha r15 2022 petrol 18000km",
      "tokens": ["starter", "motor", "clicking", "rapidly", "when", "pressing", "ignition", "switch", "battery", "dead", "yamaha", "petrol"],
      "token_count": 12
    },
    "stage2": {
      "name": "Feature Vector",
      "method": "TF-IDF",
      "vocabulary_size": 600,
      "non_zero_features": 8,
      "top_features": [
        { "term": "starter motor", "weight": 0.4612 },
        { "term": "clicking", "weight": 0.4105 },
        { "term": "battery", "weight": 0.3891 }
      ]
    },
    "stage3": {
      "name": "Model Prediction",
      "model": "Random Forest Classifier",
      "prediction": "Battery / Starting System",
      "probability": 0.7025,
      "class_probabilities": [
        { "category": "Battery / Starting System", "probability": 0.7025, "percentage": 70.3 },
        { "category": "Electrical & Sensors", "probability": 0.1142, "percentage": 11.4 },
        { "category": "Engine & Valvetrain", "probability": 0.0512, "percentage": 5.1 }
      ]
    },
    "stage4": {
      "name": "Final Diagnosis",
      "diagnosis": "Possible Weak Battery / Starter Circuit Issue",
      "confidence": 0.7025,
      "severity": "Moderate",
      "recommendation": "Measure battery resting voltage (>12.4V) and inspect starter relay & terminal contacts."
    },
    "model": {
      "name": "AutoSense Fault Classifier",
      "version": "1.0",
      "type": "TF-IDF + Random Forest Classifier (150 Estimators)",
      "feature_count": 600,
      "classes_count": 8,
      "classes": [
        "Battery / Starting System", "Braking System", "Cooling System",
        "Electrical & Sensors", "Engine & Valvetrain", "Fuel System",
        "Transmission & Clutch", "Tyres & Suspension"
      ]
    }
  }
  ```
- **Possible Responses**:
  - `200 OK`: Successful pipeline execution.
  - `400 Bad Request`: Empty or whitespace-only symptom text.
  - `422 Unprocessable Entity`: Missing body or schema validation error.
  - `500 Internal Server Error`: Model files unavailable or internal error.

---

### 4. Multimodal Vehicle Fault Diagnosis
- **Method**: `POST`
- **Route**: `/api/diagnosis`
- **Purpose**: Full multimodal vehicle fault diagnosis fusing text, engine audio recordings, and component photos.
- **Authentication**: None (Public)
- **Request Headers**: `Content-Type: multipart/form-data`
- **Request Form Parameters**:
  - `symptoms` (*string*, optional): Raw driver symptom description.
  - `vehicle_context` (*string*, optional): Vehicle metadata (make, model, year).
  - `audio` (*file*, optional): Binary `.wav` / `.webm` acoustic engine recording.
  - `image` (*file*, optional): Binary `.jpg` / `.png` photo of dashboard or component.
- **Example cURL**:
  ```bash
  curl -X POST "http://localhost:8000/api/diagnosis" \
    -F "symptoms=Loud screeching noise during hard braking" \
    -F "vehicle_context=Hyundai i20 2021" \
    -F "audio=@brake_sound.wav"
  ```
- **Success Response (200 OK)**:
  ```json
  {
    "diagnosis": "Brake Friction Pad Degradation / Hydraulic Wear",
    "primary_category": "Braking System",
    "confidence": 0.865,
    "severity": "Critical",
    "reasoning": [
      "Driver symptoms strongly correlate with mechanical pad wear",
      "Acoustic frequency spectrum exhibits high-frequency friction harmonics (2.8 kHz)",
      "Vehicle mileage indicates brake service interval is due"
    ],
    "evidence": [
      {
        "category": "Braking System",
        "modality": "text",
        "observation": "Keywords 'screeching', 'braking' match brake pad wear indicator patterns",
        "confidence_contribution": 0.42
      },
      {
        "category": "Braking System",
        "modality": "audio",
        "observation": "High spectral centroid detected in audio recording (2840 Hz)",
        "confidence_contribution": 0.445
      }
    ],
    "recommendation": [
      "Inspect front and rear brake pads (replace if lining < 3mm).",
      "Check disc rotors for lateral runout or deep scoring."
    ],
    "safety_warning": "CRITICAL: Braking distance may be severely degraded. Avoid high-speed travel.",
    "estimated_cost_range": "₹800 – ₹2,500",
    "modalities": {
      "text": true,
      "audio": true,
      "image": false
    },
    "modality_breakdown": [
      { "modality": "text", "weight": 0.533, "raw_confidence": 0.82, "predicted_category": "Braking System" },
      { "modality": "audio", "weight": 0.467, "raw_confidence": 0.89, "predicted_category": "Braking System" }
    ],
    "category_probabilities": {
      "Braking System": 0.865,
      "Tyres & Suspension": 0.082,
      "Engine & Valvetrain": 0.031
    },
    "model": {
      "name": "AutoSense Multimodal Diagnostic Engine",
      "version": "1.0.0",
      "model_type": "TF-IDF + Random Forest Classifier (Late Multimodal Fusion)"
    },
    "disclaimer": "Automated preliminary assessment. Consult a verified mechanic before major repair."
  }
  ```
- **Possible Responses**:
  - `200 OK`: Successful diagnosis.
  - `400 Bad Request`: At least one input (symptoms, audio, or image) is required.
  - `500 Internal Server Error`: Diagnostic pipeline execution failure.

---

### 5. Direct JSON Diagnosis
- **Method**: `POST`
- **Route**: `/api/diagnosis-json`
- **Purpose**: Lightweight diagnosis endpoint accepting raw JSON payloads for text-only inference.
- **Request Body (`application/json`)**:
  ```json
  {
    "symptoms": "Engine temperature indicator glows red and coolant is boiling over",
    "vehicle_context": "KTM Duke 390 2022"
  }
  ```
- **Success Response (200 OK)**: Returns full `DiagnosisResponse` with `primary_category: "Cooling System"`.
- **Possible Responses**:
  - `200 OK`: Successful diagnosis.
  - `400 Bad Request`: Symptom text is empty.
  - `422 Unprocessable Entity`: Invalid JSON body.

---

### 6. Model Metadata
- **Method**: `GET`
- **Route**: `/api/model-info`
- **Purpose**: Retrieve architecture specifications, version, training metadata, and class labels.
- **Authentication**: None (Public)
- **Success Response (200 OK)**:
  ```json
  {
    "name": "AutoSense Multimodal Diagnostic Engine",
    "version": "1.0.0",
    "model_type": "TF-IDF + Random Forest Classifier (Late Multimodal Fusion)",
    "dataset_source": "AutoSense Structured Vehicle Fault Dataset",
    "training_samples": 99,
    "feature_count": 600,
    "classes_count": 8,
    "classes": [
      "Battery / Starting System",
      "Braking System",
      "Cooling System",
      "Electrical & Sensors",
      "Engine & Valvetrain",
      "Fuel System",
      "Transmission & Clutch",
      "Tyres & Suspension"
    ]
  }
  ```

---

### 7. Model Evaluation Metrics
- **Method**: `GET`
- **Route**: `/api/model-evaluation`
- **Purpose**: Fetch Stratified 5-Fold Cross-Validation evaluation metrics, confusion matrix, and feature importances.
- **Authentication**: None (Public)
- **Success Response (200 OK)**:
  ```json
  {
    "model_name": "AutoSense Multimodal Diagnostic Engine",
    "evaluation_date": "2026-03-24",
    "overall_accuracy": 0.8889,
    "macro_precision": 0.8958,
    "macro_recall": 0.8889,
    "macro_f1": 0.8872,
    "weighted_f1": 0.8872,
    "classes": [
      "Battery / Starting System", "Braking System", "Cooling System",
      "Electrical & Sensors", "Engine & Valvetrain", "Fuel System",
      "Transmission & Clutch", "Tyres & Suspension"
    ],
    "is_prototype": false
  }
  ```
- **Possible Responses**:
  - `200 OK`: Metrics loaded successfully.
  - `404 Not Found`: Model evaluation artifact not found.

---

### 8. Contextual AI Assistant Chat
- **Method**: `POST`
- **Route**: `/api/assistant/chat`
- **Purpose**: Multi-turn diagnostic assistant conversation with safety-critical screening, maintenance schedules, and ML classification.
- **Authentication**: None (Public)
- **Request Body (`application/json`)**:
  ```json
  {
    "message": "Smoke coming from engine bay and smell of burning petrol",
    "vehicle_context": "Honda City 2020",
    "conditions": ["Overheating indicator light on"]
  }
  ```
- **Success Response (200 OK) — Safety Warning Case**:
  ```json
  {
    "type": "safety_warning",
    "message": "CRITICAL SAFETY WARNING: Your description indicates a critical vehicle condition (smoke, fire hazard, or loss of braking/fuel control).\n\n• Safely bring the vehicle to an immediate halt and turn off the ignition.\n• Do not attempt to continue operating the vehicle.\n• Contact certified roadside assistance or a verified workshop immediately.",
    "suggested_actions": [
      { "label": "Find Verified Mechanic", "type": "mechanic" },
      { "label": "Run Full AI Diagnosis", "type": "diagnosis" }
    ]
  }
  ```
- **Success Response (200 OK) — Diagnostic Query Case**:
  ```json
  {
    "type": "diagnosis",
    "message": "Based on your symptoms, the leading candidate fault is **Cooling System** (78% model probability).\n\nRecommended Next Step: Inspect component state and verify electrical/mechanical tolerances.",
    "diagnosis": {
      "category": "Cooling System",
      "confidence": 0.7812,
      "top_classes": [
        { "category": "Cooling System", "probability": 0.7812 },
        { "category": "Engine & Valvetrain", "probability": 0.1245 }
      ]
    },
    "suggested_actions": [
      { "label": "View Full ML Inspector", "type": "diagnosis" },
      { "label": "Book Verified Mechanic", "type": "mechanic" }
    ]
  }
  ```
- **Possible Responses**:
  - `200 OK`: Valid assistant reply generated.
  - `400 Bad Request`: Message is empty or whitespace.
  - `422 Unprocessable Entity`: Invalid request payload.

---

## 14. Database Schema

The production schema is implemented in PostgreSQL 15 on Supabase (`supabase/schema.sql`).

### Entity-Relationship Diagram (ASCII)

```
        ┌────────────────────────────────────────────────────────┐
        │                         USERS                          │
        │  id (PK) · role · name · email · phone · location      │
        └───────┬────────────────────────┬───────────────┬───────┘
                │                        │               │
           1:N  │                   1:1  │          1:N  │
                ▼                        ▼               ▼
        ┌──────────────┐         ┌──────────────┐ ┌──────────────┐
        │   VEHICLES   │         │  MECHANICS   │ │REVIEWS/NOTIF │
        │  id (PK)     │         │  id (PK)     │ └──────────────┘
        │  owner_id(FK)│         │  user_id(FK) │
        └───────┬──────┘         └───────┬──────┘
                │                        │
           1:N  │                   1:N  │
                ▼                        │
        ┌──────────────┐                 │
        │  DIAGNOSES   │                 │
        │  id (PK)     │                 │
        │  vehicle_id  │                 │
        │  user_id     │                 │
        └───────┬──────┘                 │
                │                        │
           1:N  │                   1:N  │
                ▼                        ▼
        ┌───────────────────────────────────────────────┐
        │                   BOOKINGS                    │
        │  id (PK) · booking_reference                  │
        │  vehicle_id (FK) · user_id (FK)               │
        │  mechanic_id (FK) · diagnosis_id (FK)         │
        │  status · appointment_date · time_slot        │
        └───────────────────────┬───────────────────────┘
                                │
                           1:N  │
                                ▼
        ┌───────────────────────────────────────────────┐
        │                SERVICE_RECORDS                │
        │  id (PK) · booking_id (FK) · vehicle_id (FK)  │
        │  mechanic_id (FK) · final_cost · parts        │
        └───────────────────────────────────────────────┘
```

### Table Specifications

#### 1. `users`
Core user directory supporting multi-role authentication.
| Column | Data Type | PK/FK | Nullable | Default | Purpose |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | `UUID` | **PK** | No | `gen_random_uuid()` | Unique user identifier |
| `role` | `VARCHAR(20)` | - | No | - | Access role (`owner`, `mechanic`, `admin`) |
| `name` | `VARCHAR(255)` | - | No | - | User display name |
| `email` | `VARCHAR(255)` | - | No | - | Login email (Unique, indexed) |
| `phone` | `VARCHAR(30)` | - | Yes | `NULL` | Primary phone contact |
| `avatar_url` | `TEXT` | - | Yes | `NULL` | Profile picture URI |
| `location` | `VARCHAR(255)` | - | Yes | `NULL` | User city/state |
| `created_at` | `TIMESTAMPTZ` | - | No | `CURRENT_TIMESTAMP` | Account registration time |
| `updated_at` | `TIMESTAMPTZ` | - | No | `CURRENT_TIMESTAMP` | Trigger-updated timestamp |

#### 2. `vehicles`
Registered vehicles owned by platform users.
| Column | Data Type | PK/FK | Nullable | Default | Purpose |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | `UUID` | **PK** | No | `gen_random_uuid()` | Unique vehicle identifier |
| `owner_id` | `UUID` | **FK** | No | - | References `users(id)` ON DELETE CASCADE |
| `make` | `VARCHAR(100)` | - | No | - | Manufacturer (e.g., Yamaha, Hyundai) |
| `model` | `VARCHAR(100)` | - | No | - | Vehicle model (e.g., R15 V4, i20) |
| `year` | `INT` | - | No | - | Model year (1900–2100) |
| `fuel_type` | `VARCHAR(50)` | - | No | - | Fuel type (`Petrol`, `Diesel`, `Electric`, `Hybrid`) |
| `engine_capacity` | `VARCHAR(50)` | - | No | - | Displacement string (e.g., '155cc', '1.2L') |
| `mileage` | `INT` | - | No | `0` | Current odometer in km |
| `reg_number` | `VARCHAR(50)` | - | No | - | Registration license number |
| `vin` | `VARCHAR(100)` | - | Yes | `NULL` | 17-character VIN |
| `color` | `VARCHAR(50)` | - | Yes | `NULL` | Vehicle exterior paint color |
| `health_score` | `INT` | - | No | `100` | Real-time vehicle health score (0–100) |
| `last_serviced_at` | `TIMESTAMPTZ` | - | Yes | `NULL` | Date of last maintenance completion |
| `created_at` | `TIMESTAMPTZ` | - | No | `CURRENT_TIMESTAMP` | Vehicle garage entry date |

#### 3. `mechanics`
Verified workshops and technician profiles.
| Column | Data Type | PK/FK | Nullable | Default | Purpose |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | `UUID` | **PK** | No | `gen_random_uuid()` | Unique workshop identifier |
| `user_id` | `UUID` | **FK** | No | - | References `users(id)` ON DELETE CASCADE |
| `name` | `VARCHAR(255)` | - | No | - | Lead mechanic name |
| `workshop_name` | `VARCHAR(255)` | - | No | - | Registered workshop business name |
| `rating` | `NUMERIC(3,2)` | - | No | `5.0` | Average star rating (0.0 to 5.0) |
| `review_count` | `INT` | - | No | `0` | Verified customer review count |
| `experience_years` | `INT` | - | No | `0` | Automotive experience in years |
| `phone` | `VARCHAR(30)` | - | No | - | Business contact phone |
| `address` | `TEXT` | - | No | - | Physical street address |
| `working_hours` | `VARCHAR(100)` | - | No | `'09:00 AM - 07:00 PM'` | Operating schedule string |
| `hourly_rate` | `NUMERIC(10,2)` | - | No | `500.00` | Hourly diagnostic labor rate in INR |
| `is_verified` | `BOOLEAN` | - | No | `FALSE` | DriveIQ verification badge flag |
| `vehicle_types` | `JSONB` | - | No | `'["Bike", "Car"]'` | Supported vehicle types array |
| `specializations` | `JSONB` | - | No | `'[]'` | Domain specializations array |
| `services_offered` | `JSONB` | - | No | `'[]'` | Itemized services offered array |

#### 4. `diagnoses`
Multimodal ML predictions, confidence levels, and technical evidence.
| Column | Data Type | PK/FK | Nullable | Default | Purpose |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | `UUID` | **PK** | No | `gen_random_uuid()` | Unique diagnosis ID |
| `vehicle_id` | `UUID` | **FK** | No | - | References `vehicles(id)` ON DELETE CASCADE |
| `user_id` | `UUID` | **FK** | No | - | References `users(id)` ON DELETE CASCADE |
| `title` | `VARCHAR(255)` | - | No | - | Diagnosis summary title |
| `category` | `VARCHAR(100)` | - | No | - | 1 of 8 primary fault categories |
| `severity` | `VARCHAR(20)` | - | No | - | Urgency level (`low`, `medium`, `high`, `critical`) |
| `confidence` | `INT` | - | No | - | Model confidence score (0–100%) |
| `possible_causes` | `JSONB` | - | No | `'[]'` | Ranked alternative causes |
| `reasoning` | `JSONB` | - | No | `'[]'` | Human-readable explanation bullets |
| `recommendation` | `JSONB` | - | No | `'{}'` | Priority, recommended and avoid actions |
| `estimated_cost` | `JSONB` | - | No | `'{}'` | Projected min, max, parts, labor costs |
| `safety_warning` | `TEXT` | - | Yes | `NULL` | Hazard safety warning |
| `input_symptoms` | `TEXT` | - | No | - | Raw text provided by driver |
| `modalities_used` | `JSONB` | - | No | `{"text":true}` | Modality activation flags |
| `category_probabilities` | `JSONB` | - | No | `'{}'` | Posterior class probability vector |
| `status` | `VARCHAR(50)` | - | No | `'preliminary'` | Verification state (`preliminary`, `verified_by_mechanic`, `resolved`) |

#### 5. `bookings`
Service appointments linking drivers, vehicles, and workshops.
| Column | Data Type | PK/FK | Nullable | Default | Purpose |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | `UUID` | **PK** | No | `gen_random_uuid()` | Unique booking identifier |
| `booking_reference` | `VARCHAR(50)` | - | No | - | Unique tracking code (e.g. `DIQ-849201`) |
| `vehicle_id` | `UUID` | **FK** | No | - | References `vehicles(id)` ON DELETE CASCADE |
| `user_id` | `UUID` | **FK** | No | - | References `users(id)` ON DELETE CASCADE |
| `mechanic_id` | `UUID` | **FK** | No | - | References `mechanics(id)` ON DELETE CASCADE |
| `diagnosis_id` | `UUID` | **FK** | Yes | `NULL` | Optional reference to originating diagnosis |
| `problem_summary` | `TEXT` | - | No | - | Summary of customer-reported problem |
| `ai_preliminary_assessment` | `TEXT` | - | Yes | `NULL` | AI summary forwarded to mechanic |
| `service_type` | `VARCHAR(100)` | - | No | - | Service package or custom repair title |
| `appointment_date` | `DATE` | - | No | - | Scheduled appointment calendar date |
| `time_slot` | `VARCHAR(50)` | - | No | - | Time slot window (e.g. `'10:00 AM - 12:00 PM'`) |
| `status` | `VARCHAR(50)` | - | No | `'pending'` | Lifecycle stage (`pending` through `completed`) |
| `notes` | `TEXT` | - | Yes | `NULL` | Additional workshop/driver notes |
| `estimated_total` | `NUMERIC(10,2)` | - | Yes | `NULL` | Estimated total cost in INR |

#### 6. `service_records`
Completed repair records, technician notes, and itemized invoice details.
| Column | Data Type | PK/FK | Nullable | Default | Purpose |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | `UUID` | **PK** | No | `gen_random_uuid()` | Service record identifier |
| `booking_id` | `UUID` | **FK** | Yes | `NULL` | References `bookings(id)` ON DELETE SET NULL |
| `vehicle_id` | `UUID` | **FK** | No | - | References `vehicles(id)` ON DELETE CASCADE |
| `mechanic_id` | `UUID` | **FK** | No | - | References `mechanics(id)` ON DELETE CASCADE |
| `mechanic_name` | `VARCHAR(255)` | - | No | - | Certified technician name |
| `workshop_name` | `VARCHAR(255)` | - | No | - | Workshop business name |
| `service_date` | `DATE` | - | No | - | Execution date of maintenance |
| `title` | `VARCHAR(255)` | - | No | - | Service summary title |
| `final_cost` | `NUMERIC(10,2)` | - | No | - | Final billed amount in INR |
| `parts_replaced` | `JSONB` | - | No | `'[]'` | Itemized list of parts and individual costs |
| `labour_cost` | `NUMERIC(10,2)` | - | No | `0` | Labor fee in INR |
| `mechanic_notes` | `TEXT` | - | Yes | `NULL` | Technical workshop observations |
| `mileage_at_service` | `INT` | - | No | - | Vehicle odometer reading at service |
| `next_service_due_mileage` | `INT` | - | No | - | Recommended mileage for next inspection |

#### 7. Additional Normalized Tables
- **`mechanic_specializations`**: Maps workshops to vehicle types (`Bike`, `Car`, `Commercial`) and technical competencies.
- **`diagnosis_media`**: Tracks binary image and audio files attached to diagnostic scans.
- **`maintenance_records`**: Tracks preventative component health intervals (`due_soon`, `upcoming`, `healthy`).
- **`notifications`**: Real-time user alert records (`info`, `alert`, `success`, `warning`).
- **`reviews`**: Verified customer ratings (1–5 stars) and qualitative feedback.
- **`parts`**: Spare parts inventory with SKU part numbers, stock quantities, and vehicle model compatibility arrays.

---

## 15. Error Handling & Error Boundaries

DriveIQ adopts a **defense-in-depth error handling strategy** across the entire stack to ensure zero unhandled exceptions, zero data loss, and zero white-screen crashes.

```
┌────────────────────────────────────────────────────────────────────────┐
│ FRONTEND ERROR CONTAINMENT (React Layer)                               │
│                                                                        │
│  Root ErrorBoundary (`src/main.tsx`)                                   │
│  └── Catches global runtime crashes                                    │
│                                                                        │
│  Scoped Layout ErrorBoundary (`src/layouts/DashboardLayout.tsx`)       │
│  └── Wraps `<Outlet />`: If a page crashes, Navbar & Session survive   │
│                                                                        │
│  Recovery Actions:                                                     │
│  [Try Again (Resets State)]  [Reload Application]  [Return to Home]    │
│                                                                        │
│  Security Controls:                                                    │
│  - Production: User-friendly message; sensitive state masked           │
│  - Development: Expandable Technical Diagnostics with component stack  │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │
                    HTTP/Network Resiliency Layer
                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│ NETWORK & SERVICE FAULT TOLERANCE (`apiAiService.ts`)                  │
│                                                                        │
│  • fetchWithTimeout: Enforces 12s timeout with AbortController         │
│  • Network Errors: Detects connection drops with friendly guidance     │
│  • Server Errors (5xx): Catches backend errors gracefully              │
│  • Offline Fallback: Seamlessly delegates to mockAiService on failure   │
│  • Database Faults: dbService falls back to in-memory seed data        │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │
                    FastAPI Centralized Handlers
                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│ BACKEND EXCEPTION HANDLING (`backend/app/main.py`)                     │
│                                                                        │
│  • RequestValidationError Handler -> HTTP 422 with structured errors   │
│  • StarletteHTTPException Handler -> Consistent {success, error, code} │
│  • Catch-All Exception Handler -> HTTP 500:                            │
│    - Full traceback logged to secure backend logger                    │
│    - Sanitized JSON returned: NO stack traces or secrets leak to client│
└────────────────────────────────────────────────────────────────────────┘
```

### Frontend: Enterprise Error Boundary (`ErrorBoundary.tsx`)

The React error boundary component (`src/components/common/ErrorBoundary.tsx`):
1. **Isolated Crash Containment**: Wraps both the top-level application in `main.tsx` and individual subview routes inside `DashboardLayout.tsx`. If an individual page fails, the global navbar, user session, and navigation remain operational.
2. **Three-Point Recovery Flow**:
   - **"Try Again"**: Calls `setState({ hasError: false, error: null })` to reset the boundary and attempt re-mounting the component without wiping local storage.
   - **"Reload App"**: Performs a clean window reload.
   - **"Home"**: Safely navigates the user back to the landing page.
3. **Telemetry & Diagnostics**:
   - `componentDidCatch(error, errorInfo)` logs technical details to the console and invokes the optional `onError` callback for monitoring.
   - In development mode (`import.meta.env.DEV`), an expandable **Technical Diagnostics** panel reveals the exact error name, message, and component stack.
   - In production, internal stack traces and database details are strictly omitted to protect platform security.

### Frontend: Network & API Resilience (`apiAiService.ts`)

- **Strict Timeout Enforcement**: All outgoing diagnostic calls use `fetchWithTimeout` backed by `AbortController` (12s for multimodal diagnosis, 10s for pipeline execution, 5s for health check).
- **Graceful Offline Fallback**: If the FastAPI backend is offline or unreachable, `apiAiService` automatically falls back to `mockAiService.symptomDiagnosis()` without throwing unhandled exceptions to the user.
- **Defensive JSON Parsing**: Protects against empty response bodies, non-JSON error pages, and missing keys.

### Backend: Centralized Exception Handlers (`backend/app/main.py`)

- **Schema Validation Errors (`RequestValidationError`)**: Intercepts Pydantic schema validation failures and returns a structured HTTP 422 JSON response with `code: "VALIDATION_ERROR"`.
- **HTTP Exceptions (`StarletteHTTPException`)**: Standardizes HTTP status codes (400, 404, 405) with a uniform JSON response structure: `{"success": false, "error": detail, "code": "HTTP_...", "detail": detail}`.
- **Unexpected Server Exceptions (`Exception`)**: Catch-all handler logs the full traceback securely to the backend logger (`AutoSenseMain`) while returning a sanitized HTTP 500 response to the client. Stack traces, file paths, database strings, and environment secrets are never returned to callers.

---

## 16. Testing & Quality Assurance

DriveIQ maintains an exhaustive, two-tier unit testing architecture covering both the React frontend and the Python FastAPI backend.

| Domain | Framework | Test Runner | Coverage Scope |
| :--- | :--- | :--- | :--- |
| **Frontend** | Vitest 5.0 + React Testing Library + JSDOM | `npm test` | Auth, Role Isolation, Vehicles, Bookings, AI Adapters, Error Boundaries |
| **Backend** | Pytest 9.1 + FastAPI TestClient + HTTPX | `pytest` | REST Routes, 4-Stage ML Pipeline, NLP, Audio, Vision, Late Fusion, Error Codes |

---

## 17. Test Cases & Verification Matrix

The test suite covers all required operational categories:

### A. DIAGNOSIS
- **Valid Symptom Input**: Verifies correct feature extraction, classification, and mechanical recommendations for brake squeal, battery clicking, overheating, and transmission slippage.
- **Empty Symptom Input**: Asserts rejection with HTTP 400 Bad Request and validation error messages.
- **Invalid / Malformed Input**: Tests extreme length (1,000+ words), special characters, and punctuation normalization.
- **Unknown / Unrecognized Symptom**: Verifies that gibberish or out-of-vocabulary inputs produce valid probabilistic predictions without 500 server crashes.
- **Confidence & Probability Integrity**: Checks that class probabilities sum to ~1.0 and individual values lie strictly in $[0.0, 1.0]$.
- **Safe Fallback**: Ensures `apiAiService` falls back to `mockAiService` on backend failure or network disconnection.

### B. API
- **Successful Requests**: Validates HTTP 200 OK across `GET /`, `GET /health`, `POST /api/ml/pipeline`, `POST /api/diagnosis`, `POST /api/diagnosis-json`, `GET /api/model-info`, `GET /api/model-evaluation`, `POST /api/assistant/chat`.
- **Invalid Request Body**: Tests HTTP 422 Unprocessable Entity on missing required JSON fields.
- **Unsupported HTTP Methods**: Tests HTTP 405 Method Not Allowed (e.g., `DELETE /api/ml/pipeline`).
- **Non-Existent Routes**: Tests HTTP 404 Not Found handling.
- **Internal Server Error Handling**: Verifies HTTP 500 responses return sanitized error details without leaking stack traces.

### C. VEHICLE MANAGEMENT
- **Add Vehicle**: Validates creation of vehicles with make, model, year, fuel type, engine capacity, mileage, and license plate.
- **Missing Required Fields**: Asserts detection of missing make, model, or license number.
- **Validation Bounds**: Validates manufacturing year bounds (1950 to present+1) and non-negative integer mileage.
- **Vehicle Retrieval & Filtering**: Tests filtering by `ownerId` and garage retrieval.
- **Vehicle Updates & Degradation**: Tests mileage updates and health score calculation algorithms based on service intervals.

### D. SERVICE BOOKING
- **Valid Booking Creation**: Verifies booking creation with reference ID, vehicle, workshop, date, and time slot.
- **Missing Booking Information**: Identifies missing appointment dates, time slots, or service types.
- **Slot Conflict Detection**: Detects overlapping bookings for the same mechanic on identical dates and time windows.
- **Lifecycle State Transitions**: Validates allowed status transitions (`pending` → `accepted` → `vehicle_received` → `diagnosing` → `repairing` → `quality_check` → `completed`) and blocks invalid jumps.

### E. AUTHENTICATION & ACCESS CONTROL
- **Valid Login**: Authenticates demo profiles for `owner`, `mechanic`, and `admin`.
- **Custom Credentials**: Verifies profile generation from email credentials.
- **Session Persistence**: Verifies role storage and restoration in `localStorage`.
- **Role Isolation**: Tests `ProtectedRoute` enforcement, blocking unauthorized role access and rendering access restriction shields.
- **Session Cleanup**: Verifies complete session clearance on logout.

### F. ML / DIAGNOSTIC MODULE
- **Feature Extraction**: Tests TF-IDF feature vector generation and top feature term extraction.
- **Random Forest Model**: Verifies probability prediction across 8 classes using 150 estimators.
- **Multimodal Late Fusion**: Tests dynamic weight normalization ($\sum W = 1.0$), consensus bonus, and missing modality degradation.
- **Acoustic Analysis**: Tests MFCC, Spectral Centroid, ZCR, and RMS energy extraction from WAV bytes.
- **Visual Inspection**: Tests HSV color thresholding (amber/red warning masks) and Canny edge density.

---

## 18. How to Run Tests

### Run Frontend Unit Tests (Vitest)
```bash
# Run all frontend tests once
npm test

# Run frontend tests in watch mode
npm run test:watch
```

### Run Backend Unit Tests (Pytest)
```bash
# Run all backend tests with verbose output
cd backend
python3 -m pytest -v
```

### Run the Full Platform Test Suite
```bash
# Frontend
npm test

# Backend
cd backend && pytest -v && cd ..
```

---

## 19. Expected Test Results

All 96 unit tests across both suites execute and pass completely:

```
============================= Frontend Vitest Results =============================
 ✓ src/test/auth.test.ts (6 tests)
 ✓ src/test/bookings.test.ts (7 tests)
 ✓ src/test/diagnosis.test.ts (9 tests)
 ✓ src/test/errorBoundary.test.tsx (5 tests)
 ✓ src/test/vehicles.test.ts (8 tests)

 Test Files  5 passed (5)
      Tests  35 passed (35)
   Duration  5.40s
===================================================================================

============================= Backend Pytest Results ==============================
tests/test_api_endpoints.py .................                            [ 27%]
tests/test_audio_model.py ......                                         [ 37%]
tests/test_diagnosis_cases.py ......                                     [ 47%]
tests/test_error_handling.py ......                                      [ 57%]
tests/test_fusion.py ....                                                [ 63%]
tests/test_image_model.py .......                                        [ 75%]
tests/test_text_model.py ...............                                 [100%]

======================== 61 passed, 1 warning in 0.57s =========================
===================================================================================

============================== OVERALL TEST SUMMARY ==============================
 Total Test Files:  12
 Total Unit Tests:  96
 Passing Tests:     96 (100%)
 Failing Tests:     0
 Total Duration:    < 6.0 seconds
===================================================================================
```

---

## 20. Future Improvements

1. **On-Device Edge ML Inference**: Convert scikit-learn and audio feature extractors to ONNX / TensorFlow Lite WebAssembly for zero-latency in-browser inference without internet connectivity.
2. **OBD-II Bluetooth Streaming**: Integrate Web Bluetooth API to read real-time PID live data (coolant temp, RPM, fuel trim, MAF sensor) directly from ELM327 adapters.
3. **Automated Parts Replenishment**: Direct integration with auto-parts supplier APIs (e.g. Bosch, TVS Auto) for automated stock replenishment when workshop inventory falls below minimum thresholds.
4. **Multi-Tenant Workshop Billing**: Stripe / Razorpay marketplace split payments routing customer payments between workshop labor fees and platform commissions.

---

## 📄 License

MIT License © 2026 DriveIQ. All rights reserved.
