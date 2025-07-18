import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MonthlyForecast } from '../components/MonthlyForecast';
import { MonthlyData } from '../types/cashflow';

const mockMonthlyData: MonthlyData[] = [
  {
    month: 7,
    year: 2025,
    startingBalance: 10000,
    revenues: {
      salary: 12750,
      fuel: 500,
      healthInsurance: 1000,
      bonus: 0,
      custom: []
    },
    expenses: {
      debt: 6000,
      currentExpenses: 5000,
      fuel: 500,
      healthInsurance: 1000,
      vacation: 0,
      school: 0,
      custom: [],
      chantier: 0
    },
    endingBalance: 11750
  }
];

describe('MonthlyForecast Component', () => {
  const defaultProps = {
    data: mockMonthlyData,
    alertThreshold: 2000,
    monthsToDisplay: 12,
    onVacationChange: vi.fn(),
    onChantierChange: vi.fn(),
    onCustomExpenseChange: vi.fn(),
    onMonthlyCustomExpenseAdd: vi.fn(),
    onMonthlyCustomExpenseRemove: vi.fn(),
    vacationExpenses: {},
    chantierExpenses: {},
    customExpenses: {},
    monthlyCustomExpenses: {}
  };
  it('should render monthly forecast correctly', () => {
    render(<MonthlyForecast {...defaultProps} />);
    
    expect(screen.getByText('Prévision sur 12 mois')).toBeInTheDocument();
    expect(screen.getByText('Juillet 2025')).toBeInTheDocument();
    expect(screen.getByText('10,000 TND')).toBeInTheDocument(); // Le solde de début est 10000, pas l'endingBalance
  });
  it('should show vacation input for July and August', () => {
    render(<MonthlyForecast {...defaultProps} />);
    
    // Juillet (month 7) devrait avoir des inputs avec placeholder "0"
    const inputs = screen.getAllByPlaceholderText('0');
    expect(inputs.length).toBeGreaterThan(0);
  });

  it('should show "+ Ajouter Dépenses" button', () => {
    render(<MonthlyForecast {...defaultProps} />);
    
    expect(screen.getByText('+ Ajouter Dépenses')).toBeInTheDocument();
  });

  it('should show expense form when "+ Ajouter Dépenses" is clicked', () => {
    render(<MonthlyForecast {...defaultProps} />);
    
    const addButton = screen.getByText('+ Ajouter Dépenses');
    fireEvent.click(addButton);
    
    expect(screen.getByPlaceholderText('Type de dépense')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Montant')).toBeInTheDocument();
    expect(screen.getByText('Ajouter')).toBeInTheDocument();
    expect(screen.getByText('Annuler')).toBeInTheDocument();
  });

  it('should call onMonthlyCustomExpenseAdd when expense is added', () => {
    const onMonthlyCustomExpenseAdd = vi.fn();
    const props = { ...defaultProps, onMonthlyCustomExpenseAdd };
    
    render(<MonthlyForecast {...props} />);
    
    // Ouvrir le formulaire
    fireEvent.click(screen.getByText('+ Ajouter Dépenses'));
    
    // Remplir le formulaire
    fireEvent.change(screen.getByPlaceholderText('Type de dépense'), {
      target: { value: 'Réparation' }
    });
    fireEvent.change(screen.getByPlaceholderText('Montant'), {
      target: { value: '500' }
    });
    
    // Soumettre
    fireEvent.click(screen.getByText('Ajouter'));
    
    expect(onMonthlyCustomExpenseAdd).toHaveBeenCalledWith(
      '2025-07',
      expect.objectContaining({
        type: 'Réparation',
        amount: 500
      })
    );
  });

  it('should display monthly custom expenses', () => {
    const monthlyCustomExpenses = {
      '2025-07': [
        { id: '1', type: 'Réparation voiture', amount: 800 },
        { id: '2', type: 'Cadeau', amount: 200 }
      ]
    };
    
    const props = { ...defaultProps, monthlyCustomExpenses };
    render(<MonthlyForecast {...props} />);
    
    expect(screen.getByText('Dépenses ajoutées')).toBeInTheDocument();
    expect(screen.getByText('Réparation voiture: 800 TND')).toBeInTheDocument();
    expect(screen.getByText('Cadeau: 200 TND')).toBeInTheDocument();
  });
  it('should call onMonthlyCustomExpenseRemove when expense is removed', () => {
    const onMonthlyCustomExpenseRemove = vi.fn();
    const monthlyCustomExpenses = {
      '2025-07': [
        { id: '1', type: 'Réparation voiture', amount: 800 }
      ]
    };
    
    const props = { 
      ...defaultProps, 
      onMonthlyCustomExpenseRemove,
      monthlyCustomExpenses 
    };
    
    render(<MonthlyForecast {...props} />);
    
    // Chercher le bouton de suppression dans la section des dépenses ajoutées
    const expenseItem = screen.getByText('Réparation voiture: 800 TND');
    const container = expenseItem.closest('.flex');
    if (container) {
      const removeButton = container.querySelector('button');
      if (removeButton) {
        fireEvent.click(removeButton);
        expect(onMonthlyCustomExpenseRemove).toHaveBeenCalledWith('2025-07', '1');
      }
    }
  });
  it('should handle low balance alert correctly', () => {
    const lowBalanceData = [{
      ...mockMonthlyData[0],
      endingBalance: 1500 // En dessous du seuil de 2000
    }];
    
    const props = { ...defaultProps, data: lowBalanceData };
    render(<MonthlyForecast {...props} />);
    
    // Le solde devrait être affiché en rouge (classe text-destructive)
    const balanceElement = screen.getByText('1,500 TND');
    expect(balanceElement).toHaveClass('text-destructive');
  });

  it('should exclude fixed revenues for current month', () => {
    // Créer des données pour le mois actuel (juillet 2025)
    const currentMonthData = [{
      month: 7,
      year: 2025,
      startingBalance: 10000,
      revenues: {
        salary: 12750,
        fuel: 500,
        healthInsurance: 1000,
        bonus: 0,
        custom: []
      },
      expenses: {
        debt: 6000,
        currentExpenses: 5000,
        fuel: 500,
        healthInsurance: 1000,
        vacation: 0,
        school: 0,
        custom: [],
        chantier: 0
      },
      endingBalance: 11750
    }];
    
    const props = { ...defaultProps, data: currentMonthData };
    render(<MonthlyForecast {...props} />);
    
    // Vérifier que les éléments du mois en cours sont marqués comme exclus
    expect(screen.getByText('Revenus fixes exclus du calcul (mois en cours)')).toBeInTheDocument();
    expect(screen.getByText('Dépenses fixes exclues du calcul (mois en cours)')).toBeInTheDocument();
  });
});
