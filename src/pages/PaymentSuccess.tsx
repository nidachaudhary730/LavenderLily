import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Check, Loader2, XCircle } from "lucide-react";
import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/hooks/useCart";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { refetch } = useCart();

  const [status, setStatus] = useState<"verifying" | "success" | "error">("verifying");
  const [orderNumber, setOrderNumber] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const verifyPayment = async () => {
      const sessionId = searchParams.get("session_id");

      if (!sessionId) {
        setStatus("error");
        setErrorMessage("No session ID found");
        return;
      }

      try {
        const { data, error } = await supabase.functions.invoke("verify-payment", {
          body: { sessionId },
        });

        if (error) throw error;

        if (data.success) {
          setOrderNumber(data.orderNumber);
          setStatus("success");
          // Refresh cart to show empty
          await refetch();
        } else {
          throw new Error(data.error || "Payment verification failed");
        }
      } catch (err: any) {
        console.error("Payment verification error:", err);
        setStatus("error");
        setErrorMessage(err.message || "Failed to verify payment");
      }
    };

    verifyPayment();
  }, [searchParams, refetch]);

  if (status === "verifying") {
    return (
      <div className="min-h-screen bg-background text-foreground font-light">
        <Header />
        <main className="pt-32 pb-12 px-6">
          <div className="max-w-lg mx-auto text-center">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
              <Loader2 className="h-8 w-8 text-primary animate-spin" />
            </div>
            <h1 className="text-2xl font-light text-foreground mb-4 uppercase tracking-widest">Verifying Payment...</h1>
            <p className="text-muted-foreground">
              Please wait while we confirm your payment.
            </p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="min-h-screen bg-background text-foreground font-light">
        <Header />
        <main className="pt-32 pb-12 px-6">
          <div className="max-w-lg mx-auto text-center">
            <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <XCircle className="h-8 w-8 text-destructive" />
            </div>
            <h1 className="text-2xl font-light text-foreground mb-4 uppercase tracking-widest">Payment Verification Failed</h1>
            <p className="text-muted-foreground mb-6">
              {errorMessage || "There was an issue verifying your payment. Please contact support."}
            </p>
            <div className="flex gap-4 justify-center">
              <Button variant="outline" onClick={() => navigate("/checkout")} className="rounded-none border-foreground">
                Return to Checkout
              </Button>
              <Button onClick={() => navigate("/orders")} className="rounded-none">
                View Orders
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-light">
      <Header />
      <main className="pt-32 pb-24 px-6">
        <div className="max-w-lg mx-auto text-center">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-8">
            <Check className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
          <h1 className="text-3xl font-light text-foreground mb-6 uppercase tracking-widest leading-loose">Order Confirmed!</h1>
          <p className="text-muted-foreground mb-4">
            Thank you for your order. Your payment was successful.
          </p>
          {orderNumber && (
            <div className="bg-secondary/30 py-4 px-6 mb-8 inline-block">
              <p className="text-foreground tracking-widest uppercase text-sm font-medium">
                Order Number: <span className="text-primary ml-2">{orderNumber}</span>
              </p>
            </div>
          )}
          <p className="text-muted-foreground text-sm mb-12">
            You will receive an email confirmation shortly with your order details.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button
              variant="outline"
              onClick={() => navigate("/")}
              className="rounded-none border-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground transition-all px-8 h-12 uppercase tracking-widest text-xs"
            >
              Continue Shopping
            </Button>
            <Button
              onClick={() => navigate("/orders")}
              className="rounded-none bg-primary text-primary-foreground hover:bg-primary-hover transition-all px-8 h-12 uppercase tracking-widest text-xs shadow-sm"
            >
              View Your Orders
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PaymentSuccess;
