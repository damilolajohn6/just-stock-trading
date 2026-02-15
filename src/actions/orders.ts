'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import type { CheckoutFormData, AddressFormData } from '@/validators/checkout';
import type { CartItem } from '@/store/cart-store';

export interface CreateOrderData {
  email: string;
  phone?: string;
  shippingAddress: AddressFormData;
  billingAddress?: AddressFormData;
  shippingMethodId: string;
  shippingCost: number;
  paymentMethod: 'stripe' | 'paystack';
  items: CartItem[];
  subtotal: number;
  discount: number;
  couponCode?: string;
  notes?: string;
}

export interface OrderResponse {
  success: boolean;
  orderId?: string;
  orderNumber?: string;
  error?: string;
}

// Create a new order
export async function createOrder(data: CreateOrderData): Promise<OrderResponse> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'Please sign in to complete your order' };
  }

  try {
    // Calculate totals
    const tax = 0; // UK VAT included in prices
    const total = data.subtotal - data.discount + data.shippingCost + tax;

    // Format addresses for storage
    const shippingAddressJson = {
      first_name: data.shippingAddress.firstName,
      last_name: data.shippingAddress.lastName,
      company: data.shippingAddress.company,
      address_line1: data.shippingAddress.addressLine1,
      address_line2: data.shippingAddress.addressLine2,
      city: data.shippingAddress.city,
      state: data.shippingAddress.state,
      postal_code: data.shippingAddress.postalCode,
      country: data.shippingAddress.country,
      phone: data.shippingAddress.phone,
    };

    const billingAddressJson = data.billingAddress
      ? {
          first_name: data.billingAddress.firstName,
          last_name: data.billingAddress.lastName,
          company: data.billingAddress.company,
          address_line1: data.billingAddress.addressLine1,
          address_line2: data.billingAddress.addressLine2,
          city: data.billingAddress.city,
          state: data.billingAddress.state,
          postal_code: data.billingAddress.postalCode,
          country: data.billingAddress.country,
          phone: data.billingAddress.phone,
        }
      : null;

    // Create order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: user.id,
        status: 'pending',
        payment_status: 'pending',
        payment_method: data.paymentMethod,
        subtotal: data.subtotal,
        shipping_cost: data.shippingCost,
        tax,
        discount: data.discount,
        total,
        currency: 'GBP',
        shipping_address: shippingAddressJson,
        billing_address: billingAddressJson,
        shipping_method: data.shippingMethodId,
        notes: data.notes,
        coupon_code: data.couponCode,
        coupon_discount: data.discount,
      })
      .select('id, order_number')
      .single();

    if (orderError || !order) {
      console.error('Error creating order:', orderError);
      return { success: false, error: 'Failed to create order' };
    }

    // Create order items
    const orderItems = data.items.map((item) => ({
      order_id: order.id,
      product_id: item.productId,
      variant_id: item.variantId,
      quantity: item.quantity,
      unit_price: item.price,
      total_price: item.price * item.quantity,
      product_snapshot: {
        name: item.name,
        slug: item.slug,
        price: item.price,
        image: item.image,
        size: item.size,
        color: item.color,
      },
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) {
      console.error('Error creating order items:', itemsError);
      // Rollback order
      await supabase.from('orders').delete().eq('id', order.id);
      return { success: false, error: 'Failed to create order items' };
    }

    // Update inventory (reduce stock)
    const adminClient = createAdminClient();
    for (const item of data.items) {
      if (item.variantId) {
        await adminClient.rpc('update_inventory', {
          p_variant_id: item.variantId,
          p_quantity_change: -item.quantity,
          p_reason: 'Order placed',
          p_reference_type: 'order',
          p_reference_id: order.id,
          p_created_by: user.id,
        });
      }
    }

    // Clear user's cart
    await supabase.from('cart_items').delete().eq('user_id', user.id);

    revalidatePath('/account/orders');

    return {
      success: true,
      orderId: order.id,
      orderNumber: order.order_number,
    };
  } catch (error) {
    console.error('Order creation error:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

// Get order by ID
export async function getOrder(orderId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      items:order_items (
        id,
        quantity,
        unit_price,
        total_price,
        product_snapshot
      )
    `)
    .eq('id', orderId)
    .eq('user_id', user.id)
    .single();

  if (error) {
    console.error('Error fetching order:', error);
    return null;
  }

  return data;
}

// Get order by order number
export async function getOrderByNumber(orderNumber: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      items:order_items (
        id,
        quantity,
        unit_price,
        total_price,
        product_snapshot
      )
    `)
    .eq('order_number', orderNumber)
    .eq('user_id', user.id)
    .single();

  if (error) {
    console.error('Error fetching order:', error);
    return null;
  }

  return data;
}

// Update order payment status
export async function updateOrderPayment(
  orderId: string,
  paymentId: string,
  status: 'paid' | 'failed'
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();

  const updateData: Record<string, any> = {
    payment_id: paymentId,
    payment_status: status,
  };

  if (status === 'paid') {
    updateData.status = 'confirmed';
    updateData.paid_at = new Date().toISOString();
  }

  const { error } = await supabase
    .from('orders')
    .update(updateData)
    .eq('id', orderId);

  if (error) {
    console.error('Error updating order payment:', error);
    return { success: false, error: 'Failed to update order' };
  }

  revalidatePath('/account/orders');
  return { success: true };
}

// Get user's orders
export async function getUserOrders() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return [];
  }

  const { data, error } = await supabase
    .from('orders')
    .select(`
      id,
      order_number,
      status,
      payment_status,
      total,
      created_at,
      items:order_items (
        id,
        product_snapshot
      )
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching orders:', error);
    return [];
  }

  return data;
}
