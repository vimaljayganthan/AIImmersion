import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Booking, Part, ServiceRecord } from '../../types';
import { DEMO_PARTS } from '../../database/mockData';
import {
  Wrench,
  CalendarCheck,
  Package,
  DollarSign,
  CheckCircle2,
  AlertCircle,
  FileText,
  Clock,
  Sparkles,
  ArrowRight,
  Plus,
  Trash2,
  Car,
  X,
  ShieldCheck,
} from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { EmptyState } from '../../components/common/EmptyState';

// 1. Service Requests Queue Subview (Accept / Reject)
export const MechanicRequestsView: React.FC = () => {
  const { bookings, updateBookingStatus, openDiagnosisDetailModal, diagnoses } = useData();

  const pendingRequests = bookings.filter((b) => b.status === 'pending');

  const handleAccept = (bookingId: string) => {
    updateBookingStatus(bookingId, 'accepted');
  };

  const handleReject = (bookingId: string) => {
    updateBookingStatus(bookingId, 'cancelled');
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-teal-100 text-teal-800 text-xs font-bold mb-1 border border-teal-200">
            <CalendarCheck size={13} />
            <span>Incoming Bookings</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">Incoming Service Requests</h2>
          <p className="text-xs text-slate-600">Customer repair orders paired with preliminary AI assessments</p>
        </div>
        <Badge variant="sky" size="md">
          {pendingRequests.length} Pending Requests
        </Badge>
      </div>

      {pendingRequests.length === 0 ? (
        <EmptyState
          icon={<CalendarCheck size={32} />}
          title="No Pending Service Requests"
          description="You are all caught up! New bookings from vehicle owners will appear here in real time."
        />
      ) : (
        <div className="space-y-4">
          {pendingRequests.map((req) => {
            const attachedDiag = diagnoses.find((d) => d.id === req.diagnosisId);
            return (
              <Card key={req.id} hoverEffect className="p-6 border-l-4 border-l-brand-sky">
                <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono font-bold text-brand-skyHover">{req.bookingReference}</span>
                      <Badge variant="warning" size="sm">
                        Pending Action
                      </Badge>
                    </div>
                    <h3 className="text-lg font-bold text-brand-navy">{req.serviceType}</h3>
                    <p className="text-xs text-brand-slate mt-0.5">Reported Issue: "{req.problemSummary}"</p>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Est. Revenue</span>
                    <span className="text-lg font-extrabold text-brand-navy">
                      ₹{req.estimatedTotal ? req.estimatedTotal.toLocaleString() : '2,700'}
                    </span>
                  </div>
                </div>

                {/* AI Preliminary Assessment Callout */}
                <div className="p-4 rounded-xl bg-brand-veryLight border border-brand-lightSky mb-4">
                  <div className="flex items-center gap-2 mb-1.5">
                    <Sparkles size={15} className="text-brand-sky" />
                    <span className="text-xs font-bold text-brand-navy">AI Decision Support Assessment:</span>
                  </div>
                  <p className="text-xs text-brand-slate leading-relaxed">
                    {req.aiPreliminaryAssessment || 'Possible electrical system resistance or starting circuit issue.'}
                  </p>
                </div>

                {req.notes && (
                  <div className="p-3 bg-slate-50 rounded-xl mb-4 text-xs text-brand-slate">
                    <strong className="text-brand-navy">Customer Notes:</strong> {req.notes}
                  </div>
                )}

                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-brand-border/60 text-xs text-brand-slate">
                  <span>
                    Appointment: <strong>{req.appointmentDate} at {req.timeSlot}</strong>
                  </span>
                  <div className="flex items-center gap-2">
                    {attachedDiag && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openDiagnosisDetailModal(attachedDiag)}
                      >
                        View AI Diagnosis
                      </Button>
                    )}
                    <button
                      onClick={() => handleReject(req.id)}
                      className="px-3 py-1.5 text-xs text-rose-600 hover:bg-rose-50 rounded-xl font-medium transition"
                    >
                      Decline
                    </button>
                    <Button size="sm" onClick={() => handleAccept(req.id)}>
                      Accept Service Job
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

// 2. Active Jobs & Service Workspace Subview (Advance Stages & Add Parts/Labour)
export const MechanicJobsView: React.FC = () => {
  const { bookings, vehicles, updateBookingStatus } = useData();

  const activeJobs = bookings.filter(
    (b) => b.status !== 'pending' && b.status !== 'completed' && b.status !== 'cancelled'
  );

  // Active job builder state
  const [selectedJobId, setSelectedJobId] = useState<string>(activeJobs[0]?.id || '');
  const [mechanicNotes, setMechanicNotes] = useState(
    'Battery capacity tested degraded at 48% load capacity. Starter relay contacts cleaned. New 12V VRLA battery installed.'
  );
  const [partsList, setPartsList] = useState<Array<{ name: string; cost: number }>>([
    { name: 'Amaron 12V 5Ah Sealed Battery', cost: 1800 },
    { name: 'Battery Terminal Harness Clamps', cost: 150 },
  ]);
  const [newPartName, setNewPartName] = useState('');
  const [newPartCost, setNewPartCost] = useState(0);
  const [labourCost, setLabourCost] = useState(650);

  const currentJob = activeJobs.find((j) => j.id === selectedJobId) || activeJobs[0];
  const targetVeh = vehicles.find((v) => v.id === currentJob?.vehicleId);

  const handleAddPart = () => {
    if (newPartName.trim() && newPartCost > 0) {
      setPartsList((prev) => [...prev, { name: newPartName.trim(), cost: Number(newPartCost) }]);
      setNewPartName('');
      setNewPartCost(0);
    }
  };

  const handleRemovePart = (idx: number) => {
    setPartsList((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleAdvanceStage = (nextStatus: Booking['status']) => {
    if (currentJob) {
      updateBookingStatus(currentJob.id, nextStatus);
    }
  };

  const handleFinalizeService = () => {
    if (currentJob) {
      updateBookingStatus(currentJob.id, 'completed', {
        mechanicNotes: mechanicNotes.trim() || 'Service completed according to manufacturer standards.',
        partsReplaced: partsList,
        labourCost: Number(labourCost),
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-teal-100 text-teal-800 text-xs font-bold mb-1 border border-teal-200">
            <Wrench size={13} />
            <span>Service Bay Management</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">Active Service Workspace</h2>
          <p className="text-xs text-slate-600">
            Manage physical diagnosis, advance service stages, and build final customer repair reports
          </p>
        </div>
        <Badge variant="sky" size="md">
          {activeJobs.length} Active in Workshop
        </Badge>
      </div>

      {activeJobs.length === 0 ? (
        <EmptyState
          icon={<Wrench size={32} />}
          title="No Active Repair Jobs"
          description="Accept incoming requests to start physical inspections and repair jobs."
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Jobs Selector List (4 cols) */}
          <div className="lg:col-span-4 space-y-3">
            {activeJobs.map((j) => (
              <Card
                key={j.id}
                onClick={() => setSelectedJobId(j.id)}
                className={`p-4 cursor-pointer transition border-l-4 ${
                  (currentJob?.id === j.id)
                    ? 'border-l-brand-sky bg-brand-veryLight/50 ring-2 ring-brand-sky/20'
                    : 'border-l-slate-300 hover:border-l-brand-sky/50'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-mono font-bold text-brand-skyHover">{j.bookingReference}</span>
                  <Badge variant="sky" size="sm">
                    {j.status.toUpperCase()}
                  </Badge>
                </div>
                <h4 className="text-xs font-bold text-brand-navy">{j.serviceType}</h4>
                <p className="text-[11px] text-brand-slate mt-0.5 line-clamp-1">{j.problemSummary}</p>
              </Card>
            ))}
          </div>

          {/* Job Workspace (8 cols) */}
          <div className="lg:col-span-8 space-y-4">
            {currentJob && (
              <Card className="p-6 space-y-6">
                {/* Header */}
                <div className="flex flex-wrap items-start justify-between gap-3 pb-4 border-b border-brand-border">
                  <div>
                    <span className="text-xs font-mono font-bold text-brand-skyHover block">
                      {currentJob.bookingReference}
                    </span>
                    <h3 className="text-lg font-bold text-brand-navy mt-0.5">
                      {targetVeh?.year} {targetVeh?.make} {targetVeh?.model} ({targetVeh?.regNumber})
                    </h3>
                    <p className="text-xs text-brand-slate">
                      Current Stage: <strong className="text-brand-navy capitalize">{currentJob.status.replace('_', ' ')}</strong>
                    </p>
                  </div>

                  {/* Stage advancement buttons */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    {currentJob.status === 'accepted' && (
                      <Button size="sm" onClick={() => handleAdvanceStage('vehicle_received')}>
                        Mark Vehicle Received
                      </Button>
                    )}
                    {currentJob.status === 'vehicle_received' && (
                      <Button size="sm" onClick={() => handleAdvanceStage('diagnosing')}>
                        Start Physical Diagnosis
                      </Button>
                    )}
                    {currentJob.status === 'diagnosing' && (
                      <Button size="sm" onClick={() => handleAdvanceStage('repairing')}>
                        Start Repair & Parts
                      </Button>
                    )}
                    {currentJob.status === 'repairing' && (
                      <Button size="sm" onClick={() => handleAdvanceStage('quality_check')}>
                        Quality Inspection
                      </Button>
                    )}
                  </div>
                </div>

                {/* AI vs Mechanic Assessment Comparison */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-brand-veryLight rounded-2xl border border-brand-lightSky text-xs space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-brand-skyHover flex items-center gap-1.5 text-[11px] uppercase">
                        <Sparkles size={13} />
                        AI Preliminary Assessment
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 font-bold">
                        AI Assistant
                      </span>
                    </div>
                    <p className="text-brand-navy font-semibold">
                      {currentJob.aiPreliminaryAssessment || 'Possible weak battery or starter relay resistance.'}
                    </p>
                    <p className="text-[10px] text-brand-slate">Customer symptom: "{currentJob.problemSummary}"</p>
                    
                    {/* Quick Verification Actions */}
                    <div className="flex flex-wrap gap-1.5 pt-2 border-t border-sky-100">
                      <button
                        type="button"
                        onClick={() => {
                          setMechanicNotes(`Mechanic Verified: Confirmed ${currentJob.aiPreliminaryAssessment || 'AI preliminary diagnosis'}. Physical inspection confirms fault parameters within expected tolerance.`);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-800 text-[10px] font-bold transition flex items-center gap-1"
                      >
                        <CheckCircle2 size={12} />
                        Accept Assessment
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setMechanicNotes(`Mechanic Disagreement: Physical inspection revealed different root cause. AI preliminary assessment ruled out after component testing.`);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-800 text-[10px] font-bold transition flex items-center gap-1"
                      >
                        <AlertCircle size={12} />
                        Disagree with AI
                      </button>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-2xl border border-brand-border text-xs space-y-1.5">
                    <span className="font-bold text-brand-navy flex items-center gap-1.5 text-[11px] uppercase">
                      <ShieldCheck size={14} className="text-emerald-500" />
                      Mechanic Professional Diagnosis & Verification
                    </span>
                    <textarea
                      rows={3}
                      value={mechanicNotes}
                      onChange={(e) => setMechanicNotes(e.target.value)}
                      placeholder="Add physical observations (you can verify or disagree with AI)..."
                      className="w-full p-2 text-xs rounded-xl border border-brand-border bg-white focus:outline-none focus:ring-1 focus:ring-brand-sky"
                    />
                    <span className="text-[10px] text-slate-400 block italic">
                      Mechanic acts as the certified authority. Physical findings override AI decision support.
                    </span>
                  </div>
                </div>

                {/* Parts & Labour Billing Form */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-brand-navy uppercase tracking-wider">
                    Replaced Parts & Certified Labour Charges
                  </h4>

                  <div className="border border-brand-border rounded-xl overflow-hidden text-xs">
                    <table className="w-full text-left">
                      <thead className="bg-slate-50 border-b border-brand-border text-slate-400 uppercase font-semibold text-[10px]">
                        <tr>
                          <th className="p-3">Component / Part Description</th>
                          <th className="p-3 text-right">Cost (₹)</th>
                          <th className="p-3 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-brand-border/60">
                        {partsList.map((p, idx) => (
                          <tr key={idx}>
                            <td className="p-3 font-medium text-brand-navy">{p.name}</td>
                            <td className="p-3 text-right font-semibold text-brand-navy">₹{p.cost.toLocaleString()}</td>
                            <td className="p-3 text-right">
                              <button
                                onClick={() => handleRemovePart(idx)}
                                className="text-rose-500 hover:text-rose-700"
                              >
                                <Trash2 size={14} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Add Part Row */}
                  <div className="flex gap-2 text-xs">
                    <input
                      type="text"
                      placeholder="Part item name (e.g. Starter Relay)"
                      value={newPartName}
                      onChange={(e) => setNewPartName(e.target.value)}
                      className="flex-1 px-3 py-1.5 rounded-xl border border-brand-border"
                    />
                    <input
                      type="number"
                      placeholder="Price (₹)"
                      value={newPartCost || ''}
                      onChange={(e) => setNewPartCost(Number(e.target.value))}
                      className="w-28 px-3 py-1.5 rounded-xl border border-brand-border"
                    />
                    <Button type="button" size="sm" variant="secondary" onClick={handleAddPart}>
                      Add Part
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl text-xs">
                    <span className="font-semibold text-brand-slate">Certified Labour Charge (₹):</span>
                    <input
                      type="number"
                      value={labourCost}
                      onChange={(e) => setLabourCost(Number(e.target.value))}
                      className="w-28 px-3 py-1 text-right font-bold rounded-lg border border-brand-border bg-white"
                    />
                  </div>
                </div>

                {/* Finalize Button */}
                <div className="pt-4 border-t border-brand-border flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase block font-bold">Total Invoiced</span>
                    <span className="text-xl font-black text-brand-navy">
                      ₹{(partsList.reduce((acc, p) => acc + p.cost, 0) + Number(labourCost)).toLocaleString()}
                    </span>
                  </div>

                  <Button
                    size="md"
                    onClick={handleFinalizeService}
                    leftIcon={<CheckCircle2 size={16} />}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white"
                  >
                    Finalize & Complete Service
                  </Button>
                </div>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// 3. Parts Inventory Subview (Live Stock CRUD)
export const MechanicPartsView: React.FC = () => {
  const [parts, setParts] = useState<Part[]>(DEMO_PARTS);
  const [showAddForm, setShowAddForm] = useState(false);
  const [name, setName] = useState('');
  const [partNumber, setPartNumber] = useState('');
  const [category, setCategory] = useState('Electrical');
  const [price, setPrice] = useState(1200);
  const [stockCount, setStockCount] = useState(10);

  const handleAddPartSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newPart: Part = {
      id: `part_${Date.now()}`,
      name: name.trim(),
      partNumber: partNumber.trim() || `PART-${Date.now().toString().slice(-4)}`,
      category,
      compatibleModels: ['Yamaha R15 V4', 'Hyundai i20'],
      price: Number(price),
      inStock: stockCount > 0,
      stockCount: Number(stockCount),
    };

    setParts((prev) => [newPart, ...prev]);
    setShowAddForm(false);
    setName('');
  };

  const handleAdjustStock = (id: string, delta: number) => {
    setParts((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;
        const newCount = Math.max(0, p.stockCount + delta);
        return {
          ...p,
          stockCount: newCount,
          inStock: newCount > 0,
        };
      })
    );
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-teal-100 text-teal-800 text-xs font-bold mb-1 border border-teal-200">
            <Package size={13} />
            <span>Inventory Management</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">Workshop Parts Inventory</h2>
          <p className="text-xs text-slate-600">Manage OEM and aftermarket components in workshop stock</p>
        </div>
        <Button size="sm" leftIcon={<Plus size={16} />} onClick={() => setShowAddForm(!showAddForm)}>
          {showAddForm ? 'Cancel' : 'Add New Part'}
        </Button>
      </div>

      {showAddForm && (
        <Card className="p-5 border-l-4 border-l-brand-sky animate-in fade-in duration-150">
          <h3 className="text-xs font-bold text-brand-navy uppercase tracking-wider mb-3">Add Part to Inventory</h3>
          <form onSubmit={handleAddPartSubmit} className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
            <input
              type="text"
              required
              placeholder="Part Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="px-3 py-2 rounded-xl border border-brand-border"
            />
            <input
              type="text"
              placeholder="Part Number (e.g. BT-12V)"
              value={partNumber}
              onChange={(e) => setPartNumber(e.target.value)}
              className="px-3 py-2 rounded-xl border border-brand-border"
            />
            <input
              type="number"
              placeholder="Price (₹)"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              className="px-3 py-2 rounded-xl border border-brand-border"
            />
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Stock Count"
                value={stockCount}
                onChange={(e) => setStockCount(Number(e.target.value))}
                className="w-24 px-3 py-2 rounded-xl border border-brand-border"
              />
              <Button type="submit" size="sm" className="flex-1">
                Save Part
              </Button>
            </div>
          </form>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {parts.map((p) => (
          <Card key={p.id} hoverEffect className="p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase font-mono">{p.partNumber}</span>
                <Badge variant={p.inStock ? 'success' : 'danger'} size="sm">
                  {p.inStock ? `${p.stockCount} in stock` : 'Out of stock'}
                </Badge>
              </div>
              <h3 className="text-base font-bold text-brand-navy mb-1">{p.name}</h3>
              <p className="text-xs text-brand-slate mb-3">{p.category}</p>

              <div className="text-xs text-brand-slate space-y-1 mb-4">
                <span className="text-[10px] text-slate-400 uppercase block font-semibold">Compatible with:</span>
                <p className="font-medium text-brand-navy">{p.compatibleModels.join(', ')}</p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-brand-border/60">
              <span className="text-base font-extrabold text-brand-navy">₹{p.price.toLocaleString()}</span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleAdjustStock(p.id, -1)}
                  className="w-7 h-7 rounded-lg border border-brand-border flex items-center justify-center font-bold text-brand-slate hover:bg-slate-100"
                >
                  -
                </button>
                <span className="text-xs font-bold text-brand-navy px-1">{p.stockCount}</span>
                <button
                  onClick={() => handleAdjustStock(p.id, 1)}
                  className="w-7 h-7 rounded-lg border border-brand-border flex items-center justify-center font-bold text-brand-slate hover:bg-slate-100"
                >
                  +
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

// 4. Earnings Subview (Live Metrics)
export const MechanicEarningsView: React.FC = () => {
  const { serviceRecords } = useData();

  const totalEarnings = serviceRecords.reduce((acc, r) => acc + r.finalCost, 0);

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-xs font-bold mb-1 border border-emerald-200">
            <DollarSign size={13} />
            <span>Financial Telemetry</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">Earnings & Revenue Summary</h2>
          <p className="text-xs text-slate-600">Computed from completed service invoices and labour fees</p>
        </div>
        <Badge variant="success" size="md">
          Verified Settlement Account
        </Badge>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card className="p-6">
          <span className="text-xs text-slate-400 uppercase font-bold block mb-1">Total Lifetime Revenue</span>
          <span className="text-3xl font-black text-brand-navy">₹{totalEarnings.toLocaleString()}</span>
          <p className="text-xs text-emerald-600 mt-2 font-medium">From {serviceRecords.length} completed repair orders</p>
        </Card>
        <Card className="p-6">
          <span className="text-xs text-slate-400 uppercase font-bold block mb-1">Completed Services</span>
          <span className="text-3xl font-black text-brand-navy">{serviceRecords.length}</span>
          <p className="text-xs text-brand-slate mt-2">
            Average: ₹{(totalEarnings / (serviceRecords.length || 1)).toFixed(0)} / order
          </p>
        </Card>
        <Card className="p-6">
          <span className="text-xs text-slate-400 uppercase font-bold block mb-1">Customer Satisfaction</span>
          <span className="text-3xl font-black text-brand-navy">4.8 ★</span>
          <p className="text-xs text-brand-slate mt-2">Verified mechanic partner status</p>
        </Card>
      </div>
    </div>
  );
};
