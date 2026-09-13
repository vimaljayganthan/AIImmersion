import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import { DriveIQLogo } from './AutoSenseLogo';
import {
  LayoutDashboard,
  Car,
  Sparkles,
  Wrench,
  CalendarCheck,
  History,
  Activity,
  Bot,
  Settings,
  LogOut,
  Users,
  ShieldCheck,
  DollarSign,
  Package,
  Star,
  BarChart3,
  X,
  Cpu,
  LucideIcon,
} from 'lucide-react';

interface MenuItem {
  id: string;
  label: string;
  icon: LucideIcon;
  count?: string;
  highlight?: boolean;
  alert?: boolean;
}

interface SidebarProps {
  currentTab: string;
  onSelectTab: (tabId: string) => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  isOpenMobile = false,
  onCloseMobile,
}) => {
  const { currentRole, logout } = useAuth();
  const navigate = useNavigate();

  const getMenuItems = (): MenuItem[] => {
    switch (currentRole) {
      case 'owner':
        return [
          { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { id: 'vehicles', label: 'My Vehicles', icon: Car, count: '4' },
          { id: 'diagnosis', label: 'AI Diagnosis', icon: Sparkles, highlight: true },
          { id: 'mechanics', label: 'Mechanics', icon: Wrench },
          { id: 'bookings', label: 'My Bookings', icon: CalendarCheck, count: '1' },
          { id: 'history', label: 'Service History', icon: History },
          { id: 'maintenance', label: 'Maintenance', icon: Activity, alert: true },
          { id: 'assistant', label: 'AI Assistant', icon: Bot },
          { id: 'settings', label: 'Settings', icon: Settings },
        ];
      case 'mechanic':
        return [
          { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { id: 'requests', label: 'Service Requests', icon: CalendarCheck, count: '3', highlight: true },
          { id: 'jobs', label: 'Active Jobs', icon: Wrench, count: '2' },
          { id: 'customers', label: 'Customers', icon: Users },
          { id: 'vehicles', label: 'Vehicles', icon: Car },
          { id: 'history', label: 'Service History', icon: History },
          { id: 'parts', label: 'Parts Inventory', icon: Package },
          { id: 'earnings', label: 'Earnings', icon: DollarSign },
          { id: 'profile', label: 'Workshop Profile', icon: ShieldCheck },
          { id: 'settings', label: 'Settings', icon: Settings },
        ];
      case 'admin':
        return [
          { id: 'overview', label: 'Overview', icon: LayoutDashboard },
          { id: 'users', label: 'Users', icon: Users, count: '1.4k' },
          { id: 'mechanics', label: 'Mechanics', icon: Wrench, count: '142' },
          { id: 'vehicles', label: 'Vehicles', icon: Car, count: '1.8k' },
          { id: 'requests', label: 'Service Requests', icon: CalendarCheck },
          { id: 'diagnoses', label: 'Diagnoses', icon: Sparkles, count: '5.1k' },
          { id: 'reviews', label: 'Reviews', icon: Star },
          { id: 'reports', label: 'Reports', icon: BarChart3 },
          { id: 'settings', label: 'Platform Settings', icon: Settings },
        ];
      default:
        return [];
    }
  };

  const menuItems = getMenuItems();

  const handleItemClick = (id: string) => {
    onSelectTab(id);
    if (onCloseMobile) onCloseMobile();
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-brand-navy/30 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:static top-0 bottom-0 left-0 z-40 w-64 bg-white border-r border-brand-border flex flex-col justify-between transition-transform duration-300 ease-in-out ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div>
          <div className="h-16 px-5 border-b border-brand-border flex items-center justify-between">
            <Link to="/" className="flex items-center">
              <DriveIQLogo size="sm" portalBadge={currentRole || undefined} portalAccent="sky" />
            </Link>

            {/* Mobile Close Button */}
            <button
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 rounded-lg text-brand-slate hover:bg-slate-100 cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          {/* Navigation Menu List */}
          <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-14rem)]">
            <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Navigation
            </div>
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-brand-lightSky text-brand-navy font-semibold shadow-xs'
                      : 'text-brand-slate hover:bg-brand-veryLight hover:text-brand-navy'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      size={18}
                      className={
                        isActive
                          ? 'text-brand-skyHover stroke-[2.2]'
                          : item.highlight
                          ? 'text-brand-sky'
                          : 'text-slate-400'
                      }
                    />
                    <span>{item.label}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {item.count && (
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                          isActive
                            ? 'bg-white text-brand-skyHover'
                            : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {item.count}
                      </span>
                    )}
                    {item.alert && (
                      <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                    )}
                  </div>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-brand-border bg-slate-50/50">
          <Link
            to="/"
            className="w-full mb-2 flex items-center justify-center gap-2 py-2 px-3 rounded-xl border border-brand-border text-xs text-brand-slate hover:text-brand-navy hover:bg-white transition"
          >
            <Cpu size={14} className="text-brand-sky" />
            Portal Selection
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-semibold transition shadow-xs"
          >
            <LogOut size={15} />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
};
