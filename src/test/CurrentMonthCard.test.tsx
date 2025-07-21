import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CurrentMonthCard } from '../components/CurrentMonthCard';
import { MonthlyData } from '../types/cashflow';

const mockMonthData: MonthlyData = {
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
};

describe('CurrentMonthCard Component', () => {
  const defaultProps = {
    monthData: mockMonthData,
    currentBalance: 10000,
    onCurrentBalanceChange: vi.fn(),
    alertThreshold: 2000,
    initialExpenseForecast: 12500 // debt + currentExpenses + fuel + healthInsurance
  };
  it('should render current month card with essential information', () => {
    render(<CurrentMonthCard {...defaultProps} />);
    
    expect(screen.getByText('Juillet 2025')).toBeInTheDocument();
    expect(screen.getByText('Mois actuel')).toBeInTheDocument();
    expect(screen.getByText('Solde actuel (TND)')).toBeInTheDocument();
    expect(screen.getByText('Prévisions de dépenses')).toBeInTheDocument();
    expect(screen.getByText('Solde fin de mois')).toBeInTheDocument();
  });

  it('should update expense forecast and recalculate projected balance', () => {
    render(<CurrentMonthCard {...defaultProps} />);
    
    const expenseForecastInput = screen.getByDisplayValue('12500'); // Total expenses from mockData
    fireEvent.change(expenseForecastInput, { target: { value: '15000' } });
    
    // Should show updated projected balance
    expect(screen.getByText('-5,000 TND')).toBeInTheDocument(); // 10000 - 15000
  });
  it('should show variable revenues when they exist', () => {
    const dataWithCustomRevenues = {
      ...mockMonthData,
      revenues: {
        ...mockMonthData.revenues,
        custom: [
          { id: '1', name: 'Bonus', amount: 1000, isRecurring: false }
        ]
      }
    };
    const props = { ...defaultProps, monthData: dataWithCustomRevenues };
    
    render(<CurrentMonthCard {...props} />);
    
    expect(screen.getByText('Revenus variables prévus')).toBeInTheDocument();
    expect(screen.getByText('Bonus')).toBeInTheDocument();
    expect(screen.getByText('1,000 TND')).toBeInTheDocument();
  });

  it('should not show variable revenues section when none exist', () => {
    render(<CurrentMonthCard {...defaultProps} />);
    
    expect(screen.queryByText('Revenus variables prévus')).not.toBeInTheDocument();
  });

  it('should call onCurrentBalanceChange when balance is updated', () => {
    const onCurrentBalanceChange = vi.fn();
    const props = { ...defaultProps, onCurrentBalanceChange };
    
    render(<CurrentMonthCard {...props} />);
    
    const balanceInput = screen.getByDisplayValue('10000');
    fireEvent.change(balanceInput, { target: { value: '12000' } });
    
    expect(onCurrentBalanceChange).toHaveBeenCalledWith(12000);
  });
  it('should show low balance alert when threshold is exceeded', () => {
    render(<CurrentMonthCard {...defaultProps} />);
    
    // Change expense forecast to create low balance
    const expenseForecastInput = screen.getByDisplayValue('12500');
    fireEvent.change(expenseForecastInput, { target: { value: '20000' } });
    
    // Should show alert for negative balance
    expect(screen.getByText('Alerte solde bas')).toBeInTheDocument();
  });
});
