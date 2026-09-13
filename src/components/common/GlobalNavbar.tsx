import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import { useData } from '../../context/DataContext';
import { UserRole } from '../../types';
import { AutoSenseLogo } from './AutoSenseLogo';
import {
  Bell,
  ChevronDown,
  User as UserIcon,
  LogOut,
  Settings,
  Menu,
  X,
  Car,
  Wrench,
  Shield,
  CheckCircle2,
} from 'lucide-react';
import { Badge } from './Badge';

interface GlobalNavbarProps {
  currentTab?: string;
  onSelectTab?: (tabId: string) => void;
  title?: string;
}

interface NavItem {
  id: string;
  label: string;
  badge?: string | number;
}

export const GlobalNavbar: React.FC<GlobalNavbarProps> = ({
  currentTab: propCurrentTab,
  onSelectTab,
}) => {
  const { user, currentRole, logout } = useAuth();
  const {
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    vehicles,
    bookings,
  } = useData();

  const navigate = useNavigate();
  const location = useLocation();

  // Derive current active tab from React Router URL location
  const getActiveTab = (): string => {
    if (propCurrentTab) return propCurrentTab;
    const pathParts = location.pathname.split('/').filter(Boolean);
    const sub = pathParts[1];
    if (!sub) {
      return currentRole === 'admin' ? 'overview' : 'dashboard';
    }
    if (sub === 'service-history') return 'history';
    return sub;
  };

  const currentTab = getActiveTab();

  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const moreRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifMenu(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setShowProfileMenu(false);
      }
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
        setShowMoreMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Define portal navigation items with responsive prioritization
  const getNavStructure = (): {
    compactPrimary: NavItem[];
    compactMore: NavItem[];
    fullPrimary: NavItem[];
    fullMore: NavItem[];
  } => {
    switch (currentRole) {
      case 'owner':
        return {
          compactPrimary: [
            { id: 'dashboard', label: 'Dashboard' },
            { id: 'vehicles', label: 'My Vehicles', badge: vehicles.length },
            { id: 'diagnosis', label: 'AI Diagnosis' },
            { id: 'mechanics', label: 'Mechanics' },
          ],
          compactMore: [
            { id: 'bookings', label: 'Bookings', badge: bookings.filter(b => b.status !== 'completed' && b.status !== 'cancelled').length || undefined },
            { id: 'history', label: 'Service History' },
            { id: 'maintenance', label: 'Maintenance' },
            { id: 'assistant', label: 'AI Assistant' },
            { id: 'settings', label: 'Settings' },
          ],
          fullPrimary: [
            { id: 'dashboard', label: 'Dashboard' },
            { id: 'vehicles', label: 'My Vehicles', badge: vehicles.length },
            { id: 'diagnosis', label: 'AI Diagnosis' },
            { id: 'mechanics', label: 'Mechanics' },
            { id: 'bookings', label: 'Bookings', badge: bookings.filter(b => b.status !== 'completed' && b.status !== 'cancelled').length || undefined },
            { id: 'history', label: 'Service History' },
            { id: 'maintenance', label: 'Maintenance' },
          ],
          fullMore: [
            { id: 'assistant', label: 'AI Assistant' },
            { id: 'settings', label: 'Settings' }
          ]
        };
      case 'mechanic':
        return {
          compactPrimary: [
            { id: 'dashboard', label: 'Dashboard' },
            { id: 'requests', label: 'Requests', badge: bookings.filter(b => b.status === 'pending').length || undefined },
            { id: 'jobs', label: 'Active Jobs', badge: bookings.filter(b => b.status !== 'pending' && b.status !== 'completed' && b.status !== 'cancelled').length || undefined },
            { id: 'customers', label: 'Customers' },
          ],
          compactMore: [
            { id: 'vehicles', label: 'Vehicles' },
            { id: 'history', label: 'Service History' },
            { id: 'parts', label: 'Parts' },
            { id: 'earnings', label: 'Earnings' },
            { id: 'profile', label: 'Workshop Profile' },
            { id: 'settings', label: 'Settings' },
          ],
          fullPrimary: [
            { id: 'dashboard', label: 'Dashboard' },
            { id: 'requests', label: 'Requests', badge: bookings.filter(b => b.status === 'pending').length || undefined },
            { id: 'jobs', label: 'Active Jobs', badge: bookings.filter(b => b.status !== 'pending' && b.status !== 'completed' && b.status !== 'cancelled').length || undefined },
            { id: 'customers', label: 'Customers' },
            { id: 'vehicles', label: 'Vehicles' },
            { id: 'history', label: 'Service History' },
            { id: 'parts', label: 'Parts' },
            { id: 'earnings', label: 'Earnings' },
          ],
          fullMore: [
            { id: 'profile', label: 'Workshop Profile' },
            { id: 'settings', label: 'Settings' },
          ]
        };
      case 'admin':
        return {
          compactPrimary: [
            { id: 'overview', label: 'Overview' },
            { id: 'users', label: 'Users' },
            { id: 'mechanics', label: 'Mechanics' },
            { id: 'vehicles', label: 'Vehicles' },
          ],
          compactMore: [
            { id: 'requests', label: 'Service Requests' },
            { id: 'diagnoses', label: 'Diagnoses' },
            { id: 'reviews', label: 'Reviews' },
            { id: 'reports', label: 'Reports' },
            { id: 'settings', label: 'Platform Settings' },
          ],
          fullPrimary: [
            { id: 'overview', label: 'Overview' },
            { id: 'users', label: 'Users' },
            { id: 'mechanics', label: 'Mechanics' },
            { id: 'vehicles', label: 'Vehicles' },
            { id: 'requests', label: 'Requests' },
            { id: 'diagnoses', label: 'Diagnoses' },
          ],
          fullMore: [
            { id: 'reviews', label: 'Reviews' },
            { id: 'reports', label: 'Reports' },
            { id: 'settings', label: 'Platform Settings' },
          ]
        };
      default:
        return { compactPrimary: [], compactMore: [], fullPrimary: [], fullMore: [] };
    }
  };

  const nav = getNavStructure();

  const handleTabClick = (tabId: string) => {
    if (onSelectTab) {
      onSelectTab(tabId);
    }
    setShowMobileMenu(false);
    setShowMoreMenu(false);

    if (tabId === 'dashboard' || tabId === 'overview') {
      navigate(`/${currentRole}`);
    } else {
      navigate(`/${currentRole}/${tabId}`);
    }
  };

  const getPortalInfo = () => {
    switch (currentRole) {
      case 'owner':
        return {
          badge: 'Owner Portal',
          accent: 'sky' as const,
          underlineClass: 'bg-brand-sky',
          activeTextClass: 'text-brand-navy font-bold',
          hoverTextClass: 'hover:text-brand-sky',
        };
      case 'mechanic':
        return {
          badge: 'Mechanic Pro',
          accent: 'teal' as const,
          underlineClass: 'bg-teal-500',
          activeTextClass: 'text-teal-950 font-bold',
          hoverTextClass: 'hover:text-teal-600',
        };
      case 'admin':
        return {
          badge: 'Admin Suite',
          accent: 'indigo' as const,
          underlineClass: 'bg-indigo-600',
          activeTextClass: 'text-indigo-950 font-bold',
          hoverTextClass: 'hover:text-indigo-600',
        };
      default:
        return {
          badge: 'Portal',
          accent: 'sky' as const,
          underlineClass: 'bg-brand-sky',
          activeTextClass: 'text-brand-navy font-bold',
          hoverTextClass: 'hover:text-brand-sky',
        };
    }
  };

  const portalInfo = getPortalInfo();

  // Combine all items for mobile drawer
  const allMobileItems = [...nav.fullPrimary, ...nav.fullMore];

  return (
    <>
      <header className="sticky top-0 z-40 w-full h-[72px] bg-white border-b border-slate-200 shadow-xs">
        <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 flex items-center justify-between gap-4 h-full">
          
          {/* 1. Left Section: Logo & Portal Tag */}
          <div className="flex items-center gap-3 shrink-0">
            <Link to="/" className="flex items-center group">
              <AutoSenseLogo
                size="md"
                showSubtitle={false}
                portalBadge={portalInfo.badge}
                portalAccent={portalInfo.accent}
              />
            </Link>
          </div>

          {/* 2. Center Section: Navigation Links */}
          {/* A. Compact Navigation for Large Screens (1024px to 1279px) */}
          <nav className="hidden lg:flex xl:hidden items-center h-full space-x-1 min-w-0">
            {nav.compactPrimary.map((item) => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabClick(item.id)}
                  className={`relative h-full flex items-center gap-1.5 px-3 text-xs tracking-tight transition-colors duration-200 cursor-pointer ${
                    isActive
                      ? portalInfo.activeTextClass
                      : `text-slate-600 ${portalInfo.hoverTextClass}`
                  }`}
                >
                  <span className="whitespace-nowrap">{item.label}</span>
                  {item.badge !== undefined && (
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full font-bold bg-slate-100 text-slate-700">
                      {item.badge}
                    </span>
                  )}
                  {/* Active / Hover Underline */}
                  {isActive ? (
                    <span className={`absolute bottom-0 inset-x-2 h-[2.5px] ${portalInfo.underlineClass} rounded-t-full transition-all duration-200`} />
                  ) : (
                    <span className={`absolute bottom-0 inset-x-3 h-[2px] opacity-0 hover:opacity-40 ${portalInfo.underlineClass} rounded-t-full transition-all duration-200`} />
                  )}
                </button>
              );
            })}

            {/* Compact More Dropdown */}
            {nav.compactMore.length > 0 && (
              <div ref={moreRef} className="relative h-full flex items-center">
                <button
                  onClick={() => setShowMoreMenu(!showMoreMenu)}
                  className={`relative h-full flex items-center gap-1 px-3 text-xs font-semibold transition-colors duration-200 cursor-pointer ${
                    nav.compactMore.some((m) => m.id === currentTab)
                      ? portalInfo.activeTextClass
                      : `text-slate-600 ${portalInfo.hoverTextClass}`
                  }`}
                >
                  <span>More</span>
                  <ChevronDown
                    size={14}
                    className={`transition-transform duration-200 ${showMoreMenu ? 'rotate-180' : ''}`}
                  />
                  {nav.compactMore.some((m) => m.id === currentTab) && (
                    <span className={`absolute bottom-0 inset-x-2 h-[2.5px] ${portalInfo.underlineClass} rounded-t-full`} />
                  )}
                </button>

                {showMoreMenu && (
                  <div className="absolute top-[64px] right-0 w-52 bg-white rounded-xl border border-slate-200 shadow-xl p-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    {nav.compactMore.map((m) => {
                      const isSubActive = currentTab === m.id;
                      return (
                        <button
                          key={m.id}
                          onClick={() => handleTabClick(m.id)}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                            isSubActive
                              ? 'bg-slate-100 text-slate-900 font-bold'
                              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                          }`}
                        >
                          <span>{m.label}</span>
                          {m.badge !== undefined && (
                            <span className="text-[10px] px-1.5 py-0.2 rounded-full font-bold bg-slate-200 text-slate-700">
                              {m.badge}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </nav>

          {/* B. Full Expansive Navigation for Extra Large Screens (>= 1280px) */}
          <nav className="hidden xl:flex items-center h-full space-x-1 min-w-0">
            {nav.fullPrimary.map((item) => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabClick(item.id)}
                  className={`relative h-full flex items-center gap-1.5 px-3.5 text-xs tracking-tight transition-colors duration-200 cursor-pointer ${
                    isActive
                      ? portalInfo.activeTextClass
                      : `text-slate-600 ${portalInfo.hoverTextClass}`
                  }`}
                >
                  <span className="whitespace-nowrap">{item.label}</span>
                  {item.badge !== undefined && (
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full font-bold bg-slate-100 text-slate-700">
                      {item.badge}
                    </span>
                  )}
                  {isActive ? (
                    <span className={`absolute bottom-0 inset-x-2 h-[2.5px] ${portalInfo.underlineClass} rounded-t-full transition-all duration-200`} />
                  ) : (
                    <span className={`absolute bottom-0 inset-x-3 h-[2px] opacity-0 group-hover:opacity-40 ${portalInfo.underlineClass} rounded-t-full transition-all duration-200`} />
                  )}
                </button>
              );
            })}

            {/* Full More Dropdown */}
            {nav.fullMore.length > 0 && (
              <div ref={moreRef} className="relative h-full flex items-center">
                <button
                  onClick={() => setShowMoreMenu(!showMoreMenu)}
                  className={`relative h-full flex items-center gap-1 px-3 text-xs font-semibold transition-colors duration-200 cursor-pointer ${
                    nav.fullMore.some((m) => m.id === currentTab)
                      ? portalInfo.activeTextClass
                      : `text-slate-600 ${portalInfo.hoverTextClass}`
                  }`}
                >
                  <span>More</span>
                  <ChevronDown
                    size={14}
                    className={`transition-transform duration-200 ${showMoreMenu ? 'rotate-180' : ''}`}
                  />
                  {nav.fullMore.some((m) => m.id === currentTab) && (
                    <span className={`absolute bottom-0 inset-x-2 h-[2.5px] ${portalInfo.underlineClass} rounded-t-full`} />
                  )}
                </button>

                {showMoreMenu && (
                  <div className="absolute top-[64px] right-0 w-48 bg-white rounded-xl border border-slate-200 shadow-xl p-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    {nav.fullMore.map((m) => {
                      const isSubActive = currentTab === m.id;
                      return (
                        <button
                          key={m.id}
                          onClick={() => handleTabClick(m.id)}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                            isSubActive
                              ? 'bg-slate-100 text-slate-900 font-bold'
                              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                          }`}
                        >
                          <span>{m.label}</span>
                          {isSubActive && <CheckCircle2 size={13} className="text-emerald-600" />}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </nav>

          {/* 3. Right Section: Notification + User Outline Icon + Name/Role */}
          <div className="flex items-center gap-3 shrink-0">
            
            {/* Notification Bell */}
            <div ref={notifRef} className="relative">
              <button
                onClick={() => {
                  setShowNotifMenu(!showNotifMenu);
                  setShowProfileMenu(false);
                  setShowMoreMenu(false);
                }}
                className="w-9 h-9 rounded-lg border border-slate-200 flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-50 relative transition cursor-pointer"
                title="Notifications"
              >
                <Bell size={16} />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-brand-sky ring-2 ring-white" />
                )}
              </button>

              {showNotifMenu && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl border border-slate-200 shadow-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="p-3 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-slate-900">Notifications</h4>
                      {unreadCount > 0 && (
                        <span className="text-[10px] px-1.5 py-0.2 rounded-full font-bold bg-sky-100 text-sky-800">
                          {unreadCount} new
                        </span>
                      )}
                    </div>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllNotificationsRead}
                        className="text-[11px] text-sky-600 font-semibold hover:underline cursor-pointer"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>

                  <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                    {notifications.length === 0 ? (
                      <p className="p-4 text-center text-xs text-slate-400">No notifications</p>
                    ) : (
                      notifications.map((notif) => (
                        <div
                          key={notif.id}
                          onClick={() => {
                            markNotificationRead(notif.id);
                            if (notif.link) {
                              const tab = notif.link.split('/')[2];
                              if (tab) handleTabClick(tab);
                            }
                            setShowNotifMenu(false);
                          }}
                          className={`p-3 transition hover:bg-slate-50 cursor-pointer ${
                            !notif.read ? 'bg-sky-50/40 font-medium' : ''
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-xs font-semibold text-slate-900">{notif.title}</p>
                            <span className="text-[10px] text-slate-400 shrink-0">Just now</span>
                          </div>
                          <p className="text-xs text-slate-600 mt-1 line-clamp-2">{notif.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* User Profile Pill */}
            <div ref={profileRef} className="relative">
              <button
                onClick={() => {
                  setShowProfileMenu(!showProfileMenu);
                  setShowNotifMenu(false);
                  setShowMoreMenu(false);
                }}
                className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition cursor-pointer"
              >
                <div className="w-7 h-7 rounded-md bg-slate-100 text-slate-600 flex items-center justify-center border border-slate-200 shrink-0">
                  <UserIcon size={14} />
                </div>
                <div className="text-left pr-1 hidden sm:block">
                  <p className="text-xs font-bold text-slate-900 leading-tight">
                    {user?.name || (currentRole === 'admin' ? 'Dr. Sarah Chen' : currentRole === 'mechanic' ? 'Rajesh Kumar' : 'Alex Sharma')}
                  </p>
                  <p className="text-[10px] text-slate-500 leading-none capitalize">
                    {currentRole}
                  </p>
                </div>
                <ChevronDown size={13} className="text-slate-400" />
              </button>

              {/* Profile Dropdown */}
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl border border-slate-200 shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="p-3 border-b border-slate-100 mb-1 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-6 h-6 rounded-md bg-white text-slate-700 flex items-center justify-center border border-slate-200">
                        <UserIcon size={12} />
                      </div>
                      <p className="text-xs font-bold text-slate-900">{user?.name || 'Alex Sharma'}</p>
                    </div>
                    <p className="text-[11px] text-slate-500 truncate pl-8">{user?.email || 'owner@driveiq.ai'}</p>
                    <div className="mt-2 pl-8">
                      <span className="text-[10px] px-2 py-0.5 rounded-md font-semibold bg-white border border-slate-200 text-slate-700">
                        {currentRole === 'owner' && 'Vehicle Owner'}
                        {currentRole === 'mechanic' && 'Certified Mechanic'}
                        {currentRole === 'admin' && 'Platform Admin'}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        handleTabClick(currentRole === 'mechanic' ? 'profile' : 'settings');
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-slate-900 rounded-lg transition cursor-pointer font-medium"
                    >
                      <Settings size={14} className="text-slate-400" />
                      <span>Account Settings</span>
                    </button>

                    <div className="my-1 border-t border-slate-100"></div>

                    {/* Sign Out */}
                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        logout();
                        navigate('/');
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-rose-600 hover:bg-rose-50 rounded-lg font-semibold transition cursor-pointer"
                    >
                      <LogOut size={14} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Hamburger Toggle (< lg screens) */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="lg:hidden w-9 h-9 rounded-lg border border-slate-200 flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition cursor-pointer"
              title="Menu"
            >
              {showMobileMenu ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {showMobileMenu && (
        <div className="lg:hidden fixed inset-0 top-[72px] z-30 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white border-b border-slate-200 shadow-2xl p-4 max-h-[calc(100vh-80px)] overflow-y-auto">
            
            {/* User Details in Drawer */}
            <div className="flex items-center gap-2.5 p-3 bg-slate-50 rounded-xl border border-slate-200 mb-4">
              <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-700 flex items-center justify-center font-bold">
                <UserIcon size={16} />
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold text-slate-900">{user?.name || 'Alex Sharma'}</p>
                <p className="text-[10px] text-slate-500 capitalize">{currentRole} Workspace</p>
              </div>
              <button
                onClick={() => {
                  logout();
                  navigate('/');
                }}
                className="text-xs text-rose-600 font-semibold px-2 py-1 rounded-lg hover:bg-rose-50 cursor-pointer"
              >
                Sign Out
              </button>
            </div>

            {/* Portal Navigation Items */}
            <div className="space-y-1">
              <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                {portalInfo.badge} Navigation
              </div>

              {allMobileItems.map((item) => {
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleTabClick(item.id)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-slate-100 text-slate-900 border-l-4 border-brand-sky'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span>{item.label}</span>
                    {item.badge !== undefined && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 font-bold">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
