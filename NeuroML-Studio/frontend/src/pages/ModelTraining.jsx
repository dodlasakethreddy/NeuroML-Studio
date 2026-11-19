import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Cpu,
  Database,
  Sliders,
  Play,
  ArrowRight,
  Settings,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { useDataset } from '../context/DatasetContext';
import PageHeader from '../components/layout/PageHeader';
import AlgorithmCard from '../components/models/AlgorithmCard';
import ColumnSelector from '../components/datasets/ColumnSelector';
import TrainingProgress from '../components/models/TrainingProgress';
import Modal from '../components/common/Modal';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import { ALGORITHMS } from '../utils/constants';

export const ModelTraining = () => {
  const navigate = useNavigate();
  const { datasets, selectedDataset, setSelectedDatasetId, trainModels, addToast } = useDataset();

  // Step 1: Problem Type
  const [problemType, setProblemType] = useState('Classification');

  // Step 2: Target Column
  const [targetColumn, setTargetColumn] = useState('');

  // Step 3: Selected Features
  const [selectedFeatures, setSelectedFeatures] = useState([]);

  // Step 4: Selected Algorithms
  const [selectedAlgorithms, setSelectedAlgorithms] = useState([]);

  // Step 5: Hyperparameters mapping { [algoId]: { [paramId]: value } }
  const [hyperparameters, setHyperparameters] = useState({});
  const [activeParamModalAlgo, setActiveParamModalAlgo] = useState(null);

  // Step 6: Training Execution State
  const [isTraining, setIsTraining] = useState(false);
  const [trainingComplete, setTrainingComplete] = useState(false);
  const [trainingProgress, setTrainingProgress] = useState(null);
  const [trainingLogs, setTrainingLogs] = useState([]);

  // Set default target & features when dataset or problem type changes
  useEffect(() => {
    if (selectedDataset) {
      const type = selectedDataset.type || 'Classification';
      setProblemType(type);

      const target = selectedDataset.target || selectedDataset.columnsList?.[selectedDataset.columnsList.length - 1]?.name || 'Target';
      setTargetColumn(target);

      const feats = selectedDataset.columnsList
        ? selectedDataset.columnsList.filter((c) => c.name !== target).map((c) => c.name)
        : [];
      setSelectedFeatures(feats);

      // Default algorithms
      const defaultAlgos = type === 'Classification'
        ? ALGORITHMS.classification.slice(0, 3)
        : ALGORITHMS.regression.slice(0, 3);
      setSelectedAlgorithms(defaultAlgos);

      // Init default params
      const initialParams = {};
      defaultAlgos.forEach((algo) => {
        initialParams[algo.id] = {};
        algo.params.forEach((p) => {
          initialParams[algo.id][p.id] = p.default;
        });
      });
      setHyperparameters(initialParams);
    }
  }, [selectedDataset]);

  if (!selectedDataset) {
    return (
      <div className="text-center py-16 neu-card p-8 max-w-md mx-auto">
        <Cpu className="w-12 h-12 text-slate-500 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-white">No Dataset Selected</h3>
        <p className="text-xs text-slate-400 mt-1 mb-4">
          Select or upload a dataset before configuring training pipelines.
        </p>
        <Button variant="primary" onClick={() => navigate('/upload-dataset')}>
          Upload Dataset
        </Button>
      </div>
    );
  }

  const currentAvailableAlgos = problemType === 'Classification'
    ? ALGORITHMS.classification
    : ALGORITHMS.regression;

  // Toggle Algorithm selection
  const handleToggleAlgorithm = (algo) => {
    const isSelected = selectedAlgorithms.some((a) => a.id === algo.id);
    if (isSelected) {
      if (selectedAlgorithms.length === 1) {
        addToast({ type: 'warning', message: 'You must select at least one algorithm to train.' });
        return;
      }
      setSelectedAlgorithms(selectedAlgorithms.filter((a) => a.id !== algo.id));
    } else {
      setSelectedAlgorithms([...selectedAlgorithms, algo]);
      // set defaults for this algo
      setHyperparameters((prev) => ({
        ...prev,
        [algo.id]: algo.params.reduce((acc, p) => ({ ...acc, [p.id]: p.default }), {}),
      }));
    }
  };

  const handleStartTraining = async () => {
    if (selectedFeatures.length === 0) {
      addToast({ type: 'error', message: 'Please select at least one input feature.' });
      return;
    }
    if (selectedAlgorithms.length === 0) {
      addToast({ type: 'error', message: 'Please select at least one algorithm to train.' });
      return;
    }

    setIsTraining(true);
    setTrainingComplete(false);
    setTrainingLogs([
      `[INIT] Training job started for dataset: ${selectedDataset.name}`,
      `[TASK] Problem Type: ${problemType} | Target: ${targetColumn}`,
      `[FEATURES] Selected ${selectedFeatures.length} input features: [${selectedFeatures.slice(0, 4).join(', ')}...]`,
      `[QUEUE] Queued ${selectedAlgorithms.length} algorithm pipelines for execution`,
    ]);

    try {
      await trainModels(
        {
          dataset: selectedDataset,
          problemType,
          target: targetColumn,
          features: selectedFeatures,
          algorithms: selectedAlgorithms,
          hyperparameters,
        },
        (progressEvent) => {
          setTrainingProgress(progressEvent);
          if (progressEvent.log) {
            setTrainingLogs((prev) => [...prev, progressEvent.log]);
          }
        }
      );

      setTrainingComplete(true);
      setTrainingLogs((prev) => [
        ...prev,
        `[FINISH] All models trained and saved to registry.`,
        `[READY] Cross-validation scores computed. Proceeding to Model Comparison.`,
      ]);
    } catch (err) {
      setTrainingLogs((prev) => [...prev, `[ERROR] Training interrupted: ${err.message}`]);
    } finally {
      setIsTraining(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#27334A]/80">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-extrabold tracking-tight text-white">Model Training Studio</h2>
            <Badge variant="purple" size="sm">Pipeline Configurator</Badge>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Configure problem type, input features, machine learning algorithms, and hyperparameters.
          </p>
        </div>

        {/* Dataset Switcher */}
        <div className="flex items-center gap-2 bg-[#151E32] p-1.5 rounded-xl border border-[#27334A]">
          <Database className="w-4 h-4 text-purple-400 ml-2" />
          <select
            value={selectedDataset.id}
            onChange={(e) => setSelectedDatasetId(e.target.value)}
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

      {/* Training In Progress or Complete View */}
      {(isTraining || trainingComplete) ? (
        <TrainingProgress
          progress={trainingProgress}
          isFinished={trainingComplete}
          algorithms={selectedAlgorithms}
          logs={trainingLogs}
          onViewComparison={() => navigate('/model-comparison')}
          onReset={() => {
            setIsTraining(false);
            setTrainingComplete(false);
            setTrainingLogs([]);
          }}
        />
      ) : (
        <div className="flex flex-col gap-6">
          {/* STEP 1: Problem Type Selection */}
          <div className="neu-card p-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#27334A] mb-4">
              <div>
                <h3 className="font-bold text-white text-sm">STEP 1: Select Problem Type</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Choose between predicting categorical labels or continuous numerical values.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div
                onClick={() => {
                  setProblemType('Classification');
                  setSelectedAlgorithms(ALGORITHMS.classification.slice(0, 3));
                }}
                className={`p-4 rounded-xl border cursor-pointer flex items-center justify-between transition-all ${
                  problemType === 'Classification'
                    ? 'bg-purple-950/40 border-purple-500 shadow-glow-purple ring-1 ring-purple-500'
                    : 'bg-[#10172A] border-[#27334A] hover:border-slate-600'
                }`}
              >
                <div>
                  <h4 className="font-bold text-white text-sm mb-1">Classification</h4>
                  <p className="text-xs text-slate-400">
                    Predict discrete classes, churn, risk, or pass/fail labels.
                  </p>
                </div>
                <input
                  type="radio"
                  name="problem_type"
                  checked={problemType === 'Classification'}
                  onChange={() => {}}
                  className="accent-purple-600 w-4 h-4"
                />
              </div>

              <div
                onClick={() => {
                  setProblemType('Regression');
                  setSelectedAlgorithms(ALGORITHMS.regression.slice(0, 3));
                }}
                className={`p-4 rounded-xl border cursor-pointer flex items-center justify-between transition-all ${
                  problemType === 'Regression'
                    ? 'bg-purple-950/40 border-purple-500 shadow-glow-purple ring-1 ring-purple-500'
                    : 'bg-[#10172A] border-[#27334A] hover:border-slate-600'
                }`}
              >
                <div>
                  <h4 className="font-bold text-white text-sm mb-1">Regression</h4>
                  <p className="text-xs text-slate-400">
                    Forecast continuous real numbers, prices, sales, or quantities.
                  </p>
                </div>
                <input
                  type="radio"
                  name="problem_type"
                  checked={problemType === 'Regression'}
                  onChange={() => {}}
                  className="accent-purple-600 w-4 h-4"
                />
              </div>
            </div>
          </div>

          {/* STEP 2: Target Column */}
          <div className="neu-card p-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#27334A] mb-4">
              <div>
                <h3 className="font-bold text-white text-sm">STEP 2: Select Target Column (Dependent Variable)</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  The ground-truth column that the algorithms will learn to predict.
                </p>
              </div>
              <Badge variant="amber" size="xs">Target Column</Badge>
            </div>

            <div className="max-w-md">
              <select
                value={targetColumn}
                onChange={(e) => setTargetColumn(e.target.value)}
                className="neu-input w-full py-2.5 text-xs font-semibold"
              >
                {selectedDataset.columnsList?.map((col) => (
                  <option key={col.name} value={col.name}>
                    {col.name} ({col.type})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* STEP 3: Feature Selection */}
          <div className="neu-card p-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#27334A] mb-4">
              <div>
                <h3 className="font-bold text-white text-sm">STEP 3: Select Input Features (Independent Variables)</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Select feature columns used as inputs for model training. Target is excluded automatically.
                </p>
              </div>
              <Badge variant="purple" size="xs">
                {selectedFeatures.length} Features
              </Badge>
            </div>

            <ColumnSelector
              columns={selectedDataset.columnsList || []}
              selectedColumns={selectedFeatures}
              onSelectionChange={setSelectedFeatures}
              targetColumn={targetColumn}
            />
          </div>

          {/* STEP 4: Select Algorithms */}
          <div className="neu-card p-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#27334A] mb-4">
              <div>
                <h3 className="font-bold text-white text-sm">STEP 4: Select Algorithms to Train & Benchmark</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Pick one or multiple algorithms. NeuroML Studio will train and rank them side-by-side.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">
                  Selected <strong className="text-purple-400">{selectedAlgorithms.length}</strong> of{' '}
                  {currentAvailableAlgos.length}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {currentAvailableAlgos.map((algo) => (
                <AlgorithmCard
                  key={algo.id}
                  algorithm={algo}
                  isSelected={selectedAlgorithms.some((a) => a.id === algo.id)}
                  onToggle={() => handleToggleAlgorithm(algo)}
                  onConfigure={() => setActiveParamModalAlgo(algo)}
                />
              ))}
            </div>
          </div>

          {/* STEP 5: Hyperparameters Preview / Notice */}
          <div className="neu-card p-5 bg-gradient-to-r from-[#151E32] to-[#10172A]">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-white text-sm flex items-center gap-2">
                  <Settings className="w-4 h-4 text-purple-400" />
                  <span>STEP 5: Hyperparameter Configuration</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Sensible default hyperparameters have been calibrated. Click "Params" on any card to tune parameters.
                </p>
              </div>
              <Badge variant="blue" size="xs">Auto-Tuned Defaults</Badge>
            </div>
          </div>

          {/* STEP 6: Launch Training Bar */}
          <div className="neu-card p-6 bg-gradient-to-r from-purple-950/40 via-[#151E32] to-[#151E32] border border-purple-500/40 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
            <div>
              <h4 className="text-base font-extrabold text-white">
                Ready to initiate training pipeline?
              </h4>
              <p className="text-xs text-slate-300 mt-1">
                Training {selectedAlgorithms.length} {problemType} algorithms on {selectedFeatures.length} features with 5-fold cross-validation.
              </p>
            </div>

            <Button
              variant="primary"
              size="lg"
              onClick={handleStartTraining}
              leftIcon={Play}
              className="w-full sm:w-auto px-8 shadow-glow-purple"
            >
              Start Training
            </Button>
          </div>
        </div>
      )}

      {/* Hyperparameter Modal */}
      {activeParamModalAlgo && (
        <Modal
          isOpen={!!activeParamModalAlgo}
          onClose={() => setActiveParamModalAlgo(null)}
          title={`Hyperparameters: ${activeParamModalAlgo.name}`}
          subtitle="Configure hyperparameters for this algorithm before training."
          footer={
            <Button variant="primary" size="sm" onClick={() => setActiveParamModalAlgo(null)}>
              Done
            </Button>
          }
        >
          <div className="space-y-4">
            {activeParamModalAlgo.params.map((param) => {
              const currentVal =
                hyperparameters[activeParamModalAlgo.id]?.[param.id] !== undefined
                  ? hyperparameters[activeParamModalAlgo.id][param.id]
                  : param.default;

              return (
                <div key={param.id} className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <label className="font-semibold text-slate-200">{param.label}</label>
                    <span className="font-mono text-purple-400 font-bold">{currentVal}</span>
                  </div>

                  {param.type === 'number' ? (
                    <input
                      type="number"
                      step={param.step || 1}
                      min={param.min}
                      max={param.max}
                      value={currentVal}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setHyperparameters((prev) => ({
                          ...prev,
                          [activeParamModalAlgo.id]: {
                            ...prev[activeParamModalAlgo.id],
                            [param.id]: val,
                          },
                        }));
                      }}
                      className="neu-input py-1.5 text-xs font-mono"
                    />
                  ) : (
                    <select
                      value={currentVal}
                      onChange={(e) => {
                        const val = e.target.value;
                        setHyperparameters((prev) => ({
                          ...prev,
                          [activeParamModalAlgo.id]: {
                            ...prev[activeParamModalAlgo.id],
                            [param.id]: val,
                          },
                        }));
                      }}
                      className="neu-input py-1.5 text-xs"
                    >
                      {param.options.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              );
            })}
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ModelTraining;
