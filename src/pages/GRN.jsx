import React, { useState } from 'react';
import { Eye, Trash2 } from 'lucide-react';
import { useStore } from '../context/StoreContext.jsx';
import { Modal, ConfirmModal } from '../components/Modal.jsx';
import { FormField, SelectField } from '../components/FormFields.jsx';
import DataTable from '../components/DataTable.jsx';

const STATUSES = ['Completed', 'Partial'];

export default function GRN() {
  const { grns, purchaseOrders, suppliers, addGrn, deleteGrn } = useStore();
  const [modalMode, setModalMode] = useState(null);
  const [viewing, setViewing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const empty = { po: purchaseOrders[0]?.code || '', supplier: suppliers[0]?.name || '', items: 0, status: STATUSES[0] };
  const [formData, setFormData] = useState(empty);

  function setField(name, value) { setFormData(prev => ({ ...prev, [name]: value })); }
  function handleOpenAdd() { setFormData({ po: purchaseOrders[0]?.code || '', supplier: suppliers[0]?.name || '', items: 0, status: STATUSES[0] }); setModalMode('add'); }
  function handleSave() { addGrn(formData); setModalMode(null); }

  return (
    <>
      <DataTable
        title="Goods Receipt Notes"
        columns={['GRN #', 'PO Ref', 'Supplier', 'Date', 'Status', 'Items']}
        rows={grns}
        onAdd={handleOpenAdd}
        searchKeys={['code', 'po', 'supplier', 'status']}
        renderRow={(g) => (
          <tr key={g.id} className="border-b dark:border-slate-700">
            <td className="px-4 py-3 font-medium">{g.code}</td>
            <td className="px-4 py-3">{g.po}</td>
            <td className="px-4 py-3">{g.supplier}</td>
            <td className="px-4 py-3">{g.date}</td>
            <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-xs ${g.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>{g.status}</span></td>
            <td className="px-4 py-3">{g.items}</td>
            <td className="px-4 py-3">
              <div className="flex gap-1">
                <button onClick={() => setViewing(g)} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded"><Eye className="w-4 h-4" /></button>
                <button onClick={() => setDeleteTarget(g)} className="p-1 hover:bg-red-50 text-red-500 rounded"><Trash2 className="w-4 h-4" /></button>
              </div>
            </td>
          </tr>
        )}
      />

      {modalMode && (
        <Modal title="New GRN" onClose={() => setModalMode(null)} onSave={handleSave}>
          <SelectField label="PO Reference" name="po" options={purchaseOrders.map(p => p.code)} value={formData.po} onChange={setField} />
          <SelectField label="Supplier" name="supplier" options={suppliers.map(s => s.name)} value={formData.supplier} onChange={setField} />
          <FormField label="Items Count" name="items" type="number" value={formData.items} onChange={setField} />
          <SelectField label="Status" name="status" options={STATUSES} value={formData.status} onChange={setField} />
        </Modal>
      )}

      {viewing && (
        <Modal title="GRN Details" onClose={() => setViewing(null)}>
          <div className="space-y-2 text-sm">
            <p><strong>GRN:</strong> {viewing.code}</p>
            <p><strong>PO:</strong> {viewing.po}</p>
            <p><strong>Supplier:</strong> {viewing.supplier}</p>
            <p><strong>Items:</strong> {viewing.items}</p>
            <p><strong>Status:</strong> {viewing.status}</p>
          </div>
        </Modal>
      )}

      {deleteTarget && (
        <ConfirmModal message="Delete this GRN?" onClose={() => setDeleteTarget(null)} onConfirm={() => deleteGrn(deleteTarget.id)} />
      )}
    </>
  );
}
