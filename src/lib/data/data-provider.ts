/**
 * Data Provider
 *
 * Centralized data source management with environment-based switching
 * Handles mock data, API data, and fallback strategies
 */

import { mockDevices, getMockDataStats } from "@/lib/mock-data";
import {
  shouldUseAPI,
  getDataSourceDescription,
  getEnvironmentConfig,
} from "@/lib/config/environment";
import { fdaAPIClient } from "@/lib/api/fda-api";
import type { FDADevice, DeviceFilters } from "@/types/fda";

export interface DataProviderResponse {
  devices: FDADevice[];
  source: "mock" | "api" | "fallback";
  timestamp: number;
  totalCount: number;
  error?: Error;
}

export interface DataProviderSearchParams {
  search?: string;
  productClass?: "I" | "II" | "III";
  panelType?: string;
  limit?: number;
  skip?: number;
}

/**
 * Data Provider Class
 *
 * Manages data sources based on environment configuration
 * Provides unified interface for both mock and API data
 */
export class DataProvider {
  private static instance: DataProvider;
  private config = getEnvironmentConfig();

  private constructor() {}

  /**
   * Get singleton instance
   */
  public static getInstance(): DataProvider {
    if (!DataProvider.instance) {
      DataProvider.instance = new DataProvider();
    }
    return DataProvider.instance;
  }

  /**
   * Get devices from appropriate data source
   *
   * @param params - Search and filter parameters
   * @returns Device data with metadata
   */
  public async getDevices(
    params: DataProviderSearchParams = {},
  ): Promise<DataProviderResponse> {
    const shouldUseApiData = shouldUseAPI();

    try {
      if (shouldUseApiData) {
        // Use real FDA API client
        const filters: DeviceFilters = {
          searchTerm: params.search,
          productClass: params.productClass ? [params.productClass] : undefined,
          limit: params.limit,
        };

        const apiResponse = await fdaAPIClient.fetchDevices(filters);

        return {
          devices: apiResponse.devices,
          source: apiResponse.source as "api" | "mock",
          timestamp: Date.now(),
          totalCount: apiResponse.total,
          error: apiResponse.error,
        };
      } else {
        return this.getMockDevices(params);
      }
    } catch (error) {
      // Fallback to mock data on any error
      console.warn("Data provider error, falling back to mock data:", error);
      const mockResponse = this.getMockDevices(params);
      return {
        ...mockResponse,
        source: "fallback",
        error: error instanceof Error ? error : new Error(String(error)),
      };
    }
  }

  /**
   * Get mock devices with filtering
   *
   * @param params - Search and filter parameters
   * @returns Filtered mock device data
   */
  private getMockDevices(
    params: DataProviderSearchParams,
  ): DataProviderResponse {
    let filteredDevices = [...mockDevices];

    // Apply search filter
    if (params.search) {
      const searchLower = params.search.toLowerCase();
      filteredDevices = filteredDevices.filter(
        (device) =>
          device.kNumber.toLowerCase().includes(searchLower) ||
          device.deviceName.toLowerCase().includes(searchLower) ||
          device.manufacturer.toLowerCase().includes(searchLower) ||
          device.intendedUse.toLowerCase().includes(searchLower) ||
          (device.panelType &&
            device.panelType.toLowerCase().includes(searchLower)),
      );
    }

    // Apply product class filter
    if (params.productClass) {
      filteredDevices = filteredDevices.filter(
        (device) => device.productClass === params.productClass,
      );
    }

    // Apply panel type filter
    if (params.panelType) {
      filteredDevices = filteredDevices.filter(
        (device) =>
          device.panelType
            ?.toLowerCase()
            .includes(params.panelType!.toLowerCase()) || false,
      );
    }

    // Apply pagination
    if (params.skip) {
      filteredDevices = filteredDevices.slice(params.skip);
    }
    if (params.limit) {
      filteredDevices = filteredDevices.slice(0, params.limit);
    }

    return {
      devices: filteredDevices,
      source: "mock",
      timestamp: Date.now(),
      totalCount: filteredDevices.length,
    };
  }

  /**
   * Get mock devices but indicate they come from API
   * Used during development/testing phase
   *
   * @param params - Search and filter parameters
   * @returns Mock device data with API source indication
   */
  private getMockDevicesAsAPI(
    params: DataProviderSearchParams,
  ): Promise<DataProviderResponse> {
    const mockResponse = this.getMockDevices(params);

    // Simulate API delay for realistic testing
    return new Promise<DataProviderResponse>((resolve) => {
      setTimeout(
        () => {
          resolve({
            ...mockResponse,
            source: "api",
          });
        },
        100 + Math.random() * 200,
      ); // 100-300ms delay
    });
  }

  /**
   * Get data source information
   *
   * @returns Current data source configuration and status
   */
  public getDataSourceInfo() {
    const config = getEnvironmentConfig();
    const mockStats = getMockDataStats();

    return {
      description: getDataSourceDescription(),
      mode: config.dataMode,
      shouldUseAPI: shouldUseAPI(),
      mockDataStats: mockStats,
      config: {
        hasApiKey: !!config.fdaApiKey,
        rateLimit: config.rateLimit,
        cacheTime: config.cacheTime,
        debugMode: config.debugApi,
      },
    };
  }

  /**
   * Get device by K-number
   *
   * @param kNumber - Device K-number
   * @returns Device data or null if not found
   */
  public async getDeviceByKNumber(kNumber: string): Promise<FDADevice | null> {
    const shouldUseApiData = shouldUseAPI();

    if (shouldUseApiData) {
      const apiResponse = await fdaAPIClient.getDeviceByKNumber(kNumber);
      return apiResponse.device;
    } else {
      const response = await this.getDevices();
      return (
        response.devices.find((device) => device.kNumber === kNumber) || null
      );
    }
  }

  /**
   * Search devices by predicate relationships
   *
   * @param kNumber - Device K-number
   * @returns Related devices (predicates and dependents)
   */
  public async getRelatedDevices(kNumber: string): Promise<{
    device: FDADevice | null;
    predicates: FDADevice[];
    dependents: FDADevice[];
  }> {
    const response = await this.getDevices();
    const devices = response.devices;

    const device = devices.find((d) => d.kNumber === kNumber) || null;

    if (!device) {
      return { device: null, predicates: [], dependents: [] };
    }

    // Find predicate devices
    const predicates = device.predicateDevices
      .map((predKNumber) => devices.find((d) => d.kNumber === predKNumber))
      .filter(Boolean) as FDADevice[];

    // Find dependent devices (devices that use this device as predicate)
    const dependents = devices.filter((d) =>
      d.predicateDevices.includes(kNumber),
    );

    return { device, predicates, dependents };
  }
}

/**
 * Default data provider instance
 * Use this for consistency across the application
 */
export const dataProvider = DataProvider.getInstance();
