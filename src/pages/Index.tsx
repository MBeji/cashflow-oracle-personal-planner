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
import { ArchiveManager } from '@/components/ArchiveManager';
import { ArchivedMonthsView } from '@/components/ArchivedMonthsView';
import { ExpensePlanningManager } from '@/components/ExpensePlanningManager';
import { UserProfile } from '@/components/UserProfile';
import { ResetMohamedConfig } from '@/components/ResetMohamedConfig';
import { calculateMonthlyData } from '@/utils/cashflow';
import { StorageService } from '@/utils/storage';
import { CashFlowSettings as Settings, CustomExpense, FixedAmounts, MonthlyCustomExpense, ExpenseSettings, ArchivedMonth, ExpensePlanningSettings } from '@/types/cashflow';
import { Calculator, TrendingUp, Settings as SettingsIcon, LayoutGrid, List, Archive, Calendar } from 'lucide-react';
import { createInitialUserSettings, getDefaultConfigForUser } from '@/config/defaultUserConfig';

// Fonction pour générer les dépenses de vacances par défaut pour l'année courante
const getDefaultVacationExpenses = () => {
  const currentYear = new Date().getFullYear();
  return {
    [`${currentYear}-07`]: 3500, // Juillet année courante
    [`${currentYear}-08`]: 3500  // Août année courante
  };
};

