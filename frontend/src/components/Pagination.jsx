import React from 'react';
import { useSales } from '../context/SalesContext';

export default function Pagination() {
  const { page, setPage, totalPages } = useSales();
  const pages = [];

  // show up to 5 page numbers around current page
  const start = Math.max(1, page - 2);
  const end = Math.min(totalPages, page + 2);

  for (let i = start; i <= end; i++) pages.push(i);

  const goto = (p) => {
    if (p < 1 || p > totalPages) return;
    setPage(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="flex justify-center items-center gap-2 mt-4">
      <button onClick={() => goto(page - 1)} className="px-3 py-1 border rounded" disabled={page === 1}>
        Prev
      </button>

      {start > 1 && <button onClick={() => goto(1)} className="px-3 py-1 border rounded">1</button>}
      {start > 2 && <span className="px-2">...</span>}

      {pages.map((p) => (
        <button
          key={p}
          onClick={() => goto(p)}
          className={`px-3 py-1 border rounded ${p === page ? 'bg-blue-600 text-white' : ''}`}
        >
          {p}
        </button>
      ))}

      {end < totalPages - 1 && <span className="px-2">...</span>}
      {end < totalPages && <button onClick={() => goto(totalPages)} className="px-3 py-1 border rounded">{totalPages}</button>}

      <button onClick={() => goto(page + 1)} className="px-3 py-1 border rounded" disabled={page === totalPages}>
        Next
      </button>
    </div>
  );
}
