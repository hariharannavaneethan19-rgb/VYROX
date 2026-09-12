import React, { useState } from 'react';
import {
  Flag,
  Plus,
  Trash2,
  Calendar,
  CheckCircle2,
  TrendingUp,
  Sliders,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatCurrency } from '../../utils/formatters';

export const GoalsView: React.FC = () => {
  const { goals, addGoal, updateGoalProgress, deleteGoal, settings } = useApp();

  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [title, setTitle] = useState<string>('');
  const [category, setCategory] = useState<string>('Performance');
  const [currentVal, setCurrentVal] = useState<string>('0');
  const [targetVal, setTargetVal] = useState<string>('100');
  const [unit, setUnit] = useState<string>('%');
  const [deadline, setDeadline] = useState<string>('Dec 31, 2026');
  const [color, setColor] = useState<string>('#FF2D78');

  const colorChoices = ['#FF2D78', '#FF3B30', '#30D158', '#5E17EB', '#00C7BE', '#FFD60A'];

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const curr = parseFloat(currentVal) || 0;
    const targ = parseFloat(targetVal) || 100;
    if (!title.trim() || targ <= 0) return;

    addGoal({
      title: title.trim(),
      category,
      currentValue: curr,
      targetValue: targ,
      unit,
      deadline,
      color,
    });

    setTitle('');
    setCurrentVal('0');
    setTargetVal('100');
    setShowAddModal(false);
  };

  return (
    <div id="goals-view-container" className="flex flex-col gap-6 w-full max-w-[1200px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FF2D78]"></span>
            <span className="text-[12px] uppercase font-bold tracking-wider text-neutral-500 dark:text-neutral-400">
              Horizon Objectives
            </span>
          </div>
          <h1 className="text-[28px] sm:text-[34px] font-black tracking-tight text-neutral-900 dark:text-white">
            Active Goals & Benchmarks
          </h1>
          <p className="text-[14px] font-medium text-neutral-500 dark:text-neutral-400">
            Set quarterly milestones, track completion ratios, and update metrics live.
          </p>
        </div>

        <button
          id="add-goal-open-btn"
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 rounded-xl bg-[#FF2D78] text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-[#FF2D78]/25 hover:opacity-95 active:scale-95 transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Goal</span>
        </button>
      </div>

      {/* Grid of Goal Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {goals.map((goal) => {
          const pct = Math.min(100, Math.round((goal.currentValue / goal.targetValue) * 100));
          const isDone = goal.currentValue >= goal.targetValue;

          return (
            <div
              key={goal.id}
              className="rounded-[24px] p-6 bg-white dark:bg-[#1C1C1E] border border-black/[0.06] dark:border-white/10 shadow-sm flex flex-col justify-between transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-8 h-8 rounded-xl flex items-center justify-center text-white font-bold shadow-sm"
                      style={{ backgroundColor: goal.color }}
                    >
                      <Flag className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                        {goal.category}
                      </span>
                      <h3 className="text-base font-black text-neutral-900 dark:text-white">
                        {goal.title}
                      </h3>
                    </div>
                  </div>

                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-black tabular-nums ${
                      isDone
                        ? 'bg-[#30D158]/15 text-[#30D158]'
                        : 'bg-neutral-100 dark:bg-white/10 text-neutral-800 dark:text-neutral-200'
                    }`}
                  >
                    {isDone ? 'Completed' : `${pct}%`}
                  </span>
                </div>

                {/* Progress Bar with mathematical styling */}
                <div className="my-4">
                  <div className="w-full h-3 rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden relative">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${pct}%`,
                        backgroundColor: goal.color,
                      }}
                    ></div>
                  </div>

                  <div className="flex items-center justify-between mt-2 text-xs font-bold text-neutral-500 dark:text-neutral-400">
                    <span>
                      {goal.unit === '$'
                        ? `${formatCurrency(goal.currentValue, settings.currency, false)} of ${formatCurrency(goal.targetValue, settings.currency, false)}`
                        : `${goal.currentValue} of ${goal.targetValue} ${goal.unit}`}
                    </span>
                    <span className="flex items-center gap-1 text-neutral-400">
                      <Calendar className="w-3.5 h-3.5" />
                      {goal.deadline}
                    </span>
                  </div>
                </div>
              </div>

              {/* Inline Progress Quick Adjusters */}
              <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-bold text-neutral-400">Quick adjust:</span>
                  <button
                    onClick={() => updateGoalProgress(goal.id, 1)}
                    className="h-7 px-2 rounded-lg bg-neutral-100 dark:bg-white/10 text-xs font-bold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 cursor-pointer active:scale-95 transition-all"
                  >
                    +1
                  </button>
                  <button
                    onClick={() => updateGoalProgress(goal.id, 5)}
                    className="h-7 px-2 rounded-lg bg-neutral-100 dark:bg-white/10 text-xs font-bold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 cursor-pointer active:scale-95 transition-all"
                  >
                    +5
                  </button>
                  <button
                    onClick={() => updateGoalProgress(goal.id, 250)}
                    className="h-7 px-2 rounded-lg bg-neutral-100 dark:bg-white/10 text-xs font-bold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 cursor-pointer active:scale-95 transition-all"
                  >
                    +250
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={goal.currentValue}
                    onChange={(e) =>
                      updateGoalProgress(goal.id, parseFloat(e.target.value) || 0, true)
                    }
                    className="w-16 h-7 px-1.5 rounded-lg bg-neutral-100 dark:bg-white/10 text-xs font-bold text-neutral-900 dark:text-white text-right focus:outline-none"
                  />
                  <button
                    onClick={() => deleteGoal(goal.id)}
                    title="Delete Goal"
                    className="text-neutral-300 hover:text-red-500 p-1 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add New Goal Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white dark:bg-[#1C1C1E] rounded-[28px] p-6 shadow-2xl border border-black/10 dark:border-white/10">
            <h2 className="text-xl font-black text-neutral-900 dark:text-white mb-4">
              Add New Goal Objective
            </h2>
            <form onSubmit={handleAddSubmit} className="flex flex-col gap-4">
              <div>
                <label className="text-xs font-bold text-neutral-500 uppercase block mb-1">
                  Goal Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Half Marathon Training"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="w-full h-11 px-3.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 border-none font-semibold text-sm focus:ring-2 focus:ring-[#FF2D78]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-neutral-500 uppercase block mb-1">
                    Category
                  </label>
                  <input
                    type="text"
                    placeholder="Finance, Fitness, Skill"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 border-none font-semibold text-sm focus:ring-2 focus:ring-[#FF2D78]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-neutral-500 uppercase block mb-1">
                    Unit Symbol
                  </label>
                  <input
                    type="text"
                    placeholder="$, km, %, books"
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 border-none font-semibold text-sm focus:ring-2 focus:ring-[#FF2D78]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-neutral-500 uppercase block mb-1">
                    Current Value
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={currentVal}
                    onChange={(e) => setCurrentVal(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 border-none font-semibold text-sm focus:ring-2 focus:ring-[#FF2D78]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-neutral-500 uppercase block mb-1">
                    Target Value
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={targetVal}
                    onChange={(e) => setTargetVal(e.target.value)}
                    required
                    className="w-full h-11 px-3.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 border-none font-semibold text-sm focus:ring-2 focus:ring-[#FF2D78]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-neutral-500 uppercase block mb-1">
                  Target Deadline
                </label>
                <input
                  type="text"
                  placeholder="e.g. Dec 31, 2026"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 border-none font-semibold text-sm focus:ring-2 focus:ring-[#FF2D78]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-neutral-500 uppercase block mb-1.5">
                  Accent Color
                </label>
                <div className="flex items-center gap-2">
                  {colorChoices.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setColor(c)}
                      className={`w-8 h-8 rounded-full transition-transform cursor-pointer ${
                        color === c ? 'ring-2 ring-offset-2 ring-neutral-800 scale-110' : ''
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 mt-3 pt-3 border-t border-neutral-100 dark:border-neutral-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-neutral-600 dark:text-neutral-400 font-bold text-sm cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#FF2D78] text-white font-extrabold text-sm shadow-md hover:opacity-95 active:scale-95 transition-all cursor-pointer"
                >
                  Create Goal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
