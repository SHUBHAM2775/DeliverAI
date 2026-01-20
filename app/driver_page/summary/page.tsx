"use client";

import Header from "@/components/Header";
import {
    TruckIcon,
    CheckCircleIcon,
    XCircleIcon,
    ClockIcon,
    ChartBarIcon,
} from "@heroicons/react/24/outline";

interface SummaryMetrics {
    totalAssigned: number;
    firstAttemptSuccess: number;
    failedAttempts: number;
    averageDelay: number;
}

// Mock summary data
// TODO: Replace with API data
const summaryData: SummaryMetrics = {
    totalAssigned: 12,
    firstAttemptSuccess: 10,
    failedAttempts: 2,
    averageDelay: 8,
};

export default function DailySummaryPage() {
    const successRate = Math.round((summaryData.firstAttemptSuccess / summaryData.totalAssigned) * 100);
    const failureRate = 100 - successRate;

    return (
        <div className="flex-1 overflow-y-auto bg-gray-50">
            <div className="p-6 min-h-full">
                <Header title="Daily Summary" role="Driver" />

                {/* Summary Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    {/* Total Assigned Deliveries */}
                    <div className="bg-[#DBEAFE] rounded-xl p-5">
                        <div className="flex items-start justify-between mb-2">
                            <div className="h-10 w-10 rounded-xl bg-blue-100 flex items-center justify-center">
                                <TruckIcon className="h-5 w-5 text-blue-600" strokeWidth="2" />
                            </div>
                            <span className="text-blue-600 text-xs font-semibold bg-blue-100 px-2.5 py-1 rounded-full">
                                Today
                            </span>
                        </div>
                        <p className="text-3xl font-bold text-gray-900 mb-1">{summaryData.totalAssigned}</p>
                        <p className="text-gray-500 text-xs mb-0.5">Total Assigned Deliveries</p>
                        <p className="text-xs text-gray-400">across all slots</p>
                    </div>

                    {/* First Attempt Success */}
                    <div className="bg-[#D1FAE5] rounded-xl p-5">
                        <div className="flex items-start justify-between mb-2">
                            <div className="h-10 w-10 rounded-xl bg-green-100 flex items-center justify-center">
                                <CheckCircleIcon className="h-5 w-5 text-green-600" strokeWidth="2" />
                            </div>
                            <span className="text-green-600 text-xs font-semibold bg-green-100 px-2.5 py-1 rounded-full">
                                ↗ {successRate}%
                            </span>
                        </div>
                        <p className="text-3xl font-bold text-gray-900 mb-1">{summaryData.firstAttemptSuccess}</p>
                        <p className="text-gray-500 text-xs mb-0.5">First-Attempt Success Count</p>
                        <p className="text-xs text-gray-400">successful deliveries</p>
                    </div>

                    {/* Failed Attempts */}
                    <div className="bg-[#FEE2E2] rounded-xl p-5">
                        <div className="flex items-start justify-between mb-2">
                            <div className="h-10 w-10 rounded-xl bg-red-100 flex items-center justify-center">
                                <XCircleIcon className="h-5 w-5 text-red-600" strokeWidth="2" />
                            </div>
                            <span className="text-red-600 text-xs font-semibold bg-red-100 px-2.5 py-1 rounded-full">
                                ↘ {failureRate}%
                            </span>
                        </div>
                        <p className="text-3xl font-bold text-gray-900 mb-1">{summaryData.failedAttempts}</p>
                        <p className="text-gray-500 text-xs mb-0.5">Failed Attempts</p>
                        <p className="text-xs text-gray-400">requires resolution</p>
                    </div>

                    {/* Average Delay */}
                    <div className="bg-[#FEF3C7] rounded-xl p-5">
                        <div className="flex items-start justify-between mb-2">
                            <div className="h-10 w-10 rounded-xl bg-yellow-100 flex items-center justify-center">
                                <ClockIcon className="h-5 w-5 text-yellow-600" strokeWidth="2" />
                            </div>
                            <span className="text-yellow-600 text-xs font-semibold bg-yellow-100 px-2.5 py-1 rounded-full">
                                Avg
                            </span>
                        </div>
                        <p className="text-3xl font-bold text-gray-900 mb-1">{summaryData.averageDelay}</p>
                        <p className="text-gray-500 text-xs mb-0.5">Average Delay</p>
                        <p className="text-xs text-gray-400">in minutes</p>
                    </div>
                </div>

                {/* Analytics Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Success Rate Chart Placeholder */}
                    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                        <h2 className="text-lg font-bold text-gray-900 mb-6">Success Rate</h2>

                        <div className="flex items-center justify-center gap-8">
                            {/* Pie Chart Placeholder */}
                            <div className="relative h-32 w-32">
                                <svg className="w-full h-full" viewBox="0 0 120 120">
                                    {/* Success Arc */}
                                    <circle
                                        cx="60"
                                        cy="60"
                                        r="50"
                                        fill="none"
                                        stroke="#22c55e"
                                        strokeWidth="10"
                                        strokeDasharray={`${(successRate / 100) * 314} 314`}
                                        transform="rotate(-90 60 60)"
                                    />
                                    {/* Failure Arc */}
                                    <circle
                                        cx="60"
                                        cy="60"
                                        r="50"
                                        fill="none"
                                        stroke="#ef4444"
                                        strokeWidth="10"
                                        strokeDasharray={`${(failureRate / 100) * 314} 314`}
                                        strokeDashoffset={-((successRate / 100) * 314)}
                                        transform="rotate(-90 60 60)"
                                    />
                                    {/* Center text */}
                                    <text
                                        x="60"
                                        y="60"
                                        textAnchor="middle"
                                        dy="0.3em"
                                        className="text-sm font-bold fill-gray-900"
                                    >
                                        {successRate}%
                                    </text>
                                </svg>
                            </div>

                            {/* Legend */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <div className="h-3 w-3 rounded-full bg-green-500"></div>
                                    <span className="text-sm text-gray-700">
                                        Success: {summaryData.firstAttemptSuccess}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="h-3 w-3 rounded-full bg-red-500"></div>
                                    <span className="text-sm text-gray-700">
                                        Failed: {summaryData.failedAttempts}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Performance Metrics */}
                    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                        <h2 className="text-lg font-bold text-gray-900 mb-6">Performance Metrics</h2>

                        <div className="space-y-4">
                            {/* On-Time Delivery Rate */}
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <p className="text-sm font-medium text-gray-700">On-Time Delivery Rate</p>
                                    <p className="text-sm font-bold text-gray-900">87%</p>
                                </div>
                                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                    <div className="h-full bg-green-500" style={{ width: "87%" }}></div>
                                </div>
                            </div>

                            {/* Customer Satisfaction */}
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <p className="text-sm font-medium text-gray-700">Customer Satisfaction</p>
                                    <p className="text-sm font-bold text-gray-900">92%</p>
                                </div>
                                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                    <div className="h-full bg-blue-500" style={{ width: "92%" }}></div>
                                </div>
                            </div>

                            {/* Fragile Handling Success */}
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <p className="text-sm font-medium text-gray-700">Fragile Item Handling</p>
                                    <p className="text-sm font-bold text-gray-900">100%</p>
                                </div>
                                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                    <div className="h-full bg-purple-500" style={{ width: "100%" }}></div>
                                </div>
                            </div>

                            {/* Route Efficiency */}
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <p className="text-sm font-medium text-gray-700">Route Efficiency</p>
                                    <p className="text-sm font-bold text-gray-900">85%</p>
                                </div>
                                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                    <div className="h-full bg-orange-500" style={{ width: "85%" }}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Analytics Caption */}
                <div className="mt-6 bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                    <div className="flex items-center gap-2">
                        <ChartBarIcon className="h-5 w-5 text-blue-600" />
                        <p className="text-sm text-gray-700">
                            <span className="font-semibold">Analytics powered by delivery outcomes</span>
                            <span className="text-gray-500 ml-2">
                                Data refreshes in real-time as deliveries are completed
                            </span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
