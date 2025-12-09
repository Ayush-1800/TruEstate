import React from 'react';
import { useSales } from '../context/SalesContext';

const options = [
  { value: 'date_desc', label: 'Date (Newest)' },
  { value: 'date_asc', label: 'Date (Oldest)' },
  { value: 'quantity_desc', label: 'Quantity (High → Low)' },
  { value: 'quantity_asc', label: 'Quantity (Low → High)' },
  { value: 'customer_asc', label: 'Customer (A → Z)' }
];

export default function SortDropdown() {
  const { sort, setSort } = useSales();

  return (
    <div>
      <label className="text-xs text-gray-500 block">Sort</label>
      <select
        value={sort}
        onChange={(e) => setSort(e.target.value)}
        className="border rounded px-3 py-2"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}
