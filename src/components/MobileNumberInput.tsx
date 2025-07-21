import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Minus, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MobileNumberInputProps {
  value: number;
  onChange: (value: number) => void;
  label?: string;
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
  quickButtons?: number[]; // Boutons rapides comme [100, 500, 1000]
  className?: string;
  currency?: string;
}

export function MobileNumberInput({
  value,
  onChange,
  label,
  placeholder,
  min = 0,
  max,
  step = 1,
  quickButtons = [],
  className,
  currency = 'TND'
}: MobileNumberInputProps) {
  const handleIncrement = (amount: number) => {
    const newValue = Math.max(min, Math.min(max || Infinity, value + amount));
    onChange(newValue);
  };

  const handleDecrement = (amount: number) => {
    const newValue = Math.max(min, Math.min(max || Infinity, value - amount));
    onChange(newValue);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(e.target.value) || 0;
    onChange(Math.max(min, Math.min(max || Infinity, newValue)));
  };

  return (
    <div className={cn("space-y-3", className)}>
      {label && (
        <label className="text-sm font-medium text-foreground">
          {label}
        </label>
      )}
      
      {/* Input principal avec contrôles +/- */}
      <div className="flex items-center space-x-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="mobile-button h-11 w-11 p-0 touch-manipulation"
          onClick={() => handleDecrement(step)}
          disabled={value <= min}
        >
          <Minus className="h-4 w-4" />
        </Button>
        
        <div className="flex-1 relative">
          <Input
            type="number"
            inputMode="numeric"
            pattern="[0-9]*"
            value={value}
            onChange={handleInputChange}
            placeholder={placeholder}
            min={min}
            max={max}
            step={step}
            className="mobile-input numeric-input text-center h-11 text-lg font-medium"
            style={{ fontSize: '16px' }} // Force 16px pour éviter le zoom iOS
          />
          {currency && (
            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-muted-foreground">
              {currency}
            </span>
          )}
        </div>
        
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="mobile-button h-11 w-11 p-0 touch-manipulation"
          onClick={() => handleIncrement(step)}
          disabled={max !== undefined && value >= max}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {/* Boutons d'incrémentation rapide */}
      {quickButtons.length > 0 && (
        <div className="flex flex-wrap gap-2 justify-center">
          {quickButtons.map((amount) => (
            <div key={amount} className="flex space-x-1">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mobile-button text-xs px-2 py-1 h-8 touch-manipulation"
                onClick={() => handleDecrement(amount)}
                disabled={value - amount < min}
              >
                -{amount}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mobile-button text-xs px-2 py-1 h-8 touch-manipulation"
                onClick={() => handleIncrement(amount)}
                disabled={max !== undefined && value + amount > max}
              >
                +{amount}
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MobileNumberInput;
