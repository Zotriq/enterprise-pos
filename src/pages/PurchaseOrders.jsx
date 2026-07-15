import React, { useMemo, useState } from 'react';
import { Edit, Trash2, Eye, Plus } from 'lucide-react';
import { useStore } from '../context/StoreContext.jsx';
import { Modal, ConfirmModal } from '../components/Modal.jsx';
import { FormField, SelectField } from '../components/FormFields.jsx';
import DataTable from '../components/DataTable.jsx';

const STATUSES = ['Pending', 'Approved', 'Received'];
const PAYMENT_TERMS = ['30 Days Credit', 'Immediate', 'Cash on Delivery'];

function createDefaultPO(suppliers) {
  const supplier = suppliers[0] || { id: null, name: '' };
  return {
    supplierId: supplier.id,
    supplier: supplier.name,
    orderDate: new Date().toISOString().slice(0, 10),
    expectedDelivery: '',
    status: STATUSES[0],
    deliveryAddress: 'Enterprise POS Warehouse\nModel Town, Lahore, Pakistan',
    preparedBy: 'Zohaib Tariq',
    paymentTerms: PAYMENT_TERMS[0],
    shippingCharges: 500,
    taxRate: 18,
    notes: 'Please confirm availability of all items before dispatch.',
    items: [],
    amt: 0,
  };
}

function createDefaultLineItem(products) {
  const product = products[0] || { id: null, name: '', barcode: '', cost: 0 };
  return {
    id: null,
    productId: product.id,
    productName: product.name,
    sku: product.barcode,
    qty: 1,
    unitPrice: product.cost,
    costPrice: product.cost,
    discount: 0,
  };
}

function calculateTotals(items, shippingCharges, taxRate) {
  const subtotal = items.reduce((sum, item) => {
    const lineTotal = item.qty * item.unitPrice * (1 - (item.discount ?? 0) / 100);
    return sum + lineTotal;
  }, 0);
  const tax = Number((subtotal * (taxRate ?? 0) / 100).toFixed(2));
  const total = Number((subtotal + tax + Number(shippingCharges ?? 0)).toFixed(2));
  return { subtotal, tax, total };
}

