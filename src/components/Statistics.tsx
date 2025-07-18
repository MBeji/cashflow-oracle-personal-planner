import { MonthlyData } from '@/types/cashflow';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/utils/cashflow';
import { TrendingUp, TrendingDown, AlertTriangle, DollarSign } from 'lucide-react';

interface StatisticsProps {
  data: MonthlyData[];
  alertThreshold: number;
}

export function Statistics({ data, alertThreshold }: StatisticsProps) {
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

  const netCashFlow = totalRevenues - totalExpenses;
  const finalBalance = data[data.length - 1]?.endingBalance || 0;
  const alertMonths = data.filter(month => month.endingBalance < alertThreshold).length;

  // Detailed expense breakdown
  const expenseBreakdown = {
    debt: data.reduce((sum, month) => sum + month.expenses.debt, 0),
    currentExpenses: data.reduce((sum, month) => sum + month.expenses.currentExpenses, 0),
    fuel: data.reduce((sum, month) => sum + month.expenses.fuel, 0),
    healthInsurance: data.reduce((sum, month) => sum + month.expenses.healthInsurance, 0),
    vacation: data.reduce((sum, month) => sum + month.expenses.vacation, 0),
    school: data.reduce((sum, month) => sum + month.expenses.school, 0),
    custom: data.reduce((sum, month) => sum + month.expenses.custom.reduce((expSum, exp) => expSum + exp.amount, 0), 0),
    chantier: data.reduce((sum, month) => sum + month.expenses.chantier, 0),
  };
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Statistiques globales</h2>
      
      {/* Explanation note */}
      <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <p className="text-sm text-blue-800 dark:text-blue-200">
          💡 <strong>Note importante :</strong> Les salaires et bonus sont versés en fin de mois et comptabilisés comme disponibles le mois suivant.
          <br />
          Par exemple : le salaire de juillet (versé le 31/07) est utilisable pour couvrir les dépenses d'août.
        </p>
      </div>
      
      {/* Key metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenus</CardTitle>
            <TrendingUp className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{formatCurrency(totalRevenues)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Dépenses</CardTitle>
            <TrendingDown className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{formatCurrency(totalExpenses)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cash Flow Net</CardTitle>
            <DollarSign className={`h-4 w-4 ${netCashFlow >= 0 ? 'text-success' : 'text-destructive'}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${netCashFlow >= 0 ? 'text-success' : 'text-destructive'}`}>
              {formatCurrency(netCashFlow)}
            </div>
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
              sur {data.length} mois
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Répartition détaillée des dépenses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Dette mensuelle:</span>
                <span className="font-semibold">{formatCurrency(expenseBreakdown.debt)}</span>
              </div>
              <div className="flex justify-between">
                <span>Dépenses courantes:</span>
                <span className="font-semibold">{formatCurrency(expenseBreakdown.currentExpenses)}</span>
              </div>
              <div className="flex justify-between">
                <span>Carburant (consommé):</span>
                <span className="font-semibold">{formatCurrency(expenseBreakdown.fuel)}</span>
              </div>
              <div className="flex justify-between">
                <span>Assurance santé (consommée):</span>
                <span className="font-semibold">{formatCurrency(expenseBreakdown.healthInsurance)}</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Vacances:</span>
                <span className="font-semibold">{formatCurrency(expenseBreakdown.vacation)}</span>
              </div>
              <div className="flex justify-between">
                <span>École enfants:</span>
                <span className="font-semibold">{formatCurrency(expenseBreakdown.school)}</span>
              </div>
              <div className="flex justify-between">
                <span>Chantier:</span>
                <span className="font-semibold">{formatCurrency(expenseBreakdown.chantier)}</span>
              </div>
              <div className="flex justify-between">
                <span>Dépenses personnalisées:</span>
                <span className="font-semibold">{formatCurrency(expenseBreakdown.custom)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Final balance prediction */}
      <Card>
        <CardHeader>
          <CardTitle>Projection finale</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-2">
            <p className="text-lg">Solde prévu après 20 mois:</p>
            <p className={`text-3xl font-bold ${finalBalance >= alertThreshold ? 'text-success' : 'text-destructive'}`}>
              {formatCurrency(finalBalance)}
            </p>
            {finalBalance < alertThreshold && (
              <p className="text-sm text-destructive">
                ⚠️ Le solde final sera inférieur au seuil d'alerte
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}