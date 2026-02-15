import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, MapPin, Truck, Calendar, ShoppingBag } from 'lucide-react';
import { getOrder } from '@/actions/orders';
import { getUser } from '@/lib/supabase/server';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { OrderStatusBadge } from '@/components/features/orders/order-status-badge';
import { formatCurrency, formatDate } from '@/utils/format';

interface OrderDetailPageProps {
  params: { id: string };
}

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  const user = await getUser();

  if (!user) {
    redirect('/login');
  }

  const order = await getOrder(params.id);

  if (!order) {
    notFound();
  }

  const shippingAddress = order.shipping_address as any;
  const billingAddress = (order.billing_address as any) || shippingAddress;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <Link href="/account/orders" className="hover:text-primary">
              Orders
            </Link>
            <span>/</span>
            <span>#{order.order_number}</span>
          </div>
          <h1 className="text-2xl font-bold flex items-center gap-3">
            Order #{order.order_number}
            <OrderStatusBadge status={order.status} />
          </h1>
          <p className="text-muted-foreground">
            Placed on {formatDate(order.created_at, { dateStyle: 'long', timeStyle: 'short' })}
          </p>
        </div>
        
        {/* Payment Status */}
        <div className="flex flex-col items-end">
          <p className="text-sm font-medium mb-1">Payment Status</p>
          <Badge 
            variant={
              order.payment_status === 'paid' ? 'success' : 
              order.payment_status === 'failed' ? 'destructive' : 'warning'
            }
          >
            {order.payment_status.toUpperCase()}
          </Badge>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Items */}
          <Card>
            <CardHeader>
              <CardTitle>Items ({order.items.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {order.items.map((item: any) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="relative h-20 w-20 rounded-md overflow-hidden bg-muted flex-shrink-0">
                      {item.product_snapshot?.image ? (
                        <Image
                          src={item.product_snapshot.image}
                          alt={item.product_snapshot.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <ShoppingBag className="h-8 w-8 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between gap-2">
                        <h4 className="font-medium line-clamp-2">
                          {item.product_snapshot.name}
                        </h4>
                        <p className="font-medium">
                          {formatCurrency(item.total_price)}
                        </p>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Qty: {item.quantity} × {formatCurrency(item.unit_price)}
                      </p>
                      {(item.product_snapshot.size || item.product_snapshot.color) && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {[item.product_snapshot.size, item.product_snapshot.color]
                            .filter(Boolean)
                            .join(' / ')}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Timeline - Placeholder for now */}
          <Card>
            <CardHeader>
              <CardTitle>Order Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative pl-6 border-l-2 border-muted space-y-8">
                <div className="relative">
                  <div className="absolute -left-[31px] top-0 h-4 w-4 rounded-full border-2 border-primary bg-background" />
                  <p className="font-medium text-sm">Order Placed</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(order.created_at)}
                  </p>
                </div>
                
                {order.status === 'confirmed' && (
                  <div className="relative">
                    <div className="absolute -left-[31px] top-0 h-4 w-4 rounded-full border-2 border-primary bg-primary" />
                    <p className="font-medium text-sm">Confirmed</p>
                    <p className="text-xs text-muted-foreground">
                      We&apos;ve received your order
                    </p>
                  </div>
                )}

                {order.status === 'shipped' && (
                  <div className="relative">
                    <div className="absolute -left-[31px] top-0 h-4 w-4 rounded-full border-2 border-primary bg-primary" />
                    <p className="font-medium text-sm">Shipped</p>
                    <p className="text-xs text-muted-foreground">
                      Your order is on the way
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Summary */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatCurrency(order.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>{formatCurrency(order.shipping_cost)}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-{formatCurrency(order.discount)}</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between font-bold text-base">
                  <span>Total</span>
                  <span>{formatCurrency(order.total)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Shipping Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div>
                <h4 className="font-medium mb-1 flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  Address
                </h4>
                <div className="text-muted-foreground pl-6">
                  <p>
                    {shippingAddress.first_name} {shippingAddress.last_name}
                  </p>
                  <p>{shippingAddress.address_line1}</p>
                  {shippingAddress.address_line2 && <p>{shippingAddress.address_line2}</p>}
                  <p>
                    {shippingAddress.city}, {shippingAddress.postal_code}
                  </p>
                  <p>{shippingAddress.country}</p>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-1 flex items-center gap-2">
                  <Truck className="h-4 w-4 text-muted-foreground" />
                  Method
                </h4>
                <p className="text-muted-foreground pl-6 capitalize">
                  {order.shipping_method?.replace('_', ' ') || 'Standard'}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
