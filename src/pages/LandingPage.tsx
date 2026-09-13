import React from 'react';
import { Navbar } from '../components/common/Navbar';
import { PortalCard } from '../components/landing/PortalCard';
import { WhyAiMechanic } from '../components/landing/WhyAiMechanic';
import { AiCapabilities } from '../components/landing/AiCapabilities';
import { Footer } from '../components/landing/Footer';
import { Car, Wrench, Shield, Sparkles, CheckCircle, ArrowDown } from 'lucide-react';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-transparent antialiased overflow-x-hidden">
      {/* Top Public Navigation */}
      <Navbar />

      {/* Hero Section with 3 Distinct Portal Cards */}
      <section id="portals" className="pt-12 pb-20 px-4 sm:px-8 lg:px-12 max-w-[1440px] mx-auto w-full">
        {/* Hero Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 bg-white/85 backdrop-blur-xs p-8 sm:p-10 rounded-3xl border border-white/70 shadow-xs">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-lightSky border border-brand-sky/30 text-brand-navy text-xs font-semibold mb-6 shadow-xs animate-soft-pulse">
            <Sparkles size={14} className="text-brand-skyHover" />
            <span>Intelligent Vehicle Diagnosis & Service Platform</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-brand-navy tracking-tight leading-[1.15] mb-6">
            Understand your vehicle. <br />
            <span className="text-brand-skyHover">Service it smarter.</span>
          </h1>

          <p className="text-base sm:text-lg text-brand-slate max-w-2xl mx-auto leading-relaxed">
            DriveIQ delivers multi-modal vehicle diagnosis, transparent repair cost estimations, verified mechanic discovery, and digital workshop workflow management.
          </p>
        </div>

        {/* 3 Portal Cards with Custom Portal Accents */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          
          {/* 1. Vehicle Owner Portal (Sky Blue Accent) */}
          <PortalCard
            role="owner"
            icon={<Car size={28} className="stroke-[2.2]" />}
            title="VEHICLE OWNER"
            badgeText="Owner Portal"
            themeNote="Friendly + Intelligent + Trustworthy"
            loginPath="/owner/login"
            ctaText="Enter Owner Portal →"
            recommended={true}
            features={[
              'AI Vehicle Diagnosis (Text, Image & Audio)',
              'Image-based component inspection',
              'Transparent repair cost estimation',
              'Trusted local mechanic discovery',
              'Digital service history records',
              'Smart maintenance interval alerts',
            ]}
          />

          {/* 2. Mechanic Portal (Teal / Cyan Accent) */}
          <PortalCard
            role="mechanic"
            icon={<Wrench size={28} className="stroke-[2.2]" />}
            title="MECHANIC"
            badgeText="Workshop Portal"
            themeNote="Technical + Professional + Workshop-Oriented"
            loginPath="/mechanic/login"
            ctaText="Enter Mechanic Portal →"
            recommended={false}
            features={[
              'Incoming customer service requests',
              'AI preliminary symptom assessments',
              'Active bay repair job management',
              'Customer vehicle fleet records',
              'Workshop parts inventory tracking',
              'Digital repair reports & invoices',
            ]}
          />

          {/* 3. Admin Portal (Indigo / Violet Accent) */}
          <PortalCard
            role="admin"
            icon={<Shield size={28} className="stroke-[2.2]" />}
            title="ADMIN"
            badgeText="Platform Portal"
            themeNote="Control + Analytics + Platform Management"
            loginPath="/admin/login"
            ctaText="Enter Admin Portal →"
            recommended={false}
            features={[
              'Real-time platform telemetry & analytics',
              'User & vehicle registry management',
              'Workshop & mechanic credential verification',
              'Vehicle failure category metrics',
              'Multi-modal diagnosis accuracy audits',
              'Platform activity monitoring & logs',
            ]}
          />
        </div>

        {/* Trust & AI Decision Support Banner */}
        <div className="mt-14 max-w-3xl mx-auto p-4 rounded-2xl bg-white border border-brand-border shadow-soft flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-brand-slate">
          <div className="flex items-center gap-2 font-medium">
            <CheckCircle size={16} className="text-emerald-500 shrink-0" />
            <span>DriveIQ Decision Support System · Professional mechanic verification recommended</span>
          </div>
          <a
            href="#why-driveiq"
            className="text-brand-sky font-semibold flex items-center gap-1 hover:underline shrink-0"
          >
            Explore Platform Features
            <ArrowDown size={14} />
          </a>
        </div>
      </section>

      {/* Why DriveIQ Section */}
      <WhyAiMechanic />

      {/* AI Capabilities Section */}
      <AiCapabilities />

      {/* Public Footer */}
      <Footer />
    </div>
  );
};
