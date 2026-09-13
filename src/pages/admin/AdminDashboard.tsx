import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import { useData } from '../../context/DataContext';
import {
  Users,
  Car,
  Wrench,
  CalendarCheck,
  CheckCircle2,
  Zap,
  Star,
  Activity,
  DollarSign,
  TrendingUp,
  Cpu,
  Server,
  Database,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  ExternalLink,
  Search,
  Filter,
  Download,
  AlertTriangle,
  User,
  Sparkles,
  Clock,
  Eye,
  RefreshCw,
  BarChart3,
  Sliders,
} from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { SettingsView } from '../settings/SettingsView';
import { MultiSeriesBarChart, MultiSeriesBarDataPoint, TimeRange } from '../../components/charts/MultiSeriesBarChart';
import { DonutDistributionChart, DonutCategory } from '../../components/charts/DonutDistributionChart';
import { MiniSparkline } from '../../components/charts/MiniSparkline';
import { API_BASE_URL } from '../../config/api';

export const AdminVehiclesView: React.FC = () => {
  const { vehicles } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'two-wheeler' | 'four-wheeler' | 'risk'>('all');

  const fleetList = [
    {
      id: 'veh_01',
      make: 'Yamaha',
      model: 'R15 V4',
      year: 2023,
      plate: 'KA-05-MM-4421',
      category: 'Two-Wheeler',
      fuel: 'Petrol',
      mileage: '12,450 km',
      healthScore: 92,
      owner: 'Alex Sharma',
      status: 'Healthy',
      lastScan: '12 Sep 2026',
    },
    {
      id: 'veh_02',
      make: 'Hyundai',
      model: 'i20 Asta',
      year: 2022,
      plate: 'KA-03-NB-8819',
      category: 'Four-Wheeler',
      fuel: 'Petrol',
      mileage: '28,100 km',
      healthScore: 68,
      owner: 'Alex Sharma',
      status: 'Attention Needed',
      lastScan: '10 Sep 2026',
    },
    {
      id: 'veh_03',
      make: 'Honda',
      model: 'City ZX',
      year: 2021,
      plate: 'KA-01-MJ-1204',
      category: 'Four-Wheeler',
      fuel: 'Petrol',
      mileage: '44,200 km',
      healthScore: 88,
      owner: 'Priya Patel',
      status: 'Healthy',
      lastScan: '11 Sep 2026',
    },
    {
      id: 'veh_04',
      make: 'Royal Enfield',
      model: 'Classic 350',
      year: 2020,
      plate: 'KA-04-ER-9920',
      category: 'Two-Wheeler',
      fuel: 'Petrol',
      mileage: '36,800 km',
      healthScore: 54,
      owner: 'Karthik Raja',
      status: 'Critical Alert',
      lastScan: '08 Sep 2026',
    },
    {
      id: 'veh_05',
      make: 'Tata',
      model: 'Nexon EV Max',
      year: 2023,
      plate: 'KA-51-EV-0042',
      category: 'Four-Wheeler',
      fuel: 'Electric',
      mileage: '18,600 km',
      healthScore: 96,
      owner: 'Vikram Mehta',
      status: 'Healthy',
      lastScan: '13 Sep 2026',
    },
    {
      id: 'veh_06',
      make: 'Ather',
      model: '450X Gen 3',
      year: 2023,
      plate: 'KA-02-EV-7721',
      category: 'Two-Wheeler',
      fuel: 'Electric',
      mileage: '9,120 km',
      healthScore: 94,
      owner: 'Ananya Roy',
      status: 'Healthy',
      lastScan: '13 Sep 2026',
    },
  ];

  const filteredFleet = fleetList.filter((v) => {
    const matchesSearch =
      v.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.plate.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.owner.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;
    if (categoryFilter === 'two-wheeler') return v.category === 'Two-Wheeler';
    if (categoryFilter === 'four-wheeler') return v.category === 'Four-Wheeler';
    if (categoryFilter === 'risk') return v.healthScore < 75;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Header & Overview */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-indigo-100 text-indigo-800 text-xs font-bold mb-1 border border-indigo-200">
            <Car size={13} />
            <span>Platform Fleet Registry</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">Vehicle Telemetry & Fleet Management</h2>
          <p className="text-xs text-slate-600">
            Real-time tracking of 1,824 registered vehicles across Bangalore garage ecosystems.
          </p>
        </div>
        <Badge variant="sky" size="md">
          {fleetList.length} Monitored Telemetry Nodes
        </Badge>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Fleet</span>
          <span className="text-xl font-black text-slate-900 block mt-0.5">1,824</span>
          <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1 mt-0.5">
            <TrendingUp size={11} /> +14% this month
          </span>
        </div>
        <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Two-Wheelers</span>
          <span className="text-xl font-black text-indigo-700 block mt-0.5">1,142</span>
          <span className="text-[10px] text-slate-500 font-semibold block mt-0.5">62.6% of fleet</span>
        </div>
        <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Four-Wheelers</span>
          <span className="text-xl font-black text-sky-700 block mt-0.5">682</span>
          <span className="text-[10px] text-slate-500 font-semibold block mt-0.5">37.4% of fleet</span>
        </div>
        <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">In Active Repair</span>
          <span className="text-xl font-black text-amber-700 block mt-0.5">148</span>
          <span className="text-[10px] text-amber-600 font-semibold block mt-0.5">Assigned to workshops</span>
        </div>
        <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">High Risk Scores</span>
          <span className="text-xl font-black text-rose-700 block mt-0.5">38</span>
          <span className="text-[10px] text-rose-600 font-semibold block mt-0.5">Health score &lt; 60</span>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <Card className="p-4 bg-white border-slate-200 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search make, model, plate, owner..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          <button
            onClick={() => setCategoryFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              categoryFilter === 'all'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Fleet ({fleetList.length})
          </button>
          <button
            onClick={() => setCategoryFilter('two-wheeler')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              categoryFilter === 'two-wheeler'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Two-Wheelers
          </button>
          <button
            onClick={() => setCategoryFilter('four-wheeler')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              categoryFilter === 'four-wheeler'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Four-Wheelers
          </button>
          <button
            onClick={() => setCategoryFilter('risk')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              categoryFilter === 'risk'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            High Risk Alerts
          </button>
        </div>
      </Card>

      {/* Fleet Table */}
      <Card className="p-0 overflow-hidden bg-white border-slate-200 shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
              <tr>
                <th className="p-4">Vehicle Specification</th>
                <th className="p-4">Reg Number</th>
                <th className="p-4">Category & Fuel</th>
                <th className="p-4">Mileage</th>
                <th className="p-4">Health Telemetry</th>
                <th className="p-4">Owner Name</th>
                <th className="p-4">Last Diagnostic</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredFleet.map((v) => (
                <tr key={v.id} className="hover:bg-slate-50/80 transition">
                  <td className="p-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold border border-indigo-200 shrink-0">
                        <Car size={15} />
                      </div>
                      <div>
                        <span className="font-bold text-slate-900 block">{v.year} {v.make} {v.model}</span>
                        <span className="text-[10px] text-slate-400 font-mono">ID: {v.id}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 font-mono font-bold text-slate-900">{v.plate}</td>
                  <td className="p-4">
                    <div className="space-y-0.5">
                      <span className="text-slate-700 font-semibold block">{v.category}</span>
                      <span className="text-[10px] text-slate-400">{v.fuel}</span>
                    </div>
                  </td>
                  <td className="p-4 font-mono font-semibold text-slate-600">{v.mileage}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                        <div
                          className={`h-full rounded-full ${
                            v.healthScore >= 80
                              ? 'bg-emerald-500'
                              : v.healthScore >= 60
                              ? 'bg-amber-500'
                              : 'bg-rose-500'
                          }`}
                          style={{ width: `${v.healthScore}%` }}
                        />
                      </div>
                      <Badge
                        variant={v.healthScore >= 80 ? 'success' : v.healthScore >= 60 ? 'warning' : 'danger'}
                        size="sm"
                      >
                        {v.healthScore}%
                      </Badge>
                    </div>
                  </td>
                  <td className="p-4 font-semibold text-slate-800">{v.owner}</td>
                  <td className="p-4 text-slate-500 font-mono text-[11px]">{v.lastScan}</td>
                  <td className="p-4 text-right">
                    <Button variant="outline" size="sm" className="text-xs">
                      Inspect Telemetry
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

export const AdminRequestsView: React.FC = () => {
  const { bookings } = useData();
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'accepted' | 'completed'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const sampleRequests = [
    {
      id: 'req_101',
      ref: 'BK-2026-0901',
      date: '13 Sep 2026, 10:30 AM',
      customer: 'Alex Sharma',
      vehicle: '2023 Yamaha R15 V4',
      workshop: 'Kumar Motors Workshop',
      serviceType: 'Starter Motor & Battery Diagnostic',
      amount: '₹2,700',
      status: 'pending',
      sla: 'Response within 15 min',
    },
    {
      id: 'req_102',
      ref: 'BK-2026-0902',
      date: '12 Sep 2026, 03:15 PM',
      customer: 'Priya Patel',
      vehicle: '2022 Hyundai i20 Asta',
      workshop: 'SpeedTech Auto Care',
      serviceType: 'Brake Pad Replacement & Rotor Skimming',
      amount: '₹4,500',
      status: 'accepted',
      sla: 'In Bay Repair',
    },
    {
      id: 'req_103',
      ref: 'BK-2026-0903',
      date: '11 Sep 2026, 11:00 AM',
      customer: 'Karthik Raja',
      vehicle: '2020 Royal Enfield Classic 350',
      workshop: 'Apex Precision Diagnostics',
      serviceType: 'Clutch Cable Overhaul & Engine Tune',
      amount: '₹3,200',
      status: 'completed',
      sla: 'Delivered On-Time',
    },
    {
      id: 'req_104',
      ref: 'BK-2026-0904',
      date: '10 Sep 2026, 09:45 AM',
      customer: 'Vikram Mehta',
      vehicle: '2023 Tata Nexon EV Max',
      workshop: 'SpeedTech Auto Care',
      serviceType: 'HV Battery & Regenerative Braking Audit',
      amount: '₹6,800',
      status: 'completed',
      sla: 'Delivered On-Time',
    },
  ];

  const filtered = sampleRequests.filter((r) => {
    const matchSearch =
      r.ref.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.workshop.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.serviceType.toLowerCase().includes(searchTerm.toLowerCase());
    if (!matchSearch) return false;
    if (statusFilter !== 'all' && r.status !== statusFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-amber-100 text-amber-800 text-xs font-bold mb-1 border border-amber-200">
            <CalendarCheck size={13} />
            <span>Service Dispatch Console</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">Platform Service Requests & SLAs</h2>
          <p className="text-xs text-slate-600">
            Monitor real-time customer repair requests, dispatch routing, and partner workshop SLAs.
          </p>
        </div>
        <Badge variant="warning" size="md">
          846 Total Processed Orders
        </Badge>
      </div>

      {/* KPI stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Requests</span>
          <span className="text-xl font-black text-slate-900 block mt-0.5">846</span>
          <span className="text-[10px] text-emerald-600 font-semibold block mt-0.5">99.2% Dispatch SLA</span>
        </div>
        <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Pending Dispatch</span>
          <span className="text-xl font-black text-amber-700 block mt-0.5">24</span>
          <span className="text-[10px] text-amber-600 font-semibold block mt-0.5">Avg response &lt; 8 min</span>
        </div>
        <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Active in Bay</span>
          <span className="text-xl font-black text-sky-700 block mt-0.5">112</span>
          <span className="text-[10px] text-slate-500 font-semibold block mt-0.5">Work in progress</span>
        </div>
        <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Completed & Paid</span>
          <span className="text-xl font-black text-emerald-700 block mt-0.5">698</span>
          <span className="text-[10px] text-emerald-600 font-semibold block mt-0.5">₹34.8L gross GMV</span>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-4 bg-white border-slate-200 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search booking ref, customer, workshop..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          {(['all', 'pending', 'accepted', 'completed'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition ${
                statusFilter === s
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </Card>

      {/* Requests Table */}
      <Card className="p-0 overflow-hidden bg-white border-slate-200 shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
              <tr>
                <th className="p-4">Booking Ref</th>
                <th className="p-4">Customer & Vehicle</th>
                <th className="p-4">Assigned Workshop</th>
                <th className="p-4">Service Category</th>
                <th className="p-4">Est. Revenue</th>
                <th className="p-4">Status</th>
                <th className="p-4">SLA State</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50/80 transition">
                  <td className="p-4 font-mono font-bold text-amber-700">{r.ref}</td>
                  <td className="p-4">
                    <span className="font-bold text-slate-900 block">{r.customer}</span>
                    <span className="text-[10px] text-slate-400 block">{r.vehicle}</span>
                  </td>
                  <td className="p-4 font-semibold text-slate-800">{r.workshop}</td>
                  <td className="p-4 text-slate-600">{r.serviceType}</td>
                  <td className="p-4 font-bold text-slate-900 font-mono">{r.amount}</td>
                  <td className="p-4">
                    <Badge
                      variant={
                        r.status === 'completed'
                          ? 'success'
                          : r.status === 'accepted'
                          ? 'sky'
                          : 'warning'
                      }
                      size="sm"
                    >
                      {r.status.toUpperCase()}
                    </Badge>
                  </td>
                  <td className="p-4 text-slate-500 text-[11px]">{r.sla}</td>
                  <td className="p-4 text-right">
                    <Button variant="outline" size="sm" className="text-xs">
                      Inspect
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

export const AdminReviewsView: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [ratingFilter, setRatingFilter] = useState<'all' | '5' | '4' | 'flagged'>('all');

  const reviewList = [
    {
      id: 'rev_01',
      customer: 'Alex Sharma',
      workshop: 'Kumar Motors Workshop',
      rating: 5,
      vehicle: '2023 Yamaha R15 V4',
      date: '12 Sep 2026',
      service: 'Starter Relay Replacement',
      comment: 'Super fast turnaround! AI identified the exact starting circuit fault and Rajesh fixed it within 40 minutes.',
      status: 'Verified',
      sentiment: 'Positive',
    },
    {
      id: 'rev_02',
      customer: 'Priya Patel',
      workshop: 'SpeedTech Auto Care',
      rating: 5,
      vehicle: '2022 Hyundai i20 Asta',
      date: '10 Sep 2026',
      service: 'Brake System Overhaul',
      comment: 'Transparent pricing with digital invoice. Highly recommend their brake service.',
      status: 'Verified',
      sentiment: 'Positive',
    },
    {
      id: 'rev_03',
      customer: 'Karthik Raja',
      workshop: 'Apex Precision Diagnostics',
      rating: 4,
      vehicle: '2020 Royal Enfield Classic 350',
      date: '08 Sep 2026',
      service: 'Engine Tappet Tuning',
      comment: 'Good engine diagnosis, vehicle runs much smoother now. Took slightly longer than estimated.',
      status: 'Verified',
      sentiment: 'Positive',
    },
    {
      id: 'rev_04',
      customer: 'Anand Verma',
      workshop: 'Kumar Motors Workshop',
      rating: 3,
      vehicle: '2019 Honda Activa 6G',
      date: '04 Sep 2026',
      service: 'Carburetor Cleaning',
      comment: 'Service was acceptable but parts cost estimate was updated halfway through.',
      status: 'Flagged for Audit',
      sentiment: 'Neutral',
    },
  ];

  const filtered = reviewList.filter((r) => {
    const matchSearch =
      r.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.workshop.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.comment.toLowerCase().includes(searchTerm.toLowerCase());
    if (!matchSearch) return false;
    if (ratingFilter === '5') return r.rating === 5;
    if (ratingFilter === '4') return r.rating === 4;
    if (ratingFilter === 'flagged') return r.status.includes('Flagged');
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-amber-100 text-amber-800 text-xs font-bold mb-1 border border-amber-200">
            <Star size={13} />
            <span>Workshop Quality & Reviews</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">Customer Reviews & Workshop Moderation</h2>
          <p className="text-xs text-slate-600">
            Audit customer feedback, ratings distribution, and workshop service reputation.
          </p>
        </div>
        <Badge variant="sky" size="md">
          1,248 Verified Customer Reviews
        </Badge>
      </div>

      {/* KPI stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Avg Platform Rating</span>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="text-2xl font-black text-amber-600">4.82</span>
            <div className="flex text-amber-400"><Star size={14} fill="currentColor" /></div>
          </div>
          <span className="text-[10px] text-slate-500 font-semibold block mt-0.5">Across 42 workshops</span>
        </div>
        <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">5-Star Percentage</span>
          <span className="text-2xl font-black text-emerald-700 block mt-0.5">84.2%</span>
          <span className="text-[10px] text-emerald-600 font-semibold block mt-0.5">1,051 top ratings</span>
        </div>
        <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Flagged for Review</span>
          <span className="text-2xl font-black text-rose-700 block mt-0.5">7</span>
          <span className="text-[10px] text-rose-600 font-semibold block mt-0.5">Under audit investigation</span>
        </div>
        <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Satisfaction Index</span>
          <span className="text-2xl font-black text-indigo-700 block mt-0.5">97.6%</span>
          <span className="text-[10px] text-indigo-600 font-semibold block mt-0.5">Repeat booking intent</span>
        </div>
      </div>

      {/* Filter and Search */}
      <Card className="p-4 bg-white border-slate-200 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search reviews, workshops, feedback..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          <button
            onClick={() => setRatingFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              ratingFilter === 'all'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All ({reviewList.length})
          </button>
          <button
            onClick={() => setRatingFilter('5')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              ratingFilter === '5'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            5 Stars Only
          </button>
          <button
            onClick={() => setRatingFilter('4')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              ratingFilter === '4'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            4 Stars Only
          </button>
          <button
            onClick={() => setRatingFilter('flagged')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              ratingFilter === 'flagged'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Flagged
          </button>
        </div>
      </Card>

      {/* Reviews Cards List */}
      <div className="space-y-3">
        {filtered.map((rev) => (
          <Card key={rev.id} className="p-5 bg-white border-slate-200 shadow-xs">
            <div className="flex flex-wrap items-start justify-between gap-3 mb-2">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center font-bold border border-amber-200 shrink-0">
                  <User size={15} />
                </div>
                <div>
                  <span className="font-bold text-slate-900 block text-xs">{rev.customer}</span>
                  <span className="text-[10px] text-slate-400">Reviewed {rev.workshop} · {rev.vehicle}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex text-amber-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      fill={i < rev.rating ? 'currentColor' : 'none'}
                      className={i < rev.rating ? 'text-amber-400' : 'text-slate-200'}
                    />
                  ))}
                </div>
                <Badge
                  variant={rev.status === 'Verified' ? 'success' : 'warning'}
                  size="sm"
                >
                  {rev.status}
                </Badge>
              </div>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100 mb-2">
              "{rev.comment}"
            </p>
            <div className="flex items-center justify-between text-[10px] text-slate-400">
              <span>Service: <strong className="text-slate-600">{rev.service}</strong></span>
              <span>Date: {rev.date}</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export const AdminReportsView: React.FC = () => {
  const handleExportData = () => {
    const reportData = {
      generatedAt: new Date().toISOString(),
      platformStats: {
        totalFleet: 1824,
        totalDiagnoses: 3842,
        activeWorkshops: 42,
        systemHealth: '100% Operational',
        mlAccuracy: '96.4%',
      },
      failureDistributions: {
        batteryStarting: '32%',
        brakes: '21%',
        engine: '18%',
        clutchTransmission: '14%',
        tyresSuspension: '9%',
        electrical: '6%',
      },
    };
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AutoSense_Platform_Report_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-xs font-bold mb-1 border border-emerald-200">
            <BarChart3 size={13} />
            <span>Platform Intelligence</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">Diagnostics & Operations Reports</h2>
          <p className="text-xs text-slate-600">
            Comprehensive platform telemetry, failure mode prevalence, and multi-modal AI efficiency metrics.
          </p>
        </div>
        <Button
          variant="primary"
          size="sm"
          leftIcon={<Download size={14} />}
          onClick={handleExportData}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-xs"
        >
          Export Platform Audit Report
        </Button>
      </div>

      {/* KPI stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Total AI Scans</span>
          <span className="text-2xl font-black text-slate-900 block mt-0.5">3,842</span>
          <span className="text-[10px] text-emerald-600 font-semibold block mt-0.5">+24.5% MoM increase</span>
        </div>
        <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">ML Validation Accuracy</span>
          <span className="text-2xl font-black text-emerald-700 block mt-0.5">96.4%</span>
          <span className="text-[10px] text-slate-500 font-semibold block mt-0.5">5-Fold Stratified CV</span>
        </div>
        <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Avg Inference Latency</span>
          <span className="text-2xl font-black text-sky-700 block mt-0.5">1.24s</span>
          <span className="text-[10px] text-sky-600 font-semibold block mt-0.5">FastAPI & Python backend</span>
        </div>
        <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Platform Uptime</span>
          <span className="text-2xl font-black text-indigo-700 block mt-0.5">99.94%</span>
          <span className="text-[10px] text-emerald-600 font-semibold block mt-0.5">Zero outages in 30D</span>
        </div>
      </div>

      {/* Multi-Modal Modality Performance Table */}
      <Card className="p-0 overflow-hidden bg-white border-slate-200 shadow-xs">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Multi-Modal Diagnostic Pipeline Benchmarks</h3>
            <p className="text-xs text-slate-500">Breakdown of NLP symptoms, visual fault detection, and acoustic diagnostics</p>
          </div>
          <Badge variant="sky" size="sm">Real scikit-learn & TF-IDF</Badge>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100/70 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
              <tr>
                <th className="p-3.5">Diagnostic Modality</th>
                <th className="p-3.5">Engine / Architecture</th>
                <th className="p-3.5 text-right">Sample Volume</th>
                <th className="p-3.5 text-right">Avg Confidence</th>
                <th className="p-3.5 text-right">Precision</th>
                <th className="p-3.5 text-right">Primary Target Category</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr className="hover:bg-slate-50">
                <td className="p-3.5 font-bold text-slate-900 flex items-center gap-2">
                  <Sparkles size={14} className="text-sky-500" />
                  Text Symptom NLP Pipeline
                </td>
                <td className="p-3.5 font-mono text-slate-600 text-[11px]">TF-IDF (150 feat) + Random Forest (120 trees)</td>
                <td className="p-3.5 text-right font-mono font-semibold text-slate-800">2,410</td>
                <td className="p-3.5 text-right font-mono font-bold text-emerald-700">92.4%</td>
                <td className="p-3.5 text-right font-mono font-bold text-indigo-700">94.8%</td>
                <td className="p-3.5 text-right font-semibold text-slate-700">Battery & Starter Motor</td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="p-3.5 font-bold text-slate-900 flex items-center gap-2">
                  <Car size={14} className="text-indigo-500" />
                  Visual Component Fault Matcher
                </td>
                <td className="p-3.5 font-mono text-slate-600 text-[11px]">Component Feature Embeddings + Geometry Filter</td>
                <td className="p-3.5 text-right font-mono font-semibold text-slate-800">842</td>
                <td className="p-3.5 text-right font-mono font-bold text-emerald-700">88.6%</td>
                <td className="p-3.5 text-right font-mono font-bold text-indigo-700">91.2%</td>
                <td className="p-3.5 text-right font-semibold text-slate-700">Brake Disc & Pad Wear</td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="p-3.5 font-bold text-slate-900 flex items-center gap-2">
                  <Activity size={14} className="text-amber-500" />
                  Acoustic Audio Spectrogram
                </td>
                <td className="p-3.5 font-mono text-slate-600 text-[11px]">Spectral Centroid & Harmonic Peak Analyzer</td>
                <td className="p-3.5 text-right font-mono font-semibold text-slate-800">590</td>
                <td className="p-3.5 text-right font-mono font-bold text-emerald-700">86.1%</td>
                <td className="p-3.5 text-right font-mono font-bold text-indigo-700">89.5%</td>
                <td className="p-3.5 text-right font-semibold text-slate-700">Engine Tappet & Valve Tap</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export const AdminSettingsView: React.FC = () => {
  return <SettingsView portalType="admin" />;
};

export const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const {
    vehicles,
    mechanics,
    bookings,
    serviceRecords,
    diagnoses,
  } = useData();

  const [backendOnline, setBackendOnline] = useState<boolean | null>(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/health`)
      .then((res) => (res.ok ? setBackendOnline(true) : setBackendOnline(false)))
      .catch(() => setBackendOnline(false));
  }, []);

  // Platform Activity Multi-Series Trend Data
  const platformActivityDataSets: Record<TimeRange, MultiSeriesBarDataPoint[]> = {
    '7D': [
      { label: '07 Sep', series: { users: 18, diagnoses: 64, bookings: 12 } },
      { label: '08 Sep', series: { users: 22, diagnoses: 72, bookings: 15 } },
      { label: '09 Sep', series: { users: 19, diagnoses: 68, bookings: 14 } },
      { label: '10 Sep', series: { users: 25, diagnoses: 85, bookings: 18 } },
      { label: '11 Sep', series: { users: 28, diagnoses: 92, bookings: 21 } },
      { label: '12 Sep', series: { users: 31, diagnoses: 98, bookings: 24 } },
      { label: '13 Sep', series: { users: 34, diagnoses: 104, bookings: 26 } },
    ],
    '30D': [
      { label: 'W1 Aug', series: { users: 95, diagnoses: 340, bookings: 78 } },
      { label: 'W2 Aug', series: { users: 110, diagnoses: 390, bookings: 86 } },
      { label: 'W3 Aug', series: { users: 125, diagnoses: 420, bookings: 92 } },
      { label: 'W4 Aug', series: { users: 140, diagnoses: 460, bookings: 104 } },
      { label: 'W1 Sep', series: { users: 155, diagnoses: 510, bookings: 118 } },
      { label: 'W2 Sep', series: { users: 172, diagnoses: 580, bookings: 132 } },
    ],
    '6M': [
      { label: 'Apr', series: { users: 320, diagnoses: 1100, bookings: 240 } },
      { label: 'May', series: { users: 390, diagnoses: 1350, bookings: 290 } },
      { label: 'Jun', series: { users: 440, diagnoses: 1580, bookings: 340 } },
      { label: 'Jul', series: { users: 490, diagnoses: 1720, bookings: 380 } },
      { label: 'Aug', series: { users: 560, diagnoses: 1950, bookings: 430 } },
      { label: 'Sep', series: { users: 620, diagnoses: 2200, bookings: 490 } },
    ],
  };

  // Diagnosis Distribution Donut Categories
  const diagnosisDistribution: DonutCategory[] = [
    { id: 'battery', name: 'Battery & Starting', value: 1632, color: '#0EA5E9' },
    { id: 'brakes', name: 'Brake Systems', value: 1071, color: '#10B981' },
    { id: 'engine', name: 'Engine & Valvetrain', value: 918, color: '#F59E0B' },
    { id: 'clutch', name: 'Transmission & Clutch', value: 714, color: '#6366F1' },
    { id: 'tyres', name: 'Tyres & Suspension', value: 459, color: '#EC4899' },
    { id: 'electrical', name: 'Electrical & Sensors', value: 306, color: '#8B5CF6' },
    { id: 'fuel', name: 'Fuel Delivery', value: 245, color: '#14B8A6' },
  ];

  // Recent Platform Activity Log
  const recentPlatformActivity = [
    { time: '10:42', user: 'Alex Sharma', action: 'AI Diagnosis Run', entity: 'Yamaha R15 V4', status: 'Completed', statusColor: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
    { time: '10:31', user: 'Rajesh Kumar', action: 'Job Verified', entity: 'Kumar Motors Workshop', status: 'Accepted', statusColor: 'bg-sky-50 text-sky-800 border-sky-200' },
    { time: '10:15', user: 'Priya Patel', action: 'Service Booking', entity: 'Hyundai i20 Asta', status: 'Pending', statusColor: 'bg-amber-50 text-amber-800 border-amber-200' },
    { time: '09:48', user: 'Vikram Singh', action: 'Vehicle Added', entity: 'Royal Enfield 350', status: 'Active', statusColor: 'bg-teal-50 text-teal-800 border-teal-200' },
    { time: '09:20', user: 'Anand Menon', action: 'Workshop Audit', entity: 'SpeedPulse Moto Works', status: 'Verified', statusColor: 'bg-indigo-50 text-indigo-800 border-indigo-200' },
  ];

  // Mechanic Performance Table
  const mechanicPerformances = [
    { name: 'Kumar Motors', location: 'Indiranagar', jobs: 142, completed: 136, rating: 4.8, aiAgreement: '89%', status: 'Active' },
    { name: 'SpeedPulse Moto Works', location: 'Koramangala', jobs: 98, completed: 94, rating: 4.7, aiAgreement: '86%', status: 'Active' },
    { name: 'Apex Auto Care', location: 'Whitefield', jobs: 64, completed: 60, rating: 4.6, aiAgreement: '84%', status: 'Active' },
    { name: 'Prime Diagnostic Garage', location: 'HSR Layout', jobs: 42, completed: 39, rating: 4.8, aiAgreement: '91%', status: 'Active' },
  ];

  return (
    <div className="space-y-6">
      {/* 1. Header Banner: Operations & Analytics Console */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-0.5 rounded-md bg-indigo-100 text-indigo-900 border border-indigo-200">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse" />
              Platform Operations Console
            </span>
            <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200">
              Diagnostic Engine v1.0 Production
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Platform Intelligence & Analytics
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
            Global vehicle telemetry, AI model precision benchmarks, and verified workshop partner SLAs.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <Button
            size="sm"
            onClick={() => navigate('/admin/diagnoses')}
            leftIcon={<Zap size={15} />}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs py-2 px-3.5 shadow-xs"
          >
            AI Model Lab
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/admin/mechanics')}
            leftIcon={<Wrench size={15} />}
            className="bg-white border-slate-300 text-slate-800 hover:bg-slate-50 font-semibold text-xs py-2 px-3.5 shadow-2xs"
          >
            Workshop Audits
          </Button>
        </div>
      </div>

      {/* 2. TOP KPI CARDS (6 Platform Cards) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        
        {/* KPI 1: Total Users */}
        <div
          onClick={() => navigate('/admin/users')}
          className="p-4 rounded-2xl bg-white border border-blue-200/90 border-t-4 border-t-blue-500 hover:border-blue-300 shadow-xs hover:shadow-md transition duration-150 cursor-pointer flex flex-col justify-between group"
        >
          <div className="flex items-center justify-between text-[11px] font-bold text-blue-800 uppercase tracking-wider mb-1">
            <span>Total Users</span>
            <Users size={15} className="text-blue-600" />
          </div>
          <div>
            <span className="text-2xl font-black text-slate-900">1,426</span>
            <span className="text-[10px] text-emerald-700 font-bold block mt-0.5">↑ 12% this month</span>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-[10px] text-slate-400 font-mono">Active logins</span>
            <MiniSparkline data={[1100, 1220, 1310, 1380, 1426]} color="#3B82F6" height={16} width={42} />
          </div>
        </div>

        {/* KPI 2: Active Mechanics */}
        <div
          onClick={() => navigate('/admin/mechanics')}
          className="p-4 rounded-2xl bg-white border border-teal-200/90 border-t-4 border-t-teal-500 hover:border-teal-300 shadow-xs hover:shadow-md transition duration-150 cursor-pointer flex flex-col justify-between group"
        >
          <div className="flex items-center justify-between text-[11px] font-bold text-teal-800 uppercase tracking-wider mb-1">
            <span>Mechanics</span>
            <Wrench size={15} className="text-teal-600" />
          </div>
          <div>
            <span className="text-2xl font-black text-slate-900">142</span>
            <span className="text-[10px] text-amber-800 font-bold block mt-0.5">4 pending audit</span>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-[10px] text-slate-400 font-mono">Verified bays</span>
            <MiniSparkline data={[115, 124, 132, 138, 142]} color="#0D9488" height={16} width={42} />
          </div>
        </div>

        {/* KPI 3: Registered Vehicles */}
        <div
          onClick={() => navigate('/admin/vehicles')}
          className="p-4 rounded-2xl bg-white border border-indigo-200/90 border-t-4 border-t-indigo-500 hover:border-indigo-300 shadow-xs hover:shadow-md transition duration-150 cursor-pointer flex flex-col justify-between group"
        >
          <div className="flex items-center justify-between text-[11px] font-bold text-indigo-800 uppercase tracking-wider mb-1">
            <span>Vehicles</span>
            <Car size={15} className="text-indigo-600" />
          </div>
          <div>
            <span className="text-2xl font-black text-slate-900">1,824</span>
            <span className="text-[10px] text-indigo-700 font-bold block mt-0.5">Across garages</span>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-[10px] text-slate-400 font-mono">Active OBD</span>
            <MiniSparkline data={[1400, 1550, 1680, 1750, 1824]} color="#6366F1" height={16} width={42} />
          </div>
        </div>

        {/* KPI 4: AI Diagnoses */}
        <div
          onClick={() => navigate('/admin/diagnoses')}
          className="p-4 rounded-2xl bg-white border border-purple-200/90 border-t-4 border-t-purple-500 hover:border-purple-300 shadow-xs hover:shadow-md transition duration-150 cursor-pointer flex flex-col justify-between group"
        >
          <div className="flex items-center justify-between text-[11px] font-bold text-purple-800 uppercase tracking-wider mb-1">
            <span>AI Diagnoses</span>
            <Zap size={15} className="text-purple-600" />
          </div>
          <div>
            <span className="text-2xl font-black text-slate-900">5,120</span>
            <span className="text-[10px] text-emerald-700 font-bold block mt-0.5">88.4% confirmed</span>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-[10px] text-slate-400 font-mono">ML inference</span>
            <MiniSparkline data={[3800, 4200, 4600, 4900, 5120]} color="#8B5CF6" height={16} width={42} />
          </div>
        </div>

        {/* KPI 5: Service Requests */}
        <div
          onClick={() => navigate('/admin/requests')}
          className="p-4 rounded-2xl bg-white border border-amber-200/90 border-t-4 border-t-amber-500 hover:border-amber-300 shadow-xs hover:shadow-md transition duration-150 cursor-pointer flex flex-col justify-between group"
        >
          <div className="flex items-center justify-between text-[11px] font-bold text-amber-800 uppercase tracking-wider mb-1">
            <span>Requests</span>
            <CalendarCheck size={15} className="text-amber-600" />
          </div>
          <div>
            <span className="text-2xl font-black text-slate-900">846</span>
            <span className="text-[10px] text-amber-800 font-bold block mt-0.5">In workshop bays</span>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-[10px] text-slate-400 font-mono">Fulfillment</span>
            <MiniSparkline data={[600, 680, 740, 800, 846]} color="#F59E0B" height={16} width={42} />
          </div>
        </div>

        {/* KPI 6: Platform Revenue */}
        <div
          onClick={() => navigate('/admin/reports')}
          className="p-4 rounded-2xl bg-white border border-emerald-200/90 border-t-4 border-t-emerald-500 hover:border-emerald-300 shadow-xs hover:shadow-md transition duration-150 cursor-pointer flex flex-col justify-between group"
        >
          <div className="flex items-center justify-between text-[11px] font-bold text-emerald-800 uppercase tracking-wider mb-1">
            <span>Revenue</span>
            <DollarSign size={15} className="text-emerald-600" />
          </div>
          <div>
            <span className="text-xl font-black text-slate-900 font-mono">₹12.8L</span>
            <span className="text-[10px] text-emerald-700 font-bold block mt-0.5">Total platform</span>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-[10px] text-slate-400 font-mono">Annualized</span>
            <MiniSparkline data={[8.5, 9.4, 10.6, 11.8, 12.8]} color="#10B981" height={16} width={42} />
          </div>
        </div>

      </div>

      {/* 3. MIDDLE ANALYTICS: Platform Activity Trend & AI Model Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        
        {/* Left (2 Cols): Platform Activity Trend */}
        <div className="lg:col-span-2">
          <MultiSeriesBarChart
            title="Platform Activity Trend"
            subtitle="Global registration, diagnostic scan volume, and workshop service requests"
            dataSets={platformActivityDataSets}
            series={[
              { key: 'users', label: 'New Users', color: '#3B82F6' },
              { key: 'diagnoses', label: 'AI Diagnoses', color: '#8B5CF6' },
              { key: 'bookings', label: 'Service Bookings', color: '#10B981' },
            ]}
            initialRange="7D"
            badgeText="System Telemetry"
          />
        </div>

        {/* Right (1 Col): AI Model Performance Card (AIML Evaluation) */}
        <Card className="p-5 bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Cpu size={16} className="text-indigo-600" />
                <h3 className="text-sm font-bold text-slate-900">AI Model Performance</h3>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                Evaluation Metrics
              </span>
            </div>

            {/* Model Evaluation Grid */}
            <div className="grid grid-cols-2 gap-2.5 my-2">
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-center">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Accuracy</span>
                <span className="text-xl font-black text-slate-900 font-mono">92.4%</span>
                <span className="text-[9px] text-emerald-700 font-bold block mt-0.5">Cross-Validated</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-center">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Precision</span>
                <span className="text-xl font-black text-slate-900 font-mono">91.8%</span>
                <span className="text-[9px] text-indigo-700 font-bold block mt-0.5">Macro Avg</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-center">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Recall</span>
                <span className="text-xl font-black text-slate-900 font-mono">90.7%</span>
                <span className="text-[9px] text-sky-700 font-bold block mt-0.5">Fault Sensitivity</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-center">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">F1 Score</span>
                <span className="text-xl font-black text-slate-900 font-mono">91.2%</span>
                <span className="text-[9px] text-purple-700 font-bold block mt-0.5">Harmonic Mean</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 leading-snug mt-2">
              Evaluated on 500 feature TF-IDF vectorizer + Random Forest classifier with 120 estimators across 8 fault categories.
            </p>
          </div>

          <div className="pt-3 border-t border-slate-100 mt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/admin/diagnoses')}
              className="w-full text-xs font-semibold border-indigo-300 text-indigo-900 hover:bg-indigo-50"
              rightIcon={<ArrowRight size={13} />}
            >
              Open Model Lab Inspector
            </Button>
          </div>
        </Card>

      </div>

      {/* 4. DIAGNOSIS DISTRIBUTION & AI / ML ARCHITECTURE OVERVIEW */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        
        {/* Left (2 Cols): Diagnosis Category Distribution Donut Chart */}
        <div className="lg:col-span-2">
          <DonutDistributionChart
            title="Diagnosis Category Distribution"
            subtitle="Breakdown of 5,120 classified vehicle failure modes across the platform fleet"
            categories={diagnosisDistribution}
            totalLabel="Faults"
          />
        </div>

        {/* Right (1 Col): Dedicated AI / ML Overview Card */}
        <Card className="p-5 bg-gradient-to-br from-indigo-50/70 via-white to-sky-50/50 border border-indigo-200/90 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center border border-indigo-200">
                <Zap size={18} />
              </div>
              <div>
                <span className="text-[10px] font-bold text-indigo-800 uppercase tracking-wider block">AIML Core Architecture</span>
                <h3 className="text-base font-bold text-slate-900">DriveIQ Fault Classifier</h3>
              </div>
            </div>

            <div className="space-y-2 text-xs bg-white/90 p-3 rounded-xl border border-indigo-200/70 shadow-2xs mb-3">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Model Name:</span>
                <span className="font-bold text-slate-900">DriveIQ Fault Classifier</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Algorithm:</span>
                <span className="font-bold text-indigo-700">Random Forest (120 Estimators)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Feature Extraction:</span>
                <span className="font-bold text-slate-900">TF-IDF (500 Vocab)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Target Classes:</span>
                <span className="font-bold text-slate-900">8 Automotive Fault Categories</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Last Evaluation:</span>
                <span className="font-mono font-bold text-slate-800">13 Sep 2026</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Deployment Status:</span>
                <span className="inline-flex items-center gap-1 font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 text-[10px]">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Production Live
                </span>
              </div>
            </div>
          </div>

          <Button
            size="sm"
            onClick={() => navigate('/admin/diagnoses')}
            className="w-full text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white"
            rightIcon={<Sliders size={13} />}
          >
            Launch Interactive ML Inspector
          </Button>
        </Card>

      </div>

      {/* 5. OPERATIONAL LEDGERS: RECENT PLATFORM ACTIVITY & MECHANIC PERFORMANCE */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        
        {/* Recent Platform Activity Audit */}
        <Card className="p-5 bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">Recent Platform Activity</h3>
              <p className="text-xs text-slate-500">Live operational events across user garages and verified workshop bays</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-wider bg-slate-50/70">
                  <th className="py-2 px-2.5">Time</th>
                  <th className="py-2 px-2.5">User</th>
                  <th className="py-2 px-2.5">Action</th>
                  <th className="py-2 px-2.5">Entity</th>
                  <th className="py-2 px-2.5 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentPlatformActivity.map((act, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80">
                    <td className="py-2.5 px-2.5 font-mono text-slate-600 font-bold whitespace-nowrap">{act.time}</td>
                    <td className="py-2.5 px-2.5 font-semibold text-slate-900 whitespace-nowrap">{act.user}</td>
                    <td className="py-2.5 px-2.5 text-slate-700 whitespace-nowrap">{act.action}</td>
                    <td className="py-2.5 px-2.5 font-mono text-slate-600 truncate max-w-[140px]">{act.entity}</td>
                    <td className="py-2.5 px-2.5 text-right">
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold border ${act.statusColor}`}>
                        {act.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Mechanic Partner Performance */}
        <Card className="p-5 bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">Mechanic Partner SLA Performance</h3>
              <p className="text-xs text-slate-500">Verified workshop fulfillment rates, ratings, and AI diagnostic agreement</p>
            </div>
            <button
              onClick={() => navigate('/admin/mechanics')}
              className="text-xs font-bold text-teal-700 hover:underline flex items-center gap-1 cursor-pointer"
            >
              Audits <ChevronRight size={13} />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-wider bg-slate-50/70">
                  <th className="py-2 px-2.5">Workshop</th>
                  <th className="py-2 px-2.5">Jobs</th>
                  <th className="py-2 px-2.5">Rating</th>
                  <th className="py-2 px-2.5 text-center">AI Agreement</th>
                  <th className="py-2 px-2.5 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {mechanicPerformances.map((mech, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80">
                    <td className="py-2.5 px-2.5">
                      <span className="font-bold text-slate-900 block">{mech.name}</span>
                      <span className="text-[10px] text-slate-500">{mech.location}</span>
                    </td>
                    <td className="py-2.5 px-2.5 font-mono text-slate-700">
                      {mech.completed}/{mech.jobs}
                    </td>
                    <td className="py-2.5 px-2.5">
                      <span className="font-bold text-amber-700">★ {mech.rating}</span>
                    </td>
                    <td className="py-2.5 px-2.5 text-center">
                      <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-900 font-bold font-mono text-[10px] border border-indigo-200">
                        {mech.aiAgreement}
                      </span>
                    </td>
                    <td className="py-2.5 px-2.5 text-right">
                      <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 font-bold text-[10px] border border-emerald-200">
                        {mech.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

      </div>

      {/* 6. LIVE SYSTEM HEALTH MONITOR */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Server size={16} className="text-slate-700" />
            <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">System Health & Microservices Telemetry:</span>
          </div>
          <span className="text-[11px] text-slate-500 font-mono">Last Checked: Just Now</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          {/* Service 1: ML Backend */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Cpu size={16} className="text-indigo-600" />
              <div>
                <span className="font-bold text-slate-900 block text-xs">ML Backend</span>
                <span className="text-[10px] text-slate-500 font-mono">FastAPI :8000</span>
              </div>
            </div>
            <span className={`inline-flex items-center gap-1 font-bold text-[10px] px-2 py-0.5 rounded-full ${
              backendOnline !== false ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${backendOnline !== false ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
              {backendOnline !== false ? 'Online' : 'Fallback'}
            </span>
          </div>

          {/* Service 2: SQLite / Data store */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Database size={16} className="text-teal-600" />
              <div>
                <span className="font-bold text-slate-900 block text-xs">Vehicle Database</span>
                <span className="text-[10px] text-slate-500 font-mono">Primary Storage</span>
              </div>
            </div>
            <span className="inline-flex items-center gap-1 font-bold text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Connected
            </span>
          </div>

          {/* Service 3: API Gateway */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity size={16} className="text-sky-600" />
              <div>
                <span className="font-bold text-slate-900 block text-xs">API Gateway</span>
                <span className="text-[10px] text-slate-500 font-mono">Latency &lt; 24ms</span>
              </div>
            </div>
            <span className="inline-flex items-center gap-1 font-bold text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Healthy
            </span>
          </div>

          {/* Service 4: AI Engine */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap size={16} className="text-purple-600" />
              <div>
                <span className="font-bold text-slate-900 block text-xs">AI Diagnostic Core</span>
                <span className="text-[10px] text-slate-500 font-mono">v1.0 (8 Classes)</span>
              </div>
            </div>
            <span className="inline-flex items-center gap-1 font-bold text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Online
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
