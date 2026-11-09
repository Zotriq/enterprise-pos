// Demo mode: an in-browser stand-in for the ASP.NET Core API, so the POS can be tried
// on a static host. Enabled with VITE_DEMO=true at build time. Every request the app
// makes to API_BASE is answered here from sample data kept in the visitor's browser.

const STORAGE_KEY = 'pos_demo_db_v1';

function seed() {
  const categories = [
    { categoryID: 1, categoryName: 'Electronics', description: 'Gadgets & devices', status: 'Active' },
    { categoryID: 2, categoryName: 'Beverages', description: 'Drinks & juices', status: 'Active' },
    { categoryID: 3, categoryName: 'Household', description: 'Cleaning & home', status: 'Active' },
    { categoryID: 4, categoryName: 'Snacks', description: 'Food & treats', status: 'Active' },
  ];
  const brands = [
    { brandID: 1, brandName: 'TechMax', country: 'Japan', description: 'Premium electronics', status: 'Active' },
    { brandID: 2, brandName: 'NaturePure', country: 'Pakistan', description: 'Organic products', status: 'Active' },
    { brandID: 3, brandName: 'CleanCo', country: 'USA', description: 'Household cleaning', status: 'Active' },
    { brandID: 4, brandName: 'FitFuel', country: 'UK', description: 'Health & nutrition', status: 'Active' },
    { brandID: 5, brandName: 'SoundWave', country: 'Korea', description: 'Audio', status: 'Active' },
    { brandID: 6, brandName: 'FizzDrink', country: 'Pakistan', description: 'Soft drinks', status: 'Active' },
  ];
  const img = (id) => `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=400`;
  const p = (productID, productName, categoryID, brandID, costPrice, sellingPrice, stockQuantity, photo) => ({
    productID, productName, categoryID, brandID, costPrice, sellingPrice, stockQuantity,
    barcode: String(8901234567890 + productID), productImage: img(photo),
  });
  const products = [
    p(1, 'Wireless Earbuds Pro', 1, 1, 2500, 4999, 145, 10885667),
    p(2, 'Organic Green Tea', 2, 2, 300, 799, 320, 9228963),
    p(3, 'Premium Hand Soap', 3, 3, 200, 549, 89, 10566507),
    p(4, 'Protein Bar Pack', 4, 4, 800, 1499, 210, 1616036),
    p(5, 'Smart Watch Band', 1, 1, 1200, 2499, 67, 5208774),
    p(6, 'Cola Classic 6-Pack', 2, 6, 400, 899, 450, 4113654),
    p(7, 'All-Purpose Cleaner', 3, 3, 300, 699, 12, 5217889),
    p(8, 'Bluetooth Speaker', 1, 5, 3000, 5999, 0, 14309807),
  ];
  const suppliers = [
    { supplierID: 1, supplierName: 'GlobalTech', contactPerson: 'Li Wei', phone: '+92-321-555-0101', email: 'orders@globaltech.example', balance: 250000, status: 'Active' },
    { supplierID: 2, supplierName: 'FreshFoods Inc', contactPerson: 'Sara Malik', phone: '+92-300-555-0202', email: 'sales@freshfoods.example', balance: 0, status: 'Active' },
    { supplierID: 3, supplierName: 'CleanSupply Co', contactPerson: 'John Smith', phone: '+1-555-0303', email: 'john@cleansupply.example', balance: 42000, status: 'Active' },
  ];
  const salespersons = [
    { salespersonID: 1, name: 'Ahmed Khan', email: 'ahmed@store.example', status: 'Active', sales: 127, performance: 92, revenue: 284500, commission: 14225, commissionRate: 5 },
    { salespersonID: 2, name: 'Fatima Ali', email: 'fatima@store.example', status: 'Active', sales: 98, performance: 85, revenue: 198000, commission: 9900, commissionRate: 5 },
    { salespersonID: 3, name: 'Hassan Raza', email: 'hassan@store.example', status: 'Active', sales: 76, performance: 72, revenue: 156000, commission: 7800, commissionRate: 5 },
  ];
  const day = (n) => new Date(Date.now() - n * 864e5).toISOString().slice(0, 10);
  const sales = [
    { saleID: 1, invoiceNumber: 'INV-2847', customerName: 'Walk-in', salespersonName: 'Ahmed Khan', paymentMethod: 'Cash', status: 'Completed', totalAmount: 10498, saleDate: day(0), items: [{ saleItemID: 1, productID: 1, productName: 'Wireless Earbuds Pro', quantity: 2, priceAtSale: 4999 }] },
    { saleID: 2, invoiceNumber: 'INV-2846', customerName: 'Ali Khan', salespersonName: 'Fatima Ali', paymentMethod: 'Card', status: 'Completed', totalAmount: 8900, saleDate: day(1), items: [] },
    { saleID: 3, invoiceNumber: 'INV-2845', customerName: 'Sara Ahmed', salespersonName: 'Ahmed Khan', paymentMethod: 'Cash', status: 'Completed', totalAmount: 1200, saleDate: day(2), items: [] },
    { saleID: 4, invoiceNumber: 'INV-2844', customerName: 'Walk-in', salespersonName: 'Hassan Raza', paymentMethod: 'Bank', status: 'Refunded', totalAmount: 650, saleDate: day(3), items: [] },
  ];
  const purchaseorders = [
    { purchaseOrderID: 1, poNumber: 'PO-2026-0001', supplierID: 1, supplierName: 'GlobalTech', orderDate: day(5), expectedDelivery: day(-2), status: 'Pending',
      deliveryAddress: 'Main Warehouse, Model Town, Lahore', preparedBy: 'Store Manager', paymentTerms: '30 Days Credit', shippingCharges: 500, taxRate: 18,
      notes: 'Confirm availability before dispatch.', totalAmount: 59590,
      items: [{ purchaseOrderItemID: 1, productID: 1, productName: 'Wireless Earbuds Pro', sku: '8901234567891', quantity: 20, unitPrice: 2500, discount: 0 }] },
    { purchaseOrderID: 2, poNumber: 'PO-2026-0002', supplierID: 2, supplierName: 'FreshFoods Inc', orderDate: day(8), expectedDelivery: day(1), status: 'Approved',
      deliveryAddress: 'Main Warehouse, Model Town, Lahore', preparedBy: 'Store Manager', paymentTerms: '30 Days Credit', shippingCharges: 250, taxRate: 18, notes: '', totalAmount: 85000, items: [] },
  ];
  return { categories, brands, products, suppliers, salespersons, sales, purchaseorders, nextId: 1000 };
}

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* storage blocked: fall back to fresh data */ }
  return seed();
}

