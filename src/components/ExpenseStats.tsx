import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart, TrendingUp, TrendingDown } from 'lucide-react';
import { ExpenseSettings, MonthlyExpenseBreakdown } from '@/types/cashflow';

interface ExpenseStatsProps {
  expenseSettings: ExpenseSettings;
  currentDate: Date;
}

export function ExpenseStats({ expenseSettings, currentDate }: ExpenseStatsProps) {
  const getCurrentAndPreviousBreakdowns = () => {
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    
    const current = expenseSettings.monthlyBreakdowns?.find(
      b => b.month === currentMonth && b.year === currentYear
    );
    
    const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const previousYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    
    const previous = expenseSettings.monthlyBreakdowns?.find(
      b => b.month === previousMonth && b.year === previousYear
    );
    
    return { current, previous };
  };

  const { current, previous } = getCurrentAndPreviousBreakdowns();
  
  if (!current && !expenseSettings.defaultCategories?.length) {
    return null;
  }

  const currentBreakdown = current || {
    month: currentDate.getMonth(),
    year: currentDate.getFullYear(),
    categories: expenseSettings.defaultCategories || [],
    subcategories: expenseSettings.defaultSubcategories || [],
    totalAmount: (expenseSettings.defaultCategories || []).reduce((sum, cat) => sum + cat.amount, 0)
  };

  const getTrendIcon = (currentAmount: number, previousAmount?: number) => {
    if (!previousAmount) return null;
    
    if (currentAmount > previousAmount) {
      return <TrendingUp className="h-4 w-4 text-red-500" />;
    } else if (currentAmount < previousAmount) {
      return <TrendingDown className="h-4 w-4 text-green-500" />;
    }
    return null;
  };

  const getTrendPercentage = (currentAmount: number, previousAmount?: number) => {
    if (!previousAmount || previousAmount === 0) return null;
    
    const change = ((currentAmount - previousAmount) / previousAmount) * 100;
    return change.toFixed(1);
  };

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart className="h-5 w-5" />
          Statistiques des Dépenses
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {currentBreakdown.categories.map(category => {
            const previousCategory = previous?.categories.find(c => c.id === category.id);
            const percentage = ((category.amount / currentBreakdown.totalAmount) * 100).toFixed(1);
            const trendPercentage = getTrendPercentage(category.amount, previousCategory?.amount);
            
            return (
              <div key={category.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: category.color }}
                    />
                    <span className="font-medium text-sm">{category.name}</span>
                  </div>
                  {getTrendIcon(category.amount, previousCategory?.amount)}
                </div>
                
                <div className="space-y-1">
                  <div className="text-lg font-bold">
                    {category.amount.toLocaleString()} TND
                  </div>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="text-xs">
                      {percentage}% du total
                    </Badge>
                    {trendPercentage && (
                      <Badge 
                        variant={parseFloat(trendPercentage) > 0 ? "destructive" : "default"}
                        className="text-xs"
                      >
                        {parseFloat(trendPercentage) > 0 ? '+' : ''}{trendPercentage}%
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium">Total des dépenses courantes</span>
            {previous && (
              <div className="flex items-center gap-2">
                {getTrendIcon(currentBreakdown.totalAmount, previous.totalAmount)}
                {getTrendPercentage(currentBreakdown.totalAmount, previous.totalAmount) && (
                  <Badge 
                    variant={currentBreakdown.totalAmount > previous.totalAmount ? "destructive" : "default"}
                    className="text-xs"
                  >
                    {currentBreakdown.totalAmount > previous.totalAmount ? '+' : ''}
                    {getTrendPercentage(currentBreakdown.totalAmount, previous.totalAmount)}%
                  </Badge>
                )}
              </div>
            )}
          </div>
          <div className="text-xl font-bold">
            {currentBreakdown.totalAmount.toLocaleString()} TND
          </div>
          {previous && (
            <div className="text-sm text-gray-600 mt-1">
              Mois précédent: {previous.totalAmount.toLocaleString()} TND
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
