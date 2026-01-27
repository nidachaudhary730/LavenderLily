import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Eye, RefreshCw } from 'lucide-react';

interface OrderItem {
  id: string;
  product_name: string;
  product_price: number;
  quantity: number;
  size: string | null;
  color: string | null;
  image_url: string | null;
}

interface Order {
  id: string;
  order_number: string;
  status: string;
  total_amount: number;
  subtotal: number;
  shipping_cost: number;
  discount_amount: number;
  customer_email: string;
  customer_first_name: string;
  customer_last_name: string;
  customer_phone: string | null;
  shipping_address: string;
  shipping_city: string;
  shipping_postal_code: string;
  shipping_country: string;
  billing_address: string | null;
  billing_city: string | null;
  billing_postal_code: string | null;
  billing_country: string | null;
  shipping_option: string;
  payment_status: string;
  payment_method: string | null;
  created_at: string;
  updated_at: string;
  items?: OrderItem[];
}

const OrdersManager = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Fetch order items for each order
      if (data) {
        const ordersWithItems = await Promise.all(
          data.map(async (order) => {
            const { data: items } = await supabase
              .from('order_items')
              .select('*')
              .eq('order_id', order.id);

            return { ...order, items: items || [] };
          })
        );

        setOrders(ordersWithItems);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId);

      if (error) throw error;

      // Refresh orders
      fetchOrders();
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'pending':
        return 'default';
      case 'processing':
        return 'secondary';
      case 'shipped':
        return 'outline';
      case 'delivered':
        return 'default';
      case 'cancelled':
        return 'destructive';
      default:
        return 'default';
    }
  };

  const getPaymentStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'paid':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'failed':
        return 'destructive';
      case 'refunded':
        return 'outline';
      default:
        return 'default';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-EU', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-EU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-pulse text-muted-foreground">Loading orders...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-light text-foreground mb-2">Orders Management</h2>
          <p className="text-sm text-muted-foreground">View and manage all customer orders</p>
        </div>
        <div className="flex items-center gap-4">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px] rounded-none">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent className="rounded-none">
              <SelectItem value="all">All Orders</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="shipped">Shipped</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            onClick={fetchOrders}
            className="rounded-none"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {orders.length === 0 ? (
        <Card className="border-border rounded-none">
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No orders found.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id} className="border-border rounded-none">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <CardTitle className="text-lg font-light text-foreground">
                      {order.order_number}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge variant={getStatusBadgeVariant(order.status)} className="rounded-none">
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </Badge>
                      <Badge variant={getPaymentStatusBadgeVariant(order.payment_status)} className="rounded-none">
                        {order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1)}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {order.customer_first_name} {order.customer_last_name} • {order.customer_email}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(order.created_at)}
                    </p>
                  </div>
                  <div className="text-right space-y-2">
                    <div className="text-lg font-light text-foreground">
                      {formatCurrency(order.total_amount)}
                    </div>
                    <div className="flex items-center gap-2">
                      <Select
                        value={order.status}
                        onValueChange={(value) => updateOrderStatus(order.id, value)}
                      >
                        <SelectTrigger className="w-[140px] rounded-none text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="rounded-none">
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="processing">Processing</SelectItem>
                          <SelectItem value="shipped">Shipped</SelectItem>
                          <SelectItem value="delivered">Delivered</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="rounded-none"
                            onClick={() => setSelectedOrder(order)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl rounded-none max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle className="font-light">Order Details - {order.order_number}</DialogTitle>
                          </DialogHeader>
                          {selectedOrder && (
                            <div className="space-y-6">
                              {/* Order Summary */}
                              <div className="space-y-4">
                                <h3 className="text-sm font-medium text-foreground">Order Summary</h3>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                  <div>
                                    <p className="text-muted-foreground">Order Number</p>
                                    <p className="font-medium">{selectedOrder.order_number}</p>
                                  </div>
                                  <div>
                                    <p className="text-muted-foreground">Order Date</p>
                                    <p className="font-medium">{formatDate(selectedOrder.created_at)}</p>
                                  </div>
                                  <div>
                                    <p className="text-muted-foreground">Status</p>
                                    <Badge variant={getStatusBadgeVariant(selectedOrder.status)} className="rounded-none">
                                      {selectedOrder.status}
                                    </Badge>
                                  </div>
                                  <div>
                                    <p className="text-muted-foreground">Payment Status</p>
                                    <Badge variant={getPaymentStatusBadgeVariant(selectedOrder.payment_status)} className="rounded-none">
                                      {selectedOrder.payment_status}
                                    </Badge>
                                  </div>
                                </div>
                              </div>

                              {/* Order Items */}
                              <div className="space-y-4">
                                <h3 className="text-sm font-medium text-foreground">Order Items</h3>
                                <div className="space-y-3">
                                  {selectedOrder.items?.map((item) => (
                                    <div key={item.id} className="flex items-center gap-4 border-b border-border pb-3">
                                      {item.image_url && (
                                        <img
                                          src={item.image_url}
                                          alt={item.product_name}
                                          className="w-16 h-16 object-cover"
                                        />
                                      )}
                                      <div className="flex-1">
                                        <p className="font-medium">{item.product_name}</p>
                                        {item.size && <p className="text-sm text-muted-foreground">Size: {item.size}</p>}
                                        {item.color && <p className="text-sm text-muted-foreground">Color: {item.color}</p>}
                                        <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                                      </div>
                                      <div className="text-right">
                                        <p className="font-medium">{formatCurrency(item.product_price * item.quantity)}</p>
                                        <p className="text-sm text-muted-foreground">{formatCurrency(item.product_price)} each</p>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Customer Information */}
                              <div className="space-y-4">
                                <h3 className="text-sm font-medium text-foreground">Customer Information</h3>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                  <div>
                                    <p className="text-muted-foreground">Name</p>
                                    <p className="font-medium">{selectedOrder.customer_first_name} {selectedOrder.customer_last_name}</p>
                                  </div>
                                  <div>
                                    <p className="text-muted-foreground">Email</p>
                                    <p className="font-medium">{selectedOrder.customer_email}</p>
                                  </div>
                                  {selectedOrder.customer_phone && (
                                    <div>
                                      <p className="text-muted-foreground">Phone</p>
                                      <p className="font-medium">{selectedOrder.customer_phone}</p>
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* Shipping Address */}
                              <div className="space-y-4">
                                <h3 className="text-sm font-medium text-foreground">Shipping Address</h3>
                                <div className="text-sm">
                                  <p className="font-medium">{selectedOrder.shipping_address}</p>
                                  <p className="text-muted-foreground">
                                    {selectedOrder.shipping_city}, {selectedOrder.shipping_postal_code}
                                  </p>
                                  <p className="text-muted-foreground">{selectedOrder.shipping_country}</p>
                                  <p className="text-muted-foreground mt-2">Shipping: {selectedOrder.shipping_option}</p>
                                </div>
                              </div>

                              {/* Billing Address */}
                              {selectedOrder.billing_address && (
                                <div className="space-y-4">
                                  <h3 className="text-sm font-medium text-foreground">Billing Address</h3>
                                  <div className="text-sm">
                                    <p className="font-medium">{selectedOrder.billing_address}</p>
                                    <p className="text-muted-foreground">
                                      {selectedOrder.billing_city}, {selectedOrder.billing_postal_code}
                                    </p>
                                    <p className="text-muted-foreground">{selectedOrder.billing_country}</p>
                                  </div>
                                </div>
                              )}

                              {/* Order Totals */}
                              <div className="space-y-2 border-t border-border pt-4">
                                <div className="flex justify-between text-sm">
                                  <span className="text-muted-foreground">Subtotal</span>
                                  <span className="font-medium">{formatCurrency(selectedOrder.subtotal)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span className="text-muted-foreground">Shipping</span>
                                  <span className="font-medium">{formatCurrency(selectedOrder.shipping_cost)}</span>
                                </div>
                                {selectedOrder.discount_amount > 0 && (
                                  <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Discount</span>
                                    <span className="font-medium text-green-600">-{formatCurrency(selectedOrder.discount_amount)}</span>
                                  </div>
                                )}
                                <div className="flex justify-between text-lg font-medium border-t border-border pt-2">
                                  <span>Total</span>
                                  <span>{formatCurrency(selectedOrder.total_amount)}</span>
                                </div>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">
                  {order.items?.length || 0} item(s) • {order.shipping_city}, {order.shipping_country}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersManager;
