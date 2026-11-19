import React, { useEffect, useRef } from 'react';
import { Loader2, CheckCircle2, Terminal, AlertCircle, Sparkles } from 'lucide-react';
import Button from '../common/Button';

export const TrainingProgress = ({
  progress,
  isFinished = false,
  algorithms = [],
  logs = [],
  onViewComparison,
  onReset,
}) => {
  const terminalEndRef = useRef(null);

  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  return (
    <div className="neu-card p-6 flex flex-col gap-6 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#27334A]">
        <div>
          <div className="flex items-center gap-2.5">
            {isFinished ? (
              <CheckCircle2 className="w-6 h-6 text-emerald-400" />
            ) : (
              <Loader2 className="w-6 h-6 text-purple-400 animate-spin" />
            )}
            <h3 className="text-lg font-bold text-white">
              {isFinished ? 'Model Training Completed!' : 'Training Models in Progress...'}
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {isFinished
              ? 'All selected algorithms have successfully converged and evaluation metrics were generated.'
              : `Executing cross-validation and hyperparameter optimization across ${algorithms.length} algorithms.`}
          </p>
        </div>

        {isFinished && (
          <div className="flex items-center gap-3">
            <Button variant="secondary" size="sm" onClick={onReset}>
              Train Another
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={onViewComparison}
              rightIcon={Sparkles}
            >
              Compare Results
            </Button>
          </div>
        )}
      </div>

      {/* Progress Bar */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between text-xs font-semibold">
          <span className="text-slate-300">
            {isFinished
              ? '100% Completed'
              : `Training: ${progress?.currentAlgo || 'Initializing...'} (${progress?.currentIdx || 1}/${progress?.totalAlgos || algorithms.length})`}
          </span>
          <span className="text-purple-400 font-mono text-sm">
            {isFinished ? 100 : progress?.percent || 0}%
          </span>
        </div>

        <div className="w-full h-3 rounded-full bg-[#10172A] overflow-hidden p-0.5 border border-[#27334A]">
          <div
            className="h-full rounded-full bg-gradient-to-r from-purple-600 via-blue-500 to-emerald-400 transition-all duration-300 shadow-glow-purple"
            style={{ width: `${isFinished ? 100 : progress?.percent || 0}%` }}
          />
        </div>
      </div>

      {/* Algorithms Checklist */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
        {algorithms.map((algo, idx) => {
          const currentAlgoIdx = progress?.currentIdx || 0;
          const isDone = isFinished || idx + 1 < currentAlgoIdx;
          const isCurrent = !isFinished && idx + 1 === currentAlgoIdx;

          return (
            <div
              key={algo.id}
              className={`p-3 rounded-xl border text-xs flex items-center justify-between transition-all ${
                isDone
                  ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-300'
                  : isCurrent
                  ? 'bg-purple-950/40 border-purple-500 text-purple-200 shadow-glow-purple'
                  : 'bg-[#10172A] border-[#27334A] text-slate-500'
              }`}
            >
              <div className="flex items-center gap-2 truncate">
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : isCurrent ? (
                  <Loader2 className="w-4 h-4 text-purple-400 animate-spin shrink-0" />
                ) : (
                  <div className="w-4 h-4 rounded-full border border-slate-700 shrink-0" />
                )}
                <span className="font-semibold truncate">{algo.name}</span>
              </div>
              <span className="text-[10px] uppercase font-mono font-bold ml-1 shrink-0">
                {isDone ? 'DONE' : isCurrent ? 'TRAINING' : 'PENDING'}
              </span>
            </div>
          );
        })}
      </div>

      {/* Console Log Terminal Window */}
      <div className="rounded-xl bg-[#090D1A] border border-[#27334A] overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between px-4 py-2.5 bg-[#10172A] border-b border-[#27334A] text-xs">
          <div className="flex items-center gap-2 text-slate-300 font-mono">
            <Terminal className="w-4 h-4 text-purple-400" />
            <span>Training Logs & Terminal Output</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
          </div>
        </div>

        <div className="p-4 font-mono text-xs text-slate-300 max-h-52 overflow-y-auto space-y-1.5 selection:bg-purple-500/40">
          {logs.map((log, index) => (
            <div
              key={index}
              className={`leading-relaxed ${
                log.includes('SUCCESS')
                  ? 'text-emerald-400 font-semibold'
                  : log.includes('TRAIN')
                  ? 'text-blue-300'
                  : log.includes('ERROR')
                  ? 'text-rose-400'
                  : 'text-slate-400'
              }`}
            >
              {log}
            </div>
          ))}
          <div ref={terminalEndRef} />
        </div>
      </div>
    </div>
  );
};

export default TrainingProgress;
