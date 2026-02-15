'use client';

import Image from 'next/image';
import { CreditCard, Wallet } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { cn } from '@/utils/cn';

interface PaymentMethodsProps {
  selected: 'stripe' | 'paystack' | null;
  onSelect: (method: 'stripe' | 'paystack') => void;
}

const PAYMENT_METHODS = [
  {
    id: 'stripe' as const,
    name: 'Credit / Debit Card',
    description: 'Pay securely with Visa, Mastercard, or American Express',
    icon: CreditCard,
    logos: ['visa', 'mastercard', 'amex'],
  },
  {
    id: 'paystack' as const,
    name: 'Paystack',
    description: 'Pay with Paystack (supports Nigerian cards & bank transfer)',
    icon: Wallet,
    logos: ['paystack'],
  },
];

export function PaymentMethods({ selected, onSelect }: PaymentMethodsProps) {
  return (
    <div className="space-y-4">
      <h3 className="font-medium">Payment Method</h3>

      <RadioGroup
        value={selected || ''}
        onValueChange={(value) => onSelect(value as 'stripe' | 'paystack')}
      >
        <div className="space-y-3">
          {PAYMENT_METHODS.map((method) => {
            const Icon = method.icon;

            return (
              <div
                key={method.id}
                className={cn(
                  'flex items-start gap-4 rounded-lg border p-4 transition-colors cursor-pointer',
                  selected === method.id && 'border-primary bg-primary/5'
                )}
                onClick={() => onSelect(method.id)}
              >
                <RadioGroupItem value={method.id} id={method.id} className="mt-1" />
                <Icon className="h-5 w-5 text-muted-foreground mt-0.5" />
                <Label htmlFor={method.id} className="flex-1 cursor-pointer">
                  <div>
                    <p className="font-medium">{method.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {method.description}
                    </p>
                    {/* Payment logos */}
                    <div className="flex items-center gap-2 mt-2">
                      {method.id === 'stripe' && (
                        <>
                          <div className="h-6 w-10 bg-[#1A1F71] rounded flex items-center justify-center text-white text-xs font-bold">
                            VISA
                          </div>
                          <div className="h-6 w-10 bg-gradient-to-r from-[#EB001B] to-[#F79E1B] rounded flex items-center justify-center">
                            <div className="w-3 h-3 bg-[#EB001B] rounded-full opacity-80" />
                            <div className="w-3 h-3 bg-[#F79E1B] rounded-full -ml-1 opacity-80" />
                          </div>
                        </>
                      )}
                      {method.id === 'paystack' && (
                        <div className="h-6 px-2 bg-[#00C3F7] rounded flex items-center justify-center text-white text-xs font-bold">
                          Paystack
                        </div>
                      )}
                    </div>
                  </div>
                </Label>
              </div>
            );
          })}
        </div>
      </RadioGroup>

      <p className="text-xs text-muted-foreground text-center">
        Your payment information is secure and encrypted
      </p>
    </div>
  );
}
