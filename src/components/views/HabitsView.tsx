import React, { useState } from 'react';
import {
  CheckCircle2,
  Flame,
  Plus,
  Trash2,
  Sparkles,
  Calendar,
  Check,
  Award,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const HabitsView: React.FC = () => {
  const { habits, toggleHabitDay, addHabit, deleteHabit, habitStats } = useApp();

  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [newHabitName, setNewHabitName] = useState<string>('');
  const [newHabitCategory, setNewHabitCategory] = useState<string>('Discipline');
  const [newHabitTarget, setNewHabitTarget] = useState<number>(7);
  const [newHabitColor, setNewHabitColor] = useState<string>('#5E17EB');

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const colorOptions = [
    { label: 'Purple', hex: '#5E17EB' },
    { label: 'Yellow', hex: '#FFD60A' },
    { label: 'Teal', hex: '#00C7BE' },
    { label: 'Green', hex: '#30D158' },
    { label: 'Pink', hex: '#FF2D78' },
    { label: 'Orange', hex: '#FF6B00' },
  ];

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHabitName.trim()) return;

    addHabit({
      name: newHabitName.trim(),
      category: newHabitCategory,
      targetSessions: newHabitTarget,
      color: newHabitColor,
    });

    setNewHabitName('');
    setShowAddModal(false);
  };

  return (
    <div id="habits-view-container" className="flex flex-col gap-6 w-full max-w-[1200px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#5E17EB]"></span>
            <span className="text-[12px] uppercase font-bold tracking-wider text-neutral-500 dark:text-neutral-400">
              Behavioral Matrix
            </span>
          </div>
          <h1 className="text-[28px] sm:text-[34px] font-black tracking-tight text-neutral-900 dark:text-white">
            Habits & Daily Disciplines
          </h1>
          <p className="text-[14px] font-medium text-neutral-500 dark:text-neutral-400">
            Click any day marker to update streaks and weekly completion live.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {/* Streak Flame Pill */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FFD60A] text-slate-950 font-black text-xs shadow-sm">
            <Flame className="w-4 h-4 fill-slate-950" />
            <span>{habitStats.currentStreakDays} Day Streak</span>
          </div>

          <button
            id="add-habit-open-btn"
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 rounded-xl bg-[#5E17EB] text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-[#5E17EB]/25 hover:opacity-95 active:scale-95 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Habit</span>
          </button>
        </div>
      </div>

      {/* Habit Consistency Banner */}
      <div
        className="rounded-[24px] p-6 text-white shadow-xl shadow-[#5E17EB]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        style={{
          background: 'linear-gradient(135deg, #5E17EB 0%, #370096 100%)',
        }}
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
            <Award className="w-6 h-6 text-[#FFD60A]" />
          </div>
          <div>
            <h2 className="text-lg font-black tracking-tight">Weekly Consistency Score</h2>
            <p className="text-xs text-white/80 font-medium">
              Calculated across all tracked protocols for this rolling 7-day window.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6 border-t sm:border-t-0 sm:border-l border-white/20 pt-3 sm:pt-0 sm:pl-6">
          <div>
            <span className="text-[10px] uppercase font-bold text-white/70 block">
              Completion Rate
            </span>
            <span className="text-2xl sm:text-3xl font-black text-white tabular-nums">
              {habitStats.averageCompletionPct}%
            </span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-white/70 block">
              Habits Tracked
            </span>
            <span className="text-2xl sm:text-3xl font-black text-[#FFD60A] tabular-nums">
              {habits.length}
            </span>
          </div>
        </div>
      </div>

      {/* Habit List */}
      <div className="space-y-4">
        {habits.map((habit) => {
          const completedCount = habit.history.filter(Boolean).length;
          const habitCompletionPct = Math.round((completedCount / 7) * 100);

          return (
            <div
              key={habit.id}
              className="rounded-[24px] p-5 sm:p-6 bg-white dark:bg-[#1C1C1E] border border-black/[0.06] dark:border-white/10 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all"
            >
              {/* Habit Details */}
              <div className="flex items-center gap-3.5 min-w-[240px]">
                <div
                  className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 text-white font-black shadow-sm"
                  style={{ backgroundColor: habit.color }}
                >
                  <Check className="w-5 h-5 stroke-[3]" />
                </div>
                <div>
                  <h3 className="text-[16px] font-extrabold text-neutral-900 dark:text-white">
                    {habit.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs font-semibold text-neutral-400">{habit.category}</span>
                    <span className="text-xs font-bold text-neutral-500">•</span>
                    <span className="text-xs font-bold text-[#5E17EB] dark:text-[#cdbdff]">
                      {completedCount} of {habit.targetSessions} days done
                    </span>
                  </div>
                </div>
              </div>

              {/* 7-Day Matrix Row */}
              <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-3 flex-1">
                {days.map((d, dayIdx) => {
                  const isDone = habit.history[dayIdx];
                  return (
                    <div key={dayIdx} className="flex flex-col items-center gap-1.5">
                      <span className="text-[10px] font-bold text-neutral-400">{d}</span>
                      <button
                        id={`habit-${habit.id}-day-${dayIdx}`}
                        onClick={() => toggleHabitDay(habit.id, dayIdx)}
                        title={`Toggle ${d} for ${habit.name}`}
                        className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all cursor-pointer active:scale-90 ${
                          isDone
                            ? 'text-white shadow-sm'
                            : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-400 hover:bg-neutral-200'
                        }`}
                        style={{
                          backgroundColor: isDone ? habit.color : undefined,
                        }}
                      >
                        {isDone ? (
                          <Check className="w-5 h-5 stroke-[3]" />
                        ) : (
                          <span className="w-2 h-2 rounded-full bg-neutral-300 dark:bg-neutral-600"></span>
                        )}
                      </button>
                    </div>
                  );
                })}

                {/* Habit Delete & Completion Pill */}
                <div className="flex items-center gap-2 pl-3 border-l border-neutral-100 dark:border-neutral-800">
                  <span className="text-xs font-black text-neutral-700 dark:text-neutral-300 tabular-nums w-9 text-right">
                    {habitCompletionPct}%
                  </span>
                  <button
                    onClick={() => deleteHabit(habit.id)}
                    title="Delete Habit"
                    className="text-neutral-300 hover:text-red-500 p-1.5 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add New Habit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white dark:bg-[#1C1C1E] rounded-[28px] p-6 shadow-2xl border border-black/10 dark:border-white/10">
            <h2 className="text-xl font-black text-neutral-900 dark:text-white mb-4">
              Add New Habit Protocol
            </h2>
            <form onSubmit={handleAddSubmit} className="flex flex-col gap-4">
              <div>
                <label className="text-xs font-bold text-neutral-500 uppercase block mb-1">
                  Habit Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. 20-min Zone 2 Rowing"
                  value={newHabitName}
                  onChange={(e) => setNewHabitName(e.target.value)}
                  required
                  className="w-full h-11 px-3.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 border-none font-semibold text-sm focus:ring-2 focus:ring-[#5E17EB]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-neutral-500 uppercase block mb-1">
                    Domain / Tag
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Circadian, Mind, Gym"
                    value={newHabitCategory}
                    onChange={(e) => setNewHabitCategory(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 border-none font-semibold text-sm focus:ring-2 focus:ring-[#5E17EB]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-neutral-500 uppercase block mb-1">
                    Target Sessions/Week
                  </label>
                  <select
                    value={newHabitTarget}
                    onChange={(e) => setNewHabitTarget(parseInt(e.target.value, 10))}
                    className="w-full h-11 px-3 rounded-xl bg-neutral-100 dark:bg-neutral-800 border-none font-semibold text-sm focus:ring-2 focus:ring-[#5E17EB]"
                  >
                    {[1, 2, 3, 4, 5, 6, 7].map((num) => (
                      <option key={num} value={num}>
                        {num} days
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-neutral-500 uppercase block mb-1.5">
                  Color Accent
                </label>
                <div className="flex items-center gap-2">
                  {colorOptions.map((c) => (
                    <button
                      key={c.hex}
                      type="button"
                      onClick={() => setNewHabitColor(c.hex)}
                      className={`w-8 h-8 rounded-full transition-transform cursor-pointer ${
                        newHabitColor === c.hex ? 'ring-2 ring-offset-2 ring-neutral-800 scale-110' : ''
                      }`}
                      style={{ backgroundColor: c.hex }}
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
                  className="px-5 py-2.5 rounded-xl bg-[#5E17EB] text-white font-extrabold text-sm shadow-md hover:opacity-95 active:scale-95 transition-all cursor-pointer"
                >
                  Create Protocol
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
