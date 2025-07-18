import { FixedAmounts } from '@/types/cashflow';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { formatCurrency } from '@/utils/cashflow';

interface FixedAmountsManagerProps {
  fixedAmounts: FixedAmounts;
  onFixedAmountsChange: (fixedAmounts: FixedAmounts) => void;
}

export function FixedAmountsManager({ fixedAmounts, onFixedAmountsChange }: FixedAmountsManagerProps) {
  const handleChange = (field: keyof FixedAmounts, value: number) => {
    onFixedAmountsChange({
      ...fixedAmounts,
      [field]: value
    });
  };

  const handleBonusChange = (month: keyof FixedAmounts['bonusMultipliers'], value: number) => {
    onFixedAmountsChange({
      ...fixedAmounts,
      bonusMultipliers: {
        ...fixedAmounts.bonusMultipliers,
        [month]: value
      }
    });
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Configuration des montants fixes</h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenus fixes */}
        <Card>
          <CardHeader>
            <CardTitle className="text-success">Revenus fixes mensuels</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="salary">Salaire de base</Label>
              <Input
                id="salary"
                type="number"
                value={fixedAmounts.salary}
                onChange={(e) => handleChange('salary', Number(e.target.value) || 0)}
                placeholder="12750"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Actuel: {formatCurrency(fixedAmounts.salary)}
              </p>
            </div>

            <div>
              <Label htmlFor="fuelRevenue">Remboursement carburant</Label>
              <Input
                id="fuelRevenue"
                type="number"
                value={fixedAmounts.fuelRevenue}
                onChange={(e) => handleChange('fuelRevenue', Number(e.target.value) || 0)}
                placeholder="500"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Actuel: {formatCurrency(fixedAmounts.fuelRevenue)}
              </p>
            </div>

            <div>
              <Label htmlFor="healthInsuranceRevenue">Remboursement assurance santé</Label>
              <Input
                id="healthInsuranceRevenue"
                type="number"
                value={fixedAmounts.healthInsuranceRevenue}
                onChange={(e) => handleChange('healthInsuranceRevenue', Number(e.target.value) || 0)}
                placeholder="1000"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Actuel: {formatCurrency(fixedAmounts.healthInsuranceRevenue)}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Dépenses fixes */}
        <Card>
          <CardHeader>
            <CardTitle className="text-destructive">Dépenses fixes mensuelles</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="debt">Dette mensuelle</Label>
              <Input
                id="debt"
                type="number"
                value={fixedAmounts.debt}
                onChange={(e) => handleChange('debt', Number(e.target.value) || 0)}
                placeholder="6000"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Actuel: {formatCurrency(fixedAmounts.debt)}
              </p>
            </div>            <div>
              <Label htmlFor="currentExpenses">Dépenses courantes</Label>
              <Input
                id="currentExpenses"
                type="number"
                value={fixedAmounts.currentExpenses}
                onChange={(e) => handleChange('currentExpenses', Number(e.target.value) || 0)}
                placeholder="3300"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Actuel: {formatCurrency(fixedAmounts.currentExpenses)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                💡 Répartition suggérée: Alimentation & Maison (2000) + Femme de ménage (200) + Enfants (500) + Factures (200) + Restaurants & Sorties (400) = 3300 TND
              </p>
            </div>

            <div>
              <Label htmlFor="fuelExpense">Carburant</Label>
              <Input
                id="fuelExpense"
                type="number"
                value={fixedAmounts.fuelExpense}
                onChange={(e) => handleChange('fuelExpense', Number(e.target.value) || 0)}
                placeholder="500"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Actuel: {formatCurrency(fixedAmounts.fuelExpense)}
              </p>
            </div>

            <div>
              <Label htmlFor="healthInsuranceExpense">Assurance santé</Label>
              <Input
                id="healthInsuranceExpense"
                type="number"
                value={fixedAmounts.healthInsuranceExpense}
                onChange={(e) => handleChange('healthInsuranceExpense', Number(e.target.value) || 0)}
                placeholder="1000"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Actuel: {formatCurrency(fixedAmounts.healthInsuranceExpense)}
              </p>
            </div>

            <div>
              <Label htmlFor="schoolExpense">Frais de scolarité (avril)</Label>
              <Input
                id="schoolExpense"
                type="number"
                value={fixedAmounts.schoolExpense}
                onChange={(e) => handleChange('schoolExpense', Number(e.target.value) || 0)}
                placeholder="15000"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Actuel: {formatCurrency(fixedAmounts.schoolExpense)}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bonus */}
      <Card>
        <CardHeader>
          <CardTitle className="text-success">Configuration des bonus</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="marchBonus">Mars</Label>
              <Input
                id="marchBonus"
                type="number"
                value={fixedAmounts.bonusMultipliers.march}
                onChange={(e) => handleBonusChange('march', Number(e.target.value) || 0)}
                placeholder="19125"
              />
              <p className="text-xs text-muted-foreground mt-1">
                {formatCurrency(fixedAmounts.bonusMultipliers.march)}
              </p>
            </div>

            <div>
              <Label htmlFor="juneBonus">Juin</Label>
              <Input
                id="juneBonus"
                type="number"
                value={fixedAmounts.bonusMultipliers.june}
                onChange={(e) => handleBonusChange('june', Number(e.target.value) || 0)}
                placeholder="6375"
              />
              <p className="text-xs text-muted-foreground mt-1">
                {formatCurrency(fixedAmounts.bonusMultipliers.june)}
              </p>
            </div>

            <div>
              <Label htmlFor="septemberBonus">Septembre</Label>
              <Input
                id="septemberBonus"
                type="number"
                value={fixedAmounts.bonusMultipliers.september}
                onChange={(e) => handleBonusChange('september', Number(e.target.value) || 0)}
                placeholder="19125"
              />
              <p className="text-xs text-muted-foreground mt-1">
                {formatCurrency(fixedAmounts.bonusMultipliers.september)}
              </p>
            </div>

            <div>
              <Label htmlFor="decemberBonus">Décembre</Label>
              <Input
                id="decemberBonus"
                type="number"
                value={fixedAmounts.bonusMultipliers.december}
                onChange={(e) => handleBonusChange('december', Number(e.target.value) || 0)}
                placeholder="6375"
              />
              <p className="text-xs text-muted-foreground mt-1">
                {formatCurrency(fixedAmounts.bonusMultipliers.december)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
