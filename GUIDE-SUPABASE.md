# Guide d'intégration Supabase - Cash Flow Oracle Personal Planner

## Vue d'ensemble

L'application intègre maintenant Supabase pour offrir :
- ✅ Authentification sécurisée
- ✅ Synchronisation cloud des données
- ✅ Sauvegarde automatique
- ✅ Accès multi-appareil
- ✅ Migration depuis localStorage

## Configuration Supabase

### 1. Créer un compte Supabase

1. Allez sur [supabase.com](https://supabase.com)
2. Créez un compte gratuit
3. Créez un nouveau projet

### 2. Configuration des variables d'environnement

1. Copiez `.env.example` vers `.env.local` :
   ```bash
   cp .env.example .env.local
   ```

2. Remplissez les variables dans `.env.local` :
   ```env
   VITE_SUPABASE_URL=https://votre-projet.supabase.co
   VITE_SUPABASE_ANON_KEY=votre_clé_publique_ici
   ```

3. Trouvez ces valeurs dans votre projet Supabase :
   - Allez dans **Settings** > **API**
   - Copiez **Project URL** → `VITE_SUPABASE_URL`
   - Copiez **anon public** key → `VITE_SUPABASE_ANON_KEY`

### 3. Configuration de la base de données

1. Dans votre projet Supabase, allez dans **SQL Editor**
2. Exécutez le script SQL fourni dans `supabase-setup.sql`
3. Vérifiez que les tables sont créées dans **Table Editor**

## Utilisation

### Interface de synchronisation

Une nouvelle section "Synchronisation Cloud" est disponible dans l'onglet **Paramètres** :

#### État non configuré
- Affiche les instructions de configuration
- Liens vers la documentation Supabase
- Guide étape par étape

#### État non connecté
- Bouton "Se connecter"
- Modal d'authentification (connexion/inscription)

#### État connecté
- Informations utilisateur
- Boutons de synchronisation :
  - **Sauvegarder** : Upload des données locales vers le cloud
  - **Restaurer** : Download des données cloud vers local
  - **Synchroniser maintenant** : Sync bidirectionnelle
- Statut de la dernière synchronisation
- Bouton de déconnexion

### Authentification

#### Inscription
1. Cliquez sur "Se connecter"
2. Onglet "Inscription"
3. Entrez email et mot de passe (min. 6 caractères)
4. Vérifiez votre email pour confirmer le compte
5. Retournez sur l'onglet "Connexion"

#### Connexion
1. Cliquez sur "Se connecter"
2. Onglet "Connexion"
3. Entrez vos identifiants
4. Synchronisation automatique après connexion

### Synchronisation des données

#### Types de données synchronisées
- **Paramètres utilisateur** : solde, seuils, montants fixes
- **Mois archivés** : historique complet des archivages
- **Planifications de dépenses** : toutes les planifications mensuelles
- **Revenus personnalisés** : revenus récurrents
- **Dépenses personnalisées** : dépenses récurrentes

#### Migration automatique
- Au premier login, les données localStorage sont automatiquement migrées
- Backup automatique des données locales
- Conservation des données locales en cas d'erreur

#### Synchronisation temps réel
- Détection automatique des changements
- Synchronisation en arrière-plan
- Notifications de statut

## Fonctionnalités techniques

### Services intégrés

#### AuthService
```typescript
// Connexion
await AuthService.signIn(email, password)

// Inscription
await AuthService.signUp(email, password)

// Utilisateur actuel
const user = await AuthService.getCurrentUser()

// Déconnexion
await AuthService.signOut()
```

#### DataService
```typescript
// Sauvegarder paramètres
await DataService.saveUserSettings(userId, settings)

// Charger paramètres
const settings = await DataService.getUserSettings(userId)

// Archivage
await DataService.saveArchivedMonth(userId, archive)
const archives = await DataService.getArchivedMonths(userId)

// Planification
await DataService.saveExpensePlanning(userId, planning)
const planning = await DataService.getExpensePlanning(userId)
```

### Gestion d'erreurs

- Vérification automatique de la configuration Supabase
- Messages d'erreur informatifs
- Fallback vers localStorage si Supabase indisponible
- Retry automatique en cas d'échec réseau

### Sécurité

- Authentification par email/mot de passe
- Données chiffrées en transit et au repos
- Row Level Security (RLS) activée
- Clés API publiques sécurisées

## Structure de base de données

### Tables

#### `user_settings`
- Paramètres principaux de l'utilisateur
- Montants fixes et seuils
- Configuration des dépenses
- Une ligne par utilisateur

#### `archived_months`
- Historique des mois archivés
- Données planifiées vs réelles
- Notes et métadonnées
- Plusieurs lignes par utilisateur

#### `expense_plannings`
- Planifications mensuelles de dépenses
- Catégories et montants
- Historique des modifications
- Une ligne par mois/année/utilisateur

### Row Level Security (RLS)

Toutes les tables ont RLS activé :
- Les utilisateurs ne peuvent accéder qu'à leurs propres données
- Isolation automatique par `user_id`
- Prévention des fuites de données

## Débogage

### Logs
- Console du navigateur pour les erreurs client
- Logs Supabase pour les erreurs serveur
- Messages d'erreur détaillés dans l'interface

### Vérifications
1. Variables d'environnement correctes
2. Tables créées avec le bon schéma
3. RLS configuré correctement
4. Utilisateur authentifié
5. Connexion réseau stable

### Problèmes courants

#### "Supabase non configuré"
- Vérifiez `.env.local`
- Redémarrez le serveur de développement
- Vérifiez les URLs et clés

#### "Erreur lors de la connexion"
- Vérifiez l'email et mot de passe
- Confirmez l'email si inscription
- Vérifiez les logs Supabase

#### "Erreur de synchronisation"
- Vérifiez la connexion internet
- Vérifiez que les tables existent
- Consultez les logs pour plus de détails

## Roadmap

### Fonctionnalités futures
- [ ] Synchronisation automatique en arrière-plan
- [ ] Mode hors ligne avec sync différée
- [ ] Partage de données entre utilisateurs
- [ ] Export/import avancé
- [ ] Notifications push
- [ ] Analytics d'utilisation

### Optimisations
- [ ] Cache local intelligent
- [ ] Compression des données
- [ ] Sync partielle/incrémentielle
- [ ] Gestion de conflits avancée

## Support

Pour toute question ou problème :
1. Consultez les logs de la console
2. Vérifiez la configuration Supabase
3. Consultez la documentation Supabase
4. Ouvrez une issue GitHub avec les détails

---

**Version** : v1.5.0  
**Date** : Juillet 2025  
**Statut** : Intégration complète
