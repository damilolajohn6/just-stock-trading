'use server';

import { revalidatePath } from 'next/cache';
import { createAdminClient } from '@/lib/supabase/admin';
import { couponSchema, type CouponFormData } from '@/validators/coupon';

export async function createCoupon(data: CouponFormData) {
  const result = couponSchema.safeParse(data);
  if (!result.success) return { success: false, error: 'Invalid data' };

  const supabase = createAdminClient();
  const { error } = await supabase.from('coupons').insert(result.data);

  if (error) return { success: false, error: error.message };

  revalidatePath('/admin/coupons');
  return { success: true };
}

export async function deleteCoupon(id: string) {
  const supabase = createAdminClient();
  const { error } = await supabase.from('coupons').delete().eq('id', id);
  
  if (error) return { success: false, error: error.message };
  
  revalidatePath('/admin/coupons');
  return { success: true };
}
