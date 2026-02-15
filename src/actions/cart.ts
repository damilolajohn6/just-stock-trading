'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import type { CartItem } from '@/store/cart-store';

export interface CartActionResponse {
  success: boolean;
  message?: string;
  error?: string;
  data?: CartItem[];
}

// Get cart items for authenticated user
export async function getCartItems(): Promise<CartActionResponse> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'Not authenticated' };
  }

  const { data, error } = await supabase
    .from('cart_items')
    .select(`
      id,
      quantity,
      product:products (
        id,
        name,
        slug,
        price,
        compare_at_price,
        condition,
        images:product_images (url, alt_text)
      ),
      variant:product_variants (
        id,
        size,
        color,
        stock_quantity,
        price_adjustment
      )
    `)
    .eq('user_id', user.id);

  if (error) {
    console.error('Error fetching cart:', error);
    return { success: false, error: 'Failed to fetch cart' };
  }

  const items: CartItem[] = data.map((item: any) => ({
    id: item.id,
    productId: item.product.id,
    variantId: item.variant?.id || null,
    name: item.product.name,
    slug: item.product.slug,
    price: item.product.price + (item.variant?.price_adjustment || 0),
    originalPrice: item.product.compare_at_price,
    quantity: item.quantity,
    image: item.product.images?.[0]?.url || null,
    size: item.variant?.size,
    color: item.variant?.color,
    maxQuantity: item.variant?.stock_quantity || 10,
  }));

  return { success: true, data: items };
}

// Sync cart to database
export async function syncCart(items: CartItem[]): Promise<CartActionResponse> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'Not authenticated' };
  }

  // Clear existing cart
  await supabase.from('cart_items').delete().eq('user_id', user.id);

  if (items.length === 0) {
    return { success: true, message: 'Cart cleared' };
  }

  // Insert new items
  const cartItems = items.map((item) => ({
    user_id: user.id,
    product_id: item.productId,
    variant_id: item.variantId,
    quantity: item.quantity,
  }));

  const { error } = await supabase.from('cart_items').insert(cartItems);

  if (error) {
    console.error('Error syncing cart:', error);
    return { success: false, error: 'Failed to sync cart' };
  }

  return { success: true, message: 'Cart synced' };
}

// Add item to cart
export async function addToCart(
  productId: string,
  variantId: string | null,
  quantity: number = 1
): Promise<CartActionResponse> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'Not authenticated' };
  }

  // Check if item exists
  const { data: existing } = await supabase
    .from('cart_items')
    .select('id, quantity')
    .eq('user_id', user.id)
    .eq('product_id', productId)
    .eq('variant_id', variantId)
    .single();

  if (existing) {
    // Update quantity
    const { error } = await supabase
      .from('cart_items')
      .update({ quantity: existing.quantity + quantity })
      .eq('id', existing.id);

    if (error) {
      return { success: false, error: 'Failed to update cart' };
    }
  } else {
    // Insert new item
    const { error } = await supabase.from('cart_items').insert({
      user_id: user.id,
      product_id: productId,
      variant_id: variantId,
      quantity,
    });

    if (error) {
      return { success: false, error: 'Failed to add to cart' };
    }
  }

  revalidatePath('/cart');
  return { success: true, message: 'Added to cart' };
}

// Update cart item quantity
export async function updateCartItemQuantity(
  itemId: string,
  quantity: number
): Promise<CartActionResponse> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'Not authenticated' };
  }

  if (quantity <= 0) {
    return removeFromCart(itemId);
  }

  const { error } = await supabase
    .from('cart_items')
    .update({ quantity })
    .eq('id', itemId)
    .eq('user_id', user.id);

  if (error) {
    return { success: false, error: 'Failed to update quantity' };
  }

  revalidatePath('/cart');
  return { success: true, message: 'Quantity updated' };
}

// Remove item from cart
export async function removeFromCart(itemId: string): Promise<CartActionResponse> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'Not authenticated' };
  }

  const { error } = await supabase
    .from('cart_items')
    .delete()
    .eq('id', itemId)
    .eq('user_id', user.id);

  if (error) {
    return { success: false, error: 'Failed to remove item' };
  }

  revalidatePath('/cart');
  return { success: true, message: 'Item removed' };
}

// Clear cart
export async function clearCart(): Promise<CartActionResponse> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'Not authenticated' };
  }

  const { error } = await supabase
    .from('cart_items')
    .delete()
    .eq('user_id', user.id);

  if (error) {
    return { success: false, error: 'Failed to clear cart' };
  }

  revalidatePath('/cart');
  return { success: true, message: 'Cart cleared' };
}

// Check stock availability
export async function checkStock(
  items: { productId: string; variantId: string | null; quantity: number }[]
): Promise<{ success: boolean; unavailable: string[]; lowStock: string[] }> {
  const supabase = await createClient();
  const unavailable: string[] = [];
  const lowStock: string[] = [];

  for (const item of items) {
    if (item.variantId) {
      const { data: variant } = await supabase
        .from('product_variants')
        .select('stock_quantity, is_available')
        .eq('id', item.variantId)
        .single();

      if (!variant || !variant.is_available || variant.stock_quantity < item.quantity) {
        unavailable.push(item.productId);
      } else if (variant.stock_quantity <= 5) {
        lowStock.push(item.productId);
      }
    }
  }

  return {
    success: unavailable.length === 0,
    unavailable,
    lowStock,
  };
}
