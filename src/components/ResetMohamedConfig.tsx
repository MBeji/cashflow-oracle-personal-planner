import React from 'react';
import { Button } from '@/components/ui/button';
import { createInitialUserSettings } from '@/config/defaultUserConfig';
import { RefreshCw } from 'lucide-react';

interface ResetMohamedConfigProps {
  onSettingsUpdate: (settings: any) => void;
  userEmail?: string;
}

export const ResetMohamedConfig: React.FC<ResetMohamedConfigProps> = ({ 
  onSettingsUpdate, 
  userEmail 
}) => {
  const handleResetToMohamedConfig = () => {
    // Effacer le localStorage pour forcer un rechargement propre
    localStorage.removeItem('cashflow-settings');
    localStorage.removeItem('cashflow-custom-expenses');
    localStorage.removeItem('cashflow-vacation-expenses');
    localStorage.removeItem('cashflow-chantier-expenses');
    localStorage.removeItem('cashflow-monthly-custom-expenses');
    
    // Appliquer la configuration spécifique à Mohamed
    const mohamedSettings = createInitialUserSettings('mbeji@sofrecom.fr');
    
    console.log('🔄 Réinitialisation avec config Mohamed');
    console.log('💰 Nouveau salaire:', mohamedSettings.fixedAmounts.salary);
    console.log('🏦 Nouvelle dette:', mohamedSettings.fixedAmounts.debt);
    
    onSettingsUpdate(mohamedSettings);
    
    alert(`Configuration Mohamed appliquée !
Salaire: ${mohamedSettings.fixedAmounts.salary} TND
Dette: ${mohamedSettings.fixedAmounts.debt} TND
Frais scolaires: ${mohamedSettings.fixedAmounts.schoolExpense} TND`);
  };

  // Afficher le bouton seulement si c'est Mohamed ou pour debug
  const showButton = !userEmail || 
    userEmail.includes('mbeji') || 
    userEmail.includes('mohamed') ||
    userEmail.includes('beji');

  if (!showButton) return null;

  return (
    <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg mb-4">
      <h3 className="text-lg font-semibold text-orange-800 mb-2">
        🔧 Configuration Mohamed Beji
      </h3>
      <p className="text-sm text-orange-700 mb-3">
        Si vos paramètres n'affichent pas les bonnes valeurs (salaire 12750 TND, dette 6000 TND), 
        cliquez sur ce bouton pour forcer l'application de votre configuration spécifique.
      </p>
      <Button 
        onClick={handleResetToMohamedConfig}
        variant="outline"
        className="bg-orange-100 border-orange-300 text-orange-800 hover:bg-orange-200"
      >
        <RefreshCw className="w-4 h-4 mr-2" />
        Appliquer ma configuration
      </Button>
    </div>
  );
};
