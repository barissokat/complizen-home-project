/**
 * DashboardTemplate Component
 *
 * Client-side wrapper template for the main dashboard page
 * Handles interactive components and state management for the FDA Device Graph
 *
 * Used in: Main dashboard page
 * Dependencies: React Flow, mock data, GraphCanvas
 */

"use client";

import type { DeviceNodeData } from "@/types/graph";
import type { FDADevice } from "@/types/fda";
import { mockDevices, getMockDataStats, getRootDevices } from "@/lib/mock-data";
import { GraphCanvas } from "@/components/organisms/GraphCanvas";

interface DashboardTemplateProps {
  title: string;
  subtitle: string;
  stepInfo: string;
}

export function DashboardTemplate({
  title,
  subtitle,
  stepInfo,
}: DashboardTemplateProps) {
  // Mock data integration - client-side processing
  const mockStats = getMockDataStats();
  const rootDevices = getRootDevices();
  const sampleDevice = mockDevices[0]; // CardioFlow Balloon Catheter

  const testNodeData: DeviceNodeData = {
    label: sampleDevice.deviceName,
    device: sampleDevice,
    isSelected: false,
  };

  // Development logging for verification
  console.log("Mock data loaded:", mockStats);
  console.log("Sample devices:", {
    totalDevices: mockDevices.length,
    rootDevicesCount: rootDevices.length,
    sampleDevice,
    testNodeData,
  });

  // Device selection handler - client-side interaction
  const handleDeviceSelect = (device: FDADevice) => {
    console.log("Device selected:", device.kNumber, device.deviceName);
    // Future: Update store state, show details panel, etc.
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
          <p className="text-gray-600">{subtitle}</p>
          <div className="mt-4 px-4 py-2 bg-green-100 text-green-800 rounded-lg inline-block">
            {stepInfo}
          </div>
        </header>

        <main className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-semibold mb-4">Development Progress</h2>

          {/* Progress indicators */}
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">✓</span>
              </div>
              <span className="text-gray-700">
                Type definitions (FDADevice, GraphNode, GraphEdge)
              </span>
            </div>

            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">✓</span>
              </div>
              <span className="text-gray-700">
                Mock data creation ({mockStats.totalDevices} devices,{" "}
                {mockStats.rootDevices} root)
              </span>
            </div>

            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">✓</span>
              </div>
              <span className="text-gray-700">React Flow canvas setup</span>
            </div>
          </div>

          {/* Interactive Graph Canvas - Client-side component */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4">
              Interactive Device Graph (Step 3)
            </h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <GraphCanvas
                devices={mockDevices}
                onDeviceSelect={handleDeviceSelect}
                height="500px"
              />
            </div>
          </div>

          {/* Statistics and sample data display */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="font-medium text-blue-800 mb-3">
                Mock Data Statistics
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Total Devices:</span>
                  <span className="font-bold">{mockStats.totalDevices}</span>
                </div>
                <div className="flex justify-between">
                  <span>Root Devices:</span>
                  <span className="font-bold">{mockStats.rootDevices}</span>
                </div>
                <div className="flex justify-between">
                  <span>Class I/II/III:</span>
                  <span className="font-bold">
                    {mockStats.classDistribution.classI}/
                    {mockStats.classDistribution.classII}/
                    {mockStats.classDistribution.classIII}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Manufacturers:</span>
                  <span className="font-bold">
                    {mockStats.uniqueManufacturers}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Avg Predicates:</span>
                  <span className="font-bold">
                    {mockStats.avgPredicatesPerDevice}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-gray-800 mb-3">
                Sample Device (Root)
              </h3>
              <div className="space-y-2 text-sm">
                <div>
                  <strong>K-Number:</strong> {sampleDevice.kNumber}
                </div>
                <div>
                  <strong>Name:</strong> {sampleDevice.deviceName}
                </div>
                <div>
                  <strong>Manufacturer:</strong> {sampleDevice.manufacturer}
                </div>
                <div>
                  <strong>Class:</strong> {sampleDevice.productClass}
                </div>
                <div>
                  <strong>Date:</strong> {sampleDevice.clearanceDate}
                </div>
                <div>
                  <strong>Predicates:</strong>{" "}
                  {sampleDevice.predicateDevices.length} (Root device)
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
