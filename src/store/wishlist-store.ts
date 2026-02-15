import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface WishlistItem {
  id: string;
  productId: string;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;
  image: string | null;
  brand?: string;
  condition: string;
  addedAt: string;
}

interface WishlistState {
  items: WishlistItem[];
  isLoading: boolean;
}

interface WishlistActions {
  addItem: (item: Omit<WishlistItem, 'id' | 'addedAt'>) => void;
  removeItem: (productId: string) => void;
  clearWishlist: () => void;
  isInWishlist: (productId: string) => boolean;
  toggleItem: (item: Omit<WishlistItem, 'id' | 'addedAt'>) => boolean;
  getItemCount: () => number;
  setItems: (items: WishlistItem[]) => void;
  setLoading: (loading: boolean) => void;
}

type WishlistStore = WishlistState & WishlistActions;

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      isLoading: false,

      addItem: (item) => {
        const exists = get().items.some((i) => i.productId === item.productId);
        if (exists) return;

        const newItem: WishlistItem = {
          ...item,
          id: `wishlist-${item.productId}-${Date.now()}`,
          addedAt: new Date().toISOString(),
        };

        set({ items: [...get().items, newItem] });
      },

      removeItem: (productId) => {
        set({
          items: get().items.filter((item) => item.productId !== productId),
        });
      },

      clearWishlist: () => {
        set({ items: [] });
      },

      isInWishlist: (productId) => {
        return get().items.some((item) => item.productId === productId);
      },

      toggleItem: (item) => {
        const exists = get().isInWishlist(item.productId);
        if (exists) {
          get().removeItem(item.productId);
          return false;
        } else {
          get().addItem(item);
          return true;
        }
      },

      getItemCount: () => get().items.length,

      setItems: (items) => set({ items }),
      setLoading: (isLoading) => set({ isLoading }),
    }),
    {
      name: 'thrift-wishlist',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }),
    }
  )
);
