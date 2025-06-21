/**
 * Environment Configuration & Validation
 *
 * Handles FDA API configuration and validates environment variables
 * Provides fallback strategies for missing configuration
 */

export type DataMode = "mock" | "api" | "hybrid";

export interface EnvironmentConfig {
  fdaApiBaseUrl: string;
  fdaApiKey?: string;
  dataMode: DataMode;
  rateLimit: number;
  cacheTime: number;
  debugApi: boolean;
  showDataSource: boolean;
}

/**
 * Default configuration values
 * Used as fallback when environment variables are missing
 */
const DEFAULT_CONFIG: EnvironmentConfig = {
  fdaApiBaseUrl: "https://api.fda.gov/device/510k.json",
  fdaApiKey: undefined,
  dataMode: "mock", // Safe default for development
  rateLimit: 1000,
  cacheTime: 5,
  debugApi: true,
  showDataSource: true,
};

/**
 * Validates and returns environment configuration
 *
 * @returns Validated environment configuration with fallbacks
 */
export const getEnvironmentConfig = (): EnvironmentConfig => {
  // Get environment variables with fallbacks
  const config: EnvironmentConfig = {
    fdaApiBaseUrl: process.env.FDA_API_BASE_URL || DEFAULT_CONFIG.fdaApiBaseUrl,
    fdaApiKey: process.env.FDA_API_KEY || DEFAULT_CONFIG.fdaApiKey,
    dataMode:
      (process.env.NEXT_PUBLIC_DATA_MODE as DataMode) ||
      DEFAULT_CONFIG.dataMode,
    rateLimit: parseInt(process.env.FDA_API_RATE_LIMIT || "1000"),
    cacheTime: parseInt(process.env.FDA_API_CACHE_TIME || "5"),
    debugApi: process.env.NEXT_PUBLIC_DEBUG_API === "true",
    showDataSource: process.env.NEXT_PUBLIC_SHOW_DATA_SOURCE === "true",
  };

  // Validate data mode
  if (!["mock", "api", "hybrid"].includes(config.dataMode)) {
    console.warn(
      `Invalid DATA_MODE: ${config.dataMode}, falling back to 'mock'`,
    );
    config.dataMode = "mock";
  }

  return config;
};

/**
 * Validates environment setup and logs warnings for missing configuration
 *
 * @returns Validation result with recommendations
 */
export const validateEnvironment = () => {
  const config = getEnvironmentConfig();
  const warnings: string[] = [];
  const recommendations: string[] = [];

  // Check for missing FDA API key (warnings only, not blocking)
  if (config.dataMode !== "mock" && !config.fdaApiKey) {
    warnings.push("FDA_API_KEY is not set");
    recommendations.push(
      "Get API key from https://open.fda.gov/apis/authentication/ for higher rate limits",
    );
    recommendations.push(
      "Rate limits: Without API key = 1,000 requests/day, With API key = 120,000 requests/day",
    );
  }

  // FDA API is public, so API mode works without key (just with lower rate limits)
  // Development: 1,000 requests/day sufficient for testing
  // Production: API key essential (120,000 vs 1,000 requests/day)

  /*
   * PRODUCTION DEPLOYMENT NOTE:
   * For production deployment, uncomment the following validation:
   *
   * if (config.dataMode === "api" && !config.fdaApiKey) {
   *   warnings.push("Production API mode requires FDA_API_KEY for scale");
   *   recommendations.push("Set FDA_API_KEY environment variable for production");
   *   return { isValid: false, warnings, recommendations, config };
   * }
   */

  // Log environment status
  if (config.debugApi) {
    console.log("🔧 Environment Configuration:", {
      dataMode: config.dataMode,
      hasApiKey: !!config.fdaApiKey,
      rateLimit: config.rateLimit,
      cacheTime: config.cacheTime,
    });

    if (warnings.length > 0) {
      console.warn("⚠️ Environment Warnings:", warnings);
    }

    if (recommendations.length > 0) {
      console.info("💡 Recommendations:", recommendations);
    }
  }

  return {
    isValid: true, // FDA API is public, always valid
    warnings,
    recommendations,
    config,
  };
};

/**
 * Determines if API should be used based on environment and availability
 *
 * @returns Whether API should be attempted
 */
export const shouldUseAPI = (): boolean => {
  const config = getEnvironmentConfig();

  switch (config.dataMode) {
    case "mock":
      return false;
    case "api":
      return true;
    case "hybrid":
      // Use API if available, otherwise fall back to mock
      return !!config.fdaApiKey;
    default:
      return false;
  }
};

/**
 * Get data source description for UI display
 *
 * @returns Human-readable data source description
 */
export const getDataSourceDescription = (): string => {
  const config = getEnvironmentConfig();

  switch (config.dataMode) {
    case "mock":
      return "Using mock data for development";
    case "api":
      return config.fdaApiKey
        ? "Using FDA API with authentication"
        : "Using FDA API without authentication (limited)";
    case "hybrid":
      return config.fdaApiKey
        ? "Using FDA API with mock data fallback"
        : "Using mock data (API key not available)";
    default:
      return "Unknown data source configuration";
  }
};
