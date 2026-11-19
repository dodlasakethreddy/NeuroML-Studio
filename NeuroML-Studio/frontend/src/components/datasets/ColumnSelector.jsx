import React, { useState, useMemo } from 'react';
import { Search, CheckSquare, Square, Check } from 'lucide-react';
import Badge from '../common/Badge';

export const ColumnSelector = ({
  columns = [],
  selectedColumns = [],
  onSelectionChange,
  targetColumn,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Filter columns
  const filteredColumns = useMemo(() => {
    if (!searchTerm.trim()) return columns;
    return columns.filter((col) =>
      col.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [columns, searchTerm]);

  const handleToggle = (colName) => {
    if (colName === targetColumn) return; // target cannot be an input feature
    if (selectedColumns.includes(colName)) {
      onSelectionChange(selectedColumns.filter((c) => c !== colName));
    } else {
      onSelectionChange([...selectedColumns, colName]);
    }
  };

  const handleSelectAll = () => {
    const allExceptTarget = columns
      .filter((c) => c.name !== targetColumn)
      .map((c) => c.name);
    onSelectionChange(allExceptTarget);
  };

  const handleDeselectAll = () => {
    onSelectionChange([]);
  };

  return (
    <div className="neu-card p-4 flex flex-col gap-3">
      {/* Search & Actions Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#27334A]">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search features..."
            className="neu-input w-full pl-8 py-1.5 text-xs"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleSelectAll}
            className="px-2.5 py-1 text-xs font-medium rounded-lg bg-[#10172A] hover:bg-slate-800 text-slate-300 border border-[#27334A] transition-colors"
          >
            Select All
          </button>
          <button
            type="button"
            onClick={handleDeselectAll}
            className="px-2.5 py-1 text-xs font-medium rounded-lg bg-[#10172A] hover:bg-slate-800 text-slate-300 border border-[#27334A] transition-colors"
          >
            Deselect All
          </button>
        </div>
      </div>

      {/* Selected Counter */}
      <div className="flex items-center justify-between text-xs text-slate-400">
        <span>
          Selected <strong className="text-purple-400">{selectedColumns.length}</strong> of{' '}
          {columns.filter((c) => c.name !== targetColumn).length} features
        </span>
        {targetColumn && (
          <span className="text-[11px] text-amber-400">
            Target: <strong>{targetColumn}</strong> (excluded from inputs)
          </span>
        )}
      </div>

      {/* Columns Checkbox Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 max-h-64 overflow-y-auto pr-1">
        {filteredColumns.map((col) => {
          const isTarget = col.name === targetColumn;
          const isSelected = selectedColumns.includes(col.name);

          return (
            <div
              key={col.name}
              onClick={() => !isTarget && handleToggle(col.name)}
              className={`p-2.5 rounded-lg border flex items-center justify-between text-xs transition-colors ${
                isTarget
                  ? 'bg-amber-950/20 border-amber-500/30 opacity-60 cursor-not-allowed'
                  : isSelected
                  ? 'bg-purple-950/30 border-purple-500/50 cursor-pointer'
                  : 'bg-[#10172A] border-[#27334A] hover:border-slate-600 cursor-pointer'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div
                  className={`w-4 h-4 rounded flex items-center justify-center shrink-0 transition-colors ${
                    isSelected
                      ? 'bg-purple-600 text-white'
                      : 'border border-slate-600'
                  }`}
                >
                  {isSelected && <Check className="w-3 h-3" />}
                </div>
                <span className="font-semibold text-slate-200 truncate" title={col.name}>
                  {col.name}
                </span>
              </div>

              <div className="flex items-center gap-1.5 shrink-0 ml-2">
                <span className="text-[10px] font-mono text-slate-400">
                  {col.type || 'text'}
                </span>
                {isTarget && (
                  <Badge variant="amber" size="xs">
                    Target
                  </Badge>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ColumnSelector;
