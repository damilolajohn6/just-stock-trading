'use server';

import { createClient } from '@/lib/supabase/server';
import type { AppliedCoupon } from '@/store/cart-store';

export interface CouponValidationResponse {
  success: boolean;
  coupon?: AppliedCoupon;
  error?: string;
}

export async function validateCoupon(
  code: string,
  subtotal: number
): Promise<CouponValidationResponse> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Find coupon
  const { data: coupon, error } = await supabase
    .from('coupons')
    .select('*')
    .ilike('code', code)
    .eq('is_active', true)
    .single();

  if (error || !coupon) {
    return { success: false, error: 'Invalid coupon code' };
  }

  // Check dates
  const now = new Date();
  if (coupon.starts_at && new Date(coupon.starts_at) > now) {
    return { success: false, error: 'Coupon is not yet active' };
  }
  if (coupon.expires_at && new Date(coupon.expires_at) < now) {
    return { success: false, error: 'Coupon has expired' };
  }

  // Check usage limits
  if (coupon.max_uses && coupon.used_count >= coupon.max_uses) {
    return { success: false, error: 'Coupon usage limit reached' };
  }

  // Check minimum purchase
  if (coupon.min_purchase && subtotal < coupon.min_purchase) {
    return {
      success: false,
      error: `Minimum purchase of £${coupon.min_purchase.toFixed(2)} required`,
    };
  }

  // Check per-user limit if logged in
  if (user && coupon.max_uses_per_user) {
    const { count } = await supabase
      .from('coupon_usage')
      .select('*', { count: 'exact', head: true })
      .eq('coupon_id', coupon.id)
      .eq('user_id', user.id);

    if (count && count >= coupon.max_uses_per_user) {
      return { success: false, error: 'You have already used this coupon' };
    }
  }

  // Calculate discount
  let discountAmount = 0;
  switch (coupon.type) {
    case 'percentage':
      discountAmount = (subtotal * coupon.value) / 100;
      if (coupon.max_discount) {
        discountAmount = Math.min(discountAmount, coupon.max_discount);
      }
      break;
    case 'fixed':
      discountAmount = Math.min(coupon.value, subtotal);
      break;
    case 'free_shipping':
      discountAmount = 0; // Handled separately
      break;
  }

  const appliedCoupon: AppliedCoupon = {
    code: coupon.code,
    type: coupon.type,
    value: coupon.value,
    discountAmount,
  };

  return { success: true, coupon: appliedCoupon };
}

export async function applyCouponToOrder(
  couponCode: string,
  orderId: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'Not authenticated' };
  }

  // Get coupon
  const { data: coupon } = await supabase
    .from('coupons')
    .select('id')
    .ilike('code', couponCode)
    .single();

  if (!coupon) {
    return { success: false, error: 'Coupon not found' };
  }

  // Record usage
  const { error } = await supabase.from('coupon_usage').insert({
    coupon_id: coupon.id,
    user_id: user.id,
    order_id: orderId,
  });

  if (error) {
    console.error('Error recording coupon usage:', error);
    return { success: false, error: 'Failed to apply coupon' };
  }

  return { success: true };
}
