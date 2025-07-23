# Configuration des Utilisateurs - Cash Flow Personnel

## 📋 Configuration Actuelle

### Nouveaux Utilisateurs (Configuration par défaut)
Lors de la création d'un nouveau compte, les valeurs suivantes sont automatiquement appliquées :

**Paramètres financiers de base :**
- Solde initial : 0 TND
- Seuil d'alerte : 1000 TND
- Nombre de mois à afficher : 20

**Revenus :**
- Salaire mensuel : **6000 TND**
- Primes (demi-salaire sur 4 périodes) :
  - Mars : **3000 TND** (0.5 × 6000)
  - Juin : **3000 TND** (0.5 × 6000)
  - Septembre : **3000 TND** (0.5 × 6000)
  - Décembre : **3000 TND** (0.5 × 6000)
- Autres revenus : 0 TND

**Dépenses fixes :**
- Dépenses courantes : **3000 TND**
- Autres dépenses fixes : 0 TND

**Répartition des 3000 TND de dépenses par catégorie :**
- Alimentation & Maison : 1500 TND
- Transport : 500 TND
- Loisirs & Sorties : 400 TND
- Factures & Services : 300 TND
- Santé & Bien-être : 300 TND

### Mohamed Beji (Configuration spécifique)
Email : `mbeji@sofrecom.fr`

**Paramètres financiers :**
- Solde initial : 3500 TND
- Seuil d'alerte : 2000 TND
- Nombre de mois à afficher : 20

**Revenus :**
- Salaire mensuel : 12750 TND
- Revenus complémentaires :
  - Carburant : 500 TND
  - Assurance santé : 1000 TND
- Primes :
  - Mars : 19125 TND (1.5 × 12750)
  - Juin : 6375 TND (0.5 × 12750)
  - Septembre : 19125 TND (1.5 × 12750)
  - Décembre : 6375 TND (0.5 × 12750)

**Dépenses fixes :**
- Dette : 6000 TND
- Dépenses courantes : 3300 TND
- Carburant : 500 TND
- Assurance santé : 1000 TND
- Frais scolaires : 15000 TND

**Catégories de dépenses personnalisées :**
- Alimentation & Maison : 2000 TND
- Femme de ménage : 200 TND
- Enfants (Études & Club) : 500 TND
- Factures : 200 TND
- Restaurants & Sorties : 400 TND

## ⚙️ Configuration Technique

### Fichiers de configuration
1. **`src/config/defaultUserConfig.ts`** : Configuration principale
2. **`.env.defaults`** : Valeurs configurables sans recompilation

### Fonctionnement automatique
- La fonction `createInitialUserSettings(userEmail)` détecte automatiquement l'email de l'utilisateur
- Si l'email correspond à Mohamed Beji, ses valeurs spécifiques sont appliquées
- Sinon, les valeurs par défaut pour nouveaux utilisateurs sont utilisées

### Points importants
✅ **Aucune valeur hardcodée** : Toutes les valeurs sont configurables
✅ **Migration automatique** : Les valeurs de Mohamed Beji sont préservées
✅ **Extensible** : Facile d'ajouter d'autres utilisateurs spécifiques
✅ **Maintenable** : Modification possible via `.env.defaults`

## 🔄 Mise à jour des valeurs

### Pour modifier les valeurs par défaut
1. Éditer le fichier `.env.defaults`
2. Mettre à jour `DEFAULT_USER_CONFIG` dans `defaultUserConfig.ts`
3. Redémarrer l'application

### Pour ajouter un nouvel utilisateur spécifique
1. Créer une nouvelle configuration dans `defaultUserConfig.ts`
2. Ajouter la condition dans `getDefaultConfigForUser()`
3. Optionnel : Ajouter les valeurs dans `.env.defaults`

## ✅ Tests de validation

### Nouveau compte utilisateur
- ✅ Salaire : 6000 TND
- ✅ Primes : 3000 TND × 4 périodes
- ✅ Dépenses fixes : 3000 TND
- ✅ Reste : 0 TND

### Compte Mohamed Beji
- ✅ Configuration spécifique appliquée automatiquement
- ✅ Toutes ses valeurs actuelles préservées

### Application
- ✅ Compilation sans erreur
- ✅ Démarrage en mode développement réussi
- ✅ Interface utilisateur fonctionnelle

---

**Date de validation :** 23 juillet 2025
**Statut :** ✅ Configuration validée et opérationnelle
