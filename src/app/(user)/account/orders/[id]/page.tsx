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
  params: Promise<{ id: string }>;
}

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  const { id } = await params;
  const user = await getUser();

  if (!user) {
    redirect('/login');
  }

  const order = await getOrder(id);

  if (!order) {
    notFound();
  }

  const shippingAddress = order.shipping_address as any;
  const billingAddress = (order.billing_address as any) || shippingAddress;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="space-y-1">
          <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/account/orders" className="hover:text-primary">
              Orders
            </Link>
            <span>/</span>
            <span>#{order.order_number}</span>
          </div>
          <h1 className="flex items-center gap-3 text-2xl font-bold">
            Order #{order.order_number}
            <OrderStatusBadge status={order.status} />
          </h1>
          <p className="text-muted-foreground">
            Placed on {formatDate(order.created_at, { dateStyle: 'long', timeStyle: 'short' })}
          </p>
        </div>

        {/* Payment Status */}
        <div className="flex flex-col items-end">
          <p className="mb-1 text-sm font-medium">Payment Status</p>
          <Badge
            variant={
              order.payment_status === 'paid'
                ? 'success'
                : order.payment_status === 'failed'
                  ? 'destructive'
                  : 'warning'
            }
          >
            {order.payment_status.toUpperCase()}
          </Badge>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {/* Items */}
          <Card>
            <CardHeader>
              <CardTitle>Items ({order.items.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {order.items.map((item: any) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md bg-muted">
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
                    <div className="min-w-0 flex-1">
                      <div className="flex justify-between gap-2">
                        <h4 className="line-clamp-2 font-medium">{item.product_snapshot.name}</h4>
                        <p className="font-medium">{formatCurrency(item.total_price)}</p>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Qty: {item.quantity} × {formatCurrency(item.unit_price)}
                      </p>
                      {(item.product_snapshot.size || item.product_snapshot.color) && (
                        <p className="mt-1 text-xs text-muted-foreground">
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
              <div className="relative space-y-8 border-l-2 border-muted pl-6">
                <div className="relative">
                  <div className="absolute -left-[31px] top-0 h-4 w-4 rounded-full border-2 border-primary bg-background" />
                  <p className="text-sm font-medium">Order Placed</p>
                  <p className="text-xs text-muted-foreground">{formatDate(order.created_at)}</p>
                </div>

                {order.status === 'confirmed' && (
                  <div className="relative">
                    <div className="absolute -left-[31px] top-0 h-4 w-4 rounded-full border-2 border-primary bg-primary" />
                    <p className="text-sm font-medium">Confirmed</p>
                    <p className="text-xs text-muted-foreground">We&apos;ve received your order</p>
                  </div>
                )}

                {order.status === 'shipped' && (
                  <div className="relative">
                    <div className="absolute -left-[31px] top-0 h-4 w-4 rounded-full border-2 border-primary bg-primary" />
                    <p className="text-sm font-medium">Shipped</p>
                    <p className="text-xs text-muted-foreground">Your order is on the way</p>
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
                <div className="flex justify-between text-base font-bold">
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
                <h4 className="mb-1 flex items-center gap-2 font-medium">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  Address
                </h4>
                <div className="pl-6 text-muted-foreground">
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
                <h4 className="mb-1 flex items-center gap-2 font-medium">
                  <Truck className="h-4 w-4 text-muted-foreground" />
                  Method
                </h4>
                <p className="pl-6 capitalize text-muted-foreground">
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
