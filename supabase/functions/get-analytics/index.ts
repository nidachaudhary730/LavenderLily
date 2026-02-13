import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders });
    }

    try {
        const supabaseAdmin = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        );

        // Fetch total users
        const { count: userCount, error: userError } = await supabaseAdmin
            .from('user_profiles')
            .select('*', { count: 'exact', head: true });

        if (userError) throw userError;

        // Fetch total orders and revenue
        // We fetch minimal data to calculate revenue
        const { data: orders, error: orderError } = await supabaseAdmin
            .from('orders')
            .select('total_amount, status');

        if (orderError) throw orderError;

        // Fetch total products
        const { count: productCount, error: productError } = await supabaseAdmin
            .from('products')
            .select('*', { count: 'exact', head: true });

        if (productError) throw productError;

        // Calculate metrics
        const totalRevenue = orders?.reduce((sum, order) => {
            if (order.status !== 'cancelled' && order.status !== 'returned') {
                const amount = typeof order.total_amount === 'string' ? parseFloat(order.total_amount) : order.total_amount;
                return sum + (amount || 0);
            }
            return sum;
        }, 0) || 0;

        const completedOrders = orders?.filter(o => o.status === 'delivered').length || 0;
        const pendingOrders = orders?.filter(o =>
            ['pending', 'processing', 'confirmed', 'shipped'].includes(o.status)
        ).length || 0;

        const totalOrders = orders?.length || 0;
        const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

        const analyticsData = {
            totalUsers: userCount || 0,
            totalOrders,
            totalRevenue,
            averageOrderValue,
            pendingOrders,
            completedOrders,
            totalProducts: productCount || 0,
        };

        return new Response(
            JSON.stringify(analyticsData),
            {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 200,
            }
        );

    } catch (error: any) {
        return new Response(
            JSON.stringify({ error: error.message }),
            {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 400,
            }
        );
    }
});
