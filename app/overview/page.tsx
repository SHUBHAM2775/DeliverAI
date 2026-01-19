"use client";

import Header from "@/components/Header";
import {
  CheckCircleIcon,
  ClockIcon,
  ShieldExclamationIcon,
} from "@heroicons/react/24/outline";

export default function OverviewPage() {
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-8 min-h-full">
        <Header />

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Orders Today */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <div className="flex items-start justify-between mb-4">
              <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
                <svg
                  className="h-6 w-6 text-blue-600"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M3 3h18v2H3V3zm0 4h18v12c0 1.1-.9 2-2 2H5c-1.1 0-2-.9-2-2V7zm0 12h18v2H3v-2z" />
                </svg>
              </div>
              <span className="text-green-600 text-sm font-semibold bg-green-50 px-3 py-1 rounded-lg">
                ↑ 12.5%
              </span>
            </div>
            <p className="text-gray-600 text-sm mb-2">Total Orders Today</p>
            <p className="text-4xl font-bold text-gray-900">1,247</p>
            <p className="text-xs text-gray-500 mt-2">vs yesterday</p>
          </div>

          {/* First Attempt Success */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <div className="flex items-start justify-between mb-4">
              <div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center">
                <CheckCircleIcon className="h-6 w-6 text-green-600" />
              </div>
              <span className="text-green-600 text-sm font-semibold bg-green-50 px-3 py-1 rounded-lg">
                ↑ 3.8%
              </span>
            </div>
            <p className="text-gray-600 text-sm mb-2">First Attempt Success</p>
            <p className="text-4xl font-bold text-gray-900">94.2%</p>
            <p className="text-xs text-gray-500 mt-2">vs last week</p>
          </div>

          {/* Avg Delivery Time */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <div className="flex items-start justify-between mb-4">
              <div className="h-12 w-12 rounded-lg bg-purple-100 flex items-center justify-center">
                <ClockIcon className="h-6 w-6 text-purple-600" />
              </div>
              <span className="text-red-600 text-sm font-semibold bg-red-50 px-3 py-1 rounded-lg">
                ↓ 8.2%
              </span>
            </div>
            <p className="text-gray-600 text-sm mb-2">Avg Delivery Time</p>
            <p className="text-4xl font-bold text-gray-900">28 min</p>
            <p className="text-xs text-gray-500 mt-2">faster than target</p>
          </div>

          {/* High-Risk Deliveries */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <div className="flex items-start justify-between mb-4">
              <div className="h-12 w-12 rounded-lg bg-yellow-100 flex items-center justify-center">
                <ShieldExclamationIcon className="h-6 w-6 text-yellow-600" />
              </div>
              <span className="text-red-600 text-sm font-semibold bg-red-50 px-3 py-1 rounded-lg">
                ↑ 15.3%
              </span>
            </div>
            <p className="text-gray-600 text-sm mb-2">High-Risk Deliveries</p>
            <p className="text-4xl font-bold text-gray-900">23</p>
            <p className="text-xs text-gray-500 mt-2">predicted issues</p>
          </div>
        </div>

        {/* Delivery Performance Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-2xl p-8 border border-gray-200">
            <div className="mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Delivery Performance
              </h3>
              <div className="flex items-center gap-2 text-sm">
                <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                <span className="text-blue-600 font-semibold">
                  AI-Optimized Schedule Active
                </span>
              </div>
            </div>

            {/* Chart Legend */}
            <div className="flex gap-8 mb-6">
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
            <div className="h-64 relative">
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
                    <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.3" />
                    <stop
                      offset="100%"
                      stopColor="#3B82F6"
                      stopOpacity="0"
                    />
                  </linearGradient>
                  <linearGradient
                    id="noAiGradient"
                    x1="0%"
                    y1="0%"
                    x2="0%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="#9CA3AF" stopOpacity="0.3" />
                    <stop
                      offset="100%"
                      stopColor="#9CA3AF"
                      stopOpacity="0"
                    />
                  </linearGradient>
                </defs>

                {/* No AI Line and Fill */}
                <polygon
                  points="0,80 100,100 200,120 300,140 400,160 500,150 600,130 700,120 800,140 800,300 0,300"
                  fill="url(#noAiGradient)"
                />
                <polyline
                  points="0,80 100,100 200,120 300,140 400,160 500,150 600,130 700,120 800,140"
                  fill="none"
                  stroke="#9CA3AF"
                  strokeWidth="2"
                  vectorEffect="non-scaling-stroke"
                />

                {/* With AI Line and Fill */}
                <polygon
                  points="0,50 100,40 200,30 300,35 400,25 500,30 600,40 700,55 800,65 800,300 0,300"
                  fill="url(#aiGradient)"
                />
                <polyline
                  points="0,50 100,40 200,30 300,35 400,25 500,30 600,40 700,55 800,65"
                  fill="none"
                  stroke="#3B82F6"
                  strokeWidth="2"
                  vectorEffect="non-scaling-stroke"
                />

                {/* Y-axis labels */}
                <text
                  x="0"
                  y="40"
                  fontSize="12"
                  fill="#9CA3AF"
                  textAnchor="end"
                >
                  100%
                </text>
                <text
                  x="0"
                  y="110"
                  fontSize="12"
                  fill="#9CA3AF"
                  textAnchor="end"
                >
                  90%
                </text>
                <text
                  x="0"
                  y="180"
                  fontSize="12"
                  fill="#9CA3AF"
                  textAnchor="end"
                >
                  80%
                </text>
                <text
                  x="0"
                  y="250"
                  fontSize="12"
                  fill="#9CA3AF"
                  textAnchor="end"
                >
                  70%
                </text>

                {/* X-axis labels */}
                <text
                  x="100"
                  y="290"
                  fontSize="12"
                  fill="#9CA3AF"
                  textAnchor="middle"
                >
                  6AM
                </text>
                <text
                  x="200"
                  y="290"
                  fontSize="12"
                  fill="#9CA3AF"
                  textAnchor="middle"
                >
                  8AM
                </text>
                <text
                  x="300"
                  y="290"
                  fontSize="12"
                  fill="#9CA3AF"
                  textAnchor="middle"
                >
                  10AM
                </text>
                <text
                  x="400"
                  y="290"
                  fontSize="12"
                  fill="#9CA3AF"
                  textAnchor="middle"
                >
                  12PM
                </text>
                <text
                  x="500"
                  y="290"
                  fontSize="12"
                  fill="#9CA3AF"
                  textAnchor="middle"
                >
                  2PM
                </text>
                <text
                  x="600"
                  y="290"
                  fontSize="12"
                  fill="#9CA3AF"
                  textAnchor="middle"
                >
                  4PM
                </text>
                <text
                  x="700"
                  y="290"
                  fontSize="12"
                  fill="#9CA3AF"
                  textAnchor="middle"
                >
                  6PM
                </text>
                <text
                  x="800"
                  y="290"
                  fontSize="12"
                  fill="#9CA3AF"
                  textAnchor="middle"
                >
                  8PM
                </text>
              </svg>
            </div>
          </div>

          {/* Top Performing Slots */}
          <div className="bg-white rounded-2xl p-8 border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Top Performing Slots
            </h3>

            {/* Tabs */}
            <div className="flex gap-2 mb-6 border-b border-gray-200">
              {["Today", "24H", "7D", "1M", "All"].map((tab) => (
                <button
                  key={tab}
                  className={`px-3 py-2 text-sm font-medium border-b-2 transition ${
                    tab === "Today"
                      ? "text-blue-600 border-blue-600"
                      : "text-gray-600 border-transparent hover:text-gray-900"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Slots */}
            <div className="space-y-4">
              {/* Slot 1 */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      9 - 11 AM
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="h-6 px-2 rounded-full bg-purple-100 text-purple-600 text-xs font-semibold flex items-center">
                        🧠 AI Pick
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900">97%</p>
                    <p className="text-xs text-gray-500">Success Rate</p>
                  </div>
                </div>
                <p className="text-xs text-gray-600 mb-3">312 orders today</p>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: "97%" }}
                  ></div>
                </div>
              </div>

              {/* Slot 2 */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      11 AM - 1 PM
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="h-6 px-2 rounded-full bg-purple-100 text-purple-600 text-xs font-semibold flex items-center">
                        🧠 AI Pick
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900">94%</p>
                    <p className="text-xs text-gray-500">Success Rate</p>
                  </div>
                </div>
                <p className="text-xs text-gray-600 mb-3">278 orders today</p>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: "94%" }}
                  ></div>
                </div>
              </div>

              {/* Slot 3 */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      5 - 7 PM
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900">89%</p>
                    <p className="text-xs text-gray-500">Success Rate</p>
                  </div>
                </div>
                <p className="text-xs text-gray-600 mb-3">245 orders today</p>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: "89%" }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          {/* Active Agents */}
          <div className="bg-white rounded-2xl p-8 border border-gray-200">
            <h3 className="text-gray-600 text-sm font-medium mb-4">
              Active Agents
            </h3>
            <p className="text-5xl font-bold text-gray-900 mb-3">42</p>
            <p className="text-green-600 text-sm font-medium">
              All routes optimized
            </p>
          </div>

          {/* Pending Confirmations */}
          <div className="bg-white rounded-2xl p-8 border border-gray-200">
            <h3 className="text-gray-600 text-sm font-medium mb-4">
              Pending Confirmations
            </h3>
            <p className="text-5xl font-bold text-gray-900 mb-3">156</p>
            <p className="text-orange-500 text-sm font-medium">
              87% confirmed
            </p>
          </div>

          {/* AI Predictions Accuracy */}
          <div className="bg-white rounded-2xl p-8 border border-gray-200">
            <h3 className="text-gray-600 text-sm font-medium mb-4">
              AI Predictions Accuracy
            </h3>
            <p className="text-5xl font-bold text-gray-900 mb-3">96.8%</p>
            <p className="text-gray-500 text-sm font-medium">
              Last 7 days
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
