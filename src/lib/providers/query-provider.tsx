/**
 * TanStack Query Provider
 *
 * Configures React Query for FDA API integration with:
 * - Optimized cache settings for medical device data
 * - Development tools integration
 * - Error handling and retry strategies
 * - Performance monitoring
 */

"use client";

import { ReactNode, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { getEnvironmentConfig } from "@/lib/config/environment";

interface QueryProviderProps {
  children: ReactNode;
}

/**
 * Create Query Client with FDA-specific configuration
 *
 * Optimized for medical device data patterns:
 * - Medical device data changes infrequently
 * - Network requests should be minimized
 * - User experience should remain smooth during API issues
 */
const createQueryClient = () => {
  const config = getEnvironmentConfig();

  return new QueryClient({
    defaultOptions: {
      queries: {
        // Cache Configuration
        staleTime: config.cacheTime * 60 * 1000, // Convert minutes to milliseconds
        gcTime: 10 * 60 * 1000, // 10 minutes garbage collection (formerly cacheTime)

        // Network & Retry Strategy
        retry: (failureCount, error) => {
          // Don't retry rate limit errors
          if (
            error &&
            typeof error === "object" &&
            "status" in error &&
            error.status === 429
          ) {
            return false;
          }

          // Don't retry client errors (4xx)
          if (error && typeof error === "object" && "status" in error) {
            const status = error.status as number;
            if (status >= 400 && status < 500) {
              return false;
            }
          }

          // Retry up to 3 times for server errors and network issues
          return failureCount < 3;
        },
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff

        // Background Refetch Configuration
        refetchOnWindowFocus: false, // Medical device data doesn't change frequently
        refetchOnMount: true, // Always get fresh data on component mount
        refetchOnReconnect: true, // Refetch when network reconnects

        // Error Handling
        throwOnError: false, // Let components handle errors gracefully

        // Performance
        notifyOnChangeProps: "all", // Optimize re-renders
      },
      mutations: {
        // Mutation configuration (for future API write operations)
        retry: 1,
        retryDelay: 1000,
      },
    },
  });
};

/**
 * TanStack Query Provider Component
 *
 * Wraps the application with React Query functionality
 * Includes development tools in development mode
 */
export function QueryProvider({ children }: QueryProviderProps) {
  // Create QueryClient instance (using useState to ensure single instance)
  const [queryClient] = useState(() => createQueryClient());

  const config = getEnvironmentConfig();

  // Log query client initialization
  if (config.debugApi) {
    console.log("🔧 TanStack Query initialized with configuration:", {
      staleTime: `${config.cacheTime} minutes`,
      gcTime: "10 minutes",
      retry: "Smart retry with exponential backoff",
      devTools: config.debugApi,
    });
  }

  return (
    <QueryClientProvider client={queryClient}>
      {children}

      {/* Development Tools - Only in development */}
      {config.debugApi && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
}

/**
 * Custom hook to access QueryClient
 *
 * Provides direct access to QueryClient for advanced operations
 * Useful for manual cache invalidation or prefetching
 */
export { useQueryClient } from "@tanstack/react-query";

/**
 * Query Keys for FDA API
 *
 * Centralized query key definitions for consistency
 * Helps with cache invalidation and query management
 */
export const QUERY_KEYS = {
  // FDA Device queries
  FDA_DEVICES: ["fda-devices"] as const,
  FDA_DEVICE_SEARCH: (params: Record<string, unknown>) =>
    ["fda-devices", "search", params] as const,
  FDA_DEVICE_BY_K_NUMBER: (kNumber: string) =>
    ["fda-devices", "detail", kNumber] as const,
  FDA_DEVICE_PREDICATES: (kNumber: string) =>
    ["fda-devices", "predicates", kNumber] as const,

  // Data source queries
  DATA_SOURCE_INFO: ["data-source-info"] as const,
} as const;

/**
 * Query configuration presets
 *
 * Predefined configurations for different types of queries
 */
export const QUERY_CONFIG = {
  // Fast-changing data (refresh frequently)
  REAL_TIME: {
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes
  },

  // Medium-changing data (default FDA device data)
  STANDARD: {
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  },

  // Slow-changing data (cache aggressively)
  STATIC: {
    staleTime: 60 * 60 * 1000, // 1 hour
    gcTime: 24 * 60 * 60 * 1000, // 24 hours
  },
} as const;
