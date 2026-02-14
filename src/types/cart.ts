import type { ProductWithDetails, ProductVariant } from './product';

export interface CartItem {
  id: string;
  product: ProductWithDetails;
  variant: ProductVariant | null;
  quantity: number;
  added_at: string;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  itemCount: number;
}

export interface CartStore {
  items: CartItem[];
  isLoading: boolean;
  isOpen: boolean;
  
  // Actions
  addItem: (product: ProductWithDetails, variant?: ProductVariant, quantity?: number) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  
  // Computed
  getSubtotal: () => number;
  getItemCount: () => number;
  getCartItem: (productId: string, variantId?: string) => CartItem | undefined;
  
  // Sync
  syncWithServer: (userId: string) => Promise<void>;
  loadFromServer: (userId: string) => Promise<void>;
}

export interface AddToCartPayload {
  productId: string;
  variantId?: string;
  quantity: number;
}
