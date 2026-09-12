import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import {
  TabType,
  UserProfile,
  UserSettings,
  HydrationData,
  ActivityData,
  SleepData,
  Transaction,
  Habit,
  Goal,
  HistoricalDataPoint,
  CompositeScoreWeights,
  CurrencyCode,
  UnitSystem,
  ThemeMode,
} from '../types';

export const SCORE_WEIGHTS: CompositeScoreWeights = {
  health: 0.30,
  finance: 0.25,
  habits: 0.25,
  goals: 0.20,
};

interface AppContextType {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  userProfile: UserProfile;
  updateUserProfile: (profile: Partial<UserProfile>) => void;
  settings: UserSettings;
  updateSettings: (settings: Partial<UserSettings>) => void;
  setCurrency: (currency: CurrencyCode) => void;
  setUnits: (units: UnitSystem) => void;
  setTheme: (theme: ThemeMode) => void;
  // Health
  hydration: HydrationData;
  logWater: (amountMl: number) => void;
  setHydrationTarget: (targetMl: number) => void;
  resetHydration: () => void;
  activity: ActivityData;
  updateActivity: (activity: Partial<ActivityData>) => void;
  sleep: SleepData;
  updateSleep: (sleep: Partial<SleepData>) => void;
  recoveryScore: number;
  // Finance
  transactions: Transaction[];
  addTransaction: (tx: Omit<Transaction, 'id'>) => void;
  deleteTransaction: (id: string) => void;
  totalIncome: number;
  totalExpense: number;
  netBalance: number;
  burnRateToday: number;
  savingsRate: number;
  categorySpending: { category: string; amount: number; color: string }[];
  // Habits
  habits: Habit[];
  toggleHabitDay: (habitId: string, dayIndex: number) => void;
  addHabit: (habit: Omit<Habit, 'id' | 'history'>) => void;
  deleteHabit: (id: string) => void;
  habitStats: { averageCompletionPct: number; currentStreakDays: number };
  // Goals
  goals: Goal[];
  addGoal: (goal: Omit<Goal, 'id'>) => void;
  updateGoalProgress: (goalId: string, deltaOrValue: number, isAbsolute?: boolean) => void;
  deleteGoal: (id: string) => void;
  // Computed Composite Score
  compositeScore: number;
  subScores: {
    health: number;
    finance: number;
    habits: number;
    goals: number;
  };
  // Progress history
  history7Days: HistoricalDataPoint[];
  history30Days: HistoricalDataPoint[];
}

const initialProfile: UserProfile = {
  name: 'Alex Vance',
  age: 29,
  gender: 'Male',
  heightCm: 182,
  weightKg: 78.4,
  avatarInitials: 'AV',
};

const getInitialTheme = (): ThemeMode => {
  try {
    const saved = localStorage.getItem('vyrox_theme');
    if (saved === 'dark' || saved === 'light') {
      return saved;
    }
    if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
  } catch {
    // fallback
  }
  return 'light';
};

const initialSettings: UserSettings = {
  currency: 'USD',
  units: 'metric',
  theme: getInitialTheme(),
  notifications: {
    dailyReminders: true,
    waterAlerts: true,
    habitStreakAlerts: true,
    budgetLimitAlerts: false,
  },
};

const initialHydration: HydrationData = {
  currentMl: 1800,
  targetMl: 2500,
};

const initialActivity: ActivityData = {
  steps: 7842,
  stepTarget: 10000,
  workoutMinutes: 36,
  workoutTarget: 45,
  caloriesBurned: 540,
  calorieTarget: 600,
  standHours: 10,
  standTarget: 12,
  vo2Max: 48.2,
};

const initialSleep: SleepData = {
  hoursSlept: 8.4,
  restingHeartRate: 64,
  hrvMs: 74,
  deepSleepMinutes: 108,
};

const initialTransactions: Transaction[] = [
  {
    id: 'tx-1',
    title: 'Whole Foods Market',
    amount: 68.4,
    type: 'expense',
    category: 'Fuel & Dine',
    note: 'Organic groceries & electrolytes',
    date: 'Today',
  },
  {
    id: 'tx-2',
    title: 'Performance Coaching SaaS',
    amount: 29.0,
    type: 'expense',
    category: 'SaaS Ops',
    note: 'Monthly analytics membership',
    date: 'Today',
  },
  {
    id: 'tx-3',
    title: 'Client Retainer Payout',
    amount: 3250.0,
    type: 'income',
    category: 'Consulting',
    note: 'Q4 Product engineering contract',
    date: 'Yesterday',
  },
  {
    id: 'tx-4',
    title: 'Equinox Recovery Club',
    amount: 145.0,
    type: 'expense',
    category: 'Wellness',
    note: 'Cold plunge & sauna pass',
    date: '3 days ago',
  },
  {
    id: 'tx-5',
    title: 'Dividend Yield',
    amount: 420.0,
    type: 'income',
    category: 'Investments',
    note: 'Vanguard Total Stock Market',
    date: '4 days ago',
  },
  {
    id: 'tx-6',
    title: 'Bio-hacking Supplement Stack',
    amount: 85.0,
    type: 'expense',
    category: 'Wellness',
    note: 'Magnesium, Omega 3, Vitamin D3',
    date: '5 days ago',
  },
];

