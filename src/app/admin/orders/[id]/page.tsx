import { notFound } from 'next/navigation';
import { createAdminClient } from '@/lib/supabase/admin';
import { PageHeader } from '@/components/shared/page-header';
import { OrderActions } from '@/components/features/admin/order-actions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, formatDate } from '@/utils/format';

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = createAdminClient();

  const { data: order } = await supabase
    .from('orders')
    .select(
      `
      *,
      user:profiles(*),
      items:order_items(*)
    `
    )
    .eq('id', id)
    .single();

  if (!order) notFound();

  const shippingAddress = order.shipping_address as any;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader
          title={`Order #${order.order_number}`}
          description={`Placed on ${formatDate(order.created_at)}`}
        />
        <OrderActions orderId={order.id} currentStatus={order.status} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.items.map((item: any) => (
                  <div key={item.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{item.product_snapshot.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Size: {item.product_snapshot.size} • Qty: {item.quantity}
                      </p>
                    </div>
                    <p className="font-medium">{formatCurrency(item.total_price)}</p>
                  </div>
                ))}
                <Separator />
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>{formatCurrency(order.total)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Customer</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="font-medium">{order.user?.full_name}</p>
                <p className="text-sm text-muted-foreground">{order.user?.email}</p>
              </div>
              <Separator />
              <div>
                <p className="mb-1 font-medium">Shipping Address</p>
                <div className="text-sm text-muted-foreground">
                  <p>{shippingAddress.address_line1}</p>
                  <p>
                    {shippingAddress.city}, {shippingAddress.postal_code}
                  </p>
                  <p>{shippingAddress.country}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span>Status</span>
                <Badge variant={order.payment_status === 'paid' ? 'success' : 'secondary'}>
                  {order.payment_status}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span>Method</span>
                <span className="capitalize">{order.payment_method}</span>
              </div>
              {order.payment_id && (
                <div className="flex justify-between">
                  <span>ID</span>
                  <span className="font-mono text-xs">{order.payment_id}</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
