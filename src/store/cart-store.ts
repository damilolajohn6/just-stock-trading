import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface CartItem {
  id: string;
  productId: string;
  variantId: string | null;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;
  quantity: number;
  image: string | null;
  size?: string;
  color?: string;
  maxQuantity: number;
  sku?: string;
}

export interface AppliedCoupon {
  code: string;
  type: 'percentage' | 'fixed' | 'free_shipping';
  value: number;
  discountAmount: number;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  isLoading: boolean;
  coupon: AppliedCoupon | null;
  lastSyncedAt: string | null;
}

interface CartActions {
  // Item management
  addItem: (item: Omit<CartItem, 'id'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  
  // Drawer
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  
  // Coupon
  applyCoupon: (coupon: AppliedCoupon) => void;
  removeCoupon: () => void;
  
  // Computed
  getItemCount: () => number;
  getSubtotal: () => number;
  getDiscount: () => number;
  getShipping: (subtotal?: number) => number;
  getTotal: () => number;
  getItem: (productId: string, variantId: string | null) => CartItem | undefined;
  
  // Sync
  setItems: (items: CartItem[]) => void;
  setLoading: (loading: boolean) => void;
  setLastSynced: (date: string) => void;
  
  // Validation
  validateStock: (productId: string, variantId: string | null, availableStock: number) => void;
}

type CartStore = CartState & CartActions;

const FREE_SHIPPING_THRESHOLD = 50;
const STANDARD_SHIPPING = 4.99;

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      // State
      items: [],
      isOpen: false,
      isLoading: false,
      coupon: null,
      lastSyncedAt: null,

      // Item management
      addItem: (item) => {
        const items = get().items;
        const existingItem = items.find(
          (i) => i.productId === item.productId && i.variantId === item.variantId
        );

        if (existingItem) {
          set({
            items: items.map((i) =>
              i.id === existingItem.id
                ? {
                    ...i,
                    quantity: Math.min(i.quantity + item.quantity, i.maxQuantity),
                  }
                : i
            ),
          });
        } else {
          const id = `${item.productId}-${item.variantId || 'default'}-${Date.now()}`;
          set({ items: [...items, { ...item, id }] });
        }

        set({ isOpen: true });
      },

      removeItem: (id) => {
        set({ items: get().items.filter((item) => item.id !== id) });
      },

      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id);
          return;
        }

        set({
          items: get().items.map((item) =>
            item.id === id
              ? { ...item, quantity: Math.min(quantity, item.maxQuantity) }
              : item
          ),
        });
      },

      clearCart: () => {
        set({ items: [], coupon: null });
      },

      // Drawer
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set({ isOpen: !get().isOpen }),

      // Coupon
      applyCoupon: (coupon) => set({ coupon }),
      removeCoupon: () => set({ coupon: null }),

      // Computed
      getItemCount: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getSubtotal: () => {
        return get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
      },

      getDiscount: () => {
        const { coupon } = get();
        if (!coupon) return 0;
        return coupon.discountAmount;
      },

      getShipping: (subtotalOverride?: number) => {
        const subtotal = subtotalOverride ?? get().getSubtotal();
        const { coupon } = get();
        
        if (coupon?.type === 'free_shipping') return 0;
        if (subtotal >= FREE_SHIPPING_THRESHOLD) return 0;
        return STANDARD_SHIPPING;
      },

      getTotal: () => {
        const subtotal = get().getSubtotal();
        const discount = get().getDiscount();
        const shipping = get().getShipping();
        return Math.max(0, subtotal - discount + shipping);
      },

      getItem: (productId, variantId) => {
        return get().items.find(
          (item) => item.productId === productId && item.variantId === variantId
        );
      },

      // Sync
      setItems: (items) => set({ items }),
      setLoading: (isLoading) => set({ isLoading }),
      setLastSynced: (date) => set({ lastSyncedAt: date }),

      // Validation
      validateStock: (productId, variantId, availableStock) => {
        set({
          items: get().items.map((item) =>
            item.productId === productId && item.variantId === variantId
              ? {
                  ...item,
                  maxQuantity: availableStock,
                  quantity: Math.min(item.quantity, availableStock),
                }
              : item
          ),
        });
      },
    }),
    {
      name: 'thrift-cart',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        items: state.items,
        coupon: state.coupon,
      }),
    }
  )
);
