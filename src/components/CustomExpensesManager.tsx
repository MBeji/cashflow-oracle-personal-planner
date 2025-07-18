import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Trash2, Plus } from 'lucide-react';
import { CustomExpense } from '@/types/cashflow';
import { formatCurrency, getMonthName } from '@/utils/cashflow';

interface CustomExpensesManagerProps {
  expenses: CustomExpense[];
  onExpensesChange: (expenses: CustomExpense[]) => void;
}

export function CustomExpensesManager({ expenses, onExpensesChange }: CustomExpensesManagerProps) {
  const [newExpense, setNewExpense] = useState({
    name: '',
    amount: 0,
    month: 1,
    year: new Date().getFullYear(),
    isRecurring: false,
  });

  const addExpense = () => {
    if (!newExpense.name || newExpense.amount <= 0) return;

    const expense: CustomExpense = {
      id: crypto.randomUUID(),
      name: newExpense.name,
      amount: newExpense.amount,
      month: newExpense.isRecurring ? undefined : newExpense.month,
      year: newExpense.isRecurring ? undefined : newExpense.year,
      isRecurring: newExpense.isRecurring,
    };

    onExpensesChange([...expenses, expense]);
    setNewExpense({
      name: '',
      amount: 0,
      month: 1,
      year: new Date().getFullYear(),
      isRecurring: false,
    });
  };

  const removeExpense = (id: string) => {
    onExpensesChange(expenses.filter(exp => exp.id !== id));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Dépenses personnalisées</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add new expense form */}
        <div className="space-y-3 p-4 border rounded-lg bg-muted/50">
          <h4 className="font-semibold">Ajouter une dépense</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <Label htmlFor="expenseName">Nom de la dépense</Label>
              <Input
                id="expenseName"
                value={newExpense.name}
                onChange={(e) => setNewExpense({ ...newExpense, name: e.target.value })}
                placeholder="Ex: Réparation voiture"
              />
            </div>
            
            <div>
              <Label htmlFor="expenseAmount">Montant (TND)</Label>
              <Input
                id="expenseAmount"
                type="number"
                value={newExpense.amount}
                onChange={(e) => setNewExpense({ ...newExpense, amount: Number(e.target.value) })}
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="recurring"
              checked={newExpense.isRecurring}
              onCheckedChange={(checked) => 
                setNewExpense({ ...newExpense, isRecurring: checked as boolean })
              }
            />
            <Label htmlFor="recurring">Dépense récurrente (chaque mois)</Label>
          </div>

          {!newExpense.isRecurring && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="expenseMonth">Mois</Label>
                <Select
                  value={newExpense.month.toString()}
                  onValueChange={(value) => setNewExpense({ ...newExpense, month: Number(value) })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                      <SelectItem key={month} value={month.toString()}>
                        {getMonthName(month)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="expenseYear">Année</Label>
                <Input
                  id="expenseYear"
                  type="number"
                  value={newExpense.year}
                  onChange={(e) => setNewExpense({ ...newExpense, year: Number(e.target.value) })}
                />
              </div>
            </div>
          )}

          <Button onClick={addExpense} className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            Ajouter la dépense
          </Button>
        </div>

        {/* Existing expenses list */}
        <div className="space-y-2">
          <h4 className="font-semibold">Dépenses existantes</h4>
          {expenses.length === 0 ? (
            <p className="text-muted-foreground text-sm">Aucune dépense personnalisée</p>
          ) : (
            expenses.map(expense => (
              <div key={expense.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">{expense.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatCurrency(expense.amount)} - {' '}
                    {expense.isRecurring 
                      ? 'Récurrente (chaque mois)'
                      : `${getMonthName(expense.month!)} ${expense.year}`
                    }
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => removeExpense(expense.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
