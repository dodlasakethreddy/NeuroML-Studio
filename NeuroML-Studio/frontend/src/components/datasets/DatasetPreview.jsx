import React from 'react';
import { Database, Columns, AlertTriangle, Layers, ArrowRight } from 'lucide-react';
import Button from '../common/Button';
import Badge from '../common/Badge';

export const DatasetPreview = ({
  dataset,
  onContinueToExplorer,
  onContinueToPreprocessing,
}) => {
  if (!dataset) return null;

  const {
    name,
    rows,
    columns,
    columnsList = [],
    previewRows = [],
    missingValues = 0,
    duplicates = 0,
    fileSize,
  } = dataset;

  const headers = columnsList.length > 0
    ? columnsList.map((c) => c.name)
    : previewRows[0]
    ? Object.keys(previewRows[0])
    : [];

  return (
    <div className="flex flex-col gap-6">
      {/* Dataset Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-[#10172A] border border-[#27334A] rounded-xl p-3.5 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">Total Rows</div>
            <div className="text-lg font-bold text-white leading-tight">
              {rows?.toLocaleString() || previewRows.length}
            </div>
          </div>
        </div>

        <div className="bg-[#10172A] border border-[#27334A] rounded-xl p-3.5 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
            <Columns className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">Total Columns</div>
            <div className="text-lg font-bold text-white leading-tight">
              {columns || headers.length}
            </div>
          </div>
        </div>

        <div className="bg-[#10172A] border border-[#27334A] rounded-xl p-3.5 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">Missing Values</div>
            <div className="text-lg font-bold text-white leading-tight">
              {missingValues}
            </div>
          </div>
        </div>

        <div className="bg-[#10172A] border border-[#27334A] rounded-xl p-3.5 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">File Size</div>
            <div className="text-lg font-bold text-white leading-tight">
              {fileSize || '380 KB'}
            </div>
          </div>
        </div>
      </div>

      {/* Column Schema Pills */}
      {columnsList.length > 0 && (
        <div className="bg-[#10172A] border border-[#27334A] rounded-xl p-4">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2.5">
            Detected Column Types ({columnsList.length})
          </h4>
          <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto pr-1">
            {columnsList.map((col, idx) => (
              <div
                key={idx}
                className="px-2.5 py-1 rounded-md bg-[#151E32] border border-[#27334A] text-[11px] flex items-center gap-1.5"
              >
                <span className="font-semibold text-slate-200">{col.name}</span>
                <span className="text-[10px] text-purple-400 font-mono">
                  {col.type || 'text'}
                </span>
                {col.isTarget && (
                  <span className="px-1 py-0.2 rounded bg-amber-500/20 text-amber-300 text-[9px] font-bold">
                    TARGET
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 10-Row Preview Table */}
      <div className="neu-card overflow-hidden">
        <div className="p-4 border-b border-[#27334A] flex items-center justify-between bg-[#10172A]/50">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-bold text-white">Dataset Preview</h4>
            <Badge variant="purple" size="xs">First 10 Rows</Badge>
          </div>
          <span className="text-xs text-slate-400">{name}</span>
        </div>

        <div className="overflow-x-auto max-h-80">
          <table className="w-full text-left border-collapse text-xs">
            <thead className="sticky top-0 bg-[#10172A] border-b border-[#27334A]">
              <tr>
                <th className="p-3 text-slate-500 font-mono text-[10px]">#</th>
                {headers.map((h, i) => (
                  <th key={i} className="p-3 text-slate-300 font-semibold whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#27334A]/40 font-mono text-[11px]">
              {previewRows.map((row, rIdx) => (
                <tr key={rIdx} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-3 text-slate-500">{rIdx + 1}</td>
                  {headers.map((h, cIdx) => (
                    <td key={cIdx} className="p-3 text-slate-300 whitespace-nowrap">
                      {String(row[h] !== undefined ? row[h] : '')}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom Continuation CTAs */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <Button
          variant="secondary"
          onClick={onContinueToExplorer}
          rightIcon={ArrowRight}
        >
          Continue to Data Explorer
        </Button>
        <Button
          variant="primary"
          onClick={onContinueToPreprocessing}
          rightIcon={ArrowRight}
        >
          Proceed to Preprocessing
        </Button>
      </div>
    </div>
  );
};

export default DatasetPreview;
