"use client";

import React, { useCallback, useMemo, useEffect } from "react";
import {
  ReactFlow,
  Node,
  addEdge,
  Connection,
  useNodesState,
  useEdgesState,
  Controls,
  MiniMap,
  Background,
  BackgroundVariant,
  Panel,
  MarkerType,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { FDADevice } from "@/types/fda";
import { GraphNode, GraphEdge } from "@/types/graph";
import { DeviceNode } from "@/components/atoms/DeviceNode";
import { PredicateEdge } from "@/components/atoms/PredicateEdge";
import {
  getLayoutedElements,
  measureLayoutPerformance,
  shouldUseDagre,
} from "@/lib/graph/layout-algorithms";

/**
 * GraphCanvas Component
 *
 * Main interactive graph visualization component using React Flow.
 * Displays FDA device predicate relationships as nodes and edges.
 *
 * Features:
 * - Pan, zoom, and node selection
 * - Device nodes colored by classification
 * - Predicate relationships as directed edges
 * - Mini-map for navigation
 * - Background grid
 */

interface GraphCanvasProps {
  /** Array of FDA devices to visualize */
  devices: FDADevice[];
  /** Currently selected device K-number */
  selectedDeviceId?: string;
  /** Callback when device node is selected */
  onDeviceSelect?: (device: FDADevice) => void;
  /** Custom width for canvas container */
  width?: string;
  /** Custom height for canvas container */
  height?: string;
}

/**
 * Transform FDA devices into React Flow compatible nodes with Dagre hierarchical layout
 * Uses Dagre algorithm for predicate relationship positioning
 *
 * @param devices - Array of FDA device records
 * @param selectedId - Currently selected device for highlighting
 * @returns Array of React Flow node objects with Dagre positioning
 */
const transformDevicesToNodes = (
  devices: FDADevice[],
  selectedId?: string,
): GraphNode[] => {
  const startTime = Date.now();

  // Check if Dagre is appropriate for this dataset size
  const useDagre = shouldUseDagre(devices.length);

  // Create initial nodes without positioning
  const initialNodes: GraphNode[] = devices.map((device) => {
    const isSelected = device.kNumber === selectedId;

    return {
      id: device.kNumber,
      type: "deviceNode",
      position: { x: 0, y: 0 }, // Will be calculated by Dagre
      data: {
        device,
        label: device.deviceName,
        isSelected,
        metadata: {
          childrenCount: devices.filter((d) =>
            d.predicateDevices.includes(device.kNumber),
          ).length,
          predicateCount: device.predicateDevices.length,
          hierarchyDepth: 0, // Will be calculated by hierarchy analysis
        },
      },
      draggable: true,
    };
  });

  // Generate edges for Dagre layout calculation
  const edges = transformDevicesToEdges(devices);

  // Apply Dagre layout if appropriate, otherwise use fallback
  let layoutedNodes: GraphNode[];

  if (useDagre) {
    layoutedNodes = getLayoutedElements(initialNodes, edges);
    measureLayoutPerformance(devices.length, startTime);
    console.log(
      `✅ Dagre Layout Applied: ${devices.length} devices positioned hierarchically`,
    );
  } else {
    // Fallback to grid layout for large datasets
    console.warn(
      `Dataset too large (${devices.length} nodes) for Dagre, using grid layout`,
    );
    layoutedNodes = initialNodes.map((node, index) => ({
      ...node,
      position: {
        x: (index % 6) * 200,
        y: Math.floor(index / 6) * 150,
      },
    }));
  }

  return layoutedNodes;
};

/**
 * Transform predicate relationships into React Flow compatible edges
 *
 * @param devices - Array of FDA device records
 * @returns Array of React Flow edge objects
 */
const transformDevicesToEdges = (devices: FDADevice[]): GraphEdge[] => {
  const edges: GraphEdge[] = [];

  devices.forEach((device) => {
    device.predicateDevices.forEach((predicateKNumber) => {
      edges.push({
        id: `${predicateKNumber}-${device.kNumber}`,
        source: predicateKNumber,
        target: device.kNumber,
        type: "predicateEdge",
        animated: false,
        style: {
          stroke: "#94a3b8",
          strokeWidth: 2,
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: "#94a3b8",
        },
        data: {
          relationshipType: "predicate",
        },
      });
    });
  });

  return edges;
};

// Custom node and edge types definition
const nodeTypes = {
  deviceNode: DeviceNode,
};

const edgeTypes = {
  predicateEdge: PredicateEdge,
};

export const GraphCanvas: React.FC<GraphCanvasProps> = ({
  devices,
  selectedDeviceId,
  onDeviceSelect,
  width = "100%",
  height = "600px",
}) => {
  // Transform devices to React Flow format
  const initialNodes = useMemo(
    () => transformDevicesToNodes(devices, selectedDeviceId),
    [devices, selectedDeviceId],
  );

  const initialEdges = useMemo(
    () => transformDevicesToEdges(devices),
    [devices],
  );

  // React Flow state management
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Update nodes and edges when devices prop changes (for filtering)
  useEffect(() => {
    console.log(
      "GraphCanvas: Updating nodes/edges due to devices change",
      devices.length,
    );
    setNodes(initialNodes);
    setEdges(initialEdges);
  }, [initialNodes, initialEdges, setNodes, setEdges, devices.length]);

  // Handle new connections (not used for our read-only graph, but required by React Flow)
  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  // Handle node clicks - select device
  const onNodeClick = useCallback(
    (_event: React.MouseEvent, node: Node) => {
      const device = devices.find((d) => d.kNumber === node.id);
      if (device && onDeviceSelect) {
        onDeviceSelect(device);
      }
    },
    [devices, onDeviceSelect],
  );

  return (
    <div
      style={{ width, height }}
      className="border border-gray-200 rounded-lg"
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        fitView
        fitViewOptions={{
          padding: 0.2,
        }}
      >
        {/* Graph Controls - zoom, fit view */}
        <Controls position="top-left" />

        {/* Mini-map for navigation */}
        <MiniMap
          nodeColor={(node) => {
            const device = devices.find((d) => d.kNumber === node.id);
            if (!device) return "#6b7280";

            switch (device.productClass) {
              case "I":
                return "#10b981";
              case "II":
                return "#f59e0b";
              case "III":
                return "#ef4444";
              default:
                return "#6b7280";
            }
          }}
          position="bottom-right"
        />

        {/* Background pattern */}
        <Background variant={BackgroundVariant.Dots} gap={20} size={1} />

        {/* Info Panel */}
        <Panel
          position="top-right"
          className="bg-white p-3 rounded-lg shadow-lg"
        >
          <div className="text-sm">
            <div className="font-medium mb-2">Device Legend</div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500 rounded"></div>
                <span>Class I (Low Risk)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-amber-500 rounded"></div>
                <span>Class II (Moderate Risk)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-500 rounded"></div>
                <span>Class III (High Risk)</span>
              </div>
            </div>
            <div className="mt-3 text-xs text-gray-600">
              Total Devices: {devices.length}
            </div>
          </div>
        </Panel>
      </ReactFlow>
    </div>
  );
};

export default GraphCanvas;
