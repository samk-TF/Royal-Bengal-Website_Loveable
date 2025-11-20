import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { format } from "date-fns";

interface OrderItem {
  id: string;
  item_name: string;
  quantity: number;
  special_notes: string | null;
}

interface Order {
  id: string;
  order_token: string;
  status: string;
  created_at: string;
  items: OrderItem[];
}

const Kitchen = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrders, setSelectedOrders] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Fetch initial orders
    fetchOrders();

    // Set up realtime subscription
    const channel = supabase
      .channel('kitchen-orders')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders'
        },
        () => {
          fetchOrders();
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'order_items'
        },
        () => {
          fetchOrders();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchOrders = async () => {
    const { data: ordersData, error: ordersError } = await supabase
      .from('orders')
      .select('*')
      .in('status', ['pending', 'in_progress'])
      .order('created_at', { ascending: true });

    if (ordersError) {
      console.error('Error fetching orders:', ordersError);
      toast.error('Failed to fetch orders');
      return;
    }

    if (!ordersData) return;

    // Fetch items for each order
    const ordersWithItems = await Promise.all(
      ordersData.map(async (order) => {
        const { data: itemsData } = await supabase
          .from('order_items')
          .select('*')
          .eq('order_id', order.id);

        return {
          ...order,
          items: itemsData || []
        };
      })
    );

    setOrders(ordersWithItems);
  };

  const toggleOrderSelection = (orderId: string) => {
    const newSelected = new Set(selectedOrders);
    if (newSelected.has(orderId)) {
      newSelected.delete(orderId);
    } else {
      newSelected.add(orderId);
    }
    setSelectedOrders(newSelected);
  };

  const markOrdersAsDone = async () => {
    if (selectedOrders.size === 0) {
      toast.error('Please select at least one order');
      return;
    }

    const orderIds = Array.from(selectedOrders);
    
    const { error } = await supabase
      .from('orders')
      .update({ 
        status: 'completed',
        completed_at: new Date().toISOString()
      })
      .in('id', orderIds);

    if (error) {
      console.error('Error updating orders:', error);
      toast.error('Failed to mark orders as done');
      return;
    }

    toast.success(`${orderIds.length} order(s) marked as completed`);
    setSelectedOrders(new Set());
    fetchOrders();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500';
      case 'in_progress':
        return 'bg-blue-500';
      case 'completed':
        return 'bg-green-500';
      default:
        return 'bg-muted';
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="w-full max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">Kitchen HUD</h1>
          <Button 
            onClick={markOrdersAsDone}
            disabled={selectedOrders.size === 0}
            size="lg"
            className="w-full md:w-auto"
          >
            Mark Selected as Done ({selectedOrders.size})
          </Button>
        </div>

        {orders.length === 0 ? (
          <Card className="w-full">
            <CardContent className="flex items-center justify-center h-64">
              <p className="text-muted-foreground text-lg">No pending orders</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {orders.map((order) => (
              <Card 
                key={order.id}
                className={`transition-all ${
                  selectedOrders.has(order.id) 
                    ? 'ring-2 ring-primary' 
                    : ''
                }`}
              >
                <CardHeader className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked={selectedOrders.has(order.id)}
                        onCheckedChange={() => toggleOrderSelection(order.id)}
                      />
                      <CardTitle className="text-2xl font-bold">
                        #{order.order_token}
                      </CardTitle>
                    </div>
                    <Badge className={getStatusColor(order.status)}>
                      {order.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(order.created_at), 'MMM dd, yyyy HH:mm:ss')}
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  {order.items.map((item) => (
                    <div 
                      key={item.id}
                      className="border-l-4 border-primary pl-4 py-2"
                    >
                      <div className="flex justify-between items-start">
                        <h3 className="font-semibold text-foreground">
                          {item.item_name}
                        </h3>
                        <Badge variant="secondary">
                          x{item.quantity}
                        </Badge>
                      </div>
                      {item.special_notes && (
                        <p className="text-sm text-muted-foreground mt-2 italic">
                          Note: {item.special_notes}
                        </p>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Kitchen;