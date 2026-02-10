import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Minus, Plus, CreditCard, Check, Loader2, ArrowLeft } from "lucide-react";
import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";

const Checkout = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cartItems, getCartTotal, updateQuantity } = useCart();

  const [showDiscountInput, setShowDiscountInput] = useState(false);
  const [discountCode, setDiscountCode] = useState("");
  const [customerDetails, setCustomerDetails] = useState({
    email: user?.email || "",
    firstName: "",
    lastName: "",
    phone: ""
  });
  const [shippingAddress, setShippingAddress] = useState({
    address: "",
    city: "",
    postalCode: "",
    country: ""
  });
  const [hasSeparateBilling, setHasSeparateBilling] = useState(false);
  const [billingDetails, setBillingDetails] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    country: ""
  });
  const [shippingOption, setShippingOption] = useState("standard");
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);

  const subtotal = getCartTotal();

  const getShippingCost = () => {
    switch (shippingOption) {
      case "express": return 15;
      case "overnight": return 35;
      default: return 0;
    }
  };

  const shipping = getShippingCost();
  const total = subtotal + shipping;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-AE', {
      style: 'currency',
      currency: 'AED',
    }).format(amount);
  };

  const handleCustomerDetailsChange = (field: string, value: string) => {
    setCustomerDetails(prev => ({ ...prev, [field]: value }));
  };

  const handleShippingAddressChange = (field: string, value: string) => {
    setShippingAddress(prev => ({ ...prev, [field]: value }));
  };

  const handleBillingDetailsChange = (field: string, value: string) => {
    setBillingDetails(prev => ({ ...prev, [field]: value }));
  };

  const handleCompleteOrder = async () => {
    if (!user) {
      toast({ title: 'Please sign in', description: 'You need to sign in to complete your order', variant: 'destructive' });
      navigate('/auth');
      return;
    }

    if (cartItems.length === 0) {
      toast({ title: 'Empty cart', description: 'Please add items to your cart before checkout', variant: 'destructive' });
      return;
    }

    if (!customerDetails.email || !customerDetails.firstName || !customerDetails.lastName) {
      toast({ title: 'Missing information', description: 'Please fill in required customer details', variant: 'destructive' });
      return;
    }

    setIsProcessing(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
          'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
        },
        body: JSON.stringify({
          cartItems: cartItems.map(item => ({
            product_id: item.product_id,
            quantity: item.quantity,
            product: {
              name: item.product.name,
              price: item.product.price,
              image_url: item.product.image_url || item.product.images?.[0] || null,
            },
          })),
          shippingCost: shipping,
          customerDetails,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to initiate checkout');
      if (data?.url) window.location.href = data.url;
      else throw new Error('No checkout URL received');
    } catch (error: any) {
      console.error('Checkout Error:', error);
      toast({ title: 'Checkout Error', description: error.message || 'Failed to initiate checkout', variant: 'destructive' });
      setIsProcessing(false);
    }
  };

  if (paymentComplete) {
    return (
      <div className="min-h-screen bg-background text-foreground font-light">
        <Header />
        <main className="max-w-xl mx-auto px-6 py-32 text-center">
          <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-8">
            <Check className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-light mb-4">Order Received</h1>
          <p className="text-muted-foreground mb-10">
            Thank you for your purchase. We've sent a confirmation email to {customerDetails.email}.
          </p>
          <Button asChild variant="outline" className="rounded-none border-foreground hover:bg-foreground hover:text-background transition-colors px-10">
            <a href="/">Continue Shopping</a>
          </Button>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-light">
      <Header />

      <main className="max-w-7xl mx-auto px-6 py-12 lg:py-20 mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">

          {/* Left Column: Checkout Forms */}
          <div className="lg:col-span-7 space-y-16">

            {/* Account Details */}
            <section className="space-y-8">
              <div className="flex items-center justify-between border-b border-border pb-4">
                <h2 className="text-2xl font-light uppercase tracking-widest text-foreground">Contact Information</h2>
                {!user && (
                  <button onClick={() => navigate('/auth')} className="text-xs underline text-muted-foreground uppercase tracking-widest hover:text-foreground">Log in</button>
                )}
              </div>
              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-[11px] uppercase tracking-[0.2em] text-foreground font-medium">Email address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={customerDetails.email}
                    onChange={(e) => handleCustomerDetailsChange("email", e.target.value)}
                    className="rounded-none border-0 border-b border-border bg-transparent px-0 focus-visible:ring-0 focus-visible:border-foreground transition-colors h-10 placeholder:text-muted-foreground/40"
                    placeholder="email@example.com"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-[11px] uppercase tracking-[0.2em] text-foreground font-medium">First Name</Label>
                    <Input
                      id="firstName"
                      type="text"
                      value={customerDetails.firstName}
                      onChange={(e) => handleCustomerDetailsChange("firstName", e.target.value)}
                      className="rounded-none border-0 border-b border-border bg-transparent px-0 focus-visible:ring-0 focus-visible:border-foreground transition-colors h-10 placeholder:text-muted-foreground/40"
                      placeholder="Jane"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-[11px] uppercase tracking-[0.2em] text-foreground font-medium">Last Name</Label>
                    <Input
                      id="lastName"
                      type="text"
                      value={customerDetails.lastName}
                      onChange={(e) => handleCustomerDetailsChange("lastName", e.target.value)}
                      className="rounded-none border-0 border-b border-border bg-transparent px-0 focus-visible:ring-0 focus-visible:border-foreground transition-colors h-10 placeholder:text-muted-foreground/40"
                      placeholder="Doe"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Shipping Address */}
            <section className="space-y-8">
              <div className="border-b border-border pb-4">
                <h2 className="text-2xl font-light uppercase tracking-widest text-foreground">Shipping Address</h2>
              </div>
              <div className="space-y-8">
                <div className="space-y-2">
                  <Label htmlFor="address" className="text-[11px] uppercase tracking-[0.2em] text-foreground font-medium">Address</Label>
                  <Input
                    id="address"
                    value={shippingAddress.address}
                    onChange={(e) => handleShippingAddressChange("address", e.target.value)}
                    className="rounded-none border-0 border-b border-border bg-transparent px-0 focus-visible:ring-0 focus-visible:border-foreground transition-colors h-10 placeholder:text-muted-foreground/40"
                    placeholder="Street and house number"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="space-y-2">
                    <Label htmlFor="city" className="text-[11px] uppercase tracking-[0.2em] text-foreground font-medium">City</Label>
                    <Input
                      id="city"
                      value={shippingAddress.city}
                      onChange={(e) => handleShippingAddressChange("city", e.target.value)}
                      className="rounded-none border-0 border-b border-border bg-transparent px-0 focus-visible:ring-0 focus-visible:border-foreground transition-colors h-10 placeholder:text-muted-foreground/40"
                      placeholder="Dubai"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="postalCode" className="text-[11px] uppercase tracking-[0.2em] text-foreground font-medium">Postal Code</Label>
                    <Input
                      id="postalCode"
                      value={shippingAddress.postalCode}
                      onChange={(e) => handleShippingAddressChange("postalCode", e.target.value)}
                      className="rounded-none border-0 border-b border-border bg-transparent px-0 focus-visible:ring-0 focus-visible:border-foreground transition-colors h-10 placeholder:text-muted-foreground/40"
                      placeholder="00000"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country" className="text-[11px] uppercase tracking-[0.2em] text-foreground font-medium">Country</Label>
                    <Input
                      id="country"
                      value={shippingAddress.country}
                      onChange={(e) => handleShippingAddressChange("country", e.target.value)}
                      className="rounded-none border-0 border-b border-border bg-transparent px-0 focus-visible:ring-0 focus-visible:border-foreground transition-colors h-10 placeholder:text-muted-foreground/40"
                      placeholder="United Arab Emirates"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Shipping Method */}
            <section className="space-y-8">
              <div className="border-b border-border pb-4">
                <h2 className="text-2xl font-light uppercase tracking-widest text-foreground">Shipping Method</h2>
              </div>
              <RadioGroup value={shippingOption} onValueChange={setShippingOption} className="space-y-3">
                {[
                  { id: "standard", label: "Standard Shipping", time: "5-7 business days", price: "Free" },
                  { id: "express", label: "Express Shipping", time: "2-3 business days", price: "AED 15.00" },
                  { id: "overnight", label: "Overnight Shipping", time: "Next business day", price: "AED 35.00" }
                ].map((option) => (
                  <div key={option.id} className={`flex items-center justify-between p-5 border transition-all cursor-pointer ${shippingOption === option.id ? 'border-foreground bg-secondary/50' : 'border-border hover:border-muted-foreground'}`}>
                    <div className="flex items-center gap-4">
                      <RadioGroupItem value={option.id} id={option.id} className="border-border text-foreground" />
                      <div>
                        <Label htmlFor={option.id} className="text-sm font-medium cursor-pointer block">{option.label}</Label>
                        <span className="text-[10px] text-muted-foreground uppercase tracking-widest">{option.time}</span>
                      </div>
                    </div>
                    <span className="text-sm font-medium">{option.price}</span>
                  </div>
                ))}
              </RadioGroup>
            </section>
          </div>

          {/* Right Column: Order Summary (Sticky) */}
          <div className="lg:col-span-5 lg:pl-10">
            <div className="lg:sticky lg:top-28 space-y-10">
              <div className="border-b border-border pb-4">
                <h2 className="text-xl font-light uppercase tracking-widest text-foreground">Order Summary</h2>
              </div>

              <div className="space-y-8 max-h-[40vh] overflow-y-auto pr-4 custom-scrollbar">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-6">
                    <div className="w-24 h-32 bg-muted overflow-hidden">
                      <img src={item.product.image_url || item.product.images?.[0] || '/placeholder.svg'} alt={item.product.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 flex flex-col justify-between py-1">
                      <div>
                        <div className="flex justify-between items-start gap-2">
                          <h3 className="text-sm font-medium uppercase tracking-tight">{item.product.name}</h3>
                          <span className="text-sm font-light">{formatCurrency(item.product.price * item.quantity)}</span>
                        </div>
                        <div className="mt-2 space-y-1">
                          {item.size && <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Size: {item.size}</p>}
                          {item.color && <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Color: {item.color}</p>}
                          <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Quantity: {item.quantity}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="text-muted-foreground hover:text-foreground transition-colors p-1"><Minus className="w-3 h-3" /></button>
                        <span className="text-xs">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="text-muted-foreground hover:text-foreground transition-colors p-1"><Plus className="w-3 h-3" /></button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-4 pt-4">
                <div className="flex justify-between text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  <span>Subtotal</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'Complimentary' : formatCurrency(shipping)}</span>
                </div>

                <div className="pt-2">
                  {!showDiscountInput ? (
                    <button onClick={() => setShowDiscountInput(true)} className="text-[10px] uppercase tracking-widest underline underline-offset-4 decoration-border hover:decoration-foreground transition-all">Add discount code</button>
                  ) : (
                    <div className="flex gap-2">
                      <Input
                        value={discountCode}
                        onChange={(e) => setDiscountCode(e.target.value)}
                        className="rounded-none border-border h-8 text-[10px] uppercase tracking-widest"
                        placeholder="Code"
                      />
                      <Button variant="outline" size="sm" className="rounded-none border-foreground h-8 px-4 text-[10px] uppercase tracking-widest" onClick={() => setShowDiscountInput(false)}>Apply</Button>
                    </div>
                  )}
                </div>

                <Separator className="bg-border my-6" />

                <div className="flex justify-between items-end">
                  <span className="text-xs uppercase tracking-[0.3em] font-medium text-foreground">Total</span>
                  <span className="text-2xl font-light text-foreground">{formatCurrency(total)}</span>
                </div>

                <Button
                  onClick={handleCompleteOrder}
                  disabled={isProcessing || cartItems.length === 0}
                  className="w-full h-14 mt-6 rounded-none bg-primary text-primary-foreground hover:bg-primary-hover transition-all uppercase tracking-[0.2em] text-xs font-medium shadow-sm"
                >
                  {isProcessing ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Redirecting to secure payment...</span>
                    </div>
                  ) : (
                    <span>Complete Purchase</span>
                  )}
                </Button>

                <p className="text-[9px] text-center text-muted-foreground uppercase tracking-[0.2em] pt-4">
                  Secure 256-bit SSL Encrypted Payment
                </p>

                <div className="flex items-center justify-center gap-6 mt-6 opacity-40 grayscale group-hover:grayscale-0 transition-all">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-2" />
                  <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-4" />
                  <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal_logo.svg" alt="PayPal" className="h-3" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Checkout;
