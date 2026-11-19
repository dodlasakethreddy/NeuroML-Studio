import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  CartesianGrid,
} from 'recharts';

export const AccuracyChart = ({
  data,
  height = 240,
  metricKey = 'accuracy',
  metricLabel = 'Accuracy',
  isPercentage = true,
}) => {
  // Fallback data matching reference screenshot
  const chartData = data && data.length > 0 ? data : [
    { name: 'Random Forest', value: 96.8, color: '#8B5CF6' },
    { name: 'SVM', value: 91.2, color: '#3B82F6' },
    { name: 'KNN', value: 85.5, color: '#10B981' },
    { name: 'Logistic Reg.', value: 82.1, color: '#F59E0B' },
  ];

  const palette = ['#8B5CF6', '#3B82F6', '#10B981', '#F59E0B', '#EC4899', '#06B6D4'];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#151E32] border border-[#27334A] px-3.5 py-2 rounded-xl shadow-xl text-xs">
          <p className="font-semibold text-white mb-1">{label}</p>
          <p className="text-purple-400 font-bold text-sm">
            {metricLabel}: {payload[0].value}
            {isPercentage ? '%' : ''}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 15, right: 10, left: -20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#27334A" vertical={false} opacity={0.5} />
          <XAxis
            dataKey="name"
            stroke="#94A3B8"
            fontSize={11}
            tickLine={false}
            axisLine={{ stroke: '#27334A' }}
          />
          <YAxis
            stroke="#94A3B8"
            fontSize={11}
            domain={isPercentage ? [0, 100] : [0, 'auto']}
            ticks={isPercentage ? [0, 20, 40, 60, 80, 100] : undefined}
            tickLine={false}
            axisLine={{ stroke: '#27334A' }}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255, 255, 255, 0.04)' }} />
          <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={55}>
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.color || palette[index % palette.length]}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AccuracyChart;
