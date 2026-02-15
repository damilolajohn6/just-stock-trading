'use server';

import { revalidatePath } from 'next/cache';
import { createAdminClient } from '@/lib/supabase/admin';
import { categorySchema, type CategoryFormData } from '@/validators/category';

// Create Category
export async function createCategory(data: CategoryFormData) {
  const result = categorySchema.safeParse(data);
  if (!result.success) return { success: false, error: 'Invalid data' };

  const supabase = createAdminClient();
  const { error } = await supabase.from('categories').insert(result.data);

  if (error) {
    console.error('Create category error:', error);
    return { success: false, error: 'Failed to create category' };
  }

  revalidatePath('/admin/categories');
  revalidatePath('/categories');
  return { success: true };
}

// Update Category
export async function updateCategory(id: string, data: CategoryFormData) {
  const result = categorySchema.safeParse(data);
  if (!result.success) return { success: false, error: 'Invalid data' };

  const supabase = createAdminClient();
  const { error } = await supabase
    .from('categories')
    .update(result.data)
    .eq('id', id);

  if (error) return { success: false, error: 'Update failed' };

  revalidatePath('/admin/categories');
  revalidatePath('/categories');
  return { success: true };
}

// Delete Category
export async function deleteCategory(id: string) {
  const supabase = createAdminClient();
  
  // Check for children
  const { count } = await supabase
    .from('categories')
    .select('*', { count: 'exact', head: true })
    .eq('parent_id', id);

  if (count && count > 0) {
    return { success: false, error: 'Cannot delete category with subcategories' };
  }

  // Check for products
  const { count: productCount } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })
    .eq('category_id', id);

  if (productCount && productCount > 0) {
    return { success: false, error: 'Cannot delete category containing products' };
  }

  const { error } = await supabase.from('categories').delete().eq('id', id);

  if (error) return { success: false, error: 'Delete failed' };

  revalidatePath('/admin/categories');
  revalidatePath('/categories');
  return { success: true };
}
