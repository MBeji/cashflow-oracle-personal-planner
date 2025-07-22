import React, { useEffect, useState } from 'react';

interface DiagnosticInfo {
  userAgent: string;
  viewport: { width: number; height: number };
  devicePixelRatio: number;
  maxTouchPoints: number;
  isIOS: boolean;
  isChromeIOS: boolean;
  isSafari: boolean;
  isMobile: boolean;
  safeAreaSupport: boolean;
  viewportHeight: string;
  errors: string[];
}

const ChromeIOSDiagnostic: React.FC = () => {
  const [diagnostic, setDiagnostic] = useState<DiagnosticInfo | null>(null);
  const [testResults, setTestResults] = useState<string[]>([]);

  useEffect(() => {
    const runDiagnostic = () => {
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || 
                    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
      
      const isChromeIOS = /CriOS/.test(navigator.userAgent) || 
                          (/Chrome/.test(navigator.userAgent) && isIOS);
      
      const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
      const isMobile = window.innerWidth <= 768;

      // Test safe area support
      const testDiv = document.createElement('div');
      testDiv.style.paddingTop = 'env(safe-area-inset-top)';
      document.body.appendChild(testDiv);
      const safeAreaSupport = getComputedStyle(testDiv).paddingTop !== '0px';
      document.body.removeChild(testDiv);

      const errors: string[] = [];
      
      // Capturer les erreurs JavaScript
      window.addEventListener('error', (e) => {
        errors.push(`JS Error: ${e.message} at ${e.filename}:${e.lineno}`);
      });

      window.addEventListener('unhandledrejection', (e) => {
        errors.push(`Promise Error: ${e.reason}`);
      });

      const info: DiagnosticInfo = {
        userAgent: navigator.userAgent,
        viewport: { width: window.innerWidth, height: window.innerHeight },
        devicePixelRatio: window.devicePixelRatio,
        maxTouchPoints: navigator.maxTouchPoints,
        isIOS,
        isChromeIOS,
        isSafari,
        isMobile,
        safeAreaSupport,
        viewportHeight: getComputedStyle(document.documentElement).getPropertyValue('--vh'),
        errors
      };

      setDiagnostic(info);
    };

    runDiagnostic();

    // Re-test on resize/orientation change
    const handleResize = () => {
      setTimeout(runDiagnostic, 100);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  const runTests = () => {
    const results: string[] = [];

    // Test 1: CSS Loading
    const computedStyle = getComputedStyle(document.body);
    results.push(`✓ CSS Loading: ${computedStyle.fontFamily ? 'OK' : 'FAILED'}`);

    // Test 2: Touch Events
    let touchSupported = false;
    try {
      document.createEvent('TouchEvent');
      touchSupported = true;
    } catch (e) {
      touchSupported = false;
    }
    results.push(`✓ Touch Events: ${touchSupported ? 'OK' : 'FAILED'}`);

    // Test 3: Local Storage
    try {
      localStorage.setItem('test', 'test');
      localStorage.removeItem('test');
      results.push('✓ Local Storage: OK');
    } catch (e) {
      results.push('✗ Local Storage: FAILED');
    }

    // Test 4: Viewport Units
    const testEl = document.createElement('div');
    testEl.style.height = '100vh';
    document.body.appendChild(testEl);
    const vhWorking = testEl.offsetHeight > 0;
    document.body.removeChild(testEl);
    results.push(`✓ Viewport Units: ${vhWorking ? 'OK' : 'FAILED'}`);

    // Test 5: Hardware Acceleration
    const testTransform = document.createElement('div');
    testTransform.style.transform = 'translateZ(0)';
    results.push(`✓ Hardware Acceleration: ${testTransform.style.transform ? 'OK' : 'FAILED'}`);

    setTestResults(results);
  };

  if (!diagnostic) {
    return <div className="p-4">Loading diagnostic...</div>;
  }

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Chrome iOS Diagnostic</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-100 p-4 rounded">
          <h2 className="font-bold mb-2">Device Information</h2>
          <p><strong>User Agent:</strong> {diagnostic.userAgent}</p>
          <p><strong>Viewport:</strong> {diagnostic.viewport.width} x {diagnostic.viewport.height}</p>
          <p><strong>Device Pixel Ratio:</strong> {diagnostic.devicePixelRatio}</p>
          <p><strong>Max Touch Points:</strong> {diagnostic.maxTouchPoints}</p>
        </div>

        <div className="bg-gray-100 p-4 rounded">
          <h2 className="font-bold mb-2">Browser Detection</h2>
          <p><strong>iOS:</strong> {diagnostic.isIOS ? '✅ Yes' : '❌ No'}</p>
          <p><strong>Chrome iOS:</strong> {diagnostic.isChromeIOS ? '✅ Yes' : '❌ No'}</p>
          <p><strong>Safari:</strong> {diagnostic.isSafari ? '✅ Yes' : '❌ No'}</p>
          <p><strong>Mobile:</strong> {diagnostic.isMobile ? '✅ Yes' : '❌ No'}</p>
        </div>

        <div className="bg-gray-100 p-4 rounded">
          <h2 className="font-bold mb-2">CSS Support</h2>
          <p><strong>Safe Area:</strong> {diagnostic.safeAreaSupport ? '✅ Supported' : '❌ Not Supported'}</p>
          <p><strong>Viewport Height:</strong> {diagnostic.viewportHeight || 'Not Set'}</p>
        </div>

        <div className="bg-gray-100 p-4 rounded">
          <h2 className="font-bold mb-2">Errors</h2>
          {diagnostic.errors.length > 0 ? (
            <ul className="text-red-600">
              {diagnostic.errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          ) : (
            <p className="text-green-600">No errors detected</p>
          )}
        </div>
      </div>

      <button 
        onClick={runTests}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
      >
        Run Tests
      </button>

      {testResults.length > 0 && (
        <div className="bg-gray-100 p-4 rounded">
          <h2 className="font-bold mb-2">Test Results</h2>
          <ul>
            {testResults.map((result, index) => (
              <li key={index} className={result.includes('FAILED') ? 'text-red-600' : 'text-green-600'}>
                {result}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-6 bg-yellow-100 p-4 rounded">
        <h2 className="font-bold mb-2">Quick Fixes</h2>
        <p>If you're experiencing issues on Chrome iPhone:</p>
        <ul className="list-disc ml-4 mt-2">
          <li>Try refreshing the page (CMD+R or swipe down)</li>
          <li>Clear browser cache and cookies</li>
          <li>Check if JavaScript is enabled</li>
          <li>Try in Safari for comparison</li>
          <li>Check network connection</li>
        </ul>
      </div>
    </div>
  );
};

export default ChromeIOSDiagnostic;
