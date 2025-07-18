import { MonthlyData, CustomExpense } from '@/types/cashflow';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { formatCurrency, getMonthName, isLowBalance } from '@/utils/cashflow';
import { cn } from '@/lib/utils';

interface MonthlyForecastProps {
  data: MonthlyData[];
  alertThreshold: number;
  onVacationChange: (monthKey: string, amount: number) => void;
  onChantierChange: (monthKey: string, amount: number) => void;
  onCustomExpenseChange: (monthKey: string, amount: number) => void;
  vacationExpenses: { [key: string]: number };
  chantierExpenses: { [key: string]: number };
  customExpenses: { [key: string]: number };
}

export function MonthlyForecast({ 
  data, 
  alertThreshold, 
  onVacationChange, 
  onChantierChange, 
  onCustomExpenseChange,
  vacationExpenses,
  chantierExpenses,
  customExpenses
}: MonthlyForecastProps) {
  
  const handleVacationChange = (monthKey: string, value: string) => {
    const amount = Number(value) || 0;
    onVacationChange(monthKey, amount);
  };

  const handleChantierChange = (monthKey: string, value: string) => {
    const amount = Number(value) || 0;
    onChantierChange(monthKey, amount);
  };

  const handleCustomChange = (monthKey: string, value: string) => {
    const amount = Number(value) || 0;
    onCustomExpenseChange(monthKey, amount);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Prévision sur 20 mois</h2>
      
      <div className="grid gap-4">
        {data.map((month, index) => {
          const monthKey = `${month.year}-${month.month.toString().padStart(2, '0')}`;
          const totalRevenues = month.revenues.salary + month.revenues.fuel + 
                                month.revenues.healthInsurance + month.revenues.bonus;
          
          // Récupérer les valeurs des dépenses éditables
          const vacationAmount = vacationExpenses[monthKey] || 0;
          const chantierAmount = chantierExpenses[monthKey] || 0;
          const customAmount = customExpenses[monthKey] || 0;
          
          const totalExpenses = month.expenses.debt + month.expenses.currentExpenses + 
                                month.expenses.fuel + month.expenses.healthInsurance + 
                                vacationAmount + month.expenses.school + 
                                month.expenses.custom.reduce((sum, exp) => sum + exp.amount, 0) +
                                chantierAmount + customAmount;
          
          const endingBalance = month.startingBalance + totalRevenues - totalExpenses;
          const isAlert = isLowBalance(endingBalance, alertThreshold);
          
          // Vérifier si les vacances sont éditables (juillet/août seulement)
          const canEditVacation = month.month === 7 || month.month === 8;
          
          return (
            <Card key={index} className={cn(isAlert && "border-destructive")}>
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>{getMonthName(month.month)} {month.year}</span>
                  <span className={cn(
                    "text-lg font-bold",
                    isAlert ? "text-destructive" : "text-success"
                  )}>
                    {formatCurrency(endingBalance)}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 text-sm">
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
                    <h4 className="font-semibold text-destructive mb-2">Dépenses fixes</h4>
                    <div className="mt-1 space-y-1 text-xs text-muted-foreground">
                      <div>Dette: {formatCurrency(month.expenses.debt)}</div>
                      <div>Dép. courantes: {formatCurrency(month.expenses.currentExpenses)}</div>
                      <div>Carburant: {formatCurrency(month.expenses.fuel)}</div>
                      <div>Assurance: {formatCurrency(month.expenses.healthInsurance)}</div>
                      {month.expenses.school > 0 && (
                        <div>École: {formatCurrency(month.expenses.school)}</div>
                      )}
                      {month.expenses.custom.map((exp, i) => (
                        <div key={i}>{exp.name}: {formatCurrency(exp.amount)}</div>
                      ))}
                    </div>
                  </div>

                  {/* Colonne Vacances */}
                  <div>
                    <h4 className="font-semibold text-warning mb-2">Vacances</h4>
                    {canEditVacation ? (
                      <Input
                        type="number"
                        value={vacationAmount}
                        onChange={(e) => handleVacationChange(monthKey, e.target.value)}
                        placeholder="0"
                        className="w-full text-sm"
                      />
                    ) : (
                      <p className="text-muted-foreground text-sm">Non applicable</p>
                    )}
                    {vacationAmount > 0 && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatCurrency(vacationAmount)}
                      </p>
                    )}
                  </div>

                  {/* Colonne Chantier + Autres */}
                  <div>
                    <h4 className="font-semibold text-warning mb-2">Chantier</h4>
                    <Input
                      type="number"
                      value={chantierAmount}
                      onChange={(e) => handleChantierChange(monthKey, e.target.value)}
                      placeholder="0"
                      className="w-full text-sm mb-2"
                    />
                    
                    <h4 className="font-semibold text-warning mb-2 mt-3">Autres dépenses</h4>
                    <Input
                      type="number"
                      value={customAmount}
                      onChange={(e) => handleCustomChange(monthKey, e.target.value)}
                      placeholder="0"
                      className="w-full text-sm"
                    />
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t flex justify-between items-center">
                  <span className="font-semibold">Total dépenses:</span>
                  <span className="font-bold text-destructive">{formatCurrency(totalExpenses)}</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}