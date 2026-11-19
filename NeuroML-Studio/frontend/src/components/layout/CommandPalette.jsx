import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Database, Cpu, LayoutDashboard, Sliders, BarChart3, TrendingUp, Settings, X, ArrowRight } from 'lucide-react';
import { useDataset } from '../../context/DatasetContext';

export const CommandPalette = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const { datasets, models, setSelectedDatasetId, setSelectedModelId } = useDataset();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        onClose(!isOpen);
      }
      if (e.key === 'Escape' && isOpen) {
        onClose(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const quickLinks = [
    { label: 'Overview', path: '/', icon: LayoutDashboard },
    { label: 'Datasets', path: '/datasets', icon: Database },
    { label: 'Upload Dataset', path: '/upload-dataset', icon: Database },
    { label: 'Data Explorer', path: '/data-explorer', icon: Search },
    { label: 'Preprocessing', path: '/preprocessing', icon: Sliders },
    { label: 'Model Training', path: '/model-training', icon: Cpu },
    { label: 'Model Comparison', path: '/model-comparison', icon: BarChart3 },
    { label: 'Predictions', path: '/predictions', icon: TrendingUp },
    { label: 'Settings', path: '/settings', icon: Settings },
  ];

  const filteredLinks = quickLinks.filter((l) =>
    l.label.toLowerCase().includes(query.toLowerCase())
  );

  const filteredDatasets = datasets.filter((d) =>
    d.name.toLowerCase().includes(query.toLowerCase())
  );

  const filteredModels = models.filter((m) =>
    m.name.toLowerCase().includes(query.toLowerCase()) || m.algorithm.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelectPage = (path) => {
    navigate(path);
    onClose(false);
  };

  const handleSelectDataset = (id) => {
    setSelectedDatasetId(id);
    navigate('/data-explorer');
    onClose(false);
  };

  const handleSelectModel = (id) => {
    setSelectedModelId(id);
    navigate('/predictions');
    onClose(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4">
      <div className="fixed inset-0 bg-black/75 backdrop-blur-sm" onClick={() => onClose(false)} />
      
      <div className="relative w-full max-w-xl bg-[#151E32] border border-[#27334A] rounded-2xl shadow-2xl shadow-purple-950/30 overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center px-4 py-3.5 border-b border-[#27334A] bg-[#10172A]/70">
          <Search className="w-5 h-5 text-purple-400 mr-3 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search pages, datasets, or trained models..."
            className="w-full bg-transparent text-white placeholder-slate-500 text-sm focus:outline-none"
            autoFocus
          />
          <button
            onClick={() => onClose(false)}
            className="p-1 rounded text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-3 max-h-[60vh] overflow-y-auto space-y-4 text-xs">
          {/* Quick Pages */}
          {filteredLinks.length > 0 && (
            <div>
              <div className="px-2 pb-1.5 font-bold uppercase tracking-wider text-[10px] text-slate-500">
                Pages & Workspaces
              </div>
              <div className="space-y-1">
                {filteredLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <button
                      key={link.path}
                      onClick={() => handleSelectPage(link.path)}
                      className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="w-4 h-4 text-purple-400" />
                        <span>{link.label}</span>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Datasets */}
          {filteredDatasets.length > 0 && (
            <div>
              <div className="px-2 pb-1.5 font-bold uppercase tracking-wider text-[10px] text-slate-500">
                Datasets ({filteredDatasets.length})
              </div>
              <div className="space-y-1">
                {filteredDatasets.map((ds) => (
                  <button
                    key={ds.id}
                    onClick={() => handleSelectDataset(ds.id)}
                    className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition-colors text-left"
                  >
                    <div className="flex items-center gap-2.5">
                      <Database className="w-4 h-4 text-blue-400" />
                      <div>
                        <div className="font-semibold text-white">{ds.name}</div>
                        <div className="text-[10px] text-slate-500">{ds.rows} rows • {ds.columns} cols • {ds.type}</div>
                      </div>
                    </div>
                    <span className="text-[10px] text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded">Explore</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Models */}
          {filteredModels.length > 0 && (
            <div>
              <div className="px-2 pb-1.5 font-bold uppercase tracking-wider text-[10px] text-slate-500">
                Trained Models ({filteredModels.length})
              </div>
              <div className="space-y-1">
                {filteredModels.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => handleSelectModel(m.id)}
                    className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition-colors text-left"
                  >
                    <div className="flex items-center gap-2.5">
                      <Cpu className="w-4 h-4 text-emerald-400" />
                      <div>
                        <div className="font-semibold text-white">{m.name}</div>
                        <div className="text-[10px] text-slate-500">{m.algorithm} • {m.problemType === 'Classification' ? `Acc: ${m.accuracy}%` : `R²: ${m.r2Score}`}</div>
                      </div>
                    </div>
                    <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">Predict</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="px-4 py-2 bg-[#10172A] border-t border-[#27334A] text-[11px] text-slate-500 flex justify-between">
          <span>Navigate with mouse or keyboard</span>
          <span>ESC to close</span>
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;
