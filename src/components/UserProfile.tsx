import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Cloud, 
  CloudOff, 
  User, 
  LogOut, 
  Upload, 
  Download, 
  RefreshCw,
  Settings,
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { AuthModal } from './AuthModal';
import { AuthService } from '@/services/AuthService';
import { DataService } from '@/services/DataService';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { CashFlowSettings, ArchivedMonth, ExpensePlanningSettings } from '@/types/cashflow';
import { createInitialUserSettings } from '@/config/defaultUserConfig';

interface UserProfileProps {
  settings: CashFlowSettings;
  onSettingsUpdate: (settings: CashFlowSettings) => void;
  archivedMonths: ArchivedMonth[];
  onArchivedMonthsUpdate: (months: ArchivedMonth[]) => void;
  expensePlanning: ExpensePlanningSettings;
  onExpensePlanningUpdate: (planning: ExpensePlanningSettings) => void;
}

export const UserProfile: React.FC<UserProfileProps> = ({
  settings,
  onSettingsUpdate,
  archivedMonths,
  onArchivedMonthsUpdate,
  expensePlanning,
  onExpensePlanningUpdate
}) => {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'success' | 'error'>('idle');
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Vérifier l'utilisateur connecté au démarrage
  useEffect(() => {
    checkCurrentUser();
    
    // Écouter les changements d'authentification
    const { data: { subscription } } = AuthService.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
      if (event === 'SIGNED_OUT') {
        setLastSync(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkCurrentUser = async () => {
    setIsLoading(true);
    try {
      const currentUser = await AuthService.getCurrentUser();
      setUser(currentUser);
    } catch (err) {
      console.error('Erreur lors de la vérification de l\'utilisateur:', err);
    } finally {
      setIsLoading(false);
    }
  };
  const handleLogin = (loggedInUser: SupabaseUser) => {
    setUser(loggedInUser);
    
    // Vérifier si l'utilisateur a des paramètres personnalisés ou utiliser les valeurs par défaut
    const userSpecificSettings = createInitialUserSettings(loggedInUser.email || undefined);
    
    // Si c'est la première connexion, on applique la configuration spécifique
    // Pour Mohamed Beji, cela appliquera ses valeurs actuelles
    // Pour les nouveaux utilisateurs, cela appliquera les valeurs par défaut (salaire 6000, etc.)
    if (!settings.archivedMonths || settings.archivedMonths.length === 0) {
      // Première connexion ou pas de données existantes
      onSettingsUpdate(userSpecificSettings);
    }
    
    // Auto-sync après connexion
    setTimeout(() => handleSync(), 1000);
  };

  const handleLogout = async () => {
    setSyncStatus('idle');
    await AuthService.signOut();
    setUser(null);
    setLastSync(null);
  };

  const handleSync = async () => {
    if (!user) return;
    
    setSyncStatus('syncing');

    try {
      // Upload des données locales
      await DataService.saveUserSettings(user.id, settings);
      await DataService.saveArchivedMonths(user.id, archivedMonths);
      await DataService.saveExpensePlanningSettings(user.id, expensePlanning);

      // Download des données cloud pour s'assurer de la cohérence
      const settingsResult = await DataService.getUserSettings(user.id);
      if (settingsResult.data) {
        onSettingsUpdate(settingsResult.data);
      }

      const archivesResult = await DataService.getArchivedMonths(user.id);
      if (archivesResult.data) {
        onArchivedMonthsUpdate(archivesResult.data);
      }

      const planningResult = await DataService.getExpensePlanning(user.id);
      if (planningResult.data) {
        onExpensePlanningUpdate(planningResult.data);
      }

      setSyncStatus('success');
      setLastSync(new Date());
      
      setTimeout(() => setSyncStatus('idle'), 3000);
    } catch (err: any) {
      console.error('Erreur de synchronisation:', err);
      setSyncStatus('error');
      setTimeout(() => setSyncStatus('idle'), 5000);
    }
  };

  const getSyncIcon = () => {
    switch (syncStatus) {
      case 'syncing': return <Loader2 className="h-3 w-3 animate-spin" />;
      case 'success': return <CheckCircle className="h-3 w-3 text-green-600" />;
      case 'error': return <AlertCircle className="h-3 w-3 text-red-600" />;
      default: return user ? <Cloud className="h-3 w-3 text-blue-600" /> : <CloudOff className="h-3 w-3 text-gray-400" />;
    }
  };

  const getInitials = (email: string) => {
    return email.substring(0, 2).toUpperCase();
  };

  if (isLoading) {
    return (
      <Button variant="ghost" size="sm" disabled>
        <Loader2 className="h-4 w-4 animate-spin mr-2" />
        Chargement...
      </Button>
    );
  }

  if (!user) {
    return (
      <>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setIsAuthModalOpen(true)}
          className="flex items-center gap-2"
        >
          <CloudOff className="h-4 w-4" />
          Se connecter
        </Button>
        
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          onSuccess={handleLogin}
        />
      </>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {/* Badge de statut de sync */}
      <Badge variant="outline" className="flex items-center gap-1 px-2 py-1">
        {getSyncIcon()}
        <span className="text-xs">
          {syncStatus === 'syncing' && 'Sync...'}
          {syncStatus === 'success' && 'OK'}
          {syncStatus === 'error' && 'Erreur'}
          {syncStatus === 'idle' && 'Cloud'}
        </span>
      </Badge>

      {/* Menu utilisateur */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-blue-100 text-blue-600 text-xs">
                {getInitials(user.email || '')}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        
        <DropdownMenuContent className="w-64" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">Compte Cloud</p>
              <p className="text-xs leading-none text-muted-foreground">
                {user.email}
              </p>
              {lastSync && (
                <p className="text-xs text-gray-500">
                  Dernière sync: {lastSync.toLocaleTimeString()}
                </p>
              )}
            </div>
          </DropdownMenuLabel>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem 
            onClick={handleSync}
            disabled={syncStatus === 'syncing'}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Synchroniser maintenant
          </DropdownMenuItem>
          
          <DropdownMenuItem 
            onClick={() => handleSync()}
            disabled={syncStatus === 'syncing'}
          >
            <Upload className="mr-2 h-4 w-4" />
            Sauvegarder
          </DropdownMenuItem>
          
          <DropdownMenuItem 
            onClick={() => handleSync()}
            disabled={syncStatus === 'syncing'}
          >
            <Download className="mr-2 h-4 w-4" />
            Restaurer
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Se déconnecter
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
