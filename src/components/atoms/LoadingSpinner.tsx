/**
 * LoadingSpinner Component
 *
 * Simple, reusable loading spinner for data fetching states
 * Used in: FDA data hooks, search states, API loading
 */

import React from "react";

interface LoadingSpinnerProps {
  /** Size of the spinner */
  size?: "sm" | "md" | "lg";
  /** Custom text to display */
  text?: string;
  /** Show text below spinner */
  showText?: boolean;
  /** Custom className for styling */
  className?: string;
}

const sizeClasses = {
  sm: "w-4 h-4",
  md: "w-6 h-6",
  lg: "w-8 h-8",
};

const textSizeClasses = {
  sm: "text-xs",
  md: "text-sm",
  lg: "text-base",
};

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = "md",
  text = "Loading...",
  showText = true,
  className = "",
}) => {
  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      {/* Spinner */}
      <div
        className={`${sizeClasses[size]} animate-spin rounded-full border-2 border-gray-300 border-t-blue-600`}
        role="status"
        aria-label="Loading"
      />

      {/* Loading Text */}
      {showText && (
        <span className={`mt-2 text-gray-600 ${textSizeClasses[size]}`}>
          {text}
        </span>
      )}
    </div>
  );
};

export default LoadingSpinner;
