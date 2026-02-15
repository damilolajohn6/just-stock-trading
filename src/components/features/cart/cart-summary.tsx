'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Truck,
  Tag,
  X,
  Loader2,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { formatCurrency } from '@/utils/format';
import { useCoupon } from '@/hooks/use-coupon';

interface CartSummaryProps {
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  itemCount: number;
  showCheckoutButton?: boolean;
  onCheckout?: () => void;
}

export function CartSummary({
  subtotal,
  discount,
  shipping,
  total,
  itemCount,
  showCheckoutButton = true,
  onCheckout,
}: CartSummaryProps) {
  const [couponCode, setCouponCode] = useState('');
  const { coupon, isValidating, error, apply, remove } = useCoupon();

  const handleApplyCoupon = async () => {
    const success = await apply(couponCode);
    if (success) {
      setCouponCode('');
    }
  };

  const freeShippingThreshold = 50;
  const amountToFreeShipping = freeShippingThreshold - subtotal;

  return (
    <div className="bg-muted/50 rounded-lg p-6 space-y-4">
      <h2 className="text-lg font-semibold">Order Summary</h2>

      {/* Free shipping progress */}
      {shipping > 0 && (
        <div className="bg-primary/10 rounded-lg p-3">
          <div className="flex items-center gap-2 text-sm">
            <Truck className="h-4 w-4 text-primary" />
            <span>
              Add <strong>{formatCurrency(amountToFreeShipping)}</strong> more
              for free shipping!
            </span>
          </div>
          <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all"
              style={{
                width: `${Math.min(
                  (subtotal / freeShippingThreshold) * 100,
                  100
                )}%`,
              }}
            />
          </div>
        </div>
      )}

      {/* Coupon input */}
      {!coupon ? (
        <div className="space-y-2">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Coupon code"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                className="pl-9"
                onKeyDown={(e) => e.key === 'Enter' && handleApplyCoupon()}
              />
            </div>
            <Button
              variant="outline"
              onClick={handleApplyCoupon}
              disabled={isValidating || !couponCode}
            >
              {isValidating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                'Apply'
              )}
            </Button>
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
      ) : (
        <div className="flex items-center justify-between bg-green-50 dark:bg-green-950/30 rounded-lg px-3 py-2">
          <div className="flex items-center gap-2 text-sm text-green-700 dark:text-green-400">
            <Tag className="h-4 w-4" />
            <span className="font-medium">{coupon.code}</span>
            <span className="text-green-600 dark:text-green-500">
              {coupon.type === 'percentage'
                ? `-${coupon.value}%`
                : coupon.type === 'fixed'
                ? `-${formatCurrency(coupon.value)}`
                : 'Free shipping'}
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-green-700 dark:text-green-400"
            onClick={remove}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      <Separator />

      {/* Order breakdown */}
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">
            Subtotal ({itemCount} {itemCount === 1 ? 'item' : 'items'})
          </span>
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
      </div>

      <Separator />

      {/* Total */}
      <div className="flex justify-between items-center">
        <span className="text-lg font-semibold">Total</span>
        <span className="text-2xl font-bold">{formatCurrency(total)}</span>
      </div>

      {/* Checkout button */}
      {showCheckoutButton && (
        <Button
          className="w-full"
          size="lg"
          onClick={onCheckout}
          asChild={!onCheckout}
        >
          {onCheckout ? (
            <>
              Proceed to Checkout
              <ChevronRight className="ml-2 h-4 w-4" />
            </>
          ) : (
            <Link href="/checkout">
              Proceed to Checkout
              <ChevronRight className="ml-2 h-4 w-4" />
            </Link>
          )}
        </Button>
      )}

      {/* Trust badges */}
      <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
        <ShieldCheck className="h-4 w-4" />
        <span>Secure checkout with Stripe & Paystack</span>
      </div>
    </div>
  );
}
