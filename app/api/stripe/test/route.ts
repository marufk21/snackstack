import { NextResponse } from "next/server";
import { stripe } from "@/config/stripe";

export async function GET() {
  try {
    console.log("=== Stripe Test API Called ===");
    console.log("Environment check:");
    console.log("- STRIPE_SECRET_KEY exists:", !!process.env.STRIPE_SECRET_KEY);
    console.log(
      "- STRIPE_SECRET_KEY starts with sk_test:",
      process.env.STRIPE_SECRET_KEY?.startsWith("sk_test_")
    );

    // Test Stripe connection
    const products = await stripe.products.list({ limit: 3 });
    console.log("Stripe connection successful!");
    console.log("Found products:", products.data.length);

    const productDetails = products.data.map((product) => ({
      id: product.id,
      name: product.name,
      active: product.active,
    }));

    console.log("Product details:", productDetails);

    // Get prices for the first product (if any)
    if (products.data.length > 0) {
      const prices = await stripe.prices.list({
        product: products.data[0].id,
        limit: 5,
      });

      console.log(
        `Prices for ${products.data[0].name}:`,
        prices.data.map((p) => ({
          id: p.id,
          unit_amount: p.unit_amount,
          currency: p.currency,
          recurring: p.recurring,
        }))
      );
    }

    return NextResponse.json({
      success: true,
      message: "Stripe connection working!",
      products: productDetails,
      environment: {
        hasSecretKey: !!process.env.STRIPE_SECRET_KEY,
        isTestKey: process.env.STRIPE_SECRET_KEY?.startsWith("sk_test_"),
      },
    });
  } catch (error) {
    console.error("Stripe test error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        details: error,
      },
      { status: 500 }
    );
  }
}
