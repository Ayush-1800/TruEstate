// frontend/src/pages/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import api from '../services/api';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, LineChart, Line
} from 'recharts';
import SummaryCards from '../components/SummaryCards';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28CF0'];

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    api.getSummary()
      .then((data) => {
        if (!mounted) return;
        setSummary(data);
      })
      .catch((e) => setErr(e.message || String(e)))
      .finally(() => setLoading(false));
    return () => { mounted = false; };
  }, []);

  if (loading) return <div className="p-6">Loading dashboard...</div>;
  if (err) return <div className="p-6 text-red-600">Error: {err}</div>;

  const { salesByRegion = [], salesByCategory = [], salesByPayment = [], timeseries = [], totalAmount = 0, totalQuantity = 0 } = summary || {};

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Sales Management System</h1>

      <div className="mb-6"><SummaryCards customSummary={{ totalQuantity, totalFinalAmount: totalAmount, totalItems: summary?.totalRecords }} /></div>

      <div className="grid grid-cols-3 gap-4">
        <div className="card p-4">
          <h3 className="font-medium mb-2">Sales by Region</h3>
          <div style={{ width: '100%', height: 240 }}>
            <ResponsiveContainer>
              <BarChart data={salesByRegion}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="region" />
                <YAxis />
                <Tooltip formatter={(v)=>Number(v).toLocaleString()} />
                <Bar dataKey="amount" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card p-4">
          <h3 className="font-medium mb-2">Sales by Category</h3>
          <div style={{ width: '100%', height: 240 }}>
            <ResponsiveContainer>
              <BarChart data={salesByCategory}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip formatter={(v)=>Number(v).toLocaleString()} />
                <Bar dataKey="amount" fill="#00C49F" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card p-4">
          <h3 className="font-medium mb-2">Payment Method Share</h3>
          <div style={{ width: '100%', height: 240 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie data={salesByPayment} dataKey="amount" nameKey="payment" cx="50%" cy="50%" outerRadius={80} label>
                  {salesByPayment.map((entry, index) => <Cell key={entry.payment || index} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(v)=>Number(v).toLocaleString()} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card p-4 col-span-3">
          <h3 className="font-medium mb-2">Quantity / Amount Over Time</h3>
          <div style={{ width: '100%', height: 320 }}>
            <ResponsiveContainer>
              <LineChart data={timeseries}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(v)=>Number(v).toLocaleString()} />
                <Line type="monotone" dataKey="amount" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
