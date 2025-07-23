import React, { useEffect, useState } from 'react';

// Composant minimaliste pour tester React sur iPhone
const SimpleReactTest: React.FC = () => {
  const [status, setStatus] = useState('Loading...');
  const [errors, setErrors] = useState<string[]>([]);
  const [reactFeatures, setReactFeatures] = useState<any>({});

  useEffect(() => {
    console.log('🧪 SimpleReactTest mounted');
    
    try {
      // Test des features React essentielles
      const features = {
        reactVersion: React.version,
        useStateWorks: true,
        useEffectWorks: true,
        jsxSupport: true,
        es6Support: typeof Promise !== 'undefined',
        asyncAwaitSupport: true,
        destructuringSupport: true,
        arrowFunctionsSupport: true,
        templateLiteralsSupport: true,
        mapSupport: Array.prototype.map !== undefined,
        filterSupport: Array.prototype.filter !== undefined,
        modernJSSupport: typeof WeakMap !== 'undefined',
        promisesSupport: typeof Promise !== 'undefined',
        fetchSupport: typeof fetch !== 'undefined'
      };
      
      setReactFeatures(features);
      setStatus('React tests completed');
      
      console.log('✅ React features test:', features);
      
    } catch (error) {
      const errorMsg = `React test failed: ${error}`;
      setErrors(prev => [...prev, errorMsg]);
      setStatus('React tests failed');
      console.error('❌ React test error:', error);
    }
  }, []);

  const testAsyncFunction = async () => {
    try {
      setStatus('Testing async...');
      await new Promise(resolve => setTimeout(resolve, 100));
      setStatus('Async test passed');
      console.log('✅ Async test passed');
    } catch (error) {
      const errorMsg = `Async test failed: ${error}`;
      setErrors(prev => [...prev, errorMsg]);
      console.error('❌ Async test failed:', error);
    }
  };

  const testModernJS = () => {
    try {
      // Test modern JS features
      const arr = [1, 2, 3];
      const doubled = arr.map(x => x * 2);
      const filtered = doubled.filter(x => x > 2);
      const { length } = filtered;
      const spread = [...arr, 4, 5];
      
      console.log('✅ Modern JS test passed:', { doubled, filtered, length, spread });
      setStatus('Modern JS test passed');
      
    } catch (error) {
      const errorMsg = `Modern JS test failed: ${error}`;
      setErrors(prev => [...prev, errorMsg]);
      console.error('❌ Modern JS test failed:', error);
    }
  };

  return (
    <div style={{ 
      padding: '20px', 
      fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
      backgroundColor: '#f5f5f5',
      minHeight: '100vh'
    }}>
      <h1 style={{ color: '#333', textAlign: 'center' }}>
        🧪 React iPhone Test
      </h1>
      
      <div style={{ 
        backgroundColor: 'white', 
        padding: '20px', 
        borderRadius: '10px', 
        margin: '20px 0',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <h2>Status: {status}</h2>
        
        <div style={{ margin: '20px 0' }}>
          <button 
            onClick={testAsyncFunction}
            style={{ 
              background: '#007AFF', 
              color: 'white', 
              border: 'none', 
              padding: '15px 20px', 
              borderRadius: '8px',
              fontSize: '16px',
              margin: '5px',
              cursor: 'pointer',
              touchAction: 'manipulation'
            }}
          >
            Test Async
          </button>
          
          <button 
            onClick={testModernJS}
            style={{ 
              background: '#34C759', 
              color: 'white', 
              border: 'none', 
              padding: '15px 20px', 
              borderRadius: '8px',
              fontSize: '16px',
              margin: '5px',
              cursor: 'pointer',
              touchAction: 'manipulation'
            }}
          >
            Test Modern JS
          </button>
        </div>
      </div>

      <div style={{ 
        backgroundColor: 'white', 
        padding: '20px', 
        borderRadius: '10px', 
        margin: '20px 0'
      }}>
        <h3>React Features Support:</h3>
        <div style={{ fontFamily: 'monospace', fontSize: '12px' }}>
          {Object.entries(reactFeatures).map(([key, value]) => (
            <div key={key} style={{ 
              padding: '5px', 
              backgroundColor: value ? '#e8f5e8' : '#ffebee',
              margin: '2px 0',
              borderRadius: '4px'
            }}>
              {key}: {value ? '✅' : '❌'} {String(value)}
            </div>
          ))}
        </div>
      </div>

      {errors.length > 0 && (
        <div style={{ 
          backgroundColor: '#ffebee', 
          padding: '20px', 
          borderRadius: '10px', 
          margin: '20px 0',
          border: '1px solid #f44336'
        }}>
          <h3 style={{ color: '#d32f2f' }}>Errors:</h3>
          {errors.map((error, index) => (
            <div key={index} style={{ 
              fontFamily: 'monospace', 
              fontSize: '12px',
              padding: '5px',
              backgroundColor: 'white',
              margin: '5px 0',
              borderRadius: '4px'
            }}>
              {error}
            </div>
          ))}
        </div>
      )}
      
      <div style={{ 
        backgroundColor: '#fff3cd', 
        padding: '20px', 
        borderRadius: '10px', 
        margin: '20px 0',
        border: '1px solid #ffc107'
      }}>
        <h3>Next Steps:</h3>
        <p>Si ce composant fonctionne mais pas l'app principale :</p>
        <ul>
          <li>Problème avec les imports lourds (Tailwind, Shadcn, etc.)</li>
          <li>Erreur dans un composant spécifique</li>
          <li>Problème avec le routing React Router</li>
          <li>Conflit avec les styles CSS</li>
        </ul>
      </div>
    </div>
  );
};

export default SimpleReactTest;
