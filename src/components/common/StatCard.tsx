import React from 'react';
import { clsx } from 'clsx';
import { Card } from './Card';

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  subtext?: string;
  trend?: {
    value: string;
    positive?: boolean;
  };
  highlightColor?: 'sky' | 'emerald' | 'amber' | 'purple' | 'slate';
  onClick?: () => void;
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  icon,
  label,
  value,
  subtext,
  trend,
  highlightColor = 'sky',
  onClick,
  className = '',
}) => {
  const iconColorStyles = {
    sky: 'bg-brand-lightSky text-brand-skyHover border-sky-100',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    amber: 'bg-amber-50 text-amber-600 border-amber-100',
    purple: 'bg-purple-50 text-purple-600 border-purple-100',
    slate: 'bg-slate-100 text-slate-600 border-slate-200',
  };

  return (
    <Card
      hoverEffect={!!onClick}
      padding="sm"
      onClick={onClick}
      className={clsx(
        'p-5 transition flex flex-col justify-between',
        onClick && 'cursor-pointer hover:border-brand-sky/40',
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-semibold text-brand-slate uppercase tracking-wider">{label}</p>
          <p className="text-2xl font-bold text-brand-navy tracking-tight">{value}</p>
        </div>
        <div
          className={clsx(
            'w-11 h-11 rounded-xl flex items-center justify-center border transition',
            iconColorStyles[highlightColor]
          )}
        >
          {icon}
        </div>
      </div>

      {(subtext || trend) && (
        <div className="mt-4 pt-3 border-t border-brand-border/60 flex items-center justify-between text-xs">
          {subtext && <span className="text-brand-slate font-medium">{subtext}</span>}
          {trend && (
            <span
              className={clsx(
                'font-semibold px-2 py-0.5 rounded-full',
                trend.positive ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-700'
              )}
            >
              {trend.value}
            </span>
          )}
        </div>
      )}
    </Card>
  );
};
