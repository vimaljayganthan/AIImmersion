import React from 'react';
import { Button } from './Button';

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  className = '',
}) => {
  return (
    <div className={`text-center py-12 px-4 rounded-2xl bg-white border border-brand-border shadow-soft ${className}`}>
      <div className="w-16 h-16 rounded-2xl bg-brand-lightSky text-brand-skyHover flex items-center justify-center mx-auto mb-4 border border-sky-100">
        {icon}
      </div>
      <h3 className="text-base font-bold text-brand-navy mb-1">{title}</h3>
      <p className="text-xs text-brand-slate max-w-sm mx-auto mb-6">{description}</p>
      {actionLabel && onAction && (
        <Button size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
