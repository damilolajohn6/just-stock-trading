import Link from 'next/link';
import { AlertTriangle, ChevronRight } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface LowStockProps {
  items: any[];
}

export function LowStockAlert({ items }: LowStockProps) {
  return (
    <Card className="col-span-3 lg:col-span-3">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-amber-500" />
          Low Stock Alerts
        </CardTitle>
        <CardDescription>
          Products with 5 or fewer items remaining
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {items.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              Inventory levels are healthy.
            </p>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
              >
                <div className="space-y-1">
                  <p className="text-sm font-medium line-clamp-1">
                    {item.product.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Variant: {[item.size, item.color].filter(Boolean).join(' / ')}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <Badge variant="outline" className="text-amber-600 border-amber-200 bg-amber-50">
                    {item.stock_quantity} left
                  </Badge>
                  <Link
                    href={`/admin/products/${item.product.id}`}
                    className="text-muted-foreground hover:text-primary"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