const initialHabits: Habit[] = [
  {
    id: 'h-1',
    name: 'Morning Sunlight Protocol (15m)',
    category: 'Circadian',
    targetSessions: 7,
    color: '#FFD60A',
    history: [true, true, true, true, true, true, true],
  },
  {
    id: 'h-2',
    name: 'Deep Focus Block (90m Protocol)',
    category: 'Productivity',
    targetSessions: 5,
    color: '#5E17EB',
    history: [true, true, true, true, true, true, false],
  },
  {
    id: 'h-3',
    name: 'Creatine & Electrolytes Fuel',
    category: 'Nutrition',
    targetSessions: 7,
    color: '#00C7BE',
    history: [true, true, true, true, true, true, true],
  },
  {
    id: 'h-4',
    name: 'Zone 2 Cardio / Mobility',
    category: 'Fitness',
    targetSessions: 5,
    color: '#30D158',
    history: [true, true, true, true, false, true, true],
  },
  {
    id: 'h-5',
    name: 'Zero Blue Light by 21:30',
    category: 'Sleep',
    targetSessions: 7,
    color: '#FF2D78',
    history: [true, true, true, true, true, false, true],
  },
];

const initialGoals: Goal[] = [
  {
    id: 'g-1',
    title: 'Emergency Runway Reserve',
    category: 'Finance',
    currentValue: 10500,
    targetValue: 15000,
    unit: '$',
    deadline: 'Dec 31, 2026',
    color: '#FF3B30',
  },
  {
    id: 'g-2',
    title: 'Sub-20m 5K Speed Conditioning',
    category: 'Fitness',
    currentValue: 82,
    targetValue: 100,
    unit: '%',
    deadline: 'Nov 15, 2026',
    color: '#30D158',
  },
  {
    id: 'g-3',
    title: 'Biophysics Synthesis Chapters',
    category: 'Mind',
    currentValue: 12,
    targetValue: 16,
    unit: 'Ch',
    deadline: 'Oct 30, 2026',
    color: '#5E17EB',
  },
  {
    id: 'g-4',
    title: 'Cold Exposure Immersion',
    category: 'Discipline',
    currentValue: 18,
    targetValue: 20,
    unit: 'Days',
    deadline: 'Nov 01, 2026',
    color: '#00C7BE',
  },
];

// Helper to generate realistic historical trend samples
function generateHistoricalData(): { days7: HistoricalDataPoint[]; days30: HistoricalDataPoint[] } {
  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const days7: HistoricalDataPoint[] = [];
  const days30: HistoricalDataPoint[] = [];

  // Last 7 days
  const baseDate = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(baseDate);
    d.setDate(d.getDate() - i);
    const dayLabel = dayNames[d.getDay() === 0 ? 6 : d.getDay() - 1];
    const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

    days7.push({
      date: dateStr,
      dayLabel,
      hydrationMl: 1700 + Math.round(Math.sin(i * 1.2) * 500 + 400),
      habitCompletionPct: Math.min(100, Math.round(75 + Math.sin(i * 0.8) * 20)),
      savingsBalance: 3900 + (6 - i) * 65,
      weightKg: +(79.2 - (6 - i) * 0.12).toFixed(1),
      steps: 7200 + Math.round(Math.cos(i) * 1800),
    });
  }

  // Last 30 days
  for (let i = 29; i >= 0; i--) {
    const d = new Date(baseDate);
    d.setDate(d.getDate() - i);
    const dayLabel = dayNames[d.getDay() === 0 ? 6 : d.getDay() - 1];
    const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

    days30.push({
      date: dateStr,
      dayLabel,
      hydrationMl: 1600 + Math.round(Math.sin(i * 0.4) * 600 + 450),
      habitCompletionPct: Math.min(100, Math.max(50, Math.round(70 + Math.cos(i * 0.5) * 25))),
      savingsBalance: 3200 + (29 - i) * 38 + Math.round(Math.sin(i * 0.3) * 120),
      weightKg: +(80.5 - (29 - i) * 0.07 + Math.sin(i * 0.2) * 0.2).toFixed(1),
      steps: 6800 + Math.round(Math.sin(i * 0.7) * 2600 + 1200),
    });
  }

  return { days7, days30 };
}

