import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Configuration de React Query
import { QueryClient, QueryClientProvider } from 'react-query';
import { DarkModeProvider } from './context/DarkModeContext';
import { I18nextProvider } from 'react-i18next';

import { BrowserRouter as Router } from 'react-router-dom';
import { AdminAuthProvider } from './context/AdminAuthContext';
import { HelmetProvider } from 'react-helmet-async';
import './i18n';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <DarkModeProvider>
          <AdminAuthProvider>
            <Router>
              <App />
            </Router>
          </AdminAuthProvider>
        </DarkModeProvider>
      </QueryClientProvider>
    </HelmetProvider>
  </React.StrictMode>
);