"use client";

import { useState } from "react";
import Header from "@/components/Header";
import {
    CheckCircleIcon,
    XCircleIcon,
    MapPinIcon,
} from "@heroicons/react/24/outline";

interface AssignedDelivery {
    id: string;
    orderId: string;
    address: string;
    area: string;
    finalTimeSlot: string;
    isFragile: boolean;
    status: "Pending" | "Delivered" | "Failed";
}

// Mock data for assigned deliveries
// TODO: Replace with API data
const assignedDeliveriesData: AssignedDelivery[] = [
    {
        id: "DEL-001",
        orderId: "ORD-2401",
        address: "123 Main St, Apt 4B",
        area: "Koramangala",
        finalTimeSlot: "9:00 AM - 11:00 AM",
        isFragile: true,
        status: "Pending",
    },
    {
        id: "DEL-002",
        orderId: "ORD-2402",
        address: "456 Park Ave, Suite 300",
        area: "Indiranagar",
        finalTimeSlot: "11:00 AM - 1:00 PM",
        isFragile: false,
        status: "Delivered",
    },
    {
        id: "DEL-003",
        orderId: "ORD-2403",
        address: "789 Oak Rd, Building C",
        area: "Marathahalli",
        finalTimeSlot: "1:00 PM - 3:00 PM",
        isFragile: false,
        status: "Pending",
    },
    {
        id: "DEL-004",
        orderId: "ORD-2404",
        address: "321 Elm St, Tower 2",
        area: "Whitefield",
        finalTimeSlot: "3:00 PM - 5:00 PM",
        isFragile: true,
        status: "Pending",
    },
    {
        id: "DEL-005",
        orderId: "ORD-2405",
        address: "654 Maple Dr, Unit 10",
        area: "BTM Layout",
        finalTimeSlot: "5:00 PM - 7:00 PM",
        isFragile: false,
        status: "Failed",
    },
    {
        id: "DEL-006",
        orderId: "ORD-2406",
        address: "987 Cedar Ln, Apt 5",
        area: "Electronic City",
        finalTimeSlot: "9:00 AM - 11:00 AM",
        isFragile: true,
        status: "Delivered",
    },
];

export default function AssignedDeliveriesPage() {
    const [deliveries, setDeliveries] = useState<AssignedDelivery[]>(assignedDeliveriesData);

    const getStatusColor = (status: string) => {
        switch (status) {
            case "Delivered":
                return "bg-green-100 text-green-700";
            case "Pending":
                return "bg-yellow-100 text-yellow-700";
            case "Failed":
                return "bg-red-100 text-red-700";
            default:
                return "bg-gray-100 text-gray-700";
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "Delivered":
                return <CheckCircleIcon className="h-4 w-4" />;
            case "Failed":
                return <XCircleIcon className="h-4 w-4" />;
            default:
                return null;
        }
    };

    const handleMarkDelivered = (id: string) => {
        setDeliveries((prev) =>
            prev.map((d) =>
                d.id === id ? { ...d, status: "Delivered" as const } : d
            )
        );
    };

    const handleMarkFailed = (id: string) => {
        setDeliveries((prev) =>
            prev.map((d) =>
                d.id === id ? { ...d, status: "Failed" as const } : d
            )
        );
    };

    return (
        <div className="flex-1 overflow-y-auto bg-gray-50">
            <div className="p-6 min-h-full">
                <Header title="Assigned Deliveries" role="Driver" />

                {/* Deliveries Grid/List */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                    {deliveries.map((delivery) => (
                        <div
                            key={delivery.id}
                            className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex items-start gap-3">
                                    <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                                        <MapPinIcon className="h-5 w-5 text-blue-600" strokeWidth="2" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900">{delivery.orderId}</p>
                                        <p className="text-xs text-gray-500">{delivery.id}</p>
                                    </div>
                                </div>
                                <div
                                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                        delivery.status
                                    )}`}
                                >
                                    {getStatusIcon(delivery.status)}
                                    {delivery.status}
                                </div>
                            </div>

                            <div className="space-y-2 mb-4">
                                <div>
                                    <p className="text-xs text-gray-500 uppercase font-semibold">Address</p>
                                    <p className="text-sm text-gray-700 mt-0.5">{delivery.address}</p>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase font-semibold">Area</p>
                                        <p className="text-sm text-gray-700 mt-0.5">{delivery.area}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase font-semibold">Time Slot</p>
                                        <p className="text-sm text-gray-700 mt-0.5">{delivery.finalTimeSlot}</p>
                                    </div>
                                </div>

                                <div>
                                    <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Indicators</p>
                                    <div className="flex gap-2">
                                        {delivery.isFragile && (
                                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-700">
                                                🔨 Fragile
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            {delivery.status === "Pending" && (
                                <div className="flex gap-2 pt-3 border-t border-gray-100">
                                    <button
                                        onClick={() => handleMarkDelivered(delivery.id)}
                                        className="flex-1 bg-green-600 text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-green-700 transition"
                                    >
                                        ✓ Mark Delivered
                                    </button>
                                    <button
                                        onClick={() => handleMarkFailed(delivery.id)}
                                        className="flex-1 bg-red-600 text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-red-700 transition"
                                    >
                                        ✗ Mark Failed
                                    </button>
                                </div>
                            )}

                            {delivery.status === "Delivered" && (
                                <div className="pt-3 border-t border-gray-100">
                                    <p className="text-xs text-green-600 font-semibold text-center">✓ Delivery completed successfully</p>
                                </div>
                            )}

                            {delivery.status === "Failed" && (
                                <div className="pt-3 border-t border-gray-100">
                                    <p className="text-xs text-red-600 font-semibold text-center">✗ Delivery failed - pending resolution</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Summary Footer */}
                <div className="mt-8 bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                    <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                            <p className="text-2xl font-bold text-gray-900">
                                {deliveries.filter((d) => d.status === "Delivered").length}
                            </p>
                            <p className="text-xs text-gray-600 mt-1">Delivered</p>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900">
                                {deliveries.filter((d) => d.status === "Pending").length}
                            </p>
                            <p className="text-xs text-gray-600 mt-1">Pending</p>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900">
                                {deliveries.filter((d) => d.status === "Failed").length}
                            </p>
                            <p className="text-xs text-gray-600 mt-1">Failed</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
