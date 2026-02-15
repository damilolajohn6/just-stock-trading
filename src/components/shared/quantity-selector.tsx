'use client';

import { Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/utils/cn';

interface QuantitySelectorProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  disabled?: boolean;
  className?: string;
}

export function QuantitySelector({
  value,
  onChange,
  min = 1,
  max = 99,
  disabled = false,
  className,
}: QuantitySelectorProps) {
  const decrease = () => {
    if (value > min) {
      onChange(value - 1);
    }
  };

  const increase = () => {
    if (value < max) {
      onChange(value + 1);
    }
  };

  return (
    <div
      className={cn(
        'flex items-center border rounded-lg',
        disabled && 'opacity-50 pointer-events-none',
        className
      )}
    >
      <Button
        variant="ghost"
        size="icon"
        className="h-10 w-10 rounded-r-none"
        onClick={decrease}
        disabled={disabled || value <= min}
      >
        <Minus className="h-4 w-4" />
        <span className="sr-only">Decrease quantity</span>
      </Button>
      <div className="w-12 text-center font-medium tabular-nums">{value}</div>
      <Button
        variant="ghost"
        size="icon"
        className="h-10 w-10 rounded-l-none"
        onClick={increase}
        disabled={disabled || value >= max}
      >
        <Plus className="h-4 w-4" />
        <span className="sr-only">Increase quantity</span>
      </Button>
    </div>
  );
}
