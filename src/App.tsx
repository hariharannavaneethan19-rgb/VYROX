import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navigation } from './components/Navigation';
import { Header } from './components/Header';
import { HomeView } from './components/views/HomeView';
import { HealthView } from './components/views/HealthView';
import { FinanceView } from './components/views/FinanceView';
import { HabitsView } from './components/views/HabitsView';
import { GoalsView } from './components/views/GoalsView';
import { ProgressView } from './components/views/ProgressView';
import { SettingsView } from './components/views/SettingsView';
import { QuickLogModal } from './components/QuickLogModal';

const AppContent: React.FC = () => {
  const { activeTab } = useApp();
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState<boolean>(false);

  return (
    <div className="min-h-screen bg-[#F2F2F7] dark:bg-black text-neutral-900 dark:text-neutral-100 flex flex-col font-sans transition-colors duration-300">
      {/* Navigation (Sidebar on Desktop, Rail on Tablet, Bottom Pill on Mobile) */}
      <Navigation />

      {/* Main Content Area with Adaptive Padding to Avoid Navigation Overlap */}
      <div className="flex-1 flex flex-col xl:pl-[272px] md:pl-[96px] pb-28 md:pb-10 transition-all duration-300">
        {/* Sticky Top Bar */}
        <Header />

        {/* View Surface */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {activeTab === 'home' && (
            <HomeView onOpenExpenseModal={() => setIsExpenseModalOpen(true)} />
          )}
          {activeTab === 'health' && <HealthView />}
          {activeTab === 'finance' && (
            <FinanceView onOpenExpenseModal={() => setIsExpenseModalOpen(true)} />
          )}
          {activeTab === 'habits' && <HabitsView />}
          {activeTab === 'goals' && <GoalsView />}
          {activeTab === 'progress' && <ProgressView />}
          {activeTab === 'settings' && <SettingsView />}
        </main>
      </div>

      {/* Quick Log Modal accessible across the app */}
      <QuickLogModal
        isOpen={isExpenseModalOpen}
        onClose={() => setIsExpenseModalOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
