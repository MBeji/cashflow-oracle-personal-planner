export interface MonthlyData {
  month: number;
  year: number;
  startingBalance: number;
  revenues: {
    salary: number;
    fuel: number;
    healthInsurance: number;
    bonus: number;
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

export interface CashFlowSettings {
  currentBalance: number;
  alertThreshold: number;
}

export interface BonusSchedule {
  march: number; // 1.5 salary
  june: number; // 0.5 salary
  september: number; // 1.5 salary
  december: number; // 0.5 salary
}