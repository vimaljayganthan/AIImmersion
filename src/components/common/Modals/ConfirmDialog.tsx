import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { Button } from '../Button';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDanger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  isDanger = true,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-brand-navy/40 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl w-full max-w-md border border-brand-border shadow-2xl p-6 overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
            isDanger ? 'bg-rose-50 text-rose-500 border border-rose-100' : 'bg-brand-lightSky text-brand-skyHover'
          }`}>
            <AlertTriangle size={24} />
          </div>
          <button
            onClick={onCancel}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-brand-navy hover:bg-slate-100 transition"
          >
            <X size={18} />
          </button>
        </div>

        <h3 className="text-lg font-bold text-brand-navy mb-2">{title}</h3>
        <p className="text-xs text-brand-slate leading-relaxed mb-6">{message}</p>

        <div className="flex items-center justify-end gap-3">
          <Button variant="outline" size="sm" onClick={onCancel}>
            {cancelLabel}
          </Button>
          <Button
            variant={isDanger ? 'danger' : 'primary'}
            size="sm"
            onClick={onConfirm}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
};
