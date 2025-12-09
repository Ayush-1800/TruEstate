import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import SalesPage from './pages/SalesPage';
import Products from './pages/Products';
import Stores from './pages/Stores';
import Employees from './pages/Employees';
import Invoices from './pages/Invoices';

export default function App() {
  return (
    <div className="min-h-screen flex">
      <aside className="w-64 sidebar-bg text-white h-screen p-4">
        <Sidebar />
      </aside>

      <main className="flex-1 p-6">
        <Routes>
          <Route path="/" element={<SalesPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/sales" element={<SalesPage />} />
          <Route path="/products" element={<Products />} />
          <Route path="/stores" element={<Stores />} />
          <Route path="/employees" element={<Employees />} />
          <Route path="/invoices" element={<Invoices />} />
          <Route path="/past-invoices" element={<Invoices />} />
        </Routes>
      </main>
    </div>
  );
}
