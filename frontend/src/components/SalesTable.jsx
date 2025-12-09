import React from 'react';
import { useSales } from '../context/SalesContext';
import dayjs from 'dayjs';

export default function SalesTable() {
  const { data, loading, clearFilters } = useSales();

  if (loading) {
    // simple skeleton rows while loading
    return (
      <div className="card overflow-auto">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-50">
            <tr>
              <th className="table-header px-3 py-2">Transaction ID</th>
              <th className="table-header px-3 py-2">Date</th>
              <th className="table-header px-3 py-2">Customer ID</th>
              <th className="table-header px-3 py-2">Customer Name</th>
              <th className="table-header px-3 py-2">Phone</th>
              <th className="table-header px-3 py-2">Gender</th>
              <th className="table-header px-3 py-2">Age</th>
              <th className="table-header px-3 py-2">Category</th>
              <th className="table-header px-3 py-2">Quantity</th>
              <th className="table-header px-3 py-2">Final Amount</th>
              <th className="table-header px-3 py-2">Region</th>
              <th className="table-header px-3 py-2">Product ID</th>
              <th className="table-header px-3 py-2">Employee</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 6 }).map((_, i) => (
              <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                {Array.from({ length: 13 }).map((__, j) => (
                  <td key={j} className="table-cell"><div className="h-4 bg-gray-200 rounded w-24 animate-pulse" /></td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className="card">
        <div className="flex flex-col items-start gap-3">
          <div>No results found for selected filters.</div>
          <div className="flex items-center gap-2">
            <button onClick={() => clearFilters()} className="px-3 py-1 bg-blue-600 text-white rounded text-sm">Clear filters</button>
            <button onClick={() => window.location.reload()} className="px-3 py-1 border rounded text-sm">Reload</button>
          </div>
        </div>
      </div>
    );
  }

  // Helper to attempt multiple possible field names and common variants
  const getField = (row, candidates) => {
    for (const k of candidates) {
      if (Object.prototype.hasOwnProperty.call(row, k) && row[k] !== undefined && row[k] !== null && row[k] !== '') return row[k];
    }

    // try camelCase / snake_case / lower-case variants
    for (const k of Object.keys(row)) {
      const keyNorm = k.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
      for (const c of candidates) {
        const candNorm = String(c).replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
        if (keyNorm === candNorm) return row[k];
      }
    }

    return '';
  };

  return (
    <div className="card overflow-auto">
      <table className="min-w-full table-auto">
        <thead className="bg-gray-50">
          <tr>
            <th className="table-header px-3 py-2">Transaction ID</th>
            <th className="table-header px-3 py-2">Date</th>
            <th className="table-header px-3 py-2">Customer ID</th>
            <th className="table-header px-3 py-2">Customer Name</th>
            <th className="table-header px-3 py-2">Phone</th>
            <th className="table-header px-3 py-2">Gender</th>
            <th className="table-header px-3 py-2">Age</th>
            <th className="table-header px-3 py-2">Category</th>
            <th className="table-header px-3 py-2">Quantity</th>
            <th className="table-header px-3 py-2">Final Amount</th>
            <th className="table-header px-3 py-2">Region</th>
            <th className="table-header px-3 py-2">Product ID</th>
            <th className="table-header px-3 py-2">Employee</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
              <td className="table-cell">{getField(row, ['Transaction ID', 'TransactionID', 'transaction_id', 'transactionId', 'Transaction'])}</td>
              <td className="table-cell">{formatDate(getField(row, ['Date', 'date', 'Transaction Date', 'transaction_date']))}</td>
              <td className="table-cell">{getField(row, ['Customer ID', 'CustomerID', 'customer_id', 'customerId'])}</td>
              <td className="table-cell">{getField(row, ['Customer Name', 'customer_name', 'customerName', 'Customer'])}</td>
              <td className="table-cell">{getField(row, ['Phone Number', 'Phone', 'phone', 'phone_number'])}</td>
              <td className="table-cell">{getField(row, ['Gender', 'gender'])}</td>
              <td className="table-cell">{getField(row, ['Age', 'age'])}</td>
              <td className="table-cell">{getField(row, ['Category', 'Product Category', 'product_category', 'productCategory'])}</td>
              <td className="table-cell">{getField(row, ['Quantity', 'quantity'])}</td>
              <td className="table-cell">{formatAmount(getField(row, ['Final Amount', 'final_amount', 'Total Amount', 'total_amount', 'totalAmount']))}</td>
              <td className="table-cell">{getField(row, ['Region', 'Customer region', 'Customer Region', 'region', 'customer_region'])}</td>
              <td className="table-cell">{getField(row, ['Product ID', 'ProductID', 'product_id', 'productId'])}</td>
              <td className="table-cell">{getField(row, ['Employee Name', 'employee_name', 'employeeName', 'Employee'])}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function formatDate(value) {
  if (!value) return '';
  const d = dayjs(value);
  return d.isValid() ? d.format('YYYY-MM-DD') : value;
}

function formatAmount(value) {
  if (!value && value !== 0) return '';
  const num = Number(String(value).replace(/[^\d.-]+/g, '')) || 0;
  return `₹ ${num.toLocaleString()}`;
}
