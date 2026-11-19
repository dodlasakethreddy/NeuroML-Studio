import React from 'react';
import { Database, Calendar, Layers, Sparkles, Sliders, Cpu, Trash2 } from 'lucide-react';
import Badge from '../common/Badge';

export const DatasetCard = ({
  dataset,
  onSelect,
  onExplore,
  onPreprocess,
  onTrain,
  onDelete,
  isSelected = false,
}) => {
  const {
    name,
    type,
    rows,
    columns,
    target,
    uploadDate,
    status = 'Ready',
    fileSize,
    description,
  } = dataset;

  return (
    <div
      onClick={onSelect}
      className={`neu-card p-5 flex flex-col justify-between transition-all duration-200 cursor-pointer ${
        isSelected
          ? 'border-purple-500 shadow-glow-purple bg-[#18233D]'
          : 'hover:border-[#3B4A6B] hover:translate-y-[-2px]'
      }`}
    >
      <div>
        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600/10 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm line-clamp-1 hover:text-purple-300">
                {name}
              </h3>
              <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-400">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {uploadDate}
                </span>
                <span>•</span>
                <span>{fileSize || '120 KB'}</span>
              </div>
            </div>
          </div>
          <Badge variant={status === 'Ready' ? 'green' : 'amber'} size="xs">
            {status}
          </Badge>
        </div>

        {/* Description */}
        {description && (
          <p className="text-xs text-slate-400 line-clamp-2 mb-4 leading-relaxed">
            {description}
          </p>
        )}

        {/* Metric Badges */}
        <div className="grid grid-cols-3 gap-2 bg-[#10172A] p-2.5 rounded-lg border border-[#27334A] text-center mb-4">
          <div>
            <div className="text-[10px] text-slate-400 font-medium">Rows</div>
            <div className="text-xs font-bold text-white mt-0.5">
              {rows?.toLocaleString()}
            </div>
          </div>
          <div>
            <div className="text-[10px] text-slate-400 font-medium">Columns</div>
            <div className="text-xs font-bold text-white mt-0.5">{columns}</div>
          </div>
          <div>
            <div className="text-[10px] text-slate-400 font-medium">Target</div>
            <div className="text-xs font-bold text-purple-400 mt-0.5 truncate max-w-[65px] mx-auto" title={target}>
              {target || 'None'}
            </div>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-[#27334A]/60">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onExplore && onExplore(dataset);
            }}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-purple-600/30 text-slate-300 hover:text-purple-300 border border-[#27334A] transition-colors"
            title="Explore Dataset"
          >
            <Sparkles className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onPreprocess && onPreprocess(dataset);
            }}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-blue-600/30 text-slate-300 hover:text-blue-300 border border-[#27334A] transition-colors"
            title="Preprocess Dataset"
          >
            <Sliders className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onTrain && onTrain(dataset);
            }}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-emerald-600/30 text-slate-300 hover:text-emerald-300 border border-[#27334A] transition-colors"
            title="Train Models"
          >
            <Cpu className="w-3.5 h-3.5" />
          </button>
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDelete && onDelete(dataset.id);
          }}
          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
          title="Delete Dataset"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

export default DatasetCard;
