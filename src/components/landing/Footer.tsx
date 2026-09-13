import React from 'react';
import { Link } from 'react-router-dom';
import { AutoSenseLogo } from '../common/AutoSenseLogo';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-brand-border/80 pt-16 pb-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 mb-12">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="inline-block">
              <AutoSenseLogo size="md" showSubtitle={false} />
            </Link>
            <p className="text-xs text-brand-slate max-w-sm leading-relaxed">
              Intelligent Vehicle Diagnostics &amp; Service Platform. DriveIQ combines multi-modal acoustic, visual, and telemetry diagnostics to empower owners and mechanics.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Multi-Modal Diagnostic Engine v2.4 Active</span>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="text-xs font-bold text-brand-navy uppercase tracking-wider mb-4">
              Product
            </h4>
            <ul className="space-y-2.5 text-xs text-brand-slate">
              <li>
                <Link to="/owner/login" className="hover:text-brand-sky transition">
                  Vehicle Owner Portal
                </Link>
              </li>
              <li>
                <Link to="/mechanic/login" className="hover:text-brand-sky transition">
                  Mechanic Pro Portal
                </Link>
              </li>
              <li>
                <Link to="/admin/login" className="hover:text-brand-sky transition">
                  Platform Admin
                </Link>
              </li>
              <li>
                <a href="#ai-capabilities" className="hover:text-brand-sky transition">
                  AI Diagnosis Engine
                </a>
              </li>
            </ul>
          </div>

          {/* Features & Company */}
          <div>
            <h4 className="text-xs font-bold text-brand-navy uppercase tracking-wider mb-4">
              Features
            </h4>
            <ul className="space-y-2.5 text-xs text-brand-slate">
              <li>
                <a href="#why-driveiq" className="hover:text-brand-sky transition">
                  Decision Support
                </a>
              </li>
              <li>
                <a href="#ai-capabilities" className="hover:text-brand-sky transition">
                  Sound Waveform Analysis
                </a>
              </li>
              <li>
                <a href="#ai-capabilities" className="hover:text-brand-sky transition">
                  Cost Estimation
                </a>
              </li>
              <li>
                <a href="#portals" className="hover:text-brand-sky transition">
                  Mechanic Network
                </a>
              </li>
            </ul>
          </div>

          {/* Legal & Compliance */}
          <div>
            <h4 className="text-xs font-bold text-brand-navy uppercase tracking-wider mb-4">
              Legal
            </h4>
            <ul className="space-y-2.5 text-xs text-brand-slate">
              <li>
                <span className="cursor-pointer hover:text-brand-sky transition">
                  Privacy Policy
                </span>
              </li>
              <li>
                <span className="cursor-pointer hover:text-brand-sky transition">
                  Terms of Service
                </span>
              </li>
              <li>
                <span className="cursor-pointer hover:text-brand-sky transition">
                  Diagnostic Disclaimers
                </span>
              </li>
              <li>
                <span className="cursor-pointer hover:text-brand-sky transition">
                  Security &amp; Data Safety
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-brand-border/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© 2026 DriveIQ. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>Understand your vehicle. Service it smarter.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
