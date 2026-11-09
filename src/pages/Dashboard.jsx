import React from 'react';
import StatCard from '../components/StatCard.jsx';
import { useStore } from '../context/StoreContext.jsx';
import { ShoppingCart, Package, AlertTriangle, Truck } from 'lucide-react';

export default function Dashboard({ onNavigate }) {
  const { products, sales, purchaseOrders, salesOrders, grns, suppliers, salespersons } = useStore();

  const weeklyDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const weeklyHeights = [65, 45, 80, 55, 90, 70, 85];
  const catColors = ['blue', 'emerald', 'amber', 'violet'];
  const catPercents = [35, 25, 20, 20];

  const activities = [
    { t: 'New sale completed', d: '2 min ago', i: ShoppingCart },
    { t: 'Stock received from PO-1042', d: '15 min ago', i: Package },
    { t: 'Low stock alert: All-Purpose Cleaner', d: '1 hr ago', i: AlertTriangle },
    { t: 'New supplier added', d: '3 hrs ago', i: Truck },
  ];

  return (
    <>
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Dashboard</h2>
        <p className="text-sm text-slate-500">Welcome back! Here's what's happening today.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard icon="shopping-cart" label="Today's Sales" value={sales.length.toString()} trend="+12%" color="blue" />
        <StatCard icon="dollar-sign" label="Today's Revenue" value={'PKR ' + sales.reduce((s, x) => s + x.amt, 0).toLocaleString()} trend="+8%" color="emerald" />
        <StatCard icon="trending-up" label="Monthly Revenue" value="PKR 4.2M" trend="+15%" color="violet" />
        <StatCard icon="clock" label="Pending POs" value={purchaseOrders.filter(p => p.status === 'Pending').length.toString()} color="amber" />
        <StatCard icon="file-text" label="Pending Sales Orders" value={salesOrders.filter(s => s.status === 'Pending').length.toString()} color="blue" />
        <StatCard icon="package" label="Pending GRNs" value={grns.filter(g => g.status === 'Partial').length.toString()} color="cyan" />
        <StatCard icon="database" label="Inventory Value" value={'PKR ' + (products.reduce((s, p) => s + p.cost * p.stock, 0) / 1000).toFixed(0) + 'K'} color="indigo" />
        <StatCard icon="alert-triangle" label="Low Stock" value={products.filter(p => p.stock > 0 && p.stock <= 20).length.toString()} color="red" />
        <StatCard icon="x-circle" label="Out of Stock" value={products.filter(p => p.stock === 0).length.toString()} color="red" />
        <StatCard icon="box" label="Total Products" value={products.length.toString()} color="slate" />
        <StatCard icon="truck" label="Total Suppliers" value={suppliers.length.toString()} color="teal" />
        <StatCard icon="users" label="Total Salespersons" value={salespersons.length.toString()} color="purple" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <div className="lg:col-span-2 card bg-white dark:bg-slate-800 p-5">
          <h3 className="font-semibold mb-4">Weekly Sales</h3>
          <div className="h-48 flex items-end gap-2 px-4">
            {weeklyDays.map((d, i) => (
              <div key={d} className="flex-1 h-full flex flex-col justify-end items-center gap-1">
                <div className="w-full bg-primary-500 rounded-t" style={{ height: `${weeklyHeights[i]}%` }}></div>
                <span className="text-[10px] text-slate-500">{d}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="card bg-white dark:bg-slate-800 p-5">
          <h3 className="font-semibold mb-4">Top Categories</h3>
          <div className="space-y-3">
            {catPercents.map((p, i) => (
              <div key={i}>
                <div className="flex justify-between text-sm mb-1">
                  <span>{['Electronics', 'Beverages', 'Household', 'Snacks'][i]}</span>
                  <span className="font-medium">{p}%</span>
                </div>
                <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full">
                  <div className={`h-2 bg-${catColors[i]}-500 rounded-full`} style={{ width: `${p}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <div className="card bg-white dark:bg-slate-800 p-5">
          <h3 className="font-semibold mb-4">Recent Sales</h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-500 border-b dark:border-slate-700">
                <th className="pb-2">Invoice</th><th className="pb-2">Customer</th><th className="pb-2">Amount</th><th className="pb-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {sales.slice(0, 4).map(r => (
                <tr key={r.id} className="border-b dark:border-slate-700">
                  <td className="py-2 font-medium">{r.inv}</td>
                  <td className="py-2">{r.customer}</td>
                  <td className="py-2">PKR {r.amt.toLocaleString()}</td>
                  <td className="py-2">
                    <span className={`px-2 py-0.5 rounded-full text-xs ${r.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>{r.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="card bg-white dark:bg-slate-800 p-5">
          <h3 className="font-semibold mb-4">Recent Activities</h3>
          <div className="space-y-4">
            {activities.map((a, i) => {
              const Icon = a.i;
              return (
                <div key={i} className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 text-slate-500" />
                  </div>
                  <div>
                    <p className="text-sm">{a.t}</p>
                    <p className="text-xs text-slate-500">{a.d}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <button onClick={() => onNavigate('pos')} className="card bg-white dark:bg-slate-800 p-4 flex items-center gap-3 hover:shadow-md transition-shadow">
          <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center"><ShoppingCart className="w-5 h-5 text-blue-600" /></div>
          <span className="font-medium text-sm">New Sale</span>
        </button>
        <button onClick={() => onNavigate('purchase-orders', true)} className="card bg-white dark:bg-slate-800 p-4 flex items-center gap-3 hover:shadow-md transition-shadow">
          <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center"><Package className="w-5 h-5 text-emerald-600" /></div>
          <span className="font-medium text-sm">New PO</span>
        </button>
        <button onClick={() => onNavigate('products', true)} className="card bg-white dark:bg-slate-800 p-4 flex items-center gap-3 hover:shadow-md transition-shadow">
          <div className="w-10 h-10 rounded-lg bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center"><Package className="w-5 h-5 text-violet-600" /></div>
          <span className="font-medium text-sm">New Product</span>
        </button>
        <button onClick={() => onNavigate('suppliers', true)} className="card bg-white dark:bg-slate-800 p-4 flex items-center gap-3 hover:shadow-md transition-shadow">
          <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center"><Truck className="w-5 h-5 text-amber-600" /></div>
          <span className="font-medium text-sm">New Supplier</span>
        </button>
      </div>
    </>
  );
}
