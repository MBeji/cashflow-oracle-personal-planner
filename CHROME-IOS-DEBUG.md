# Guide de Test Chrome iPhone

## Diagnostic des Problèmes Chrome iPhone

### Étapes de Diagnostic

1. **Vérifier la Console Chrome iOS**
   - Ouvrir Chrome sur iPhone
   - Aller sur votre site
   - Se connecter à un Mac avec Safari > Développement > iPhone
   - Ou utiliser `chrome://inspect` sur un PC Android

2. **Tests de Base**
   ```javascript
   // Dans la console Chrome iPhone
   console.log('User Agent:', navigator.userAgent);
   console.log('Viewport:', window.innerWidth, window.innerHeight);
   console.log('Device Pixel Ratio:', window.devicePixelRatio);
   console.log('Max Touch Points:', navigator.maxTouchPoints);
   ```

3. **Vérifier les Erreurs JavaScript**
   - Ouvrir la console et rechercher les erreurs rouges
   - Vérifier les erreurs de réseau (404, CORS, etc.)
   - Tester les imports de modules

### Problèmes Courants Chrome iPhone

#### 1. Viewport Issues
- Chrome iOS ne supporte pas toujours `viewport-fit=cover`
- Solution : Fallback viewport

#### 2. Import/Module Issues
- Chrome iPhone peut avoir des problèmes avec certains imports ES6
- Solution : Vérifier la compilation TypeScript/Vite

#### 3. CSS Safe Area
- `env(safe-area-inset-*)` peut ne pas fonctionner
- Solution : Fallback avec padding fixe

#### 4. Touch Events
- Comportement différent de Safari
- Solution : Événements passifs et preventDefault

### Tests à Effectuer

1. **Test de Chargement Initial**
   ```
   ✓ La page se charge-t-elle ?
   ✓ Y a-t-il des erreurs dans la console ?
   ✓ Les styles CSS sont-ils appliqués ?
   ```

2. **Test de Responsive**
   ```
   ✓ L'interface s'adapte-t-elle à l'écran ?
   ✓ Les boutons sont-ils assez grands ?
   ✓ Le scroll fonctionne-t-il bien ?
   ```

3. **Test des Interactions**
   ```
   ✓ Les boutons répondent-ils au touch ?
   ✓ Les formulaires fonctionnent-ils ?
   ✓ Le clavier virtuel pose-t-il des problèmes ?
   ```

### Solutions Spécifiques Chrome iPhone

#### Meta Tags Optimisés
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
<meta name="format-detection" content="telephone=no">
<meta name="apple-mobile-web-app-capable" content="yes">
```

#### CSS Fixes
```css
/* Chrome iPhone specific */
body {
  -webkit-text-size-adjust: 100%;
  text-size-adjust: 100%;
  overflow-x: hidden;
}

/* Touch improvements */
* {
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
}
```

#### JavaScript Fixes
```javascript
// Force viewport recalculation
setTimeout(() => {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
}, 100);

// Disable zoom on double tap
let lastTouchEnd = 0;
document.addEventListener('touchend', function (event) {
  const now = (new Date()).getTime();
  if (now - lastTouchEnd <= 300) {
    event.preventDefault();
  }
  lastTouchEnd = now;
}, { passive: false });
```

### Debugging URLs
- Test en local : `http://localhost:5173` ou `http://[IP]:5173`
- Test production : `https://votre-domaine.com`

### Checklist Chrome iPhone
- [ ] Page se charge sans erreur
- [ ] Console JavaScript propre
- [ ] Styles CSS appliqués
- [ ] Interactions tactiles fonctionnelles
- [ ] Scroll fluide
- [ ] Pas de zoom intempestif
- [ ] Formulaires utilisables
- [ ] Navigation mobile intuitive

### Fallbacks d'Urgence
Si le problème persiste, utiliser ces fallbacks :

1. **Désactiver les Safe Areas**
2. **Simplifier le viewport**
3. **Utiliser des polyfills**
4. **Mode de compatibilité**

### Ressources de Debug
- Remote Debugging Chrome iOS
- Safari Web Inspector
- Chrome DevTools Mobile Simulation
- Logs console détaillés
