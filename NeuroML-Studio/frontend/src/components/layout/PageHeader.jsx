import React from 'react';

export const PageHeader = ({
  title,
  subtitle,
  actions,
  badge,
  className = '',
}) => {
  return (
    <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-6 border-b border-[#27334A]/80 ${className}`}>
      <div>
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-extrabold tracking-tight text-white">{title}</h2>
          {badge}
        </div>
        {subtitle && <p className="text-xs text-slate-400 mt-1 max-w-2xl">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-3 shrink-0">{actions}</div>}
    </div>
  );
};

export default PageHeader;
