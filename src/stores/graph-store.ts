/**
 * Graph State Management Store
 *
 * Manages: Selected nodes, search terms, filtered devices
 * Used by: SearchInput, DeviceDetailsPanel, GraphCanvas components
 * Performance: Selective subscriptions to prevent unnecessary re-renders
 */

import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { FDADevice } from "@/types/fda";
import { mockDevices } from "@/lib/mock-data";

/**
 * Graph store state interface
 * Defines all state properties and actions for graph interactions
 */
interface GraphStore {
  // State properties
  selectedNodeId: string | null;
  searchTerm: string;
  filteredDevices: FDADevice[];
  isSearching: boolean;

  // Actions for state updates
  setSelectedNode: (id: string | null) => void;
  setSearchTerm: (term: string) => void;
  setFilteredDevices: (devices: FDADevice[]) => void;
  setIsSearching: (loading: boolean) => void;

  // Filtering actions
  performSearch: (searchTerm: string) => void;

  // Utility actions
  clearSelection: () => void;
  clearSearch: () => void;
  resetStore: () => void;
}

/**
 * Device filtering utility function
 * Searches through K-number, device name, and manufacturer
 *
 * Performance: Case-insensitive search with multiple field matching
 * Algorithm: Includes-based filtering for partial matches
 */
const filterDevices = (
  devices: FDADevice[],
  searchTerm: string,
): FDADevice[] => {
  if (!searchTerm || searchTerm.length < 2) {
    return devices; // Return all devices if no search term
  }

  const lowerSearchTerm = searchTerm.toLowerCase();

  return devices.filter(
    (device) =>
      device.kNumber.toLowerCase().includes(lowerSearchTerm) ||
      device.deviceName.toLowerCase().includes(lowerSearchTerm) ||
      device.manufacturer.toLowerCase().includes(lowerSearchTerm) ||
      device.productClass.toLowerCase().includes(lowerSearchTerm) ||
      (device.panelType?.toLowerCase().includes(lowerSearchTerm) ?? false),
  );
};

/**
 * Initial state values
 * Centralized default values for consistent store initialization
 */
const initialState = {
  selectedNodeId: null,
  searchTerm: "",
  filteredDevices: [],
  isSearching: false,
};

/**
 * Graph state store implementation
 *
 * Features:
 * - DevTools integration for debugging
 * - Selective state updates for performance
 * - Clear action methods for component cleanup
 */
export const useGraphStore = create<GraphStore>()(
  devtools(
    (set) => ({
      // Initial state
      ...initialState,

      // Node selection actions
      setSelectedNode: (id) =>
        set({ selectedNodeId: id }, false, "graph/setSelectedNode"),

      // Search functionality actions
      setSearchTerm: (term) =>
        set({ searchTerm: term }, false, "graph/setSearchTerm"),

      setFilteredDevices: (devices) =>
        set({ filteredDevices: devices }, false, "graph/setFilteredDevices"),

      setIsSearching: (loading) =>
        set({ isSearching: loading }, false, "graph/setIsSearching"),

      // Filtering actions
      performSearch: (searchTerm) => {
        const filtered = filterDevices(mockDevices, searchTerm);
        set(
          {
            searchTerm,
            filteredDevices: filtered,
          },
          false,
          "graph/performSearch",
        );
      },

      // Utility actions for cleanup
      clearSelection: () =>
        set({ selectedNodeId: null }, false, "graph/clearSelection"),

      clearSearch: () =>
        set(
          {
            searchTerm: "",
            filteredDevices: [],
            isSearching: false,
          },
          false,
          "graph/clearSearch",
        ),

      resetStore: () => set(initialState, false, "graph/resetStore"),
    }),
    {
      name: "graph-store", // DevTools store name
      enabled: process.env.NODE_ENV === "development", // Only in development
    },
  ),
);

/**
 * Helper function to get devices for display
 * Returns filtered devices if search is active, otherwise all devices
 */
export const getDisplayDevices = (): FDADevice[] => {
  const { searchTerm, filteredDevices } = useGraphStore.getState();
  return searchTerm ? filteredDevices : mockDevices;
};
