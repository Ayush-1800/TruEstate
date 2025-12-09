// frontend/src/services/api.js
import axios from 'axios';

// axios instance — choose backend from Vite env `VITE_BACKEND_URL` or fallback to '/'
const backendBase = typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_BACKEND_URL
  ? String(import.meta.env.VITE_BACKEND_URL).replace(/\/$/, '')
  : '/';

const api = axios.create({
  baseURL: backendBase,
  timeout: 20000
});

// fallback data used if backend not available
export const dummySummary = {
  totalQuantity: 1234,
  totalAmount: 987654,
  salesByRegion: [
    { region: 'North', amount: 300000 },
    { region: 'South', amount: 250000 },
    { region: 'East', amount: 200000 },
    { region: 'West', amount: 120000 },
  ],
  salesByCategory: [
    { category: 'Clothing', amount: 300000 },
    { category: 'Electronics', amount: 250000 },
    { category: 'Home', amount: 200000 },
  ],
  salesByPayment: [
    { payment: 'Cash', amount: 450000 },
    { payment: 'Card', amount: 300000 },
    { payment: 'UPI', amount: 150000 },
  ],
  timeseries: [
    { date: '2025-12-01', amount: 12000 },
    { date: '2025-12-02', amount: 18000 },
    { date: '2025-12-03', amount: 14000 },
    { date: '2025-12-04', amount: 16000 },
  ],
  totalRecords: 4000
};

// Attach helper methods to the axios instance so callers can use `api.get(...)`
// and `api.getSummary()` interchangeably.
api.getSummary = async () => {
  try {
    const resp = await api.get('/api/summary');
    return resp.data;
  } catch (err) {
    console.warn('API /summary failed, using dummy data', err?.message || err);
    return dummySummary;
  }
};

api.getProducts = async () => {
  try {
    const resp = await api.get('/api/summary/products');
    return resp.data.data || [];
  } catch (err) {
    console.warn('API /summary/products failed', err?.message || err);
    return ['Clothing', 'Electronics', 'Home', 'Grocery'];
  }
};

api.getEmployees = async () => {
  try {
    const resp = await api.get('/api/summary/employees');
    return resp.data.data || [];
  } catch (err) {
    console.warn('API /summary/employees failed', err?.message || err);
    return ['Harsh Aggarwal', 'Neha Yadav', 'Rahul Singh'];
  }
};

api.getStores = async () => {
  try {
    const resp = await api.get('/api/summary/stores');
    return resp.data.data || [];
  } catch (err) {
    console.warn('API /summary/stores failed', err?.message || err);
    return ['North', 'South', 'East', 'West'];
  }
};

api.getInvoices = async () => {
  try {
    const resp = await api.get('/api/summary/invoices');
    return resp.data.data || [];
  } catch (err) {
    console.warn('API /summary/invoices failed', err?.message || err);
    return [];
  }
};

export default api;
