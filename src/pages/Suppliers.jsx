import React, { useState } from 'react';
import { Edit, Trash2 } from 'lucide-react';
import { useStore } from '../context/StoreContext.jsx';
import { Modal, ConfirmModal } from '../components/Modal.jsx';
import { FormField } from '../components/FormFields.jsx';
import DataTable from '../components/DataTable.jsx';

export default function Suppliers() {
  const { suppliers, addSupplier, editSupplier, deleteSupplier } = useStore();
  const [modalMode, setModalMode] = useState(null);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const empty = { name: '', contact: '', phone: '', email: '', balance: 0 };
  const [formData, setFormData] = useState(empty);

  function setField(name, value) { setFormData(prev => ({ ...prev, [name]: value })); }
  function handleOpenAdd() { setFormData(empty); setModalMode('add'); }
  function handleOpenEdit(s) { setFormData({ name: s.name, contact: s.contact, phone: s.phone, email: s.email, balance: s.balance }); setEditTarget(s); setModalMode('edit'); }
  async function handleSave() {
    if (!formData.name) return;
    if (modalMode === 'add') await addSupplier(formData);
    else if (editTarget) await editSupplier(editTarget.id, formData);
    setModalMode(null); setEditTarget(null);
  }

  return (
    <>
      <DataTable
        title="Suppliers"
        columns={['Name', 'Contact', 'Phone', 'Email', 'Balance', 'Status']}
        rows={suppliers}
        onAdd={handleOpenAdd}
        searchKeys={['name', 'contact', 'phone', 'email']}
        renderRow={(s) => (
          <tr key={s.id} className="border-b dark:border-slate-700">
            <td className="px-4 py-3 font-medium">{s.name}</td>
            <td className="px-4 py-3">{s.contact}</td>
            <td className="px-4 py-3">{s.phone}</td>
            <td className="px-4 py-3">{s.email}</td>
            <td className="px-4 py-3 font-medium">PKR {s.balance.toLocaleString()}</td>
            <td className="px-4 py-3"><span className="px-2 py-0.5 rounded-full text-xs bg-emerald-100 text-emerald-700">{s.status}</span></td>
            <td className="px-4 py-3">
              <div className="flex gap-1">
                <button onClick={() => handleOpenEdit(s)} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded"><Edit className="w-4 h-4" /></button>
                <button onClick={() => setDeleteTarget(s)} className="p-1 hover:bg-red-50 text-red-500 rounded"><Trash2 className="w-4 h-4" /></button>
              </div>
            </td>
          </tr>
        )}
      />

      {modalMode && (
        <Modal title={modalMode === 'add' ? 'Add Supplier' : 'Edit Supplier'} onClose={() => setModalMode(null)} onSave={handleSave}>
          <FormField label="Name" name="name" value={formData.name} onChange={setField} />
          <FormField label="Contact Person" name="contact" value={formData.contact} onChange={setField} />
          <FormField label="Phone" name="phone" value={formData.phone} onChange={setField} />
          <FormField label="Email" name="email" type="email" value={formData.email} onChange={setField} />
          <FormField label="Balance" name="balance" type="number" value={formData.balance} onChange={setField} />
        </Modal>
      )}

      {deleteTarget && (
        <ConfirmModal message="Delete this supplier?" onClose={() => setDeleteTarget(null)} onConfirm={() => deleteSupplier(deleteTarget.id)} />
      )}
    </>
  );
}
