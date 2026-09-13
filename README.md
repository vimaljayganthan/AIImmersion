# AIImmersion

# DriveIQ — Intelligent Vehicle Diagnostics & Service Platform

[![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=black)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![FastAPI](https://img.shields.io/badge/FastAPI-ML_Backend-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?logo=supabase&logoColor=white)](https://supabase.com/)

**DriveIQ** is an end-to-end, multi-modal intelligent automotive diagnosis and workshop service-management ecosystem. It combines machine learning classifiers (TF-IDF, Random Forest, Acoustic MFCCs), transparent repair cost estimations, verified mechanic discovery, digital job card workflows, and complete cloud database synchronization via Supabase.

---

## 🚀 Key Platform Features

### 1. Multi-Modal AIML Diagnostic Engine
- **Natural Language Symptoms**: Process unstructured driver descriptions via TF-IDF vectorization.
- **Acoustic Waveform Analysis**: Mel-Frequency Cepstral Coefficients (MFCC) feature extraction for starter, engine, and valvetrain anomalies.
- **Visual Component Inspection**: Component photograph uploads and visual fault association.
- **Multi-Modal Late Fusion**: Probabilistic weighting across modalities for high-confidence predictions with transparent reasoning and evidence.

### 2. Three Dedicated Role Portals
- **Vehicle Owner Portal** (`/owner`): Live vehicle health monitoring, multimodal AI scans, interactive contextual assistant, repair cost estimator, service history, and instant mechanic booking.
- **Mechanic Pro Portal** (`/mechanic`): Incoming service requests, digital workshop bay management, preliminary AI verification, customer fleet records, and parts inventory.
- **SuperAdmin Console** (`/admin`): Real-time platform metrics, user registry, multi-modal accuracy audits, and platform telemetry oversight.

### 3. Contextual Vehicle AI Assistant
- Live context awareness of the selected vehicle (make, model, year, odometer, health score).
- Guided multi-step diagnostic flows and immediate booking conversions.

### 4. Supabase Cloud Database Integration
- 15 relational tables with B-Tree indexes, foreign key cascading, and Row Level Security (RLS) policies.
- Full SQL schema migration and seed scripts included in `src/database/setup_full_supabase.sql`.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Lucide Icons, React Router v6
- **ML Backend**: Python, FastAPI, Scikit-Learn, NumPy, Uvicorn
- **Database**: Supabase (PostgreSQL 15), Supabase JavaScript SDK
- **Design System**: Tailored automotive analytics aesthetic, custom vector emblems, glassmorphic layer architecture

---

## 📦 Getting Started

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/vimaljayganthan/AIImmersion.git
cd AIImmersion
npm install
```

### 2. Environment Configuration
Create a `.env` file in the root directory:
```env
VITE_ML_API_URL=http://localhost:8000
VITE_SUPABASE_URL=https://scgzcxslqewxqewblkwc.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_UAPy5l8W57aMMHbggyKjfw_MvHtJI8j
```

### 3. Run FastAPI ML Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python main.py
```

### 4. Run Vite Frontend
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🗄️ Database Setup (Supabase)

1. Open your [Supabase SQL Editor](https://supabase.com/dashboard/project/scgzcxslqewxqewblkwc/sql/new).
2. Copy the entire contents of [`src/database/setup_full_supabase.sql`](src/database/setup_full_supabase.sql).
3. Paste into the SQL Editor and click **Run** to create all 15 tables and populate initial seed data.

---

## 📄 License
MIT License © 2026 DriveIQ. All rights reserved.
