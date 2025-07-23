import { createClient } from '@supabase/supabase-js'

// Configuration Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'YOUR_SUPABASE_URL'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY'

// Vérifier si les variables d'environnement sont configurées
const isSupabaseConfigured = supabaseUrl !== 'YOUR_SUPABASE_URL' && supabaseAnonKey !== 'YOUR_SUPABASE_ANON_KEY'

// Créer le client Supabase seulement si configuré
export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

// Fonction pour vérifier si Supabase est disponible
export const isSupabaseAvailable = () => {
  return supabase !== null && isSupabaseConfigured
}

// Helper pour afficher les erreurs de configuration
export const getSupabaseConfigError = () => {
  if (!isSupabaseConfigured) {
    return 'Supabase n\'est pas configuré. Veuillez configurer les variables d\'environnement VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY.'
  }
  return null
}

// Types pour les tables Supabase
export type Database = {
  public: {
    Tables: {
      user_settings: {
        Row: {
          id: string
          user_id: string
          current_balance: number
          alert_threshold: number
          months_to_display: number
          current_month: number
          current_year: number
          fixed_amounts: any
          expense_settings: any
          expense_planning_settings: any
          custom_revenues: any[]
          custom_recurring_expenses: any[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          current_balance: number
          alert_threshold: number
          months_to_display: number
          current_month: number
          current_year: number
          fixed_amounts: any
          expense_settings: any
          expense_planning_settings: any
          custom_revenues?: any[]
          custom_recurring_expenses?: any[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          current_balance?: number
          alert_threshold?: number
          months_to_display?: number
          current_month?: number
          current_year?: number
          fixed_amounts?: any
          expense_settings?: any
          expense_planning_settings?: any
          custom_revenues?: any[]
          custom_recurring_expenses?: any[]
          updated_at?: string
        }
      }
      archived_months: {
        Row: {
          id: string
          user_id: string
          month: number
          year: number
          planned_data: any
          actual_data: any
          archived_at: string
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          month: number
          year: number
          planned_data: any
          actual_data: any
          archived_at: string
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          month?: number
          year?: number
          planned_data?: any
          actual_data?: any
          archived_at?: string
          notes?: string | null
        }
      }
      expense_plannings: {
        Row: {
          id: string
          user_id: string
          month: number
          year: number
          categories: any[]
          total_amount: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          month: number
          year: number
          categories: any[]
          total_amount: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          month?: number
          year?: number
          categories?: any[]
          total_amount?: number
          updated_at?: string
        }
      }
    }
  }
}
