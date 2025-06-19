/**
 * Main Dashboard Page
 *
 * Entry point for FDA Device Predicate Graph Visualizer
 * Currently in development - testing type definitions
 */

import type { DeviceNodeData } from "@/types/graph";
import { mockDevices, getMockDataStats, getRootDevices } from "@/lib/mock-data";

export default function Home() {
  // Test mock data integration
  const mockStats = getMockDataStats();
  const rootDevices = getRootDevices();
  const sampleDevice = mockDevices[0]; // CardioFlow Balloon Catheter

  const testNodeData: DeviceNodeData = {
    label: sampleDevice.deviceName,
    device: sampleDevice,
    isSelected: false,
  };

  // Log to console for verification
  console.log("Mock data loaded:", mockStats);
  console.log("Sample devices:", {
    totalDevices: mockDevices.length,
    rootDevicesCount: rootDevices.length,
    sampleDevice,
    testNodeData,
  });

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            FDA Device Predicate Graph
          </h1>
          <p className="text-gray-600">
            Interactive visualization of 510(k) predicate relationships
          </p>
          <div className="mt-4 px-4 py-2 bg-green-100 text-green-800 rounded-lg inline-block">
            Step 2: Mock Data - {mockStats.totalDevices} devices loaded
          </div>
        </header>

        <main className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-semibold mb-4">Development Progress</h2>

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
              <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-gray-600 text-sm">3</span>
              </div>
              <span className="text-gray-500">React Flow canvas setup</span>
            </div>
          </div>

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
