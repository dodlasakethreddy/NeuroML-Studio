import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart3,
  Award,
  Zap,
  ArrowRight,
  Target,
  CheckCircle2,
  Sliders,
  Cpu,
  Layers,
  ChevronDown,
} from 'lucide-react';
import { useDataset } from '../context/DatasetContext';
import PageHeader from '../components/layout/PageHeader';
import PerformanceChart from '../components/charts/PerformanceChart';
import ConfusionMatrix from '../components/charts/ConfusionMatrix';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';

export const ModelComparison = () => {
  const navigate = useNavigate();
  const { models, setSelectedModelId } = useDataset();

  // Tab for Problem Type: 'Classification' vs 'Regression'
  const [activeType, setActiveType] = useState('Classification');
  const [selectedModelForInspection, setSelectedModelForInspection] = useState(null);

  // Filter models by problem type
  const relevantModels = models.filter((m) => m.problemType === activeType);

  // Sort: Classification by Accuracy desc, Regression by R2Score desc
  const sortedModels = [...relevantModels].sort((a, b) => {
    if (activeType === 'Classification') {
      return (b.accuracy || 0) - (a.accuracy || 0);
    } else {
      return (b.r2Score || 0) - (a.r2Score || 0);
    }
  });

  const bestModel = sortedModels[0] || null;
  const currentInspectedModel = selectedModelForInspection || bestModel;

  const handleUseForPrediction = (model) => {
    setSelectedModelId(model.id);
    navigate('/predictions');
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <PageHeader
        title="Model Comparison & Evaluation"
        subtitle="Benchmark multiple algorithms head-to-head using multi-metric scorecards, confusion matrices, and convergence dynamics."
        actions={
          <div className="flex items-center gap-2 bg-[#151E32] p-1 rounded-xl border border-[#27334A]">
            <button
              onClick={() => {
                setActiveType('Classification');
                setSelectedModelForInspection(null);
              }}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                activeType === 'Classification'
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Classification Models
            </button>
            <button
              onClick={() => {
                setActiveType('Regression');
                setSelectedModelForInspection(null);
              }}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                activeType === 'Regression'
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Regression Models
            </button>
          </div>
        }
      />

      {/* Best Model Highlight Banner */}
      {bestModel && (
        <div className="neu-card p-6 bg-gradient-to-r from-purple-950/40 via-[#151E32] to-[#10172A] border border-purple-500/40 flex flex-col md:flex-row items-center justify-between gap-5 shadow-xl">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center shrink-0 shadow-lg shadow-amber-500/20">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold tracking-wider text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/30">
                  Best Performing Model
                </span>
                <span className="text-xs text-slate-400">• {bestModel.datasetName}</span>
              </div>
              <h3 className="text-lg font-extrabold text-white mt-1">
                {bestModel.name}
              </h3>
              <p className="text-xs text-slate-300 mt-0.5">
                Outperformed other algorithms with highest test validation score.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-xs text-slate-400 font-medium">
                {activeType === 'Classification' ? 'Validation Accuracy' : 'R² Score'}
              </div>
              <div className="text-3xl font-extrabold text-purple-400 mt-0.5">
                {activeType === 'Classification' ? `${bestModel.accuracy}%` : bestModel.r2Score}
              </div>
            </div>

            <Button
              variant="primary"
              onClick={() => handleUseForPrediction(bestModel)}
              rightIcon={Zap}
            >
              Use for Prediction
            </Button>
          </div>
        </div>
      )}

      {/* Performance Comparison Chart */}
      <div className="neu-card p-5">
        <div className="pb-3 border-b border-[#27334A] mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-purple-400" />
            <h3 className="font-bold text-white text-sm">Algorithm Performance Comparison</h3>
          </div>
          <Badge variant="purple" size="xs">{sortedModels.length} Models</Badge>
        </div>

        <PerformanceChart
          models={sortedModels}
          problemType={activeType}
          height={280}
        />
      </div>

      {/* Performance Comparison Table */}
      <div className="neu-card overflow-hidden">
        <div className="p-4 border-b border-[#27334A] flex items-center justify-between bg-[#10172A]/50">
          <div>
            <h3 className="text-sm font-bold text-white">Metrics Leaderboard</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Ranked models with precision, recall, F1, and latency metrics.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead className="bg-[#10172A] border-b border-[#27334A] text-slate-400 font-semibold uppercase text-[10px]">
              <tr>
                <th className="p-3.5">Rank</th>
                <th className="p-3.5">Algorithm</th>
                <th className="p-3.5">Dataset</th>
                {activeType === 'Classification' ? (
                  <>
                    <th className="p-3.5">Accuracy</th>
                    <th className="p-3.5">Precision</th>
                    <th className="p-3.5">Recall</th>
                    <th className="p-3.5">F1 Score</th>
                  </>
                ) : (
                  <>
                    <th className="p-3.5">R² Score</th>
                    <th className="p-3.5">MAE</th>
                    <th className="p-3.5">MSE</th>
                    <th className="p-3.5">RMSE</th>
                  </>
                )}
                <th className="p-3.5">Duration</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#27334A]/40 text-slate-200">
              {sortedModels.map((m, idx) => {
                const isSelected = currentInspectedModel?.id === m.id;
                return (
                  <tr
                    key={m.id}
                    onClick={() => setSelectedModelForInspection(m)}
                    className={`cursor-pointer transition-colors ${
                      isSelected ? 'bg-purple-950/30' : 'hover:bg-slate-800/40'
                    }`}
                  >
                    <td className="p-3.5 font-bold">
                      {idx === 0 ? (
                        <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center text-xs">
                          1
                        </span>
                      ) : (
                        <span className="text-slate-400 font-mono pl-2">{idx + 1}</span>
                      )}
                    </td>
                    <td className="p-3.5 font-semibold text-white">
                      <div className="flex items-center gap-2">
                        <span>{m.algorithm}</span>
                        {m.isBest && <Badge variant="amber" size="xs">Best</Badge>}
                      </div>
                    </td>
                    <td className="p-3.5 text-slate-400">{m.datasetName}</td>

                    {activeType === 'Classification' ? (
                      <>
                        <td className="p-3.5 font-bold text-purple-400">{m.accuracy}%</td>
                        <td className="p-3.5 text-blue-300">{m.precision}%</td>
                        <td className="p-3.5 text-emerald-300">{m.recall}%</td>
                        <td className="p-3.5 text-amber-300 font-semibold">{m.f1Score}%</td>
                      </>
                    ) : (
                      <>
                        <td className="p-3.5 font-bold text-purple-400">{m.r2Score}</td>
                        <td className="p-3.5 text-blue-300">{m.mae}</td>
                        <td className="p-3.5 text-slate-300">{m.mse}</td>
                        <td className="p-3.5 text-rose-300">{m.rmse}</td>
                      </>
                    )}

                    <td className="p-3.5 text-slate-400 font-mono">{m.duration || '2.1s'}</td>
                    <td className="p-3.5 text-right">
                      <Button
                        variant="primary"
                        size="xs"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUseForPrediction(m);
                        }}
                      >
                        Predict
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Deep-Dive Inspection Card: Confusion Matrix / Residuals */}
      {currentInspectedModel && (
        <div className="neu-card p-5">
          <div className="pb-3 border-b border-[#27334A] mb-4 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-white text-sm">
                Detailed Evaluation: {currentInspectedModel.name}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {activeType === 'Classification'
                  ? 'Confusion matrix and class-level diagnostic metrics.'
                  : 'Residual distribution and error variance.'}
              </p>
            </div>
            <Button
              variant="outline"
              size="xs"
              onClick={() => handleUseForPrediction(currentInspectedModel)}
              rightIcon={ArrowRight}
            >
              Test with Live Inputs
            </Button>
          </div>

          {activeType === 'Classification' ? (
            <ConfusionMatrix data={currentInspectedModel.confusionMatrix?.matrix} />
          ) : (
            <div className="p-6 text-center text-xs text-slate-400">
              <p>Regression Residual Diagnostics: Mean Squared Error {currentInspectedModel.mse}, MAE {currentInspectedModel.mae}.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ModelComparison;
