import React from 'react';
import { Award, CheckCircle2, Target, BarChart2, Zap } from 'lucide-react';

export const ModelMetrics = ({ model }) => {
  if (!model) return null;

  const isClassification = model.problemType === 'Classification';

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            <span>Model Performance Metrics</span>
            {model.isBest && (
              <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30 text-[10px] font-bold flex items-center gap-1">
                <Award className="w-3 h-3" /> Best Performer
              </span>
            )}
          </h4>
          <p className="text-xs text-slate-400 mt-0.5">
            Evaluated on holdout test set using 5-fold cross validation.
          </p>
        </div>
      </div>

      {isClassification ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-[#10172A] border border-[#27334A] rounded-xl p-3.5">
            <div className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />
              <span>Accuracy</span>
            </div>
            <div className="text-2xl font-extrabold text-white mt-1">
              {model.accuracy}%
            </div>
            <div className="text-[10px] text-slate-500 mt-1">Overall correctness</div>
          </div>

          <div className="bg-[#10172A] border border-[#27334A] rounded-xl p-3.5">
            <div className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5 text-blue-400" />
              <span>Precision</span>
            </div>
            <div className="text-2xl font-extrabold text-blue-300 mt-1">
              {model.precision}%
            </div>
            <div className="text-[10px] text-slate-500 mt-1">TP / (TP + FP)</div>
          </div>

          <div className="bg-[#10172A] border border-[#27334A] rounded-xl p-3.5">
            <div className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-emerald-400" />
              <span>Recall</span>
            </div>
            <div className="text-2xl font-extrabold text-emerald-300 mt-1">
              {model.recall}%
            </div>
            <div className="text-[10px] text-slate-500 mt-1">TP / (TP + FN)</div>
          </div>

          <div className="bg-[#10172A] border border-[#27334A] rounded-xl p-3.5">
            <div className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
              <BarChart2 className="w-3.5 h-3.5 text-amber-400" />
              <span>F1 Score</span>
            </div>
            <div className="text-2xl font-extrabold text-amber-300 mt-1">
              {model.f1Score}%
            </div>
            <div className="text-[10px] text-slate-500 mt-1">Harmonic mean</div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-[#10172A] border border-[#27334A] rounded-xl p-3.5">
            <div className="text-xs text-slate-400 font-medium">R² Score</div>
            <div className="text-2xl font-extrabold text-purple-400 mt-1">
              {model.r2Score}
            </div>
            <div className="text-[10px] text-slate-500 mt-1">Coefficient of determination</div>
          </div>

          <div className="bg-[#10172A] border border-[#27334A] rounded-xl p-3.5">
            <div className="text-xs text-slate-400 font-medium">MAE</div>
            <div className="text-2xl font-extrabold text-blue-300 mt-1">
              {model.mae}
            </div>
            <div className="text-[10px] text-slate-500 mt-1">Mean Absolute Error</div>
          </div>

          <div className="bg-[#10172A] border border-[#27334A] rounded-xl p-3.5">
            <div className="text-xs text-slate-400 font-medium">MSE</div>
            <div className="text-2xl font-extrabold text-slate-200 mt-1">
              {model.mse}
            </div>
            <div className="text-[10px] text-slate-500 mt-1">Mean Squared Error</div>
          </div>

          <div className="bg-[#10172A] border border-[#27334A] rounded-xl p-3.5">
            <div className="text-xs text-slate-400 font-medium">RMSE</div>
            <div className="text-2xl font-extrabold text-rose-300 mt-1">
              {model.rmse}
            </div>
            <div className="text-[10px] text-slate-500 mt-1">Root Mean Squared Error</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModelMetrics;
