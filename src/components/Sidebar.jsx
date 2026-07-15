import React from 'react';
import {
  LayoutDashboard, Monitor, Receipt, FileText, ShoppingBag, PackageCheck,
  Box, Grid, Award, Warehouse, ArrowLeftRight, Truck, Users, BarChart2, Settings,
} from 'lucide-react';

export const menuItems = [
  { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { id: 'pos', icon: Monitor, label: 'POS' },
  { id: 'sales', icon: Receipt, label: 'Sales' },
  { id: 'sales-orders', icon: FileText, label: 'Sales Orders' },
  { id: 'purchase-orders', icon: ShoppingBag, label: 'Purchase Orders' },
  { id: 'grn', icon: PackageCheck, label: 'GRN' },
  { id: 'products', icon: Box, label: 'Products' },
  { id: 'categories', icon: Grid, label: 'Categories' },
  { id: 'brands', icon: Award, label: 'Brands' },
  { id: 'inventory', icon: Warehouse, label: 'Inventory' },
  { id: 'stock-movement', icon: ArrowLeftRight, label: 'Stock Movement' },
  { id: 'suppliers', icon: Truck, label: 'Suppliers' },
  { id: 'salespersons', icon: Users, label: 'Salespersons' },
  { id: 'reports', icon: BarChart2, label: 'Reports' },
  { id: 'settings', icon: Settings, label: 'Settings' },
];

export default function Sidebar({ currentPage, onNavigate }) {
  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 z-40 overflow-y-auto">
      <div className="p-5 border-b border-slate-200 dark:border-slate-700">
        <h1 className="text-xl font-bold text-primary-600">EnterprisePOS</h1>
        <p className="text-xs text-slate-500 mt-0.5">Inventory & Sales Management</p>
      </div>
      <nav className="p-3 space-y-1">
        {menuItems.map(item => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`sidebar-item w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 ${currentPage === item.id ? 'active' : ''}`}
            >
              <Icon className="w-[18px] h-[18px]" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
