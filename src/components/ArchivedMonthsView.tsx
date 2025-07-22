import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArchivedMonth } from '@/types/cashflow';
import { formatCurrency } from '@/utils/cashflow';
import { Archive, ChevronDown, ChevronUp, FileText, TrendingUp, TrendingDown } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface ArchivedMonthsViewProps {
  archivedMonths: ArchivedMonth[];
  className?: string;
}

export function ArchivedMonthsView({ archivedMonths, className }: ArchivedMonthsViewProps) {
  const [expandedMonths, setExpandedMonths] = useState<Set<string>>(new Set());

  const monthNames = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];

  const toggleMonth = (monthKey: string) => {
    const newExpanded = new Set(expandedMonths);
    if (newExpanded.has(monthKey)) {
      newExpanded.delete(monthKey);
    } else {
      newExpanded.add(monthKey);
    }
    setExpandedMonths(newExpanded);
  };

  const calculateTotals = (month: ArchivedMonth) => {
    const plannedRevenues = month.plannedData.revenues.salary + 
                           month.plannedData.revenues.fuel + 
                           month.plannedData.revenues.healthInsurance + 
                           month.plannedData.revenues.bonus +
                           month.plannedData.revenues.custom.reduce((sum, rev) => sum + rev.amount, 0);

    const actualRevenues = month.actualData.revenues.salary + 
                          month.actualData.revenues.fuel + 
                          month.actualData.revenues.healthInsurance + 
                          month.actualData.revenues.bonus +
                          month.actualData.revenues.custom.reduce((sum, rev) => sum + rev.amount, 0);

    const plannedExpenses = month.plannedData.expenses.debt + 
                           month.plannedData.expenses.currentExpenses + 
                           month.plannedData.expenses.fuel + 
                           month.plannedData.expenses.healthInsurance + 
                           month.plannedData.expenses.vacation + 
                           month.plannedData.expenses.school + 
                           month.plannedData.expenses.chantier +
                           month.plannedData.expenses.custom.reduce((sum, exp) => sum + exp.amount, 0);

    const actualExpenses = month.actualData.expenses.debt + 
                          month.actualData.expenses.currentExpenses + 
                          month.actualData.expenses.fuel + 
                          month.actualData.expenses.healthInsurance + 
                          month.actualData.expenses.vacation + 
                          month.actualData.expenses.school + 
                          month.actualData.expenses.chantier +
                          month.actualData.expenses.custom.reduce((sum, exp) => sum + exp.amount, 0);

    return {
      plannedRevenues,
      actualRevenues,
      plannedExpenses,
      actualExpenses,
      revenueDifference: actualRevenues - plannedRevenues,
      expenseDifference: actualExpenses - plannedExpenses,
      balanceDifference: month.actualData.endingBalance - month.plannedData.endingBalance
    };
  };

  const sortedArchivedMonths = [...archivedMonths].sort((a, b) => {
    if (a.year !== b.year) return b.year - a.year;
    return b.month - a.month;
  });

  if (archivedMonths.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Archive className="h-5 w-5" />
            Mois archivés
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Archive className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>Aucun mois archivé pour le moment</p>
            <p className="text-sm">Les mois archivés apparaîtront ici</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Archive className="h-5 w-5" />
            Mois archivés ({archivedMonths.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sortedArchivedMonths.map((month) => {
              const monthKey = `${month.year}-${month.month}`;
              const isExpanded = expandedMonths.has(monthKey);
              const totals = calculateTotals(month);

              return (
                <Collapsible key={monthKey}>
                  <Card className="border-l-4 border-l-blue-500">
                    <CollapsibleTrigger asChild>
                      <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Archive className="h-4 w-4 text-blue-600" />
                            <div>
                              <CardTitle className="text-base">
                                {monthNames[month.month - 1]} {month.year}
                              </CardTitle>
                              <p className="text-sm text-muted-foreground">
                                Archivé le {new Date(month.archivedAt).toLocaleDateString('fr-FR')}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="text-right">
                              <div className="flex items-center gap-2">
                                {totals.balanceDifference >= 0 ? (
                                  <TrendingUp className="h-4 w-4 text-green-600" />
                                ) : (
                                  <TrendingDown className="h-4 w-4 text-red-600" />
                                )}
                                <span className={`font-medium ${
                                  totals.balanceDifference >= 0 ? 'text-green-600' : 'text-red-600'
                                }`}>
                                  {totals.balanceDifference >= 0 ? '+' : ''}{formatCurrency(totals.balanceDifference)}
                                </span>
                              </div>
                              <p className="text-xs text-muted-foreground">vs prévu</p>
                            </div>
                            <Button variant="ghost" size="sm">
                              {isExpanded ? (
                                <ChevronUp className="h-4 w-4" />
                              ) : (
                                <ChevronDown className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                    </CollapsibleTrigger>

                    <CollapsibleContent>
                      <CardContent className="pt-0">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {/* Revenus */}
                          <div>
                            <h4 className="font-medium text-green-700 mb-2">Revenus</h4>
                            <div className="space-y-1 text-sm">
                              <div className="flex justify-between">
                                <span>Prévu:</span>
                                <span>{formatCurrency(totals.plannedRevenues)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Réel:</span>
                                <span>{formatCurrency(totals.actualRevenues)}</span>
                              </div>
                              <div className="flex justify-between border-t pt-1">
                                <span>Différence:</span>
                                <span className={totals.revenueDifference >= 0 ? 'text-green-600' : 'text-red-600'}>
                                  {totals.revenueDifference >= 0 ? '+' : ''}{formatCurrency(totals.revenueDifference)}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Dépenses */}
                          <div>
                            <h4 className="font-medium text-red-700 mb-2">Dépenses</h4>
                            <div className="space-y-1 text-sm">
                              <div className="flex justify-between">
                                <span>Prévu:</span>
                                <span>{formatCurrency(totals.plannedExpenses)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Réel:</span>
                                <span>{formatCurrency(totals.actualExpenses)}</span>
                              </div>
                              <div className="flex justify-between border-t pt-1">
                                <span>Différence:</span>
                                <span className={totals.expenseDifference <= 0 ? 'text-green-600' : 'text-red-600'}>
                                  {totals.expenseDifference >= 0 ? '+' : ''}{formatCurrency(totals.expenseDifference)}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Solde */}
                          <div>
                            <h4 className="font-medium text-blue-700 mb-2">Solde final</h4>
                            <div className="space-y-1 text-sm">
                              <div className="flex justify-between">
                                <span>Prévu:</span>
                                <span>{formatCurrency(month.plannedData.endingBalance)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Réel:</span>
                                <span>{formatCurrency(month.actualData.endingBalance)}</span>
                              </div>
                              <div className="flex justify-between border-t pt-1">
                                <span>Différence:</span>
                                <span className={totals.balanceDifference >= 0 ? 'text-green-600' : 'text-red-600'}>
                                  {totals.balanceDifference >= 0 ? '+' : ''}{formatCurrency(totals.balanceDifference)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {month.notes && (
                          <div className="mt-4 p-3 bg-muted rounded-lg">
                            <div className="flex items-start gap-2">
                              <FileText className="h-4 w-4 text-muted-foreground mt-0.5" />
                              <div>
                                <p className="text-sm font-medium">Notes</p>
                                <p className="text-sm text-muted-foreground">{month.notes}</p>
                              </div>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </CollapsibleContent>
                  </Card>
                </Collapsible>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
