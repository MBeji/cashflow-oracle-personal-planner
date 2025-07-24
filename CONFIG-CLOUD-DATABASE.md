# 📊 Configuration Utilisateur en Base de Données

## 🎯 Pourquoi la Base de Données ?

### ✅ Avantages de la Configuration Cloud (Supabase)

1. **🔒 Sécurité Renforcée**
   - Plus de données personnelles dans le code source
   - Isolation des données par utilisateur (Row Level Security)
   - Authentification sécurisée avec Supabase Auth

2. **🌐 Synchronisation Multi-Appareils** 
   - Configuration disponible sur tous les appareils de l'utilisateur
   - Sauvegarde automatique en temps réel
   - Pas de perte de données lors du nettoyage du navigateur

3. **📈 Évolutivité**
   - Ajout facile de nouveaux paramètres
   - Gestion centralisée des configurations
   - Possibilité de migration de données

4. **🔍 Audit et Historique**
   - Traçabilité des modifications
   - Horodatage automatique (created_at, updated_at)
   - Possibilité de restauration

### ❌ Problèmes des Solutions Précédentes

- **localStorage** : Perdu lors du nettoyage du navigateur
- **Variables d'environnement** : Partagées entre tous les utilisateurs, données exposées
- **Fichiers de config** : Risque d'exposition dans le repository git

## 🏗️ Architecture Actuelle

### 🗄️ Table `user_settings` (Supabase)

```sql
CREATE TABLE IF NOT EXISTS public.user_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    current_balance DECIMAL(10,2) DEFAULT 0,
    alert_threshold DECIMAL(10,2) DEFAULT 2000,
    months_to_display INTEGER DEFAULT 20,
    current_month INTEGER DEFAULT 1,
    current_year INTEGER DEFAULT 2025,
    fixed_amounts JSONB DEFAULT '{}',
    expense_settings JSONB DEFAULT '{}',
    expense_planning_settings JSONB DEFAULT '{}',
    custom_revenues JSONB DEFAULT '[]',
    custom_recurring_expenses JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id)
);
```

### 🔧 Services Implémentés

1. **UserConfigService** (`src/services/UserConfigService.ts`)
   - Chargement/sauvegarde de la configuration
   - Conversion des formats BDD ↔ Application
   - Gestion des erreurs et fallback

2. **useUserConfig Hook** (`src/hooks/useUserConfig.ts`)
   - État réactif de la configuration
   - Auto-sauvegarde avec debouncing
   - Synchronisation avec l'authentification

3. **Index.tsx Adapté**
   - Utilise le hook `useUserConfig`
   - Interface de chargement et gestion d'erreurs
   - Migration transparente depuis localStorage

## 🚀 Flux de Configuration

### 🔐 Connexion Utilisateur
1. Authentification via Supabase Auth
2. Hook `useUserConfig` détecte la connexion
3. `UserConfigService.loadUserConfig()` charge la config depuis BDD
4. Si première connexion → création config par défaut
5. Configuration appliquée à l'interface

### 💾 Sauvegarde Automatique
1. Modification dans l'interface → `updateConfig()`
2. Debouncing (1 seconde) → `debouncedSave()`
3. `UserConfigService.saveUserConfig()` vers Supabase
4. Confirmation en console

### 🔄 Déconnexion
1. Hook détecte la déconnexion
2. Retour à la configuration par défaut locale
3. Pas de suppression des données BDD (persistent)

## 📊 Migration depuis localStorage

### Configuration Héritée
- Les données localStorage restent comme fallback
- Données non-personnelles (vacances, chantier, etc.)
- Migration progressive vers la BDD

### Données Personnelles Supprimées
- ✅ Plus de valeurs hardcodées dans le code
- ✅ Plus de variables d'environnement exposées
- ✅ Plus de fichiers .env.local avec données sensibles

## 🔧 Configuration pour Développement

### Valeurs par Défaut (Nouveaux Utilisateurs)
```typescript
const DEFAULT_CONFIG = {
  currentBalance: 0,
  alertThreshold: 1000,
  salary: 6000,
  currentExpenses: 3000,
  bonusMultipliers: {
    march: 3000,    // 0.5 * 6000
    june: 3000,     // 0.5 * 6000
    september: 3000, // 0.5 * 6000
    december: 3000   // 0.5 * 6000
  }
  // ... autres paramètres génériques
};
```

### Configuration Spécifique (Privée)
- Stockée directement en base de données
- Accessible uniquement à l'utilisateur connecté
- Modifiable via l'interface de l'application

## 🛡️ Sécurité

### Row Level Security (RLS)
```sql
-- Seul l'utilisateur propriétaire peut voir/modifier ses paramètres
CREATE POLICY "Users can view own settings" ON public.user_settings
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own settings" ON public.user_settings
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own settings" ON public.user_settings
    FOR UPDATE USING (auth.uid() = user_id);
```

### Authentification Requise
- Toutes les opérations nécessitent une session valide
- Token JWT automatiquement géré par Supabase
- Expiration et renouvellement automatiques

## 🎯 Avantages Business

### 🏢 Multi-Utilisateurs
- Chaque utilisateur a sa propre configuration
- Pas d'interférence entre utilisateurs
- Gestion centralisée des paramètres

### 📱 Application Mobile Future
- Configuration partagée entre web et mobile
- API REST standard (Supabase)
- Synchronisation automatique

### 🔄 Sauvegarde et Restauration
- Données sauvegardées sur Supabase (cloud)
- Restauration possible en cas de problème
- Export/import via l'interface

## 📝 Notes de Migration

### ✅ Terminé
- Architecture de base implémentée
- UserConfigService et useUserConfig fonctionnels
- Interface Index.tsx adaptée avec loading/error states
- Suppression complète des données personnelles du code

### 🔄 En Cours
- Correction des interfaces de composants
- Tests et validation
- Documentation utilisateur

### 🚀 Futur
- Migration des autres données (vacances, etc.) vers BDD
- Cache offline pour améliorer les performances
- Historique des modifications de configuration

---

**Date :** 24 juillet 2025  
**Architecture :** Configuration Cloud sécurisée avec Supabase  
**Statut :** 🚀 Implémentation avancée, corrections en cours
