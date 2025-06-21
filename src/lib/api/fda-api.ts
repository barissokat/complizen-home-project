/**
 * FDA API Client Implementation
 *
 * Handles real OpenFDA 510(k) device data fetching with comprehensive
 * error handling and fallback to mock data strategy.
 *
 * Features:
 * - Rate limiting compliance (1000 requests/day)
 * - Search parameter mapping and validation
 * - Data transformation from OpenFDA to FDADevice format
 * - Graceful degradation to mock data on failures
 * - Request/response logging for debugging
 */

import { BaseAPIClient } from "./base-client";
import { FDADevice, DeviceFilters, ProductClass } from "@/types/fda";
import { mockDevices } from "@/lib/mock-data";
import { validateEnvironment } from "@/lib/config/environment";

// OpenFDA API Response Types
// Based on real OpenFDA 510(k) API response structure
interface OpenFDAResponse {
  meta: {
    disclaimer: string;
    terms: string;
    license: string;
    last_updated: string;
    results: {
      skip: number;
      limit: number;
      total: number;
    };
  };
  results: OpenFDADevice[];
}

interface OpenFDADevice {
  k_number: string;
  device_name: string;
  applicant: string;
  date_received: string;
  decision_date: string;
  decision_description: string;
  clearance_type: string;
  product_code: string;
  statement_or_summary: string;
  type: string;
  advisory_committee: string;
  advisory_committee_description: string;
  openfda?: {
    device_name?: string;
    medical_specialty_description?: string;
    regulation_number?: string;
    device_class?: string;
    product_code?: string;
    device_classification?: string;
  };
  predicate_devices?: Array<{
    k_number: string;
    device_name?: string;
  }>;
}

// Search parameter mapping for OpenFDA API
interface OpenFDASearchParams {
  search?: string;
  limit?: number;
  skip?: number;
  count?: string;
}

/**
 * FDA API Client
 *
 * Provides methods to fetch and search FDA 510(k) device data
 * with automatic fallback to mock data on failures
 */
export class FDAAPIClient extends BaseAPIClient {
  private readonly BASE_URL = "https://api.fda.gov/device/510k.json";
  private readonly MAX_LIMIT = 1000; // OpenFDA API limit per request
  private readonly DEFAULT_LIMIT = 100;

  constructor() {
    super();

    // Validate environment configuration on initialization
    const config = validateEnvironment();
    if (!config.isValid) {
      console.warn(
        "FDA API Client: Environment validation failed, will use mock data fallback",
      );
    }
  }

  /**
   * Fetch FDA devices with search and filter support
   *
   * @param filters - Search criteria and pagination options
   * @returns Promise with FDA devices or fallback to mock data
   */
  async fetchDevices(filters: DeviceFilters = {}): Promise<{
    devices: FDADevice[];
    total: number;
    source: "api" | "mock";
    error?: Error;
  }> {
    try {
      // Check if we should use API or fallback immediately
      const validation = validateEnvironment();
      if (validation.config.dataMode === "mock") {
        console.log("FDA API Client: Using mock data mode");
        return this.getMockResponse(filters);
      }

      // FDA API is public, we can use it without API key (just lower rate limits)
      if (validation.config.dataMode === "api") {
        console.log("FDA API Client: Using real FDA API (public access)");
      }

      // Build search parameters
      const searchParams = this.buildSearchParams(filters);

      // Make API request with rate limiting check
      this.checkRateLimit();

      const url = this.buildURL(searchParams);

      if (validation.config.debugApi) {
        console.log("FDA API Client: Making request to:", url);
      }

      const response = await this.makeRequest<OpenFDAResponse>(url);

      // Transform OpenFDA response to our FDADevice format
      const transformedDevices = this.transformDevices(response.data.results);

      if (validation.config.debugApi) {
        console.log(
          `FDA API Client: Successfully fetched ${transformedDevices.length} devices`,
        );
      }

      return {
        devices: transformedDevices,
        total: response.data.meta.results.total,
        source: "api",
      };
    } catch (error) {
      console.error("FDA API Client: Request failed:", error);

      // Graceful fallback to mock data
      const mockResponse = this.getMockResponse(filters);
      return {
        ...mockResponse,
        error: error instanceof Error ? error : new Error("Unknown API error"),
      };
    }
  }

  /**
   * Search for devices by name or manufacturer
   *
   * @param query - Search term
   * @param limit - Maximum number of results
   * @returns Promise with matching devices or mock fallback
   */
  async searchDevices(
    query: string,
    limit: number = 50,
  ): Promise<{
    devices: FDADevice[];
    total: number;
    source: "api" | "mock";
    error?: Error;
  }> {
    return this.fetchDevices({
      searchTerm: query,
      limit: Math.min(limit, this.MAX_LIMIT),
    });
  }

