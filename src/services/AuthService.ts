import { supabase, isSupabaseAvailable, getSupabaseConfigError } from '@/lib/supabase'
import { User, Session } from '@supabase/supabase-js'

export class AuthService {
  // Vérifier si Supabase est disponible
  private static checkSupabaseAvailable() {
    if (!isSupabaseAvailable()) {
      throw new Error(getSupabaseConfigError() || 'Supabase non disponible')
    }
  }

  // Connexion par email/mot de passe
  static async signIn(email: string, password: string) {
    try {
      this.checkSupabaseAvailable()
      const { data, error } = await supabase!.auth.signInWithPassword({
        email,
        password,
      })
      
      if (error) throw error
      return { user: data.user, session: data.session, error: null }
    } catch (error) {
      console.error('Erreur lors de la connexion:', error)
      return { user: null, session: null, error }
    }
  }
  // Inscription par email/mot de passe
  static async signUp(email: string, password: string) {
    try {
      this.checkSupabaseAvailable()
      const { data, error } = await supabase!.auth.signUp({
        email,
        password,
      })
      
      if (error) throw error
      return { user: data.user, session: data.session, error: null }
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error)
      return { user: null, session: null, error }
    }
  }
  // Déconnexion
  static async signOut() {
    try {
      this.checkSupabaseAvailable()
      const { error } = await supabase!.auth.signOut()
      if (error) throw error
      return { error: null }
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error)
      return { error }
    }
  }
  // Obtenir l'utilisateur connecté
  static async getCurrentUser(): Promise<User | null> {
    try {
      this.checkSupabaseAvailable()
      const { data: { user }, error } = await supabase!.auth.getUser()
      if (error) throw error
      return user
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'utilisateur:', error)
      return null
    }
  }
  // Obtenir la session courante
  static async getCurrentSession(): Promise<Session | null> {
    try {
      this.checkSupabaseAvailable()
      const { data: { session }, error } = await supabase!.auth.getSession()
      if (error) throw error
      return session
    } catch (error) {
      console.error('Erreur lors de la récupération de la session:', error)
      return null
    }
  }
  // Écouter les changements d'authentification
  static onAuthStateChange(callback: (event: any, session: any) => void) {
    if (!isSupabaseAvailable()) {
      throw new Error(getSupabaseConfigError() || 'Supabase non disponible')
    }
    return supabase!.auth.onAuthStateChange(callback)
  }
  // Réinitialiser le mot de passe
  static async resetPassword(email: string) {
    try {
      this.checkSupabaseAvailable()
      const { error } = await supabase!.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })
      
      if (error) throw error
      return { error: null }
    } catch (error) {
      console.error('Erreur lors de la réinitialisation:', error)
      return { error }
    }
  }
  // Mettre à jour le mot de passe
  static async updatePassword(newPassword: string) {
    try {
      this.checkSupabaseAvailable()
      const { error } = await supabase!.auth.updateUser({
        password: newPassword
      })
      
      if (error) throw error
      return { error: null }
    } catch (error) {
      console.error('Erreur lors de la mise à jour du mot de passe:', error)
      return { error }
    }
  }
}
