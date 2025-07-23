import React, { useState, useEffect } from 'react';

// Diagnostic par étapes pour identifier le problème spécifique de l'app principale
// Test imports un par un pour trouver celui qui bloque sur iPhone

interface DiagnosticStep {
  id: string;
  name: string;
  description: string;
  test: () => Promise<boolean>;
}

const IndexDiagnostic = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [results, setResults] = useState<Array<{step: string, success: boolean, error?: string}>>([]);
  const [isRunning, setIsRunning] = useState(false);
  
  const diagnosticSteps: DiagnosticStep[] = [
    {
      id: 'react-hooks',
      name: 'React Hooks de base',
      description: 'Test useState, useEffect, useMemo',
      test: async () => {
        const { useState, useEffect, useMemo } = await import('react');
        const testState = useState(0);
        return testState[0] === 0;
      }
    },
    {
      id: 'lucide-icons',
      name: 'Icônes Lucide',
      description: 'Import des icônes Lucide React',
      test: async () => {
        const { Calculator, TrendingUp, Settings, LayoutGrid, List, Bug } = await import('lucide-react');
        return !!Calculator && !!TrendingUp;
      }
    },
    {
      id: 'shadcn-ui-tabs',
      name: 'ShadCN UI - Tabs',
      description: 'Composant Tabs de shadcn/ui',
      test: async () => {
        const { Tabs, TabsContent, TabsList, TabsTrigger } = await import('@/components/ui/tabs');
        return !!Tabs;
      }
    },
    {
      id: 'shadcn-ui-button',
      name: 'ShadCN UI - Button',
      description: 'Composant Button de shadcn/ui',
      test: async () => {
        const { Button } = await import('@/components/ui/button');
        return !!Button;
      }
    },
    {
      id: 'custom-utils',
      name: 'Utilitaires personnalisés',
      description: 'lib/utils et fonctions utilitaires',
      test: async () => {
        const { cn } = await import('@/lib/utils');
        return !!cn;
      }
    },
    {
      id: 'mobile-hooks',
      name: 'Hooks mobiles',
      description: 'useMobileDetection hook',
      test: async () => {
        const { useMobileDetection } = await import('@/hooks/useMobile');
        return !!useMobileDetection;
      }
    },
    {
      id: 'ios-fixes',
      name: 'Scripts iOS',
      description: 'Scripts de correction iOS',
      test: async () => {
        const { detectAndFixIOS } = await import('@/utils/iosFixes');
        return !!detectAndFixIOS;
      }
    },
    {
      id: 'storage-service',
      name: 'Service de stockage',
      description: 'StorageService pour localStorage',
      test: async () => {
        const { StorageService } = await import('@/utils/storage');
        return !!StorageService;
      }
    },
    {
      id: 'cashflow-utils',
      name: 'Utilitaires cashflow',
      description: 'Fonctions de calcul cashflow',
      test: async () => {
        const { calculateMonthlyData } = await import('@/utils/cashflow');
        return !!calculateMonthlyData;
      }
    },
    {
      id: 'main-components',
      name: 'Composants principaux',
      description: 'MonthlyForecast, Statistics, etc.',
      test: async () => {
        const { MonthlyForecast } = await import('@/components/MonthlyForecast');
        const { Statistics } = await import('@/components/Statistics');
        return !!MonthlyForecast && !!Statistics;
      }
    }
  ];
  
  const runDiagnostic = async () => {
    setIsRunning(true);
    setResults([]);
    
    for (let i = 0; i < diagnosticSteps.length; i++) {
      setCurrentStep(i);
      const step = diagnosticSteps[i];
      
      try {
        console.log(`🧪 Testing: ${step.name}`);
        const success = await step.test();
        setResults(prev => [...prev, { step: step.name, success }]);
        console.log(`${success ? '✅' : '❌'} ${step.name}: ${success ? 'OK' : 'FAILED'}`);
        
        // Si un test échoue, on s'arrête
        if (!success) {
          console.log(`❌ Diagnostic stopped at: ${step.name}`);
          break;
        }
        
        // Petite pause pour voir le progress
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        console.error(`❌ Error in ${step.name}:`, error);
        setResults(prev => [...prev, { 
          step: step.name, 
          success: false, 
          error: error instanceof Error ? error.message : String(error) 
        }]);
        break;
      }
    }
    
    setIsRunning(false);
    setCurrentStep(-1);
  };
  
  useEffect(() => {
    console.log('📱 IndexDiagnostic mounted');
  }, []);
  
  return (
    <div style={{
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f8f9fa',
      minHeight: '100vh'
    }}>
      <h1 style={{ color: '#333', fontSize: '24px', marginBottom: '20px' }}>
        🔍 Diagnostic App Principale
      </h1>
      
      <div style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '20px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ color: '#666', fontSize: '18px', marginBottom: '15px' }}>
          Test des Imports par Étapes
        </h2>
        
        <p style={{ marginBottom: '20px' }}>
          Ce diagnostic teste chaque import de l'app principale pour identifier celui qui pose problème sur iPhone.
        </p>
        
        <button
          onClick={runDiagnostic}
          disabled={isRunning}
          style={{
            padding: '12px 24px',
            fontSize: '16px',
            backgroundColor: isRunning ? '#6c757d' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: isRunning ? 'not-allowed' : 'pointer',
            marginBottom: '20px'
          }}
        >
          {isRunning ? '🔄 Test en cours...' : '🚀 Lancer le Diagnostic'}
        </button>
        
        {isRunning && (
          <div style={{
            backgroundColor: '#e3f2fd',
            padding: '15px',
            borderRadius: '6px',
            marginBottom: '20px'
          }}>
            <strong>Étape actuelle:</strong> {diagnosticSteps[currentStep]?.name || 'Terminé'}
            <br />
            <small>{diagnosticSteps[currentStep]?.description || ''}</small>
          </div>
        )}
      </div>
      
      {results.length > 0 && (
        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          marginBottom: '20px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ color: '#333', fontSize: '18px', marginBottom: '15px' }}>
            📊 Résultats
          </h3>
          
          {results.map((result, index) => (
            <div
              key={index}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '10px',
                marginBottom: '8px',
                backgroundColor: result.success ? '#d4edda' : '#f8d7da',
                border: `1px solid ${result.success ? '#c3e6cb' : '#f5c6cb'}`,
                borderRadius: '4px'
              }}
            >
              <span style={{ 
                fontSize: '20px', 
                marginRight: '10px' 
              }}>
                {result.success ? '✅' : '❌'}
              </span>
              <div style={{ flex: 1 }}>
                <strong>{result.step}</strong>
                {result.error && (
                  <div style={{ 
                    fontSize: '14px', 
                    color: '#721c24',
                    marginTop: '5px',
                    fontFamily: 'monospace'
                  }}>
                    {result.error}
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {!isRunning && results.length > 0 && (
            <div style={{
              marginTop: '20px',
              padding: '15px',
              backgroundColor: '#fff3cd',
              border: '1px solid #ffeaa7',
              borderRadius: '6px'
            }}>
              <h4 style={{ margin: '0 0 10px 0', color: '#856404' }}>
                🎯 Conclusion
              </h4>
              
              {results.every(r => r.success) ? (
                <p style={{ color: '#155724' }}>
                  ✅ Tous les imports fonctionnent ! Le problème pourrait être dans l'interaction entre les composants ou dans le rendu final.
                </p>
              ) : (
                <div>
                  <p style={{ color: '#721c24', marginBottom: '10px' }}>
                    ❌ Problème identifié dans l'import : <strong>{results.find(r => !r.success)?.step}</strong>
                  </p>
                  <p style={{ fontSize: '14px' }}>
                    Cette étape bloque l'application sur iPhone. Vous pouvez maintenant créer une version simplifiée sans cet import.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
      
      <div style={{
        backgroundColor: '#d1ecf1',
        border: '1px solid #bee5eb',
        padding: '15px',
        borderRadius: '8px'
      }}>
        <h3 style={{ margin: '0 0 10px 0', color: '#0c5460' }}>
          🔗 Navigation
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button
            onClick={() => window.location.href = '/minimal-test'}
            style={{
              padding: '12px',
              fontSize: '16px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            🧪 Test React Minimal
          </button>
          
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
            🏠 Retour à l'App Principale
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
            🔍 Page Debug Générale
          </button>
        </div>
      </div>
    </div>
  );
};

export default IndexDiagnostic;
