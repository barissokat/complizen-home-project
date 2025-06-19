/**
 * Graph Layout Algorithms
 *
 * Provides hierarchical layout algorithms for FDA device predicate graphs
 * Uses Dagre for directed graph positioning with predicate relationships
 *
 * Performance: Optimized for <500 nodes, fallback strategy for larger graphs
 */

import dagre from "dagre";
import { GraphNode, GraphEdge } from "@/types/graph";

/**
 * Dagre Graph Configuration
 *
 * rankdir: 'TB' - Top to bottom layout (root devices at top)
 * nodesep: 80 - Horizontal spacing between nodes
 * ranksep: 120 - Vertical spacing between hierarchy levels
 * marginx/y: Padding around the entire graph
 */
const DAGRE_CONFIG = {
  rankdir: "TB" as const, // Top-to-bottom for predicate hierarchy
  nodesep: 80, // Horizontal node separation
  ranksep: 120, // Vertical rank separation
  marginx: 50, // Graph margin X
  marginy: 50, // Graph margin Y
};

/**
 * Applies Dagre layout algorithm to position nodes hierarchically
 *
 * @param nodes - Array of graph nodes to position
 * @param edges - Array of edges defining predicate relationships
 * @returns Positioned nodes with x,y coordinates from Dagre algorithm
 */
export const getLayoutedElements = (
  nodes: GraphNode[],
  edges: GraphEdge[],
): GraphNode[] => {
  // Create new Dagre graph instance
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  // Configure graph layout settings
  dagreGraph.setGraph({
    rankdir: DAGRE_CONFIG.rankdir,
    nodesep: DAGRE_CONFIG.nodesep,
    ranksep: DAGRE_CONFIG.ranksep,
    marginx: DAGRE_CONFIG.marginx,
    marginy: DAGRE_CONFIG.marginy,
  });

  // Add nodes to Dagre graph with their dimensions
  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, {
      width: 180, // Node width for text content
      height: 60, // Node height for device info
    });
  });

  // Add edges to define hierarchy relationships
  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  // Run Dagre layout algorithm
  dagre.layout(dagreGraph);

  // Apply calculated positions to nodes
  const layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);

    return {
      ...node,
      position: {
        // Dagre calculates center position, adjust for top-left positioning
        x: nodeWithPosition.x - 90, // Half of node width (180/2)
        y: nodeWithPosition.y - 30, // Half of node height (60/2)
      },
    };
  });

  return layoutedNodes;
};

/**
 * Performance monitoring for layout calculations
 * Logs layout time for optimization tracking
 */
export const measureLayoutPerformance = (
  nodeCount: number,
  startTime: number,
): void => {
  const layoutTime = Date.now() - startTime;

  console.log(`Dagre Layout Performance:`, {
    nodeCount,
    layoutTime: `${layoutTime}ms`,
    avgTimePerNode: `${(layoutTime / nodeCount).toFixed(2)}ms`,
    recommendation:
      nodeCount > 500 ? "Consider Web Worker" : "Good performance",
  });
};

/**
 * Validates if Dagre layout is appropriate for current dataset
 * Returns recommendation for layout strategy
 */
export const shouldUseDagre = (nodeCount: number): boolean => {
  // Dagre works well for small to medium graphs
  // For >500 nodes, consider D3-force in Web Worker
  return nodeCount <= 500;
};
