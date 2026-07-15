import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { useStore } from '../context/StoreContext.jsx';
import { Modal } from '../components/Modal.jsx';
import { FormField } from '../components/FormFields.jsx';
import StatCard from '../components/StatCard.jsx';

export default function Inventory() {
  const { products, adjustStock } = useStore();
  const [query, setQuery] = useState('');
  const [adjusting, setAdjusting] = useState(null);
  const [newStock, setNewStock] = useState(0);

  const totalStock = products.reduce((s, p) => s + p.stock, 0);
  const totalVal = products.reduce((s, p) => s + p.cost * p.stock, 0);

  const filtered = products.filter(p => p.name.toLowerCase().includes(query.toLowerCase()));

  function openAdjust(p) { setAdjusting(p); setNewStock(p.stock); }
  function saveAdjust() { adjustStock(adjusting.id, newStock); setAdjusting(null); }

  return (
    <>
      <div className="mb-6"><h2 className="text-2xl font-bold">Inventory</h2></div>
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <StatCard icon="box" label="Current Stock" value={totalStock.toLocaleString()} color="blue" />
        <StatCard icon="lock" label="Reserved" value="0" color="amber" />
        <StatCard icon="check-circle" label="Available" value={totalStock.toLocaleString()} color="emerald" />
        <StatCard icon="alert-triangle" label="Low Stock" value={products.filter(p => p.stock > 0 && p.stock <= 20).length.toString()} color="red" />
        <StatCard icon="database" label="Inventory Value" value={'PKR ' + totalVal.toLocaleString()} color="indigo" />
      </div>
      <div className="card bg-white dark:bg-slate-800 overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-700">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input value={query} onChange={e => setQuery(e.target.value)} type="text" placeholder="Search inventory..." className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-700 rounded-lg text-sm border-0 outline-none" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-700/50 text-left">
                <th className="px-4 py-3">Product</th><th className="px-4 py-3">Current</th><th className="px-4 py-3">Reserved</th>
                <th className="px-4 py-3">Available</th><th className="px-4 py-3">Value</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.id} className="border-b dark:border-slate-700">
                  <td className="px-4 py-3 font-medium">{p.name}</td>
                  <td className="px-4 py-3">{p.stock}</td>
                  <td className="px-4 py-3">0</td>
                  <td className="px-4 py-3">{p.stock}</td>
                  <td className="px-4 py-3">PKR {(p.cost * p.stock).toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs ${p.stock > 20 ? 'bg-emerald-100 text-emerald-700' : p.stock > 0 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>{p.stock > 20 ? 'OK' : p.stock > 0 ? 'Low' : 'Out'}</span>
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => openAdjust(p)} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded text-xs text-primary-600 font-medium">Adjust</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {adjusting && (
        <Modal title="Adjust Stock" onClose={() => setAdjusting(null)} onSave={saveAdjust}>
          <p className="text-sm mb-3">Current stock for <strong>{adjusting.name}</strong>: {adjusting.stock}</p>
          <FormField label="New Stock Quantity" name="stock" type="number" value={newStock} onChange={(_, v) => setNewStock(v)} />
        </Modal>
      )}
    </>
  );
}
