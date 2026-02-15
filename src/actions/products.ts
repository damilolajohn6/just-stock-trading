'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { productSchema, type ProductFormData } from '@/validators/product';

// Create Product
export async function createProduct(data: ProductFormData) {
  const result = productSchema.safeParse(data);
  if (!result.success) {
    return { success: false, error: 'Invalid product data' };
  }

  const supabase = createAdminClient();
  const { images, variants, ...productData } = result.data;

  // 1. Insert Product
  const { data: product, error: prodError } = await supabase
    .from('products')
    .insert(productData)
    .select('id')
    .single();

  if (prodError) {
    console.error('Create product error:', prodError);
    return { success: false, error: 'Failed to create product' };
  }

  // 2. Insert Images
  if (images.length > 0) {
    const imageInserts = images.map((img, index) => ({
      product_id: product.id,
      url: img.url,
      public_id: img.id,
      sort_order: index,
      is_primary: index === 0,
    }));

    const { error: imgError } = await supabase.from('product_images').insert(imageInserts);
    if (imgError) console.error('Image insert error:', imgError);
  }

  // 3. Insert Variants
  if (variants.length > 0) {
    const variantInserts = variants.map((v) => ({
      product_id: product.id,
      ...v,
      is_available: v.stock_quantity > 0,
    }));

    const { error: varError } = await supabase.from('product_variants').insert(variantInserts);
    if (varError) console.error('Variant insert error:', varError);
  }

  revalidatePath('/admin/products');
  return { success: true, productId: product.id };
}

// Update Product
export async function updateProduct(id: string, data: ProductFormData) {
  const result = productSchema.safeParse(data);
  if (!result.success) return { success: false, error: 'Invalid data' };

  const supabase = createAdminClient();
  const { images, variants, ...productData } = result.data;

  // 1. Update Product
  const { error: prodError } = await supabase
    .from('products')
    .update(productData)
    .eq('id', id);

  if (prodError) return { success: false, error: 'Update failed' };

  // 2. Sync Images (Delete all and re-insert for simplicity, or diffing logic)
  // For robustness, usually we diff. Here we'll simple replace to ensure order.
  await supabase.from('product_images').delete().eq('product_id', id);
  
  const imageInserts = images.map((img, index) => ({
    product_id: id,
    url: img.url,
    public_id: img.id,
    sort_order: index,
    is_primary: index === 0,
  }));
  await supabase.from('product_images').insert(imageInserts);

  // 3. Sync Variants
  // Delete existing variants and re-create to handle removals/additions easily
  await supabase.from('product_variants').delete().eq('product_id', id);
  
  const variantInserts = variants.map((v) => ({
    product_id: id,
    ...v,
    is_available: v.stock_quantity > 0,
  }));
  await supabase.from('product_variants').insert(variantInserts);

  revalidatePath('/admin/products');
  revalidatePath(`/products/${data.slug}`);
  
  return { success: true };
}

// Delete Product
export async function deleteProduct(id: string) {
  const supabase = createAdminClient();
  
  // RLS/Cascading delete should handle related tables
  const { error } = await supabase.from('products').delete().eq('id', id);

  if (error) return { success: false, error: 'Delete failed' };

  revalidatePath('/admin/products');
  return { success: true };
}
