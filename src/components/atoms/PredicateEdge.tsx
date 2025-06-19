/**
 * PredicateEdge Component (React Flow Custom Edge)
 *
 * Custom edge component for predicate device relationships
 * Displays directional connections between FDA devices and their predicates
 *
 * Used in: GraphCanvas organism component
 * Dependencies: React Flow, predicate relationship data
 */

import React from "react";
import {
  BaseEdge,
  EdgeProps,
  getStraightPath,
  EdgeLabelRenderer,
} from "@xyflow/react";

export interface PredicateEdgeData {
  relationshipType: "predicate";
  label?: string;
}

export const PredicateEdge: React.FC<EdgeProps> = ({
  sourceX,
  sourceY,
  targetX,
  targetY,
  style = {},
  data,
  markerEnd,
}) => {
  const edgeData = data as unknown as PredicateEdgeData;

  // Calculate path for the edge
  const [edgePath, labelX, labelY] = getStraightPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  return (
    <>
      {/* Base edge path */}
      <BaseEdge
        path={edgePath}
        markerEnd={markerEnd}
        style={{
          stroke: "#94a3b8", // Slate gray
          strokeWidth: 2,
          ...style,
        }}
      />

      {/* Optional edge label */}
      {edgeData?.label && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: "absolute",
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              fontSize: "10px",
              fontWeight: 500,
              background: "white",
              padding: "2px 6px",
              borderRadius: "4px",
              border: "1px solid #e2e8f0",
              color: "#64748b",
            }}
            className="pointer-events-none"
          >
            {edgeData.label}
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
};
