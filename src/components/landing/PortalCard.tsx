import React from 'react';
import { useNavigate } from 'react-router-dom';
import { UserRole } from '../../types';
import { ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';

interface PortalCardProps {
  role: UserRole;
  icon: React.ReactNode;
  title: string;
  badgeText: string;
  themeNote: string;
  loginPath: string;
  ctaText: string;
  features: string[];
  recommended?: boolean;
}

export const PortalCard: React.FC<PortalCardProps> = ({
  role,
  icon,
  title,
  badgeText,
  themeNote,
  loginPath,
  ctaText,
  features,
  recommended = false,
}) => {
  const navigate = useNavigate();

  // Portal-specific theme styling
  const themeStyles = {
    owner: {
      cardBg: 'bg-gradient-to-b from-white via-white to-sky-50/50',
      border: 'border-sky-200 hover:border-brand-sky',
      ring: 'ring-brand-sky/20',
      iconBg: 'bg-sky-50 border-sky-200 text-brand-sky group-hover:bg-sky-100',
      badgeBg: 'bg-sky-100 text-sky-800 border-sky-200',
      bulletDot: 'bg-brand-sky',
      btnBg: 'bg-brand-sky hover:bg-brand-skyHover text-white shadow-md shadow-sky-400/20',
    },
    mechanic: {
      cardBg: 'bg-gradient-to-b from-white via-white to-teal-50/40',
      border: 'border-teal-200 hover:border-teal-400',
      ring: 'ring-teal-400/20',
      iconBg: 'bg-teal-50 border-teal-200 text-teal-600 group-hover:bg-teal-100',
      badgeBg: 'bg-teal-100 text-teal-800 border-teal-200',
      bulletDot: 'bg-teal-500',
      btnBg: 'bg-teal-500 hover:bg-teal-600 text-white shadow-md shadow-teal-500/20',
    },
    admin: {
      cardBg: 'bg-gradient-to-b from-white via-white to-indigo-50/40',
      border: 'border-indigo-200 hover:border-indigo-400',
      ring: 'ring-indigo-400/20',
      iconBg: 'bg-indigo-50 border-indigo-200 text-indigo-600 group-hover:bg-indigo-100',
      badgeBg: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      bulletDot: 'bg-indigo-500',
      btnBg: 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20',
    },
  }[role];

  const handleEnter = () => {
    navigate(loginPath);
  };

  return (
    <div
      onClick={handleEnter}
      className={`group relative rounded-3xl p-7 sm:p-8 border transition-all duration-300 cursor-pointer flex flex-col justify-between hover:-translate-y-1.5 shadow-soft hover:shadow-card-hover ${themeStyles.cardBg} ${themeStyles.border} ${
        recommended ? 'ring-2 ' + themeStyles.ring : ''
      }`}
    >
      {recommended && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-brand-sky text-white px-3.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide flex items-center gap-1 shadow-sm">
          <Sparkles size={11} />
          Primary Entry
        </div>
      )}

      <div>
        {/* Portal Icon */}
        <div
          className={`w-14 h-14 rounded-2xl border flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-105 ${themeStyles.iconBg}`}
        >
          {icon}
        </div>

        {/* Portal Title & Badge */}
        <div className="flex items-center justify-between mb-1.5">
          <h3 className="text-lg font-black text-brand-navy tracking-tight group-hover:text-brand-navy transition">
            {title}
          </h3>
          <span
            className={`text-[10px] font-bold px-2.5 py-0.5 rounded-md border uppercase tracking-wider ${themeStyles.badgeBg}`}
          >
            {badgeText}
          </span>
        </div>

        {/* Theme Tone Note */}
        <p className="text-[11px] text-brand-slate font-medium mb-5">
          {themeNote}
        </p>

        {/* Feature List */}
        <ul className="space-y-2.5 mb-8 border-t border-brand-border/60 pt-4">
          {features.map((feat, idx) => (
            <li key={idx} className="flex items-start gap-2 text-xs text-brand-slate leading-snug">
              <CheckCircle2 size={14} className={`shrink-0 mt-0.5 ${role === 'owner' ? 'text-brand-sky' : role === 'mechanic' ? 'text-teal-500' : 'text-indigo-500'}`} />
              <span>{feat}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Enter Action Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleEnter();
        }}
        className={`w-full py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition duration-200 cursor-pointer ${themeStyles.btnBg}`}
      >
        <span>{ctaText}</span>
        <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-200" />
      </button>
    </div>
  );
};
