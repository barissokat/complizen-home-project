/**
 * Main Dashboard Page (Server Component)
 *
 * Entry point for FDA Device Predicate Graph Visualizer
 * Delegates client-side functionality to DashboardTemplate
 */

import { DashboardTemplate } from "@/components/templates/DashboardTemplate";
import { getMockDataStats } from "@/lib/mock-data";

export default function Home() {
  // Server-side data preparation (could be from database/API)
  const mockStats = getMockDataStats();

  return (
    <DashboardTemplate
      title="FDA Device Predicate Graph"
      subtitle="Interactive visualization of 510(k) predicate relationships"
      stepInfo={`${mockStats.totalDevices} devices loaded`}
    />
  );
}
