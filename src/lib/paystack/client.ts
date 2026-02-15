// Paystack doesn't have an official JS client like Stripe
// We'll use the inline popup script or redirect method
export const PAYSTACK_PUBLIC_KEY = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY!;
