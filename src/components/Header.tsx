import React from 'react';
import { Bell, Moon, Sun, Search } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CurrencyCode } from '../types';

export const Header: React.FC = () => {
  const { settings, setCurrency, setTheme, userProfile, setActiveTab } = useApp();

  const todayStr = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  }).format(new Date());

  const handleCurrencyChange = (curr: CurrencyCode) => {
    setCurrency(curr);
  };

  const toggleTheme = () => {
    setTheme(settings.theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <header
      id="app-top-header"
      className="sticky top-0 w-full z-30 bg-[#F2F2F7]/85 dark:bg-black/85 backdrop-blur-xl border-b border-black/[0.04] dark:border-white/10 px-4 sm:px-8 py-3.5 flex items-center justify-between transition-all"
    >
      {/* Brand & Date */}
      <div className="flex flex-col">
        <div className="flex items-center space-x-2">
          <span
            className="text-[13px] font-black uppercase tracking-tight text-neutral-900 dark:text-white"
            style={{ letterSpacing: '-0.02em' }}
          >
            VYROX
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#30D158] inline-block"></span>
          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 hidden sm:inline-block">
            RUN YOUR LIFE
          </span>
        </div>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-xs sm:text-sm font-semibold text-neutral-500 dark:text-neutral-400 tabular-nums">
            {todayStr}
          </span>
        </div>
      </div>

      {/* Action Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Currency Switcher Pill */}
        <div className="flex items-center bg-black/5 dark:bg-white/10 p-1 rounded-xl border border-black/5 dark:border-white/10">
          {(['USD', 'LKR', 'EUR'] as CurrencyCode[]).map((curr) => {
            const isSelected = settings.currency === curr;
            return (
              <button
                key={curr}
                id={`header-currency-${curr}`}
                onClick={() => handleCurrencyChange(curr)}
                className={`px-2 sm:px-2.5 py-1 text-[11px] sm:text-[12px] font-bold rounded-lg transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-sm'
                    : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-white'
                }`}
              >
                {curr === 'USD' ? '$ USD' : curr === 'LKR' ? 'Rs. LKR' : '€ EUR'}
              </button>
            );
          })}
        </div>

        {/* Theme Toggle Button */}
        <button
          id="theme-toggle-button"
          onClick={toggleTheme}
          aria-label={settings.theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          title={settings.theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          className="w-9 h-9 flex items-center justify-center rounded-full bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/15 active:scale-95 transition-all text-neutral-700 dark:text-neutral-300 cursor-pointer"
        >
          {settings.theme === 'dark' ? (
            <Sun className="w-4 h-4 text-[#FFD60A]" />
          ) : (
            <Moon className="w-4 h-4 text-[#5856D6]" />
          )}
        </button>

        {/* Notification Bell */}
        <button
          id="header-notifications-btn"
          aria-label="Notifications"
          className="w-9 h-9 relative flex items-center justify-center rounded-full bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/15 active:scale-95 transition-all text-neutral-700 dark:text-neutral-300 cursor-pointer"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#FF3B30] ring-2 ring-[#F2F2F7] dark:ring-black"></span>
        </button>

        {/* User Profile Avatar Pill */}
        <button
          id="header-profile-btn"
          onClick={() => setActiveTab('settings')}
          className="flex items-center gap-2 pl-1 cursor-pointer group"
          title="Account Settings"
        >
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#007AFF] via-[#5856D6] to-[#5E17EB] text-white flex items-center justify-center font-bold text-xs shadow-md shadow-[#007AFF]/25 group-hover:ring-2 group-hover:ring-[#007AFF] transition-all">
            {userProfile.avatarInitials}
          </div>
        </button>
      </div>
    </header>
  );
};
