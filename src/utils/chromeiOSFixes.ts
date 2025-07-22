/**
 * Chrome iOS Fixes
 * Corrections spécifiques pour Chrome sur iOS/iPhone
 * Chrome iOS utilise WebKit mais a des comportements différents de Safari
 */

// Détecter Chrome sur iOS
function isChromeIOS(): boolean {
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || 
                (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const isChrome = /CriOS/.test(navigator.userAgent) || /Chrome/.test(navigator.userAgent);
  
  return isIOS && isChrome;
}

// Fix spécifique pour le viewport Chrome iOS
function fixChromeIOSViewport() {
  if (!isChromeIOS()) return;
  
  // Chrome iOS a parfois des problèmes avec viewport-fit=cover
  const viewport = document.querySelector('meta[name="viewport"]');
  if (viewport) {
    // Fallback viewport pour Chrome iOS
    viewport.setAttribute('content', 
      'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no'
    );
  }
  
  // Forcer le recalcul de la hauteur
  setTimeout(() => {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
    document.documentElement.style.setProperty('--real-vh', `${window.innerHeight}px`);
  }, 100);
}

// Corrections CSS spécifiques Chrome iOS
function applyChromeIOSStyles() {
  if (!isChromeIOS()) return;
  
  const style = document.createElement('style');
  style.id = 'chrome-ios-fixes';
  style.textContent = `
    /* Chrome iOS specific fixes */
    body {
      position: relative !important;
      overflow-x: hidden !important;
      -webkit-text-size-adjust: 100% !important;
      text-size-adjust: 100% !important;
    }
    
    /* Fix pour les éléments fixed sur Chrome iOS */
    .mobile-tabs-bottom {
      position: fixed !important;
      bottom: 0 !important;
      left: 0 !important;
      right: 0 !important;
      z-index: 1000 !important;
      transform: translate3d(0, 0, 0) !important;
      -webkit-transform: translate3d(0, 0, 0) !important;
    }
    
    /* Chrome iOS scrolling improvements */
    .mobile-content {
      overflow-y: auto !important;
      -webkit-overflow-scrolling: touch !important;
      overscroll-behavior: none !important;
      -webkit-overflow-scrolling: touch !important;
    }
    
    /* Input fixes pour Chrome iOS */
    input, select, textarea {
      font-size: 16px !important;
      -webkit-appearance: none !important;
      appearance: none !important;
      border-radius: 0 !important;
      background-color: white !important;
    }
    
    /* Améliorer les boutons tactiles */
    .mobile-button, .mobile-tab-trigger {
      touch-action: manipulation !important;
      -webkit-tap-highlight-color: transparent !important;
      user-select: none !important;
      -webkit-user-select: none !important;
    }
    
    /* Chrome iOS safe area fallback */
    .mobile-safe-area-top {
      padding-top: env(safe-area-inset-top, 20px) !important;
    }
    
    .mobile-safe-area-bottom {
      padding-bottom: env(safe-area-inset-bottom, 20px) !important;
    }
  `;
  
  document.head.appendChild(style);
}

// Fix pour les problèmes de rendering Chrome iOS
function fixChromeIOSRendering() {
  if (!isChromeIOS()) return;
  
  // Forcer le re-render initial
  document.body.style.display = 'none';
  document.body.offsetHeight; // Force reflow
  document.body.style.display = '';
  
  // Hardware acceleration
  document.body.style.transform = 'translateZ(0)';
  (document.body.style as any).webkitTransform = 'translateZ(0)';
}

// Gestionnaire des événements touch pour Chrome iOS
function handleChromeIOSTouchEvents() {
  if (!isChromeIOS()) return;
  
  // Prévenir le double-tap zoom
  let lastTouchEnd = 0;
  document.addEventListener('touchend', function (event) {
    const now = (new Date()).getTime();
    if (now - lastTouchEnd <= 300) {
      event.preventDefault();
    }
    lastTouchEnd = now;
  }, { passive: false });
  
  // Améliorer la réactivité des clics
  document.addEventListener('touchstart', function() {
    // Chrome iOS touch feedback
  }, { passive: true });
}

// Debugging pour Chrome iOS
function debugChromeIOS() {
  if (!isChromeIOS()) return;
  
  console.log('🔍 Chrome iOS detected');
  console.log('User Agent:', navigator.userAgent);
  console.log('Viewport:', window.innerWidth, 'x', window.innerHeight);
  console.log('Device Pixel Ratio:', window.devicePixelRatio);
  console.log('Touch Points:', navigator.maxTouchPoints);
  
  // Log d'erreurs JavaScript
  window.addEventListener('error', function(e) {
    console.error('Chrome iOS Error:', e.error);
  });
  
  // Log des erreurs non gérées
  window.addEventListener('unhandledrejection', function(e) {
    console.error('Chrome iOS Unhandled Promise:', e.reason);
  });
}

// Fonction principale d'initialisation
function initChromeIOSFixes() {
  if (isChromeIOS()) {
    console.log('🚀 Initializing Chrome iOS fixes...');
    
    debugChromeIOS();
    fixChromeIOSViewport();
    applyChromeIOSStyles();
    fixChromeIOSRendering();
    handleChromeIOSTouchEvents();
    
    // Réappliquer après le resize/orientation change
    window.addEventListener('resize', () => {
      setTimeout(fixChromeIOSViewport, 100);
    }, { passive: true });
    
    window.addEventListener('orientationchange', () => {
      setTimeout(() => {
        fixChromeIOSViewport();
        fixChromeIOSRendering();
      }, 200);
    }, { passive: true });
    
    console.log('✅ Chrome iOS fixes applied');
  }
}

// Auto-initialisation
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initChromeIOSFixes);
} else {
  initChromeIOSFixes();
}

export {
  isChromeIOS,
  fixChromeIOSViewport,
  applyChromeIOSStyles,
  fixChromeIOSRendering,
  initChromeIOSFixes
};
