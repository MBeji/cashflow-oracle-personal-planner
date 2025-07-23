import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ExpensePlanningModal } from './ExpensePlanningModal';
import { MonthlyExpensePlanning, ExpensePlanningSettings } from '@/types/cashflow';
import { formatCurrency } from '@/utils/cashflow';
import { Calendar, Edit, Plus, Trash2, Target } from 'lucide-react';

interface ExpensePlanningManagerProps {
  settings: ExpensePlanningSettings;
  onSettingsChange: (settings: ExpensePlanningSettings) => void;
}

export function ExpensePlanningManager({ settings, onSettingsChange }: ExpensePlanningManagerProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlanning, setEditingPlanning] = useState<MonthlyExpensePlanning | undefined>();

  const monthNames = [
    'Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun',
    'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'
  ];

  const handleSavePlanning = (planning: MonthlyExpensePlanning) => {
    const existingIndex = settings.monthlyPlannings.findIndex(
      p => p.month === planning.month && p.year === planning.year
    );

    let updatedPlannings;
    if (existingIndex >= 0) {
      updatedPlannings = [...settings.monthlyPlannings];
      updatedPlannings[existingIndex] = planning;
    } else {
      updatedPlannings = [...settings.monthlyPlannings, planning];
    }

    onSettingsChange({
      ...settings,
      monthlyPlannings: updatedPlannings
    });
  };

  const handleEditPlanning = (planning: MonthlyExpensePlanning) => {
    setEditingPlanning(planning);
    setIsModalOpen(true);
  };

  const handleDeletePlanning = (month: number, year: number) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette planification ?')) {
      const updatedPlannings = settings.monthlyPlannings.filter(
        p => !(p.month === month && p.year === year)
      );
      onSettingsChange({
        ...settings,
        monthlyPlannings: updatedPlannings
      });
    }
  };

  const handleNewPlanning = () => {
    setEditingPlanning(undefined);
    setIsModalOpen(true);
  };

  const sortedPlannings = [...settings.monthlyPlannings].sort((a, b) => {
    if (a.year !== b.year) return a.year - b.year;
    return a.month - b.month;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Planification des Dépenses</h2>
          <p className="text-muted-foreground">
            Programmez vos dépenses par catégorie pour chaque mois. Le total remplacera le montant fixe de {formatCurrency(settings.defaultAmount)}.
          </p>
        </div>
        <Button onClick={handleNewPlanning}>
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle planification
        </Button>
      </div>

      {/* Montant par défaut */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Montant par défaut
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-2">
            Montant utilisé pour les mois sans planification spécifique :
          </p>
          <Badge variant="secondary" className="text-lg">
            {formatCurrency(settings.defaultAmount)}
          </Badge>
        </CardContent>
      </Card>

      {/* Liste des planifications */}
      {sortedPlannings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedPlannings.map((planning) => (
            <Card key={`${planning.year}-${planning.month}`}>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between text-lg">
                  <span className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {monthNames[planning.month - 1]} {planning.year}
                  </span>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditPlanning(planning)}
                      className="h-8 w-8 p-0"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeletePlanning(planning.month, planning.year)}
                      className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Total planifié :</span>
                    <Badge variant="default" className="font-bold">
                      {formatCurrency(planning.totalAmount)}
                    </Badge>
                  </div>
                  
                  <div className="space-y-1">
                    <span className="text-sm font-medium text-muted-foreground">
                      {planning.categories.length} catégorie(s) :
                    </span>
                    <div className="space-y-1">
                      {planning.categories.slice(0, 3).map((category) => (
                        <div key={category.id} className="flex justify-between text-sm">
                          <span className="flex items-center gap-1">
                            <div 
                              className="w-2 h-2 rounded-full" 
                              style={{ backgroundColor: category.color }}
                            />
                            {category.name}
                          </span>
                          <span>{formatCurrency(category.amount)}</span>
                        </div>
                      ))}
                      {planning.categories.length > 3 && (
                        <div className="text-xs text-muted-foreground">
                          +{planning.categories.length - 3} autre(s)...
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="text-xs text-muted-foreground pt-2 border-t">
                    Modifié le {new Date(planning.updatedAt).toLocaleDateString('fr-FR')}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">Aucune planification</h3>
            <p className="text-muted-foreground mb-4">
              Commencez par créer une planification de dépenses pour un mois spécifique.
            </p>
            <Button onClick={handleNewPlanning}>
              <Plus className="h-4 w-4 mr-2" />
              Créer ma première planification
            </Button>
          </CardContent>
        </Card>
      )}

      <ExpensePlanningModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSavePlanning}
        existingPlanning={editingPlanning}
      />
    </div>
  );
}
