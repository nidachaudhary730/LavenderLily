import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, ShoppingCart, DollarSign, TrendingUp, Package, Clock } from 'lucide-react';

interface AnalyticsData {
  totalUsers: number;
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  pendingOrders: number;
  completedOrders: number;
  totalProducts: number;
}

const Analytics = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    averageOrderValue: 0,
    pendingOrders: 0,
    completedOrders: 0,
    totalProducts: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);

      // Fetch total users
      const { count: userCount } = await supabase
        .from('user_profiles')
        .select('*', { count: 'exact', head: true });

      // Fetch total orders
      const { count: orderCount } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true });

      // Fetch orders with revenue data
      const { data: orders } = await supabase
        .from('orders')
        .select('total_amount, status')
        .order('created_at', { ascending: false });

      // Fetch total products
      const { count: productCount } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true });

      // Calculate metrics
      const totalRevenue = orders?.reduce((sum, order) => {
        if (order.status !== 'cancelled') {
          return sum + parseFloat(order.total_amount?.toString() || '0');
        }
        return sum;
      }, 0) || 0;

      const completedOrders = orders?.filter(o => o.status === 'delivered').length || 0;
      const pendingOrders = orders?.filter(o =>
        ['pending', 'processing'].includes(o.status)
      ).length || 0;

      const averageOrderValue = orderCount && orderCount > 0
        ? totalRevenue / orderCount
        : 0;

      setAnalytics({
        totalUsers: userCount || 0,
        totalOrders: orderCount || 0,
        totalRevenue,
        averageOrderValue,
        pendingOrders,
        completedOrders,
        totalProducts: productCount || 0,
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-pulse text-muted-foreground">Loading analytics...</div>
      </div>
    );
  }
  /*
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-AE', {
      style: 'currency',
      currency: 'AED',
    }).format(amount);
  };
  */
  // Simplified for now
  const formatCurrency = (amount: number) => `AED ${amount.toFixed(2)}`;

  const stats = [
    {
      title: 'Total Users',
      value: analytics.totalUsers.toLocaleString(),
      icon: Users,
      description: 'Registered users',
    },
    {
      title: 'Total Orders',
      value: analytics.totalOrders.toLocaleString(),
      icon: ShoppingCart,
      description: 'All time orders',
    },
    {
      title: 'Total Revenue',
      value: formatCurrency(analytics.totalRevenue),
      icon: DollarSign,
      description: 'Total sales revenue',
    },
    {
      title: 'Average Order Value',
      value: formatCurrency(analytics.averageOrderValue),
      icon: TrendingUp,
      description: 'Per order average',
    },
    {
      title: 'Pending Orders',
      value: analytics.pendingOrders.toLocaleString(),
      icon: Clock,
      description: 'Awaiting processing',
    },
    {
      title: 'Completed Orders',
      value: analytics.completedOrders.toLocaleString(),
      icon: Package,
      description: 'Successfully delivered',
    },
    {
      title: 'Total Products',
      value: analytics.totalProducts.toLocaleString(),
      icon: Package,
      description: 'Active products',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-light text-foreground mb-2">Analytics Overview</h2>
        <p className="text-sm text-muted-foreground">Key metrics and statistics for your store</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="border-border rounded-none">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-light text-foreground">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-light text-foreground mb-1">
                  {stat.value}
                </div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default Analytics;
