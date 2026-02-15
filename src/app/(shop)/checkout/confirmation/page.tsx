import { Suspense } from "react";
import Link from "next/link";
import { CheckCircle2, Package, ArrowRight, Mail } from "lucide-react";
import { Container } from "@/components/shared/container";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { getOrderByNumber } from "@/actions/orders";
import { formatCurrency, formatDate } from "@/utils/format";
import { PaymentButton } from "@/components/checkout/payment-button";

interface ConfirmationPageProps {
  searchParams: Promise<{ order?: string }>;
}

async function OrderDetails({ orderNumber }: { orderNumber: string }) {
  const order = await getOrderByNumber(orderNumber);

  if (!order) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Order not found</p>
        <Button asChild className="mt-4">
          <Link href="/products">Continue Shopping</Link>
        </Button>
      </div>
    );
  }

  const shippingAddress = order.shipping_address as any;

  return (
    <div className="space-y-6">
      {/* Order Info */}
      <Card>
        <CardContent className="p-6">
          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-muted-foreground">Order Number</p>
              <p className="font-semibold">{order.order_number}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Date</p>
              <p className="font-semibold">{formatDate(order.created_at)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Payment Status</p>
              <p className="font-semibold capitalize">{order.payment_status}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total</p>
              <p className="font-semibold">{formatCurrency(order.total)}</p>
            </div>
          </div>

          {order.payment_status !== "paid" && (
            <div className="mt-6 pt-6 border-t">
              <h3 className="font-semibold mb-2">Complete Your Payment</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Your order is pending payment. Please complete payment to secure
                your items.
              </p>
              {/* @ts-ignore - Supabase type mismatch with nice component type */}
              <PaymentButton order={order} />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Shipping Address */}
      <Card>
        <CardContent className="p-6">
          <h3 className="font-semibold mb-3">Shipping Address</h3>
          <p>
            {shippingAddress.first_name} {shippingAddress.last_name}
          </p>
          <p>{shippingAddress.address_line1}</p>
          {shippingAddress.address_line2 && (
            <p>{shippingAddress.address_line2}</p>
          )}
          <p>
            {shippingAddress.city}, {shippingAddress.state}{" "}
            {shippingAddress.postal_code}
          </p>
        </CardContent>
      </Card>

      {/* Order Items */}
      <Card>
        <CardContent className="p-6">
          <h3 className="font-semibold mb-4">Order Items</h3>
          <div className="space-y-4">
            {order.items.map((item: any) => (
              <div key={item.id} className="flex justify-between">
                <div>
                  <p className="font-medium">{item.product_snapshot.name}</p>
                  <p className="text-sm text-muted-foreground">
                    Qty: {item.quantity}
                    {item.product_snapshot.size &&
                      ` • ${item.product_snapshot.size}`}
                  </p>
                </div>
                <p className="font-medium">
                  {formatCurrency(item.total_price)}
                </p>
              </div>
            ))}
          </div>
          <Separator className="my-4" />
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Subtotal</span>
              <span>{formatCurrency(order.subtotal)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-sm text-green-600">
                <span>Discount</span>
                <span>-{formatCurrency(order.discount)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span>Shipping</span>
              <span>
                {order.shipping_cost === 0
                  ? "Free"
                  : formatCurrency(order.shipping_cost)}
              </span>
            </div>
            <Separator />
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span>{formatCurrency(order.total)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function OrderDetailsSkeleton() {
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <div className="grid sm:grid-cols-2 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i}>
                <Skeleton className="h-4 w-20 mb-2" />
                <Skeleton className="h-5 w-32" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      <Skeleton className="h-32" />
      <Skeleton className="h-48" />
    </div>
  );
}

export default async function ConfirmationPage({
  searchParams,
}: ConfirmationPageProps) {
  const { order } = await searchParams;

  return (
    <Container className="py-12">
      <div className="max-w-2xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-4">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Order Confirmed!</h1>
          <p className="text-muted-foreground">
            Thank you for your order. We&apos;ve sent a confirmation to your
            email.
          </p>
        </div>

        {/* What's Next */}
        <Card className="mb-8 bg-primary/5 border-primary/20">
          <CardContent className="p-6">
            <h2 className="font-semibold mb-4">What happens next?</h2>
            <div className="space-y-4">
              <div className="flex gap-3">
                <Mail className="h-5 w-5 text-primary flex-shrink-0" />
                <div>
                  <p className="font-medium">Confirmation Email</p>
                  <p className="text-sm text-muted-foreground">
                    You&apos;ll receive an order confirmation email shortly.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <Package className="h-5 w-5 text-primary flex-shrink-0" />
                <div>
                  <p className="font-medium">Shipping Updates</p>
                  <p className="text-sm text-muted-foreground">
                    We&apos;ll notify you when your order ships with tracking
                    info.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Order Details */}
        {order ? (
          <Suspense fallback={<OrderDetailsSkeleton />}>
            <OrderDetails orderNumber={order} />
          </Suspense>
        ) : (
          <p className="text-center text-muted-foreground">
            No order information available.
          </p>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <Button asChild variant="outline" className="flex-1">
            <Link href="/account/orders">View Order History</Link>
          </Button>
          <Button asChild className="flex-1">
            <Link href="/products">
              Continue Shopping
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </Container>
  );
}
