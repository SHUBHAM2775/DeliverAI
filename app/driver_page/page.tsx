"use client";

import { useState } from "react";
import Header from "@/components/Header";
import {
    TruckIcon,
    CheckCircleIcon,
    ClockIcon,
    ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";

interface DeliveryItem {
    id: string;
    orderId: string;
    area: string;
    timeSlot: string;
    status: "On Time" | "At Risk" | "Delayed";
    isFragile: boolean;
}

// Mock data for today's deliveries
// TODO: Replace with API data
const todaysDeliveries: DeliveryItem[] = [
    {
        id: "DEL-001",
        orderId: "ORD-2401",
        area: "Koramangala",
        timeSlot: "9:00 AM - 11:00 AM",
        status: "On Time",
        isFragile: true,
    },
    {
        id: "DEL-002",
        orderId: "ORD-2402",
        area: "Indiranagar",
        timeSlot: "11:00 AM - 1:00 PM",
        status: "On Time",
        isFragile: false,
    },
    {
        id: "DEL-003",
        orderId: "ORD-2403",
        area: "Marathahalli",
        timeSlot: "1:00 PM - 3:00 PM",
        status: "At Risk",
        isFragile: false,
    },
    {
        id: "DEL-004",
        orderId: "ORD-2404",
        area: "Whitefield",
        timeSlot: "3:00 PM - 5:00 PM",
        status: "On Time",
        isFragile: true,
    },
    {
        id: "DEL-005",
        orderId: "ORD-2405",
        area: "BTM Layout",
        timeSlot: "5:00 PM - 7:00 PM",
        status: "Delayed",
        isFragile: false,
    },
];

export default function DriverDashboard() {
    const [selectedStatus] = useState<"All" | "On Time" | "At Risk" | "Delayed">("All");

    // Calculate metrics
    const totalDeliveries = todaysDeliveries.length;
    const completedDeliveries = Math.floor(totalDeliveries * 0.6);
    const pendingDeliveries = totalDeliveries - completedDeliveries;
    const atRiskDeliveries = todaysDeliveries.filter((d) => d.status === "At Risk").length;

    const getStatusColor = (status: string) => {
        switch (status) {
            case "On Time":
                return "bg-green-100 text-green-700";
            case "At Risk":
                return "bg-yellow-100 text-yellow-700";
            case "Delayed":
                return "bg-red-100 text-red-700";
            default:
                return "bg-gray-100 text-gray-700";
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "On Time":
                return <CheckCircleIcon className="h-4 w-4" />;
            case "At Risk":
                return <ExclamationTriangleIcon className="h-4 w-4" />;
            case "Delayed":
                return <ClockIcon className="h-4 w-4" />;
            default:
                return null;
        }
    };

    return (
        <div className="flex-1 overflow-y-auto bg-gray-50">
            <div className="p-6 min-h-full">
                <Header title="Dashboard" role="Driver" />

                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
                    {/* Total Deliveries Today */}
                    <div className="bg-[#DBEAFE] rounded-xl p-5">
                        <div className="flex items-start justify-between mb-2">
                            <div className="h-10 w-10 rounded-xl bg-blue-100 flex items-center justify-center">
                                <TruckIcon className="h-5 w-5 text-blue-600" strokeWidth="2" />
                            </div>
                            <span className="text-blue-600 text-xs font-semibold bg-blue-100 px-2.5 py-1 rounded-full">
                                Today
                            </span>
                        </div>
                        <p className="text-3xl font-bold text-gray-900 mb-1">{totalDeliveries}</p>
                        <p className="text-gray-500 text-xs mb-0.5">Total Deliveries Today</p>
                        <p className="text-xs text-gray-400">All assigned orders</p>
                    </div>

                    {/* Completed Deliveries */}
                    <div className="bg-[#D1FAE5] rounded-xl p-5">
                        <div className="flex items-start justify-between mb-2">
                            <div className="h-10 w-10 rounded-xl bg-green-100 flex items-center justify-center">
                                <CheckCircleIcon className="h-5 w-5 text-green-600" strokeWidth="2" />
                            </div>
                            <span className="text-green-600 text-xs font-semibold bg-green-100 px-2.5 py-1 rounded-full">
                                ↗ {Math.round((completedDeliveries / totalDeliveries) * 100)}%
                            </span>
                        </div>
                        <p className="text-3xl font-bold text-gray-900 mb-1">{completedDeliveries}</p>
                        <p className="text-gray-500 text-xs mb-0.5">Completed Deliveries</p>
                        <p className="text-xs text-gray-400">Delivered successfully</p>
                    </div>

                    {/* Pending Deliveries */}
                    <div className="bg-[#FEF3C7] rounded-xl p-5">
                        <div className="flex items-start justify-between mb-2">
                            <div className="h-10 w-10 rounded-xl bg-yellow-100 flex items-center justify-center">
                                <ClockIcon className="h-5 w-5 text-yellow-600" strokeWidth="2" />
                            </div>
                            <span className="text-yellow-600 text-xs font-semibold bg-yellow-100 px-2.5 py-1 rounded-full">
                                Pending
                            </span>
                        </div>
                        <p className="text-3xl font-bold text-gray-900 mb-1">{pendingDeliveries}</p>
                        <p className="text-gray-500 text-xs mb-0.5">Pending Deliveries</p>
                        <p className="text-xs text-gray-400">Awaiting delivery</p>
                    </div>

                    {/* At-Risk Deliveries */}
                    <div className="bg-[#FEE2E2] rounded-xl p-5">
                        <div className="flex items-start justify-between mb-2">
                            <div className="h-10 w-10 rounded-xl bg-red-100 flex items-center justify-center">
                                <ExclamationTriangleIcon className="h-5 w-5 text-red-600" strokeWidth="2" />
                            </div>
                            <span className="text-red-600 text-xs font-semibold bg-red-100 px-2.5 py-1 rounded-full">
                                Alert
                            </span>
                        </div>
                        <p className="text-3xl font-bold text-gray-900 mb-1">{atRiskDeliveries}</p>
                        <p className="text-gray-500 text-xs mb-0.5">At-Risk Deliveries</p>
                        <p className="text-xs text-gray-400">Requires attention</p>
                    </div>
                </div>

                {/* Today's Delivery Timeline */}
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">Today's Delivery Timeline</h2>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600">Order ID</th>
                                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600">Area</th>
                                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600">Time Slot</th>
                                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600">Status</th>
                                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600">Fragile</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(selectedStatus === "All"
                                    ? todaysDeliveries
                                    : todaysDeliveries.filter((d) => d.status === selectedStatus)
                                ).map((delivery) => (
                                    <tr key={delivery.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                                        <td className="py-3 px-4 text-sm font-medium text-gray-900">{delivery.orderId}</td>
                                        <td className="py-3 px-4 text-sm text-gray-600">{delivery.area}</td>
                                        <td className="py-3 px-4 text-sm text-gray-600">{delivery.timeSlot}</td>
                                        <td className="py-3 px-4">
                                            <div
                                                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                                    delivery.status
                                                )}`}
                                            >
                                                {getStatusIcon(delivery.status)}
                                                {delivery.status}
                                            </div>
                                        </td>
                                        <td className="py-3 px-4">
                                            {delivery.isFragile ? (
                                                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-700">
                                                    🔨 Fragile
                                                </span>
                                            ) : (
                                                <span className="text-sm text-gray-400">-</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
