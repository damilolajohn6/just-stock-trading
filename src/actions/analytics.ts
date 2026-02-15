'use server';

import { createClient } from '@/lib/supabase/server';
import { isUserAdmin } from '@/lib/supabase/admin';
import { formatDate } from '@/utils/format';

export async function getAdminDashboardData() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || !(await isUserAdmin(user.id))) {
    throw new Error('Unauthorized');
  }

  const now = new Date();
  const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30)).toISOString();
  const today = new Date().toISOString();

  // 1. Fetch Stats Overview (RPC)
  const { data: statsData, error: statsError } = await supabase
    .rpc('get_dashboard_stats')
    .single();

  if (statsError) console.error('Stats error:', statsError);

  // 2. Fetch Daily Revenue (RPC)
  const { data: revenueData, error: revError } = await supabase
    .rpc('get_daily_revenue', {
      start_date: thirtyDaysAgo,
      end_date: today
    });

  if (revError) console.error('Revenue error:', revError);

  // 3. Fetch Category Sales (RPC)
  const { data: categoryData, error: catError } = await supabase
    .rpc('get_category_sales', {
      start_date: thirtyDaysAgo,
      end_date: today
    });

  if (catError) console.error('Category error:', catError);

  // 4. Fetch Recent Orders (Standard Select)
  const { data: recentOrders } = await supabase
    .from('orders')
    .select('id, order_number, total, status, payment_status, created_at, user:profiles(email, full_name)')
    .order('created_at', { ascending: false })
    .limit(5);

  // 5. Fetch Low Stock Items
  const { data: lowStockItems } = await supabase
    .from('product_variants')
    .select('id, size, color, stock_quantity, product:products(name, slug)')
    .lt('stock_quantity', 5)
    .limit(5);

  return {
    stats: statsData || {
      total_revenue: 0,
      revenue_change: 0,
      total_orders: 0,
      orders_change: 0,
      avg_order_value: 0,
      active_customers: 0,
      customers_change: 0
    },
    revenueChart: revenueData || [],
    categoryChart: categoryData || [],
    recentOrders: recentOrders || [],
    lowStockItems: lowStockItems || [],
  };
}
