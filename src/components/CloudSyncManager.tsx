import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { 
  Cloud, 
  CloudOff, 
  Upload, 
  Download, 
  RefreshCw, 
  CheckCircle, 
  AlertCircle,
  User,
  LogOut,
  Loader2
} from 'lucide-react';
import { AuthModal } from './AuthModal';
import { AuthService } from '@/services/AuthService';
import { DataService } from '@/services/DataService';
import { isSupabaseAvailable, getSupabaseConfigError } from '@/lib/supabase';
import { CashFlowSettings, ArchivedMonth, ExpensePlanningSettings } from '@/types/cashflow';
import { User as SupabaseUser } from '@supabase/supabase-js';

interface CloudSyncManagerProps {
  settings: CashFlowSettings;
  onSettingsUpdate: (settings: CashFlowSettings) => void;
  archivedMonths: ArchivedMonth[];
  onArchivedMonthsUpdate: (months: ArchivedMonth[]) => void;
  expensePlanning: ExpensePlanningSettings;
  onExpensePlanningUpdate: (planning: ExpensePlanningSettings) => void;
}

export const CloudSyncManager: React.FC<CloudSyncManagerProps> = ({
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
  const [lastSync, setLastSync] = useState<Date | null>(null);  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [supabaseConfigured, setSupabaseConfigured] = useState(false);

  // Vérifier la configuration Supabase au démarrage
  useEffect(() => {
    setSupabaseConfigured(isSupabaseAvailable());
    if (!isSupabaseAvailable()) {
      setError(getSupabaseConfigError());
      setIsLoading(false);
      return;
    }
    checkCurrentUser();
  }, []);
  // Vérifier l'utilisateur connecté au démarrage
  useEffect(() => {
    if (!supabaseConfigured) return;
    
    checkCurrentUser();
    
    // Écouter les changements d'authentification
    const { data: { subscription } } = AuthService.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
      if (event === 'SIGNED_OUT') {
        setLastSync(null);
        setError(null);
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
    setError(null);
    // Auto-sync après connexion
    setTimeout(() => handleDownload(), 1000);
  };

  const handleLogout = async () => {
    setSyncStatus('idle');
    await AuthService.signOut();
    setUser(null);
    setLastSync(null);
    setError(null);
  };

  const handleUpload = async () => {
    if (!user) return;
    
    setSyncStatus('syncing');
    setError(null);

    try {
      // Uploader les paramètres
      const settingsResult = await DataService.saveUserSettings(user.id, settings);
      if (settingsResult.error) throw new Error(settingsResult.error);

      // Uploader les archives
      const archivesResult = await DataService.saveArchivedMonths(user.id, archivedMonths);
      if (archivesResult.error) throw new Error(archivesResult.error);      // Uploader la planification
      const planningResult = await DataService.saveExpensePlanningSettings(user.id, expensePlanning);
      if (planningResult.error) throw new Error(planningResult.error);

      setSyncStatus('success');
      setLastSync(new Date());
      
      setTimeout(() => setSyncStatus('idle'), 3000);
    } catch (err: any) {
      setError(err.message || 'Erreur lors de l\'upload');
      setSyncStatus('error');
      setTimeout(() => setSyncStatus('idle'), 5000);
    }
  };

  const handleDownload = async () => {
    if (!user) return;
    
    setSyncStatus('syncing');
    setError(null);

    try {
      // Télécharger les paramètres
      const settingsResult = await DataService.getUserSettings(user.id);
      if (settingsResult.error && !settingsResult.error.includes('No rows')) {
        throw new Error(settingsResult.error);
      }
      if (settingsResult.data) {
        onSettingsUpdate(settingsResult.data);
      }

      // Télécharger les archives
      const archivesResult = await DataService.getArchivedMonths(user.id);
      if (archivesResult.error && !archivesResult.error.includes('No rows')) {
        throw new Error(archivesResult.error);
      }
      if (archivesResult.data) {
        onArchivedMonthsUpdate(archivesResult.data);
      }

      // Télécharger la planification
      const planningResult = await DataService.getExpensePlanning(user.id);
      if (planningResult.error && !planningResult.error.includes('No rows')) {
        throw new Error(planningResult.error);
      }
      if (planningResult.data) {
        onExpensePlanningUpdate(planningResult.data);
      }

      setSyncStatus('success');
      setLastSync(new Date());
      
      setTimeout(() => setSyncStatus('idle'), 3000);
    } catch (err: any) {
      setError(err.message || 'Erreur lors du téléchargement');
      setSyncStatus('error');
      setTimeout(() => setSyncStatus('idle'), 5000);
    }
  };

  const getSyncStatusColor = () => {
    switch (syncStatus) {
      case 'syncing': return 'blue';
      case 'success': return 'green';
      case 'error': return 'red';
      default: return 'gray';
    }
  };

  const getSyncStatusIcon = () => {
    switch (syncStatus) {
      case 'syncing': return <Loader2 className="h-4 w-4 animate-spin" />;
      case 'success': return <CheckCircle className="h-4 w-4" />;
      case 'error': return <AlertCircle className="h-4 w-4" />;
      default: return <Cloud className="h-4 w-4" />;
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-6">
          <Loader2 className="h-6 w-6 animate-spin mr-2" />
          Vérification de la connexion...
        </CardContent>
      </Card>
    );
  }
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {supabaseConfigured && user ? (
              <Cloud className="h-5 w-5 text-blue-600" />
            ) : (
              <CloudOff className="h-5 w-5 text-gray-400" />
            )}
            Synchronisation Cloud
          </CardTitle>
          <CardDescription>
            {!supabaseConfigured 
              ? 'Configuration Supabase requise'
              : user 
                ? `Connecté en tant que ${user.email}`
                : 'Sauvegardez et synchronisez vos données dans le cloud'
            }
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {!supabaseConfigured ? (
            <div className="space-y-4">
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {error || 'Supabase n\'est pas configuré. Veuillez configurer les variables d\'environnement.'}
                </AlertDescription>
              </Alert>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Configuration requise :</h4>
                <ol className="text-sm space-y-1 list-decimal list-inside">
                  <li>Créez un compte sur <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Supabase</a></li>
                  <li>Créez un nouveau projet</li>
                  <li>Copiez le fichier <code>.env.example</code> vers <code>.env.local</code></li>
                  <li>Remplissez les variables <code>VITE_SUPABASE_URL</code> et <code>VITE_SUPABASE_ANON_KEY</code></li>
                  <li>Exécutez le script SQL fourni dans votre base Supabase</li>
                </ol>
              </div>
            </div>
          ) : !user ? (
            <div className="space-y-4">
              <Alert>
                <Cloud className="h-4 w-4" />
                <AlertDescription>
                  Connectez-vous pour sauvegarder vos données dans le cloud et y accéder depuis tous vos appareils.
                </AlertDescription>
              </Alert>
              
              <Button 
                onClick={() => setIsAuthModalOpen(true)}
                className="w-full"
              >
                <User className="mr-2 h-4 w-4" />
                Se connecter
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Statut de synchronisation */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className={`border-${getSyncStatusColor()}-500`}>
                    {getSyncStatusIcon()}
                    <span className="ml-1">
                      {syncStatus === 'syncing' && 'Synchronisation...'}
                      {syncStatus === 'success' && 'Synchronisé'}
                      {syncStatus === 'error' && 'Erreur'}
                      {syncStatus === 'idle' && 'Prêt'}
                    </span>
                  </Badge>
                </div>
                
                {lastSync && (
                  <span className="text-sm text-gray-500">
                    Dernière sync: {lastSync.toLocaleTimeString()}
                  </span>
                )}
              </div>

              {/* Erreur */}
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Separator />

              {/* Actions de synchronisation */}
              <div className="grid grid-cols-2 gap-3">
                <Button 
                  variant="outline" 
                  onClick={handleUpload}
                  disabled={syncStatus === 'syncing'}
                  className="flex items-center gap-2"
                >
                  <Upload className="h-4 w-4" />
                  Sauvegarder
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={handleDownload}
                  disabled={syncStatus === 'syncing'}
                  className="flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Restaurer
                </Button>
              </div>

              <Button 
                variant="outline" 
                onClick={handleDownload}
                disabled={syncStatus === 'syncing'}
                className="w-full flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Synchroniser maintenant
              </Button>

              <Separator />

              {/* Déconnexion */}
              <Button 
                variant="ghost" 
                onClick={handleLogout}
                className="w-full flex items-center gap-2 text-red-600 hover:text-red-700"
              >
                <LogOut className="h-4 w-4" />
                Se déconnecter
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={handleLogin}
      />
    </>
  );
};
