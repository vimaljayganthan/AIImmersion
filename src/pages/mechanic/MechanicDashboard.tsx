import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import { useData } from '../../context/DataContext';
import {
  Wrench,
  CalendarCheck,
  CheckCircle2,
  Package,
  Car,
  Clock,
  DollarSign,
  Star,
  Activity,
  Zap,
  TrendingUp,
  AlertCircle,
  ThumbsUp,
  ThumbsDown,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  Plus,
  Search,
  Filter,
  User,
  FileText,
  Download,
  Sparkles,
  MapPin,
  Phone,
  Mail,
} from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { SettingsView } from '../settings/SettingsView';
import { MultiSeriesBarChart, MultiSeriesBarDataPoint, TimeRange } from '../../components/charts/MultiSeriesBarChart';
import { MiniSparkline } from '../../components/charts/MiniSparkline';

export const MechanicCustomersView: React.FC = () => {
  const { mechanics } = useData();
  const [searchTerm, setSearchTerm] = useState('');

  const customerList = [
    {
      id: 'cust_01',
      name: 'Alex Sharma',
      email: 'owner@demo.com',
      phone: '+91 98450 11223',
      location: 'Indiranagar, Bengaluru',
      vehicles: ['2023 Yamaha R15 V4', '2022 Hyundai i20 Asta'],
      totalServices: 5,
      lifetimeSpend: '₹18,400',
      lastVisit: '12 Sep 2026',
      loyaltyTier: 'Gold Member',
      status: 'Active',
    },
    {
      id: 'cust_02',
      name: 'Priya Patel',
      email: 'priya.p@example.com',
      phone: '+91 98452 44331',
      location: 'Koramangala, Bengaluru',
      vehicles: ['2021 Honda City ZX'],
      totalServices: 3,
      lifetimeSpend: '₹12,200',
      lastVisit: '10 Sep 2026',
      loyaltyTier: 'Silver Member',
      status: 'Active',
    },
    {
      id: 'cust_03',
      name: 'Karthik Raja',
      email: 'karthik.r@example.com',
      phone: '+91 98801 88992',
      location: 'HSR Layout, Bengaluru',
      vehicles: ['2020 Royal Enfield Classic 350'],
      totalServices: 6,
      lifetimeSpend: '₹22,900',
      lastVisit: '08 Sep 2026',
      loyaltyTier: 'Platinum Member',
      status: 'Active',
    },
    {
      id: 'cust_04',
      name: 'Vikram Mehta',
      email: 'vikram.m@example.com',
      phone: '+91 97410 55667',
      location: 'Whitefield, Bengaluru',
      vehicles: ['2023 Tata Nexon EV Max'],
      totalServices: 2,
      lifetimeSpend: '₹9,800',
      lastVisit: '04 Sep 2026',
      loyaltyTier: 'Silver Member',
      status: 'Active',
    },
  ];

  const filtered = customerList.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone.includes(searchTerm) ||
      c.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.vehicles.some((v) => v.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-teal-100 text-teal-800 text-xs font-bold mb-1 border border-teal-200">
            <User size={13} />
            <span>Workshop CRM</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">Customer Directory & Fleet Accounts</h2>
          <p className="text-xs text-slate-600">
            Registered vehicle owners with service history, billing ledgers, and vehicle records.
          </p>
        </div>
        <Badge variant="sky" size="md">
          {customerList.length} Active Client Accounts
        </Badge>
      </div>

      {/* KPI stats strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Clients</span>
          <span className="text-xl font-black text-slate-900 block mt-0.5">142</span>
          <span className="text-[10px] text-emerald-600 font-semibold block mt-0.5">+8 new this month</span>
        </div>
        <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Active Bay Orders</span>
          <span className="text-xl font-black text-teal-700 block mt-0.5">8</span>
          <span className="text-[10px] text-teal-600 font-semibold block mt-0.5">Currently in workshop</span>
        </div>
        <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Repeat Rate</span>
          <span className="text-xl font-black text-indigo-700 block mt-0.5">68.4%</span>
          <span className="text-[10px] text-indigo-600 font-semibold block mt-0.5">High customer retention</span>
        </div>
        <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Total MTD Billed</span>
          <span className="text-xl font-black text-emerald-700 block mt-0.5">₹1.42L</span>
          <span className="text-[10px] text-emerald-600 font-semibold block mt-0.5">Paid invoices</span>
        </div>
      </div>

      {/* Search */}
      <Card className="p-4 bg-white border-slate-200 shadow-xs flex items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search customer, phone, vehicle..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
          />
        </div>
      </Card>

      {/* Table */}
      <Card className="p-0 overflow-hidden bg-white border-slate-200 shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
              <tr>
                <th className="p-4">Customer Details</th>
                <th className="p-4">Contact Info</th>
                <th className="p-4">Registered Vehicles</th>
                <th className="p-4">Services Done</th>
                <th className="p-4">Lifetime Value</th>
                <th className="p-4">Last Visit</th>
                <th className="p-4">Loyalty Tier</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/80 transition">
                  <td className="p-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center font-bold border border-teal-200 shrink-0">
                        <User size={15} />
                      </div>
                      <div>
                        <span className="font-bold text-slate-900 block">{c.name}</span>
                        <span className="text-[10px] text-slate-400 font-mono">ID: {c.id}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="space-y-0.5 text-slate-600">
                      <span className="block font-mono text-[11px]">{c.phone}</span>
                      <span className="block text-[10px] text-slate-400">{c.location}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="space-y-1">
                      {c.vehicles.map((v, i) => (
                        <Badge key={i} variant="sky" size="sm" className="block text-left truncate max-w-[180px]">
                          {v}
                        </Badge>
                      ))}
                    </div>
                  </td>
                  <td className="p-4 font-bold text-slate-900 text-center">{c.totalServices}</td>
                  <td className="p-4 font-mono font-bold text-emerald-700">{c.lifetimeSpend}</td>
                  <td className="p-4 text-slate-500 font-mono text-[11px]">{c.lastVisit}</td>
                  <td className="p-4">
                    <Badge variant="warning" size="sm">
                      {c.loyaltyTier}
                    </Badge>
                  </td>
                  <td className="p-4 text-right">
                    <Button variant="outline" size="sm" className="text-xs">
                      View History
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

export const MechanicVehiclesView: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [stageFilter, setStageFilter] = useState<'all' | 'diagnostic' | 'parts' | 'ready'>('all');

  const workshopFleet = [
    {
      id: 'wv_01',
      vehicle: '2023 Yamaha R15 V4',
      plate: 'KA-05-MM-4421',
      owner: 'Alex Sharma',
      intakeDate: '13 Sep 2026, 09:00 AM',
      issue: 'Starter Motor & Relay Click',
      bay: 'Bay #1 (Electrical)',
      technician: 'Rajesh Kumar',
      stage: 'diagnostic',
      stageLabel: 'Diagnostic Testing',
      aiFlag: '92% Battery/Starter Solenoid',
    },
    {
      id: 'wv_02',
      vehicle: '2022 Hyundai i20 Asta',
      plate: 'KA-03-NB-8819',
      owner: 'Alex Sharma',
      intakeDate: '12 Sep 2026, 02:30 PM',
      issue: 'Brake Grinding & Pad Wear',
      bay: 'Bay #3 (Mechanical)',
      technician: 'Suresh V.',
      stage: 'parts',
      stageLabel: 'Awaiting Brake Pads',
      aiFlag: '88% Front Disc Rotor Wear',
    },
    {
      id: 'wv_03',
      vehicle: '2021 Honda City ZX',
      plate: 'KA-01-MJ-1204',
      owner: 'Priya Patel',
      intakeDate: '11 Sep 2026, 10:00 AM',
      issue: 'Scheduled 40,000 km Major Service',
      bay: 'Bay #2 (General)',
      technician: 'Mahesh G.',
      stage: 'ready',
      stageLabel: 'Ready for Pickup',
      aiFlag: 'All 24 Checks Passed',
    },
    {
      id: 'wv_04',
      vehicle: '2020 Royal Enfield Classic 350',
      plate: 'KA-04-ER-9920',
      owner: 'Karthik Raja',
      intakeDate: '10 Sep 2026, 11:15 AM',
      issue: 'Engine Valve Tappet Rattle',
      bay: 'Bay #1 (Engine Bay)',
      technician: 'Rajesh Kumar',
      stage: 'ready',
      stageLabel: 'Ready for Pickup',
      aiFlag: 'Tappet Gap Adjusted 0.08mm',
    },
  ];

  const filtered = workshopFleet.filter((v) => {
    const matchSearch =
      v.vehicle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.plate.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.issue.toLowerCase().includes(searchTerm.toLowerCase());
    if (!matchSearch) return false;
    if (stageFilter !== 'all' && v.stage !== stageFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-sky-100 text-sky-800 text-xs font-bold mb-1 border border-sky-200">
            <Car size={13} />
            <span>Workshop Fleet Registry</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">Active Workshop Vehicle Fleet</h2>
          <p className="text-xs text-slate-600">
            Real-time status of customer vehicles in service bays, diagnostic lanes, and delivery holding.
          </p>
        </div>
        <Badge variant="sky" size="md">
          18 Total Managed Vehicles
        </Badge>
      </div>

      {/* KPI stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Total in Workshop</span>
          <span className="text-xl font-black text-slate-900 block mt-0.5">18</span>
          <span className="text-[10px] text-slate-500 font-semibold block mt-0.5">Across 4 service bays</span>
        </div>
        <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">In Diagnostic Bay</span>
          <span className="text-xl font-black text-sky-700 block mt-0.5">5</span>
          <span className="text-[10px] text-sky-600 font-semibold block mt-0.5">AI sensor scan active</span>
        </div>
        <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Awaiting Parts</span>
          <span className="text-xl font-black text-amber-700 block mt-0.5">4</span>
          <span className="text-[10px] text-amber-600 font-semibold block mt-0.5">OEM order dispatched</span>
        </div>
        <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Ready for Delivery</span>
          <span className="text-xl font-black text-emerald-700 block mt-0.5">6</span>
          <span className="text-[10px] text-emerald-600 font-semibold block mt-0.5">QC passed & cleaned</span>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-4 bg-white border-slate-200 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search vehicle, plate, owner, issue..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          <button
            onClick={() => setStageFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              stageFilter === 'all' ? 'bg-sky-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All In-Shop ({workshopFleet.length})
          </button>
          <button
            onClick={() => setStageFilter('diagnostic')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              stageFilter === 'diagnostic' ? 'bg-sky-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Diagnostics
          </button>
          <button
            onClick={() => setStageFilter('parts')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              stageFilter === 'parts' ? 'bg-amber-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Awaiting Parts
          </button>
          <button
            onClick={() => setStageFilter('ready')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              stageFilter === 'ready' ? 'bg-emerald-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Ready for Delivery
          </button>
        </div>
      </Card>

      {/* Fleet Table */}
      <Card className="p-0 overflow-hidden bg-white border-slate-200 shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
              <tr>
                <th className="p-4">Vehicle Details</th>
                <th className="p-4">Reg Plate</th>
                <th className="p-4">Owner Name</th>
                <th className="p-4">Intake & Bay</th>
                <th className="p-4">Reported Issue</th>
                <th className="p-4">AI Diagnostic Flag</th>
                <th className="p-4">Current Stage</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((v) => (
                <tr key={v.id} className="hover:bg-slate-50/80 transition">
                  <td className="p-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center font-bold border border-sky-200 shrink-0">
                        <Car size={15} />
                      </div>
                      <div>
                        <span className="font-bold text-slate-900 block">{v.vehicle}</span>
                        <span className="text-[10px] text-slate-400 font-mono">Tech: {v.technician}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 font-mono font-bold text-slate-900">{v.plate}</td>
                  <td className="p-4 font-semibold text-slate-800">{v.owner}</td>
                  <td className="p-4">
                    <span className="font-bold text-indigo-700 block">{v.bay}</span>
                    <span className="text-[10px] text-slate-400 block">{v.intakeDate}</span>
                  </td>
                  <td className="p-4 text-slate-700 font-medium">{v.issue}</td>
                  <td className="p-4">
                    <span className="text-[11px] font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200 block truncate max-w-[180px]">
                      {v.aiFlag}
                    </span>
                  </td>
                  <td className="p-4">
                    <Badge
                      variant={
                        v.stage === 'ready'
                          ? 'success'
                          : v.stage === 'parts'
                          ? 'warning'
                          : 'sky'
                      }
                      size="sm"
                    >
                      {v.stageLabel}
                    </Badge>
                  </td>
                  <td className="p-4 text-right">
                    <Button variant="outline" size="sm" className="text-xs">
                      Update Bay
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

export const MechanicHistoryView: React.FC = () => {
  const { serviceRecords } = useData();
  const [searchTerm, setSearchTerm] = useState('');

  const completedInvoices = [
    {
      id: 'inv_301',
      ref: 'INV-2026-0881',
      date: '12 Sep 2026',
      customer: 'Alex Sharma',
      vehicle: '2023 Yamaha R15 V4 (KA-05-MM-4421)',
      serviceType: 'Starter Solenoid & Relay Replacement',
      partsReplaced: 'OEM Starter Relay (₹650), Terminal Wire (₹250)',
      labor: '₹900',
      partsCost: '₹900',
      totalAmount: '₹1,800',
      paymentStatus: 'Paid (UPI)',
    },
    {
      id: 'inv_302',
      ref: 'INV-2026-0882',
      date: '10 Sep 2026',
      customer: 'Priya Patel',
      vehicle: '2022 Hyundai i20 Asta (KA-03-NB-8819)',
      serviceType: 'Front Brake Rotor Skimming & Ceramic Pads',
      partsReplaced: 'Brembo Ceramic Front Pads (₹2,800)',
      labor: '₹1,400',
      partsCost: '₹2,800',
      totalAmount: '₹4,200',
      paymentStatus: 'Paid (Credit Card)',
    },
    {
      id: 'inv_303',
      ref: 'INV-2026-0883',
      date: '08 Sep 2026',
      customer: 'Karthik Raja',
      vehicle: '2020 Royal Enfield Classic 350 (KA-04-ER-9920)',
      serviceType: 'Tappet Adjustment & Motul 15W50 Engine Oil',
      partsReplaced: 'Motul 3000 4T 2.5L Oil (₹1,150), Oil Filter (₹180)',
      labor: '₹850',
      partsCost: '₹1,330',
      totalAmount: '₹2,180',
      paymentStatus: 'Paid (Cash)',
    },
    {
      id: 'inv_304',
      ref: 'INV-2026-0884',
      date: '04 Sep 2026',
      customer: 'Vikram Mehta',
      vehicle: '2023 Tata Nexon EV Max (KA-51-EV-0042)',
      serviceType: 'High-Voltage Insulation Resistance Audit',
      partsReplaced: 'HV Cable Seal Kit (₹1,200)',
      labor: '₹2,400',
      partsCost: '₹1,200',
      totalAmount: '₹3,600',
      paymentStatus: 'Paid (NetBanking)',
    },
  ];

  const filtered = completedInvoices.filter(
    (inv) =>
      inv.ref.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.vehicle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.serviceType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-xs font-bold mb-1 border border-emerald-200">
            <FileText size={13} />
            <span>Billing & Invoicing</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">Completed Service Invoices & History</h2>
          <p className="text-xs text-slate-600">
            Archive of completed vehicle repairs, labor breakdowns, and digital customer receipts.
          </p>
        </div>
        <Badge variant="sky" size="md">
          {completedInvoices.length + 338} Total Completed Orders
        </Badge>
      </div>

      {/* KPI stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Invoiced</span>
          <span className="text-xl font-black text-slate-900 block mt-0.5">342 Invoices</span>
          <span className="text-[10px] text-emerald-600 font-semibold block mt-0.5">100% digital audit</span>
        </div>
        <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Gross Revenue</span>
          <span className="text-xl font-black text-emerald-700 block mt-0.5">₹14.82 Lakhs</span>
          <span className="text-[10px] text-emerald-600 font-semibold block mt-0.5">All-time workshop GMV</span>
        </div>
        <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Avg Turnaround</span>
          <span className="text-xl font-black text-sky-700 block mt-0.5">3.4 Hours</span>
          <span className="text-[10px] text-sky-600 font-semibold block mt-0.5">Intake to delivery</span>
        </div>
        <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Customer Rating</span>
          <span className="text-xl font-black text-amber-600 block mt-0.5">4.85 ★</span>
          <span className="text-[10px] text-slate-500 font-semibold block mt-0.5">142 verified reviews</span>
        </div>
      </div>

      {/* Search */}
      <Card className="p-4 bg-white border-slate-200 shadow-xs flex items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search invoice ref, customer, vehicle..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          />
        </div>
      </Card>

      {/* Table */}
      <Card className="p-0 overflow-hidden bg-white border-slate-200 shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
              <tr>
                <th className="p-4">Invoice Ref</th>
                <th className="p-4">Date</th>
                <th className="p-4">Customer & Vehicle</th>
                <th className="p-4">Service Category</th>
                <th className="p-4">Parts & Materials</th>
                <th className="p-4">Labor</th>
                <th className="p-4">Total Amount</th>
                <th className="p-4">Payment</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-50/80 transition">
                  <td className="p-4 font-mono font-bold text-emerald-700">{inv.ref}</td>
                  <td className="p-4 text-slate-500 font-mono text-[11px]">{inv.date}</td>
                  <td className="p-4">
                    <span className="font-bold text-slate-900 block">{inv.customer}</span>
                    <span className="text-[10px] text-slate-400 block">{inv.vehicle}</span>
                  </td>
                  <td className="p-4 font-semibold text-slate-800">{inv.serviceType}</td>
                  <td className="p-4 text-slate-600 text-[11px]">{inv.partsReplaced}</td>
                  <td className="p-4 font-mono text-slate-600">{inv.labor}</td>
                  <td className="p-4 font-mono font-bold text-slate-900 text-sm">{inv.totalAmount}</td>
                  <td className="p-4">
                    <Badge variant="success" size="sm">
                      {inv.paymentStatus}
                    </Badge>
                  </td>
                  <td className="p-4 text-right">
                    <Button variant="outline" size="sm" className="text-xs">
                      View PDF
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

export const MechanicProfileView: React.FC = () => {
  const { mechanics } = useData();
  const mechanicProfile = mechanics[0] || {
    name: 'Rajesh Kumar',
    workshopName: 'Kumar Motors Workshop',
    address: '84, 100 Feet Rd, Indiranagar, Bengaluru',
    experienceYears: 6,
    rating: 4.8,
    reviewCount: 142,
    specializations: ['Engine Diagnostics', 'Electrical & Battery', 'Brake Systems', 'Suspension'],
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-teal-100 text-teal-800 text-xs font-bold mb-1 border border-teal-200">
            <ShieldCheck size={13} />
            <span>Verified Workshop Partner</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">Workshop Profile & Credentials</h2>
          <p className="text-xs text-slate-600">
            Public identity, diagnostic equipment certifications, and service capabilities displayed to vehicle owners.
          </p>
        </div>
        <Badge variant="success" size="md">
          Verified Partner Tier 1
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6 bg-white border-slate-200 shadow-xs md:col-span-2 space-y-4">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold border border-teal-200 shrink-0 shadow-xs">
              <Wrench size={26} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-slate-900">{mechanicProfile.workshopName}</h3>
                <Badge variant="success" size="sm">Audit Passed</Badge>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">Master Technician: <strong className="text-slate-800">{mechanicProfile.name}</strong> · {mechanicProfile.experienceYears} Years Automotive Experience</p>
              <div className="flex items-center gap-3 text-xs mt-2 text-slate-600">
                <span className="flex items-center gap-1"><MapPin size={13} className="text-teal-600" /> {mechanicProfile.address}</span>
              </div>
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <span className="text-xs font-bold text-slate-900 block">Certified Workshop Specializations</span>
            <div className="flex flex-wrap gap-1.5">
              {mechanicProfile.specializations.map((spec, i) => (
                <span key={i} className="px-2.5 py-1 bg-white text-teal-800 rounded-lg text-xs font-semibold border border-teal-200/60 shadow-2xs">
                  {spec}
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 pt-2">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Service Bays</span>
              <span className="text-base font-bold text-slate-900">4 Active Bays</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">OBD-II Scanners</span>
              <span className="text-base font-bold text-slate-900">3 Pro Units</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Daily Capacity</span>
              <span className="text-base font-bold text-slate-900">12 Vehicles</span>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-white border-slate-200 shadow-xs space-y-4">
          <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider">Quality & Reviews</h4>
          <div className="text-center p-4 bg-amber-50/60 rounded-xl border border-amber-200/60">
            <span className="text-3xl font-black text-amber-600 block">{mechanicProfile.rating}</span>
            <div className="flex justify-center text-amber-400 my-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={15} fill="currentColor" />
              ))}
            </div>
            <span className="text-[11px] text-slate-500 font-semibold block">{mechanicProfile.reviewCount} customer reviews</span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>On-Time Delivery</span>
              <strong className="text-slate-900">98.4%</strong>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>AI Diagnostic Accuracy</span>
              <strong className="text-slate-900">96.8%</strong>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Estimate Compliance</span>
              <strong className="text-slate-900">99.1%</strong>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export const MechanicSettingsView: React.FC = () => {
  return <SettingsView portalType="mechanic" />;
};

export const MechanicDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const {
    bookings,
    mechanics,
    openDiagnosisDetailModal,
    diagnoses,
  } = useData();

  const mechanicProfile = mechanics[0] || {
    name: 'Rajesh Kumar',
    workshopName: 'Kumar Motors Workshop',
    address: '84, 100 Feet Rd, Indiranagar, Bengaluru',
  };

  // Workshop Job Queue
  const [todayJobs, setTodayJobs] = useState([
    {
      id: 'JOB-4412',
      time: '09:00',
      customer: 'Alex Sharma',
      vehicle: 'Yamaha R15 V4',
      issue: 'Starter clicking, low crank voltage',
      status: 'In Progress',
      bay: 'Bay 1',
      statusColor: 'bg-sky-100 text-sky-900 border-sky-300',
    },
    {
      id: 'JOB-4413',
      time: '10:30',
      customer: 'Anand Menon',
      vehicle: 'Tata Nexon EV',
      issue: '12V Auxiliary battery sensor warning',
      status: 'Pending',
      bay: 'Bay 2',
      statusColor: 'bg-amber-100 text-amber-900 border-amber-300',
    },
    {
      id: 'JOB-4414',
      time: '11:45',
      customer: 'Priya Patel',
      vehicle: 'Hyundai i20 Asta',
      issue: 'Front wheel brake squeal at low speed',
      status: 'In Bay',
      bay: 'Bay 3',
      statusColor: 'bg-teal-100 text-teal-900 border-teal-300',
    },
    {
      id: 'JOB-4415',
      time: '14:00',
      customer: 'Vikram Singh',
      vehicle: 'Royal Enfield 350',
      issue: 'Cold start idle vibration & misfire',
      status: 'Quality Check',
      bay: 'Bay 1',
      statusColor: 'bg-indigo-100 text-indigo-900 border-indigo-300',
    },
    {
      id: 'JOB-4416',
      time: '15:30',
      customer: 'Rohan Gupta',
      vehicle: 'KTM Duke 390',
      issue: 'Clutch slipping under hard acceleration',
      status: 'Completed',
      bay: 'Bay 4',
      statusColor: 'bg-emerald-100 text-emerald-900 border-emerald-300',
    },
  ]);

  // AI Diagnostic Queue with human mechanic authority verification
  const [aiQueue, setAiQueue] = useState([
    {
      id: 'AI-Q1',
      vehicle: 'Yamaha R15 V4 (2022)',
      symptom: 'Clicking sound during startup, starter motor refuses to crank',
      aiPrediction: 'Battery / Starting System',
      confidence: 82,
      evidenceSummary: 'TF-IDF tokens: clicking, start, crank (0.55 weight)',
      mechanicDecision: null as 'accepted' | 'modified' | null,
    },
    {
      id: 'AI-Q2',
      vehicle: 'Hyundai i20 Asta (2021)',
      symptom: 'High-pitched squealing noise from front wheels when braking at low speed',
      aiPrediction: 'Braking System',
      confidence: 89,
      evidenceSummary: 'TF-IDF tokens: brake, squeal, pad wear (0.61 weight)',
      mechanicDecision: null as 'accepted' | 'modified' | null,
    },
    {
      id: 'AI-Q3',
      vehicle: 'KTM Duke 390 (2023)',
      symptom: 'Engine RPM flares up during acceleration without corresponding speed increase',
      aiPrediction: 'Transmission & Clutch',
      confidence: 84,
      evidenceSummary: 'TF-IDF tokens: clutch, rpm, slip (0.58 weight)',
      mechanicDecision: null as 'accepted' | 'modified' | null,
    },
  ]);

  const [aiAgreementStats, setAiAgreementStats] = useState({ totalEvaluated: 142, agreed: 124 });

  const handleAiAction = (id: string, decision: 'accepted' | 'modified') => {
    setAiQueue((prev) =>
      prev.map((item) => (item.id === id ? { ...item, mechanicDecision: decision } : item))
    );

    if (decision === 'accepted') {
      setAiAgreementStats((prev) => ({
        totalEvaluated: prev.totalEvaluated + 1,
        agreed: prev.agreed + 1,
      }));
    } else {
      setAiAgreementStats((prev) => ({
        totalEvaluated: prev.totalEvaluated + 1,
        agreed: prev.agreed,
      }));
    }
  };

  const advanceJob = (id: string) => {
    setTodayJobs((prev) =>
      prev.map((job) => {
        if (job.id === id) {
          const nextStatus =
            job.status === 'Pending'
              ? 'In Bay'
              : job.status === 'In Bay'
              ? 'In Progress'
              : job.status === 'In Progress'
              ? 'Quality Check'
              : 'Completed';
          const nextColor =
            nextStatus === 'Completed'
              ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
              : 'bg-teal-100 text-teal-900 border-teal-300';
          return { ...job, status: nextStatus, statusColor: nextColor };
        }
        return job;
      })
    );
  };

  // Service Request Trend Chart Data
  const serviceRequestDataSets: Record<TimeRange, MultiSeriesBarDataPoint[]> = {
    '7D': [
      { label: '07 Sep', series: { pending: 2, accepted: 3, inProgress: 4, completed: 5 } },
      { label: '08 Sep', series: { pending: 1, accepted: 4, inProgress: 3, completed: 6 } },
      { label: '09 Sep', series: { pending: 3, accepted: 2, inProgress: 5, completed: 4 } },
      { label: '10 Sep', series: { pending: 2, accepted: 5, inProgress: 4, completed: 7 } },
      { label: '11 Sep', series: { pending: 4, accepted: 3, inProgress: 6, completed: 5 } },
      { label: '12 Sep', series: { pending: 3, accepted: 4, inProgress: 5, completed: 8 } },
      { label: '13 Sep', series: { pending: 5, accepted: 4, inProgress: 3, completed: 6 } },
    ],
    '30D': [
      { label: 'W1 Aug', series: { pending: 8, accepted: 14, inProgress: 12, completed: 22 } },
      { label: 'W2 Aug', series: { pending: 11, accepted: 16, inProgress: 15, completed: 25 } },
      { label: 'W3 Aug', series: { pending: 9, accepted: 18, inProgress: 14, completed: 28 } },
      { label: 'W4 Aug', series: { pending: 12, accepted: 15, inProgress: 16, completed: 24 } },
      { label: 'W1 Sep', series: { pending: 14, accepted: 19, inProgress: 18, completed: 31 } },
      { label: 'W2 Sep', series: { pending: 10, accepted: 21, inProgress: 17, completed: 29 } },
    ],
    '6M': [
      { label: 'Apr', series: { pending: 24, accepted: 45, inProgress: 40, completed: 68 } },
      { label: 'May', series: { pending: 28, accepted: 52, inProgress: 46, completed: 74 } },
      { label: 'Jun', series: { pending: 32, accepted: 58, inProgress: 51, completed: 82 } },
      { label: 'Jul', series: { pending: 29, accepted: 54, inProgress: 48, completed: 80 } },
      { label: 'Aug', series: { pending: 35, accepted: 62, inProgress: 55, completed: 89 } },
      { label: 'Sep', series: { pending: 38, accepted: 68, inProgress: 59, completed: 95 } },
    ],
  };

  const currentAgreementRate = Math.round(
    (aiAgreementStats.agreed / aiAgreementStats.totalEvaluated) * 100
  );

  return (
    <div className="space-y-6">
      {/* 1. Header Operations Banner: Professional Workshop Identity */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-0.5 rounded-md bg-teal-100 text-teal-900 border border-teal-200">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />
              Workshop Management System
            </span>
            <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700 shadow-2xs">
              4 / 6 Active Workshop Bays
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Good morning, {user?.name?.split(' ')[0] || 'Rajesh'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
            {mechanicProfile.workshopName} · Real-time service bays, AI diagnostic queue verification, and invoice tracking.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <Button
            size="sm"
            onClick={() => navigate('/mechanic/requests')}
            leftIcon={<CalendarCheck size={15} />}
            className="bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs py-2 px-3.5 shadow-xs"
          >
            Service Requests (5)
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/mechanic/jobs')}
            leftIcon={<Wrench size={15} />}
            className="bg-white border-slate-300 text-slate-800 hover:bg-slate-50 font-semibold text-xs py-2 px-3.5 shadow-2xs"
          >
            Active Jobs (8)
          </Button>
        </div>
      </div>

      {/* 2. TOP KPI CARDS (6 Cards) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        
        {/* KPI 1: Today's Jobs */}
        <div
          onClick={() => navigate('/mechanic/jobs')}
          className="p-4 rounded-2xl bg-white border border-teal-200/90 border-t-4 border-t-teal-500 hover:border-teal-300 shadow-xs hover:shadow-md transition duration-150 cursor-pointer flex flex-col justify-between group"
        >
          <div className="flex items-center justify-between text-[11px] font-bold text-teal-800 uppercase tracking-wider mb-1">
            <span>Today's Jobs</span>
            <Wrench size={15} className="text-teal-600" />
          </div>
          <div>
            <span className="text-2xl font-black text-slate-900">8</span>
            <span className="text-[10px] text-teal-700 font-bold block mt-0.5">3 in bay right now</span>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-[10px] text-slate-400 font-mono">Bays 1-4 active</span>
            <MiniSparkline data={[5, 6, 8, 7, 8]} color="#0D9488" height={16} width={42} />
          </div>
        </div>

        {/* KPI 2: Pending Requests */}
        <div
          onClick={() => navigate('/mechanic/requests')}
          className="p-4 rounded-2xl bg-white border border-amber-200/90 border-t-4 border-t-amber-500 hover:border-amber-300 shadow-xs hover:shadow-md transition duration-150 cursor-pointer flex flex-col justify-between group"
        >
          <div className="flex items-center justify-between text-[11px] font-bold text-amber-800 uppercase tracking-wider mb-1">
            <span>Pending</span>
            <CalendarCheck size={15} className="text-amber-600" />
          </div>
          <div>
            <span className="text-2xl font-black text-slate-900">5</span>
            <span className="text-[10px] text-amber-700 font-bold block mt-0.5">2 need time slot</span>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-[10px] text-slate-400 font-mono">Action req.</span>
            <MiniSparkline data={[2, 4, 3, 5, 5]} color="#F59E0B" height={16} width={42} />
          </div>
        </div>

        {/* KPI 3: Active Repairs */}
        <div
          onClick={() => navigate('/mechanic/jobs')}
          className="p-4 rounded-2xl bg-white border border-sky-200/90 border-t-4 border-t-sky-500 hover:border-sky-300 shadow-xs hover:shadow-md transition duration-150 cursor-pointer flex flex-col justify-between group"
        >
          <div className="flex items-center justify-between text-[11px] font-bold text-sky-800 uppercase tracking-wider mb-1">
            <span>Active Repairs</span>
            <Activity size={15} className="text-sky-600" />
          </div>
          <div>
            <span className="text-2xl font-black text-slate-900">3</span>
            <span className="text-[10px] text-sky-700 font-bold block mt-0.5">1 awaiting parts</span>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-[10px] text-slate-400 font-mono">Real-time</span>
            <MiniSparkline data={[3, 4, 3, 4, 3]} color="#0EA5E9" height={16} width={42} />
          </div>
        </div>

        {/* KPI 4: Completed This Week */}
        <div
          onClick={() => navigate('/mechanic/service-history')}
          className="p-4 rounded-2xl bg-white border border-emerald-200/90 border-t-4 border-t-emerald-500 hover:border-emerald-300 shadow-xs hover:shadow-md transition duration-150 cursor-pointer flex flex-col justify-between group"
        >
          <div className="flex items-center justify-between text-[11px] font-bold text-emerald-800 uppercase tracking-wider mb-1">
            <span>Completed</span>
            <CheckCircle2 size={15} className="text-emerald-600" />
          </div>
          <div>
            <span className="text-2xl font-black text-slate-900">21</span>
            <span className="text-[10px] text-emerald-700 font-bold block mt-0.5">This week (↑ 15%)</span>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-[10px] text-slate-400 font-mono">100% verified</span>
            <MiniSparkline data={[14, 16, 18, 20, 21]} color="#10B981" height={16} width={42} />
          </div>
        </div>

        {/* KPI 5: Revenue This Month */}
        <div
          onClick={() => navigate('/mechanic/earnings')}
          className="p-4 rounded-2xl bg-white border border-indigo-200/90 border-t-4 border-t-indigo-500 hover:border-indigo-300 shadow-xs hover:shadow-md transition duration-150 cursor-pointer flex flex-col justify-between group"
        >
          <div className="flex items-center justify-between text-[11px] font-bold text-indigo-800 uppercase tracking-wider mb-1">
            <span>Revenue</span>
            <DollarSign size={15} className="text-indigo-600" />
          </div>
          <div>
            <span className="text-xl font-black text-slate-900 font-mono">₹84,500</span>
            <span className="text-[10px] text-emerald-700 font-bold block mt-0.5">↑ 14.2% vs Aug</span>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-[10px] text-slate-400 font-mono">42 invoices</span>
            <MiniSparkline data={[60, 68, 75, 80, 84.5]} color="#6366F1" height={16} width={42} />
          </div>
        </div>

        {/* KPI 6: Customer Rating */}
        <div
          onClick={() => navigate('/mechanic/profile')}
          className="p-4 rounded-2xl bg-white border border-yellow-200/90 border-t-4 border-t-amber-400 hover:border-yellow-300 shadow-xs hover:shadow-md transition duration-150 cursor-pointer flex flex-col justify-between group"
        >
          <div className="flex items-center justify-between text-[11px] font-bold text-amber-800 uppercase tracking-wider mb-1">
            <span>Rating</span>
            <Star size={15} className="text-amber-500 fill-amber-400" />
          </div>
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-slate-900">4.8</span>
              <span className="text-xs font-bold text-slate-400">/ 5.0</span>
            </div>
            <span className="text-[10px] text-slate-500 font-semibold block mt-0.5">142 customer reviews</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-[10px] text-amber-700 font-bold">
            <span>Top Rated Bay</span>
            <CheckCircle2 size={12} className="text-emerald-600" />
          </div>
        </div>

      </div>

      {/* 3. MIDDLE ANALYTICS: Service Requests Trend & Service Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        
        {/* Left (2 Cols): Service Requests Progression Chart */}
        <div className="lg:col-span-2">
          <MultiSeriesBarChart
            title="Service Requests Trend"
            subtitle="Operational workflow progression across workshop pipeline stages"
            dataSets={serviceRequestDataSets}
            series={[
              { key: 'pending', label: 'Pending', color: '#F59E0B' },
              { key: 'accepted', label: 'Accepted', color: '#0EA5E9' },
              { key: 'inProgress', label: 'In Progress', color: '#6366F1' },
              { key: 'completed', label: 'Completed', color: '#10B981' },
            ]}
            initialRange="7D"
            badgeText="Operational Workflow"
          />
        </div>

        {/* Right (1 Col): Service Performance & AI Agreement Metrics */}
        <Card className="p-5 bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Workshop Performance</h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-teal-50 text-teal-700 border border-teal-200">
                SLA Metrics
              </span>
            </div>

            <div className="space-y-3.5 text-xs">
              {/* Metric 1 */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-slate-600 font-medium">Average Repair Time</span>
                  <span className="font-bold text-slate-900 font-mono">2.4 hrs</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-sky-500 h-full rounded-full w-[78%]" />
                </div>
              </div>

              {/* Metric 2 */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-slate-600 font-medium">First-Time Fix Rate</span>
                  <span className="font-bold text-emerald-700 font-mono">91%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full w-[91%]" />
                </div>
              </div>

              {/* Metric 3 */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-slate-600 font-medium">Customer Satisfaction</span>
                  <span className="font-bold text-amber-700 font-mono">4.8 / 5.0</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-amber-400 h-full rounded-full w-[96%]" />
                </div>
              </div>

              {/* Metric 4: AI Agreement Rate (AIML Showcase) */}
              <div className="p-3 bg-gradient-to-br from-indigo-50/80 to-purple-50/60 rounded-xl border border-indigo-200/80">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-indigo-900 font-bold flex items-center gap-1.5 text-xs">
                    <Zap size={14} className="text-indigo-600" />
                    AI Agreement Rate
                  </span>
                  <span className="font-mono font-black text-indigo-900 text-sm">{currentAgreementRate}%</span>
                </div>
                <p className="text-[11px] text-indigo-700 leading-snug mb-2">
                  Mechanic physical validation matches AI preliminary classification across {aiAgreementStats.totalEvaluated} jobs.
                </p>
                <div className="w-full bg-indigo-200/60 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-indigo-600 h-full rounded-full transition-all duration-300"
                    style={{ width: `${currentAgreementRate}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 mt-2 text-center">
            <span className="text-[11px] text-slate-500">
              Kumar Motors SLA: <strong className="text-emerald-700">98.2% on-time delivery</strong>
            </span>
          </div>
        </Card>

      </div>

      {/* 4. TODAY'S WORKSHOP JOB QUEUE */}
      <Card className="p-5 bg-white border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900">Today's Workshop Schedule</h3>
            <p className="text-xs text-slate-500">Active bays and scheduled customer appointments for {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => navigate('/mechanic/jobs')}
            className="text-xs font-semibold border-slate-300 text-slate-800 hover:bg-slate-50"
            rightIcon={<ChevronRight size={13} />}
          >
            Manage All Jobs (8)
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider bg-slate-50/70">
                <th className="py-2.5 px-3">Time</th>
                <th className="py-2.5 px-3">Customer</th>
                <th className="py-2.5 px-3">Vehicle</th>
                <th className="py-2.5 px-3">Reported Issue</th>
                <th className="py-2.5 px-3 text-center">Bay</th>
                <th className="py-2.5 px-3 text-center">Status</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {todayJobs.map((job) => (
                <tr key={job.id} className="hover:bg-slate-50/80 transition duration-100">
                  <td className="py-3 px-3 font-mono font-bold text-slate-700 whitespace-nowrap">{job.time}</td>
                  <td className="py-3 px-3 font-semibold text-slate-900 whitespace-nowrap">{job.customer}</td>
                  <td className="py-3 px-3 font-mono text-slate-800 whitespace-nowrap">{job.vehicle}</td>
                  <td className="py-3 px-3 text-slate-600 max-w-[240px] truncate">{job.issue}</td>
                  <td className="py-3 px-3 text-center font-semibold text-slate-700">{job.bay}</td>
                  <td className="py-3 px-3 text-center">
                    <span className={`inline-block px-2.5 py-0.5 rounded-md font-bold text-[10px] border ${job.statusColor}`}>
                      {job.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => advanceJob(job.id)}
                      className="px-2.5 py-1 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-900 font-bold border border-teal-200 text-xs transition cursor-pointer"
                    >
                      {job.status === 'Completed' ? 'View Invoice' : 'Advance Status →'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* 5. AIML SECTION: AI DIAGNOSTIC QUEUE WITH HUMAN-IN-THE-LOOP AUTHORITY */}
      <Card className="p-5 bg-gradient-to-br from-indigo-50/40 via-white to-sky-50/40 border border-indigo-200/90 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 mb-3 border-b border-indigo-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center border border-indigo-200">
              <Zap size={18} />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">AI Diagnostic Queue (AIML Human-in-the-Loop)</h3>
              <p className="text-xs text-slate-600">Review machine learning preliminary fault classifications before physical teardown</p>
            </div>
          </div>
          <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-indigo-100 text-indigo-900 border border-indigo-300 font-mono">
            {aiQueue.filter((q) => q.mechanicDecision === null).length} Awaiting Verification
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {aiQueue.map((item) => (
            <div
              key={item.id}
              className="p-4 bg-white rounded-xl border border-indigo-200/80 shadow-2xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h4 className="font-bold text-slate-900 text-xs">{item.vehicle}</h4>
                  <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-900 font-mono font-bold text-[10px] border border-indigo-200 shrink-0">
                    {item.confidence}% Conf
                  </span>
                </div>

                <p className="text-[11px] text-slate-600 mb-2 leading-relaxed">
                  <strong className="text-slate-800">Symptom:</strong> {item.symptom}
                </p>

                <div className="p-2 bg-indigo-50/70 rounded-lg border border-indigo-200/60 text-[11px] mb-3">
                  <span className="text-[10px] font-bold text-indigo-800 uppercase block">AI Preliminary Fault:</span>
                  <span className="font-bold text-slate-900">{item.aiPrediction}</span>
                  <span className="text-[10px] text-indigo-600 block mt-0.5">{item.evidenceSummary}</span>
                </div>
              </div>

              <div>
                {item.mechanicDecision ? (
                  <div className="p-2 bg-emerald-50 rounded-lg border border-emerald-200 text-center text-xs font-bold text-emerald-800">
                    {item.mechanicDecision === 'accepted' ? '✓ Accepted by Mechanic' : '⚠ Modified by Mechanic'}
                  </div>
                ) : (
                  <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                    <button
                      onClick={() => handleAiAction(item.id, 'accepted')}
                      className="flex-1 py-1.5 px-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1 cursor-pointer shadow-xs"
                    >
                      <ThumbsUp size={12} /> Accept
                    </button>
                    <button
                      onClick={() => handleAiAction(item.id, 'modified')}
                      className="flex-1 py-1.5 px-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-1 cursor-pointer border border-slate-300"
                    >
                      <ThumbsDown size={12} /> Modify
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
