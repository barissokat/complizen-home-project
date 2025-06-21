/**
 * EnvironmentToggle Component
 *
 * Development tool for switching between mock and API data sources
 * Only visible in development mode for testing purposes
 *
 * Features:
 * - Real-time environment switching
 * - Visual feedback for current mode
 * - API key status indication
 * - Rate limit information display
 */

"use client";

import React, { useState, useEffect } from "react";
import {
  validateEnvironment,
  getDataSourceDescription,
} from "@/lib/config/environment";
import {
  Settings,
  Database,
  Cloud,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";

export const EnvironmentToggle: React.FC = () => {
  const [currentMode, setCurrentMode] = useState<string>("mock");
  const [isClient, setIsClient] = useState(false);

  // Hydration safe initialization
  useEffect(() => {
    setIsClient(true);
    const savedMode = localStorage.getItem("FDA_DATA_MODE") || "mock";
    setCurrentMode(savedMode);
  }, []);

  const envConfig = validateEnvironment();
  const dataSourceDescription = getDataSourceDescription();

  // Only show in development and after hydration
  if (process.env.NODE_ENV === "production" || !isClient) {
    return null;
  }

  const handleModeChange = (newMode: "mock" | "api") => {
    // Update localStorage for immediate effect
    localStorage.setItem("FDA_DATA_MODE", newMode);
    setCurrentMode(newMode);

    // Reload page to apply new environment
    window.location.reload();
  };

  const getModeIcon = (mode: string) => {
    switch (mode) {
      case "mock":
        return <Database className="w-4 h-4" />;
      case "api":
        return <Cloud className="w-4 h-4" />;
      default:
        return <Settings className="w-4 h-4" />;
    }
  };

  const getModeColor = (mode: string) => {
    switch (mode) {
      case "mock":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "api":
        return "bg-blue-100 text-blue-700 border-blue-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4 max-w-sm">
      <div className="flex items-center space-x-2 mb-3">
        <Settings className="w-5 h-5 text-gray-600" />
        <h3 className="font-semibold text-gray-900">Development Tools</h3>
      </div>

      {/* Current Status */}
      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-600">
            Current Mode:
          </span>
          <div
            className={`px-2 py-1 rounded-full text-xs font-medium border ${getModeColor(envConfig.config.dataMode)}`}
          >
            <div className="flex items-center space-x-1">
              {getModeIcon(envConfig.config.dataMode)}
              <span>{envConfig.config.dataMode.toUpperCase()}</span>
            </div>
          </div>
        </div>
        <p className="text-xs text-gray-600">{dataSourceDescription}</p>

        {/* API Key Status */}
        <div className="flex items-center space-x-2 mt-2">
          {envConfig.config.fdaApiKey ? (
            <CheckCircle className="w-4 h-4 text-green-500" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-yellow-500" />
          )}
          <span className="text-xs text-gray-600">
            API Key: {envConfig.config.fdaApiKey ? "Available" : "Not Set"}
          </span>
        </div>

        {/* Rate Limits */}
        <div className="text-xs text-gray-500 mt-1">
          Rate Limit: {envConfig.config.fdaApiKey ? "120,000" : "1,000"}{" "}
          requests/day
        </div>
      </div>

      {/* Mode Switcher */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          Switch Data Source:
        </label>

        <div className="grid grid-cols-2 gap-2">
          {/* Mock Mode Button */}
          <button
            onClick={() => handleModeChange("mock")}
            className={`p-2 rounded-lg border text-sm font-medium transition-all duration-200 ${
              currentMode === "mock"
                ? "bg-emerald-100 text-emerald-700 border-emerald-300 ring-2 ring-emerald-200"
                : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
            }`}
          >
            <div className="flex items-center space-x-2">
              <Database className="w-4 h-4" />
              <span>Mock</span>
            </div>
            <div className="text-xs text-gray-500 mt-1">31 devices</div>
          </button>

          {/* API Mode Button */}
          <button
            onClick={() => handleModeChange("api")}
            className={`p-2 rounded-lg border text-sm font-medium transition-all duration-200 ${
              currentMode === "api"
                ? "bg-blue-100 text-blue-700 border-blue-300 ring-2 ring-blue-200"
                : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
            }`}
          >
            <div className="flex items-center space-x-2">
              <Cloud className="w-4 h-4" />
              <span>FDA API</span>
            </div>
            <div className="text-xs text-gray-500 mt-1">171,999 devices</div>
          </button>
        </div>
      </div>

      {/* Warnings */}
      {envConfig.warnings.length > 0 && (
        <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center space-x-2 mb-1">
            <AlertTriangle className="w-4 h-4 text-yellow-600" />
            <span className="text-xs font-medium text-yellow-800">
              Warnings:
            </span>
          </div>
          {envConfig.warnings.map((warning, index) => (
            <div key={index} className="text-xs text-yellow-700">
              • {warning}
            </div>
          ))}
        </div>
      )}

      <div className="mt-3 text-xs text-gray-500">
        💡 Changes require page reload
      </div>
    </div>
  );
};

export default EnvironmentToggle;
