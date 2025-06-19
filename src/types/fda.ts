/**
 * FDA Device Type Definitions
 *
 * Type definitions for FDA 510(k) medical device data
 * Based on OpenFDA API structure and predicate relationships
 */

/**
 * FDA Product Classification Levels
 * Class I: Low risk devices (e.g., bandages, handheld surgical instruments)
 * Class II: Medium risk devices (e.g., contact lenses, X-ray machines)
 * Class III: High risk devices (e.g., heart valves, implantable pacemakers)
 */
export type ProductClass = "I" | "II" | "III";

/**
 * Core FDA Device Interface
 * Represents a single medical device cleared through 510(k) process
 */
export interface FDADevice {
  /** Unique FDA clearance number (format: K123456789) */
  kNumber: string;

  /** Commercial name of the medical device */
  deviceName: string;

  /** Company that manufactures the device */
  manufacturer: string;

  /** Date when FDA cleared the device (ISO format) */
  clearanceDate: string;

  /** FDA risk classification level */
  productClass: ProductClass;

  /** Three-letter FDA product code */
  productCode: string;

  /** Array of K-numbers for predicate devices used in submission */
  predicateDevices: string[];

  /** Brief description of device's intended medical use */
  intendedUse: string;

  /** Optional: FDA panel that reviewed the device */
  panelType?: string;

  /** Optional: Device regulation number */
  regulationNumber?: string;
}

/**
 * Simplified device data for API responses
 * Used when full device details aren't needed
 */
export interface DeviceSummary {
  kNumber: string;
  deviceName: string;
  manufacturer: string;
  productClass: ProductClass;
}

/**
 * Search and filter criteria for device queries
 */
export interface DeviceFilters {
  /** Search term for device name or manufacturer */
  searchTerm?: string;

  /** Filter by product classification */
  productClass?: ProductClass[];

  /** Filter by date range */
  dateRange?: {
    from: string;
    to: string;
  };

  /** Filter by specific manufacturer */
  manufacturer?: string[];

  /** Limit number of results */
  limit?: number;
}
