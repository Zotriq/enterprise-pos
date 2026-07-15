import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Search, ShoppingCart, ShoppingBag, User, UserCheck } from 'lucide-react';
import { useStore } from '../context/StoreContext.jsx';

export default function POS() {
  const {
    products, categories, cart, addToCart, changeQty, removeFromCart,
    clearCart, completeSale, selectedPayment, setSelectedPayment, showToast,
    salespersons, selectedSalespersonId, setSelectedSalespersonId,
    holds, saveHold, loadHold, removeHold
  } = useStore();
  const [customerName, setCustomerName] = useState('');
  const [selectedHoldId, setSelectedHoldId] = useState(null);
  const [showHoldModal, setShowHoldModal] = useState(false);
  const [holdNameInput, setHoldNameInput] = useState('');
  const cartScrollRef = useRef(null);

  useEffect(() => {
    if (!cartScrollRef.current) return;
    cartScrollRef.current.scrollTop = cartScrollRef.current.scrollHeight;
  }, [cart.length]);

  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('');

  const filteredProducts = useMemo(() => {
    return products.filter(p =>
      p.stock > 0 &&
      p.name.toLowerCase().includes(search.toLowerCase()) &&
      (!catFilter || p.category === catFilter)
    );
  }, [products, search, catFilter]);

  const subtotal = cart.reduce((s, c) => s + c.price * c.qty, 0);
  const tax = subtotal * 0.05;

  return (
    <div className="flex flex-col gap-4 h-[calc(100vh-140px)] w-full overflow-hidden pb-1">
      <style>{`
        .pos-cart-scroll::-webkit-scrollbar { width: 6px; }
        .pos-cart-scroll::-webkit-scrollbar-track { background: transparent; }
        .pos-cart-scroll::-webkit-scrollbar-thumb { background-color: rgba(148, 163, 184, 0.5); border-radius: 9999px; }
        .pos-cart-scroll::-webkit-scrollbar-thumb:hover { background-color: rgba(148, 163, 184, 0.8); }
        .pos-cart-scroll { scrollbar-width: thin; scrollbar-color: rgba(148, 163, 184, 0.5) transparent; }
      `}</style>

      {/* TOP BAR: Search, Categories, Customer, and Salesperson */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-2 bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700 shrink-0">

        {/* Search Input + Category Pills */}
        <div className="md:col-span-6 flex flex-col gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search products or scan barcode..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary-500 text-slate-900 dark:text-white"
            />
          </div>
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
        </div>

        {/* Customer Name Input */}
        <div className="md:col-span-3">
          <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus-within:ring-2 focus-within:ring-primary-500">
            <User className="w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={customerName}
              onChange={e => setCustomerName(e.target.value)}
              placeholder="Customer name (optional)"
              className="flex-1 bg-transparent text-sm text-slate-900 dark:text-white outline-none"
            />
          </div>
        </div>

        {/* Salesperson Dropdown */}
        <div className="md:col-span-3">
          <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus-within:ring-2 focus-within:ring-primary-500">
            <UserCheck className="w-4 h-4 text-slate-400" />
            <select
              value={selectedSalespersonId ?? ''}
              onChange={(e) => setSelectedSalespersonId(e.target.value ? Number(e.target.value) : null)}
              className="flex-1 bg-transparent text-sm text-slate-900 dark:text-white outline-none"
            >
              <option value="">Select Salesperson</option>
              {salespersons.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
        </div>

      </div>

      {/* MAIN CONTAINER: Split into Products Grid and Right Cart */}
      <div className="flex gap-4 flex-1 min-h-0 overflow-hidden">

        {/* LEFT SIDE: Products Grid */}
        <div className="flex-1 overflow-y-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 pb-4 content-start">
          {filteredProducts.length === 0 ? (
            <p className="col-span-full text-center text-slate-400 py-12">No products found</p>
          ) : filteredProducts.map(p => (
            <button
              key={p.id}
              type="button"
              className="pos-product-card card bg-white dark:bg-slate-800 p-3 text-left border border-slate-100 dark:border-slate-700 rounded-xl hover:shadow-md hover:border-primary-300 dark:hover:border-primary-600 transition-all"
              onClick={() => addToCart(p.id)}
            >
              <img src={p.img} className="w-full h-24 object-cover rounded-lg mb-2" alt={p.name} />
              <p className="text-sm font-medium truncate text-slate-900 dark:text-white">{p.name}</p>
              <div className="flex justify-between items-center mt-1">
                <span className="text-primary-600 dark:text-primary-400 font-bold text-sm">PKR {p.price}</span>
                <span className="text-xs text-slate-500 dark:text-slate-400">{p.stock} left</span>
              </div>
            </button>
          ))}
        </div>

        {/* RIGHT SIDE: Compact Sidebar Cart & Checkout Summary */}
        <div className="w-96 flex flex-col bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden h-full shrink-0">

          {/* Holds Selector */}
          <div className="p-4 border-b border-slate-100 dark:border-slate-700 shrink-0 bg-slate-50 dark:bg-slate-800/40">
            <div className="flex items-center gap-2">
              <select
                value={selectedHoldId ?? ''}
                onChange={e => setSelectedHoldId(e.target.value ? Number(e.target.value) : null)}
                className="flex-1 text-sm p-1.5 rounded border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
              >
                <option value="">-- Held Carts --</option>
                {holds.map(h => <option key={h.id} value={h.id}>{h.name}</option>)}
              </select>
              <button
                type="button"
                onClick={() => {
                  if (!selectedHoldId) return showToast('Select a hold to load', 'warning');
                  const h = loadHold(Number(selectedHoldId));
                  if (h && h.customerName) setCustomerName(h.customerName);
                }}
                className="py-1.5 px-2 text-xs font-semibold rounded bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-600"
              >Load</button>
              <button
                type="button"
                onClick={() => {
                  if (!selectedHoldId) return showToast('Select a hold to remove', 'warning');
                  removeHold(Number(selectedHoldId));
                  setSelectedHoldId(null);
                }}
                className="py-1.5 px-2 text-xs font-semibold rounded bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
              >Delete</button>
            </div>
          </div>

          {/* Scrollable Cart Items List */}
          <div ref={cartScrollRef} className="flex-1 overflow-y-auto p-2.5 space-y-1.5 min-h-0 pos-cart-scroll">
            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-slate-400 py-8">
                <ShoppingBag className="w-12 h-12 mb-2" />
                <p className="text-sm">Cart is empty</p>
              </div>
            ) : cart.map((c, i) => (
              // NOTE: key uses id + index. If two cart rows ever share the same
              // product id (e.g. addToCart pushes a new line instead of bumping
              // qty), a key of just `c.id` causes React to reuse/overlap DOM
              // nodes between rows — this is what produced the "merging" glitch.
              <div
                key={`${c.id}-${i}`}
                className="flex items-center gap-3 p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden"
              >
                <img
                  src={c.img}
                  className="w-10 h-10 flex-shrink-0 rounded-lg object-cover"
                  alt={c.name}
                />
                <div className="flex-1 min-w-0 overflow-hidden">
                  <p className="text-sm font-semibold truncate whitespace-nowrap text-slate-900 dark:text-white">{c.name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">PKR {(c.price * c.qty).toFixed(2)}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0 min-w-[130px] justify-end">
                  <div className="flex items-center gap-1 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-1.5 py-0.5">
                    <button
                      type="button"
                      onClick={() => changeQty(i, -1)}
                      className="w-7 h-7 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700"
                    >−</button>
                    <span className="w-6 text-center text-sm text-slate-900 dark:text-white">{c.qty}</span>
                    <button
                      type="button"
                      onClick={() => changeQty(i, 1)}
                      className="w-7 h-7 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700"
                    >+</button>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFromCart(i)}
                    className="w-8 h-8 rounded-full flex items-center justify-center bg-slate-50 dark:bg-slate-900 text-red-500 hover:bg-red-50 dark:hover:bg-red-950"
                    aria-label={`Remove ${c.name}`}
                  >✕</button>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Checkout Actions Area */}
          <div className="border-t border-slate-200 dark:border-slate-700 p-3 space-y-1.5 shrink-0 bg-slate-50 dark:bg-slate-800/50">

            <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400">
              <span>Subtotal</span>
              <span className="font-medium text-slate-900 dark:text-white">PKR {subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400">
              <span>Tax (5%)</span>
              <span className="font-medium text-slate-900 dark:text-white">PKR {tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-sm border-t dark:border-slate-700 pt-1.5">
              <span className="text-slate-900 dark:text-white">Total</span>
              <span className="text-primary-600 dark:text-primary-400">PKR {(subtotal + tax).toFixed(2)}</span>
            </div>

            {/* Payment Method Selector */}
            <div className="grid grid-cols-4 gap-1.5">
              {['Cash', 'Card', 'Bank', 'QR'].map(m => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setSelectedPayment(m)}
                  className={`py-1.5 text-xs font-semibold rounded-lg border transition-colors ${selectedPayment === m ? 'border-primary-500 bg-primary-600 text-white' : 'border-slate-200 dark:border-slate-700 dark:text-slate-300 bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600'}`}
                >{m}</button>
              ))}
            </div>

            {/* Complete Sale Button */}
            <button
              type="button"
              onClick={() => completeSale(selectedSalespersonId, customerName)}
              disabled={cart.length === 0}
              className={`w-full py-2 bg-primary-600 text-white rounded-lg font-bold hover:bg-primary-700 transition-colors ${cart.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
            >Complete Sale</button>

            {/* Secondary Actions */}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={clearCart}
                className="flex-1 py-1 text-xs font-semibold border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 text-red-600 bg-white dark:bg-slate-700"
              >Clear</button>
              <button
                type="button"
                onClick={() => {
                  if (cart.length === 0) return showToast('Cart is empty', 'warning');
                  setHoldNameInput('');
                  setShowHoldModal(true);
                }}
                className="flex-1 py-1 text-xs font-semibold border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-amber-50 dark:hover:bg-amber-950/30 text-amber-600 bg-white dark:bg-slate-700"
              >Hold</button>
            </div>
          </div>

        </div>
      </div>

      {/* Hold Cart Modal */}
      {showHoldModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
          onClick={() => setShowHoldModal(false)}
        >
          <div
            className="bg-white dark:bg-slate-800 rounded-xl shadow-xl w-full max-w-sm border border-slate-200 dark:border-slate-700"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 border-b border-slate-100 dark:border-slate-700">
              <h3 className="text-base font-semibold text-slate-900 dark:text-white">Hold this cart</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Give it a name so you can find it later. This is optional.</p>
            </div>
            <div className="p-5">
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1.5">
                Hold name
              </label>
              <input
                type="text"
                autoFocus
                value={holdNameInput}
                onChange={(e) => setHoldNameInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    saveHold(holdNameInput, cart, selectedPayment, selectedSalespersonId, customerName);
                    clearCart();
                    setCustomerName('');
                    setShowHoldModal(false);
                  } else if (e.key === 'Escape') {
                    setShowHoldModal(false);
                  }
                }}
                placeholder="e.g. Window 2 - Ali"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div className="p-5 pt-0 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowHoldModal(false)}
                className="px-4 py-2 text-sm font-semibold rounded-lg border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700"
              >Cancel</button>
              <button
                type="button"
                onClick={() => {
                  saveHold(holdNameInput, cart, selectedPayment, selectedSalespersonId, customerName);
                  clearCart();
                  setCustomerName('');
                  setShowHoldModal(false);
                }}
                className="px-4 py-2 text-sm font-semibold rounded-lg bg-primary-600 text-white hover:bg-primary-700"
              >Hold Cart</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}