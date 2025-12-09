import React, { useEffect, useState } from 'react';
import api from '../services/api';

export default function Invoices() {
  const [items, setItems] = useState([]);
  useEffect(() => {
    let mounted = true;
    api.getInvoices().then((list) => { if (mounted) setItems(list || []); }).catch(()=>{});
    return () => { mounted = false; };
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Invoices</h1>
      <div className="card overflow-auto">
        {items.length === 0 ? <div className="p-4">No invoices found</div> : (
          <table className="min-w-full table-auto">
            <thead className="bg-gray-50">
              <tr>
                <th className="table-header px-3 py-2">Transaction ID</th>
                <th className="table-header px-3 py-2">Date</th>
                <th className="table-header px-3 py-2">Customer Name</th>
                <th className="table-header px-3 py-2">Quantity</th>
                <th className="table-header px-3 py-2">Final Amount</th>
                <th className="table-header px-3 py-2">Employee</th>
              </tr>
            </thead>
            <tbody>
              {items.map((r, i) => (
                <tr key={i} className={i%2===0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="table-cell">{r.transactionId || r['Transaction ID']}</td>
                  <td className="table-cell">{r.date}</td>
                  <td className="table-cell">{r.customerName || r['Customer Name']}</td>
                  <td className="table-cell">{r.quantity}</td>
                  <td className="table-cell">₹ {Number(r.totalAmount || r['Total Amount'] || 0).toLocaleString()}</td>
                  <td className="table-cell">{r.employeeName || r['Employee Name']}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
