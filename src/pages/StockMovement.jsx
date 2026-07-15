import React, { useState } from 'react';
import { Eye } from 'lucide-react';
import { useStore } from '../context/StoreContext.jsx';
import { Modal } from '../components/Modal.jsx';
import { FormField, SelectField } from '../components/FormFields.jsx';
import DataTable from '../components/DataTable.jsx';

const TYPES = ['Purchase', 'Sale', 'Adjustment', 'Return'];

export default function StockMovement() {
  const { stockMovements, products, addStockMovement } = useStore();
  const [modalMode, setModalMode] = useState(null);
  const [viewing, setViewing] = useState(null);
  const empty = { product: products[0]?.name || '', type: TYPES[0], qty: 0, ref: '' };
  const [formData, setFormData] = useState(empty);

  function setField(name, value) { setFormData(prev => ({ ...prev, [name]: value })); }
  function handleOpenAdd() { setFormData({ product: products[0]?.name || '', type: TYPES[0], qty: 0, ref: '' }); setModalMode('add'); }
  function handleSave() { addStockMovement(formData); setModalMode(null); }

  return (
    <>
      <DataTable
        title="Stock Movement"
        columns={['Product', 'Type', 'Qty', 'Date', 'Reference']}
        rows={stockMovements}
        onAdd={handleOpenAdd}
        searchKeys={['product', 'type', 'ref']}
        renderRow={(m) => (
          <tr key={m.id} className="border-b dark:border-slate-700">
            <td className="px-4 py-3 font-medium">{m.product}</td>
            <td className="px-4 py-3">
              <span className={`px-2 py-0.5 rounded-full text-xs ${m.type === 'Purchase' ? 'bg-emerald-100 text-emerald-700' : m.type === 'Sale' ? 'bg-blue-100 text-blue-700' : m.type === 'Return' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-700'}`}>{m.type}</span>
            </td>
            <td className={`px-4 py-3 font-mono ${m.qty >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>{m.qty >= 0 ? '+' + m.qty : m.qty}</td>
            <td className="px-4 py-3">{m.date}</td>
            <td className="px-4 py-3 font-mono text-xs">{m.ref}</td>
            <td className="px-4 py-3">
              <button onClick={() => setViewing(m)} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded"><Eye className="w-4 h-4" /></button>
            </td>
          </tr>
        )}
      />

      {modalMode && (
        <Modal title="Add Stock Movement" onClose={() => setModalMode(null)} onSave={handleSave}>
          <SelectField label="Product" name="product" options={products.map(p => p.name)} value={formData.product} onChange={setField} />
          <SelectField label="Type" name="type" options={TYPES} value={formData.type} onChange={setField} />
          <FormField label="Quantity" name="qty" type="number" value={formData.qty} onChange={setField} />
          <FormField label="Reference" name="ref" value={formData.ref} onChange={setField} />
        </Modal>
      )}

      {viewing && (
        <Modal title="Movement Details" onClose={() => setViewing(null)}>
          <div className="space-y-2 text-sm">
            <p><strong>Product:</strong> {viewing.product}</p>
            <p><strong>Type:</strong> {viewing.type}</p>
            <p><strong>Qty:</strong> {viewing.qty}</p>
            <p><strong>Date:</strong> {viewing.date}</p>
            <p><strong>Ref:</strong> {viewing.ref}</p>
          </div>
        </Modal>
      )}
    </>
  );
}
