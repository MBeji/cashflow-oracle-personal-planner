import { describe, it, expect } from 'vitest';
import { calculateMonthlyData, formatCurrency, getMonthName, isLowBalance } from '../utils/cashflow';
import { FixedAmounts, MonthlyCustomExpense } from '../types/cashflow';

describe('Cashflow Utilities', () => {
  const defaultFixedAmounts: FixedAmounts = {
    salary: 12750,
    fuelRevenue: 500,
    healthInsuranceRevenue: 1000,
    bonusMultipliers: {
      march: 19125,
      june: 6375,
      september: 19125,
      december: 6375
    },
    debt: 6000,
    currentExpenses: 5000,
    fuelExpense: 500,
    healthInsuranceExpense: 1000,
    schoolExpense: 15000
  };

  describe('formatCurrency', () => {
    it('should format positive numbers correctly', () => {
      expect(formatCurrency(1234)).toBe('1,234 TND');
      expect(formatCurrency(1234567)).toBe('1,234,567 TND');
    });

    it('should format negative numbers correctly', () => {
      expect(formatCurrency(-1234)).toBe('-1,234 TND');
    });

    it('should format zero correctly', () => {
      expect(formatCurrency(0)).toBe('0 TND');
    });

    it('should format decimal numbers correctly', () => {
      expect(formatCurrency(1234.56)).toBe('1,234.56 TND');
    });
  });

  describe('getMonthName', () => {
    it('should return correct month names', () => {
      expect(getMonthName(1)).toBe('Janvier');
      expect(getMonthName(7)).toBe('Juillet');
      expect(getMonthName(12)).toBe('Décembre');
    });

    it('should handle edge cases', () => {
      expect(getMonthName(0)).toBe(undefined); // Invalid month
      expect(getMonthName(13)).toBe(undefined); // Invalid month
    });
  });

  describe('isLowBalance', () => {
    it('should return true for balance below threshold', () => {
      expect(isLowBalance(1500, 2000)).toBe(true);
      expect(isLowBalance(1999, 2000)).toBe(true);
    });

    it('should return false for balance above or equal threshold', () => {
      expect(isLowBalance(2000, 2000)).toBe(false);
      expect(isLowBalance(2500, 2000)).toBe(false);
    });

    it('should use default threshold when not provided', () => {
      expect(isLowBalance(1500)).toBe(true);
      expect(isLowBalance(2500)).toBe(false);
    });
  });

  describe('calculateMonthlyData', () => {
    it('should calculate basic monthly data correctly', () => {
      const result = calculateMonthlyData(
        1, 2025, 2, 10000, [], {}, {}, [], defaultFixedAmounts, {}
      );

      expect(result).toHaveLength(2);
      
      // Premier mois (janvier 2025) - pas de revenus du mois précédent
      const firstMonth = result[0];
      expect(firstMonth.month).toBe(1);
      expect(firstMonth.year).toBe(2025);
      expect(firstMonth.startingBalance).toBe(10000);
      expect(firstMonth.revenues.salary).toBe(0); // Pas de salaire du mois précédent
      expect(firstMonth.revenues.bonus).toBe(0);
      
      // Deuxième mois (février 2025) - reçoit les revenus de janvier
      const secondMonth = result[1];
      expect(secondMonth.month).toBe(2);
      expect(secondMonth.year).toBe(2025);
      expect(secondMonth.revenues.salary).toBe(12750); // Salaire de janvier
      expect(secondMonth.revenues.fuel).toBe(500);
      expect(secondMonth.revenues.healthInsurance).toBe(1000);
    });

    it('should handle bonus months correctly', () => {
      // Test avec mars et avril pour vérifier le bonus de mars
      const result = calculateMonthlyData(
        3, 2025, 2, 10000, [], {}, {}, [], defaultFixedAmounts, {}
      );

      const aprilMonth = result[1]; // Avril reçoit le bonus de mars
      expect(aprilMonth.revenues.bonus).toBe(19125); // Bonus de mars (1.5 * salary)
    });

    it('should calculate school expenses in April', () => {
      const result = calculateMonthlyData(
        4, 2025, 1, 10000, [], {}, {}, [], defaultFixedAmounts, {}
      );

      const aprilMonth = result[0];
      expect(aprilMonth.expenses.school).toBe(15000);
    });

    it('should handle vacation expenses', () => {
      const vacationExpenses = {
        '2025-07': 3000,
        '2025-08': 2500
      };

      const result = calculateMonthlyData(
        7, 2025, 2, 10000, [], {}, vacationExpenses, [], defaultFixedAmounts, {}
      );

      const julyMonth = result[0];
      const augustMonth = result[1];
      
      expect(julyMonth.expenses.vacation).toBe(3000);
      expect(augustMonth.expenses.vacation).toBe(2500);
    });

    it('should handle chantier expenses', () => {
      const chantierExpenses = {
        '2025-05': 2000,
        '2025-06': 1500
      };

      const result = calculateMonthlyData(
        5, 2025, 2, 10000, [], chantierExpenses, {}, [], defaultFixedAmounts, {}
      );

      const mayMonth = result[0];
      const juneMonth = result[1];
      
      expect(mayMonth.expenses.chantier).toBe(2000);
      expect(juneMonth.expenses.chantier).toBe(1500);
    });    it('should handle monthly custom expenses', () => {
      const monthlyCustomExpenses = {
        '2025-03': [
          { id: '1', type: 'Réparation voiture', amount: 800 },
          { id: '2', type: 'Cadeau anniversaire', amount: 200 }
        ],
        '2025-04': [
          { id: '3', type: 'Équipement bureau', amount: 1200 }
        ]
      };

      const result = calculateMonthlyData(
        3, 2025, 2, 10000, [], {}, {}, [], defaultFixedAmounts, monthlyCustomExpenses
      );

      const marchMonth = result[0];
      const aprilMonth = result[1];
      
      // Mars : solde initial 10000 - dépenses fixes (12500) - dépenses personnalisées (1000) = 10000 - 13500 = -3500
      const marchExpectedExpenses = 6000 + 5000 + 500 + 1000 + 1000; // Dette + courantes + carburant + assurance + custom expenses
      expect(marchMonth.endingBalance).toBe(10000 - marchExpectedExpenses); // 10000 - 13500 = -3500
      
      // Avril : solde précédent (-3500) + revenus de mars (14250 avec bonus) - dépenses fixes (27500) - école (15000) - custom (1200)
      const aprilRevenues = 12750 + 500 + 1000 + 19125; // Salaire + carburant + assurance + bonus de mars
      const aprilExpenses = 6000 + 5000 + 500 + 1000 + 15000 + 1200; // Dette + courantes + carburant + assurance + école + custom
      expect(aprilMonth.endingBalance).toBe(marchMonth.endingBalance + aprilRevenues - aprilExpenses);
    });

    it('should calculate ending balance correctly', () => {
      const result = calculateMonthlyData(
        1, 2025, 2, 10000, [], {}, {}, [], defaultFixedAmounts, {}
      );

      const firstMonth = result[0];
      const secondMonth = result[1];

      // Premier mois: balance initiale - dépenses (pas de revenus)
      const firstMonthExpenses = 6000 + 5000 + 500 + 1000; // Dette + dépenses courantes + carburant + assurance
      expect(firstMonth.endingBalance).toBe(10000 - firstMonthExpenses);

      // Deuxième mois: solde précédent + revenus - dépenses
      const secondMonthRevenues = 12750 + 500 + 1000; // Salaire + carburant + assurance
      const secondMonthExpenses = 6000 + 5000 + 500 + 1000; // Dette + dépenses courantes + carburant + assurance
      expect(secondMonth.endingBalance).toBe(firstMonth.endingBalance + secondMonthRevenues - secondMonthExpenses);
    });

    it('should handle year transition correctly', () => {
      const result = calculateMonthlyData(
        12, 2024, 2, 10000, [], {}, {}, [], defaultFixedAmounts, {}
      );

      const decemberMonth = result[0];
      const januaryMonth = result[1];

      expect(decemberMonth.month).toBe(12);
      expect(decemberMonth.year).toBe(2024);
      expect(januaryMonth.month).toBe(1);
      expect(januaryMonth.year).toBe(2025);

      // Janvier 2025 devrait recevoir le bonus de décembre 2024
      expect(januaryMonth.revenues.bonus).toBe(6375); // Bonus de décembre (0.5 * salary)
    });

    it('should handle custom recurring revenues and expenses', () => {
      const customRevenues = [
        { id: '1', name: 'Freelance', amount: 2000, isRecurring: true }
      ];
      
      const customExpenses = [
        { id: '1', name: 'Abonnement', amount: 50, isRecurring: true }
      ];

      const result = calculateMonthlyData(
        1, 2025, 2, 10000, customExpenses, {}, {}, customRevenues, defaultFixedAmounts, {}
      );

      // Les revenus et dépenses récurrents doivent apparaître chaque mois
      expect(result[0].revenues.custom).toHaveLength(1);
      expect(result[0].revenues.custom[0].amount).toBe(2000);
      expect(result[0].expenses.custom).toHaveLength(1);
      expect(result[0].expenses.custom[0].amount).toBe(50);

      expect(result[1].revenues.custom).toHaveLength(1);
      expect(result[1].expenses.custom).toHaveLength(1);
    });
  });
});
