import React from 'react';

// Composant ultra-minimal pour tester React sur iPhone
// Sans aucun import externe, juste du JSX de base

const MinimalTest = () => {
  return (
    <div style={{
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f0f0f0',
      minHeight: '100vh'
    }}>
      <h1 style={{ color: '#333', fontSize: '24px' }}>
        🧪 Test React Minimal
      </h1>
      
      <div style={{
        backgroundColor: 'white',
        padding: '15px',
        borderRadius: '8px',
        margin: '20px 0',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ color: '#666', fontSize: '18px' }}>
          ✅ React fonctionne !
        </h2>
        <p>
          Ce composant utilise uniquement React de base, sans aucun import externe.
        </p>
        
        <div style={{ marginTop: '20px' }}>
          <strong>Test JavaScript :</strong>
          <div style={{ 
            backgroundColor: '#e8f5e8', 
            padding: '10px', 
            marginTop: '10px',
            borderRadius: '4px'
          }}>
            Date: {new Date().toLocaleString()}
          </div>
        </div>
        
        <div style={{ marginTop: '20px' }}>
          <strong>Test d'état React :</strong>
          <TestCounter />
        </div>
      </div>
      
      <div style={{
        backgroundColor: '#fff3cd',
        border: '1px solid #ffeaa7',
        padding: '15px',
        borderRadius: '8px',
        margin: '20px 0'
      }}>
        <h3 style={{ margin: '0 0 10px 0', color: '#856404' }}>
          📱 Informations Device
        </h3>
        <p style={{ margin: '5px 0' }}>
          <strong>User Agent:</strong><br />
          <code style={{ fontSize: '12px', wordBreak: 'break-all' }}>
            {navigator.userAgent}
          </code>
        </p>
        <p style={{ margin: '5px 0' }}>
          <strong>Viewport:</strong> {window.innerWidth} x {window.innerHeight}
        </p>
        <p style={{ margin: '5px 0' }}>
          <strong>Screen:</strong> {screen.width} x {screen.height}
        </p>
      </div>
      
      <div style={{
        backgroundColor: '#d1ecf1',
        border: '1px solid #bee5eb',
        padding: '15px',
        borderRadius: '8px',
        margin: '20px 0'
      }}>
        <h3 style={{ margin: '0 0 10px 0', color: '#0c5460' }}>
          🔗 Navigation
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button
            onClick={() => window.location.href = '/'}
            style={{
              padding: '12px',
              fontSize: '16px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            🏠 Retour à l'Accueil
          </button>
          
          <button
            onClick={() => window.location.href = '/debug'}
            style={{
              padding: '12px',
              fontSize: '16px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            🔍 Page Debug
          </button>
        </div>
      </div>
    </div>
  );
};

// Composant pour tester les états React
const TestCounter = () => {
  const [count, setCount] = React.useState(0);
  
  return (
    <div style={{
      backgroundColor: '#e8f5e8',
      padding: '10px',
      marginTop: '10px',
      borderRadius: '4px'
    }}>
      <p>Compteur: <strong>{count}</strong></p>
      <button
        onClick={() => setCount(count + 1)}
        style={{
          padding: '8px 16px',
          fontSize: '14px',
          backgroundColor: '#28a745',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          marginRight: '10px'
        }}
      >
        +1
      </button>
      <button
        onClick={() => setCount(0)}
        style={{
          padding: '8px 16px',
          fontSize: '14px',
          backgroundColor: '#dc3545',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Reset
      </button>
    </div>
  );
};

export default MinimalTest;
