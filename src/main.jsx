import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import './i18n'; // Import de la configuration i18n

// Configuration de React Query
import { QueryClient, QueryClientProvider } from 'react-query';
import { DarkModeProvider } from './context/DarkModeContext';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <I18nextProvider i18n={i18n}>
      <QueryClientProvider client={queryClient}>
        <DarkModeProvider>
          <App />
        </DarkModeProvider>
      </QueryClientProvider>
    </I18nextProvider>
  </React.StrictMode>
);