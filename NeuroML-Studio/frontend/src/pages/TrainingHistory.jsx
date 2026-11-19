import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  History,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Cpu,
  BarChart2,
  Eye,
  RotateCcw,
} from 'lucide-react';
import { useDataset } from '../context/DatasetContext';
import PageHeader from '../components/layout/PageHeader';
import Modal from '../components/common/Modal';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';

export const TrainingHistory = () => {
  const navigate = useNavigate();
  const { trainingHistory } = useDataset();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRun, setSelectedRun] = useState(null);

  const filteredHistory = trainingHistory.filter((h) => {
    return (
      h.modelName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      h.algorithm?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      h.datasetName?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <PageHeader
        title="Training History & Audit Log"
        subtitle="Historical log of executed model training sessions, epoch durations, and cross-validation checkpoints."
      />

      {/* Search Bar */}
      <div className="flex items-center justify-between gap-4 bg-[#151E32] p-4 rounded-xl border border-[#27334A]">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search runs by dataset or algorithm..."
            className="neu-input w-full pl-9 py-2 text-xs"
          />
        </div>
        <span className="text-xs text-slate-400">
          Total Runs: <strong className="text-white">{filteredHistory.length}</strong>
        </span>
      </div>

      {/* History Table */}
      <div className="neu-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead className="bg-[#10172A] border-b border-[#27334A] text-slate-400 font-semibold uppercase text-[10px]">
              <tr>
                <th className="p-3.5">Run ID</th>
                <th className="p-3.5">Dataset Name</th>
                <th className="p-3.5">Algorithm</th>
                <th className="p-3.5">Problem Type</th>
                <th className="p-3.5">Training Date</th>
                <th className="p-3.5">Duration</th>
                <th className="p-3.5">Metrics</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#27334A]/40 text-slate-200">
              {filteredHistory.map((run) => (
                <tr key={run.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-3.5 font-mono text-purple-400 font-bold">{run.id}</td>
                  <td className="p-3.5 font-medium text-white">{run.datasetName}</td>
                  <td className="p-3.5 font-semibold text-slate-300">{run.algorithm}</td>
                  <td className="p-3.5">
                    <Badge variant={run.problemType === 'Classification' ? 'purple' : 'blue'} size="xs">
                      {run.problemType}
                    </Badge>
                  </td>
                  <td className="p-3.5 text-slate-400">{run.trainingDate}</td>
                  <td className="p-3.5 text-slate-400 font-mono">{run.duration || '3.2s'}</td>
                  <td className="p-3.5 font-mono text-emerald-300 font-semibold">
                    {run.metrics ? Object.entries(run.metrics).map(([k, v]) => `${k}: ${v}`).join(' | ') : 'N/A'}
                  </td>
                  <td className="p-3.5">
                    <Badge variant="green" size="xs">Completed</Badge>
                  </td>
                  <td className="p-3.5 text-right">
                    <button
                      onClick={() => setSelectedRun(run)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-purple-600/30 text-slate-300 hover:text-purple-300 transition-colors"
                      title="Inspect Training Run"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Run Inspection Modal */}
      {selectedRun && (
        <Modal
          isOpen={!!selectedRun}
          onClose={() => setSelectedRun(null)}
          title={`Training Run Details: ${selectedRun.id}`}
          subtitle={`${selectedRun.algorithm} on ${selectedRun.datasetName}`}
          footer={
            <Button variant="secondary" size="sm" onClick={() => setSelectedRun(null)}>
              Close
            </Button>
          }
        >
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[#10172A] p-3 rounded-lg border border-[#27334A]">
                <span className="text-slate-400 block text-[10px]">Algorithm:</span>
                <span className="font-bold text-white text-sm">{selectedRun.algorithm}</span>
              </div>
              <div className="bg-[#10172A] p-3 rounded-lg border border-[#27334A]">
                <span className="text-slate-400 block text-[10px]">Elapsed Time:</span>
                <span className="font-bold text-emerald-400 text-sm">{selectedRun.duration}</span>
              </div>
            </div>

            <div>
              <span className="font-bold text-slate-200 block mb-1">Hyperparameter Snapshot:</span>
              <pre className="p-3 rounded-lg bg-[#10172A] border border-[#27334A] text-purple-300 font-mono text-[11px] overflow-x-auto">
                {JSON.stringify(selectedRun.hyperparameters || {}, null, 2)}
              </pre>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default TrainingHistory;
