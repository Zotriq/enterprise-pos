import React, { useState } from 'react';
import { Edit, Trash2 } from 'lucide-react';
import { useStore } from '../context/StoreContext.jsx';
import { Modal, ConfirmModal } from '../components/Modal.jsx';
import { FormField } from '../components/FormFields.jsx';
import DataTable from '../components/DataTable.jsx';

export default function Brands() {
  const { brands, addBrand, editBrand, deleteBrand } = useStore();
  const [modalMode, setModalMode] = useState(null);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [formData, setFormData] = useState({ name: '', country: '', desc: '', status: 'Active' });

  function setField(name, value) { setFormData(prev => ({ ...prev, [name]: value })); }

  function handleOpenAdd() { setFormData({ name: '', country: '', desc: '', status: 'Active' }); setModalMode('add'); }
  
  function handleOpenEdit(b) { 
    // Ultra-safe fallback parsing for form population
    const currentName = b.brandName || b.BrandName || b.name || b.Name || '';
    const currentCountry = b.country || b.Country || '';
    const currentDesc = b.description || b.Description || b.desc || b.Desc || '';
    const currentStatus = b.status || b.Status || 'Active';

    setFormData({ 
      name: currentName, 
      country: currentCountry, 
      desc: currentDesc,
      status: currentStatus
    }); 
    setEditTarget(b); 
    setModalMode('edit'); 
  }

  function handleSave() {
    if (!formData.name) return;
    const resolvedId = editTarget ? (editTarget.brandID || editTarget.BrandID || editTarget.id || editTarget.Id) : null;
    
    if (modalMode === 'add') {
      addBrand(formData);
    } else if (editTarget && resolvedId) {
      editBrand(resolvedId, formData);
    }
    setModalMode(null); setEditTarget(null);
  }

  return (
    <>
      <DataTable
        title="Brands"
        columns={['Name', 'Country', 'Description', 'Status']}
        rows={brands}
        onAdd={handleOpenAdd}
        searchKeys={['brandName', 'BrandName', 'name', 'Name', 'country', 'Country', 'description', 'Description', 'desc']}
        renderRow={(b) => {
          // Bulletproof property extraction fallback matrix
          const id = b.brandID || b.BrandID || b.id || b.Id || Math.random();
          const name = b.brandName || b.BrandName || b.name || b.Name || 'N/A';
          const country = b.country || b.Country || b.CountryName;
          const description = b.description || b.Description || b.desc || b.Desc;
          const status = b.status || b.Status || 'Active';

          return (
            <tr key={id} className="border-b dark:border-slate-700">
              <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">{name}</td>
              <td className="px-4 py-3">{country || 'N/A'}</td>
              <td className="px-4 py-3 text-slate-500">{description || 'No description'}</td>
              <td className="px-4 py-3">
                <span className={`px-2 py-0.5 rounded-full text-xs ${
                  status.toUpperCase() === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'
                }`}>
                  {status}
                </span>
              </td>
              <td className="px-4 py-3">
                <div className="flex gap-1">
                  <button onClick={() => handleOpenEdit(b)} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded"><Edit className="w-4 h-4" /></button>
                  <button onClick={() => setDeleteTarget(b)} className="p-1 hover:bg-red-50 text-red-500 rounded"><Trash2 className="w-4 h-4" /></button>
                </div>
              </td>
            </tr>
          );
        }}
      />

      {modalMode && (
        <Modal title={modalMode === 'add' ? 'Add Brand' : 'Edit Brand'} onClose={() => setModalMode(null)} onSave={handleSave}>
          <FormField label="Name" name="name" value={formData.name} onChange={setField} />
          <FormField label="Country" name="country" value={formData.country} onChange={setField} />
          <FormField label="Description" name="desc" value={formData.desc} onChange={setField} />
        </Modal>
      )}

      {deleteTarget && (
        <ConfirmModal 
          message="Delete this brand?" 
          onClose={() => setDeleteTarget(null)} 
          onConfirm={() => {
            const resolvedDeleteId = deleteTarget.brandID || deleteTarget.BrandID || deleteTarget.id || deleteTarget.Id;
            deleteBrand(resolvedDeleteId);
          }} 
        />
      )}
    </>
  );
}