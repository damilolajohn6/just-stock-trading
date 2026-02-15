'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import type { WishlistItem } from '@/store/wishlist-store';

export interface WishlistActionResponse {
  success: boolean;
  message?: string;
  error?: string;
  data?: WishlistItem[];
}

// Get wishlist items
export async function getWishlistItems(): Promise<WishlistActionResponse> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'Not authenticated' };
  }

  const { data, error } = await supabase
    .from('wishlists')
    .select(`
      id,
      created_at,
      product:products (
        id,
        name,
        slug,
        price,
        compare_at_price,
        condition,
        brand,
        images:product_images (url, alt_text)
      )
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching wishlist:', error);
    return { success: false, error: 'Failed to fetch wishlist' };
  }

  const items: WishlistItem[] = data.map((item: any) => ({
    id: item.id,
    productId: item.product.id,
    name: item.product.name,
    slug: item.product.slug,
    price: item.product.price,
    originalPrice: item.product.compare_at_price,
    image: item.product.images?.[0]?.url || null,
    brand: item.product.brand,
    condition: item.product.condition,
    addedAt: item.created_at,
  }));

  return { success: true, data: items };
}

// Add to wishlist
export async function addToWishlist(productId: string): Promise<WishlistActionResponse> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'Not authenticated' };
  }

  // Check if already in wishlist
  const { data: existing } = await supabase
    .from('wishlists')
    .select('id')
    .eq('user_id', user.id)
    .eq('product_id', productId)
    .single();

  if (existing) {
    return { success: true, message: 'Already in wishlist' };
  }

  const { error } = await supabase.from('wishlists').insert({
    user_id: user.id,
    product_id: productId,
  });

  if (error) {
    console.error('Error adding to wishlist:', error);
    return { success: false, error: 'Failed to add to wishlist' };
  }

  revalidatePath('/wishlist');
  revalidatePath('/account/wishlist');
  return { success: true, message: 'Added to wishlist' };
}

// Remove from wishlist
export async function removeFromWishlist(productId: string): Promise<WishlistActionResponse> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'Not authenticated' };
  }

  const { error } = await supabase
    .from('wishlists')
    .delete()
    .eq('user_id', user.id)
    .eq('product_id', productId);

  if (error) {
    console.error('Error removing from wishlist:', error);
    return { success: false, error: 'Failed to remove from wishlist' };
  }

  revalidatePath('/wishlist');
  revalidatePath('/account/wishlist');
  return { success: true, message: 'Removed from wishlist' };
}

// Toggle wishlist
export async function toggleWishlist(productId: string): Promise<WishlistActionResponse & { isInWishlist: boolean }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'Not authenticated', isInWishlist: false };
  }

  // Check if in wishlist
  const { data: existing } = await supabase
    .from('wishlists')
    .select('id')
    .eq('user_id', user.id)
    .eq('product_id', productId)
    .single();

  if (existing) {
    await removeFromWishlist(productId);
    return { success: true, message: 'Removed from wishlist', isInWishlist: false };
  } else {
    await addToWishlist(productId);
    return { success: true, message: 'Added to wishlist', isInWishlist: true };
  }
}

// Sync wishlist
export async function syncWishlist(items: WishlistItem[]): Promise<WishlistActionResponse> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'Not authenticated' };
  }

  // Get existing wishlist
  const { data: existing } = await supabase
    .from('wishlists')
    .select('product_id')
    .eq('user_id', user.id);

  const existingIds = new Set(existing?.map((w: any) => w.product_id) || []);
  const newItems = items.filter((item) => !existingIds.has(item.productId));

  if (newItems.length > 0) {
    const { error } = await supabase.from('wishlists').insert(
      newItems.map((item) => ({
        user_id: user.id,
        product_id: item.productId,
      }))
    );

    if (error) {
      console.error('Error syncing wishlist:', error);
      return { success: false, error: 'Failed to sync wishlist' };
    }
  }

  return { success: true, message: 'Wishlist synced' };
}

// Clear wishlist
export async function clearWishlist(): Promise<WishlistActionResponse> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'Not authenticated' };
  }

  const { error } = await supabase
    .from('wishlists')
    .delete()
    .eq('user_id', user.id);

  if (error) {
    return { success: false, error: 'Failed to clear wishlist' };
  }

  revalidatePath('/wishlist');
  return { success: true, message: 'Wishlist cleared' };
}
