import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import Header from '@/components/header/Header';
import Footer from '@/components/footer/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Package, Eye, Truck, CheckCircle2, Clock, XCircle } from 'lucide-react';

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
  order_number: string;
  status: string;
  total_amount: number;
  subtotal: number;
  shipping_cost: number;
  tax: number;
  shipping_address: any;
  tracking_number: string | null;
  estimated_delivery: string | null;
  delivered_at: string | null;
  created_at: string;
  items?: OrderItem[];
}

const Orders = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Fetch order items for each order
      const ordersWithItems = await Promise.all(
        (data || []).map(async (order) => {
          const { data: items } = await supabase
            .from('order_items')
            .select('*')
            .eq('order_id', order.id);

          return { ...order, items: items || [] };
        })
      );

      setOrders(ordersWithItems);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'processing':
        return <Package className="h-4 w-4" />;
      case 'shipped':
        return <Truck className="h-4 w-4" />;
      case 'delivered':
        return <CheckCircle2 className="h-4 w-4" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
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
    return new Intl.NumberFormat('en-AE', {
      style: 'currency',
      currency: 'AED',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-EU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-24 pb-12 px-6">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse text-muted-foreground text-center py-12">
              Loading orders...
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-24 pb-12 px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-light text-foreground mb-8">My Orders</h1>

          {orders.length === 0 ? (
            <Card className="border-border rounded-none">
              <CardContent className="py-12 text-center">
                <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-4">You haven't placed any orders yet.</p>
                <Button asChild className="rounded-none">
                  <Link to="/">Start Shopping</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <Card key={order.id} className="border-border rounded-none">
                  <CardHeader className="pb-3">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="space-y-1">
                        <CardTitle className="text-lg font-light text-foreground">
                          {order.order_number}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                          Placed on {formatDate(order.created_at)}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge
                          variant={getStatusBadgeVariant(order.status)}
                          className="rounded-none flex items-center gap-1"
                        >
                          {getStatusIcon(order.status)}
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </Badge>
                        <span className="text-lg font-light text-foreground">
                          {formatCurrency(order.total_amount)}
                        </span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {/* Order Items Preview */}
                    <div className="flex gap-3 mb-4 overflow-x-auto pb-2">
                      {order.items?.slice(0, 4).map((item) => (
                        <div key={item.id} className="flex-shrink-0">
                          <div className="w-16 h-16 bg-muted/10 border border-border">
                            {item.product_image ? (
                              <img
                                src={item.product_image}
                                alt={item.product_name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                                No image
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                      {(order.items?.length || 0) > 4 && (
                        <div className="flex-shrink-0 w-16 h-16 bg-muted/10 border border-border flex items-center justify-center">
                          <span className="text-sm text-muted-foreground">
                            +{(order.items?.length || 0) - 4}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Tracking Info */}
                    {order.tracking_number && (
                      <div className="mb-4 p-3 bg-muted/10 border border-border">
                        <p className="text-sm">
                          <span className="text-muted-foreground">Tracking: </span>
                          <span className="font-medium">{order.tracking_number}</span>
                        </p>
                        {order.estimated_delivery && (
                          <p className="text-sm text-muted-foreground mt-1">
                            Estimated delivery: {formatDate(order.estimated_delivery)}
                          </p>
                        )}
                      </div>
                    )}

                    {/* View Details Button */}
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-none"
                          onClick={() => setSelectedOrder(order)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl rounded-none max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle className="font-light">
                            Order {order.order_number}
                          </DialogTitle>
                        </DialogHeader>

                        {selectedOrder && (
                          <div className="space-y-6">
                            {/* Status */}
                            <div className="flex items-center gap-3">
                              <Badge
                                variant={getStatusBadgeVariant(selectedOrder.status)}
                                className="rounded-none flex items-center gap-1"
                              >
                                {getStatusIcon(selectedOrder.status)}
                                {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                              </Badge>
                              <span className="text-sm text-muted-foreground">
                                Placed on {formatDate(selectedOrder.created_at)}
                              </span>
                            </div>

                            {/* Order Items */}
                            <div className="space-y-4">
                              <h3 className="text-sm font-medium text-foreground">Items</h3>
                              <div className="space-y-3">
                                {selectedOrder.items?.map((item) => (
                                  <div key={item.id} className="flex gap-4 border-b border-border pb-3">
                                    <div className="w-16 h-16 bg-muted/10 border border-border flex-shrink-0">
                                      {item.product_image ? (
                                        <img
                                          src={item.product_image}
                                          alt={item.product_name}
                                          className="w-full h-full object-cover"
                                        />
                                      ) : (
                                        <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                                          No image
                                        </div>
                                      )}
                                    </div>
                                    <div className="flex-1">
                                      <p className="font-medium text-foreground">{item.product_name}</p>
                                      {item.size && (
                                        <p className="text-sm text-muted-foreground">Size: {item.size}</p>
                                      )}
                                      {item.color && (
                                        <p className="text-sm text-muted-foreground">Color: {item.color}</p>
                                      )}
                                      <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                                    </div>
                                    <div className="text-right">
                                      <p className="font-medium">{formatCurrency(item.total_price)}</p>
                                      <p className="text-sm text-muted-foreground">
                                        {formatCurrency(item.unit_price)} each
                                      </p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Shipping Address */}
                            {selectedOrder.shipping_address && (
                              <div className="space-y-2">
                                <h3 className="text-sm font-medium text-foreground">Shipping Address</h3>
                                <div className="text-sm text-muted-foreground">
                                  <p>{selectedOrder.shipping_address.address}</p>
                                  <p>
                                    {selectedOrder.shipping_address.city}, {selectedOrder.shipping_address.postalCode}
                                  </p>
                                  <p>{selectedOrder.shipping_address.country}</p>
                                </div>
                              </div>
                            )}

                            {/* Tracking */}
                            {selectedOrder.tracking_number && (
                              <div className="space-y-2">
                                <h3 className="text-sm font-medium text-foreground">Tracking</h3>
                                <p className="text-sm">
                                  <span className="text-muted-foreground">Number: </span>
                                  <span className="font-medium">{selectedOrder.tracking_number}</span>
                                </p>
                                {selectedOrder.estimated_delivery && (
                                  <p className="text-sm text-muted-foreground">
                                    Estimated delivery: {formatDate(selectedOrder.estimated_delivery)}
                                  </p>
                                )}
                              </div>
                            )}

                            {/* Order Totals */}
                            <div className="space-y-2 border-t border-border pt-4">
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Subtotal</span>
                                <span>{formatCurrency(selectedOrder.subtotal)}</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Shipping</span>
                                <span>{formatCurrency(selectedOrder.shipping_cost)}</span>
                              </div>
                              {selectedOrder.tax > 0 && (
                                <div className="flex justify-between text-sm">
                                  <span className="text-muted-foreground">Tax</span>
                                  <span>{formatCurrency(selectedOrder.tax)}</span>
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
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Orders;
