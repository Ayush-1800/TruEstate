import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import api from '../services/api';
import debounce from '../utils/debounce';

const SalesContext = createContext();

export function SalesProvider({ children }) {
  const [searchValue, setSearchValue] = useState('');
  const [filters, setFilters] = useState({
    region: [],
    gender: [],
    category: [],
    // removed tags/payment — not used in UI
    age_min: '',
    age_max: '',
    date_from: null,
    date_to: null
  });
  const [sort, setSort] = useState('date_desc');
  const [page, setPage] = useState(1);

  const [data, setData] = useState([]);
  const [summary, setSummary] = useState({ totalQuantity: 0, totalFinalAmount: 0 });
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const buildQuery = () => {
    const q = {};
    if (searchValue) q.search = searchValue;
    if (filters.region.length) q.region = filters.region.join(',');
    if (filters.gender.length) q.gender = filters.gender.join(',');
    if (filters.category.length) q.category = filters.category.join(',');
    // tags/payment removed from UI — not included in query
    if (filters.age_min) q.age_min = filters.age_min;
    if (filters.age_max) q.age_max = filters.age_max;
    if (filters.date_from) q.date_from = filters.date_from;
    if (filters.date_to) q.date_to = filters.date_to;
    if (sort) q.sort = sort;
    if (page) q.page = page;
    return q;
  };

  const fetchData = useCallback(async (signal) => {
    setLoading(true);
    setError(null);
    try {
      const query = buildQuery();
      const res = await api.get('/api/sales', { params: query, signal });
      setData(res.data.data || []);
      setTotalItems(res.data.totalItems || 0);
      setTotalPages(res.data.totalPages || 1);
      setSummary(res.data.summary || { totalQuantity: 0, totalFinalAmount: 0 });
      setLoading(false);
    } catch (err) {
      if (err.name === 'CanceledError' || err.name === 'AbortError') return;
      setError(err.response?.data?.error || err.message || 'Failed to fetch');
      setLoading(false);
    }
  }, [searchValue, filters, sort, page]);

  // Debounce fetchData for search
  useEffect(() => {
    const controller = new AbortController();
    const debounced = debounce(() => fetchData(controller.signal), 300);
    debounced();
    return () => controller.abort();
  }, [fetchData, searchValue, filters, sort, page]);

  // Helpers to update state
  const updateFilters = (patch) => {
    setFilters((prev) => ({ ...prev, ...patch }));
    setPage(1);
  };

  const clearFilters = () => {
    setFilters({
      region: [],
      gender: [],
      category: [],
      age_min: '',
      age_max: '',
      date_from: null,
      date_to: null
    });
    setPage(1);
  };

  return (
    <SalesContext.Provider
      value={{
        searchValue,
        setSearchValue,
        filters,
        updateFilters,
        clearFilters,
        sort,
        setSort,
        page,
        setPage,
        data,
        summary,
        totalItems,
        totalPages,
        loading,
        error
      }}
    >
      {children}
    </SalesContext.Provider>
  );
}

export const useSales = () => useContext(SalesContext);
