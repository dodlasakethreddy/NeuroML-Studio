import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sliders,
  Database,
  CheckCircle2,
  RotateCcw,
  Play,
  ArrowRight,
  Split,
  Sparkles,
  Layers,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';
import { useDataset } from '../context/DatasetContext';
import PageHeader from '../components/layout/PageHeader';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import preprocessingService from '../services/preprocessingService';
import { useAuth } from '../context/AuthContext';

export const Preprocessing = () => {
  const navigate = useNavigate();
  const { demoMode } = useAuth();
  const { datasets, selectedDataset, setSelectedDatasetId, addToast } = useDataset();

  // Preprocessing configuration state
  const [missingStrategy, setMissingStrategy] = useState('median');
  const [removeDuplicates, setRemoveDuplicates] = useState(true);
  const [encodingMethod, setEncodingMethod] = useState('one_hot');
  const [scalingMethod, setScalingMethod] = useState('standard');
  const [splitRatio, setSplitRatio] = useState(80); // 80% train, 20% test

  const [isApplying, setIsApplying] = useState(false);
  const [transformationResult, setTransformationResult] = useState(null);

  if (!selectedDataset) {
    return (
      <div className="text-center py-16 neu-card p-8 max-w-md mx-auto">
        <Sliders className="w-12 h-12 text-slate-500 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-white">No Dataset Selected</h3>
        <p className="text-xs text-slate-400 mt-1 mb-4">
          Select or upload a dataset before configuring preprocessing pipelines.
        </p>
        <Button variant="primary" onClick={() => navigate('/upload-dataset')}>
          Upload Dataset
        </Button>
      </div>
    );
  }

  const handleApply = async () => {
    setIsApplying(true);
    try {
      const config = {
        missingValues: missingStrategy,
        removeDuplicates,
        encoding: encodingMethod,
        scaling: scalingMethod,
        trainSplit: splitRatio,
      };

      const result = await preprocessingService.applyPreprocessing(config, selectedDataset, demoMode);
      setTransformationResult(result);
      addToast({
        type: 'success',
        title: 'Preprocessing Applied',
        message: 'Dataset successfully transformed and split into train/test sets.',
      });
    } catch (err) {
      addToast({ type: 'error', title: 'Preprocessing Error', message: err.message });
    } finally {
      setIsApplying(false);
    }
  };

  const handleReset = () => {
    setMissingStrategy('median');
    setRemoveDuplicates(true);
    setEncodingMethod('one_hot');
    setScalingMethod('standard');
    setSplitRatio(80);
    setTransformationResult(null);
    addToast({ type: 'info', message: 'Preprocessing configuration reset to defaults.' });
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#27334A]/80">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-extrabold tracking-tight text-white">Data Preprocessing</h2>
            <Badge variant="purple" size="sm">Pipeline Builder</Badge>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Impute missing values, encode categoricals, scale numerical features, and partition train/test sets.
          </p>
        </div>

        {/* Dataset Switcher */}
        <div className="flex items-center gap-2 bg-[#151E32] p-1.5 rounded-xl border border-[#27334A]">
          <Database className="w-4 h-4 text-purple-400 ml-2" />
          <select
            value={selectedDataset.id}
            onChange={(e) => {
              setSelectedDatasetId(e.target.value);
              setTransformationResult(null);
            }}
            className="bg-transparent text-xs text-white font-semibold pr-4 py-1 focus:outline-none cursor-pointer"
          >
            {datasets.map((d) => (
              <option key={d.id} value={d.id} className="bg-[#10172A] text-slate-200">
                {d.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Pipeline Configuration Steps */}
        <div className="lg:col-span-2 flex flex-col gap-5">
          {/* Step 1: Missing Values Handling */}
          <div className="neu-card p-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#27334A]">
              <div>
                <h4 className="font-bold text-white text-sm">1. Missing Value Imputation</h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  How should missing/null cells be treated across numeric and categorical features?
                </p>
              </div>
              <Badge variant="amber" size="xs">
                {selectedDataset.missingValues || 0} Missing
              </Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-4">
              {[
                { id: 'mean', label: 'Mean Imputation', desc: 'Replace nulls with arithmetic mean (Numeric only)' },
                { id: 'median', label: 'Median Imputation', desc: 'Replace with 50th percentile (Robust to outliers)' },
                { id: 'mode', label: 'Mode Imputation', desc: 'Replace with most frequent value' },
                { id: 'drop', label: 'Drop Missing Rows', desc: 'Remove any row containing null values' },
              ].map((opt) => (
                <label
                  key={opt.id}
                  onClick={() => setMissingStrategy(opt.id)}
                  className={`p-3 rounded-xl border text-xs cursor-pointer flex flex-col justify-between transition-all ${
                    missingStrategy === opt.id
                      ? 'bg-purple-950/40 border-purple-500 text-white ring-1 ring-purple-500'
                      : 'bg-[#10172A] border-[#27334A] text-slate-300 hover:border-slate-600'
                  }`}
                >
                  <div className="font-bold flex items-center justify-between mb-1">
                    <span>{opt.label}</span>
                    <input
                      type="radio"
                      name="missing"
                      checked={missingStrategy === opt.id}
                      onChange={() => setMissingStrategy(opt.id)}
                      className="accent-purple-600"
                    />
                  </div>
                  <span className="text-[11px] text-slate-400 leading-snug">{opt.desc}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Step 2: Duplicate Removal */}
          <div className="neu-card p-5">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-white text-sm">2. Duplicate Row Removal</h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Automatically identify and discard identical duplicate rows in dataset.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setRemoveDuplicates(!removeDuplicates)}
                className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                  removeDuplicates ? 'bg-purple-600' : 'bg-[#10172A] border border-[#27334A]'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    removeDuplicates ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Step 3: Categorical Encoding */}
          <div className="neu-card p-5">
            <h4 className="font-bold text-white text-sm pb-1">3. Categorical Feature Encoding</h4>
            <p className="text-xs text-slate-400 mb-4">
              Convert text and nominal columns into numeric vectors.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { id: 'one_hot', name: 'One-Hot Encoding', desc: 'Create binary dummy columns for each category (Best for tree models & linear)' },
                { id: 'label', name: 'Label Encoding', desc: 'Assign 0, 1, 2... integer index to each unique string label' },
              ].map((enc) => (
                <div
                  key={enc.id}
                  onClick={() => setEncodingMethod(enc.id)}
                  className={`p-3.5 rounded-xl border cursor-pointer text-xs transition-all ${
                    encodingMethod === enc.id
                      ? 'bg-purple-950/40 border-purple-500 text-white ring-1 ring-purple-500'
                      : 'bg-[#10172A] border-[#27334A] text-slate-300 hover:border-slate-600'
                  }`}
                >
                  <div className="font-bold flex items-center justify-between mb-1">
                    <span>{enc.name}</span>
                    <input
                      type="radio"
                      name="encoding"
                      checked={encodingMethod === enc.id}
                      onChange={() => setEncodingMethod(enc.id)}
                      className="accent-purple-600"
                    />
                  </div>
                  <p className="text-[11px] text-slate-400">{enc.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Step 4: Feature Scaling */}
          <div className="neu-card p-5">
            <h4 className="font-bold text-white text-sm pb-1">4. Feature Scaling & Normalization</h4>
            <p className="text-xs text-slate-400 mb-4">
              Standardize feature ranges to improve convergence in gradient-based & distance models (SVM, KNN).
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {[
                { id: 'standard', name: 'StandardScaler', formula: '(x - μ) / σ', desc: 'Mean = 0, Std = 1' },
                { id: 'minmax', name: 'MinMaxScaler', formula: '(x - min) / (max - min)', desc: 'Bounded in [0, 1]' },
                { id: 'robust', name: 'RobustScaler', formula: '(x - Q2) / IQR', desc: 'Resilient to outliers' },
              ].map((scaler) => (
                <div
                  key={scaler.id}
                  onClick={() => setScalingMethod(scaler.id)}
                  className={`p-3 rounded-xl border cursor-pointer text-xs transition-all ${
                    scalingMethod === scaler.id
                      ? 'bg-purple-950/40 border-purple-500 text-white ring-1 ring-purple-500'
                      : 'bg-[#10172A] border-[#27334A] text-slate-300 hover:border-slate-600'
                  }`}
                >
                  <div className="font-bold text-white mb-0.5">{scaler.name}</div>
                  <div className="text-[10px] font-mono text-purple-400 mb-1">{scaler.formula}</div>
                  <div className="text-[10px] text-slate-400">{scaler.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Step 5: Train / Test Split */}
          <div className="neu-card p-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#27334A]">
              <div>
                <h4 className="font-bold text-white text-sm">5. Train-Test Partitioning</h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Split the preprocessed dataset into training and validation sets.
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono font-bold">
                <span className="text-purple-400">{splitRatio}% Train</span>
                <span className="text-slate-500">/</span>
                <span className="text-blue-400">{100 - splitRatio}% Test</span>
              </div>
            </div>

            <div className="pt-4 flex flex-col gap-3">
              <input
                type="range"
                min="50"
                max="90"
                step="5"
                value={splitRatio}
                onChange={(e) => setSplitRatio(Number(e.target.value))}
                className="w-full accent-purple-600 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-400">
                <span>50/50</span>
                <span>70/30</span>
                <span className="text-purple-400 font-bold">80/20 (Recommended)</span>
                <span>90/10</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Pipeline Summary & Action Panel */}
        <div className="flex flex-col gap-5">
          <div className="neu-card p-5 flex flex-col gap-4 sticky top-20">
            <div className="flex items-center justify-between pb-3 border-b border-[#27334A]">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-purple-400" />
                <h3 className="font-bold text-white text-sm">Pipeline Recipe</h3>
              </div>
              <Badge variant="purple" size="xs">5 Operations</Badge>
            </div>

            {/* Pipeline Step List */}
            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-slate-400 block text-[11px]">Imputation:</span>
                  <span className="font-semibold text-white capitalize">{missingStrategy} method</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-slate-400 block text-[11px]">Duplicates:</span>
                  <span className="font-semibold text-white">
                    {removeDuplicates ? 'Drop exact duplicates' : 'Retain duplicates'}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-slate-400 block text-[11px]">Encoding:</span>
                  <span className="font-semibold text-white">
                    {encodingMethod === 'one_hot' ? 'One-Hot (Dummy variables)' : 'Label Encoding (Ordinal)'}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-slate-400 block text-[11px]">Feature Scaling:</span>
                  <span className="font-semibold text-white capitalize">{scalingMethod} Scaler</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-slate-400 block text-[11px]">Partition Split:</span>
                  <span className="font-semibold text-purple-400">{splitRatio}% Train / {100 - splitRatio}% Test</span>
                </div>
              </div>
            </div>

            {/* Transformation Output Stats */}
            {transformationResult && (
              <div className="p-3.5 rounded-xl bg-purple-950/30 border border-purple-500/40 text-xs flex flex-col gap-2 mt-2">
                <span className="font-bold text-white text-xs flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Transformed Dataset Stats
                </span>
                <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                  <div>
                    <span className="text-slate-400">Train Rows:</span>{' '}
                    <strong className="text-white">{transformationResult.summary.trainRows}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400">Test Rows:</span>{' '}
                    <strong className="text-white">{transformationResult.summary.testRows}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400">Processed Cols:</span>{' '}
                    <strong className="text-purple-300">{transformationResult.summary.processedColumns}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400">Status:</span>{' '}
                    <strong className="text-emerald-400">Ready</strong>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="pt-3 border-t border-[#27334A] flex flex-col gap-2.5">
              <Button
                variant="primary"
                onClick={handleApply}
                isLoading={isApplying}
                leftIcon={Play}
              >
                Apply Preprocessing
              </Button>

              {transformationResult && (
                <Button
                  variant="success"
                  onClick={() => navigate('/model-training')}
                  rightIcon={ArrowRight}
                >
                  Proceed to Model Training
                </Button>
              )}

              <Button
                variant="secondary"
                size="sm"
                onClick={handleReset}
                leftIcon={RotateCcw}
              >
                Reset Configuration
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Preprocessing;
