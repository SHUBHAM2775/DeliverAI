"use client";

import Header from "@/components/Header";
import { Star, MapPin } from "lucide-react";

const getAvatarUrl = (seed: string) => `https://i.pravatar.cc/120?u=${encodeURIComponent(seed)}`;

const statsData = [
    { label: "Total Agents", value: "8", bgColor: "bg-[#DBEAFE]" },
    { label: "Active Now", value: "5", bgColor: "bg-[#D1FAE5]" },
    { label: "Avg Rating", value: "4.7", bgColor: "bg-[#FCE7F3]" },
    { label: "Deliveries Today", value: "155", bgColor: "bg-[#FEF3C7]" },
];

const topPerformers = [
    {
        name: "John Miller",
        id: "A-012",
        rating: 4.9,
        success: "98%",
        tag: "Best for Morning Slots",
        bgColor: "bg-[#FEF3C7]",
    },
    {
        name: "Emily Davis",
        id: "A-078",
        rating: 4.9,
        success: "97%",
        tag: "Long-Distance Specialist",
        bgColor: "bg-[#FCE7F3]",
    },
    {
        name: "Sarah Chen",
        id: "A-034",
        rating: 4.8,
        success: "96%",
        tag: "High-Volume Expert",
        bgColor: "bg-[#DBEAFE]",
    },
];

const allAgentsData = [
    {
        name: "John Miller",
        id: "A-012",
        rating: 4.9,
        success: 98,
        area: "Downtown",
        status: "Active",
        statusColor: "bg-green-100 text-green-800",
        tag: "Best for Morning Slots",
    },
    {
        name: "Sarah Chen",
        id: "A-034",
        rating: 4.8,
        success: 96,
        area: "Midtown",
        status: "Busy",
        statusColor: "bg-yellow-100 text-yellow-800",
        tag: "High-Volume Expert",
    },
    {
        name: "Mike Johnson",
        id: "A-056",
        rating: 4.7,
        success: 94,
        area: "Uptown",
        status: "Active",
        statusColor: "bg-green-100 text-green-800",
        tag: "Best for Evening Slots",
    },
    {
        name: "Emily Davis",
        id: "A-078",
        rating: 4.9,
        success: 97,
        area: "Suburbs",
        status: "Active",
        statusColor: "bg-green-100 text-green-800",
        tag: "Long-Distance Specialist",
    },
    {
        name: "David Wilson",
        id: "A-089",
        rating: 4.6,
        success: 92,
        area: "Industrial",
        status: "Busy",
        statusColor: "bg-yellow-100 text-yellow-800",
        tag: "",
    },
    {
        name: "Lisa Thompson",
        id: "A-101",
        rating: 4.8,
        success: 95,
        area: "Downtown",
        status: "Active",
        statusColor: "bg-green-100 text-green-800",
        tag: "Rush Hour Expert",
    },
    {
        name: "James Brown",
        id: "A-112",
        rating: 4.5,
        success: 91,
        area: "Midtown",
        status: "Offline",
        statusColor: "bg-gray-200 text-gray-700",
        tag: "",
    },
    {
        name: "Anna Garcia",
        id: "A-123",
        rating: 4.7,
        success: 93,
        area: "Uptown",
        status: "Active",
        statusColor: "bg-green-100 text-green-800",
        tag: "Weekend Specialist",
    },
];

export default function AgentsPage() {
    return (
        <div className="flex-1 overflow-y-auto">
            <div className="p-8 min-h-full bg-gray-50">
                <Header title="Agent Management" />

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
                                        src={getAvatarUrl(performer.id)}
                                        alt={performer.name}
                                        className="h-12 w-12 rounded-full object-cover border border-white shadow"
                                    />
                                    <div>
                                        <h4 className="font-bold text-gray-900">{performer.name}</h4>
                                        <p className="text-gray-600 text-sm">{performer.id}</p>
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
                                        ✨ {performer.tag}
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
                                {allAgentsData.map((agent, idx) => (
                                    <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <img
                                                    src={getAvatarUrl(agent.id)}
                                                    alt={agent.name}
                                                    className="h-10 w-10 rounded-full object-cover border border-white shadow"
                                                />
                                                <div>
                                                    <p className="font-bold text-gray-900">{agent.name}</p>
                                                    <p className="text-sm text-gray-600">{agent.id}</p>
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
                                                        style={{ width: `${agent.success}%` }}
                                                    />
                                                </div>
                                                <span className="text-sm font-medium text-gray-900">{agent.success}%</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1 text-gray-900">
                                                <MapPin size={16} className="text-gray-500" /> {agent.area}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${agent.statusColor}`}>
                                                ● {agent.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-700">
                                                ✨ {agent.tag}
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
