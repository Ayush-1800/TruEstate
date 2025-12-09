// frontend/src/components/SummaryCards.jsx
import React from 'react';
import { useSales } from '../context/SalesContext';

export default function SummaryCards({ customSummary }) {
  // Prefer explicit prop; otherwise read from SalesContext
  const ctx = useSales ? useSales() : null;
  const s = customSummary || (ctx ? ({
    totalItems: ctx.totalItems,
    totalQuantity: ctx.summary?.totalQuantity ?? ctx.summary?.totalQuantity ?? 0,
    totalFinalAmount: ctx.summary?.totalFinalAmount ?? ctx.summary?.totalAmount ?? 0
  }) : {});

  const totalItems = s.totalItems ?? 0;
  const totalQuantity = s.totalQuantity ?? 0;
  const totalFinal = s.totalFinalAmount || s.totalAmount || s.totalFinalAmount || 0;

  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="card p-4">
        <div className="text-sm text-gray-500">Total Records</div>
        <div className="text-2xl font-bold">{totalItems}</div>
      </div>

      <div className="card p-4">
        <div className="text-sm text-gray-500">Total Quantity</div>
        <div className="text-2xl font-bold">{totalQuantity}</div>
      </div>

      <div className="card p-4">
        <div className="text-sm text-gray-500">Total Final Amount</div>
        <div className="text-2xl font-bold">₹ {Number(totalFinal).toLocaleString()}</div>
      </div>
    </div>
  );
}
