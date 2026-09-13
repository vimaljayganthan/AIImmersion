import React from 'react';
import {
  FileText,
  Image,
  Volume2,
  DollarSign,
  TrendingUp,
  Clock,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

export const AiCapabilities: React.FC = () => {
  const capabilities = [
    {
      icon: FileText,
      title: 'Text Diagnosis',
      badge: 'Natural Language',
      description:
        'Describe symptoms in plain English. Answer targeted dynamic questions about frequency, startup, warning lights, or smells.',
    },
    {
      icon: Image,
      title: 'Image Analysis',
      badge: 'Computer Vision',
      description:
        'Upload photos of engine bays, tyre tread wear, fluid leakages, or illuminated dashboard icons for visual defect detection.',
    },
    {
      icon: Volume2,
      title: 'Audio Analysis',
      badge: 'Acoustic AI',
      description:
        'Record unusual knocking, squealing, or clicking startup noises. Waveform spectral analysis pinpoints mechanical rhythm anomalies.',
    },
    {
      icon: DollarSign,
      title: 'Repair Cost Estimation',
      badge: 'Market Pricing',
      description:
        'Transparent estimates comparing OEM part prices, average labour hours, and diagnostic inspection fees across your locality.',
    },
    {
      icon: TrendingUp,
      title: 'Maintenance Prediction',
      badge: 'Proactive Care',
      description:
        'Real-time tracking of mileage and wear cycles. Predictive alerts inform you when brake pads, fluids, or spark plugs require inspection.',
    },
    {
      icon: Clock,
      title: 'Digital Service History',
      badge: 'Immutable Log',
      description:
        'A permanent digital record of every diagnosis, parts replaced, verified mechanic notes, and maintenance milestone for your vehicle.',
    },
  ];

  const workflowSteps = [
    'Vehicle Problem',
    'AI Analysis',
    'Probable Diagnosis',
    'AI Confidence',
    'Diagnostic Evidence',
    'Recommended Action',
    'Estimated Repair Cost',
    'Find Suitable Mechanic',
    'Book Service',
    'Track Repair',
    'Service History',
    'Future Maintenance',
  ];

  return (
    <section id="ai-capabilities" className="py-20 bg-slate-50/95 border-y border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/80 shadow-xs">
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-brand-lightSky text-brand-skyHover uppercase tracking-wider border border-brand-sky/20">
            Intelligent Platform Stack
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-navy mt-4 mb-4 tracking-tight">
            AI-Powered Vehicle Assistance
          </h2>
          <p className="text-base text-brand-slate leading-relaxed">
            Multi-modal automotive intelligence designed as a decision-support assistant for vehicle owners and professional mechanics.
          </p>
        </div>

        {/* 6 Capabilities Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {capabilities.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl p-6 border border-brand-border shadow-soft card-hover-effect flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-11 h-11 rounded-xl bg-brand-veryLight text-brand-skyHover border border-brand-lightSky flex items-center justify-center">
                      <Icon size={22} className="stroke-[2.2]" />
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-lightSky text-brand-skyHover">
                      {item.badge}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-brand-navy mb-2">{item.title}</h3>
                  <p className="text-xs text-brand-slate leading-relaxed">{item.description}</p>
                </div>

                <div className="mt-5 pt-3 border-t border-brand-border/60 flex items-center gap-1.5 text-[11px] text-brand-slate font-medium">
                  <CheckCircle2 size={13} className="text-brand-success shrink-0" />
                  <span>Interactive diagnostic workflow</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Product Workflow Stream Banner */}
        <div className="bg-white rounded-3xl p-8 border border-brand-border shadow-card">
          <div className="flex items-center gap-2 mb-3">
            <ShieldCheck size={20} className="text-brand-sky" />
            <h4 className="text-sm font-bold text-brand-navy uppercase tracking-wider">
              End-to-End Decision Support Lifecycle
            </h4>
          </div>
          <p className="text-xs text-brand-slate mb-6">
            From preliminary symptom identification to post-service digital records, each step empowers you with evidence and clarity:
          </p>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {workflowSteps.map((step, idx) => (
              <React.Fragment key={idx}>
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-brand-veryLight border border-brand-lightSky text-xs font-semibold text-brand-navy shadow-xs">
                  <span className="w-5 h-5 rounded-full bg-brand-lightSky text-brand-skyHover text-[10px] flex items-center justify-center font-bold">
                    {idx + 1}
                  </span>
                  <span>{step}</span>
                </div>
                {idx < workflowSteps.length - 1 && (
                  <ArrowRight size={14} className="text-slate-300 shrink-0 hidden sm:block" />
                )}
              </React.Fragment>
            ))}
          </div>

          <div className="mt-6 p-4 rounded-xl bg-sky-50/70 border border-sky-100 flex items-start gap-3">
            <div className="w-2 h-2 rounded-full bg-brand-sky mt-1.5 shrink-0" />
            <p className="text-xs text-brand-slate leading-relaxed">
              <strong className="text-brand-navy">Decision-Support Principle:</strong> DriveIQ provides preliminary assessments and diagnostic evidence. Professional mechanics perform physical verifications, repairs, and service completions.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
