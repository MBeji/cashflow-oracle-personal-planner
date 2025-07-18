import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2, Plus } from 'lucide-react';
import { formatCurrency, getMonthName } from '@/utils/cashflow';

interface ChantierManagerProps {
  chantierExpenses: { [key: string]: number };
  onChantierChange: (expenses: { [key: string]: number }) => void;
}

export function ChantierManager({ chantierExpenses, onChantierChange }: ChantierManagerProps) {
  const [newMonth, setNewMonth] = useState(1);
  const [newYear, setNewYear] = useState(new Date().getFullYear());
  const [newAmount, setNewAmount] = useState(0);

  const addChantierExpense = () => {
    if (newAmount <= 0) return;

    const monthKey = `${newYear}-${newMonth.toString().padStart(2, '0')}`;
    onChantierChange({
      ...chantierExpenses,
      [monthKey]: newAmount,
    });

    setNewAmount(0);
  };

  const removeChantierExpense = (monthKey: string) => {
    const newExpenses = { ...chantierExpenses };
    delete newExpenses[monthKey];
    onChantierChange(newExpenses);
  };

  const chantierEntries = Object.entries(chantierExpenses).map(([key, amount]) => {
    const [year, month] = key.split('-');
    return {
      key,
      month: parseInt(month),
      year: parseInt(year),
      amount,
    };
  }).sort((a, b) => a.year - b.year || a.month - b.month);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Dépenses Chantier</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add new chantier expense */}
        <div className="space-y-3 p-4 border rounded-lg bg-muted/50">
          <h4 className="font-semibold">Ajouter une dépense chantier</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <Label htmlFor="chantierMonth">Mois</Label>
              <Select
                value={newMonth.toString()}
                onValueChange={(value) => setNewMonth(Number(value))}
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
              <Label htmlFor="chantierYear">Année</Label>
              <Input
                id="chantierYear"
                type="number"
                value={newYear}
                onChange={(e) => setNewYear(Number(e.target.value))}
              />
            </div>

            <div>
              <Label htmlFor="chantierAmount">Montant (TND)</Label>
              <Input
                id="chantierAmount"
                type="number"
                value={newAmount}
                onChange={(e) => setNewAmount(Number(e.target.value))}
              />
            </div>
          </div>

          <Button onClick={addChantierExpense} className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            Ajouter la dépense chantier
          </Button>
        </div>

        {/* Existing chantier expenses */}
        <div className="space-y-2">
          <h4 className="font-semibold">Dépenses chantier existantes</h4>
          {chantierEntries.length === 0 ? (
            <p className="text-muted-foreground text-sm">Aucune dépense chantier</p>
          ) : (
            chantierEntries.map(entry => (
              <div key={entry.key} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">{getMonthName(entry.month)} {entry.year}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatCurrency(entry.amount)}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => removeChantierExpense(entry.key)}
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
