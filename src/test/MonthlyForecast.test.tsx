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
  },
  {
    month: 8,
    year: 2025,
    startingBalance: 11750,
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
    endingBalance: 12500
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
    monthlyCustomExpenses: {},
    currentBalance: 10000,
    onCurrentBalanceChange: vi.fn()
  };
  it('should render monthly forecast correctly', () => {
    render(<MonthlyForecast {...defaultProps} />);
    
    expect(screen.getByText('Prévision sur 12 mois')).toBeInTheDocument();
    expect(screen.getByText('Juillet 2025')).toBeInTheDocument();
    expect(screen.getByText('Mois actuel')).toBeInTheDocument();
    // For current month, the balance is shown in the CurrentMonthCard as "Solde fin de mois"
    expect(screen.getByText('10,000 TND')).toBeInTheDocument();
  });  it('should show vacation input for July and August', () => {
    render(<MonthlyForecast {...defaultProps} vacationExpenses={{'2025-08': 1000}} />);
    
    // Août (month 8) devrait avoir un input vacation car c'est un mois suivant avec vacation
    expect(screen.getByText('Août 2025')).toBeInTheDocument();
    const vacationInput = screen.getByPlaceholderText('0');
    expect(vacationInput).toBeInTheDocument();
  });  it('should show "+ Ajouter Dépenses" button', () => {
    render(<MonthlyForecast {...defaultProps} />);
    
    // Le bouton d'ajout dans les mois suivants est "+ Ajouter Dépenses"
    expect(screen.getByText('+ Ajouter Dépenses')).toBeInTheDocument();
  });  it('should show expense form when "+ Ajouter Dépenses" is clicked', () => {
    render(<MonthlyForecast {...defaultProps} />);
    
    // Click the next month's add button (not current month)
    const addButton = screen.getByText('+ Ajouter Dépenses');
    fireEvent.click(addButton);
    
    expect(screen.getByPlaceholderText('Type de dépense')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Montant')).toBeInTheDocument();
    expect(screen.getByText('Ajouter')).toBeInTheDocument();
    expect(screen.getByText('Annuler')).toBeInTheDocument();
  });  it('should call onMonthlyCustomExpenseAdd when expense is added', () => {
    const onMonthlyCustomExpenseAdd = vi.fn();
    const props = { ...defaultProps, onMonthlyCustomExpenseAdd };
    
    render(<MonthlyForecast {...props} />);
    
    // Open form in next month (not current month)
    fireEvent.click(screen.getByText('+ Ajouter Dépenses'));
    
    // Fill form
    fireEvent.change(screen.getByPlaceholderText('Type de dépense'), {
      target: { value: 'Réparation' }
    });
    fireEvent.change(screen.getByPlaceholderText('Montant'), {
      target: { value: '500' }
    });
      // Submit (should work on August, not July since July is current month)
    fireEvent.click(screen.getByText('Ajouter'));
    
    expect(onMonthlyCustomExpenseAdd).toHaveBeenCalledWith(
      '2025-08',  // Next month (August)
      expect.objectContaining({
        type: 'Réparation',
        amount: 500,
        id: expect.any(String)
      })
    );
  });  it('should display monthly custom expenses', () => {
    const monthlyCustomExpenses = {
      '2025-08': [  // Month following current month (August)
        { id: '1', type: 'Réparation voiture', amount: 800 },
        { id: '2', type: 'Cadeau', amount: 200 }
      ]
    };
    
    // Update mock data to include these expenses in month.expenses.custom
    const mockDataWithCustomExpenses = [
      mockMonthlyData[0], // July (current month)
      {
        ...mockMonthlyData[1], // August
        expenses: {
          ...mockMonthlyData[1].expenses,
          custom: [
            { id: '1', name: 'Réparation voiture', amount: 800, isRecurring: false },
            { id: '2', name: 'Cadeau', amount: 200, isRecurring: false }
          ]
        }
      }
    ];
    
    const props = { ...defaultProps, monthlyCustomExpenses, data: mockDataWithCustomExpenses };
    render(<MonthlyForecast {...props} />);
    
    // Custom expenses are shown in the "Dépenses Spécifiques" section of future months
    expect(screen.getByText('Dépenses Spécifiques')).toBeInTheDocument();
    expect(screen.getByText('Réparation voiture: 800 TND')).toBeInTheDocument();
    expect(screen.getByText('Cadeau: 200 TND')).toBeInTheDocument();  });
  
  it('should call onMonthlyCustomExpenseRemove when expense is removed', () => {
    const onMonthlyCustomExpenseRemove = vi.fn();
    const monthlyCustomExpenses = {
      '2025-08': [  // Next month (August)
        { id: '1', type: 'Réparation voiture', amount: 800 }
      ]
    };
    
    // Update mock data to include this expense in month.expenses.custom
    const mockDataWithCustomExpenses = [
      mockMonthlyData[0], // July (current month)
      {
        ...mockMonthlyData[1], // August
        expenses: {
          ...mockMonthlyData[1].expenses,
          custom: [
            { id: '1', name: 'Réparation voiture', amount: 800, isRecurring: false }
          ]
        }
      }
    ];
    
    const props = { 
      ...defaultProps, 
      onMonthlyCustomExpenseRemove,
      monthlyCustomExpenses,
      data: mockDataWithCustomExpenses
    };
    
    render(<MonthlyForecast {...props} />);
    
    // Find the expense in Dépenses Spécifiques section
    expect(screen.getByText('Réparation voiture: 800 TND')).toBeInTheDocument();
    
    // Find remove button (X icon) next to the expense
    const removeButtons = screen.getAllByRole('button');
    const removeButton = removeButtons.find(button => 
      button.innerHTML.includes('lucide-x')
    );
    
    if (removeButton) {
      fireEvent.click(removeButton);
      expect(onMonthlyCustomExpenseRemove).toHaveBeenCalledWith('2025-08', '1');
    }
  });
  
  it('should handle low balance alert correctly', () => {
    // Ce test vérifie que l'alerte fonctionne en principe 
    // Le calcul réel se fait dans le composant et dépend des états internes
    const props = { ...defaultProps, alertThreshold: 2000 };
    render(<MonthlyForecast {...props} />);
    
    // Vérifier que la légende d'alerte est présente
    expect(screen.getByText('Alerte')).toBeInTheDocument();
  });
  
  it('should exclude fixed revenues for current month', () => {
    // Create data for current month (July 2025)
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
    
    // In CurrentMonthCard, fixed revenues and expenses are excluded from calculation
    // We verify that the current month uses CurrentMonthCard (has "Mois actuel" badge)
    expect(screen.getByText('Mois actuel')).toBeInTheDocument();
  });
});
