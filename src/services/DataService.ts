import { supabase, isSupabaseAvailable, getSupabaseConfigError } from '@/lib/supabase'
import { CashFlowSettings, ArchivedMonth, MonthlyExpensePlanning } from '@/types/cashflow'

export class DataService {
  // Vérifier si Supabase est disponible
  private static checkSupabaseAvailable() {
    if (!isSupabaseAvailable()) {
      throw new Error(getSupabaseConfigError() || 'Supabase non disponible')
    }
  }

  // ===================================
  // USER SETTINGS
  // ===================================
  // Charger les paramètres utilisateur
  static async loadUserSettings(userId: string): Promise<CashFlowSettings | null> {
    try {
      this.checkSupabaseAvailable()
      const { data, error } = await supabase!
        .from('user_settings')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (error && error.code !== 'PGRST116') { // PGRST116 = pas de résultat
        throw error
      }

      if (!data) return null

      // Convertir les données Supabase vers le format de l'application
      return {
        currentBalance: data.current_balance,
        alertThreshold: data.alert_threshold,
        monthsToDisplay: data.months_to_display,
        currentMonth: data.current_month,
        currentYear: data.current_year,
        fixedAmounts: data.fixed_amounts,
        expenseSettings: data.expense_settings,
        expensePlanningSettings: data.expense_planning_settings,
        customRevenues: data.custom_revenues || [],
        customRecurringExpenses: data.custom_recurring_expenses || [],
        archivedMonths: [] // Chargé séparément
      }
    } catch (error) {
      console.error('Erreur lors du chargement des paramètres:', error)
      return null
    }
  }
  // Sauvegarder les paramètres utilisateur
  static async saveUserSettings(userId: string, settings: CashFlowSettings) {
    try {
      this.checkSupabaseAvailable()
      const { error } = await supabase!
        .from('user_settings')
        .upsert({
          user_id: userId,
          current_balance: settings.currentBalance,
          alert_threshold: settings.alertThreshold,
          months_to_display: settings.monthsToDisplay,
          current_month: settings.currentMonth || new Date().getMonth() + 1,
          current_year: settings.currentYear || new Date().getFullYear(),
          fixed_amounts: settings.fixedAmounts,
          expense_settings: settings.expenseSettings,
          expense_planning_settings: settings.expensePlanningSettings,
          custom_revenues: settings.customRevenues,
          custom_recurring_expenses: settings.customRecurringExpenses,
        })

      if (error) throw error
      return { success: true, error: null }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des paramètres:', error)
      return { success: false, error }
    }
  }

  // ===================================
  // ARCHIVED MONTHS
  // ===================================

  // Charger les mois archivés
  static async loadArchivedMonths(userId: string): Promise<ArchivedMonth[]> {
    try {
      const { data, error } = await supabase
        .from('archived_months')
        .select('*')
        .eq('user_id', userId)
        .order('year', { ascending: false })
        .order('month', { ascending: false })

      if (error) throw error

      return (data || []).map(item => ({
        month: item.month,
        year: item.year,
        plannedData: item.planned_data,
        actualData: item.actual_data,
        archivedAt: item.archived_at,
        notes: item.notes || undefined
      }))
    } catch (error) {
      console.error('Erreur lors du chargement des archives:', error)
      return []
    }
  }