  /**
   * Get device details by K-number
   *
   * @param kNumber - FDA K-number (e.g., "K123456")
   * @returns Promise with device details or mock fallback
   */
  async getDeviceByKNumber(kNumber: string): Promise<{
    device: FDADevice | null;
    source: "api" | "mock";
    error?: Error;
  }> {
    try {
      const result = await this.fetchDevices({ searchTerm: kNumber, limit: 1 });

      const device = result.devices.find((d) => d.kNumber === kNumber);

      return {
        device: device || null,
        source: result.source,
        error: result.error,
      };
    } catch (error) {
      console.error(
        `FDA API Client: Failed to fetch device ${kNumber}:`,
        error,
      );

      // Fallback to mock data search
      const mockDevice = mockDevices.find((d) => d.kNumber === kNumber);

      return {
        device: mockDevice || null,
        source: "mock",
        error: error instanceof Error ? error : new Error("Unknown API error"),
      };
    }
  }

  /**
   * Build OpenFDA API search parameters from our filters
   */
  private buildSearchParams(filters: DeviceFilters): OpenFDASearchParams {
    const params: OpenFDASearchParams = {
      limit: Math.min(filters.limit || this.DEFAULT_LIMIT, this.MAX_LIMIT),
    };

    // Build search query string
    const searchCriteria: string[] = [];

    // Search term in device name or applicant
    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase().trim();
      searchCriteria.push(
        `(device_name:"${term}" OR applicant:"${term}" OR k_number:"${term}")`,
      );
    }

    // Product class filter
    if (filters.productClass && filters.productClass.length > 0) {
      const classFilters = filters.productClass.map(
        (cls) => `openfda.device_class:"${cls}"`,
      );
      searchCriteria.push(`(${classFilters.join(" OR ")})`);
    }

    // Date range filter
    if (filters.dateRange) {
      searchCriteria.push(
        `decision_date:[${filters.dateRange.from} TO ${filters.dateRange.to}]`,
      );
    }

    // Manufacturer filter
    if (filters.manufacturer && filters.manufacturer.length > 0) {
      const mfgFilters = filters.manufacturer.map(
        (mfg) => `applicant:"${mfg}"`,
      );
      searchCriteria.push(`(${mfgFilters.join(" OR ")})`);
    }

    // Combine all search criteria
    if (searchCriteria.length > 0) {
      params.search = searchCriteria.join(" AND ");
    }

    return params;
  }

  /**
   * Build complete API URL with parameters
   */
  private buildURL(params: OpenFDASearchParams): string {
    const url = new URL(this.BASE_URL);

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        url.searchParams.append(key, value.toString());
      }
    });

    return url.toString();
  }

  /**
   * Transform OpenFDA device data to our FDADevice format
   */
  private transformDevices(openFDADevices: OpenFDADevice[]): FDADevice[] {
    return openFDADevices.map((device) => this.transformDevice(device));
  }

  /**
   * Transform single OpenFDA device to FDADevice format
   */
  private transformDevice(openFDADevice: OpenFDADevice): FDADevice {
    // Extract predicate devices
    const predicateDevices = (openFDADevice.predicate_devices || [])
      .map((pred) => pred.k_number)
      .filter(Boolean);

    // Map device class
    const productClass = this.mapProductClass(
      openFDADevice.openfda?.device_class,
    );

    return {
      kNumber: openFDADevice.k_number,
      deviceName: openFDADevice.device_name || "Unknown Device",
      manufacturer: openFDADevice.applicant || "Unknown Manufacturer",
      clearanceDate:
        openFDADevice.decision_date || openFDADevice.date_received || "",
      productClass,
      productCode:
        openFDADevice.product_code || openFDADevice.openfda?.product_code || "",
      predicateDevices,
      intendedUse:
        openFDADevice.statement_or_summary || "No description available",
      panelType: openFDADevice.advisory_committee || undefined,
      regulationNumber: openFDADevice.openfda?.regulation_number || undefined,
    };
  }

  /**
   * Map OpenFDA device class to our ProductClass type
   */
  private mapProductClass(deviceClass?: string): ProductClass {
    switch (deviceClass) {
      case "1":
      case "I":
        return "I";
      case "2":
      case "II":
        return "II";
      case "3":
      case "III":
        return "III";
      default:
        return "II"; // Default to Class II if unknown
    }
  }

  /**
   * Get filtered mock data response
   */
  private getMockResponse(filters: DeviceFilters): {
    devices: FDADevice[];
    total: number;
    source: "mock";
  } {
    let filteredDevices = [...mockDevices];

    // Apply search term filter
    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      filteredDevices = filteredDevices.filter(
        (device) =>
          device.deviceName.toLowerCase().includes(term) ||
          device.manufacturer.toLowerCase().includes(term) ||
          device.kNumber.toLowerCase().includes(term),
      );
    }

    // Apply product class filter
    if (filters.productClass && filters.productClass.length > 0) {
      filteredDevices = filteredDevices.filter((device) =>
        filters.productClass!.includes(device.productClass),
      );
    }

    // Apply manufacturer filter
    if (filters.manufacturer && filters.manufacturer.length > 0) {
      filteredDevices = filteredDevices.filter((device) =>
        filters.manufacturer!.some((mfg) =>
          device.manufacturer.toLowerCase().includes(mfg.toLowerCase()),
        ),
      );
    }

    // Apply limit
    if (filters.limit) {
      filteredDevices = filteredDevices.slice(0, filters.limit);
    }

    return {
      devices: filteredDevices,
      total: filteredDevices.length,
      source: "mock",
    };
  }
}

// Singleton instance for app-wide use
export const fdaAPIClient = new FDAAPIClient();
