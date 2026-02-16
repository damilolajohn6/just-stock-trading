import { Suspense } from "react";
import { DollarSign, ShoppingCart, Package, Users } from "lucide-react";
import { getAdminDashboardData } from "@/actions/analytics";
import { StatsCard } from "@/components/features/admin/stats-card";
import { RevenueChart } from "@/components/features/admin/charts/revenue-chart";
import { CategoryChart } from "@/components/features/admin/charts/category-chart";
import { RecentOrdersTable } from "@/components/features/admin/recent-orders-table";
import { LowStockAlert } from "@/components/features/admin/low-stock-alert";
import { formatCurrency } from "@/utils/format";
import { Skeleton } from "@/components/ui/skeleton";

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-32" />
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Skeleton className="col-span-4 h-[400px]" />
        <Skeleton className="col-span-3 h-[400px]" />
      </div>
    </div>
  );
}

async function DashboardContent() {
  const data = await getAdminDashboardData();
  const { stats, revenueChart, categoryChart, recentOrders, lowStockItems } =
    data;

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Revenue"
          value={formatCurrency(stats.total_revenue)}
          change={stats.revenue_change}
          icon={DollarSign}
        />
        <StatsCard
          title="Total Orders"
          value={stats.total_orders.toString()}
          change={stats.orders_change}
          icon={ShoppingCart}
        />
        <StatsCard
          title="Active Customers"
          value={stats.active_customers.toString()}
          change={stats.customers_change}
          icon={Users}
        />
        <StatsCard
          title="Avg. Order Value"
          value={formatCurrency(stats.avg_order_value)}
          change={0} // To implement logic for AOV change
          icon={Package}
        />
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <RevenueChart data={revenueChart} />
        <CategoryChart
          data={categoryChart.map((item) => ({
            name: item.category,
            value: item.sales,
          }))}
        />
      </div>

      {/* Lists */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <RecentOrdersTable orders={recentOrders} />
        <LowStockAlert items={lowStockItems} />
      </div>
    </div>
  );
}

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <div className="flex items-center space-x-2">
          {/* Add Date Range Picker Here if needed */}
        </div>
      </div>
      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardContent />
      </Suspense>
    </div>
  );
}
