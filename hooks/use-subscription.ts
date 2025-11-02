import { useQuery } from "@tanstack/react-query";
import { useUser } from "@clerk/nextjs";

interface SubscriptionData {
  hasSubscription: boolean;
  tier: "free" | "basic" | "pro" | "enterprise";
  isActive: boolean;
  limits: {
    maxNotes: number;
    maxNotesPerMonth: number;
    canUploadImages: boolean;
    canUseAI: boolean;
    maxImageSize: number;
  };
  subscription?: {
    status: string;
    planType: string;
    currentPeriodEnd: string;
    cancelAtPeriodEnd: boolean;
  };
}

/**
 * Hook to get user's subscription status and limits
 */
export function useSubscription() {
  const { isSignedIn, user } = useUser();

  const { data, isLoading, error, refetch } = useQuery<SubscriptionData>({
    queryKey: ["subscription", user?.id],
    queryFn: async () => {
      const response = await fetch("/api/subscription/status");
      if (!response.ok) {
        throw new Error("Failed to fetch subscription status");
      }
      return response.json();
    },
    enabled: isSignedIn,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  return {
    subscription: data,
    isLoading,
    error,
    refetch,
    hasSubscription: data?.hasSubscription ?? false,
    tier: data?.tier ?? "free",
    isActive: data?.isActive ?? false,
    limits: data?.limits ?? {
      maxNotes: 5,
      maxNotesPerMonth: 10,
      canUploadImages: false,
      canUseAI: false,
      maxImageSize: 0,
    },
  };
}

/**
 * Hook to check if user can access a specific feature
 */
export function useCanAccessFeature(feature: keyof SubscriptionData["limits"]) {
  const { limits, isLoading } = useSubscription();
  
  return {
    canAccess: limits[feature] as boolean,
    isLoading,
  };
}





