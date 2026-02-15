import Link from 'next/link';
import { createAdminClient } from '@/lib/supabase/admin';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/shared/page-header';
import { formatCurrency, formatDate } from '@/utils/format';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const supabase = createAdminClient();
  const { status: statusParam } = await searchParams;
  const status = statusParam || 'all';

  let query = supabase
    .from('orders')
    .select('*, user:profiles(email, full_name)')
    .order('created_at', { ascending: false });

  if (status !== 'all') {
    query = query.eq('status', status as any);
  }

  const { data: orders } = await query;

  return (
    <div className="space-y-6">
      <PageHeader title="Orders" description="Manage customer orders" />

      <Tabs defaultValue={status} className="w-full">
        <TabsList>
          <TabsTrigger value="all" asChild>
            <Link href="/admin/orders">All</Link>
          </TabsTrigger>
          <TabsTrigger value="pending" asChild>
            <Link href="/admin/orders?status=pending">Pending</Link>
          </TabsTrigger>
          <TabsTrigger value="processing" asChild>
            <Link href="/admin/orders?status=processing">Processing</Link>
          </TabsTrigger>
          <TabsTrigger value="shipped" asChild>
            <Link href="/admin/orders?status=shipped">Shipped</Link>
          </TabsTrigger>
          <TabsTrigger value="completed" asChild>
            <Link href="/admin/orders?status=delivered">Delivered</Link>
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order #</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders?.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.order_number}</TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium">{order.user?.full_name || 'Guest'}</span>
                    <span className="text-xs text-muted-foreground">{order.user?.email}</span>
                  </div>
                </TableCell>
                <TableCell>{formatDate(order.created_at)}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="capitalize">
                    {order.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={order.payment_status === 'paid' ? 'success' : 'secondary'}
                    className="capitalize"
                  >
                    {order.payment_status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">{formatCurrency(order.total)}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/admin/orders/${order.id}`}>View</Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {orders?.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No orders found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
