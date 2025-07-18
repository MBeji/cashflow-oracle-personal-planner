import { MonthlyData } from '@/types/cashflow';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency, getMonthName, isLowBalance } from '@/utils/cashflow';
import { cn } from '@/lib/utils';

interface MonthlyForecastProps {
  data: MonthlyData[];
  alertThreshold: number;
}

export function MonthlyForecast({ data, alertThreshold }: MonthlyForecastProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Prévision sur 20 mois</h2>
      
      <div className="grid gap-4">
        {data.map((month, index) => {
          const totalRevenues = month.revenues.salary + month.revenues.fuel + 
                                month.revenues.healthInsurance + month.revenues.bonus;
          const totalExpenses = month.expenses.debt + month.expenses.currentExpenses + 
                                month.expenses.fuel + month.expenses.healthInsurance + 
                                month.expenses.vacation + month.expenses.school + 
                                month.expenses.custom.reduce((sum, exp) => sum + exp.amount, 0) +
                                month.expenses.chantier;
          
          const isAlert = isLowBalance(month.endingBalance, alertThreshold);
          
          return (
            <Card key={index} className={cn(isAlert && "border-destructive")}>
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>{getMonthName(month.month)} {month.year}</span>
                  <span className={cn(
                    "text-lg font-bold",
                    isAlert ? "text-destructive" : "text-success"
                  )}>
                    {formatCurrency(month.endingBalance)}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <h4 className="font-semibold text-muted-foreground mb-2">Solde début</h4>
                    <p className="text-lg">{formatCurrency(month.startingBalance)}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-success mb-2">Revenus total</h4>
                    <p className="text-lg text-success">{formatCurrency(totalRevenues)}</p>
                    <div className="mt-1 space-y-1 text-xs text-muted-foreground">
                      <div>Salaire: {formatCurrency(month.revenues.salary)}</div>
                      <div>Carburant: {formatCurrency(month.revenues.fuel)}</div>
                      <div>Assurance: {formatCurrency(month.revenues.healthInsurance)}</div>
                      {month.revenues.bonus > 0 && (
                        <div>Bonus: {formatCurrency(month.revenues.bonus)}</div>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-destructive mb-2">Dépenses total</h4>
                    <p className="text-lg text-destructive">{formatCurrency(totalExpenses)}</p>
                    <div className="mt-1 space-y-1 text-xs text-muted-foreground">
                      <div>Dette: {formatCurrency(month.expenses.debt)}</div>
                      <div>Dép. courantes: {formatCurrency(month.expenses.currentExpenses)}</div>
                      <div>Carburant: {formatCurrency(month.expenses.fuel)}</div>
                      <div>Assurance: {formatCurrency(month.expenses.healthInsurance)}</div>
                      {month.expenses.vacation > 0 && (
                        <div>Vacances: {formatCurrency(month.expenses.vacation)}</div>
                      )}
                      {month.expenses.school > 0 && (
                        <div>École: {formatCurrency(month.expenses.school)}</div>
                      )}
                      {month.expenses.chantier > 0 && (
                        <div>Chantier: {formatCurrency(month.expenses.chantier)}</div>
                      )}
                      {month.expenses.custom.map((exp, i) => (
                        <div key={i}>{exp.name}: {formatCurrency(exp.amount)}</div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}