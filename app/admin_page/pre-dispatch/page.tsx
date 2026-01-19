"use client";

import Header from "@/components/Header";
import { useState } from "react";

interface Order {
    id: string;
    customer: string;
    slot: string;
    confirmation: "Confirmed" | "Pending" | "Unconfirmed";
    riskLevel: "Low Risk" | "Medium Risk" | "High Risk";
    riskReason?: string;
}

export default function PreDispatchPage() {
    const [filterStatus, setFilterStatus] = useState("All Orders");
    
    const orders: Order[] = [
        {
            id: "ORD-2847",
            customer: "Alice Smith",
            slot: "9-11 AM",
            confirmation: "Confirmed",
            riskLevel: "Low Risk",
        },
        {
            id: "ORD-2848",
            customer: "Bob Johnson",
            slot: "11 AM-1 PM",
            confirmation: "Pending",
            riskLevel: "Medium Risk",
            riskReason: "Customer has 30% no-show history",
        },
        {
            id: "ORD-2849",
            customer: "Carol White",
            slot: "5-7 PM",
            confirmation: "Unconfirmed",
            riskLevel: "High Risk",
            riskReason: "First-time customer, evening slot",
        },
        {
            id: "ORD-2850",
            customer: "David Brown",
            slot: "1-3 PM",
            confirmation: "Confirmed",
            riskLevel: "Low Risk",
        },
        {
            id: "ORD-2851",
            customer: "Eva Martinez",
            slot: "3-5 PM",
            confirmation: "Pending",
            riskLevel: "Medium Risk",
            riskReason: "Multiple reschedules in past",
        },
        {
            id: "ORD-2852",
            customer: "Frank Lee",
            slot: "5-7 PM",
            confirmation: "Unconfirmed",
            riskLevel: "High Risk",
            riskReason: "Address verification pending",
        },
        {
            id: "ORD-2853",
            customer: "Grace Kim",
            slot: "9-11 AM",
            confirmation: "Confirmed",
            riskLevel: "Low Risk",
        },
        {
            id: "ORD-2854",
            customer: "Henry Wilson",
            slot: "11 AM-1 PM",
            confirmation: "Confirmed",
            riskLevel: "Low Risk",
        },
        {
            id: "ORD-2855",
            customer: "Ivy Chen",
            slot: "7-9 PM",
            confirmation: "Pending",
            riskLevel: "High Risk",
            riskReason: "Late slot, high traffic area",
        },
    ];

    const confirmedCount = orders.filter(o => o.confirmation === "Confirmed").length;
    const pendingCount = orders.filter(o => o.confirmation === "Pending").length;
    const unconfirmedCount = orders.filter(o => o.confirmation === "Unconfirmed").length;
    const highRiskCount = orders.filter(o => o.riskLevel === "High Risk").length;

    const getConfirmationStyle = (confirmation: string) => {
        switch (confirmation) {
            case "Confirmed":
                return "bg-green-50 text-green-700 border border-green-200";
            case "Pending":
                return "bg-yellow-50 text-yellow-700 border border-yellow-200";
            case "Unconfirmed":
                return "bg-red-50 text-red-700 border border-red-200";
            default:
                return "";
        }
    };

    const getRiskStyle = (riskLevel: string) => {
        switch (riskLevel) {
            case "Low Risk":
                return "bg-green-50 text-green-700 border border-green-200";
            case "Medium Risk":
                return "bg-yellow-50 text-yellow-700 border border-yellow-200";
            case "High Risk":
                return "bg-red-50 text-red-700 border border-red-200";
            default:
                return "";
        }
    };

    return (
        <div className="flex-1 overflow-y-auto">
            <div className="p-8 min-h-full">
                <Header title="Pre-Dispatch" />
                
                {/* Summary Cards */}
                <div className="grid grid-cols-4 gap-6 mb-6">
                    {/* Confirmed Card */}
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

                    {/* Pending Card */}
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

                    {/* Unconfirmed Card */}
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

                    {/* AI High Risk Card */}
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
                    {/* Table Header */}
                    <div className="flex items-center justify-between p-6 border-b border-gray-200">
                        <h2 className="text-xl font-bold text-gray-900">Pre-Dispatch Orders</h2>
                        <div className="flex items-center gap-2">
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                            </svg>
                            <select 
                                className="px-4 py-2 border border-gray-200 rounded-lg bg-white text-gray-700 focus:outline-none focus:border-gray-300"
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
                    </div>

                    {/* Table Content */}
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Order ID</th>
                                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Customer</th>
                                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Selected Slot</th>
                                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Confirmation</th>
                                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">AI Risk Level</th>
                                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((order) => (
                                    <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{order.id}</td>
                                        <td className="px-6 py-4 text-sm text-gray-700">{order.customer}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-sm text-gray-700">
                                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                {order.slot}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${getConfirmationStyle(order.confirmation)}`}>
                                                {order.confirmation === "Confirmed" && (
                                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                )}
                                                {order.confirmation === "Pending" && (
                                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                )}
                                                {order.confirmation === "Unconfirmed" && (
                                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                )}
                                                {order.confirmation}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-1">
                                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium w-fit ${getRiskStyle(order.riskLevel)}`}>
                                                    {order.riskLevel === "High Risk" && (
                                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                                        </svg>
                                                    )}
                                                    {order.riskLevel}
                                                </span>
                                                {order.riskReason && (
                                                    <span className="text-xs text-gray-500">{order.riskReason}</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <button className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                                    </svg>
                                                    Remind
                                                </button>
                                                <button className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                    Reschedule
                                                </button>
                                            </div>
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
