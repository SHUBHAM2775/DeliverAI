"use client";

import Header from "@/components/Header";
import { useEffect, useState } from "react";

interface PreDispatchOrder {
    confirmationId: string;
    orderId: string;
    confirmationStatus: string;
    riskLevel: string;
    deliveryAddress: string;
    area: string;
    slotTime: string;
    actionSuggested: string;
}

export default function PreDispatchPage() {
    const [orders, setOrders] = useState<PreDispatchOrder[]>([]);
    const [filterStatus, setFilterStatus] = useState("All Orders");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPreDispatch = async () => {
            try {
                const response = await fetch("/api/admin_apis/pre-dispatch");
                if (!response.ok) throw new Error("Failed to fetch pre-dispatch data");
                const data = await response.json();
                setOrders(data?.data || []);
            } catch (err: any) {
                setError(err?.message || "Unable to load pre-dispatch data");
            } finally {
                setLoading(false);
            }
        };
        fetchPreDispatch();
    }, []);

    const displayedOrders = orders.filter((order) => {
        if (filterStatus === "All Orders") return true;
        const status = order.confirmationStatus?.toUpperCase() || "";
        const filterUpper = filterStatus.toUpperCase();
        return status.includes(filterUpper) || status.replace(" ", "") === filterUpper.replace(" ", "");
    });

    const confirmedCount = orders.filter((o) => o.confirmationStatus?.toUpperCase().includes("CONFIRMED")).length;
    const pendingCount = orders.filter((o) => o.confirmationStatus?.toUpperCase().includes("PENDING")).length;
    const unconfirmedCount = orders.filter((o) => o.confirmationStatus?.toUpperCase().includes("UNCONFIRMED")).length;
    const highRiskCount = orders.filter((o) => o.riskLevel?.toUpperCase() === "HIGH").length;

    const getConfirmationStyle = (confirmation: string) => {
        const status = confirmation?.toUpperCase() || "";
        if (status.includes("CONFIRMED")) return "bg-green-50 text-green-700 border border-green-200";
        if (status.includes("PENDING")) return "bg-yellow-50 text-yellow-700 border border-yellow-200";
        if (status.includes("UNCONFIRMED")) return "bg-red-50 text-red-700 border border-red-200";
        return "";
    };

    const getRiskStyle = (riskLevel: string) => {
        const level = riskLevel?.toUpperCase() || "";
        if (level === "HIGH") return "bg-red-50 text-red-700 border border-red-200";
        if (level === "MEDIUM") return "bg-yellow-50 text-yellow-700 border border-yellow-200";
        if (level === "LOW") return "bg-green-50 text-green-700 border border-green-200";
        return "";
    };

    if (loading) {
        return (
            <div className="flex-1 overflow-y-auto">
                <div className="p-8 bg-gray-50 min-h-full">
                    <Header title="Pre-Dispatch" />
                    <div className="bg-white rounded-xl border border-gray-200 p-6 text-center text-gray-600">
                        Loading orders...
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex-1 overflow-y-auto">
                <div className="p-8 bg-gray-50 min-h-full">
                    <Header title="Pre-Dispatch" />
                    <div className="bg-white rounded-xl border border-red-200 p-6 text-center text-red-600">
                        {error}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 overflow-y-auto">
            <div className="p-8 min-h-full">
                <Header title="Pre-Dispatch" />

                {/* Summary Cards */}
                <div className="grid grid-cols-4 gap-6 mb-6">
                    <div className="bg-[#D1FAE5] rounded-xl p-5">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <span className="text-gray-700 font-medium">Confirmed</span>
                        </div>
                        <div className="text-4xl font-bold text-gray-900">{confirmedCount}</div>
                    </div>

                    <div className="bg-[#FEF3C7] rounded-xl p-5">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-6 h-6 rounded-full bg-yellow-500 flex items-center justify-center">
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <span className="text-gray-700 font-medium">Pending</span>
                        </div>
                        <div className="text-4xl font-bold text-gray-900">{pendingCount}</div>
                    </div>

                    <div className="bg-[#FEE2E2] rounded-xl p-5">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center">
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </div>
                            <span className="text-gray-700 font-medium">Unconfirmed</span>
                        </div>
                        <div className="text-4xl font-bold text-gray-900">{unconfirmedCount}</div>
                    </div>

                    <div className="bg-[#F3E8FF] rounded-xl p-5">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center">
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <span className="text-gray-700 font-medium">AI High Risk</span>
                        </div>
                        <div className="text-4xl font-bold text-gray-900">{highRiskCount}</div>
                    </div>
                </div>

                {/* Orders Table */}
                <div className="bg-white rounded-xl border border-gray-200">
                    <div className="flex items-center justify-between p-6 border-b border-gray-200">
                        <h2 className="text-xl font-bold text-gray-900">Pre-Dispatch Orders</h2>
                        <select
                            className="px-4 py-2 border border-gray-200 rounded-lg bg-white text-gray-700 focus:outline-none"
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                        >
                            <option>All Orders</option>
                            <option>Confirmed</option>
                            <option>Pending</option>
                            <option>Unconfirmed</option>
                            <option>High Risk</option>
                        </select>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-200">
                                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-600">Order ID</th>
                                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-600">Address</th>
                                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-600">Slot Time</th>
                                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-600">Confirmation</th>
                                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-600">Risk Level</th>
                                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-600">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {displayedOrders.map((order) => (
                                    <tr key={order.confirmationId} className="border-b border-gray-200 hover:bg-gray-50">
                                        <td className="px-6 py-4 font-bold text-gray-900">{order.orderId}</td>
                                        <td className="px-6 py-4 text-gray-700">{order.deliveryAddress}</td>
                                        <td className="px-6 py-4 text-gray-700">{order.slotTime}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getConfirmationStyle(order.confirmationStatus)}`}>
                                                {order.confirmationStatus}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRiskStyle(order.riskLevel)}`}>
                                                {order.riskLevel}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-700">{order.actionSuggested}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {displayedOrders.length === 0 && (
                        <div className="p-6 text-center text-gray-600">No orders to display</div>
                    )}
                </div>
            </div>
        </div>
    );
}
