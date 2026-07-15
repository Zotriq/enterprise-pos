import React, { useState } from 'react';
import { useStore } from '../context/StoreContext.jsx';

export default function Settings() {
  const { darkMode, toggleDark, showToast } = useStore();
  const [storeName, setStoreName] = useState('Enterprise Store');
  const [phone, setPhone] = useState('+92-42-555-0100');
  const [email, setEmail] = useState('info@enterprise.pk');
  const [address, setAddress] = useState('123 Business Ave, Lahore, Pakistan');
  const [taxRate, setTaxRate] = useState(5);
  const [taxName, setTaxName] = useState('GST');
  const [emailNotifs, setEmailNotifs] = useState(true);

  return (
    <>
      <div className="mb-6"><h2 className="text-2xl font-bold">Settings</h2></div>
      <div className="max-w-3xl space-y-4">
        <div className="card bg-white dark:bg-slate-800 p-6">
          <h3 className="font-semibold mb-4">Business Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-slate-600 dark:text-slate-400 block mb-1">Store Name</label>
              <input value={storeName} onChange={e => setStoreName(e.target.value)} type="text" className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-700 text-sm outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
            <div>
              <label className="text-sm text-slate-600 dark:text-slate-400 block mb-1">Phone</label>
              <input value={phone} onChange={e => setPhone(e.target.value)} type="text" className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-700 text-sm outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
            <div>
              <label className="text-sm text-slate-600 dark:text-slate-400 block mb-1">Email</label>
              <input value={email} onChange={e => setEmail(e.target.value)} type="text" className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-700 text-sm outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
            <div>
              <label className="text-sm text-slate-600 dark:text-slate-400 block mb-1">Currency</label>
              <select className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-700 text-sm outline-none">
                <option>PKR - Pakistani Rupee</option>
                <option>USD - US Dollar</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="text-sm text-slate-600 dark:text-slate-400 block mb-1">Address</label>
              <input value={address} onChange={e => setAddress(e.target.value)} type="text" className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-700 text-sm outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
          </div>
        </div>

        <div className="card bg-white dark:bg-slate-800 p-6">
          <h3 className="font-semibold mb-4">Tax Settings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-slate-600 dark:text-slate-400 block mb-1">Tax Rate (%)</label>
              <input value={taxRate} onChange={e => setTaxRate(e.target.value)} type="number" className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-700 text-sm outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
            <div>
              <label className="text-sm text-slate-600 dark:text-slate-400 block mb-1">Tax Name</label>
              <input value={taxName} onChange={e => setTaxName(e.target.value)} type="text" className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-700 text-sm outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
          </div>
        </div>

        <div className="card bg-white dark:bg-slate-800 p-6">
          <h3 className="font-semibold mb-4">Preferences</h3>
          <div className="space-y-3">
            <label className="flex items-center justify-between">
              <span className="text-sm">Dark Mode</span>
              <button onClick={toggleDark} className={`w-10 h-5 rounded-full ${darkMode ? 'bg-primary-600' : 'bg-slate-300'} relative transition-colors`}>
                <span className={`absolute top-0.5 ${darkMode ? 'left-5' : 'left-0.5'} w-4 h-4 bg-white rounded-full transition-all shadow`}></span>
              </button>
            </label>
            <label className="flex items-center justify-between">
              <span className="text-sm">Email Notifications</span>
              <button onClick={() => setEmailNotifs(v => !v)} className={`w-10 h-5 rounded-full ${emailNotifs ? 'bg-primary-600' : 'bg-slate-300'} relative`}>
                <span className={`absolute top-0.5 ${emailNotifs ? 'left-5' : 'left-0.5'} w-4 h-4 bg-white rounded-full shadow`}></span>
              </button>
            </label>
          </div>
        </div>

        <button onClick={() => showToast('Settings saved successfully', 'success')} className="px-6 py-2.5 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700">Save Changes</button>
      </div>
    </>
  );
}
