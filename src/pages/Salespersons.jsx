import React, { useState } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { useStore } from '../context/StoreContext.jsx';
import { Modal, ConfirmModal } from '../components/Modal.jsx';
import { FormField } from '../components/FormFields.jsx';

export default function Salespersons() {
  const { salespersons, addSalesperson, editSalesperson, deleteSalesperson } = useStore();
  const [modalMode, setModalMode] = useState(null);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const empty = { name: '', sales: 0, revenue: 0, commission: 0, perf: 0, commissionRate: 5 };
  const [formData, setFormData] = useState(empty);

  function setField(name, value) { setFormData(prev => ({ ...prev, [name]: value })); }
  function handleOpenAdd() { setFormData(empty); setModalMode('add'); }
  function handleOpenEdit(p) { setFormData({ name: p.name, sales: p.sales, revenue: p.revenue, commission: p.commission, perf: p.perf, commissionRate: p.commissionRate ?? 5 }); setEditTarget(p); setModalMode('edit'); }
  function handleSave() {
    if (!formData.name) return;
    if (modalMode === 'add') addSalesperson({ name: formData.name, commissionRate: formData.commissionRate });
    else if (editTarget) editSalesperson(editTarget.id, formData);
    setModalMode(null); setEditTarget(null);
  }

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold">Salespersons</h2>
        <button onClick={handleOpenAdd} className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 flex items-center gap-2">
          <Plus className="w-4 h-4" />Add New
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {salespersons.map(p => (
          <div key={p.id} className="card bg-white dark:bg-slate-800 p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 font-bold text-lg">{p.name[0]}</div>
                <div><p className="font-semibold">{p.name}</p><p className="text-xs text-slate-500">Sales Associate</p></div>
              </div>
              <div className="flex gap-1">
                <button onClick={() => handleOpenEdit(p)} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded"><Edit className="w-4 h-4" /></button>
                <button onClick={() => setDeleteTarget(p)} className="p-1 hover:bg-red-50 text-red-500 rounded"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="p-2 bg-slate-50 dark:bg-slate-700/50 rounded-lg"><p className="text-lg font-bold">{p.sales}</p><p className="text-xs text-slate-500">Sales</p></div>
              <div className="p-2 bg-slate-50 dark:bg-slate-700/50 rounded-lg"><p className="text-lg font-bold">{p.perf}%</p><p className="text-xs text-slate-500">Performance</p></div>
            </div>
            <div className="mt-3 pt-3 border-t dark:border-slate-700 space-y-1 text-sm">
              <div className="flex justify-between"><span className="text-slate-500">Revenue</span><span className="font-medium">PKR {p.revenue.toLocaleString()}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Commission</span><span className="font-medium text-emerald-600">PKR {p.commission.toLocaleString()}</span></div>
            </div>
          </div>
        ))}
      </div>

      {modalMode && (
        <Modal title={modalMode === 'add' ? 'Add Salesperson' : 'Edit Salesperson'} onClose={() => setModalMode(null)} onSave={handleSave}>
          <FormField label="Name" name="name" value={formData.name} onChange={setField} />
          {modalMode === 'edit' && (
            <>
              <FormField label="Sales Count" name="sales" type="number" value={formData.sales} onChange={setField} />
              <FormField label="Revenue" name="revenue" type="number" value={formData.revenue} onChange={setField} />
              <FormField label="Commission" name="commission" type="number" value={formData.commission} onChange={setField} />
              <FormField label="Performance %" name="perf" type="number" value={formData.perf} onChange={setField} />
              <FormField label="Commission %" name="commissionRate" type="number" value={formData.commissionRate} onChange={setField} />
            </>
          )}
        </Modal>
      )}

      {deleteTarget && (
        <ConfirmModal message="Delete this salesperson?" onClose={() => setDeleteTarget(null)} onConfirm={() => deleteSalesperson(deleteTarget.id)} />
      )}
    </>
  );
}
