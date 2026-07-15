import React, { useState, useEffect, useCallback } from 'react';
import Sidebar, { menuItems } from './components/Sidebar.jsx';
import ToastContainer from './components/Toast.jsx';
import Dashboard from './pages/Dashboard.jsx';
import POS from './pages/POS.jsx';
import Sales from './pages/Sales.jsx';
import SalesOrders from './pages/SalesOrders.jsx';
import PurchaseOrders from './pages/PurchaseOrders.jsx';
import GRN from './pages/GRN.jsx';
import Products from './pages/Products.jsx';
import Categories from './pages/Categories.jsx';
import Brands from './pages/Brands.jsx';
import Inventory from './pages/Inventory.jsx';
import StockMovement from './pages/StockMovement.jsx';
import Suppliers from './pages/Suppliers.jsx';
import Salespersons from './pages/Salespersons.jsx';
import Reports from './pages/Reports.jsx';
import Settings from './pages/Settings.jsx';

function getInitialPage() {
  const hash = window.location.hash.slice(1);
  return menuItems.find(m => m.id === hash) ? hash : 'dashboard';
}

export default function App() {
  const [currentPage, setCurrentPage] = useState(getInitialPage);

  const navigate = useCallback((page) => {
    setCurrentPage(page);
    window.location.hash = page;
  }, []);

  useEffect(() => {
    function onHashChange() {
      const hash = window.location.hash.slice(1);
      if (menuItems.find(m => m.id === hash)) setCurrentPage(hash);
    }
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  function renderPage() {
    switch (currentPage) {
      case 'dashboard': return <Dashboard onNavigate={navigate} />;
      case 'pos': return <POS />;
      case 'sales': return <Sales onNavigate={navigate} />;
      case 'sales-orders': return <SalesOrders />;
      case 'purchase-orders': return <PurchaseOrders />;
      case 'grn': return <GRN />;
      case 'products': return <Products />;
      case 'categories': return <Categories />;
      case 'brands': return <Brands />;
      case 'inventory': return <Inventory />;
      case 'stock-movement': return <StockMovement />;
      case 'suppliers': return <Suppliers />;
      case 'salespersons': return <Salespersons />;
      case 'reports': return <Reports />;
      case 'settings': return <Settings />;
      default: return <Dashboard onNavigate={navigate} />;
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200">
      <ToastContainer />
      <Sidebar currentPage={currentPage} onNavigate={navigate} />
      <div className="ml-64 flex flex-col min-h-screen">
        <main className="flex-1 p-6">{renderPage()}</main>
        <footer className="px-6 py-3 border-t border-slate-200 dark:border-slate-700 text-xs text-slate-500 flex justify-between">
          <span>© 2026 EnterprisePOS. All rights reserved.</span>
          <span>v1.0.0</span>
        </footer>
      </div>
    </div>
  );
}