const { days7: initialHistory7, days30: initialHistory30 } = generateHistoricalData();

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [userProfile, setUserProfile] = useState<UserProfile>(initialProfile);
  const [settings, setSettings] = useState<UserSettings>(initialSettings);
  const [hydration, setHydration] = useState<HydrationData>(initialHydration);
  const [activity, setActivity] = useState<ActivityData>(initialActivity);
  const [sleep, setSleep] = useState<SleepData>(initialSleep);
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [habits, setHabits] = useState<Habit[]>(initialHabits);
  const [goals, setGoals] = useState<Goal[]>(initialGoals);

  // Apply dark mode class to root documentElement on theme change
  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    if (settings.theme === 'dark') {
      root.classList.add('dark');
      if (body) body.classList.add('dark');
      root.setAttribute('data-theme', 'dark');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.remove('dark');
      if (body) body.classList.remove('dark');
      root.setAttribute('data-theme', 'light');
      root.style.colorScheme = 'light';
    }

    try {
      localStorage.setItem('vyrox_theme', settings.theme);
    } catch {
      // ignore
    }
  }, [settings.theme]);

  const updateUserProfile = (profile: Partial<UserProfile>) => {
    setUserProfile((prev) => ({ ...prev, ...profile }));
  };

  const updateSettings = (newSettings: Partial<UserSettings>) => {
    setSettings((prev) => ({
      ...prev,
      ...newSettings,
      notifications: {
        ...prev.notifications,
        ...(newSettings.notifications || {}),
      },
    }));
  };

  const setCurrency = (currency: CurrencyCode) => {
    updateSettings({ currency });
  };

  const setUnits = (units: UnitSystem) => {
    updateSettings({ units });
  };

  const setTheme = (theme: ThemeMode) => {
    updateSettings({ theme });
  };

  // Health actions
  const logWater = (amountMl: number) => {
    setHydration((prev) => ({
      ...prev,
      currentMl: Math.max(0, +(prev.currentMl + amountMl)),
    }));
  };

  const setHydrationTarget = (targetMl: number) => {
    setHydration((prev) => ({
      ...prev,
      targetMl: Math.max(500, targetMl),
    }));
  };

  const resetHydration = () => {
    setHydration((prev) => ({ ...prev, currentMl: 0 }));
  };

  const updateActivity = (act: Partial<ActivityData>) => {
    setActivity((prev) => ({ ...prev, ...act }));
  };

  const updateSleep = (slp: Partial<SleepData>) => {
    setSleep((prev) => ({ ...prev, ...slp }));
  };

  // Recovery score calculation
  const recoveryScore = useMemo(() => {
    // Sleep contribution (0-40 pts): 8h = 40 pts
    const sleepScore = Math.min(40, (sleep.hoursSlept / 8.0) * 40);
    // Resting HR contribution (0-30 pts): <= 55 = 30 pts, 85 = 10 pts
    const hrScore = Math.min(30, Math.max(5, (90 - sleep.restingHeartRate) * 0.85));
    // HRV score (0-30 pts): 80ms+ = 30 pts
    const hrvScore = Math.min(30, (sleep.hrvMs / 80) * 30);
    return Math.round(sleepScore + hrScore + hrvScore);
  }, [sleep]);

  // Finance calculations
  const addTransaction = (tx: Omit<Transaction, 'id'>) => {
    const newTx: Transaction = {
      ...tx,
      id: `tx-${Date.now()}`,
    };
    setTransactions((prev) => [newTx, ...prev]);
  };

  const deleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  const totalIncome = useMemo(() => {
    return transactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
  }, [transactions]);

  const totalExpense = useMemo(() => {
    return transactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
  }, [transactions]);

  // Base capital balance (starting with $4,280.50 snapshot + net changes)
  const netBalance = useMemo(() => {
    const baseLiquidCapital = 4280.50;
    return baseLiquidCapital + (totalIncome - 3670.0) - (totalExpense - 327.4);
  }, [totalIncome, totalExpense]);

  const burnRateToday = useMemo(() => {
    return transactions
      .filter((t) => t.type === 'expense' && t.date === 'Today')
      .reduce((sum, t) => sum + t.amount, 0) || 42.80;
  }, [transactions]);

  const savingsRate = useMemo(() => {
    if (totalIncome === 0) return 0;
    const rate = ((totalIncome - totalExpense) / totalIncome) * 100;
    return Math.max(0, Math.min(100, Math.round(rate)));
  }, [totalIncome, totalExpense]);

  const categorySpending = useMemo(() => {
    const map: Record<string, number> = {};
    const colors = ['#FF3B30', '#FF6B00', '#FFD60A', '#5E17EB', '#00C7BE', '#30D158'];
    transactions
      .filter((t) => t.type === 'expense')
      .forEach((t) => {
        map[t.category] = (map[t.category] || 0) + t.amount;
      });

    return Object.entries(map).map(([category, amount], idx) => ({
      category,
      amount,
      color: colors[idx % colors.length],
    }));
  }, [transactions]);

  // Habit calculations
  const toggleHabitDay = (habitId: string, dayIndex: number) => {
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id === habitId) {
          const newHistory = [...h.history];
          newHistory[dayIndex] = !newHistory[dayIndex];
          return { ...h, history: newHistory };
        }
        return h;
      })
    );
  };

  const addHabit = (habit: Omit<Habit, 'id' | 'history'>) => {
    const newHabit: Habit = {
      ...habit,
      id: `h-${Date.now()}`,
      history: [false, false, false, false, false, false, false],
    };
    setHabits((prev) => [...prev, newHabit]);
  };

  const deleteHabit = (id: string) => {
    setHabits((prev) => prev.filter((h) => h.id !== id));
  };

  const habitStats = useMemo(() => {
    if (habits.length === 0) return { averageCompletionPct: 0, currentStreakDays: 0 };
    let totalCompleted = 0;
    let totalPossible = habits.length * 7;
    habits.forEach((h) => {
      totalCompleted += h.history.filter(Boolean).length;
    });

    const averageCompletionPct = Math.round((totalCompleted / totalPossible) * 100);
    // 14 days baseline streak plus current week consistency
    const currentStreakDays = 14 + (averageCompletionPct > 80 ? 2 : 0);

    return { averageCompletionPct, currentStreakDays };
  }, [habits]);

  // Goals calculations
  const addGoal = (goal: Omit<Goal, 'id'>) => {
    const newGoal: Goal = {
      ...goal,
      id: `g-${Date.now()}`,
    };
    setGoals((prev) => [...prev, newGoal]);
  };

  const updateGoalProgress = (goalId: string, deltaOrValue: number, isAbsolute = false) => {
    setGoals((prev) =>
      prev.map((g) => {
        if (g.id === goalId) {
          const newVal = isAbsolute
            ? Math.max(0, deltaOrValue)
            : Math.max(0, g.currentValue + deltaOrValue);
          return { ...g, currentValue: newVal };
        }
        return g;
      })
    );
  };

  const deleteGoal = (id: string) => {
    setGoals((prev) => prev.filter((g) => g.id !== id));
  };

  // Composite Life Score Calculation
  const { compositeScore, subScores } = useMemo(() => {
    // 1. Health Score (Hydration % + Steps % + Sleep Recovery)
    const hydPct = Math.min(100, (hydration.currentMl / hydration.targetMl) * 100);
    const stepPct = Math.min(100, (activity.steps / activity.stepTarget) * 100);
    const healthScore = Math.round(hydPct * 0.35 + stepPct * 0.35 + recoveryScore * 0.3);

    // 2. Finance Score
    const financeScore = Math.round(Math.min(100, Math.max(20, savingsRate * 0.8 + 25)));

    // 3. Habits Score
    const habitsScore = habitStats.averageCompletionPct;

    // 4. Goals Score
    let goalsProgressSum = 0;
    goals.forEach((g) => {
      goalsProgressSum += Math.min(100, (g.currentValue / g.targetValue) * 100);
    });
    const goalsScore = goals.length > 0 ? Math.round(goalsProgressSum / goals.length) : 80;

    // Weighted composite
    const rawComposite =
      healthScore * SCORE_WEIGHTS.health +
      financeScore * SCORE_WEIGHTS.finance +
      habitsScore * SCORE_WEIGHTS.habits +
      goalsScore * SCORE_WEIGHTS.goals;

    return {
      compositeScore: Math.min(99, Math.max(1, Math.round(rawComposite))),
      subScores: {
        health: healthScore,
        finance: financeScore,
        habits: habitsScore,
        goals: goalsScore,
      },
    };
  }, [hydration, activity, recoveryScore, savingsRate, habitStats, goals]);

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        userProfile,
        updateUserProfile,
        settings,
        updateSettings,
        setCurrency,
        setUnits,
        setTheme,
        hydration,
        logWater,
        setHydrationTarget,
        resetHydration,
        activity,
        updateActivity,
        sleep,
        updateSleep,
        recoveryScore,
        transactions,
        addTransaction,
        deleteTransaction,
        totalIncome,
        totalExpense,
        netBalance,
        burnRateToday,
        savingsRate,
        categorySpending,
        habits,
        toggleHabitDay,
        addHabit,
        deleteHabit,
        habitStats,
        goals,
        addGoal,
        updateGoalProgress,
        deleteGoal,
        compositeScore,
        subScores,
        history7Days: initialHistory7,
        history30Days: initialHistory30,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
