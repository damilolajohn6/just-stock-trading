import { createAdminClient } from '@/lib/supabase/admin';
import { PageHeader } from '@/components/shared/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatCurrency, formatDate } from '@/utils/format';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

export default async function AnalyticsPage() {
  const supabase = createAdminClient();
  
  // 1. Get detailed daily stats
  const { data: dailyStats } = await supabase.rpc('get_daily_revenue', {
    start_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    end_date: new Date().toISOString()
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader title="Analytics Report" description="Detailed performance metrics (Last 30 Days)" />
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export CSV
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Sales Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Orders</TableHead>
                  <TableHead className="text-right">Revenue</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dailyStats?.map((stat: any) => (
                  <TableRow key={stat.date}>
                    <TableCell>{formatDate(stat.date)}</TableCell>
                    <TableCell className="text-right">{stat.order_count}</TableCell>
                    <TableCell className="text-right font-medium">{formatCurrency(stat.revenue)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        
        {/* Placeholder for Traffic/Conversion or other future metrics */}
        <Card>
          <CardHeader>
            <CardTitle>Top Performance</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center h-64 text-muted-foreground">
            More metrics coming soon...
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
