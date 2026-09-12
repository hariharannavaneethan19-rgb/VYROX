import React, { useState } from 'react';
import {
  Wallet,
  ArrowDownRight,
  ArrowUpRight,
  Plus,
  Trash2,
  PieChart as PieIcon,
  Filter,
  DollarSign,
  TrendingUp,
} from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { useApp } from '../../context/AppContext';
import { formatCurrency } from '../../utils/formatters';
import { TransactionType, CurrencyCode } from '../../types';

interface FinanceViewProps {
  onOpenExpenseModal: () => void;
}

export const FinanceView: React.FC<FinanceViewProps> = ({ onOpenExpenseModal }) => {
  const {
    netBalance,
    totalIncome,
    totalExpense,
    savingsRate,
    burnRateToday,
    transactions,
    addTransaction,
    deleteTransaction,
    categorySpending,
    settings,
    setCurrency,
  } = useApp();

  // Local form state for direct inline entry
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [formType, setFormType] = useState<TransactionType>('expense');
  const [title, setTitle] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [category, setCategory] = useState<string>('Fuel & Dine');
  const [note, setNote] = useState<string>('');

  const expenseCategories = [
    'Fuel & Dine',
    'Wellness',
    'SaaS Ops',
    'Housing',
    'Transport',
    'Shopping',
    'Other',
  ];

  const incomeCategories = ['Consulting', 'Salary', 'Investments', 'Freelance', 'Dividends'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);
    if (!title.trim() || isNaN(parsedAmount) || parsedAmount <= 0) return;

    addTransaction({
      title: title.trim(),
      amount: parsedAmount,
      type: formType,
      category,
      note: note.trim() || undefined,
      date: 'Today',
    });

    setTitle('');
    setAmount('');
    setNote('');
    setShowAddForm(false);
  };

  const currentCategories = formType === 'expense' ? expenseCategories : incomeCategories;

  return (
    <div id="finance-view-container" className="flex flex-col gap-6 w-full max-w-[1200px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FF6B00]"></span>
            <span className="text-[12px] uppercase font-bold tracking-wider text-neutral-500 dark:text-neutral-400">
              Liquid Capital & Outflow
            </span>
          </div>
          <h1 className="text-[28px] sm:text-[34px] font-black tracking-tight text-neutral-900 dark:text-white">
            Finance & Treasury
          </h1>
          <p className="text-[14px] font-medium text-neutral-500 dark:text-neutral-400">
            Track daily burn, monthly cashflow, and capital deployment.
          </p>
        </div>

        {/* Currency Switcher Pill */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="text-xs font-bold text-neutral-400">Currency:</span>
          <div className="inline-flex p-1 rounded-xl bg-white dark:bg-[#1C1C1E] border border-black/[0.06] dark:border-white/10 shadow-sm">
            {(['USD', 'LKR', 'EUR'] as CurrencyCode[]).map((c) => (
              <button
                key={c}
                id={`finance-currency-${c}`}
                onClick={() => setCurrency(c)}
                className={`px-3 py-1 text-xs font-black rounded-lg transition-all cursor-pointer ${
                  settings.currency === c
                    ? 'bg-[#FF3B30] text-white shadow-sm'
                    : 'text-neutral-600 dark:text-neutral-300 hover:text-neutral-900'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Net Liquid Balance */}
        <div
          className="rounded-[24px] p-5 text-white shadow-xl shadow-[#FF3B30]/20 flex flex-col justify-between"
          style={{
            background: 'linear-gradient(135deg, #FF3B30 0%, #FF6B00 100%)',
          }}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-wider font-extrabold text-white/90">
              Net Liquid Balance
            </span>
            <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
              <Wallet className="w-4 h-4 text-white" />
            </div>
          </div>
          <div className="my-2">
            <span className="text-3xl font-black text-white tracking-tight tabular-nums">
              {formatCurrency(netBalance, settings.currency)}
            </span>
          </div>
          <span className="text-[11px] text-white/80 font-semibold">+12.4% vs last month</span>
        </div>

        {/* Total Earned */}
        <div className="rounded-[24px] p-5 bg-white dark:bg-[#1C1C1E] border border-black/[0.06] dark:border-white/10 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-wider font-extrabold text-neutral-400">
              Total Inflow
            </span>
            <div className="w-7 h-7 rounded-full bg-[#30D158]/10 text-[#30D158] flex items-center justify-center">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <div className="my-2">
            <span className="text-2xl sm:text-3xl font-black text-[#30D158] tracking-tight tabular-nums">
              {formatCurrency(totalIncome, settings.currency)}
            </span>
          </div>
          <span className="text-[11px] text-neutral-500 font-semibold">Active period inflow</span>
        </div>

        {/* Total Spent */}
        <div className="rounded-[24px] p-5 bg-white dark:bg-[#1C1C1E] border border-black/[0.06] dark:border-white/10 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-wider font-extrabold text-neutral-400">
              Total Outflow
            </span>
            <div className="w-7 h-7 rounded-full bg-[#FF3B30]/10 text-[#FF3B30] flex items-center justify-center">
              <ArrowDownRight className="w-4 h-4" />
            </div>
          </div>
          <div className="my-2">
            <span className="text-2xl sm:text-3xl font-black text-[#FF3B30] tracking-tight tabular-nums">
              {formatCurrency(totalExpense, settings.currency)}
            </span>
          </div>
          <span className="text-[11px] text-neutral-500 font-semibold">
            Today: {formatCurrency(burnRateToday, settings.currency)}
          </span>
        </div>

        {/* Savings Rate % */}
        <div className="rounded-[24px] p-5 bg-white dark:bg-[#1C1C1E] border border-black/[0.06] dark:border-white/10 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-wider font-extrabold text-neutral-400">
              Savings Rate
            </span>
            <div className="w-7 h-7 rounded-full bg-[#5856D6]/10 text-[#5856D6] flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="my-2">
            <span className="text-3xl font-black text-[#5856D6] tracking-tight tabular-nums">
              {savingsRate}%
            </span>
          </div>
          <span className="text-[11px] text-neutral-500 font-semibold">
            {savingsRate >= 50 ? 'Aggressive accumulation' : 'Consistent baseline'}
          </span>
        </div>
      </div>

      {/* Main Content: Add Entry Form & Category Breakdown Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left / Top: Category Breakdown (Donut Chart with Recharts) */}
        <div className="lg:col-span-5 rounded-[24px] p-6 bg-white dark:bg-[#1C1C1E] border border-black/[0.06] dark:border-white/10 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <PieIcon className="w-5 h-5 text-[#FF6B00]" />
                <h2 className="text-[16px] font-extrabold text-neutral-900 dark:text-white">
                  Spending by Domain
                </h2>
              </div>
              <span className="text-xs font-bold text-neutral-400">Live Breakdown</span>
            </div>

            {categorySpending.length > 0 ? (
              <div className="h-64 w-full relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categorySpending}
                      dataKey="amount"
                      nameKey="category"
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={85}
                      paddingAngle={4}
                    >
                      {categorySpending.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(val: any) => formatCurrency(Number(val), settings.currency)}
                      contentStyle={{
                        backgroundColor: '#1C1C1E',
                        borderRadius: '12px',
                        border: 'none',
                        color: '#fff',
                        fontSize: '12px',
                        fontWeight: 'bold',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center text-neutral-400 text-sm font-semibold">
                No expense records logged yet.
              </div>
            )}
          </div>

          {/* Category Legend Pills */}
          <div className="flex flex-wrap gap-2 pt-4 border-t border-neutral-100 dark:border-neutral-800">
            {categorySpending.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-neutral-100 dark:bg-white/5 text-[11px] font-bold"
              >
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></span>
                <span className="text-neutral-700 dark:text-neutral-300">{item.category}:</span>
                <span className="text-neutral-900 dark:text-white tabular-nums">
                  {formatCurrency(item.amount, settings.currency, false)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Transactions List & Inline Add Form */}
        <div className="lg:col-span-7 rounded-[24px] p-6 bg-white dark:bg-[#1C1C1E] border border-black/[0.06] dark:border-white/10 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Wallet className="w-5 h-5 text-[#007AFF]" />
                <h2 className="text-[16px] font-extrabold text-neutral-900 dark:text-white">
                  Ledger Transactions
                </h2>
              </div>

              <button
                id="toggle-add-transaction-form"
                onClick={() => setShowAddForm(!showAddForm)}
                className="px-3 py-1.5 rounded-xl bg-[#FF3B30] text-white font-bold text-xs flex items-center gap-1 shadow-sm hover:opacity-90 active:scale-95 transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{showAddForm ? 'Close Form' : 'Add Entry'}</span>
              </button>
            </div>

            {/* Inline Add Transaction Form */}
            {showAddForm && (
              <form
                id="add-transaction-form"
                onSubmit={handleSubmit}
                className="p-4 rounded-2xl bg-neutral-50 dark:bg-white/5 border border-black/[0.06] dark:border-white/10 mb-4 flex flex-col gap-3"
              >
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setFormType('expense')}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      formType === 'expense'
                        ? 'bg-[#FF3B30] text-white shadow-sm'
                        : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
                    }`}
                  >
                    Expense Outflow
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormType('income')}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      formType === 'income'
                        ? 'bg-[#30D158] text-white shadow-sm'
                        : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
                    }`}
                  >
                    Income Inflow
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-bold text-neutral-500 uppercase block mb-1">
                      Title / Merchant
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Ergonomic Keyboard"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                      className="w-full h-10 px-3 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-[#FF3B30]"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-neutral-500 uppercase block mb-1">
                      Amount (USD baseline)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="45.00"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      required
                      className="w-full h-10 px-3 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-[#FF3B30]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-bold text-neutral-500 uppercase block mb-1">
                      Category
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 font-semibold text-sm focus:outline-none"
                    >
                      {currentCategories.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-neutral-500 uppercase block mb-1">
                      Optional Note
                    </label>
                    <input
                      type="text"
                      placeholder="Tax deductible, project ref, etc."
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 font-semibold text-sm focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full h-10 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-bold text-xs shadow-sm hover:opacity-90 active:scale-[0.99] transition-all cursor-pointer mt-1"
                >
                  Save Transaction Record
                </button>
              </form>
            )}

            {/* List */}
            <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
              {transactions.map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between p-3 rounded-2xl bg-neutral-50 dark:bg-white/5 border border-black/[0.04] dark:border-white/5 hover:bg-neutral-100/80 dark:hover:bg-white/10 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold shrink-0 ${
                        tx.type === 'income'
                          ? 'bg-[#30D158]/15 text-[#30D158]'
                          : 'bg-[#FF3B30]/15 text-[#FF3B30]'
                      }`}
                    >
                      {tx.type === 'income' ? (
                        <ArrowUpRight className="w-5 h-5" />
                      ) : (
                        <ArrowDownRight className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <span className="text-sm font-bold text-neutral-900 dark:text-white block leading-tight">
                        {tx.title}
                      </span>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] font-semibold text-neutral-400">
                          {tx.category} • {tx.date}
                        </span>
                        {tx.note && (
                          <span className="text-[10px] text-neutral-500 dark:text-neutral-400 italic">
                            ({tx.note})
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`text-sm font-black tabular-nums ${
                        tx.type === 'income' ? 'text-[#30D158]' : 'text-neutral-900 dark:text-white'
                      }`}
                    >
                      {tx.type === 'income' ? '+' : '-'}
                      {formatCurrency(tx.amount, settings.currency)}
                    </span>
                    <button
                      onClick={() => deleteTransaction(tx.id)}
                      title="Remove"
                      className="text-neutral-400 hover:text-red-500 p-1 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