  // Sauvegarder un mois archivé
  static async saveArchivedMonth(userId: string, archivedMonth: ArchivedMonth) {
    try {
      const { error } = await supabase
        .from('archived_months')
        .upsert({
          user_id: userId,
          month: archivedMonth.month,
          year: archivedMonth.year,
          planned_data: archivedMonth.plannedData,
          actual_data: archivedMonth.actualData,
          archived_at: archivedMonth.archivedAt,
          notes: archivedMonth.notes || null
        })

      if (error) throw error
      return { success: true, error: null }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde de l\'archive:', error)
      return { success: false, error }
    }
  }

  // Supprimer un mois archivé
  static async deleteArchivedMonth(userId: string, month: number, year: number) {
    try {
      const { error } = await supabase
        .from('archived_months')
        .delete()
        .eq('user_id', userId)
        .eq('month', month)
        .eq('year', year)

      if (error) throw error
      return { success: true, error: null }
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'archive:', error)
      return { success: false, error }
    }
  }

  // ===================================
  // EXPENSE PLANNINGS
  // ===================================

  // Charger les planifications de dépenses
  static async loadExpensePlannings(userId: string): Promise<MonthlyExpensePlanning[]> {
    try {
      const { data, error } = await supabase
        .from('expense_plannings')
        .select('*')
        .eq('user_id', userId)
        .order('year', { ascending: true })
        .order('month', { ascending: true })

      if (error) throw error

      return (data || []).map(item => ({
        month: item.month,
        year: item.year,
        categories: item.categories,
        totalAmount: item.total_amount,
        createdAt: item.created_at,
        updatedAt: item.updated_at
      }))
    } catch (error) {
      console.error('Erreur lors du chargement des planifications:', error)
      return []
    }
  }

  // Sauvegarder une planification de dépenses
  static async saveExpensePlanning(userId: string, planning: MonthlyExpensePlanning) {
    try {
      const { error } = await supabase
        .from('expense_plannings')
        .upsert({
          user_id: userId,
          month: planning.month,
          year: planning.year,
          categories: planning.categories,
          total_amount: planning.totalAmount,
          created_at: planning.createdAt,
          updated_at: planning.updatedAt
        })

      if (error) throw error
      return { success: true, error: null }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde de la planification:', error)
      return { success: false, error }
    }
  }

  // Supprimer une planification de dépenses
  static async deleteExpensePlanning(userId: string, month: number, year: number) {
    try {
      const { error } = await supabase
        .from('expense_plannings')
        .delete()
        .eq('user_id', userId)
        .eq('month', month)
        .eq('year', year)

      if (error) throw error
      return { success: true, error: null }
    } catch (error) {
      console.error('Erreur lors de la suppression de la planification:', error)
      return { success: false, error }
    }
  }

  // ===================================
  // MIGRATION DEPUIS LOCALSTORAGE
  // ===================================

  // Migrer les données depuis localStorage vers Supabase
  static async migrateFromLocalStorage(userId: string) {
    try {
      // Charger les données localStorage
      const localData = localStorage.getItem('cashflow-settings')
      if (!localData) return { success: true, message: 'Aucune donnée locale à migrer' }

      const settings: CashFlowSettings = JSON.parse(localData)

      // 1. Migrer les paramètres principaux
      await this.saveUserSettings(userId, settings)

      // 2. Migrer les mois archivés
      if (settings.archivedMonths && settings.archivedMonths.length > 0) {
        for (const archive of settings.archivedMonths) {
          await this.saveArchivedMonth(userId, archive)
        }
      }

      // 3. Migrer les planifications de dépenses
      if (settings.expensePlanningSettings?.monthlyPlannings) {
        for (const planning of settings.expensePlanningSettings.monthlyPlannings) {
          await this.saveExpensePlanning(userId, planning)
        }
      }

      // 4. Sauvegarder les données locales en backup
      localStorage.setItem('cashflow-settings-backup', localData)
      
      return { 
        success: true, 
        message: `Migration réussie : ${settings.archivedMonths?.length || 0} archives, ${settings.expensePlanningSettings?.monthlyPlannings?.length || 0} planifications` 
      }
    } catch (error) {
      console.error('Erreur lors de la migration:', error)
      return { success: false, error }
    }
  }

  // ===================================
  // SYNCHRONISATION TEMPS RÉEL
  // ===================================

  // S'abonner aux changements en temps réel
  static subscribeToChanges(userId: string, callbacks: {
    onSettingsChange?: (settings: any) => void
    onArchivesChange?: (archives: any[]) => void
    onPlanningsChange?: (plannings: any[]) => void
  }) {
    const subscriptions = []

    // Abonnement aux changements de paramètres
    if (callbacks.onSettingsChange) {
      const settingsSubscription = supabase
        .channel('user_settings_changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'user_settings',
            filter: `user_id=eq.${userId}`
          },
          (payload) => callbacks.onSettingsChange!(payload.new)
        )
        .subscribe()
      
      subscriptions.push(settingsSubscription)
    }

    // Abonnement aux changements d'archives
    if (callbacks.onArchivesChange) {
      const archivesSubscription = supabase
        .channel('archived_months_changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'archived_months',
            filter: `user_id=eq.${userId}`
          },
          async () => {
            const archives = await this.loadArchivedMonths(userId)
            callbacks.onArchivesChange!(archives)
          }
        )
        .subscribe()
      
      subscriptions.push(archivesSubscription)
    }

    // Abonnement aux changements de planifications
    if (callbacks.onPlanningsChange) {
      const planningsSubscription = supabase
        .channel('expense_plannings_changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'expense_plannings',
            filter: `user_id=eq.${userId}`
          },
          async () => {
            const plannings = await this.loadExpensePlannings(userId)
            callbacks.onPlanningsChange!(plannings)
          }
        )
        .subscribe()
      
      subscriptions.push(planningsSubscription)
    }

    // Fonction pour se désabonner
    return () => {
      subscriptions.forEach(sub => supabase.removeChannel(sub))
    }
  }

  // Alias pour loadUserSettings (pour compatibilité)
  static async getUserSettings(userId: string) {
    try {
      const settings = await this.loadUserSettings(userId);
      if (!settings) {
        return { data: null, error: 'No rows' };
      }
      return { data: settings, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }

  // Alias pour loadArchivedMonths (pour compatibilité)
  static async getArchivedMonths(userId: string) {
    try {
      const months = await this.loadArchivedMonths(userId);
      if (!months || months.length === 0) {
        return { data: null, error: 'No rows' };
      }
      return { data: months, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }

  // Sauvegarder plusieurs mois archivés
  static async saveArchivedMonths(userId: string, months: ArchivedMonth[]) {
    try {
      for (const month of months) {
        const result = await this.saveArchivedMonth(userId, month);
        if (!result.success) {
          throw result.error;
        }
      }
      return { success: true, error: null };
    } catch (error) {
      return { success: false, error };
    }
  }

  // Alias pour loadExpensePlannings (pour compatibilité)
  static async getExpensePlanning(userId: string) {
    try {
      const plannings = await this.loadExpensePlannings(userId);
      if (!plannings || plannings.length === 0) {
        return { data: null, error: 'No rows' };
      }
      
      // Convertir vers le format ExpensePlanningSettings
      const expensePlanningSettings = {
        monthlyPlannings: plannings,
        defaultAmount: 5000 // Valeur par défaut
      };
      
      return { data: expensePlanningSettings, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }

  // Sauvegarder les paramètres de planification complets
  static async saveExpensePlanningSettings(userId: string, settings: any) {
    try {
      if (settings.monthlyPlannings && Array.isArray(settings.monthlyPlannings)) {
        for (const planning of settings.monthlyPlannings) {
          const result = await this.saveExpensePlanning(userId, planning);
          if (!result.success) {
            throw result.error;
          }
        }
      }
      return { success: true, error: null };
    } catch (error) {
      return { success: false, error };
    }
  }

  // ===================================
}
