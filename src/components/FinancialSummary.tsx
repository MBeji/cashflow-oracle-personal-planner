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

  // Calcul des revenus totaux
  const totalRevenues = data.reduce((sum, month) => {
    const customRevenues = month.revenues.custom.reduce((revSum, rev) => revSum + rev.amount, 0);
    return sum + month.revenues.salary + month.revenues.fuel + 
           month.revenues.healthInsurance + month.revenues.bonus + customRevenues;
  }, 0);

  // Calcul des dépenses totales (hors remboursement de dette)
  const totalExpensesWithoutDebt = data.reduce((sum, month) => {
    return sum + month.expenses.currentExpenses + 
           month.expenses.fuel + month.expenses.healthInsurance + 
           month.expenses.vacation + month.expenses.school + 
           month.expenses.custom.reduce((expSum, exp) => expSum + exp.amount, 0) +
           month.expenses.chantier;
  }, 0);

  // Calcul des moyennes mensuelles
  const avgMonthlyIncome = totalRevenues / data.length;
  const avgMonthlyExpensesWithoutDebt = totalExpensesWithoutDebt / data.length;
  const avgMonthlySavingsCapacity = avgMonthlyIncome - avgMonthlyExpensesWithoutDebt;
  const savingsRate = avgMonthlyIncome > 0 ? (avgMonthlySavingsCapacity / avgMonthlyIncome) * 100 : 0;
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Revenus moyens</CardTitle>
          <DollarSign className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">
            {formatCurrency(avgMonthlyIncome)}
          </div>
          <p className="text-xs text-muted-foreground">
            Par mois sur {data.length} mois
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
          </div>
          <p className="text-xs text-muted-foreground">
            Par mois (hors dette)
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
            {avgMonthlySavingsCapacity >= 0 ? '+' : ''}{formatCurrency(avgMonthlySavingsCapacity)}
          </div>
          <p className="text-xs text-muted-foreground">
            Épargne moyenne/mois
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
          </div>
          <p className="text-xs text-muted-foreground">
            % des revenus épargnés
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
