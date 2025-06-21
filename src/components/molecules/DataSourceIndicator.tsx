/**
 * Data Source Indicator Component
 *
 * Shows current data source (mock/API) and environment configuration
 * Useful for debugging and development
 */

import { useState, useEffect } from "react";
import { dataProvider } from "@/lib/data/data-provider";
import { validateEnvironment } from "@/lib/config/environment";

interface DataSourceInfo {
  description: string;
  mode: "mock" | "api" | "hybrid";
  shouldUseAPI: boolean;
  mockDataStats: {
    totalDevices: number;
    rootDevices: number;
    classDistribution: { classI: number; classII: number; classIII: number };
    totalPredicateRelationships: number;
    avgPredicatesPerDevice: string;
    uniqueManufacturers: number;
    dateRange: { earliest: string; latest: string };
  };
  config: {
    hasApiKey: boolean;
    rateLimit: number;
    cacheTime: number;
    debugMode: boolean;
  };
}

/**
 * Data Source Indicator Component
 *
 * Displays current data source configuration for debugging
 */
export const DataSourceIndicator = () => {
  const [sourceInfo, setSourceInfo] = useState<DataSourceInfo | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Validate environment and log configuration
    validateEnvironment();

    // Get data source information
    const info = dataProvider.getDataSourceInfo();
    setSourceInfo(info);

    // Show indicator if debug mode is enabled
    setIsVisible(info.config.debugMode);
  }, []);

  // Don't render if not in debug mode or no source info
  if (!isVisible || !sourceInfo) {
    return null;
  }

  const getSourceIcon = () => {
    switch (sourceInfo.mode) {
      case "mock":
        return "🧪";
      case "api":
        return "🌐";
      case "hybrid":
        return "🔄";
      default:
        return "❓";
    }
  };

  const getSourceColor = () => {
    switch (sourceInfo.mode) {
      case "mock":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "api":
        return "bg-green-100 text-green-800 border-green-200";
      case "hybrid":
        return "bg-orange-100 text-orange-800 border-orange-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50">
      <div
        className={`
        px-3 py-2 rounded-lg border text-xs font-medium
        ${getSourceColor()}
        shadow-sm backdrop-blur-sm
      `}
      >
        <div className="flex items-center gap-2">
          <span className="text-sm">{getSourceIcon()}</span>
          <div>
            <div className="font-semibold">
              Data Source: {sourceInfo.mode.toUpperCase()}
            </div>
            <div className="text-xs opacity-75">{sourceInfo.description}</div>
            <div className="text-xs opacity-60 mt-1">
              {sourceInfo.mockDataStats.totalDevices} devices loaded
              {sourceInfo.config.hasApiKey ? " • API Key: ✓" : " • API Key: ✗"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
