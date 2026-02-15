'use client';

import { useState, useCallback } from 'react';
import { useCartStore } from '@/store/cart-store';
import { validateCoupon } from '@/actions/coupon';
import { toast } from 'sonner';

export function useCoupon() {
  const [isValidating, setIsValidating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { coupon, applyCoupon, removeCoupon, getSubtotal } = useCartStore();

  const apply = useCallback(
    async (code: string) => {
      if (!code.trim()) {
        setError('Please enter a coupon code');
        return false;
      }

      setIsValidating(true);
      setError(null);

      try {
        const subtotal = getSubtotal();
        const result = await validateCoupon(code, subtotal);

        if (result.success && result.coupon) {
          applyCoupon(result.coupon);
          toast.success('Coupon applied successfully!');
          return true;
        } else {
          setError(result.error || 'Invalid coupon code');
          toast.error(result.error || 'Invalid coupon code');
          return false;
        }
      } catch (err) {
        setError('Failed to validate coupon');
        toast.error('Failed to validate coupon');
        return false;
      } finally {
        setIsValidating(false);
      }
    },
    [applyCoupon, getSubtotal]
  );

  const remove = useCallback(() => {
    removeCoupon();
    setError(null);
    toast.success('Coupon removed');
  }, [removeCoupon]);

  return {
    coupon,
    isValidating,
    error,
    apply,
    remove,
  };
}
