# DriveIQ — Intelligent Vehicle Diagnostics & Service Platform

[![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=black)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110+-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Scikit-Learn](https://img.shields.io/badge/Scikit--Learn-1.4+-F7931E?logo=scikit-learn&logoColor=white)](https://scikit-learn.org/)
[![Pytest](https://img.shields.io/badge/Pytest-8.0+-0A9EDC?logo=pytest&logoColor=white)](https://docs.pytest.org/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL_15-3ECF8E?logo=supabase&logoColor=white)](https://supabase.com/)

**DriveIQ** is an end-to-end, multi-modal intelligent automotive diagnosis and workshop service-management ecosystem. It unites authentic machine learning inference (NLP symptom classification, acoustic spectral analysis, and computer vision warning lamp detection), transparent repair cost estimation, verified mechanic discovery, digital job card tracking, and full cloud database persistence via Supabase PostgreSQL.

---

## 📑 Table of Contents

1. [Key Platform Features](#-key-platform-features)
2. [Three Dedicated Role Portals](#-three-dedicated-role-portals)
3. [Technology Stack](#-technology-stack)
4. [Repository Folder Structure](#-repository-folder-structure)
5. [Getting Started & Run Instructions](#-getting-started--run-instructions)
6. [Testing & Quality Assurance (pytest)](#-testing--quality-assurance-pytest)
7. [AIML Diagnostic Pipeline In-Depth](#-aiml-diagnostic-pipeline-in-depth)
8. [Comprehensive API Endpoint Documentation](#-comprehensive-api-endpoint-documentation)
9. [Relational Database Schema Documentation](#-relational-database-schema-documentation)
10. [License](#-license)

---

## 🚀 Key Platform Features

### 1. Multi-Modal AIML Diagnostic Engine
- **Natural Language Symptom Classification**: Converts unstructured driver descriptions into structured TF-IDF unigram/bigram feature matrices classified across 8 automotive mechanical categories using an ensemble Random Forest classifier.
- **Acoustic Waveform Analysis**: Decodes raw audio waveforms with `librosa` to extract 13 Mel-Frequency Cepstral Coefficients (MFCCs), Spectral Centroid, Zero Crossing Rate (ZCR), and Root-Mean-Square (RMS) Energy.
- **Computer Vision Preprocessing**: Utilizes `OpenCV` to convert component and dashboard imagery into HSV space for illuminated amber/red indicator detection and Canny edge gradient analysis.
- **Late Decision Fusion**: Dynamically calculates normalized modality weights, fuses unimodal probability distributions, applies consensus cross-validation boosting, and maps predictions to mechanical severity, cost ranges, and safety alerts.

### 2. Contextual Vehicle AI Assistant
- Multi-turn conversational interface aware of the active vehicle's profile (make, model, year, odometer, maintenance records).
- Automated safety-critical keyword screening (smoke, fire, brake loss, fuel leaks) with instant emergency guidance.
- Dynamic follow-up question banks narrowing down symptoms before invoking real ML inference.

### 3. Transparent Workshop & Fleet Workflow
- Instant appointment scheduling directly from diagnostic results with auto-populated symptoms and preliminary assessments.
- Mechanic bay management, job card status transitions, and itemized invoice generation.
- Real-time SuperAdmin platform telemetry, model cross-validation audit, and user registry oversight.

---

## 👥 Three Dedicated Role Portals

```
                      ┌─────────────────────────────────────────┐
                      │          DriveIQ Main Entry             │
                      │          http://localhost:5173          │
                      └────────────────────┬────────────────────┘
                                           │
         ┌─────────────────────────────────┼─────────────────────────────────┐
         ▼                                 ▼                                 ▼
┌───────────────────┐             ┌───────────────────┐             ┌───────────────────┐
│   Vehicle Owner   │             │   Mechanic Pro    │             │   SuperAdmin      │
│      Portal       │             │      Portal       │             │     Console       │
│      /owner       │             │    /mechanic      │             │     /admin        │
└────────┬──────────┘             └────────┬──────────┘             └────────┬──────────┘
         │                                 │                                 │
         ├► My Garage & Fleet              ├► Active Bay Manager             ├► Platform Overview
         ├► Multimodal AI Scan             ├► Incoming Bookings              ├► User & Garage Registry
         ├► Contextual AI Assistant        ├► Job Cards & Inspections        ├► Fleet Health Audit
         ├► Repair Cost Estimator          ├► Parts Inventory & Stock        ├► ML Model Telemetry
         ├► Verified Mechanic Booking      ├► Customer Directory             ├► Database Health
         └► Service Records & History      └► Earnings & Invoice Tracking    └► System Configuration
```

### 1. Vehicle Owner Portal (`/owner`)
- **Garage Fleet Management**: Full CRUD operations on owned two-wheelers and four-wheelers with health scores and service milestones.
- **AI Diagnostics Studio**: Interactive multimodal scan inputs (text, audio recordings, photo uploads) with step-by-step pipeline inspection.
- **AI Diagnostic Assistant**: Multi-turn chat with guided diagnostic question flows and seamless transition into booking.
- **Cost Estimator & Booking**: Transparent labour/parts cost projections and 1-click booking with verified workshops.

### 2. Mechanic Pro Portal (`/mechanic`)
- **Workshop Bay Kanban**: Manage live vehicle jobs across lifecycle stages (`pending` → `accepted` → `vehicle_received` → `diagnosing` → `repairing` → `quality_check` → `completed`).
- **AI Assessment Validation**: Review owner-submitted diagnostic evidence and attach verified technician feedback.
- **Spare Parts Inventory**: Stock level monitoring, category filtering, and real-time replenishment alerts.
- **Customer CRM**: Service histories, lifetime spend records, and vehicle loyalty tiers.

### 3. SuperAdmin Console (`/admin`)
- **Platform Analytics**: Real-time platform revenue metrics, active user registrations, and booking volume charts.
- **ML Pipeline Inspector & Telemetry**: Live inspection of vocabulary n-grams, TF-IDF weights, class distribution, and Stratified 5-Fold Cross-Validation metrics.
- **Fleet Risk Auditing**: Identification of critical-severity vehicles and overdue maintenance items across the entire ecosystem.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend UI** | React 18.3, TypeScript 5.6, Vite 6.0, Tailwind CSS 3.4, Lucide Icons, React Router v6 |
| **State & Context** | React Context API (`AuthContext`, `DataContext`, `SettingsContext`), LocalStorage fallback |
| **Backend API** | Python 3.10+, FastAPI, Uvicorn, Pydantic v2, Python-Multipart |
| **AIML & Data Science** | Scikit-Learn (TF-IDF Vectorizer, Random Forest Classifier), Pandas, NumPy, Joblib |
| **Signal & Vision Processing** | Librosa, Soundfile (Audio MFCCs & Spectral Centroid), OpenCV Python, Pillow |
| **Database & Auth** | Supabase (PostgreSQL 15), Row Level Security (RLS), Triggers, B-Tree Indexes |
| **Testing & Quality** | Pytest 8.0+, HTTPX, FastAPI TestClient |

---

## 📁 Repository Folder Structure

```
.
├── backend/                              # Python FastAPI & AIML Diagnostic Subsystem
│   ├── app/
│   │   ├── api/
│   │   │   ├── assistant.py             # AI Assistant chat & intent endpoint (/api/assistant/chat)
│   │   │   └── diagnosis.py             # Diagnostic & ML pipeline endpoints (/api/diagnosis, /api/ml/pipeline)
│   │   ├── data/
│   │   │   └── vehicle_faults_dataset.csv # 99-sample structured vehicle faults training dataset
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
│   │   └── main.py                      # FastAPI application entry point, CORS, and routing
│   ├── evaluation/
│   │   └── evaluate_models.py           # 5-fold Stratified CV evaluation script
│   ├── tests/                           # Complete isolated Pytest test suite
│   │   ├── __init__.py
│   │   ├── conftest.py                  # Pytest fixtures (TestClient, synthetic WAV/JPEG generators)
│   │   ├── test_api_endpoints.py        # Endpoint tests for all FastAPI routes
│   │   ├── test_audio_model.py          # Acoustic feature extraction & classification tests
│   │   ├── test_error_handling.py       # 400/404/405/422 status code & failure tests
│   │   ├── test_fusion.py               # Late multimodal decision fusion tests
│   │   ├── test_image_model.py          # OpenCV visual processing tests
│   │   └── test_text_model.py           # NLP TF-IDF & Random Forest unit tests
│   ├── training/
│   │   ├── train_audio_model.py         # Acoustic model training interface
│   │   ├── train_image_model.py         # Vision model training interface
│   │   └── train_text_model.py          # Text classifier training pipeline
│   └── requirements.txt                 # Pinned Python backend dependencies
├── src/                                  # React 18 TypeScript Frontend
│   ├── auth/                            # Authentication context and role guards
│   ├── components/                      # Shared reusable UI components (Cards, Badges, Modals, Charts)
│   ├── config/                          # API and Supabase client configuration
│   ├── context/                         # Global state management (DataContext, SettingsContext)
│   ├── database/                        # Database schemas, mock fallback data, seed scripts
│   ├── pages/                           # Role-based application views
│   │   ├── admin/                       # SuperAdmin console views
│   │   ├── auth/                        # Login & Registration views
│   │   ├── mechanic/                    # Mechanic Pro portal views
│   │   ├── owner/                       # Vehicle Owner portal views
│   │   └── settings/                    # Global user settings views
│   ├── services/                        # API adapters (FastAPI client, Supabase database client)
│   ├── types/                           # Shared TypeScript domain interfaces
│   ├── App.tsx                          # React router definition
│   └── main.tsx                         # Frontend DOM mount
├── supabase/                            # Supabase cloud schema migrations & seed data
├── package.json                         # Node dependencies & scripts
├── requirements.txt                     # Root Python dependencies mirror
├── tailwind.config.js                   # Tailwind CSS configuration
└── tsconfig.json                        # TypeScript compiler options
```

---

## ⚡ Getting Started & Run Instructions

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **Python**: v3.10.0 or higher
- **pip**: v23.0+

### 1. Clone Repository & Install Frontend
```bash
git clone https://github.com/vimaljayganthan/AIImmersion.git
cd "AI Immersion 1"
npm install
```

### 2. Environment Variables Setup
Create a `.env` file in the root directory:
```env
VITE_ML_API_URL=http://localhost:8000
VITE_SUPABASE_URL=https://scgzcxslqewxqewblkwc.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_UAPy5l8W57aMMHbggyKjfw_MvHtJI8j
```

### 3. Setup & Run Python FastAPI Backend
```bash
# Set up virtual environment (optional but recommended)
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install backend dependencies
pip install -r backend/requirements.txt

# Train models and generate evaluation metrics (if running for the first time)
python3 backend/training/train_text_model.py
python3 backend/evaluation/evaluate_models.py

# Start the FastAPI server on port 8000
python3 -m uvicorn app.main:app --app-dir backend --host 0.0.0.0 --port 8000 --reload
```
The FastAPI backend will start at `http://localhost:8000`. Interactive OpenAPI documentation is available at `http://localhost:8000/docs`.

### 4. Run Vite Frontend Development Server
In a new terminal window:
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🧪 Testing & Quality Assurance (pytest)

The project includes an isolated unit test suite in `backend/tests/` verifying all models, fusion algorithms, API routes, and error handlers.

### Run All Unit Tests
```bash
python3 -m pytest backend/tests -v
```

### Test Suite Structure
| Test Module | Coverage Scope |
| :--- | :--- |
| `test_text_model.py` | Training pipeline, artifact serialization, NLP feature extraction, valid predictions across all 8 mechanical categories, empty text, gibberish/out-of-vocabulary words, special characters, and long text edge cases. |
| `test_audio_model.py` | Acoustic feature extraction (MFCCs, Spectral Centroid, ZCR, RMS), high/low frequency classification heuristics, empty audio buffer, and corrupted byte handling. |
| `test_image_model.py` | OpenCV visual feature extraction, amber warning masks, red warning masks, structural Canny edge density, empty image bytes, and invalid image format handling. |
| `test_fusion.py` | Unimodal, bimodal, and trimodal late decision fusion, dynamic weight normalization ($\sum W = 1.0$), multimodal consensus bonus, severity mapping, and missing modality error assertions. |
| `test_api_endpoints.py` | Integration tests for `GET /health`, `GET /`, `POST /api/ml/pipeline`, `POST /api/model-lab/predict`, `POST /api/diagnosis`, `POST /api/diagnosis-json`, `GET /api/model-info`, `GET /api/model-evaluation`, and `POST /api/assistant/chat`. |
| `test_error_handling.py` | 400 Bad Request, 404 Not Found, 405 Method Not Allowed, 422 Unprocessable Entity, missing multipart fields, and missing artifact graceful degradation. |

---

## 🧠 AIML Diagnostic Pipeline In-Depth

```
  Driver Symptom Input (+ Optional Vehicle Context)
                       │
                       ▼
┌──────────────────────────────────────────────────────────┐
│ STAGE 1: Text Preprocessing & Tokenization               │
│ • Lowercase normalization & punctuation stripping        │
│ • Filter domain tokens (length > 2, alphabetical)        │
└──────────────────────┬───────────────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────────────┐
│ STAGE 2: TF-IDF Feature Extraction                       │
│ • (1, 2) N-gram range extraction (unigrams & bigrams)    │
│ • Sublinear term-frequency scaling: 1 + log(tf)          │
│ • Stop-words removal across 600 max feature vocabulary   │
└──────────────────────┬───────────────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────────────┐
│ STAGE 3: Random Forest Classification                    │
│ • Ensemble of 150 randomized decision trees              │
│ • Balanced class weights handling sample distribution    │
│ • Generates calibrated probability vector P_text across  │
│   8 standardized mechanical fault categories             │
└──────────────────────┬───────────────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────────────┐
│ STAGE 4: Late Multimodal Decision Fusion                 │
│ • Ingests P_text (0.40), P_audio (0.35), P_image (0.25)  │
│ • Dynamically re-normalizes weights for active inputs    │
│ • Applies consensus bonus if multiple modalities agree   │
│ • Synthesizes severity, cost range, and recommendations  │
└──────────────────────────────────────────────────────────┘
```

### The 8 Standardized Mechanical Fault Categories
1. **Battery / Starting System**: Solenoid clicks, weak resting voltage (<12.4V), starter motor brush degradation.
2. **Braking System**: Friction pad thinning (<3mm), hydraulic moisture contamination, disc rotor warping.
3. **Engine & Valvetrain**: Valve clearance looseness, cylinder compression loss, spark plug fouling, combustion misfire.
4. **Cooling System**: Radiator thermal boiling, water pump bearing weeping, fan relay activation failure.
5. **Electrical & Sensors**: Alternator charging voltage drop (<13.8V), stator coil burns, fuse blowing, sensor glitches.
6. **Transmission & Clutch**: Clutch friction plate slippage, cable free-play looseness, gear synchronizer clunking.
7. **Fuel System**: Fuel injector nozzle clogging, fuel rail delivery pressure inconsistency, filter restriction.
8. **Tyres & Suspension**: Tyre tread wear, fork seal hydraulic leakage, steering stem bearing notchiness.

---

## 📡 Comprehensive API Endpoint Documentation

All endpoints are served by the FastAPI application on `http://localhost:8000`.

### 1. Root & Status
- **Method**: `GET`
- **Route**: `/`
- **Purpose**: Verifies that the API service is online and lists primary available endpoints.
- **Request Parameters**: None
- **Response Example** (`200 OK`):
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

### 2. Service Health Check
- **Method**: `GET`
- **Route**: `/health` or `/api/health`
- **Purpose**: Health check endpoint verifying FastAPI status and serialized ML model artifact readiness.
- **Request Parameters**: None
- **Response Example** (`200 OK`):
  ```json
  {
    "status": "ok",
    "service": "AutoSense ML Backend",
    "model_loaded": true,
    "model_name": "AutoSense Fault Classifier",
    "model_version": "1.0"
  }
  ```

---

### 3. Real ML Pipeline Step-by-Step Execution
- **Method**: `POST`
- **Route**: `/api/ml/pipeline`
- **Purpose**: Runs full transparent NLP pipeline from raw text through Tokenization, TF-IDF feature extraction, Random Forest inference, and diagnosis synthesis.
- **Headers**: `Content-Type: application/json`
- **Request Body**:
  ```json
  {
    "symptom": "Starter motor clicking rapidly when pressing ignition button",
    "vehicle_context": "Yamaha R15 150cc Petrol"
  }
  ```
- **Response Example** (`200 OK`):
  ```json
  {
    "success": true,
    "input": {
      "symptom": "Starter motor clicking rapidly when pressing ignition button",
      "vehicle_context": "Yamaha R15 150cc Petrol"
    },
    "stage1": {
      "name": "Preprocessing",
      "normalized_text": "starter motor clicking rapidly when pressing ignition button yamaha r15 150cc petrol",
      "tokens": ["starter", "motor", "clicking", "rapidly", "when", "pressing", "ignition", "button", "yamaha", "petrol"],
      "token_count": 10
    },
    "stage2": {
      "name": "Feature Vector",
      "method": "TF-IDF",
      "vocabulary_size": 600,
      "non_zero_features": 8,
      "top_features": [
        { "term": "clicking", "weight": 0.5214 },
        { "term": "starter", "weight": 0.4892 },
        { "term": "ignition", "weight": 0.3541 }
      ]
    },
    "stage3": {
      "name": "Model Prediction",
      "model": "Random Forest Classifier",
      "prediction": "Battery / Starting System",
      "probability": 0.7025,
      "class_probabilities": [
        { "class": "Battery / Starting System", "probability": 0.7025, "percentage": 70.3 },
        { "class": "Electrical & Sensors", "probability": 0.1142, "percentage": 11.4 },
        { "class": "Engine & Valvetrain", "probability": 0.0512, "percentage": 5.1 }
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
  }
  ```
- **Possible Error Codes**:
  - `400 Bad Request`: Empty or whitespace-only symptom text (`"Please enter a vehicle symptom."`).
  - `422 Unprocessable Entity`: Malformed JSON payload.
  - `500 Internal Server Error`: Model files could not be loaded into memory.

---

### 4. Legacy Model Lab Predict Route
- **Method**: `POST`
- **Route**: `/api/model-lab/predict`
- **Purpose**: Backward-compatible route for pipeline inspection tools accepting `text` or `symptom` parameters.
- **Request Body**:
  ```json
  {
    "text": "Brake pads worn down to metal backing plate loud metallic squeal"
  }
  ```
- **Response**: Same schema as `POST /api/ml/pipeline`.

---

### 5. Multimodal Vehicle Fault Diagnosis
- **Method**: `POST`
- **Route**: `/api/diagnosis`
- **Purpose**: Full multimodal vehicle fault diagnosis accepting text descriptions, audio recordings, and component photographs.
- **Content-Type**: `multipart/form-data`
- **Form Parameters**:
  - `symptoms` (*string*, optional): Symptom description text.
  - `vehicle_context` (*string*, optional): Vehicle make, model, year, and odometer context.
  - `audio` (*file upload*, optional): Binary audio file (WAV/MP3/WebM).
  - `image` (*file upload*, optional): Binary image file (JPEG/PNG/WebP).
- **Validation Rule**: At least one of `symptoms`, `audio`, or `image` is required.
- **Response Example** (`200 OK`):
  ```json
  {
    "diagnosis": "Brake Friction Lining Wear / Hydraulic Degradation",
    "primary_category": "Braking System",
    "confidence": 0.88,
    "severity": "Critical",
    "reasoning": [
      "Symptom text analysis: Key diagnostic signal identified: 'squeal' (TF-IDF weight: 0.54)",
      "Acoustic analysis: High-frequency spectral energy (3450 Hz, ZCR: 0.145) matches friction squeal.",
      "Multimodal Consensus: High correlation across 2 distinct input modalities confirming Braking System."
    ],
    "evidence": [
      {
        "category": "Braking System",
        "modality": "Text",
        "observation": "Key diagnostic signal identified: 'squeal' (TF-IDF weight: 0.54)",
        "confidence_contribution": 0.352,
        "technical_detail": "TF-IDF N-gram feature representation matched in trained Random Forest"
      },
      {
        "category": "Braking System",
        "modality": "Audio",
        "observation": "Acoustic analysis: High-frequency spectral energy (3450 Hz, ZCR: 0.145) matches friction squeal.",
        "confidence_contribution": 0.308,
        "technical_detail": "Librosa feature extraction (MFCCs, Spectral Centroid, ZCR)"
      }
    ],
    "recommendation": [
      "Inspect brake pad friction lining thickness (replace if < 3mm).",
      "Check brake fluid level in master reservoir and test moisture contamination.",
      "Check disc rotors for lateral runout, heat glazing, or deep friction grooves."
    ],
    "safety_warning": "CRITICAL SAFETY RISK: Compromised braking performance significantly increases stopping distance. Do not drive at high speeds. Immediate workshop inspection required.",
    "estimated_cost_range": "₹800 – ₹2,500",
    "modalities": {
      "text": true,
      "audio": true,
      "image": false
    },
    "modality_breakdown": [
      {
        "modality": "Text Symptoms (NLP)",
        "weight": 0.533,
        "raw_confidence": 0.84,
        "predicted_category": "Braking System"
      },
      {
        "modality": "Acoustic Analysis (librosa)",
        "weight": 0.467,
        "raw_confidence": 0.65,
        "predicted_category": "Braking System"
      }
    ],
    "category_probabilities": {
      "Braking System": 0.88,
      "Cooling System": 0.06,
      "Battery / Starting System": 0.01,
      "Engine & Valvetrain": 0.01,
      "Electrical & Sensors": 0.01,
      "Transmission & Clutch": 0.01,
      "Fuel System": 0.01,
      "Tyres & Suspension": 0.01
    },
    "model": {
      "name": "AutoSense Multimodal Diagnostic Engine",
      "version": "1.0.0",
      "model_type": "TF-IDF + Random Forest Classifier (Late Multimodal Fusion)",
      "dataset_source": "AutoSense Structured Vehicle Fault Dataset (Prototype/Dev)",
      "training_samples": 99,
      "feature_count": 600,
      "classes_count": 8,
      "classes": ["Battery / Starting System", "Braking System", "Cooling System", "Electrical & Sensors", "Engine & Valvetrain", "Fuel System", "Transmission & Clutch", "Tyres & Suspension"]
    },
    "disclaimer": "This is a machine learning preliminary assessment. Always consult a certified automotive mechanic for safety-critical inspections."
  }
  ```
- **Possible Error Codes**:
  - `400 Bad Request`: No inputs provided (`"At least one diagnostic input (symptoms text, audio recording, or image) is required."`).
  - `500 Internal Server Error`: Diagnostic pipeline execution failure.

---

### 6. Diagnosis via Direct JSON Body
- **Method**: `POST`
- **Route**: `/api/diagnosis-json`
- **Purpose**: Programmatic JSON-only text diagnosis for lightweight clients.
- **Request Body**:
  ```json
  {
    "symptoms": "Clutch slipping RPM shoots high when twisting throttle",
    "vehicle_context": "KTM Duke 200"
  }
  ```
- **Response**: Same schema as `POST /api/diagnosis`.
- **Possible Error Codes**:
  - `400 Bad Request`: Empty symptom text (`"Symptom text is required."`).

---

### 7. Active Model Architecture Info
- **Method**: `GET`
- **Route**: `/api/model-info`
- **Purpose**: Returns active model version, training sample volume, feature dimensions, and class labels.
- **Request Parameters**: None
- **Response Example** (`200 OK`):
  ```json
  {
    "name": "AutoSense Multimodal Diagnostic Engine",
    "version": "1.0.0",
    "type": "TF-IDF + Random Forest Classifier (150 Estimators)",
    "model_type": "TF-IDF + Random Forest Classifier (Late Multimodal Fusion)",
    "dataset_source": "AutoSense Structured Vehicle Fault Dataset (Prototype/Dev)",
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

### 8. Authentic Model Evaluation Metrics
- **Method**: `GET`
- **Route**: `/api/model-evaluation`
- **Purpose**: Returns authentic Stratified 5-Fold Cross-Validation evaluation metrics, precision/recall per class, and feature importances.
- **Request Parameters**: None
- **Response Example** (`200 OK`):
  ```json
  {
    "model_name": "AutoSense TF-IDF + Random Forest Classifier",
    "evaluation_date": "2026-09-16 14:17:48",
    "overall_accuracy": 0.747,
    "macro_precision": 0.762,
    "macro_recall": 0.747,
    "macro_f1": 0.723,
    "weighted_f1": 0.726,
    "classes": [
      "Battery / Starting System",
      "Braking System",
      "Cooling System",
      "Electrical & Sensors",
      "Engine & Valvetrain",
      "Fuel System",
      "Transmission & Clutch",
      "Tyres & Suspension"
    ],
    "confusion_matrix": [
      [11, 0, 0, 1, 0, 1, 1, 0],
      [0, 12, 0, 0, 0, 0, 0, 1],
      [0, 0, 10, 0, 1, 1, 0, 0],
      [1, 0, 0, 9, 0, 2, 0, 0],
      [0, 0, 1, 0, 8, 2, 1, 0],
      [0, 0, 0, 0, 0, 11, 1, 0],
      [0, 0, 0, 0, 1, 2, 9, 0],
      [0, 0, 0, 0, 1, 1, 0, 10]
    ],
    "per_class_metrics": {
      "Battery / Starting System": { "precision": 0.917, "recall": 0.786, "f1_score": 0.846, "support": 14 },
      "Braking System": { "precision": 1.0, "recall": 0.923, "f1_score": 0.96, "support": 13 }
    },
    "feature_importances_top": [
      { "feature": "squeal", "importance": 0.0384 },
      { "feature": "coolant", "importance": 0.0341 },
      { "feature": "clicking", "importance": 0.0319 }
    ],
    "dataset_distribution": {
      "Battery / Starting System": 14,
      "Braking System": 13,
      "Engine & Valvetrain": 12,
      "Cooling System": 12,
      "Electrical & Sensors": 12,
      "Transmission & Clutch": 12,
      "Fuel System": 12,
      "Tyres & Suspension": 12
    },
    "is_prototype": false
  }
  ```
- **Possible Error Codes**:
  - `404 Not Found`: Model evaluation file not found (`"Model evaluation file not found. Run evaluate_models.py first."`).

---

### 9. Contextual Vehicle AI Assistant Chat
- **Method**: `POST`
- **Route**: `/api/assistant/chat`
- **Purpose**: Multi-turn chat assistant with safety screening, greeting detection, maintenance knowledge, and fallback ML inference.
- **Request Body**:
  ```json
  {
    "message": "Brake pedal goes all the way to floor with squealing sound",
    "vehicle_context": "2023 Yamaha R15",
    "conditions": ["metallic friction sound"]
  }
  ```
- **Response Types**:
  - `safety_warning`: Triggered on hazard terms ("smoke", "fire", "brake failure").
  - `text`: Greetings, gratitude, and exploratory conversational prompts.
  - `maintenance`: Recommended service schedules and fluid change intervals.
  - `diagnosis`: Direct ML predicted fault category with confidence score and action buttons.
- **Response Example** (`200 OK`):
  ```json
  {
    "type": "diagnosis",
    "message": "Based on your symptoms, the leading candidate fault is **Braking System** (84% model probability).\n\nRecommended Next Step: Inspect component state and verify electrical/mechanical tolerances.",
    "diagnosis": {
      "category": "Braking System",
      "confidence": 0.84,
      "top_classes": [
        { "category": "Braking System", "probability": 0.84 },
        { "category": "Tyres & Suspension", "probability": 0.06 }
      ]
    },
    "suggested_actions": [
      { "label": "View Full ML Inspector", "type": "diagnosis" },
      { "label": "Book Verified Mechanic", "type": "mechanic" }
    ]
  }
  ```
- **Possible Error Codes**:
  - `400 Bad Request`: Message string is empty (`"Message cannot be empty."`).
  - `422 Unprocessable Entity`: Missing `message` key.

---

## 🗄️ Relational Database Schema Documentation

The DriveIQ database is built on PostgreSQL 15 via Supabase, consisting of **15 relational tables** with B-Tree indexes, foreign key cascading, update triggers, and Row Level Security (RLS) policies.

```
┌───────────────┐        1:N        ┌─────────────────┐        1:N        ┌─────────────────┐
│     users     ├──────────────────►│    vehicles     ├──────────────────►│    diagnoses    │
│  (PK: id)     │                   │  (PK: id)       │                   │  (PK: id)       │
└───────┬───────┘                   └────────┬────────┘                   └────────┬────────┘
        │                                    │                                     │
        │ 1:1                                │ 1:N                                 │ 1:1 (optional)
        ▼                                    ▼                                     ▼
┌───────────────┐                   ┌─────────────────┐                   ┌─────────────────┐
│   mechanics   │◄──────────────────┤    bookings     │◄──────────────────┤ diagnosis_media │
│  (PK: id)     │        1:N        │  (PK: id)       │        1:N        │  (PK: id)       │
└───────┬───────┘                   └────────┬────────┘                   └─────────────────┘
        │                                    │
        │ 1:N                                │ 1:1 (optional)
        ▼                                    ▼
┌───────────────────────────┐       ┌─────────────────┐
│ mechanic_specializations  │       │    invoices     │
│ (PK: id, FK: mechanic_id) │       │  (PK: id)       │
└───────────────────────────┘       └─────────────────┘
```

### Table 1: `users`
Primary user registry supporting multi-role access.
| Column | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | `PRIMARY KEY DEFAULT gen_random_uuid()` | Unique user identifier. |
| `role` | `VARCHAR(20)` | `NOT NULL CHECK (role IN ('owner', 'mechanic', 'admin'))` | System access role. |
| `name` | `VARCHAR(255)` | `NOT NULL` | Full user name. |
| `email` | `VARCHAR(255)` | `UNIQUE NOT NULL` | Login email address (indexed). |
| `phone` | `VARCHAR(30)` | `NULL` | Contact phone number. |
| `avatar_url` | `TEXT` | `NULL` | Profile picture URI. |
| `location` | `VARCHAR(255)` | `NULL` | City / area string. |
| `created_at` | `TIMESTAMPTZ` | `DEFAULT CURRENT_TIMESTAMP` | Account creation timestamp. |
| `updated_at` | `TIMESTAMPTZ` | `DEFAULT CURRENT_TIMESTAMP` | Trigger-updated timestamp. |

---

### Table 2: `vehicles`
Garage vehicles owned by drivers.
| Column | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | `PRIMARY KEY DEFAULT gen_random_uuid()` | Vehicle record identifier. |
| `owner_id` | `UUID` | `NOT NULL REFERENCES users(id) ON DELETE CASCADE` | FK pointing to owner. |
| `make` | `VARCHAR(100)` | `NOT NULL` | Manufacturer (e.g., Yamaha, Hyundai). |
| `model` | `VARCHAR(100)` | `NOT NULL` | Model name (e.g., R15 V4, i20). |
| `year` | `INT` | `NOT NULL CHECK (year BETWEEN 1900 AND 2100)` | Manufacturing year. |
| `fuel_type` | `VARCHAR(50)` | `NOT NULL CHECK (fuel_type IN ('Petrol', 'Diesel', 'Electric', 'Hybrid'))` | Fuel system type. |
| `engine_capacity` | `VARCHAR(50)` | `NOT NULL` | Displacement string (e.g., '155cc', '1.2L'). |
| `mileage` | `INT` | `NOT NULL DEFAULT 0` | Current odometer in kilometers. |
| `reg_number` | `VARCHAR(50)` | `NOT NULL` | Registration license plate (indexed). |
| `vin` | `VARCHAR(100)` | `NULL` | Vehicle Identification Number. |
| `color` | `VARCHAR(50)` | `NULL` | Vehicle exterior color. |
| `health_score` | `INT` | `NOT NULL DEFAULT 100 CHECK (health_score BETWEEN 0 AND 100)` | Overall health score (0-100). |
| `last_serviced_at` | `TIMESTAMPTZ` | `NULL` | Last service completion date. |
| `created_at` | `TIMESTAMPTZ` | `DEFAULT CURRENT_TIMESTAMP` | Record creation timestamp. |
| `updated_at` | `TIMESTAMPTZ` | `DEFAULT CURRENT_TIMESTAMP` | Trigger-updated timestamp. |

---

### Table 3: `mechanics`
Verified workshops and technician profiles.
| Column | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | `PRIMARY KEY DEFAULT gen_random_uuid()` | Mechanic profile identifier. |
| `user_id` | `UUID` | `NOT NULL REFERENCES users(id) ON DELETE CASCADE` | Associated login user ID. |
| `name` | `VARCHAR(255)` | `NOT NULL` | Lead technician name. |
| `workshop_name` | `VARCHAR(255)` | `NOT NULL` | Workshop business entity name. |
| `rating` | `NUMERIC(3,2)` | `DEFAULT 5.0 CHECK (rating BETWEEN 0.0 AND 5.0)` | Average star rating. |
| `review_count` | `INT` | `DEFAULT 0` | Total verified customer reviews. |
| `experience_years` | `INT` | `DEFAULT 0` | Automotive experience in years. |
| `phone` | `VARCHAR(30)` | `NOT NULL` | Workshop contact phone. |
| `address` | `TEXT` | `NOT NULL` | Street address. |
| `latitude` | `NUMERIC(9,6)` | `NULL` | GPS latitude coordinate. |
| `longitude` | `NUMERIC(9,6)` | `NULL` | GPS longitude coordinate. |
| `working_hours` | `VARCHAR(100)` | `DEFAULT '09:00 AM - 07:00 PM'` | Operating schedule string. |
| `hourly_rate` | `NUMERIC(10,2)` | `DEFAULT 500.00` | Base diagnostic hourly labor rate. |
| `is_verified` | `BOOLEAN` | `DEFAULT FALSE` | DriveIQ certified workshop badge. |
| `avatar_url` | `TEXT` | `NULL` | Workshop photo URI. |
| `vehicle_types` | `JSONB` | `DEFAULT '["Bike", "Car"]'::jsonb` | Serviced vehicle categories. |
| `specializations` | `JSONB` | `DEFAULT '[]'::jsonb` | Domain capabilities list. |
| `services_offered` | `JSONB` | `DEFAULT '[]'::jsonb` | Itemized services offered list. |
| `created_at` | `TIMESTAMPTZ` | `DEFAULT CURRENT_TIMESTAMP` | Registration date. |
| `updated_at` | `TIMESTAMPTZ` | `DEFAULT CURRENT_TIMESTAMP` | Trigger-updated timestamp. |

---

### Table 4: `mechanic_specializations`
Normalized domain specializations for workshops.
| Column | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | `PRIMARY KEY DEFAULT gen_random_uuid()` | Record identifier. |
| `mechanic_id` | `UUID` | `NOT NULL REFERENCES mechanics(id) ON DELETE CASCADE` | FK to mechanics table. |
| `specialization` | `VARCHAR(100)` | `NOT NULL` | Skill (e.g., 'Engine Tuning', 'Electrical Diagnostics'). |
| `vehicle_type` | `VARCHAR(50)` | `NOT NULL CHECK (vehicle_type IN ('Bike', 'Car', 'Commercial'))` | Applicable vehicle class. |

---

### Table 5: `diagnoses`
AIML multimodal diagnosis predictions and reasoning records.
| Column | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | `PRIMARY KEY DEFAULT gen_random_uuid()` | Unique diagnosis ID. |
| `vehicle_id` | `UUID` | `NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE` | FK to diagnosed vehicle. |
| `user_id` | `UUID` | `NOT NULL REFERENCES users(id) ON DELETE CASCADE` | FK to diagnostic requester. |
| `title` | `VARCHAR(255)` | `NOT NULL` | Diagnostic title header. |
| `category` | `VARCHAR(100)` | `NOT NULL` | Primary mechanical category (1 of 8). |
| `severity` | `VARCHAR(20)` | `NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical'))` | Urgency severity level. |
| `confidence` | `INT` | `NOT NULL CHECK (confidence BETWEEN 0 AND 100)` | Confidence score (0-100%). |
| `possible_causes` | `JSONB` | `NOT NULL DEFAULT '[]'::jsonb` | Ranked alternative fault classes. |
| `reasoning` | `JSONB` | `NOT NULL DEFAULT '[]'::jsonb` | Human-readable explanation bullets. |
| `recommendation` | `JSONB` | `NOT NULL DEFAULT '{}'::jsonb` | Priority, immediate action, avoid actions. |
| `estimated_cost` | `JSONB` | `NOT NULL DEFAULT '{}'::jsonb` | Projected min, max, parts, and labour costs. |
| `safety_warning` | `TEXT` | `NULL` | Critical hazard warnings if applicable. |
| `input_symptoms` | `TEXT` | `NOT NULL` | Raw driver symptom description. |
| `additional_context` | `JSONB` | `DEFAULT '{}'::jsonb` | Noise, warning lights, starting behavior context. |
| `media_urls` | `JSONB` | `DEFAULT '[]'::jsonb` | Uploaded audio/image attachment URLs. |
| `evidence` | `JSONB` | `DEFAULT '[]'::jsonb` | Technical evidence tokens with confidence contributions. |
| `modalities_used` | `JSONB` | `DEFAULT '{"text": true, "audio": false, "image": false}'::jsonb` | Modality activation flags. |
| `modality_breakdown`| `JSONB` | `DEFAULT '[]'::jsonb` | Individual unimodal weights and predictions. |
| `category_probabilities` | `JSONB` | `DEFAULT '{}'::jsonb` | Complete posterior probability vector. |
| `model_info` | `JSONB` | `DEFAULT '{"name": "DriveIQ Fault Classifier", "version": "1.0"}'::jsonb` | Model architecture metadata. |
| `mechanic_feedback` | `JSONB` | `DEFAULT NULL` | Verified workshop technician notes. |
| `status` | `VARCHAR(50)` | `DEFAULT 'preliminary' CHECK (status IN ('preliminary', 'verified_by_mechanic', 'resolved'))` | Verification status. |
| `created_at` | `TIMESTAMPTZ` | `DEFAULT CURRENT_TIMESTAMP` | Scan timestamp. |
| `updated_at` | `TIMESTAMPTZ` | `DEFAULT CURRENT_TIMESTAMP` | Trigger-updated timestamp. |

---

### Table 6: `diagnosis_media`
Binary image and audio files attached to diagnostic scans.
| Column | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | `PRIMARY KEY DEFAULT gen_random_uuid()` | Media attachment identifier. |
| `diagnosis_id` | `UUID` | `NOT NULL REFERENCES diagnoses(id) ON DELETE CASCADE` | FK to parent diagnosis. |
| `media_type` | `VARCHAR(20)` | `NOT NULL CHECK (media_type IN ('image', 'audio'))` | Binary media format. |
| `file_url` | `TEXT` | `NOT NULL` | Supabase storage bucket URL. |
| `description` | `TEXT` | `NULL` | Component or recording description. |
| `uploaded_at` | `TIMESTAMPTZ` | `DEFAULT CURRENT_TIMESTAMP` | Upload timestamp. |

---

### Table 7: `bookings`
Service bookings linking owners, vehicles, and workshops.
| Column | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | `PRIMARY KEY DEFAULT gen_random_uuid()` | Booking identifier. |
| `booking_reference`| `VARCHAR(50)` | `UNIQUE NOT NULL` | Human-readable reference (e.g., 'BK-2026-9481'). |
| `vehicle_id` | `UUID` | `NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE` | FK to vehicle being serviced. |
| `user_id` | `UUID` | `NOT NULL REFERENCES users(id) ON DELETE CASCADE` | FK to customer user. |
| `mechanic_id` | `UUID` | `NOT NULL REFERENCES mechanics(id) ON DELETE CASCADE` | FK to selected workshop. |
| `diagnosis_id` | `UUID` | `REFERENCES diagnoses(id) ON DELETE SET NULL` | Optional FK to initiating diagnosis. |
| `problem_summary` | `TEXT` | `NOT NULL` | Customer description of issue. |
| `ai_preliminary_assessment` | `TEXT` | `NULL` | AI summary forwarded to workshop. |
| `service_type` | `VARCHAR(100)` | `NOT NULL` | Type (e.g., 'Brake Overhaul', 'Scheduled Service'). |
| `appointment_date` | `DATE` | `NOT NULL` | Scheduled service date. |
| `time_slot` | `VARCHAR(50)` | `NOT NULL` | Selected time window (e.g., '10:00 AM - 12:00 PM'). |
| `status` | `VARCHAR(50)` | `NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'vehicle_received', 'diagnosing', 'repairing', 'quality_check', 'completed', 'cancelled'))` | Bay lifecycle status. |
| `notes` | `TEXT` | `NULL` | Additional customer / mechanic notes. |
| `estimated_total` | `NUMERIC(10,2)` | `NULL` | Projected cost in INR. |
| `created_at` | `TIMESTAMPTZ` | `DEFAULT CURRENT_TIMESTAMP` | Booking creation date. |
| `updated_at` | `TIMESTAMPTZ` | `DEFAULT CURRENT_TIMESTAMP` | Trigger-updated timestamp. |

---

### Table 8: `service_records`
Historical completed service records and job cards.
| Column | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | `PRIMARY KEY DEFAULT gen_random_uuid()` | Service record identifier. |
| `booking_id` | `UUID` | `REFERENCES bookings(id) ON DELETE SET NULL` | Originating booking ID. |
| `vehicle_id` | `UUID` | `NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE` | Serviced vehicle FK. |
| `mechanic_id` | `UUID` | `NOT NULL REFERENCES mechanics(id) ON DELETE CASCADE` | Servicing workshop FK. |
| `mechanic_name` | `VARCHAR(255)` | `NOT NULL` | Technician name. |
| `workshop_name` | `VARCHAR(255)` | `NOT NULL` | Workshop business name. |
| `service_date` | `DATE` | `NOT NULL` | Date service was performed. |
| `title` | `VARCHAR(255)` | `NOT NULL` | Service summary title. |
| `final_cost` | `NUMERIC(10,2)` | `NOT NULL` | Total final invoice cost. |
| `parts_replaced` | `JSONB` | `DEFAULT '[]'::jsonb` | Itemized replaced parts with individual prices. |
| `labour_cost` | `NUMERIC(10,2)` | `NOT NULL DEFAULT 0` | Labor fee in INR. |
| `mechanic_notes` | `TEXT` | `NULL` | Technical workshop notes. |
| `mileage_at_service` | `INT` | `NOT NULL` | Odometer reading during service. |
| `next_service_due_mileage` | `INT` | `NOT NULL` | Target mileage for next scheduled service. |
| `created_at` | `TIMESTAMPTZ` | `DEFAULT CURRENT_TIMESTAMP` | Record creation timestamp. |

---

### Table 9: `maintenance_records`
Preventative component health and replacement intervals.
| Column | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | `PRIMARY KEY DEFAULT gen_random_uuid()` | Record identifier. |
| `vehicle_id` | `UUID` | `NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE` | Associated vehicle FK. |
| `title` | `VARCHAR(255)` | `NOT NULL` | Component check title (e.g., 'Engine Oil Flush'). |
| `component` | `VARCHAR(100)` | `NOT NULL` | Subsystem (e.g., 'Engine', 'Brakes', 'Transmission'). |
| `status` | `VARCHAR(50)` | `NOT NULL CHECK (status IN ('due_soon', 'upcoming', 'healthy'))` | Maintenance urgency status. |
| `due_mileage` | `INT` | `NULL` | Target replacement kilometer mark. |
| `estimated_km_remaining` | `INT` | `NULL` | Remaining kilometers before maintenance. |
| `due_date` | `DATE` | `NULL` | Calendar due date. |
| `last_checked_date` | `DATE` | `NOT NULL` | Date of last physical inspection. |
| `recommendation` | `TEXT` | `NOT NULL` | Preventive action guidance. |
| `created_at` | `TIMESTAMPTZ` | `DEFAULT CURRENT_TIMESTAMP` | Record timestamp. |
| `updated_at` | `TIMESTAMPTZ` | `DEFAULT CURRENT_TIMESTAMP` | Trigger-updated timestamp. |

---

### Table 10: `notifications`
Real-time system, diagnostic, and booking notifications.
| Column | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | `PRIMARY KEY DEFAULT gen_random_uuid()` | Notification ID. |
| `user_id` | `UUID` | `NOT NULL REFERENCES users(id) ON DELETE CASCADE` | Target recipient user FK. |
| `title` | `VARCHAR(255)` | `NOT NULL` | Notification headline. |
| `message` | `TEXT` | `NOT NULL` | Notification body message. |
| `type` | `VARCHAR(50)` | `NOT NULL CHECK (type IN ('info', 'alert', 'success', 'warning'))` | Alert visual type. |
| `is_read` | `BOOLEAN` | `DEFAULT FALSE` | Read status flag. |
| `link_url` | `TEXT` | `NULL` | Deep link route. |
| `created_at` | `TIMESTAMPTZ` | `DEFAULT CURRENT_TIMESTAMP` | Timestamp generated. |

---

### Table 11: `reviews`
Verified customer ratings and feedback for workshops.
| Column | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | `PRIMARY KEY DEFAULT gen_random_uuid()` | Review identifier. |
| `mechanic_id` | `UUID` | `NOT NULL REFERENCES mechanics(id) ON DELETE CASCADE` | Reviewed workshop FK. |
| `user_id` | `UUID` | `NOT NULL REFERENCES users(id) ON DELETE CASCADE` | Reviewing customer FK. |
| `user_name` | `VARCHAR(255)` | `NOT NULL` | Author display name. |
| `user_avatar` | `TEXT` | `NULL` | Author avatar URI. |
| `rating` | `INT` | `NOT NULL CHECK (rating BETWEEN 1 AND 5)` | 1-5 star rating. |
| `comment` | `TEXT` | `NOT NULL` | Customer review text. |
| `created_at` | `TIMESTAMPTZ` | `DEFAULT CURRENT_TIMESTAMP` | Review timestamp. |

---

### Table 12: `parts`
Workshop spare parts catalog and inventory.
| Column | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | `PRIMARY KEY DEFAULT gen_random_uuid()` | Part catalog identifier. |
| `name` | `VARCHAR(255)` | `NOT NULL` | Component name (e.g., 'Ceramic Brake Pad Set'). |
| `part_number` | `VARCHAR(100)` | `UNIQUE NOT NULL` | SKU / OEM part number. |
| `category` | `VARCHAR(100)` | `NOT NULL` | Subsystem category. |
| `compatible_models` | `JSONB` | `DEFAULT '[]'::jsonb` | Array of compatible vehicle models. |
| `price` | `NUMERIC(10,2)` | `NOT NULL` | Retail unit price in INR. |
| `in_stock` | `BOOLEAN` | `DEFAULT TRUE` | In-stock availability flag. |
| `stock_count` | `INT` | `DEFAULT 0` | Quantity currently in stock. |
| `created_at` | `TIMESTAMPTZ` | `DEFAULT CURRENT_TIMESTAMP` | Catalog entry date. |
| `updated_at` | `TIMESTAMPTZ` | `DEFAULT CURRENT_TIMESTAMP` | Trigger-updated timestamp. |

---

### Table 13: `invoices`
Digital billing statements and tax breakdowns.
| Column | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | `PRIMARY KEY DEFAULT gen_random_uuid()` | Unique invoice identifier. |
| `booking_id` | `UUID` | `NOT NULL REFERENCES bookings(id) ON DELETE CASCADE` | Associated booking FK. |
| `service_record_id` | `UUID` | `REFERENCES service_records(id) ON DELETE SET NULL` | Associated completed service record. |
| `total_amount` | `NUMERIC(10,2)` | `NOT NULL` | Total gross payable in INR. |
| `parts_total` | `NUMERIC(10,2)` | `NOT NULL DEFAULT 0` | Subtotal for replaced parts. |
| `labour_total` | `NUMERIC(10,2)` | `NOT NULL DEFAULT 0` | Subtotal for workshop labor. |
| `taxes` | `NUMERIC(10,2)` | `NOT NULL DEFAULT 0` | GST / tax component. |
| `paid_status` | `VARCHAR(50)` | `DEFAULT 'unpaid' CHECK (paid_status IN ('paid', 'unpaid', 'pending'))` | Payment settlement status. |
| `invoice_date` | `DATE` | `NOT NULL DEFAULT CURRENT_DATE` | Date invoice was issued. |
| `created_at` | `TIMESTAMPTZ` | `DEFAULT CURRENT_TIMESTAMP` | Invoice creation timestamp. |

---

### Table 14: `ai_conversations`
Persistent multi-turn conversation logs with AI diagnostic assistant.
| Column | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | `PRIMARY KEY DEFAULT gen_random_uuid()` | Conversation session identifier. |
| `user_id` | `UUID` | `NOT NULL REFERENCES users(id) ON DELETE CASCADE` | Owner user FK. |
| `vehicle_id` | `UUID` | `REFERENCES vehicles(id) ON DELETE SET NULL` | Context vehicle FK. |
| `messages` | `JSONB` | `NOT NULL DEFAULT '[]'::jsonb` | Serialized array of user and assistant messages. |
| `created_at` | `TIMESTAMPTZ` | `DEFAULT CURRENT_TIMESTAMP` | Session start time. |
| `updated_at` | `TIMESTAMPTZ` | `DEFAULT CURRENT_TIMESTAMP` | Last interaction timestamp. |

---

### Table 15: `user_settings`
Personalized user preferences and AI diagnostic tuning.
| Column | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `user_id` | `UUID` | `PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE` | User FK (1:1 relationship). |
| `profile` | `JSONB` | `NOT NULL DEFAULT '{}'::jsonb` | Extended profile metadata. |
| `ai_preferences` | `JSONB` | `NOT NULL DEFAULT '{}'::jsonb` | AI diagnostic tuning (response style, follow-up flags). |
| `notification_preferences` | `JSONB` | `NOT NULL DEFAULT '{}'::jsonb` | Email and push alert toggles. |
| `appearance_preferences` | `JSONB` | `NOT NULL DEFAULT '{}'::jsonb` | Theme and display configurations. |
| `updated_at` | `TIMESTAMPTZ` | `DEFAULT CURRENT_TIMESTAMP` | Last updated timestamp. |

---

## 📄 License

MIT License © 2026 DriveIQ. All rights reserved.
