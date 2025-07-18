import { useState, useMemo, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { MonthlyForecast } from '@/components/MonthlyForecast';
import { Statistics } from '@/components/Statistics';
import { CustomExpensesManager } from '@/components/CustomExpensesManager';
import { VacationManager } from '@/components/VacationManager';
import { ChantierManager } from '@/components/ChantierManager';
import { CustomRevenueManager } from '@/components/CustomRevenueManager';
import { AdvancedSettings } from '@/components/AdvancedSettings';
import { FinancialSummary } from '@/components/FinancialSummary';
import { CashFlowChart } from '@/components/CashFlowChart';
import { DataManagement } from '@/components/DataManagement';
import { CompactView } from '@/components/CompactView';
import { FixedAmountsManager } from '@/components/FixedAmountsManager';
import { ExpenseCategoriesManager } from '@/components/ExpenseCategoriesManager';
import { ExpenseStats } from '@/components/ExpenseStats';
import { calculateMonthlyData } from '@/utils/cashflow';
import { StorageService } from '@/utils/storage';
import { CashFlowSettings as Settings, CustomExpense, FixedAmounts, MonthlyCustomExpense, ExpenseSettings } from '@/types/cashflow';
import { Calculator, TrendingUp, Settings as SettingsIcon, LayoutGrid, List } from 'lucide-react';

const defaultExpenseSettings: ExpenseSettings = {
  defaultCategories: [],
  defaultSubcategories: [],
  monthlyBreakdowns: []
};

const defaultFixedAmounts: FixedAmounts = {
  salary: 12750,
  fuelRevenue: 500,
  healthInsuranceRevenue: 1000,
  bonusMultipliers: {
    march: 19125, // 1.5 * 12750
    june: 6375,   // 0.5 * 12750
    september: 19125, // 1.5 * 12750
    december: 6375    // 0.5 * 12750
  },
  debt: 6000,
  currentExpenses: 5000,
  fuelExpense: 500,
  healthInsuranceExpense: 1000,
  schoolExpense: 15000
};

const Index = () => {  const [settings, setSettings] = useState<Settings>({
    currentBalance: 3500,
    alertThreshold: 2000,
    monthsToDisplay: 20,
    customRevenues: [],
    customRecurringExpenses: [],
    fixedAmounts: defaultFixedAmounts,
    expenseSettings: defaultExpenseSettings,
  });
  const [customExpenses, setCustomExpenses] = useState<CustomExpense[]>([]);
  const [vacationExpenses, setVacationExpenses] = useState<{ [key: string]: number }>({});
  const [chantierExpenses, setChantierExpenses] = useState<{ [key: string]: number }>({});
  const [customMonthlyExpenses, setCustomMonthlyExpenses] = useState<{ [key: string]: number }>({});
  const [monthlyCustomExpenses, setMonthlyCustomExpenses] = useState<{ [key: string]: MonthlyCustomExpense[] }>({});
  const [viewMode, setViewMode] = useState<'detailed' | 'compact'>('detailed');
  const [selectedMonthIndex, setSelectedMonthIndex] = useState<number | null>(null);  // Charger les données au démarrage
  useEffect(() => {
    const savedSettings = StorageService.load('cashflow-settings', settings);
    // S'assurer que fixedAmounts existe dans les données chargées
    if (!savedSettings.fixedAmounts) {
      savedSettings.fixedAmounts = defaultFixedAmounts;
    }
    const savedCustomExpenses = StorageService.load('cashflow-custom-expenses', []);
    const savedVacationExpenses = StorageService.load('cashflow-vacation-expenses', {});
    const savedChantierExpenses = StorageService.load('cashflow-chantier-expenses', {});
    const savedMonthlyExpenses = StorageService.load('cashflow-monthly-expenses', {});
    const savedMonthlyCustomExpenses = StorageService.load('cashflow-monthly-custom-expenses', {});

    setSettings(savedSettings);
    setCustomExpenses(savedCustomExpenses);
    setVacationExpenses(savedVacationExpenses);
    setChantierExpenses(savedChantierExpenses);
    setCustomMonthlyExpenses(savedMonthlyExpenses);
    setMonthlyCustomExpenses(savedMonthlyCustomExpenses);
  }, []);

  // Sauvegarder automatiquement
  useEffect(() => {
    StorageService.save('cashflow-settings', settings);
  }, [settings]);

  useEffect(() => {
    StorageService.save('cashflow-custom-expenses', customExpenses);
  }, [customExpenses]);

  useEffect(() => {
    StorageService.save('cashflow-vacation-expenses', vacationExpenses);
  }, [vacationExpenses]);

  useEffect(() => {
    StorageService.save('cashflow-chantier-expenses', chantierExpenses);
  }, [chantierExpenses]);
  useEffect(() => {
    StorageService.save('cashflow-monthly-expenses', customMonthlyExpenses);
  }, [customMonthlyExpenses]);

  useEffect(() => {
    StorageService.save('cashflow-monthly-custom-expenses', monthlyCustomExpenses);
  }, [monthlyCustomExpenses]);

  const monthlyData = useMemo(() => {
    const currentDate = new Date();
    const startMonth = currentDate.getMonth() + 1;
    const startYear = currentDate.getFullYear();
    
    // Fusionner les dépenses vacances avec les dépenses éditables
    const mergedVacationExpenses = { ...vacationExpenses };
    
    // Fusionner les dépenses chantier avec les dépenses éditables
    const mergedChantierExpenses = { ...chantierExpenses };    return calculateMonthlyData(
      startMonth,
      startYear,
      settings.monthsToDisplay,
      settings.currentBalance,
      [...customExpenses, ...settings.customRecurringExpenses],
      mergedChantierExpenses,
      mergedVacationExpenses,
      settings.customRevenues,
      settings.fixedAmounts,
      monthlyCustomExpenses,
      settings.expenseSettings
    );
  }, [settings, customExpenses, chantierExpenses, vacationExpenses, customMonthlyExpenses, monthlyCustomExpenses]);

  const handleCurrentBalanceChange = (value: number) => {
    setSettings(prev => ({ ...prev, currentBalance: value }));
  };

  const handleAlertThresholdChange = (value: number) => {
    setSettings(prev => ({ ...prev, alertThreshold: value }));
  };

  const handleVacationChange = (monthKey: string, amount: number) => {
    setVacationExpenses(prev => ({
      ...prev,
      [monthKey]: amount
    }));
  };

  const handleChantierChange = (monthKey: string, amount: number) => {
    setChantierExpenses(prev => ({
      ...prev,
      [monthKey]: amount
    }));
  };  const handleCustomExpenseChange = (monthKey: string, amount: number) => {
    setCustomMonthlyExpenses(prev => ({
      ...prev,
      [monthKey]: amount
    }));
  };

  const handleMonthlyCustomExpenseAdd = (monthKey: string, expense: MonthlyCustomExpense) => {
    setMonthlyCustomExpenses(prev => ({
      ...prev,
      [monthKey]: [...(prev[monthKey] || []), expense]
    }));
  };

  const handleMonthlyCustomExpenseRemove = (monthKey: string, expenseId: string) => {
    setMonthlyCustomExpenses(prev => ({
      ...prev,
      [monthKey]: (prev[monthKey] || []).filter(exp => exp.id !== expenseId)
    }));
  };  const handleSettingsChange = (newSettings: Settings) => {
    setSettings(newSettings);
  };

  const handleExpenseSettingsChange = (newExpenseSettings: ExpenseSettings) => {
    setSettings(prev => ({
      ...prev,
      expenseSettings: newExpenseSettings
    }));
  };
  const handleDataImport = (data: any) => {
    if (data.settings) setSettings(data.settings);
    if (data.customExpenses) setCustomExpenses(data.customExpenses);
    if (data.vacationExpenses) setVacationExpenses(data.vacationExpenses);
    if (data.chantierExpenses) setChantierExpenses(data.chantierExpenses);
    if (data.customMonthlyExpenses) setCustomMonthlyExpenses(data.customMonthlyExpenses);
    if (data.monthlyCustomExpenses) setMonthlyCustomExpenses(data.monthlyCustomExpenses);
    alert('Données importées avec succès !');
  };  const handleReset = () => {
    if (confirm('Êtes-vous sûr de vouloir réinitialiser toutes les données ?')) {      const defaultSettings: Settings = {
        currentBalance: 3500,
        alertThreshold: 2000,
        monthsToDisplay: 20,
        customRevenues: [],
        customRecurringExpenses: [],
        fixedAmounts: defaultFixedAmounts,
        expenseSettings: defaultExpenseSettings,
      };
      setSettings(defaultSettings);
      setCustomExpenses([]);
      setVacationExpenses({});
      setChantierExpenses({});
      setCustomMonthlyExpenses({});
      setMonthlyCustomExpenses({});
      
      // Supprimer du localStorage
      StorageService.remove('cashflow-settings');
      StorageService.remove('cashflow-custom-expenses');
      StorageService.remove('cashflow-vacation-expenses');
      StorageService.remove('cashflow-chantier-expenses');
      StorageService.remove('cashflow-monthly-expenses');
      StorageService.remove('cashflow-monthly-custom-expenses');
      
      alert('Données réinitialisées !');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            💰 Cash Flow Personnel
          </h1>
          <p className="text-lg text-muted-foreground">
            Prévision et suivi sur 20 mois de votre trésorerie personnelle
          </p>
        </div>        {/* Solde actuel - Maintenant dans la page principale */}
        <div className="mb-6 max-w-md mx-auto">
          <div className="space-y-2">
            <label htmlFor="currentBalance" className="text-sm font-medium">
              Solde actuel (TND)
            </label>
            <p className="text-xs text-muted-foreground mb-2">
              💡 Les salaires et bonus sont versés en fin de mois et disponibles le mois suivant
            </p>
            <input
              id="currentBalance"
              type="number"
              value={settings.currentBalance}
              onChange={(e) => handleCurrentBalanceChange(Number(e.target.value))}
              className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>

        <Tabs defaultValue="forecast" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="forecast" className="flex items-center gap-2">
              <Calculator className="h-4 w-4" />
              Prévisions
            </TabsTrigger>
            <TabsTrigger value="statistics" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Statistiques
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <SettingsIcon className="h-4 w-4" />
              Paramètres
            </TabsTrigger>
          </TabsList>          <TabsContent value="forecast" className="space-y-6">
            <FinancialSummary data={monthlyData} alertThreshold={settings.alertThreshold} />
            <CashFlowChart data={monthlyData} alertThreshold={settings.alertThreshold} />
            
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Détail mensuel</h3>
              <div className="flex space-x-2">
                <Button
                  variant={viewMode === 'compact' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('compact')}
                >
                  <LayoutGrid className="w-4 h-4 mr-2" />
                  Compact
                </Button>
                <Button
                  variant={viewMode === 'detailed' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('detailed')}
                >
                  <List className="w-4 h-4 mr-2" />
                  Détaillé
                </Button>
              </div>
            </div>            {viewMode === 'compact' ? (
              <CompactView 
                data={monthlyData}
                alertThreshold={settings.alertThreshold}
                onMonthClick={(index) => {
                  setSelectedMonthIndex(index);
                  setViewMode('detailed');
                }}
                vacationExpenses={vacationExpenses}
                chantierExpenses={chantierExpenses}
                customExpenses={customMonthlyExpenses}
              />
            ) : (              <MonthlyForecast 
                data={monthlyData} 
                alertThreshold={settings.alertThreshold}
                monthsToDisplay={settings.monthsToDisplay}
                onVacationChange={handleVacationChange}
                onChantierChange={handleChantierChange}
                onCustomExpenseChange={handleCustomExpenseChange}
                onMonthlyCustomExpenseAdd={handleMonthlyCustomExpenseAdd}
                onMonthlyCustomExpenseRemove={handleMonthlyCustomExpenseRemove}
                vacationExpenses={vacationExpenses}
                chantierExpenses={chantierExpenses}
                customExpenses={customMonthlyExpenses}
                monthlyCustomExpenses={monthlyCustomExpenses}
              />
            )}
          </TabsContent>          <TabsContent value="statistics" className="space-y-6">
            <Statistics data={monthlyData} alertThreshold={settings.alertThreshold} />
            <ExpenseStats 
              expenseSettings={settings.expenseSettings}
              currentDate={new Date()}
            />
          </TabsContent><TabsContent value="settings" className="space-y-6">
            <div className="max-w-4xl mx-auto space-y-6">
              <AdvancedSettings 
                settings={settings} 
                onSettingsChange={handleSettingsChange} 
              />
                <FixedAmountsManager 
                fixedAmounts={settings.fixedAmounts}
                onFixedAmountsChange={(fixedAmounts) => setSettings(prev => ({ ...prev, fixedAmounts }))}
              />
              
              <ExpenseCategoriesManager 
                expenseSettings={settings.expenseSettings}
                onExpenseSettingsChange={handleExpenseSettingsChange}
                currentDate={new Date()}
              />
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <CustomRevenueManager 
                  revenues={settings.customRevenues}
                  onRevenuesChange={(revenues) => setSettings(prev => ({ ...prev, customRevenues: revenues }))}
                />
                
                <CustomExpensesManager 
                  expenses={settings.customRecurringExpenses}
                  onExpensesChange={(expenses) => setSettings(prev => ({ ...prev, customRecurringExpenses: expenses }))}
                />
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <CustomExpensesManager 
                  expenses={customExpenses}
                  onExpensesChange={setCustomExpenses}
                />
                
                <VacationManager 
                  vacationExpenses={vacationExpenses}
                  onVacationChange={setVacationExpenses}
                />
              </div>
                <ChantierManager 
                chantierExpenses={chantierExpenses}
                onChantierChange={setChantierExpenses}
              />
              
              <DataManagement
                settings={settings}
                customExpenses={customExpenses}
                vacationExpenses={vacationExpenses}
                chantierExpenses={chantierExpenses}
                customMonthlyExpenses={customMonthlyExpenses}
                onDataImport={handleDataImport}
                onReset={handleReset}
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
