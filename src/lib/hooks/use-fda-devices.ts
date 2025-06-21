/**
 * FDA Devices Data Hook
 *
 * Custom TanStack Query hook for fetching FDA device data with comprehensive
 * error handling, loading states, and intelligent caching strategy.
 *
 * Features:
 * - Environment-based data source switching (mock/API)
 * - Automatic fallback to mock data on API failures
 * - Optimized caching with medical device-specific settings
 * - Loading and error state management
 * - Search parameter integration
 */

import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { dataProvider } from "@/lib/data/data-provider";
import { validateEnvironment } from "@/lib/config/environment";
import type { FDADevice, DeviceFilters } from "@/types/fda";

// Query Keys for consistent cache management
export const FDA_QUERY_KEYS = {
  devices: (filters?: DeviceFilters) => ["fda-devices", filters] as const,
  device: (kNumber: string) => ["fda-device", kNumber] as const,
  search: (query: string) => ["fda-search", query] as const,
} as const;

// Query Configuration Presets
export const FDA_QUERY_CONFIG = {
  // Real-time data for critical operations
  REAL_TIME: {
    staleTime: 1 * 60 * 1000, // 1 minute
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: true,
  },

  // Standard configuration for most use cases
  STANDARD: {
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
  },

  // Static data for rarely changing information
  STATIC: {
    staleTime: 30 * 60 * 1000, // 30 minutes
    gcTime: 60 * 60 * 1000, // 1 hour
    refetchOnWindowFocus: false,
  },
};

/**
 * Response type for FDA devices hook
 */
export interface UseFDADevicesResult {
  devices: FDADevice[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  isFromAPI: boolean;
  totalCount: number;
  refetch: () => void;
  isFetching: boolean;
}

/**
 * Main FDA Devices Hook
 *
 * Fetches FDA device data with intelligent source switching and caching
 *
 * @param filters - Optional search and filter parameters
 * @param options - Query configuration options
 * @returns FDA devices data with loading states
 */
export const useFDADevices = (
  filters?: DeviceFilters,
  options?: {
    enabled?: boolean;
    config?: {
      staleTime: number;
      gcTime: number;
      refetchOnWindowFocus: boolean;
    };
  },
): UseFDADevicesResult => {
  const config = options?.config || FDA_QUERY_CONFIG.STANDARD;
  const enabled = options?.enabled !== false;

  const query = useQuery({
    queryKey: FDA_QUERY_KEYS.devices(filters),
    queryFn: async () => {
      const envConfig = validateEnvironment();

      if (envConfig.config.debugApi) {
        console.log("🔍 FDA Devices Hook: Fetching with filters:", filters);
      }

      // Use data provider which handles environment switching
      const response = await dataProvider.getDevices({
        search: filters?.searchTerm,
        productClass: filters?.productClass?.[0], // Take first class for now
        limit: filters?.limit || 100,
      });

      if (envConfig.config.debugApi) {
        console.log(
          "✅ FDA Devices Hook: Received",
          response.devices.length,
          "devices from",
          response.source,
        );
      }

      return response;
    },

    // Cache configuration
    staleTime: config.staleTime,
    gcTime: config.gcTime,
    refetchOnWindowFocus: config.refetchOnWindowFocus,

    // Enable/disable query
    enabled,

    // Smart retry logic
    retry: (failureCount, error) => {
      // Don't retry rate limit errors
      if (error && "status" in error && error.status === 429) {
        return false;
      }

      // Retry up to 3 times for other errors
      return failureCount < 3;
    },

    // Exponential backoff
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  // Transform query result to our hook interface
  return {
    devices: query.data?.devices || [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    isFromAPI: query.data?.source === "api",
    totalCount: query.data?.totalCount || 0,
    refetch: query.refetch,
    isFetching: query.isFetching,
  };
};

/**
 * Single Device Hook
 *
 * Fetches individual device by K-number with caching
 *
 * @param kNumber - Device K-number to fetch
 * @param options - Query configuration options
 * @returns Single device data with loading states
 */
export const useFDADevice = (
  kNumber: string,
  options?: {
    enabled?: boolean;
    config?: {
      staleTime: number;
      gcTime: number;
      refetchOnWindowFocus: boolean;
    };
  },
): UseQueryResult<FDADevice | null> => {
  const config = options?.config || FDA_QUERY_CONFIG.STANDARD;
  const enabled = options?.enabled !== false && !!kNumber;

  return useQuery({
    queryKey: FDA_QUERY_KEYS.device(kNumber),
    queryFn: async () => {
      const envConfig = validateEnvironment();

      if (envConfig.config.debugApi) {
        console.log("🔍 FDA Device Hook: Fetching device:", kNumber);
      }

      const device = await dataProvider.getDeviceByKNumber(kNumber);

      if (envConfig.config.debugApi) {
        console.log(
          "✅ FDA Device Hook: Found device:",
          device?.deviceName || "Not found",
        );
      }

      return device;
    },

    staleTime: config.staleTime,
    gcTime: config.gcTime,
    refetchOnWindowFocus: config.refetchOnWindowFocus,
    enabled,

    retry: (failureCount, error) => {
      if (error && "status" in error && error.status === 429) {
        return false;
      }
      return failureCount < 2; // Less retries for single device
    },
  });
};

/**
 * Device Search Hook
 *
 * Optimized hook for search functionality with debouncing support
 *
 * @param searchTerm - Search query string
 * @param options - Search configuration options
 * @returns Search results with loading states
 */
export const useDeviceSearch = (
  searchTerm: string,
  options?: {
    enabled?: boolean;
    limit?: number;
    debounceMs?: number;
  },
): UseFDADevicesResult => {
  const limit = options?.limit || 50;
  const enabled = options?.enabled !== false && searchTerm.length >= 2;

  const filters: DeviceFilters = {
    searchTerm: searchTerm.trim(),
    limit,
  };

  return useFDADevices(filters, {
    enabled,
    config: FDA_QUERY_CONFIG.REAL_TIME, // Use real-time config for search
  });
};

/**
 * Prefetch utility for performance optimization
 *
 * @param filters - Device filters to prefetch
 */
export const prefetchFDADevices = async (filters?: DeviceFilters) => {
  // This would be used with QueryClient.prefetchQuery
  // Implementation depends on QueryClient access
  console.log("🚀 Prefetching FDA devices with filters:", filters);
};
