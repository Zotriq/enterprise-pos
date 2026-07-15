import React, { useState, useMemo } from 'react';
import { Edit, Trash2, Folder, CheckCircle, Package, Layers, XCircle } from 'lucide-react';
import { useStore } from '../context/StoreContext.jsx';
import { Modal, ConfirmModal } from '../components/Modal.jsx';
import { FormField } from '../components/FormFields.jsx';
import DataTable from '../components/DataTable.jsx';

export default function Categories() {
  const { categories, addCategory, editCategory, deleteCategory } = useStore();
  const [modalMode, setModalMode] = useState(null);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [formData, setFormData] = useState({ name: '', desc: '', status: 'Active' });

  // Compute live strategic metrics for the executive overview strip
  const stats = useMemo(() => {
    const total = categories?.length || 0;
    const active = categories?.filter(c => (c.status || '').toUpperCase() === 'ACTIVE').length || 0;
    const totalProductsMapped = categories?.reduce((acc, c) => acc + (c.count || 0), 0) || 0;
    return { total, active, totalProductsMapped };
  }, [categories]);

  function setField(name, value) { setFormData(prev => ({ ...prev, [name]: value })); }

  function handleOpenAdd() { 
    setFormData({ name: '', desc: '', status: 'Active' }); 
    setModalMode('add'); 
  }
  
  function handleOpenEdit(c) { 
    setFormData({ 
      name: c.name || '', 
      desc: c.desc || '', 
      status: c.status || 'Active' 
    }); 
    setEditTarget(c); 
    setModalMode('edit'); 
  }

  function handleSave() {
    if (!formData.name) return;
    if (modalMode === 'add') {
      addCategory(formData);
    } else if (editTarget) {
      editCategory(editTarget.id, formData);
    }
    setModalMode(null); 
    setEditTarget(null);
  }

  return (
    <div className="space-y-6 p-2 bg-slate-50/50 dark:bg-slate-900/40 rounded-2xl min-h-screen">
      
      {/* --- EXECUTIVE KPI CARDS (PREMIUM COLOR LAYERING) --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Card 1: Total Categories (Premium Indigo Theme) */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200/60 dark:border-slate-700/60 shadow-sm flex items-center justify-between transition-all duration-200 hover:shadow-md hover:border-indigo-500/20 group">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Total Categories</span>
            <h3 className="text-2xl font-bold text-slate-800 dark:text-white tracking-tight">{stats.total}</h3>
          </div>
          <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 group-hover:scale-105 transition-transform duration-200">
            <Layers className="w-5 h-5" />
          </div>
        </div>

        {/* Card 2: Operational Status Distribution (Emerald Theme) */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200/60 dark:border-slate-700/60 shadow-sm flex items-center justify-between transition-all duration-200 hover:shadow-md hover:border-emerald-500/20 group">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Active Status</span>
            <h3 className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 tracking-tight">
              {stats.active} <span className="text-xs font-normal text-slate-400 dark:text-slate-500 font-sans">operational</span>
            </h3>
          </div>
          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 group-hover:scale-105 transition-transform duration-200">
            <CheckCircle className="w-5 h-5" />
          </div>
        </div>

        {/* Card 3: Global Inventory Metric Load (Cyan/Blue Theme) */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200/60 dark:border-slate-700/60 shadow-sm flex items-center justify-between transition-all duration-200 hover:shadow-md hover:border-blue-500/20 group">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Items Tracked</span>
            <h3 className="text-2xl font-bold text-blue-600 dark:text-blue-400 tracking-tight">
              {stats.totalProductsMapped} <span className="text-xs font-normal text-slate-400 dark:text-slate-500 font-sans">products</span>
            </h3>
          </div>
          <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 group-hover:scale-105 transition-transform duration-200">
            <Package className="w-5 h-5" />
          </div>
        </div>

      </div>

      {/* --- PRODUCTION QUALITY ARCHITECTURAL DATA GRID --- */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200/70 dark:border-slate-700/80 shadow-sm overflow-hidden">
        <DataTable
          title="Product Categories"
          columns={['Category Details', 'Description', 'Product Load', 'Status']}
          rows={categories}
          onAdd={handleOpenAdd}
          searchKeys={['name', 'desc']}
          renderRow={(c) => {
            const isCategoryActive = (c.status || '').toUpperCase() === 'ACTIVE';
            return (
              <tr key={c.id} className="border-b border-slate-100 dark:border-slate-700/50 hover:bg-slate-50/50 dark:hover:bg-slate-700/20 transition-colors duration-150 group">
                
                {/* Name / Icon Column */}
                <td className="px-5 py-3.5 font-medium text-slate-900 dark:text-white">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-700/60 text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 dark:group-hover:bg-indigo-950/40 dark:group-hover:text-indigo-400 transition-colors duration-200">
                      <Folder className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-semibold tracking-tight text-slate-700 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-150">
                      {c.name || 'Unnamed Category'}
                    </span>
                  </div>
                </td>
                
                {/* Description Column */}
                <td className="px-5 py-3.5 text-sm text-slate-500 dark:text-slate-400 max-w-xs truncate">
                  {c.desc || <span className="text-slate-300 dark:text-slate-600 italic">No description provided</span>}
                </td>
                
                {/* Product Mapped Count Pill (Dynamic Weight Color Coding) */}
                <td className="px-5 py-3.5 text-sm font-semibold text-slate-700 dark:text-slate-300">
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center justify-center px-2 py-0.5 rounded text-xs font-bold font-mono tracking-tight ${
                      (c.count || 0) > 0 
                        ? 'bg-blue-50 text-blue-600 border border-blue-100 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-900/30' 
                        : 'bg-slate-100 text-slate-400 dark:bg-slate-700/50 dark:text-slate-500'
                    }`}>
                      {c.count || 0}
                    </span>
                    <span className="text-xs font-normal text-slate-400 dark:text-slate-500">items listed</span>
                  </div>
                </td>
                
                {/* Modern Status Badge (Perfect Emerald/Rose Balance) */}
                <td className="px-5 py-3.5">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium tracking-wide ${
                    isCategoryActive 
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-100/80 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900/30' 
                      : 'bg-rose-50 text-rose-700 border border-rose-100/80 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-900/30'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${isCategoryActive ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                    {isCategoryActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                
                {/* Balanced Micro Action Buttons */}
                <td className="px-5 py-3.5 text-right">
                  <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                    <button 
                      onClick={() => handleOpenEdit(c)} 
                      className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:text-slate-500 dark:hover:text-indigo-400 dark:hover:bg-slate-700 rounded-md transition-all"
                      title="Edit Configuration"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => setDeleteTarget(c)} 
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:text-slate-500 dark:hover:text-rose-400 dark:hover:bg-rose-700 rounded-md transition-all"
                      title="Purge Record"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>

              </tr>
            );
          }}
        />
      </div>

      {/* --- DESIGNER-GRADE MODALS CONFIGURATIONS --- */}
      {modalMode && (
        <Modal 
          title={modalMode === 'add' ? '✨ Create New Category' : '⚙️ Category Parameters'} 
          onClose={() => setModalMode(null)} 
          onSave={handleSave}
        >
          <div className="space-y-4 py-2">
            <FormField label="Category Name" name="name" value={formData.name} onChange={setField} placeholder="e.g., Computing Hardware" />
            <FormField label="Scope Description" name="desc" value={formData.desc} onChange={setField} placeholder="Brief summary of category inventory scope..." />
            
            {modalMode === 'edit' && (
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wide">Lifecycle Status</label>
                <select 
                  value={formData.status} 
                  onChange={(e) => setField('status', e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
                >
                  <option value="Active">Active (Available in system)</option>
                  <option value="Inactive">Inactive (Archived / Hidden)</option>
                </select>
              </div>
            )}
          </div>
        </Modal>
      )}

      {deleteTarget && (
        <ConfirmModal 
          message={`Are you sure you want to delete the "${deleteTarget.name}" category? This action cannot be undone and might orphan matching nested catalog index keys.`} 
          onClose={() => setDeleteTarget(null)} 
          onConfirm={() => deleteCategory(deleteTarget.id)} 
        />
      )}
    </div>
  );
}