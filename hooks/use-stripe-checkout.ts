import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";

// Get publishable key from environment (client-side safe)
const getStripePublishableKey = () => {
  if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
    throw new Error("NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not set");
  }
  return process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
};

export function useStripeCheckout() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const redirectToCheckout = async (priceId: string) => {
    try {
      setLoading(true);
      setError(null);

      console.log("Starting checkout with priceId:", priceId);
      console.log(
        "Stripe publishable key exists:",
        !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
      );

      // Create checkout session
      const response = await fetch("/api/stripe/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ priceId }),
      });

      console.log("Response status:", response.status);
      console.log("Response ok:", response.ok);

      if (!response.ok) {
        const errorData = await response.json();
        console.error("API Error:", errorData);
        console.error(
          "Full error details:",
          JSON.stringify(errorData, null, 2)
        );
        throw new Error(
          errorData.details ||
            errorData.error ||
            "Failed to create checkout session"
        );
      }

      const { sessionId } = await response.json();
      console.log("Got session ID:", sessionId);

      // Redirect to Stripe Checkout
      const stripe = await loadStripe(getStripePublishableKey());

      if (!stripe) {
        throw new Error("Stripe failed to load");
      }

      console.log("Redirecting to Stripe checkout...");
      const { error } = await stripe.redirectToCheckout({
        sessionId,
      });

      if (error) {
        console.error("Stripe redirect error:", error);
        throw new Error(error.message);
      }
    } catch (err) {
      console.error("Checkout error:", err);
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  return {
    redirectToCheckout,
    loading,
    error,
  };
}
