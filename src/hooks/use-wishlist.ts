'use client';

import { useEffect, useCallback } from 'react';
import { useWishlistStore, type WishlistItem } from '@/store/wishlist-store';
import { useAuthContext } from '@/components/providers/auth-provider';
import {
  getWishlistItems,
  addToWishlist as addToWishlistAction,
  removeFromWishlist as removeFromWishlistAction,
  syncWishlist,
} from '@/actions/wishlist';
import { toast } from 'sonner';

export function useWishlist() {
  const { isAuthenticated, user } = useAuthContext();
  const store = useWishlistStore();

  // Sync wishlist with server on login
  useEffect(() => {
    if (isAuthenticated && user) {
      const localItems = store.items;

      getWishlistItems().then((response) => {
        if (response.success && response.data) {
          // Merge local and server wishlists
          const serverItems = response.data;
          const mergedItems = mergeWishlistItems(localItems, serverItems);
          store.setItems(mergedItems);

          // Sync any new local items to server
          const newItems = localItems.filter(
            (local) => !serverItems.some((server) => server.productId === local.productId)
          );
          if (newItems.length > 0) {
            syncWishlist(newItems);
          }
        }
      });
    }
  }, [isAuthenticated, user?.id]);

  const addItem = useCallback(
    async (item: Omit<WishlistItem, 'id' | 'addedAt'>) => {
      store.addItem(item);
      toast.success('Added to wishlist');

      if (isAuthenticated) {
        await addToWishlistAction(item.productId);
      }
    },
    [store, isAuthenticated]
  );

  const removeItem = useCallback(
    async (productId: string) => {
      const item = store.items.find((i) => i.productId === productId);
      store.removeItem(productId);
      
      if (item) {
        toast.success('Removed from wishlist');
      }

      if (isAuthenticated) {
        await removeFromWishlistAction(productId);
      }
    },
    [store, isAuthenticated]
  );

  const toggleItem = useCallback(
    async (item: Omit<WishlistItem, 'id' | 'addedAt'>) => {
      const isInWishlist = store.isInWishlist(item.productId);
      
      if (isInWishlist) {
        await removeItem(item.productId);
        return false;
      } else {
        await addItem(item);
        return true;
      }
    },
    [store, addItem, removeItem]
  );

  const clearWishlist = useCallback(() => {
    store.clearWishlist();
    toast.success('Wishlist cleared');
  }, [store]);

  return {
    items: store.items,
    itemCount: store.getItemCount(),
    isLoading: store.isLoading,
    isInWishlist: store.isInWishlist,
    addItem,
    removeItem,
    toggleItem,
    clearWishlist,
  };
}

// Helper to merge wishlist items
function mergeWishlistItems(
  localItems: WishlistItem[],
  serverItems: WishlistItem[]
): WishlistItem[] {
  const merged = new Map<string, WishlistItem>();

  serverItems.forEach((item) => {
    merged.set(item.productId, item);
  });

  localItems.forEach((item) => {
    if (!merged.has(item.productId)) {
      merged.set(item.productId, item);
    }
  });

  return Array.from(merged.values()).sort(
    (a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime()
  );
}
