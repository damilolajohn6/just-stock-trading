'use client';

import { Check } from 'lucide-react';
import { cn } from '@/utils/cn';
import { type CheckoutStep, useCheckoutStore } from '@/store/checkout-store';

const STEPS: { id: CheckoutStep; label: string }[] = [
  { id: 'information', label: 'Information' },
  { id: 'shipping', label: 'Shipping' },
  { id: 'payment', label: 'Payment' },
  { id: 'review', label: 'Review' },
];

export function CheckoutSteps() {
  const { currentStep, completedSteps, setStep } = useCheckoutStore();

  const currentIndex = STEPS.findIndex((s) => s.id === currentStep);

  const canNavigateToStep = (stepId: CheckoutStep) => {
    const stepIndex = STEPS.findIndex((s) => s.id === stepId);
    // Can navigate to completed steps or current step
    return completedSteps.includes(stepId) || stepIndex <= currentIndex;
  };

  return (
    <nav aria-label="Checkout progress" className="mb-8">
      <ol className="flex items-center">
        {STEPS.map((step, index) => {
          const isCompleted = completedSteps.includes(step.id);
          const isCurrent = step.id === currentStep;
          const isClickable = canNavigateToStep(step.id);

          return (
            <li
              key={step.id}
              className={cn(
                'flex items-center',
                index < STEPS.length - 1 && 'flex-1'
              )}
            >
              <button
                onClick={() => isClickable && setStep(step.id)}
                disabled={!isClickable}
                className={cn(
                  'flex items-center gap-2 transition-colors',
                  isClickable ? 'cursor-pointer' : 'cursor-not-allowed',
                  isCurrent && 'text-primary font-medium',
                  isCompleted && 'text-primary',
                  !isCurrent && !isCompleted && 'text-muted-foreground'
                )}
              >
                <span
                  className={cn(
                    'flex h-8 w-8 items-center justify-center rounded-full border-2 text-sm font-medium transition-colors',
                    isCompleted && 'bg-primary border-primary text-primary-foreground',
                    isCurrent && 'border-primary text-primary',
                    !isCurrent && !isCompleted && 'border-muted-foreground'
                  )}
                >
                  {isCompleted ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </span>
                <span className="hidden sm:inline">{step.label}</span>
              </button>

              {/* Connector line */}
              {index < STEPS.length - 1 && (
                <div
                  className={cn(
                    'mx-2 h-0.5 flex-1',
                    index < currentIndex || isCompleted
                      ? 'bg-primary'
                      : 'bg-muted'
                  )}
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
