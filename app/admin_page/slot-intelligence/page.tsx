"use client";

import Header from "@/components/Header";
import { useState } from "react";

// Icons components
const ClockIcon = () => (
    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" strokeWidth="2" />
        <path strokeWidth="2" d="M12 6v6l4 2" />
    </svg>
);

const SparklesIcon = () => (
    <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 24 24">
        <path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" />
    </svg>
);

const TrendingUpIcon = () => (
    <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
);

const UsersIcon = () => (
    <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zM12.75 12a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" />
    </svg>
);

const SparklesSmallIcon = () => (
    <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
        <path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" />
    </svg>
);

// Heatmap data with success rates
type HeatmapCell = { color: "red" | "yellow" | "green"; rate: number };

const heatmapData: { day: string; values: HeatmapCell[] }[] = [
    { day: "Mon", values: [{color: "yellow", rate: 82}, {color: "green", rate: 96}, {color: "green", rate: 97}, {color: "yellow", rate: 84}, {color: "yellow", rate: 83}, {color: "green", rate: 95}, {color: "green", rate: 96}, {color: "red", rate: 72}] },
    { day: "Tue", values: [{color: "yellow", rate: 81}, {color: "green", rate: 97}, {color: "green", rate: 96}, {color: "yellow", rate: 83}, {color: "yellow", rate: 82}, {color: "green", rate: 96}, {color: "green", rate: 95}, {color: "red", rate: 71}] },
    { day: "Wed", values: [{color: "red", rate: 73}, {color: "green", rate: 96}, {color: "green", rate: 97}, {color: "yellow", rate: 84}, {color: "yellow", rate: 81}, {color: "green", rate: 95}, {color: "yellow", rate: 84}, {color: "red", rate: 70}] },
    { day: "Thu", values: [{color: "yellow", rate: 82}, {color: "green", rate: 95}, {color: "green", rate: 96}, {color: "yellow", rate: 83}, {color: "yellow", rate: 82}, {color: "green", rate: 97}, {color: "green", rate: 96}, {color: "red", rate: 72}] },
    { day: "Fri", values: [{color: "red", rate: 74}, {color: "green", rate: 97}, {color: "green", rate: 95}, {color: "yellow", rate: 82}, {color: "yellow", rate: 83}, {color: "green", rate: 96}, {color: "green", rate: 95}, {color: "red", rate: 71}] },
    { day: "Sat", values: [{color: "yellow", rate: 81}, {color: "green", rate: 96}, {color: "yellow", rate: 84}, {color: "yellow", rate: 83}, {color: "yellow", rate: 82}, {color: "green", rate: 97}, {color: "green", rate: 96}, {color: "red", rate: 73}] },
    { day: "Sun", values: [{color: "red", rate: 72}, {color: "yellow", rate: 83}, {color: "yellow", rate: 84}, {color: "yellow", rate: 82}, {color: "yellow", rate: 81}, {color: "yellow", rate: 84}, {color: "yellow", rate: 83}, {color: "red", rate: 70}] },
];

const timeSlots = ["6-8", "9-11", "11-1", "1-3", "3-5", "5-7", "7-9", "9-11"];

const getHeatmapColor = (color: string) => {
    switch (color) {
        case "green":
            return "bg-[#86EFAC]";
        case "yellow":
            return "bg-[#FEF08A]";
        case "red":
            return "bg-[#FECACA]";
        default:
            return "bg-gray-200";
    }
};

