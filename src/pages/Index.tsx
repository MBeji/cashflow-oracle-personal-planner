import { useState, useMemo } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CashFlowSettings } from '@/components/CashFlowSettings';
import { MonthlyForecast } from '@/components/MonthlyForecast';
import { CustomExpensesManager } from '@/components/CustomExpensesManager';
import { VacationManager } from '@/components/VacationManager';
import { ChantierManager } from '@/components/ChantierManager';
import { Statistics } from '@/components/Statistics';
import { calculateMonthlyData } from '@/utils/cashflow';
import { CashFlowSettings as Settings, CustomExpense } from '@/types/cashflow';
import { Calculator, TrendingUp, Settings as SettingsIcon, PiggyBank } from 'lucide-react';

const Index = () => {
  const [settings, setSettings] = useState<Settings>({
    currentBalance: 3500,
    alertThreshold: 2000,
  });

  const [customExpenses, setCustomExpenses] = useState<CustomExpense[]>([]);
  const [vacationExpenses, setVacationExpenses] = useState<{ [key: string]: number }>({});
  const [chantierExpenses, setChantierExpenses] = useState<{ [key: string]: number }>({});

  const monthlyData = useMemo(() => {
    const currentDate = new Date();
    const startMonth = currentDate.getMonth() + 1;
    const startYear = currentDate.getFullYear();
    
    return calculateMonthlyData(
      startMonth,
      startYear,
      20,
      settings.currentBalance,
      customExpenses,
      chantierExpenses,
      vacationExpenses
    );
  }, [settings.currentBalance, customExpenses, chantierExpenses, vacationExpenses]);

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

        <Tabs defaultValue="forecast" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="forecast" className="flex items-center gap-2">
              <Calculator className="h-4 w-4" />
              Prévisions
            </TabsTrigger>
            <TabsTrigger value="statistics" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Statistiques
            </TabsTrigger>
            <TabsTrigger value="expenses" className="flex items-center gap-2">
              <PiggyBank className="h-4 w-4" />
              Dépenses
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <SettingsIcon className="h-4 w-4" />
              Paramètres
            </TabsTrigger>
          </TabsList>

          <TabsContent value="forecast" className="space-y-6">
            <MonthlyForecast data={monthlyData} alertThreshold={settings.alertThreshold} />
          </TabsContent>

          <TabsContent value="statistics" className="space-y-6">
            <Statistics data={monthlyData} alertThreshold={settings.alertThreshold} />
          </TabsContent>

          <TabsContent value="expenses" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-6">
                <VacationManager 
                  vacationExpenses={vacationExpenses}
                  onVacationChange={setVacationExpenses}
                />
                <ChantierManager 
                  chantierExpenses={chantierExpenses}
                  onChantierChange={setChantierExpenses}
                />
              </div>
              <div>
                <CustomExpensesManager 
                  expenses={customExpenses}
                  onExpensesChange={setCustomExpenses}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <div className="max-w-md mx-auto">
              <CashFlowSettings 
                settings={settings}
                onSettingsChange={setSettings}
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
