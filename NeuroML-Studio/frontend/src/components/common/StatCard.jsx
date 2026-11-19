import React from 'react';
import { ArrowUpRight } from 'lucide-react';

export const StatCard = ({
  icon: Icon,
  iconBgColor = 'bg-purple-600/20 text-purple-400 border border-purple-500/30',
  title,
  value,
  trend = '+12%',
  trendPositive = true,
  className = '',
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`bg-[#151E32] border border-[#27334A] hover:border-[#3B4A6B] rounded-xl p-5 flex items-center justify-between transition-all duration-200 shadow-lg shadow-black/20 ${onClick ? 'cursor-pointer hover:translate-y-[-2px]' : ''} ${className}`}
    >
      <div className="flex items-center gap-4">
        {Icon && (
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${iconBgColor}`}>
            <Icon className="w-6 h-6" />
          </div>
        )}
        <div>
          <div className="text-2xl font-bold text-white tracking-tight leading-none mb-1">
            {value}
          </div>
          <div className="text-xs font-medium text-slate-400">
            {title}
          </div>
        </div>
      </div>

      {trend && (
        <div className="flex items-center gap-0.5 text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md">
          <ArrowUpRight className="w-3.5 h-3.5" />
          <span>{trend}</span>
        </div>
      )}
    </div>
  );
};

export default StatCard;
