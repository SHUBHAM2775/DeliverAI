"use client";

import Header from "@/components/Header";
import { useEffect, useState } from "react";
import {
    BellAlertIcon,
    ExclamationTriangleIcon,
    InformationCircleIcon,
} from "@heroicons/react/24/solid";

interface AlertItem {
    riskId: string;
    orderId: string;
    riskType: string;
    riskLevel: string;
    description: string;
    area: string;
    createdAt: string;
}

interface AlertSummary {
    high: number;
    medium: number;
    low: number;
}

const severityMapping: Record<string, { label: string; className: string; icon: string }> = {
    HIGH: {
        label: "Critical",
        className: "bg-rose-50 border border-rose-200/80",
        icon: "🔴",
    },
    MEDIUM: {
        label: "Warning",
        className: "bg-amber-50 border border-amber-200/80",
        icon: "🟡",
    },
    LOW: {
        label: "Info",
        className: "bg-blue-50 border border-blue-200/80",
        icon: "🔵",
    },
};

export default function AlertsPage() {
    const [alerts, setAlerts] = useState<AlertItem[]>([]);
    const [summary, setSummary] = useState<AlertSummary>({ high: 0, medium: 0, low: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchAlerts = async () => {
            try {
                const response = await fetch("/api/admin_apis/alerts");
                if (!response.ok) throw new Error("Failed to fetch alerts");
                const data = await response.json();
                setAlerts(data?.data || []);
                setSummary(data?.summary || { high: 0, medium: 0, low: 0 });
            } catch (err: any) {
                setError(err?.message || "Unable to load alerts");
            } finally {
                setLoading(false);
            }
        };
        fetchAlerts();
    }, []);

    const summaryCards = [
        { label: "Total Alerts", value: summary.high + summary.medium + summary.low, tone: "bg-[#DBEAFE]", text: "text-blue-600" },
        { label: "Critical", value: summary.high, tone: "bg-[#FEE2E2]", text: "text-rose-600" },
        { label: "Warnings", value: summary.medium, tone: "bg-[#FEF3C7]", text: "text-amber-600" },
        { label: "Info", value: summary.low, tone: "bg-[#F3E8FF]", text: "text-purple-600" },
    ];

    if (loading) {
        return (
            <div className="flex-1 overflow-y-auto">
                <div className="p-8 bg-gray-50 min-h-full">
                    <Header title="Smart Alerts & Exceptions" />
                    <div className="bg-white rounded-xl border border-gray-200 p-6 text-center text-gray-600">
                        Loading alerts...
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex-1 overflow-y-auto">
                <div className="p-8 bg-gray-50 min-h-full">
                    <Header title="Smart Alerts & Exceptions" />
                    <div className="bg-white rounded-xl border border-red-200 p-6 text-center text-red-600">
                        {error}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 overflow-y-auto">
            <div className="p-8 bg-gray-50 min-h-full">
                <Header title="Smart Alerts & Exceptions" />

                {/* Summary Cards */}
                <div className="grid grid-cols-4 gap-6 mb-8">
                    {summaryCards.map((card, idx) => (
                        <div key={idx} className={`${card.tone} rounded-xl p-5`}>
                            <p className="text-gray-600 text-sm font-medium">{card.label}</p>
                            <p className={`text-4xl font-bold mt-2 ${card.text}`}>{card.value}</p>
                        </div>
                    ))}
                </div>

                {/* Alerts List */}
                <div className="space-y-4">
                    {alerts.length > 0 ? (
                        alerts.map((alert) => {
                            const severity = severityMapping[alert.riskLevel] || severityMapping.LOW;
                            const timeAgo = new Date(alert.createdAt);
                            const diffMs = Date.now() - timeAgo.getTime();
                            const diffMins = Math.floor(diffMs / 60000);
                            const timeText = diffMins < 60 ? `${diffMins} min ago` : `${Math.floor(diffMins / 60)} hours ago`;

                            return (
                                <div key={alert.riskId} className={`${severity.className} rounded-lg p-6`}>
                                    <div className="flex items-start gap-4">
                                        <div className="text-2xl mt-1">{severity.icon}</div>
                                        <div className="flex-1">
                                            <div className="flex items-start justify-between mb-2">
                                                <div>
                                                    <h3 className="font-bold text-gray-900">{alert.riskType}</h3>
                                                    <p className="text-sm text-gray-600">Order: {alert.orderId}</p>
                                                </div>
                                                <span className="px-3 py-1 rounded-full text-xs font-medium bg-opacity-20 bg-gray-600">
                                                    {timeText}
                                                </span>
                                            </div>
                                            <p className="text-gray-700 mb-2">{alert.description}</p>
                                            <p className="text-sm text-gray-600">📍 {alert.area}</p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="bg-white rounded-lg p-8 text-center text-gray-600 border border-gray-200">
                            No active alerts
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
