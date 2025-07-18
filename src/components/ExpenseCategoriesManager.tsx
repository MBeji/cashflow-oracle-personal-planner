import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter 
} from '@/components/ui/dialog';
import { Plus, Edit, Trash2, PieChart } from 'lucide-react';
import { 
  ExpenseCategory, 
  ExpenseSubCategory, 
  MonthlyExpenseBreakdown, 
  ExpenseSettings 
} from '@/types/cashflow';

interface ExpenseCategoriesManagerProps {
  expenseSettings: ExpenseSettings;
  onExpenseSettingsChange: (settings: ExpenseSettings) => void;
  currentDate: Date;
}

const DEFAULT_CATEGORIES: ExpenseCategory[] = [
  { id: '1', name: 'Alimentation & Maison', amount: 2000, color: '#ef4444' },
  { id: '2', name: 'Femme de ménage', amount: 200, color: '#f97316' },
  { id: '3', name: 'Enfants (Études & Club)', amount: 700, color: '#eab308' },
  { id: '4', name: 'Factures', amount: 300, color: '#22c55e' },
  { id: '5', name: 'Achats divers', amount: 500, color: '#3b82f6' },
  { id: '6', name: 'Restaurants & Sorties', amount: 400, color: '#a855f7' }
];

const DEFAULT_SUBCATEGORIES: ExpenseSubCategory[] = [
  { id: '1-1', name: 'Alimentation', amount: 1500, parentCategoryId: '1' },
  { id: '1-2', name: 'Produits ménagers', amount: 300, parentCategoryId: '1' },
  { id: '1-3', name: 'Besoins maison récurrents', amount: 200, parentCategoryId: '1' },
  { id: '3-1', name: 'Frais scolaires', amount: 400, parentCategoryId: '3' },
  { id: '3-2', name: 'Club sportif/activités', amount: 300, parentCategoryId: '3' },
  { id: '4-1', name: 'Eau & Électricité', amount: 200, parentCategoryId: '4' },
  { id: '4-2', name: 'Internet', amount: 100, parentCategoryId: '4' },
  { id: '6-1', name: 'Restaurants', amount: 250, parentCategoryId: '6' },
  { id: '6-2', name: 'Sorties & Loisirs familiaux', amount: 150, parentCategoryId: '6' }
];

