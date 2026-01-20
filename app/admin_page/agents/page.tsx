"use client";

import Header from "@/components/Header";
import { Star, MapPin } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type AgentItem = {
    agentId: string;
    userId: string;
    name: string;
    phone?: string;
    age: string | number;
    rating: string;
    successRate: string;
    avgDelayMinutes: string;
    preferredAreas: string[];
    currentStatus: string;
    totalDeliveries: number;
    accountStatus: string;
    bestAreaSuggestion: string;
    performanceTrend?: string;
};

const getAvatarUrl = (seed: string) => `https://i.pravatar.cc/120?u=${encodeURIComponent(seed)}`;


export default function AgentsPage() {
    const [agents, setAgents] = useState<AgentItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchAgents = async () => {
            try {
                const response = await fetch("/api/admin_apis/agents");
                if (!response.ok) {
                    throw new Error("Failed to fetch agents");
                }

                const data = await response.json();
                setAgents(data?.data || []);
            } catch (err: any) {
                setError(err?.message || "Unable to load agents");
            } finally {
                setLoading(false);
            }
        };

        fetchAgents();
    }, []);

    const parseRating = (rating: string) => {
        const value = parseFloat(rating);
        return Number.isFinite(value) ? value : 0;
    };

    const parseSuccess = (successRate: string) => {
        const value = parseFloat(successRate?.replace("%", ""));
        return Number.isFinite(value) ? value : 0;
    };

    const statsData = useMemo(() => {
        const totalAgents = agents.length;
        const activeNow = agents.filter((agent) => agent.currentStatus?.toLowerCase() === "active").length;
        const avgRating = agents.length
            ? (agents.reduce((sum, agent) => sum + parseRating(agent.rating), 0) / agents.length).toFixed(1)
            : "0.0";
        const deliveries = agents.reduce((sum, agent) => sum + (agent.totalDeliveries || 0), 0);

        return [
            { label: "Total Agents", value: String(totalAgents), bgColor: "bg-[#DBEAFE]" },
            { label: "Active Now", value: String(activeNow), bgColor: "bg-[#D1FAE5]" },
            { label: "Avg Rating", value: avgRating, bgColor: "bg-[#FCE7F3]" },
            { label: "Deliveries (All-Time)", value: deliveries.toLocaleString(), bgColor: "bg-[#FEF3C7]" },
        ];
    }, [agents]);

    const topPerformers = useMemo(() => {
        const sorted = [...agents].sort((a, b) => {
            const ratingDiff = parseRating(b.rating) - parseRating(a.rating);
            if (ratingDiff !== 0) return ratingDiff;
            return parseSuccess(b.successRate) - parseSuccess(a.successRate);
        });

        const colors = ["bg-[#FEF3C7]", "bg-[#FCE7F3]", "bg-[#DBEAFE]"];

        return sorted.slice(0, 3).map((agent, idx) => ({
            ...agent,
            id: agent.agentId,
            success: `${parseSuccess(agent.successRate).toFixed(1)}%`,
            bgColor: colors[idx] || "bg-gray-100",
            tag: agent.bestAreaSuggestion,
        }));
    }, [agents]);

    const statusStyles = (status: string) => {
        const normalized = status?.toLowerCase();
        if (normalized === "active") return "bg-green-100 text-green-800";
        if (normalized === "busy") return "bg-yellow-100 text-yellow-800";
        if (normalized === "offline") return "bg-gray-200 text-gray-700";
        if (normalized === "suspended") return "bg-red-100 text-red-700";
        return "bg-blue-100 text-blue-700";
    };

    const preferredArea = (areas: string[]) => (areas && areas.length > 0 ? areas[0] : "Not specified");

    const successWidth = (rate: string) => {
        const value = parseSuccess(rate);
        return `${Math.min(Math.max(value, 0), 100)}%`;
    };

    const showLoadingOrError = loading || error;

    return (
        <div className="flex-1 overflow-y-auto">
            <div className="p-8 min-h-full bg-gray-50">
                <Header title="Agent Management" />

                {showLoadingOrError && (
                    <div className="mb-6">
                        <div className="bg-white border border-gray-200 rounded-xl p-4 text-sm text-gray-700">
                            {loading ? "Loading agents..." : error}
                        </div>
                    </div>
                )}

                {/* Stats Cards */}
                <div className="grid grid-cols-4 gap-6 mb-8">
                    {statsData.map((stat, idx) => (
                        <div key={idx} className={`${stat.bgColor} rounded-xl p-5`}>
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-gray-600 text-sm font-medium">{stat.label}</p>
                                    <p className="text-4xl font-bold text-gray-900 mt-2">{stat.value}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Top Performers */}
                <div className="mb-8">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <span>🏆</span> Top Performers
                    </h3>
                    <div className="grid grid-cols-3 gap-6">
                        {topPerformers.map((performer, idx) => (
                            <div key={idx} className={`${performer.bgColor} rounded-xl p-5`}>
                                <div className="flex items-center gap-4 mb-4">
                                    <img
                                        src={getAvatarUrl(performer.agentId)}
                                        alt={performer.name}
                                        className="h-12 w-12 rounded-full object-cover border border-white shadow"
                                    />
                                    <div>
                                        <h4 className="font-bold text-gray-900">{performer.name}</h4>
                                        <p className="text-gray-600 text-sm">{performer.phone || "Phone N/A"}</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <p className="text-gray-600">Rating</p>
                                        <p className="font-bold text-gray-900 flex items-center gap-1">
                                            <Star size={16} className="fill-yellow-400 text-yellow-400" /> {performer.rating}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-gray-600">Success</p>
                                        <p className="font-bold text-gray-900">{performer.success}</p>
                                    </div>
                                </div>
                                <div className="mt-4 pt-4 border-t border-gray-300">
                                    <p className="text-xs text-gray-600 flex items-center gap-1">
                                        ✨ {performer.bestAreaSuggestion}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* All Agents Table */}
                <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-4">All Agents</h3>
                    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-200">
                                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-600">Agent</th>
                                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-600">Rating</th>
                                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-600">Success Rate</th>
                                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-600">Area</th>
                                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-600">Status</th>
                                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-600">AI Tag</th>
                                </tr>
                            </thead>
                            <tbody>
                                {agents.map((agent) => (
                                    <tr key={agent.agentId} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <img
                                                    src={getAvatarUrl(agent.agentId)}
                                                    alt={agent.name}
                                                    className="h-10 w-10 rounded-full object-cover border border-white shadow"
                                                />
                                                <div>
                                                    <p className="font-bold text-gray-900">{agent.name}</p>
                                                    <p className="text-sm text-gray-600">{agent.phone || "Phone N/A"}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1 font-bold text-gray-900">
                                                <Star size={16} className="fill-yellow-400 text-yellow-400" /> {agent.rating}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-24 bg-gray-200 rounded-full h-2">
                                                    <div
                                                        className="bg-blue-500 h-2 rounded-full"
                                                        style={{ width: successWidth(agent.successRate) }}
                                                    />
                                                </div>
                                                <span className="text-sm font-medium text-gray-900">{agent.successRate}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1 text-gray-900">
                                                <MapPin size={16} className="text-gray-500" /> {preferredArea(agent.preferredAreas)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusStyles(agent.currentStatus || agent.accountStatus)}`}>
                                                ● {agent.currentStatus || agent.accountStatus || "Unknown"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-700">
                                                ✨ {agent.bestAreaSuggestion}
                                            </span>
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
