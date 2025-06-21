/**
 * Base API Client
 *
 * Foundation for HTTP requests with error handling and rate limiting
 * Designed for FDA API integration but can be extended for other APIs
 */

import { getEnvironmentConfig } from "@/lib/config/environment";

export interface APIError extends Error {
  status?: number;
  code?: string;
  details?: unknown;
}

export interface APIResponse<T = unknown> {
  data: T;
  status: number;
  source: "api" | "mock" | "cache";
  timestamp: number;
}

/**
 * Rate Limiter for API requests
 * Prevents exceeding FDA API rate limits
 */
class RateLimiter {
  private requests: number[] = [];
  private readonly maxRequests: number;
  private readonly windowMs: number;

  constructor(maxRequests: number, windowMs: number = 24 * 60 * 60 * 1000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
  }

  /**
   * Check if a request can be made within rate limits
   *
   * @returns Whether request is allowed
   */
  canMakeRequest(): boolean {
    const now = Date.now();

    // Remove old requests outside the window
    this.requests = this.requests.filter((time) => now - time < this.windowMs);

    // Check if we can make another request
    return this.requests.length < this.maxRequests;
  }

  /**
   * Record a new request
   */
  recordRequest(): void {
    this.requests.push(Date.now());
  }

  /**
   * Get current rate limit status
   *
   * @returns Rate limit information
   */
  getStatus() {
    const now = Date.now();
    this.requests = this.requests.filter((time) => now - time < this.windowMs);

    return {
      remaining: Math.max(0, this.maxRequests - this.requests.length),
      total: this.maxRequests,
      resetTime:
        this.requests.length > 0
          ? new Date(this.requests[0] + this.windowMs)
          : new Date(),
    };
  }
}

/**
 * Base API Client Class
 *
 * Provides foundation for HTTP requests with:
 * - Error handling and recovery
 * - Rate limiting
 * - Request/response logging
 * - Timeout management
 */
export class BaseAPIClient {
  protected baseURL: string;
  protected apiKey?: string;
  protected rateLimiter: RateLimiter;
  protected config = getEnvironmentConfig();

  constructor() {
    this.baseURL = this.config.fdaApiBaseUrl;
    this.apiKey = this.config.fdaApiKey;
    this.rateLimiter = new RateLimiter(this.config.rateLimit);
  }

  /**
   * Create API Error with additional context
   *
   * @param message - Error message
   * @param status - HTTP status code
   * @param details - Additional error details
   * @returns Formatted API error
   */
  protected createError(
    message: string,
    status?: number,
    details?: unknown,
  ): APIError {
    const error = new Error(message) as APIError;
    error.status = status;
    error.details = details;
    error.code = status ? `HTTP_${status}` : "API_ERROR";

    return error;
  }

  /**
   * Build request headers with authentication
   *
   * @returns HTTP headers object
   */
  protected getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "User-Agent": "Complizen-FDA-Device-Graph/1.0",
    };

    // Add API key if available
    if (this.apiKey) {
      headers["Authorization"] = `Bearer ${this.apiKey}`;
    }

    return headers;
  }

  /**
   * Check rate limits before making request
   *
   * @throws APIError if rate limit exceeded
   */
  protected checkRateLimit(): void {
    if (!this.rateLimiter.canMakeRequest()) {
      const status = this.rateLimiter.getStatus();
      const resetTime = status.resetTime.toLocaleString();

      throw this.createError(
        `Rate limit exceeded. Resets at ${resetTime}`,
        429,
        { rateLimit: status },
      );
    }
  }

  /**
   * Log API request for debugging
   *
   * @param method - HTTP method
   * @param url - Request URL
   * @param params - Request parameters
   */
  protected logRequest(method: string, url: string, params?: unknown): void {
    if (this.config.debugApi) {
      console.log(`🌐 API Request: ${method} ${url}`, params ? { params } : "");
    }
  }

  /**
   * Log API response for debugging
   *
   * @param response - API response
   * @param duration - Request duration in ms
   */
  protected logResponse<T>(response: APIResponse<T>, duration: number): void {
    if (this.config.debugApi) {
      console.log(`✅ API Response: ${response.status} (${duration}ms)`, {
        source: response.source,
        dataLength: Array.isArray(response.data) ? response.data.length : "N/A",
      });
    }
  }

  /**
   * Log API error for debugging
   *
   * @param error - API error
   * @param duration - Request duration in ms
   */
  protected logError(error: APIError, duration: number): void {
    if (this.config.debugApi) {
      console.error(`❌ API Error: ${error.message} (${duration}ms)`, {
        status: error.status,
        code: error.code,
      });
    }
  }

  /**
   * Make HTTP request with error handling and rate limiting
   *
   * @param url - Request URL
   * @param options - Fetch options
   * @returns Promise with API response
   * @throws APIError on request failure
   */
  protected async makeRequest<T>(
    url: string,
    options: RequestInit = {},
  ): Promise<APIResponse<T>> {
    const startTime = Date.now();

    try {
      // Check rate limits
      this.checkRateLimit();

      // Record request for rate limiting
      this.rateLimiter.recordRequest();

      // Log request
      this.logRequest(options.method || "GET", url, options.body);

      // Make HTTP request with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

      const response = await fetch(url, {
        ...options,
        headers: {
          ...this.getHeaders(),
          ...options.headers,
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Handle HTTP errors
      if (!response.ok) {
        throw this.createError(
          `HTTP ${response.status}: ${response.statusText}`,
          response.status,
          { url },
        );
      }

      // Parse response data
      const data = await response.json();
      const apiResponse: APIResponse<T> = {
        data,
        status: response.status,
        source: "api",
        timestamp: Date.now(),
      };

      // Log successful response
      this.logResponse(apiResponse, Date.now() - startTime);

      return apiResponse;
    } catch (error) {
      const duration = Date.now() - startTime;

      // Handle different error types
      if (error instanceof TypeError && error.message.includes("fetch")) {
        const networkError = this.createError(
          "Network error - check internet connection",
          0,
          error,
        );
        this.logError(networkError, duration);
        throw networkError;
      }

      if (
        error &&
        typeof error === "object" &&
        "name" in error &&
        error.name === "AbortError"
      ) {
        const timeoutError = this.createError(
          "Request timeout after 10 seconds",
          408,
          error,
        );
        this.logError(timeoutError, duration);
        throw timeoutError;
      }

      // Re-throw API errors as-is
      if (error instanceof Error && "status" in error) {
        this.logError(error as APIError, duration);
        throw error;
      }

      // Wrap unknown errors
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      const unknownError = this.createError(
        `Unknown API error: ${errorMessage}`,
        undefined,
        error instanceof Error ? error : String(error),
      );
      this.logError(unknownError, duration);
      throw unknownError;
    }
  }

  /**
   * Get rate limit status
   *
   * @returns Current rate limit information
   */
  public getRateLimitStatus() {
    return this.rateLimiter.getStatus();
  }

  /**
   * Get client configuration
   *
   * @returns Current client configuration
   */
  public getConfig() {
    return {
      baseURL: this.baseURL,
      hasApiKey: !!this.apiKey,
      dataMode: this.config.dataMode,
      rateLimit: this.config.rateLimit,
    };
  }
}
