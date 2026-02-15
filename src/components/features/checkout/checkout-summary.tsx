'use client';

import Image from 'next/image';
import { ShoppingBag, Tag, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { formatCurrency } from '@/utils/format';
import type { CartItem, AppliedCoupon } from '@/store/cart-store';

interface CheckoutSummaryProps {
  items: CartItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  coupon: AppliedCoupon | null;
  onRemoveCoupon?: () => void;
  isCollapsible?: boolean;
}

export function CheckoutSummary({
  items,
  subtotal,
  discount,
  shipping,
  total,
  coupon,
  onRemoveCoupon,
  isCollapsible = false,
}: CheckoutSummaryProps) {
  return (
    <div className="bg-muted/50 rounded-lg p-6">
      <h3 className="font-semibold mb-4">Order Summary</h3>

      {/* Items */}
      <ScrollArea className="max-h-64">
        <div className="space-y-4 pr-4">
          {items.map((item) => (
            <div key={item.id} className="flex gap-3">
              <div className="relative h-14 w-14 rounded-md overflow-hidden bg-muted flex-shrink-0">
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <ShoppingBag className="h-5 w-5 text-muted-foreground" />
                  </div>
                )}
                <div className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                  {item.quantity}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{item.name}</p>
                {(item.size || item.color) && (
                  <p className="text-xs text-muted-foreground">
                    {[item.size, item.color].filter(Boolean).join(' / ')}
                  </p>
                )}
              </div>
              <p className="text-sm font-medium">
                {formatCurrency(item.price * item.quantity)}
              </p>
            </div>
          ))}
        </div>
      </ScrollArea>

      <Separator className="my-4" />

      {/* Coupon */}
      {coupon && (
        <div className="flex items-center justify-between bg-green-50 dark:bg-green-950/30 rounded-lg px-3 py-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-green-700 dark:text-green-400">
            <Tag className="h-4 w-4" />
            <span className="font-medium">{coupon.code}</span>
          </div>
          {onRemoveCoupon && (
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-green-700 dark:text-green-400"
              onClick={onRemoveCoupon}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      )}

      {/* Totals */}
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Subtotal</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-green-600">
            <span>Discount</span>
            <span>-{formatCurrency(discount)}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span className="text-muted-foreground">Shipping</span>
          <span>
            {shipping === 0 ? (
              <span className="text-green-600">Free</span>
            ) : (
              formatCurrency(shipping)
            )}
          </span>
        </div>
        <Separator className="my-2" />
        <div className="flex justify-between text-base font-semibold">
          <span>Total</span>
          <span>{formatCurrency(total)}</span>
        </div>
      </div>
    </div>
  );
}
