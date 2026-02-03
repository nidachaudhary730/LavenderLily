import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CREATE-CHECKOUT] ${step}${detailsStr}`);
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");
    logStep("Stripe key verified");

    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    // Authenticate user
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");
    
    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    
    const user = userData.user;
    if (!user?.email) throw new Error("User not authenticated or email not available");
    logStep("User authenticated", { userId: user.id, email: user.email });

    // Parse request body
    const { cartItems, shippingCost, shippingAddress, billingAddress, customerDetails } = await req.json();
    logStep("Request parsed", { itemCount: cartItems?.length, shippingCost });

    if (!cartItems || cartItems.length === 0) {
      throw new Error("Cart is empty");
    }

    // Initialize Stripe
    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });

    // Check if a Stripe customer already exists for this user
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    let customerId: string | undefined;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
      logStep("Found existing Stripe customer", { customerId });
    }

    // Create line items from cart
    const lineItems = cartItems.map((item: any) => ({
      price_data: {
        currency: "aed",
        product_data: {
          name: item.product.name,
          images: item.product.image_url ? [item.product.image_url] : [],
          metadata: {
            product_id: item.product_id,
            size: item.size || "",
            color: item.color || "",
          },
        },
        unit_amount: Math.round(item.product.price * 100), // Convert to fils (cents equivalent)
      },
      quantity: item.quantity,
    }));

    // Add shipping as a line item if there's a cost
    if (shippingCost && shippingCost > 0) {
      lineItems.push({
        price_data: {
          currency: "aed",
          product_data: {
            name: "Shipping",
            metadata: {},
          },
          unit_amount: Math.round(shippingCost * 100),
        },
        quantity: 1,
      });
    }

    logStep("Line items created", { count: lineItems.length });

    // Create checkout session
    const origin = req.headers.get("origin") || "https://lavender-lily.lovable.app";
    
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : user.email,
      line_items: lineItems,
      mode: "payment",
      success_url: `${origin}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout`,
      metadata: {
        user_id: user.id,
        shipping_address: JSON.stringify(shippingAddress),
        billing_address: JSON.stringify(billingAddress),
        customer_details: JSON.stringify(customerDetails),
        shipping_cost: shippingCost?.toString() || "0",
      },
      shipping_address_collection: {
        allowed_countries: ["AE", "SA", "KW", "BH", "OM", "QA", "US", "GB", "IN"],
      },
      phone_number_collection: {
        enabled: true,
      },
    });

    logStep("Checkout session created", { sessionId: session.id, url: session.url });

    return new Response(JSON.stringify({ url: session.url, sessionId: session.id }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
