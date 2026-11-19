import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TrendingUp,
  Cpu,
  Zap,
  Clock,
  Sparkles,
  Download,
  CheckCircle2,
  AlertTriangle,
  History,
  Activity,
  Layers,
} from 'lucide-react';
import { useDataset } from '../context/DatasetContext';
import PageHeader from '../components/layout/PageHeader';
import PredictionForm from '../components/models/PredictionForm';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';

export const Predictions = () => {
  const navigate = useNavigate();
  const {
    models,
    selectedModel,
    selectedModelId,
    setSelectedModelId,
    selectedDataset,
    predictions,
    makePrediction,
  } = useDataset();

  const [isPredicting, setIsPredicting] = useState(false);
  const [latestPrediction, setLatestPrediction] = useState(predictions[0] || null);

  if (!models || models.length === 0) {
    return (
      <div className="text-center py-16 neu-card p-8 max-w-md mx-auto">
        <Cpu className="w-12 h-12 text-slate-500 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-white">No Trained Models Available</h3>
        <p className="text-xs text-slate-400 mt-1 mb-4">
          You must train or save at least one machine learning model before generating predictions.
        </p>
        <Button variant="primary" onClick={() => navigate('/model-training')}>
          Train Models Now
        </Button>
      </div>
    );
  }

  const activeModel = selectedModel || models[0];

  const handlePredictSubmit = async (formData) => {
    setIsPredicting(true);
    try {
      const result = await makePrediction(activeModel, formData);
      setLatestPrediction(result);
    } catch (err) {
      console.error(err);
    } finally {
      setIsPredicting(false);
    }
  };

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(predictions, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `neuroml_predictions_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#27334A]/80">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-extrabold tracking-tight text-white">Inference & Prediction Studio</h2>
            <Badge variant="green" size="sm">Live Scoring</Badge>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Generate real-time inferences with dynamic feature forms and confidence intervals.
          </p>
        </div>

        {/* Model Switcher */}
        <div className="flex items-center gap-2 bg-[#151E32] p-1.5 rounded-xl border border-[#27334A]">
          <Cpu className="w-4 h-4 text-purple-400 ml-2" />
          <select
            value={activeModel.id}
            onChange={(e) => setSelectedModelId(e.target.value)}
            className="bg-transparent text-xs text-white font-semibold pr-4 py-1 focus:outline-none cursor-pointer max-w-xs truncate"
          >
            {models.map((m) => (
              <option key={m.id} value={m.id} className="bg-[#10172A] text-slate-200">
                {m.name} ({m.algorithm})
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Form Input Panel */}
        <div className="lg:col-span-2 neu-card p-5 flex flex-col gap-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#27334A]">
            <div>
              <h3 className="font-bold text-white text-sm">Feature Input Payload</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Model: <strong className="text-purple-400">{activeModel.name}</strong> • Target: <span className="text-amber-400 font-semibold">{activeModel.target}</span>
              </p>
            </div>
            <Badge variant={activeModel.problemType === 'Classification' ? 'purple' : 'blue'} size="xs">
              {activeModel.problemType}
            </Badge>
          </div>

          <PredictionForm
            model={activeModel}
            dataset={selectedDataset}
            onPredict={handlePredictSubmit}
            isLoading={isPredicting}
          />
        </div>

        {/* Right Col: Prediction Result Showcase */}
        <div className="flex flex-col gap-5">
          <div className="neu-card p-5 bg-gradient-to-br from-purple-950/40 via-[#151E32] to-[#10172A] border border-purple-500/40 flex flex-col justify-between shadow-2xl">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-[#27334A]/80 mb-4">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-emerald-400" />
                  <h3 className="font-bold text-white text-sm">Prediction Output</h3>
                </div>
                {latestPrediction && (
                  <span className="text-[10px] text-slate-400 font-mono">
                    {latestPrediction.latency || '22ms'}
                  </span>
                )}
              </div>

              {latestPrediction ? (
                <div className="flex flex-col gap-4">
                  {/* Predicted Value Card */}
                  <div className="p-4 rounded-xl bg-[#10172A]/80 border border-[#27334A] text-center">
                    <span className="text-xs text-slate-400 font-medium uppercase tracking-wider block mb-1">
                      Predicted Outcome
                    </span>
                    <div className="text-2xl font-black text-white tracking-tight leading-snug">
                      {latestPrediction.prediction}
                    </div>
                  </div>

                  {/* Confidence Gauge for Classification */}
                  {latestPrediction.confidence !== null && latestPrediction.confidence !== undefined && (
                    <div className="p-3.5 rounded-xl bg-[#10172A]/60 border border-[#27334A]">
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <span className="text-slate-400 font-medium">Model Confidence</span>
                        <span className="font-bold text-emerald-400 font-mono">
                          {(latestPrediction.confidence * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-purple-500 to-emerald-400 transition-all duration-500"
                          style={{ width: `${latestPrediction.confidence * 100}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Class Probabilities Breakdown */}
                  {latestPrediction.probabilities && (
                    <div className="space-y-2">
                      <span className="text-xs font-semibold text-slate-300">
                        Class Probabilities:
                      </span>
                      {latestPrediction.probabilities.map((prob, idx) => (
                        <div key={idx} className="flex items-center justify-between text-xs p-2 rounded-lg bg-[#10172A] border border-[#27334A]">
                          <span className="text-slate-300">{prob.label}</span>
                          <span className="font-mono text-purple-300 font-bold">{prob.percent}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Timestamp & Metadata */}
                  <div className="text-[11px] text-slate-400 pt-2 border-t border-[#27334A] space-y-1">
                    <div className="flex justify-between">
                      <span>Evaluated Model:</span>
                      <strong className="text-slate-200">{latestPrediction.modelName}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Timestamp:</span>
                      <span className="font-mono text-slate-300">{latestPrediction.timestamp}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-12 text-center text-slate-400 flex flex-col items-center">
                  <Activity className="w-10 h-10 text-slate-600 mb-2" />
                  <p className="text-xs">Fill out the feature form and click "Generate Prediction" to view inferences.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Prediction History Table */}
      <div className="neu-card overflow-hidden">
        <div className="p-4 border-b border-[#27334A] flex items-center justify-between bg-[#10172A]/50">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-purple-400" />
            <div>
              <h3 className="text-sm font-bold text-white">Prediction History Log</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Past inference runs recorded during this session.
              </p>
            </div>
          </div>

          <Button
            variant="secondary"
            size="sm"
            onClick={handleExportJSON}
            leftIcon={Download}
          >
            Export JSON
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead className="bg-[#10172A] border-b border-[#27334A] text-slate-400 font-semibold uppercase text-[10px]">
              <tr>
                <th className="p-3.5">Timestamp</th>
                <th className="p-3.5">Model</th>
                <th className="p-3.5">Dataset</th>
                <th className="p-3.5">Prediction Result</th>
                <th className="p-3.5">Confidence</th>
                <th className="p-3.5">Latency</th>
                <th className="p-3.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#27334A]/40 text-slate-200">
              {predictions.map((p) => (
                <tr key={p.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="p-3.5 font-mono text-slate-400">{p.timestamp}</td>
                  <td className="p-3.5 font-semibold text-white">{p.modelName}</td>
                  <td className="p-3.5 text-slate-400">{p.datasetName}</td>
                  <td className="p-3.5 font-bold text-purple-300">{p.prediction}</td>
                  <td className="p-3.5 font-mono">
                    {p.confidence ? `${(p.confidence * 100).toFixed(1)}%` : '-'}
                  </td>
                  <td className="p-3.5 font-mono text-slate-400">{p.latency || '21ms'}</td>
                  <td className="p-3.5">
                    <Badge variant="green" size="xs">Success</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Predictions;
