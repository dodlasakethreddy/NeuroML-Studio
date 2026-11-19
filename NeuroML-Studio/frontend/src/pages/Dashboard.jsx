import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Database,
  Cpu,
  Zap,
  Trophy,
  Upload,
  Play,
  ArrowRight,
  TrendingUp,
  ExternalLink,
  Plus,
} from 'lucide-react';
import { useDataset } from '../context/DatasetContext';
import StatCard from '../components/common/StatCard';
import AccuracyChart from '../components/charts/AccuracyChart';
import Badge from '../components/common/Badge';
import { RECENT_ACTIVITIES } from '../utils/constants';

export const Dashboard = () => {
  const navigate = useNavigate();
  const { stats, datasets, models, setSelectedDatasetId, setSelectedModelId } = useDataset();

  // Pick top 3 recent datasets
  const recentDatasets = datasets.slice(0, 3);

  // Top 4 classification models for performance chart matching reference screenshot
  const classificationModels = models
    .filter((m) => m.problemType === 'Classification')
    .slice(0, 4);

  const chartData = classificationModels.map((m, i) => {
    const colors = ['#8B5CF6', '#3B82F6', '#10B981', '#F59E0B'];
    return {
      name: m.algorithm.replace(' Classifier', '').replace(' Regression', ' Reg.'),
      value: m.accuracy || 85.0,
      color: colors[i % colors.length],
    };
  });

  return (
    <div className="flex flex-col gap-6">
      {/* 1. Welcome Hero Banner matching reference image */}
      <div className="relative rounded-2xl overflow-hidden border border-[#27334A] bg-gradient-to-r from-purple-950/50 via-[#151E32] to-[#0E1526] p-6 md:p-8 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="max-w-xl z-10 text-center md:text-left">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
            Welcome to <span className="bg-gradient-to-r from-white via-purple-200 to-purple-400 bg-clip-text text-transparent">NeuroML Studio</span>
          </h2>
          <p className="text-sm text-slate-300 mt-2 font-medium">
            Train. Compare. Predict. — Your Complete ML Workspace
          </p>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-6">
            <button
              onClick={() => navigate('/upload-dataset')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs tracking-wide shadow-lg shadow-purple-600/30 transition-all transform active:scale-95"
            >
              <Upload className="w-4 h-4" />
              <span>Upload Dataset</span>
            </button>
            <button
              onClick={() => navigate('/data-explorer')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-transparent hover:bg-slate-800/60 text-slate-200 border border-slate-700 hover:border-slate-500 font-semibold text-xs tracking-wide transition-all"
            >
              <Play className="w-4 h-4 text-purple-400" />
              <span>Explore Demo</span>
            </button>
          </div>
        </div>

        {/* Brain Illustration on the Right */}
        <div className="relative w-48 h-36 sm:w-64 sm:h-44 shrink-0 flex items-center justify-center">
          <div className="absolute inset-0 bg-purple-600/20 blur-3xl rounded-full pointer-events-none" />
          <svg className="w-full h-full relative z-10 drop-shadow-[0_0_25px_rgba(139,92,246,0.5)]" viewBox="0 0 200 150" fill="none">
            <defs>
              <linearGradient id="glowG" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#C084FC" />
                <stop offset="50%" stopColor="#8B5CF6" />
                <stop offset="100%" stopColor="#3B82F6" />
              </linearGradient>
            </defs>
            {/* Holographic brain contours */}
            <path d="M70 30 C45 30 30 50 30 75 C30 95 45 115 65 125 C80 135 100 135 115 125 C135 115 150 95 150 75 C150 50 135 30 110 30 C100 30 90 35 90 40 C90 35 80 30 70 30 Z" stroke="url(#glowG)" strokeWidth="2.5" fill="none" opacity="0.8" />
            <path d="M50 65 C60 45 80 45 90 60 C100 45 120 45 130 65" stroke="#A855F7" strokeWidth="2" strokeDasharray="3 3" />
            <path d="M45 85 C65 80 85 95 90 85 C95 95 115 80 135 85" stroke="#60A5FA" strokeWidth="2" strokeDasharray="2 2" />
            <circle cx="65" cy="55" r="3" fill="#C084FC" />
            <circle cx="115" cy="55" r="3" fill="#60A5FA" />
            <circle cx="90" cy="75" r="4" fill="#E879F9" />
            <circle cx="55" cy="95" r="3" fill="#38BDF8" />
            <circle cx="125" cy="95" r="3" fill="#A855F7" />
            <circle cx="90" cy="115" r="3" fill="#818CF8" />
            {/* Wave lines right */}
            <path d="M160 50 L185 50" stroke="#8B5CF6" strokeWidth="2" opacity="0.6" />
            <path d="M155 70 L195 70" stroke="#3B82F6" strokeWidth="2" opacity="0.8" />
            <path d="M160 90 L180 90" stroke="#22C55E" strokeWidth="2" opacity="0.5" />
          </svg>
        </div>
      </div>

      {/* 2. Four Stat Cards matching reference image */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Database}
          iconBgColor="bg-purple-600/20 text-purple-400 border border-purple-500/40"
          title="Datasets"
          value={stats.totalDatasets || 12}
          trend="+12%"
          onClick={() => navigate('/datasets')}
        />

        <StatCard
          icon={Cpu}
          iconBgColor="bg-blue-600/20 text-blue-400 border border-blue-500/40"
          title="Models Trained"
          value={stats.modelsTrained || 38}
          trend="+18%"
          onClick={() => navigate('/saved-models')}
        />

        <StatCard
          icon={Zap}
          iconBgColor="bg-emerald-600/20 text-emerald-400 border border-emerald-500/40"
          title="Predictions"
          value={stats.predictionsMade?.toLocaleString() || '1,240'}
          trend="+22%"
          onClick={() => navigate('/predictions')}
        />

        <StatCard
          icon={Trophy}
          iconBgColor="bg-amber-600/20 text-amber-400 border border-amber-500/40"
          title="Best Accuracy"
          value={stats.bestAccuracy || '96.8%'}
          trend="+2.1%"
          onClick={() => navigate('/model-comparison')}
        />
      </div>

      {/* 3. Middle Row: Model Performance Bar Chart & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Model Performance Card (2 cols) */}
        <div className="neu-card p-5 lg:col-span-2 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-[#27334A]/80">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-purple-400" />
              <h3 className="font-bold text-white text-sm">Model Performance</h3>
            </div>
            <Link
              to="/model-comparison"
              className="text-xs text-purple-400 hover:text-purple-300 font-semibold flex items-center gap-1 transition-colors"
            >
              <span>View Details</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="py-2">
            <AccuracyChart
              data={chartData}
              height={220}
              metricKey="value"
              metricLabel="Accuracy"
            />
          </div>
        </div>

        {/* Recent Activity Feed Card (1 col) */}
        <div className="neu-card p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-[#27334A]/80">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <h3 className="font-bold text-white text-sm">Recent Activity</h3>
            </div>
            <Link
              to="/training-history"
              className="text-xs text-purple-400 hover:text-purple-300 font-semibold flex items-center gap-1 transition-colors"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="py-2 space-y-3.5">
            {RECENT_ACTIVITIES.slice(0, 4).map((activity) => (
              <div key={activity.id} className="flex items-start gap-3 text-xs">
                <span
                  className="w-2 h-2 rounded-full mt-1.5 shrink-0 shadow-sm"
                  style={{ backgroundColor: activity.color, boxShadow: `0 0 6px ${activity.color}` }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-slate-200 font-medium truncate leading-tight">
                    {activity.title}
                  </p>
                  <span className="text-[10px] text-slate-500 mt-0.5 block">
                    {activity.time}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Bottom Row: Recent Datasets Table & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Datasets Table (2 cols) */}
        <div className="neu-card p-5 lg:col-span-2 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-[#27334A]/80">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-purple-400" />
              <h3 className="font-bold text-white text-sm">Recent Datasets</h3>
            </div>
            <Link
              to="/datasets"
              className="text-xs text-purple-400 hover:text-purple-300 font-semibold flex items-center gap-1 transition-colors"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto py-2">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="text-slate-400 border-b border-[#27334A]/60 pb-2">
                  <th className="py-2 font-medium">Name</th>
                  <th className="py-2 font-medium">Rows</th>
                  <th className="py-2 font-medium">Columns</th>
                  <th className="py-2 font-medium">Target</th>
                  <th className="py-2 font-medium">Upload Date</th>
                  <th className="py-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#27334A]/40 text-slate-200">
                {recentDatasets.map((ds) => (
                  <tr
                    key={ds.id}
                    onClick={() => {
                      setSelectedDatasetId(ds.id);
                      navigate('/data-explorer');
                    }}
                    className="hover:bg-slate-800/40 cursor-pointer transition-colors"
                  >
                    <td className="py-3 font-semibold text-white flex items-center gap-2">
                      <Database className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                      <span className="truncate max-w-[150px]">{ds.name}</span>
                    </td>
                    <td className="py-3 font-mono">{ds.rows?.toLocaleString()}</td>
                    <td className="py-3 font-mono">{ds.columns}</td>
                    <td className="py-3 text-purple-300 font-semibold truncate max-w-[80px]">
                      {ds.target || 'None'}
                    </td>
                    <td className="py-3 text-slate-400">{ds.uploadDate}</td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                        Ready
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions Card matching reference image */}
        <div className="neu-card p-5 flex flex-col justify-between">
          <div className="flex items-center gap-2 pb-3 border-b border-[#27334A]/80">
            <Zap className="w-4 h-4 text-purple-400" />
            <h3 className="font-bold text-white text-sm">Quick Actions</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 gap-2.5 py-3">
            {/* Upload Dataset Button (Purple) */}
            <button
              onClick={() => navigate('/upload-dataset')}
              className="p-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white flex flex-col items-center justify-center text-center gap-2 shadow-lg shadow-purple-600/30 transition-all transform active:scale-95"
            >
              <Upload className="w-5 h-5" />
              <span className="text-[11px] font-bold leading-tight">Upload Dataset</span>
            </button>

            {/* Train Model Button (Blue) */}
            <button
              onClick={() => navigate('/model-training')}
              className="p-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white flex flex-col items-center justify-center text-center gap-2 shadow-lg shadow-blue-600/30 transition-all transform active:scale-95"
            >
              <Cpu className="w-5 h-5" />
              <span className="text-[11px] font-bold leading-tight">Train Model</span>
            </button>

            {/* Make Prediction Button (Green) */}
            <button
              onClick={() => navigate('/predictions')}
              className="p-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white flex flex-col items-center justify-center text-center gap-2 shadow-lg shadow-emerald-600/30 transition-all transform active:scale-95"
            >
              <Zap className="w-5 h-5" />
              <span className="text-[11px] font-bold leading-tight">Make Prediction</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
