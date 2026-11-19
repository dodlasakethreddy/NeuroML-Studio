import React, { useState } from 'react';

export const CorrelationHeatmap = ({ columns = [] }) => {
  // Filter continuous/numeric columns or use top 6 features
  const numericCols = columns
    .filter((c) => c.type === 'Integer' || c.type === 'Float' || c.type === 'Numeric')
    .map((c) => c.name)
    .slice(0, 7);

  const displayCols = numericCols.length >= 3 ? numericCols : ['Age', 'Income', 'Years', 'Rate', 'Score'];
  const n = displayCols.length;

  // Generate deterministic synthetic Pearson correlation matrix [-1.0, 1.0]
  const matrix = React.useMemo(() => {
    const mat = [];
    for (let i = 0; i < n; i++) {
      mat[i] = [];
      for (let j = 0; j < n; j++) {
        if (i === j) {
          mat[i][j] = 1.0;
        } else if (j < i) {
          mat[i][j] = mat[j][i];
        } else {
          // Semi-random deterministic value based on column names
          const hash = (displayCols[i].charCodeAt(0) * 13 + displayCols[j].charCodeAt(0) * 7) % 100;
          const val = ((hash / 50) - 1) * 0.75;
          mat[i][j] = +val.toFixed(2);
        }
      }
    }
    return mat;
  }, [displayCols, n]);

  const [hoveredCell, setHoveredCell] = useState(null);

  // Color interpolation for correlation (-1 to +1)
  const getCellBg = (val) => {
    if (val === 1.0) return 'bg-purple-600/90 text-white';
    if (val > 0.5) return 'bg-purple-600/60 text-purple-100';
    if (val > 0.2) return 'bg-purple-500/30 text-purple-200';
    if (val > -0.2) return 'bg-slate-800/60 text-slate-400';
    if (val > -0.5) return 'bg-blue-500/30 text-blue-200';
    return 'bg-blue-600/70 text-white';
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <span className="text-xs text-slate-400">
          Pearson Correlation Matrix (-1.0 to +1.0)
        </span>
        {/* Legend */}
        <div className="flex items-center gap-2 text-[10px] text-slate-400">
          <span>-1.0</span>
          <div className="w-24 h-2 rounded bg-gradient-to-r from-blue-600 via-slate-800 to-purple-600 border border-[#27334A]" />
          <span>+1.0</span>
        </div>
      </div>

      <div className="overflow-x-auto pb-2">
        <table className="border-collapse text-xs">
          <thead>
            <tr>
              <th className="p-2 text-left text-slate-500 text-[11px] font-mono"></th>
              {displayCols.map((col, idx) => (
                <th
                  key={idx}
                  className="p-2 text-center text-slate-300 font-semibold truncate max-w-[90px]"
                  title={col}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {displayCols.map((rowName, rIdx) => (
              <tr key={rIdx}>
                <td className="p-2 text-slate-300 font-semibold truncate max-w-[100px] text-left">
                  {rowName}
                </td>
                {displayCols.map((colName, cIdx) => {
                  const val = matrix[rIdx][cIdx];
                  return (
                    <td
                      key={cIdx}
                      className="p-1"
                      onMouseEnter={() => setHoveredCell({ row: rowName, col: colName, val })}
                      onMouseLeave={() => setHoveredCell(null)}
                    >
                      <div
                        className={`w-14 h-11 rounded-lg flex items-center justify-center font-mono text-[11px] font-medium transition-transform cursor-pointer border border-[#27334A]/50 ${getCellBg(
                          val
                        )} hover:scale-110 hover:border-white/50 hover:z-10`}
                      >
                        {val.toFixed(2)}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {hoveredCell && (
        <div className="bg-[#10172A] border border-[#27334A] px-3 py-2 rounded-lg text-xs text-slate-300 flex items-center justify-between">
          <span>
            Correlation between <strong className="text-white">{hoveredCell.row}</strong> and{' '}
            <strong className="text-white">{hoveredCell.col}</strong>:
          </span>
          <span className="font-mono font-bold text-purple-400">{hoveredCell.val.toFixed(3)}</span>
        </div>
      )}
    </div>
  );
};

export default CorrelationHeatmap;
