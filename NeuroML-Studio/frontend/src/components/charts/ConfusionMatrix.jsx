import React from 'react';

export const ConfusionMatrix = ({ data, labels = ['Negative (0)', 'Positive (1)'] }) => {
  // data: [[TN, FP], [FN, TP]]
  const matrix = data || [
    [240, 7],
    [8, 105],
  ];

  const tn = matrix[0][0];
  const fp = matrix[0][1];
  const fn = matrix[1][0];
  const tp = matrix[1][1];

  const total = tn + fp + fn + tp;
  const accuracy = total > 0 ? ((tp + tn) / total) * 100 : 0;
  const precision = (tp + fp) > 0 ? (tp / (tp + fp)) * 100 : 0;
  const recall = (tp + fn) > 0 ? (tp / (tp + fn)) * 100 : 0;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between text-xs">
        <span className="text-slate-400 font-semibold">Binary Confusion Matrix</span>
        <span className="text-slate-400">Total samples evaluated: <strong className="text-white">{total}</strong></span>
      </div>

      <div className="flex flex-col items-center">
        {/* Top predicted header */}
        <div className="text-xs font-bold text-purple-400 uppercase tracking-wider mb-2">
          Predicted Class
        </div>

        <div className="flex items-center gap-3">
          {/* Left actual label */}
          <div className="text-xs font-bold text-blue-400 uppercase tracking-wider -rotate-90 origin-center whitespace-nowrap">
            Actual Class
          </div>

          {/* 2x2 Matrix Grid */}
          <div className="grid grid-cols-2 gap-2">
            {/* Top-Left: True Negative */}
            <div className="w-36 h-28 rounded-xl bg-purple-950/40 border border-purple-500/40 p-3 flex flex-col justify-between hover:border-purple-400 transition-colors">
              <span className="text-[10px] text-purple-300 font-semibold uppercase">True Negative (TN)</span>
              <div className="text-3xl font-extrabold text-white text-center">{tn}</div>
              <span className="text-[10px] text-slate-400 text-center">Correctly predicted Neg</span>
            </div>

            {/* Top-Right: False Positive */}
            <div className="w-36 h-28 rounded-xl bg-rose-950/30 border border-rose-500/30 p-3 flex flex-col justify-between hover:border-rose-400 transition-colors">
              <span className="text-[10px] text-rose-400 font-semibold uppercase">False Positive (FP)</span>
              <div className="text-3xl font-extrabold text-rose-300 text-center">{fp}</div>
              <span className="text-[10px] text-slate-400 text-center">Type I Error</span>
            </div>

            {/* Bottom-Left: False Negative */}
            <div className="w-36 h-28 rounded-xl bg-rose-950/30 border border-rose-500/30 p-3 flex flex-col justify-between hover:border-rose-400 transition-colors">
              <span className="text-[10px] text-rose-400 font-semibold uppercase">False Negative (FN)</span>
              <div className="text-3xl font-extrabold text-rose-300 text-center">{fn}</div>
              <span className="text-[10px] text-slate-400 text-center">Type II Error</span>
            </div>

            {/* Bottom-Right: True Positive */}
            <div className="w-36 h-28 rounded-xl bg-emerald-950/40 border border-emerald-500/40 p-3 flex flex-col justify-between hover:border-emerald-400 transition-colors">
              <span className="text-[10px] text-emerald-400 font-semibold uppercase">True Positive (TP)</span>
              <div className="text-3xl font-extrabold text-white text-center">{tp}</div>
              <span className="text-[10px] text-slate-400 text-center">Correctly predicted Pos</span>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-3 gap-2 pt-2">
        <div className="bg-[#10172A] border border-[#27334A] p-2.5 rounded-lg text-center">
          <div className="text-[10px] text-slate-400 font-medium">Accuracy</div>
          <div className="text-sm font-bold text-white mt-0.5">{accuracy.toFixed(1)}%</div>
        </div>
        <div className="bg-[#10172A] border border-[#27334A] p-2.5 rounded-lg text-center">
          <div className="text-[10px] text-slate-400 font-medium">Precision</div>
          <div className="text-sm font-bold text-purple-400 mt-0.5">{precision.toFixed(1)}%</div>
        </div>
        <div className="bg-[#10172A] border border-[#27334A] p-2.5 rounded-lg text-center">
          <div className="text-[10px] text-slate-400 font-medium">Recall (Sensitivity)</div>
          <div className="text-sm font-bold text-emerald-400 mt-0.5">{recall.toFixed(1)}%</div>
        </div>
      </div>
    </div>
  );
};

export default ConfusionMatrix;