const Index = () => {
  // Initialisation avec les valeurs par défaut configurables
  const [settings, setSettings] = useState<Settings>(() => {
    // Pour l'instant, on utilise la config par défaut
    // Quand l'utilisateur se connecte, on mettra à jour avec ses valeurs spécifiques
    return createInitialUserSettings();
  });
  
  const [customExpenses, setCustomExpenses] = useState<CustomExpense[]>([]);
  const [vacationExpenses, setVacationExpenses] = useState<{ [key: string]: number }>(getDefaultVacationExpenses());
  const [chantierExpenses, setChantierExpenses] = useState<{ [key: string]: number }>({});
  const [monthlyCustomExpenses, setMonthlyCustomExpenses] = useState<{ [key: string]: MonthlyCustomExpense[] }>({});
  const [viewMode, setViewMode] = useState<'detailed' | 'compact'>('detailed');
  const [selectedMonthIndex, setSelectedMonthIndex] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<string>('forecast');  // État pour gérer les prévisions de dépenses du mois en cours
  // Initialisé à 0 par défaut
  const [currentMonthExpenseForecast, setCurrentMonthExpenseForecast] = useState<number>(0);

  // Charger les données au démarrage
  useEffect(() => {
    const defaultConfig = createInitialUserSettings();
    const savedSettings = StorageService.load('cashflow-settings', defaultConfig);
    
    // S'assurer que les nouvelles propriétés existent dans les données chargées
    if (!savedSettings.fixedAmounts) {
      savedSettings.fixedAmounts = defaultConfig.fixedAmounts;
    }
    if (!savedSettings.expensePlanningSettings) {
      savedSettings.expensePlanningSettings = defaultConfig.expensePlanningSettings;
    }
    if (!savedSettings.expenseSettings) {
      savedSettings.expenseSettings = defaultConfig.expenseSettings;
    }
    
    const savedCustomExpenses = StorageService.load('cashflow-custom-expenses', []);
    const savedVacationExpenses = StorageService.load('cashflow-vacation-expenses', getDefaultVacationExpenses());
    const savedChantierExpenses = StorageService.load('cashflow-chantier-expenses', {});
    const savedMonthlyCustomExpenses = StorageService.load('cashflow-monthly-custom-expenses', {});
    
    setSettings(savedSettings);
    setCustomExpenses(savedCustomExpenses);
    setVacationExpenses(savedVacationExpenses);
    setChantierExpenses(savedChantierExpenses);
    setMonthlyCustomExpenses(savedMonthlyCustomExpenses);
    
    // currentMonthExpenseForecast reste à 0 par défaut
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
    StorageService.save('cashflow-monthly-custom-expenses', monthlyCustomExpenses);
  }, [monthlyCustomExpenses]);
  const monthlyData = useMemo(() => {
    // Utiliser le mois courant défini dans les settings, sinon le mois actuel
    const startMonth = settings.currentMonth || new Date().getMonth() + 1;
    const startYear = settings.currentYear || new Date().getFullYear();
    
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
      settings.expenseSettings,
      currentMonthExpenseForecast,
      settings.expensePlanningSettings
    );
  }, [settings, customExpenses, chantierExpenses, vacationExpenses, monthlyCustomExpenses, currentMonthExpenseForecast]);

  const handleCurrentBalanceChange = (value: number) => {
    setSettings(prev => ({ ...prev, currentBalance: value }));
  };

  // Handler pour gérer les changements de prévision de dépenses du mois en cours
  const handleCurrentMonthExpenseForecastChange = (forecast: number) => {
    setCurrentMonthExpenseForecast(forecast);
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
  };  const handleDataImport = (data: any) => {
    if (data.settings) setSettings(data.settings);
    if (data.customExpenses) setCustomExpenses(data.customExpenses);
    if (data.vacationExpenses) setVacationExpenses(data.vacationExpenses);
    if (data.chantierExpenses) setChantierExpenses(data.chantierExpenses);
    if (data.monthlyCustomExpenses) setMonthlyCustomExpenses(data.monthlyCustomExpenses);
    alert('Données importées avec succès !');
  };
  const handleArchive = (archivedMonth: ArchivedMonth) => {
    setSettings(prev => ({
      ...prev,
      archivedMonths: [...prev.archivedMonths, archivedMonth],
      currentBalance: archivedMonth.actualData.endingBalance,
      currentMonth: archivedMonth.month === 12 ? 1 : archivedMonth.month + 1,
      currentYear: archivedMonth.month === 12 ? archivedMonth.year + 1 : archivedMonth.year
    }));
    
    // Optionnel : Réinitialiser les prévisions du mois courant
    setCurrentMonthExpenseForecast(0);
  };

  const handleArchiveComplete = () => {
    // Revenir à l'onglet principal après archivage
    setActiveTab('forecast');
    
    // Afficher une notification de succès
    const nextMonthName = settings.currentMonth === 12 ? 'Janvier' : 
      new Date(2000, settings.currentMonth || 0, 1).toLocaleDateString('fr-FR', { month: 'long' });
    
    setTimeout(() => {
      alert(`✅ Archivage réussi !\n${nextMonthName} est maintenant le mois courant.`);
    }, 500);
  };  const handleReset = () => {
    if (confirm('Êtes-vous sûr de vouloir réinitialiser toutes les données ?')) {
      // Utiliser la configuration par défaut
      const defaultSettings = createInitialUserSettings();
      
      setSettings(defaultSettings);
      setCustomExpenses([]);
      setVacationExpenses(getDefaultVacationExpenses());
      setChantierExpenses({});
      setMonthlyCustomExpenses({});
      
      // Supprimer du localStorage
      StorageService.remove('cashflow-settings');
      StorageService.remove('cashflow-custom-expenses');
      StorageService.remove('cashflow-vacation-expenses');
      StorageService.remove('cashflow-chantier-expenses');
      StorageService.remove('cashflow-monthly-custom-expenses');
      
      alert('Données réinitialisées !');
    }
  };
  const getCurrentMonthDisplay = () => {
    const currentMonth = settings.currentMonth || new Date().getMonth() + 1;
    const currentYear = settings.currentYear || new Date().getFullYear();
    const monthNames = [
      'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
      'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
    ];
    return `${monthNames[currentMonth - 1]} ${currentYear}`;
  };
  return (
    <div className="min-h-screen bg-background">
      {/* Header avec navigation */}
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold text-foreground">💰 Cash Flow</h2>
            </div>
            
            <UserProfile
              settings={settings}
              onSettingsUpdate={setSettings}
              archivedMonths={settings.archivedMonths}
              onArchivedMonthsUpdate={(months) => setSettings(prev => ({ ...prev, archivedMonths: months }))}
              expensePlanning={settings.expensePlanningSettings}
              onExpensePlanningUpdate={(planning) => setSettings(prev => ({ ...prev, expensePlanningSettings: planning }))}
            />
          </div>
        </div>
      </header>      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Composant de réinitialisation pour Mohamed */}
        <ResetMohamedConfig 
          onSettingsUpdate={setSettings}
          userEmail={undefined} // Pour l'instant, on l'affiche toujours pour debug
        />
        
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            💰 Cash Flow Personnel
          </h1>
          <p className="text-lg text-muted-foreground">
            Prévision et suivi de votre trésorerie personnelle
          </p>
          <div className="mt-3">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
              📅 Mois courant : {getCurrentMonthDisplay()}
              {settings.archivedMonths.length > 0 && (
                <span className="ml-2 text-xs bg-blue-200 px-2 py-0.5 rounded-full">
                  {settings.archivedMonths.length} mois archivé{settings.archivedMonths.length > 1 ? 's' : ''}
                </span>
              )}
            </span>
          </div>
        </div>{/* Solde actuel - Maintenant dans la page principale */}
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
        </div>        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="forecast" className="flex items-center gap-2">
              <Calculator className="h-4 w-4" />
              Prévisions
            </TabsTrigger>
            <TabsTrigger value="statistics" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Statistiques
            </TabsTrigger>
            <TabsTrigger value="planning" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Planification
            </TabsTrigger>
            <TabsTrigger value="archives" className="flex items-center gap-2">
              <Archive className="h-4 w-4" />
              Archives
              {settings.archivedMonths.length > 0 && (
                <span className="ml-1 bg-blue-500 text-white text-xs rounded-full px-2 py-0.5 min-w-[1.5rem] text-center">
                  {settings.archivedMonths.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <SettingsIcon className="h-4 w-4" />
              Paramètres
            </TabsTrigger>
          </TabsList><TabsContent value="forecast" className="space-y-6">
            <FinancialSummary data={monthlyData} alertThreshold={settings.alertThreshold} />
            <CashFlowChart data={monthlyData} alertThreshold={settings.alertThreshold} />
              {/* Gestionnaire d'archivage */}
            {monthlyData.length > 0 && (
              <ArchiveManager
                currentMonthData={monthlyData[0]}
                onArchive={handleArchive}
                onArchiveComplete={handleArchiveComplete}
                className="mb-6"
              />
            )}
            
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
            </div>{viewMode === 'compact' ? (              <CompactView 
                data={monthlyData}
                alertThreshold={settings.alertThreshold}
                onMonthClick={(index) => {
                  setSelectedMonthIndex(index);
                  setViewMode('detailed');
                }}
                vacationExpenses={vacationExpenses}
                chantierExpenses={chantierExpenses}
              />            ) : (              <MonthlyForecast 
                data={monthlyData} 
                alertThreshold={settings.alertThreshold}
                monthsToDisplay={settings.monthsToDisplay}
                currentBalance={settings.currentBalance}
                onCurrentBalanceChange={handleCurrentBalanceChange}
                onCurrentMonthExpenseForecastChange={handleCurrentMonthExpenseForecastChange}
                currentMonthExpenseForecast={currentMonthExpenseForecast}
                onVacationChange={handleVacationChange}
                onChantierChange={handleChantierChange}
                onMonthlyCustomExpenseAdd={handleMonthlyCustomExpenseAdd}
                onMonthlyCustomExpenseRemove={handleMonthlyCustomExpenseRemove}
                vacationExpenses={vacationExpenses}
                chantierExpenses={chantierExpenses}
                monthlyCustomExpenses={monthlyCustomExpenses}
              />
            )}          </TabsContent>

          <TabsContent value="statistics" className="space-y-6">
            <Statistics data={monthlyData} alertThreshold={settings.alertThreshold} />
            <ExpenseStats 
              expenseSettings={settings.expenseSettings}
              currentDate={new Date()}
            />
          </TabsContent>

          <TabsContent value="planning" className="space-y-6">
            <ExpensePlanningManager
              settings={settings.expensePlanningSettings}
              onSettingsChange={(newPlanningSettings) => {
                setSettings(prev => ({
                  ...prev,
                  expensePlanningSettings: newPlanningSettings
                }));
              }}
            />
          </TabsContent>

          <TabsContent value="archives" className="space-y-6">
            <div className="max-w-6xl mx-auto">
              {settings.archivedMonths.length === 0 && (
                <div className="text-center py-12">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 max-w-md mx-auto">
                    <Archive className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-blue-800 mb-2">
                      Aucun mois archivé
                    </h3>
                    <p className="text-blue-600 text-sm mb-4">
                      Lorsque vous archiverez votre premier mois, l'historique apparaîtra ici.
                    </p>
                    <Button 
                      onClick={() => setActiveTab('forecast')}
                      variant="outline"
                      className="border-blue-300 text-blue-700 hover:bg-blue-100"
                    >
                      Retour aux prévisions
                    </Button>
                  </div>
                </div>
              )}
              <ArchivedMonthsView 
                archivedMonths={settings.archivedMonths}
              />
            </div>
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
              </div>              <ChantierManager 
                chantierExpenses={chantierExpenses}
                onChantierChange={setChantierExpenses}
              />
              
              <DataManagement
                settings={settings}
                customExpenses={customExpenses}
                vacationExpenses={vacationExpenses}
                chantierExpenses={chantierExpenses}
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