let db = load();
function save() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(db)); } catch { /* ignore */ }
}
const newId = () => ++db.nextId;

// "PONumber" -> "poNumber", "SupplierID" -> "supplierID", "SKU" -> "sku"
export function camelKey(key) {
  const m = key.match(/^([A-Z]+)(.*)$/);
  if (!m) return key;
  const [, caps, rest] = m;
  if (!rest) return caps.toLowerCase();
  if (caps.length === 1) return caps.toLowerCase() + rest;
  return caps.slice(0, -1).toLowerCase() + caps.slice(-1) + rest;
}
export function normalize(value) {
  if (Array.isArray(value)) return value.map(normalize);
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [camelKey(k), normalize(v)]));
  }
  return value;
}

const withStatus = (p) => ({ ...p, status: p.stockQuantity <= 0 ? 'Out of Stock' : p.stockQuantity < 20 ? 'Low Stock' : 'In Stock' });
function productView(p) {
  const cat = db.categories.find((c) => c.categoryID === p.categoryID);
  const brand = db.brands.find((b) => b.brandID === p.brandID);
  return withStatus({ ...p, categoryName: cat?.categoryName ?? '', brandName: brand?.brandName ?? '' });
}

const json = (data, status = 200) =>
  new Response(data === undefined ? null : JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } });
const notFound = () => json({ error: 'Not found' }, 404);

function crud(collection, idKey, body, method, id) {
  const list = db[collection];
  if (method === 'GET' && id == null) return json(list);
  if (method === 'POST') {
    const item = { ...normalize(body), [idKey]: newId() };
    item.status = item.status || 'Active';
    list.push(item);
    return json(item, 201);
  }
  const index = list.findIndex((x) => x[idKey] === id);
  if (index === -1) return notFound();
  if (method === 'PUT') {
    list[index] = { ...list[index], ...normalize(body), [idKey]: id };
    return json(list[index]);
  }
  if (method === 'DELETE') {
    list.splice(index, 1);
    return json(undefined, 204);
  }
  return json(list[index]);
}

