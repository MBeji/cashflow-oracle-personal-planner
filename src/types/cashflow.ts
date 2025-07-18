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