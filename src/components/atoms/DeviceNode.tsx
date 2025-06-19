/**
 * DeviceNode Component (React Flow Custom Node)
 *
 * Individual device node for the graph visualization
 * Displays device information with class-based coloring
 *
 * Used in: GraphCanvas organism component
 * Dependencies: React Flow, FDADevice types
 */

import React from "react";
import { Handle, Position, NodeProps } from "@xyflow/react";
import type { FDADevice } from "@/types/fda";

export interface DeviceNodeData {
  device: FDADevice;
  label: string;
  isSelected: boolean;
  metadata: {
    childrenCount: number;
    predicateCount: number;
    hierarchyDepth: number;
  };
}

export const DeviceNode: React.FC<NodeProps> = ({ data, selected }) => {
  const { device, label, metadata } = data as unknown as DeviceNodeData;

  // Color scheme based on device classification
  const getNodeColor = (productClass: "I" | "II" | "III") => {
    switch (productClass) {
      case "I":
        return {
          bg: "#10b981", // Green - Lower risk
          text: "white",
          border: "#059669",
        };
      case "II":
        return {
          bg: "#f59e0b", // Amber - Moderate risk
          text: "white",
          border: "#d97706",
        };
      case "III":
        return {
          bg: "#ef4444", // Red - Higher risk
          text: "white",
          border: "#dc2626",
        };
      default:
        return {
          bg: "#6b7280", // Gray - Unknown
          text: "white",
          border: "#4b5563",
        };
    }
  };

  const colors = getNodeColor(device.productClass);

  return (
    <div
      className="px-3 py-2 shadow-md rounded-lg min-w-[180px] text-center transition-all duration-200 hover:shadow-lg"
      style={{
        backgroundColor: colors.bg,
        color: colors.text,
        border: selected ? "3px solid #3b82f6" : `2px solid ${colors.border}`,
      }}
    >
      {/* Input handle for incoming edges */}
      <Handle
        type="target"
        position={Position.Top}
        className="w-2 h-2 !bg-gray-400 border-2 border-white"
      />

      {/* Node content */}
      <div className="space-y-1">
        <div className="font-semibold text-xs truncate" title={label}>
          {label}
        </div>

        <div className="text-xs opacity-90">K{device.kNumber}</div>

        <div className="text-xs opacity-75">Class {device.productClass}</div>

        {/* Metadata indicators */}
        <div className="flex justify-between text-xs opacity-75 mt-2 pt-1 border-t border-white/20">
          <span title="Predicate devices">📋 {metadata.predicateCount}</span>
          <span title="Child devices">🔗 {metadata.childrenCount}</span>
        </div>
      </div>

      {/* Output handle for outgoing edges */}
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-2 h-2 !bg-gray-400 border-2 border-white"
      />
    </div>
  );
};
