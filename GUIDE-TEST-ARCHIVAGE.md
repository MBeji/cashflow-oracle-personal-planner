# Guide de Test - Fonctionnalité d'Archivage Mensuel

## 🎯 **Objectif de la Fonctionnalité**

L'archivage mensuel permet de :
1. **Fiabiliser les données** du mois écoulé (revenus et dépenses réels vs prévisions)
2. **Archiver définitivement** le mois pour l'historique
3. **Passer automatiquement** au mois suivant comme nouveau mois courant
4. **Conserver l'historique** avec comparaison prévu/réel

## 📱 **Workflow Utilisateur**

### 1. **Déclenchement de l'Archivage**

**Archivage Automatique (Fin de Mois) :**
- 🟠 Alerte automatique 3 jours avant la fin du mois
- 📅 Affichage d'une carte orange "Fin de mois approche"
- ⏰ Compteur de jours restants
- 🔘 Bouton "Archiver [Mois] [Année]"

**Archivage Manuel :**
- 🔧 Bouton "Archivage manuel" toujours disponible
- ⚠️ Fonctionne uniquement pour le mois courant réel

### 2. **Processus d'Archivage en 3 Étapes**

#### **Étape 1 : Révision (Review)**
- 📊 Vue d'ensemble des données prévues vs réelles
- 📈 Tableau comparatif automatique :
  - Revenus totaux (prévu vs réel)
  - Dépenses totales (prévu vs réel)
  - Solde final (prévu vs réel)
- 🎯 2 options :
  - ✏️ "Corriger les données" → Étape 2
  - ✅ "Données correctes" → Étape 3

#### **Étape 2 : Correction (Correct)**
- 💰 **Section Revenus Réels** (colonne gauche) :
  - Salaire réel
  - Carburant réel
  - Assurance santé réelle
  - Bonus réel
- 💸 **Section Dépenses Réelles** (colonne droite) :
  - Remboursement dette réel
  - Dépenses courantes réelles
  - Carburant réel
  - Vacances réelles
  - Chantier réel
- 📝 **Notes optionnelles** pour le mois
- 🔄 Recalcul automatique du solde final réel

#### **Étape 3 : Confirmation (Confirm)**
- 📋 **Résumé complet** de l'archivage :
  - Mois à archiver
  - Solde prévu vs solde réel
  - Différence (en vert si positif, rouge si négatif)
  - Notes ajoutées
- ⚠️ **Avertissement** : Archivage définitif, plus de modification possible
- 🏆 **Bouton final** : "Archiver définitivement"

### 3. **Après l'Archivage**

#### **Transition Automatique :**
- ✅ **Notification de succès** : "Archivage réussi ! [Mois suivant] est maintenant le mois courant"
- 🔄 **Retour automatique** à l'onglet "Prévisions"
- 📅 **Mise à jour** de l'indicateur de mois courant dans l'en-tête
- 💰 **Nouveau solde de départ** = solde final réel du mois archivé

#### **Nouvelles Fonctionnalités Disponibles :**
- 📂 **Onglet Archives** avec badge du nombre d'archives
- 🏠 **Page principale** affiche le nouveau mois courant
- 📊 **Prévisions** recalculées pour le nouveau mois
- 🔄 **Prévisions de dépenses** remises à 0

## 🗂️ **Onglet Archives**

### **Vue d'Ensemble :**
- 📦 **Liste des mois archivés** (tri par date décroissante)
- 🎯 **Cartes pliables** pour chaque mois archivé
- 📊 **Indicateurs visuels** : différences positives/négatives

### **Détail de Chaque Archive :**
- 📅 **En-tête** : Mois, année, date d'archivage
- 📈 **Indicateur principal** : Différence globale vs prévu
- 📋 **Vue détaillée** (dépliable) :
  - **Revenus** : Prévu, Réel, Différence
  - **Dépenses** : Prévu, Réel, Différence  
  - **Solde final** : Prévu, Réel, Différence
- 📝 **Notes** du mois (si ajoutées)

### **États Visuels :**
- 🟢 **Vert** : Performance positive
- 🟠 **Orange** : Performance neutre/acceptable
- 🔴 **Rouge** : Performance négative

## 🎨 **Améliorations UX**

### **En-tête Application :**
- 📅 **Badge mois courant** : "📅 Mois courant : [Mois] [Année]"
- 🏷️ **Compteur archives** : "[X] mois archivé(s)"

### **Onglets :**
- 📊 **Prévisions** : Fonctionnalité principale
- 📈 **Statistiques** : Analyses existantes
- 📂 **Archives** : Avec badge numérique du nombre d'archives
- ⚙️ **Paramètres** : Configuration

### **Navigation :**
- 🔄 **Retour automatique** aux prévisions après archivage
- 🎯 **Bouton de retour** dans l'onglet Archives vide
- 📱 **Interface responsive** pour mobile

## ✅ **Tests à Effectuer**

### **Test de Base :**
1. ✅ Vérifier l'affichage du mois courant dans l'en-tête
2. ✅ Tester l'archivage manuel
3. ✅ Vérifier les 3 étapes du processus
4. ✅ Confirmer la transition automatique vers le mois suivant
5. ✅ Valider l'affichage dans l'onglet Archives

### **Test Avancé :**
1. 🧪 Modifier les données réelles et voir les différences
2. 🧪 Ajouter des notes et vérifier leur affichage
3. 🧪 Archiver plusieurs mois et tester l'historique
4. 🧪 Vérifier la persistance des données (rechargement page)

### **Test Mobile :**
1. 📱 Interface responsive sur iPhone
2. 📱 Processus d'archivage sur mobile
3. 📱 Navigation entre onglets

## 🚀 **Avantages de la Fonctionnalité**

1. **📊 Suivi Précis** : Comparaison systématique prévu/réel
2. **📈 Historique Complet** : Archive de tous les mois avec détails
3. **🔄 Transition Fluide** : Passage automatique au mois suivant
4. **💾 Sauvegarde Sécurisée** : Données archivées définitivement
5. **📱 UX Optimisée** : Interface intuitive et responsive

Cette fonctionnalité transforme l'application en véritable outil de suivi financier avec historique complet ! 🎉
