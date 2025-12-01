import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

interface SubscriptionData {
  hasSubscription: boolean;
  tier: "free" | "basic" | "pro" | "enterprise";
  isActive: boolean;
  onFreeTrial?: boolean;
  remainingTrialDays?: number;
  freeTrialEndsAt?: string;
  noteCount?: number;
  noteLimit?: number;
  remainingNotes?: number;
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
    currentPeriodStart: string;
    currentPeriodEnd: string;
    cancelAtPeriodEnd: boolean;
  };
}

/**
 * Hook to get user's subscription status and limits
 */
export function useSubscription() {
  const { data: session, status } = useSession();
  const isSignedIn = status === "authenticated";

  const { data, isLoading, error, refetch } = useQuery<SubscriptionData>({
    queryKey: ["subscription", session?.user?.id],
    queryFn: async () => {
      const response = await fetch("/api/subscription/status");
      if (!response.ok) {
        throw new Error("Failed to fetch subscription status");
      }
      return response.json();
    },
    enabled: isSignedIn,
    staleTime: 0, // Always fetch fresh data
    refetchOnMount: true,
  });

  return {
    subscription: data,
    isLoading,
    error,
    refetch,
    hasSubscription: data?.hasSubscription ?? false,
    tier: data?.tier ?? "free",
    isActive: data?.isActive ?? false,
    onFreeTrial: data?.onFreeTrial ?? false,
    remainingTrialDays: data?.remainingTrialDays ?? 0,
    noteCount: data?.noteCount ?? 0,
    noteLimit: data?.noteLimit ?? 5,
    remainingNotes: data?.remainingNotes ?? 5,
    canCreateNote: (data?.remainingNotes ?? 0) > 0,
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
