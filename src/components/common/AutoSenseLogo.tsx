import React from 'react';

interface DriveIQLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
  portalBadge?: string;
  portalAccent?: 'sky' | 'teal' | 'indigo' | 'slate';
  className?: string;
  variant?: 'emblem' | 'full' | 'compact';
}

export const DriveIQLogo: React.FC<DriveIQLogoProps> = ({
  size = 'md',
  showSubtitle = false,
  portalBadge,
  portalAccent = 'sky',
  className = '',
}) => {
  const iconSizes = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  const textSizes = {
    xs: 'text-sm tracking-tight',
    sm: 'text-base tracking-tight',
    md: 'text-lg sm:text-xl tracking-tight',
    lg: 'text-2xl tracking-tight',
    xl: 'text-3xl tracking-tight',
  };

  const badgeColors = {
    sky: 'bg-sky-100 text-sky-700 border-sky-200',
    teal: 'bg-teal-100 text-teal-700 border-teal-200',
    indigo: 'bg-indigo-100 text-indigo-700 border-indigo-200',
    slate: 'bg-slate-100 text-slate-700 border-slate-200',
  };

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* DriveIQ High-Res Car Pulse + Circuit Emblem */}
      <div
        className={`${iconSizes[size]} relative shrink-0 flex items-center justify-center rounded-xl bg-gradient-to-b from-slate-900 to-slate-950 p-1 shadow-sm border border-slate-800/80 group-hover:scale-105 transition-transform duration-200`}
      >
        <img
          src="/driveiq-emblem-transparent.png"
          alt="DriveIQ Logo Emblem"
          className="w-full h-full object-contain filter drop-shadow-[0_1px_4px_rgba(14,165,233,0.35)]"
          loading="eager"
        />
      </div>

      <div className="flex flex-col justify-center">
        <div className="flex items-center gap-1.5">
          <span
            className={`font-black text-slate-900 leading-none ${textSizes[size]}`}
            style={{ fontFamily: "'Manrope', 'Inter', sans-serif" }}
          >
            Drive<span className="text-sky-500 font-extrabold">IQ</span>
          </span>

          {portalBadge && (
            <span
              className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md uppercase tracking-wider border shadow-xs ${badgeColors[portalAccent]}`}
            >
              {portalBadge}
            </span>
          )}
        </div>

        {showSubtitle && (
          <p className="text-[10px] font-semibold text-slate-500 tracking-normal leading-tight mt-0.5">
            Diagnostics &amp; Service Platform
          </p>
        )}
      </div>
    </div>
  );
};

// Aliased export to preserve backwards compatibility across all codebase imports
export const AutoSenseLogo = DriveIQLogo;
export default DriveIQLogo;

