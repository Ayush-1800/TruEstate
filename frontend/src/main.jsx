import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { SalesProvider } from './context/SalesContext';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <SalesProvider>
        <App />
      </SalesProvider>
    </BrowserRouter>
  </React.StrictMode>
);
