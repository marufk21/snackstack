import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
      retry: (failureCount, error) => {
        // Don't retry on 401, 403, 404 errors
        if (error && typeof error === "object" && "status" in error) {
          const status = (error as any).status;
          if (status === 401 || status === 403 || status === 404) {
            return false;
          }
        }
        // Retry up to 2 times for other errors
        return failureCount < 2;
      },
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: (failureCount, error) => {
        // Don't retry on 401, 403, 404 errors
        if (error && typeof error === "object" && "status" in error) {
          const status = (error as any).status;
          if (status === 401 || status === 403 || status === 404) {
            return false;
          }
        }
        // Retry up to 1 time for other errors
        return failureCount < 1;
      },
    },
  },
});
