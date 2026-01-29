import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Eye, RefreshCw, Truck } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface OrderItem {
  id: string;
  product_name: string;
  product_image: string | null;
  quantity: number;
  size: string | null;
  color: string | null;
  unit_price: number;
  total_price: number;
}

interface Order {
  id: string;
  user_id: string;
  order_number: string;
  status: string;
  total_amount: number;
  subtotal: number;
  shipping_cost: number;
  tax: number;
  shipping_address: any;
  billing_address: any;
  payment_method: string | null;
  payment_status: string | null;
  tracking_number: string | null;
  estimated_delivery: string | null;
  delivered_at: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  items?: OrderItem[];
  user_profile?: {
    email: string;
    full_name: string | null;
  };
}

const OrdersManager = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [estimatedDelivery, setEstimatedDelivery] = useState('');

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

      // Fetch order items and user profiles for each order
      if (data) {
        const ordersWithDetails = await Promise.all(
          data.map(async (order) => {
            const [itemsResult, profileResult] = await Promise.all([
              supabase
                .from('order_items')
                .select('*')
                .eq('order_id', order.id),
              supabase
                .from('user_profiles')
                .select('email, full_name')
                .eq('id', order.user_id)
                .single()
            ]);

            return {
              ...order,
              items: itemsResult.data || [],
              user_profile: profileResult.data || undefined,
            };
          })
        );

        setOrders(ordersWithDetails);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const updateData: any = { status: newStatus };
      
      if (newStatus === 'delivered') {
        updateData.delivered_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from('orders')
        .update(updateData)
        .eq('id', orderId);

      if (error) throw error;

      toast({ title: 'Success', description: 'Order status updated' });
      fetchOrders();
    } catch (error) {
      console.error('Error updating order status:', error);
      toast({ title: 'Error', description: 'Failed to update status', variant: 'destructive' });
    }
  };

  const updateTrackingInfo = async (orderId: string) => {
    try {
      const updateData: any = {};
      
      if (trackingNumber) {
        updateData.tracking_number = trackingNumber;
      }
      if (estimatedDelivery) {
        updateData.estimated_delivery = estimatedDelivery;
      }

      if (Object.keys(updateData).length === 0) {
        toast({ title: 'Error', description: 'Please provide tracking information', variant: 'destructive' });
        return;
      }

      const { error } = await supabase
        .from('orders')
        .update(updateData)
        .eq('id', orderId);

      if (error) throw error;

      toast({ title: 'Success', description: 'Tracking information updated' });
      setTrackingNumber('');
      setEstimatedDelivery('');
      fetchOrders();
    } catch (error) {
      console.error('Error updating tracking:', error);
      toast({ title: 'Error', description: 'Failed to update tracking', variant: 'destructive' });
    }
  };

  const getStatusBadgeVariant = (status: string): "default" | "secondary" | "outline" | "destructive" => {
    switch (status) {
      case 'pending':
        return 'secondary';
      case 'processing':
        return 'default';
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
                      {order.payment_status && (
                        <Badge variant="outline" className="rounded-none">
                          Payment: {order.payment_status}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {order.user_profile?.full_name || 'Unknown'} • {order.user_profile?.email || 'No email'}
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
                                    <p className="text-muted-foreground">Customer</p>
                                    <p className="font-medium">{selectedOrder.user_profile?.full_name || 'N/A'}</p>
                                    <p className="text-xs text-muted-foreground">{selectedOrder.user_profile?.email}</p>
                                  </div>
                                </div>
                              </div>

                              {/* Order Items */}
                              <div className="space-y-4">
                                <h3 className="text-sm font-medium text-foreground">Order Items</h3>
                                <div className="space-y-3">
                                  {selectedOrder.items?.map((item) => (
                                    <div key={item.id} className="flex items-center gap-4 border-b border-border pb-3">
                                      {item.product_image && (
                                        <img
                                          src={item.product_image}
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
                                        <p className="font-medium">{formatCurrency(item.total_price)}</p>
                                        <p className="text-sm text-muted-foreground">{formatCurrency(item.unit_price)} each</p>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Shipping Address */}
                              {selectedOrder.shipping_address && (
                                <div className="space-y-4">
                                  <h3 className="text-sm font-medium text-foreground">Shipping Address</h3>
                                  <div className="text-sm">
                                    <p className="font-medium">{selectedOrder.shipping_address.address}</p>
                                    <p className="text-muted-foreground">
                                      {selectedOrder.shipping_address.city}, {selectedOrder.shipping_address.postalCode}
                                    </p>
                                    <p className="text-muted-foreground">{selectedOrder.shipping_address.country}</p>
                                  </div>
                                </div>
                              )}

                              {/* Tracking Info */}
                              <div className="space-y-4 border-t border-border pt-4">
                                <h3 className="text-sm font-medium text-foreground flex items-center gap-2">
                                  <Truck className="h-4 w-4" />
                                  Tracking Information
                                </h3>
                                {selectedOrder.tracking_number ? (
                                  <div className="text-sm">
                                    <p>
                                      <span className="text-muted-foreground">Tracking Number: </span>
                                      <span className="font-medium">{selectedOrder.tracking_number}</span>
                                    </p>
                                    {selectedOrder.estimated_delivery && (
                                      <p className="text-muted-foreground mt-1">
                                        Estimated Delivery: {new Date(selectedOrder.estimated_delivery).toLocaleDateString()}
                                      </p>
                                    )}
                                  </div>
                                ) : (
                                  <div className="space-y-3">
                                    <div className="grid grid-cols-2 gap-3">
                                      <div>
                                        <Label className="text-xs">Tracking Number</Label>
                                        <Input
                                          value={trackingNumber}
                                          onChange={(e) => setTrackingNumber(e.target.value)}
                                          placeholder="Enter tracking number"
                                          className="rounded-none mt-1"
                                        />
                                      </div>
                                      <div>
                                        <Label className="text-xs">Estimated Delivery</Label>
                                        <Input
                                          type="date"
                                          value={estimatedDelivery}
                                          onChange={(e) => setEstimatedDelivery(e.target.value)}
                                          className="rounded-none mt-1"
                                        />
                                      </div>
                                    </div>
                                    <Button
                                      size="sm"
                                      onClick={() => updateTrackingInfo(selectedOrder.id)}
                                      className="rounded-none"
                                    >
                                      Add Tracking
                                    </Button>
                                  </div>
                                )}
                              </div>

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
                                {selectedOrder.tax > 0 && (
                                  <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Tax</span>
                                    <span className="font-medium">{formatCurrency(selectedOrder.tax)}</span>
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
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {order.items?.slice(0, 4).map((item) => (
                    <div key={item.id} className="w-12 h-12 bg-muted/10 border border-border flex-shrink-0">
                      {item.product_image ? (
                        <img
                          src={item.product_image}
                          alt={item.product_name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-muted" />
                      )}
                    </div>
                  ))}
                  {(order.items?.length || 0) > 4 && (
                    <div className="w-12 h-12 bg-muted/10 border border-border flex-shrink-0 flex items-center justify-center text-xs text-muted-foreground">
                      +{(order.items?.length || 0) - 4}
                    </div>
                  )}
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
