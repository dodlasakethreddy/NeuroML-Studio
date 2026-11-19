import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Database,
  Plus,
  LayoutGrid,
  Table as TableIcon,
  Search,
  Filter,
  Sparkles,
  Sliders,
  Cpu,
  Trash2,
} from 'lucide-react';
import { useDataset } from '../context/DatasetContext';
import PageHeader from '../components/layout/PageHeader';
import DatasetCard from '../components/datasets/DatasetCard';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import Badge from '../components/common/Badge';

export const Datasets = () => {
  const navigate = useNavigate();
  const {
    datasets,
    selectedDatasetId,
    setSelectedDatasetId,
    deleteDataset,
  } = useDataset();

  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'table'
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all'); // 'all', 'Classification', 'Regression'
  const [datasetToDelete, setDatasetToDelete] = useState(null);

  // Filter datasets
  const filteredDatasets = datasets.filter((ds) => {
    const matchesSearch =
      ds.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (ds.description && ds.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = typeFilter === 'all' || ds.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const handleSelectDataset = (ds) => {
    setSelectedDatasetId(ds.id);
  };

  const handleExplore = (ds) => {
    setSelectedDatasetId(ds.id);
    navigate('/data-explorer');
  };

  const handlePreprocess = (ds) => {
    setSelectedDatasetId(ds.id);
    navigate('/preprocessing');
  };

  const handleTrain = (ds) => {
    setSelectedDatasetId(ds.id);
    navigate('/model-training');
  };

  const confirmDelete = () => {
    if (datasetToDelete) {
      deleteDataset(datasetToDelete.id);
      setDatasetToDelete(null);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <PageHeader
        title="Datasets Management"
        subtitle="Manage, inspect, and prepare tabular datasets for machine learning workflows."
        actions={
          <Button
            variant="primary"
            leftIcon={Plus}
            onClick={() => navigate('/upload-dataset')}
          >
            Upload New Dataset
          </Button>
        }
      />

      {/* Filter and View Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-[#151E32] p-4 rounded-xl border border-[#27334A]">
        {/* Search */}
        <div className="relative flex-1 min-w-[240px] max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search datasets by name or tags..."
            className="neu-input w-full pl-9 py-2 text-xs"
          />
        </div>

        {/* Filter & View Mode */}
        <div className="flex items-center gap-3">
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

          <div className="flex items-center gap-1 bg-[#10172A] p-1 rounded-lg border border-[#27334A]">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded transition-colors ${
                viewMode === 'grid' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded transition-colors ${
                viewMode === 'table' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
              title="Table View"
            >
              <TableIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Datasets View */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredDatasets.map((ds) => (
            <DatasetCard
              key={ds.id}
              dataset={ds}
              isSelected={selectedDatasetId === ds.id}
              onSelect={() => handleSelectDataset(ds)}
              onExplore={() => handleExplore(ds)}
              onPreprocess={() => handlePreprocess(ds)}
              onTrain={() => handleTrain(ds)}
              onDelete={() => setDatasetToDelete(ds)}
            />
          ))}
        </div>
      ) : (
        <div className="neu-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-[#10172A] border-b border-[#27334A] text-slate-400 font-semibold uppercase text-[10px]">
                <tr>
                  <th className="p-3.5">Dataset Name</th>
                  <th className="p-3.5">Type</th>
                  <th className="p-3.5">Rows</th>
                  <th className="p-3.5">Columns</th>
                  <th className="p-3.5">Target</th>
                  <th className="p-3.5">Uploaded</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#27334A]/40 text-slate-200">
                {filteredDatasets.map((ds) => (
                  <tr key={ds.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-3.5 font-bold text-white flex items-center gap-2.5">
                      <Database className="w-4 h-4 text-purple-400 shrink-0" />
                      <span>{ds.name}</span>
                    </td>
                    <td className="p-3.5">
                      <Badge variant={ds.type === 'Classification' ? 'purple' : 'blue'} size="xs">
                        {ds.type}
                      </Badge>
                    </td>
                    <td className="p-3.5 font-mono">{ds.rows?.toLocaleString()}</td>
                    <td className="p-3.5 font-mono">{ds.columns}</td>
                    <td className="p-3.5 text-purple-300 font-semibold">{ds.target || 'None'}</td>
                    <td className="p-3.5 text-slate-400">{ds.uploadDate}</td>
                    <td className="p-3.5">
                      <Badge variant="green" size="xs">Ready</Badge>
                    </td>
                    <td className="p-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleExplore(ds)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-purple-600/30 text-slate-300 hover:text-purple-300 transition-colors"
                          title="Data Explorer"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handlePreprocess(ds)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-blue-600/30 text-slate-300 hover:text-blue-300 transition-colors"
                          title="Preprocessing"
                        >
                          <Sliders className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleTrain(ds)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-emerald-600/30 text-slate-300 hover:text-emerald-300 transition-colors"
                          title="Train Model"
                        >
                          <Cpu className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDatasetToDelete(ds)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                          title="Delete Dataset"
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
      )}

      {/* Confirmation Modal */}
      <Modal
        isOpen={!!datasetToDelete}
        onClose={() => setDatasetToDelete(null)}
        title="Delete Dataset"
        subtitle="This action cannot be undone."
        footer={
          <>
            <Button variant="secondary" size="sm" onClick={() => setDatasetToDelete(null)}>
              Cancel
            </Button>
            <Button variant="danger" size="sm" onClick={confirmDelete}>
              Confirm Delete
            </Button>
          </>
        }
      >
        <p className="text-sm text-slate-300">
          Are you sure you want to permanently delete{' '}
          <strong className="text-white">{datasetToDelete?.name}</strong>? Any associated
          preprocessing configurations will also be removed.
        </p>
      </Modal>
    </div>
  );
};

export default Datasets;
