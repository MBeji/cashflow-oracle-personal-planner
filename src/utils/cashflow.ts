import { MonthlyData, CustomExpense, BonusSchedule, CustomRevenue, FixedAmounts, MonthlyCustomExpense, ExpenseSettings, ExpensePlanningSettings } from '@/types/cashflow';

export function calculateMonthlyData(
  startMonth: number,
  startYear: number,
  months: number,
  initialBalance: number,
  customExpenses: CustomExpense[] = [],
  chantierExpenses: { [key: string]: number } = {},
  vacationExpenses: { [key: string]: number } = {},
  customRevenues: CustomRevenue[] = [],
  fixedAmounts: FixedAmounts,
  monthlyCustomExpenses: { [key: string]: MonthlyCustomExpense[] } = {},
  expenseSettings?: ExpenseSettings,
  currentMonthExpenseForecast?: number,
  expensePlanningSettings?: ExpensePlanningSettings
): MonthlyData[] {
  const result: MonthlyData[] = [];
  let currentBalance = initialBalance;  for (let i = 0; i < months; i++) {
    const currentMonth = ((startMonth - 1 + i) % 12) + 1;
    const currentYear = startYear + Math.floor((startMonth - 1 + i) / 12);
    const monthKey = `${currentYear}-${currentMonth.toString().padStart(2, '0')}`;

    // Déterminer si c'est le mois en cours (premier mois de la prévision)
    const isCurrentMonth = i === 0;

    // Calculate revenues for this month (from previous month's earnings)
    // For the current month, we don't have revenues yet as they are paid at month end
    let salary = 0;
    let fuel = 0;
    let healthInsurance = 0;
    let bonus = 0;

    if (!isCurrentMonth && (i > 0 || startMonth > 1)) {
      // Calculate previous month to get revenues from
      const prevMonth = currentMonth === 1 ? 12 : currentMonth - 1;
      const prevYear = currentMonth === 1 ? currentYear - 1 : currentYear;        // Regular monthly revenues from previous month
      salary = fixedAmounts.salary;
      fuel = fixedAmounts.fuelRevenue;
      healthInsurance = fixedAmounts.healthInsuranceRevenue;
      
      // Bonus from previous month
      if (prevMonth === 3) bonus = fixedAmounts.bonusMultipliers.march;
      if (prevMonth === 6) bonus = fixedAmounts.bonusMultipliers.june;
      if (prevMonth === 9) bonus = fixedAmounts.bonusMultipliers.september;
      if (prevMonth === 12) bonus = fixedAmounts.bonusMultipliers.december;
    }

    // Calculate custom revenues for this month
    const monthCustomRevenues = customRevenues.filter(revenue => {
      if (revenue.isRecurring) return true;
      return revenue.month === currentMonth && revenue.year === currentYear;
    });

    const totalCustomRevenues = monthCustomRevenues.reduce((sum, revenue) => sum + revenue.amount, 0);

    // Calculate custom expenses for this month
    const monthCustomExpenses = customExpenses.filter(expense => {
      if (expense.isRecurring) return true;
      return expense.month === currentMonth && expense.year === currentYear;
    });

    const totalCustomExpenses = monthCustomExpenses.reduce((sum, expense) => sum + expense.amount, 0);    // School expenses (April only)
    const schoolExpense = currentMonth === 4 ? fixedAmounts.schoolExpense : 0;

    // Vacation expenses (July and August)
    const vacationExpense = vacationExpenses[monthKey] || 0;    // Chantier expenses
    const chantierExpense = chantierExpenses[monthKey] || 0;    // Monthly custom expenses
    const monthlyCustomExpensesTotal = (monthlyCustomExpenses[monthKey] || []).reduce((sum, exp) => sum + exp.amount, 0);    // Calculate current expenses from planning first, then categories if available, then default
    let currentExpensesAmount = fixedAmounts.currentExpenses;
    
    // Priority 1: Check if there's a specific planning for this month
    if (expensePlanningSettings?.monthlyPlannings) {
      const planning = expensePlanningSettings.monthlyPlannings.find(
        p => p.month === currentMonth && p.year === currentYear
      );
      if (planning) {
        currentExpensesAmount = planning.totalAmount;
      } else {
        // Use default amount from planning settings if no specific planning
        currentExpensesAmount = expensePlanningSettings.defaultAmount;
      }
    }
    // Priority 2: Check expense categories breakdown (legacy system)
    else if (expenseSettings?.monthlyBreakdowns) {
      const breakdown = expenseSettings.monthlyBreakdowns.find(
        b => b.month === (currentMonth - 1) && b.year === currentYear
      );
      if (breakdown) {
        currentExpensesAmount = breakdown.totalAmount;
      }
    }const monthData: MonthlyData = {
      month: currentMonth,
      year: currentYear,
      startingBalance: currentBalance,
      revenues: {
        salary,
        fuel,
        healthInsurance,
        bonus,
        custom: monthCustomRevenues,
      },      expenses: {
        debt: isCurrentMonth ? 0 : fixedAmounts.debt, // Pas de dette pour le mois en cours
        currentExpenses: isCurrentMonth ? 0 : currentExpensesAmount, // Pas de dépenses courantes pour le mois en cours
        fuel: isCurrentMonth ? 0 : fixedAmounts.fuelExpense, // Auto-consumed, pas pour le mois en cours
        healthInsurance: isCurrentMonth ? 0 : fixedAmounts.healthInsuranceExpense, // Auto-consumed, pas pour le mois en cours
        vacation: vacationExpense,
        school: schoolExpense,
        custom: [...monthCustomExpenses, ...(monthlyCustomExpenses[monthKey] || []).map(exp => ({
          id: exp.id,
          name: exp.type,
          amount: exp.amount,
          isRecurring: false
        }))],
        chantier: chantierExpense,
      },
      endingBalance: 0, // Will be calculated below
    };    // Calculate ending balance
    const totalRevenues = monthData.revenues.salary + monthData.revenues.fuel + monthData.revenues.healthInsurance + monthData.revenues.bonus + totalCustomRevenues;
    
    let totalExpenses;
    
    if (isCurrentMonth && currentMonthExpenseForecast !== undefined) {
      // Pour le mois en cours, utiliser la prévision de dépenses si elle est fournie
      totalExpenses = currentMonthExpenseForecast;
    } else {
      // Pour les autres mois, utiliser le calcul normal
      totalExpenses = monthData.expenses.debt + monthData.expenses.currentExpenses + monthData.expenses.fuel + 
                     monthData.expenses.healthInsurance + monthData.expenses.vacation + monthData.expenses.school + 
                     monthData.expenses.custom.reduce((sum, exp) => sum + exp.amount, 0) + monthData.expenses.chantier;
    }monthData.endingBalance = currentBalance + totalRevenues - totalExpenses;
    
    currentBalance = monthData.endingBalance;

    result.push(monthData);
  }

  return result;
}

export function formatCurrency(amount: number): string {
  return `${amount.toLocaleString('en-US')} TND`;
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