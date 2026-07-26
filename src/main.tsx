// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { HelmetProvider } from 'react-helmet-async';  // ← AJOUTE CETTE LIGNE

ReactDOM.createRoot(document.getElementById('root')!).render(
  <HelmetProvider>    {/* ← AJOUTE CETTE BALISE OUVRANTE */}
    <App />
  </HelmetProvider>   {/* ← AJOUTE CETTE BALISE FERMANTE */}
);
