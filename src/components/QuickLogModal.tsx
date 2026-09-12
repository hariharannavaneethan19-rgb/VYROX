import React, { useState } from 'react';
import { X, Receipt, Plus } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CURRENCY_SYMBOLS } from '../utils/formatters';

interface QuickLogModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QuickLogModal: React.FC<QuickLogModalProps> = ({ isOpen, onClose }) => {
  const { addTransaction, settings } = useApp();

  const [amount, setAmount] = useState<string>('45.00');
  const [title, setTitle] = useState<string>('Fuel & Recovery Shake');
  const [category, setCategory] = useState<string>('Fuel & Dine');
  const [note, setNote] = useState<string>('');

  if (!isOpen) return null;

  const categories = [
    'Fuel & Dine',
    'Wellness',
    'SaaS Ops',
    'Housing',
    'Transport',
    'Shopping',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) return;

    addTransaction({
      title: title.trim() || 'Logged Outflow',
      amount: parsedAmount,
      type: 'expense',
      category,
      note: note.trim() || undefined,
      date: 'Today',
    });

    onClose();
  };

  const symbol = CURRENCY_SYMBOLS[settings.currency] || '$';

  return (
    <div
      id="quick-log-modal-backdrop"
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
    >
      <div className="w-full max-w-md bg-white dark:bg-[#1C1C1E] rounded-[28px] p-6 shadow-2xl border border-black/10 dark:border-white/10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-[#FF3B30]/10 text-[#FF3B30] flex items-center justify-center">
              <Receipt className="w-5 h-5" />
            </div>
            <h2 className="text-[20px] font-extrabold text-neutral-900 dark:text-white">
              Log New Outflow
            </h2>
          </div>
          <button
            id="close-quick-log-modal"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-neutral-100 dark:bg-white/10 flex items-center justify-center text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-[11px] uppercase font-bold text-neutral-500 block mb-1 tracking-wider">
              Amount ({settings.currency})
            </label>
            <div className="relative">
              <span className="absolute left-4 top-3 text-[20px] font-bold text-neutral-400">
                {symbol}
              </span>
              <input
                id="quick-expense-amount-input"
                type="number"
                step="0.01"
                placeholder="45.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                className="w-full h-12 pl-10 pr-4 rounded-xl bg-neutral-100 dark:bg-neutral-800 font-black text-[22px] text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#FF6B00] border-none"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] uppercase font-bold text-neutral-500 block mb-1 tracking-wider">
              Title / Description
            </label>
            <input
              type="text"
              placeholder="e.g. Whole Foods, Mobility class"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full h-11 px-3.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 font-semibold text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#FF6B00] border-none"
            />
          </div>

          <div>
            <label className="text-[11px] uppercase font-bold text-neutral-500 block mb-1.5 tracking-wider">
              Category Domain
            </label>
            <div className="grid grid-cols-3 gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`h-10 rounded-xl font-bold text-[12px] text-center transition-all cursor-pointer ${
                    category === cat
                      ? 'bg-[#FF6B00] text-white shadow-sm'
                      : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2">
            <button
              id="submit-quick-log-btn"
              type="submit"
              className="w-full h-12 rounded-xl bg-gradient-to-r from-[#FF3B30] to-[#FF6B00] text-white font-extrabold text-[15px] shadow-lg shadow-[#FF3B30]/25 hover:opacity-95 active:scale-[0.99] transition-all cursor-pointer"
            >
              Submit Entry
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
