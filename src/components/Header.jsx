import React, { useState, useEffect } from 'react';
import { Search, Plus, Bell, MessageCircle, Moon } from 'lucide-react';
import { useStore } from '../context/StoreContext.jsx';

export default function Header({ onQuickAdd }) {
  const { toggleDark, showToast } = useStore();
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <header className="sticky top-0 z-30 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input type="text" placeholder="Search anything..." className="pl-10 pr-4 py-2 w-72 bg-slate-100 dark:bg-slate-700 rounded-lg text-sm border-0 focus:ring-2 focus:ring-primary-500 outline-none" />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-xs text-slate-500 hidden md:block">
          {now.toLocaleDateString('en-PK', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
        </span>
        <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
          {now.toLocaleTimeString('en-PK', { hour: '2-digit', minute: '2-digit' })}
        </span>
        <button onClick={onQuickAdd} className="p-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
          <Plus className="w-4 h-4" />
        </button>
        <button onClick={() => showToast('No new notifications', 'info')} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        <button onClick={() => showToast('Messages coming soon', 'info')} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700">
          <MessageCircle className="w-5 h-5" />
        </button>
        <button onClick={toggleDark} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700">
          <Moon className="w-5 h-5" />
        </button>
        <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">A</div>
      </div>
    </header>
  );
}
