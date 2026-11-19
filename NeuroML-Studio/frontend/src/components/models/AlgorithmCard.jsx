import React from 'react';
import {
  Trees,
  Zap,
  TrendingUp,
  Layers,
  Activity,
  Users,
  GitFork,
  Cpu,
  Shield,
  Sliders,
  Maximize2,
  Check,
} from 'lucide-react';
import Badge from '../common/Badge';

export const AlgorithmCard = ({
  algorithm,
  isSelected = false,
  onToggle,
  onConfigure,
}) => {
  const { id, name, category, description, speed, accuracyRating, icon, recommendedFor } = algorithm;

  // Icon mapping
  const iconMap = {
    Trees,
    Zap,
    TrendingUp,
    Layers,
    Activity,
    Users,
    GitFork,
    Cpu,
    Shield,
    Sliders,
    Maximize2,
  };
  const IconComponent = iconMap[icon] || Cpu;

  return (
    <div
      onClick={onToggle}
      className={`neu-card p-4 flex flex-col justify-between transition-all duration-200 cursor-pointer relative select-none ${
        isSelected
          ? 'border-purple-500 bg-[#1A1F38] shadow-glow-purple ring-1 ring-purple-500'
          : 'hover:border-[#3B4A6B] hover:bg-[#18233D]'
      }`}
    >
      <div>
        {/* Top Header */}
        <div className="flex items-start justify-between gap-3 mb-2.5">
          <div className="flex items-center gap-2.5">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                isSelected
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/40'
                  : 'bg-purple-500/10 text-purple-400 border border-purple-500/30'
              }`}
            >
              <IconComponent className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-white leading-tight">{name}</h4>
              <span className="text-[10px] text-purple-400 font-semibold tracking-wide uppercase">
                {category}
              </span>
            </div>
          </div>

          <div
            className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 transition-all ${
              isSelected
                ? 'bg-purple-600 text-white scale-110'
                : 'border border-slate-600 hover:border-slate-400'
            }`}
          >
            {isSelected && <Check className="w-3.5 h-3.5" />}
          </div>
        </div>

        {/* Description */}
        <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed mb-3">
          {description}
        </p>
      </div>

      {/* Meta tags & Configure Action */}
      <div className="pt-2.5 border-t border-[#27334A]/60 flex items-center justify-between text-[11px]">
        <div className="flex items-center gap-2 text-slate-400">
          <span>Speed: <strong className="text-slate-200">{speed}</strong></span>
          <span>•</span>
          <span>Acc: <strong className="text-emerald-400">{accuracyRating}</strong></span>
        </div>

        {onConfigure && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onConfigure(algorithm);
            }}
            className="text-xs text-purple-400 hover:text-purple-300 font-semibold hover:underline"
          >
            Params
          </button>
        )}
      </div>
    </div>
  );
};

export default AlgorithmCard;
