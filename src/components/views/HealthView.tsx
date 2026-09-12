import React, { useState } from 'react';
import {
  Heart,
  Droplets,
  Activity,
  Flame,
  Plus,
  RotateCcw,
  Moon,
  Sparkles,
  Zap,
  Gauge,
  Check,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatVolume } from '../../utils/formatters';

export const HealthView: React.FC = () => {
  const {
    hydration,
    logWater,
    setHydrationTarget,
    resetHydration,
    activity,
    updateActivity,
    sleep,
    updateSleep,
    recoveryScore,
    settings,
  } = useApp();

  const [customWater, setCustomWater] = useState<string>('300');
  const [editingTarget, setEditingTarget] = useState<boolean>(false);
  const [targetInput, setTargetInput] = useState<string>(hydration.targetMl.toString());

  // Formatted hydration values
  const hydFormatted = formatVolume(hydration.currentMl, settings.units);
  const targetFormatted = formatVolume(hydration.targetMl, settings.units);
  const hydPct = Math.min(100, Math.round((hydration.currentMl / hydration.targetMl) * 100));

  const handleCustomWaterAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const ml = parseFloat(customWater);
    if (!isNaN(ml) && ml > 0) {
      logWater(ml);
      setCustomWater('');
    }
  };

  const handleSaveTarget = () => {
    const val = parseInt(targetInput, 10);
    if (!isNaN(val) && val >= 500) {
      setHydrationTarget(val);
      setEditingTarget(false);
    }
  };

  return (
    <div id="health-view-container" className="flex flex-col gap-6 w-full max-w-[1200px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#30D158]"></span>
            <span className="text-[12px] uppercase font-bold tracking-wider text-neutral-500 dark:text-neutral-400">
              Biometric Engine & Intake
            </span>
          </div>
          <h1 className="text-[28px] sm:text-[34px] font-black tracking-tight text-neutral-900 dark:text-white">
            Health & Recovery
          </h1>
          <p className="text-[14px] font-medium text-neutral-500 dark:text-neutral-400">
            Real-time hydration logging, cardiac metrics, and neuro-recovery analysis.
          </p>
        </div>

        {/* Recovery Badge */}
        <div className="flex items-center gap-3 bg-white dark:bg-[#1C1C1E] p-3 rounded-2xl border border-black/[0.04] dark:border-white/10 shadow-sm self-start sm:self-auto">
          <div className="w-10 h-10 rounded-xl bg-[#30D158]/10 text-[#30D158] flex items-center justify-center font-bold">
            <Heart className="w-5 h-5 fill-[#30D158]" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-neutral-400 block">
              Readiness Score
            </span>
            <span className="text-xl font-black text-neutral-900 dark:text-white tabular-nums">
              {recoveryScore}%{' '}
              <span className="text-xs font-semibold text-[#30D158]">Optimal</span>
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 1. HYDRATION TRACKER */}
        <div
          id="health-hydration-panel"
          className="rounded-[24px] p-6 text-white relative overflow-hidden shadow-xl shadow-[#00C7BE]/20 flex flex-col justify-between"
          style={{
            background: 'linear-gradient(135deg, #00C7BE 0%, #009E96 100%)',
          }}
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-2xl bg-white/20 flex items-center justify-center">
                  <Droplets className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-[16px] font-black tracking-tight">Cellular Hydration</h2>
                  <span className="text-[11px] text-white/80 font-medium">
                    Fluid & Electrolyte Intake
                  </span>
                </div>
              </div>

              <button
                id="health-reset-water"
                onClick={resetHydration}
                title="Reset Intake for Today"
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-all cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            {/* Gauge & Main Numbers */}
            <div className="bg-black/15 backdrop-blur-sm p-5 rounded-2xl border border-white/15 my-2 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="relative w-24 h-24 shrink-0 flex items-center justify-center">
                  <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      fill="transparent"
                      r="40"
                      stroke="rgba(0,0,0,0.15)"
                      strokeWidth="10"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      fill="transparent"
                      r="40"
                      stroke="#FFFFFF"
                      strokeWidth="10"
                      strokeDasharray="251.32"
                      strokeDashoffset={251.32 - (hydPct / 100) * 251.32}
                      strokeLinecap="round"
                      className="transition-all duration-300"
                    />
                  </svg>
                  <div className="absolute text-center">
                    <span className="text-xl font-black text-white leading-none tabular-nums">
                      {hydPct}%
                    </span>
                  </div>
                </div>

                <div>
                  <span className="text-[11px] font-bold text-white/80 uppercase tracking-wider block">
                    Current Consumed
                  </span>
                  <div className="text-3xl font-black text-white tabular-nums">
                    {hydFormatted.value} <span className="text-lg font-bold">{hydFormatted.unit}</span>
                  </div>
                  <span className="text-[12px] text-white/85 font-semibold">
                    {hydration.currentMl.toLocaleString()} ml logged
                  </span>
                </div>
              </div>

              {/* Editable Target */}
              <div className="text-right border-t sm:border-t-0 sm:border-l border-white/20 pt-3 sm:pt-0 sm:pl-4 w-full sm:w-auto">
                <span className="text-[11px] font-bold text-white/80 uppercase tracking-wider block">
                  Daily Target
                </span>
                {editingTarget ? (
                  <div className="flex items-center gap-1.5 mt-1">
                    <input
                      type="number"
                      value={targetInput}
                      onChange={(e) => setTargetInput(e.target.value)}
                      step="100"
                      className="w-24 h-8 px-2 rounded-lg bg-white text-neutral-900 font-bold text-sm focus:outline-none"
                    />
                    <button
                      onClick={handleSaveTarget}
                      className="h-8 px-2.5 rounded-lg bg-white text-[#009E96] font-bold text-xs cursor-pointer shadow-sm"
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-end gap-1.5 mt-0.5">
                    <span className="text-xl font-black text-white tabular-nums">
                      {targetFormatted.value} {targetFormatted.unit}
                    </span>
                    <button
                      onClick={() => setEditingTarget(true)}
                      className="text-[10px] font-bold text-white/80 underline hover:text-white cursor-pointer"
                    >
                      Edit
                    </button>
                  </div>
                )}
                <span className="text-[11px] text-white/75 mt-1 block">
                  {Math.max(0, hydration.targetMl - hydration.currentMl)} ml remaining
                </span>
              </div>
            </div>

            {/* Quick Increment Buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4">
              <button
                id="health-add-250"
                onClick={() => logWater(250)}
                className="h-11 rounded-xl bg-white text-[#009E96] font-extrabold text-sm shadow-sm hover:bg-white/95 active:scale-95 transition-all flex items-center justify-center gap-1 cursor-pointer"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>+250 ml</span>
              </button>
              <button
                id="health-add-500"
                onClick={() => logWater(500)}
                className="h-11 rounded-xl bg-white text-[#009E96] font-extrabold text-sm shadow-sm hover:bg-white/95 active:scale-95 transition-all flex items-center justify-center gap-1 cursor-pointer"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>+500 ml</span>
              </button>
              <button
                id="health-add-750"
                onClick={() => logWater(750)}
                className="h-11 rounded-xl bg-white/20 hover:bg-white hover:text-[#009E96] text-white font-extrabold text-sm border border-white/30 active:scale-95 transition-all flex items-center justify-center gap-1 cursor-pointer"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>+750 ml</span>
              </button>
              <button
                id="health-add-1000"
                onClick={() => logWater(1000)}
                className="h-11 rounded-xl bg-white/20 hover:bg-white hover:text-[#009E96] text-white font-extrabold text-sm border border-white/30 active:scale-95 transition-all flex items-center justify-center gap-1 cursor-pointer"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>+1.0 L</span>
              </button>
            </div>

            {/* Custom Amount Form */}
            <form onSubmit={handleCustomWaterAdd} className="mt-3 flex items-center gap-2">
              <div className="relative flex-1">
                <input
                  id="custom-water-input"
                  type="number"
                  placeholder="Custom ml (e.g. 350)"
                  value={customWater}
                  onChange={(e) => setCustomWater(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-black/20 border border-white/20 text-white placeholder:text-white/60 font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-white"
                />
                <span className="absolute right-3 top-2.5 text-xs text-white/70 font-bold">ml</span>
              </div>
              <button
                type="submit"
                className="h-10 px-4 rounded-xl bg-white text-[#009E96] font-bold text-xs shadow-md active:scale-95 transition-all cursor-pointer shrink-0"
              >
                Log Custom
              </button>
            </form>
          </div>
        </div>

        {/* 2. STEPS & ACTIVITY WIDGET */}
        <div
          id="health-activity-panel"
          className="rounded-[24px] p-6 text-white relative overflow-hidden shadow-xl shadow-[#30D158]/20 flex flex-col justify-between"
          style={{
            background: 'linear-gradient(135deg, #30D158 0%, #1FB443 100%)',
          }}
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-2xl bg-black/15 flex items-center justify-center">
                  <Activity className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-[16px] font-black tracking-tight">Movement & Strain</h2>
                  <span className="text-[11px] text-white/80 font-medium">
                    Cardio Output & Step Velocity
                  </span>
                </div>
              </div>

              <span className="px-2.5 py-1 rounded-full bg-white/20 border border-white/30 text-[11px] font-black text-white">
                VO2 Max: {activity.vo2Max}
              </span>
            </div>

            {/* Triple Ring & Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center bg-black/15 backdrop-blur-sm p-4 rounded-2xl border border-white/15 my-2">
              <div className="flex justify-center">
                <div className="relative w-32 h-32 flex items-center justify-center">
                  <svg className="w-32 h-32 -rotate-90 transform" viewBox="0 0 100 100">
                    {/* Move Ring */}
                    <circle
                      cx="50"
                      cy="50"
                      fill="none"
                      r="42"
                      stroke="rgba(255,255,255,0.25)"
                      strokeWidth="7"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      fill="none"
                      r="42"
                      stroke="#FFFFFF"
                      strokeWidth="7"
                      strokeDasharray="263.89"
                      strokeDashoffset={
                        263.89 - (activity.caloriesBurned / activity.calorieTarget) * 263.89
                      }
                      strokeLinecap="round"
                    />
                    {/* Exercise Ring */}
                    <circle
                      cx="50"
                      cy="50"
                      fill="none"
                      r="32"
                      stroke="rgba(255,255,255,0.25)"
                      strokeWidth="7"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      fill="none"
                      r="32"
                      stroke="#FFD60A"
                      strokeWidth="7"
                      strokeDasharray="201.06"
                      strokeDashoffset={
                        201.06 - (activity.workoutMinutes / activity.workoutTarget) * 201.06
                      }
                      strokeLinecap="round"
                    />
                    {/* Stand Ring */}
                    <circle
                      cx="50"
                      cy="50"
                      fill="none"
                      r="22"
                      stroke="rgba(255,255,255,0.25)"
                      strokeWidth="7"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      fill="none"
                      r="22"
                      stroke="#00C7BE"
                      strokeWidth="7"
                      strokeDasharray="138.23"
                      strokeDashoffset={
                        138.23 - (activity.standHours / activity.standTarget) * 138.23
                      }
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              </div>

              <div className="flex flex-col gap-2.5">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-xs font-bold">
                    <span className="w-2.5 h-2.5 rounded-full bg-white"></span>Move
                  </span>
                  <span className="text-xs font-black tabular-nums">
                    {activity.caloriesBurned} / {activity.calorieTarget} kcal
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-xs font-bold">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#FFD60A]"></span>Exercise
                  </span>
                  <span className="text-xs font-black tabular-nums">
                    {activity.workoutMinutes} / {activity.workoutTarget} min
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-xs font-bold">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#00C7BE]"></span>Stand
                  </span>
                  <span className="text-xs font-black tabular-nums">
                    {activity.standHours} / {activity.standTarget} hrs
                  </span>
                </div>
              </div>
            </div>

            {/* Editable Step Count and Workout Controls */}
            <div className="grid grid-cols-2 gap-3 mt-4">
              <div className="bg-white/15 p-3 rounded-xl border border-white/20">
                <label className="text-[11px] font-bold text-white/80 uppercase block mb-1">
                  Steps Logged
                </label>
                <div className="flex items-center gap-1.5">
                  <input
                    id="health-steps-input"
                    type="number"
                    value={activity.steps}
                    onChange={(e) => updateActivity({ steps: parseInt(e.target.value, 10) || 0 })}
                    className="w-full h-9 px-2.5 rounded-lg bg-white text-neutral-900 font-black text-sm focus:outline-none"
                  />
                </div>
                <span className="text-[10px] text-white/70 mt-1 block">
                  Goal: {activity.stepTarget.toLocaleString()}
                </span>
              </div>

              <div className="bg-white/15 p-3 rounded-xl border border-white/20">
                <label className="text-[11px] font-bold text-white/80 uppercase block mb-1">
                  Workout Minutes
                </label>
                <div className="flex items-center gap-1.5">
                  <input
                    id="health-workout-input"
                    type="number"
                    value={activity.workoutMinutes}
                    onChange={(e) =>
                      updateActivity({ workoutMinutes: parseInt(e.target.value, 10) || 0 })
                    }
                    className="w-full h-9 px-2.5 rounded-lg bg-white text-neutral-900 font-black text-sm focus:outline-none"
                  />
                </div>
                <span className="text-[10px] text-white/70 mt-1 block">
                  Goal: {activity.workoutTarget} mins
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. SLEEP & NEURO-RECOVERY MATRIX */}
      <div
        id="health-sleep-matrix"
        className="rounded-[24px] p-6 bg-white dark:bg-[#1C1C1E] border border-black/[0.06] dark:border-white/10 shadow-sm"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#5856D6]/10 text-[#5856D6] flex items-center justify-center font-bold">
              <Moon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-[18px] font-extrabold text-neutral-900 dark:text-white">
                Sleep Architecture & Autonomic Tone
              </h2>
              <span className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">
                Editable inputs feeding the real-time Recovery Score algorithm
              </span>
            </div>
          </div>

          <div className="px-3 py-1.5 rounded-full bg-[#30D158]/10 text-[#30D158] font-black text-xs flex items-center gap-1.5 self-start sm:self-auto">
            <Zap className="w-4 h-4 fill-[#30D158]" />
            <span>Composite Recovery: {recoveryScore}%</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Hours Slept */}
          <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-white/5 border border-black/[0.04] dark:border-white/5">
            <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">
              Hours Slept
            </span>
            <div className="flex items-center gap-2">
              <input
                id="sleep-hours-input"
                type="number"
                step="0.1"
                min="0"
                max="16"
                value={sleep.hoursSlept}
                onChange={(e) => updateSleep({ hoursSlept: parseFloat(e.target.value) || 0 })}
                className="w-24 h-10 px-3 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 font-black text-lg text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#5856D6]"
              />
              <span className="text-sm font-bold text-neutral-500">hours</span>
            </div>
            <span className="text-[11px] text-neutral-400 mt-2 block">Optimal range: 7.5 - 9.0h</span>
          </div>

          {/* Resting Heart Rate */}
          <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-white/5 border border-black/[0.04] dark:border-white/5">
            <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">
              Resting Heart Rate
            </span>
            <div className="flex items-center gap-2">
              <input
                id="sleep-rhr-input"
                type="number"
                min="35"
                max="120"
                value={sleep.restingHeartRate}
                onChange={(e) =>
                  updateSleep({ restingHeartRate: parseInt(e.target.value, 10) || 60 })
                }
                className="w-24 h-10 px-3 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 font-black text-lg text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#FF3B30]"
              />
              <span className="text-sm font-bold text-neutral-500">BPM</span>
            </div>
            <span className="text-[11px] text-[#30D158] font-bold mt-2 block">-3 BPM vs baseline</span>
          </div>

          {/* HRV */}
          <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-white/5 border border-black/[0.04] dark:border-white/5">
            <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">
              HRV (Heart Rate Var)
            </span>
            <div className="flex items-center gap-2">
              <input
                id="sleep-hrv-input"
                type="number"
                min="20"
                max="150"
                value={sleep.hrvMs}
                onChange={(e) => updateSleep({ hrvMs: parseInt(e.target.value, 10) || 50 })}
                className="w-24 h-10 px-3 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 font-black text-lg text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#007AFF]"
              />
              <span className="text-sm font-bold text-neutral-500">ms</span>
            </div>
            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold mt-2 block">
              Top 5% bracket
            </span>
          </div>

          {/* Deep Sleep Minutes */}
          <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-white/5 border border-black/[0.04] dark:border-white/5">
            <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">
              Deep Stage Sleep
            </span>
            <div className="flex items-center gap-2">
              <input
                id="sleep-deep-input"
                type="number"
                min="0"
                max="300"
                value={sleep.deepSleepMinutes}
                onChange={(e) =>
                  updateSleep({ deepSleepMinutes: parseInt(e.target.value, 10) || 0 })
                }
                className="w-24 h-10 px-3 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 font-black text-lg text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#FFD60A]"
              />
              <span className="text-sm font-bold text-neutral-500">mins</span>
            </div>
            <span className="text-[11px] text-neutral-400 mt-2 block">1h 48m slow-wave wave</span>
          </div>
        </div>
      </div>
    </div>
  );
};
