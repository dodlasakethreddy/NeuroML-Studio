import React, { useState } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

export const PerformanceChart = ({
  models = [],
  problemType = 'Classification',
  height = 300,
}) => {
  const [chartType, setChartType] = useState('bar'); // 'bar' or 'line'

  const isClassification = problemType === 'Classification';

  // Format data for chart
  const data = models.map((m) => {
    if (isClassification) {
      return {
        name: m.algorithm || m.name,
        Accuracy: m.accuracy || 0,
        Precision: m.precision || 0,
        Recall: m.recall || 0,
        F1Score: m.f1Score || 0,
      };
    } else {
      return {
        name: m.algorithm || m.name,
        R2Score: m.r2Score ? Number((m.r2Score * 100).toFixed(1)) : 0,
        MAE: m.mae ? Number((m.mae * 100).toFixed(1)) : 0,
        RMSE: m.rmse ? Number((m.rmse * 100).toFixed(1)) : 0,
      };
    }
  });

  const historyData = [
    { epoch: 'Epoch 10', loss: 0.62, val_acc: 72.4 },
    { epoch: 'Epoch 20', loss: 0.48, val_acc: 81.1 },
    { epoch: 'Epoch 30', loss: 0.35, val_acc: 88.5 },
    { epoch: 'Epoch 40', loss: 0.24, val_acc: 93.2 },
    { epoch: 'Epoch 50', loss: 0.18, val_acc: 96.8 },
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#151E32] border border-[#27334A] p-3 rounded-xl shadow-xl text-xs space-y-1">
          <p className="font-bold text-white mb-1.5">{label}</p>
          {payload.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between gap-4">
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                {item.name}:
              </span>
              <span className="font-semibold text-white">{item.value}{isClassification ? '%' : ''}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex flex-col gap-3 w-full">
      <div className="flex items-center justify-between">
        <span className="text-xs text-slate-400 font-medium">
          {isClassification ? 'Multi-Metric Comparison (Percent %)' : 'Regression Scaled Comparison (R² x 100)'}
        </span>
        <div className="flex items-center gap-1 bg-[#10172A] p-1 rounded-lg border border-[#27334A] text-xs">
          <button
            onClick={() => setChartType('bar')}
            className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
              chartType === 'bar' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Metrics Bar
          </button>
          <button
            onClick={() => setChartType('line')}
            className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
              chartType === 'line' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Convergence Line
          </button>
        </div>
      </div>

      <div style={{ width: '100%', height }}>
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'bar' ? (
            <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27334A" vertical={false} opacity={0.5} />
              <XAxis dataKey="name" stroke="#94A3B8" fontSize={11} tickLine={false} />
              <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} domain={[0, 100]} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              {isClassification ? (
                <>
                  <Bar dataKey="Accuracy" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Precision" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Recall" fill="#10B981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="F1Score" fill="#F59E0B" radius={[4, 4, 0, 0]} />
                </>
              ) : (
                <>
                  <Bar dataKey="R2Score" name="R² Score" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="MAE" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="RMSE" fill="#EF4444" radius={[4, 4, 0, 0]} />
                </>
              )}
            </BarChart>
          ) : (
            <LineChart data={historyData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27334A" vertical={false} opacity={0.5} />
              <XAxis dataKey="epoch" stroke="#94A3B8" fontSize={11} tickLine={false} />
              <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Line type="monotone" dataKey="val_acc" name="Val Accuracy (%)" stroke="#8B5CF6" strokeWidth={2.5} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="loss" name="Training Loss" stroke="#EF4444" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PerformanceChart;
