import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import { useData } from '../../context/DataContext';
import { useSettings } from '../../context/SettingsContext';
import { Diagnosis, Vehicle } from '../../types';
import { AssistantEngine, AssistantMessage } from '../../services/ai/assistantEngine';
import {
  Car,
  Sparkles,
  Wrench,
  CalendarCheck,
  History,
  Activity,
  Bot,
  Plus,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Clock,
  MapPin,
  Star,
  Send,
  Upload,
  Mic,
  ShieldAlert,
  Trash2,
  Edit2,
  Eye,
  Check,
  X,
  FileText,
  Search,
  Filter,
  User,
  Droplet,
  Cpu,
  Layers,
  BarChart3,
  Bookmark,
  Info,
  RefreshCw,
  Zap,
  RotateCcw,
} from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { ConfidenceMeter } from '../../components/common/ConfidenceMeter';
import { EmptyState } from '../../components/common/EmptyState';
import { AudioRecorder } from '../../components/audio/AudioRecorder';

// 1. My Vehicles View (Full CRUD with Semantic Color Hierarchy)
export const OwnerVehiclesView: React.FC = () => {
  const {
    vehicles,
    activeVehicle,
    setActiveVehicleId,
    deleteVehicle,
    openVehicleModal,
    openConfirmDialog,
  } = useData();

  const handleDelete = (v: Vehicle) => {
    openConfirmDialog({
      title: 'Remove Vehicle from Garage',
      message: `Are you sure you want to remove ${v.year} ${v.make} ${v.model} (${v.regNumber}) from your garage? Historical service records will be retained.`,
      confirmLabel: 'Remove Vehicle',
      isDanger: true,
      onConfirm: () => deleteVehicle(v.id),
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-sky-100 text-sky-800 text-xs font-bold mb-1 border border-sky-200">
            <Car size={13} />
            <span>Garage Fleet Management</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">My Registered Vehicles</h2>
          <p className="text-xs text-slate-600">
            Manage your garage vehicles and specifications used for AI diagnostics & maintenance scheduling.
          </p>
        </div>
        <Button
          size="sm"
          leftIcon={<Plus size={16} />}
          onClick={() => openVehicleModal(null)}
          className="bg-sky-500 hover:bg-sky-600 text-white font-semibold shadow-xs shrink-0"
        >
          Add New Vehicle
        </Button>
      </div>

      {vehicles.length === 0 ? (
        <EmptyState
          icon={<Car size={32} />}
          title="No Vehicles in Garage"
          description="Add your first car or bike to start running AI diagnostics and tracking maintenance."
          actionLabel="Add Vehicle"
          onAction={() => openVehicleModal(null)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {vehicles.map((v) => {
            const isActive = activeVehicle?.id === v.id;
            
            // Determine semantic color theme
            let theme = {
              cardBg: 'bg-emerald-50/50 border-emerald-200 border-t-emerald-500',
              iconBg: 'bg-emerald-100 text-emerald-700 border-emerald-200',
              badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-200',
              badgeLabel: 'Healthy Condition',
              progressBg: 'bg-emerald-500',
              accentText: 'text-emerald-800',
            };

            if (isActive) {
              theme = {
                cardBg: 'bg-sky-50/70 border-sky-300 border-t-sky-500 ring-2 ring-sky-400/20',
                iconBg: 'bg-sky-100 text-sky-700 border-sky-200',
                badgeBg: 'bg-sky-100 text-sky-800 border-sky-300',
                badgeLabel: 'Primary Active',
                progressBg: 'bg-sky-500',
                accentText: 'text-sky-800',
              };
            } else if (v.healthScore < 70) {
              theme = {
                cardBg: 'bg-amber-50/60 border-amber-200 border-t-amber-500',
                iconBg: 'bg-amber-100 text-amber-700 border-amber-200',
                badgeBg: 'bg-amber-100 text-amber-800 border-amber-200',
                badgeLabel: 'Needs Attention',
                progressBg: 'bg-amber-500',
                accentText: 'text-amber-800',
              };
            }

            return (
              <div
                key={v.id}
                className={`p-6 rounded-2xl border border-t-4 ${theme.cardBg} shadow-xs hover:shadow-md transition duration-200 flex flex-col justify-between`}
              >
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-extrabold text-slate-900">
                          {v.year} {v.make} {v.model}
                        </h3>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${theme.badgeBg}`}>
                          {theme.badgeLabel}
                        </span>
                      </div>
                      <p className="text-xs font-mono font-bold text-slate-500 mt-0.5">{v.regNumber}</p>
                    </div>
                    <div className={`w-11 h-11 rounded-xl border flex items-center justify-center shadow-2xs ${theme.iconBg}`}>
                      <Car size={22} />
                    </div>
                  </div>

                  {/* Vehicle Spec Grid */}
                  <div className="grid grid-cols-3 gap-2 p-3 bg-white/90 rounded-xl border border-slate-200/80 text-xs mb-4 shadow-2xs">
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Engine</span>
                      <span className="font-bold text-slate-900">{v.engineCapacity}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Fuel</span>
                      <span className="font-bold text-slate-900">{v.fuelType}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Odometer</span>
                      <span className="font-bold text-slate-900 font-mono">{v.mileage.toLocaleString()} km</span>
                    </div>
                  </div>

                  {/* Health Score Gauge */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                      <span className={theme.accentText}>Overall Health Score</span>
                      <span className="text-slate-900">{v.healthScore}%</span>
                    </div>
                    <div className="w-full bg-slate-200/80 rounded-full h-2.5 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${theme.progressBg}`}
                        style={{ width: `${v.healthScore}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-200/80">
                  <div>
                    {!isActive ? (
                      <button
                        onClick={() => setActiveVehicleId(v.id)}
                        className="text-xs font-bold text-sky-600 hover:text-sky-800 hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <Check size={14} />
                        Set as Primary
                      </button>
                    ) : (
                      <span className="text-xs text-sky-800 font-bold flex items-center gap-1">
                        <CheckCircle2 size={14} className="text-sky-600" /> Active in AI Tools
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openVehicleModal(v)}
                      title="Edit Vehicle"
                      className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition cursor-pointer"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(v)}
                      title="Delete Vehicle"
                      className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// 2. AI Diagnosis View (Complete Multi-Modal Pipeline)
export const OwnerDiagnosisView: React.FC = () => {
  const {
    activeVehicle,
    vehicles,
    setActiveVehicleId,
    runAiDiagnosis,
    saveDiagnosis,
    openBookingModal,
    openDiagnosisDetailModal,
    diagnoses,
    mechanics,
  } = useData();

  const [selectedVehicleId, setSelectedVehicleId] = useState(activeVehicle?.id || (vehicles[0]?.id ?? ''));

  // Input states
  const [symptoms, setSymptoms] = useState('My bike makes a clicking sound when I try to start it and does not start.');
  const [startedWhen, setStartedWhen] = useState('2 days ago');
  const [frequency, setFrequency] = useState('Every cold start');
  const [startsReliably, setStartsReliably] = useState('no');
  const [warningLights, setWarningLights] = useState('yes');
  const [unusualSmell, setUnusualSmell] = useState('no');
  const [recentService, setRecentService] = useState('no');

  // Media states
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);

  // Analysis progress & result
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState(0);
  const [latestDiagnosis, setLatestDiagnosis] = useState<Diagnosis | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [error, setError] = useState('');

  const currentVeh = vehicles.find((v) => v.id === selectedVehicleId) || activeVehicle;

  // Preset symptom templates
  const presets = [
    { label: 'Clicking sound on startup', text: 'My bike makes a rapid clicking sound when I press the starter button and headlight dims completely.' },
    { label: 'Front brake grinding / squeal', text: 'High-pitched squealing and metallic grinding noise whenever front brake lever is pulled firmly.' },
    { label: 'Engine overheating with steam', text: 'Engine temperature gauge is spiking in red zone with green coolant boiling and steam from radiator.' },
    { label: 'Clutch slipping under load', text: 'Clutch is slipping, engine RPM shoots high when twisting throttle but vehicle does not accelerate.' },
  ];

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        setError('Image must be smaller than 5MB.');
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setError('');
    }
  };

  const removeImage = () => {
    setImageFile(null);
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImagePreview(null);
  };

  const handleStartAnalysis = async () => {
    if (!symptoms.trim() && !audioBlob && !imageFile) {
      setError('Please provide at least one diagnostic input: describe symptoms, upload an image, or record audio.');
      return;
    }

    setError('');
    setSavedSuccess(false);
    setIsAnalyzing(true);
    setAnalysisStep(1);

    // Multi-stage animated pipeline
    const timer1 = setTimeout(() => setAnalysisStep(2), 500);
    const timer2 = setTimeout(() => setAnalysisStep(3), 1000);
    const timer3 = setTimeout(() => setAnalysisStep(4), 1600);

    try {
      const result = await runAiDiagnosis({
        symptoms,
        vehicle: currentVeh || {},
        additionalContext: {
          startedWhen,
          frequency,
          startsReliably: startsReliably === 'yes',
          warningLights: warningLights === 'yes',
          unusualSmell: unusualSmell === 'yes',
          recentService: recentService === 'yes',
        },
        imageFiles: imageFile ? [imageFile] : [],
        audioFile: audioBlob || undefined,
      });

      setTimeout(() => {
        setAnalysisStep(5);
        setLatestDiagnosis(result);
        setIsAnalyzing(false);
      }, 2200);
    } catch (err) {
      setIsAnalyzing(false);
      setError('Diagnosis pipeline encountered an issue. Please try again.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-sky-500 via-sky-600 to-indigo-600 text-white p-6 sm:p-8 rounded-3xl shadow-soft">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-xs font-semibold mb-3">
          <Cpu size={14} />
          <span>Multimodal Machine Learning Diagnostic Engine</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
          DriveIQ Diagnostic Engine
        </h2>
        <p className="text-xs sm:text-sm text-sky-100 max-w-2xl leading-relaxed">
          Describe, show, or record the problem with your vehicle. The system processes natural language symptoms, acoustic recordings, and component imagery using machine learning classifiers and multimodal late fusion.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Input Form (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <Card className="p-6">
            <h3 className="text-sm font-bold text-brand-navy mb-3 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Car size={16} className="text-brand-sky" />
                1. Select Vehicle
              </span>
              {currentVeh && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-brand-lightSky text-brand-skyHover">
                  {currentVeh.mileage.toLocaleString()} km
                </span>
              )}
            </h3>

            {/* Vehicle Selector */}
            <div className="mb-4">
              <select
                value={selectedVehicleId}
                onChange={(e) => {
                  setSelectedVehicleId(e.target.value);
                  setActiveVehicleId(e.target.value);
                }}
                className="w-full px-3 py-2 text-xs rounded-xl border border-brand-border focus:ring-2 focus:ring-brand-sky/20 focus:border-brand-sky focus:outline-none bg-white font-semibold text-brand-navy"
              >
                {vehicles.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.year} {v.make} {v.model} ({v.regNumber})
                  </option>
                ))}
              </select>
            </div>

            {/* Modality 1: Symptoms Description */}
            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-brand-navy flex items-center gap-1.5">
                    <FileText size={14} className="text-brand-sky" />
                    2. Describe Symptoms (NLP Text)
                  </label>
                  <span className="text-[10px] text-brand-slate font-medium">TF-IDF Vectorized</span>
                </div>
                <textarea
                  rows={3}
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  placeholder="What problem are you experiencing? E.g. Clicking sound when starting, front brake squeal, engine overheating..."
                  className="w-full p-3 text-xs rounded-xl border border-brand-border focus:ring-2 focus:ring-brand-sky/20 focus:border-brand-sky focus:outline-none bg-slate-50/50"
                />

                {/* Preset Chips */}
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {presets.map((p, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSymptoms(p.text)}
                      className="text-[10px] px-2 py-1 rounded-lg bg-slate-100 hover:bg-brand-lightSky text-brand-slate hover:text-brand-navy transition font-medium"
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Modality 2: Photo Upload Section */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-brand-navy flex items-center gap-1.5">
                    <Upload size={14} className="text-teal-600" />
                    3. Vehicle / Component Image (OpenCV)
                  </label>
                  <span className="text-[10px] text-teal-600 font-medium bg-teal-50 px-1.5 py-0.5 rounded">Optional</span>
                </div>
                {!imagePreview ? (
                  <label className="border-2 border-dashed border-brand-border hover:border-teal-400 rounded-2xl p-3.5 flex flex-col items-center justify-center gap-1 cursor-pointer bg-slate-50/50 hover:bg-teal-50/30 transition text-center">
                    <Upload size={18} className="text-teal-600" />
                    <span className="text-xs font-semibold text-brand-navy">Upload Vehicle / Dashboard Photo</span>
                    <span className="text-[10px] text-brand-slate">Dashboard lights, tyre wear, brake pads, fluid leak (max 5MB)</span>
                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                  </label>
                ) : (
                  <div className="relative rounded-2xl overflow-hidden border border-teal-200 bg-teal-50/40 p-2.5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img src={imagePreview} alt="Preview" className="w-12 h-12 rounded-xl object-cover border border-teal-200" />
                      <div>
                        <span className="text-xs font-bold text-brand-navy block truncate max-w-[180px]">{imageFile?.name}</span>
                        <span className="text-[10px] text-teal-700 font-medium">CV Feature Extractor Ready</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={removeImage}
                      className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50"
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}
              </div>

              {/* Modality 3: Audio Recorder Section */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-brand-navy flex items-center gap-1.5">
                    <Mic size={14} className="text-indigo-600" />
                    4. Engine / Mechanical Audio (librosa)
                  </label>
                  <span className="text-[10px] text-indigo-600 font-medium bg-indigo-50 px-1.5 py-0.5 rounded">Optional</span>
                </div>
                <AudioRecorder
                  onAudioReady={(blob) => setAudioBlob(blob)}
                />
              </div>

              {/* Context Questions */}
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-brand-border/80 space-y-3 text-xs">
                <span className="font-bold text-[10px] uppercase text-slate-400 block">
                  Diagnostic Context Questions
                </span>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-brand-slate mb-1">When did it start?</label>
                    <input
                      type="text"
                      value={startedWhen}
                      onChange={(e) => setStartedWhen(e.target.value)}
                      placeholder="e.g. 2 days ago"
                      className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-brand-border bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-brand-slate mb-1">Frequency</label>
                    <input
                      type="text"
                      value={frequency}
                      onChange={(e) => setFrequency(e.target.value)}
                      placeholder="e.g. Every start"
                      className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-brand-border bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-1 text-[11px]">
                  <div>
                    <span className="block text-brand-slate mb-1">Starts reliably?</span>
                    <div className="flex gap-1">
                      {['yes', 'no'].map((v) => (
                        <button
                          key={v}
                          type="button"
                          onClick={() => setStartsReliably(v)}
                          className={`flex-1 py-1 rounded capitalize ${
                            startsReliably === v ? 'bg-brand-sky text-white font-bold' : 'bg-white border'
                          }`}
                        >
                          {v}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className="block text-brand-slate mb-1">Warning lights?</span>
                    <div className="flex gap-1">
                      {['yes', 'no'].map((v) => (
                        <button
                          key={v}
                          type="button"
                          onClick={() => setWarningLights(v)}
                          className={`flex-1 py-1 rounded capitalize ${
                            warningLights === v ? 'bg-brand-sky text-white font-bold' : 'bg-white border'
                          }`}
                        >
                          {v}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className="block text-brand-slate mb-1">Unusual smell?</span>
                    <div className="flex gap-1">
                      {['yes', 'no'].map((v) => (
                        <button
                          key={v}
                          type="button"
                          onClick={() => setUnusualSmell(v)}
                          className={`flex-1 py-1 rounded capitalize ${
                            unusualSmell === v ? 'bg-brand-sky text-white font-bold' : 'bg-white border'
                          }`}
                        >
                          {v}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {error && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-medium">
                  {error}
                </div>
              )}

              {/* Action Button */}
              <Button
                className="w-full shadow-md bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white font-bold"
                size="lg"
                isLoading={isAnalyzing}
                disabled={isAnalyzing}
                onClick={handleStartAnalysis}
                leftIcon={<Sparkles size={18} />}
              >
                {isAnalyzing ? 'Running ML Pipeline...' : 'Analyze Problem'}
              </Button>
            </div>
          </Card>
        </div>

        {/* Right: Diagnosis Pipeline & Results Screen (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {isAnalyzing ? (
            <Card className="p-8 text-center space-y-6">
              <div className="w-16 h-16 rounded-3xl bg-brand-lightSky text-brand-skyHover flex items-center justify-center mx-auto animate-bounce">
                <Cpu size={32} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-brand-navy">
                  Analyzing Vehicle Symptoms & Telemetry...
                </h3>
                <p className="text-xs text-brand-slate mt-1">
                  Executing Supervised Random Forest Classifier + Late Multimodal Fusion
                </p>
              </div>

              {/* Animated Step List */}
              <div className="max-w-md mx-auto text-left space-y-3 p-4 bg-slate-50 rounded-2xl border border-brand-border text-xs">
                <div className={`flex items-center gap-2.5 ${analysisStep >= 1 ? 'text-brand-navy font-bold' : 'text-slate-400'}`}>
                  <CheckCircle2 size={16} className={analysisStep >= 1 ? 'text-brand-success' : 'text-slate-300'} />
                  <span>Processing input modalities & vehicle context</span>
                </div>
                <div className={`flex items-center gap-2.5 ${analysisStep >= 2 ? 'text-brand-navy font-bold' : 'text-slate-400'}`}>
                  <CheckCircle2 size={16} className={analysisStep >= 2 ? 'text-brand-success' : 'text-slate-300'} />
                  <span>Extracting TF-IDF n-grams & acoustic/visual features</span>
                </div>
                <div className={`flex items-center gap-2.5 ${analysisStep >= 3 ? 'text-brand-navy font-bold' : 'text-slate-400'}`}>
                  <CheckCircle2 size={16} className={analysisStep >= 3 ? 'text-brand-success' : 'text-slate-300'} />
                  <span>Running Random Forest fault classification model</span>
                </div>
                <div className={`flex items-center gap-2.5 ${analysisStep >= 4 ? 'text-brand-navy font-bold' : 'text-slate-400'}`}>
                  <CheckCircle2 size={16} className={analysisStep >= 4 ? 'text-brand-success' : 'text-slate-300'} />
                  <span>Combining available modalities via Late Fusion engine</span>
                </div>
                <div className={`flex items-center gap-2.5 ${analysisStep >= 5 ? 'text-brand-navy font-bold' : 'text-slate-400'}`}>
                  <CheckCircle2 size={16} className={analysisStep >= 5 ? 'text-brand-success' : 'text-slate-300'} />
                  <span>Compiling explainable diagnostic evidence & recommendations</span>
                </div>
              </div>
            </Card>
          ) : latestDiagnosis ? (
            <Card className="p-6 sm:p-8 border-l-4 border-l-brand-sky space-y-6">
              {/* Report Header */}
              <div className="flex flex-wrap items-start justify-between gap-4 pb-4 border-b border-brand-border">
                <div>
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-brand-lightSky text-brand-skyHover uppercase tracking-wider">
                      {latestDiagnosis.category}
                    </span>
                    <Badge
                      variant={
                        latestDiagnosis.severity === 'critical'
                          ? 'danger'
                          : latestDiagnosis.severity === 'high'
                          ? 'warning'
                          : 'sky'
                      }
                      size="sm"
                    >
                      {latestDiagnosis.severity.toUpperCase()} SEVERITY
                    </Badge>
                  </div>
                  <h3 className="text-2xl font-black text-brand-navy mt-1">
                    {latestDiagnosis.title}
                  </h3>
                  <p className="text-xs text-brand-slate mt-0.5">
                    {currentVeh?.year} {currentVeh?.make} {currentVeh?.model} ({currentVeh?.mileage?.toLocaleString()} km) · Generated {new Date(latestDiagnosis.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <Badge variant="warning" size="md">
                  Preliminary AI Assessment
                </Badge>
              </div>

              {/* Modalities Used Row */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-brand-border space-y-2.5">
                <span className="text-[10px] font-bold uppercase text-slate-400 block tracking-wider">
                  Inputs Used in Diagnosis
                </span>
                <div className="flex flex-wrap gap-2 text-xs">
                  <div className={`flex items-center gap-1.5 px-3 py-1 rounded-xl font-semibold ${
                    latestDiagnosis.modalitiesUsed?.text ?? true ? 'bg-sky-100 text-sky-800' : 'bg-slate-200 text-slate-400'
                  }`}>
                    <CheckCircle2 size={14} className={latestDiagnosis.modalitiesUsed?.text ?? true ? 'text-sky-600' : 'text-slate-400'} />
                    <span>Text Symptoms (NLP)</span>
                  </div>
                  <div className={`flex items-center gap-1.5 px-3 py-1 rounded-xl font-semibold ${
                    latestDiagnosis.modalitiesUsed?.audio ? 'bg-indigo-100 text-indigo-800' : 'bg-slate-100 text-slate-400'
                  }`}>
                    <CheckCircle2 size={14} className={latestDiagnosis.modalitiesUsed?.audio ? 'text-indigo-600' : 'text-slate-300'} />
                    <span>{latestDiagnosis.modalitiesUsed?.audio ? 'Audio Recording (librosa)' : 'Audio not provided'}</span>
                  </div>
                  <div className={`flex items-center gap-1.5 px-3 py-1 rounded-xl font-semibold ${
                    latestDiagnosis.modalitiesUsed?.image ? 'bg-teal-100 text-teal-800' : 'bg-slate-100 text-slate-400'
                  }`}>
                    <CheckCircle2 size={14} className={latestDiagnosis.modalitiesUsed?.image ? 'text-teal-600' : 'text-slate-300'} />
                    <span>{latestDiagnosis.modalitiesUsed?.image ? 'Component Photo (OpenCV)' : 'Image not provided'}</span>
                  </div>
                </div>

                {/* Multimodal Dynamic Fusion Breakdown */}
                {latestDiagnosis.modalityBreakdown && latestDiagnosis.modalityBreakdown.length > 0 && (
                  <div className="pt-2 border-t border-slate-200/80">
                    <span className="text-[10px] text-slate-500 font-semibold block mb-1.5">Late Multimodal Fusion Weights:</span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {latestDiagnosis.modalityBreakdown.map((mb, idx) => (
                        <div key={idx} className="p-2 rounded-lg bg-white border border-slate-200 text-[11px]">
                          <span className="font-bold text-brand-navy block truncate">{mb.modality}</span>
                          <div className="flex justify-between text-slate-500 mt-0.5">
                            <span>Weight: {(mb.weight * 100).toFixed(0)}%</span>
                            <span className="font-semibold text-brand-skyHover">{(mb.raw_confidence * 100).toFixed(0)}% raw</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Safety Warning if critical/high */}
              {latestDiagnosis.safetyWarning && (
                <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 space-y-1 text-xs">
                  <div className="flex items-center gap-2 font-bold text-sm">
                    <ShieldAlert size={18} className="text-rose-600" />
                    <span>Safety Warning</span>
                  </div>
                  <p className="leading-relaxed">{latestDiagnosis.safetyWarning}</p>
                </div>
              )}

              {/* Confidence Gauge */}
              <div className="p-4 rounded-2xl bg-brand-veryLight border border-brand-lightSky">
                <ConfidenceMeter confidence={latestDiagnosis.confidence} size="lg" />
              </div>

              {/* Ranked Possible Causes & Model Probabilities */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-brand-navy uppercase tracking-wider">
                    Model Fault Category Probabilities
                  </h4>
                  <span className="text-[10px] text-brand-slate font-medium">Derived from Supervised Random Forest</span>
                </div>
                {latestDiagnosis.possibleCauses.map((cause, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl border border-brand-border bg-slate-50/50 text-xs space-y-1.5">
                    <div className="flex items-center justify-between font-semibold">
                      <span className="text-brand-navy">{cause.name}</span>
                      <span className="text-brand-skyHover font-mono">{cause.confidence}% Confidence</span>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-sky-400 to-indigo-500 h-full rounded-full transition-all duration-500"
                        style={{ width: `${Math.max(cause.confidence, 4)}%` }}
                      />
                    </div>
                    {cause.description && (
                      <p className="text-[11px] text-brand-slate">{cause.description}</p>
                    )}
                  </div>
                ))}
              </div>

              {/* Diagnostic Evidence (Why this was predicted) */}
              <div>
                <h4 className="text-xs font-bold text-brand-navy uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                  <Info size={14} className="text-brand-sky" />
                  Why this was predicted (Diagnostic Evidence)
                </h4>
                <div className="p-4 rounded-2xl bg-slate-50 border border-brand-border space-y-2 text-xs">
                  {latestDiagnosis.reasoning.map((r, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-brand-slate">
                      <CheckCircle2 size={15} className="text-brand-sky mt-0.5 shrink-0" />
                      <span className="leading-relaxed">{r}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommendations */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-800 space-y-1">
                  <span className="font-bold block text-[10px] uppercase tracking-wider">Recommended Action</span>
                  <p className="leading-relaxed">{latestDiagnosis.recommendation.action}</p>
                </div>
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-100 text-amber-800 space-y-1">
                  <span className="font-bold block text-[10px] uppercase tracking-wider">What to Avoid</span>
                  <p className="leading-relaxed">{latestDiagnosis.recommendation.avoid}</p>
                </div>
              </div>

              {/* Estimated Repair Cost & CTA */}
              <div className="p-5 rounded-2xl bg-brand-veryLight border border-brand-lightSky flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
                    Estimated Repair Cost Range
                  </span>
                  <span className="text-2xl font-black text-brand-navy">
                    ₹{latestDiagnosis.estimatedCost.min.toLocaleString()} – ₹{latestDiagnosis.estimatedCost.max.toLocaleString()}
                  </span>
                  <p className="text-[10px] text-brand-slate mt-0.5">
                    Parts: ~₹{latestDiagnosis.estimatedCost.partsCost || 1800} · Labour: ~₹{latestDiagnosis.estimatedCost.labourCost || 700}
                  </p>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <Button
                    size="md"
                    variant="outline"
                    onClick={() => {
                      saveDiagnosis(latestDiagnosis);
                      setSavedSuccess(true);
                      setTimeout(() => setSavedSuccess(false), 3000);
                    }}
                    leftIcon={<Bookmark size={15} />}
                  >
                    {savedSuccess ? 'Saved to History' : 'Save Report'}
                  </Button>
                  <Button
                    size="md"
                    onClick={() => {
                      if (mechanics.length > 0) openBookingModal(mechanics[0], latestDiagnosis);
                    }}
                    leftIcon={<Wrench size={16} />}
                    rightIcon={<ArrowRight size={14} />}
                  >
                    Find a Mechanic
                  </Button>
                </div>
              </div>

              {/* Model Transparency Box */}
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-brand-border text-[11px] text-slate-500 space-y-1">
                <div className="flex items-center justify-between font-semibold text-brand-navy">
                  <span>Model: {latestDiagnosis.modelInfo?.name || 'DriveIQ Diagnostic Engine'}</span>
                  <span>v{latestDiagnosis.modelInfo?.version || '1.0'}</span>
                </div>
                <p>
                  Architecture: {latestDiagnosis.modelInfo?.model_type || 'TF-IDF + Random Forest Classifier (Late Multimodal Fusion)'}
                </p>
                <p className="italic text-[10px] text-slate-400">
                  Notice: This preliminary machine learning assessment does not replace certified professional workshop inspection.
                </p>
              </div>
            </Card>
          ) : (
            <Card className="p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
              <div className="w-16 h-16 rounded-2xl bg-brand-lightSky text-brand-skyHover flex items-center justify-center mb-4 border border-sky-100">
                <Cpu size={32} />
              </div>
              <h3 className="text-base font-bold text-brand-navy mb-1">
                Ready for Multimodal Diagnostic Analysis
              </h3>
              <p className="text-xs text-brand-slate max-w-sm mb-4">
                Describe symptoms, upload component photos, or record acoustic anomalies on the left, then click "Analyze Problem".
              </p>
            </Card>
          )}
        </div>
      </div>

      {/* Previous AI Diagnoses History Section */}
      <div className="space-y-4 pt-4 border-t border-brand-border">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-brand-navy flex items-center gap-2">
              <History size={18} className="text-brand-sky" />
              Previous AI Diagnoses
            </h3>
            <p className="text-xs text-brand-slate">Historical AI assessment records and mechanic verification outcomes</p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-brand-slate">
            {diagnoses.length} Records
          </span>
        </div>

        {diagnoses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {diagnoses.map((d) => {
              const diagVeh = vehicles.find((v) => v.id === d.vehicleId);
              return (
                <Card key={d.id} className="p-5 hover:border-brand-sky/60 transition space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-brand-lightSky text-brand-skyHover uppercase tracking-wider">
                      {d.category}
                    </span>
                    <Badge
                      variant={d.severity === 'critical' ? 'danger' : d.severity === 'high' ? 'warning' : 'sky'}
                      size="sm"
                    >
                      {d.severity.toUpperCase()}
                    </Badge>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-brand-navy line-clamp-1">{d.title}</h4>
                    <p className="text-[11px] text-brand-slate mt-0.5">
                      {diagVeh ? `${diagVeh.year} ${diagVeh.make} ${diagVeh.model}` : 'Vehicle'} · {new Date(d.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100">
                    <div className="flex items-center gap-1 font-semibold text-brand-navy">
                      <span>{d.confidence}%</span>
                      <span className="text-[10px] text-brand-slate font-normal">Confidence</span>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => openDiagnosisDetailModal(d)}
                      leftIcon={<Eye size={13} />}
                    >
                      View Report
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        ) : (
          <EmptyState
            icon={<History size={32} />}
            title="No Diagnoses Saved Yet"
            description="Run your first AI vehicle diagnosis above to generate diagnostic reports and track vehicle health."
          />
        )}
      </div>
    </div>
  );
};

// 3. Mechanics Finder View (Working Filters & Booking)
export const OwnerMechanicsView: React.FC = () => {
  const { mechanics, openMechanicProfileModal, openBookingModal } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [vehicleFilter, setVehicleFilter] = useState<'All' | 'Bike' | 'Car'>('All');

  const filtered = mechanics.filter((m) => {
    const matchSearch =
      m.workshopName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.specializations.some((s) => s.toLowerCase().includes(searchTerm.toLowerCase())) ||
      m.address.toLowerCase().includes(searchTerm.toLowerCase());

    const matchType = vehicleFilter === 'All' || m.vehicleTypes.includes(vehicleFilter as any);

    return matchSearch && matchType;
  });

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-sky-100 text-sky-800 text-xs font-bold mb-1 border border-sky-200">
            <Search size={13} />
            <span>Mechanic Discovery</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">Find Certified Mechanics</h2>
          <p className="text-xs text-slate-600">Vetted local workshops equipped with AI diagnosis verification</p>
        </div>

        {/* Filter controls */}
        <div className="flex items-center gap-2">
          <div className="relative w-48 sm:w-64">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search garage or specialty..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white"
            />
          </div>
          <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            {['All', 'Bike', 'Car'].map((tab) => (
              <button
                key={tab}
                onClick={() => setVehicleFilter(tab as any)}
                className={`px-2.5 py-1 rounded-lg transition ${
                  vehicleFilter === tab ? 'bg-white text-brand-navy shadow-xs' : 'text-brand-slate'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filtered.map((mech) => (
          <Card key={mech.id} hoverEffect className="p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-start gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-brand-lightSky border border-brand-sky/30 flex items-center justify-center text-brand-navy shadow-xs shrink-0">
                  <User size={22} className="text-brand-navy" />
                </div>
                <div>
                  <h3 className="font-bold text-brand-navy text-base">{mech.workshopName}</h3>
                  <div className="flex items-center gap-1 text-xs text-amber-500 font-semibold mt-0.5">
                    <Star size={13} fill="currentColor" />
                    <span>{mech.rating}</span>
                    <span className="text-slate-400 font-normal">({mech.reviewCount} reviews)</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-xs text-brand-slate mb-4">
                <div className="flex items-center gap-2">
                  <MapPin size={14} className="text-brand-sky shrink-0" />
                  <span>{mech.distanceKm} km away · {mech.address.split(',')[1] || 'Bengaluru'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={14} className="text-brand-sky shrink-0" />
                  <span>{mech.workingHours}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5 mb-6">
                {mech.specializations.slice(0, 3).map((spec, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 text-brand-slate font-medium"
                  >
                    {spec}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-4 border-t border-brand-border/60">
              <Button
                variant="outline"
                size="sm"
                onClick={() => openMechanicProfileModal(mech)}
              >
                View Profile
              </Button>
              <Button
                size="sm"
                onClick={() => openBookingModal(mech, null)}
              >
                Book Service
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

// 4. Bookings & Live Service Tracking
export const OwnerBookingsView: React.FC = () => {
  const { bookings, updateBookingStatus, openConfirmDialog } = useData();

  const getTimelineSteps = (status: string) => {
    const sequence = [
      { id: 'pending', label: 'Booking Confirmed' },
      { id: 'accepted', label: 'Vehicle Received' },
      { id: 'diagnosing', label: 'Diagnosis' },
      { id: 'repairing', label: 'Repair' },
      { id: 'quality_check', label: 'Quality Check' },
      { id: 'completed', label: 'Completed' },
    ];

    const currentIdx = sequence.findIndex((s) => s.id === status);
    const activeIndex = currentIdx === -1 ? (status === 'accepted' || status === 'vehicle_received' ? 1 : 0) : currentIdx;

    return sequence.map((step, idx) => ({
      ...step,
      done: idx <= activeIndex,
      active: idx === activeIndex,
    }));
  };

  const handleCancel = (bookingId: string) => {
    openConfirmDialog({
      title: 'Cancel Service Booking',
      message: 'Are you sure you want to cancel this scheduled service appointment?',
      confirmLabel: 'Cancel Booking',
      isDanger: true,
      onConfirm: () => updateBookingStatus(bookingId, 'cancelled'),
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-teal-100 text-teal-800 text-xs font-bold mb-1 border border-teal-200">
            <CalendarCheck size={13} />
            <span>Active Service Tracking</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">My Service Bookings & Tracking</h2>
          <p className="text-xs text-slate-600">Track active vehicle repairs, workshop bay progress, and scheduled appointments in real time.</p>
        </div>
        <span className="text-xs font-bold px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 shadow-2xs">
          {bookings.length} Total Bookings
        </span>
      </div>

      {bookings.length === 0 ? (
        <EmptyState
          icon={<CalendarCheck size={32} />}
          title="No Active Bookings"
          description="You don't have any scheduled appointments. Book a service with a vetted mechanic."
        />
      ) : (
        <div className="space-y-6">
          {bookings.map((b) => {
            const steps = getTimelineSteps(b.status);
            const isCompleted = b.status === 'completed';
            const isCancelled = b.status === 'cancelled';

            return (
              <div
                key={b.id}
                className={`p-6 rounded-2xl border shadow-xs bg-white ${
                  isCompleted
                    ? 'border-emerald-200 border-l-4 border-l-emerald-500'
                    : isCancelled
                    ? 'border-rose-200 border-l-4 border-l-rose-500'
                    : 'border-teal-200 border-l-4 border-l-teal-500'
                }`}
              >
                <div className="flex flex-wrap items-start justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                        {b.bookingReference}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider border ${
                          isCompleted
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                            : isCancelled
                            ? 'bg-rose-100 text-rose-800 border-rose-200'
                            : 'bg-teal-100 text-teal-800 border-teal-200'
                        }`}
                      >
                        {b.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                    <h3 className="text-lg font-extrabold text-slate-900">{b.serviceType}</h3>
                    <p className="text-xs text-slate-600">Problem: "{b.problemSummary}"</p>
                  </div>

                  <div className="text-right bg-slate-50 p-3 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Estimated Amount</span>
                    <span className="text-xl font-black text-slate-900 font-mono">
                      ₹{b.estimatedTotal ? b.estimatedTotal.toLocaleString() : '2,400'}
                    </span>
                  </div>
                </div>

                {/* Live Timeline */}
                <div className="mb-6">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
                    Live Workshop Service Progress
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
                    {steps.map((step, idx) => (
                      <div
                        key={idx}
                        className={`p-3 rounded-xl text-center border text-xs font-semibold transition-all ${
                          step.done
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                            : step.active
                            ? 'bg-teal-50 border-teal-400 text-teal-950 ring-2 ring-teal-400/20'
                            : 'bg-slate-50 border-slate-200 text-slate-400'
                        }`}
                      >
                        <span className="block text-[10px] text-slate-400 mb-0.5">Step 0{idx + 1}</span>
                        <span>{step.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between text-xs text-slate-600 pt-4 border-t border-slate-100">
                  <span>Scheduled: <strong className="text-slate-900">{b.appointmentDate} at {b.timeSlot}</strong></span>
                  {!isCompleted && !isCancelled && (
                    <button
                      onClick={() => handleCancel(b.id)}
                      className="text-rose-600 font-bold hover:underline cursor-pointer"
                    >
                      Cancel Appointment
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// 5. Service History View (View Reports)
export const OwnerHistoryView: React.FC = () => {
  const { serviceRecords, openServiceReportModal } = useData();

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-indigo-100 text-indigo-800 text-xs font-bold mb-1 border border-indigo-200">
            <History size={13} />
            <span>Digital Ledger</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">Digital Service History</h2>
          <p className="text-xs text-slate-600">Complete verified records of past repairs, parts replacement, and digital workshop invoices.</p>
        </div>
        <span className="text-xs font-bold px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 shadow-2xs">
          {serviceRecords.length} Verified Records
        </span>
      </div>

      <div className="space-y-4">
        {serviceRecords.map((rec) => (
          <div
            key={rec.id}
            onClick={() => openServiceReportModal(rec)}
            className="p-5 rounded-2xl bg-white border border-slate-200 border-l-4 border-l-indigo-500 hover:border-indigo-300 shadow-xs hover:shadow-md transition duration-200 cursor-pointer"
          >
            <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
              <div>
                <span className="text-xs font-bold text-indigo-600 block">{rec.serviceDate}</span>
                <h3 className="text-base font-extrabold text-slate-900">{rec.title}</h3>
                <p className="text-xs text-slate-500">{rec.workshopName} · {rec.mechanicName}</p>
              </div>
              <div className="text-right">
                <span className="text-lg font-black text-slate-900 font-mono block">
                  ₹{rec.finalCost.toLocaleString()}
                </span>
                <span className="text-xs text-indigo-600 font-bold hover:underline">View Full Invoice →</span>
              </div>
            </div>

            <p className="text-xs text-slate-700 bg-indigo-50/50 p-3 rounded-xl mb-3 border border-indigo-100 line-clamp-2">
              <strong className="text-indigo-900">Mechanic Diagnosis:</strong> {rec.mechanicNotes}
            </p>

            <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
              <span>Service Mileage: <strong className="text-slate-900 font-mono">{rec.mileageAtService.toLocaleString()} km</strong></span>
              <span>Next Due: <strong className="text-slate-900 font-mono">{rec.nextServiceDueMileage.toLocaleString()} km</strong></span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// 6. Maintenance View
export const OwnerMaintenanceView: React.FC = () => {
  const { activeVehicle, maintenanceRecords } = useData();

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-amber-100 text-amber-800 text-xs font-bold mb-1 border border-amber-200">
            <Droplet size={13} />
            <span>Preventive Maintenance</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            Maintenance Schedule for {activeVehicle?.make} {activeVehicle?.model}
          </h2>
          <p className="text-xs text-slate-600">
            Calculated based on current odometer ({(activeVehicle?.mileage || 24500).toLocaleString()} km) and component wear thresholds.
          </p>
        </div>
        <span className="text-xs font-bold px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 shadow-2xs">
          Odometer: {(activeVehicle?.mileage || 24500).toLocaleString()} km
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {maintenanceRecords.map((item) => {
          const isDue = item.status === 'due_soon';
          const isUpcoming = item.status === 'upcoming';

          return (
            <div
              key={item.id}
              className={`p-6 rounded-2xl border border-t-4 shadow-xs hover:shadow-md transition duration-200 flex flex-col justify-between ${
                isDue
                  ? 'bg-amber-50/70 border-amber-200 border-t-amber-500'
                  : isUpcoming
                  ? 'bg-sky-50/70 border-sky-200 border-t-sky-500'
                  : 'bg-emerald-50/70 border-emerald-200 border-t-emerald-500'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-slate-500 uppercase">{item.component}</span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                      isDue
                        ? 'bg-amber-100 text-amber-800 border-amber-200'
                        : isUpcoming
                        ? 'bg-sky-100 text-sky-800 border-sky-200'
                        : 'bg-emerald-100 text-emerald-800 border-emerald-200'
                    }`}
                  >
                    {isDue ? 'Due Soon' : isUpcoming ? 'Upcoming' : 'Healthy'}
                  </span>
                </div>

                <h3 className="text-base font-extrabold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">{item.recommendation}</p>
              </div>

              <div className="pt-3 border-t border-slate-200/80 text-xs flex items-center justify-between">
                <span className="text-slate-600 font-medium">Remaining Threshold:</span>
                <span className="font-extrabold text-slate-900 font-mono">~{item.estimatedKmRemaining} km</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// 7. Contextual AI Assistant View
export const OwnerAssistantView: React.FC = () => {
  const navigate = useNavigate();
  const { activeVehicle, mechanics, openBookingModal } = useData();
  const { aiPreferences } = useSettings();

  const engineRef = useRef<AssistantEngine>(
    new AssistantEngine(activeVehicle || undefined, aiPreferences)
  );

  useEffect(() => {
    if (activeVehicle) {
      engineRef.current.setVehicle(activeVehicle);
    }
  }, [activeVehicle]);

  useEffect(() => {
    engineRef.current.setPreferences(aiPreferences);
  }, [aiPreferences]);

  const [messages, setMessages] = useState<AssistantMessage[]>([
    {
      id: 'msg_init',
      sender: 'ai',
      type: 'text',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: `Hello Alex! I am your AutoSense AI vehicle assistant${
        activeVehicle
          ? ` for your ${activeVehicle.year} ${activeVehicle.make} ${activeVehicle.model} (${activeVehicle.mileage.toLocaleString()} km)`
          : ''
      }. Tell me about any symptom, sound, or warning light you are noticing.`,
      suggestedActions: [
        { label: 'Clicking sound when starting', type: 'input', payload: 'clicking sound when starting the bike and starter motor refuses to turn over' },
        { label: 'Engine is overheating', type: 'input', payload: 'engine temperature gauge in red zone sweet coolant boiling steam under hood' },
        { label: 'Squealing noise from brakes', type: 'input', payload: 'high pitched squealing screeching noise whenever front brake lever is pulled' },
        { label: 'Clutch slipping on throttle', type: 'input', payload: 'clutch slipping RPM shoots high when twisting throttle but bike does not accelerate' },
      ],
    },
  ]);

  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend !== undefined ? textToSend : input).trim();
    if (!text || isTyping) return;

    const userMsg: AssistantMessage = {
      id: `msg_user_${Date.now()}`,
      sender: 'user',
      type: 'text',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await engineRef.current.processMessage(text);
      setMessages((prev) => [...prev, response]);
    } catch (err) {
      console.error('Assistant error:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: `msg_err_${Date.now()}`,
          sender: 'ai',
          type: 'text',
          text: `I encountered an unexpected issue evaluating the symptom. Please try again or launch a direct scan in the AI Diagnosis tab.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleReset = () => {
    engineRef.current.resetSession(activeVehicle || undefined);
    setMessages([
      {
        id: `msg_reset_${Date.now()}`,
        sender: 'ai',
        type: 'text',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: `Conversation reset. I am ready for your next vehicle query for ${
          activeVehicle ? `${activeVehicle.make} ${activeVehicle.model}` : 'your vehicle'
        }. What would you like to investigate?`,
        suggestedActions: [
          { label: 'Clicking sound when starting', type: 'input', payload: 'clicking sound when starting the bike' },
          { label: 'Engine overheating', type: 'input', payload: 'engine is overheating in traffic' },
          { label: 'Brake grinding sound', type: 'input', payload: 'brakes are making a grinding sound' },
          { label: 'Clutch slipping', type: 'input', payload: 'RPM rises but the bike does not accelerate' },
        ],
      },
    ]);
  };

  const currentSession = engineRef.current.getSession();
  const lastAiMsg = [...messages].reverse().find((m) => m.sender === 'ai');
  const activeSuggestedActions = lastAiMsg?.suggestedActions || [];

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      {/* Top Header Card with Context & Live Diagnostic Progress */}
      <Card className="p-4 bg-white border-brand-border shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-brand-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500 text-white flex items-center justify-center shadow-xs">
              <Bot size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-brand-navy">Contextual AI Vehicle Assistant</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Live ML Engine Connected
                </span>
              </div>
              <p className="text-xs text-brand-slate">
                Active Vehicle Context:{' '}
                <strong className="text-brand-navy">
                  {activeVehicle?.make} {activeVehicle?.model} ({activeVehicle?.regNumber || 'KA 03 HM 4421'})
                </strong>{' '}
                · {activeVehicle?.mileage.toLocaleString()} km · Petrol
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              leftIcon={<RotateCcw size={13} />}
            >
              Reset Chat
            </Button>
            <Button
              size="sm"
              onClick={() => navigate('/owner/diagnosis')}
              leftIcon={<Zap size={13} />}
              className="bg-sky-500 hover:bg-sky-600 text-white font-bold"
            >
              AI Diagnosis
            </Button>
          </div>
        </div>

        {/* Diagnostic Information Progress Meter */}
        <div className="pt-3">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
            Diagnostic Telemetry Progress:
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
            <div
              className={`p-2 rounded-lg border flex items-center gap-1.5 font-semibold transition ${
                currentSession.primarySymptom || currentSession.symptoms.length > 0
                  ? 'bg-sky-50 border-sky-300 text-sky-900'
                  : 'bg-slate-50 border-slate-200 text-slate-400'
              }`}
            >
              <CheckCircle2 size={13} className={currentSession.primarySymptom || currentSession.symptoms.length > 0 ? 'text-sky-600' : 'text-slate-300'} />
              <span>1. Main Symptom</span>
            </div>
            <div
              className={`p-2 rounded-lg border flex items-center gap-1.5 font-semibold transition ${
                currentSession.conditions.length > 0 || currentSession.questionsAsked.length >= 1
                  ? 'bg-sky-50 border-sky-300 text-sky-900'
                  : 'bg-slate-50 border-slate-200 text-slate-400'
              }`}
            >
              <CheckCircle2 size={13} className={currentSession.conditions.length > 0 || currentSession.questionsAsked.length >= 1 ? 'text-sky-600' : 'text-slate-300'} />
              <span>2. Operating State</span>
            </div>
            <div
              className={`p-2 rounded-lg border flex items-center gap-1.5 font-semibold transition ${
                currentSession.questionsAsked.length >= 2 || currentSession.confidence
                  ? 'bg-sky-50 border-sky-300 text-sky-900'
                  : 'bg-slate-50 border-slate-200 text-slate-400'
              }`}
            >
              <CheckCircle2 size={13} className={currentSession.questionsAsked.length >= 2 || currentSession.confidence ? 'text-sky-600' : 'text-slate-300'} />
              <span>3. Telemetry Signal</span>
            </div>
            <div
              className={`p-2 rounded-lg border flex items-center gap-1.5 font-semibold transition ${
                messages.some((m) => m.type === 'diagnosis')
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                  : 'bg-slate-50 border-slate-200 text-slate-400'
              }`}
            >
              <CheckCircle2 size={13} className={messages.some((m) => m.type === 'diagnosis') ? 'text-emerald-600' : 'text-slate-300'} />
              <span>4. ML Assessment</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Chat Stream Window */}
      <Card className="p-0 overflow-hidden flex flex-col h-[540px] bg-white border-brand-border shadow-xs">
        <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gradient-to-b from-[#F8FAFC] to-white">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in duration-200`}
            >
              <div
                className={`flex gap-3 max-w-[85%] sm:max-w-[75%] ${
                  m.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
                }`}
              >
                {/* Avatar */}
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-xs ${
                    m.sender === 'user'
                      ? 'bg-brand-navy text-white font-bold text-xs'
                      : 'bg-sky-500 text-white shadow-sky-200'
                  }`}
                >
                  {m.sender === 'user' ? <User size={15} /> : <Bot size={17} />}
                </div>

                {/* Bubble */}
                <div
                  className={`p-4 rounded-2xl ${
                    m.sender === 'user'
                      ? 'bg-brand-navy text-white rounded-br-none shadow-sm'
                      : m.type === 'diagnosis'
                      ? 'bg-indigo-50/70 border border-indigo-200 text-brand-navy rounded-bl-none shadow-xs'
                      : 'bg-white border border-slate-200 text-brand-navy rounded-bl-none shadow-xs'
                  }`}
                >
                  {/* Sender Header */}
                  <div className="flex items-center justify-between gap-3 mb-1.5 pb-1 border-b border-black/5">
                    <span className={`text-[10px] font-bold ${m.sender === 'user' ? 'text-sky-100' : 'text-brand-slate'}`}>
                      {m.sender === 'user' ? 'You' : 'DriveIQ Assistant'}
                    </span>
                    <span className={`text-[10px] font-mono ${m.sender === 'user' ? 'text-sky-200' : 'text-slate-400'}`}>
                      {m.timestamp}
                    </span>
                  </div>

                  {/* Message Content */}
                  <div className="whitespace-pre-line font-medium text-xs leading-relaxed">
                    {m.text}
                  </div>

                  {/* Interactive Question Option Buttons */}
                  {m.type === 'question' && m.options && m.options.length > 0 && (
                    <div className="pt-3 flex flex-wrap gap-1.5">
                      {m.options.map((opt, i) => (
                        <button
                          key={i}
                          onClick={() => handleSendMessage(opt)}
                          className="text-[11px] px-3 py-1.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-800 font-semibold border border-sky-200 transition cursor-pointer text-left"
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Diagnosis Result Card embedded in chat */}
                  {m.type === 'diagnosis' && m.diagnosisResult && (
                    <div className="mt-3 p-3.5 bg-white rounded-xl border border-indigo-200 shadow-2xs space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 uppercase">
                          ML Fault Prediction
                        </span>
                        <span className="text-xs font-bold text-indigo-700 font-mono">
                          {(m.diagnosisResult.confidence * 100).toFixed(0)}% Confidence
                        </span>
                      </div>
                      <span className="text-sm font-black text-brand-navy block">
                        {m.diagnosisResult.diagnosis}
                      </span>
                      {m.diagnosisResult.evidence && m.diagnosisResult.evidence.length > 0 && (
                        <div className="space-y-1 text-[11px] text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-200 font-mono">
                          {m.diagnosisResult.evidence.map((ev, idx) => (
                            <div key={idx} className="flex items-start gap-1">
                              <span className="text-indigo-600 font-bold">•</span>
                              <span>{ev}</span>
                            </div>
                          ))}
                        </div>
                      )}
                      <div className="pt-1 flex gap-2 flex-wrap">
                        <Button
                          size="sm"
                          onClick={() => navigate('/owner/diagnosis')}
                          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold"
                          leftIcon={<Zap size={13} />}
                        >
                          View in ML Pipeline Inspector
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            if (mechanics.length > 0) openBookingModal(mechanics[0]);
                          }}
                          leftIcon={<Wrench size={13} />}
                        >
                          Book Kumar Motors
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex justify-start animate-in fade-in">
              <div className="bg-white border border-slate-200 rounded-2xl p-3.5 flex items-center gap-2 shadow-xs text-xs text-brand-slate">
                <Bot size={16} className="text-sky-500 animate-spin" />
                <span>DriveIQ is evaluating vehicle telemetry signals...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Dynamic Contextual Action Suggestion Chips */}
        {activeSuggestedActions.length > 0 && (
          <div className="px-4 py-2 bg-slate-50 border-t border-brand-border flex items-center gap-2 overflow-x-auto scrollbar-none">
            <span className="text-[10px] font-bold uppercase text-slate-400 shrink-0">Suggestions:</span>
            {activeSuggestedActions.map((action, idx) => (
              <button
                key={idx}
                onClick={() => {
                  if (action.type === 'input' && action.payload) {
                    handleSendMessage(action.payload);
                  } else if (action.type === 'diagnosis') {
                    navigate('/owner/diagnosis');
                  } else if (action.type === 'mechanic') {
                    if (mechanics.length > 0) openBookingModal(mechanics[0]);
                  }
                }}
                className="text-[11px] px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:border-sky-400 hover:bg-sky-50 text-brand-navy font-semibold transition shrink-0 cursor-pointer shadow-2xs"
              >
                {action.label}
              </button>
            ))}
          </div>
        )}

        {/* Message Input Box */}
        <div className="p-3 border-t border-brand-border bg-white flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Ask DriveIQ about symptoms, sounds, warning lights, maintenance..."
            className="flex-1 px-4 py-2.5 text-xs rounded-xl border border-brand-border focus:ring-2 focus:ring-sky-200 focus:border-sky-500 focus:outline-none font-medium text-brand-navy"
          />
          <Button
            size="sm"
            onClick={() => handleSendMessage()}
            disabled={!input.trim() || isTyping}
            className="bg-sky-500 hover:bg-sky-600 text-white font-bold px-4"
            leftIcon={<Send size={14} />}
          >
            Send
          </Button>
        </div>
      </Card>
    </div>
  );
};
