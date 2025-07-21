import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Calculator, TrendingUp, Settings as SettingsIcon, ChevronLeft } from 'lucide-react';
import { useMobileDetection, useSwipeGesture } from '@/hooks/useMobile';
import { cn } from '@/lib/utils';

interface MobileOptimizedTabsProps {
  children: React.ReactNode;
  defaultValue?: string;
  className?: string;
}

interface TabConfig {
  value: string;
  icon: React.ReactNode;
  label: string;
}

const tabConfigs: TabConfig[] = [
  {
    value: 'forecast',
    icon: <Calculator className="h-4 w-4" />,
    label: 'Prévisions'
  },
  {
    value: 'statistics',
    icon: <TrendingUp className="h-4 w-4" />,
    label: 'Stats'
  },
  {
    value: 'settings',
    icon: <SettingsIcon className="h-4 w-4" />,
    label: 'Config'
  }
];

export function MobileOptimizedTabs({ 
  children, 
  defaultValue = 'forecast',
  className 
}: MobileOptimizedTabsProps) {
  const [currentTab, setCurrentTab] = useState(defaultValue);
  const { isMobile } = useMobileDetection();

  // Gestion des gestes de swipe pour navigation
  const currentTabIndex = tabConfigs.findIndex(tab => tab.value === currentTab);
  
  const handleSwipeLeft = () => {
    if (currentTabIndex < tabConfigs.length - 1) {
      setCurrentTab(tabConfigs[currentTabIndex + 1].value);
    }
  };

  const handleSwipeRight = () => {
    if (currentTabIndex > 0) {
      setCurrentTab(tabConfigs[currentTabIndex - 1].value);
    }
  };

  const swipeGesture = useSwipeGesture({
    onSwipeLeft: handleSwipeLeft,
    onSwipeRight: handleSwipeRight,
    threshold: 100
  });

  // Ajouter les gestionnaires de swipe au niveau document pour mobile
  useEffect(() => {
    if (isMobile) {
      document.addEventListener('touchstart', swipeGesture.onTouchStart);
      document.addEventListener('touchend', swipeGesture.onTouchEnd);

      return () => {
        document.removeEventListener('touchstart', swipeGesture.onTouchStart);
        document.removeEventListener('touchend', swipeGesture.onTouchEnd);
      };
    }
  }, [isMobile, swipeGesture]);

  if (isMobile) {
    return (
      <div className={cn("min-h-screen bg-background", className)}>
        {/* Header mobile avec navigation */}
        <div className="sticky top-0 z-40 bg-background border-b border-border">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-3">
              {currentTabIndex > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCurrentTab(tabConfigs[currentTabIndex - 1].value)}
                  className="p-2"
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
              )}
              <div className="flex items-center space-x-2">
                {tabConfigs.find(tab => tab.value === currentTab)?.icon}
                <h2 className="text-lg font-semibold">
                  {tabConfigs.find(tab => tab.value === currentTab)?.label}
                </h2>
              </div>
            </div>
            
            {/* Indicateur de position */}
            <div className="flex space-x-1">
              {tabConfigs.map((_, index) => (
                <div
                  key={index}
                  className={cn(
                    "w-2 h-2 rounded-full transition-colors",
                    index === currentTabIndex 
                      ? "bg-primary" 
                      : "bg-muted-foreground/30"
                  )}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Contenu avec espacement pour navigation fixe */}
        <div className="mobile-content">
          <Tabs value={currentTab} onValueChange={setCurrentTab}>
            {children}
          </Tabs>
        </div>

        {/* Navigation en bas pour mobile */}
        <div className="mobile-tabs-bottom">
          <TabsList className="grid w-full grid-cols-3 bg-transparent h-auto">
            {tabConfigs.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className={cn(
                  "mobile-tab-trigger flex-col space-y-1 data-[state=active]:bg-primary/10",
                  "transition-colors duration-200"
                )}
                onClick={() => setCurrentTab(tab.value)}
              >
                {tab.icon}
                <span className="text-xs">{tab.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {/* Indicateur de swipe (optionnel) */}
        {isMobile && (
          <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 text-xs text-muted-foreground bg-background/80 px-3 py-1 rounded-full border opacity-60">
            Glissez pour naviguer
          </div>
        )}
      </div>
    );
  }

  // Version desktop normale
  return (
    <Tabs value={currentTab} onValueChange={setCurrentTab} className={className}>
      <TabsList className="grid w-full grid-cols-3">
        {tabConfigs.map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            className="flex items-center gap-2"
          >
            {tab.icon}
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {children}
    </Tabs>
  );
}

export default MobileOptimizedTabs;
