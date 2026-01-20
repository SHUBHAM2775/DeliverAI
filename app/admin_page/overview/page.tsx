"use client";

import Header from "@/components/Header";
import {
  CheckCircleIcon,
  ClockIcon,
  ShieldExclamationIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";

type SlotPerformance = {
  window: string;
  successRate: number;
  change: string;
  orders: number;
  aiPick?: boolean;
};

type OverviewMetrics = {
  totalOrdersToday: number;
  firstAttemptSuccessPercentage: string;
  failedDeliveriesToday: number;
  avgDeliveryDelay: string;
  highRiskDeliveriesCount: number;
  activeDeliveryZones: string[];
  activeAgents: number;
  pendingConfirmations: number;
  aiPredictionAccuracy: string;
};

const DEFAULT_METRICS: OverviewMetrics = {
  totalOrdersToday: 0,
  firstAttemptSuccessPercentage: "0%",
  failedDeliveriesToday: 0,
  avgDeliveryDelay: "N/A",
  highRiskDeliveriesCount: 0,
  activeDeliveryZones: [],
  activeAgents: 0,
  pendingConfirmations: 0,
  aiPredictionAccuracy: "0%",
};

const SLOT_TABS = ["Today", "24H", "7D", "1M", "All"] as const;

const SLOT_DATA: Record<(typeof SLOT_TABS)[number], SlotPerformance[]> = {
  Today: [
    { window: "9 - 11 AM", successRate: 97, change: "↗ 2.4%", orders: 312, aiPick: true },
    { window: "11 AM - 1 PM", successRate: 94, change: "↗ 1.8%", orders: 278, aiPick: true },
    { window: "5 - 7 PM", successRate: 91, change: "↘ 0.5%", orders: 356 },
  ],
  "24H": [
    { window: "6 - 8 AM", successRate: 92, change: "↗ 1.1%", orders: 188, aiPick: true },
    { window: "12 - 2 PM", successRate: 89, change: "↗ 0.6%", orders: 240 },
    { window: "8 - 10 PM", successRate: 87, change: "↘ 0.3%", orders: 205 },
  ],
  "7D": [
    { window: "Mon-Fri 10-12", successRate: 95, change: "↗ 3.2%", orders: 1420, aiPick: true },
    { window: "Sat 12-2", successRate: 90, change: "↗ 1.0%", orders: 620 },
    { window: "Sun 4-6", successRate: 86, change: "↘ 1.4%", orders: 540 },
  ],
  "1M": [
    { window: "Weekday Mornings", successRate: 93, change: "↗ 2.1%", orders: 5620, aiPick: true },
    { window: "Weekend Evenings", successRate: 88, change: "↘ 0.7%", orders: 3010 },
    { window: "Late Night", successRate: 84, change: "↘ 1.2%", orders: 1840 },
  ],
  All: [
    { window: "Standard 9-11", successRate: 92, change: "↗ 1.0%", orders: 12890, aiPick: true },
    { window: "Standard 11-1", successRate: 90, change: "↗ 0.4%", orders: 11740 },
    { window: "Standard 5-7", successRate: 88, change: "↘ 0.6%", orders: 13220 },
  ],
};

export default function OverviewPage() {
  const [metrics, setMetrics] = useState<OverviewMetrics>(DEFAULT_METRICS);
  const [loading, setLoading] = useState(true);
  const [slotTab, setSlotTab] = useState<(typeof SLOT_TABS)[number]>(SLOT_TABS[0]);

  useEffect(() => {
    let isMounted = true;
    const fetchMetrics = async () => {
      try {
        const res = await fetch("/api/admin_apis/dashboard/overview", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to load overview metrics");
        const json = await res.json();
        if (isMounted && json?.data) {
          setMetrics(json.data as OverviewMetrics);
        }
      } catch (err) {
        console.error("Overview fetch failed", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchMetrics();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50">
      <div className="p-6 min-h-full">
        <Header />

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
          {/* Total Orders Today */}
          <div className="bg-[#DBEAFE] rounded-xl p-5">
            <div className="flex items-start justify-between mb-2">
              <div className="h-10 w-10 rounded-xl bg-blue-100 flex items-center justify-center">
                <svg
                  className="h-5 w-5 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                >
                  <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <span className="text-green-600 text-xs font-semibold bg-green-100 px-2.5 py-1 rounded-full">
                ↗ 12.5%
              </span>
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">
              {loading ? "--" : metrics.totalOrdersToday}
            </p>
            <p className="text-gray-500 text-xs mb-0.5">Total Orders Today</p>
            <p className="text-xs text-gray-400">vs yesterday</p>
          </div>

          {/* First Attempt Success */}
          <div className="bg-[#D1FAE5] rounded-xl p-5">
            <div className="flex items-start justify-between mb-2">
              <div className="h-10 w-10 rounded-xl bg-green-100 flex items-center justify-center">
                <CheckCircleIcon className="h-5 w-5 text-green-600" strokeWidth="2" />
              </div>
              <span className="text-green-600 text-xs font-semibold bg-green-100 px-2.5 py-1 rounded-full">
                ↗ 3.8%
              </span>
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">
              {loading ? "--" : metrics.firstAttemptSuccessPercentage}
            </p>
            <p className="text-gray-500 text-xs mb-0.5">First Attempt Success</p>
            <p className="text-xs text-gray-400">vs last week</p>
          </div>

          {/* Avg Delivery Time */}
          <div className="bg-[#F3E8FF] rounded-xl p-5">
            <div className="flex items-start justify-between mb-2">
              <div className="h-10 w-10 rounded-xl bg-purple-100 flex items-center justify-center">
                <ClockIcon className="h-5 w-5 text-purple-600" strokeWidth="2" />
              </div>
              <span className="text-red-500 text-xs font-semibold bg-red-100 px-2.5 py-1 rounded-full">
                ↘ 8.2%
              </span>
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">
              {loading ? "--" : metrics.avgDeliveryDelay}
            </p>
            <p className="text-gray-500 text-xs mb-0.5">Avg Delivery Time</p>
            <p className="text-xs text-gray-400">faster than target</p>
          </div>

          {/* High-Risk Deliveries */}
          <div className="bg-[#FEF3C7] rounded-xl p-5">
            <div className="flex items-start justify-between mb-2">
              <div className="h-10 w-10 rounded-xl bg-yellow-100 flex items-center justify-center">
                <ShieldExclamationIcon className="h-5 w-5 text-yellow-600" strokeWidth="2" />
              </div>
              <span className="text-red-500 text-xs font-semibold bg-red-100 px-2.5 py-1 rounded-full">
                ↗ 15.3%
              </span>
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">
              {loading ? "--" : metrics.highRiskDeliveriesCount}
            </p>
            <p className="text-gray-500 text-xs mb-0.5">High-Risk Deliveries</p>
            <p className="text-xs text-gray-400">predicted issues</p>
          </div>
        </div>

        {/* Delivery Performance Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-5">
          <div className="lg:col-span-2 bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
            <div className="mb-3">
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Delivery Performance
              </h3>
              <div className="flex items-center gap-1.5 text-sm mb-3">
                <svg className="h-3.5 w-3.5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-600 font-medium text-xs">
                  AI-Optimized Schedule Active
                </span>
              </div>
            </div>

            {/* Chart Legend */}
            <div className="flex gap-4 mb-3">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                <span className="text-sm text-gray-600">With AI</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-gray-400"></div>
                <span className="text-sm text-gray-600">Without AI</span>
              </div>
            </div>

            {/* Area Chart */}
            <div className="h-48 relative bg-gray-50 rounded-xl p-3">
              <svg
                viewBox="0 0 800 300"
                className="w-full h-full"
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient
                    id="aiGradient"
                    x1="0%"
                    y1="0%"
                    x2="0%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.2" />
                    <stop
                      offset="100%"
                      stopColor="#3B82F6"
                      stopOpacity="0.05"
                    />
                  </linearGradient>
                  <linearGradient
                    id="noAiGradient"
                    x1="0%"
                    y1="0%"
                    x2="0%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="#9CA3AF" stopOpacity="0.15" />
                    <stop
                      offset="100%"
                      stopColor="#9CA3AF"
                      stopOpacity="0.05"
                    />
                  </linearGradient>
                </defs>

                {/* No AI Line and Fill */}
                <polygon
                  points="50,90 150,110 250,130 350,145 450,165 550,155 650,135 750,125 800,145 800,280 50,280"
                  fill="url(#noAiGradient)"
                />
                <polyline
                  points="50,90 150,110 250,130 350,145 450,165 550,155 650,135 750,125 800,145"
                  fill="none"
                  stroke="#9CA3AF"
                  strokeWidth="2.5"
                  vectorEffect="non-scaling-stroke"
                />

                {/* With AI Line and Fill */}
                <polygon
                  points="50,40 150,35 250,25 350,30 450,20 550,25 650,35 750,50 800,60 800,280 50,280"
                  fill="url(#aiGradient)"
                />
                <polyline
                  points="50,40 150,35 250,25 350,30 450,20 550,25 650,35 750,50 800,60"
                  fill="none"
                  stroke="#3B82F6"
                  strokeWidth="2.5"
                  vectorEffect="non-scaling-stroke"
                />

                {/* Y-axis labels */}
                <text
                  x="30"
                  y="30"
                  fontSize="11"
                  fill="#9CA3AF"
                  textAnchor="end"
                >
                  100%
                </text>
                <text
                  x="30"
                  y="90"
                  fontSize="11"
                  fill="#9CA3AF"
                  textAnchor="end"
                >
                  90%
                </text>
                <text
                  x="30"
                  y="150"
                  fontSize="11"
                  fill="#9CA3AF"
                  textAnchor="end"
                >
                  80%
                </text>
                <text
                  x="30"
                  y="210"
                  fontSize="11"
                  fill="#9CA3AF"
                  textAnchor="end"
                >
                  70%
                </text>
                <text
                  x="30"
                  y="270"
                  fontSize="11"
                  fill="#9CA3AF"
                  textAnchor="end"
                >
                  60%
                </text>

                {/* X-axis labels */}
                <text
                  x="50"
                  y="295"
                  fontSize="11"
                  fill="#9CA3AF"
                  textAnchor="middle"
                >
                  6AM
                </text>
                <text
                  x="200"
                  y="295"
                  fontSize="11"
                  fill="#9CA3AF"
                  textAnchor="middle"
                >
                  8AM
                </text>
                <text
                  x="350"
                  y="295"
                  fontSize="11"
                  fill="#9CA3AF"
                  textAnchor="middle"
                >
                  10AM
                </text>
                <text
                  x="450"
                  y="295"
                  fontSize="11"
                  fill="#9CA3AF"
                  textAnchor="middle"
                >
                  12PM
                </text>
                <text
                  x="550"
                  y="295"
                  fontSize="11"
                  fill="#9CA3AF"
                  textAnchor="middle"
                >
                  2PM
                </text>
                <text
                  x="650"
                  y="295"
                  fontSize="11"
                  fill="#9CA3AF"
                  textAnchor="middle"
                >
                  4PM
                </text>
                <text
                  x="750"
                  y="295"
                  fontSize="11"
                  fill="#9CA3AF"
                  textAnchor="middle"
                >
                  6PM
                </text>
                <text
                  x="800"
                  y="295"
                  fontSize="11"
                  fill="#9CA3AF"
                  textAnchor="middle"
                >
                  8PM
                </text>
              </svg>
            </div>
          </div>

          {/* Top Performing Slots */}
          <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-3">
              Top Performing Slots
            </h3>

            {/* Tabs */}
            <div className="flex gap-2 mb-4 bg-gray-100 rounded-lg p-0.5">
              {SLOT_TABS.map((tab) => (
                <button
                  key={tab}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition ${
                    tab === slotTab
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-500 hover:text-gray-900"
                  }`}
                  onClick={() => setSlotTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Slots */}
            <div className="space-y-4">
              {SLOT_DATA[slotTab].map((slot) => (
                <div key={`${slotTab}-${slot.window}`}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-1.5">
                      <ClockIcon className="h-4 w-4 text-blue-500" strokeWidth="2" />
                      <p className="text-sm font-semibold text-gray-900">
                        {slot.window}
                      </p>
                    </div>
                    {slot.aiPick && (
                      <div className="px-2 py-0.5 rounded-md bg-purple-50 text-purple-600 text-xs font-bold flex items-center gap-1">
                        <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm1 11H9v-2h2v2zm0-4H9V5h2v4z" />
                        </svg>
                        AI Pick
                      </div>
                    )}
                  </div>
                  <div className="flex items-end justify-between mb-2">
                    <div>
                      <p className="text-2xl font-bold text-gray-900">{slot.successRate}%</p>
                      <p className="text-xs text-gray-500">Success Rate</p>
                    </div>
                    <p className={`text-xs font-semibold ${slot.change.includes("↘") ? "text-red-500" : "text-green-600"}`}>
                      {slot.change}
                    </p>
                  </div>
                  <p className="text-xs text-gray-500 mb-1.5">{slot.orders.toLocaleString()} orders</p>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${slot.successRate}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
          {/* Active Agents */}
          <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-xs hover:shadow-sm transition">
            <h3 className="text-gray-400 text-xs font-medium mb-2">
              Active Agents
            </h3>
            <p className="text-3xl font-bold text-gray-900 mb-1">
              {loading ? "--" : metrics.activeAgents}
            </p>
            <p className="text-green-600 text-xs font-semibold">
              All routes optimized
            </p>
          </div>

          {/* Pending Confirmations */}
          <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-xs hover:shadow-sm transition">
            <h3 className="text-gray-400 text-xs font-medium mb-2">
              Pending Confirmations
            </h3>
            <p className="text-3xl font-bold text-gray-900 mb-1">
              {loading ? "--" : metrics.pendingConfirmations}
            </p>
            <p className="text-orange-500 text-xs font-semibold">
              {loading ? "--" : "87% confirmed *"}
            </p>
          </div>

          {/* AI Predictions Accuracy */}
          <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-xs hover:shadow-sm transition">
            <h3 className="text-gray-400 text-xs font-medium mb-2">
              AI Predictions Accuracy
            </h3>
            <p className="text-3xl font-bold text-gray-900 mb-1">
              {loading ? "--" : metrics.aiPredictionAccuracy}
            </p>
            <p className="text-gray-400 text-xs font-medium">
              Last 7 days
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
