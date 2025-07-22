// Point d'entrée ultra-simple pour diagnostic iPhone
// Enlève tous les scripts de fix et imports complexes

import { createRoot } from 'react-dom/client'
import AppSimple from './AppSimple.tsx'

// Ajout d'un CSS ultra-basique en ligne
const basicCSS = `
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  
  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
    line-height: 1.6;
    color: #333;
    background-color: #fff;
  }
  
  button {
    font-family: inherit;
  }
  
  @media (max-width: 768px) {
    body {
      font-size: 16px; /* Évite le zoom iOS */
    }
    
    button {
      min-height: 44px; /* Taille tactile iOS recommandée */
    }
  }
`;

// Inject CSS basique
const styleElement = document.createElement('style');
styleElement.textContent = basicCSS;
document.head.appendChild(styleElement);

// Ajout de métabalises mobiles de base si elles n'existent pas
if (!document.querySelector('meta[name="viewport"]')) {
  const viewport = document.createElement('meta');
  viewport.name = 'viewport';
  viewport.content = 'width=device-width, initial-scale=1.0, user-scalable=no';
  document.head.appendChild(viewport);
}

// Debug basique
console.log('🧪 Main Simple - Starting...');
console.log('📱 User Agent:', navigator.userAgent);
console.log('🖥️ Viewport:', window.innerWidth, 'x', window.innerHeight);

createRoot(document.getElementById("root")!).render(<AppSimple />);

console.log('✅ Main Simple - App rendered');
