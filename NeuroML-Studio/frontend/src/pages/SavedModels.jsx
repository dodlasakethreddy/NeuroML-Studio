import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bookmark,
  Cpu,
  Search,
  Filter,
  Eye,
  Zap,
  Trash2,
  Calendar,
  Layers,
  Award,
} from 'lucide-react';
import { useDataset } from '../context/DatasetContext';
import PageHeader from '../components/layout/PageHeader';
import Modal from '../components/common/Modal';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';

export const SavedModels = () => {
  const navigate = useNavigate();
  const { models, setSelectedModelId, deleteModel } = useDataset();

  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [modelToView, setModelToView] = useState(null);
  const [modelToDelete, setModelToDelete] = useState(null);

  const filteredModels = models.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.algorithm.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.datasetName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || m.problemType === typeFilter;
    return matchesSearch && matchesType;
  });

  const handleUseForPrediction = (model) => {
    setSelectedModelId(model.id);
    navigate('/predictions');
  };

  const confirmDelete = () => {
    if (modelToDelete) {
      deleteModel(modelToDelete.id);
      setModelToDelete(null);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <PageHeader
        title="Saved Models Registry"
        subtitle="Repository of trained machine learning model weights, configurations, and evaluation artifacts."
        actions={
          <Button
            variant="primary"
            onClick={() => navigate('/model-training')}
            leftIcon={Cpu}
          >
            Train New Model
          </Button>
        }
      />

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-[#151E32] p-4 rounded-xl border border-[#27334A]">
        <div className="relative flex-1 min-w-[240px] max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search models by name or algorithm..."
            className="neu-input w-full pl-9 py-2 text-xs"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="neu-input text-xs py-1.5 px-3"
          >
            <option value="all">All Problem Types</option>
            <option value="Classification">Classification</option>
            <option value="Regression">Regression</option>
          </select>
        </div>
      </div>

      {/* Models Table */}
      <div className="neu-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead className="bg-[#10172A] border-b border-[#27334A] text-slate-400 font-semibold uppercase text-[10px]">
              <tr>
                <th className="p-3.5">Model Name</th>
                <th className="p-3.5">Algorithm</th>
                <th className="p-3.5">Dataset</th>
                <th className="p-3.5">Type</th>
                <th className="p-3.5">Performance</th>
                <th className="p-3.5">Training Date</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#27334A]/40 text-slate-200">
              {filteredModels.map((m) => (
                <tr key={m.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-3.5 font-bold text-white flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-purple-400 shrink-0" />
                    <span>{m.name}</span>
                    {m.isBest && <Badge variant="amber" size="xs">Best</Badge>}
                  </td>
                  <td className="p-3.5 font-semibold text-slate-300">{m.algorithm}</td>
                  <td className="p-3.5 text-slate-400">{m.datasetName}</td>
                  <td className="p-3.5">
                    <Badge variant={m.problemType === 'Classification' ? 'purple' : 'blue'} size="xs">
                      {m.problemType}
                    </Badge>
                  </td>
                  <td className="p-3.5 font-mono font-bold text-purple-300">
                    {m.problemType === 'Classification' ? `${m.accuracy}% Acc` : `R² ${m.r2Score}`}
                  </td>
                  <td className="p-3.5 text-slate-400">{m.trainingDate}</td>
                  <td className="p-3.5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setModelToView(m)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-purple-600/30 text-slate-300 hover:text-purple-300 transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleUseForPrediction(m)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-emerald-600/30 text-slate-300 hover:text-emerald-300 transition-colors"
                        title="Use for Prediction"
                      >
                        <Zap className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setModelToDelete(m)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                        title="Delete Model"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Model Details Modal */}
      {modelToView && (
        <Modal
          isOpen={!!modelToView}
          onClose={() => setModelToView(null)}
          title={`Model Specs: ${modelToView.name}`}
          subtitle={`Trained on ${modelToView.datasetName} (${modelToView.problemType})`}
          footer={
            <>
              <Button variant="secondary" size="sm" onClick={() => setModelToView(null)}>
                Close
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  handleUseForPrediction(modelToView);
                  setModelToView(null);
                }}
                rightIcon={Zap}
              >
                Use for Prediction
              </Button>
            </>
          }
        >
          <div className="space-y-4 text-xs">
            {/* Metric Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {modelToView.problemType === 'Classification' ? (
                <>
                  <div className="bg-[#10172A] p-3 rounded-lg border border-[#27334A]">
                    <div className="text-[10px] text-slate-400">Accuracy</div>
                    <div className="text-lg font-bold text-white mt-0.5">{modelToView.accuracy}%</div>
                  </div>
                  <div className="bg-[#10172A] p-3 rounded-lg border border-[#27334A]">
                    <div className="text-[10px] text-slate-400">Precision</div>
                    <div className="text-lg font-bold text-blue-300 mt-0.5">{modelToView.precision}%</div>
                  </div>
                  <div className="bg-[#10172A] p-3 rounded-lg border border-[#27334A]">
                    <div className="text-[10px] text-slate-400">Recall</div>
                    <div className="text-lg font-bold text-emerald-300 mt-0.5">{modelToView.recall}%</div>
                  </div>
                  <div className="bg-[#10172A] p-3 rounded-lg border border-[#27334A]">
                    <div className="text-[10px] text-slate-400">F1 Score</div>
                    <div className="text-lg font-bold text-amber-300 mt-0.5">{modelToView.f1Score}%</div>
                  </div>
                </>
              ) : (
                <>
                  <div className="bg-[#10172A] p-3 rounded-lg border border-[#27334A]">
                    <div className="text-[10px] text-slate-400">R² Score</div>
                    <div className="text-lg font-bold text-white mt-0.5">{modelToView.r2Score}</div>
                  </div>
                  <div className="bg-[#10172A] p-3 rounded-lg border border-[#27334A]">
                    <div className="text-[10px] text-slate-400">MAE</div>
                    <div className="text-lg font-bold text-blue-300 mt-0.5">{modelToView.mae}</div>
                  </div>
                  <div className="bg-[#10172A] p-3 rounded-lg border border-[#27334A]">
                    <div className="text-[10px] text-slate-400">RMSE</div>
                    <div className="text-lg font-bold text-rose-300 mt-0.5">{modelToView.rmse}</div>
                  </div>
                  <div className="bg-[#10172A] p-3 rounded-lg border border-[#27334A]">
                    <div className="text-[10px] text-slate-400">Training Time</div>
                    <div className="text-lg font-bold text-emerald-300 mt-0.5">{modelToView.duration}</div>
                  </div>
                </>
              )}
            </div>

            {/* Hyperparameters JSON preview */}
            <div>
              <span className="font-bold text-slate-200 block mb-1">Hyperparameters Config:</span>
              <pre className="p-3 rounded-lg bg-[#10172A] border border-[#27334A] text-purple-300 font-mono text-[11px] overflow-x-auto">
                {JSON.stringify(modelToView.hyperparameters || {}, null, 2)}
              </pre>
            </div>

            {/* Features List */}
            <div>
              <span className="font-bold text-slate-200 block mb-1.5">Input Features ({modelToView.features?.length || 0}):</span>
              <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto">
                {modelToView.features?.map((f) => (
                  <span key={f} className="px-2 py-0.5 rounded bg-[#10172A] border border-[#27334A] text-slate-300 text-[10px]">
                    {f}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!modelToDelete}
        onClose={() => setModelToDelete(null)}
        title="Delete Model"
        subtitle="This action cannot be undone."
        footer={
          <>
            <Button variant="secondary" size="sm" onClick={() => setModelToDelete(null)}>
              Cancel
            </Button>
            <Button variant="danger" size="sm" onClick={confirmDelete}>
              Confirm Delete
            </Button>
          </>
        }
      >
        <p className="text-sm text-slate-300">
          Are you sure you want to delete <strong className="text-white">{modelToDelete?.name}</strong>?
          Inference APIs relying on this model identifier will no longer be available.
        </p>
      </Modal>
    </div>
  );
};

export default SavedModels;
