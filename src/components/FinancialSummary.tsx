import { MonthlyData } from '@/types/cashflow';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/utils/cashflow';
import { TrendingUp, TrendingDown, DollarSign, Target, PiggyBank, Percent } from 'lucide-react';

interface FinancialSummaryProps {
  data: MonthlyData[];
  alertThreshold: number;
}

export function FinancialSummary({ data, alertThreshold }: FinancialSummaryProps) {
  if (data.length === 0) return null;

  // Obtenir toujours 12 mois consécutifs complets
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1; // 1-12
  
  // Créer une liste de 12 mois consécutifs à partir des données disponibles
  const get12ConsecutiveMonths = () => {
    // Trouver le premier mois disponible dans les données
    const availableMonths = data
      .map(month => ({ year: month.year, month: month.month }))
      .sort((a, b) => a.year === b.year ? a.month - b.month : a.year - b.year);
    
    if (availableMonths.length === 0) return [];
    
    const firstAvailable = availableMonths[0];
    const months12 = [];
    
    // Générer 12 mois consécutifs à partir du premier mois disponible
    for (let i = 0; i < 12; i++) {
      const targetMonth = firstAvailable.month + i;
      const targetYear = firstAvailable.year + Math.floor((targetMonth - 1) / 12);
      const normalizedMonth = ((targetMonth - 1) % 12) + 1;
      
      months12.push({ year: targetYear, month: normalizedMonth });
    }
    
    return months12;
  };

  const target12Months = get12ConsecutiveMonths();
  if (target12Months.length === 0) return null;

  // Filtrer les données pour ces 12 mois spécifiques
  const yearlyData = data.filter(month => 
    target12Months.some(target => 
      target.year === month.year && target.month === month.month
    )
  );

  // Séparer les données passées et futures
  const pastMonths = yearlyData.filter(month => 
    month.year < currentYear || 
    (month.year === currentYear && month.month <= currentMonth)
  );
  const futureMonths = yearlyData.filter(month => 
    month.year > currentYear || 
    (month.year === currentYear && month.month > currentMonth)
  );

  // Calcul des revenus et dépenses
  const calculateTotals = (months: typeof yearlyData) => {
    const revenues = months.reduce((sum, month) => {
      const customRevenues = month.revenues.custom.reduce((revSum, rev) => revSum + rev.amount, 0);
      return sum + month.revenues.salary + month.revenues.fuel + 
             month.revenues.healthInsurance + month.revenues.bonus + customRevenues;
    }, 0);

    const expenses = months.reduce((sum, month) => {
      return sum + month.expenses.currentExpenses + 
             month.expenses.fuel + month.expenses.healthInsurance + 
             month.expenses.vacation + month.expenses.school + 
             month.expenses.custom.reduce((expSum, exp) => expSum + exp.amount, 0) +
             month.expenses.chantier;
    }, 0);

    return { revenues, expenses };
  };

  const pastTotals = calculateTotals(pastMonths);
  const futureTotals = calculateTotals(futureMonths);

  // Total annuel combiné (réel + prévisionnel)
  const totalRevenues = pastTotals.revenues + futureTotals.revenues;
  const totalExpensesWithoutDebt = pastTotals.expenses + futureTotals.expenses;
  // Calcul des moyennes mensuelles sur 12 mois consécutifs complets
  const avgMonthlyIncome = totalRevenues / 12; // Toujours divisé par 12 mois
  const avgMonthlyExpensesWithoutDebt = totalExpensesWithoutDebt / 12;
  const avgMonthlySavingsCapacity = avgMonthlyIncome - avgMonthlyExpensesWithoutDebt;
  const savingsRate = avgMonthlyIncome > 0 ? (avgMonthlySavingsCapacity / avgMonthlyIncome) * 100 : 0;
  
  // Générer le libellé de la période (ex: "Août 2025 - Juil 2026")
  const monthNames = [
    'Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun',
    'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'
  ];
  
  const firstMonth = target12Months[0];
  const lastMonth = target12Months[11];
  const periodLabel = `${monthNames[firstMonth.month - 1]} ${firstMonth.year} - ${monthNames[lastMonth.month - 1]} ${lastMonth.year}`;
  
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Revenus moyens</CardTitle>
          <DollarSign className="h-4 w-4 text-green-500" />
        </CardHeader>        <CardContent>
          <div className="text-2xl font-bold text-green-600">
            {formatCurrency(avgMonthlyIncome)}
          </div>          <p className="text-xs text-muted-foreground">
            Moyenne sur 12 mois ({periodLabel})
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Dépenses moyennes</CardTitle>
          <Target className="h-4 w-4 text-red-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">
            {formatCurrency(avgMonthlyExpensesWithoutDebt)}
          </div>          <p className="text-xs text-muted-foreground">
            Moyenne sur 12 mois (hors dette)
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Capacité d'épargne</CardTitle>
          <PiggyBank className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${avgMonthlySavingsCapacity >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {avgMonthlySavingsCapacity >= 0 ? '+' : ''}{formatCurrency(avgMonthlySavingsCapacity)}          </div>          <p className="text-xs text-muted-foreground">
            Épargne sur 12 mois
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Taux d'épargne</CardTitle>
          <Percent className="h-4 w-4 text-purple-500" />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${savingsRate >= 10 ? 'text-green-600' : savingsRate >= 0 ? 'text-orange-500' : 'text-red-600'}`}>
            {savingsRate.toFixed(1)}%
          </div>          <p className="text-xs text-muted-foreground">
            Performance sur 12 mois
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
