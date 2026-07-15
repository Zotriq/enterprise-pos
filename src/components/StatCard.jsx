import React from 'react';
import * as Icons from 'lucide-react';

// Maps kebab-case icon names (from the original design) to PascalCase lucide-react component names
function toIconComponent(name) {
  const pascal = name.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join('');
  return Icons[pascal] || Icons.Circle;
}

export default function StatCard({ icon, label, value, trend, color = 'blue' }) {
  const Icon = toIconComponent(icon);
  return (
    <div className="card stat-card bg-white dark:bg-slate-800 p-5">
      <div className="flex items-center justify-between mb-3">
        <div className={`w-10 h-10 rounded-lg bg-${color}-100 dark:bg-${color}-900/30 flex items-center justify-center`}>
          <Icon className={`w-5 h-5 text-${color}-600`} />
        </div>
        {trend && (
          <span className={`text-xs font-medium ${trend.startsWith('+') ? 'text-emerald-600' : 'text-red-500'}`}>{trend}</span>
        )}
      </div>
      <p className="text-2xl font-bold text-slate-800 dark:text-white">{value}</p>
      <p className="text-xs text-slate-500 mt-1">{label}</p>
    </div>
  );
}
