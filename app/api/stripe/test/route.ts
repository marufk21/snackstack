import { NextResponse } from "next/server";
import { stripe } from "@/config/stripe";

export async function GET() {
  try {
    // Test Stripe connection
    const products = await stripe.products.list({ limit: 3 });

    const productDetails = products.data.map((product) => ({
      id: product.id,
      name: product.name,
      active: product.active,
    }));

    // Get prices for the first product (if any)
    if (products.data.length > 0) {
      const prices = await stripe.prices.list({
        product: products.data[0].id,
        limit: 5,
      });
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
