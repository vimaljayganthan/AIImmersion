import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import { useData } from '../../context/DataContext';
import {
  Car,
  Wrench,
  Activity,
  CalendarCheck,
  History,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  Fuel,
  Gauge,
  Calendar,
  Plus,
  CheckCircle2,
  Zap,
  Droplet,
  Sparkles,
  AlertTriangle,
  FileText,
  Clock,
  ExternalLink,
} from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { SettingsView } from '../settings/SettingsView';
import { AreaTrendChart, ChartDataPoint, TimeRange } from '../../components/charts/AreaTrendChart';
import { DonutDistributionChart, DonutCategory } from '../../components/charts/DonutDistributionChart';
import { MiniSparkline } from '../../components/charts/MiniSparkline';

export const OwnerSettingsView: React.FC = () => {
  return <SettingsView portalType="owner" />;
};

export const OwnerDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const {
    vehicles,
    activeVehicle,
    setActiveVehicleId,
    diagnoses,
    bookings,
    mechanics,
    openVehicleModal,
    openBookingModal,
    openDiagnosisDetailModal,
  } = useData();

  const [selectedCategoryInfo, setSelectedCategoryInfo] = useState<string | null>(null);

  const recentDiag = diagnoses[0] || {
    id: 'diag_01',
    vehicleId: 'v1',
    userId: 'u1',
    createdAt: '2026-09-13T10:00:00Z',
    title: 'Possible Weak Battery / Starter Circuit',
    category: 'Battery / Starting System',
    confidence: 82,
    severity: 'medium' as const,
    inputSymptoms: 'Clicking sound when starting, low crank speed',
    possibleCauses: [{ name: 'Battery Degradation', confidence: 82 }],
    reasoning: ['Low voltage dip during crank attempt', 'Audible relay chatter without starter motor engagement'],
    recommendation: { priority: 'medium' as const, action: 'Inspect battery terminal corrosion and verify resting voltage (>12.4V).', avoid: 'Avoid repeated crank attempts to prevent stator winding overheat.' },
    estimatedCost: { min: 1800, max: 2800, currency: 'INR' },
  };

  // Health Trend Datasets (Deterministic automotive telemetry)
  const healthDataSets: Record<TimeRange, ChartDataPoint[]> = {
    '7D': [
      { label: '07 Sep', value: 80, sublabel: 'Pre-trip scan' },
      { label: '08 Sep', value: 80, sublabel: 'Nominal' },
      { label: '09 Sep', value: 79, sublabel: 'Cold crank voltage dip' },
      { label: '10 Sep', value: 81, sublabel: 'Terminal cleaned' },
      { label: '11 Sep', value: 81, sublabel: 'Nominal' },
      { label: '12 Sep', value: 82, sublabel: 'Battery charged' },
      { label: '13 Sep', value: 82, sublabel: 'Latest telemetry' },
    ],
    '30D': [
      { label: '15 Aug', value: 76, sublabel: 'Initial baseline' },
      { label: '22 Aug', value: 78, sublabel: 'Spark plug replaced' },
      { label: '29 Aug', value: 79, sublabel: 'Chain lubed' },
      { label: '05 Sep', value: 80, sublabel: 'Brake pad check' },
      { label: '13 Sep', value: 82, sublabel: 'Current status' },
    ],
    '6M': [
      { label: 'Apr', value: 74, sublabel: '20,000 km general service' },
      { label: 'May', value: 77, sublabel: 'Post-service inspection' },
      { label: 'Jun', value: 79, sublabel: 'Battery check at Kumar Motors' },
      { label: 'Jul', value: 80, sublabel: 'Mid-monsoon telemetry' },
      { label: 'Aug', value: 78, sublabel: 'Filter cleaning' },
      { label: 'Sep', value: 82, sublabel: 'Active vehicle health' },
    ],
    '1Y': [
      { label: 'Q4 25', value: 72, sublabel: 'Year-end check' },
      { label: 'Q1 26', value: 75, sublabel: 'Spring tune-up' },
      { label: 'Q2 26', value: 78, sublabel: 'Major 20k milestone' },
      { label: 'Q3 26', value: 82, sublabel: 'Optimal condition' },
    ],
  };

  // Donut Diagnostic Categories
  const diagnosisCategories: DonutCategory[] = [
    { id: 'battery', name: 'Battery & Starting', value: 5, color: '#0EA5E9' },
    { id: 'brakes', name: 'Brake System', value: 3, color: '#10B981' },
    { id: 'clutch', name: 'Transmission & Clutch', value: 2, color: '#6366F1' },
    { id: 'engine', name: 'Engine & Valvetrain', value: 1, color: '#F59E0B' },
    { id: 'electrical', name: 'Electrical & Sensors', value: 1, color: '#8B5CF6' },
  ];

  const handleCategoryClick = (cat: DonutCategory) => {
    setSelectedCategoryInfo(
      `${cat.name}: ${cat.value} historical inspections recorded. Highest frequency candidate in past 6 months.`
    );
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Banner: Compact, Professional Automotive Styling */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-0.5 rounded-md bg-sky-100 text-sky-800 border border-sky-200">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-pulse" />
              Owner Telemetry Console
            </span>
            <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700 shadow-2xs">
              Garage: {vehicles.length} Vehicles Registered
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            Welcome back, {user?.name?.split(' ')[0] || 'Alex'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
            Live health telemetry, calibrated machine learning diagnostics, and upcoming maintenance intervals.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <Button
            size="sm"
            onClick={() => navigate('/owner/diagnosis')}
            leftIcon={<Zap size={15} />}
            className="bg-sky-500 hover:bg-sky-600 text-white font-semibold shadow-xs transition duration-150 text-xs py-2 px-3.5"
          >
            Start AI Diagnosis
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/owner/mechanics')}
            leftIcon={<Wrench size={15} />}
            className="bg-white border-slate-300 text-slate-800 hover:bg-slate-50 font-semibold shadow-2xs text-xs py-2 px-3.5"
          >
            Find a Mechanic
          </Button>
        </div>
      </div>

      {/* 2. SECTION 1: 5 COMPACT KPI CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        
        {/* KPI 1: VEHICLE HEALTH (Green Accent) */}
        <div
          onClick={() => navigate('/owner/maintenance')}
          className="p-4 rounded-2xl bg-white border border-emerald-200/90 border-t-4 border-t-emerald-500 hover:border-emerald-300 shadow-xs hover:shadow-md transition duration-150 cursor-pointer flex flex-col justify-between group"
        >
          <div>
            <div className="flex items-center justify-between text-[11px] font-bold text-emerald-800 uppercase tracking-wider mb-1">
              <span>Vehicle Health</span>
              <Activity size={15} className="text-emerald-600" />
            </div>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl font-black text-slate-900">82</span>
              <span className="text-xs font-bold text-slate-400">/ 100</span>
            </div>
            <div className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-800 font-bold text-[10px] mt-1.5 border border-emerald-200/60">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>Good Condition</span>
            </div>
          </div>
          <div className="mt-3">
            <div className="w-full bg-emerald-100 rounded-full h-1.5 overflow-hidden">
              <div className="bg-emerald-500 h-full rounded-full w-[82%]" />
            </div>
          </div>
        </div>

        {/* KPI 2: MY VEHICLES (Blue Accent) */}
        <div
          onClick={() => navigate('/owner/vehicles')}
          className="p-4 rounded-2xl bg-white border border-sky-200/90 border-t-4 border-t-sky-500 hover:border-sky-300 shadow-xs hover:shadow-md transition duration-150 cursor-pointer flex flex-col justify-between group"
        >
          <div>
            <div className="flex items-center justify-between text-[11px] font-bold text-sky-800 uppercase tracking-wider mb-1">
              <span>My Vehicles</span>
              <Car size={15} className="text-sky-600" />
            </div>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl font-black text-slate-900">{vehicles.length || 4}</span>
              <span className="text-xs font-semibold text-slate-500">Active</span>
            </div>
            <span className="text-[10px] text-sky-700 font-bold block mt-1">+1 Recently Added</span>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-[10px] text-slate-400 font-mono">Telemetry sync</span>
            <MiniSparkline data={[2, 3, 3, 4, 4]} color="#0EA5E9" height={16} width={48} />
          </div>
        </div>

        {/* KPI 3: AI DIAGNOSES (Indigo/Purple Accent) */}
        <div
          onClick={() => navigate('/owner/diagnosis')}
          className="p-4 rounded-2xl bg-white border border-indigo-200/90 border-t-4 border-t-indigo-500 hover:border-indigo-300 shadow-xs hover:shadow-md transition duration-150 cursor-pointer flex flex-col justify-between group"
        >
          <div>
            <div className="flex items-center justify-between text-[11px] font-bold text-indigo-800 uppercase tracking-wider mb-1">
              <span>AI Diagnoses</span>
              <Zap size={15} className="text-indigo-600" />
            </div>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl font-black text-slate-900">12</span>
              <span className="text-xs font-semibold text-indigo-600 font-bold">This Month</span>
            </div>
            <span className="text-[10px] text-emerald-700 font-bold block mt-1">↑ 18% vs Last Month</span>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-[10px] text-slate-400 font-mono">82% avg conf</span>
            <MiniSparkline data={[6, 8, 9, 10, 12]} color="#6366F1" height={16} width={48} />
          </div>
        </div>

        {/* KPI 4: MAINTENANCE DUE (Amber Accent) */}
        <div
          onClick={() => navigate('/owner/maintenance')}
          className="p-4 rounded-2xl bg-white border border-amber-200/90 border-t-4 border-t-amber-500 hover:border-amber-300 shadow-xs hover:shadow-md transition duration-150 cursor-pointer flex flex-col justify-between group"
        >
          <div>
            <div className="flex items-center justify-between text-[11px] font-bold text-amber-800 uppercase tracking-wider mb-1">
              <span>Maintenance</span>
              <Droplet size={15} className="text-amber-600" />
            </div>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl font-black text-slate-900">2</span>
              <span className="text-xs font-semibold text-amber-700 font-bold">Due Soon</span>
            </div>
            <span className="text-[10px] text-amber-800 font-semibold block mt-1">Next: Oil Service (~800 km)</span>
          </div>
          <div className="mt-2 pt-1 border-t border-amber-100 flex items-center justify-between text-[10px] text-amber-900 font-bold">
            <span>Schedule Bay</span>
            <ChevronRight size={12} />
          </div>
        </div>

        {/* KPI 5: SERVICE SPENDING (Teal Accent) */}
        <div
          onClick={() => navigate('/owner/history')}
          className="p-4 rounded-2xl bg-white border border-teal-200/90 border-t-4 border-t-teal-500 hover:border-teal-300 shadow-xs hover:shadow-md transition duration-150 cursor-pointer flex flex-col justify-between group col-span-2 sm:col-span-1"
        >
          <div>
            <div className="flex items-center justify-between text-[11px] font-bold text-teal-800 uppercase tracking-wider mb-1">
              <span>Service Spending</span>
              <History size={15} className="text-teal-600" />
            </div>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl font-black text-slate-900 font-mono">₹18,450</span>
            </div>
            <span className="text-[10px] text-teal-700 font-bold block mt-1">This Year · ↑ 8.2%</span>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-[10px] text-slate-400 font-mono">12 repairs</span>
            <MiniSparkline data={[12000, 14500, 16200, 18450]} color="#0D9488" height={16} width={48} />
          </div>
        </div>

      </div>

      {/* 3. SECTION 2 & 3: MIDDLE ANALYTICAL GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        
        {/* Middle Left (2 Cols): Vehicle Health Trend Chart */}
        <div className="lg:col-span-2">
          <AreaTrendChart
            title="Vehicle Health Trend"
            subtitle="Telemetry-derived health score across diagnostic scans and workshop inspections"
            dataSets={healthDataSets}
            initialRange="30D"
            color="#0EA5E9"
            gradientId="ownerHealthGrad"
            unit="/100"
            minY={60}
            maxY={100}
            badgeText="82 Nominal"
          />
        </div>

        {/* Middle Right (1 Col): AI Diagnostic Summary & Donut Chart */}
        <div className="flex flex-col gap-4">
          <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900">AI Diagnostic Summary</h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                12 Total
              </span>
            </div>

            {/* Metric Pills */}
            <div className="grid grid-cols-3 gap-2 text-center text-xs mb-3">
              <div className="p-2 bg-emerald-50/80 rounded-xl border border-emerald-200/70">
                <span className="text-[10px] font-bold text-emerald-700 block uppercase">High Conf</span>
                <span className="text-base font-black text-emerald-900">8</span>
              </div>
              <div className="p-2 bg-amber-50/80 rounded-xl border border-amber-200/70">
                <span className="text-[10px] font-bold text-amber-700 block uppercase">Inspect</span>
                <span className="text-base font-black text-amber-900">3</span>
              </div>
              <div className="p-2 bg-slate-100 rounded-xl border border-slate-200">
                <span className="text-[10px] font-bold text-slate-600 block uppercase">Low Conf</span>
                <span className="text-base font-black text-slate-800">1</span>
              </div>
            </div>

            {/* Donut Chart */}
            <DonutDistributionChart
              categories={diagnosisCategories}
              totalLabel="Diagnoses"
              onCategoryClick={handleCategoryClick}
            />

            {selectedCategoryInfo && (
              <div className="mt-2 p-2 bg-sky-50 rounded-xl border border-sky-200/70 text-[11px] text-sky-900 font-medium">
                {selectedCategoryInfo}
              </div>
            )}
          </div>
        </div>

      </div>

      {/* 4. SECTION 4 & 6: UPCOMING MAINTENANCE & ACTIVE VEHICLE SPECS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        
        {/* Upcoming Maintenance Timeline (2 Cols) */}
        <Card className="lg:col-span-2 p-5 bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">Upcoming Maintenance</h3>
              <p className="text-xs text-slate-500">Scheduled vehicle service milestones and component wear thresholds</p>
            </div>
            <button
              onClick={() => navigate('/owner/maintenance')}
              className="text-xs font-bold text-sky-600 hover:text-sky-700 hover:underline flex items-center gap-1 cursor-pointer"
            >
              All Records <ChevronRight size={13} />
            </button>
          </div>

          <div className="space-y-3">
            {/* Row 1: Oil */}
            <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 border border-amber-200">
                  <Droplet size={18} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-slate-900">Engine Oil & Filter</h4>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300/70">
                      Due in ~800 km
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5">Threshold: 25,000 km standard scheduled interval (Yamaha spec: 10W-40 Synthetic)</p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/owner/maintenance')}
                className="bg-white border-amber-300 text-amber-900 hover:bg-amber-100 text-xs font-semibold shrink-0"
              >
                View Details
              </Button>
            </div>

            {/* Row 2: Chain */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center shrink-0 border border-sky-200">
                  <Wrench size={18} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-slate-900">Drive Chain Service</h4>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-100 text-sky-900 border border-sky-300/70">
                      Due in ~1,500 km
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5">Threshold: 26,000 km slack check & high-viscosity o-ring lubricant application</p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/owner/maintenance')}
                className="bg-white border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-semibold shrink-0"
              >
                View Details
              </Button>
            </div>

            {/* Row 3: Brakes */}
            <div className="p-3.5 rounded-xl bg-emerald-50/50 border border-emerald-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-200">
                  <ShieldCheck size={18} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-slate-900">Brake Pad & Rotor Inspection</h4>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-300/70">
                      Due in ~2,200 km
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5">Threshold: 27,000 km pad thickness check (&gt;2.5mm minimum safe wear depth)</p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/owner/maintenance')}
                className="bg-white border-emerald-300 text-emerald-900 hover:bg-emerald-100 text-xs font-semibold shrink-0"
              >
                View Details
              </Button>
            </div>
          </div>
        </Card>

        {/* Active Vehicle Info Card (1 Col) */}
        <Card className="p-5 bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between mb-2">
              <div>
                <span className="text-[10px] font-bold text-sky-700 uppercase tracking-wider block">
                  Active Vehicle
                </span>
                <h3 className="text-lg font-extrabold text-slate-900 mt-0.5 leading-tight">
                  {activeVehicle?.year || 2022} {activeVehicle?.make || 'Yamaha'} {activeVehicle?.model || 'R15 V4'}
                </h3>
                <p className="text-xs text-slate-500 font-mono font-medium">
                  {activeVehicle?.regNumber || 'KA 03 HM 4421'}
                </p>
              </div>
              <div className="text-right">
                <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-200">
                  {activeVehicle?.healthScore || 82}% Health
                </span>
              </div>
            </div>

            {/* Spec Chips */}
            <div className="grid grid-cols-2 gap-2 my-3 text-xs">
              <div className="p-2 bg-slate-50 rounded-lg border border-slate-200/80">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Engine</span>
                <span className="font-bold text-slate-800">{activeVehicle?.engineCapacity || '155cc'}</span>
              </div>
              <div className="p-2 bg-slate-50 rounded-lg border border-slate-200/80">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Fuel</span>
                <span className="font-bold text-slate-800">{activeVehicle?.fuelType || 'Petrol'}</span>
              </div>
              <div className="p-2 bg-slate-50 rounded-lg border border-slate-200/80 col-span-2">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Odometer Mileage</span>
                <span className="font-bold text-slate-900 font-mono">
                  {(activeVehicle?.mileage || 24500).toLocaleString()} km
                </span>
              </div>
            </div>

            {/* Garage Switcher */}
            <div className="pt-2 border-t border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1.5">Switch Garage Vehicle</span>
              <div className="flex flex-wrap gap-1.5">
                {vehicles.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setActiveVehicleId(v.id)}
                    className={`px-2 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                      v.id === activeVehicle?.id
                        ? 'bg-sky-500 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {v.model}
                  </button>
                ))}
                <button
                  onClick={() => openVehicleModal(null)}
                  className="px-2 py-1 rounded-lg border border-dashed border-slate-300 text-slate-600 hover:bg-slate-100 transition flex items-center gap-1 text-xs cursor-pointer"
                >
                  <Plus size={11} />
                  <span>Add</span>
                </button>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 mt-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/owner/vehicles')}
              className="w-full text-xs font-semibold border-slate-300 text-slate-800 hover:bg-slate-50"
              rightIcon={<ArrowRight size={13} />}
            >
              View Full Garage Ledger
            </Button>
          </div>
        </Card>

      </div>

      {/* 5. SECTION 5: RECENT AI DIAGNOSES TABLE */}
      <Card className="p-5 bg-white border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900">Recent AI Diagnoses</h3>
            <p className="text-xs text-slate-500">Historical fault predictions from acoustic, symptom, and OBD telemetry models</p>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => navigate('/owner/diagnosis')}
            className="text-xs font-semibold border-sky-300 text-sky-800 hover:bg-sky-50"
            rightIcon={<ExternalLink size={13} />}
          >
            Run New AI Diagnosis
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider bg-slate-50/70">
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3">Vehicle</th>
                <th className="py-2.5 px-3">Reported Symptom</th>
                <th className="py-2.5 px-3">AI Prediction</th>
                <th className="py-2.5 px-3 text-center">Confidence</th>
                <th className="py-2.5 px-3 text-center">Status</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {diagnoses.slice(0, 4).map((diag) => {
                const isHighConf = diag.confidence >= 80;
                const formattedDate = diag.createdAt
                  ? new Date(diag.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
                  : '13 Sep 2026';
                return (
                  <tr key={diag.id} className="hover:bg-slate-50/80 transition duration-100">
                    <td className="py-3 px-3 font-mono text-slate-600 whitespace-nowrap">{formattedDate}</td>
                    <td className="py-3 px-3 font-bold text-slate-900 whitespace-nowrap">
                      {activeVehicle?.make || 'Yamaha'} {activeVehicle?.model || 'R15 V4'}
                    </td>
                    <td className="py-3 px-3 text-slate-700 max-w-[220px] truncate">
                      {diag.inputSymptoms}
                    </td>
                    <td className="py-3 px-3 font-semibold text-sky-900 whitespace-nowrap">
                      {diag.title}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span
                        className={`inline-block px-2 py-0.5 rounded font-mono font-bold text-[11px] ${
                          isHighConf
                            ? 'bg-emerald-100 text-emerald-900 border border-emerald-200'
                            : 'bg-amber-100 text-amber-900 border border-amber-200'
                        }`}
                      >
                        {diag.confidence}%
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <Badge variant={diag.severity === 'critical' ? 'danger' : 'sky'} size="sm">
                        {diag.severity === 'critical' ? 'Urgent' : 'Preliminary'}
                      </Badge>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => openDiagnosisDetailModal(diag)}
                        className="px-2.5 py-1 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-800 font-bold border border-sky-200 text-xs transition cursor-pointer"
                      >
                        View Report
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* 6. SECTION 7 & 8: SERVICE ACTIVITY + AI INSIGHT / EVIDENCE */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        
        {/* Recent Service Activity Timeline */}
        <Card className="p-5 bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">Recent Service Activity</h3>
                <p className="text-xs text-slate-500">Verified repair invoices and digital workshop records</p>
              </div>
              <button
                onClick={() => navigate('/owner/history')}
                className="text-xs font-bold text-teal-700 hover:underline flex items-center gap-1 cursor-pointer"
              >
                Invoices <ChevronRight size={13} />
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center font-bold font-mono text-[11px] shrink-0">
                    13 Sep
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">Battery Diagnostic Inspection</h4>
                    <p className="text-slate-500 text-[11px]">Kumar Motors · Indiranagar</p>
                  </div>
                </div>
                <div className="text-right font-mono">
                  <span className="font-bold text-slate-900 block">₹2,600</span>
                  <span className="text-[10px] text-emerald-700 font-bold">Verified</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center font-bold font-mono text-[11px] shrink-0">
                    10 Jun
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">Battery Service & Clamp Check</h4>
                    <p className="text-slate-500 text-[11px]">Kumar Motors · Indiranagar</p>
                  </div>
                </div>
                <div className="text-right font-mono">
                  <span className="font-bold text-slate-900 block">₹2,300</span>
                  <span className="text-[10px] text-emerald-700 font-bold">Verified</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center font-bold font-mono text-[11px] shrink-0">
                    02 Mar
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">Engine Oil & Synthetic Filter</h4>
                    <p className="text-slate-500 text-[11px]">SpeedPulse Moto Works · Koramangala</p>
                  </div>
                </div>
                <div className="text-right font-mono">
                  <span className="font-bold text-slate-900 block">₹850</span>
                  <span className="text-[10px] text-emerald-700 font-bold">Verified</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 mt-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/owner/history')}
              className="w-full text-xs font-semibold border-slate-300 text-slate-800 hover:bg-slate-50"
            >
              View Complete Service History
            </Button>
          </div>
        </Card>

        {/* Latest AI Insight & AIML Evidence Card */}
        <Card className="p-5 bg-gradient-to-br from-indigo-50/60 via-white to-sky-50/50 border border-indigo-200/90 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center border border-indigo-200 shadow-2xs">
                  <Sparkles size={18} />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider block">
                    Latest AI Insight (AIML Diagnostic Evidence)
                  </span>
                  <h3 className="text-base font-bold text-slate-900">
                    {recentDiag.title}
                  </h3>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded bg-indigo-100 text-indigo-900 font-mono font-bold text-xs border border-indigo-200 shrink-0">
                {recentDiag.confidence}% Confidence
              </span>
            </div>

            {/* Diagnostic Evidence Bullets */}
            <div className="p-3 bg-white/90 rounded-xl border border-indigo-200/80 text-xs text-slate-700 space-y-1.5 mb-3 shadow-2xs">
              <span className="text-[10px] font-bold uppercase text-indigo-800 block">Identified TF-IDF & Acoustic Signals:</span>
              <ul className="space-y-1 text-slate-600 text-[11px]">
                <li className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
                  <span>Clicking sound during startup (TF-IDF acoustic weight: 0.5518)</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
                  <span>Starter motor fails to crank under cold-start conditions</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
                  <span>Correlated with 24,500 km battery degradation telemetry curve</span>
                </li>
              </ul>
            </div>

            {/* Assistant Quote */}
            <div className="p-3 bg-sky-50/80 rounded-xl border border-sky-200 text-xs text-sky-900 font-medium">
              "Your vehicle health remains good (82/100), but the upcoming oil service and battery terminal clamp check should be addressed together."
            </div>
          </div>

          <div className="pt-3 border-t border-indigo-100 mt-3 flex items-center gap-2.5">
            <Button
              variant="outline"
              size="sm"
              onClick={() => openDiagnosisDetailModal(recentDiag)}
              className="flex-1 text-xs font-semibold border-indigo-300 text-indigo-900 hover:bg-indigo-50 bg-white"
            >
              View Diagnostic Evidence
            </Button>
            <Button
              size="sm"
              onClick={() => navigate('/owner/assistant')}
              className="flex-1 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              Open AI Assistant
            </Button>
          </div>
        </Card>

      </div>

      {/* 7. SECTION 9: QUICK ACTIONS ROW */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Quick Actions:</span>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            size="sm"
            onClick={() => navigate('/owner/diagnosis')}
            leftIcon={<Zap size={14} />}
            className="bg-sky-500 hover:bg-sky-600 text-white font-semibold text-xs"
          >
            Start AI Diagnosis
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/owner/mechanics')}
            leftIcon={<Wrench size={14} />}
            className="border-slate-300 text-slate-800 hover:bg-slate-50 font-semibold text-xs"
          >
            Find a Mechanic
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => openVehicleModal(null)}
            leftIcon={<Plus size={14} />}
            className="border-slate-300 text-slate-800 hover:bg-slate-50 font-semibold text-xs"
          >
            Add Vehicle
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => openBookingModal(mechanics[0])}
            leftIcon={<CalendarCheck size={14} />}
            className="border-teal-300 text-teal-800 hover:bg-teal-50 font-semibold text-xs"
          >
            Book Service
          </Button>
        </div>
      </div>
    </div>
  );
};
