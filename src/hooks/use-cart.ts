'use client';

import { useEffect, useCallback } from 'react';
import { useCartStore, type CartItem } from '@/store/cart-store';
import { useAuthContext } from '@/components/providers/auth-provider';
import { getCartItems, syncCart } from '@/actions/cart';
import { toast } from 'sonner';

export function useCart() {
  const { isAuthenticated, user } = useAuthContext();
  const store = useCartStore();

  // Sync cart with server on login
  useEffect(() => {
    if (isAuthenticated && user) {
      const localItems = store.items;
      
      // Load cart from server
      getCartItems().then((response) => {
        if (response.success && response.data) {
          // Merge local and server carts
          const serverItems = response.data;
          const mergedItems = mergeCartItems(localItems, serverItems);
          
          if (mergedItems.length > 0) {
            store.setItems(mergedItems);
            // Sync merged cart back to server
            syncCart(mergedItems);
          }
        }
      });
    }
  }, [isAuthenticated, user?.id]);

  // Sync to server when cart changes (debounced)
  const syncToServer = useCallback(async () => {
    if (isAuthenticated) {
      await syncCart(store.items);
      store.setLastSynced(new Date().toISOString());
    }
  }, [isAuthenticated, store.items]);

  const addItem = useCallback(
    (item: Omit<CartItem, 'id'>) => {
      store.addItem(item);
      toast.success(`${item.name} added to cart`);
    },
    [store]
  );

  const removeItem = useCallback(
    (id: string) => {
      const item = store.items.find((i) => i.id === id);
      store.removeItem(id);
      if (item) {
        toast.success(`${item.name} removed from cart`);
      }
    },
    [store]
  );

  const updateQuantity = useCallback(
    (id: string, quantity: number) => {
      store.updateQuantity(id, quantity);
    },
    [store]
  );

  const clearCart = useCallback(() => {
    store.clearCart();
    toast.success('Cart cleared');
  }, [store]);

  return {
    items: store.items,
    itemCount: store.getItemCount(),
    subtotal: store.getSubtotal(),
    discount: store.getDiscount(),
    shipping: store.getShipping(),
    total: store.getTotal(),
    coupon: store.coupon,
    isOpen: store.isOpen,
    isLoading: store.isLoading,

    // Actions
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    openCart: store.openCart,
    closeCart: store.closeCart,
    toggleCart: store.toggleCart,
    applyCoupon: store.applyCoupon,
    removeCoupon: store.removeCoupon,
    getItem: store.getItem,
    syncToServer,
  };
}

// Helper to merge cart items
function mergeCartItems(localItems: CartItem[], serverItems: CartItem[]): CartItem[] {
  const merged = new Map<string, CartItem>();

  // Add server items first
  serverItems.forEach((item) => {
    const key = `${item.productId}-${item.variantId}`;
    merged.set(key, item);
  });

  // Merge local items
  localItems.forEach((item) => {
    const key = `${item.productId}-${item.variantId}`;
    if (merged.has(key)) {
      const existing = merged.get(key)!;
      merged.set(key, {
        ...existing,
        quantity: Math.min(existing.quantity + item.quantity, item.maxQuantity),
      });
    } else {
      merged.set(key, item);
    }
  });

  return Array.from(merged.values());
}
