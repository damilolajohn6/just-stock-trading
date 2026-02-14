import type { Tables, Json } from './database';
import type { ProductWithDetails } from './product';

export type Order = Tables<'orders'>;
export type OrderItem = Tables<'order_items'>;

export type OrderStatus = Order['status'];
export type PaymentStatus = Order['payment_status'];

// Extended order with relations
export interface OrderWithDetails extends Order {
  items: OrderItemWithProduct[];
  user?: {
    id: string;
    email: string;
    full_name: string | null;
  };
}

export interface OrderItemWithProduct extends OrderItem {
  product: ProductWithDetails;
}

// Address type (used in shipping_address and billing_address)
export interface OrderAddress {
  first_name: string;
  last_name: string;
  company?: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  phone?: string;
}

// Order timeline event
export interface OrderTimelineEvent {
  status: OrderStatus;
  timestamp: string;
  note?: string;
}

// Order status labels and colors
export const ORDER_STATUS_CONFIG: Record<OrderStatus, { label: string; color: string }> = {
  pending: { label: 'Pending', color: 'yellow' },
  confirmed: { label: 'Confirmed', color: 'blue' },
  processing: { label: 'Processing', color: 'indigo' },
  shipped: { label: 'Shipped', color: 'purple' },
  delivered: { label: 'Delivered', color: 'green' },
  cancelled: { label: 'Cancelled', color: 'red' },
  refunded: { label: 'Refunded', color: 'gray' },
};

export const PAYMENT_STATUS_CONFIG: Record<PaymentStatus, { label: string; color: string }> = {
  pending: { label: 'Pending', color: 'yellow' },
  paid: { label: 'Paid', color: 'green' },
  failed: { label: 'Failed', color: 'red' },
  refunded: { label: 'Refunded', color: 'gray' },
};

// Checkout form data
export interface CheckoutFormData {
  email: string;
  shippingAddress: OrderAddress;
  billingAddress?: OrderAddress;
  useSameAddress: boolean;
  shippingMethod: string;
  paymentMethod: 'stripe' | 'paystack';
  notes?: string;
  couponCode?: string;
}

// Order summary for checkout
export interface OrderSummary {
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;
  currency: string;
}
