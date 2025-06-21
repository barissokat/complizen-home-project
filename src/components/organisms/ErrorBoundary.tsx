/**
 * ErrorBoundary Component
 *
 * Provides global error handling for the FDA Device Graph application
 * with graceful fallback to mock data and user-friendly error messages.
 *
 * Features:
 * - Catches JavaScript errors anywhere in child component tree
 * - Provides fallback UI with option to retry or use mock data
 * - Logs errors for debugging and monitoring
 * - Professional error messaging for different error types
 */

"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCw, Database, Bug } from "lucide-react";
import { Button } from "@/components/atoms/ui/button";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  retryCount: number;
}

/**
 * Error categorization for better user messaging
 */
const getErrorCategory = (
  error: Error,
): {
  type: "api" | "network" | "validation" | "unknown";
  title: string;
  description: string;
  canRetry: boolean;
  canUseMockData: boolean;
} => {
  const message = error.message.toLowerCase();

  if (
    message.includes("fetch") ||
    message.includes("network") ||
    message.includes("api")
  ) {
    return {
      type: "api",
      title: "API Connection Error",
      description:
        "Unable to connect to the FDA API. This might be due to network issues or API limitations.",
      canRetry: true,
      canUseMockData: true,
    };
  }

  if (message.includes("rate limit") || message.includes("429")) {
    return {
      type: "api",
      title: "Rate Limit Exceeded",
      description:
        "The FDA API rate limit has been exceeded. Please try again later or use mock data.",
      canRetry: false,
      canUseMockData: true,
    };
  }

  if (message.includes("validation") || message.includes("invalid")) {
    return {
      type: "validation",
      title: "Data Validation Error",
      description:
        "The received data format is invalid. Using mock data as fallback.",
      canRetry: false,
      canUseMockData: true,
    };
  }

  return {
    type: "unknown",
    title: "Unexpected Error",
    description:
      "An unexpected error occurred. Please refresh the page or contact support.",
    canRetry: true,
    canUseMockData: false,
  };
};

export class ErrorBoundary extends Component<Props, State> {
  private retryTimeoutId: NodeJS.Timeout | null = null;

  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: 0,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error for debugging and monitoring
    console.error("🚨 ErrorBoundary caught an error:", error);
    console.error("📍 Error Info:", errorInfo);

    // Update state with error details
    this.setState({
      error,
      errorInfo,
    });

    // Call optional error handler
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Log to external monitoring service (would be implemented in production)
    this.logErrorToService(error, errorInfo);
  }

  componentWillUnmount() {
    if (this.retryTimeoutId) {
      clearTimeout(this.retryTimeoutId);
    }
  }

  /**
   * Log error to external monitoring service
   * In production, this would integrate with services like Sentry, LogRocket, etc.
   */
  private logErrorToService = (error: Error, errorInfo: ErrorInfo) => {
    // Production implementation would send to monitoring service
    if (process.env.NODE_ENV === "development") {
      console.group("🔍 Error Boundary Debug Info");
      console.log("Error:", error);
      console.log("Component Stack:", errorInfo.componentStack);
      console.log("Error Stack:", error.stack);
      console.groupEnd();
    }
  };

  /**
   * Handle retry action with exponential backoff
   */
  private handleRetry = () => {
    const { retryCount } = this.state;

    if (retryCount >= 3) {
      console.warn("⚠️ Maximum retry attempts reached");
      return;
    }

    // Exponential backoff: 1s, 2s, 4s
    const delayMs = Math.pow(2, retryCount) * 1000;

    console.log(`🔄 Retrying in ${delayMs}ms (attempt ${retryCount + 1}/3)`);

    this.retryTimeoutId = setTimeout(() => {
      this.setState({
        hasError: false,
        error: null,
        errorInfo: null,
        retryCount: retryCount + 1,
      });
    }, delayMs);
  };

  /**
   * Handle mock data fallback
   */
  private handleUseMockData = () => {
    // Set localStorage to force mock data mode
    if (typeof window !== "undefined") {
      localStorage.setItem("FDA_DATA_MODE", "mock");
      localStorage.setItem("ERROR_RECOVERY_MODE", "true");

      // Reload page to reinitialize with mock data
      window.location.reload();
    }
  };

  /**
   * Reset error boundary state
   */
  private handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: 0,
    });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      const errorCategory = getErrorCategory(this.state.error);

      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error boundary UI
      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-card border rounded-lg shadow-lg p-6 text-center space-y-4">
            {/* Error Icon */}
            <div className="flex justify-center">
              {errorCategory.type === "api" ? (
                <AlertTriangle className="h-12 w-12 text-yellow-500" />
              ) : (
                <Bug className="h-12 w-12 text-red-500" />
              )}
            </div>

            {/* Error Title */}
            <h2 className="text-xl font-semibold text-foreground">
              {errorCategory.title}
            </h2>

            {/* Error Description */}
            <p className="text-muted-foreground text-sm leading-relaxed">
              {errorCategory.description}
            </p>

            {/* Development Mode: Error Details */}
            {process.env.NODE_ENV === "development" && (
              <details className="text-left bg-muted p-3 rounded text-xs">
                <summary className="cursor-pointer font-medium mb-2">
                  🔍 Error Details (Development)
                </summary>
                <pre className="whitespace-pre-wrap break-words">
                  {this.state.error.message}
                </pre>
              </details>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col gap-2 pt-2">
              {/* Retry Button */}
              {errorCategory.canRetry && this.state.retryCount < 3 && (
                <Button
                  onClick={this.handleRetry}
                  className="w-full"
                  variant="default"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Retry ({3 - this.state.retryCount} attempts left)
                </Button>
              )}

              {/* Mock Data Fallback Button */}
              {errorCategory.canUseMockData && (
                <Button
                  onClick={this.handleUseMockData}
                  className="w-full"
                  variant="outline"
                >
                  <Database className="h-4 w-4 mr-2" />
                  Use Mock Data
                </Button>
              )}

              {/* Reset Button */}
              <Button
                onClick={this.handleReset}
                className="w-full"
                variant="secondary"
              >
                Reset Application
              </Button>
            </div>

            {/* Help Text */}
            <p className="text-xs text-muted-foreground pt-2">
              If the problem persists, please refresh the page or contact
              support.
            </p>
          </div>
        </div>
      );
    }

    // No error, render children normally
    return this.props.children;
  }
}

/**
 * Hook for triggering error boundary from functional components
 */
export const useErrorHandler = () => {
  return (error: Error, errorInfo?: string) => {
    // Throw error to be caught by ErrorBoundary
    throw new Error(`${error.message}${errorInfo ? ` | ${errorInfo}` : ""}`);
  };
};
