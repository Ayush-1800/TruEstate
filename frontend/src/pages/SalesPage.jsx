import React from 'react';
import TopBar from '../components/TopBar';
import SummaryCards from '../components/SummaryCards';
import SalesTable from '../components/SalesTable';
import Pagination from '../components/Pagination';

export default function SalesPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Sales</h1>
      <TopBar />
      <div className="mt-6">
        <SummaryCards />
      </div>
      <div className="mt-6">
        <SalesTable />
      </div>
      <div className="mt-4">
        <Pagination />
      </div>
    </div>
  );
}
