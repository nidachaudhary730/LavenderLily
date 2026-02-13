import { serve } from "https://deno.land/std@0.200.0/http/server.ts"
import Stripe from "https://esm.sh/stripe@17.1.0?target=deno"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const stripeKey = Deno.env.get('STRIPE_SECRET_KEY')
    if (!stripeKey) throw new Error('STRIPE_SECRET_KEY missing')

    const stripe = new Stripe(stripeKey, { apiVersion: '2023-10-16' })
    const body = await req.json()
    const { cartItems, shippingCost, customerDetails } = body

    const line_items = cartItems.map((item: any) => ({
      price_data: {
        currency: 'aed',
        product_data: {
          name: item.product.name,
          images: item.product.image_url ? [item.product.image_url] : [],
        },
        unit_amount: Math.round(item.product.price * 100),
      },
      quantity: item.quantity,
    }))

    if (shippingCost > 0) {
      line_items.push({
        price_data: {
          currency: 'aed',
          product_data: { name: 'Shipping' },
          unit_amount: Math.round(shippingCost * 100),
        },
        quantity: 1,
      });
    }

    const origin = req.headers.get('origin') || 'http://localhost:8080';

    const session = await stripe.checkout.sessions.create({
      line_items,
      mode: 'payment',
      customer_email: customerDetails?.email,
      automatic_payment_methods: {
        enabled: true,
      },
      shipping_address_collection: {
        allowed_countries: ['AE'],
      },
      billing_address_collection: 'required',
      phone_number_collection: { enabled: true },
      success_url: `${origin}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout`,
    });

    return new Response(
      JSON.stringify({ url: session.url }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );

  } catch (error: any) {
    console.error("Backend Error:", error.message);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      }
    );
  }
})
