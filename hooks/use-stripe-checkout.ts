import { useState } from "react";
// import { loadStripe } from "@stripe/stripe-js"; // Removed for dynamic import
import { getStripePublishableKey } from "@/lib/stripe-client";

export function useStripeCheckout() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const redirectToCheckout = async (priceId: string) => {
    try {
      setLoading(true);
      setError(null);

      // Create checkout session
      const response = await fetch("/api/stripe/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ priceId }),
      });

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

      const data = await response.json();

      // Handle direct URL redirect (e.g. for Billing Portal)
      if (data.url) {
        window.location.href = data.url;
        return;
      }

      const { sessionId } = data;

      // Redirect to Stripe Checkout
      const { loadStripe } = await import("@stripe/stripe-js");
      const publishableKey = getStripePublishableKey();
      if (!publishableKey) {
        throw new Error("Stripe is not configured. Please set NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY.");
      }
      const stripe = await loadStripe(publishableKey);

      if (!stripe) {
        throw new Error("Stripe failed to load");
      }

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
