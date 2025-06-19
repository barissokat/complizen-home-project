/**
 * TEMPORARY: Store Test Component
 *
 * This component is for testing Zustand store functionality
 * Will be removed after store integration is confirmed
 */

"use client";

import { useGraphStore } from "@/stores";

/**
 * Simple component to test store state and actions
 * Shows current store values and provides buttons to test mutations
 */
export default function StoreTest() {
  const {
    selectedNodeId,
    searchTerm,
    filteredDevices,
    isSearching,
    setSelectedNode,
    setSearchTerm,
    setIsSearching,
    clearSelection,
    clearSearch,
    resetStore,
  } = useGraphStore();

  return (
    <div className="p-6 bg-gray-100 rounded-lg space-y-4">
      <h3 className="text-lg font-semibold">Store Test Panel</h3>

      {/* Current State Display */}
      <div className="bg-white p-4 rounded border">
        <h4 className="font-medium mb-2">Current State:</h4>
        <pre className="text-sm text-gray-600">
          {JSON.stringify(
            {
              selectedNodeId,
              searchTerm,
              filteredDevicesCount: filteredDevices.length,
              isSearching,
            },
            null,
            2,
          )}
        </pre>
      </div>

      {/* Test Actions */}
      <div className="space-y-2">
        <h4 className="font-medium">Test Actions:</h4>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedNode("K123456")}
            className="px-3 py-1 bg-blue-500 text-white rounded text-sm"
          >
            Select Node K123456
          </button>

          <button
            onClick={() => setSearchTerm("test search")}
            className="px-3 py-1 bg-green-500 text-white rounded text-sm"
          >
            Set Search Term
          </button>

          <button
            onClick={() => setIsSearching(!isSearching)}
            className="px-3 py-1 bg-orange-500 text-white rounded text-sm"
          >
            Toggle Searching
          </button>

          <button
            onClick={clearSelection}
            className="px-3 py-1 bg-red-500 text-white rounded text-sm"
          >
            Clear Selection
          </button>

          <button
            onClick={clearSearch}
            className="px-3 py-1 bg-purple-500 text-white rounded text-sm"
          >
            Clear Search
          </button>

          <button
            onClick={resetStore}
            className="px-3 py-1 bg-gray-500 text-white rounded text-sm"
          >
            Reset Store
          </button>
        </div>
      </div>
    </div>
  );
}
