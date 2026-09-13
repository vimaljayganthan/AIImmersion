import React from 'react';
import { ServiceRecord, Vehicle } from '../../../types';
import { X, FileText, CheckCircle2, DollarSign, Calendar, Wrench } from 'lucide-react';
import { Button } from '../Button';
import { Badge } from '../Badge';

interface ServiceReportModalProps {
  isOpen: boolean;
  record: ServiceRecord | null;
  vehicle?: Vehicle | null;
  onClose: () => void;
}

export const ServiceReportModal: React.FC<ServiceReportModalProps> = ({
  isOpen,
  record,
  vehicle,
  onClose,
}) => {
  if (!isOpen || !record) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-brand-navy/40 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl w-full max-w-lg border border-brand-border shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-brand-border flex items-start justify-between bg-brand-veryLight/50">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold text-brand-skyHover block">{record.serviceDate}</span>
              <Badge variant="success" size="sm">
                Service Completed
              </Badge>
            </div>
            <h3 className="text-lg font-bold text-brand-navy">{record.title}</h3>
            <p className="text-xs text-brand-slate mt-0.5">
              Serviced by {record.workshopName} ({record.mechanicName})
            </p>
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
          {/* Mileage & Vehicle Specs */}
          <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-2xl border border-brand-border">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Odometer at Service</span>
              <span className="font-extrabold text-brand-navy">{record.mileageAtService.toLocaleString()} km</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Next Service Due</span>
              <span className="font-extrabold text-brand-skyHover">{record.nextServiceDueMileage.toLocaleString()} km</span>
            </div>
          </div>

          {/* Mechanic Professional Notes */}
          <div>
            <h4 className="font-bold text-brand-navy uppercase tracking-wider mb-2 text-[10px]">
              Certified Mechanic Observation & Diagnosis
            </h4>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-brand-border text-brand-navy leading-relaxed">
              "{record.mechanicNotes}"
            </div>
          </div>

          {/* Parts Replaced Table */}
          <div>
            <h4 className="font-bold text-brand-navy uppercase tracking-wider mb-2 text-[10px]">
              Parts & Materials Replaced
            </h4>
            <div className="border border-brand-border rounded-xl overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-brand-border text-slate-400 uppercase font-semibold text-[10px]">
                  <tr>
                    <th className="p-3">Component / Part Name</th>
                    <th className="p-3 text-right">Price</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-border/60">
                  {record.partsReplaced.map((part, idx) => (
                    <tr key={idx}>
                      <td className="p-3 font-medium text-brand-navy">{part.name}</td>
                      <td className="p-3 text-right font-semibold text-brand-navy">₹{part.cost.toLocaleString()}</td>
                    </tr>
                  ))}
                  <tr>
                    <td className="p-3 text-brand-slate">Certified Labour & Service Charge</td>
                    <td className="p-3 text-right font-semibold text-brand-navy">₹{record.labourCost.toLocaleString()}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Total Cost Banner */}
          <div className="p-4 bg-brand-lightSky/60 rounded-2xl border border-brand-sky/30 flex items-center justify-between">
            <span className="font-bold text-brand-navy">Total Final Invoiced Amount</span>
            <span className="text-2xl font-black text-brand-navy">₹{record.finalCost.toLocaleString()}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-brand-border bg-white flex items-center justify-end">
          <Button size="sm" onClick={onClose}>
            Close Report
          </Button>
        </div>
      </div>
    </div>
  );
};