export default function PurchaseOrders() {
  const { purchaseOrders, suppliers, products, addPurchaseOrder, editPurchaseOrder, deletePurchaseOrder, genId } = useStore();
  const [modalMode, setModalMode] = useState(null);
  const [viewing, setViewing] = useState(null);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [formData, setFormData] = useState(createDefaultPO(suppliers));
  const [lineItem, setLineItem] = useState(createDefaultLineItem(products));

  const totals = useMemo(() => calculateTotals(formData.items, formData.shippingCharges, formData.taxRate), [formData.items, formData.shippingCharges, formData.taxRate]);

  function setField(name, value) {
    setFormData(prev => ({ ...prev, [name]: value }));
  }

  function setLineField(name, value) {
    setLineItem(prev => ({ ...prev, [name]: value }));
  }

  function handleOpenAdd() {
    const fresh = createDefaultPO(suppliers);
    setFormData(fresh);
    setLineItem(createDefaultLineItem(products));
    setEditTarget(null);
    setModalMode('add');
  }

  function handleOpenEdit(po) {
    setFormData({ ...po });
    setLineItem(createDefaultLineItem(products));
    setEditTarget(po);
    setModalMode('edit');
  }

  function handleProductSelect(productId) {
    const product = products.find(p => p.id === Number(productId)) || { barcode: '', cost: 0, name: '' };
    setLineItem(prev => ({
      ...prev,
      productId: Number(productId),
      productName: product.name,
      sku: product.barcode,
      unitPrice: product.cost,
      costPrice: product.cost,
    }));
  }

  function handleAddLine() {
    if (!lineItem.productId) return;
    const item = {
      id: genId(),
      productId: Number(lineItem.productId),
      productName: lineItem.productName,
      sku: lineItem.sku,
      qty: Number(lineItem.qty) || 1,
      unitPrice: Number(lineItem.unitPrice) || 0,
      costPrice: Number(lineItem.costPrice || lineItem.unitPrice) || 0,
      discount: Number(lineItem.discount) || 0,
    };
    setFormData(prev => ({ ...prev, items: [...prev.items, item] }));
    setLineItem(createDefaultLineItem(products));
  }

  function handleRemoveLine(itemId) {
    setFormData(prev => ({ ...prev, items: prev.items.filter(item => item.id !== itemId) }));
  }

  function handleSave() {
    const payload = {
      ...formData,
      supplier: suppliers.find(s => s.id === Number(formData.supplierId))?.name ?? formData.supplier,
      amt: totals.total,
    };

    if (modalMode === 'add') addPurchaseOrder(payload);
    else if (editTarget) editPurchaseOrder(editTarget.id, payload);

    setModalMode(null);
    setEditTarget(null);
  }

  const viewingItems = viewing?.items || [];
  const viewingSubtotal = viewingItems.reduce((sum, item) => {
    return sum + item.qty * item.unitPrice * (1 - (item.discount ?? 0) / 100);
  }, 0);
  const viewingTaxRate = viewing?.taxRate ?? 18;
  const viewingTax = Number((viewingSubtotal * viewingTaxRate / 100).toFixed(2));
  const viewingShipping = Number(viewing?.shippingCharges ?? 0);
  const viewingGrandTotal = Number((viewingSubtotal + viewingTax + viewingShipping).toFixed(2));

  return (
    <>
      <DataTable
        title="Purchase Orders"
        columns={['PO #', 'Supplier', 'Order Date', 'Expected Delivery', 'Status', 'Amount']}
        rows={purchaseOrders}
        onAdd={handleOpenAdd}
        searchKeys={['code', 'supplier', 'status']}
        renderRow={(p) => (
          <tr key={p.id} className="border-b dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/30">
            <td className="px-4 py-3 font-medium">{p.code}</td>
            <td className="px-4 py-3">{p.supplier}</td>
            <td className="px-4 py-3">{p.orderDate || p.date}</td>
            <td className="px-4 py-3">{p.expectedDelivery || '—'}</td>
            <td className="px-4 py-3">
              <span className={`px-2 py-0.5 rounded-full text-xs ${p.status === 'Received' ? 'bg-emerald-100 text-emerald-700' : p.status === 'Approved' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'}`}>{p.status}</span>
            </td>
            <td className="px-4 py-3">PKR {Number(p.amt || 0).toLocaleString()}</td>
            <td className="px-4 py-3">
              <div className="flex gap-1">
                <button onClick={() => setViewing(p)} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded"><Eye className="w-4 h-4" /></button>
                <button onClick={() => handleOpenEdit(p)} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded"><Edit className="w-4 h-4" /></button>
                <button onClick={() => setDeleteTarget(p)} className="p-1 hover:bg-red-50 text-red-500 rounded"><Trash2 className="w-4 h-4" /></button>
              </div>
            </td>
          </tr>
        )}
      />

      {modalMode && (
        <Modal title={modalMode === 'add' ? 'New Purchase Order' : 'Edit Purchase Order'} onClose={() => setModalMode(null)} onSave={handleSave}>
          <div className="grid gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SelectField label="Supplier" name="supplierId" options={suppliers.map(s => ({ label: s.name, value: s.id }))} value={formData.supplierId || ''} onChange={(name, value) => { setField(name, Number(value)); setField('supplier', suppliers.find(s => s.id === Number(value))?.name ?? ''); }} />
              <FormField label="Order Date" name="orderDate" type="date" value={formData.orderDate} onChange={setField} />
              <FormField label="Expected Delivery" name="expectedDelivery" type="date" value={formData.expectedDelivery} onChange={setField} />
              <SelectField label="Status" name="status" options={STATUSES} value={formData.status} onChange={setField} />
            </div>

            <FormField label="Delivery Address" name="deliveryAddress" type="textarea" value={formData.deliveryAddress} onChange={setField} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label="Prepared By" name="preparedBy" value={formData.preparedBy} onChange={setField} />
              <SelectField label="Payment Terms" name="paymentTerms" options={PAYMENT_TERMS.map(term => ({ label: term, value: term }))} value={formData.paymentTerms} onChange={setField} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField label="Shipping Charges" name="shippingCharges" type="number" value={formData.shippingCharges} onChange={setField} />
              <FormField label="Tax Rate (%)" name="taxRate" type="number" value={formData.taxRate} onChange={setField} />
            </div>

            <div className="rounded-xl bg-slate-50 dark:bg-slate-900 p-4 border border-slate-200 dark:border-slate-700">
              <div className="mb-3 text-sm font-semibold">Items Ordered</div>
              <div className="grid gap-3 md:grid-cols-5">
                <div>
                  <label className="text-sm text-slate-600 dark:text-slate-400 block mb-1">Product</label>
                  <select value={lineItem.productId ?? ''} onChange={(e) => handleProductSelect(e.target.value)} className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-sm outline-none">
                    <option value="">Select product</option>
                    {products.map(product => (
                      <option key={product.id} value={product.id}>{product.name}</option>
                    ))}
                  </select>
                </div>
                <FormField label="SKU" name="sku" type="text" value={lineItem.sku} onChange={setLineField} />
                <FormField label="Qty" name="qty" type="number" value={lineItem.qty} onChange={setLineField} />
                <FormField label="Unit Price" name="unitPrice" type="number" value={lineItem.unitPrice} onChange={setLineField} />
                <FormField label="Cost Price" name="costPrice" type="number" value={lineItem.costPrice} onChange={setLineField} />
                <FormField label="Discount (%)" name="discount" type="number" value={lineItem.discount} onChange={setLineField} />
              </div>
              <div className="mt-3 text-right">
                <button type="button" onClick={handleAddLine} className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg text-sm hover:bg-primary-700">
                  <Plus className="w-4 h-4" /> Add Item
                </button>
              </div>

              {formData.items.length > 0 && (
                <div className="mt-4 overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-slate-100 dark:bg-slate-700/50 text-left">
                        <th className="px-3 py-2">Product</th>
                        <th className="px-3 py-2">SKU</th>
                        <th className="px-3 py-2">Qty</th>
                        <th className="px-3 py-2">Unit Price</th>
                        <th className="px-3 py-2">Discount</th>
                        <th className="px-3 py-2">Total</th>
                        <th className="px-3 py-2">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {formData.items.map(item => {
                        const lineTotal = item.qty * item.unitPrice * (1 - (item.discount ?? 0) / 100);
                        return (
                          <tr key={item.id} className="border-t border-slate-200 dark:border-slate-700">
                            <td className="px-3 py-2">{item.productName}</td>
                            <td className="px-3 py-2">{item.sku}</td>
                            <td className="px-3 py-2">{item.qty}</td>
                            <td className="px-3 py-2">PKR {Number(item.unitPrice).toLocaleString()}</td>
                            <td className="px-3 py-2">{item.discount}%</td>
                            <td className="px-3 py-2">PKR {Number(lineTotal).toLocaleString()}</td>
                            <td className="px-3 py-2">
                              <button type="button" onClick={() => handleRemoveLine(item.id)} className="text-red-500 hover:underline">Remove</button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <FormField label="Notes" name="notes" type="textarea" value={formData.notes} onChange={setField} />
          </div>
        </Modal>
      )}

      {viewing && (
        <Modal title="Purchase Order Details" onClose={() => setViewing(null)}>
          <div className="space-y-4 text-sm">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-xl bg-slate-50 dark:bg-slate-900 p-4 border border-slate-200 dark:border-slate-700">
                <p className="text-xs uppercase tracking-wide text-slate-500">PO Number</p>
                <p className="font-semibold text-slate-800 dark:text-slate-100">{viewing.code}</p>
              </div>
              <div className="rounded-xl bg-slate-50 dark:bg-slate-900 p-4 border border-slate-200 dark:border-slate-700">
                <p className="text-xs uppercase tracking-wide text-slate-500">Status</p>
                <p className="font-semibold text-slate-800 dark:text-slate-100">{viewing.status}</p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <p className="text-xs uppercase tracking-wide text-slate-500">Supplier</p>
                <p>{viewing.supplier}</p>
                <p className="text-xs uppercase tracking-wide text-slate-500">Prepared By</p>
                <p>{viewing.preparedBy}</p>
              </div>
              <div className="space-y-2">
                <p className="text-xs uppercase tracking-wide text-slate-500">Order Date</p>
                <p>{viewing.orderDate || viewing.date}</p>
                <p className="text-xs uppercase tracking-wide text-slate-500">Expected Delivery</p>
                <p>{viewing.expectedDelivery || '—'}</p>
              </div>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500">Delivery Address</p>
              <p className="whitespace-pre-line">{viewing.deliveryAddress}</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-100 dark:bg-slate-700/50 text-left">
                    <th className="px-3 py-2">Product</th>
                    <th className="px-3 py-2">SKU</th>
                    <th className="px-3 py-2">Qty</th>
                    <th className="px-3 py-2">Unit Price</th>
                    <th className="px-3 py-2">Discount</th>
                    <th className="px-3 py-2">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {(viewing.items || []).map((item) => {
                    const lineTotal = item.qty * item.unitPrice * (1 - (item.discount ?? 0) / 100);
                    return (
                      <tr key={item.id} className="border-t border-slate-200 dark:border-slate-700">
                        <td className="px-3 py-2">{item.productName}</td>
                        <td className="px-3 py-2">{item.sku}</td>
                        <td className="px-3 py-2">{item.qty}</td>
                        <td className="px-3 py-2">PKR {Number(item.unitPrice).toLocaleString()}</td>
                        <td className="px-3 py-2">{item.discount}%</td>
                        <td className="px-3 py-2">PKR {Number(lineTotal).toLocaleString()}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="grid gap-2 md:grid-cols-2">
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500">Notes</p>
                <p>{viewing.notes}</p>
              </div>
              <div className="space-y-2 rounded-xl bg-slate-50 dark:bg-slate-900 p-4 border border-slate-200 dark:border-slate-700">
                <div className="flex justify-between text-sm"><span>Subtotal</span><span>PKR {viewingSubtotal.toLocaleString()}</span></div>
                <div className="flex justify-between text-sm"><span>Tax ({viewingTaxRate}%)</span><span>PKR {viewingTax.toLocaleString()}</span></div>
                <div className="flex justify-between text-sm"><span>Shipping Charges</span><span>PKR {viewingShipping.toLocaleString()}</span></div>
                <div className="flex justify-between text-base font-semibold"><span>Grand Total</span><span>PKR {viewingGrandTotal.toLocaleString()}</span></div>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {deleteTarget && (
        <ConfirmModal message="Delete this PO?" onClose={() => setDeleteTarget(null)} onConfirm={() => deletePurchaseOrder(deleteTarget.id)} />
      )}
    </>
  );
}
