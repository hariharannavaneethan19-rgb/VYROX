import React, { useState } from 'react';
import {
  LineChart as LineIcon,
  BarChart3,
  Calendar,
  TrendingUp,
  Droplets,
  CheckCircle2,
  Wallet,
  Scale,
  Footprints,
  Sparkles,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Area,
  AreaChart,
} from 'recharts';
import { useApp } from '../../context/AppContext';
import { formatCurrency, formatWeight } from '../../utils/formatters';

type MetricType = 'hydration' | 'habits' | 'savings' | 'weight' | 'steps';
type TimeRange = '7d' | '30d';

export const ProgressView: React.FC = () => {
  const { history7Days, history30Days, settings } = useApp();

  const [metric, setMetric] = useState<MetricType>('hydration');
  const [timeRange, setTimeRange] = useState<TimeRange>('7d');
  const [chartType, setChartType] = useState<'line' | 'bar'>('line');

  const rawData = timeRange === '7d' ? history7Days : history30Days;

  // Process data for charts
  const chartData = rawData.map((d) => {
    let displayVal = 0;
    if (metric === 'hydration') {
      displayVal = settings.units === 'imperial' ? +(d.hydrationMl * 0.033814).toFixed(1) : +(d.hydrationMl / 1000).toFixed(2);
    } else if (metric === 'habits') {
      displayVal = d.habitCompletionPct;
    } else if (metric === 'savings') {
      displayVal = d.savingsBalance;
    } else if (metric === 'weight') {
      displayVal = settings.units === 'imperial' ? +(d.weightKg * 2.20462).toFixed(1) : d.weightKg;
    } else if (metric === 'steps') {
      displayVal = d.steps;
    }

    return {
      name: timeRange === '7d' ? d.dayLabel : d.date,
      date: d.date,
      value: displayVal,
    };
  });

  const metricConfigs: Record<
    MetricType,
    {
      label: string;
      unit: string;
      color: string;
      icon: React.ComponentType<{ className?: string }>;
    }
  > = {
    hydration: {
      label: 'Hydration Intake',
      unit: settings.units === 'imperial' ? 'fl oz' : 'L',
      color: '#00C7BE',
      icon: Droplets,
    },
    habits: {
      label: 'Habit Consistency',
      unit: '%',
      color: '#5E17EB',
      icon: CheckCircle2,
    },
    savings: {
      label: 'Liquid Treasury',
      unit: settings.currency,
      color: '#FF6B00',
      icon: Wallet,
    },
    weight: {
      label: 'Body Composition',
      unit: settings.units === 'imperial' ? 'lbs' : 'kg',
      color: '#FF2D78',
      icon: Scale,
    },
    steps: {
      label: 'Daily Footsteps',
      unit: 'steps',
      color: '#30D158',
      icon: Footprints,
    },
  };

  const currentConfig = metricConfigs[metric];
  const Icon = currentConfig.icon;

  // Calculate high-level summary
  const values = chartData.map((d) => d.value);
  const average = (values.reduce((a, b) => a + b, 0) / values.length).toFixed(1);
  const peak = Math.max(...values).toFixed(1);
  const lowest = Math.min(...values).toFixed(1);

  return (
    <div id="progress-view-container" className="flex flex-col gap-6 w-full max-w-[1200px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00C7BE]"></span>
            <span className="text-[12px] uppercase font-bold tracking-wider text-neutral-500 dark:text-neutral-400">
              Longitudinal Telemetry
            </span>
          </div>
          <h1 className="text-[28px] sm:text-[34px] font-black tracking-tight text-neutral-900 dark:text-white">
            Progress & Historical Trends
          </h1>
          <p className="text-[14px] font-medium text-neutral-500 dark:text-neutral-400">
            Multi-domain analytics across 7-day and 30-day biological and financial cycles.
          </p>
        </div>

        {/* Time Range Selector */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="inline-flex p-1 rounded-xl bg-white dark:bg-[#1C1C1E] border border-black/[0.06] dark:border-white/10 shadow-sm">
            <button
              id="range-7d-btn"
              onClick={() => setTimeRange('7d')}
              className={`px-3.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                timeRange === '7d'
                  ? 'bg-[#007AFF] text-white shadow-sm'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900'
              }`}
            >
              Last 7 Days
            </button>
            <button
              id="range-30d-btn"
              onClick={() => setTimeRange('30d')}
              className={`px-3.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                timeRange === '30d'
                  ? 'bg-[#007AFF] text-white shadow-sm'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900'
              }`}
            >
              Last 30 Days
            </button>
          </div>
        </div>
      </div>

      {/* Metric Switcher Tab Pills */}
      <div className="flex flex-wrap gap-2">
        {(Object.keys(metricConfigs) as MetricType[]).map((key) => {
          const config = metricConfigs[key];
          const MetricIcon = config.icon;
          const isSelected = metric === key;
          return (
            <button
              key={key}
              id={`metric-tab-${key}`}
              onClick={() => setMetric(key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-black transition-all cursor-pointer active:scale-95 ${
                isSelected
                  ? 'text-white shadow-md'
                  : 'bg-white dark:bg-[#1C1C1E] text-neutral-600 dark:text-neutral-300 border border-black/[0.04] dark:border-white/5 hover:bg-neutral-50'
              }`}
              style={{
                backgroundColor: isSelected ? config.color : undefined,
              }}
            >
              <MetricIcon className="w-4 h-4" />
              <span>{config.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Chart Card */}
      <div className="rounded-[24px] p-6 bg-white dark:bg-[#1C1C1E] border border-black/[0.06] dark:border-white/10 shadow-sm flex flex-col justify-between">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-sm"
              style={{ backgroundColor: currentConfig.color }}
            >
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-neutral-900 dark:text-white">
                {currentConfig.label} ({timeRange === '7d' ? '7-Day' : '30-Day'} Trend)
              </h2>
              <span className="text-xs text-neutral-400 font-semibold">
                Units: {currentConfig.unit}
              </span>
            </div>
          </div>

          {/* Chart Style Switcher */}
          <div className="flex items-center gap-1 bg-neutral-100 dark:bg-neutral-800 p-1 rounded-xl self-start sm:self-auto">
            <button
              onClick={() => setChartType('line')}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                chartType === 'line'
                  ? 'bg-white dark:bg-[#1C1C1E] text-neutral-900 dark:text-white shadow-sm'
                  : 'text-neutral-500'
              }`}
            >
              <LineIcon className="w-3.5 h-3.5" />
              <span>Line</span>
            </button>
            <button
              onClick={() => setChartType('bar')}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                chartType === 'bar'
                  ? 'bg-white dark:bg-[#1C1C1E] text-neutral-900 dark:text-white shadow-sm'
                  : 'text-neutral-500'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Bar</span>
            </button>
          </div>
        </div>

        {/* Recharts Canvas */}
        <div className="h-72 sm:h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'line' ? (
              <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                <XAxis
                  dataKey="name"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11, fill: '#8E8E93', fontWeight: 600 }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11, fill: '#8E8E93', fontWeight: 600 }}
                  domain={['auto', 'auto']}
                />
                <Tooltip
                  formatter={(value: any) => [
                    metric === 'savings'
                      ? formatCurrency(Number(value), settings.currency)
                      : `${value} ${currentConfig.unit}`,
                    currentConfig.label,
                  ]}
                  contentStyle={{
                    backgroundColor: '#1C1C1E',
                    borderRadius: '12px',
                    border: 'none',
                    color: '#fff',
                    fontSize: '12px',
                    fontWeight: 'bold',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke={currentConfig.color}
                  strokeWidth={3}
                  dot={{ r: 4, fill: currentConfig.color, strokeWidth: 2, stroke: '#FFFFFF' }}
                  activeDot={{ r: 6, fill: currentConfig.color }}
                />
              </LineChart>
            ) : (
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                <XAxis
                  dataKey="name"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11, fill: '#8E8E93', fontWeight: 600 }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11, fill: '#8E8E93', fontWeight: 600 }}
                  domain={['auto', 'auto']}
                />
                <Tooltip
                  formatter={(value: any) => [
                    metric === 'savings'
                      ? formatCurrency(Number(value), settings.currency)
                      : `${value} ${currentConfig.unit}`,
                    currentConfig.label,
                  ]}
                  contentStyle={{
                    backgroundColor: '#1C1C1E',
                    borderRadius: '12px',
                    border: 'none',
                    color: '#fff',
                    fontSize: '12px',
                    fontWeight: 'bold',
                  }}
                />
                <Bar dataKey="value" fill={currentConfig.color} radius={[6, 6, 0, 0]} />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>

        {/* Statistics Row */}
        <div className="grid grid-cols-3 gap-3 pt-5 mt-4 border-t border-neutral-100 dark:border-neutral-800 text-center">
          <div>
            <span className="text-[10px] uppercase font-bold text-neutral-400 block tracking-wider">
              Cycle Mean
            </span>
            <span className="text-base sm:text-lg font-black text-neutral-900 dark:text-white tabular-nums">
              {metric === 'savings'
                ? formatCurrency(parseFloat(average), settings.currency, false)
                : `${average} ${currentConfig.unit}`}
            </span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-neutral-400 block tracking-wider">
              Peak Logged
            </span>
            <span className="text-base sm:text-lg font-black text-[#30D158] tabular-nums">
              {metric === 'savings'
                ? formatCurrency(parseFloat(peak), settings.currency, false)
                : `${peak} ${currentConfig.unit}`}
            </span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-neutral-400 block tracking-wider">
              Baseline Valley
            </span>
            <span className="text-base sm:text-lg font-black text-neutral-700 dark:text-neutral-300 tabular-nums">
              {metric === 'savings'
                ? formatCurrency(parseFloat(lowest), settings.currency, false)
                : `${lowest} ${currentConfig.unit}`}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
