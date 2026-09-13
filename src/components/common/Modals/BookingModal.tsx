import React, { useState, useEffect } from 'react';
import { Mechanic, Vehicle, Diagnosis } from '../../../types';
import { X, Calendar, Clock, Car, Wrench, CheckCircle2, Sparkles, MapPin, Star, User } from 'lucide-react';
import { Button } from '../Button';

interface BookingModalProps {
  isOpen: boolean;
  mechanic: Mechanic | null;
  vehicles: Vehicle[];
  activeVehicle: Vehicle | null;
  initialDiagnosis?: Diagnosis | null;
  onConfirm: (bookingData: {
    vehicleId: string;
    mechanicId: string;
    diagnosisId?: string;
    serviceType: string;
    problemSummary: string;
    aiPreliminaryAssessment?: string;
    appointmentDate: string;
    timeSlot: string;
    notes: string;
    estimatedTotal: number;
  }) => void;
  onClose: () => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  mechanic,
  vehicles,
  activeVehicle,
  initialDiagnosis,
  onConfirm,
  onClose,
}) => {
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>('');
  const [serviceType, setServiceType] = useState('Diagnostic Inspection & Repair');
  const [problemSummary, setProblemSummary] = useState('');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('10:00 AM - 11:30 AM');
  const [notes, setNotes] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [generatedRef, setGeneratedRef] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (activeVehicle) {
      setSelectedVehicleId(activeVehicle.id);
    } else if (vehicles.length > 0) {
      setSelectedVehicleId(vehicles[0].id);
    }

    if (initialDiagnosis) {
      setProblemSummary(initialDiagnosis.inputSymptoms || initialDiagnosis.title);
      setServiceType(`${initialDiagnosis.category} Inspection`);
    } else {
      setProblemSummary('Routine checkup / general inspection');
    }

    // Default to tomorrow's date
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setAppointmentDate(tomorrow.toISOString().split('T')[0]);
    setIsSuccess(false);
    setError('');
  }, [isOpen, mechanic, activeVehicle, initialDiagnosis, vehicles]);

  if (!isOpen || !mechanic) return null;

  const currentSelectedVehicle = vehicles.find((v) => v.id === selectedVehicleId) || activeVehicle;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVehicleId || !appointmentDate || !timeSlot || !problemSummary.trim()) {
      setError('Please fill in all booking details.');
      return;
    }

    const estCost = initialDiagnosis ? initialDiagnosis.estimatedCost.min : 1800;
    const ref = `AM-${Math.floor(1000 + Math.random() * 9000)}`;
    setGeneratedRef(ref);

    onConfirm({
      vehicleId: selectedVehicleId,
      mechanicId: mechanic.id,
      diagnosisId: initialDiagnosis?.id,
      serviceType,
      problemSummary: problemSummary.trim(),
      aiPreliminaryAssessment: initialDiagnosis ? `${initialDiagnosis.title} (${initialDiagnosis.confidence}% AI Confidence)` : undefined,
      appointmentDate,
      timeSlot,
      notes: notes.trim(),
      estimatedTotal: estCost,
    });

    setIsSuccess(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-brand-navy/40 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl w-full max-w-lg border border-brand-border shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-brand-border flex items-center justify-between bg-brand-veryLight/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-lightSky text-brand-skyHover flex items-center justify-center">
              <Calendar size={20} />
            </div>
            <div>
              <h3 className="text-base font-bold text-brand-navy">
                {isSuccess ? 'Booking Confirmed' : `Book Service at ${mechanic.workshopName}`}
              </h3>
              <p className="text-xs text-brand-slate">
                {isSuccess ? 'Your appointment has been dispatched' : `${mechanic.address.split(',')[0]} · ${mechanic.distanceKm} km away`}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-brand-navy hover:bg-slate-100 transition"
          >
            <X size={18} />
          </button>
        </div>

        {isSuccess ? (
          <div className="p-8 text-center space-y-5">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle2 size={32} />
            </div>
            <div>
              <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-brand-lightSky text-brand-skyHover uppercase tracking-wider">
                Booking ID: {generatedRef}
              </span>
              <h4 className="text-xl font-extrabold text-brand-navy mt-3">
                Appointment Scheduled!
              </h4>
              <p className="text-xs text-brand-slate max-w-xs mx-auto mt-1">
                {mechanic.workshopName} has received your service order for {currentSelectedVehicle?.make} {currentSelectedVehicle?.model} on {appointmentDate} at {timeSlot}.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-brand-border text-left text-xs space-y-1.5 max-w-sm mx-auto">
              <div className="flex justify-between">
                <span className="text-slate-400">Workshop:</span>
                <span className="font-semibold text-brand-navy">{mechanic.workshopName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Vehicle:</span>
                <span className="font-semibold text-brand-navy">{currentSelectedVehicle?.make} {currentSelectedVehicle?.model} ({currentSelectedVehicle?.regNumber})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Schedule:</span>
                <span className="font-semibold text-brand-navy">{appointmentDate} · {timeSlot}</span>
              </div>
            </div>

            <Button className="w-full max-w-sm mx-auto" size="md" onClick={onClose}>
              Done & View Bookings
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1">
            {error && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-medium">
                {error}
              </div>
            )}

            {/* Selected Mechanic Card Header */}
            <div className="p-3.5 bg-brand-veryLight rounded-2xl border border-brand-lightSky flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white border border-brand-sky/30 flex items-center justify-center text-brand-navy shadow-xs shrink-0">
                  <User size={20} className="text-brand-navy" />
                </div>
                <div>
                  <h4 className="font-bold text-brand-navy text-xs">{mechanic.workshopName}</h4>
                  <div className="flex items-center gap-1 text-[11px] text-amber-500 font-semibold">
                    <Star size={12} fill="currentColor" />
                    <span>{mechanic.rating}</span>
                    <span className="text-brand-slate font-normal">({mechanic.reviewCount} reviews)</span>
                  </div>
                </div>
              </div>
              <span className="text-xs font-bold text-brand-skyHover">{mechanic.distanceKm} km</span>
            </div>

            {/* Vehicle Selector */}
            <div>
              <label className="block text-xs font-semibold text-brand-slate mb-1">
                Select Vehicle *
              </label>
              <select
                value={selectedVehicleId}
                onChange={(e) => setSelectedVehicleId(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-brand-border focus:ring-2 focus:ring-brand-sky/20 focus:border-brand-sky focus:outline-none bg-white font-medium text-brand-navy"
              >
                {vehicles.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.year} {v.make} {v.model} ({v.regNumber})
                  </option>
                ))}
              </select>
            </div>

            {/* Problem / Diagnosis summary */}
            <div>
              <label className="block text-xs font-semibold text-brand-slate mb-1">
                Problem / Service Required *
              </label>
              <input
                type="text"
                required
                value={problemSummary}
                onChange={(e) => setProblemSummary(e.target.value)}
                placeholder="Describe issue or service"
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-brand-border focus:ring-2 focus:ring-brand-sky/20 focus:border-brand-sky focus:outline-none"
              />
              {initialDiagnosis && (
                <div className="mt-1 flex items-center gap-1.5 text-[11px] text-brand-skyHover font-semibold">
                  <Sparkles size={12} />
                  <span>AI Assessment attached: {initialDiagnosis.title} ({initialDiagnosis.confidence}% confidence)</span>
                </div>
              )}
            </div>

            {/* Date & Time Slot Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-brand-slate mb-1">
                  Appointment Date *
                </label>
                <input
                  type="date"
                  required
                  value={appointmentDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setAppointmentDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-brand-border focus:ring-2 focus:ring-brand-sky/20 focus:border-brand-sky focus:outline-none bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-brand-slate mb-1">
                  Preferred Time Slot *
                </label>
                <select
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value)}
                  className="w-full px-2 py-2 text-xs rounded-xl border border-brand-border focus:ring-2 focus:ring-brand-sky/20 focus:border-brand-sky focus:outline-none bg-white font-medium"
                >
                  <option value="09:00 AM - 10:30 AM">09:00 AM - 10:30 AM</option>
                  <option value="10:30 AM - 12:00 PM">10:30 AM - 12:00 PM</option>
                  <option value="02:00 PM - 03:30 PM">02:00 PM - 03:30 PM</option>
                  <option value="04:00 PM - 05:30 PM">04:00 PM - 05:30 PM</option>
                </select>
              </div>
            </div>

            {/* Additional notes */}
            <div>
              <label className="block text-xs font-semibold text-brand-slate mb-1">
                Additional Instructions for Mechanic (Optional)
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Please check battery voltage and alternator charging output"
                className="w-full p-2.5 text-xs rounded-xl border border-brand-border focus:ring-2 focus:ring-brand-sky/20 focus:border-brand-sky focus:outline-none"
              />
            </div>

            <div className="pt-4 border-t border-brand-border flex items-center justify-between">
              <span className="text-xs text-brand-slate">
                Est. Price: <strong className="text-brand-navy">₹{initialDiagnosis ? initialDiagnosis.estimatedCost.min.toLocaleString() : '1,800'} – ₹{initialDiagnosis ? initialDiagnosis.estimatedCost.max.toLocaleString() : '3,500'}</strong>
              </span>
              <div className="flex items-center gap-2">
                <Button type="button" variant="outline" size="sm" onClick={onClose}>
                  Cancel
                </Button>
                <Button type="submit" size="sm" leftIcon={<CheckCircle2 size={16} />}>
                  Confirm Booking
                </Button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
