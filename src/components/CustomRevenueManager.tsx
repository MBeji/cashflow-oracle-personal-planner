import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Trash2, Plus } from 'lucide-react';
import { CustomRevenue } from '@/types/cashflow';
import { formatCurrency, getMonthName } from '@/utils/cashflow';

interface CustomRevenueManagerProps {
  revenues: CustomRevenue[];
  onRevenuesChange: (revenues: CustomRevenue[]) => void;
}

export function CustomRevenueManager({ revenues, onRevenuesChange }: CustomRevenueManagerProps) {
  const [newRevenue, setNewRevenue] = useState({
    name: '',
    amount: 0,
    month: 1,
    year: new Date().getFullYear(),
    isRecurring: false,
  });

  const addRevenue = () => {
    if (!newRevenue.name || newRevenue.amount <= 0) return;

    const revenue: CustomRevenue = {
      id: crypto.randomUUID(),
      name: newRevenue.name,
      amount: newRevenue.amount,
      month: newRevenue.isRecurring ? undefined : newRevenue.month,
      year: newRevenue.isRecurring ? undefined : newRevenue.year,
      isRecurring: newRevenue.isRecurring,
    };

    onRevenuesChange([...revenues, revenue]);
    setNewRevenue({
      name: '',
      amount: 0,
      month: 1,
      year: new Date().getFullYear(),
      isRecurring: false,
    });
  };

  const removeRevenue = (id: string) => {
    onRevenuesChange(revenues.filter(rev => rev.id !== id));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenus personnalisés</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add new revenue form */}
        <div className="space-y-3 p-4 border rounded-lg bg-muted/50">
          <h4 className="font-semibold">Ajouter un revenu</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <Label htmlFor="revenueName">Nom du revenu</Label>
              <Input
                id="revenueName"
                value={newRevenue.name}
                onChange={(e) => setNewRevenue({ ...newRevenue, name: e.target.value })}
                placeholder="Ex: Prime exceptionnelle"
              />
            </div>
            
            <div>
              <Label htmlFor="revenueAmount">Montant (TND)</Label>
              <Input
                id="revenueAmount"
                type="number"
                value={newRevenue.amount}
                onChange={(e) => setNewRevenue({ ...newRevenue, amount: Number(e.target.value) })}
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="recurringRevenue"
              checked={newRevenue.isRecurring}
              onCheckedChange={(checked) => 
                setNewRevenue({ ...newRevenue, isRecurring: checked as boolean })
              }
            />
            <Label htmlFor="recurringRevenue">Revenu récurrent (chaque mois)</Label>
          </div>

          {!newRevenue.isRecurring && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="revenueMonth">Mois</Label>
                <Select
                  value={newRevenue.month.toString()}
                  onValueChange={(value) => setNewRevenue({ ...newRevenue, month: Number(value) })}
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
                <Label htmlFor="revenueYear">Année</Label>
                <Input
                  id="revenueYear"
                  type="number"
                  value={newRevenue.year}
                  onChange={(e) => setNewRevenue({ ...newRevenue, year: Number(e.target.value) })}
                />
              </div>
            </div>
          )}

          <Button onClick={addRevenue} className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            Ajouter le revenu
          </Button>
        </div>

        {/* Existing revenues list */}
        <div className="space-y-2">
          <h4 className="font-semibold">Revenus existants</h4>
          {revenues.length === 0 ? (
            <p className="text-muted-foreground text-sm">Aucun revenu personnalisé</p>
          ) : (
            revenues.map(revenue => (
              <div key={revenue.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">{revenue.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatCurrency(revenue.amount)} - {' '}
                    {revenue.isRecurring 
                      ? 'Récurrent (chaque mois)'
                      : `${getMonthName(revenue.month!)} ${revenue.year}`
                    }
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => removeRevenue(revenue.id)}
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
