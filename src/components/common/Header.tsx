import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import { useData } from '../../context/DataContext';
import { UserRole, Vehicle, Diagnosis, Mechanic, Booking } from '../../types';
import {
  Search,
  Bell,
  ChevronDown,
  Car,
  Wrench,
  Shield,
  LogOut,
  Sparkles,
  CheckCircle2,
  Menu,
  X,
  ArrowRight,
  CalendarCheck,
  User,
  Settings,
} from 'lucide-react';
import { Badge } from './Badge';

interface HeaderProps {
  onToggleSidebar?: () => void;
  title?: string;
  onNavigateTab?: (tabId: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar, title, onNavigateTab }) => {
  const { user, currentRole, switchRole, logout, openAuthModal } = useAuth();
  const {
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    vehicles,
    diagnoses,
    mechanics,
    bookings,
    openDiagnosisDetailModal,
    openMechanicProfileModal,
    openVehicleModal,
  } = useData();
  const navigate = useNavigate();

  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  
  const searchRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSearchResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleRoleSelect = (role: UserRole) => {
    switchRole(role);
    setShowRoleMenu(false);
    navigate(`/${role}`);
  };

  // Search Results
  const filteredVehicles = searchQuery
    ? vehicles.filter(
        (v) =>
          v.make.toLowerCase().includes(searchQuery.toLowerCase()) ||
          v.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
          v.regNumber.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const filteredDiagnoses = searchQuery
    ? diagnoses.filter(
        (d) =>
          d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          d.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          d.inputSymptoms.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const filteredMechanics = searchQuery
    ? mechanics.filter(
        (m) =>
          m.workshopName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          m.specializations.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : [];

  const filteredBookings = searchQuery
    ? bookings.filter(
        (b) =>
          b.bookingReference.toLowerCase().includes(searchQuery.toLowerCase()) ||
          b.problemSummary.toLowerCase().includes(searchQuery.toLowerCase()) ||
          b.serviceType.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const hasSearchResults =
    filteredVehicles.length > 0 ||
    filteredDiagnoses.length > 0 ||
    filteredMechanics.length > 0 ||
    filteredBookings.length > 0;

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-brand-border px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
      {/* Left: Mobile Toggle & Page Title / Global Search */}
      <div className="flex items-center gap-3 flex-1 max-w-xl">
        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 rounded-xl border border-brand-border text-brand-slate hover:text-brand-navy hover:bg-slate-50 transition"
          >
            <Menu size={20} />
          </button>
        )}

        {title && (
          <h1 className="text-lg font-bold text-brand-navy hidden sm:block truncate mr-2">
            {title}
          </h1>
        )}

        {/* Global Live Search Input */}
        <div ref={searchRef} className="relative w-full max-w-md">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowSearchResults(true);
            }}
            onFocus={() => setShowSearchResults(true)}
            placeholder="Search vehicles, symptoms, mechanics, bookings..."
            className="w-full pl-9 pr-8 py-2 text-xs rounded-xl bg-slate-50 border border-brand-border/80 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-sky/20 focus:border-brand-sky transition placeholder:text-slate-400 text-brand-navy"
          />
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery('');
                setShowSearchResults(false);
              }}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-brand-navy"
            >
              <X size={14} />
            </button>
          )}

          {/* Search Dropdown Results */}
          {showSearchResults && searchQuery.trim().length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-brand-border shadow-2xl overflow-hidden z-50 max-h-96 overflow-y-auto divide-y divide-brand-border/60 animate-in fade-in zoom-in-95 duration-150">
              {!hasSearchResults ? (
                <div className="p-4 text-center text-xs text-brand-slate">
                  No matching results found for "<strong className="text-brand-navy">{searchQuery}</strong>".
                </div>
              ) : (
                <>
                  {/* Vehicles Category */}
                  {filteredVehicles.length > 0 && (
                    <div className="p-3">
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <Car size={12} className="text-brand-sky" />
                        Vehicles
                      </div>
                      <div className="space-y-1">
                        {filteredVehicles.map((v) => (
                          <div
                            key={v.id}
                            onClick={() => {
                              setShowSearchResults(false);
                              openVehicleModal(v);
                            }}
                            className="p-2 rounded-xl hover:bg-brand-veryLight cursor-pointer flex items-center justify-between text-xs"
                          >
                            <span className="font-semibold text-brand-navy">
                              {v.year} {v.make} {v.model} ({v.regNumber})
                            </span>
                            <span className="text-[10px] text-brand-skyHover font-bold">Health: {v.healthScore}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Diagnoses Category */}
                  {filteredDiagnoses.length > 0 && (
                    <div className="p-3">
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <Sparkles size={12} className="text-brand-sky" />
                        AI Diagnoses
                      </div>
                      <div className="space-y-1">
                        {filteredDiagnoses.map((d) => (
                          <div
                            key={d.id}
                            onClick={() => {
                              setShowSearchResults(false);
                              openDiagnosisDetailModal(d);
                            }}
                            className="p-2 rounded-xl hover:bg-brand-veryLight cursor-pointer flex items-center justify-between text-xs"
                          >
                            <div>
                              <span className="font-semibold text-brand-navy block">{d.title}</span>
                              <span className="text-[10px] text-brand-slate line-clamp-1">{d.inputSymptoms}</span>
                            </div>
                            <span className="text-[10px] text-brand-skyHover font-bold">{d.confidence}% AI</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Mechanics Category */}
                  {filteredMechanics.length > 0 && (
                    <div className="p-3">
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <Wrench size={12} className="text-brand-sky" />
                        Workshops & Mechanics
                      </div>
                      <div className="space-y-1">
                        {filteredMechanics.map((m) => (
                          <div
                            key={m.id}
                            onClick={() => {
                              setShowSearchResults(false);
                              openMechanicProfileModal(m);
                            }}
                            className="p-2 rounded-xl hover:bg-brand-veryLight cursor-pointer flex items-center justify-between text-xs"
                          >
                            <div>
                              <span className="font-semibold text-brand-navy block">{m.workshopName}</span>
                              <span className="text-[10px] text-brand-slate">{m.address.split(',')[0]} · {m.distanceKm} km</span>
                            </div>
                            <span className="text-amber-500 font-bold text-xs">★ {m.rating}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Bookings Category */}
                  {filteredBookings.length > 0 && (
                    <div className="p-3">
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <CalendarCheck size={12} className="text-brand-sky" />
                        Bookings
                      </div>
                      <div className="space-y-1">
                        {filteredBookings.map((b) => (
                          <div
                            key={b.id}
                            onClick={() => {
                              setShowSearchResults(false);
                              if (onNavigateTab) onNavigateTab('bookings');
                            }}
                            className="p-2 rounded-xl hover:bg-brand-veryLight cursor-pointer flex items-center justify-between text-xs"
                          >
                            <span className="font-semibold text-brand-navy">{b.bookingReference} — {b.serviceType}</span>
                            <Badge variant="sky" size="sm">{b.status}</Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Role Quick Switcher Pill */}
        <div className="relative">
          <button
            onClick={() => {
              setShowRoleMenu(!showRoleMenu);
              setShowNotifMenu(false);
              setShowProfileMenu(false);
            }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-brand-sky/40 bg-brand-lightSky text-brand-navy text-xs font-semibold hover:bg-sky-100 transition shadow-xs"
          >
            {currentRole === 'owner' && <Car size={14} className="text-brand-skyHover" />}
            {currentRole === 'mechanic' && <Wrench size={14} className="text-brand-skyHover" />}
            {currentRole === 'admin' && <Shield size={14} className="text-brand-skyHover" />}
            <span className="capitalize">{currentRole}</span>
            <ChevronDown size={14} className="text-brand-slate" />
          </button>

          {showRoleMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl border border-brand-border shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-3 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Switch Portal Role
              </div>
              <button
                onClick={() => handleRoleSelect('owner')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition ${
                  currentRole === 'owner' ? 'bg-brand-lightSky text-brand-navy font-bold' : 'text-brand-slate hover:bg-slate-50'
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <Car size={16} className="text-brand-sky" />
                  Vehicle Owner
                </span>
                {currentRole === 'owner' && <CheckCircle2 size={15} className="text-brand-skyHover" />}
              </button>

              <button
                onClick={() => handleRoleSelect('mechanic')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition ${
                  currentRole === 'mechanic' ? 'bg-brand-lightSky text-brand-navy font-bold' : 'text-brand-slate hover:bg-slate-50'
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <Wrench size={16} className="text-brand-sky" />
                  Mechanic Workspace
                </span>
                {currentRole === 'mechanic' && <CheckCircle2 size={15} className="text-brand-skyHover" />}
              </button>

              <button
                onClick={() => handleRoleSelect('admin')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition ${
                  currentRole === 'admin' ? 'bg-brand-lightSky text-brand-navy font-bold' : 'text-brand-slate hover:bg-slate-50'
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <Shield size={16} className="text-brand-sky" />
                  Admin Overview
                </span>
                {currentRole === 'admin' && <CheckCircle2 size={15} className="text-brand-skyHover" />}
              </button>

              <div className="my-1.5 border-t border-brand-border"></div>

              <button
                onClick={() => {
                  setShowRoleMenu(false);
                  openAuthModal();
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs text-brand-slate hover:text-brand-navy hover:bg-slate-50 rounded-xl"
              >
                <Sparkles size={14} className="text-amber-500" />
                Sign In Different Account
              </button>
            </div>
          )}
        </div>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifMenu(!showNotifMenu);
              setShowRoleMenu(false);
              setShowProfileMenu(false);
            }}
            className="w-9 h-9 rounded-xl border border-brand-border flex items-center justify-center text-brand-slate hover:text-brand-navy hover:bg-slate-50 relative transition"
          >
            <Bell size={17} />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-brand-sky ring-2 ring-white animate-pulse" />
            )}
          </button>

          {showNotifMenu && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl border border-brand-border shadow-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="p-3.5 border-b border-brand-border flex items-center justify-between bg-brand-veryLight/50">
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold text-brand-navy">Notifications</h4>
                  {unreadCount > 0 && (
                    <Badge variant="sky" size="sm">
                      {unreadCount} new
                    </Badge>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllNotificationsRead}
                    className="text-[11px] text-brand-skyHover font-semibold hover:underline"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-72 overflow-y-auto divide-y divide-brand-border/60">
                {notifications.length === 0 ? (
                  <p className="p-4 text-center text-xs text-slate-400">No notifications yet</p>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => {
                        markNotificationRead(notif.id);
                        if (notif.link && onNavigateTab) {
                          const tab = notif.link.split('/')[2];
                          if (tab) onNavigateTab(tab);
                        }
                        setShowNotifMenu(false);
                      }}
                      className={`p-3.5 transition hover:bg-slate-50 cursor-pointer ${
                        !notif.read ? 'bg-sky-50/50 font-medium' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-xs font-semibold text-brand-navy">{notif.title}</p>
                        <span className="text-[10px] text-slate-400 shrink-0">Recent</span>
                      </div>
                      <p className="text-xs text-brand-slate mt-1 line-clamp-2">{notif.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Pill & Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setShowProfileMenu(!showProfileMenu);
              setShowRoleMenu(false);
              setShowNotifMenu(false);
            }}
            className="flex items-center gap-2 pl-2 border-l border-brand-border hover:opacity-80 transition"
          >
            <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold border border-brand-border">
              <User size={16} />
            </div>
            <div className="hidden md:block text-left">
              <p className="text-xs font-bold text-brand-navy leading-tight">{user?.name || 'Alex Sharma'}</p>
              <p className="text-[10px] text-brand-slate capitalize leading-tight">{currentRole} Portal</p>
            </div>
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl border border-brand-border shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="p-3 border-b border-brand-border/60 mb-1">
                <p className="text-xs font-bold text-brand-navy">{user?.name}</p>
                <p className="text-[10px] text-brand-slate truncate">{user?.email}</p>
              </div>

              {currentRole === 'owner' && (
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    if (onNavigateTab) onNavigateTab('vehicles');
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs text-brand-slate hover:text-brand-navy hover:bg-slate-50 rounded-xl"
                >
                  <Car size={15} />
                  <span>My Vehicles</span>
                </button>
              )}

              <button
                onClick={() => {
                  setShowProfileMenu(false);
                  if (onNavigateTab) onNavigateTab('settings');
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs text-brand-slate hover:text-brand-navy hover:bg-slate-50 rounded-xl"
              >
                <Settings size={15} />
                <span>Settings</span>
              </button>

              <div className="my-1 border-t border-brand-border/60"></div>

              <button
                onClick={() => {
                  setShowProfileMenu(false);
                  logout();
                  navigate('/');
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs text-rose-600 hover:bg-rose-50 rounded-xl font-medium"
              >
                <LogOut size={15} />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
