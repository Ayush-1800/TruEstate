import React from 'react';
import { NavLink } from 'react-router-dom';

const items = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/', label: 'Sales' },
  { to: '/products', label: 'Products' },
  { to: '/stores', label: 'Stores' },
  { to: '/employees', label: 'Employees' },
  { to: '/invoices', label: 'Invoices' },
  { to: '/past-invoices', label: 'Past Invoices' }
];

export default function Sidebar() {
  return (
    <div className="text-sm">
      <div className="mb-6 px-2">
        <div className="text-xl font-bold">TruEstate</div>
        <div className="text-xs text-gray-300 mt-1">Sales Portal</div>
      </div>
      <nav className="space-y-1 px-2">
        {items.map((it) => (
          <NavLink
            key={it.to}
            to={it.to}
            className={({ isActive }) =>
              `py-2 px-3 rounded flex items-center gap-3 ${isActive ? 'bg-white/10 text-white' : 'text-gray-200 hover:bg-white/5'}`
            }
            end={it.to === '/'}
          >
            <div className="w-2 h-2 bg-blue-400 rounded-full" />
            <span>{it.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
