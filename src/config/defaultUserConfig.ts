// Configuration des valeurs par défaut pour les nouveaux utilisateurs
// Ces valeurs peuvent être modifiées sans recompiler l'application

export interface DefaultUserConfig {
  // Paramètres financiers de base
  currentBalance: number;
  alertThreshold: number;
  monthsToDisplay: number;
  
  // Montants fixes par défaut
  fixedAmounts: {
    salary: number;
    fuelRevenue: number;
    healthInsuranceRevenue: number;
    bonusMultipliers: {
      march: number;   // Prime mars (en TND)
      june: number;    // Prime juin (en TND)
      september: number; // Prime septembre (en TND)
      december: number;  // Prime décembre (en TND)
    };
    debt: number;
    currentExpenses: number;
    fuelExpense: number;
    healthInsuranceExpense: number;
    schoolExpense: number;
  };
  
  // Catégories de dépenses par défaut
  expenseCategories: Array<{
    id: string;
    name: string;
    amount: number;
    color: string;
  }>;
  
  // Sous-catégories par défaut
  expenseSubcategories: Array<{
    id: string;
    name: string;
    amount: number;
    parentCategoryId: string;
  }>;
  
  // Planification par défaut
  expensePlanning: {
    defaultAmount: number;
  };
}

// Configuration par défaut pour nouveaux utilisateurs
export const DEFAULT_USER_CONFIG: DefaultUserConfig = {
  currentBalance: 0,
  alertThreshold: 1000,
  monthsToDisplay: 20,
  
  fixedAmounts: {
    salary: 6000,
    fuelRevenue: 0,
    healthInsuranceRevenue: 0,
    bonusMultipliers: {
      march: 3000,    // 0.5 * 6000
      june: 3000,     // 0.5 * 6000
      september: 3000, // 0.5 * 6000
      december: 3000   // 0.5 * 6000
    },
    debt: 0,
    currentExpenses: 3000,
    fuelExpense: 0,
    healthInsuranceExpense: 0,
    schoolExpense: 0
  },
  
  expenseCategories: [
    { id: '1', name: 'Alimentation & Maison', amount: 1500, color: '#ef4444' },
    { id: '2', name: 'Transport', amount: 500, color: '#f97316' },
    { id: '3', name: 'Loisirs & Sorties', amount: 400, color: '#eab308' },
    { id: '4', name: 'Factures & Services', amount: 300, color: '#22c55e' },
    { id: '5', name: 'Santé & Bien-être', amount: 300, color: '#a855f7' }
  ],
  
  expenseSubcategories: [
    { id: '1-1', name: 'Alimentation', amount: 1000, parentCategoryId: '1' },
    { id: '1-2', name: 'Produits ménagers', amount: 300, parentCategoryId: '1' },
    { id: '1-3', name: 'Équipement maison', amount: 200, parentCategoryId: '1' },
    { id: '2-1', name: 'Carburant', amount: 300, parentCategoryId: '2' },
    { id: '2-2', name: 'Transport public', amount: 100, parentCategoryId: '2' },
    { id: '2-3', name: 'Entretien véhicule', amount: 100, parentCategoryId: '2' },
    { id: '3-1', name: 'Restaurants', amount: 250, parentCategoryId: '3' },
    { id: '3-2', name: 'Cinéma & Spectacles', amount: 150, parentCategoryId: '3' },
    { id: '4-1', name: 'Électricité & Eau', amount: 150, parentCategoryId: '4' },
    { id: '4-2', name: 'Internet & Téléphone', amount: 150, parentCategoryId: '4' },
    { id: '5-1', name: 'Médecin & Pharmacie', amount: 200, parentCategoryId: '5' },
    { id: '5-2', name: 'Sport & Fitness', amount: 100, parentCategoryId: '5' }
  ],
  
  expensePlanning: {
    defaultAmount: 3000
  }
};

