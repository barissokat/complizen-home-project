/**
 * Main Dashboard Page
 *
 * Entry point for FDA Device Predicate Graph Visualizer
 * Currently in development - testing type definitions
 */

import type { FDADevice, ProductClass } from "@/types/fda";
import type { DeviceNodeData } from "@/types/graph";

export default function Home() {
  // Test our type definitions - this should compile without errors
  const testDevice: FDADevice = {
    kNumber: "K123456789",
    deviceName: "Test CardioFlow Stent System",
    manufacturer: "Test Medical Inc.",
    clearanceDate: "2023-05-15",
    productClass: "II" as ProductClass,
    productCode: "DTK",
    predicateDevices: ["K111222333"],
    intendedUse: "Treatment of coronary artery disease",
  };

  const testNodeData: DeviceNodeData = {
    label: testDevice.deviceName,
    device: testDevice,
    isSelected: false,
  };

  // Log to console for verification
  console.log("✅ Type definitions working:", { testDevice, testNodeData });

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
          <div className="mt-4 px-4 py-2 bg-blue-100 text-blue-800 rounded-lg inline-block">
            Step 1: Type Definitions - Completed
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
              <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-gray-600 text-sm">2</span>
              </div>
              <span className="text-gray-500">
                Mock data creation (Next step)
              </span>
            </div>

            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-gray-600 text-sm">3</span>
              </div>
              <span className="text-gray-500">React Flow canvas setup</span>
            </div>
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-gray-800 mb-2">
              Test Device Data:
            </h3>
            <pre className="text-sm text-gray-600 overflow-x-auto">
              {JSON.stringify(testDevice, null, 2)}
            </pre>
          </div>
        </main>
      </div>
    </div>
  );
}