export function ExpenseCategoriesManager({ 
  expenseSettings, 
  onExpenseSettingsChange, 
  currentDate 
}: ExpenseCategoriesManagerProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ExpenseCategory | null>(null);
  const [editingSubcategory, setEditingSubcategory] = useState<ExpenseSubCategory | null>(null);
  const [selectedMonthBreakdown, setSelectedMonthBreakdown] = useState<MonthlyExpenseBreakdown | null>(null);
  
  // Initialiser les catégories par défaut si elles n'existent pas
  useEffect(() => {
    if (!expenseSettings.defaultCategories?.length) {
      const newSettings: ExpenseSettings = {
        defaultCategories: DEFAULT_CATEGORIES,
        defaultSubcategories: DEFAULT_SUBCATEGORIES,
        monthlyBreakdowns: []
      };
      onExpenseSettingsChange(newSettings);
    }
  }, []);

  const getCurrentMonthBreakdown = (): MonthlyExpenseBreakdown => {
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    
    const existing = expenseSettings.monthlyBreakdowns?.find(
      b => b.month === currentMonth && b.year === currentYear
    );
    
    if (existing) return existing;
    
    // Créer une nouvelle breakdown basée sur les catégories par défaut
    return {
      month: currentMonth,
      year: currentYear,
      categories: expenseSettings.defaultCategories?.map(cat => ({ ...cat })) || DEFAULT_CATEGORIES,
      subcategories: expenseSettings.defaultSubcategories?.map(sub => ({ ...sub })) || DEFAULT_SUBCATEGORIES,
      totalAmount: (expenseSettings.defaultCategories || DEFAULT_CATEGORIES).reduce((sum, cat) => sum + cat.amount, 0)
    };
  };

  const saveMonthlyBreakdown = (breakdown: MonthlyExpenseBreakdown) => {
    const updatedBreakdowns = expenseSettings.monthlyBreakdowns?.filter(
      b => !(b.month === breakdown.month && b.year === breakdown.year)
    ) || [];
    
    updatedBreakdowns.push(breakdown);
    
    onExpenseSettingsChange({
      ...expenseSettings,
      monthlyBreakdowns: updatedBreakdowns
    });
  };

  const updateCategoryAmount = (categoryId: string, newAmount: number) => {
    const currentBreakdown = getCurrentMonthBreakdown();
    const updatedCategories = currentBreakdown.categories.map(cat =>
      cat.id === categoryId ? { ...cat, amount: newAmount } : cat
    );
    
    const newBreakdown = {
      ...currentBreakdown,
      categories: updatedCategories,
      totalAmount: updatedCategories.reduce((sum, cat) => sum + cat.amount, 0)
    };
    
    saveMonthlyBreakdown(newBreakdown);
  };

  const updateSubcategoryAmount = (subcategoryId: string, newAmount: number) => {
    const currentBreakdown = getCurrentMonthBreakdown();
    const updatedSubcategories = currentBreakdown.subcategories.map(sub =>
      sub.id === subcategoryId ? { ...sub, amount: newAmount } : sub
    );
    
    // Recalculer le montant des catégories parentes
    const updatedCategories = currentBreakdown.categories.map(cat => {
      const subcatTotal = updatedSubcategories
        .filter(sub => sub.parentCategoryId === cat.id)
        .reduce((sum, sub) => sum + sub.amount, 0);
      return { ...cat, amount: subcatTotal };
    });
    
    const newBreakdown = {
      ...currentBreakdown,
      categories: updatedCategories,
      subcategories: updatedSubcategories,
      totalAmount: updatedCategories.reduce((sum, cat) => sum + cat.amount, 0)
    };
    
    saveMonthlyBreakdown(newBreakdown);
  };

  const currentBreakdown = getCurrentMonthBreakdown();

  return (
    <Card className="mt-4">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <PieChart className="h-5 w-5" />
          Répartition des Dépenses Courantes
        </CardTitle>
        <Badge variant="outline" className="text-sm">
          Total: {currentBreakdown.totalAmount.toLocaleString()} TND
        </Badge>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {currentBreakdown.categories.map(category => {
            const subcategories = currentBreakdown.subcategories.filter(
              sub => sub.parentCategoryId === category.id
            );
            const percentage = ((category.amount / currentBreakdown.totalAmount) * 100).toFixed(1);
            
            return (
              <div key={category.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-4 h-4 rounded-full" 
                      style={{ backgroundColor: category.color }}
                    />
                    <span className="font-medium">{category.name}</span>
                    <Badge variant="secondary" className="text-xs">
                      {percentage}%
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      value={category.amount}
                      onChange={(e) => updateCategoryAmount(category.id, Number(e.target.value))}
                      className="w-24 h-8 text-sm"
                    />
                    <span className="text-sm text-gray-500">TND</span>
                  </div>
                </div>
                
                {subcategories.length > 0 && (
                  <div className="ml-6 space-y-2">
                    {subcategories.map(subcategory => (
                      <div key={subcategory.id} className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">
                          • {subcategory.name}
                        </span>
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            value={subcategory.amount}
                            onChange={(e) => updateSubcategoryAmount(subcategory.id, Number(e.target.value))}
                            className="w-20 h-6 text-xs"
                          />
                          <span className="text-xs text-gray-500">TND</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <div className="text-sm text-gray-600">
            Les montants saisis ici remplacent le montant fixe de "Dépenses courantes" 
            pour le mois de {currentDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}.
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