export function handle(path, method, body, query) {
  const parts = path.split('/').filter(Boolean);
  const num = (s) => (s == null ? null : Number(s));
  let res;

  if (parts[0] === 'products') {
    const id = num(parts[1]);
    if (parts[2] === 'adjust-stock' && method === 'PUT') {
      const p = db.products.find((x) => x.productID === id);
      if (!p) return notFound();
      p.stockQuantity = Number(body.newStockQuantity ?? body.NewStockQuantity ?? p.stockQuantity);
      res = json(productView(p));
    } else if (method === 'GET' && id == null) {
      res = json(db.products.map(productView));
    } else {
      res = crud('products', 'productID', body, method, id);
    }
  } else if (parts[0] === 'lookups' && parts[1] === 'categories') {
    res = crud('categories', 'categoryID', body, method, num(parts[2]));
  } else if (parts[0] === 'lookups' && parts[1] === 'brands') {
    res = crud('brands', 'brandID', body, method, num(parts[2]));
  } else if (parts[0] === 'supplier') {
    res = crud('suppliers', 'supplierID', body, method, num(parts[1]));
  } else if (parts[0] === 'salespersons') {
    const id = num(parts[1] ?? query.get('id'));
    if (method === 'PUT' && id != null) {
      const sp = db.salespersons.find((x) => x.salespersonID === id);
      if (!sp) return notFound();
      const b = normalize(body);
      Object.assign(sp, b, {
        sales: Number(b.sales ?? sp.sales), performance: Number(b.performance ?? sp.performance),
        revenue: Number(b.revenue ?? sp.revenue), commission: Number(b.commission ?? sp.commission),
      });
      res = json(sp);
    } else {
      res = crud('salespersons', 'salespersonID', body, method, id);
    }
  } else if (parts[0] === 'sales') {
    const id = num(parts[1]);
    if (parts[2] === 'refund' && method === 'POST') {
      const sale = db.sales.find((s) => s.saleID === id);
      if (!sale) return notFound();
      sale.status = 'Refunded';
      res = json(sale);
    } else if (method === 'POST') {
      const sale = normalize(body);
      sale.saleID = newId();
      sale.saleDate = String(sale.saleDate || new Date().toISOString()).slice(0, 10);
      sale.items = (sale.items || []).map((it) => ({ ...it, saleItemID: newId() }));
      for (const it of sale.items) {
        const p = db.products.find((x) => x.productID === it.productID);
        if (p) p.stockQuantity = Math.max(0, p.stockQuantity - Number(it.quantity || 0));
      }
      db.sales.unshift(sale);
      res = json(sale, 201);
    } else {
      res = crud('sales', 'saleID', body, method, id);
    }
  } else if (parts[0] === 'purchaseorders') {
    const id = num(parts[1]);
    if (method === 'POST' || method === 'PUT') {
      const po = normalize(body);
      po.items = (po.items || []).map((it) => ({ ...it, purchaseOrderItemID: newId(), sku: it.sku || db.products.find((p) => p.productID === it.productID)?.barcode || '' }));
      if (method === 'POST') {
        po.purchaseOrderID = newId();
        db.purchaseorders.unshift(po);
        res = json(po, 201);
      } else {
        res = crud('purchaseorders', 'purchaseOrderID', po, 'PUT', id);
      }
    } else {
      res = crud('purchaseorders', 'purchaseOrderID', body, method, id);
    }
  } else {
    res = notFound();
  }

  if (method !== 'GET') save();
  return res;
}

export function resetDemo() {
  db = seed();
  save();
}

function showBanner() {
  const bar = document.createElement('div');
  bar.setAttribute('role', 'status');
  bar.style.cssText = 'position:fixed;left:12px;bottom:12px;z-index:9999;display:flex;gap:10px;align-items:center;' +
    'padding:8px 12px;border-radius:999px;background:#14201b;color:#fff;font:500 12px system-ui,sans-serif;box-shadow:0 4px 16px rgba(0,0,0,.25)';
  bar.innerHTML = '<span>Demo mode · sample data, changes stay in your browser</span>';
  const btn = document.createElement('button');
  btn.textContent = 'Reset';
  btn.style.cssText = 'border:0;border-radius:999px;padding:3px 10px;background:#5cc49b;color:#0c1310;font:600 12px system-ui;cursor:pointer';
  btn.onclick = () => { resetDemo(); location.reload(); };
  bar.appendChild(btn);
  document.body.appendChild(bar);
}

export function installMockApi(apiBase) {
  const realFetch = window.fetch.bind(window);
  window.fetch = async (input, init = {}) => {
    const url = typeof input === 'string' ? input : input.url;
    if (!url.startsWith(apiBase)) return realFetch(input, init);
    const parsed = new URL(url, location.href);
    const path = url.slice(apiBase.length).split('?')[0];
    const method = (init.method || 'GET').toUpperCase();
    let body = {};
    try { body = init.body ? JSON.parse(init.body) : {}; } catch { body = {}; }
    await new Promise((r) => setTimeout(r, 120)); // feel like a network call
    return handle(path, method, body, parsed.searchParams);
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', showBanner);
  else showBanner();
}
