import React from 'react';
import {
  LayoutGrid,
  Heart,
  Wallet,
  CheckCircle2,
  Flag,
  LineChart,
  Settings,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { TabType } from '../types';

interface NavItem {
  id: TabType;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
}

const navItems: NavItem[] = [
  { id: 'home', label: 'Home', icon: LayoutGrid, accentColor: 'text-[#007AFF]' },
  { id: 'health', label: 'Health', icon: Heart, accentColor: 'text-[#30D158]' },
  { id: 'finance', label: 'Finance', icon: Wallet, accentColor: 'text-[#FF6B00]' },
  { id: 'habits', label: 'Habits', icon: CheckCircle2, accentColor: 'text-[#5E17EB]' },
  { id: 'goals', label: 'Goals', icon: Flag, accentColor: 'text-[#FF2D78]' },
  { id: 'progress', label: 'Progress', icon: LineChart, accentColor: 'text-[#00C7BE]' },
  { id: 'settings', label: 'Settings', icon: Settings, accentColor: 'text-neutral-500' },
];

export const Navigation: React.FC = () => {
  const { activeTab, setActiveTab } = useApp();

  return (
    <>
      {/* DESKTOP SIDEBAR (>= 1280px / xl:) */}
      <aside
        id="desktop-nav-sidebar"
        className="hidden xl:flex fixed top-6 left-6 bottom-6 w-[240px] z-40 rounded-[24px] bg-white/80 dark:bg-[#1C1C1E]/80 backdrop-blur-2xl border border-black/[0.06] dark:border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.08)] flex-col p-4 justify-between transition-all"
      >
        <div className="flex flex-col gap-6">
          {/* Brand Header */}
          <div className="flex items-center gap-3 px-2 py-1">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#007AFF] via-[#5856D6] to-[#5E17EB] flex items-center justify-center text-white shadow-lg shadow-[#007AFF]/30 shrink-0">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-[18px] font-black tracking-tight text-neutral-900 dark:text-white leading-none font-sans">
                VYROX
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mt-1">
                RUN YOUR LIFE
              </span>
            </div>
          </div>

          {/* Nav List */}
          <nav className="flex flex-col gap-1.5" aria-label="Main Navigation">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`desktop-nav-${item.id}`}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-2xl transition-all font-medium text-[15px] text-left cursor-pointer active:scale-[0.98] ${
                    isActive
                      ? 'bg-[#007AFF] text-white font-semibold shadow-md shadow-[#007AFF]/25'
                      : 'text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-white/5 hover:text-neutral-900 dark:hover:text-white'
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 transition-transform ${
                      isActive ? 'text-white' : item.accentColor
                    }`}
                  />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sync Status Badge */}
        <div className="p-3 rounded-2xl bg-black/[0.03] dark:bg-white/5 border border-black/[0.04] dark:border-white/5 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#30D158] animate-pulse"></span>
            <span className="text-[12px] text-neutral-600 dark:text-neutral-300 font-semibold">
              Live Core
            </span>
          </div>
          <span className="text-[11px] font-mono text-neutral-400 dark:text-neutral-500 font-bold">
            v2.4
          </span>
        </div>
      </aside>

      {/* TABLET NAV RAIL (768px - 1279px) */}
      <aside
        id="tablet-nav-rail"
        className="hidden md:flex xl:hidden fixed top-6 left-4 bottom-6 w-[72px] z-40 rounded-[24px] bg-white/80 dark:bg-[#1C1C1E]/80 backdrop-blur-2xl border border-black/[0.06] dark:border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.08)] flex-col p-3 items-center justify-between transition-all"
      >
        <div className="flex flex-col items-center gap-6 w-full">
          {/* Brand Icon */}
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#007AFF] via-[#5856D6] to-[#5E17EB] flex items-center justify-center text-white shadow-md shadow-[#007AFF]/25 shrink-0">
            <Sparkles className="w-5 h-5 text-white" />
          </div>

          <nav className="flex flex-col gap-2 w-full items-center">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`tablet-nav-${item.id}`}
                  title={item.label}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all cursor-pointer active:scale-95 ${
                    isActive
                      ? 'bg-[#007AFF] text-white shadow-md shadow-[#007AFF]/30'
                      : 'text-neutral-500 dark:text-neutral-400 hover:bg-black/5 dark:hover:bg-white/5 hover:text-neutral-900 dark:hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </button>
              );
            })}
          </nav>
        </div>

        <div className="w-2.5 h-2.5 rounded-full bg-[#30D158]" title="Telemetry Syncing" />
      </aside>

      {/* MOBILE BOTTOM FLOATING PILL (<= 767px) */}
      <div
        id="mobile-bottom-nav-container"
        className="md:hidden fixed bottom-0 left-0 right-0 z-50 pb-safe pointer-events-none flex justify-center px-3"
      >
        <nav
          className="pointer-events-auto mb-3 w-full max-w-[420px] h-14 rounded-full bg-white/85 dark:bg-[#1C1C1E]/85 backdrop-blur-2xl border border-black/[0.08] dark:border-white/15 shadow-[0_8px_30px_rgba(0,0,0,0.18)] flex items-center justify-around px-2"
          aria-label="Mobile Navigation"
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`mobile-nav-${item.id}`}
                onClick={() => setActiveTab(item.id)}
                aria-label={item.label}
                className={`w-10 h-10 rounded-full flex flex-col items-center justify-center transition-all cursor-pointer active:scale-90 ${
                  isActive
                    ? 'bg-[#007AFF] text-white shadow-md shadow-[#007AFF]/25 scale-105'
                    : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                <Icon className="w-[20px] h-[20px]" />
              </button>
            );
          })}
        </nav>
      </div>
    </>
  );
};
