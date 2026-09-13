import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { UserRole } from '../types';
import { ShieldAlert, ArrowRight } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRole: UserRole;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRole }) => {
  const { user, currentRole, logout } = useAuth();
  const location = useLocation();

  // 1. If unauthenticated, redirect to the specific portal login
  if (!user || !currentRole) {
    return <Navigate to={`/${allowedRole}/login`} state={{ from: location }} replace />;
  }

  // 2. If logged in with another role, enforce strict role isolation
  if (currentRole !== allowedRole) {
    return (
      <div className="min-h-screen bg-[#F0F9FF] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200 shadow-xl text-center">
          <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-amber-500 border border-amber-200">
            <ShieldAlert size={28} />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Access Restricted</h2>
          <p className="text-xs text-slate-600 mb-6 leading-relaxed">
            You are currently authenticated as a <strong className="text-slate-900 capitalize">{currentRole}</strong>.
            This section is restricted to authorized <strong className="text-sky-700 capitalize">{allowedRole}</strong> accounts.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => window.location.href = `/${currentRole}`}
              className="w-full py-2.5 px-4 bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold rounded-xl transition flex items-center justify-center gap-2 shadow-xs cursor-pointer"
            >
              <span>Return to {currentRole.charAt(0).toUpperCase() + currentRole.slice(1)} Portal</span>
              <ArrowRight size={15} />
            </button>
            <button
              onClick={() => {
                logout();
                window.location.href = `/${allowedRole}/login`;
              }}
              className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition cursor-pointer border border-slate-200"
            >
              Sign Out & Log In as {allowedRole.charAt(0).toUpperCase() + allowedRole.slice(1)}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
