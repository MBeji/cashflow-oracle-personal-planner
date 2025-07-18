import { MonthlyData, CustomExpense, BonusSchedule } from '@/types/cashflow';

const BASE_SALARY = 12750;
const FUEL_AMOUNT = 500;
const HEALTH_INSURANCE = 1000;
const DEBT_AMOUNT = 6000;
const CURRENT_EXPENSES = 5000;
const SCHOOL_AMOUNT = 15000;

const BONUS_SCHEDULE: BonusSchedule = {
  march: 1.5 * BASE_SALARY,
  june: 0.5 * BASE_SALARY,
  september: 1.5 * BASE_SALARY,
  december: 0.5 * BASE_SALARY,
};

export function calculateMonthlyData(
  startMonth: number,
  startYear: number,
  months: number,
  initialBalance: number,
  customExpenses: CustomExpense[] = [],
  chantierExpenses: { [key: string]: number } = {},
  vacationExpenses: { [key: string]: number } = {}
): MonthlyData[] {
  const result: MonthlyData[] = [];
  let currentBalance = initialBalance;

  for (let i = 0; i < months; i++) {
    const currentMonth = ((startMonth - 1 + i) % 12) + 1;
    const currentYear = startYear + Math.floor((startMonth - 1 + i) / 12);
    const monthKey = `${currentYear}-${currentMonth.toString().padStart(2, '0')}`;

    // Calculate bonus for this month
    let bonus = 0;
    if (currentMonth === 3) bonus = BONUS_SCHEDULE.march;
    if (currentMonth === 6) bonus = BONUS_SCHEDULE.june;
    if (currentMonth === 9) bonus = BONUS_SCHEDULE.september;
    if (currentMonth === 12) bonus = BONUS_SCHEDULE.december;

    // Calculate custom expenses for this month
    const monthCustomExpenses = customExpenses.filter(expense => {
      if (expense.isRecurring) return true;
      return expense.month === currentMonth && expense.year === currentYear;
    });

    const totalCustomExpenses = monthCustomExpenses.reduce((sum, expense) => sum + expense.amount, 0);

    // School expenses (April only)
    const schoolExpense = currentMonth === 4 ? SCHOOL_AMOUNT : 0;

    // Vacation expenses (July and August)
    const vacationExpense = vacationExpenses[monthKey] || 0;

    // Chantier expenses
    const chantierExpense = chantierExpenses[monthKey] || 0;

    const monthData: MonthlyData = {
      month: currentMonth,
      year: currentYear,
      startingBalance: currentBalance,
      revenues: {
        salary: BASE_SALARY,
        fuel: FUEL_AMOUNT,
        healthInsurance: HEALTH_INSURANCE,
        bonus,
      },
      expenses: {
        debt: DEBT_AMOUNT,
        currentExpenses: CURRENT_EXPENSES,
        fuel: FUEL_AMOUNT, // Auto-consumed
        healthInsurance: HEALTH_INSURANCE, // Auto-consumed
        vacation: vacationExpense,
        school: schoolExpense,
        custom: monthCustomExpenses,
        chantier: chantierExpense,
      },
      endingBalance: 0, // Will be calculated below
    };

    // Calculate ending balance
    const totalRevenues = monthData.revenues.salary + monthData.revenues.fuel + monthData.revenues.healthInsurance + monthData.revenues.bonus;
    const totalExpenses = monthData.expenses.debt + monthData.expenses.currentExpenses + monthData.expenses.fuel + 
                         monthData.expenses.healthInsurance + monthData.expenses.vacation + monthData.expenses.school + 
                         totalCustomExpenses + monthData.expenses.chantier;

    monthData.endingBalance = currentBalance + totalRevenues - totalExpenses;
    currentBalance = monthData.endingBalance;

    result.push(monthData);
  }

  return result;
}

export function formatCurrency(amount: number): string {
  return `${amount.toLocaleString()} TND`;
}

export function getMonthName(month: number): string {
  const months = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];
  return months[month - 1];
}

export function isLowBalance(balance: number, threshold: number = 2000): boolean {
  return balance < threshold;
}