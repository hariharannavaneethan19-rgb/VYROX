import React, { useState } from 'react';
import {
  User,
  DollarSign,
  Ruler,
  Moon,
  Sun,
  Bell,
  Droplets,
  Flame,
  ShieldCheck,
  ChevronRight,
  Sparkles,
  Smartphone,
  Check,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CurrencyCode, UnitSystem, ThemeMode } from '../../types';
import { formatHeight, formatWeight } from '../../utils/formatters';

export const SettingsView: React.FC = () => {
  const {
    userProfile,
    updateUserProfile,
    settings,
    updateSettings,
    setCurrency,
    setUnits,
    setTheme,
  } = useApp();

  const [name, setName] = useState<string>(userProfile.name);
  const [age, setAge] = useState<number>(userProfile.age);
  const [gender, setGender] = useState<string>(userProfile.gender);
  const [heightCm, setHeightCm] = useState<number>(userProfile.heightCm);
  const [weightKg, setWeightKg] = useState<number>(userProfile.weightKg);
  const [savedNotice, setSavedNotice] = useState<boolean>(false);

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    const initials = name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'AV';

    updateUserProfile({
      name,
      age: Number(age),
      gender,
      heightCm: Number(heightCm),
      weightKg: Number(weightKg),
      avatarInitials: initials,
    });

    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
  };

  const toggleNotification = (key: keyof typeof settings.notifications) => {
    updateSettings({
      notifications: {
        ...settings.notifications,
        [key]: !settings.notifications[key],
      },
    });
  };

  return (
    <div id="settings-view-container" className="flex flex-col gap-6 w-full max-w-[800px] mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2.5 h-2.5 rounded-full bg-neutral-400"></span>
          <span className="text-[12px] uppercase font-bold tracking-wider text-neutral-500 dark:text-neutral-400">
            System Preferences
          </span>
        </div>
        <h1 className="text-[28px] sm:text-[34px] font-black tracking-tight text-neutral-900 dark:text-white">
          Settings
        </h1>
        <p className="text-[14px] font-medium text-neutral-500 dark:text-neutral-400">
          Native iOS configuration stack for currency, telemetry units, theme, and notifications.
        </p>
      </div>

      {savedNotice && (
        <div className="p-3.5 rounded-2xl bg-[#30D158]/15 border border-[#30D158]/30 text-[#30D158] font-bold text-xs flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>Profile configuration successfully saved to active session.</span>
        </div>
      )}

      {/* GROUP 1: PROFILE & BIOMETRIC ANTHROPOMETRY */}
      <div className="flex flex-col gap-2">
        <span className="text-[11px] uppercase tracking-wider font-bold text-neutral-400 px-3">
          Profile & Anthropometry
        </span>
        <div className="rounded-[22px] bg-white dark:bg-[#1C1C1E] border border-black/[0.06] dark:border-white/10 shadow-sm overflow-hidden divide-y divide-black/[0.04] dark:divide-white/5">
          {/* Avatar Header Row */}
          <div className="p-4 flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#007AFF] via-[#5856D6] to-[#5E17EB] text-white flex items-center justify-center font-black text-lg shadow-md shadow-[#007AFF]/25 shrink-0">
              {userProfile.avatarInitials}
            </div>
            <div>
              <h2 className="text-base font-extrabold text-neutral-900 dark:text-white leading-tight">
                {userProfile.name}
              </h2>
              <span className="text-xs text-neutral-400 font-medium">
                {userProfile.age} yrs • {userProfile.gender} •{' '}
                {formatHeight(userProfile.heightCm, settings.units)} •{' '}
                {formatWeight(userProfile.weightKg, settings.units)}
              </span>
            </div>
          </div>

          <form onSubmit={handleProfileSave} className="p-4 flex flex-col gap-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold text-neutral-400 block mb-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-neutral-100 dark:bg-neutral-800 border-none font-semibold text-sm focus:ring-2 focus:ring-[#007AFF]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-neutral-400 block mb-1">Gender</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-neutral-100 dark:bg-neutral-800 border-none font-semibold text-sm focus:ring-2 focus:ring-[#007AFF]"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Non-Binary">Non-Binary</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-[11px] font-bold text-neutral-400 block mb-1">Age</label>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(parseInt(e.target.value, 10) || 0)}
                  className="w-full h-10 px-3 rounded-xl bg-neutral-100 dark:bg-neutral-800 border-none font-semibold text-sm focus:ring-2 focus:ring-[#007AFF]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-neutral-400 block mb-1">Height (cm)</label>
                <input
                  type="number"
                  value={heightCm}
                  onChange={(e) => setHeightCm(parseFloat(e.target.value) || 0)}
                  className="w-full h-10 px-3 rounded-xl bg-neutral-100 dark:bg-neutral-800 border-none font-semibold text-sm focus:ring-2 focus:ring-[#007AFF]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-neutral-400 block mb-1">Weight (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  value={weightKg}
                  onChange={(e) => setWeightKg(parseFloat(e.target.value) || 0)}
                  className="w-full h-10 px-3 rounded-xl bg-neutral-100 dark:bg-neutral-800 border-none font-semibold text-sm focus:ring-2 focus:ring-[#007AFF]"
                />
              </div>
            </div>

            <button
              type="submit"
              className="mt-1 h-10 rounded-xl bg-[#007AFF] text-white font-bold text-xs shadow-md shadow-[#007AFF]/25 hover:opacity-95 active:scale-[0.99] transition-all cursor-pointer"
            >
              Save Profile Updates
            </button>
          </form>
        </div>
      </div>

      {/* GROUP 2: SYSTEM PREFERENCES (CURRENCY, UNITS, THEME) */}
      <div className="flex flex-col gap-2">
        <span className="text-[11px] uppercase tracking-wider font-bold text-neutral-400 px-3">
          Preferences & Localization
        </span>
        <div className="rounded-[22px] bg-white dark:bg-[#1C1C1E] border border-black/[0.06] dark:border-white/10 shadow-sm overflow-hidden divide-y divide-black/[0.04] dark:divide-white/5">
          {/* Currency Row */}
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#FF3B30] text-white flex items-center justify-center font-black shadow-sm">
                <DollarSign className="w-4 h-4" />
              </div>
              <div>
                <span className="text-sm font-bold text-neutral-900 dark:text-white block leading-tight">
                  Display Currency
                </span>
                <span className="text-[11px] text-neutral-400 font-medium">
                  Auto-formats all monetary values across Finance & Home
                </span>
              </div>
            </div>

            <div className="inline-flex p-1 rounded-xl bg-neutral-100 dark:bg-neutral-800">
              {(['USD', 'LKR', 'EUR'] as CurrencyCode[]).map((curr) => (
                <button
                  key={curr}
                  id={`settings-curr-${curr}`}
                  onClick={() => setCurrency(curr)}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    settings.currency === curr
                      ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-sm'
                      : 'text-neutral-500 hover:text-neutral-900'
                  }`}
                >
                  {curr}
                </button>
              ))}
            </div>
          </div>

          {/* Units Row */}
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#00C7BE] text-white flex items-center justify-center font-black shadow-sm">
                <Ruler className="w-4 h-4" />
              </div>
              <div>
                <span className="text-sm font-bold text-neutral-900 dark:text-white block leading-tight">
                  Measurement Units
                </span>
                <span className="text-[11px] text-neutral-400 font-medium">
                  {settings.units === 'metric'
                    ? 'Metric (cm, kg, Liters, km)'
                    : 'Imperial (ft/in, lbs, fl oz, miles)'}
                </span>
              </div>
            </div>

            <div className="inline-flex p-1 rounded-xl bg-neutral-100 dark:bg-neutral-800">
              <button
                id="settings-unit-metric"
                onClick={() => setUnits('metric')}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  settings.units === 'metric'
                    ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-sm'
                    : 'text-neutral-500 hover:text-neutral-900'
                }`}
              >
                Metric
              </button>
              <button
                id="settings-unit-imperial"
                onClick={() => setUnits('imperial')}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  settings.units === 'imperial'
                    ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-sm'
                    : 'text-neutral-500 hover:text-neutral-900'
                }`}
              >
                Imperial
              </button>
            </div>
          </div>

          {/* Theme Row */}
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#5856D6] text-white flex items-center justify-center font-black shadow-sm">
                {settings.theme === 'dark' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
              </div>
              <div>
                <span className="text-sm font-bold text-neutral-900 dark:text-white block leading-tight">
                  Appearance Mode
                </span>
                <span className="text-[11px] text-neutral-400 font-medium">
                  {settings.theme === 'dark'
                    ? 'Dark (OLED Black canvas)'
                    : 'Light (#F2F2F7 grouped background)'}
                </span>
              </div>
            </div>

            <div className="inline-flex p-1 rounded-xl bg-neutral-100 dark:bg-neutral-800">
              <button
                id="settings-theme-light"
                onClick={() => setTheme('light')}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                  settings.theme === 'light'
                    ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-sm'
                    : 'text-neutral-500'
                }`}
              >
                <Sun className="w-3.5 h-3.5" />
                <span>Light</span>
              </button>
              <button
                id="settings-theme-dark"
                onClick={() => setTheme('dark')}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                  settings.theme === 'dark'
                    ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-sm'
                    : 'text-neutral-500'
                }`}
              >
                <Moon className="w-3.5 h-3.5" />
                <span>Dark</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* GROUP 3: NOTIFICATION PREFERENCES */}
      <div className="flex flex-col gap-2">
        <span className="text-[11px] uppercase tracking-wider font-bold text-neutral-400 px-3">
          Notification Preferences
        </span>
        <div className="rounded-[22px] bg-white dark:bg-[#1C1C1E] border border-black/[0.06] dark:border-white/10 shadow-sm overflow-hidden divide-y divide-black/[0.04] dark:divide-white/5">
          {/* Daily Reminders */}
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#FF9500] text-white flex items-center justify-center font-bold">
                <Bell className="w-4 h-4" />
              </div>
              <span className="text-sm font-semibold text-neutral-900 dark:text-white">
                Daily Morning Synthesis
              </span>
            </div>
            <button
              id="toggle-daily-reminders"
              onClick={() => toggleNotification('dailyReminders')}
              className={`w-12 h-7 rounded-full transition-colors cursor-pointer p-0.5 ${
                settings.notifications.dailyReminders ? 'bg-[#30D158]' : 'bg-neutral-300 dark:bg-neutral-700'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full bg-white shadow-sm transition-transform ${
                  settings.notifications.dailyReminders ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Water Alerts */}
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#00C7BE] text-white flex items-center justify-center font-bold">
                <Droplets className="w-4 h-4" />
              </div>
              <span className="text-sm font-semibold text-neutral-900 dark:text-white">
                Cellular Hydration Reminders
              </span>
            </div>
            <button
              id="toggle-water-alerts"
              onClick={() => toggleNotification('waterAlerts')}
              className={`w-12 h-7 rounded-full transition-colors cursor-pointer p-0.5 ${
                settings.notifications.waterAlerts ? 'bg-[#30D158]' : 'bg-neutral-300 dark:bg-neutral-700'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full bg-white shadow-sm transition-transform ${
                  settings.notifications.waterAlerts ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Habit Streaks */}
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#5E17EB] text-white flex items-center justify-center font-bold">
                <Flame className="w-4 h-4" />
              </div>
              <span className="text-sm font-semibold text-neutral-900 dark:text-white">
                Habit Streak Protection Alert
              </span>
            </div>
            <button
              id="toggle-habit-alerts"
              onClick={() => toggleNotification('habitStreakAlerts')}
              className={`w-12 h-7 rounded-full transition-colors cursor-pointer p-0.5 ${
                settings.notifications.habitStreakAlerts ? 'bg-[#30D158]' : 'bg-neutral-300 dark:bg-neutral-700'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full bg-white shadow-sm transition-transform ${
                  settings.notifications.habitStreakAlerts ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Budget Limit Alerts */}
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#FF3B30] text-white flex items-center justify-center font-bold">
                <DollarSign className="w-4 h-4" />
              </div>
              <span className="text-sm font-semibold text-neutral-900 dark:text-white">
                Daily Burn Rate Limit Warning
              </span>
            </div>
            <button
              id="toggle-budget-alerts"
              onClick={() => toggleNotification('budgetLimitAlerts')}
              className={`w-12 h-7 rounded-full transition-colors cursor-pointer p-0.5 ${
                settings.notifications.budgetLimitAlerts ? 'bg-[#30D158]' : 'bg-neutral-300 dark:bg-neutral-700'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full bg-white shadow-sm transition-transform ${
                  settings.notifications.budgetLimitAlerts ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
