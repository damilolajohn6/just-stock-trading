'use server';

import { revalidatePath } from 'next/cache';
import { createAdminClient, isUserAdmin } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';
import { stripe } from '@/lib/stripe/server';

// Middleware to ensure admin
async function ensureAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !(await isUserAdmin(user.id))) {
    throw new Error('Unauthorized');
  }
  return user;
}

// Update Order Status
export async function updateOrderStatus(orderId: string, status: string) {
  await ensureAdmin();
  const supabase = createAdminClient();

  const updateData: any = { status };
  if (status === 'shipped') updateData.shipped_at = new Date().toISOString();
  if (status === 'delivered') updateData.delivered_at = new Date().toISOString();

  const { error } = await supabase
    .from('orders')
    .update(updateData)
    .eq('id', orderId);

  if (error) return { success: false, error: 'Failed to update order' };

  revalidatePath(`/admin/orders/${orderId}`);
  revalidatePath('/admin/orders');
  return { success: true };
}

// Toggle User Block Status
export async function toggleUserBlock(userId: string, isBlocked: boolean) {
  await ensureAdmin();
  const supabase = createAdminClient();

  const { error } = await supabase
    .from('profiles')
    .update({ is_blocked: isBlocked })
    .eq('id', userId);

  if (error) return { success: false, error: 'Failed to update user' };

  revalidatePath('/admin/users');
  return { success: true };
}

// Update User Role
export async function updateUserRole(userId: string, role: 'user' | 'admin') {
  await ensureAdmin();
  const supabase = createAdminClient();

  const { error } = await supabase
    .from('profiles')
    .update({ role })
    .eq('id', userId);

  if (error) return { success: false, error: 'Failed to update role' };

  revalidatePath('/admin/users');
  return { success: true };
}
