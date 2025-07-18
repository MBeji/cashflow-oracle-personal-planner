import { MonthlyData } from '@/types/cashflow';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/utils/cashflow';
import { TrendingUp, TrendingDown, AlertTriangle, Target } from 'lucide-react';

interface FinancialSummaryProps {
  data: MonthlyData[];
  alertThreshold: number;
}

export function FinancialSummary({ data, alertThreshold }: FinancialSummaryProps) {
  if (data.length === 0) return null;

  const firstMonth = data[0];
  const lastMonth = data[data.length - 1];
  const totalRevenues = data.reduce((sum, month) => {
    const customRevenues = month.revenues.custom.reduce((revSum, rev) => revSum + rev.amount, 0);
    return sum + month.revenues.salary + month.revenues.fuel + 
           month.revenues.healthInsurance + month.revenues.bonus + customRevenues;
  }, 0);

  const totalExpenses = data.reduce((sum, month) => {
    return sum + month.expenses.debt + month.expenses.currentExpenses + 
           month.expenses.fuel + month.expenses.healthInsurance + 
           month.expenses.vacation + month.expenses.school + 
           month.expenses.custom.reduce((expSum, exp) => expSum + exp.amount, 0) +
           month.expenses.chantier;
  }, 0);

  const netChange = lastMonth.endingBalance - firstMonth.startingBalance;
  const monthlyAverage = netChange / data.length;
  const alertMonths = data.filter(month => month.endingBalance < alertThreshold).length;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Évolution</CardTitle>
          {netChange >= 0 ? (
            <TrendingUp className="h-4 w-4 text-success" />
          ) : (
            <TrendingDown className="h-4 w-4 text-destructive" />
          )}
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${netChange >= 0 ? 'text-success' : 'text-destructive'}`}>
            {netChange >= 0 ? '+' : ''}{formatCurrency(netChange)}
          </div>
          <p className="text-xs text-muted-foreground">
            Sur {data.length} mois
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Moyenne/mois</CardTitle>
          <Target className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${monthlyAverage >= 0 ? 'text-success' : 'text-destructive'}`}>
            {monthlyAverage >= 0 ? '+' : ''}{formatCurrency(monthlyAverage)}
          </div>
          <p className="text-xs text-muted-foreground">
            Économie mensuelle
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Mois d'alerte</CardTitle>
          <AlertTriangle className="h-4 w-4 text-warning" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-warning">{alertMonths}</div>
          <p className="text-xs text-muted-foreground">
            Sous le seuil ({formatCurrency(alertThreshold)})
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Solde final</CardTitle>
          {lastMonth.endingBalance >= alertThreshold ? (
            <TrendingUp className="h-4 w-4 text-success" />
          ) : (
            <AlertTriangle className="h-4 w-4 text-destructive" />
          )}
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${lastMonth.endingBalance >= alertThreshold ? 'text-success' : 'text-destructive'}`}>
            {formatCurrency(lastMonth.endingBalance)}
          </div>
          <p className="text-xs text-muted-foreground">
            Projection finale
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
