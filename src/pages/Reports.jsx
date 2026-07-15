import React from 'react';
import { Download, FileText } from 'lucide-react';
import { useStore } from '../context/StoreContext.jsx';
import StatCard from '../components/StatCard.jsx';

export default function Reports() {
  const { sales, showToast } = useStore();
  const totalRev = sales.reduce((s, x) => s + x.amt, 0);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  const heights = [40, 55, 48, 72, 65, 85];
  const catData = [
    { n: 'Electronics', v: 'PKR 1.5M', p: 36 },
    { n: 'Beverages', v: 'PKR 980K', p: 23 },
    { n: 'Snacks', v: 'PKR 850K', p: 20 },
    { n: 'Household', v: 'PKR 870K', p: 21 },
  ];

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold">Reports</h2>
        <div className="flex gap-2">
          <button onClick={() => showToast('PDF exported', 'success')} className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-700"><Download className="w-4 h-4" />Export PDF</button>
          <button onClick={() => showToast('Excel exported', 'success')} className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-700"><FileText className="w-4 h-4" />Export Excel</button>
        </div>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard icon="trending-up" label="Total Revenue" value={'PKR ' + totalRev.toLocaleString()} trend="+15%" color="emerald" />
        <StatCard icon="shopping-cart" label="Total Sales" value={sales.length.toString()} trend="+12%" color="blue" />
        <StatCard icon="dollar-sign" label="Gross Profit" value={'PKR ' + Math.round(totalRev * 0.42).toLocaleString()} trend="+10%" color="violet" />
        <StatCard icon="percent" label="Profit Margin" value="42.8%" trend="+2%" color="amber" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card bg-white dark:bg-slate-800 p-5">
          <h3 className="font-semibold mb-4">Monthly Revenue</h3>
          <div className="h-48 flex items-end gap-2 px-2">
            {months.map((m, i) => (
              <div key={m} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full bg-primary-500 rounded-t" style={{ height: `${heights[i]}%` }}></div>
                <span className="text-[10px] text-slate-500">{m}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="card bg-white dark:bg-slate-800 p-5">
          <h3 className="font-semibold mb-4">Sales by Category</h3>
          <div className="space-y-3">
            {catData.map(c => (
              <div key={c.n}>
                <div className="flex justify-between text-sm mb-1"><span>{c.n}</span><span className="font-medium">{c.v}</span></div>
                <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full"><div className="h-2 bg-primary-500 rounded-full" style={{ width: `${c.p}%` }}></div></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
