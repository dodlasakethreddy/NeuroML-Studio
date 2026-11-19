import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Database,
  Sparkles,
  Sliders,
  Cpu,
  BarChart3,
  TrendingUp,
  Bookmark,
  History,
  Settings,
  Rocket,
  LogOut,
  ChevronRight,
  BrainCircuit,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Sidebar = ({ isMobileOpen, setIsMobileOpen }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { label: 'Overview', path: '/', icon: LayoutDashboard },
    { label: 'Datasets', path: '/datasets', icon: Database },
    { label: 'Data Explorer', path: '/data-explorer', icon: Sparkles },
    { label: 'Preprocessing', path: '/preprocessing', icon: Sliders },
    { label: 'Model Training', path: '/model-training', icon: Cpu },
    { label: 'Model Comparison', path: '/model-comparison', icon: BarChart3 },
    { label: 'Predictions', path: '/predictions', icon: TrendingUp },
    { label: 'Saved Models', path: '/saved-models', icon: Bookmark },
    { label: 'Training History', path: '/training-history', icon: History },
    { label: 'Settings', path: '/settings', icon: Settings },
  ];

  const handleNavClick = () => {
    if (setIsMobileOpen) setIsMobileOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-[#10172A] border-r border-[#27334A] flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top: Logo & Nav items */}
        <div className="flex flex-col flex-1 overflow-y-auto">
          {/* Logo Brand */}
          <div className="px-6 py-5 flex items-center gap-3 border-b border-[#27334A]/60">
            <div className="w-9 h-9 rounded-xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-purple-400 shadow-lg shadow-purple-600/20">
              <BrainCircuit className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <div className="text-base font-bold tracking-tight text-white flex items-center gap-1.5">
                NeuroML <span className="text-purple-400">Studio</span>
              </div>
              <div className="text-[10px] text-slate-400 tracking-wider uppercase font-semibold">
                AI / ML Platform
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="px-3 py-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={handleNavClick}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                      isActive
                        ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30 shadow-lg shadow-purple-950/40 font-semibold'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-[#151E32] border border-transparent'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon
                        className={`w-4 h-4 transition-colors ${
                          isActive
                            ? 'text-purple-400'
                            : 'text-slate-500 group-hover:text-slate-300'
                        }`}
                      />
                      <span className="flex-1">{item.label}</span>
                      {isActive && (
                        <div className="w-1.5 h-1.5 rounded-full bg-purple-400 shadow-[0_0_8px_#A855F7]" />
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section */}
        <div className="p-4 border-t border-[#27334A]/60 space-y-3 bg-[#0E1526]/50">
          {/* Upgrade to Pro Card matching screenshot */}
          <div className="rounded-xl p-3.5 bg-gradient-to-br from-purple-950/40 via-[#151E32] to-[#151E32] border border-purple-500/30 text-xs shadow-lg relative overflow-hidden group">
            <div className="flex items-start gap-2.5 mb-2">
              <div className="p-1.5 rounded-lg bg-purple-500/20 text-purple-400 shrink-0">
                <Rocket className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-white text-xs">Upgrade to Pro</h4>
                <p className="text-[11px] text-slate-400 leading-snug mt-0.5">
                  Unlock advanced algorithms and GPU clusters.
                </p>
              </div>
            </div>
            <button
              onClick={() => alert('NeuroML Studio Pro upgrade modal: Enterprise features, multi-GPU training, and custom model endpoints!')}
              className="w-full py-1.5 px-3 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs transition-colors shadow-md shadow-purple-700/30"
            >
              Upgrade Now
            </button>
          </div>

          {/* User Profile Pill */}
          <div className="flex items-center justify-between p-2 rounded-xl bg-[#151E32]/80 border border-[#27334A] hover:border-slate-600 transition-colors">
            <div className="flex items-center gap-2.5 min-w-0">
              <img
                src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                alt={user?.name || 'User'}
                className="w-8 h-8 rounded-full object-cover ring-1 ring-purple-500/40 shrink-0"
              />
              <div className="min-w-0">
                <div className="text-xs font-semibold text-white truncate">
                  {user?.name || 'John Doe'}
                </div>
                <div className="text-[10px] text-slate-400 truncate">
                  {user?.email || 'john@example.com'}
                </div>
              </div>
            </div>
          </div>

          {/* Logout Action */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
