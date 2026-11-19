import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import {
  Search,
  Bell,
  Menu,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Upload,
  Cpu,
  ChevronDown,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Navbar = ({ onOpenSearch, onToggleMobileSidebar }) => {
  const location = useLocation();
  const { user, demoMode, toggleDemoMode } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);

  // Map route pathname to page title
  const getPageMeta = () => {
    switch (location.pathname) {
      case '/':
        return { title: 'Overview', breadcrumb: 'Dashboard' };
      case '/datasets':
        return { title: 'Datasets', breadcrumb: 'Data Management' };
      case '/upload-dataset':
        return { title: 'Upload Dataset', breadcrumb: 'Datasets' };
      case '/data-explorer':
        return { title: 'Data Explorer', breadcrumb: 'Analytics' };
      case '/preprocessing':
        return { title: 'Data Preprocessing', breadcrumb: 'Feature Engineering' };
      case '/model-training':
        return { title: 'Model Training', breadcrumb: 'Pipelines' };
      case '/model-comparison':
        return { title: 'Model Comparison', breadcrumb: 'Evaluation' };
      case '/predictions':
        return { title: 'Predictions', breadcrumb: 'Inference' };
      case '/saved-models':
        return { title: 'Saved Models', breadcrumb: 'Artifacts' };
      case '/training-history':
        return { title: 'Training History', breadcrumb: 'Experiments' };
      case '/settings':
        return { title: 'Settings', breadcrumb: 'Preferences' };
      default:
        return { title: 'NeuroML Studio', breadcrumb: 'Workspace' };
    }
  };

  const { title, breadcrumb } = getPageMeta();

  const notifications = [
    {
      id: 1,
      title: 'Random Forest model trained',
      desc: 'Achieved 96.8% accuracy on Employee Attrition.csv',
      time: '5m ago',
      icon: Cpu,
      color: 'text-purple-400',
    },
    {
      id: 2,
      title: 'Dataset ready for exploration',
      desc: 'Heart Disease.csv was parsed with 14 features',
      time: '45m ago',
      icon: Upload,
      color: 'text-blue-400',
    },
    {
      id: 3,
      title: 'GPU Cluster auto-scaled',
      desc: '2 instances idle, scaled down to conserve quota',
      time: '2h ago',
      icon: CheckCircle2,
      color: 'text-emerald-400',
    },
  ];

  return (
    <header className="sticky top-0 z-30 h-16 bg-[#0B1020]/90 backdrop-blur-md border-b border-[#27334A] px-4 lg:px-8 flex items-center justify-between">
      {/* Left: Mobile hamburger & Page Title */}
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleMobileSidebar}
          className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-[#151E32] lg:hidden focus:outline-none"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:block">
          <div className="text-[11px] font-medium text-slate-400 flex items-center gap-1.5">
            <span>{breadcrumb}</span>
            <span>/</span>
            <span className="text-purple-400 font-semibold">{title}</span>
          </div>
          <h1 className="text-lg font-bold text-white tracking-tight leading-none mt-0.5">
            {title}
          </h1>
        </div>
      </div>

      {/* Center: Search Bar matching reference image */}
      <div className="flex-1 max-w-md mx-4">
        <button
          type="button"
          onClick={onOpenSearch}
          className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl bg-[#151E32] hover:bg-[#1A253E] border border-[#27334A] hover:border-[#3B4A6B] text-slate-400 text-xs transition-colors shadow-inner group"
        >
          <div className="flex items-center gap-2.5 truncate">
            <Search className="w-4 h-4 text-slate-400 group-hover:text-purple-400 transition-colors" />
            <span className="truncate">Search datasets, models, metrics...</span>
          </div>
          <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono bg-[#10172A] border border-[#27334A] text-slate-400 rounded">
            Ctrl + K
          </kbd>
        </button>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-3">
        {/* Demo Mode Toggle Button */}
        <button
          onClick={toggleDemoMode}
          title={demoMode ? 'Click to switch to live backend API mode' : 'Click to switch to mock demo mode'}
          className={`hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
            demoMode
              ? 'bg-purple-950/40 text-purple-300 border-purple-500/40 hover:bg-purple-900/40'
              : 'bg-emerald-950/40 text-emerald-300 border-emerald-500/40 hover:bg-emerald-900/40'
          }`}
        >
          <span className={`w-2 h-2 rounded-full animate-pulse ${demoMode ? 'bg-purple-400 shadow-[0_0_6px_#A855F7]' : 'bg-emerald-400'}`} />
          <span>{demoMode ? 'Demo Mode Active' : 'Live API Mode'}</span>
        </button>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-xl bg-[#151E32] hover:bg-[#1A253E] border border-[#27334A] text-slate-300 hover:text-white transition-colors"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-[#0B1020]">
              3
            </span>
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-[#151E32] border border-[#27334A] rounded-2xl shadow-2xl z-50 p-3 text-xs animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-2 border-b border-[#27334A] px-1">
                <span className="font-bold text-white text-sm">Notifications</span>
                <span className="text-[10px] text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-full border border-purple-500/30">
                  3 unread
                </span>
              </div>
              <div className="divide-y divide-[#27334A]/50 max-h-72 overflow-y-auto mt-1">
                {notifications.map((n) => {
                  const Icon = n.icon;
                  return (
                    <div
                      key={n.id}
                      className="p-2.5 hover:bg-slate-800/40 rounded-xl transition-colors flex items-start gap-3 cursor-pointer"
                    >
                      <div className={`p-1.5 rounded-lg bg-slate-800 shrink-0 ${n.color}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-slate-200">{n.title}</div>
                        <div className="text-slate-400 text-[11px] truncate mt-0.5">{n.desc}</div>
                        <div className="text-[10px] text-slate-500 mt-1">{n.time}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="pt-2 border-t border-[#27334A] text-center">
                <button
                  onClick={() => setShowNotifications(false)}
                  className="text-purple-400 hover:text-purple-300 text-xs font-semibold"
                >
                  Mark all as read
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Avatar */}
        <Link
          to="/settings"
          className="flex items-center gap-2 p-1 rounded-xl hover:bg-[#151E32] transition-colors"
          title="Account Settings"
        >
          <img
            src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
            alt="User profile"
            className="w-8 h-8 rounded-full object-cover ring-2 ring-purple-500/30"
          />
        </Link>
      </div>
    </header>
  );
};

export default Navbar;