// Slot configuration data
const initialSlots = [
    { id: 1, name: "Early Morning", time: "6:00 - 8:00 AM", demand: 45, capacity: 60, active: true, aiPreferred: false },
    { id: 2, name: "Morning Rush", time: "9:00 - 11:00 AM", demand: 85, capacity: 80, active: true, aiPreferred: true },
    { id: 3, name: "Midday", time: "11:00 AM - 1:00 PM", demand: 70, capacity: 75, active: true, aiPreferred: true },
    { id: 4, name: "Afternoon", time: "1:00 - 3:00 PM", demand: 55, capacity: 70, active: true, aiPreferred: false },
    { id: 5, name: "Late Afternoon", time: "3:00 - 5:00 PM", demand: 65, capacity: 65, active: true, aiPreferred: false },
    { id: 6, name: "Evening Peak", time: "5:00 - 7:00 PM", demand: 95, capacity: 85, active: true, aiPreferred: true },
    { id: 7, name: "Night", time: "7:00 - 9:00 PM", demand: 40, capacity: 50, active: true, aiPreferred: false },
    { id: 8, name: "Late Night", time: "9:00 - 11:00 PM", demand: 20, capacity: 30, active: false, aiPreferred: false },
];

// AI Recommendations data
const recommendations = [
    { name: "Morning Rush", success: 97, description: "Highest success rate with optimal traffic conditions" },
    { name: "Midday", success: 94, description: "Good balance of demand and agent availability" },
    { name: "Evening Peak", success: 91, description: "High demand period, recommend priority allocation" },
];

