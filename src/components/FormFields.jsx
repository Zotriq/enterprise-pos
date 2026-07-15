import React from 'react';

export function FormField({ label, name, value, onChange, type = 'text' }) {
  const inputClass = "w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-700 text-sm outline-none focus:ring-2 focus:ring-primary-500";

  return (
    <div className="mb-3">
      <label className="text-sm text-slate-600 dark:text-slate-400 block mb-1">{label}</label>
      {type === 'textarea' ? (
        <textarea
          name={name}
          value={value ?? ''}
          rows={4}
          onChange={(e) => onChange(name, e.target.value)}
          className={`${inputClass} resize-none`}
        />
      ) : (
        <input
          name={name}
          type={type}
          value={value ?? ''}
          onChange={(e) => onChange(name, type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value)}
          className={inputClass}
        />
      )}
    </div>
  );
}

export function SelectField({ label, name, options, value, onChange }) {
  const normalized = options.map(o => {
    if (typeof o === 'object' && o !== null) {
      return { label: o.label ?? String(o.value), value: o.value };
    }
    return { label: String(o), value: o };
  });

  return (
    <div className="mb-3">
      <label className="text-sm text-slate-600 dark:text-slate-400 block mb-1">{label}</label>
      <select
        name={name}
        value={value ?? normalized[0]?.value ?? ''}
        onChange={(e) => onChange(name, e.target.value)}
        className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-700 text-sm outline-none"
      >
        {normalized.map(o => <option key={String(o.value)} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}

// Simple hook-like helper for managing form state within a page component
export function useFormState(initial) {
  const [data, setData] = React.useState(initial);
  const set = (name, value) => setData(prev => ({ ...prev, [name]: value }));
  return [data, set];
}
