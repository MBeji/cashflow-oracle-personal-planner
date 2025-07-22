import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MonthlyData, MonthlyDataCorrection, ArchivedMonth } from '@/types/cashflow';
import { formatCurrency } from '@/utils/cashflow';
import { Archive, CheckCircle, AlertTriangle, Edit3 } from 'lucide-react';

interface MonthlyArchiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  monthData: MonthlyData;
  onArchive: (archivedMonth: ArchivedMonth) => void;
}

export function MonthlyArchiveModal({ isOpen, onClose, monthData, onArchive }: MonthlyArchiveModalProps) {
  const [correction, setCorrection] = useState<MonthlyDataCorrection>({
    month: monthData.month,
    year: monthData.year,
    actualRevenues: { ...monthData.revenues },
    actualExpenses: { ...monthData.expenses },
    notes: ''
  });

  const [step, setStep] = useState<'review' | 'correct' | 'confirm'>('review');

  useEffect(() => {
    if (isOpen) {
      setCorrection({
        month: monthData.month,
        year: monthData.year,
        actualRevenues: { ...monthData.revenues },
        actualExpenses: { ...monthData.expenses },
        notes: ''
      });
      setStep('review');
    }
  }, [isOpen, monthData]);

  const monthNames = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];

  const calculateActualEndingBalance = () => {
    const totalRevenues = 
      correction.actualRevenues.salary + 
      correction.actualRevenues.fuel + 
      correction.actualRevenues.healthInsurance + 
      correction.actualRevenues.bonus +
      correction.actualRevenues.custom.reduce((sum, rev) => sum + rev.amount, 0);

    const totalExpenses = 
      correction.actualExpenses.debt + 
      correction.actualExpenses.currentExpenses + 
      correction.actualExpenses.fuel + 
      correction.actualExpenses.healthInsurance + 
      correction.actualExpenses.vacation + 
      correction.actualExpenses.school + 
      correction.actualExpenses.chantier +
      correction.actualExpenses.custom.reduce((sum, exp) => sum + exp.amount, 0);

    return monthData.startingBalance + totalRevenues - totalExpenses;
  };

  const getDifference = (planned: number, actual: number) => {
    return actual - planned;
  };

  const handleArchive = () => {
    const actualEndingBalance = calculateActualEndingBalance();
    
    const actualData: MonthlyData = {
      ...monthData,
      revenues: correction.actualRevenues,
      expenses: correction.actualExpenses,
      endingBalance: actualEndingBalance,
      isArchived: true,
      archivedAt: new Date().toISOString()
    };

    const archivedMonth: ArchivedMonth = {
      month: monthData.month,
      year: monthData.year,
      plannedData: monthData,
      actualData: actualData,
      archivedAt: new Date().toISOString(),
      notes: correction.notes
    };

    onArchive(archivedMonth);
    onClose();
  };

  const renderReviewStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">
          Archivage de {monthNames[monthData.month - 1]} {monthData.year}
        </h3>
        <p className="text-sm text-muted-foreground">
          Vérifiez et corrigez les données du mois écoulé avant l'archivage
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Edit3 className="h-4 w-4" />
            Données prévues vs réelles
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="font-medium">Catégorie</div>
            <div className="font-medium text-center">Prévu</div>
            <div className="font-medium text-center">Réel</div>
          </div>
          <div className="border-t mt-2 pt-2 space-y-2">
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>Revenus totaux</div>
              <div className="text-center">{formatCurrency(
                monthData.revenues.salary + monthData.revenues.fuel + 
                monthData.revenues.healthInsurance + monthData.revenues.bonus +
                monthData.revenues.custom.reduce((sum, rev) => sum + rev.amount, 0)
              )}</div>
              <div className="text-center">{formatCurrency(
                correction.actualRevenues.salary + correction.actualRevenues.fuel + 
                correction.actualRevenues.healthInsurance + correction.actualRevenues.bonus +
                correction.actualRevenues.custom.reduce((sum, rev) => sum + rev.amount, 0)
              )}</div>
            </div>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>Dépenses totales</div>
              <div className="text-center">{formatCurrency(
                monthData.expenses.debt + monthData.expenses.currentExpenses + 
                monthData.expenses.fuel + monthData.expenses.healthInsurance + 
                monthData.expenses.vacation + monthData.expenses.school + 
                monthData.expenses.chantier +
                monthData.expenses.custom.reduce((sum, exp) => sum + exp.amount, 0)
              )}</div>
              <div className="text-center">{formatCurrency(
                correction.actualExpenses.debt + correction.actualExpenses.currentExpenses + 
                correction.actualExpenses.fuel + correction.actualExpenses.healthInsurance + 
                correction.actualExpenses.vacation + correction.actualExpenses.school + 
                correction.actualExpenses.chantier +
                correction.actualExpenses.custom.reduce((sum, exp) => sum + exp.amount, 0)
              )}</div>
            </div>
            <div className="grid grid-cols-3 gap-4 text-sm border-t pt-2 font-medium">
              <div>Solde final</div>
              <div className="text-center">{formatCurrency(monthData.endingBalance)}</div>
              <div className="text-center">{formatCurrency(calculateActualEndingBalance())}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button onClick={() => setStep('correct')} className="flex-1">
          <Edit3 className="h-4 w-4 mr-2" />
          Corriger les données
        </Button>
        <Button onClick={() => setStep('confirm')} variant="outline" className="flex-1">
          <CheckCircle className="h-4 w-4 mr-2" />
          Données correctes
        </Button>
      </div>
    </div>
  );

  const renderCorrectStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">
          Correction des données - {monthNames[monthData.month - 1]} {monthData.year}
        </h3>
        <p className="text-sm text-muted-foreground">
          Saisissez les montants réels pour ce mois
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Revenus */}
        <Card>
          <CardHeader>
            <CardTitle className="text-green-600">Revenus réels</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="actualSalary">Salaire</Label>
              <Input
                id="actualSalary"
                type="number"
                value={correction.actualRevenues.salary}
                onChange={(e) => setCorrection({
                  ...correction,
                  actualRevenues: {
                    ...correction.actualRevenues,
                    salary: parseFloat(e.target.value) || 0
                  }
                })}
              />
            </div>
            <div>
              <Label htmlFor="actualFuelRevenue">Carburant</Label>
              <Input
                id="actualFuelRevenue"
                type="number"
                value={correction.actualRevenues.fuel}
                onChange={(e) => setCorrection({
                  ...correction,
                  actualRevenues: {
                    ...correction.actualRevenues,
                    fuel: parseFloat(e.target.value) || 0
                  }
                })}
              />
            </div>
            <div>
              <Label htmlFor="actualHealthRevenue">Assurance santé</Label>
              <Input
                id="actualHealthRevenue"
                type="number"
                value={correction.actualRevenues.healthInsurance}
                onChange={(e) => setCorrection({
                  ...correction,
                  actualRevenues: {
                    ...correction.actualRevenues,
                    healthInsurance: parseFloat(e.target.value) || 0
                  }
                })}
              />
            </div>
            <div>
              <Label htmlFor="actualBonus">Bonus</Label>
              <Input
                id="actualBonus"
                type="number"
                value={correction.actualRevenues.bonus}
                onChange={(e) => setCorrection({
                  ...correction,
                  actualRevenues: {
                    ...correction.actualRevenues,
                    bonus: parseFloat(e.target.value) || 0
                  }
                })}
              />
            </div>
          </CardContent>
        </Card>

        {/* Dépenses */}
        <Card>
          <CardHeader>
            <CardTitle className="text-red-600">Dépenses réelles</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="actualDebt">Remboursement dette</Label>
              <Input
                id="actualDebt"
                type="number"
                value={correction.actualExpenses.debt}
                onChange={(e) => setCorrection({
                  ...correction,
                  actualExpenses: {
                    ...correction.actualExpenses,
                    debt: parseFloat(e.target.value) || 0
                  }
                })}
              />
            </div>
            <div>
              <Label htmlFor="actualCurrentExpenses">Dépenses courantes</Label>
              <Input
                id="actualCurrentExpenses"
                type="number"
                value={correction.actualExpenses.currentExpenses}
                onChange={(e) => setCorrection({
                  ...correction,
                  actualExpenses: {
                    ...correction.actualExpenses,
                    currentExpenses: parseFloat(e.target.value) || 0
                  }
                })}
              />
            </div>
            <div>
              <Label htmlFor="actualFuelExpense">Carburant</Label>
              <Input
                id="actualFuelExpense"
                type="number"
                value={correction.actualExpenses.fuel}
                onChange={(e) => setCorrection({
                  ...correction,
                  actualExpenses: {
                    ...correction.actualExpenses,
                    fuel: parseFloat(e.target.value) || 0
                  }
                })}
              />
            </div>
            <div>
              <Label htmlFor="actualVacation">Vacances</Label>
              <Input
                id="actualVacation"
                type="number"
                value={correction.actualExpenses.vacation}
                onChange={(e) => setCorrection({
                  ...correction,
                  actualExpenses: {
                    ...correction.actualExpenses,
                    vacation: parseFloat(e.target.value) || 0
                  }
                })}
              />
            </div>
            <div>
              <Label htmlFor="actualChantier">Chantier</Label>
              <Input
                id="actualChantier"
                type="number"
                value={correction.actualExpenses.chantier}
                onChange={(e) => setCorrection({
                  ...correction,
                  actualExpenses: {
                    ...correction.actualExpenses,
                    chantier: parseFloat(e.target.value) || 0
                  }
                })}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <div>
        <Label htmlFor="notes">Notes (optionnel)</Label>
        <Textarea
          id="notes"
          placeholder="Ajoutez des notes sur ce mois..."
          value={correction.notes || ''}
          onChange={(e) => setCorrection({
            ...correction,
            notes: e.target.value
          })}
        />
      </div>

      <div className="flex gap-3">
        <Button onClick={() => setStep('review')} variant="outline">
          Retour
        </Button>
        <Button onClick={() => setStep('confirm')} className="flex-1">
          Valider les corrections
        </Button>
      </div>
    </div>
  );

  const renderConfirmStep = () => {
    const difference = calculateActualEndingBalance() - monthData.endingBalance;
    
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">
            Confirmation d'archivage
          </h3>
          <p className="text-sm text-muted-foreground">
            Vérifiez les données avant l'archivage définitif
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Archive className="h-4 w-4" />
              Résumé de l'archivage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Mois archivé:</span>
                <span className="font-medium">{monthNames[monthData.month - 1]} {monthData.year}</span>
              </div>
              <div className="flex justify-between">
                <span>Solde prévu:</span>
                <span>{formatCurrency(monthData.endingBalance)}</span>
              </div>
              <div className="flex justify-between">
                <span>Solde réel:</span>
                <span className={difference >= 0 ? 'text-green-600' : 'text-red-600'}>
                  {formatCurrency(calculateActualEndingBalance())}
                </span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span>Différence:</span>
                <span className={`font-medium ${difference >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {difference >= 0 ? '+' : ''}{formatCurrency(difference)}
                </span>
              </div>
              {correction.notes && (
                <div className="border-t pt-2">
                  <span className="text-sm text-muted-foreground">Notes:</span>
                  <p className="text-sm mt-1">{correction.notes}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start gap-2">
            <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-yellow-800">Attention</p>
              <p className="text-yellow-700">
                Une fois archivé, ce mois ne pourra plus être modifié. 
                Le mois suivant deviendra automatiquement le mois courant.
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <Button onClick={() => setStep('correct')} variant="outline">
            Modifier
          </Button>
          <Button onClick={handleArchive} className="flex-1 bg-green-600 hover:bg-green-700">
            <Archive className="h-4 w-4 mr-2" />
            Archiver définitivement
          </Button>
        </div>
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Archive className="h-5 w-5" />
            Archivage mensuel
          </DialogTitle>
        </DialogHeader>
        
        {step === 'review' && renderReviewStep()}
        {step === 'correct' && renderCorrectStep()}
        {step === 'confirm' && renderConfirmStep()}
      </DialogContent>
    </Dialog>
  );
}
