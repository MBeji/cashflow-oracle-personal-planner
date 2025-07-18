import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { StorageService } from '@/utils/storage';
import { Download, Upload, RotateCcw, Save } from 'lucide-react';
import { CashFlowSettings, CustomExpense } from '@/types/cashflow';

interface DataManagementProps {
  settings: CashFlowSettings;
  customExpenses: CustomExpense[];
  vacationExpenses: { [key: string]: number };
  chantierExpenses: { [key: string]: number };
  customMonthlyExpenses: { [key: string]: number };
  onDataImport: (data: any) => void;
  onReset: () => void;
}

export function DataManagement({
  settings,
  customExpenses,
  vacationExpenses,
  chantierExpenses,
  customMonthlyExpenses,
  onDataImport,
  onReset
}: DataManagementProps) {
  const [importFile, setImportFile] = useState<File | null>(null);

  const handleExport = () => {
    StorageService.export();
  };

  const handleImport = async () => {
    if (!importFile) return;
    
    try {
      const data = await StorageService.import(importFile);
      onDataImport(data);
      setImportFile(null);
    } catch (error) {
      alert('Erreur lors de l\'importation du fichier');
    }
  };

  const handleSave = () => {
    StorageService.save('cashflow-settings', settings);
    StorageService.save('cashflow-custom-expenses', customExpenses);
    StorageService.save('cashflow-vacation-expenses', vacationExpenses);
    StorageService.save('cashflow-chantier-expenses', chantierExpenses);
    StorageService.save('cashflow-monthly-expenses', customMonthlyExpenses);
    alert('Données sauvegardées avec succès !');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gestion des données</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <Button onClick={handleSave} className="w-full" variant="outline">
              <Save className="w-4 h-4 mr-2" />
              Sauvegarder
            </Button>
            
            <Button onClick={handleExport} className="w-full" variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Exporter les données
            </Button>
          </div>
          
          <div className="space-y-3">
            <div>
              <Label htmlFor="import-file">Importer des données</Label>
              <Input
                id="import-file"
                type="file"
                accept=".json"
                onChange={(e) => setImportFile(e.target.files?.[0] || null)}
              />
            </div>
            
            <Button 
              onClick={handleImport} 
              disabled={!importFile}
              className="w-full"
              variant="outline"
            >
              <Upload className="w-4 h-4 mr-2" />
              Importer
            </Button>
          </div>
        </div>
        
        <div className="pt-4 border-t">
          <Button 
            onClick={onReset} 
            variant="destructive" 
            className="w-full"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Réinitialiser toutes les données
          </Button>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            Cette action supprimera toutes vos données personnalisées
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
