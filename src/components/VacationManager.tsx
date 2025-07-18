import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/utils/cashflow';

interface VacationManagerProps {
  vacationExpenses: { [key: string]: number };
  onVacationChange: (expenses: { [key: string]: number }) => void;
}

export function VacationManager({ vacationExpenses, onVacationChange }: VacationManagerProps) {
  const currentYear = new Date().getFullYear();
  const [julyAmount, setJulyAmount] = useState(vacationExpenses[`${currentYear}-07`] || 0);
  const [augustAmount, setAugustAmount] = useState(vacationExpenses[`${currentYear}-08`] || 0);

  const handleSave = () => {
    const newExpenses = { ...vacationExpenses };
    
    // Update July and August for current year
    if (julyAmount > 0) {
      newExpenses[`${currentYear}-07`] = julyAmount;
    } else {
      delete newExpenses[`${currentYear}-07`];
    }
    
    if (augustAmount > 0) {
      newExpenses[`${currentYear}-08`] = augustAmount;
    } else {
      delete newExpenses[`${currentYear}-08`];
    }

    onVacationChange(newExpenses);
  };

  const total = julyAmount + augustAmount;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Dépenses vacances {currentYear}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="july">Juillet {currentYear} (DA)</Label>
            <Input
              id="july"
              type="number"
              value={julyAmount}
              onChange={(e) => setJulyAmount(Number(e.target.value))}
              max={10000}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="august">Août {currentYear} (DA)</Label>
            <Input
              id="august"
              type="number"
              value={augustAmount}
              onChange={(e) => setAugustAmount(Number(e.target.value))}
              max={10000}
            />
          </div>
        </div>

        <div className="p-3 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground">
            Total vacances: <span className="font-semibold">{formatCurrency(total)}</span>
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Recommandé: entre {formatCurrency(5000)} et {formatCurrency(10000)}
          </p>
        </div>

        <Button onClick={handleSave} className="w-full">
          Sauvegarder les dépenses vacances
        </Button>
      </CardContent>
    </Card>
  );
}