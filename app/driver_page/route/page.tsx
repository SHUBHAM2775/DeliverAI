"use client";

import { useState } from "react";
import Header from "@/components/Header";
import {
    MapIcon,
    ClockIcon,
    ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";

interface TimelineDelivery {
    id: string;
    orderId: string;
    slotStart: string;
    slotEnd: string;
    estimatedDistance: string;
    estimatedDuration: string;
    riskLevel: "LOW" | "MEDIUM" | "HIGH";
    area: string;
}

// Mock timeline data
// TODO: Replace with API data
const timelineDeliveries: TimelineDelivery[] = [
    {
        id: "DEL-001",
        orderId: "ORD-2401",
        slotStart: "9:00 AM",
        slotEnd: "11:00 AM",
        estimatedDistance: "3.2 km",
        estimatedDuration: "12 min",
        riskLevel: "LOW",
        area: "Koramangala",
    },
    {
        id: "DEL-002",
        orderId: "ORD-2402",
        slotStart: "11:00 AM",
        slotEnd: "1:00 PM",
        estimatedDistance: "5.8 km",
        estimatedDuration: "22 min",
        riskLevel: "LOW",
        area: "Indiranagar",
    },
    {
        id: "DEL-003",
        orderId: "ORD-2403",
        slotStart: "1:00 PM",
        slotEnd: "3:00 PM",
        estimatedDistance: "4.1 km",
        estimatedDuration: "18 min",
        riskLevel: "MEDIUM",
        area: "Marathahalli",
    },
    {
        id: "DEL-004",
        orderId: "ORD-2404",
        slotStart: "3:00 PM",
        slotEnd: "5:00 PM",
        estimatedDistance: "6.5 km",
        estimatedDuration: "28 min",
        riskLevel: "LOW",
        area: "Whitefield",
    },
    {
        id: "DEL-005",
        orderId: "ORD-2405",
        slotStart: "5:00 PM",
        slotEnd: "7:00 PM",
        estimatedDistance: "2.9 km",
        estimatedDuration: "11 min",
        riskLevel: "HIGH",
        area: "BTM Layout",
    },
];

export default function RouteTimelinePage() {
    const [expandedItem, setExpandedItem] = useState<string | null>(null);

    const getRiskColor = (risk: string) => {
        switch (risk) {
            case "LOW":
                return "bg-green-100 text-green-700 border-green-300";
            case "MEDIUM":
                return "bg-yellow-100 text-yellow-700 border-yellow-300";
            case "HIGH":
                return "bg-red-100 text-red-700 border-red-300";
            default:
                return "bg-gray-100 text-gray-700 border-gray-300";
        }
    };

    const getRiskIcon = (risk: string) => {
        switch (risk) {
            case "HIGH":
                return <ExclamationTriangleIcon className="h-4 w-4" />;
            default:
                return null;
        }
    };

    return (
        <div className="flex-1 overflow-y-auto bg-gray-50">
            <div className="p-6 min-h-full">
                <Header title="Route Timeline" role="Driver" />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Timeline */}
                    <div className="lg:col-span-2">
                        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                            <h2 className="text-lg font-bold text-gray-900 mb-6">Today's Route</h2>

                            <div className="space-y-6">
                                {timelineDeliveries.map((delivery, index) => (
                                    <div key={delivery.id} className="relative">
                                        {/* Timeline Line */}
                                        {index < timelineDeliveries.length - 1 && (
                                            <div className="absolute left-4 top-12 w-0.5 h-20 bg-gray-200"></div>
                                        )}

                                        {/* Timeline Dot */}
                                        <div className="flex gap-4">
                                            <div className="relative flex flex-col items-center">
                                                <div
                                                    className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold text-white ${delivery.riskLevel === "HIGH"
                                                        ? "bg-red-500"
                                                        : delivery.riskLevel === "MEDIUM"
                                                            ? "bg-yellow-500"
                                                            : "bg-green-500"
                                                        }`}
                                                >
                                                    {index + 1}
                                                </div>
                                            </div>

                                            {/* Timeline Content */}
                                            <div className="flex-1 pb-4">
                                                <div
                                                    className="bg-gray-50 border border-gray-200 rounded-lg p-4 cursor-pointer hover:bg-gray-100 transition"
                                                    onClick={() =>
                                                        setExpandedItem(expandedItem === delivery.id ? null : delivery.id)
                                                    }
                                                >
                                                    <div className="flex items-start justify-between mb-2">
                                                        <div>
                                                            <p className="font-bold text-gray-900">{delivery.orderId}</p>
                                                            <p className="text-xs text-gray-600 mt-1">{delivery.area}</p>
                                                        </div>
                                                        <div
                                                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${getRiskColor(
                                                                delivery.riskLevel
                                                            )}`}
                                                        >
                                                            {getRiskIcon(delivery.riskLevel)}
                                                            {delivery.riskLevel}
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-4 text-xs text-gray-600 mt-3">
                                                        <div className="flex items-center gap-1">
                                                            <ClockIcon className="h-4 w-4" />
                                                            <span>
                                                                {delivery.slotStart} - {delivery.slotEnd}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {/* Expanded Details */}
                                                    {expandedItem === delivery.id && (
                                                        <div className="mt-4 pt-4 border-t border-gray-200 space-y-3">
                                                            <div className="grid grid-cols-2 gap-3">
                                                                <div>
                                                                    <p className="text-xs text-gray-600 font-semibold">Distance</p>
                                                                    <p className="text-sm font-medium text-gray-900 mt-1">
                                                                        {delivery.estimatedDistance}
                                                                    </p>
                                                                </div>
                                                                <div>
                                                                    <p className="text-xs text-gray-600 font-semibold">Duration</p>
                                                                    <p className="text-sm font-medium text-gray-900 mt-1">
                                                                        {delivery.estimatedDuration}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Route Summary Card */}
                    <div className="space-y-4">
                        {/* Map Placeholder */}
                        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                            <div className="bg-gray-100 rounded-lg h-48 flex items-center justify-center">
                                <div className="text-center">
                                    <MapIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                                    <p className="text-sm text-gray-600">Map view placeholder</p>
                                    <p className="text-xs text-gray-500 mt-2">Integration ready</p>
                                </div>
                            </div>
                        </div>

                        {/* Route Stats */}
                        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                            <h3 className="font-bold text-gray-900 mb-4">Route Summary</h3>

                            <div className="space-y-3">
                                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                                    <p className="text-sm text-gray-600">Total Distance</p>
                                    <p className="font-semibold text-gray-900">22.5 km</p>
                                </div>

                                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                                    <p className="text-sm text-gray-600">Total Duration</p>
                                    <p className="font-semibold text-gray-900">91 min</p>
                                </div>

                                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                                    <p className="text-sm text-gray-600">Deliveries</p>
                                    <p className="font-semibold text-gray-900">{timelineDeliveries.length}</p>
                                </div>

                                <div className="flex items-center justify-between py-2">
                                    <p className="text-sm text-gray-600">Risk Status</p>
                                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                                        1 High Risk
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
