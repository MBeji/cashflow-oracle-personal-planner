import { useState, useEffect } from 'react';
import { AuthService } from '../services/AuthService';
import { userConfigService, UserConfig } from '../services/UserConfigService';
import { createInitialUserSettings } from '../config/defaultUserConfig';

export function useUserConfig() {
  const [config, setConfig] = useState<UserConfig>(() => createInitialUserSettings());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Charger la configuration de l'utilisateur
  const loadConfig = async (userId: string, userEmail?: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Charger la config depuis Supabase ou créer la config par défaut si première connexion
      const userConfig = await userConfigService.loadUserConfig(userId);
      setConfig(userConfig);
      
      console.log('Configuration utilisateur chargée:', userConfig);
    } catch (err) {
      console.error('Erreur lors du chargement de la config:', err);
      setError('Erreur lors du chargement de la configuration');
      
      // En cas d'erreur, utiliser la config par défaut locale
      setConfig(createInitialUserSettings(userEmail));
    } finally {
      setIsLoading(false);
    }
  };

  // Sauvegarder la configuration
  const saveConfig = async (userId: string, newConfig: UserConfig) => {
    try {
      await userConfigService.saveUserConfig(userId, newConfig);
      setConfig(newConfig);
      console.log('Configuration sauvegardée avec succès');
    } catch (err) {
      console.error('Erreur lors de la sauvegarde de la config:', err);
      setError('Erreur lors de la sauvegarde');
      throw err;
    }
  };

  // Réinitialiser la configuration
  const resetConfig = async (userId: string) => {
    try {
      const defaultConfig = await userConfigService.resetUserConfig(userId);
      setConfig(defaultConfig);
      console.log('Configuration réinitialisée');
    } catch (err) {
      console.error('Erreur lors de la réinitialisation:', err);
      setError('Erreur lors de la réinitialisation');
      throw err;
    }
  };
  // Écouter les changements d'authentification
  useEffect(() => {
    const { data: { subscription } } = AuthService.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        // Utilisateur connecté : charger sa config
        await loadConfig(session.user.id, session.user.email);
      } else {
        // Utilisateur déconnecté : utiliser la config par défaut
        setConfig(createInitialUserSettings());
        setIsLoading(false);
        setError(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Mettre à jour une partie de la configuration
  const updateConfig = (updates: Partial<UserConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
  };

  // Débounced save pour éviter trop de sauvegardes
  const [saveTimeout, setSaveTimeout] = useState<NodeJS.Timeout | null>(null);
  
  const debouncedSave = async (userId: string) => {
    if (saveTimeout) {
      clearTimeout(saveTimeout);
    }
    
    const timeout = setTimeout(async () => {
      try {
        await userConfigService.saveUserConfig(userId, config);
        console.log('Configuration auto-sauvegardée');
      } catch (err) {
        console.error('Erreur auto-sauvegarde:', err);
      }
    }, 1000); // Sauvegarder après 1 seconde d'inactivité
    
    setSaveTimeout(timeout);
  };

  return {
    config,
    isLoading,
    error,
    loadConfig,
    saveConfig,
    resetConfig,
    updateConfig,
    debouncedSave
  };
}
