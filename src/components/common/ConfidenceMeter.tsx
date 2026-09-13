import React from 'react';
import { clsx } from 'clsx';
import { Sparkles } from 'lucide-react';

interface ConfidenceMeterProps {
  confidence: number; // 0 - 100
  label?: string;
  showIcon?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const ConfidenceMeter: React.FC<ConfidenceMeterProps> = ({
  confidence,
  label = 'AI Confidence',
  showIcon = true,
  size = 'md',
  className = '',
}) => {
  const getLevel = (score: number) => {
    if (score >= 80) return { text: 'High AI Confidence', color: 'text-brand-skyHover', bg: 'bg-brand-sky', border: 'border-brand-sky/20' };
    if (score >= 50) return { text: 'Moderate AI Confidence', color: 'text-amber-600', bg: 'bg-amber-500', border: 'border-amber-200' };
    return { text: 'Lower AI Confidence', color: 'text-slate-600', bg: 'bg-slate-400', border: 'border-slate-200' };
  };

  const info = getLevel(confidence);

  return (
    <div className={clsx('w-full', className)}>
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-1.5">
          {showIcon && <Sparkles size={14} className="text-brand-sky" />}
          <span className="text-xs font-semibold text-brand-slate uppercase tracking-wider">{label}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-brand-slate">{info.text}</span>
          <span className="text-sm font-bold text-brand-navy">{confidence}%</span>
        </div>
      </div>
      
      {/* Progress Track */}
      <div className={clsx(
        'w-full bg-slate-100 rounded-full overflow-hidden p-0.5 border',
        info.border,
        size === 'sm' ? 'h-2' : size === 'lg' ? 'h-3.5' : 'h-2.5'
      )}>
        <div
          className={clsx('h-full rounded-full transition-all duration-700 ease-out', info.bg)}
          style={{ width: `${Math.min(100, Math.max(0, confidence))}%` }}
        />
      </div>
    </div>
  );
};
