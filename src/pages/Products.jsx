import React, { useState } from 'react';
import { Edit, Trash2 } from 'lucide-react';
import { useStore } from '../context/StoreContext.jsx';
import { Modal, ConfirmModal } from '../components/Modal.jsx';
import { FormField, SelectField } from '../components/FormFields.jsx';
import DataTable from '../components/DataTable.jsx';

const DEFAULT_IMG = 'https://images.pexels.com/photos/14541064/pexels-photo-14541064.jpeg?auto=compress&cs=tinysrgb&w=400';

export default function Products() {
  const { products, categories, brands, addProduct, editProduct, deleteProduct } = useStore();
  const [catFilter, setCatFilter] = useState('');
  const [modalMode, setModalMode] = useState(null); // 'add' | 'edit' | null
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const emptyForm = { name: '', category: categories[0]?.name || '', brand: brands[0]?.name || '', cost: 0, price: 0, stock: 0, barcode: '', img: null };
  const [formData, setFormData] = useState(emptyForm);
  function setField(name, value) { setFormData(prev => ({ ...prev, [name]: value })); }

  const [preview, setPreview] = useState(null);

  React.useEffect(() => {
    if (!formData.img) { setPreview(null); return; }
    if (formData.img instanceof File) {
      const url = URL.createObjectURL(formData.img);
      setPreview(url);
      return () => URL.revokeObjectURL(url);
    }
    setPreview(formData.img);
  }, [formData.img]);

  function handleOpenAdd() {
    setFormData({ name: '', category: categories[0]?.name || '', brand: brands[0]?.name || '', cost: 0, price: 0, stock: 0, barcode: '', img: null });
    setModalMode('add');
  }
  function handleOpenEdit(p) {
    setFormData({ name: p.name, category: p.category, brand: p.brand, cost: p.cost, price: p.price, stock: p.stock, barcode: p.barcode, img: p.img });
    setEditTarget(p);
    setModalMode('edit');
  }
  function handleSave() {
    if (!formData.name) return;
    if (modalMode === 'add') {
      // if no file selected, supply the default image URL
      addProduct({ ...formData, img: formData.img ?? DEFAULT_IMG });
    } else if (modalMode === 'edit' && editTarget) {
      editProduct(editTarget.id, formData);
    }
    setModalMode(null);
    setEditTarget(null);
  }

  return (
    <>
      <DataTable
        title="Products"
        columns={['Image', 'Barcode', 'Name', 'Category', 'Brand', 'Cost', 'Price', 'Stock', 'Status']}
        rows={products}
        onAdd={handleOpenAdd}
        searchKeys={['name', 'category', 'brand', 'barcode']}
        filterPredicate={(p) => !catFilter || p.category === catFilter}
        extraControls={(
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setCatFilter('')}
              className={`px-3 py-2 text-sm rounded-full border ${!catFilter ? 'bg-primary-600 text-white border-primary-600' : 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-700 dark:text-slate-100 dark:border-slate-600'}`}
            >
              All
            </button>
            {categories.map(c => (
              <button
                key={c.id}
                type="button"
                onClick={() => setCatFilter(c.name)}
                className={`px-3 py-2 text-sm rounded-full border ${catFilter === c.name ? 'bg-primary-600 text-white border-primary-600' : 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-700 dark:text-slate-100 dark:border-slate-600'}`}
              >
                {c.name}
              </button>
            ))}
          </div>
        )}
        renderRow={(p) => (
          <tr key={p.id} className="border-b dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/30">
            <td className="px-4 py-3"><img src={p.img} className="w-10 h-10 rounded object-cover" alt={p.name} /></td>
            <td className="px-4 py-3 font-mono text-xs">{p.barcode}</td>
            <td className="px-4 py-3 font-medium">{p.name}</td>
            <td className="px-4 py-3">{p.category}</td>
            <td className="px-4 py-3">{p.brand}</td>
            <td className="px-4 py-3">PKR {p.cost}</td>
            <td className="px-4 py-3 font-medium">PKR {p.price}</td>
            <td className="px-4 py-3">{p.stock}</td>
            <td className="px-4 py-3">
              <span className={`px-2 py-0.5 rounded-full text-xs ${p.stock > 20 ? 'bg-emerald-100 text-emerald-700' : p.stock > 0 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>
                {p.stock > 20 ? 'Active' : p.stock > 0 ? 'Low' : 'Out'}
              </span>
            </td>
            <td className="px-4 py-3">
              <div className="flex gap-1">
                <button onClick={() => handleOpenEdit(p)} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded"><Edit className="w-4 h-4" /></button>
                <button onClick={() => setDeleteTarget(p)} className="p-1 hover:bg-red-50 text-red-500 rounded"><Trash2 className="w-4 h-4" /></button>
              </div>
            </td>
          </tr>
        )}
      />

      {modalMode && (
        <Modal title={modalMode === 'add' ? 'Add Product' : 'Edit Product'} onClose={() => setModalMode(null)} onSave={handleSave}>
          <FormField label="Name" name="name" value={formData.name} onChange={setField} />
          <SelectField label="Category" name="category" options={categories.map(c => c.name)} value={formData.category} onChange={setField} />
          <SelectField label="Brand" name="brand" options={brands.map(b => b.name)} value={formData.brand} onChange={setField} />
          <FormField label="Cost Price" name="cost" type="number" value={formData.cost} onChange={setField} />
          <FormField label="Sell Price" name="price" type="number" value={formData.price} onChange={setField} />
          <FormField label="Stock" name="stock" type="number" value={formData.stock} onChange={setField} />
          <FormField label="Barcode" name="barcode" value={formData.barcode} onChange={setField} />
              <div className="mb-3">
                <label className="text-sm text-slate-600 dark:text-slate-400 block mb-1">Image</label>
                {preview && <img src={preview} alt="preview" className="w-24 h-24 mb-2 rounded object-cover" />}
                <input type="file" accept="image/*" onChange={(e) => setField('img', e.target.files?.[0] ?? null)} className="w-full" />
              </div>
        </Modal>
      )}

      {deleteTarget && (
        <ConfirmModal
          message="Delete this product?"
          onClose={() => setDeleteTarget(null)}
          onConfirm={() => deleteProduct(deleteTarget.id)}
        />
      )}
    </>
  );
}
