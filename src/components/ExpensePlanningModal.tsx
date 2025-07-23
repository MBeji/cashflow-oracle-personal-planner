import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/utils/cashflow';
import { MonthlyExpensePlanning, PlannedExpenseCategory } from '@/types/cashflow';
import { Calendar, Plus, Trash2, Calculator, Save } from 'lucide-react';

interface ExpensePlanningModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (planning: MonthlyExpensePlanning) => void;
  existingPlanning?: MonthlyExpensePlanning;
}

const defaultCategories: PlannedExpenseCategory[] = [
  { id: '1', name: 'Alimentation', amount: 1500, color: '#ef4444', isDefault: true },
  { id: '2', name: 'Femme de ménage', amount: 200, color: '#f97316', isDefault: true },
  { id: '3', name: 'Études enfants', amount: 300, color: '#eab308', isDefault: true },
  { id: '4', name: 'Clubs pour enfants', amount: 200, color: '#22c55e', isDefault: true },
  { id: '5', name: 'Abonnements sport', amount: 150, color: '#3b82f6', isDefault: true },
  { id: '6', name: 'Achat vêtements', amount: 400, color: '#a855f7', isDefault: true },
  { id: '7', name: 'Médecins et médicaments', amount: 200, color: '#ec4899', isDefault: true },
];

export function ExpensePlanningModal({ isOpen, onClose, onSave, existingPlanning }: ExpensePlanningModalProps) {
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [categories, setCategories] = useState<PlannedExpenseCategory[]>(defaultCategories);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryAmount, setNewCategoryAmount] = useState<number>(0);

  useEffect(() => {
    if (isOpen) {
      if (existingPlanning) {
        setSelectedMonth(existingPlanning.month);
        setSelectedYear(existingPlanning.year);
        setCategories(existingPlanning.categories);
      } else {
        setSelectedMonth(new Date().getMonth() + 1);
        setSelectedYear(new Date().getFullYear());
        setCategories(defaultCategories);
      }
      setNewCategoryName('');
      setNewCategoryAmount(0);
    }
  }, [isOpen, existingPlanning]);

  const monthNames = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];

  const currentYear = new Date().getFullYear();
  const years = [currentYear - 1, currentYear, currentYear + 1];

  const totalAmount = categories.reduce((sum, cat) => sum + cat.amount, 0);

  const updateCategoryAmount = (categoryId: string, amount: number) => {
    setCategories(categories.map(cat => 
      cat.id === categoryId ? { ...cat, amount } : cat
    ));
  };

  const addCustomCategory = () => {
    if (newCategoryName.trim() && newCategoryAmount > 0) {
      const newCategory: PlannedExpenseCategory = {
        id: Date.now().toString(),
        name: newCategoryName.trim(),
        amount: newCategoryAmount,
        color: '#64748b',
        isDefault: false
      };
      setCategories([...categories, newCategory]);
      setNewCategoryName('');
      setNewCategoryAmount(0);
    }
  };

  const removeCategory = (categoryId: string) => {
    setCategories(categories.filter(cat => cat.id !== categoryId));
  };

  const handleSave = () => {
    const planning: MonthlyExpensePlanning = {
      month: selectedMonth,
      year: selectedYear,
      categories: categories.filter(cat => cat.amount > 0),
      totalAmount,
      createdAt: existingPlanning?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    onSave(planning);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Planification des Dépenses
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Sélection du mois et année */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="month">Mois</Label>
              <Select value={selectedMonth.toString()} onValueChange={(value) => setSelectedMonth(parseInt(value))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {monthNames.map((month, index) => (
                    <SelectItem key={index + 1} value={(index + 1).toString()}>
                      {month}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="year">Année</Label>
              <Select value={selectedYear.toString()} onValueChange={(value) => setSelectedYear(parseInt(value))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {years.map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Résumé du total */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  Total planifié pour {monthNames[selectedMonth - 1]} {selectedYear}
                </span>
                <Badge variant="secondary" className="text-lg font-bold">
                  {formatCurrency(totalAmount)}
                </Badge>
              </CardTitle>
            </CardHeader>
          </Card>

          {/* Liste des catégories */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Catégories de dépenses</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {categories.map((category) => (
                <Card key={category.id}>
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: category.color }}
                        />
                        <span className="font-medium">{category.name}</span>
                        {!category.isDefault && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeCategory(category.id)}
                            className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                    <Input
                      type="number"
                      value={category.amount}
                      onChange={(e) => updateCategoryAmount(category.id, parseFloat(e.target.value) || 0)}
                      placeholder="Montant en TND"
                      min="0"
                      step="1"
                    />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Ajouter une nouvelle catégorie */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Ajouter une catégorie personnalisée
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="newCategoryName">Nom de la catégorie</Label>
                  <Input
                    id="newCategoryName"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="Ex: Loisirs, Transport..."
                  />
                </div>
                <div>
                  <Label htmlFor="newCategoryAmount">Montant (TND)</Label>
                  <Input
                    id="newCategoryAmount"
                    type="number"
                    value={newCategoryAmount}
                    onChange={(e) => setNewCategoryAmount(parseFloat(e.target.value) || 0)}
                    placeholder="0"
                    min="0"
                    step="1"
                  />
                </div>
                <div className="flex items-end">
                  <Button onClick={addCustomCategory} disabled={!newCategoryName.trim() || newCategoryAmount <= 0}>
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Sauvegarder la planification
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
