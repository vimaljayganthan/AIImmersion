import React from 'react';
import { Mechanic } from '../../../types';
import { X, Star, MapPin, Clock, Wrench, ShieldCheck, Phone, CheckCircle2, User } from 'lucide-react';
import { Button } from '../Button';
import { Badge } from '../Badge';

interface MechanicProfileModalProps {
  isOpen: boolean;
  mechanic: Mechanic | null;
  onBook: (mechanic: Mechanic) => void;
  onClose: () => void;
}

export const MechanicProfileModal: React.FC<MechanicProfileModalProps> = ({
  isOpen,
  mechanic,
  onBook,
  onClose,
}) => {
  if (!isOpen || !mechanic) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-brand-navy/40 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl w-full max-w-xl border border-brand-border shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-brand-border flex items-start justify-between bg-gradient-to-r from-white to-brand-veryLight">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-brand-lightSky border border-brand-sky/30 flex items-center justify-center text-brand-navy shadow-soft shrink-0">
              <User size={30} className="text-brand-navy" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-brand-navy">{mechanic.workshopName}</h3>
                {mechanic.isVerified && (
                  <Badge variant="success" size="sm" dot>
                    Verified Partner
                  </Badge>
                )}
              </div>
              <p className="text-xs text-brand-slate mt-0.5">
                Lead Technician: <strong className="text-brand-navy">{mechanic.name}</strong> ({mechanic.experienceYears}+ years exp.)
              </p>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex items-center gap-1 text-xs text-amber-500 font-bold">
                  <Star size={13} fill="currentColor" />
                  <span>{mechanic.rating}</span>
                </div>
                <span className="text-xs text-brand-slate">({mechanic.reviewCount} verified reviews)</span>
                <span className="text-xs text-slate-300">·</span>
                <span className="text-xs font-semibold text-brand-skyHover">{mechanic.distanceKm} km away</span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-brand-navy hover:bg-slate-100 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1 text-xs">
          {/* Contact & Hours Info Grid */}
          <div className="grid grid-cols-2 gap-3 p-3.5 bg-slate-50 rounded-2xl border border-brand-border/70">
            <div className="flex items-center gap-2 text-brand-slate">
              <MapPin size={15} className="text-brand-sky shrink-0" />
              <span>{mechanic.address}</span>
            </div>
            <div className="flex items-center gap-2 text-brand-slate">
              <Clock size={15} className="text-brand-sky shrink-0" />
              <span>{mechanic.workingHours}</span>
            </div>
            <div className="flex items-center gap-2 text-brand-slate">
              <Phone size={15} className="text-brand-sky shrink-0" />
              <span>{mechanic.phone}</span>
            </div>
            <div className="flex items-center gap-2 text-brand-slate">
              <Wrench size={15} className="text-brand-sky shrink-0" />
              <span>Standard Labour: ₹{mechanic.hourlyRate}/hr</span>
            </div>
          </div>

          {/* Specializations */}
          <div>
            <h4 className="font-bold text-brand-navy uppercase tracking-wider mb-2 text-[10px]">
              Workshop Specializations & Equipment
            </h4>
            <div className="flex flex-wrap gap-2">
              {mechanic.specializations.map((spec, i) => (
                <span
                  key={i}
                  className="px-3 py-1 rounded-xl bg-brand-lightSky text-brand-navy font-semibold border border-brand-sky/20"
                >
                  {spec}
                </span>
              ))}
            </div>
          </div>

          {/* Services Offered */}
          <div>
            <h4 className="font-bold text-brand-navy uppercase tracking-wider mb-2 text-[10px]">
              Services Offered
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {mechanic.servicesOffered.map((serv, i) => (
                <div key={i} className="flex items-center gap-2 text-brand-slate">
                  <CheckCircle2 size={13} className="text-brand-success shrink-0" />
                  <span>{serv}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Reviews Sample */}
          <div>
            <h4 className="font-bold text-brand-navy uppercase tracking-wider mb-2 text-[10px]">
              Verified Customer Feedback
            </h4>
            <div className="space-y-2">
              <div className="p-3 rounded-xl bg-slate-50 border border-brand-border/60">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-brand-navy">Vikram Rao</span>
                  <div className="flex text-amber-500">
                    {'★'.repeat(5)}
                  </div>
                </div>
                <p className="text-brand-slate italic">
                  "Rajesh quickly diagnosed the battery terminal drain on my R15. Transparent billing with OEM parts."
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-brand-border bg-brand-veryLight/50 flex items-center justify-between">
          <span className="text-xs text-brand-slate">
            Vehicle Types: <strong className="text-brand-navy">{mechanic.vehicleTypes.join(' & ')}</strong>
          </span>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={onClose}>
              Close
            </Button>
            <Button
              size="sm"
              onClick={() => {
                onClose();
                onBook(mechanic);
              }}
            >
              Book Service Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
