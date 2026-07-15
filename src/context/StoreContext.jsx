import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';

const StoreContext = createContext(null);

const initialProducts = [
  { id: 1, name: 'Wireless Earbuds Pro', category: 'Electronics', brand: 'TechMax', cost: 25, price: 49.99, stock: 145, barcode: '8901234567890', img: 'https://images.pexels.com/photos/10885667/pexels-photo-10885667.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { id: 2, name: 'Organic Green Tea', category: 'Beverages', brand: 'NaturePure', cost: 3, price: 7.99, stock: 320, barcode: '8901234567891', img: 'https://images.pexels.com/photos/9228963/pexels-photo-9228963.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { id: 3, name: 'Premium Hand Soap', category: 'Household', brand: 'CleanCo', cost: 2, price: 5.49, stock: 89, barcode: '8901234567892', img: 'https://images.pexels.com/photos/10566507/pexels-photo-10566507.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { id: 4, name: 'Protein Bar Pack', category: 'Snacks', brand: 'FitFuel', cost: 8, price: 14.99, stock: 210, barcode: '8901234567893', img: 'https://images.pexels.com/photos/1616036/pexels-photo-1616036.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { id: 5, name: 'Smart Watch Band', category: 'Electronics', brand: 'TechMax', cost: 12, price: 24.99, stock: 67, barcode: '8901234567894', img: 'https://images.pexels.com/photos/5208774/pexels-photo-5208774.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { id: 6, name: 'Cola Classic 6-Pack', category: 'Beverages', brand: 'FizzDrink', cost: 4, price: 8.99, stock: 450, barcode: '8901234567895', img: 'https://images.pexels.com/photos/4113654/pexels-photo-4113654.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { id: 7, name: 'All-Purpose Cleaner', category: 'Household', brand: 'CleanCo', cost: 3, price: 6.99, stock: 12, barcode: '8901234567896', img: 'https://images.pexels.com/photos/5217889/pexels-photo-5217889.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { id: 8, name: 'Bluetooth Speaker', category: 'Electronics', brand: 'SoundWave', cost: 30, price: 59.99, stock: 0, barcode: '8901234567897', img: 'https://images.pexels.com/photos/14309807/pexels-photo-14309807.jpeg?auto=compress&cs=tinysrgb&w=400' },
];

const initialSales = [
  { id: 1, inv: 'INV-2847', customer: 'Walk-in', person: 'Ahmed', method: 'Cash', status: 'Completed', amt: 2450, date: '2026-07-01' },
  { id: 2, inv: 'INV-2846', customer: 'Ali Khan', person: 'Fatima', method: 'Card', status: 'Completed', amt: 8900, date: '2026-07-01' },
  { id: 3, inv: 'INV-2845', customer: 'Sara Ahmed', person: 'Ahmed', method: 'Cash', status: 'Pending', amt: 1200, date: '2026-06-30' },
  { id: 4, inv: 'INV-2844', customer: 'Walk-in', person: 'Hassan', method: 'Bank', status: 'Refunded', amt: 650, date: '2026-06-30' },
];

const initialSalesOrders = [
  { id: 1, code: 'SO-1001', customer: 'TechWorld Ltd', date: '2026-06-28', status: 'Pending', amt: 45000 },
  { id: 2, code: 'SO-1002', customer: 'MegaMart', date: '2026-06-27', status: 'Processing', amt: 128000 },
  { id: 3, code: 'SO-1003', customer: 'QuickShop', date: '2026-06-25', status: 'Shipped', amt: 32000 },
];

const initialPurchaseOrders = [
  {
    id: 1,
    code: 'PO-2026-0001',
    supplier: 'GlobalTech',
    supplierId: 1,
    date: '2026-06-29',
    expectedDelivery: '2026-07-04',
    status: 'Pending',
    deliveryAddress: 'Enterprise POS Warehouse\nModel Town, Lahore, Pakistan',
    preparedBy: 'Zohaib Tariq',
    paymentTerms: '30 Days Credit',
    shippingCharges: 500,
    taxRate: 18,
    notes: 'Please confirm availability of all items before dispatch.',
    items: [
      { id: 1, productId: 6, productName: 'Cola Classic 6-Pack', sku: '8901234567895', qty: 100, unitPrice: 120, discount: 0 },
      { id: 2, productId: 6, productName: 'Cola Classic 6-Pack', sku: '8901234567895', qty: 80, unitPrice: 115, discount: 0 },
      { id: 3, productId: 6, productName: 'Cola Classic 6-Pack', sku: '8901234567895', qty: 50, unitPrice: 118, discount: 5 },
    ],
    amt: 32130,
  },
  { id: 2, code: 'PO-2026-0002', supplier: 'FreshFoods Inc', supplierId: 2, date: '2026-06-27', expectedDelivery: '2026-07-02', status: 'Approved', deliveryAddress: 'Enterprise POS Warehouse\nModel Town, Lahore, Pakistan', preparedBy: 'Zohaib Tariq', paymentTerms: '30 Days Credit', shippingCharges: 250, taxRate: 18, notes: '', items: [], amt: 85000 },
  { id: 3, code: 'PO-2026-0003', supplier: 'CleanSupply Co', supplierId: 3, date: '2026-06-25', expectedDelivery: '2026-06-30', status: 'Received', deliveryAddress: 'Enterprise POS Warehouse\nModel Town, Lahore, Pakistan', preparedBy: 'Zohaib Tariq', paymentTerms: '30 Days Credit', shippingCharges: 125, taxRate: 18, notes: '', items: [], amt: 42000 },
];

const initialGrns = [
  { id: 1, code: 'GRN-501', po: 'PO-1040', supplier: 'CleanSupply Co', date: '2026-06-26', status: 'Completed', items: 5 },
  { id: 2, code: 'GRN-500', po: 'PO-1039', supplier: 'FreshFoods Inc', date: '2026-06-24', status: 'Partial', items: 8 },
];

const initialCategories = [
  { id: 1, name: 'Electronics', desc: 'Gadgets & Devices', count: 342, status: 'Active' },
  { id: 2, name: 'Beverages', desc: 'Drinks & Juices', count: 189, status: 'Active' },
  { id: 3, name: 'Household', desc: 'Cleaning & Home', count: 267, status: 'Active' },
  { id: 4, name: 'Snacks', desc: 'Food & Treats', count: 449, status: 'Active' },
];

const initialBrands = [
  { id: 1, name: 'TechMax', country: 'Japan', desc: 'Premium electronics', status: 'Active' },
  { id: 2, name: 'NaturePure', country: 'Pakistan', desc: 'Organic products', status: 'Active' },
  { id: 3, name: 'CleanCo', country: 'USA', desc: 'Household cleaning', status: 'Active' },
  { id: 4, name: 'FitFuel', country: 'UK', desc: 'Health & Nutrition', status: 'Active' },
];

const initialSuppliers = [
  { id: 1, name: 'GlobalTech', contact: 'Mr. Li Wei', phone: '+92-321-555-0101', email: 'li@globaltech.com', balance: 250000, status: 'Active' },
  { id: 2, name: 'FreshFoods Inc', contact: 'Sara Malik', phone: '+92-300-555-0202', email: 'sara@freshfoods.pk', balance: 0, status: 'Active' },
  { id: 3, name: 'CleanSupply Co', contact: 'John Smith', phone: '+1-555-0303', email: 'john@cleansupply.com', balance: 42000, status: 'Active' },
];

const initialSalespersons = [
  { id: 1, name: 'Ahmed Khan', sales: 127, revenue: 284500, commission: 14225, perf: 92 },
  { id: 2, name: 'Fatima Ali', sales: 98, revenue: 198000, commission: 9900, perf: 85 },
  { id: 3, name: 'Hassan Raza', sales: 76, revenue: 156000, commission: 7800, perf: 72 },
];

const initialStockMovements = [
  { id: 1, product: 'Wireless Earbuds Pro', type: 'Sale', qty: -2, date: '2026-07-01', ref: 'INV-2847' },
  { id: 2, product: 'Organic Green Tea', type: 'Purchase', qty: 50, date: '2026-06-30', ref: 'PO-1040' },
  { id: 3, product: 'All-Purpose Cleaner', type: 'Adjustment', qty: -5, date: '2026-06-29', ref: 'ADJ-012' },
  { id: 4, product: 'Cola Classic 6-Pack', type: 'Return', qty: 3, date: '2026-06-28', ref: 'RET-008' },
];

export function StoreProvider({ children }) {
  const [products, setProducts] = useState(initialProducts);
  const [sales, setSales] = useState(initialSales);
  const [salesOrders, setSalesOrders] = useState(initialSalesOrders);
  const [purchaseOrders, setPurchaseOrders] = useState(initialPurchaseOrders);
  const [grns, setGrns] = useState(initialGrns);
  const [categories, setCategories] = useState(initialCategories);
  const [brands, setBrands] = useState(initialBrands);
  const [suppliers, setSuppliers] = useState(initialSuppliers);
  const [salespersons, setSalespersons] = useState(initialSalespersons);
  const [isLoadingSalespersons, setIsLoadingSalespersons] = useState(false);
  const [selectedSalespersonId, setSelectedSalespersonId] = useState(null);
  const [stockMovements, setStockMovements] = useState(initialStockMovements);
  const [isLoadingSuppliers, setIsLoadingSuppliers] = useState(false);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [isLoadingLookups, setIsLoadingLookups] = useState(false);
  const [isLoadingPurchaseOrders, setIsLoadingPurchaseOrders] = useState(false);

  const [cart, setCart] = useState([]);
  const [selectedPayment, setSelectedPayment] = useState('Cash');
  const [holds, setHolds] = useState(() => {
    try {
      const raw = localStorage.getItem('pos_holds');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });
  const [darkMode, setDarkMode] = useState(false);
  const [toasts, setToasts] = useState([]);

  const nextId = useRef(100);
  const API_BASE = import.meta.env.VITE_API_BASE_URL ?? 'https://localhost:7002/api';
  const genId = useCallback(() => nextId.current++, []);

  const showToast = useCallback((msg, type = 'success') => {
    const id = genId();
    setToasts(t => [...t, { id, msg, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3000);
  }, [genId]);

  const fetchProducts = useCallback(async () => {
    setIsLoadingProducts(true);
    try {
      const response = await fetch(`${API_BASE}/products`);
      if (!response.ok) throw new Error('Failed to load products');
      const data = await response.json();
      setProducts(data.map(p => ({
        id: p.productID,
        name: p.productName,
        category: p.categoryName,
        brand: p.brandName,
        cost: p.costPrice,
        price: p.sellingPrice,
        stock: p.stockQuantity,
        barcode: p.barcode,
        status: p.status,
        img: p.productImage || 'https://images.pexels.com/photos/14541064/pexels-photo-14541064.jpeg?auto=compress&cs=tinysrgb&w=400'
      })));
    } catch (error) {
      console.error(error);
      showToast('Could not load products', 'error');
    } finally {
      setIsLoadingProducts(false);
    }
  }, [API_BASE, showToast]);

 const fetchLookups = useCallback(async () => {
    setIsLoadingLookups(true);
    try {
      const [categoriesRes, brandsRes] = await Promise.all([
        fetch(`${API_BASE}/lookups/categories`),
        fetch(`${API_BASE}/lookups/brands`)
      ]);

      if (!categoriesRes.ok || !brandsRes.ok) throw new Error('Failed to load lookups');

      const categoriesData = await categoriesRes.json();
      const brandsData = await brandsRes.json();

      setCategories(categoriesData.map(c => ({ 
        id: c.categoryID ?? c.CategoryID, 
        name: c.categoryName ?? c.CategoryName, 
        desc: c.description ?? c.Description ?? '', 
        count: 0, 
        status: c.status ?? 'Active' 
      })));

      // FIXED: Safely extract country and description properties from the API response array
      setBrands(brandsData.map(b => ({ 
        id: b.brandID ?? b.BrandID, 
        name: b.brandName ?? b.BrandName, 
        country: b.country ?? b.Country ?? '', 
        desc: b.description ?? b.Description ?? '', 
        status: b.status ?? b.Status ?? 'Active' 
      })));

    } catch (error) {
      console.error(error);
      showToast('Could not load categories or brands', 'error');
    } finally {
      setIsLoadingLookups(false);
    }
  }, [API_BASE, showToast]);
  const fetchSuppliers = useCallback(async () => {
    setIsLoadingSuppliers(true);
    try {
      const response = await fetch(`${API_BASE}/supplier`);
      if (!response.ok) throw new Error('Failed to load suppliers');
      const data = await response.json();
      setSuppliers(data.map(s => ({
        id: s.supplierID,
        name: s.supplierName,
        contact: s.contactPerson || '',
        phone: s.phone || '',
        email: s.email || '',
        balance: s.balance ?? 0,
        status: s.status || 'Active'
      })));
    } catch (error) {
      console.error(error);
      showToast('Could not load suppliers', 'error');
    } finally {
      setIsLoadingSuppliers(false);
    }
  }, [API_BASE, showToast]);

  const fetchSalespersons = useCallback(async () => {
    setIsLoadingSalespersons(true);
    try {
      const response = await fetch(`${API_BASE}/salespersons`);
      if (!response.ok) throw new Error('Failed to load salespersons');
      const data = await response.json();
      setSalespersons(data.map(s => ({
        id: s.salespersonID ?? s.SalespersonID ?? s.SalespersonId ?? genId(),
        name: s.name ?? s.Name ?? s.Name ?? 'Unknown',
        email: s.email ?? s.Email ?? '',
        status: s.status ?? s.Status ?? 'Active',
        sales: Number(s.sales ?? s.Sales ?? 0),
        perf: Number(s.performance ?? s.Performance ?? 0),
        revenue: Number(s.revenue ?? s.Revenue ?? 0),
        commission: Number(s.commission ?? s.Commission ?? 0),
        commissionRate: s.commissionRate ?? 5
      })));
    } catch (error) {
      console.error(error);
      showToast('Could not load salespersons', 'error');
    } finally {
      setIsLoadingSalespersons(false);
    }
  }, [API_BASE, genId, showToast]);

  const fetchSales = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/sales`);
      if (!res.ok) throw new Error('Failed to load sales');
      const data = await res.json();
      setSales(data.map(s => ({
        id: s.saleID ?? s.id ?? genId(),
        inv: s.invoiceNumber ?? s.InvoiceNumber ?? s.invoice ?? s.inv ?? 'INV-0000',
        customer: s.customerName ?? s.customer ?? 'Walk-in',
        person: s.salespersonName ?? s.person ?? '',
        method: s.paymentMethod ?? s.method ?? '',
        status: s.status ?? 'Completed',
        amt: Number(s.totalAmount ?? s.TotalAmount ?? s.amt ?? s.Amt ?? 0),
        date: s.saleDate ?? s.SaleDate ?? s.date ?? new Date().toISOString().slice(0,10),
        items: (s.items ?? s.saleItems ?? []).map(it => ({
          saleItemID: it.saleItemID ?? it.SaleItemID ?? 0,
          productID: it.productID ?? it.ProductID ?? it.ProductId ?? 0,
          name: it.name ?? it.Name ?? it.productName ?? it.ProductName ?? '',
          qty: it.qty ?? it.Qty ?? it.quantity ?? it.Quantity ?? 0,
          price: it.price ?? it.Price ?? it.priceAtSale ?? it.PriceAtSale ?? 0
        }))
      })));
    } catch (err) {
      console.warn('Could not fetch sales', err);
    }
  }, [API_BASE, genId]);

  const fetchPurchaseOrders = useCallback(async () => {
    setIsLoadingPurchaseOrders(true);
    try {
      const res = await fetch(`${API_BASE}/purchaseorders`);
      if (!res.ok) throw new Error('Failed to load purchase orders');
      const data = await res.json();
      setPurchaseOrders(data.map(po => ({
        id: po.purchaseOrderID ?? genId(),
        code: po.poNumber ?? po.PONumber ?? `PO-${new Date().getFullYear()}-0000`,
        supplier: po.supplierName ?? po.SupplierName ?? '',
        supplierId: po.supplierID ?? po.SupplierID ?? null,
        orderDate: po.orderDate ? String(po.orderDate).slice(0, 10) : '',
        expectedDelivery: po.expectedDelivery ? String(po.expectedDelivery).slice(0, 10) : '',
        status: po.status ?? 'Pending',
        deliveryAddress: po.deliveryAddress ?? po.DeliveryAddress ?? '',
        preparedBy: po.preparedBy ?? po.PreparedBy ?? '',
        paymentTerms: po.paymentTerms ?? po.PaymentTerms ?? '',
        shippingCharges: Number(po.shippingCharges ?? po.ShippingCharges ?? 0),
        taxRate: Number(po.taxRate ?? po.TaxRate ?? 0),
        notes: po.notes ?? po.Notes ?? '',
        items: (po.items ?? po.Items ?? []).map(item => ({
          id: item.purchaseOrderItemID ?? item.PurchaseOrderItemID ?? genId(),
          productId: item.productID ?? item.ProductID ?? 0,
          productName: item.productName ?? item.ProductName ?? '',
          sku: item.sku ?? item.SKU ?? '',
          qty: Number(item.quantity ?? item.Quantity ?? 0),
          unitPrice: Number(item.unitPrice ?? item.UnitPrice ?? 0),
          discount: Number(item.discount ?? item.Discount ?? 0)
        })),
        amt: Number(po.totalAmount ?? po.TotalAmount ?? 0)
      })));
    } catch (error) {
      console.error(error);
      showToast('Could not load purchase orders', 'error');
    } finally {
      setIsLoadingPurchaseOrders(false);
    }
  }, [API_BASE, genId, showToast]);

  const refundSale = useCallback(async (id) => {
    try {
      const res = await fetch(`${API_BASE}/sales/${id}/refund`, { method: 'POST' });
      if (!res.ok) throw new Error('Refund failed');
      setSales(prev => prev.map(s => s.id === id ? { ...s, status: 'Refunded' } : s));
      showToast('Sale refunded', 'success');
    } catch (err) {
      console.error(err);
      showToast('Could not refund sale', 'error');
    }
  }, [API_BASE, showToast]);

  useEffect(() => {
    fetchProducts();
    fetchLookups();
    fetchSuppliers();
    fetchSalespersons();
    fetchSales();
    fetchPurchaseOrders();
  }, [fetchProducts, fetchLookups, fetchSuppliers, fetchSalespersons, fetchSales, fetchPurchaseOrders]);

  const toggleDark = useCallback(() => {
    setDarkMode(d => {
      const next = !d;
      document.documentElement.classList.toggle('dark', next);
      return next;
    });
  }, []);

  // ---- Cart ----
  const addToCart = useCallback((id) => {
    setCart(prev => {
      const p = products.find(x => x.id === id);
      if (!p) return prev;
      const existing = prev.find(c => c.id === id);
      if (existing) {
        if (existing.qty < p.stock) {
          return prev.map(c => c.id === id ? { ...c, qty: c.qty + 1 } : c);
        } else {
          showToast('Max stock reached', 'error');
          return prev;
        }
      }
      return [...prev, { ...p, qty: 1 }];
    });
  }, [products, showToast]);

  const changeQty = useCallback((index, delta) => {
    setCart(prev => {
      const item = prev[index];
      if (!item) return prev;
      const p = products.find(x => x.id === item.id);
      let newQty = item.qty + delta;
      if (newQty <= 0) return prev.filter((_, i) => i !== index);
      if (p && newQty > p.stock) {
        newQty = p.stock;
        showToast('Max stock reached', 'error');
      }
      return prev.map((c, i) => i === index ? { ...c, qty: newQty } : c);
    });
  }, [products, showToast]);

  const removeFromCart = useCallback((index) => {
    setCart(prev => prev.filter((_, i) => i !== index));
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const completeSale = useCallback(async (salespersonId = null, customerName = '') => {
    if (cart.length === 0) return;
    const subtotal = cart.reduce((s, c) => s + c.price * c.qty, 0);
    const total = Math.round(subtotal * 1.05);
    const inv = 'INV-' + (2847 + sales.length + 1);

    const personName = salespersonId ? (salespersons.find(s => s.id === salespersonId)?.name ?? 'Walk-in') : 'Walk-in';
    const customer = (customerName && customerName.trim()) ? customerName.trim() : 'Walk-in';

    const items = cart.map(c => ({ productID: c.id, name: c.name, qty: c.qty, price: c.price }));

    // optimistically update UI
    setSales(prev => [{ id: genId(), inv, customer, person: personName, method: selectedPayment, status: 'Completed', amt: total, date: new Date().toISOString().slice(0, 10), items }, ...prev]);
    setProducts(prev => prev.map(p => {
      const inCart = cart.find(c => c.id === p.id);
      return inCart ? { ...p, stock: p.stock - inCart.qty } : p;
    }));

    // persist to API
    (async () => {
      try {
        const payload = {
          InvoiceNumber: inv,
          CustomerName: customer,
          SalespersonID: salespersonId,
          SalespersonName: personName,
          PaymentMethod: selectedPayment,
          Status: 'Completed',
          Subtotal: subtotal,
          TaxAmount: Math.round((subtotal * 0.05) * 100) / 100,
          TotalAmount: total,
          SaleDate: new Date().toISOString(),
          Items: items.map(i => ({ ProductID: i.productID, ProductName: i.name, Quantity: i.qty, PriceAtSale: i.price }))
        };
        const res = await fetch(`${API_BASE}/sales`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        if (!res.ok) throw new Error('Failed to persist sale');
        // refresh list from server
        fetchSales();
      } catch (err) {
        console.error('Persisting sale failed', err);
        showToast('Could not persist sale to server', 'warning');
      }
    })();

    // update salesperson stats locally and attempt to persist to API
    if (salespersonId) {
      setSalespersons(prev => prev.map(sp => {
        if (sp.id !== salespersonId) return sp;
        const newSales = Number(sp.sales ?? 0) + 1;
        const newRevenue = Number(sp.revenue ?? 0) + total;
        const rate = Number(sp.commissionRate ?? 5);
        const commissionDelta = Math.round(total * (rate / 100));
        const newCommission = Number(sp.commission ?? 0) + commissionDelta;
        const newPerf = Math.round((newSales / Math.max(1, newSales + 10)) * 100);
        const updated = { ...sp, sales: newSales, revenue: newRevenue, commission: newCommission, perf: newPerf };

        // try to persist
        (async () => {
          try {
            const payload = {
              SalespersonID: sp.id,
              Name: updated.name,
              Email: updated.email ?? '',
              Status: updated.status ?? 'Active',
              Sales: String(updated.sales),
              Performance: String(updated.perf),
              Revenue: String(updated.revenue),
              Commission: String(updated.commission)
            };
            const res = await fetch(`${API_BASE}/salespersons/${sp.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
            if (!res.ok) throw new Error('Failed to persist salesperson');
          } catch (err) {
            console.warn('Persisting salesperson failed, keeping local copy', err);
          }
        })();

        return updated;
      }));
    }

    setCart([]);
    showToast(`Sale ${inv} completed — PKR ${total.toLocaleString()}`, 'success');
  }, [cart, sales.length, selectedPayment, genId, showToast, salespersons, API_BASE, fetchSales]);

  // ---- Holds ----
  const saveHold = useCallback((holdName = null, cartSnapshot = null, payment = null, salespersonId = null, customerName = '') => {
    const payloadCart = cartSnapshot ?? cart;
    const h = {
      id: genId(),
      name: holdName ?? `Hold ${new Date().toLocaleString()}`,
      createdAt: new Date().toISOString(),
      cart: payloadCart,
      payment: payment ?? selectedPayment,
      salespersonId: salespersonId ?? selectedSalespersonId,
      customerName: customerName ?? ''
    };
    setHolds(prev => {
      const next = [h, ...prev];
      try { localStorage.setItem('pos_holds', JSON.stringify(next)); } catch {};
      return next;
    });
    showToast('Cart saved to holds', 'success');
    return h;
  }, [cart, genId, selectedPayment, selectedSalespersonId, showToast]);

  const loadHold = useCallback((id) => {
    const h = holds.find(x => x.id === id);
    if (!h) return null;
    setCart(h.cart || []);
    setSelectedPayment(h.payment || 'Cash');
    setSelectedSalespersonId(h.salespersonId ?? null);
    showToast(`Loaded hold: ${h.name}`, 'success');
    return h;
  }, [holds, setSelectedSalespersonId]);

  const removeHold = useCallback((id) => {
    setHolds(prev => {
      const next = prev.filter(x => x.id !== id);
      try { localStorage.setItem('pos_holds', JSON.stringify(next)); } catch {};
      return next;
    });
    showToast('Hold removed', 'info');
  }, [showToast]);

  // ---- Products ----
  const fileToBase64 = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  const addProduct = useCallback(async (data) => {
    try {
      let productImage = data.img;
      if (productImage && productImage instanceof File) {
        productImage = await fileToBase64(productImage);
      }

      const payload = {
        barcode: data.barcode,
        productName: data.name,
        categoryID: categories.find(c => c.name === data.category)?.id ?? 0,
        brandID: brands.find(b => b.name === data.brand)?.id ?? 0,
        costPrice: data.cost,
        sellingPrice: data.price,
        stockQuantity: data.stock,
        productImage
      };

      const response = await fetch(`${API_BASE}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error('Failed to add product');

      fetchProducts();
      showToast('Product added');
    } catch (error) {
      console.error(error);
      showToast('Could not add product', 'error');
    }
  }, [API_BASE, categories, brands, fetchProducts, showToast]);

  const editProduct = useCallback(async (id, data) => {
    try {
      let productImage = data.img;
      if (productImage && productImage instanceof File) {
        productImage = await fileToBase64(productImage);
      }

      const payload = {
        productID: id,
        barcode: data.barcode,
        productName: data.name,
        categoryID: categories.find(c => c.name === data.category)?.id ?? 0,
        brandID: brands.find(b => b.name === data.brand)?.id ?? 0,
        costPrice: data.cost,
        sellingPrice: data.price,
        stockQuantity: data.stock,
        status: data.stock > 20 ? 'Active' : data.stock > 0 ? 'Low' : 'Out',
        productImage
      };

      const response = await fetch(`${API_BASE}/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error('Failed to update product');

      fetchProducts();
      showToast('Product updated');
    } catch (error) {
      console.error(error);
      showToast('Could not update product', 'error');
    }
  }, [API_BASE, categories, brands, fetchProducts, showToast]);

  const deleteProduct = useCallback(async (id) => {
    try {
      const response = await fetch(`${API_BASE}/products/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Failed to delete product');

      fetchProducts();
      showToast('Product deleted');
    } catch (error) {
      console.error(error);
      showToast('Could not delete product', 'error');
    }
  }, [API_BASE, fetchProducts, showToast]);

  const adjustStock = useCallback((id, newStock) => {
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/products/${id}/adjust-stock`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ newStockQuantity: newStock })
        });
        if (!res.ok) throw new Error('Failed to adjust stock');
        
        const updatedProduct = await res.json();
        
        // Update local state with the response from backend
        setProducts(prev => prev.map(p => {
          if (p.id !== id) return p;
          const diff = newStock - p.stock;
          setStockMovements(sm => [{ id: genId(), product: p.name, type: 'Adjustment', qty: diff, date: new Date().toISOString().slice(0, 10), ref: 'ADJ-' + (100 + sm.length) }, ...sm]);
          return { 
            ...p, 
            stock: updatedProduct.stockQuantity,
            status: updatedProduct.status 
          };
        }));
        showToast('Stock adjusted successfully', 'success');
      } catch (error) {
        console.error(error);
        showToast('Could not adjust stock', 'error');
      }
    })();
  }, [API_BASE, genId, showToast]);

  // ---- Categories ----
  const addCategory = useCallback((data) => {
    (async () => {
      try {
        const payload = { categoryName: data.name, description: data.desc };
        const res = await fetch(`${API_BASE}/lookups/categories`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        if (!res.ok) throw new Error('Failed to add category');
        fetchLookups();
        showToast('Category added');
      } catch (err) {
        setCategories(prev => [...prev, { id: genId(), count: 0, status: 'Active', ...data }]);
        showToast('Category added (local)');
      }
    })();
  }, [genId, showToast]);
  const editCategory = useCallback((id, data) => {
    (async () => {
      try {
        const payload = { categoryName: data.name, description: data.desc, status: data.status };
        const res = await fetch(`${API_BASE}/lookups/categories/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        if (!res.ok) throw new Error('Failed to update category');
        fetchLookups();
        showToast('Category updated');
      } catch (err) {
        setCategories(prev => prev.map(c => c.id === id ? { ...c, ...data } : c));
        showToast('Category updated (local)');
      }
    })();
  }, [fetchLookups, showToast]);
  const deleteCategory = useCallback((id) => {
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/lookups/categories/${id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('Failed to delete category');
        fetchLookups();
        showToast('Category deleted');
      } catch (err) {
        setCategories(prev => prev.filter(c => c.id !== id));
        showToast('Category deleted (local)');
      }
    })();
  }, [fetchLookups, showToast]);

  // ---- Brands ----
 // ---- Brands ----
 // ---- Brands ----
  const addBrand = useCallback((data) => {
    (async () => {
      try {
        // PascalCase matching your C# Brand model properties exactly
        const payload = { 
          BrandName: data.name, 
          Country: data.country, 
          Description: data.desc,
          Status: data.status || 'ACTIVE'
        };

        const res = await fetch(`${API_BASE}/lookups/brands`, { 
          method: 'POST', 
          headers: { 'Content-Type': 'application/json' }, 
          body: JSON.stringify(payload) 
        });

        if (!res.ok) throw new Error('Failed to add brand');
        
        fetchLookups(); // Triggers a clean database refresh 
        showToast('Brand added');
      } catch (err) {
        setBrands(prev => [...prev, { id: genId(), status: 'Active', ...data }]);
        showToast('Brand added (local)');
      }
    })();
  }, [genId, fetchLookups, showToast]);

  const editBrand = useCallback((id, data) => {
    (async () => {
      try {
        // PascalCase matching your C# Brand model properties exactly
        const payload = { 
          BrandID: id,
          BrandName: data.name, 
          Country: data.country, 
          Description: data.desc, 
          Status: data.status 
        };

        const res = await fetch(`${API_BASE}/lookups/brands/${id}`, { 
          method: 'PUT', 
          headers: { 'Content-Type': 'application/json' }, 
          body: JSON.stringify(payload) 
        });

        if (!res.ok) throw new Error('Failed to update brand');
        
        fetchLookups(); // Triggers a clean database refresh
        showToast('Brand updated');
      } catch (err) {
        setBrands(prev => prev.map(b => (b.brandID || b.BrandID || b.id) === id ? { ...b, ...data } : b));
        showToast('Brand updated (local)');
      }
    })();
  }, [fetchLookups, showToast]);

  const deleteBrand = useCallback((id) => {
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/lookups/brands/${id}`, { 
          method: 'DELETE' 
        });

        if (!res.ok) throw new Error('Failed to delete brand');
        
        fetchLookups(); // Triggers a clean database refresh
        showToast('Brand deleted');
      } catch (err) {
        setBrands(prev => prev.filter(b => (b.brandID || b.BrandID || b.id) !== id));
        showToast('Deleted (local)');
      }
    })();
  }, [fetchLookups, showToast]);

  // ---- Suppliers ----
  const addSupplier = useCallback(async (data) => {
    try {
      const payload = {
        supplierName: data.name,
        contactPerson: data.contact,
        phone: data.phone,
        email: data.email,
        status: 'Active',
        balance: data.balance ?? 0
      };

      const response = await fetch(`${API_BASE}/supplier`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error('Failed to add supplier');

      fetchSuppliers();
      showToast('Supplier added');
    } catch (error) {
      console.error(error);
      showToast('Could not add supplier', 'error');
    }
  }, [API_BASE, fetchSuppliers, showToast]);

  const editSupplier = useCallback(async (id, data) => {
    try {
      const payload = {
        supplierName: data.name,
        contactPerson: data.contact,
        phone: data.phone,
        email: data.email,
        status: 'Active',
        balance: data.balance ?? 0
      };

      const response = await fetch(`${API_BASE}/supplier/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error('Failed to update supplier');

      fetchSuppliers();
      showToast('Supplier updated');
    } catch (error) {
      console.error(error);
      showToast('Could not update supplier', 'error');
    }
  }, [API_BASE, fetchSuppliers, showToast]);

  const deleteSupplier = useCallback(async (id) => {
    try {
      const response = await fetch(`${API_BASE}/supplier/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Failed to delete supplier');

      fetchSuppliers();
      showToast('Supplier deleted');
    } catch (error) {
      console.error(error);
      showToast('Could not delete supplier', 'error');
    }
  }, [API_BASE, fetchSuppliers, showToast]);

  // ---- Sales Orders ----
  const addSalesOrder = useCallback((data) => {
    setSalesOrders(prev => [...prev, { id: genId(), code: 'SO-' + (1003 + prev.length), date: new Date().toISOString().slice(0, 10), ...data }]);
    showToast('Sales order created');
  }, [genId, showToast]);
  const editSalesOrder = useCallback((id, data) => {
    setSalesOrders(prev => prev.map(o => o.id === id ? { ...o, ...data } : o));
    showToast('Sales order updated');
  }, [showToast]);
  const deleteSalesOrder = useCallback((id) => {
    setSalesOrders(prev => prev.filter(o => o.id !== id));
    showToast('Deleted');
  }, [showToast]);

  // ---- Purchase Orders ----
  const calculateOrderAmounts = useCallback((items, shippingCharges = 0, taxRate = 0) => {
    const subtotal = items.reduce((sum, item) => {
      const lineTotal = Number(item.qty || 0) * Number(item.unitPrice || 0) * (1 - (Number(item.discount || 0) / 100));
      return sum + lineTotal;
    }, 0);
    const tax = Number((subtotal * Number(taxRate || 0) / 100).toFixed(2));
    const total = Number((subtotal + tax + Number(shippingCharges || 0)).toFixed(2));
    return { subtotal, tax, total };
  }, []);

  const addPurchaseOrder = useCallback(async (data) => {
    const totals = calculateOrderAmounts(data.items, data.shippingCharges, data.taxRate);
    const payload = {
      PONumber: data.code,
      SupplierID: Number(data.supplierId || 0),
      SupplierName: data.supplier,
      OrderDate: data.orderDate,
      ExpectedDelivery: data.expectedDelivery || null,
      Status: data.status,
      DeliveryAddress: data.deliveryAddress,
      PreparedBy: data.preparedBy,
      PaymentTerms: data.paymentTerms,
      ShippingCharges: Number(data.shippingCharges || 0),
      TaxRate: Number(data.taxRate || 0),
      Notes: data.notes || '',
      Subtotal: totals.subtotal,
      TaxAmount: totals.tax,
      TotalAmount: totals.total,
      Items: (data.items || []).map(item => ({
        ProductID: Number(item.productId || 0),
        ProductName: item.productName,
        Quantity: Number(item.qty || 0),
        UnitPrice: Number(item.unitPrice || 0),
        CostPrice: Number(item.unitPrice || 0),
        Discount: Number(item.discount || 0)
      }))
    };

    try {
      const response = await fetch(`${API_BASE}/purchaseorders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!response.ok) throw new Error('Failed to create purchase order');
      await fetchPurchaseOrders();
      showToast('Purchase order created');
    } catch (error) {
      console.error(error);
      setPurchaseOrders(prev => {
        const nextNumber = prev.length + 1;
        const poCode = `PO-${new Date().getFullYear()}-${String(nextNumber).padStart(4, '0')}`;
        return [...prev, { id: genId(), code: poCode, date: new Date().toISOString().slice(0, 10), ...data, amt: totals.total }];
      });
      showToast('Purchase order created locally');
    }
  }, [API_BASE, calculateOrderAmounts, fetchPurchaseOrders, genId, showToast]);

  const editPurchaseOrder = useCallback(async (id, data) => {
    const totals = calculateOrderAmounts(data.items, data.shippingCharges, data.taxRate);
    const payload = {
      PurchaseOrderID: id,
      PONumber: data.code,
      SupplierID: Number(data.supplierId || 0),
      SupplierName: data.supplier,
      OrderDate: data.orderDate,
      ExpectedDelivery: data.expectedDelivery || null,
      Status: data.status,
      DeliveryAddress: data.deliveryAddress,
      PreparedBy: data.preparedBy,
      PaymentTerms: data.paymentTerms,
      ShippingCharges: Number(data.shippingCharges || 0),
      TaxRate: Number(data.taxRate || 0),
      Notes: data.notes || '',
      Subtotal: totals.subtotal,
      TaxAmount: totals.tax,
      TotalAmount: totals.total,
      Items: (data.items || []).map(item => ({
        ProductID: Number(item.productId || 0),
        ProductName: item.productName,
        Quantity: Number(item.qty || 0),
        UnitPrice: Number(item.unitPrice || 0),
        CostPrice: Number(item.unitPrice || 0),
        Discount: Number(item.discount || 0)
      }))
    };

    try {
      const response = await fetch(`${API_BASE}/purchaseorders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!response.ok) throw new Error('Failed to update purchase order');
      await fetchPurchaseOrders();
      showToast('Purchase order updated');
    } catch (error) {
      console.error(error);
      setPurchaseOrders(prev => prev.map(o => o.id === id ? { ...o, ...data, amt: totals.total } : o));
      showToast('Purchase order updated locally');
    }
  }, [API_BASE, calculateOrderAmounts, fetchPurchaseOrders, showToast]);

  const deletePurchaseOrder = useCallback(async (id) => {
    try {
      const response = await fetch(`${API_BASE}/purchaseorders/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete purchase order');
      setPurchaseOrders(prev => prev.filter(o => o.id !== id));
      showToast('Purchase order deleted');
    } catch (error) {
      console.error(error);
      setPurchaseOrders(prev => prev.filter(o => o.id !== id));
      showToast('Purchase order deleted locally');
    }
  }, [API_BASE, showToast]);

  // ---- GRN ----
  const addGrn = useCallback((data) => {
    setGrns(prev => [...prev, { id: genId(), code: 'GRN-' + (501 + prev.length), date: new Date().toISOString().slice(0, 10), ...data }]);
    showToast('GRN created');
  }, [genId, showToast]);
  const deleteGrn = useCallback((id) => {
    setGrns(prev => prev.filter(g => g.id !== id));
    showToast('Deleted');
  }, [showToast]);

  // ---- Salespersons ----
  const addSalesperson = useCallback(async (data) => {
    try {
      const payload = {
        Name: data.name,
        Email: data.email ?? '',
        Status: data.status ?? 'Active',
        Sales: String(data.sales ?? 0),
        Performance: String(data.perf ?? 0),
        Revenue: String(data.revenue ?? 0),
        Commission: String(data.commission ?? 0)
      };
      const res = await fetch(`${API_BASE}/salespersons`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (!res.ok) throw new Error('Failed to add salesperson');
      // reload from server
      fetchSalespersons();
      showToast('Salesperson added');
    } catch (err) {
      // fallback to local
      setSalespersons(prev => [...prev, { id: genId(), sales: 0, revenue: 0, commission: 0, perf: 0, ...data }]);
      showToast('Salesperson added (local)');
    }
  }, [API_BASE, fetchSalespersons, genId, showToast]);

  const editSalesperson = useCallback(async (id, data) => {
    try {
      const payload = {
        SalespersonID: id,
        Name: data.name,
        Email: data.email ?? '',
        Status: data.status ?? 'Active',
        Sales: String(data.sales ?? 0),
        Performance: String(data.perf ?? 0),
        Revenue: String(data.revenue ?? 0),
        Commission: String(data.commission ?? 0)
      };
      const res = await fetch(`${API_BASE}/salespersons/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (!res.ok) throw new Error('Failed to update salesperson');
      fetchSalespersons();
      showToast('Salesperson updated');
    } catch (err) {
      // fallback local
      setSalespersons(prev => prev.map(p => p.id === id ? { ...p, ...data } : p));
      showToast('Salesperson updated (local)');
    }
  }, [API_BASE, fetchSalespersons, showToast]);

  const deleteSalesperson = useCallback(async (id) => {
    try {
      // API expects id as query param in controller
      const res = await fetch(`${API_BASE}/salespersons?id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete salesperson');
      fetchSalespersons();
      showToast('Salesperson deleted');
    } catch (err) {
      setSalespersons(prev => prev.filter(p => p.id !== id));
      showToast('Salesperson deleted (local)');
    }
  }, [API_BASE, fetchSalespersons, showToast]);

  // ---- Stock Movements ----
  const addStockMovement = useCallback((data) => {
    setStockMovements(prev => {
      const qty = (data.type === 'Sale' || data.type === 'Adjustment') ? -Math.abs(data.qty) : Math.abs(data.qty);
      return [{ id: genId(), date: new Date().toISOString().slice(0, 10), ref: data.ref || 'MAN-' + (100 + prev.length), ...data, qty }, ...prev];
    });
    showToast('Movement recorded');
  }, [genId, showToast]);

  const value = {
    products, setProducts, addProduct, editProduct, deleteProduct, adjustStock,
    sales, setSales,
    salesOrders, addSalesOrder, editSalesOrder, deleteSalesOrder,
    purchaseOrders, addPurchaseOrder, editPurchaseOrder, deletePurchaseOrder, fetchPurchaseOrders, isLoadingPurchaseOrders,
    grns, addGrn, deleteGrn,
    categories, addCategory, editCategory, deleteCategory,
    brands, addBrand, editBrand, deleteBrand,
    suppliers, addSupplier, editSupplier, deleteSupplier,
    salespersons, addSalesperson, editSalesperson, deleteSalesperson, fetchSalespersons, isLoadingSalespersons, selectedSalespersonId, setSelectedSalespersonId,
    stockMovements, addStockMovement,
    cart, addToCart, changeQty, removeFromCart, clearCart, completeSale,
    fetchSales, refundSale,
    selectedPayment, setSelectedPayment,
    darkMode, toggleDark,
    toasts, showToast,
    genId,
    holds, saveHold, loadHold, removeHold,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within a StoreProvider');
  return ctx;
}
