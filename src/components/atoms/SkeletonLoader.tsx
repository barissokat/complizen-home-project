/**
 * SkeletonLoader Component
 *
 * Provides professional loading skeletons for different parts of the application
 * with smooth animations and responsive design.
 *
 * Variants:
 * - graph: Loading skeleton for graph canvas
 * - panel: Loading skeleton for device details panel
 * - search: Loading skeleton for search results
 * - node: Loading skeleton for individual graph nodes
 * - list: Loading skeleton for device lists
 */

"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface SkeletonLoaderProps {
  variant: "graph" | "panel" | "search" | "node" | "list";
  count?: number;
  className?: string;
}

interface SkeletonProps {
  className?: string;
  width?: string;
  height?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

/**
 * Base skeleton element with shimmer animation
 */
const SkeletonElement: React.FC<SkeletonProps> = ({
  className = "",
  width = "100%",
  height = "1rem",
  style,
  children,
}) => {
  const combinedStyle = {
    width,
    height,
    ...style,
  };

  return (
    <div
      className={`bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse rounded ${className}`}
      style={combinedStyle}
    >
      {children}
    </div>
  );
};

/**
 * Graph Canvas Loading Skeleton
 * Shows placeholder for graph nodes and connections
 */
const GraphSkeleton: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn("relative w-full h-full bg-background", className)}>
    {/* Graph container */}
    <div className="absolute inset-0 p-4">
      {/* Simulated graph nodes */}
      <div className="relative w-full h-full">
        {/* Node positions simulating a graph layout */}
        {[
          { top: "20%", left: "15%", size: "w-16 h-16" },
          { top: "30%", left: "40%", size: "w-12 h-12" },
          { top: "45%", left: "25%", size: "w-14 h-14" },
          { top: "60%", left: "50%", size: "w-16 h-16" },
          { top: "25%", left: "70%", size: "w-12 h-12" },
          { top: "55%", left: "75%", size: "w-14 h-14" },
          { top: "40%", left: "60%", size: "w-10 h-10" },
          { top: "70%", left: "30%", size: "w-12 h-12" },
        ].map((node, index) => (
          <SkeletonElement
            key={index}
            className={cn("absolute rounded-full", node.size, "shadow-sm")}
            style={{
              top: node.top,
              left: node.left,
              animationDelay: `${index * 0.1}s`,
            }}
          />
        ))}

        {/* Simulated edges/connections */}
        {[
          {
            top: "25%",
            left: "20%",
            width: "w-20",
            height: "h-0.5",
            rotate: "rotate-12",
          },
          {
            top: "35%",
            left: "45%",
            width: "w-16",
            height: "h-0.5",
            rotate: "-rotate-12",
          },
          {
            top: "50%",
            left: "35%",
            width: "w-24",
            height: "h-0.5",
            rotate: "rotate-6",
          },
          {
            top: "45%",
            left: "65%",
            width: "w-12",
            height: "h-0.5",
            rotate: "-rotate-6",
          },
        ].map((edge, index) => (
          <SkeletonElement
            key={`edge-${index}`}
            className={cn(
              "absolute",
              edge.width,
              edge.height,
              edge.rotate,
              "opacity-30",
            )}
            style={{
              top: edge.top,
              left: edge.left,
              animationDelay: `${index * 0.15}s`,
            }}
          />
        ))}
      </div>
    </div>

    {/* Loading text */}
    <div className="absolute bottom-4 left-4 flex items-center gap-2">
      <SkeletonElement className="w-4 h-4 rounded-full" />
      <SkeletonElement className="w-32 h-4 rounded" />
    </div>
  </div>
);

/**
 * Device Details Panel Loading Skeleton
 */
