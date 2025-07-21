import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MonthlyData } from '@/types/cashflow';
import { formatCurrency, getMonthName, isLowBalance } from '@/utils/cashflow';
import { useMobileDetection } from '@/hooks/useMobile';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle } from 'lucide-react';

interface MobileFriendlyMonthCardProps {
  month: MonthlyData;
  index: number;
  alertThreshold: number;
  onClick?: () => void;
  isExpanded?: boolean;
}

export function MobileFriendlyMonthCard({
  month,
  index,
  alertThreshold,
  onClick,
  isExpanded = false
}: MobileFriendlyMonthCardProps) {
  const { isMobile } = useMobileDetection();
  const isCurrentMonth = index === 0;
  const isLowBalanceMonth = isLowBalance(month.endingBalance, alertThreshold);
  
  // Calculer les totaux
  const totalRevenue = month.revenues.salary + month.revenues.fuel + month.revenues.healthInsurance + month.revenues.bonus + 
    month.revenues.custom.reduce((sum, rev) => sum + rev.amount, 0);
  const totalExpenses = month.expenses.debt + month.expenses.currentExpenses + month.expenses.fuel + 
    month.expenses.healthInsurance + month.expenses.vacation + month.expenses.school + month.expenses.chantier +
    month.expenses.custom.reduce((sum, exp) => sum + exp.amount, 0);
  const variation = month.endingBalance - month.startingBalance;
  
  const StatusIcon = () => {
    if (isLowBalanceMonth) {
      return <AlertTriangle className="h-4 w-4 text-destructive" />;
    }
    if (variation > 0) {
      return <TrendingUp className="h-4 w-4 text-success" />;
    }
    if (variation < 0) {
      return <TrendingDown className="h-4 w-4 text-warning" />;
    }
    return <CheckCircle className="h-4 w-4 text-muted-foreground" />;
  };

  return (
    <Card 
      className={cn(
        "mobile-card transition-all duration-200 cursor-pointer hover:shadow-md",
        isCurrentMonth && "ring-2 ring-primary border-primary",
        isLowBalanceMonth && "border-destructive/50 bg-destructive/5",
        isMobile && "mobile-card touch-manipulation"
      )}
      onClick={onClick}
    >
      <CardHeader className={cn(
        "pb-3",
        isMobile && "mobile-card-header"
      )}>
        <div className="flex items-center justify-between">
          <CardTitle className={cn(
            "flex items-center gap-2",
            isMobile ? "text-base" : "text-lg"
          )}>
            <StatusIcon />
            {getMonthName(month.month)}
            {isCurrentMonth && (
              <Badge variant="default" className="text-xs">
                Actuel
              </Badge>
            )}
          </CardTitle>
          
          {isMobile && (
            <div className="text-right">
              <div className={cn(
                "font-bold",
                isLowBalanceMonth ? "text-destructive" : "text-foreground",
                "text-lg"
              )}>
                {formatCurrency(month.endingBalance)}
              </div>
              <div className="text-xs text-muted-foreground">
                {variation > 0 ? '+' : ''}
                {formatCurrency(variation)}
              </div>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className={cn(
        "pt-0",
        isMobile && "mobile-card-content"
      )}>
        {/* Version mobile compacte */}
        {isMobile && !isExpanded ? (
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Revenus</span>
              <span className="font-medium text-success">
                +{formatCurrency(totalRevenue)}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Dépenses</span>
              <span className="font-medium text-destructive">
                -{formatCurrency(totalExpenses)}
              </span>
            </div>
            <div className="h-px bg-border my-2" />
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Variation</span>
              <span className={cn(
                "font-bold",
                variation >= 0 ? "text-success" : "text-destructive"
              )}>
                {variation >= 0 ? '+' : ''}{formatCurrency(variation)}
              </span>
            </div>
          </div>
        ) : (
          /* Version desktop ou mobile étendue */
          <div className="space-y-4">
            {!isMobile && (
              <div className="text-center">
                <div className={cn(
                  "text-2xl font-bold",
                  isLowBalanceMonth ? "text-destructive" : "text-foreground"
                )}>
                  {formatCurrency(month.endingBalance)}
                </div>
                <div className="text-sm text-muted-foreground">
                  Solde fin de mois
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-success font-semibold">
                  +{formatCurrency(totalRevenue)}
                </div>
                <div className="text-xs text-muted-foreground">Revenus</div>
              </div>
              <div className="text-center">
                <div className="text-destructive font-semibold">
                  -{formatCurrency(totalExpenses)}
                </div>
                <div className="text-xs text-muted-foreground">Dépenses</div>
              </div>
            </div>

            <div className="text-center pt-2 border-t">
              <div className={cn(
                "font-bold",
                variation >= 0 ? "text-success" : "text-destructive"
              )}>
                {variation >= 0 ? '+' : ''}{formatCurrency(variation)}
              </div>
              <div className="text-xs text-muted-foreground">Variation mensuelle</div>
            </div>
          </div>
        )}

        {/* Indicateurs visuels mobiles */}
        {isMobile && (
          <div className="mt-3 flex justify-center">
            <div className="flex space-x-1">
              <div className={cn(
                "w-2 h-2 rounded-full",
                totalRevenue > 0 ? "bg-success" : "bg-muted"
              )} />
              <div className={cn(
                "w-2 h-2 rounded-full",
                variation >= 0 ? "bg-success" : "bg-destructive"
              )} />
              <div className={cn(
                "w-2 h-2 rounded-full",
                !isLowBalanceMonth ? "bg-success" : "bg-destructive"
              )} />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default MobileFriendlyMonthCard;
