import React, { useState } from 'react';
import { Edit, Trash2 } from 'lucide-react';
import { useStore } from '../context/StoreContext.jsx';
import { Modal, ConfirmModal } from '../components/Modal.jsx';
import { FormField, SelectField } from '../components/FormFields.jsx';
import DataTable from '../components/DataTable.jsx';

const STATUSES = ['Pending', 'Processing', 'Shipped', 'Delivered'];

export default function SalesOrders() {
  const { salesOrders, addSalesOrder, editSalesOrder, deleteSalesOrder } = useStore();
  const [modalMode, setModalMode] = useState(null);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const empty = { customer: '', amt: 0, status: STATUSES[0] };
  const [formData, setFormData] = useState(empty);

  function setField(name, value) { setFormData(prev => ({ ...prev, [name]: value })); }
  function handleOpenAdd() { setFormData(empty); setModalMode('add'); }
  function handleOpenEdit(o) { setFormData({ customer: o.customer, amt: o.amt, status: o.status }); setEditTarget(o); setModalMode('edit'); }
  function handleSave() {
    if (modalMode === 'add') addSalesOrder(formData);
    else if (editTarget) editSalesOrder(editTarget.id, formData);
    setModalMode(null); setEditTarget(null);
  }

  return (
    <>
      <DataTable
        title="Sales Orders"
        columns={['Order #', 'Customer', 'Date', 'Status', 'Amount']}
        rows={salesOrders}
        onAdd={handleOpenAdd}
        searchKeys={['code', 'customer', 'status']}
        renderRow={(o) => (
          <tr key={o.id} className="border-b dark:border-slate-700">
            <td className="px-4 py-3 font-medium">{o.code}</td>
            <td className="px-4 py-3">{o.customer}</td>
            <td className="px-4 py-3">{o.date}</td>
            <td className="px-4 py-3"><span className="px-2 py-0.5 rounded-full text-xs bg-blue-100 text-blue-700">{o.status}</span></td>
            <td className="px-4 py-3">PKR {o.amt.toLocaleString()}</td>
            <td className="px-4 py-3">
              <div className="flex gap-1">
                <button onClick={() => handleOpenEdit(o)} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded"><Edit className="w-4 h-4" /></button>
                <button onClick={() => setDeleteTarget(o)} className="p-1 hover:bg-red-50 text-red-500 rounded"><Trash2 className="w-4 h-4" /></button>
              </div>
            </td>
          </tr>
        )}
      />

      {modalMode && (
        <Modal title={modalMode === 'add' ? 'New Sales Order' : 'Edit Sales Order'} onClose={() => setModalMode(null)} onSave={handleSave}>
          <FormField label="Customer" name="customer" value={formData.customer} onChange={setField} />
          <FormField label="Amount (PKR)" name="amt" type="number" value={formData.amt} onChange={setField} />
          <SelectField label="Status" name="status" options={STATUSES} value={formData.status} onChange={setField} />
        </Modal>
      )}

      {deleteTarget && (
        <ConfirmModal message="Delete this sales order?" onClose={() => setDeleteTarget(null)} onConfirm={() => deleteSalesOrder(deleteTarget.id)} />
      )}
    </>
  );
}
