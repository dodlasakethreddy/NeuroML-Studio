import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  ScatterChart,
  Scatter,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

export const DistributionChart = ({
  columns = [],
  previewRows = [],
}) => {
  const [selectedColumn, setSelectedColumn] = useState(columns[0]?.name || 'Age');
  const [chartMode, setChartMode] = useState('histogram'); // 'histogram', 'scatter', 'pie'
  const [secondaryCol, setSecondaryCol] = useState(columns[1]?.name || columns[0]?.name || 'Income');

  const activeColObj = columns.find((c) => c.name === selectedColumn) || columns[0];

  // Colors
  const COLORS = ['#8B5CF6', '#3B82F6', '#10B981', '#F59E0B', '#EC4899', '#06B6D4', '#84CC16'];

  // Histogram / Frequency Data
  const distData = React.useMemo(() => {
    if (!previewRows || previewRows.length === 0) return [];
    const counts = {};
    previewRows.forEach((r) => {
      const val = r[selectedColumn];
      const key = val !== undefined && val !== null ? String(val) : 'Missing';
      counts[key] = (counts[key] || 0) + 1;
    });

    return Object.entries(counts).map(([name, count]) => ({
      name,
      count,
    }));
  }, [previewRows, selectedColumn]);

  // Scatter plot data
  const scatterData = React.useMemo(() => {
    if (!previewRows || previewRows.length === 0) return [];
    return previewRows.map((r, i) => ({
      x: Number(r[selectedColumn]) || i,
      y: Number(r[secondaryCol]) || (i * 2),
      id: i,
    }));
  }, [previewRows, selectedColumn, secondaryCol]);

  return (
    <div className="flex flex-col gap-4">
      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#10172A]/60 p-3 rounded-xl border border-[#27334A]">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-semibold">Primary Feature:</span>
            <select
              value={selectedColumn}
              onChange={(e) => setSelectedColumn(e.target.value)}
              className="neu-input text-xs py-1.5 px-2.5"
            >
              {columns.map((c) => (
                <option key={c.name} value={c.name}>
                  {c.name} ({c.type})
                </option>
              ))}
            </select>
          </div>

          {chartMode === 'scatter' && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-semibold">Y-Axis Feature:</span>
              <select
                value={secondaryCol}
                onChange={(e) => setSecondaryCol(e.target.value)}
                className="neu-input text-xs py-1.5 px-2.5"
              >
                {columns.map((c) => (
                  <option key={c.name} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Chart Mode Toggle */}
        <div className="flex items-center gap-1 bg-[#0B1020] p-1 rounded-lg border border-[#27334A] text-xs">
          <button
            onClick={() => setChartMode('histogram')}
            className={`px-3 py-1 rounded font-medium transition-colors ${
              chartMode === 'histogram' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Histogram / Bar
          </button>
          <button
            onClick={() => setChartMode('scatter')}
            className={`px-3 py-1 rounded font-medium transition-colors ${
              chartMode === 'scatter' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Scatter 2D
          </button>
          <button
            onClick={() => setChartMode('pie')}
            className={`px-3 py-1 rounded font-medium transition-colors ${
              chartMode === 'pie' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Pie Chart
          </button>
        </div>
      </div>

      {/* Chart Output */}
      <div style={{ width: '100%', height: 320 }}>
        <ResponsiveContainer width="100%" height="100%">
          {chartMode === 'histogram' ? (
            <BarChart data={distData} margin={{ top: 20, right: 20, left: -20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27334A" vertical={false} opacity={0.5} />
              <XAxis dataKey="name" stroke="#94A3B8" fontSize={11} angle={-25} textAnchor="end" height={45} />
              <YAxis stroke="#94A3B8" fontSize={11} />
              <Tooltip
                contentStyle={{ backgroundColor: '#151E32', borderColor: '#27334A', borderRadius: '0.75rem' }}
                itemStyle={{ color: '#F8FAFC' }}
              />
              <Bar dataKey="count" fill="#8B5CF6" radius={[4, 4, 0, 0]}>
                {distData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          ) : chartMode === 'scatter' ? (
            <ScatterChart margin={{ top: 20, right: 20, left: -10, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27334A" opacity={0.5} />
              <XAxis dataKey="x" name={selectedColumn} stroke="#94A3B8" fontSize={11} />
              <YAxis dataKey="y" name={secondaryCol} stroke="#94A3B8" fontSize={11} />
              <Tooltip
                cursor={{ strokeDasharray: '3 3' }}
                contentStyle={{ backgroundColor: '#151E32', borderColor: '#27334A', borderRadius: '0.75rem' }}
              />
              <Scatter name="Data Points" data={scatterData} fill="#3B82F6" />
            </ScatterChart>
          ) : (
            <PieChart>
              <Pie
                data={distData}
                dataKey="count"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                innerRadius={50}
                paddingAngle={4}
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
              >
                {distData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: '#151E32', borderColor: '#27334A', borderRadius: '0.75rem' }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', color: '#94A3B8' }} />
            </PieChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DistributionChart;
