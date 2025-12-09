import React from 'react';
import { useSales } from '../context/SalesContext';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const sampleOptions = {
  region: ['North', 'South', 'East', 'West'],
  gender: ['Male', 'Female', 'Other'],
  category: ['Clothing', 'Electronics', 'Home', 'Grocery']
};

function MultiSelect({ label, name, options, selected, onChange }) {
  const toggle = (value) => {
    if (selected.includes(value)) {
      onChange(selected.filter((s) => s !== value));
    } else {
      onChange([...selected, value]);
    }
  };
  return (
    <div className="flex items-center gap-2">
      <div className="text-xs text-gray-500">{label}:</div>
      <div className="flex gap-2">
        {options.map((opt) => (
          <button
            type="button"
            key={opt}
            onClick={() => toggle(opt)}
            className={`px-2 py-1 text-xs rounded ${selected.includes(opt) ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function FilterPanel() {
  const { filters, updateFilters, clearFilters } = useSales();

  return (
    <div className="flex flex-col gap-3 w-3/4">
      <div className="flex items-center gap-4 flex-wrap">
        <MultiSelect
          label="Customer Region"
          name="region"
          options={sampleOptions.region}
          selected={filters.region}
          onChange={(value) => updateFilters({ region: value })}
        />

        <MultiSelect
          label="Gender"
          name="gender"
          options={sampleOptions.gender}
          selected={filters.gender}
          onChange={(value) => updateFilters({ gender: value })}
        />

        <div className="flex items-center gap-2">
          <div className="text-xs text-gray-500">Age:</div>
          <input
            type="number"
            placeholder="min"
            value={filters.age_min || ''}
            onChange={(e) => updateFilters({ age_min: e.target.value })}
            className="w-20 border rounded px-2 py-1 text-sm"
          />
          <span className="text-sm text-gray-400">—</span>
          <input
            type="number"
            placeholder="max"
            value={filters.age_max || ''}
            onChange={(e) => updateFilters({ age_max: e.target.value })}
            className="w-20 border rounded px-2 py-1 text-sm"
          />
        </div>

        <MultiSelect
          label="Category"
          name="category"
          options={sampleOptions.category}
          selected={filters.category}
          onChange={(value) => updateFilters({ category: value })}
        />

        {/* Tags and Payment filters removed — not used in UI */}

        <div className="flex items-center gap-2">
          <div className="text-xs text-gray-500">Date:</div>
          <input
            type="date"
            value={filters.date_from || ''}
            onChange={(e) => updateFilters({ date_from: e.target.value })}
            className="border rounded px-2 py-1 text-sm"
          />
          <span className="text-sm text-gray-400">—</span>
          <input
            type="date"
            value={filters.date_to || ''}
            onChange={(e) => updateFilters({ date_to: e.target.value })}
            className="border rounded px-2 py-1 text-sm"
          />
        </div>

        <button
          onClick={() => clearFilters()}
          className="ml-2 text-xs bg-red-50 text-red-600 px-3 py-1 rounded"
        >
          Clear
        </button>
      </div>
    </div>
  );
}
