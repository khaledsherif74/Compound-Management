import React from 'react';
import ReactDOM from 'react-dom/client';
import '@/config/i18n';
import '@/styles/globals.css';
import { registerSessionHandler } from '@/api/session';
import { store } from '@/store';
import { applyTheme, getStoredThemePreference } from '@/utils/theme';
import App from './App';

applyTheme(getStoredThemePreference());
registerSessionHandler(store);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
