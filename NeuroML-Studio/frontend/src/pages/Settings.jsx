import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  User,
  Key,
  Shield,
  Palette,
  Server,
  RotateCcw,
  Check,
  Copy,
  Save,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useDataset } from '../context/DatasetContext';
import PageHeader from '../components/layout/PageHeader';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';

export const Settings = () => {
  const { user, updateProfile, demoMode, toggleDemoMode } = useAuth();
  const { resetToSampleData, addToast } = useDataset();

  // Profile form state
  const [name, setName] = useState(user?.name || 'John Doe');
  const [email, setEmail] = useState(user?.email || 'john@example.com');
  const [role, setRole] = useState(user?.role || 'Lead ML Engineer');
  const [avatar, setAvatar] = useState(user?.avatar || '');

  // API Backend URL state
  const [apiUrl, setApiUrl] = useState(import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000');
  const [apiKey, setApiKey] = useState('nml_live_8f93e1b72a0c49d8e5f21049c');
  const [hasCopiedKey, setHasCopiedKey] = useState(false);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    updateProfile({ name, email, role, avatar });
    addToast({ type: 'success', title: 'Profile Updated', message: 'Your user profile details have been saved.' });
  };

  const handleCopyKey = () => {
    navigator.clipboard.writeText(apiKey);
    setHasCopiedKey(true);
    setTimeout(() => setHasCopiedKey(false), 2000);
    addToast({ type: 'info', message: 'API key copied to clipboard.' });
  };

  const handleGenerateNewKey = () => {
    const newKey = 'nml_live_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    setApiKey(newKey);
    addToast({ type: 'success', message: 'Generated new NeuroML SDK API key.' });
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">
      {/* Header */}
      <PageHeader
        title="Settings & Preferences"
        subtitle="Configure profile credentials, NeuroML API integrations, and demo engine preferences."
      />

      {/* 1. User Profile */}
      <div className="neu-card p-6">
        <div className="flex items-center gap-2 pb-4 border-b border-[#27334A] mb-4">
          <User className="w-5 h-5 text-purple-400" />
          <h3 className="font-bold text-white text-base">User Profile</h3>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
          <div className="flex items-center gap-4 mb-4">
            <img
              src={avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
              alt="Avatar"
              className="w-16 h-16 rounded-2xl object-cover ring-2 ring-purple-500/40"
            />
            <div className="flex-1">
              <label className="font-semibold text-slate-300 block mb-1">Avatar Image URL</label>
              <input
                type="text"
                value={avatar}
                onChange={(e) => setAvatar(e.target.value)}
                className="neu-input w-full text-xs"
                placeholder="https://..."
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="font-semibold text-slate-300">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="neu-input py-2 text-xs"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-semibold text-slate-300">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="neu-input py-2 text-xs"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-semibold text-slate-300">Role / Title</label>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="neu-input py-2 text-xs"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <Button type="submit" variant="primary" size="sm" leftIcon={Save}>
              Save Profile Changes
            </Button>
          </div>
        </form>
      </div>

      {/* 2. API & SDK Integration */}
      <div className="neu-card p-6">
        <div className="flex items-center gap-2 pb-4 border-b border-[#27334A] mb-4">
          <Key className="w-5 h-5 text-purple-400" />
          <h3 className="font-bold text-white text-base">API & Python SDK Key</h3>
        </div>

        <div className="space-y-4 text-xs">
          <p className="text-slate-400">
            Use your personal API key to interact with NeuroML Studio from Python Jupyter notebooks, FastAPI pipelines, or curl scripts.
          </p>

          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={apiKey}
              className="neu-input flex-1 font-mono text-xs text-purple-300 py-2 bg-[#10172A]"
            />
            <Button
              variant="secondary"
              size="sm"
              onClick={handleCopyKey}
              leftIcon={hasCopiedKey ? Check : Copy}
            >
              {hasCopiedKey ? 'Copied' : 'Copy'}
            </Button>
            <Button variant="outline" size="sm" onClick={handleGenerateNewKey}>
              Regenerate
            </Button>
          </div>
        </div>
      </div>

      {/* 3. Backend Connection & Demo Preferences */}
      <div className="neu-card p-6">
        <div className="flex items-center gap-2 pb-4 border-b border-[#27334A] mb-4">
          <Server className="w-5 h-5 text-purple-400" />
          <h3 className="font-bold text-white text-base">Backend Connection & Demo Mode</h3>
        </div>

        <div className="space-y-5 text-xs">
          <div className="flex flex-col gap-1.5">
            <label className="font-semibold text-slate-300">FastAPI Backend URL</label>
            <input
              type="text"
              value={apiUrl}
              onChange={(e) => setApiUrl(e.target.value)}
              className="neu-input py-2 text-xs font-mono"
            />
            <span className="text-[11px] text-slate-400">
              Default: http://localhost:8000 (Defined via VITE_API_BASE_URL).
            </span>
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#10172A] border border-[#27334A]">
            <div>
              <div className="font-bold text-white text-xs">Interactive Demo Engine Mode</div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                When enabled, the frontend runs high-fidelity simulations without requiring a running FastAPI server.
              </div>
            </div>
            <button
              type="button"
              onClick={toggleDemoMode}
              className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                demoMode ? 'bg-purple-600' : 'bg-slate-700'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  demoMode ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#10172A] border border-[#27334A]">
            <div>
              <div className="font-bold text-white text-xs">Reset Sample Datasets & Models</div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                Restore the default demo datasets, sample models, and prediction logs.
              </div>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={resetToSampleData}
              leftIcon={RotateCcw}
            >
              Reset Data
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
