import { redirect } from 'next/navigation';
import { Package } from 'lucide-react';
import { getUserWithProfile } from '@/lib/supabase/server';
import { getUserOrders } from '@/actions/orders';
import { PageHeader } from '@/components/shared/page-header';
import { OrderListItem } from '@/components/features/orders/order-list-item';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default async function OrdersPage() {
  const result = await getUserWithProfile();

  if (!result) {
    redirect('/login');
  }

  const orders = await getUserOrders();

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Orders"
        description="Track and manage your recent orders"
      />

      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center border rounded-lg bg-card">
          <div className="rounded-full bg-muted p-6 mb-4">
            <Package className="h-10 w-10 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No orders yet</h3>
          <p className="text-muted-foreground max-w-sm mb-6">
            You haven&apos;t placed any orders yet. Start shopping to find your new
            favorite pieces.
          </p>
          <Button asChild>
            <Link href="/products">Start Shopping</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <OrderListItem key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
}
