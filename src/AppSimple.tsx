import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MinimalTest from "./components/MinimalTest";

// App ultra-simple pour diagnostic iPhone
// Enlève tous les providers complexes (QueryClient, TooltipProvider, Toasters)
// pour voir si le problème vient de là

const AppSimple = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<MinimalTest />} />
      <Route path="/minimal-test" element={<MinimalTest />} />
      <Route path="*" element={
        <div style={{ 
          padding: '20px',
          fontFamily: 'Arial, sans-serif',
          textAlign: 'center',
          backgroundColor: '#f8f9fa',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        }}>
          <h1 style={{ color: '#dc3545', fontSize: '24px' }}>
            ❌ 404 - Page non trouvée
          </h1>
          <p style={{ marginTop: '20px' }}>
            Cette page n'existe pas dans la version simplifiée.
          </p>
          <button
            onClick={() => window.location.href = '/'}
            style={{
              padding: '12px 24px',
              fontSize: '16px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              marginTop: '20px',
              alignSelf: 'center'
            }}
          >
            🏠 Retour à l'Accueil
          </button>
        </div>
      } />
    </Routes>
  </BrowserRouter>
);

export default AppSimple;
