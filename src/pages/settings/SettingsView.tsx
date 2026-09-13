import React, { useState, useEffect } from 'react';
import { useAuth } from '../../auth/AuthContext';
import { useSettings } from '../../context/SettingsContext';
import { apiAiService, HealthResponse } from '../../services/ai/apiAiService';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import {
  User,
  Shield,
  Bell,
  Palette,
  Sparkles,
  Lock,
  Cpu,
  Key,
  Database,
  Clock,
  MapPin,
  Globe,
  Check,
  AlertTriangle,
  Server,
  RefreshCw,
  LogOut,
  Wrench,
  Sliders,
  FileText,
  Save,
  CheckCircle2,
  Info
} from 'lucide-react';

interface SettingsViewProps {
  portalType: 'owner' | 'mechanic' | 'admin';
}

export const SettingsView: React.FC<SettingsViewProps> = ({ portalType }) => {
  const { user } = useAuth();
  const {
    profile,
    aiPreferences,
    notifications,
    appearance,
    updateProfile,
    updateAiPreferences,
    updateNotifications,
    updateAppearance,
  } = useSettings();

  // Active navigation tab
  const [activeSection, setActiveSection] = useState<string>('account');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  // Form local state
  const [formData, setFormData] = useState(profile);
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  // Security password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMsg, setPasswordMsg] = useState<string | null>(null);

  // Live Backend Health check for Integrations section
  const [backendHealth, setBackendHealth] = useState<HealthResponse | null>(null);
  const [isCheckingHealth, setIsCheckingHealth] = useState(false);

  useEffect(() => {
    checkHealth();
  }, []);

  const checkHealth = async () => {
    setIsCheckingHealth(true);
    const health = await apiAiService.checkHealth();
    setBackendHealth(health);
    setIsCheckingHealth(false);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(formData);
    setIsEditingProfile(false);
    triggerSuccess('Account and profile settings saved successfully.');
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordMsg('Please fill in all password fields.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordMsg('New password and confirmation password do not match.');
      return;
    }
    if (newPassword.length < 8) {
      setPasswordMsg('Password must be at least 8 characters long.');
      return;
    }
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setPasswordMsg(null);
    triggerSuccess('Security credentials updated successfully.');
  };

  const triggerSuccess = (msg: string) => {
    setSaveSuccessMsg(msg);
    setTimeout(() => setSaveSuccessMsg(null), 4000);
  };

  // Portal-specific theme colors
  const portalTheme = {
    owner: {
      accent: 'border-l-sky-500',
      activeTab: 'bg-sky-50 text-sky-800 border-sky-300 font-bold',
      badge: 'bg-sky-100 text-sky-800',
      button: 'bg-sky-500 hover:bg-sky-600 text-white',
      title: 'Vehicle Owner Settings',
    },
    mechanic: {
      accent: 'border-l-teal-500',
      activeTab: 'bg-teal-50 text-teal-800 border-teal-300 font-bold',
      badge: 'bg-teal-100 text-teal-800',
      button: 'bg-teal-600 hover:bg-teal-700 text-white',
      title: 'Workshop & Mechanic Settings',
    },
    admin: {
      accent: 'border-l-indigo-500',
      activeTab: 'bg-indigo-50 text-indigo-800 border-indigo-300 font-bold',
      badge: 'bg-indigo-100 text-indigo-800',
      button: 'bg-indigo-600 hover:bg-indigo-700 text-white',
      title: 'Platform Administration Settings',
    },
  }[portalType];

  // Navigation Items according to portal
  const navItems = [
    { id: 'account', label: 'Account', icon: User },
    {
      id: 'profile',
      label: portalType === 'mechanic' ? 'Workshop Profile' : portalType === 'admin' ? 'Admin Profile' : 'Profile',
      icon: portalType === 'mechanic' ? Wrench : User,
    },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    {
      id: 'ai_preferences',
      label: portalType === 'admin' ? 'AI/ML Configuration' : 'AI Preferences',
      icon: Sparkles,
    },
    { id: 'privacy', label: 'Privacy & Audit', icon: Shield },
    { id: 'integrations', label: 'Integrations', icon: Server },
  ];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${portalTheme.badge}`}>
              {portalTheme.title}
            </span>
            <span className="text-[10px] font-mono text-slate-400">DriveIQ OS v2.4</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Settings</h1>
          <p className="text-xs text-slate-600">
            Manage your DriveIQ account, preferences, security, and machine learning engine configuration.
          </p>
        </div>

        {saveSuccessMsg && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-semibold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
            <span>{saveSuccessMsg}</span>
          </div>
        )}
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Navigation (Desktop Sidebar / Mobile Scrollable Pill Bar) */}
        <div className="lg:col-span-3 w-full">
          <Card className="p-2 sm:p-3 bg-white border-brand-border shadow-xs">
            <div className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-x-visible pb-1 lg:pb-0 scrollbar-none">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs transition shrink-0 lg:shrink text-left w-full cursor-pointer ${
                      isActive
                        ? portalTheme.activeTab
                        : 'text-brand-slate hover:text-brand-navy hover:bg-slate-50'
                    }`}
                  >
                    <Icon size={16} className={isActive ? 'text-brand-navy' : 'text-slate-400'} />
                    <span className="font-semibold">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Right Settings Content Section */}
        <div className="lg:col-span-9 w-full space-y-6">
          {/* SECTION 1: ACCOUNT */}
          {activeSection === 'account' && (
            <Card className={`p-6 bg-white border-brand-border shadow-xs border-l-4 ${portalTheme.accent}`}>
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-brand-border">
                <div>
                  <h3 className="text-base font-bold text-brand-navy">Account Information</h3>
                  <p className="text-xs text-brand-slate">Primary DriveIQ identity and authenticated credentials</p>
                </div>
                <Badge variant="sky" size="sm">
                  {portalType.toUpperCase()} ACCOUNT
                </Badge>
              </div>

              {!isEditingProfile ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-200">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Full Name</span>
                      <span className="font-bold text-brand-navy text-sm">{profile.name}</span>
                    </div>
                    <div className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-200">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Email Address</span>
                      <span className="font-bold text-brand-navy text-sm">{user?.email || profile.email}</span>
                    </div>
                    <div className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-200">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Phone Number</span>
                      <span className="font-bold text-brand-navy text-sm">{profile.phone}</span>
                    </div>
                    <div className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-200">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Account Created</span>
                      <span className="font-bold text-brand-navy text-sm">March 14, 2024 · Verified</span>
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <Button
                      size="sm"
                      onClick={() => {
                        setFormData(profile);
                        setIsEditingProfile(true);
                      }}
                      className={portalTheme.button}
                    >
                      Edit Information
                    </Button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSaveProfile} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="text-[11px] font-bold text-brand-navy block mb-1">Full Name</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-brand-border bg-white focus:outline-none focus:ring-2 focus:ring-brand-sky/30 text-brand-navy"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-brand-navy block mb-1">Email Address</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-brand-border bg-white focus:outline-none focus:ring-2 focus:ring-brand-sky/30 text-brand-navy"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-brand-navy block mb-1">Phone Number</label>
                      <input
                        type="text"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-brand-border bg-white focus:outline-none focus:ring-2 focus:ring-brand-sky/30 text-brand-navy"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-brand-navy block mb-1">Preferred Location</label>
                      <input
                        type="text"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-brand-border bg-white focus:outline-none focus:ring-2 focus:ring-brand-sky/30 text-brand-navy"
                      />
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsEditingProfile(false)}
                      type="button"
                    >
                      Cancel
                    </Button>
                    <Button size="sm" type="submit" className={portalTheme.button} leftIcon={<Save size={14} />}>
                      Save Changes
                    </Button>
                  </div>
                </form>
              )}
            </Card>
          )}

          {/* SECTION 2: PROFILE */}
          {activeSection === 'profile' && (
            <Card className={`p-6 bg-white border-brand-border shadow-xs border-l-4 ${portalTheme.accent}`}>
              <div className="flex items-center gap-3 mb-4 pb-3 border-b border-brand-border">
                <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600">
                  <User size={20} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-brand-navy">
                    {portalType === 'mechanic' ? 'Workshop Profile' : portalType === 'admin' ? 'Administrator Profile' : 'User Profile'}
                  </h3>
                  <p className="text-xs text-brand-slate">Preferences and automotive operational parameters</p>
                </div>
              </div>

              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Preferred Service Region</span>
                    <div className="flex items-center gap-1.5 font-bold text-brand-navy">
                      <MapPin size={14} className="text-brand-sky" />
                      <span>{profile.location}</span>
                    </div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">System Language</span>
                    <div className="flex items-center gap-1.5 font-bold text-brand-navy">
                      <Globe size={14} className="text-brand-sky" />
                      <span>{profile.language}</span>
                    </div>
                  </div>
                </div>

                {portalType === 'mechanic' && (
                  <div className="p-4 rounded-xl bg-teal-50/50 border border-teal-200 space-y-2">
                    <span className="font-bold text-teal-900 block text-xs">Workshop Credentials</span>
                    <p className="text-slate-600 text-[11px]">
                      <strong>Facility:</strong> {profile.workshopName} · <strong>Experience:</strong> {profile.experienceYears} Years
                    </p>
                    <p className="text-slate-600 text-[11px]">
                      <strong>Specialization:</strong> {profile.specialization}
                    </p>
                  </div>
                )}

                {portalType === 'admin' && (
                  <div className="p-4 rounded-xl bg-indigo-50/50 border border-indigo-200 space-y-2">
                    <span className="font-bold text-indigo-900 block text-xs">Administrative Privileges</span>
                    <p className="text-slate-600 text-[11px]">
                      Full access to Multi-modal Diagnostic ML Model management, ML Pipeline audit traces, cross-validation metrics, and mechanic verification.
                    </p>
                  </div>
                )}
              </div>
            </Card>
          )}

          {/* SECTION 3: SECURITY */}
          {activeSection === 'security' && (
            <div className="space-y-6">
              <Card className={`p-6 bg-white border-brand-border shadow-xs border-l-4 ${portalTheme.accent}`}>
                <div className="mb-4 pb-3 border-b border-brand-border">
                  <h3 className="text-base font-bold text-brand-navy">Authentication & Credentials</h3>
                  <p className="text-xs text-brand-slate">Manage your password and active security sessions</p>
                </div>

                <form onSubmit={handlePasswordChange} className="space-y-3 max-w-md text-xs">
                  <div>
                    <label className="text-[11px] font-bold text-brand-navy block mb-1">Current Password</label>
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-3 py-2 rounded-xl border border-brand-border bg-white focus:ring-2 focus:ring-brand-sky/30 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-brand-navy block mb-1">New Password</label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="At least 8 characters"
                      className="w-full px-3 py-2 rounded-xl border border-brand-border bg-white focus:ring-2 focus:ring-brand-sky/30 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-brand-navy block mb-1">Confirm New Password</label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm password"
                      className="w-full px-3 py-2 rounded-xl border border-brand-border bg-white focus:ring-2 focus:ring-brand-sky/30 focus:outline-none"
                    />
                  </div>

                  {passwordMsg && (
                    <p className="text-xs text-rose-600 font-medium">{passwordMsg}</p>
                  )}

                  <Button size="sm" type="submit" className={portalTheme.button} leftIcon={<Key size={14} />}>
                    Update Password
                  </Button>
                </form>
              </Card>

              {/* Login Sessions Card */}
              <Card className="p-6 bg-white border-brand-border shadow-xs">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-brand-border">
                  <div>
                    <h3 className="text-sm font-bold text-brand-navy">Active Login Sessions</h3>
                    <p className="text-xs text-brand-slate">Devices currently authenticated to DriveIQ platform</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => triggerSuccess('All other sessions signed out.')}
                    leftIcon={<LogOut size={13} />}
                  >
                    Sign Out Other Sessions
                  </Button>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="p-3 bg-emerald-50/60 border border-emerald-200 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <div>
                        <span className="font-bold text-emerald-950 block">Current Web Browser Session</span>
                        <span className="text-[11px] text-emerald-700">macOS · Chrome 126 · Indiranagar, Bengaluru</span>
                      </div>
                    </div>
                    <Badge variant="success" size="sm">ACTIVE NOW</Badge>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                    <div>
                      <span className="font-bold text-brand-navy block">DriveIQ Mobile Client</span>
                      <span className="text-[11px] text-slate-500">iOS 17.5 · Last active 2 hours ago</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">Protected</span>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* SECTION 4: NOTIFICATIONS */}
          {activeSection === 'notifications' && (
            <Card className={`p-6 bg-white border-brand-border shadow-xs border-l-4 ${portalTheme.accent}`}>
              <div className="mb-4 pb-3 border-b border-brand-border">
                <h3 className="text-base font-bold text-brand-navy">Notification Preferences</h3>
                <p className="text-xs text-brand-slate">Control which vehicle alerts and service updates you receive</p>
              </div>

              <div className="space-y-3">
                {[
                  {
                    key: 'serviceReminders',
                    label: 'Service Reminders',
                    desc: 'Receive upcoming maintenance reminders based on vehicle odometer intervals.',
                    checked: notifications.serviceReminders,
                  },
                  {
                    key: 'diagnosisAlerts',
                    label: 'AI Diagnosis Alerts',
                    desc: 'Receive instant notifications when a multi-modal diagnosis is completed.',
                    checked: notifications.diagnosisAlerts,
                  },
                  {
                    key: 'bookingUpdates',
                    label: 'Booking & Workshop Updates',
                    desc: 'Receive mechanic appointment confirmation and service stage progression.',
                    checked: notifications.bookingUpdates,
                  },
                  {
                    key: 'maintenanceAlerts',
                    label: 'Vehicle Health & Telemetry Alerts',
                    desc: 'Receive component degradation alerts (brake pad wear, battery voltage drops).',
                    checked: notifications.maintenanceAlerts,
                  },
                  {
                    key: 'systemNotifications',
                    label: 'System & Security Announcements',
                    desc: 'Receive platform policy updates and critical security alerts.',
                    checked: notifications.systemNotifications,
                  },
                ].map((item) => (
                  <div
                    key={item.key}
                    className="p-3.5 bg-slate-50/70 hover:bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between gap-4 transition"
                  >
                    <div>
                      <span className="text-xs font-bold text-brand-navy block">{item.label}</span>
                      <span className="text-[11px] text-brand-slate">{item.desc}</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer shrink-0">
                      <input
                        type="checkbox"
                        checked={item.checked}
                        onChange={(e) => {
                          updateNotifications({ [item.key]: e.target.checked });
                          triggerSuccess('Notification preference updated.');
                        }}
                        className="sr-only peer"
                      />
                      <div className="w-10 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-sky-500"></div>
                    </label>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* SECTION 5: APPEARANCE */}
          {activeSection === 'appearance' && (
            <Card className={`p-6 bg-white border-brand-border shadow-xs border-l-4 ${portalTheme.accent}`}>
              <div className="mb-4 pb-3 border-b border-brand-border">
                <h3 className="text-base font-bold text-brand-navy">Appearance & Theme</h3>
                <p className="text-xs text-brand-slate">Customise interface visual styling and density</p>
              </div>

              <div className="space-y-6 text-xs">
                {/* Theme Selector */}
                <div>
                  <span className="font-bold text-brand-navy block mb-2">Theme Mode</span>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-3 rounded-xl border-2 border-sky-500 bg-sky-50/50 flex items-center justify-between">
                      <span className="font-bold text-sky-950">Light Mode</span>
                      <Check size={14} className="text-sky-600" />
                    </div>
                    <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 opacity-60 flex items-center justify-between cursor-not-allowed">
                      <span className="font-semibold text-slate-500">System</span>
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-200 text-slate-600">Soon</span>
                    </div>
                    <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 opacity-60 flex items-center justify-between cursor-not-allowed">
                      <span className="font-semibold text-slate-500">Dark Mode</span>
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-200 text-slate-600">Coming Soon</span>
                    </div>
                  </div>
                </div>

                {/* Primary Accent */}
                <div>
                  <span className="font-bold text-brand-navy block mb-2">Primary Accent Palette</span>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: 'blue', name: 'AutoSense Blue', color: 'bg-sky-500' },
                      { id: 'cyan', name: 'Cyan Tech', color: 'bg-cyan-500' },
                      { id: 'teal', name: 'Teal Precision', color: 'bg-teal-600' },
                    ].map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => {
                          updateAppearance({ accentColor: c.id as any });
                          triggerSuccess(`Accent palette set to ${c.name}.`);
                        }}
                        className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition cursor-pointer ${
                          appearance.accentColor === c.id
                            ? 'border-sky-500 bg-sky-50/40 font-bold text-brand-navy'
                            : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <span className={`w-3.5 h-3.5 rounded-full ${c.color}`} />
                        <span>{c.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Density */}
                <div>
                  <span className="font-bold text-brand-navy block mb-2">Interface Density</span>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => updateAppearance({ density: 'comfortable' })}
                      className={`px-4 py-2 rounded-xl text-xs font-bold border transition ${
                        appearance.density === 'comfortable'
                          ? 'bg-sky-50 border-sky-300 text-sky-800'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      Comfortable
                    </button>
                    <button
                      type="button"
                      onClick={() => updateAppearance({ density: 'compact' })}
                      className={`px-4 py-2 rounded-xl text-xs font-bold border transition ${
                        appearance.density === 'compact'
                          ? 'bg-sky-50 border-sky-300 text-sky-800'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      Compact
                    </button>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* SECTION 6: AI ASSISTANT PREFERENCES */}
          {activeSection === 'ai_preferences' && (
            <Card className={`p-6 bg-white border-brand-border shadow-xs border-l-4 ${portalTheme.accent}`}>
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-brand-border">
                <Sparkles size={18} className="text-indigo-600" />
                <div>
                  <h3 className="text-base font-bold text-brand-navy">AI Assistant & Diagnostic Preferences</h3>
                  <p className="text-xs text-brand-slate">Configure multi-turn conversation behavior and machine learning evidence presentation</p>
                </div>
              </div>

              <div className="space-y-5 text-xs">
                {/* Response Style */}
                <div>
                  <span className="font-bold text-brand-navy block mb-2">Assistant Response Style</span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      { id: 'concise', name: 'Concise', desc: 'Direct answers & core fault category' },
                      { id: 'balanced', name: 'Balanced', desc: 'Standard diagnostic flow with evidence' },
                      { id: 'detailed', name: 'Detailed', desc: 'Full mechanical breakdown & maintenance history' },
                    ].map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => {
                          updateAiPreferences({ responseStyle: s.id as any });
                          triggerSuccess(`AI Response style set to ${s.name}.`);
                        }}
                        className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                          aiPreferences.responseStyle === s.id
                            ? 'border-indigo-500 bg-indigo-50/50 font-bold text-indigo-950 shadow-2xs'
                            : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <span className="font-bold block text-xs">{s.name}</span>
                        <span className="text-[10px] text-slate-500 font-normal">{s.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Diagnostic Assistance Controls */}
                <div>
                  <span className="font-bold text-brand-navy block mb-2">Diagnostic Assistance Engine</span>
                  <div className="space-y-2">
                    {[
                      {
                        key: 'askFollowUp',
                        label: 'Ask follow-up questions before recommending repairs',
                        desc: 'Engages in conversational symptom clarification (engine cranking, headlight dimming, traffic conditions).',
                        checked: aiPreferences.askFollowUp,
                      },
                      {
                        key: 'showEvidence',
                        label: 'Show diagnostic evidence breakdown',
                        desc: 'Displays extracted TF-IDF acoustic & symptom signals in diagnosis reports.',
                        checked: aiPreferences.showEvidence,
                      },
                      {
                        key: 'showConfidence',
                        label: 'Show machine learning confidence percentage',
                        desc: 'Renders calibrated Random Forest class probabilities.',
                        checked: aiPreferences.showConfidence,
                      },
                      {
                        key: 'considerMileage',
                        label: 'Consider vehicle mileage in diagnostic hypotheses',
                        desc: 'Cross-references degradation curves for components at current odometer reading.',
                        checked: aiPreferences.considerMileage,
                      },
                      {
                        key: 'considerServiceHistory',
                        label: 'Consider past service history and invoices',
                        desc: 'Analyzes previous repairs to rule out recently replaced parts.',
                        checked: aiPreferences.considerServiceHistory,
                      },
                      {
                        key: 'safetyWarnings',
                        label: 'Immediate safety warnings for critical issues',
                        desc: 'Triggers prominent safety advisories for brake degradation, smoke, or fuel leakage.',
                        checked: aiPreferences.safetyWarnings,
                      },
                    ].map((item) => (
                      <div
                        key={item.key}
                        className="p-3 bg-slate-50/70 hover:bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between gap-4 transition"
                      >
                        <div>
                          <span className="text-xs font-bold text-brand-navy block">{item.label}</span>
                          <span className="text-[11px] text-brand-slate">{item.desc}</span>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer shrink-0">
                          <input
                            type="checkbox"
                            checked={item.checked}
                            onChange={(e) => {
                              updateAiPreferences({ [item.key]: e.target.checked });
                              triggerSuccess('AI preference updated.');
                            }}
                            className="sr-only peer"
                          />
                          <div className="w-10 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* SECTION 7: PRIVACY & DATA */}
          {activeSection === 'privacy' && (
            <Card className={`p-6 bg-white border-brand-border shadow-xs border-l-4 ${portalTheme.accent}`}>
              <div className="mb-4 pb-3 border-b border-brand-border">
                <h3 className="text-base font-bold text-brand-navy">Privacy, Telemetry &amp; AI Processing</h3>
                <p className="text-xs text-brand-slate">Understand how vehicle diagnostic data and telemetry are processed on the DriveIQ platform</p>
              </div>

              <div className="space-y-4 text-xs">
                <div className="p-4 bg-sky-50/60 rounded-xl border border-sky-100 flex items-start gap-3">
                  <Shield size={18} className="text-brand-sky shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <span className="font-bold text-brand-navy block">Data Protection Standard (GDPR / ISO 27001)</span>
                    <p className="text-brand-slate leading-relaxed">
                      All uploaded vehicle images, engine acoustic clips, and telemetry parameters are encrypted in transit via TLS 1.3 and stored in isolated tenant sandboxes.
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="font-bold text-brand-navy block">Diagnostic Data Storage</span>
                  <p className="text-brand-slate leading-relaxed">
                    Symptom descriptions, failure mode observations, and generated diagnostic reports are securely linked to your registered vehicle identifier for longitudinal health tracking.
                  </p>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="font-bold text-brand-navy block">Audio &amp; Acoustic Telemetry</span>
                  <p className="text-brand-slate leading-relaxed">
                    Uploaded engine and exhaust audio recordings are processed via Mel-Frequency Cepstral Coefficients (MFCC) feature extractors for anomaly detection and are not shared with third-party advertising networks.
                  </p>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="font-bold text-brand-navy block">Machine Learning Inference Disclosure</span>
                  <p className="text-brand-slate leading-relaxed">
                    Submitted complaints are evaluated by the DriveIQ scikit-learn Random Forest and TF-IDF feature pipelines running on the FastAPI backend for educational and predictive diagnostic assistance.
                  </p>
                </div>
              </div>
            </Card>
          )}

          {/* SECTION 7: AI & ML MODEL DISCLOSURES */}
          {activeSection === 'models' && (
            <Card className={`p-6 bg-white border-brand-border shadow-xs border-l-4 ${portalTheme.accent}`}>
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-brand-border">
                <div>
                  <h3 className="text-base font-bold text-brand-navy">AI Diagnostic Model Disclosures</h3>
                  <p className="text-xs text-brand-slate">Multi-modal AI inference principles and safety boundaries</p>
                </div>
                <Badge variant="sky" size="sm">TRANSPARENT AI</Badge>
              </div>

              <div className="space-y-4 text-xs">
                <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-xl space-y-1">
                  <div className="flex items-center gap-2">
                    <Info size={15} className="text-amber-700 shrink-0" />
                    <span className="font-bold text-amber-900">Decision-Support Principle</span>
                  </div>
                  <p className="text-amber-800 leading-relaxed pl-5">
                    DriveIQ diagnoses are preliminary AI decision-support estimations and do not replace hands-on mechanical inspection by a certified automotive technician.
                  </p>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="font-bold text-brand-navy block">Audio Feature Extraction Policy</span>
                  <p className="text-brand-slate leading-relaxed">
                    Uploaded engine and exhaust audio recordings are processed via Mel-Frequency Cepstral Coefficients (MFCC) feature extractors for anomaly detection and are not shared with third-party advertising networks.
                  </p>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="font-bold text-brand-navy block">Machine Learning Inference Disclosure</span>
                  <p className="text-brand-slate leading-relaxed">
                    Submitted complaints are evaluated by the DriveIQ scikit-learn Random Forest and TF-IDF feature pipelines running on the FastAPI backend for educational and predictive diagnostic assistance.
                  </p>
                </div>
              </div>
            </Card>
          )}

          {/* SECTION 8: INTEGRATIONS */}
          {activeSection === 'integrations' && (
            <Card className={`p-6 bg-white border-brand-border shadow-xs border-l-4 ${portalTheme.accent}`}>
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-brand-border">
                <div>
                  <h3 className="text-base font-bold text-brand-navy">Platform Integrations &amp; Services</h3>
                  <p className="text-xs text-brand-slate">Real-time status of connected backend services and machine learning models</p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={checkHealth}
                  isLoading={isCheckingHealth}
                  leftIcon={<RefreshCw size={13} />}
                >
                  Check Status
                </Button>
              </div>

              <div className="space-y-3 text-xs">
                {/* FastAPI ML Backend */}
                <div className="p-4 rounded-xl border bg-slate-50 border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                      <Cpu size={18} />
                    </div>
                    <div>
                      <span className="font-bold text-brand-navy block">FastAPI ML Backend Engine</span>
                      <span className="text-[11px] text-brand-slate">Port 8000 · POST /api/ml/pipeline &amp; GET /health</span>
                    </div>
                  </div>
                  {backendHealth?.status === 'ok' ? (
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-100/80 px-2.5 py-1 rounded-full flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      ● Connected (Online)
                    </span>
                  ) : (
                    <span className="text-xs font-bold text-rose-700 bg-rose-100 px-2.5 py-1 rounded-full flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-rose-500" />
                      ○ Not Connected (Offline)
                    </span>
                  )}
                </div>

                {/* Scikit-Learn Model Service */}
                <div className="p-4 rounded-xl border bg-slate-50 border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold">
                      <Sparkles size={18} />
                    </div>
                    <div>
                      <span className="font-bold text-brand-navy block">DriveIQ Fault Classifier (v1.0)</span>
                      <span className="text-[11px] text-brand-slate">500 TF-IDF Features · 120 Random Forest Estimators · 8 Classes</span>
                    </div>
                  </div>
                  {backendHealth?.model_loaded ? (
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-100/80 px-2.5 py-1 rounded-full flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      ● Model Loaded
                    </span>
                  ) : (
                    <span className="text-xs font-bold text-amber-700 bg-amber-100 px-2.5 py-1 rounded-full flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-amber-500" />
                      ○ Model Initializing
                    </span>
                  )}
                </div>

                {/* Database Integration */}
                <div className="p-4 rounded-xl border bg-slate-50 border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                      <Database size={18} />
                    </div>
                    <div>
                      <span className="font-bold text-brand-navy block">Supabase Vehicle Telemetry Store</span>
                      <span className="text-[11px] text-brand-slate">Vehicles, Diagnoses, Bookings & Maintenance Records</span>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-100/80 px-2.5 py-1 rounded-full flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    ● Connected
                  </span>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
