import React, { useState, useMemo } from 'react';
import { Search, Plus } from 'lucide-react';

export default function DataTable({ title, columns, rows, renderRow, onAdd, addLabel = 'Add New', searchKeys, filterPredicate, extraControls }) {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const searched = !q ? rows : rows.filter(row => {
      const keys = searchKeys || Object.keys(row);
      return keys.some(k => String(row[k] ?? '').toLowerCase().includes(q));
    });
    return searched.filter(row => filterPredicate ? filterPredicate(row) : true);
  }, [rows, query, searchKeys, filterPredicate]);

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold">{title}</h2>
        {onAdd && (
          <button onClick={onAdd} className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 flex items-center gap-2">
            <Plus className="w-4 h-4" />{addLabel}
          </button>
        )}
      </div>
      <div className="card bg-white dark:bg-slate-800 overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-700">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-700 rounded-lg text-sm border-0 outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          {extraControls && (
            <div className="mt-3">
              {extraControls}
            </div>
          )}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-700/50 text-left">
                {columns.map(c => <th key={c} className="px-4 py-3 font-medium text-slate-600 dark:text-slate-300">{c}</th>)}
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(row => renderRow(row))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
