import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { CashFlowSettings as Settings } from '@/types/cashflow';

interface CashFlowSettingsProps {
  settings: Settings;
  onSettingsChange: (settings: Settings) => void;
}

export function CashFlowSettings({ settings, onSettingsChange }: CashFlowSettingsProps) {
  const [localSettings, setLocalSettings] = useState(settings);

  const handleSave = () => {
    onSettingsChange(localSettings);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Paramètres</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
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
        </div>

        <Button onClick={handleSave} className="w-full">
          Sauvegarder
        </Button>
      </CardContent>
    </Card>
  );
}