import { MonthlyData, CustomExpense, MonthlyCustomExpense } from '@/types/cashflow';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { formatCurrency, getMonthName, isLowBalance } from '@/utils/cashflow';
import { cn } from '@/lib/utils';
import { X, Minus, Plus } from 'lucide-react';
import { useState } from 'react';
import { CurrentMonthCard } from './CurrentMonthCard';

interface MonthlyForecastProps {
  data: MonthlyData[];
  alertThreshold: number;
  monthsToDisplay: number;
  currentBalance: number;
  onCurrentBalanceChange: (value: number) => void;
  onCurrentMonthExpenseForecastChange?: (forecast: number) => void;
  currentMonthExpenseForecast?: number;
  onVacationChange: (monthKey: string, amount: number) => void;
  onChantierChange: (monthKey: string, amount: number) => void;
  onMonthlyCustomExpenseAdd: (monthKey: string, expense: MonthlyCustomExpense) => void;
  onMonthlyCustomExpenseRemove: (monthKey: string, expenseId: string) => void;
  vacationExpenses: { [key: string]: number };
  chantierExpenses: { [key: string]: number };
  monthlyCustomExpenses: { [key: string]: MonthlyCustomExpense[] };
}

export function MonthlyForecast({ 
  data, 
  alertThreshold, 
  monthsToDisplay,
  currentBalance,
  onCurrentBalanceChange,
  onCurrentMonthExpenseForecastChange,
  currentMonthExpenseForecast = 0,
  onVacationChange, 
  onChantierChange, 
  onMonthlyCustomExpenseAdd,
  onMonthlyCustomExpenseRemove,
  vacationExpenses,
  chantierExpenses,
  monthlyCustomExpenses
}: MonthlyForecastProps) {
    // État pour gérer les éléments supprimés pour le mois en cours
  const [hiddenRevenueItems, setHiddenRevenueItems] = useState<{[monthKey: string]: string[]}>({});
  const [hiddenExpenseItems, setHiddenExpenseItems] = useState<{[monthKey: string]: string[]}>({});
  
  // État pour gérer les formulaires d'ajout de dépenses
  const [showExpenseForm, setShowExpenseForm] = useState<{[monthKey: string]: boolean}>({});
  const [newExpenseType, setNewExpenseType] = useState<{[monthKey: string]: string}>({});
  const [newExpenseAmount, setNewExpenseAmount] = useState<{[monthKey: string]: string}>({});
  
  const handleVacationChange = (monthKey: string, value: string) => {
    const amount = Number(value) || 0;
    onVacationChange(monthKey, amount);
  };

  const handleChantierChange = (monthKey: string, value: string) => {    const amount = Number(value) || 0;
    onChantierChange(monthKey, amount);
  };

  const hideRevenueItem = (monthKey: string, itemKey: string) => {
    setHiddenRevenueItems(prev => ({
      ...prev,
      [monthKey]: [...(prev[monthKey] || []), itemKey]
    }));
  };
  const hideExpenseItem = (monthKey: string, itemKey: string) => {
    setHiddenExpenseItems(prev => ({
      ...prev,
      [monthKey]: [...(prev[monthKey] || []), itemKey]
    }));
  };
  const hideAllCurrentMonthItems = (monthKey: string) => {
    // Supprimer tous les revenus fixes
    setHiddenRevenueItems(prev => ({
      ...prev,
      [monthKey]: ['salary', 'fuel', 'healthInsurance', 'bonus']
    }));
    
    // Supprimer toutes les dépenses fixes
    setHiddenExpenseItems(prev => ({
      ...prev,
      [monthKey]: ['debt', 'currentExpenses', 'fuel', 'healthInsurance']
    }));
  };

  const toggleExpenseForm = (monthKey: string) => {
    setShowExpenseForm(prev => ({
      ...prev,
      [monthKey]: !prev[monthKey]
    }));
    // Réinitialiser le formulaire
    setNewExpenseType(prev => ({
      ...prev,
      [monthKey]: ''
    }));
    setNewExpenseAmount(prev => ({
      ...prev,
      [monthKey]: ''
    }));
  };
  const handleAddExpense = (monthKey: string) => {
    const type = newExpenseType[monthKey]?.trim();
    const amount = Number(newExpenseAmount[monthKey]) || 0;
    
    if (!type || amount <= 0) return;
    
    // Créer une nouvelle dépense personnalisée
    const newExpense: MonthlyCustomExpense = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: type,
      amount: amount
    };
    
    // Ajouter la dépense via le callback
    onMonthlyCustomExpenseAdd(monthKey, newExpense);
    
    // Réinitialiser le formulaire mais le garder ouvert
    setNewExpenseType(prev => ({
      ...prev,
      [monthKey]: ''
    }));
    setNewExpenseAmount(prev => ({
      ...prev,
      [monthKey]: ''
    }));
  };

  const isCurrentMonth = (month: number, year: number) => {
    const now = new Date();
    return month === now.getMonth() + 1 && year === now.getFullYear();
  };return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Prévision sur {monthsToDisplay} mois</h2>        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-success rounded"></div>
            <span>Solde sain</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-destructive rounded"></div>
            <span>Alerte</span>
          </div>
          <div className="flex items-center space-x-2">
            <Minus className="w-3 h-3 text-muted-foreground" />
            <span>Exclus du calcul (mois actuel)</span>
          </div>
          <div className="flex items-center space-x-2">
            <X className="w-3 h-3 text-destructive" />
            <span>Supprimer définitivement</span>
          </div>
        </div>
      </div>
      
      <div className="space-y-4">        {/* Mois en cours - Affichage spécialisé */}
        {data.length > 0 && (
          <CurrentMonthCard
            currentBalance={currentBalance}
            onCurrentBalanceChange={onCurrentBalanceChange}
            monthData={data[0]}
            alertThreshold={alertThreshold}
            onExpenseForecastChange={onCurrentMonthExpenseForecastChange}
            initialExpenseForecast={currentMonthExpenseForecast}
          />
        )}
        
        {/* Mois suivants - Affichage standard */}
        <div className="grid gap-4">
        {data.slice(1).map((month, index) => {
          const monthKey = `${month.year}-${month.month.toString().padStart(2, '0')}`;
          const isCurrentMonthData = isCurrentMonth(month.month, month.year);
          const hiddenRevenues = hiddenRevenueItems[monthKey] || [];
          const hiddenExpenses = hiddenExpenseItems[monthKey] || [];          // Calculer les revenus en excluant les éléments cachés
          // Pour le mois en cours, exclure automatiquement les revenus fixes
          let totalRevenues = 0;
          if (!hiddenRevenues.includes('salary') && !isCurrentMonthData) totalRevenues += month.revenues.salary;
          if (!hiddenRevenues.includes('fuel') && !isCurrentMonthData) totalRevenues += month.revenues.fuel;
          if (!hiddenRevenues.includes('healthInsurance') && !isCurrentMonthData) totalRevenues += month.revenues.healthInsurance;
          if (!hiddenRevenues.includes('bonus') && !isCurrentMonthData) totalRevenues += month.revenues.bonus;
          
          // Ajouter les revenus personnalisés
          const customRevenuesTotal = month.revenues.custom.reduce((sum, rev) => sum + rev.amount, 0);
          totalRevenues += customRevenuesTotal;          // Récupérer les valeurs des dépenses éditables
          const vacationAmount = vacationExpenses[monthKey] || 0;
          const chantierAmount = chantierExpenses[monthKey] || 0;

          // Calculer les dépenses en excluant les éléments cachés
          // Pour le mois en cours, exclure automatiquement les dépenses fixes
          const monthlyCustomExpensesTotal = (monthlyCustomExpenses[monthKey] || []).reduce((sum, exp) => sum + exp.amount, 0);
          let totalExpenses = vacationAmount + month.expenses.school + 
                             month.expenses.custom.reduce((sum, exp) => sum + exp.amount, 0) +
                             chantierAmount + monthlyCustomExpensesTotal;
          if (!hiddenExpenses.includes('debt') && !isCurrentMonthData) totalExpenses += month.expenses.debt;
          if (!hiddenExpenses.includes('currentExpenses') && !isCurrentMonthData) totalExpenses += month.expenses.currentExpenses;
          if (!hiddenExpenses.includes('fuel') && !isCurrentMonthData) totalExpenses += month.expenses.fuel;
          if (!hiddenExpenses.includes('healthInsurance') && !isCurrentMonthData) totalExpenses += month.expenses.healthInsurance;

          // Utiliser l'endingBalance de monthData qui est correctement calculé dans le flux principal
          // Seulement pour l'affichage des éléments cachés, on recalcule localement
          const hasHiddenItems = hiddenRevenues.length > 0 || hiddenExpenses.length > 0;
          const displayBalance = hasHiddenItems ? 
            (month.startingBalance + totalRevenues - totalExpenses) : 
            month.endingBalance;
          
          const isAlert = isLowBalance(displayBalance, alertThreshold);
            // Vérifier si les vacances sont éditables (juillet/août seulement) et si elles sont configurées
          const canEditVacation = month.month === 7 || month.month === 8;
          const hasVacationExpense = vacationAmount > 0 || canEditVacation;
          
          // Vérifier si des dépenses chantier sont configurées pour ce mois
          const hasChantierExpense = chantierAmount > 0;
          
          return (
            <Card key={index} className={cn(isAlert && "border-destructive")}>
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>{getMonthName(month.month)} {month.year}</span>                  <span className={cn(
                    "text-lg font-bold",
                    isAlert ? "text-destructive" : "text-success"
                  )}>
                    {formatCurrency(displayBalance)}
                  </span>
                </CardTitle>
              </CardHeader>              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 text-sm">
                  <div>
                    <h4 className="font-semibold text-muted-foreground mb-2">Solde début</h4>
                    <p className="text-lg">{formatCurrency(month.startingBalance)}</p>
                  </div>                    <div>
                    <h4 className="font-semibold text-success mb-2">Total revenus</h4>
                    <p className="text-xs text-muted-foreground mb-1">
                      {totalRevenues > 0 ? "(reçus fin mois précédent)" : "(aucun revenu précédent)"}
                    </p>
                    <p className="text-lg text-success">{formatCurrency(totalRevenues)}</p>
                    <div className="mt-1 space-y-1 text-xs text-muted-foreground">                      {!hiddenRevenues.includes('salary') && month.revenues.salary > 0 && (
                        <div className={cn(
                          "flex items-center justify-between",
                          isCurrentMonthData && "opacity-50 line-through"
                        )}>
                          <span>Salaire: {formatCurrency(month.revenues.salary)}</span>
                          <div className="flex items-center">
                            {isCurrentMonthData && (
                              <Minus className="w-3 h-3 text-muted-foreground mr-1" />
                            )}
                            {isCurrentMonthData && (
                              <button 
                                onClick={() => hideRevenueItem(monthKey, 'salary')}
                                className="ml-2 text-destructive hover:text-destructive/80"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        </div>
                      )}                      {!hiddenRevenues.includes('fuel') && month.revenues.fuel > 0 && (
                        <div className={cn(
                          "flex items-center justify-between",
                          isCurrentMonthData && "opacity-50 line-through"
                        )}>
                          <span>Carburant: {formatCurrency(month.revenues.fuel)}</span>
                          <div className="flex items-center">
                            {isCurrentMonthData && (
                              <Minus className="w-3 h-3 text-muted-foreground mr-1" />
                            )}
                            {isCurrentMonthData && (
                              <button 
                                onClick={() => hideRevenueItem(monthKey, 'fuel')}
                                className="ml-2 text-destructive hover:text-destructive/80"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        </div>
                      )}                      {!hiddenRevenues.includes('healthInsurance') && month.revenues.healthInsurance > 0 && (
                        <div className={cn(
                          "flex items-center justify-between",
                          isCurrentMonthData && "opacity-50 line-through"
                        )}>
                          <span>Assurance: {formatCurrency(month.revenues.healthInsurance)}</span>
                          <div className="flex items-center">
                            {isCurrentMonthData && (
                              <Minus className="w-3 h-3 text-muted-foreground mr-1" />
                            )}
                            {isCurrentMonthData && (
                              <button 
                                onClick={() => hideRevenueItem(monthKey, 'healthInsurance')}
                                className="ml-2 text-destructive hover:text-destructive/80"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        </div>
                      )}                      {month.revenues.bonus > 0 && !hiddenRevenues.includes('bonus') && (
                        <div className={cn(
                          "flex items-center justify-between",
                          isCurrentMonthData && "opacity-50 line-through"
                        )}>
                          <span>Bonus: {formatCurrency(month.revenues.bonus)}</span>
                          <div className="flex items-center">
                            {isCurrentMonthData && (
                              <Minus className="w-3 h-3 text-muted-foreground mr-1" />
                            )}
                            {isCurrentMonthData && (
                              <button 
                                onClick={() => hideRevenueItem(monthKey, 'bonus')}
                                className="ml-2 text-destructive hover:text-destructive/80"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                      {month.revenues.custom.map((rev, i) => (
                        <div key={i}>{rev.name}: {formatCurrency(rev.amount)}</div>
                      ))}
                      {isCurrentMonthData && (
                        <div className="text-xs text-muted-foreground italic mt-2">
                          <Minus className="w-3 h-3 inline mr-1" />
                          Revenus fixes exclus du calcul (mois en cours)
                        </div>
                      )}
                    </div>
                  </div>                  {/* Section Dépenses Fixes */}
                  <div>
                    <h4 className="font-semibold text-destructive mb-2">Dépenses Fixes</h4>
                    {(() => {
                      const fixedExpenses = [];
                      let fixedTotal = 0;
                      
                      if (!hiddenExpenses.includes('debt') && month.expenses.debt > 0) {
                        fixedExpenses.push({ name: 'Dette', amount: month.expenses.debt, key: 'debt' });
                        fixedTotal += month.expenses.debt;
                      }
                      
                      if (!hiddenExpenses.includes('currentExpenses') && month.expenses.currentExpenses > 0) {
                        fixedExpenses.push({ name: 'Dép. courantes', amount: month.expenses.currentExpenses, key: 'currentExpenses' });
                        fixedTotal += month.expenses.currentExpenses;
                      }
                      
                      if (!hiddenExpenses.includes('fuel') && month.expenses.fuel > 0) {
                        fixedExpenses.push({ name: 'Carburant', amount: month.expenses.fuel, key: 'fuel' });
                        fixedTotal += month.expenses.fuel;
                      }
                      
                      if (!hiddenExpenses.includes('healthInsurance') && month.expenses.healthInsurance > 0) {
                        fixedExpenses.push({ name: 'Assurance', amount: month.expenses.healthInsurance, key: 'healthInsurance' });
                        fixedTotal += month.expenses.healthInsurance;
                      }
                      
                      return (
                        <>
                          <p className="text-lg text-destructive font-semibold">{formatCurrency(fixedTotal)}</p>
                          <div className="mt-1 space-y-1 text-xs text-muted-foreground">
                            {fixedExpenses.map(expense => (
                              <div key={expense.key} className={cn(
                                "flex items-center justify-between",
                                isCurrentMonthData && "opacity-50 line-through"
                              )}>
                                <span>{expense.name}: {formatCurrency(expense.amount)}</span>
                                <div className="flex items-center">
                                  {isCurrentMonthData && (
                                    <Minus className="w-3 h-3 text-muted-foreground mr-1" />
                                  )}
                                  {isCurrentMonthData && (
                                    <button 
                                      onClick={() => hideExpenseItem(monthKey, expense.key)}
                                      className="ml-2 text-destructive hover:text-destructive/80"
                                    >
                                      <X className="w-3 h-3" />
                                    </button>
                                  )}
                                </div>
                              </div>
                            ))}
                            {isCurrentMonthData && fixedExpenses.length > 0 && (
                              <div className="text-xs text-muted-foreground italic mt-2">
                                <Minus className="w-3 h-3 inline mr-1" />
                                Dépenses fixes exclues du calcul (mois en cours)
                              </div>
                            )}
                          </div>
                        </>
                      );
                    })()}
                  </div>

                  {/* Section Dépenses Spécifiques */}
                  <div>
                    <h4 className="font-semibold text-orange-600 mb-2">Dépenses Spécifiques</h4>
                    {(() => {
                      const specificExpenses = [];
                      let specificTotal = 0;
                        // École
                      if (month.expenses.school > 0) {
                        specificExpenses.push({ name: 'École', amount: month.expenses.school, editable: false });
                        specificTotal += month.expenses.school;
                      }
                      
                      // Vacances (déjà incluses dans month.expenses.vacation)
                      if (month.expenses.vacation > 0) {
                        specificExpenses.push({ name: 'Vacances', amount: month.expenses.vacation, editable: canEditVacation });
                        specificTotal += month.expenses.vacation;
                      }
                      
                      // Chantier (déjà inclus dans month.expenses.chantier)
                      if (month.expenses.chantier > 0) {
                        specificExpenses.push({ name: 'Chantier', amount: month.expenses.chantier, editable: true });
                        specificTotal += month.expenses.chantier;
                      }// Dépenses personnalisées (custom expenses de base + monthlyCustomExpenses déjà fusionnées)
                      month.expenses.custom.forEach(exp => {
                        // Les dépenses mensuelles ajoutées ont isRecurring: false
                        const isMonthlyExpense = !exp.isRecurring;
                        specificExpenses.push({ 
                          name: exp.name, 
                          amount: exp.amount, 
                          editable: false, 
                          id: exp.id,
                          isMonthly: isMonthlyExpense
                        });
                        specificTotal += exp.amount;
                      });
                      
                      return (
                        <>
                          <p className="text-lg text-orange-600 font-semibold">{formatCurrency(specificTotal)}</p>
                          <div className="mt-1 space-y-1 text-xs text-muted-foreground">
                            {specificExpenses.map((expense, i) => (
                              <div key={i} className="flex items-center justify-between">
                                <span>{expense.name}: {formatCurrency(expense.amount)}</span>
                                {expense.isMonthly && (
                                  <button
                                    onClick={() => onMonthlyCustomExpenseRemove(monthKey, expense.id)}
                                    className="text-red-500 hover:text-red-700"
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                )}
                              </div>
                            ))}                              {/* Champs éditables pour Vacances et Chantier */}
                            {canEditVacation && (
                              <div className="mt-2">
                                <label className="text-xs font-medium">Vacances:</label>
                                <Input
                                  type="number"
                                  value={month.expenses.vacation}
                                  onChange={(e) => handleVacationChange(monthKey, e.target.value)}
                                  placeholder="0"
                                  className="w-full text-sm mt-1"
                                />
                              </div>
                            )}
                              {/* Champ Chantier uniquement si il y a déjà une valeur configurée ou si on est dans un mois éditable */}
                            {(month.expenses.chantier > 0 || chantierAmount > 0) && (
                              <div className="mt-2">
                                <label className="text-xs font-medium">Chantier:</label>
                                <Input
                                  type="number"
                                  value={month.expenses.chantier}
                                  onChange={(e) => handleChantierChange(monthKey, e.target.value)}
                                  placeholder="0"
                                  className="w-full text-sm mt-1"
                                />
                              </div>
                            )}
                          </div>
                        </>
                      );
                    })()}
                  </div>{/* Bouton "+ Ajouter Dépenses" - toujours visible */}
                  <div className="flex items-center justify-center">
                    <button
                      onClick={() => toggleExpenseForm(monthKey)}
                      className="px-3 py-2 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
                    >
                      + Ajouter Dépenses
                    </button>
                  </div>

                  {/* Formulaire d'ajout de dépenses */}
                  {showExpenseForm[monthKey] && (
                    <div className="border-l-4 border-blue-300 pl-4">
                      <h4 className="font-semibold text-blue-700 mb-2">Nouvelle dépense</h4>
                      <div className="space-y-2">
                        <Input
                          type="text"
                          placeholder="Type de dépense"
                          value={newExpenseType[monthKey] || ''}
                          onChange={(e) => setNewExpenseType(prev => ({
                            ...prev,
                            [monthKey]: e.target.value
                          }))}
                          className="text-sm"
                        />
                        <Input
                          type="number"
                          placeholder="Montant"
                          value={newExpenseAmount[monthKey] || ''}
                          onChange={(e) => setNewExpenseAmount(prev => ({
                            ...prev,
                            [monthKey]: e.target.value
                          }))}
                          className="text-sm"                        />
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleAddExpense(monthKey)}
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            Ajouter
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => toggleExpenseForm(monthKey)}
                          >
                            Annuler
                          </Button>
                        </div>
                      </div>
                    </div>                  )}

                  {/* Colonne Total dépenses */}
                  <div>
                    <h4 className="font-semibold text-destructive mb-2">Total dépenses</h4>
                    <p className="text-lg text-destructive">{formatCurrency(totalExpenses)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
        </div>
      </div>
    </div>
  );
}