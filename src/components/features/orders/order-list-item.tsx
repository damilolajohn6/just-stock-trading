import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { OrderStatusBadge } from './order-status-badge';
import { formatCurrency, formatDate } from '@/utils/format';
import type { OrderWithDetails } from '@/types/order';

interface OrderListItemProps {
  order: any;
}

export function OrderListItem({ order }: OrderListItemProps) {
  const firstItem = order.items?.[0];
  const otherItemsCount = (order.items?.length || 0) - 1;

  return (
    <div className="border rounded-lg bg-card p-4 sm:p-6 transition-all hover:shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pb-4 border-b">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-lg">
              {order.order_number}
            </span>
            <OrderStatusBadge status={order.status} />
          </div>
          <p className="text-sm text-muted-foreground">
            Placed on {formatDate(order.created_at)}
          </p>
        </div>
        <div className="text-left sm:text-right">
          <p className="font-semibold">{formatCurrency(order.total)}</p>
          <p className="text-sm text-muted-foreground">
            {order.items?.length || 0} items
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Preview Image */}
        <div className="relative h-16 w-16 rounded-md overflow-hidden bg-muted flex-shrink-0">
          {firstItem?.product_snapshot?.image ? (
            <Image
              src={firstItem.product_snapshot.image}
              alt={firstItem.product_snapshot.name || 'Product'}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <Package className="h-6 w-6 text-muted-foreground" />
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <p className="font-medium truncate">
            {firstItem?.product_snapshot?.name || 'Unknown Item'}
          </p>
          {otherItemsCount > 0 && (
            <p className="text-sm text-muted-foreground">
              + {otherItemsCount} other {otherItemsCount === 1 ? 'item' : 'items'}
            </p>
          )}
        </div>

        <Button variant="outline" size="sm" asChild>
          <Link href={`/account/orders/${order.id}`}>
            Details
            <ChevronRight className="h-4 w-4 ml-1" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
