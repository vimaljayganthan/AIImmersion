import React from 'react';
import { Diagnosis, Vehicle } from '../../../types';
import { X, Sparkles, CheckCircle2, AlertTriangle, ShieldAlert, ArrowRight, Wrench } from 'lucide-react';
import { Button } from '../Button';
import { Badge } from '../Badge';
import { ConfidenceMeter } from '../ConfidenceMeter';

interface DiagnosisDetailModalProps {
  isOpen: boolean;
  diagnosis: Diagnosis | null;
  vehicle?: Vehicle | null;
  onBookMechanic: (diagnosis: Diagnosis) => void;
  onClose: () => void;
}

export const DiagnosisDetailModal: React.FC<DiagnosisDetailModalProps> = ({
  isOpen,
  diagnosis,
  vehicle,
  onBookMechanic,
  onClose,
}) => {
  if (!isOpen || !diagnosis) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-brand-navy/40 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl w-full max-w-2xl border border-brand-border shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="p-6 border-b border-brand-border flex items-start justify-between bg-brand-veryLight/50">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-brand-lightSky text-brand-skyHover uppercase tracking-wider">
                {diagnosis.category}
              </span>
              <Badge
                variant={
                  diagnosis.severity === 'critical'
                    ? 'danger'
                    : diagnosis.severity === 'high'
                    ? 'warning'
                    : 'sky'
                }
                size="sm"
              >
                Severity: {diagnosis.severity.toUpperCase()}
              </Badge>
              {vehicle && (
                <span className="text-xs text-brand-slate font-medium">
                  for {vehicle.year} {vehicle.make} {vehicle.model}
                </span>
              )}
            </div>
            <h3 className="text-xl font-bold text-brand-navy">{diagnosis.title}</h3>
            <p className="text-xs text-brand-slate mt-0.5">
              Reported Symptoms: "{diagnosis.inputSymptoms}"
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
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {/* Safety Warning if critical/high */}
          {diagnosis.safetyWarning && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 space-y-1">
              <div className="flex items-center gap-2 font-bold text-sm">
                <ShieldAlert size={18} className="text-rose-600" />
                <span>Critical Safety Warning</span>
              </div>
              <p className="leading-relaxed">{diagnosis.safetyWarning}</p>
            </div>
          )}

          {/* AI Confidence Gauge & Modalities */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-4 rounded-2xl bg-brand-veryLight border border-brand-lightSky">
              <ConfidenceMeter confidence={diagnosis.confidence} size="md" />
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-brand-border space-y-2">
              <span className="text-[10px] font-bold uppercase text-slate-400 block">Input Modalities Used</span>
              <div className="flex flex-wrap gap-1.5">
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                  diagnosis.modalitiesUsed?.text ?? true ? 'bg-sky-100 text-sky-800' : 'bg-slate-100 text-slate-400 line-through'
                }`}>
                  {diagnosis.modalitiesUsed?.text ?? true ? '✓ Text NLP' : '○ Text'}
                </span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                  diagnosis.modalitiesUsed?.audio ? 'bg-indigo-100 text-indigo-800' : 'bg-slate-100 text-slate-400'
                }`}>
                  {diagnosis.modalitiesUsed?.audio ? '✓ Audio (librosa)' : '○ Audio not provided'}
                </span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                  diagnosis.modalitiesUsed?.image ? 'bg-teal-100 text-teal-800' : 'bg-slate-100 text-slate-400'
                }`}>
                  {diagnosis.modalitiesUsed?.image ? '✓ Image (OpenCV)' : '○ Image not provided'}
                </span>
              </div>
              {diagnosis.modelInfo && (
                <div className="text-[10px] text-brand-slate pt-1 border-t border-slate-200">
                  <span className="font-semibold text-brand-navy">{diagnosis.modelInfo.name}</span> (v{diagnosis.modelInfo.version})
                </div>
              )}
            </div>
          </div>

          {/* Ranked Possible Causes */}
          <div>
            <h4 className="font-bold text-brand-navy uppercase tracking-wider mb-3 text-[11px]">
              Ranked Possible Failure Causes
            </h4>
            <div className="space-y-2.5">
              {diagnosis.possibleCauses.map((cause, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl border border-brand-border bg-slate-50/50 space-y-2"
                >
                  <div className="flex items-center justify-between font-semibold">
                    <span className="text-brand-navy text-xs">{cause.name}</span>
                    <span className="text-brand-skyHover text-xs">{cause.confidence}% Confidence</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-brand-sky h-full rounded-full transition-all duration-500"
                      style={{ width: `${cause.confidence}%` }}
                    />
                  </div>
                  {cause.description && (
                    <p className="text-[11px] text-brand-slate">{cause.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Diagnostic Evidence (Why this was suggested) */}
          <div>
            <h4 className="font-bold text-brand-navy uppercase tracking-wider mb-2.5 text-[11px]">
              Why this was suggested (Diagnostic Evidence)
            </h4>
            <div className="p-4 rounded-2xl bg-slate-50 border border-brand-border space-y-2">
              {diagnosis.reasoning.map((r, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-brand-slate">
                  <CheckCircle2 size={15} className="text-brand-sky mt-0.5 shrink-0" />
                  <span className="leading-relaxed">{r}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recommendations & Warnings */}
          <div>
            <h4 className="font-bold text-brand-navy uppercase tracking-wider mb-2.5 text-[11px]">
              Recommended Next Step
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-800 space-y-1">
                <span className="font-bold block text-[10px] uppercase">Recommended Action</span>
                <p className="leading-relaxed">{diagnosis.recommendation.action}</p>
              </div>
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-100 text-amber-800 space-y-1">
                <span className="font-bold block text-[10px] uppercase">What to Avoid</span>
                <p className="leading-relaxed">{diagnosis.recommendation.avoid}</p>
              </div>
            </div>
          </div>

          {/* Cost Estimation Breakdown */}
          <div className="p-4 rounded-2xl bg-brand-veryLight border border-brand-lightSky flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
                Estimated Repair Cost Range
              </span>
              <span className="text-2xl font-black text-brand-navy">
                ₹{diagnosis.estimatedCost.min.toLocaleString()} – ₹{diagnosis.estimatedCost.max.toLocaleString()}
              </span>
              <p className="text-[10px] text-brand-slate mt-1">
                Parts: ~₹{diagnosis.estimatedCost.partsCost || 1800} · Labour: ~₹{diagnosis.estimatedCost.labourCost || 700} · Inspection: ~₹{diagnosis.estimatedCost.inspectionCost || 200}
              </p>
            </div>
            <div className="text-right sm:text-left">
              <p className="text-[10px] text-slate-400 italic">
                * Actual quotes may vary based on vehicle model & replacement parts
              </p>
            </div>
          </div>

          {/* Decision Support Disclaimer */}
          <div className="p-3 bg-slate-100/70 rounded-xl text-center text-[11px] text-brand-slate">
            Preliminary AI assessment — not a definitive mechanical diagnosis. Always have repairs verified by a professional mechanic.
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-brand-border bg-white flex items-center justify-between">
          <Button variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>
          <Button
            size="sm"
            onClick={() => {
              onClose();
              onBookMechanic(diagnosis);
            }}
            leftIcon={<Wrench size={15} />}
            rightIcon={<ArrowRight size={14} />}
          >
            Find a Mechanic for this Issue
          </Button>
        </div>
      </div>
    </div>
  );
};