const PanelSkeleton: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn("p-6 space-y-4", className)}>
    {/* Header */}
    <div className="space-y-2">
      <SkeletonElement className="w-3/4 h-6 rounded" />
      <SkeletonElement className="w-1/2 h-4 rounded" />
    </div>

    {/* Divider */}
    <SkeletonElement className="w-full h-px rounded" />

    {/* Content sections */}
    {[1, 2, 3].map((section) => (
      <div key={section} className="space-y-2">
        <SkeletonElement className="w-1/3 h-5 rounded" />
        <SkeletonElement className="w-full h-4 rounded" />
        <SkeletonElement className="w-4/5 h-4 rounded" />
      </div>
    ))}

    {/* Classification badges */}
    <div className="flex gap-2 pt-2">
      <SkeletonElement className="w-16 h-6 rounded-full" />
      <SkeletonElement className="w-20 h-6 rounded-full" />
    </div>

    {/* Action buttons */}
    <div className="flex gap-2 pt-4">
      <SkeletonElement className="w-24 h-9 rounded" />
      <SkeletonElement className="w-20 h-9 rounded" />
    </div>
  </div>
);

/**
 * Search Results Loading Skeleton
 */
const SearchSkeleton: React.FC<{ className?: string; count?: number }> = ({
  className,
  count = 5,
}) => (
  <div className={cn("space-y-3", className)}>
    {/* Search header */}
    <div className="flex items-center justify-between">
      <SkeletonElement className="w-32 h-5 rounded" />
      <SkeletonElement className="w-16 h-4 rounded" />
    </div>

    {/* Search results */}
    {Array.from({ length: count }).map((_, index) => (
      <div
        key={index}
        className="flex items-start gap-3 p-3 border rounded-lg"
        style={{ animationDelay: `${index * 0.1}s` }}
      >
        <SkeletonElement className="w-12 h-12 rounded-full flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <SkeletonElement className="w-3/4 h-4 rounded" />
          <SkeletonElement className="w-1/2 h-3 rounded" />
          <div className="flex gap-2">
            <SkeletonElement className="w-12 h-5 rounded-full" />
            <SkeletonElement className="w-16 h-5 rounded-full" />
          </div>
        </div>
      </div>
    ))}
  </div>
);

/**
 * Individual Node Loading Skeleton
 */
const NodeSkeleton: React.FC<{ className?: string }> = ({ className }) => (
  <SkeletonElement
    className={cn("w-12 h-12 rounded-full shadow-sm", className)}
  />
);

/**
 * List Loading Skeleton (for device lists)
 */
const ListSkeleton: React.FC<{ className?: string; count?: number }> = ({
  className,
  count = 8,
}) => (
  <div className={cn("space-y-2", className)}>
    {Array.from({ length: count }).map((_, index) => (
      <div
        key={index}
        className="flex items-center gap-3 p-2"
        style={{ animationDelay: `${index * 0.05}s` }}
      >
        <SkeletonElement className="w-8 h-8 rounded-full flex-shrink-0" />
        <div className="flex-1 space-y-1">
          <SkeletonElement className="w-2/3 h-3 rounded" />
          <SkeletonElement className="w-1/3 h-2 rounded" />
        </div>
      </div>
    ))}
  </div>
);

/**
 * Main SkeletonLoader Component
 */
export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  variant,
  count,
  className,
}) => {
  switch (variant) {
    case "graph":
      return <GraphSkeleton className={className} />;

    case "panel":
      return <PanelSkeleton className={className} />;

    case "search":
      return <SearchSkeleton className={className} count={count} />;

    case "node":
      return <NodeSkeleton className={className} />;

    case "list":
      return <ListSkeleton className={className} count={count} />;

    default:
      return (
        <SkeletonElement className={cn("w-full h-20 rounded", className)} />
      );
  }
};

/**
 * Shimmer animation utility for custom skeletons
 */
export const Shimmer: React.FC<{
  className?: string;
  children?: React.ReactNode;
}> = ({ className, children }) => (
  <SkeletonElement className={className}>{children}</SkeletonElement>
);

/**
 * Preset skeleton configurations for common use cases
 */
export const SkeletonPresets = {
  GraphCanvas: () => <SkeletonLoader variant="graph" />,
  DevicePanel: () => <SkeletonLoader variant="panel" />,
  SearchResults: (count = 5) => (
    <SkeletonLoader variant="search" count={count} />
  ),
  DeviceList: (count = 8) => <SkeletonLoader variant="list" count={count} />,
  GraphNode: () => <SkeletonLoader variant="node" />,
} as const;

export { SkeletonElement };
export default SkeletonElement;
