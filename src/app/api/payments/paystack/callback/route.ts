import { NextResponse } from 'next/server';
import { redirect } from 'next/navigation';
import { paystack } from '@/lib/paystack/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const reference = searchParams.get('reference');
  const trxref = searchParams.get('trxref'); // Same as reference usually

  if (!reference) {
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/`);
  }

  try {
    // Verify transaction
    const verification = await paystack.transaction.verify(reference);

    if (verification.status && verification.data.status === 'success') {
      const orderId = verification.data.metadata?.orderId;
      const orderNumber = verification.data.metadata?.custom_fields?.find(
        (f: any) => f.variable_name === 'order_number'
      )?.value;

      if (orderId) {
        const supabase = createAdminClient();
        
        // Update order status (double check in case webhook failed)
        await supabase
          .from('orders')
          .update({
            status: 'confirmed',
            payment_status: 'paid',
            payment_id: String(verification.data.id),
            paid_at: new Date().toISOString(),
          })
          .eq('id', orderId);

        // Redirect to success page
        return NextResponse.redirect(
          `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success?order_id=${orderId}`
        );
      }
    }
    
    // If failed or cancelled
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/checkout/confirmation?status=failed`
    );
    
  } catch (error) {
    console.error('Paystack callback error:', error);
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/`);
  }
}