export default function SlotIntelligencePage() {
    const [slots, setSlots] = useState(initialSlots);

    const toggleSlotActive = (id: number) => {
        setSlots(slots.map(slot =>
            slot.id === id ? { ...slot, active: !slot.active } : slot
        ));
    };

    const toggleAiPreferred = (id: number) => {
        setSlots(slots.map(slot =>
            slot.id === id ? { ...slot, aiPreferred: !slot.aiPreferred } : slot
        ));
    };

    const activeSlots = slots.filter(slot => slot.active).length;
    const aiPreferredCount = slots.filter(slot => slot.aiPreferred).length;

    return (
        <div className="flex-1 overflow-y-auto">
            <div className="p-8 min-h-full">
                <Header title="Slot Intelligence" />

                {/* Section 1: Stats Cards */}
                <div className="grid grid-cols-4 gap-4 mb-6">
                    {/* Active Slots */}
                    <div className="bg-[#DBEAFE] rounded-xl p-5">
                        <div className="flex items-center gap-2 mb-3">
                            <ClockIcon />
                            <span className="text-gray-700 font-medium">Active Slots</span>
                        </div>
                        <div className="text-4xl font-bold text-gray-900">{activeSlots}</div>
                        <div className="text-gray-500 text-sm">of 8 total</div>
                    </div>

                    {/* AI Preferred */}
                    <div className="bg-[#F3E8FF] rounded-xl p-5">
                        <div className="flex items-center gap-2 mb-3">
                            <SparklesIcon />
                            <span className="text-gray-700 font-medium">AI Preferred</span>
                        </div>
                        <div className="text-4xl font-bold text-gray-900">{aiPreferredCount}</div>
                        <div className="text-gray-500 text-sm">optimized slots</div>
                    </div>

                    {/* Avg Success */}
                    <div className="bg-[#D1FAE5] rounded-xl p-5">
                        <div className="flex items-center gap-2 mb-3">
                            <TrendingUpIcon />
                            <span className="text-gray-700 font-medium">Avg Success</span>
                        </div>
                        <div className="text-4xl font-bold text-gray-900">89.3%</div>
                        <div className="text-gray-500 text-sm">across all slots</div>
                    </div>

                    {/* Capacity Used */}
                    <div className="bg-[#FEF3C7] rounded-xl p-5">
                        <div className="flex items-center gap-2 mb-3">
                            <UsersIcon />
                            <span className="text-gray-700 font-medium">Capacity Used</span>
                        </div>
                        <div className="text-4xl font-bold text-gray-900">78%</div>
                        <div className="text-gray-500 text-sm">average utilization</div>
                    </div>
                </div>

                {/* Section 2: Heatmap and AI Recommendations */}
                <div className="grid grid-cols-2 gap-6 mb-6">
                    {/* Success Rate Heatmap */}
                    <div className="bg-white rounded-xl p-6 border border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Success Rate Heatmap</h3>

                        {/* Time labels */}
                        <div className="flex mb-2">
                            <div className="w-12"></div>
                            {timeSlots.map((time, idx) => (
                                <div key={idx} className="flex-1 text-center text-sm text-gray-500">
                                    {time}
                                </div>
                            ))}
                        </div>

                        {/* Heatmap grid */}
                        <div className="space-y-2">
                            {heatmapData.map((row, rowIdx) => (
                                <div key={rowIdx} className="flex items-center">
                                    <div className="w-12 text-sm text-gray-600">{row.day}</div>
                                    <div className="flex-1 flex gap-1">
                                        {row.values.map((cell, colIdx) => (
                                            <div
                                                key={colIdx}
                                                className={`flex-1 h-8 rounded-md ${getHeatmapColor(cell.color)} cursor-pointer transition-transform hover:scale-105 relative group`}
                                            >
                                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
                                                    {cell.rate}% Success
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Legend */}
                        <div className="flex items-center gap-6 mt-4 justify-center">
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 rounded bg-[#FECACA]"></div>
                                <span className="text-sm text-gray-500">&lt;75%</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 rounded bg-[#FEF08A]"></div>
                                <span className="text-sm text-gray-500">80-85%</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 rounded bg-[#86EFAC]"></div>
                                <span className="text-sm text-gray-500">&gt;95%</span>
                            </div>
                        </div>
                    </div>

                    {/* AI Recommendations */}
                    <div className="bg-white rounded-xl p-6 border border-gray-200">
                        <div className="flex items-center gap-2 mb-4">
                            <SparklesSmallIcon />
                            <h3 className="text-lg font-semibold text-gray-900">AI Recommendations</h3>
                        </div>

                        <div className="space-y-3">
                            {recommendations.map((rec, idx) => (
                                <div key={idx} className="bg-[#F3E8FF] rounded-lg p-4">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="font-semibold text-gray-900">{rec.name}</span>
                                        <span className="bg-blue-600 text-white text-sm px-3 py-1 rounded-full">
                                            {rec.success}% Success
                                        </span>
                                    </div>
                                    <p className="text-gray-600 text-sm">{rec.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Section 3: Slot Configuration */}
                <div className="bg-white rounded-xl p-6 border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">Slot Configuration</h3>

                    <div className="grid grid-cols-4 gap-4">
                        {slots.map((slot) => (
                            <div
                                key={slot.id}
                                className={`border border-gray-200 rounded-xl p-4 ${!slot.active ? "opacity-50" : ""}`}
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <span className="font-semibold text-gray-900">{slot.name}</span>
                                    {/* Toggle Switch */}
                                    <button
                                        onClick={() => toggleSlotActive(slot.id)}
                                        className={`relative w-12 h-6 rounded-full transition-colors ${slot.active ? "bg-blue-600" : "bg-gray-300"
                                            }`}
                                    >
                                        <span
                                            className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${slot.active ? "translate-x-7" : "translate-x-1"
                                                }`}
                                        />
                                    </button>
                                </div>

                                <div className="text-blue-600 text-sm mb-4">{slot.time}</div>

                                {/* Demand */}
                                <div className="mb-3">
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-gray-500">Demand</span>
                                        <span className="text-gray-700">{slot.demand}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className="bg-blue-600 h-2 rounded-full"
                                            style={{ width: `${slot.demand}%` }}
                                        />
                                    </div>
                                </div>

                                {/* Capacity */}
                                <div className="mb-4">
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-gray-500">Capacity</span>
                                        <span className="text-gray-700">{slot.capacity}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className="bg-emerald-500 h-2 rounded-full"
                                            style={{ width: `${slot.capacity}%` }}
                                        />
                                    </div>
                                </div>

                                {/* AI Preferred Button */}
                                <button
                                    onClick={() => toggleAiPreferred(slot.id)}
                                    className={`w-full py-2 rounded-lg flex items-center justify-center gap-2 transition-colors ${slot.aiPreferred
                                        ? "bg-blue-600 text-white"
                                        : "bg-gray-100 text-gray-700 border border-gray-300"
                                        }`}
                                >
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                                    </svg>
                                    {slot.aiPreferred ? "AI Preferred" : "Mark AI Preferred"}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
