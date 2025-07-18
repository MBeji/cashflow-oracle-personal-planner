import { useState, useMemo } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MonthlyForecast } from '@/components/MonthlyForecast';
import { Statistics } from '@/components/Statistics';
import { calculateMonthlyData } from '@/utils/cashflow';
import { CashFlowSettings as Settings, CustomExpense } from '@/types/cashflow';
import { Calculator, TrendingUp, Settings as SettingsIcon } from 'lucide-react';

const Index = () => {
  const [settings, setSettings] = useState<Settings>({
    currentBalance: 3500,
    alertThreshold: 2000,
  });

  const [customExpenses, setCustomExpenses] = useState<CustomExpense[]>([]);
  const [vacationExpenses, setVacationExpenses] = useState<{ [key: string]: number }>({});
  const [chantierExpenses, setChantierExpenses] = useState<{ [key: string]: number }>({});
  const [customMonthlyExpenses, setCustomMonthlyExpenses] = useState<{ [key: string]: number }>({});

  const monthlyData = useMemo(() => {
    const currentDate = new Date();
    const startMonth = currentDate.getMonth() + 1;
    const startYear = currentDate.getFullYear();
    
    // Fusionner les dépenses vacances avec les dépenses éditables
    const mergedVacationExpenses = { ...vacationExpenses };
    
    // Fusionner les dépenses chantier avec les dépenses éditables
    const mergedChantierExpenses = { ...chantierExpenses };
    
    return calculateMonthlyData(
      startMonth,
      startYear,
      20,
      settings.currentBalance,
      customExpenses,
      mergedChantierExpenses,
      mergedVacationExpenses
    );
  }, [settings.currentBalance, customExpenses, chantierExpenses, vacationExpenses, customMonthlyExpenses]);

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
  };

  const handleCustomExpenseChange = (monthKey: string, amount: number) => {
    setCustomMonthlyExpenses(prev => ({
      ...prev,
      [monthKey]: amount
    }));
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
        </div>

        {/* Solde actuel - Maintenant dans la page principale */}
        <div className="mb-6 max-w-md mx-auto">
          <div className="space-y-2">
            <label htmlFor="currentBalance" className="text-sm font-medium">
              Solde actuel (TND)
            </label>
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
          </TabsList>

          <TabsContent value="forecast" className="space-y-6">
            <MonthlyForecast 
              data={monthlyData} 
              alertThreshold={settings.alertThreshold}
              onVacationChange={handleVacationChange}
              onChantierChange={handleChantierChange}
              onCustomExpenseChange={handleCustomExpenseChange}
              vacationExpenses={vacationExpenses}
              chantierExpenses={chantierExpenses}
              customExpenses={customMonthlyExpenses}
            />
          </TabsContent>

          <TabsContent value="statistics" className="space-y-6">
            <Statistics data={monthlyData} alertThreshold={settings.alertThreshold} />
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <div className="max-w-md mx-auto">
              <div className="space-y-2">
                <label htmlFor="alertThreshold" className="text-sm font-medium">
                  Seuil d'alerte (TND)
                </label>
                <input
                  id="alertThreshold"
                  type="number"
                  value={settings.alertThreshold}
                  onChange={(e) => handleAlertThresholdChange(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
