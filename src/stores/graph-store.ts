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

  // Utility actions
  clearSelection: () => void;
  clearSearch: () => void;
  resetStore: () => void;
}

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
