/**
 * DashboardTemplate Component
 *
 * Modern, professional dashboard template for FDA Device Graph visualization
 * Features: Contemporary design, responsive layout, shadowed cards, gradients
 *
 * Used in: Main dashboard page
 * Dependencies: React Flow, Lucide React icons, mock data, GraphCanvas
 */

"use client";

import type { DeviceNodeData } from "@/types/graph";
import type { FDADevice } from "@/types/fda";
import { mockDevices, getMockDataStats, getRootDevices } from "@/lib/mock-data";
import { GraphCanvas } from "@/components/organisms/GraphCanvas";
import StoreTest from "@/components/molecules/StoreTest";
import SearchInput from "@/components/molecules/SearchInput";
import DeviceDetailsPanel from "@/components/organisms/DeviceDetailsPanel";
import { useGraphStore } from "@/stores";
import {
  Search,
  TrendingUp,
  Activity,
  Layers,
  Users,
  BarChart3,
  Calendar,
  Hash,
  Building2,
  Shield,
} from "lucide-react";

interface DashboardTemplateProps {
  title: string;
  subtitle: string;
  stepInfo: string;
}

export function DashboardTemplate({
  title,
  subtitle,
  stepInfo,
}: DashboardTemplateProps) {
  // Store integration - reactive to search changes
  const { searchTerm, filteredDevices, setSelectedNode } = useGraphStore();

  // Mock data integration - client-side processing
  const mockStats = getMockDataStats();
  const rootDevices = getRootDevices();
  const sampleDevice = mockDevices[0]; // CardioFlow Balloon Catheter

  // Get display devices - REACTIVE to store changes
  const displayDevices = searchTerm ? filteredDevices : mockDevices;

  const testNodeData: DeviceNodeData = {
    label: sampleDevice.deviceName,
    device: sampleDevice,
    isSelected: false,
  };

  // Development logging for verification
  console.log("Mock data loaded:", mockStats);
  console.log("Sample devices:", {
    totalDevices: mockDevices.length,
    rootDevicesCount: rootDevices.length,
    sampleDevice,
    testNodeData,
  });

  // Device selection handler - updates store to show details panel
  const handleDeviceSelect = (device: FDADevice) => {
    console.log("Device selected:", device.kNumber, device.deviceName);
    setSelectedNode(device.kNumber);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Navigation Bar */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                  Complizen
                </h1>
                <p className="text-xs text-slate-500">FDA Device Analytics</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="px-3 py-1.5 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium">
                {stepInfo}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent mb-4">
            {title}
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* Statistics Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Devices Card */}
          <div className="bg-white/70 backdrop-blur-sm rounded-xl border border-white/50 shadow-lg hover:shadow-xl transition-all duration-300 p-6 group">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                <Hash className="w-6 h-6 text-white" />
              </div>
              <TrendingUp className="w-5 h-5 text-emerald-500" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-slate-600">
                Total Devices
              </p>
              <p className="text-2xl font-bold text-slate-900">
                {mockStats.totalDevices}
              </p>
            </div>
          </div>

          {/* Root Devices Card */}
          <div className="bg-white/70 backdrop-blur-sm rounded-xl border border-white/50 shadow-lg hover:shadow-xl transition-all duration-300 p-6 group">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                <Layers className="w-6 h-6 text-white" />
              </div>
              <BarChart3 className="w-5 h-5 text-blue-500" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-slate-600">Root Devices</p>
              <p className="text-2xl font-bold text-slate-900">
                {mockStats.rootDevices}
              </p>
            </div>
          </div>

          {/* Manufacturers Card */}
          <div className="bg-white/70 backdrop-blur-sm rounded-xl border border-white/50 shadow-lg hover:shadow-xl transition-all duration-300 p-6 group">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <Users className="w-5 h-5 text-purple-500" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-slate-600">
                Manufacturers
              </p>
              <p className="text-2xl font-bold text-slate-900">
                {mockStats.uniqueManufacturers}
              </p>
            </div>
          </div>

          {/* Average Predicates Card */}
          <div className="bg-white/70 backdrop-blur-sm rounded-xl border border-white/50 shadow-lg hover:shadow-xl transition-all duration-300 p-6 group">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <TrendingUp className="w-5 h-5 text-orange-500" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-slate-600">
                Avg Predicates
              </p>
              <p className="text-2xl font-bold text-slate-900">
                {mockStats.avgPredicatesPerDevice}
              </p>
            </div>
          </div>
        </div>

        {/* Search Section */}
        <div className="bg-white/70 backdrop-blur-sm rounded-xl border border-white/50 shadow-lg p-8 mb-8">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
              <Search className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-900">
                Device Search
              </h2>
              <p className="text-sm text-slate-600">
                Find and explore FDA medical devices
              </p>
            </div>
          </div>
          <SearchInput autoFocus={true} />

          {/* Search Results Info */}
          <div className="mt-4 flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2 text-slate-600">
              <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
              <span>
                Showing {displayDevices.length} of {mockDevices.length} devices
              </span>
            </div>
            {searchTerm && (
              <div className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                Search: &quot;{searchTerm}&quot; • {filteredDevices.length}{" "}
                results
              </div>
            )}
          </div>
        </div>

        {/* Main Graph Section */}
        <div className="bg-white/70 backdrop-blur-sm rounded-xl border border-white/50 shadow-lg overflow-hidden mb-8">
          <div className="border-b border-slate-200 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-slate-900">
                    Device Relationship Graph
                  </h2>
                  <p className="text-sm text-slate-600">
                    Interactive visualization of predicate device relationships
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-lg p-4">
              <div className="flex gap-6">
                {/* Graph Area */}
                <div className="flex-1">
                  <GraphCanvas
                    devices={displayDevices}
                    onDeviceSelect={handleDeviceSelect}
                    height="500px"
                  />
                </div>

                {/* Device Details Panel */}
                <DeviceDetailsPanel />
              </div>
            </div>
          </div>
        </div>

        {/* Device Details and Classification */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Sample Device Details */}
          <div className="bg-white/70 backdrop-blur-sm rounded-xl border border-white/50 shadow-lg p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900">
                  Featured Device
                </h3>
                <p className="text-sm text-slate-600">Root device example</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Hash className="w-4 h-4 text-slate-400 mt-1" />
                <div>
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                    K-Number
                  </p>
                  <p className="text-sm font-semibold text-slate-900">
                    {sampleDevice.kNumber}
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Activity className="w-4 h-4 text-slate-400 mt-1" />
                <div>
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                    Device Name
                  </p>
                  <p className="text-sm font-semibold text-slate-900">
                    {sampleDevice.deviceName}
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Building2 className="w-4 h-4 text-slate-400 mt-1" />
                <div>
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                    Manufacturer
                  </p>
                  <p className="text-sm font-semibold text-slate-900">
                    {sampleDevice.manufacturer}
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Shield className="w-4 h-4 text-slate-400 mt-1" />
                <div>
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                    Product Class
                  </p>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Class {sampleDevice.productClass}
                  </span>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Calendar className="w-4 h-4 text-slate-400 mt-1" />
                <div>
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                    Clearance Date
                  </p>
                  <p className="text-sm font-semibold text-slate-900">
                    {sampleDevice.clearanceDate}
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Layers className="w-4 h-4 text-slate-400 mt-1" />
                <div>
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                    Predicate Devices
                  </p>
                  <p className="text-sm font-semibold text-slate-900">
                    {sampleDevice.predicateDevices.length} devices (Root device)
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Classification Distribution */}
          <div className="bg-white/70 backdrop-blur-sm rounded-xl border border-white/50 shadow-lg p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-rose-500 to-pink-500 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900">
                  Device Classification
                </h3>
                <p className="text-sm text-slate-600">FDA class distribution</p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Class I */}
              <div className="flex items-center justify-between p-3 bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                  <span className="font-medium text-slate-900">Class I</span>
                </div>
                <span className="text-lg font-bold text-emerald-600">
                  {mockStats.classDistribution.classI}
                </span>
              </div>

              {/* Class II */}
              <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="font-medium text-slate-900">Class II</span>
                </div>
                <span className="text-lg font-bold text-blue-600">
                  {mockStats.classDistribution.classII}
                </span>
              </div>

              {/* Class III */}
              <div className="flex items-center justify-between p-3 bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                  <span className="font-medium text-slate-900">Class III</span>
                </div>
                <span className="text-lg font-bold text-orange-600">
                  {mockStats.classDistribution.classIII}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Development Tools */}
        <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-xl shadow-lg p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">
                Development Tools
              </h3>
              <p className="text-sm text-slate-400">
                Zustand store state management testing
              </p>
            </div>
          </div>
          <div className="bg-slate-700/50 rounded-lg p-4">
            <StoreTest />
          </div>
        </div>
      </div>
    </div>
  );
}
