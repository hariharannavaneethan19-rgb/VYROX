export type TabType = 'home' | 'health' | 'finance' | 'habits' | 'goals' | 'progress' | 'settings';

export type CurrencyCode = 'USD' | 'LKR' | 'EUR';
export type UnitSystem = 'metric' | 'imperial';
export type ThemeMode = 'light' | 'dark';

export interface UserProfile {
  name: string;
  age: number;
  gender: string;
  heightCm: number; // stored in metric cm
  weightKg: number; // stored in metric kg
  avatarInitials: string;
}

export interface UserSettings {
  currency: CurrencyCode;
  units: UnitSystem;
  theme: ThemeMode;
  notifications: {
    dailyReminders: boolean;
    waterAlerts: boolean;
    habitStreakAlerts: boolean;
    budgetLimitAlerts: boolean;
  };
}

export interface HydrationData {
  currentMl: number;
  targetMl: number;
}

export interface ActivityData {
  steps: number;
  stepTarget: number;
  workoutMinutes: number;
  workoutTarget: number;
  caloriesBurned: number;
  calorieTarget: number;
  standHours: number;
  standTarget: number;
  vo2Max: number;
}

export interface SleepData {
  hoursSlept: number;
  restingHeartRate: number; // BPM
  hrvMs: number; // ms
  deepSleepMinutes: number;
}

export type TransactionType = 'expense' | 'income';

export interface Transaction {
  id: string;
  title: string;
  amount: number;
  type: TransactionType;
  category: string;
  note?: string;
  date: string;
}

export interface Habit {
  id: string;
  name: string;
  category: string;
  targetSessions: number;
  color: string;
  // 7 days Mon-Sun (index 0 = Monday, 6 = Sunday)
  history: boolean[];
}

export interface Goal {
  id: string;
  title: string;
  category: string;
  currentValue: number;
  targetValue: number;
  unit: string;
  deadline: string;
  color: string;
}

export interface HistoricalDataPoint {
  date: string;
  dayLabel: string;
  hydrationMl: number;
  habitCompletionPct: number;
  savingsBalance: number;
  weightKg: number;
  steps: number;
}

export interface CompositeScoreWeights {
  health: number;
  finance: number;
  habits: number;
  goals: number;
}
