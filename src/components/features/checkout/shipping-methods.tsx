'use client';

import { Truck, Zap, Clock } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/utils/format';
import { SHIPPING_METHODS, type ShippingMethod } from '@/store/checkout-store';
import { cn } from '@/utils/cn';

interface ShippingMethodsProps {
  selectedId: string | null;
  onSelect: (method: ShippingMethod) => void;
  subtotal: number;
  freeShippingThreshold?: number;
}

const METHOD_ICONS: Record<string, React.ElementType> = {
  standard: Truck,
  express: Zap,
  next_day: Clock,
};

export function ShippingMethods({
  selectedId,
  onSelect,
  subtotal,
  freeShippingThreshold = 50,
}: ShippingMethodsProps) {
  const isFreeShipping = subtotal >= freeShippingThreshold;

  return (
    <div className="space-y-4">
      <h3 className="font-medium">Shipping Method</h3>

      {isFreeShipping && (
        <div className="bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400 rounded-lg p-3 text-sm">
          🎉 You qualify for free standard shipping!
        </div>
      )}

      <RadioGroup
        value={selectedId || ''}
        onValueChange={(id) => {
          const method = SHIPPING_METHODS.find((m) => m.id === id);
          if (method) onSelect(method);
        }}
      >
        <div className="space-y-3">
          {SHIPPING_METHODS.map((method) => {
            const Icon = METHOD_ICONS[method.id] || Truck;
            const isFree = isFreeShipping && method.id === 'standard';
            const displayPrice = isFree ? 0 : method.price;

            return (
              <div
                key={method.id}
                className={cn(
                  'flex items-center gap-4 rounded-lg border p-4 transition-colors cursor-pointer',
                  selectedId === method.id && 'border-primary bg-primary/5'
                )}
                onClick={() => onSelect(method)}
              >
                <RadioGroupItem value={method.id} id={method.id} />
                <Icon className="h-5 w-5 text-muted-foreground" />
                <Label htmlFor={method.id} className="flex-1 cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{method.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {method.description} • {method.estimatedDays}
                      </p>
                    </div>
                    <div className="text-right">
                      {isFree ? (
                        <div className="flex items-center gap-2">
                          <span className="line-through text-muted-foreground text-sm">
                            {formatCurrency(method.price)}
                          </span>
                          <Badge variant="success">FREE</Badge>
                        </div>
                      ) : (
                        <span className="font-semibold">
                          {formatCurrency(displayPrice)}
                        </span>
                      )}
                    </div>
                  </div>
                </Label>
              </div>
            );
          })}
        </div>
      </RadioGroup>
    </div>
  );
}
