/**
 * Diagnostic avancé pour problèmes iPhone
 * Script qui s'exécute avant tout pour capturer les erreurs
 */

// Capturer toutes les erreurs dès le début
const errors: string[] = [];
const logs: string[] = [];

// Override console pour capturer les logs
const originalConsoleLog = console.log;
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

console.log = (...args) => {
  logs.push(`LOG: ${args.join(' ')}`);
  originalConsoleLog(...args);
};

console.error = (...args) => {
  errors.push(`ERROR: ${args.join(' ')}`);
  originalConsoleError(...args);
};

console.warn = (...args) => {
  logs.push(`WARN: ${args.join(' ')}`);
  originalConsoleWarn(...args);
};

// Capturer les erreurs JavaScript
window.addEventListener('error', (e) => {
  errors.push(`JS Error: ${e.message} at ${e.filename}:${e.lineno}:${e.colno}`);
  console.error('Window Error:', e);
});

// Capturer les erreurs de promesses
window.addEventListener('unhandledrejection', (e) => {
  errors.push(`Promise Error: ${e.reason}`);
  console.error('Unhandled Promise:', e);
});

// Diagnostic du navigateur
function getBrowserInfo() {
  const info = {
    userAgent: navigator.userAgent,
    platform: navigator.platform,
    language: navigator.language,
    cookieEnabled: navigator.cookieEnabled,
    onLine: navigator.onLine,
    maxTouchPoints: navigator.maxTouchPoints,
    vendor: navigator.vendor,
    appVersion: navigator.appVersion,
    
    // Détection spécifique
    isIOS: /iPad|iPhone|iPod/.test(navigator.userAgent),
    isSafari: /^((?!chrome|android).)*safari/i.test(navigator.userAgent),
    isChrome: /Chrome/.test(navigator.userAgent),
    isChromeIOS: /CriOS/.test(navigator.userAgent),
    
    // Viewport
    screenWidth: screen.width,
    screenHeight: screen.height,
    windowWidth: window.innerWidth,
    windowHeight: window.innerHeight,
    devicePixelRatio: window.devicePixelRatio,
    
    // Support des features
    touchEventsSupported: 'ontouchstart' in window,
    pointerEventsSupported: 'onpointerdown' in window,
    localStorageSupported: typeof(Storage) !== "undefined",
    
    // URL info
    currentURL: window.location.href,
    protocol: window.location.protocol,
    host: window.location.host,
    
    // Date/time
    timestamp: new Date().toISOString()
  };
  
  return info;
}

// Tester les imports
function testImports() {
  const importTests: any = {};
    try {
    // Test React - vérifier si React est importé
    importTests.reactAvailable = typeof window !== 'undefined';
    importTests.documentReady = typeof document !== 'undefined';
  } catch (e) {
    importTests.react = false;
    errors.push(`React import failed: ${e}`);
  }
  
  try {
    // Test si le DOM est prêt
    importTests.domReady = document.readyState;
    importTests.rootElement = !!document.getElementById('root');
  } catch (e) {
    importTests.domTest = false;
    errors.push(`DOM test failed: ${e}`);
  }
  
  return importTests;
}

// Diagnostic réseau
function testNetwork() {
  const networkTests: any = {
    online: navigator.onLine,
    connection: (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection
  };
  
  if (networkTests.connection) {
    networkTests.effectiveType = networkTests.connection.effectiveType;
    networkTests.downlink = networkTests.connection.downlink;
    networkTests.rtt = networkTests.connection.rtt;
  }
  
  return networkTests;
}

// Test des CSS
function testCSS() {
  const cssTests: any = {};
  
  try {
    // Créer un élément de test
    const testDiv = document.createElement('div');
    testDiv.style.transform = 'translateZ(0)';
    testDiv.style.touchAction = 'manipulation';
    
    cssTests.transform = !!testDiv.style.transform;
    cssTests.touchAction = !!testDiv.style.touchAction;
    cssTests.safeArea = CSS.supports('padding', 'env(safe-area-inset-top)');
    cssTests.viewport = CSS.supports('height', '100vh');
    cssTests.customProperties = CSS.supports('color', 'var(--test)');
    
  } catch (e) {
    errors.push(`CSS test failed: ${e}`);
    cssTests.error = true;
  }
  
  return cssTests;
}

// Fonction principale de diagnostic
function runCompleteDiagnostic() {
  console.log('🔍 Starting iPhone diagnostic...');
  
  const diagnostic = {
    timestamp: new Date().toISOString(),
    browser: getBrowserInfo(),
    imports: testImports(),
    network: testNetwork(),
    css: testCSS(),
    errors: [...errors],
    logs: [...logs]
  };
  
  console.log('📊 Diagnostic Results:', diagnostic);
  
  // Stocker pour récupération
  try {
    localStorage.setItem('iphone-diagnostic', JSON.stringify(diagnostic));
    console.log('✅ Diagnostic saved to localStorage');
  } catch (e) {
    console.error('❌ Could not save diagnostic:', e);
  }
  
  return diagnostic;
}

// Exposer globalement pour debug
(window as any).runDiagnostic = runCompleteDiagnostic;
(window as any).getDiagnostic = () => {
  try {
    const saved = localStorage.getItem('iphone-diagnostic');
    return saved ? JSON.parse(saved) : null;
  } catch (e) {
    console.error('Could not retrieve diagnostic:', e);
    return null;
  }
};

// Lancer automatiquement
console.log('🚀 iPhone diagnostic script loaded');

// Lancer le diagnostic après un délai
setTimeout(() => {
  runCompleteDiagnostic();
}, 1000);

export { runCompleteDiagnostic, getBrowserInfo };
