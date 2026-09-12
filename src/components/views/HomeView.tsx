import React, { useState } from 'react';
import {
  Sparkles,
  ArrowUpRight,
  TrendingUp,
  Heart,
  Droplets,
  Activity,
  Flame,
  Check,
  Flag,
  Play,
  Plus,
  ArrowRight,
  Bot,
  Sliders,
  DollarSign,
  ChevronRight,
  Calendar,
} from 'lucide-react';
import { useApp, SCORE_WEIGHTS } from '../../context/AppContext';
import { formatCurrency, formatVolume } from '../../utils/formatters';

interface HomeViewProps {
  onOpenExpenseModal: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onOpenExpenseModal }) => {
  const {
    userProfile,
    settings,
    setCurrency,
    setActiveTab,
    compositeScore,
    subScores,
    hydration,
    logWater,
    activity,
    sleep,
    recoveryScore,
    netBalance,
    burnRateToday,
    totalIncome,
    habits,
    toggleHabitDay,
    goals,
  } = useApp();

  const [selectedDayOffset, setSelectedDayOffset] = useState<number>(4); // Friday as default active day

  // Format hydration for display
  const hydFormatted = formatVolume(hydration.currentMl, settings.units);
  const targetHydFormatted = formatVolume(hydration.targetMl, settings.units);
  const hydPercent = Math.min(100, Math.round((hydration.currentMl / hydration.targetMl) * 100));

  // Circumference for water circle: r=38 => C = 2 * pi * 38 = 238.76
  const waterCircumference = 238.76;
  const waterOffset = waterCircumference - (hydPercent / 100) * waterCircumference;

  // Primary habit for home screen display
  const focusHabit = habits[1] || habits[0];

  const daysOfWeek = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const dates = [20, 21, 22, 23, 24, 25, 26];

  return (
    <div id="home-dashboard-container" className="flex flex-col gap-6 w-full max-w-[1400px] mx-auto">
      {/* Top Welcome Banner with Date Strip */}
      <section className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-[#30D158] animate-pulse"></span>
            <span className="text-[11px] sm:text-[12px] uppercase tracking-wider font-bold text-neutral-500 dark:text-neutral-400">
              Biometric Sensors Online • All Tiles Active
            </span>
          </div>
          <h1 className="text-[28px] sm:text-[34px] font-black tracking-tight text-neutral-900 dark:text-white font-sans">
            Good morning, {userProfile.name.split(' ')[0]}
          </h1>
          <p className="text-[14px] sm:text-[15px] font-medium text-neutral-500 dark:text-neutral-400">
            System performance is optimal. Composite score is{' '}
            <span className="text-[#007AFF] dark:text-[#5856D6] font-bold">
              {compositeScore}/100
            </span>
            .
          </p>
        </div>

        {/* 7-Day iOS Date Strip */}
        <div className="flex items-center gap-1.5 bg-white dark:bg-[#1C1C1E] p-1.5 rounded-2xl shadow-sm border border-black/[0.04] dark:border-white/10 self-start lg:self-auto">
          {daysOfWeek.map((day, idx) => {
            const isSelected = selectedDayOffset === idx;
            return (
              <button
                key={idx}
                id={`calendar-day-${idx}`}
                onClick={() => setSelectedDayOffset(idx)}
                className={`w-9 sm:w-10 h-13 sm:h-14 rounded-xl flex flex-col items-center justify-center transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#007AFF] text-white shadow-md shadow-[#007AFF]/30 scale-105'
                    : 'text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-white/5'
                }`}
              >
                <span
                  className={`text-[10px] sm:text-[11px] font-semibold ${
                    isSelected ? 'text-white/80' : 'text-neutral-400 dark:text-neutral-500'
                  }`}
                >
                  {day}
                </span>
                <span className="text-[15px] sm:text-[16px] font-bold tabular-nums">
                  {dates[idx]}
                </span>
                {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white mt-0.5"></span>}
              </button>
            );
          })}
        </div>
      </section>

      {/* Grid Wall of Color-Coded Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6">
        {/* 1. 2x2 LARGE HERO CARD: Composite Life Score / Today's Pulse */}
        <div
          id="hero-composite-widget"
          className="md:col-span-2 xl:col-span-2 xl:row-span-2 rounded-[24px] p-6 sm:p-8 text-white relative overflow-hidden shadow-2xl shadow-[#007AFF]/25 flex flex-col justify-between"
          style={{
            background: 'linear-gradient(135deg, #007AFF 0%, #3B4BDE 50%, #5856D6 100%)',
          }}
        >
          {/* Ambient light glow accents */}
          <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-white/15 blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-[#5E17EB]/40 blur-3xl pointer-events-none"></div>

          {/* Card Top */}
          <div className="relative z-10 flex items-start justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-9 h-9 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-[11px] uppercase tracking-wider font-black text-white/80 block">
                  Today's Pulse
                </span>
                <span className="text-xs font-semibold text-white/90">
                  Composite Life Index
                </span>
              </div>
            </div>

            <span className="px-3 py-1.5 rounded-full bg-[#FFD60A] text-black font-black text-[11px] tracking-wide shadow-sm flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5 stroke-[3]" />
              {compositeScore >= 90 ? 'OPTIMAL' : compositeScore >= 80 ? 'EXCELLENT' : 'ON TRACK'}
            </span>
          </div>

          {/* Central Hero Metric */}
          <div className="relative z-10 my-6 grid grid-cols-1 sm:grid-cols-12 items-center gap-6">
            <div className="sm:col-span-5 flex flex-col items-center justify-center text-center">
              {/* Radial Score Meter */}
              <div className="relative flex items-center justify-center">
                <svg className="w-44 h-44 -rotate-90 transform" viewBox="0 0 120 120">
                  <circle
                    cx="60"
                    cy="60"
                    fill="transparent"
                    r="50"
                    stroke="rgba(255, 255, 255, 0.2)"
                    strokeWidth="11"
                  />
                  <circle
                    cx="60"
                    cy="60"
                    fill="transparent"
                    r="50"
                    stroke="#FFFFFF"
                    strokeWidth="11"
                    strokeLinecap="round"
                    strokeDasharray="314.159"
                    strokeDashoffset={314.159 - (compositeScore / 100) * 314.159}
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center">
                  <span className="text-[48px] font-black tabular-nums tracking-tighter leading-none text-white">
                    {compositeScore}
                  </span>
                  <span className="text-[12px] font-bold uppercase tracking-wider text-white/80 mt-1">
                    /100
                  </span>
                </div>
              </div>

              <span className="text-[13px] font-bold text-white/90 mt-2">
                Overall Life Index (+4.2 pts)
              </span>
            </div>

            {/* Sub-Score Pillars & Health Vitals */}
            <div className="sm:col-span-7 flex flex-col gap-3">
              {/* Weighted Pillar Gauges */}
              <div className="bg-black/20 backdrop-blur-md p-3.5 rounded-2xl border border-white/10 flex items-center justify-between">
                <div className="flex flex-col items-center gap-1.5">
                  <div className="w-2.5 h-12 bg-white/20 rounded-full relative flex items-end">
                    <div
                      className="w-full bg-[#30D158] rounded-full transition-all duration-700"
                      style={{ height: `${Math.min(100, subScores.health)}%` }}
                    ></div>
                  </div>
                  <span className="text-[10px] font-black text-white/80">FIT</span>
                  <span className="text-[11px] font-bold text-white tabular-nums">
                    {subScores.health}%
                  </span>
                </div>

                <div className="flex flex-col items-center gap-1.5">
                  <div className="w-2.5 h-12 bg-white/20 rounded-full relative flex items-end">
                    <div
                      className="w-full bg-[#00C7BE] rounded-full transition-all duration-700"
                      style={{ height: `${Math.min(100, hydPercent)}%` }}
                    ></div>
                  </div>
                  <span className="text-[10px] font-black text-white/80">HYD</span>
                  <span className="text-[11px] font-bold text-white tabular-nums">
                    {hydPercent}%
                  </span>
                </div>

                <div className="flex flex-col items-center gap-1.5">
                  <div className="w-2.5 h-12 bg-white/20 rounded-full relative flex items-end">
                    <div
                      className="w-full bg-[#FFD60A] rounded-full transition-all duration-700"
                      style={{ height: `${Math.min(100, subScores.habits)}%` }}
                    ></div>
                  </div>
                  <span className="text-[10px] font-black text-white/80">HAB</span>
                  <span className="text-[11px] font-bold text-white tabular-nums">
                    {subScores.habits}%
                  </span>
                </div>

                <div className="flex flex-col items-center gap-1.5">
                  <div className="w-2.5 h-12 bg-white/20 rounded-full relative flex items-end">
                    <div
                      className="w-full bg-white rounded-full transition-all duration-700"
                      style={{ height: `${Math.min(100, subScores.finance)}%` }}
                    ></div>
                  </div>
                  <span className="text-[10px] font-black text-white/80">FIN</span>
                  <span className="text-[11px] font-bold text-white tabular-nums">
                    {subScores.finance}%
                  </span>
                </div>

                <div className="flex flex-col items-center gap-1.5">
                  <div className="w-2.5 h-12 bg-white/20 rounded-full relative flex items-end">
                    <div
                      className="w-full bg-[#FF2D78] rounded-full transition-all duration-700"
                      style={{ height: `${Math.min(100, subScores.goals)}%` }}
                    ></div>
                  </div>
                  <span className="text-[10px] font-black text-white/80">GOAL</span>
                  <span className="text-[11px] font-bold text-white tabular-nums">
                    {subScores.goals}%
                  </span>
                </div>
              </div>

              {/* Vitals Strip */}
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-white/15 backdrop-blur-md rounded-xl p-2.5 border border-white/15">
                  <span className="text-[10px] font-bold text-white/70 block uppercase tracking-wider">
                    Sleep
                  </span>
                  <span className="text-[15px] font-black text-white tabular-nums">
                    {sleep.hoursSlept}h
                  </span>
                  <span className="text-[10px] text-white/70 block">HRV {sleep.hrvMs}ms</span>
                </div>

                <div className="bg-white/15 backdrop-blur-md rounded-xl p-2.5 border border-white/15">
                  <span className="text-[10px] font-bold text-white/70 block uppercase tracking-wider">
                    Resting HR
                  </span>
                  <span className="text-[15px] font-black text-[#FFD60A] tabular-nums">
                    {sleep.restingHeartRate} <span className="text-[10px]">BPM</span>
                  </span>
                  <span className="text-[10px] text-white/70 block">Restored</span>
                </div>

                <div className="bg-white/15 backdrop-blur-md rounded-xl p-2.5 border border-white/15">
                  <span className="text-[10px] font-bold text-white/70 block uppercase tracking-wider">
                    Focus Done
                  </span>
                  <span className="text-[15px] font-black text-white tabular-nums">
                    4/4 Blocks
                  </span>
                  <span className="text-[10px] text-emerald-200 block">Flow state</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Action Footer */}
          <div className="relative z-10 pt-4 border-t border-white/20 flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs font-medium text-white/90 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#FFD60A]" />
              Calculated dynamically from Health ({SCORE_WEIGHTS.health * 100}%), Finance (
              {SCORE_WEIGHTS.finance * 100}%), Habits ({SCORE_WEIGHTS.habits * 100}%), Goals (
              {SCORE_WEIGHTS.goals * 100}%)
            </p>
            <button
              id="view-deep-telemetry-btn"
              onClick={() => setActiveTab('progress')}
              className="px-4 py-2 rounded-xl bg-white text-[#007AFF] font-bold text-[13px] shadow-lg hover:bg-white/90 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span>View Deep Telemetry</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 2. MEDIUM 2x1 WIDGET: Vivid Finance & Liquid Capital (Orange to Red Gradient) */}
        <div
          id="finance-snapshot-widget"
          className="rounded-[24px] p-5 sm:p-6 text-white relative overflow-hidden shadow-xl shadow-[#FF3B30]/25 flex flex-col justify-between"
          style={{
            background: 'linear-gradient(135deg, #FF3B30 0%, #FF6B00 100%)',
          }}
        >
          {/* Header with Currency Switcher */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                <DollarSign className="w-4 h-4 text-white" />
              </div>
              <span className="text-[11px] uppercase tracking-wider font-extrabold text-white/90">
                Liquid Capital • Live
              </span>
            </div>

            {/* Currency Pill Switcher */}
            <div className="inline-flex p-0.5 rounded-full bg-black/20 backdrop-blur-md border border-white/15">
              <button
                id="home-curr-usd"
                onClick={() => setCurrency('USD')}
                className={`px-2 py-0.5 rounded-full text-[11px] font-extrabold transition-all cursor-pointer ${
                  settings.currency === 'USD'
                    ? 'bg-white text-[#FF3B30] shadow-sm'
                    : 'text-white/80 hover:text-white'
                }`}
              >
                USD ($)
              </button>
              <button
                id="home-curr-lkr"
                onClick={() => setCurrency('LKR')}
                className={`px-2 py-0.5 rounded-full text-[11px] font-extrabold transition-all cursor-pointer ${
                  settings.currency === 'LKR'
                    ? 'bg-white text-[#FF3B30] shadow-sm'
                    : 'text-white/80 hover:text-white'
                }`}
              >
                LKR (Rs)
              </button>
            </div>
          </div>

          {/* Main Balance & Burn Rate */}
          <div className="flex items-end justify-between my-3">
            <div>
              <span className="text-[11px] font-semibold text-white/80 block">
                Current Liquid Balance
              </span>
              <div className="flex items-baseline space-x-1">
                <span className="text-3xl sm:text-[36px] font-black text-white tracking-tight tabular-nums">
                  {formatCurrency(netBalance, settings.currency, false)}
                </span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-white/70 block">
                Burn Rate Today
              </span>
              <span className="text-lg font-black text-[#FFD60A] tabular-nums">
                {formatCurrency(burnRateToday, settings.currency)}
              </span>
            </div>
          </div>

          {/* Integrated Mini Bar Chart with White Contrast Bars */}
          <div className="w-full bg-black/20 rounded-xl p-2.5 flex items-end justify-between h-16 px-3 border border-white/10 mb-3">
            {[
              { d: 'M', h: 48 },
              { d: 'T', h: 65 },
              { d: 'W', h: 38 },
              { d: 'T', h: 82 },
              { d: 'F', h: 95, today: true },
              { d: 'S', h: 25 },
              { d: 'S', h: 20 },
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col items-center gap-1 h-full justify-end">
                <div
                  className={`w-3 rounded-t-md transition-all ${
                    item.today ? 'bg-white shadow-sm' : 'bg-white/40'
                  }`}
                  style={{ height: `${item.h}%` }}
                ></div>
                <span
                  className={`text-[9px] font-bold ${
                    item.today ? 'text-[#FFD60A]' : 'text-white/70'
                  }`}
                >
                  {item.d}
                </span>
              </div>
            ))}

            <div className="border-l border-white/20 pl-3 flex flex-col justify-center text-right">
              <span className="text-[9px] font-bold uppercase text-white/70 leading-tight">
                Monthly Inflow
              </span>
              <span className="text-xs font-black text-white tabular-nums">
                {formatCurrency(totalIncome + 4780, settings.currency, false)}
              </span>
            </div>
          </div>

          {/* Quick Log Expense Button */}
          <button
            id="home-quick-log-expense-btn"
            onClick={onOpenExpenseModal}
            className="w-full h-10 rounded-xl bg-white/20 hover:bg-white text-white hover:text-[#FF3B30] border border-white/40 font-bold text-[13px] flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Quick Log Expense Entry</span>
          </button>
        </div>

        {/* 3. SMALL 1x1 WIDGET: Cellular Hydration in Electric Cyan/Teal (#00C7BE) */}
        <div
          id="hydration-widget"
          className="rounded-[24px] p-5 text-white relative overflow-hidden shadow-xl shadow-[#00C7BE]/25 flex flex-col justify-between"
          style={{
            background: 'linear-gradient(135deg, #00C7BE 0%, #009E96 100%)',
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <div className="w-7 h-7 rounded-full bg-white/25 flex items-center justify-center">
                <Droplets className="w-4 h-4 text-white" />
              </div>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-white">
                Hydration
              </span>
            </div>
            <span className="text-[11px] font-black uppercase tracking-wider bg-black/20 px-2 py-0.5 rounded-full text-white">
              {hydPercent}%
            </span>
          </div>

          {/* Circular Progress Gauge */}
          <div className="my-2 flex items-center space-x-3">
            <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
              <svg className="w-16 h-16 -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  fill="transparent"
                  r="38"
                  stroke="rgba(0, 0, 0, 0.15)"
                  strokeWidth="10"
                />
                <circle
                  cx="50"
                  cy="50"
                  fill="transparent"
                  r="38"
                  stroke="#FFFFFF"
                  strokeWidth="10"
                  strokeDasharray={waterCircumference}
                  strokeDashoffset={Math.max(0, waterOffset)}
                  strokeLinecap="round"
                  className="transition-all duration-300"
                />
              </svg>
              <div className="absolute text-center flex flex-col items-center">
                <span className="text-base font-black leading-none text-white tabular-nums">
                  {hydFormatted.value}
                </span>
                <span className="text-[8px] font-bold text-white/80 leading-none mt-0.5">
                  {hydFormatted.unit}
                </span>
              </div>
            </div>

            <div>
              <span className="text-[13px] font-black text-white leading-tight block">
                Cellular Fluid
              </span>
              <span className="text-[11px] font-medium text-white/85">
                Target: {targetHydFormatted.value} {targetHydFormatted.unit}
              </span>
            </div>
          </div>

          {/* Quick Action +250ml & +500ml Buttons */}
          <div className="grid grid-cols-2 gap-2 mt-1">
            <button
              id="home-water-add-250"
              onClick={() => logWater(250)}
              className="h-9 rounded-xl bg-white text-[#009E96] hover:bg-white/95 active:scale-95 font-extrabold text-xs shadow-sm flex items-center justify-center space-x-1 transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
              <span>250ml</span>
            </button>
            <button
              id="home-water-add-500"
              onClick={() => logWater(500)}
              className="h-9 rounded-xl bg-white/20 hover:bg-white hover:text-[#009E96] text-white active:scale-95 font-extrabold text-xs border border-white/30 flex items-center justify-center space-x-1 transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
              <span>500ml</span>
            </button>
          </div>
        </div>

        {/* 4. SMALL 1x1 WIDGET: Activity Rings in Bright Apple Green (#30D158) */}
        <div
          id="activity-rings-widget"
          className="rounded-[24px] p-5 text-white relative overflow-hidden shadow-xl shadow-[#30D158]/25 flex flex-col justify-between"
          style={{
            background: 'linear-gradient(135deg, #30D158 0%, #1FB443 100%)',
          }}
        >
          <div className="flex items-center justify-between">
            <div className="w-7 h-7 rounded-full bg-black/15 flex items-center justify-center">
              <Activity className="w-4 h-4 text-white font-bold" />
            </div>
            <div className="flex items-center text-[11px] font-extrabold bg-white/20 px-2 py-0.5 rounded-full text-white">
              <span className="tabular-nums">{activity.steps.toLocaleString()}</span>
              <span className="text-white/70 ml-1">steps</span>
            </div>
          </div>

          {/* Triple Concentric Activity Rings */}
          <div className="my-1 flex items-center justify-center relative">
            <div className="relative w-20 h-20 shrink-0 flex items-center justify-center">
              <svg className="w-20 h-20 -rotate-90" viewBox="0 0 100 100">
                {/* Move Outer Ring */}
                <circle
                  cx="50"
                  cy="50"
                  fill="transparent"
                  r="40"
                  stroke="rgba(0,0,0,0.15)"
                  strokeWidth="7"
                />
                <circle
                  cx="50"
                  cy="50"
                  fill="transparent"
                  r="40"
                  stroke="#FF3B30"
                  strokeWidth="7"
                  strokeDasharray="251.32"
                  strokeDashoffset={251.32 - (activity.caloriesBurned / activity.calorieTarget) * 251.32}
                  strokeLinecap="round"
                />
                {/* Exercise Middle Ring */}
                <circle
                  cx="50"
                  cy="50"
                  fill="transparent"
                  r="28"
                  stroke="rgba(0,0,0,0.15)"
                  strokeWidth="7"
                />
                <circle
                  cx="50"
                  cy="50"
                  fill="transparent"
                  r="28"
                  stroke="#FFD60A"
                  strokeWidth="7"
                  strokeDasharray="175.92"
                  strokeDashoffset={175.92 - (activity.workoutMinutes / activity.workoutTarget) * 175.92}
                  strokeLinecap="round"
                />
                {/* Stand Inner Ring */}
                <circle
                  cx="50"
                  cy="50"
                  fill="transparent"
                  r="16"
                  stroke="rgba(0,0,0,0.15)"
                  strokeWidth="7"
                />
                <circle
                  cx="50"
                  cy="50"
                  fill="transparent"
                  r="16"
                  stroke="#00C7BE"
                  strokeWidth="7"
                  strokeDasharray="100.53"
                  strokeDashoffset={100.53 - (activity.standHours / activity.standTarget) * 100.53}
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] font-extrabold text-white/95 pt-1.5 border-t border-white/20">
            <span>{activity.caloriesBurned} kcal</span>
            <span>•</span>
            <span>{activity.workoutMinutes}m Ex</span>
            <span>•</span>
            <span>{activity.standHours}h Stand</span>
          </div>
        </div>

        {/* 5. DEEP PURPLE HABITS & STREAKS WIDGET (#5E17EB with Golden Yellow #FFD60A flame) */}
        <div
          id="habits-discipline-widget"
          className="rounded-[24px] p-5 sm:p-6 text-white relative overflow-hidden shadow-xl shadow-[#5E17EB]/25 flex flex-col justify-between"
          style={{
            background: 'linear-gradient(135deg, #5E17EB 0%, #4609BF 100%)',
          }}
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <Check className="w-4 h-4 text-white stroke-[3]" />
                </div>
                <span className="text-[11px] uppercase tracking-wider font-extrabold text-white/90">
                  Habit Discipline
                </span>
              </div>

              {/* Golden Yellow Streak Badge */}
              <div className="flex items-center space-x-1 bg-[#FFD60A] text-black px-2.5 py-1 rounded-full shadow-sm">
                <Flame className="w-3.5 h-3.5 fill-black text-black" />
                <span className="text-[11px] font-black tracking-tight tabular-nums">
                  14 Day Streak
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between mb-2">
              <div>
                <span className="text-sm font-extrabold text-white block">
                  {focusHabit?.name || 'Deep Focus (90m Protocol)'}
                </span>
                <span className="text-[11px] font-semibold text-white/75">
                  Target: {focusHabit?.targetSessions || 5} sessions / week
                </span>
              </div>
              <span className="text-[10px] font-black uppercase text-[#FFD60A] bg-white/10 px-2 py-0.5 rounded-md">
                Active Week
              </span>
            </div>

            {/* 7-Day Completion Interactive Row (Monday to Sunday) */}
            <div className="flex items-center justify-between bg-black/20 p-2 sm:p-2.5 rounded-xl border border-white/10 mb-2">
              {daysOfWeek.map((day, idx) => {
                const isChecked = focusHabit?.history[idx] ?? false;
                const isSunday = idx === 6;
                return (
                  <div key={idx} className="flex flex-col items-center gap-1">
                    <span
                      className={`text-[10px] font-bold ${
                        isSunday ? 'text-[#FFD60A]' : 'text-white/70'
                      }`}
                    >
                      {day}
                    </span>
                    <button
                      id={`habit-day-toggle-${idx}`}
                      onClick={() => focusHabit && toggleHabitDay(focusHabit.id, idx)}
                      title={`Toggle ${day}`}
                      className={`w-7 h-7 rounded-full flex items-center justify-center shadow-sm transition-transform active:scale-90 cursor-pointer ${
                        isChecked
                          ? 'bg-white text-[#5E17EB]'
                          : isSunday
                          ? 'bg-[#FFD60A] text-black'
                          : 'bg-white/20 text-white/60 hover:bg-white/30'
                      }`}
                    >
                      {isChecked ? (
                        <Check className="w-4 h-4 stroke-[3]" />
                      ) : isSunday ? (
                        <span className="w-2 h-2 rounded-full bg-black animate-pulse"></span>
                      ) : (
                        <span className="text-[11px]">•</span>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-2 border-t border-white/15 flex items-center justify-between text-[12px] font-semibold">
            <span className="text-white/80">Click circles to toggle live</span>
            <button
              id="goto-habits-btn"
              onClick={() => setActiveTab('habits')}
              className="text-[#FFD60A] hover:underline font-bold flex items-center gap-1 cursor-pointer"
            >
              <span>View All 5</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 6. HOT PINK / MAGENTA WIDGET: Active Benchmarks / Goals (#FF2D78) */}
        <div
          id="goals-benchmarks-widget"
          className="rounded-[24px] p-5 sm:p-6 text-white relative overflow-hidden shadow-xl shadow-[#FF2D78]/25 flex flex-col justify-between"
          style={{
            background: 'linear-gradient(135deg, #FF2D78 0%, #D80F56 100%)',
          }}
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <Flag className="w-4 h-4 text-white" />
                </div>
                <span className="text-[11px] uppercase tracking-wider font-extrabold text-white/90">
                  Active Benchmarks
                </span>
              </div>
              <span className="text-[11px] font-black text-black bg-[#FFD60A] px-2.5 py-0.5 rounded-full shadow-sm">
                Q4 Targets
              </span>
            </div>

            {/* Goal Benchmarks Progress Rows */}
            <div className="space-y-3">
              {goals.slice(0, 2).map((goal) => {
                const pct = Math.min(100, Math.round((goal.currentValue / goal.targetValue) * 100));
                return (
                  <div key={goal.id} className="bg-black/20 p-2.5 rounded-xl border border-white/10">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-black text-white">{goal.title}</span>
                      <span className="text-xs font-black text-[#FFD60A] tabular-nums">
                        {pct}%
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-white/20 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-white transition-all duration-500 shadow-sm"
                        style={{ width: `${pct}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between items-center mt-1 text-[10px] font-bold text-white/80">
                      <span>
                        {goal.unit === '$'
                          ? `${formatCurrency(goal.currentValue, settings.currency, false)} of ${formatCurrency(goal.targetValue, settings.currency, false)}`
                          : `${goal.currentValue} / ${goal.targetValue} ${goal.unit}`}
                      </span>
                      <span className="text-[#FFD60A]">On Track</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-3 border-t border-white/20 flex items-center justify-between text-[12px] font-semibold mt-2">
            <span className="text-white/80">{goals.length} Active Horizon Objectives</span>
            <button
              id="goto-goals-btn"
              onClick={() => setActiveTab('goals')}
              className="flex items-center gap-1 font-bold text-white hover:underline cursor-pointer"
            >
              <span>Roadmap</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 7. FULL-BLEED EDITORIAL PHOTO WIDGET (Athletic Training Session) */}
        <div
          id="photo-editorial-widget"
          className="rounded-[24px] relative overflow-hidden shadow-2xl shadow-black/20 min-h-[280px] sm:min-h-[320px] flex flex-col justify-between group"
        >
          {/* Training image */}
          <img
            src="https://lh3.googleusercontent.com/aida/AEtjO1WsLZVo-sJtGYRCrcimE0tbjWYu-u4Ek6iO7SIKYqeoVV4W9x5Xy7LF4-fFSSjAU4oXdNETkIE-xrmBeS0cEmVbfaYpZ2IRUM3F9_tF8hU8HbkvJ2LwPJcS6FixEfQmwNXwgKzeWAcx5x96GvcnryURZkShpFVBZBu0oFV-MvA0HJsfmgrsJA080jCwQaVyKbngPo5TxxxMMOhM6EQUlT23xZF9u2x3f5UGxGBq7Ip7whDN6A3WMTxkfg"
            alt="Athletic Training Session"
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          />
          {/* Deep dark gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-black/20"></div>

          {/* Top Badge */}
          <div className="relative z-10 p-5 flex items-center justify-between">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white text-[11px] font-bold">
              <span className="w-2 h-2 rounded-full bg-[#FF3B30] animate-pulse"></span>
              <span>LIVE WORKOUT SESSION</span>
            </div>
            <div className="px-2.5 py-0.5 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 text-white font-mono text-[11px] font-bold">
              00:48:12
            </div>
          </div>

          {/* Bottom Telemetry */}
          <div className="relative z-10 p-5">
            <span className="text-[11px] font-black uppercase tracking-wider text-[#FFD60A] block">
              Zone 5 Sled Conditioning
            </span>
            <h3 className="text-xl font-black text-white tracking-tight leading-snug drop-shadow-sm">
              Overcome the Resistance
            </h3>
            <div className="grid grid-cols-3 gap-2 mt-3 pt-2.5 border-t border-white/20 text-white">
              <div>
                <span className="text-[9px] uppercase font-bold text-white/70 block">Avg Heart</span>
                <span className="text-base font-black tabular-nums">
                  168 <span className="text-[10px] font-normal">BPM</span>
                </span>
              </div>
              <div>
                <span className="text-[9px] uppercase font-bold text-white/70 block">Active Burn</span>
                <span className="text-base font-black tabular-nums">542 kcal</span>
              </div>
              <div>
                <span className="text-[9px] uppercase font-bold text-white/70 block">Pace Zone</span>
                <span className="text-base font-black tabular-nums text-[#FFD60A]">Zone 4.8</span>
              </div>
            </div>
          </div>
        </div>

        {/* 8. AI INTELLIGENCE COACH (Midnight Dark Card with Yellow/Green Accent Chips) */}
        <div
          id="ai-coach-widget"
          className="rounded-[24px] p-5 sm:p-6 text-white relative overflow-hidden shadow-2xl bg-[#0B0C10] border border-neutral-800 flex flex-col justify-between"
        >
          {/* Ambient Glows */}
          <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-[#FFD60A]/15 blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-[#30D158]/15 blur-3xl pointer-events-none"></div>

          <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#FFD60A] to-[#30D158] flex items-center justify-center text-slate-950 font-black shadow-md shadow-[#FFD60A]/20">
                  <Bot className="w-4 h-4 text-black" />
                </div>
                <div>
                  <span className="text-[13px] font-black tracking-tight text-white block leading-none">
                    VYROX Bio-Engine
                  </span>
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                    Neural Bio-Core v3.2
                  </span>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-md bg-[#30D158]/20 border border-[#30D158]/40 text-[#30D158] font-bold text-[11px] animate-pulse">
                Optimal
              </span>
            </div>

            {/* AI Insight 1 */}
            <div className="p-3 rounded-2xl bg-neutral-900/90 border border-neutral-800 mb-2.5">
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded-full bg-[#FFD60A] text-slate-950 text-[9px] font-extrabold uppercase tracking-wide">
                  Cognitive Focus
                </span>
                <span className="text-[11px] font-bold text-white">Peak Readiness Window</span>
              </div>
              <p className="text-[12px] text-neutral-300 leading-snug">
                Sleep logged <span className="text-white font-bold">{sleep.hoursSlept}h</span> with{' '}
                <span className="text-white font-bold">{sleep.deepSleepMinutes}m Deep Sleep</span>.
                HRV is elevated at <span className="text-[#30D158] font-bold">{sleep.hrvMs}ms</span>
                . Ideal deep work block active until 13:00.
              </p>
            </div>

            {/* AI Insight 2 */}
            <div className="p-3 rounded-2xl bg-neutral-900/90 border border-neutral-800">
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded-full bg-[#30D158] text-slate-950 text-[9px] font-extrabold uppercase tracking-wide">
                  Physiology
                </span>
                <span className="text-[11px] font-bold text-white">
                  Recovery Score: {recoveryScore}%
                </span>
              </div>
              <p className="text-[12px] text-neutral-300 leading-snug">
                Metabolic fatigue is minimal. All autonomic indicators clear for today's conditioning
                session.
              </p>
            </div>
          </div>

          <div className="pt-3 border-t border-neutral-800 flex items-center gap-2 mt-3">
            <button
              id="tune-priorities-btn"
              onClick={() => setActiveTab('health')}
              className="flex-1 h-10 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-[12px] border border-neutral-700 flex items-center justify-center gap-1.5 transition-all active:scale-[0.98] cursor-pointer"
            >
              <Sliders className="w-3.5 h-3.5 text-[#FFD60A]" />
              <span>Inspect Health Biometrics</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
