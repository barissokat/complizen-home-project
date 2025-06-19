/**
 * DeviceDetailsPanel Component
 *
 * Displays detailed information for selected FDA medical device
 * Responsive: Desktop side panel, mobile modal overlay
 *
 * Used in: Dashboard layout when device is selected
 * Dependencies: Zustand store, shadcn/ui components
 */

"use client";

import { X } from "lucide-react";
import { useGraphStore } from "@/stores";
import { Button } from "@/components/atoms/ui/button";
import { mockDevices } from "@/lib/mock-data";

/**
 * Device details panel component
 *
 * Features:
 * - Responsive design (side panel/modal)
 * - Device information display
 * - Predicate devices list
 * - Close functionality
 */
export default function DeviceDetailsPanel() {
  // Store integration - reactive to selected device
  const { selectedNodeId, clearSelection } = useGraphStore();

  // Find selected device from mock data
  const selectedDevice = selectedNodeId
    ? mockDevices.find((device) => device.kNumber === selectedNodeId)
    : null;

  // Don't render if no device selected
  if (!selectedDevice) {
    return null;
  }

  /**
   * Handle panel close
   * Clears selected device from store
   */
  const handleClose = () => {
    clearSelection();
  };

  return (
    <>
      {/* Mobile Overlay Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 md:hidden"
        onClick={handleClose}
      />

      {/* Panel Container - Responsive */}
      <div
        className="
        fixed top-0 right-0 h-full w-full max-w-md
        bg-white border-l shadow-xl z-50
        transform transition-transform duration-300 ease-in-out
        md:relative md:w-96 md:border-l-2 md:shadow-lg
        overflow-y-auto
      "
      >
        {/* Panel Header */}
        <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            Device Details
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Panel Content */}
        <div className="p-4 space-y-6">
          {/* Basic Device Information */}
          <section>
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">
              Basic Information
            </h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  K-Number
                </label>
                <p className="mt-1 text-sm text-gray-900 font-mono bg-gray-50 px-2 py-1 rounded">
                  {selectedDevice.kNumber}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">
                  Device Name
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {selectedDevice.deviceName}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">
                  Manufacturer
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {selectedDevice.manufacturer}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Class
                  </label>
                  <p className="mt-1">
                    <span
                      className={`
                      inline-block px-2 py-1 rounded-full text-xs font-medium
                      ${selectedDevice.productClass === "I" ? "bg-green-100 text-green-800" : ""}
                      ${selectedDevice.productClass === "II" ? "bg-amber-100 text-amber-800" : ""}
                      ${selectedDevice.productClass === "III" ? "bg-red-100 text-red-800" : ""}
                    `}
                    >
                      Class {selectedDevice.productClass}
                    </span>
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Clearance Date
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {new Date(
                      selectedDevice.clearanceDate,
                    ).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Technical Information */}
          <section>
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">
              Technical Details
            </h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Product Code
                </label>
                <p className="mt-1 text-sm text-gray-900 font-mono bg-gray-50 px-2 py-1 rounded">
                  {selectedDevice.productCode}
                </p>
              </div>

              {selectedDevice.panelType && (
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Panel Type
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {selectedDevice.panelType}
                  </p>
                </div>
              )}

              {selectedDevice.regulationNumber && (
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Regulation Number
                  </label>
                  <p className="mt-1 text-sm text-gray-900 font-mono bg-gray-50 px-2 py-1 rounded">
                    {selectedDevice.regulationNumber}
                  </p>
                </div>
              )}
            </div>
          </section>

          {/* Intended Use */}
          {selectedDevice.intendedUse && (
            <section>
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">
                Intended Use
              </h3>
              <p className="text-sm text-gray-900 leading-relaxed bg-blue-50 p-3 rounded-lg">
                {selectedDevice.intendedUse}
              </p>
            </section>
          )}

          {/* Predicate Devices */}
          <section>
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">
              Predicate Devices ({selectedDevice.predicateDevices.length})
            </h3>
            {selectedDevice.predicateDevices.length > 0 ? (
              <div className="space-y-2">
                {selectedDevice.predicateDevices.map((predicateKNumber) => {
                  const predicateDevice = mockDevices.find(
                    (d) => d.kNumber === predicateKNumber,
                  );
                  return (
                    <div
                      key={predicateKNumber}
                      className="p-3 bg-gray-50 rounded-lg border border-gray-200"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-mono text-gray-600">
                          {predicateKNumber}
                        </span>
                        {predicateDevice && (
                          <span
                            className={`
                            inline-block px-2 py-1 rounded-full text-xs font-medium
                            ${predicateDevice.productClass === "I" ? "bg-green-100 text-green-800" : ""}
                            ${predicateDevice.productClass === "II" ? "bg-amber-100 text-amber-800" : ""}
                            ${predicateDevice.productClass === "III" ? "bg-red-100 text-red-800" : ""}
                          `}
                          >
                            Class {predicateDevice.productClass}
                          </span>
                        )}
                      </div>
                      {predicateDevice && (
                        <p className="mt-1 text-sm text-gray-700">
                          {predicateDevice.deviceName}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-gray-500 italic bg-gray-50 p-3 rounded-lg">
                This is a root device with no predicate devices (likely the
                first of its type).
              </p>
            )}
          </section>
        </div>
      </div>
    </>
  );
}