// Configuration spécifique pour Mohamed Beji (migration des données existantes)
export const MOHAMED_BEJI_CONFIG: DefaultUserConfig = {
  currentBalance: 3500,
  alertThreshold: 2000,
  monthsToDisplay: 20,
  
  fixedAmounts: {
    salary: 12750,
    fuelRevenue: 500,
    healthInsuranceRevenue: 1000,
    bonusMultipliers: {
      march: 19125,   // 1.5 * 12750
      june: 6375,     // 0.5 * 12750
      september: 19125, // 1.5 * 12750
      december: 6375    // 0.5 * 12750
    },
    debt: 6000,
    currentExpenses: 3300,
    fuelExpense: 500,
    healthInsuranceExpense: 1000,
    schoolExpense: 15000
  },
  
  expenseCategories: [
    { id: '1', name: 'Alimentation & Maison', amount: 2000, color: '#ef4444' },
    { id: '2', name: 'Femme de ménage', amount: 200, color: '#f97316' },
    { id: '3', name: 'Enfants (Études & Club)', amount: 500, color: '#eab308' },
    { id: '4', name: 'Factures', amount: 200, color: '#22c55e' },
    { id: '5', name: 'Restaurants & Sorties', amount: 400, color: '#a855f7' }
  ],
  
  expenseSubcategories: [
    { id: '1-1', name: 'Alimentation', amount: 1500, parentCategoryId: '1' },
    { id: '1-2', name: 'Produits ménagers', amount: 300, parentCategoryId: '1' },
    { id: '1-3', name: 'Besoins maison récurrents', amount: 200, parentCategoryId: '1' },
    { id: '3-1', name: 'Frais scolaires', amount: 250, parentCategoryId: '3' },
    { id: '3-2', name: 'Club sportif/activités', amount: 250, parentCategoryId: '3' },
    { id: '4-1', name: 'Eau & Électricité', amount: 100, parentCategoryId: '4' },
    { id: '4-2', name: 'Internet', amount: 100, parentCategoryId: '4' },
    { id: '5-1', name: 'Restaurants', amount: 250, parentCategoryId: '5' },
    { id: '5-2', name: 'Sorties & Loisirs familiaux', amount: 150, parentCategoryId: '5' }
  ],
  
  expensePlanning: {
    defaultAmount: 5000
  }
};

// Fonction pour obtenir la configuration par défaut selon l'utilisateur
export function getDefaultConfigForUser(userEmail?: string): DefaultUserConfig {
  // Debug: Afficher l'email détecté
  console.log('🔍 Email détecté:', userEmail);
  
  // Configuration spécifique pour Mohamed Beji - TOUS les emails possibles
  const mohamedEmails = [
    'mohamed.beji@example.com',
    'mbeji@sofrecom.fr',
    'mohamed.beji@sofrecom.fr',
    'mbeji@gmail.com',
    'mohamed@beji.com',
    // Ajouter d'autres variantes si nécessaire
  ];
  
  if (userEmail && mohamedEmails.includes(userEmail.toLowerCase())) {
    console.log('✅ Configuration Mohamed Beji appliquée pour:', userEmail);
    return MOHAMED_BEJI_CONFIG;
  }
  
  console.log('📋 Configuration par défaut appliquée pour:', userEmail);
  // Configuration par défaut pour tous les autres utilisateurs
  return DEFAULT_USER_CONFIG;
}

// Fonction pour créer les paramètres initiaux d'un utilisateur
export function createInitialUserSettings(userEmail?: string) {
  const config = getDefaultConfigForUser(userEmail);
  
  return {
    currentBalance: config.currentBalance,
    alertThreshold: config.alertThreshold,
    monthsToDisplay: config.monthsToDisplay,
    customRevenues: [],
    customRecurringExpenses: [],
    fixedAmounts: config.fixedAmounts,
    expenseSettings: {
      defaultCategories: config.expenseCategories,
      defaultSubcategories: config.expenseSubcategories,
      monthlyBreakdowns: []
    },
    expensePlanningSettings: {
      monthlyPlannings: [],
      defaultAmount: config.expensePlanning.defaultAmount
    },
    archivedMonths: [],
    currentMonth: new Date().getMonth() + 1,
    currentYear: new Date().getFullYear()
  };
}
