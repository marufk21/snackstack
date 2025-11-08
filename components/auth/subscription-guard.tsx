import { auth } from "@/config/auth";
import { redirect } from "next/navigation";
import { hasActiveSubscription } from "@/lib/database/subscription";

interface SubscriptionGuardProps {
  children: React.ReactNode;
  redirectTo?: string;
  optional?: boolean; // Allow access even without subscription (for testing/dev)
}

/**
 * Server component that checks if user has an active subscription
 * Redirects to pricing page if not subscribed
 */
export async function SubscriptionGuard({
  children,
  redirectTo = "/app/pricing?upgrade=required",
  optional = false,
}: SubscriptionGuardProps) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/sign-in");
  }

  try {
    const hasSubscription = await hasActiveSubscription(session.user.id);

    if (!hasSubscription && !optional) {
      redirect(redirectTo);
    }
  } catch (error) {
    console.error("Error checking subscription:", error);

    // In development, allow access if there's a database error
    if (process.env.NODE_ENV === "development") {
      console.warn(
        "⚠️ Database error in SubscriptionGuard - allowing access in development mode"
      );
    } else if (!optional) {
      // In production, redirect to pricing on error unless optional
      redirect(redirectTo);
    }
  }

  return <>{children}</>;
}
