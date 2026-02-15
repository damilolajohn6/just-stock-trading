import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe/server";
import { createAdminClient } from "@/lib/supabase/admin";
import Stripe from "stripe";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = (await headers()).get("Stripe-Signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (error: any) {
    console.error(`Webhook Error: ${error.message}`);
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
  }

  const supabase = createAdminClient();

  // Handle the event
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const orderId = session.metadata?.orderId;

      if (orderId) {
        // Update order status
        await supabase
          .from("orders")
          .update({
            status: "confirmed",
            payment_status: "paid",
            payment_id: session.payment_intent as string,
            paid_at: new Date().toISOString(),
          })
          .eq("id", orderId);

        console.log(`Order ${orderId} marked as paid (Stripe)`);
      }
      break;
    }

    case "payment_intent.payment_failed": {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      // You might want to notify the user or log this
      console.log(`Payment failed: ${paymentIntent.id}`);
      break;
    }
  }

  return new NextResponse(null, { status: 200 });
}
