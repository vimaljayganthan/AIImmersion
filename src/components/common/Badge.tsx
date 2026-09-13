import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'sky' | 'success' | 'warning' | 'danger' | 'neutral' | 'purple' | 'teal' | 'indigo';
  size?: 'sm' | 'md';
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  className,
  variant = 'sky',
  size = 'sm',
  dot = false,
  ...props
}) => {
  const sizeStyles = {
    sm: 'text-[11px] px-2.5 py-0.5 font-medium',
    md: 'text-xs px-3 py-1 font-semibold',
  };

  const variantStyles = {
    sky: 'bg-brand-lightSky text-brand-skyHover border border-sky-200/70',
    success: 'bg-emerald-50 text-emerald-700 border border-emerald-200/70',
    warning: 'bg-amber-50 text-amber-700 border border-amber-200/70',
    danger: 'bg-rose-50 text-rose-700 border border-rose-200/70',
    neutral: 'bg-slate-100 text-slate-700 border border-slate-200/70',
    purple: 'bg-purple-50 text-purple-700 border border-purple-200/70',
    teal: 'bg-teal-50 text-teal-700 border border-teal-200/70',
    indigo: 'bg-indigo-50 text-indigo-700 border border-indigo-200/70',
  };

  const dotColors = {
    sky: 'bg-brand-sky',
    success: 'bg-emerald-500',
    warning: 'bg-amber-500',
    danger: 'bg-rose-500',
    neutral: 'bg-slate-400',
    purple: 'bg-purple-500',
    teal: 'bg-teal-500',
    indigo: 'bg-indigo-500',
  };

  return (
    <span
      className={twMerge(
        clsx(
          'inline-flex items-center gap-1.5 rounded-full tracking-wide',
          sizeStyles[size],
          variantStyles[variant],
          className
        )
      )}
      {...props}
    >
      {dot && <span className={clsx('w-1.5 h-1.5 rounded-full', dotColors[variant])} />}
      {children}
    </span>
  );
};
