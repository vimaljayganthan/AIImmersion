import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import { UserRole } from '../../types';
import { AutoSenseLogo } from '../../components/common/AutoSenseLogo';
import {
  Car,
  Wrench,
  Shield,
  ArrowRight,
  Sparkles,
  Lock,
  Mail,
  Eye,
  EyeOff,
  CheckCircle2,
  ArrowLeft,
  Info,
} from 'lucide-react';

interface PortalLoginPageProps {
  portalRole: UserRole;
}

export const PortalLoginPage: React.FC<PortalLoginPageProps> = ({ portalRole }) => {
  const { loginAs, loginWithCredentials: login } = useAuth();
  const navigate = useNavigate();

  const portalConfig = {
    owner: {
      title: 'Vehicle Owner Portal',
      subtitle: 'Sign in to access AI diagnoses, health reports & garage',
      defaultEmail: 'owner@driveiq.ai',
      accentColor: 'sky',
      btnBg: 'bg-brand-sky hover:bg-brand-skyHover text-white shadow-md shadow-sky-400/20',
      badgeBg: 'bg-sky-100 text-sky-700 border-sky-200',
      icon: Car,
      destination: '/owner',
      description: 'Intelligent vehicle diagnosis, cost estimates & trusted mechanic bookings.',
    },
    mechanic: {
      title: 'Mechanic Workshop Portal',
      subtitle: 'Sign in to manage repair requests, active jobs & digital reports',
      defaultEmail: 'mechanic@driveiq.ai',
      accentColor: 'teal',
      btnBg: 'bg-teal-500 hover:bg-teal-600 text-white shadow-md shadow-teal-500/20',
      badgeBg: 'bg-teal-100 text-teal-800 border-teal-200',
      icon: Wrench,
      destination: '/mechanic',
      description: 'Workshop service queue, preliminary AI verification & parts tracking.',
    },
    admin: {
      title: 'Platform Administration',
      subtitle: 'Sign in to monitor platform health, analytics & users',
      defaultEmail: 'admin@driveiq.ai',
      accentColor: 'indigo',
      btnBg: 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/20',
      badgeBg: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      icon: Shield,
      destination: '/admin',
      description: 'Platform metrics, AI diagnostic performance & system oversight.',
    },
  }[portalRole];

  const [email, setEmail] = useState(portalConfig.defaultEmail);
  const [password, setPassword] = useState('demo1234');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const IconComponent = portalConfig.icon;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    setIsLoading(true);
    setError(null);

    setTimeout(() => {
      login(email, portalRole);
      setIsLoading(false);
      navigate(portalConfig.destination);
    }, 400);
  };

  const handleQuickDemoFill = (role: UserRole) => {
    const map = {
      owner: 'owner@driveiq.ai',
      mechanic: 'mechanic@driveiq.ai',
      admin: 'admin@driveiq.ai',
    };
    setEmail(map[role]);
    setPassword('demo1234');
  };

  const handleQuickDemoLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      loginAs(portalRole);
      navigate(portalConfig.destination, { replace: true });
    }, 200);
  };

  return (
    <div className="min-h-screen bg-transparent flex flex-col justify-between p-4 sm:p-6 lg:p-8 relative antialiased">
      {/* Top Header Row with Back Button */}
      <div className="max-w-6xl w-full mx-auto flex items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-brand-slate hover:text-brand-navy px-3 py-1.5 rounded-xl border border-brand-border bg-white hover:bg-slate-50 transition shadow-xs"
        >
          <ArrowLeft size={14} />
          <span>Back to Portal Selection</span>
        </Link>

        <div className="hidden sm:flex items-center gap-1 text-[11px] font-medium text-slate-400">
          <span>DriveIQ OS v2.4</span>
          <span>·</span>
          <span>Secure Authentication</span>
        </div>
      </div>

      {/* Main Login Card Container */}
      <div className="max-w-md w-full mx-auto my-8">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-border shadow-card relative overflow-hidden">
          
          {/* Subtle Top Accent Strip */}
          <div
            className={`absolute top-0 left-0 right-0 h-1.5 ${
              portalRole === 'owner'
                ? 'bg-brand-sky'
                : portalRole === 'mechanic'
                ? 'bg-teal-500'
                : 'bg-indigo-600'
            }`}
          />

          {/* Brand Logo Header */}
          <div className="text-center mb-6">
            <div className="flex justify-center mb-3">
              <AutoSenseLogo
                size="md"
                portalBadge={portalConfig.title}
                portalAccent={portalConfig.accentColor as any}
              />
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-brand-navy tracking-tight">
              {portalConfig.title}
            </h1>
            <p className="text-xs text-brand-slate mt-1.5">
              {portalConfig.subtitle}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-2">
                <Info size={14} className="shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-brand-navy mb-1.5">
                Work / Account Email
              </label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@driveiq.ai"
                  required
                  className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl bg-slate-50/80 border border-brand-border focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-sky/20 focus:border-brand-sky transition text-brand-navy font-medium"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-brand-navy">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => alert('For development review, please use demo credentials or click 1-Click Demo Login.')}
                  className="text-[11px] text-brand-sky hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-10 py-2.5 text-xs rounded-xl bg-slate-50/80 border border-brand-border focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-sky/20 focus:border-brand-sky transition text-brand-navy font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-brand-navy"
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-brand-slate">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-brand-border text-brand-sky focus:ring-brand-sky/20 h-4 w-4"
                />
                <span>Remember this session</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${portalConfig.btnBg}`}
            >
              {isLoading ? (
                <span className="inline-flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Signing In...
                </span>
              ) : (
                <>
                  <span>Sign In to {portalConfig.title.split(' ')[0]}</span>
                  <ArrowRight size={15} />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-brand-border" />
            </div>
            <div className="relative flex justify-center text-[10px] uppercase tracking-wider font-bold">
              <span className="bg-white px-3 text-slate-400">Development Demo Mode</span>
            </div>
          </div>

          {/* 1-Click Demo Login Box */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-brand-border text-xs">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5 font-bold text-brand-navy text-[11px]">
                <Sparkles size={13} className="text-amber-500" />
                <span>DEMO CREDENTIALS</span>
              </div>
              <span className="text-[10px] text-slate-500 font-mono font-medium">Auto-configured</span>
            </div>

            <div className="space-y-1 text-[11px] text-brand-slate font-mono bg-white p-2 rounded-xl border border-brand-border mb-3">
              <div className="flex justify-between">
                <span className="text-slate-400">Email:</span>
                <span className="text-brand-navy font-semibold">{portalConfig.defaultEmail}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Password:</span>
                <span className="text-brand-navy font-semibold">Password123</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleQuickDemoLogin}
              className="w-full py-2 px-3 rounded-xl bg-white border border-brand-border hover:bg-slate-50 hover:border-brand-sky/40 text-brand-navy text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-xs"
            >
              <CheckCircle2 size={14} className="text-emerald-500" />
              <span>1-Click Demo Login as {portalConfig.title.split(' ')[0]}</span>
            </button>
          </div>

          {/* Bottom Switch Note */}
          <div className="mt-6 text-center text-xs text-brand-slate">
            <span>Need a different role? </span>
            <Link to="/" className="text-brand-sky font-semibold hover:underline">
              Choose another portal
            </Link>
          </div>
        </div>
      </div>

      {/* Footer copyright */}
      <div className="text-center text-xs text-brand-slate py-2">
        <span className="inline-block bg-white/80 backdrop-blur-xs px-4 py-1.5 rounded-full border border-white/60 shadow-xs">
          © 2026 DriveIQ. All rights reserved. Intelligent Vehicle Diagnostics &amp; Service Platform.
        </span>
      </div>
    </div>
  );
};
