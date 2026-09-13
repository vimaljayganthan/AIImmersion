import React from 'react';
import { Outlet } from 'react-router-dom';
import { GlobalNavbar } from '../components/common/GlobalNavbar';
import { AutoSenseLogo } from '../components/common/AutoSenseLogo';

export const DashboardLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-transparent flex flex-col antialiased">
      {/* Global Horizontal Sticky Navbar (Rendered ONCE) */}
      <GlobalNavbar />

      {/* Main Content Area - Renders exactly ONE child route via Outlet on a clean solid content surface (Layer 2) */}
      <main className="flex-1 w-full max-w-[1440px] mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8 animate-in fade-in duration-150">
        <div className="bg-slate-50/95 border border-slate-200/90 shadow-sm rounded-3xl p-5 sm:p-7 lg:p-9 min-h-[calc(100vh-160px)]">
          <Outlet />
        </div>
      </main>

      {/* Subtle DriveIQ Platform Baseline Footer (Rendered ONCE) */}
      <footer className="w-full border-t border-slate-200/80 py-5 bg-white text-xs text-slate-500 shadow-2xs">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <AutoSenseLogo size="sm" showSubtitle={false} />
            <span className="text-slate-300">·</span>
            <span className="text-slate-600 font-medium">Intelligent Vehicle Diagnostics & Service Platform</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400 text-[11px]">
            <span>Active Session Protected</span>
            <span className="text-slate-300">·</span>
            <span>Diagnostic Engine v2.4</span>
            <span className="text-slate-300">·</span>
            <span>© 2026 DriveIQ</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
