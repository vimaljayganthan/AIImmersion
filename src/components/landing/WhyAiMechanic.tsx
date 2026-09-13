import React from 'react';
import { Sparkles, HelpCircle, Calculator, UserCheck } from 'lucide-react';

export const WhyAiMechanic: React.FC = () => {
  const features = [
    {
      icon: Sparkles,
      title: 'Diagnose',
      subtitle: 'Understand Possible Problems',
      description:
        'Input symptoms via text, component photo, or engine sound waveforms. DriveIQ cross-references vehicle telemetry and failure patterns to identify probable causes with clear confidence scores.',
      highlight: 'AI Confidence & Probable Causes',
    },
    {
      icon: HelpCircle,
      title: 'Understand',
      subtitle: 'Explainable Diagnostic Evidence',
      description:
        'No mysterious black-box answers. Receive structured diagnostic evidence and clear automotive reasoning explaining why each cause was identified and what should be verified first.',
      highlight: 'Transparent Reasoning & Evidence',
    },
    {
      icon: Calculator,
      title: 'Estimate',
      subtitle: 'Accurate Repair Cost Ranges',
      description:
        'Get transparent, realistic estimates broken down into OEM parts, certified labour, and diagnostic inspection before ever stepping into a garage.',
      highlight: 'Parts + Labour Breakdown',
    },
    {
      icon: UserCheck,
      title: 'Connect',
      subtitle: 'Find & Book Trusted Mechanics',
      description:
        'Seamlessly share DriveIQ diagnostic reports with vetted local mechanics, schedule appointments, and eliminate redundant repair guesswork.',
      highlight: 'Vetted Workshops & Direct Booking',
    },
  ];

  return (
    <section id="why-driveiq" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-16 bg-white/90 p-8 sm:p-10 rounded-3xl border border-white/70 shadow-xs">
        <span className="text-xs font-bold px-3 py-1 rounded-full bg-brand-lightSky text-brand-skyHover uppercase tracking-wider">
          Decision Support System
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-navy mt-4 mb-4 tracking-tight">
          Why DriveIQ?
        </h2>
        <p className="text-base text-brand-slate leading-relaxed">
          Vehicle repairs shouldn't feel like a shot in the dark. DriveIQ bridges the knowledge gap between vehicle owners and repair workshops.
        </p>
      </div>

      {/* 4 Feature Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="bg-white rounded-3xl p-6 border border-brand-border shadow-card hover:shadow-card-hover hover:border-brand-sky/60 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-brand-lightSky text-brand-skyHover flex items-center justify-center mb-5">
                  <Icon size={22} className="stroke-[2.2]" />
                </div>
                <span className="text-[11px] font-bold text-brand-sky uppercase tracking-wider block mb-1">
                  {item.title}
                </span>
                <h3 className="text-base font-bold text-brand-navy mb-2.5">
                  {item.subtitle}
                </h3>
                <p className="text-xs text-brand-slate leading-relaxed mb-6">
                  {item.description}
                </p>
              </div>

              <div className="pt-4 border-t border-brand-border/60">
                <span className="text-[11px] font-semibold text-brand-skyHover block">
                  ✓ {item.highlight}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
