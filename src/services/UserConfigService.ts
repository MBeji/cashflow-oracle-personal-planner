import { supabase } from '../lib/supabase';
import { createInitialUserSettings } from '../config/defaultUserConfig';
import { CashFlowSettings } from '../types/cashflow';

export interface UserConfig extends CashFlowSettings {
  // Hérite de CashFlowSettings avec tous les champs requis
}

export interface UserSettings {
  id?: string;
  user_id: string;
  current_balance: number;
  alert_threshold: number;
  months_to_display: number;
  current_month: number;
  current_year: number;
  fixed_amounts: any;
  expense_settings: any;
  expense_planning_settings: any;
  custom_revenues: any[];
  custom_recurring_expenses: any[];
  created_at?: string;
  updated_at?: string;
}

class UserConfigService {
  /**
   * Charge la configuration utilisateur depuis Supabase
   */
  async loadUserConfig(userId: string): Promise<UserConfig> {
    try {
      const { data, error } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = pas de résultat
        console.error('Erreur lors du chargement de la config utilisateur:', error);
        throw error;
      }

      if (!data) {
        // Première connexion : créer la config par défaut
        return await this.createDefaultUserConfig(userId);
      }

      // Convertir le format BDD vers le format app
      return this.dbToAppFormat(data);
    } catch (error) {
      console.error('Erreur UserConfigService.loadUserConfig:', error);      // En cas d'erreur, retourner la config par défaut
      return createInitialUserSettings();
    }
  }

  /**
   * Sauvegarde la configuration utilisateur dans Supabase
   */
  async saveUserConfig(userId: string, config: UserConfig): Promise<void> {
    try {
      const dbData = this.appToDbFormat(userId, config);

      const { error } = await supabase
        .from('user_settings')
        .upsert(dbData, {
          onConflict: 'user_id'
        });

      if (error) {
        console.error('Erreur lors de la sauvegarde de la config utilisateur:', error);
        throw error;
      }

      console.log('Configuration utilisateur sauvegardée avec succès');
    } catch (error) {
      console.error('Erreur UserConfigService.saveUserConfig:', error);
      throw error;
    }
  }
  /**
   * Crée la configuration par défaut pour un nouvel utilisateur
   */
  private async createDefaultUserConfig(userId: string): Promise<UserConfig> {
    try {
      const defaultConfig = createInitialUserSettings();
      await this.saveUserConfig(userId, defaultConfig);
      return defaultConfig;
    } catch (error) {
      console.error('Erreur lors de la création de la config par défaut:', error);
      return createInitialUserSettings();
    }
  }
  /**
   * Convertit le format BDD vers le format application
   */
  private dbToAppFormat(data: UserSettings): UserConfig {
    return {
      currentBalance: Number(data.current_balance) || 0,
      alertThreshold: Number(data.alert_threshold) || 2000,
      monthsToDisplay: data.months_to_display || 20,
      currentMonth: data.current_month || 1,
      currentYear: data.current_year || 2025,
      fixedAmounts: data.fixed_amounts || {},
      expenseSettings: data.expense_settings || {},
      expensePlanningSettings: data.expense_planning_settings || {},
      customRevenues: data.custom_revenues || [],
      customRecurringExpenses: data.custom_recurring_expenses || [],
      archivedMonths: [] // Sera géré séparément via la table archived_months
    };
  }

  /**
   * Convertit le format application vers le format BDD
   */
  private appToDbFormat(userId: string, config: UserConfig): UserSettings {
    return {
      user_id: userId,
      current_balance: config.currentBalance,
      alert_threshold: config.alertThreshold,
      months_to_display: config.monthsToDisplay,
      current_month: config.currentMonth,
      current_year: config.currentYear,
      fixed_amounts: config.fixedAmounts,
      expense_settings: config.expenseSettings,
      expense_planning_settings: config.expensePlanningSettings,
      custom_revenues: config.customRevenues,
      custom_recurring_expenses: config.customRecurringExpenses
    };
  }
  /**
   * Réinitialise la configuration utilisateur aux valeurs par défaut
   */
  async resetUserConfig(userId: string): Promise<UserConfig> {
    try {
      const defaultConfig = createInitialUserSettings();
      await this.saveUserConfig(userId, defaultConfig);
      return defaultConfig;
    } catch (error) {
      console.error('Erreur lors de la réinitialisation de la config:', error);
      throw error;
    }
  }

  /**
   * Supprime la configuration utilisateur (pour la déconnexion)
   */
  async deleteUserConfig(userId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('user_settings')
        .delete()
        .eq('user_id', userId);

      if (error) {
        console.error('Erreur lors de la suppression de la config utilisateur:', error);
        throw error;
      }

      console.log('Configuration utilisateur supprimée avec succès');
    } catch (error) {
      console.error('Erreur UserConfigService.deleteUserConfig:', error);
      throw error;
    }
  }
}

export const userConfigService = new UserConfigService();
