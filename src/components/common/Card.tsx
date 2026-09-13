import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverEffect?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  borderAccent?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  hoverEffect = false,
  padding = 'md',
  borderAccent = false,
  ...props
}) => {
  const paddingStyles = {
    none: 'p-0',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  return (
    <div
      className={twMerge(
        clsx(
          'bg-white rounded-2xl border border-brand-border shadow-soft transition-all duration-200',
          hoverEffect && 'card-hover-effect hover:border-brand-sky/40',
          borderAccent && 'border-l-4 border-l-brand-sky',
          paddingStyles[padding],
          className
        )
      )}
      {...props}
    >
      {children}
    </div>
  );
};
