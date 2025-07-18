import { MonthlyData } from '@/types/cashflow';
import { Card, CardContent } from '@/components/ui/card';
import { formatCurrency, getMonthName } from '@/utils/cashflow';
import { cn } from '@/lib/utils';

interface CompactViewProps {
  data: MonthlyData[];
  alertThreshold: number;
  onMonthClick: (index: number) => void;
  vacationExpenses: { [key: string]: number };
  chantierExpenses: { [key: string]: number };
  customExpenses: { [key: string]: number };
}

export function CompactView({ 
  data, 
  alertThreshold, 
  onMonthClick, 
  vacationExpenses, 
  chantierExpenses, 
  customExpenses 
}: CompactViewProps) {
  const isCurrentMonth = (month: number, year: number) => {
    const now = new Date();
    return month === now.getMonth() + 1 && year === now.getFullYear();
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Vue compacte</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">        {data.map((month, index) => {
          const monthKey = `${month.year}-${month.month.toString().padStart(2, '0')}`;
          const isCurrentMonthData = isCurrentMonth(month.month, month.year);
          
          // Récupérer les valeurs des dépenses éditables
          const vacationAmount = vacationExpenses[monthKey] || 0;
          const chantierAmount = chantierExpenses[monthKey] || 0;
          const customAmount = customExpenses[monthKey] || 0;
          
          // Calculer les revenus en excluant les fixes pour le mois en cours
          let totalRevenues = 0;
          if (!isCurrentMonthData) {
            totalRevenues = month.revenues.salary + month.revenues.fuel + 
                           month.revenues.healthInsurance + month.revenues.bonus;
          }
          totalRevenues += month.revenues.custom.reduce((sum, rev) => sum + rev.amount, 0);
          
          // Calculer les dépenses en excluant les fixes pour le mois en cours
          let totalExpenses = vacationAmount + month.expenses.school + 
                             month.expenses.custom.reduce((sum, exp) => sum + exp.amount, 0) +
                             chantierAmount + customAmount;
          if (!isCurrentMonthData) {
            totalExpenses += month.expenses.debt + month.expenses.currentExpenses + 
                            month.expenses.fuel + month.expenses.healthInsurance;
          }

          // Recalculer le solde de fin avec la logique du mois en cours
          const endingBalance = month.startingBalance + totalRevenues - totalExpenses;
          const isAlert = endingBalance < alertThreshold;

          return (
            <Card 
              key={index}
              className={cn(
                "cursor-pointer hover:shadow-md transition-shadow",
                isAlert && "border-destructive"
              )}
              onClick={() => onMonthClick(index)}
            >
              <CardContent className="p-3">
                <div className="text-center space-y-1">
                  <p className="text-xs font-medium text-muted-foreground">
                    {getMonthName(month.month).substring(0, 3)} {month.year}
                    {isCurrentMonthData && <span className="ml-1">🔄</span>}
                  </p>
                  
                  <div className={cn(
                    "text-sm font-bold",
                    isAlert ? "text-destructive" : "text-success"
                  )}>
                    {formatCurrency(endingBalance)}
                  </div>
                  
                  <div className="text-xs space-y-0.5 text-muted-foreground">
                    <div className="flex justify-between">
                      <span>+{formatCurrency(totalRevenues)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>-{formatCurrency(totalExpenses)}</span>
                    </div>
                  </div>
                  
                  {isCurrentMonthData && (
                    <div className="text-xs text-muted-foreground italic">
                      Fixes exclus
                    </div>
                  )}
                  
                  {isAlert && (
                    <div className="text-xs text-destructive font-medium">
                      ⚠️ Alerte
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
