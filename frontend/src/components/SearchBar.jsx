import React from 'react';
import { useSales } from '../context/SalesContext';

export default function SearchBar() {
  const { searchValue, setSearchValue } = useSales();

  return (
    <div className="w-full">
      <label className="sr-only">Search</label>
      <div className="relative">
        <input
          type="search"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          placeholder="Search by Customer name or Phone..."
          className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</div>
      </div>
    </div>
  );
}
