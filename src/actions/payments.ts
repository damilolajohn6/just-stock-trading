"use server";

import { redirect } from "next/navigation";
import { stripe } from "@/lib/stripe/server";
import { paystack } from "@/lib/paystack/server";
import { createClient } from "@/lib/supabase/server";
import { getOrder } from "@/actions/orders";

interface CheckoutSessionResponse {
  success: boolean;
  url?: string;
  error?: string;
}

// Create Stripe Checkout Session
export async function createStripeSession(
  orderId: string,
): Promise<CheckoutSessionResponse> {
  const order = await getOrder(orderId);
  const supabase = await createClient();

  if (!order) {
    return { success: false, error: "Order not found" };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const email = user?.email;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "gbp",
            product_data: {
              name: `Order ${order.order_number}`,
              description: `Payment for order ${order.order_number}`,
            },
            unit_amount: Math.round(order.total * 100), // Convert to pence
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}&order_id=${orderId}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/confirmation?order=${order.order_number}&status=cancelled`,
      metadata: {
        orderId: orderId,
        userId: order.user_id,
      },
      customer_email: email,
    });

    return { success: true, url: session.url! };
  } catch (error: any) {
    console.error("Stripe session error:", error);
    return { success: false, error: error.message };
  }
}

// Create Paystack Transaction
export async function createPaystackTransaction(
  orderId: string,
): Promise<CheckoutSessionResponse> {
  const order = await getOrder(orderId);
  const supabase = await createClient();

  if (!order) {
    return { success: false, error: "Order not found" };
  }

  // Get user email if not in order
  const { data: user } = await supabase.auth.getUser();
  const email = user?.user?.email;

  if (!email) {
    return { success: false, error: "User email required" };
  }

  try {
    // Paystack amount is in kobo (x100)
    // Assuming we might support NGN currency later, but for now GBP
    // Note: Paystack supports GBP for international merchants or NGN

    const response = await paystack.transaction.initialize({
      email,
      amount: Math.round(order.total * 100),
      currency: "GBP", // or NGN if you handle conversion
      callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/payments/paystack/callback`,
      metadata: {
        orderId: orderId,
        custom_fields: [
          {
            display_name: "Order Number",
            variable_name: "order_number",
            value: order.order_number,
          },
        ],
      },
    });

    if (!response.status) {
      return { success: false, error: response.message };
    }

    // Save reference to order for verification
    await supabase
      .from("orders")
      .update({ payment_intent_id: response.data.reference })
      .eq("id", orderId);

    return { success: true, url: response.data.authorization_url };
  } catch (error: any) {
    console.error("Paystack error:", error);
    return { success: false, error: error.message };
  }
}

// Process Payment (Route to correct provider)
export async function processPayment(
  orderId: string,
  provider: "stripe" | "paystack",
) {
  if (provider === "stripe") {
    const result = await createStripeSession(orderId);
    if (result.success && result.url) {
      redirect(result.url);
    }
    return result;
  } else if (provider === "paystack") {
    const result = await createPaystackTransaction(orderId);
    if (result.success && result.url) {
      redirect(result.url);
    }
    return result;
  }

  return { success: false, error: "Invalid payment provider" };
}
