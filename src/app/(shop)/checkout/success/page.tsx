import { Suspense } from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { CheckCircle2, ArrowRight, Download } from 'lucide-react';
import { Container } from '@/components/shared/container';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { getOrder } from '@/actions/orders';
import { formatCurrency, formatDate } from '@/utils/format';

interface SuccessPageProps {
  searchParams: { 
    session_id?: string;
    order_id?: string;
  };
}

async function SuccessContent({ orderId }: { orderId: string }) {
  const order = await getOrder(orderId);

  if (!order) {
    return (
      <div className="text-center">
        <p>Order not found</p>
        <Button asChild className="mt-4">
          <Link href="/">Return Home</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 text-green-600 mb-6">
          <CheckCircle2 className="h-10 w-10" />
        </div>
        <h1 className="text-3xl font-bold mb-2">Payment Successful!</h1>
        <p className="text-muted-foreground text-lg">
          Thank you for your purchase. Your order has been confirmed.
        </p>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row justify-between gap-4 mb-6 pb-6 border-b">
            <div>
              <p className="text-sm text-muted-foreground">Order Number</p>
              <p className="font-semibold text-lg">{order.order_number}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Date</p>
              <p className="font-semibold">{formatDate(order.created_at)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total</p>
              <p className="font-semibold text-lg">{formatCurrency(order.total)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Payment Method</p>
              <p className="font-semibold capitalize">{order.payment_method}</p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">Items Ordered</h3>
            {order.items.map((item: any) => (
              <div key={item.id} className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="font-medium">
                    {item.quantity}x {item.product_snapshot.name}
                  </div>
                  {(item.product_snapshot.size || item.product_snapshot.color) && (
                    <div className="text-sm text-muted-foreground">
                      {[item.product_snapshot.size, item.product_snapshot.color]
                        .filter(Boolean)
                        .join(' / ')}
                    </div>
                  )}
                </div>
                <div>{formatCurrency(item.total_price)}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button asChild size="lg" className="flex-1">
          <Link href="/account/orders">
            View Order History
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
        <Button asChild variant="outline" size="lg" className="flex-1">
          <Link href="/products">
            Continue Shopping
          </Link>
        </Button>
      </div>
    </div>
  );
}

export default function SuccessPage({ searchParams }: SuccessPageProps) {
  const orderId = searchParams.order_id;

  // If Stripe session ID is present but no order ID, we could verify session here
  // For simplicity, we passed order_id in success_url

  if (!orderId) {
    redirect('/');
  }

  return (
    <Container className="py-16">
      <Suspense fallback={<div className="text-center">Loading order details...</div>}>
        <SuccessContent orderId={orderId} />
      </Suspense>
    </Container>
  );
}
