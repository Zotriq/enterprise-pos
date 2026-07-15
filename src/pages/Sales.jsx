import React, { useState } from 'react';
import { Search, Plus, Eye, Printer } from 'lucide-react';
import { useStore } from '../context/StoreContext.jsx';
import { Modal } from '../components/Modal.jsx';

export default function Sales({ onNavigate }) {
  const { sales, showToast, refundSale } = useStore();
  const [query, setQuery] = useState('');
  const [viewing, setViewing] = useState(null);

  const filtered = sales.filter(s => JSON.stringify(s).toLowerCase().includes(query.toLowerCase()));

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold">Sales</h2>
        <button onClick={() => onNavigate('pos')} className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 flex items-center gap-2">
          <Plus className="w-4 h-4" />New Sale
        </button>
      </div>
      <div className="card bg-white dark:bg-slate-800 overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-700">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input value={query} onChange={e => setQuery(e.target.value)} type="text" placeholder="Search sales..." className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-700 rounded-lg text-sm border-0 outline-none" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-700/50 text-left">
                <th className="px-4 py-3">Invoice</th><th className="px-4 py-3">Customer</th><th className="px-4 py-3">Salesperson</th>
                <th className="px-4 py-3">Payment</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Date</th><th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(s => (
                <tr key={s.id} className="border-b dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/30">
                  <td className="px-4 py-3 font-medium">{s.inv}</td>
                  <td className="px-4 py-3">{s.customer}</td>
                  <td className="px-4 py-3">{s.person}</td>
                  <td className="px-4 py-3">{s.method}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs ${s.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' : s.status === 'Pending' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>{s.status}</span>
                  </td>
                  <td className="px-4 py-3">PKR {s.amt.toLocaleString()}</td>
                  <td className="px-4 py-3">{s.date}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <button onClick={() => setViewing(s)} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded"><Eye className="w-4 h-4" /></button>
                      {s.status !== 'Refunded' && (
                        <button onClick={() => { refundSale(s.id); }} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded text-red-500">Refund</button>
                      )}
                      <button onClick={() => showToast('Receipt printed', 'success')} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded"><Printer className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {viewing && (
        <Modal title="Sale Details" onClose={() => setViewing(null)}>
            <div className="space-y-2 text-sm">
            <p><strong>Invoice:</strong> {viewing.inv}</p>
            <p><strong>Customer:</strong> {viewing.customer}</p>
            <p><strong>Salesperson:</strong> {viewing.person}</p>
            <p><strong>Payment:</strong> {viewing.method}</p>
            <p><strong>Status:</strong> {viewing.status}</p>
            <p><strong>Amount:</strong> PKR {viewing.amt.toLocaleString()}</p>
            <p><strong>Date:</strong> {viewing.date}</p>
              {viewing.items && viewing.items.length > 0 && (
                <div>
                  <h4 className="font-medium mt-2">Items</h4>
                  <ul className="text-sm">
                    {viewing.items.map((it, i) => (
                      <li key={i} className="flex justify-between"><span>{it.name} x{it.qty}</span><span>PKR {(it.price * it.qty).toFixed(2)}</span></li>
                    ))}
                  </ul>
                </div>
              )}
          </div>
        </Modal>
      )}
    </>
  );
}
