import React from "react";
import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { useSubscription } from "@/hooks/use-subscription";

jest.mock("next-auth/react", () => ({
  useSession: jest.fn(),
}));

import { useSession } from "next-auth/react";

const mockUseSession = useSession as jest.MockedFunction<typeof useSession>;

function SubscriptionStatus() {
  const { isLoading, hasSubscription, tier } = useSubscription();

  if (isLoading) return <div>Loading subscription...</div>;

  return (
    <div>
      {hasSubscription ? "Has Subscription" : "No Subscription"} ({tier})
    </div>
  );
}

describe("Integration: useSubscription + MSW", () => {
  it("renders subscription state from mocked /api/subscription/status", async () => {
    mockUseSession.mockReturnValue({
      data: { user: { id: "user-1" } },
      status: "authenticated",
    } as any);

    const queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });

    render(
      <QueryClientProvider client={queryClient}>
        <SubscriptionStatus />
      </QueryClientProvider>
    );

    expect(await screen.findByText("No Subscription (free)")).toBeInTheDocument();
  });
});

