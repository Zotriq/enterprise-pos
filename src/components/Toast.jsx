import React from 'react';
import { CheckCircle, XCircle, Info } from 'lucide-react';
import { useStore } from '../context/StoreContext.jsx';

const colors = { success: 'bg-emerald-600', error: 'bg-red-600', info: 'bg-blue-600' };
const icons = { success: CheckCircle, error: XCircle, info: Info };

export default function ToastContainer() {
  const { toasts } = useStore();
  return (
    <div className="fixed top-4 right-4 z-[100] space-y-2">
      {toasts.map(t => {
        const Icon = icons[t.type] || Info;
        return (
          <div key={t.id} className={`toast flex items-center gap-2 px-4 py-3 rounded-lg text-white text-sm font-medium shadow-lg ${colors[t.type] || colors.info}`}>
            <Icon className="w-4 h-4" />
            <span>{t.msg}</span>
          </div>
        );
      })}
    </div>
  );
}
