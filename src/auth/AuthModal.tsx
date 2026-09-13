import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import { UserRole } from '../types';
import { X, Car, Wrench, Shield, CheckCircle2, ArrowRight } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, closeAuthModal, loginAs, loginWithCredentials } = useAuth();
  const [activeTab, setActiveTab] = useState<'demo' | 'email'>('demo');
  const [selectedRole, setSelectedRole] = useState<UserRole>('owner');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  if (!isAuthModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      loginWithCredentials(email, selectedRole);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-brand-navy/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-lg border border-brand-border shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-brand-border bg-brand-veryLight/50">
          <div>
            <h3 className="text-xl font-bold text-brand-navy">Sign In to DriveIQ</h3>
            <p className="text-xs text-brand-slate mt-0.5">Select a demo portal account or sign in with email</p>
          </div>
          <button
            onClick={closeAuthModal}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-brand-slate hover:text-brand-navy hover:bg-slate-100 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {/* Tab Switcher */}
          <div className="flex p-1 bg-slate-100 rounded-xl mb-6">
            <button
              onClick={() => setActiveTab('demo')}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition ${
                activeTab === 'demo'
                  ? 'bg-white text-brand-navy shadow-sm'
                  : 'text-brand-slate hover:text-brand-navy'
              }`}
            >
              1-Click Demo Portals
            </button>
            <button
              onClick={() => setActiveTab('email')}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition ${
                activeTab === 'email'
                  ? 'bg-white text-brand-navy shadow-sm'
                  : 'text-brand-slate hover:text-brand-navy'
              }`}
            >
              Email Sign In / Up
            </button>
          </div>

          {activeTab === 'demo' ? (
            <div className="space-y-3">
              {/* Owner Option */}
              <div
                onClick={() => loginAs('owner')}
                className="p-4 rounded-xl border border-brand-border hover:border-brand-sky hover:bg-brand-veryLight cursor-pointer transition flex items-center justify-between group"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-xl bg-sky-50 text-brand-sky border border-sky-100 flex items-center justify-center group-hover:bg-brand-sky group-hover:text-white transition">
                    <Car size={22} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-brand-navy text-sm">Vehicle Owner</h4>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-brand-lightSky text-brand-skyHover font-medium">Demo</span>
                    </div>
                    <p className="text-xs text-brand-slate">Alex Sharma · Yamaha R15 V4 & Hyundai i20</p>
                  </div>
                </div>
                <ArrowRight size={18} className="text-brand-slate group-hover:text-brand-sky group-hover:translate-x-1 transition" />
              </div>

              {/* Mechanic Option */}
              <div
                onClick={() => loginAs('mechanic')}
                className="p-4 rounded-xl border border-brand-border hover:border-brand-sky hover:bg-brand-veryLight cursor-pointer transition flex items-center justify-between group"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-xl bg-sky-50 text-brand-sky border border-sky-100 flex items-center justify-center group-hover:bg-brand-sky group-hover:text-white transition">
                    <Wrench size={22} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-brand-navy text-sm">Service Mechanic</h4>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-brand-lightSky text-brand-skyHover font-medium">Demo</span>
                    </div>
                    <p className="text-xs text-brand-slate">Rajesh Kumar · Kumar Motors (4.8 ★)</p>
                  </div>
                </div>
                <ArrowRight size={18} className="text-brand-slate group-hover:text-brand-sky group-hover:translate-x-1 transition" />
              </div>

              {/* Admin Option */}
              <div
                onClick={() => loginAs('admin')}
                className="p-4 rounded-xl border border-brand-border hover:border-brand-sky hover:bg-brand-veryLight cursor-pointer transition flex items-center justify-between group"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-xl bg-sky-50 text-brand-sky border border-sky-100 flex items-center justify-center group-hover:bg-brand-sky group-hover:text-white transition">
                    <Shield size={22} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-brand-navy text-sm">Platform Admin</h4>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-brand-lightSky text-brand-skyHover font-medium">Demo</span>
                    </div>
                    <p className="text-xs text-brand-slate">Dr. Sarah Chen · Platform Oversight</p>
                  </div>
                </div>
                <ArrowRight size={18} className="text-brand-slate group-hover:text-brand-sky group-hover:translate-x-1 transition" />
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-brand-slate uppercase tracking-wider mb-2">
                  Select Account Role
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['owner', 'mechanic', 'admin'] as UserRole[]).map((role) => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => setSelectedRole(role)}
                      className={`py-2 px-3 rounded-lg text-xs font-medium border text-center capitalize transition ${
                        selectedRole === role
                          ? 'border-brand-sky bg-brand-lightSky text-brand-navy font-semibold'
                          : 'border-brand-border text-brand-slate hover:bg-slate-50'
                      }`}
                    >
                      {role}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-brand-navy mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border text-sm text-brand-navy placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-sky/20 focus:border-brand-sky"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-brand-navy mb-1">Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border text-sm text-brand-navy placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-sky/20 focus:border-brand-sky"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-brand-sky hover:bg-brand-skyHover text-white font-medium rounded-xl text-sm transition shadow-sm"
              >
                Sign In to {selectedRole.toUpperCase()} Portal
              </button>
            </form>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-brand-veryLight/50 border-t border-brand-border text-center">
          <p className="text-[11px] text-brand-slate flex items-center justify-center gap-1.5">
            <CheckCircle2 size={13} className="text-brand-success" />
            Zero configuration required · Instant sandbox access
          </p>
        </div>
      </div>
    </div>
  );
};
