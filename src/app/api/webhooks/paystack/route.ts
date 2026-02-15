import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import crypto from 'crypto';

export async function POST(req: Request) {
  const body = await req.text();
  const hash = crypto
    .createHmac('sha512', process.env.PAYSTACK_SECRET_KEY!)
    .update(body)
    .digest('hex');

  const signature = req.headers.get('x-paystack-signature');

  if (hash !== signature) {
    return new NextResponse('Invalid signature', { status: 400 });
  }

  const event = JSON.parse(body);
  const supabase = createAdminClient();

  if (event.event === 'charge.success') {
    const { metadata, reference, id } = event.data;
    const orderId = metadata?.orderId;

    if (orderId) {
      // Update order status
      await supabase
        .from('orders')
        .update({
          status: 'confirmed',
          payment_status: 'paid',
          payment_id: String(id), // Paystack ID
          payment_intent_id: reference,
          paid_at: new Date().toISOString(),
        })
        .eq('id', orderId);
        
      console.log(`Order ${orderId} marked as paid (Paystack)`);
    }
  }

  return new NextResponse(null, { status: 200 });
}