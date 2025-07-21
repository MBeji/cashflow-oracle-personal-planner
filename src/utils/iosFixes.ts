/**
 * iOS Mobile Fixes
 * Corrections spécifiques pour iOS Safari et iPhone
 */

// Fix pour la hauteur de viewport sur iOS Safari
// Problème : 100vh inclut les barres d'adresse sur iOS
function fixIOSViewportHeight() {
  // Calculer la vraie hauteur de viewport
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
}

// Fix pour les éléments fixed qui ne fonctionnent pas correctement sur iOS
function fixIOSFixedElements() {
  const fixedElements = document.querySelectorAll('.mobile-tabs-bottom') as NodeListOf<HTMLElement>;
  fixedElements.forEach(element => {
    // Forcer le reflow pour iOS
    element.style.transform = 'translateZ(0)';
    (element.style as any).webkitTransform = 'translateZ(0)';
  });
}

// Prévenir le zoom automatique sur focus des inputs
function preventIOSZoom() {
  const inputs = document.querySelectorAll('input, select, textarea') as NodeListOf<HTMLElement>;
  inputs.forEach(input => {
    // Forcer une taille de police de 16px minimum
    if (window.innerWidth <= 768) {
      input.style.fontSize = '16px';
      // Éviter le highlight bleu sur tap
      (input.style as any).webkitTapHighlightColor = 'transparent';
    }
  });
}

// Améliorer les performances de scroll sur iOS
function optimizeIOSScrolling() {
  // Activer le momentum scrolling
  (document.body.style as any).webkitOverflowScrolling = 'touch';
  
  // Éviter le bounce scroll sur iOS
  document.body.style.overscrollBehaviorY = 'none';
  
  // Optimiser les conteneurs scrollables
  const scrollContainers = document.querySelectorAll('.mobile-content, .mobile-table-scroll') as NodeListOf<HTMLElement>;
  scrollContainers.forEach(container => {
    (container.style as any).webkitOverflowScrolling = 'touch';
    container.style.overscrollBehaviorY = 'none';
  });
}

// Gestionnaire d'événements pour les gestes tactiles iOS
function handleIOSTouchEvents() {
  // Améliorer la réactivité des boutons
  const buttons = document.querySelectorAll('.mobile-button, .mobile-tab-trigger') as NodeListOf<HTMLElement>;
  buttons.forEach(button => {
    // Feedback tactile immédiat
    button.addEventListener('touchstart', function() {
      this.style.opacity = '0.7';
    }, { passive: true });
    
    button.addEventListener('touchend', function() {
      this.style.opacity = '1';
    }, { passive: true });
    
    button.addEventListener('touchcancel', function() {
      this.style.opacity = '1';
    }, { passive: true });
  });
}

// Fix pour le défilement horizontal non désiré sur iOS
function preventIOSHorizontalScroll() {
  document.documentElement.style.overflowX = 'hidden';
  document.body.style.overflowX = 'hidden';
}

// Détection iOS et application des corrections
function detectAndFixIOS() {
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || 
                (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  
  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  
  if (isIOS || isSafari || window.innerWidth <= 768) {
    console.log('🍎 iOS/Mobile detected - Applying mobile fixes');
    
    // Appliquer toutes les corrections
    fixIOSViewportHeight();
    fixIOSFixedElements();
    preventIOSZoom();
    optimizeIOSScrolling();
    handleIOSTouchEvents();
    preventIOSHorizontalScroll();
    
    // Recalculer au redimensionnement
    window.addEventListener('resize', () => {
      fixIOSViewportHeight();
      fixIOSFixedElements();
    }, { passive: true });
    
    // Recalculer à l'orientation change
    window.addEventListener('orientationchange', () => {
      setTimeout(() => {
        fixIOSViewportHeight();
        fixIOSFixedElements();
      }, 100);
    }, { passive: true });
  }
}

// Initialisation au chargement du DOM
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', detectAndFixIOS);
} else {
  detectAndFixIOS();
}

// Réappliquer les fixes quand le contenu change (pour les SPAs)
const observer = new MutationObserver(() => {
  preventIOSZoom();
  handleIOSTouchEvents();
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});

// Export pour utilisation dans React
export {
  fixIOSViewportHeight,
  fixIOSFixedElements,
  preventIOSZoom,
  optimizeIOSScrolling,
  detectAndFixIOS
};
