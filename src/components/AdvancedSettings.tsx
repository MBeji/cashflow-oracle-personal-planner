import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { CashFlowSettings } from '@/types/cashflow';

interface AdvancedSettingsProps {
  settings: CashFlowSettings;
  onSettingsChange: (settings: CashFlowSettings) => void;
}

export function AdvancedSettings({ settings, onSettingsChange }: AdvancedSettingsProps) {
  const [localSettings, setLocalSettings] = useState(settings);

  const handleSave = () => {
    onSettingsChange(localSettings);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Paramètres avancés</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="monthsToDisplay">Nombre de mois à afficher</Label>
            <Input
              id="monthsToDisplay"
              type="number"
              min="1"
              max="60"
              value={localSettings.monthsToDisplay}
              onChange={(e) => setLocalSettings({ 
                ...localSettings, 
                monthsToDisplay: Number(e.target.value) 
              })}
            />
            <p className="text-xs text-muted-foreground">
              Entre 1 et 60 mois (recommandé: 12-24 mois)
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="alertThreshold">Seuil d'alerte (TND)</Label>
            <Input
              id="alertThreshold"
              type="number"
              value={localSettings.alertThreshold}
              onChange={(e) => setLocalSettings({ 
                ...localSettings, 
                alertThreshold: Number(e.target.value) 
              })}
            />
            <p className="text-xs text-muted-foreground">
              Montant en dessous duquel une alerte est affichée
            </p>
          </div>
        </div>

        <Button onClick={handleSave} className="w-full">
          Sauvegarder les paramètres
        </Button>
      </CardContent>
    </Card>
  );
}
