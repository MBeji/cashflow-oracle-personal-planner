export interface MonthlyData {
  month: number;
  year: number;
  startingBalance: number;
  revenues: {
    salary: number;
    fuel: number;
    healthInsurance: number;
    bonus: number;
    custom: CustomRevenue[];
  };
  expenses: {
    debt: number;
    currentExpenses: number;
    fuel: number;
    healthInsurance: number;
    vacation: number;
    school: number;
    custom: CustomExpense[];
    chantier: number;
  };
  endingBalance: number;
  isArchived?: boolean;
  archivedAt?: string;
}

// Interface pour les données archivées d'un mois
export interface ArchivedMonth {
  month: number;
  year: number;
  plannedData: MonthlyData;
  actualData: MonthlyData;
  archivedAt: string;
  notes?: string;
}

// Interface pour la correction des données avant archivage
export interface MonthlyDataCorrection {
  month: number;
  year: number;
  actualRevenues: {
    salary: number;
    fuel: number;
    healthInsurance: number;
    bonus: number;
    custom: CustomRevenue[];
  };
  actualExpenses: {
    debt: number;
    currentExpenses: number;
    fuel: number;
    healthInsurance: number;
    vacation: number;
    school: number;
    custom: CustomExpense[];
    chantier: number;
  };
  notes?: string;
}

export interface CustomExpense {
  id: string;
  name: string;
  amount: number;
  month?: number;
  year?: number;
  isRecurring: boolean;
}

// Nouveau type pour les dépenses personnalisées par mois
export interface MonthlyCustomExpense {
  id: string;
  type: string;
  amount: number;
}

export interface CashFlowSettings {
  currentBalance: number;
  alertThreshold: number;
  monthsToDisplay: number;
  customRevenues: CustomRevenue[];
  customRecurringExpenses: CustomExpense[];
  fixedAmounts: FixedAmounts;
  expenseSettings: ExpenseSettings;
  expensePlanningSettings: ExpensePlanningSettings;
  archivedMonths: ArchivedMonth[];
  currentMonth?: number;
  currentYear?: number;
}

export interface FixedAmounts {
  salary: number;
  fuelRevenue: number;
  healthInsuranceRevenue: number;
  bonusMultipliers: BonusSchedule;
  debt: number;
  currentExpenses: number;
  fuelExpense: number;
  healthInsuranceExpense: number;
  schoolExpense: number;
}

export interface CustomRevenue {
  id: string;
  name: string;
  amount: number;
  month?: number;
  year?: number;
  isRecurring: boolean;
}

export interface BonusSchedule {
  march: number; // 1.5 salary
  june: number; // 0.5 salary
  september: number; // 1.5 salary
  december: number; // 0.5 salary
}

export interface ExpenseCategory {
  id: string;
  name: string;
  amount: number;
  color?: string;
}

export interface ExpenseSubCategory {
  id: string;
  name: string;
  amount: number;
  parentCategoryId: string;
}

export interface MonthlyExpenseBreakdown {
  month: number;
  year: number;
  categories: ExpenseCategory[];
  subcategories: ExpenseSubCategory[];
  totalAmount: number;
}

export interface ExpenseSettings {
  defaultCategories: ExpenseCategory[];
  defaultSubcategories: ExpenseSubCategory[];
  monthlyBreakdowns: MonthlyExpenseBreakdown[];
}

// Types pour la planification des dépenses mensuelles
export interface PlannedExpenseCategory {
  id: string;
  name: string;
  amount: number;
  color?: string;
  isDefault: boolean; // Si c'est une catégorie standard ou personnalisée
}

export interface MonthlyExpensePlanning {
  month: number;
  year: number;
  categories: PlannedExpenseCategory[];
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ExpensePlanningSettings {
  monthlyPlannings: MonthlyExpensePlanning[];
  defaultAmount: number; // Montant par défaut si aucune planification (5000)
}