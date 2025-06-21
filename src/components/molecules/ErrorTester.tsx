/**
 * ErrorTester Component
 *
 * Development tool for testing error boundary functionality
 * Only visible in development mode for testing different error scenarios
 *
 * Features:
 * - Trigger different types of errors (API, Rate Limit, Network, Validation)
 * - State-based error triggering to properly activate Error Boundary
 * - Professional UI for development testing
 */

"use client";

import React, { useState } from "react";
import { Button } from "@/components/atoms/ui/button";
import { Bug, AlertTriangle, Shield, Wifi } from "lucide-react";

export const ErrorTester: React.FC = () => {
  const [errorType, setErrorType] = useState<string | null>(null);

  // Only render in development
  if (process.env.NODE_ENV === "production") {
    return null;
  }

  // Trigger error on next render based on type
  if (errorType) {
    switch (errorType) {
      case "api":
        throw new Error("API Connection Error - Unable to connect to FDA API");
      case "rateLimit":
        throw new Error("Rate Limit Exceeded - 429");
      case "network":
        throw new Error("fetch failed - network error");
      case "validation":
        throw new Error("Data validation failed - invalid response format");
      default:
        throw new Error("Unexpected error occurred");
    }
  }

  const triggerAPIError = () => {
    setErrorType("api");
  };

  const triggerRateLimitError = () => {
    setErrorType("rateLimit");
  };

  const triggerNetworkError = () => {
    setErrorType("network");
  };

  const triggerValidationError = () => {
    setErrorType("validation");
  };

  return (
    <div className="bg-white border-2 border-red-200 rounded-lg p-4 shadow-lg max-w-xs">
      <div className="flex items-center gap-2 mb-3">
        <Bug className="h-4 w-4 text-red-500" />
        <span className="text-sm font-medium text-red-700">
          Error Boundary Tester
        </span>
      </div>

      <div className="space-y-2">
        <Button
          onClick={triggerAPIError}
          variant="destructive"
          size="sm"
          className="w-full text-xs"
        >
          <AlertTriangle className="h-3 w-3 mr-1" />
          API Error
        </Button>

        <Button
          onClick={triggerRateLimitError}
          variant="destructive"
          size="sm"
          className="w-full text-xs"
        >
          <Shield className="h-3 w-3 mr-1" />
          Rate Limit
        </Button>

        <Button
          onClick={triggerNetworkError}
          variant="destructive"
          size="sm"
          className="w-full text-xs"
        >
          <Wifi className="h-3 w-3 mr-1" />
          Network Error
        </Button>

        <Button
          onClick={triggerValidationError}
          variant="destructive"
          size="sm"
          className="w-full text-xs"
        >
          <Bug className="h-3 w-3 mr-1" />
          Validation Error
        </Button>
      </div>

      <p className="text-xs text-gray-500 mt-2">
        Development only - Test error boundary
      </p>
    </div>
  );
};

export default ErrorTester;
