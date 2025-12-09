import React from 'react';
import SearchBar from './SearchBar';
import FilterPanel from './FilterPanel';
import SortDropdown from './SortDropdown';

export default function TopBar() {
  return (
    <div className="bg-white p-4 rounded shadow-sm">
      <div className="flex gap-4 items-center">
        <FilterPanel />
        <div className="flex-1">
          <SearchBar />
        </div>
        <SortDropdown />
      </div>
    </div>
  );
}
