import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import { AutoSenseLogo } from './AutoSenseLogo';
import { ShieldCheck, Car, Wrench, LogIn, User as UserIcon } from 'lucide-react';
import { Button } from './Button';

export const Navbar: React.FC = () => {
  const { user, currentRole } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-brand-border/80 shadow-xs">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 h-18 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center group">
          <AutoSenseLogo size="md" showSubtitle={true} />
        </Link>

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-brand-slate">
          <a href="#portals" className="hover:text-brand-sky transition">
            Portals
          </a>
          <a href="#why-driveiq" className="hover:text-brand-sky transition">
            Why DriveIQ
          </a>
          <a href="#ai-capabilities" className="hover:text-brand-sky transition">
            AI Capabilities
          </a>
          <a href="#architecture" className="hover:text-brand-sky transition">
            Decision Support
          </a>
        </nav>

        {/* Right Action / Auth */}
        <div className="flex items-center gap-3">
          {user && currentRole ? (
            <button
              onClick={() => navigate(`/${currentRole}`)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-brand-sky/40 bg-brand-lightSky text-brand-navy text-xs font-bold hover:bg-sky-100 transition shadow-xs cursor-pointer"
            >
              {currentRole === 'owner' && <Car size={15} className="text-brand-sky" />}
              {currentRole === 'mechanic' && <Wrench size={15} className="text-teal-600" />}
              {currentRole === 'admin' && <ShieldCheck size={15} className="text-indigo-600" />}
              <span className="capitalize">{currentRole} Dashboard</span>
            </button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/owner/login')}
              leftIcon={<LogIn size={15} />}
            >
              Sign In
            </Button>
          )}

          <Button
            size="sm"
            onClick={() => {
              const el = document.getElementById('portals');
              if (el) {
                el.scrollIntoView({ behavior: 'smooth' });
              } else {
                navigate('/');
              }
            }}
          >
            Enter Portals
          </Button>
        </div>
      </div>
    </header>
  );
};
