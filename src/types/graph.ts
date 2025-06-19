/**
 * Graph Visualization Type Definitions
 *
 * Type definitions for React Flow graph nodes and edges
 * Extends React Flow types with domain-specific device data
 */

import type { Node, Edge } from "@xyflow/react";
import type { FDADevice } from "./fda";

/**
 * Custom data structure for device graph nodes
 * Contains device information and UI state
 */
export interface DeviceNodeData extends Record<string, unknown> {
  /** Display label for the node (usually device name) */
  label: string;

  /** Complete FDA device information */
  device: FDADevice;

  /** Whether this node is currently selected */
  isSelected: boolean;

  /** Optional: Color override for special highlighting */
  colorOverride?: string;

  /** Optional: Additional metadata for rendering */
  metadata?: {
    /** Number of devices that reference this as predicate */
    childrenCount: number;

    /** Number of predicate devices this device references */
    predicateCount: number;

    /** Depth in the predicate hierarchy (0 = root device) */
    hierarchyDepth: number;
  };
}

/**
 * React Flow Node extended with device-specific data
 * Represents a single medical device in the graph
 */
export interface GraphNode extends Node {
  /** Unique identifier (FDA K-number) */
  id: string;

  /** Node type for React Flow rendering */
  type: "deviceNode";

  /** Device-specific node data */
  data: DeviceNodeData;

  /** Calculated position from layout algorithm */
  position: { x: number; y: number };
}

/**
 * Custom data structure for predicate relationship edges
 */
export interface PredicateEdgeData extends Record<string, unknown> {
  /** Type of relationship (always 'predicate' for now) */
  relationshipType: "predicate";

  /** Optional: Strength of relationship (for future use) */
  weight?: number;

  /** Optional: Additional relationship metadata */
  metadata?: {
    /** When this predicate relationship was established */
    establishedDate?: string;

    /** Whether this is a primary or secondary predicate */
    isPrimary?: boolean;
  };
}

/**
 * React Flow Edge extended with predicate relationship data
 * Represents predicate device relationships
 */
export interface GraphEdge extends Edge {
  /** Unique identifier for the edge */
  id: string;

  /** Source device K-number (device making the claim) */
  source: string;

  /** Target device K-number (predicate device) */
  target: string;

  /** Edge type for React Flow rendering */
  type: "predicateEdge";

  /** Predicate relationship data */
  data?: PredicateEdgeData;
}

/**
 * Layout algorithm configuration options
 */
export interface LayoutConfig {
  /** Algorithm to use for layout calculation */
  algorithm: "dagre" | "d3-force" | "manual";

  /** Direction for directed graphs (dagre only) */
  direction?: "TB" | "BT" | "LR" | "RL";

  /** Spacing between nodes */
  nodeSpacing?: {
    horizontal: number;
    vertical: number;
  };

  /** Margins around the graph */
  margins?: {
    x: number;
    y: number;
  };

  /** Whether to animate layout changes */
  animated?: boolean;
}

/**
 * Graph state and statistics
 */
export interface GraphMetrics {
  /** Total number of nodes in the graph */
  nodeCount: number;

  /** Total number of edges in the graph */
  edgeCount: number;

  /** Number of root nodes (devices with no predicates) */
  rootNodeCount: number;

  /** Maximum depth of predicate hierarchy */
  maxDepth: number;

  /** Average number of predicates per device */
  avgPredicatesPerDevice: number;

  /** Time taken to calculate layout (in milliseconds) */
  layoutCalculationTime?: number;
}
