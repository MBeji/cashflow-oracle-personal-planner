-- Script de création des tables pour Cash Flow Personnel sur Supabase
-- À exécuter dans l'éditeur SQL de Supabase

-- 1. Activer Row Level Security (RLS)
-- 2. Créer les tables
-- 3. Configurer les politiques de sécurité

-- ===================================
-- TABLE: user_settings
-- ===================================
CREATE TABLE IF NOT EXISTS public.user_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    current_balance DECIMAL(10,2) DEFAULT 0,
    alert_threshold DECIMAL(10,2) DEFAULT 2000,
    months_to_display INTEGER DEFAULT 20,
    current_month INTEGER DEFAULT 1,
    current_year INTEGER DEFAULT 2025,
    fixed_amounts JSONB DEFAULT '{}',
    expense_settings JSONB DEFAULT '{}',
    expense_planning_settings JSONB DEFAULT '{}',
    custom_revenues JSONB DEFAULT '[]',
    custom_recurring_expenses JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id)
);

-- ===================================
-- TABLE: archived_months
-- ===================================
CREATE TABLE IF NOT EXISTS public.archived_months (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    month INTEGER NOT NULL CHECK (month >= 1 AND month <= 12),
    year INTEGER NOT NULL CHECK (year >= 2020 AND year <= 2100),
    planned_data JSONB NOT NULL,
    actual_data JSONB NOT NULL,
    archived_at TIMESTAMP WITH TIME ZONE NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, month, year)
);

-- ===================================
-- TABLE: expense_plannings
-- ===================================
CREATE TABLE IF NOT EXISTS public.expense_plannings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    month INTEGER NOT NULL CHECK (month >= 1 AND month <= 12),
    year INTEGER NOT NULL CHECK (year >= 2020 AND year <= 2100),
    categories JSONB NOT NULL DEFAULT '[]',
    total_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, month, year)
);

-- ===================================
-- FONCTIONS DE MISE À JOUR AUTOMATIQUE
-- ===================================

-- Fonction pour mettre à jour automatiquement updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers pour updated_at
CREATE TRIGGER update_user_settings_updated_at 
    BEFORE UPDATE ON user_settings 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_expense_plannings_updated_at 
    BEFORE UPDATE ON expense_plannings 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ===================================
-- ROW LEVEL SECURITY (RLS)
-- ===================================

-- Activer RLS sur toutes les tables
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.archived_months ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expense_plannings ENABLE ROW LEVEL SECURITY;

-- ===================================
-- POLITIQUES DE SÉCURITÉ
-- ===================================

-- user_settings: Un utilisateur ne peut voir/modifier que ses propres paramètres
CREATE POLICY "Users can view own settings" ON public.user_settings
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own settings" ON public.user_settings
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own settings" ON public.user_settings
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own settings" ON public.user_settings
    FOR DELETE USING (auth.uid() = user_id);

-- archived_months: Un utilisateur ne peut voir/modifier que ses propres archives
CREATE POLICY "Users can view own archives" ON public.archived_months
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own archives" ON public.archived_months
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own archives" ON public.archived_months
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own archives" ON public.archived_months
    FOR DELETE USING (auth.uid() = user_id);

-- expense_plannings: Un utilisateur ne peut voir/modifier que ses propres planifications
CREATE POLICY "Users can view own plannings" ON public.expense_plannings
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own plannings" ON public.expense_plannings
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own plannings" ON public.expense_plannings
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own plannings" ON public.expense_plannings
    FOR DELETE USING (auth.uid() = user_id);

-- ===================================
-- INDEX POUR PERFORMANCES
-- ===================================

-- Index sur user_id pour toutes les tables
CREATE INDEX IF NOT EXISTS idx_user_settings_user_id ON public.user_settings(user_id);
CREATE INDEX IF NOT EXISTS idx_archived_months_user_id ON public.archived_months(user_id);
CREATE INDEX IF NOT EXISTS idx_expense_plannings_user_id ON public.expense_plannings(user_id);

-- Index composé pour les recherches par mois/année
CREATE INDEX IF NOT EXISTS idx_archived_months_user_month_year ON public.archived_months(user_id, year, month);
CREATE INDEX IF NOT EXISTS idx_expense_plannings_user_month_year ON public.expense_plannings(user_id, year, month);

-- ===================================
-- COMMENTAIRES
-- ===================================

COMMENT ON TABLE public.user_settings IS 'Paramètres utilisateur pour l''application Cash Flow Personnel';
COMMENT ON TABLE public.archived_months IS 'Mois archivés avec données réelles vs prévues';
COMMENT ON TABLE public.expense_plannings IS 'Planifications de dépenses par mois et catégorie';

COMMENT ON COLUMN public.user_settings.fixed_amounts IS 'Montants fixes (salaire, dette, etc.) au format JSON';
COMMENT ON COLUMN public.user_settings.expense_settings IS 'Paramètres des catégories de dépenses au format JSON';
COMMENT ON COLUMN public.user_settings.expense_planning_settings IS 'Configuration de planification des dépenses au format JSON';

COMMENT ON COLUMN public.archived_months.planned_data IS 'Données planifiées du mois au format JSON';
COMMENT ON COLUMN public.archived_months.actual_data IS 'Données réelles du mois au format JSON';

COMMENT ON COLUMN public.expense_plannings.categories IS 'Catégories de dépenses planifiées au format JSON';

-- ===================================
-- FIN DU SCRIPT
-- ===================================

-- Vérification que les tables ont été créées
SELECT 
    table_name, 
    table_type
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('user_settings', 'archived_months', 'expense_plannings')
ORDER BY table_name;
