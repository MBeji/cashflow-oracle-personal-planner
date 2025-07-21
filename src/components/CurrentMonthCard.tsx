import { MonthlyData } from '@/types/cashflow';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { formatCurrency, getMonthName, isLowBalance } from '@/utils/cashflow';
import { cn } from '@/lib/utils';
import { Calendar, TrendingDown } from 'lucide-react';
import { useState, useEffect } from 'react';

interface CurrentMonthCardProps {
  currentBalance: number;
  onCurrentBalanceChange: (value: number) => void;
  monthData: MonthlyData;
  alertThreshold: number;
  onExpenseForecastChange?: (forecast: number) => void;
  initialExpenseForecast?: number;
}

export function CurrentMonthCard({
  currentBalance,
  onCurrentBalanceChange,
  monthData,
  alertThreshold,
  onExpenseForecastChange,
  initialExpenseForecast = 0
}: CurrentMonthCardProps) {
  const [expenseForecast, setExpenseForecast] = useState(initialExpenseForecast);
  // Calculer le solde de fin de mois basé sur la prévision de dépenses
  const projectedEndBalance = currentBalance - expenseForecast;
  const isLowBalanceResult = isLowBalance(projectedEndBalance, alertThreshold);
  
  // Synchroniser avec la valeur initiale uniquement si elle change
  useEffect(() => {
    if (initialExpenseForecast !== expenseForecast) {
      setExpenseForecast(initialExpenseForecast);
    }
  }, [initialExpenseForecast]);
  const handleExpenseForecastChange = (value: string) => {
    const amount = Number(value) || 0;
    setExpenseForecast(amount);
    // Informer le parent de la modification
    onExpenseForecastChange?.(amount);
  };

  return (
    <Card className={cn(
      "border-2 shadow-lg",
      isLowBalanceResult ? "border-destructive" : "border-primary"
    )}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            <span className="text-lg">{getMonthName(monthData.month)} {monthData.year}</span>
            <Badge variant="secondary" className="bg-primary/10 text-primary text-xs">
              Mois actuel
            </Badge>
          </div>
          {isLowBalanceResult && (
            <Badge variant="destructive" className="text-xs">
              Alerte solde bas
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Section Soldes - Layout compact */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="space-y-1">
            <Label htmlFor="currentBalance" className="text-xs font-medium text-muted-foreground">
              Solde actuel (TND)
            </Label>
            <Input
              id="currentBalance"
              type="number"
              value={currentBalance}
              onChange={(e) => onCurrentBalanceChange(Number(e.target.value))}
              className="font-semibold h-9"
            />
          </div>
          
          <div className="space-y-1">
            <Label htmlFor="expenseForecast" className="text-xs font-medium text-muted-foreground">
              Prévisions de dépenses
            </Label>
            <Input
              id="expenseForecast"
              type="number"
              value={expenseForecast}
              onChange={(e) => handleExpenseForecastChange(e.target.value)}
              className="font-semibold h-9 text-destructive"
            />
          </div>
          
          <div className="space-y-1">
            <Label className="text-xs font-medium text-muted-foreground">Solde fin de mois</Label>
            <div className={cn(
              "flex items-center gap-2 p-2 rounded-md font-semibold h-9",
              projectedEndBalance < alertThreshold ? "text-destructive bg-destructive/10" : "text-success bg-success/10"
            )}>
              {projectedEndBalance < alertThreshold && <TrendingDown className="h-3 w-3" />}
              {formatCurrency(projectedEndBalance)}
            </div>
          </div>
        </div>

        {/* Affichage des revenus variables s'il y en a */}
        {monthData.revenues.custom.length > 0 && (
          <div className="pt-2 border-t">
            <Label className="text-xs font-medium text-success mb-2 block">Revenus variables prévus</Label>
            <div className="space-y-1">
              {monthData.revenues.custom.map((revenue, index) => (
                <div key={index} className="flex justify-between items-center text-xs p-2 bg-success/5 rounded">
                  <span>{revenue.name}</span>
                  <span className="font-medium text-success">{formatCurrency(revenue.amount)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
