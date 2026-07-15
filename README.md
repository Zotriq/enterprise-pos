# EnterprisePOS — Frontend

A modern Point-of-Sale and Inventory Management system for small-to-medium retail businesses. This is the **frontend** — built with **React** and **Tailwind CSS**, connecting to a separate backend API.

## Screenshots

![Dashboard](./docs/screen<img width="1366" height="605" alt="salesperson" src="https://github.com/user-attachments/assets/313eaf73-2ad6-4deb-b3f5-67969deaa11c" />
<img width="1366" height="611" alt="cat" src="https://github.com/user-attachments/assets/fe54892c-3382-463f-8023-364173606e74" />
<img width="1366" height="612" alt="products" src="https://github.com/user-attachments/assets/d1194cbe-d37f-4b9c-8bdb-e2f832fb5767" />
<img width="1366" height="607" alt="grn" src="https://github.com/user-attachments/assets/cfc7494b-9a3f-4646-b08e-30f12b833122" />
<img width="1359" height="602" alt="po" src="https://github.com/user-attachments/assets/63c320e3-3c31-49fd-b4a2-179fc71cfc45" />
<img width="1366" height="603" alt="sales" src="https://github.com/user-attachments/assets/54ea21c1-3a80-4fb5-acf5-a81228ca138d" />
<img width="1365" height="607" alt="pos" src="https://github.com/user-attachments/assets/8e48db04-e490-439b-ad63-a0b4d4c2bc1c" />
<img width="1366" height="603" alt="dashboard" src="https://github.com/user-attachments/assets/270b37a1-0a74-4336-bc9c-7e8c86a935d3" />



## Features

### Dashboard
At-a-glance business snapshot: today's sales and revenue, monthly revenue trend, pending purchase orders, pending sales orders, pending GRNs, current inventory value, low-stock/out-of-stock counts, total products, suppliers, and salespersons.

### POS (Point of Sale)
The core selling screen for ringing up transactions in real time. Search products by name or barcode, filter by category, optionally attach a customer and salesperson to the sale. Live cart with per-item quantity controls and automatic subtotal/tax/total calculation. Supports Cash, Card, Bank, and QR payments, plus the ability to hold a cart mid-sale and reload it later.

### Sales
Running log of every completed transaction (invoice history), showing invoice number, customer, salesperson, payment method, status (Completed/Refunded), amount, and timestamp. View, print, or refund any past sale.

### Sales Orders
Tracks customer orders that aren't fulfilled instantly at the counter, moving through a pipeline: Pending → Processing → Shipped. Orders can be edited or deleted as they progress.

### Purchase Orders
Orders placed with suppliers to restock inventory. Tracks supplier, order date, expected delivery date, amount, and status.

### GRN (Goods Receipt Notes)
Records what actually arrived against a Purchase Order, linking back to the PO and supplier, logging items received, and marking status as Completed or Partial — keeping inventory numbers accurate.

### Products
The master catalog of everything sold or stocked — image, barcode, name, category, brand, cost price, selling price, current stock, and status (e.g. Low stock). This is the source of truth the POS search pulls from.

### Categories
Groups products (e.g. Electronics, Food) for filtering in the POS and Products screens, with a description and product count per category.

### Brands
Tracks the brand/manufacturer of each product, useful for filtering, reporting, and supplier negotiation.

### Inventory
Real-time stock levels across all products, flagging low-stock and out-of-stock items before you run out.

### Stock Movement
Audit trail of every inventory change — stock increases (from GRNs) and decreases (from sales) — for spotting discrepancies or shrinkage.

### Suppliers
Vendor directory with contact info, outstanding balance, and active/inactive status. Referenced when creating Purchase Orders.

### Salespersons
Staff who can be attributed to a sale, used in both the POS and in Sales reporting.

### Reports
Business reporting module for revenue trends, best-selling products, and sales by staff.

### Settings
App-level configuration — business details, tax rate, currency, and account preferences.

## Tech Stack

- React
- Tailwind CSS
- Vite

## Getting Started

```bash
# Clone the repo
git clone https://github.com/Zotriq/enterprise-pos.git
cd enterprisepos-frontend

# Install dependencies
npm install

# Start the dev server
npm run dev
```

The app runs at `http://localhost:5173`.

Make sure the [backend](#) is running too, and point the frontend to it in your `.env` file:

VITE_API_BASE_URL=http://localhost:5000

Built by **[Zohaib Tariq]**
