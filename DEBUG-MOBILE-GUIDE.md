# Guide Debug Chrome iPhone

## 🔧 Méthodes de Debug

### 1. Debug Via l'Application (Recommandé)
- Aller sur : `http://10.241.200.126:8085/debug`
- Ou cliquer sur l'icône 🐛 dans l'app
- Tests automatiques et informations complètes

### 2. Console Chrome iPhone
1. Connecter iPhone au Mac via USB
2. Ouvrir Safari sur Mac
3. Aller dans : Développement > iPhone > Chrome > Votre page
4. Console JavaScript accessible

### 3. Remote Debugging (PC Windows)
1. Installer Chrome DevTools sur PC
2. Activer debugging USB sur iPhone
3. chrome://inspect sur PC
4. Sélectionner l'appareil iPhone

### 4. Debug Mobile Simplifié
- Ajouter `console.log()` directement dans la page debug
- Affichage en temps réel des erreurs
- Tests touch events intégrés

## 🚨 Debug d'Urgence

### Si l'app ne charge pas du tout :
1. Aller directement sur `/debug` : `http://10.241.200.126:8085/debug`
2. Utiliser le fallback HTML : remplacer `index.html` par `index-chrome-ios.html`
3. Vider le cache Chrome iPhone
4. Tester en mode navigation privée

### Si les Touch Events ne marchent pas :
1. Utiliser le "Touch Events Tester" dans `/debug`
2. Vérifier les logs JavaScript
3. Comparer avec Safari sur le même appareil
4. Désactiver temporairement les extensions Chrome

## 📱 Debug Console Mobile Intégrée

Nous pouvons ajouter une console mobile directement dans l'app pour un debug plus facile !
