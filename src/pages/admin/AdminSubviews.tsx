import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import {
  apiAiService,
  ModelEvaluationData,
  PipelineResponse,
  HealthResponse,
} from '../../services/ai';
import {
  Users,
  Wrench,
  Car,
  Sparkles,
  Star,
  BarChart3,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Search,
  Filter,
  Download,
  AlertTriangle,
  User,
  Cpu,
  Layers,
  Activity,
  ArrowRight,
  Eye,
  Info,
  RefreshCw,
  Play,
  Check,
  ShieldAlert,
  Zap,
} from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';

// 1. Users Management Subview (Status Toggle & Confirmation)
export const AdminUsersView: React.FC = () => {
  const { vehicles, openConfirmDialog, addNotification } = useData();
  const [usersList, setUsersList] = useState([
    { id: 'usr_01', name: 'Alex Sharma', email: 'owner@demo.com', role: 'Vehicle Owner', location: 'Indiranagar, Bengaluru', status: 'Active', vehiclesCount: vehicles.length },
    { id: 'usr_02', name: 'Priya Patel', email: 'priya.p@example.com', role: 'Vehicle Owner', location: 'Whitefield, Bengaluru', status: 'Active', vehiclesCount: 1 },
    { id: 'usr_03', name: 'Karthik Raja', email: 'karthik.r@example.com', role: 'Vehicle Owner', location: 'Koramangala, Bengaluru', status: 'Active', vehiclesCount: 2 },
  ]);

  const toggleUserStatus = (user: typeof usersList[0]) => {
    const isSuspending = user.status === 'Active';
    openConfirmDialog({
      title: isSuspending ? 'Suspend User Account' : 'Activate User Account',
      message: `Are you sure you want to ${isSuspending ? 'suspend' : 're-activate'} ${user.name}'s account?`,
      confirmLabel: isSuspending ? 'Suspend' : 'Activate',
      isDanger: isSuspending,
      onConfirm: () => {
        setUsersList((prev) =>
          prev.map((u) => (u.id === user.id ? { ...u, status: isSuspending ? 'Suspended' : 'Active' } : u))
        );
        addNotification({
          userId: 'usr_admin_01',
          title: 'User Status Updated',
          message: `${user.name} is now ${isSuspending ? 'Suspended' : 'Active'}.`,
          type: isSuspending ? 'warning' : 'success',
          read: false,
        });
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-indigo-100 text-indigo-800 text-xs font-bold mb-1 border border-indigo-200">
            <Users size={13} />
            <span>User Management</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">Registered Platform Users</h2>
          <p className="text-xs text-slate-600">Manage vehicle owners, permissions, and active statuses</p>
        </div>
        <Badge variant="sky" size="md">
          {usersList.length} Active Accounts
        </Badge>
      </div>

      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-brand-border text-slate-400 uppercase font-semibold">
              <tr>
                <th className="p-4">User</th>
                <th className="p-4">Role</th>
                <th className="p-4">Location</th>
                <th className="p-4">Vehicles</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border/60">
              {usersList.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/80">
                  <td className="p-4 font-semibold text-brand-navy flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center font-bold border border-slate-200 shrink-0">
                      <User size={15} />
                    </div>
                    <div>
                      <span>{u.name}</span>
                      <span className="text-slate-400 block text-[10px]">{u.email}</span>
                    </div>
                  </td>
                  <td className="p-4"><Badge variant="sky">{u.role}</Badge></td>
                  <td className="p-4 text-brand-slate">{u.location}</td>
                  <td className="p-4 font-bold text-brand-navy">{u.vehiclesCount}</td>
                  <td className="p-4">
                    <Badge variant={u.status === 'Active' ? 'success' : 'danger'}>
                      {u.status}
                    </Badge>
                  </td>
                  <td className="p-4 text-right">
                    <Button
                      variant={u.status === 'Active' ? 'outline' : 'primary'}
                      size="sm"
                      onClick={() => toggleUserStatus(u)}
                    >
                      {u.status === 'Active' ? 'Suspend' : 'Activate'}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

// 2. Mechanics Verification & Registry Subview (Approve / Revoke)
export const AdminMechanicsView: React.FC = () => {
  const { mechanics, toggleMechanicVerification, openMechanicProfileModal } = useData();

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-indigo-100 text-indigo-800 text-xs font-bold mb-1 border border-indigo-200">
            <Wrench size={13} />
            <span>Partner Network</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">Mechanic Partner Registry & Approvals</h2>
          <p className="text-xs text-slate-600">Verify credentials, workshop audits, and platform partner status</p>
        </div>
        <Badge variant="sky" size="md">
          {mechanics.length} Registered Workshops
        </Badge>
      </div>

      <div className="space-y-4">
        {mechanics.map((m) => (
          <Card key={m.id} hoverEffect className="p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-xl bg-brand-lightSky border border-brand-sky/30 flex items-center justify-center text-brand-navy shadow-xs shrink-0">
                  <User size={22} className="text-brand-navy" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-brand-navy text-base">{m.workshopName}</h3>
                    <Badge variant={m.isVerified ? 'success' : 'warning'} size="sm" dot>
                      {m.isVerified ? 'Verified Partner' : 'Pending Audit'}
                    </Badge>
                  </div>
                  <p className="text-xs text-brand-slate mt-0.5">{m.name} · {m.experienceYears} yrs experience</p>
                  <p className="text-xs text-brand-slate mt-0.5">{m.address}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openMechanicProfileModal(m)}
                >
                  View Details
                </Button>
                <Button
                  variant={m.isVerified ? 'outline' : 'primary'}
                  size="sm"
                  onClick={() => toggleMechanicVerification(m.id)}
                >
                  {m.isVerified ? 'Revoke Partner' : 'Approve Partner'}
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

// 3. AI Diagnoses Intelligence, Model Performance & AI Model Lab Subview
export const AdminDiagnosesView: React.FC = () => {
  const navigate = useNavigate();
  const { diagnoses, openDiagnosisDetailModal } = useData();
  const [activeTab, setActiveTab] = useState<'analytics' | 'lab' | 'performance'>('lab');

  // Dynamic Backend Health State
  const [backendHealth, setBackendHealth] = useState<HealthResponse | null>(null);

  // AI Model Lab state
  const [symptomText, setSymptomText] = useState('clicking sound when starting the bike and starter motor refuses to turn over');
  const [labContext, setLabContext] = useState('Motorcycle Petrol 24500km');
  const [isRunningPipeline, setIsRunningPipeline] = useState(false);
  const [pipelineProgressStep, setPipelineProgressStep] = useState(0);
  const [pipelineResult, setPipelineResult] = useState<PipelineResponse | null>(null);
  const [pipelineError, setPipelineError] = useState<string | null>(null);

  // Model Evaluation state
  const [evalData, setEvalData] = useState<ModelEvaluationData | null>(null);
  const [isLoadingEval, setIsLoadingEval] = useState(false);

  useEffect(() => {
    fetchHealthStatus();
    loadEvaluationData();

    // Poll health status every 8 seconds
    const interval = setInterval(fetchHealthStatus, 8000);
    return () => clearInterval(interval);
  }, []);

  const fetchHealthStatus = async () => {
    const health = await apiAiService.checkHealth();
    setBackendHealth(health);
  };

  const loadEvaluationData = async () => {
    setIsLoadingEval(true);
    const data = await apiAiService.getModelEvaluation();
    if (data) {
      setEvalData(data);
    }
    setIsLoadingEval(false);
  };

  /**
   * Real Execution of ML Pipeline via POST /api/ml/pipeline
   */
  const handleRunPipeline = async (overrideText?: string) => {
    const textToRun = (overrideText !== undefined ? overrideText : symptomText).trim();

    if (!textToRun) {
      setPipelineError('Please enter a vehicle symptom.');
      return;
    }

    setPipelineError(null);
    setIsRunningPipeline(true);
    setPipelineProgressStep(1);

    // Multi-stage animated pipeline step progression
    const t1 = setTimeout(() => setPipelineProgressStep(2), 300);
    const t2 = setTimeout(() => setPipelineProgressStep(3), 600);
    const t3 = setTimeout(() => setPipelineProgressStep(4), 900);

    try {
      const result = await apiAiService.runMlPipeline(textToRun, labContext);
      setPipelineResult(result);
      setPipelineProgressStep(4);
    } catch (err: any) {
      console.error('ML pipeline error:', err);
      setPipelineError(err.message || 'ML backend unavailable. Check the backend logs.');
    } finally {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      setIsRunningPipeline(false);
    }
  };

  const handleExport = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(diagnoses, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', 'driveiq_diagnoses_audit.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Metric aggregates
  const totalCount = diagnoses.length;
  const highConfCount = diagnoses.filter((d) => d.confidence >= 75).length;
  const needsInspectCount = diagnoses.filter((d) => d.confidence >= 50 && d.confidence < 75).length;
  const lowConfCount = diagnoses.filter((d) => d.confidence < 50).length;

  // Category counts
  const categoryCounts: Record<string, number> = {};
  diagnoses.forEach((d) => {
    categoryCounts[d.category] = (categoryCounts[d.category] || 0) + 1;
  });

  return (
    <div className="space-y-6">
      {/* Header & Sub-Tabs Navigation */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 uppercase tracking-wider">
              AIML Department System
            </span>
            {backendHealth?.status === 'ok' ? (
              <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                ML Backend Online (FastAPI:8000) · {backendHealth.model_name} v{backendHealth.model_version}
              </span>
            ) : (
              <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                ML Backend Offline (FastAPI:8000)
              </span>
            )}
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">AI Diagnostics & Machine Learning Lab</h2>
          <p className="text-xs text-slate-600">
            Inspect real-time AI diagnoses, execute end-to-end ML feature extraction, and inspect cross-validation metrics
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" onClick={handleExport} leftIcon={<Download size={14} />}>
            Export Audit Logs
          </Button>
        </div>
      </div>

      {/* Navigation Pills */}
      <div className="flex border-b border-brand-border gap-2 pb-1">
        <button
          onClick={() => setActiveTab('lab')}
          className={`px-4 py-2 text-xs font-bold rounded-t-xl transition flex items-center gap-2 ${
            activeTab === 'lab'
              ? 'bg-white border-t-2 border-indigo-600 text-brand-navy shadow-xs'
              : 'text-brand-slate hover:text-brand-navy'
          }`}
        >
          <Cpu size={15} className={activeTab === 'lab' ? 'text-indigo-600' : 'text-slate-400'} />
          AI Model Lab (College Demo)
        </button>
        <button
          onClick={() => setActiveTab('analytics')}
          className={`px-4 py-2 text-xs font-bold rounded-t-xl transition flex items-center gap-2 ${
            activeTab === 'analytics'
              ? 'bg-white border-t-2 border-brand-sky text-brand-navy shadow-xs'
              : 'text-brand-slate hover:text-brand-navy'
          }`}
        >
          <BarChart3 size={15} className={activeTab === 'analytics' ? 'text-brand-sky' : 'text-slate-400'} />
          AI Diagnostics Analytics
        </button>
        <button
          onClick={() => setActiveTab('performance')}
          className={`px-4 py-2 text-xs font-bold rounded-t-xl transition flex items-center gap-2 ${
            activeTab === 'performance'
              ? 'bg-white border-t-2 border-teal-600 text-brand-navy shadow-xs'
              : 'text-brand-slate hover:text-brand-navy'
          }`}
        >
          <Activity size={15} className={activeTab === 'performance' ? 'text-teal-600' : 'text-slate-400'} />
          Model Evaluation Metrics
        </button>
      </div>

      {/* TAB 1: AI DIAGNOSTICS ANALYTICS */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          {/* Summary Stat Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Card className="p-4 border-l-4 border-l-brand-sky">
              <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Total AI Diagnoses</span>
              <span className="text-2xl font-black text-brand-navy">{totalCount}</span>
              <span className="text-[10px] text-brand-slate block mt-1">Platform-wide audits</span>
            </Card>
            <Card className="p-4 border-l-4 border-l-emerald-500">
              <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">High Confidence (&gt;75%)</span>
              <span className="text-2xl font-black text-emerald-600">{highConfCount}</span>
              <span className="text-[10px] text-brand-slate block mt-1">Direct pattern matches</span>
            </Card>
            <Card className="p-4 border-l-4 border-l-amber-500">
              <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Needs Inspection</span>
              <span className="text-2xl font-black text-amber-600">{needsInspectCount}</span>
              <span className="text-[10px] text-brand-slate block mt-1">Moderate likelihood (50-75%)</span>
            </Card>
            <Card className="p-4 border-l-4 border-l-rose-500">
              <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Low Confidence (&lt;50%)</span>
              <span className="text-2xl font-black text-rose-600">{lowConfCount}</span>
              <span className="text-[10px] text-brand-slate block mt-1">Manual diagnostic required</span>
            </Card>
          </div>

          {/* Fault Category Distribution */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-brand-navy flex items-center gap-2">
                <BarChart3 size={16} className="text-brand-sky" />
                Most Detected Fault Categories
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-brand-lightSky text-brand-skyHover">
                8 Target Fault Classes
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              {Object.entries(categoryCounts).map(([cat, count]) => {
                const percent = Math.round((count / (totalCount || 1)) * 100);
                return (
                  <div key={cat} className="p-3 bg-slate-50 rounded-xl border border-brand-border space-y-1.5">
                    <div className="flex justify-between font-semibold">
                      <span className="text-brand-navy">{cat}</span>
                      <span className="text-brand-skyHover font-mono">{count} cases ({percent}%)</span>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div className="bg-brand-sky h-full rounded-full" style={{ width: `${percent}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Audit Logs List */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-brand-navy">Recent Diagnostic Records</h3>
            <div className="space-y-3">
              {diagnoses.map((d) => (
                <Card
                  key={d.id}
                  hoverEffect
                  onClick={() => openDiagnosisDetailModal(d)}
                  className="p-5 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-brand-lightSky text-brand-skyHover uppercase">
                        {d.category}
                      </span>
                      <Badge variant={d.severity === 'critical' ? 'danger' : d.severity === 'high' ? 'warning' : 'sky'} size="sm">
                        {d.severity.toUpperCase()}
                      </Badge>
                      <span className="text-xs font-mono text-slate-400">{d.createdAt.split('T')[0]}</span>
                    </div>
                    <h4 className="text-base font-bold text-brand-navy">{d.title}</h4>
                    <p className="text-xs text-brand-slate mt-0.5 line-clamp-1">Symptom: "{d.inputSymptoms}"</p>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    <div className="text-right">
                      <span className="text-sm font-bold text-brand-skyHover font-mono">{d.confidence}% AI</span>
                      <span className="text-[10px] text-slate-400 block">Confidence</span>
                    </div>
                    <Button variant="outline" size="sm" leftIcon={<Eye size={14} />}>
                      Inspect Report
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: AI MODEL LAB (COLLEGE DEMO MODE) */}
      {activeTab === 'lab' && (
        <div className="space-y-6">
          <Card className="p-6 border-l-4 border-l-indigo-600 bg-gradient-to-r from-indigo-50/50 via-white to-white">
            <div className="flex items-center gap-2 mb-2">
              <Cpu size={18} className="text-indigo-600" />
              <h3 className="text-base font-bold text-brand-navy">Interactive Machine Learning Pipeline Inspector</h3>
            </div>
            <p className="text-xs text-brand-slate leading-relaxed mb-4">
              Designed specifically for AIML Department evaluation and viva demonstrations. Enter any symptom string below to execute the live Python pipeline: <strong>Tokenization → TF-IDF N-Gram Vectorizer → Random Forest Classifier → Probability Distribution → Diagnosis</strong>.
            </p>

            {/* Input form */}
            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-brand-navy block mb-1">Test Symptom Input:</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={symptomText}
                    onChange={(e) => setSymptomText(e.target.value)}
                    placeholder="Enter symptom text e.g. clicking sound when starting the bike..."
                    className="flex-1 px-3 py-2 text-xs rounded-xl border border-brand-border bg-white focus:ring-2 focus:ring-indigo-200 focus:outline-none font-medium text-brand-navy"
                  />
                  <Button
                    size="md"
                    isLoading={isRunningPipeline}
                    disabled={isRunningPipeline}
                    onClick={() => handleRunPipeline()}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold shrink-0 shadow-xs"
                    leftIcon={<Play size={14} />}
                  >
                    {isRunningPipeline ? 'Running ML Pipeline...' : 'Run ML Pipeline'}
                  </Button>
                </div>
              </div>

              {/* Quick Test Case Buttons */}
              <div className="flex flex-wrap gap-1.5 items-center pt-1">
                <span className="text-[10px] font-bold text-slate-400">Quick Test Cases:</span>
                {[
                  {
                    label: 'Starter Clicking',
                    text: 'clicking sound when starting the bike and starter motor refuses to turn over',
                  },
                  {
                    label: 'Brake Squeal',
                    text: 'high pitched squealing screeching noise whenever front brake lever is pulled',
                  },
                  {
                    label: 'Engine Overheating',
                    text: 'engine temperature gauge in red zone sweet coolant boiling steam under hood',
                  },
                  {
                    label: 'Clutch Slipping',
                    text: 'clutch slipping RPM shoots high when twisting throttle but bike does not accelerate',
                  },
                ].map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    disabled={isRunningPipeline}
                    onClick={() => {
                      setSymptomText(p.text);
                    }}
                    className="text-[10px] px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold border border-indigo-200 transition disabled:opacity-50"
                  >
                    {p.label}
                  </button>
                ))}
              </div>

              {/* Error Message */}
              {pipelineError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-2 animate-in fade-in">
                  <ShieldAlert size={16} className="text-rose-600 shrink-0" />
                  <span>{pipelineError}</span>
                </div>
              )}

              {/* Live Animated Pipeline Progress */}
              {isRunningPipeline && (
                <div className="p-3.5 bg-indigo-50/70 border border-indigo-200 rounded-xl space-y-2 text-xs">
                  <div className="flex items-center justify-between text-[11px] font-bold text-indigo-900">
                    <span className="flex items-center gap-1.5">
                      <RefreshCw size={13} className="animate-spin text-indigo-600" />
                      Executing Pipeline on FastAPI Backend (port 8000)...
                    </span>
                    <span className="font-mono">Stage {pipelineProgressStep} of 4</span>
                  </div>
                  <div className="grid grid-cols-4 gap-1 text-[10px] font-semibold text-center">
                    <span className={`p-1 rounded ${pipelineProgressStep >= 1 ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-400'}`}>
                      1. Preprocess
                    </span>
                    <span className={`p-1 rounded ${pipelineProgressStep >= 2 ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-400'}`}>
                      2. TF-IDF
                    </span>
                    <span className={`p-1 rounded ${pipelineProgressStep >= 3 ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-400'}`}>
                      3. Classifier
                    </span>
                    <span className={`p-1 rounded ${pipelineProgressStep >= 4 ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-400'}`}>
                      4. Diagnosis
                    </span>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Pipeline Stage Visualizer */}
          {pipelineResult && (
            <div className="space-y-4 animate-in fade-in duration-300">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <Layers size={14} className="text-indigo-600" />
                  Inference Pipeline Stages (4-Stage Real Execution)
                </h4>
                <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  HTTP 200 · FastAPI Response
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Stage 1: Preprocessing */}
                <Card className="p-5 space-y-3 border-t-4 border-t-sky-500">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-sky-100 text-sky-800 uppercase">
                      Stage 1: Preprocessing
                    </span>
                    <span className="text-[11px] font-mono text-slate-500 font-bold">
                      {pipelineResult.stage1?.token_count ?? 0} Tokens
                    </span>
                  </div>
                  <h5 className="text-xs font-bold text-brand-navy">Tokenization & N-Gram Normalization</h5>
                  <p className="text-[11px] text-brand-slate font-mono bg-slate-50 p-2.5 rounded-xl border border-brand-border break-words">
                    "{pipelineResult.stage1?.normalized_text || symptomText}"
                  </p>
                  <div className="flex flex-wrap gap-1 max-h-[80px] overflow-y-auto">
                    {(pipelineResult.stage1?.tokens || []).map((tok, i) => (
                      <span key={i} className="text-[10px] px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md font-mono border border-slate-200">
                        {tok}
                      </span>
                    ))}
                  </div>
                </Card>

                {/* Stage 2: Feature Extraction */}
                <Card className="p-5 space-y-3 border-t-4 border-t-indigo-500">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 uppercase">
                      Stage 2: Feature Vector
                    </span>
                    <span className="text-[11px] font-mono text-indigo-700 font-bold">
                      Vocab Size: {pipelineResult.stage2?.vocabulary_size ?? 500}
                    </span>
                  </div>
                  <h5 className="text-xs font-bold text-brand-navy">TF-IDF Extracted Non-Zero Feature Weights</h5>
                  <div className="space-y-1 max-h-[140px] overflow-y-auto pr-1">
                    {(pipelineResult.stage2?.top_features || []).map((f, i) => (
                      <div key={i} className="flex items-center justify-between text-[11px] p-1.5 bg-indigo-50/60 rounded-lg border border-indigo-100">
                        <span className="font-mono text-indigo-900 font-semibold">{f.term}</span>
                        <span className="font-mono text-indigo-600 font-bold">{f.weight}</span>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Stage 3: Classifier Output */}
                <Card className="p-5 space-y-3 border-t-4 border-t-emerald-500">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 uppercase">
                      Stage 3: Model Prediction
                    </span>
                    <Badge variant="success" size="sm">
                      {pipelineResult.stage3?.model || 'Random Forest Classifier'}
                    </Badge>
                  </div>

                  {pipelineResult.stage3 ? (
                    <>
                      <div className="p-2.5 bg-emerald-50/70 rounded-xl border border-emerald-200 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] font-bold uppercase text-emerald-800 block">Predicted Class:</span>
                          <span className="text-xs font-black text-emerald-950">
                            {pipelineResult.stage3.prediction || 'Model prediction unavailable'}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-bold font-mono text-emerald-800">
                            {(
                              ((pipelineResult.stage3.probability ??
                                pipelineResult.stage3.class_probabilities?.[0]?.probability ??
                                pipelineResult.stage3.probabilities?.[0]?.probability ??
                                0) *
                              100)
                            ).toFixed(1)}%
                          </span>
                          <span className="text-[10px] text-emerald-700 block">Probability</span>
                        </div>
                      </div>

                      <h5 className="text-xs font-bold text-brand-navy">Class Probability Distribution</h5>
                      <div className="space-y-1.5 max-h-[140px] overflow-y-auto pr-1 text-xs">
                        {(pipelineResult.stage3.class_probabilities || pipelineResult.stage3.probabilities || []).map((item, i) => {
                          const className = item.class || item.category || 'Unknown';
                          const prob = item.probability !== undefined ? item.probability : (item.percentage ? item.percentage / 100 : 0);
                          const pctStr = (prob * 100).toFixed(1);
                          return (
                            <div key={i} className="space-y-0.5">
                              <div className="flex justify-between text-[11px]">
                                <span className={`font-semibold ${i === 0 ? 'text-emerald-900 font-bold' : 'text-brand-navy'}`}>
                                  {className}
                                </span>
                                <span className="font-mono text-brand-slate font-bold">{pctStr}%</span>
                              </div>
                              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                                <div
                                  className={`h-full rounded-full transition-all duration-500 ${
                                    i === 0 ? 'bg-emerald-500' : 'bg-slate-300'
                                  }`}
                                  style={{ width: `${Math.max(Number(pctStr), 2)}%` }}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </>
                  ) : (
                    <p className="text-xs text-slate-400 italic">Model prediction unavailable.</p>
                  )}
                </Card>

                {/* Stage 4: Final Diagnosis */}
                <Card className="p-5 space-y-3 border-t-4 border-t-amber-500 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800 uppercase">
                        Stage 4: Final Diagnosis
                      </span>
                      {pipelineResult.stage4?.severity && (
                        <Badge
                          variant={
                            pipelineResult.stage4.severity === 'Critical'
                              ? 'danger'
                              : pipelineResult.stage4.severity === 'High'
                              ? 'warning'
                              : 'sky'
                          }
                          size="sm"
                        >
                          {pipelineResult.stage4.severity.toUpperCase()} SEVERITY
                        </Badge>
                      )}
                    </div>

                    {pipelineResult.stage4 ? (
                      <>
                        <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200 space-y-1 text-xs">
                          <span className="text-[10px] font-bold uppercase text-amber-800 block">Predicted Diagnosis:</span>
                          <span className="text-base font-black text-brand-navy block">
                            {pipelineResult.stage4.diagnosis || 'Final diagnosis unavailable'}
                          </span>
                          <span className="text-xs font-bold text-amber-900 block font-mono">
                            {((pipelineResult.stage4.confidence ?? 0) * 100).toFixed(1)}% Confidence
                          </span>
                        </div>

                        <div>
                          <span className="text-[10px] font-bold uppercase text-slate-400 block mb-0.5">Recommended Action:</span>
                          <p className="text-[11px] text-brand-slate leading-relaxed">
                            {pipelineResult.stage4.recommendation || 'Inspect vehicle with a certified mechanic.'}
                          </p>
                        </div>
                      </>
                    ) : (
                      <p className="text-xs text-slate-400 italic">Final diagnosis unavailable.</p>
                    )}
                  </div>

                  <Button
                    size="sm"
                    onClick={() => navigate('/owner/diagnosis')}
                    className="w-full mt-2 bg-brand-sky hover:bg-sky-600 text-white font-bold"
                    rightIcon={<ArrowRight size={13} />}
                  >
                    View Full Diagnostic Report
                  </Button>
                </Card>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: MODEL EVALUATION & PERFORMANCE METRICS */}
      {activeTab === 'performance' && (
        <div className="space-y-6">
          {evalData ? (
            <>
              {/* Top CV Metrics Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <Card className="p-4 border-l-4 border-l-emerald-500">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">5-Fold CV Accuracy</span>
                  <span className="text-2xl font-black text-emerald-600">
                    {(evalData.overall_accuracy * 100).toFixed(1)}%
                  </span>
                  <span className="text-[10px] text-brand-slate block mt-1">Stratified Cross-Validation</span>
                </Card>
                <Card className="p-4 border-l-4 border-l-sky-500">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Macro Precision</span>
                  <span className="text-2xl font-black text-sky-600">
                    {(evalData.macro_precision * 100).toFixed(1)}%
                  </span>
                  <span className="text-[10px] text-brand-slate block mt-1">Average across 8 classes</span>
                </Card>
                <Card className="p-4 border-l-4 border-l-indigo-500">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Macro Recall</span>
                  <span className="text-2xl font-black text-indigo-600">
                    {(evalData.macro_recall * 100).toFixed(1)}%
                  </span>
                  <span className="text-[10px] text-brand-slate block mt-1">Sensitivity / Detection rate</span>
                </Card>
                <Card className="p-4 border-l-4 border-l-purple-500">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Weighted F1-Score</span>
                  <span className="text-2xl font-black text-purple-600">
                    {evalData.weighted_f1.toFixed(3)}
                  </span>
                  <span className="text-[10px] text-brand-slate block mt-1">Harmonic mean of P & R</span>
                </Card>
              </div>

              {/* Confusion Matrix Table */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-sm font-bold text-brand-navy flex items-center gap-2">
                      <Activity size={16} className="text-brand-sky" />
                      Cross-Validation Confusion Matrix (8×8)
                    </h3>
                    <p className="text-xs text-brand-slate">
                      Rows represent true vehicle fault categories; columns represent predicted classes
                    </p>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-slate-400">
                    Evaluated: {evalData.evaluation_date}
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-center text-xs border border-brand-border">
                    <thead className="bg-slate-100 text-brand-navy font-bold text-[10px]">
                      <tr>
                        <th className="p-2.5 text-left border border-brand-border">Actual \ Predicted</th>
                        {evalData.classes.map((cls, i) => (
                          <th key={i} className="p-2 border border-brand-border truncate max-w-[90px]" title={cls}>
                            {cls.split(' ')[0]}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {evalData.confusion_matrix.map((row, rowIdx) => (
                        <tr key={rowIdx} className="hover:bg-slate-50">
                          <td className="p-2 text-left font-bold text-brand-navy border border-brand-border bg-slate-50 text-[11px]">
                            {evalData.classes[rowIdx]}
                          </td>
                          {row.map((val, colIdx) => (
                            <td
                              key={colIdx}
                              className={`p-2 border border-brand-border font-mono font-bold ${
                                rowIdx === colIdx
                                  ? val > 0
                                    ? 'bg-emerald-100 text-emerald-900'
                                    : 'bg-slate-100 text-slate-400'
                                  : val > 0
                                  ? 'bg-rose-50 text-rose-700'
                                  : 'text-slate-300'
                              }`}
                            >
                              {val}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>

              {/* Per-Class Detailed Metrics Table */}
              <Card className="p-0 overflow-hidden">
                <div className="p-4 bg-slate-50 border-b border-brand-border flex items-center justify-between">
                  <h3 className="text-sm font-bold text-brand-navy">Per-Class Precision, Recall & F1 Scores</h3>
                  <span className="text-[10px] text-slate-500 font-semibold">Trained Classifier: Random Forest (120 Estimators)</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100/70 border-b border-brand-border text-slate-500 uppercase font-bold text-[10px]">
                      <tr>
                        <th className="p-3.5">Fault Category Class</th>
                        <th className="p-3.5 text-right">Precision</th>
                        <th className="p-3.5 text-right">Recall</th>
                        <th className="p-3.5 text-right">F1-Score</th>
                        <th className="p-3.5 text-right">Support</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-brand-border/60">
                      {Object.entries(evalData.per_class_metrics).map(([cls, m]) => (
                        <tr key={cls} className="hover:bg-slate-50">
                          <td className="p-3.5 font-bold text-brand-navy">{cls}</td>
                          <td className="p-3.5 text-right font-mono font-semibold text-sky-700">{(m.precision * 100).toFixed(1)}%</td>
                          <td className="p-3.5 text-right font-mono font-semibold text-indigo-700">{(m.recall * 100).toFixed(1)}%</td>
                          <td className="p-3.5 text-right font-mono font-bold text-emerald-700">{(m.f1_score * 100).toFixed(1)}%</td>
                          <td className="p-3.5 text-right font-mono text-slate-500">{m.support}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>

              {/* Top Feature Importances */}
              <Card className="p-6">
                <h3 className="text-sm font-bold text-brand-navy mb-3 flex items-center gap-2">
                  <BarChart3 size={16} className="text-indigo-600" />
                  Top Feature Importances (Gini Impurity Metric)
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  {evalData.feature_importances_top.map((f, i) => (
                    <div key={i} className="p-3 bg-slate-50 rounded-xl border border-brand-border space-y-1">
                      <span className="font-mono text-[11px] font-bold text-indigo-900 block truncate">{f.feature}</span>
                      <div className="flex justify-between text-[10px] text-slate-400">
                        <span>Rank #{i + 1}</span>
                        <span className="font-mono font-bold text-indigo-600">{f.importance}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </>
          ) : (
            <Card className="p-8 text-center space-y-3">
              <RefreshCw size={24} className="animate-spin text-brand-sky mx-auto" />
              <p className="text-xs text-brand-slate">Loading real cross-validation metrics from FastAPI server...</p>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};
