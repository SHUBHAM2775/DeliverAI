"use client";

import Header from "@/components/Header";
import { useState } from "react";
import { motion, Easing } from "framer-motion";

// Animation variants
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as const }
    }
};

const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] as const }
    }
};

const barVariants = {
    hidden: { height: 0 },
    visible: (height: number) => ({
        height: `${height}%`,
        transition: { duration: 0.8, ease: "easeOut", delay: 0.3 }
    })
};

const progressVariants = {
    hidden: { width: 0 },
    visible: (width: number) => ({
        width: `${width}%`,
        transition: { duration: 1, ease: "easeOut", delay: 0.3 }
    })
};

// Icons
const TrendingUpIcon = () => (
    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
);

const CheckCircleIcon = () => (
    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const ClockIcon = () => (
    <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" strokeWidth="2" />
        <path strokeWidth="2" d="M12 6v6l4 2" />
    </svg>
);

const UsersIcon = () => (
    <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M12.75 12a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" />
    </svg>
);

const SparklesIcon = () => (
    <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
        <path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" />
    </svg>
);

const ChevronDownIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
    </svg>
);

// Data for charts
const barChartData = [
    { month: "Jan", before: 76, after: 88 },
    { month: "Feb", before: 74, after: 90 },
    { month: "Mar", before: 80, after: 92 },
    { month: "Apr", before: 78, after: 91 },
    { month: "May", before: 82, after: 94 },
    { month: "Jun", before: 79, after: 93 },
];

const areaData = [
    { name: "Downtown", rate: 96 },
    { name: "Midtown", rate: 92 },
    { name: "Uptown", rate: 88 },
    { name: "Suburbs", rate: 85 },
    { name: "Industrial", rate: 82 },
];

const slotAdherenceData = [
    { time: "6-8 AM", rate: 92 },
    { time: "9-11 AM", rate: 98 },
    { time: "11-1 PM", rate: 95 },
    { time: "1-3 PM", rate: 90 },
    { time: "3-5 PM", rate: 85 },
    { time: "5-7 PM", rate: 88 },
    { time: "7-9 PM", rate: 84 },
];

const performanceDistribution = [
    { label: "Excellent (95%+)", value: 35, color: "#22C55E" },
    { label: "Good (85-95%)", value: 40, color: "#3B82F6" },
    { label: "Average (75-85%)", value: 18, color: "#EAB308" },
    { label: "Below Avg (<75%)", value: 7, color: "#EF4444" },
];

export default function AnalyticsPage() {
    const [timeRange, setTimeRange] = useState("Last 6 Months");
    const [hoveredBar, setHoveredBar] = useState<{ month: string; type: string; value: number } | null>(null);
    const [hoveredArea, setHoveredArea] = useState<{ name: string; rate: number } | null>(null);
    const [hoveredSlot, setHoveredSlot] = useState<{ time: string; rate: number; x: number; y: number } | null>(null);
    const [hoveredSegment, setHoveredSegment] = useState<{ label: string; value: number } | null>(null);

    // Calculate SVG path for area chart
    const getAreaPath = () => {
        const width = 600;
        const height = 200;
        const padding = 40;
        const chartWidth = width - padding * 2;
        const chartHeight = height - padding;

        const points = slotAdherenceData.map((d, i) => {
            const x = padding + (i * chartWidth) / (slotAdherenceData.length - 1);
            const y = height - padding - ((d.rate - 70) / 30) * chartHeight;
            return { x, y };
        });

        let path = `M ${points[0].x} ${height - padding}`;
        path += ` L ${points[0].x} ${points[0].y}`;

        for (let i = 0; i < points.length - 1; i++) {
            const curr = points[i];
            const next = points[i + 1];
            const cpX = (curr.x + next.x) / 2;
            path += ` C ${cpX} ${curr.y}, ${cpX} ${next.y}, ${next.x} ${next.y}`;
        }

        path += ` L ${points[points.length - 1].x} ${height - padding}`;
        path += ` Z`;

        return path;
    };

    const getLinePath = () => {
        const width = 600;
        const height = 200;
        const padding = 40;
        const chartWidth = width - padding * 2;
        const chartHeight = height - padding;

        const points = slotAdherenceData.map((d, i) => {
            const x = padding + (i * chartWidth) / (slotAdherenceData.length - 1);
            const y = height - padding - ((d.rate - 70) / 30) * chartHeight;
            return { x, y };
        });

        let path = `M ${points[0].x} ${points[0].y}`;

        for (let i = 0; i < points.length - 1; i++) {
            const curr = points[i];
            const next = points[i + 1];
            const cpX = (curr.x + next.x) / 2;
            path += ` C ${cpX} ${curr.y}, ${cpX} ${next.y}, ${next.x} ${next.y}`;
        }

        return path;
    };

    const getChartPoints = () => {
        const width = 600;
        const height = 200;
        const padding = 40;
        const chartWidth = width - padding * 2;
        const chartHeight = height - padding;

        return slotAdherenceData.map((d, i) => ({
            x: padding + (i * chartWidth) / (slotAdherenceData.length - 1),
            y: height - padding - ((d.rate - 70) / 30) * chartHeight,
            ...d
        }));
    };

    const getDonutSegments = () => {
        const total = performanceDistribution.reduce((sum, d) => sum + d.value, 0);
        let currentAngle = -90;
        const segments: { path: string; color: string; label: string; value: number; midAngle: number }[] = [];

        performanceDistribution.forEach((item) => {
            const angle = (item.value / total) * 360;
            const startAngle = currentAngle;
            const endAngle = currentAngle + angle;
            const midAngle = (startAngle + endAngle) / 2;

            const startRad = (startAngle * Math.PI) / 180;
            const endRad = (endAngle * Math.PI) / 180;

            const radius = 80;
            const innerRadius = 50;
            const cx = 100;
            const cy = 100;

            const x1 = cx + radius * Math.cos(startRad);
            const y1 = cy + radius * Math.sin(startRad);
            const x2 = cx + radius * Math.cos(endRad);
            const y2 = cy + radius * Math.sin(endRad);
            const x3 = cx + innerRadius * Math.cos(endRad);
            const y3 = cy + innerRadius * Math.sin(endRad);
            const x4 = cx + innerRadius * Math.cos(startRad);
            const y4 = cy + innerRadius * Math.sin(startRad);

            const largeArc = angle > 180 ? 1 : 0;

            const path = `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} L ${x3} ${y3} A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${x4} ${y4} Z`;

            segments.push({ path, color: item.color, label: item.label, value: item.value, midAngle });
            currentAngle = endAngle;
        });

        return segments;
    };

    return (
        <div className="flex-1 overflow-y-auto">
            <div className="p-8 min-h-full">
                <Header title="Analytics" />

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {/* Section 1: AI Performance Analytics Header */}
                    <motion.div variants={itemVariants} className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2">
                            <motion.div
                                animate={{ rotate: [0, 15, -15, 0] }}
                                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                            >
                                <SparklesIcon />
                            </motion.div>
                            <h2 className="text-xl font-semibold text-gray-900">AI Performance Analytics</h2>
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            <span>{timeRange}</span>
                            <ChevronDownIcon />
                        </motion.button>
                    </motion.div>

                    {/* Stats Cards */}
                    <motion.div variants={containerVariants} className="grid grid-cols-4 gap-4 mb-6">
                        {/* AI Improvement */}
                        <motion.div
                            variants={cardVariants}
                            whileHover={{ scale: 1.02, boxShadow: "0 10px 40px rgba(0,0,0,0.1)" }}
                            className="bg-[#DBEAFE] rounded-xl p-5 cursor-pointer transition-shadow"
                        >
                            <div className="flex items-center gap-2 mb-3">
                                <TrendingUpIcon />
                                <span className="text-gray-700 font-medium">AI Improvement</span>
                            </div>
                            <motion.div
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.5, duration: 0.5 }}
                                className="text-4xl font-bold text-blue-600"
                            >
                                +18.2%
                            </motion.div>
                            <div className="text-gray-500 text-sm">vs without AI</div>
                        </motion.div>

                        {/* Success Rate */}
                        <motion.div
                            variants={cardVariants}
                            whileHover={{ scale: 1.02, boxShadow: "0 10px 40px rgba(0,0,0,0.1)" }}
                            className="bg-[#D1FAE5] rounded-xl p-5 cursor-pointer transition-shadow"
                        >
                            <div className="flex items-center gap-2 mb-3">
                                <CheckCircleIcon />
                                <span className="text-gray-700 font-medium">Success Rate</span>
                            </div>
                            <motion.div
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.6, duration: 0.5 }}
                                className="text-4xl font-bold text-gray-900"
                            >
                                94.2%
                            </motion.div>
                            <div className="text-gray-500 text-sm">overall average</div>
                        </motion.div>

                        {/* Slot Adherence */}
                        <motion.div
                            variants={cardVariants}
                            whileHover={{ scale: 1.02, boxShadow: "0 10px 40px rgba(0,0,0,0.1)" }}
                            className="bg-[#F3E8FF] rounded-xl p-5 cursor-pointer transition-shadow"
                        >
                            <div className="flex items-center gap-2 mb-3">
                                <ClockIcon />
                                <span className="text-gray-700 font-medium">Slot Adherence</span>
                            </div>
                            <motion.div
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.7, duration: 0.5 }}
                                className="text-4xl font-bold text-gray-900"
                            >
                                91.5%
                            </motion.div>
                            <div className="text-gray-500 text-sm">on-time delivery</div>
                        </motion.div>

                        {/* Agent Efficiency */}
                        <motion.div
                            variants={cardVariants}
                            whileHover={{ scale: 1.02, boxShadow: "0 10px 40px rgba(0,0,0,0.1)" }}
                            className="bg-[#FEF3C7] rounded-xl p-5 cursor-pointer transition-shadow"
                        >
                            <div className="flex items-center gap-2 mb-3">
                                <UsersIcon />
                                <span className="text-gray-700 font-medium">Agent Efficiency</span>
                            </div>
                            <motion.div
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.8, duration: 0.5 }}
                                className="text-4xl font-bold text-gray-900"
                            >
                                87.3%
                            </motion.div>
                            <div className="text-gray-500 text-sm">route optimization</div>
                        </motion.div>
                    </motion.div>

                    {/* Section 2 & 3: Before vs After & Area-wise Success Rate */}
                    <motion.div variants={containerVariants} className="grid grid-cols-2 gap-6 mb-6">
                        {/* Before vs After AI Implementation */}
                        <motion.div
                            variants={itemVariants}
                            whileHover={{ boxShadow: "0 10px 40px rgba(0,0,0,0.08)" }}
                            className="bg-white rounded-xl p-6 border border-gray-200 transition-shadow"
                        >
                            <h3 className="text-lg font-semibold text-gray-900 mb-6">Before vs After AI Implementation</h3>

                            <div className="relative h-64">
                                {/* Y-axis labels */}
                                <div className="absolute left-0 top-0 bottom-8 w-10 flex flex-col justify-between text-xs text-gray-500">
                                    <span>100%</span>
                                    <span>90%</span>
                                    <span>80%</span>
                                    <span>70%</span>
                                    <span>60%</span>
                                </div>

                                {/* Chart area */}
                                <div className="ml-10 h-full flex items-end justify-around pb-8">
                                    {barChartData.map((item, idx) => (
                                        <div key={idx} className="flex flex-col items-center gap-1 relative group">
                                            <div 
                                                className="flex items-end gap-1 h-44 relative cursor-pointer"
                                                onMouseEnter={() => setHoveredBar({ month: item.month, type: 'both', value: item.before })}
                                                onMouseLeave={() => setHoveredBar(null)}
                                            >
                                                {/* Tooltip */}
                                                {hoveredBar?.month === item.month && (
                                                    <motion.div
                                                        initial={{ opacity: 0, y: 10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        className="absolute -top-24 left-1/2 -translate-x-1/2 bg-white shadow-lg border border-gray-200 rounded-lg px-4 py-3 whitespace-nowrap z-30"
                                                    >
                                                        <div className="font-semibold text-gray-900 text-sm mb-2">{item.month}</div>
                                                        <div className="flex items-center gap-2 text-sm text-gray-500">
                                                            <span>:</span>
                                                            <span>{item.before}%</span>
                                                        </div>
                                                        <div className="flex items-center gap-2 text-sm text-blue-600">
                                                            <span>:</span>
                                                            <span>{item.after}%</span>
                                                        </div>
                                                    </motion.div>
                                                )}
                                                {/* Before bar */}
                                                <motion.div
                                                    className="w-6 bg-gray-300 rounded-t-sm"
                                                    initial={{ height: 0 }}
                                                    animate={{ height: `${((item.before - 60) / 40) * 100}%` }}
                                                    transition={{ duration: 0.8, delay: 0.3 + idx * 0.1 }}
                                                    whileHover={{ scale: 1.05 }}
                                                />
                                                {/* After bar */}
                                                <motion.div
                                                    className="w-6 bg-blue-600 rounded-t-sm"
                                                    initial={{ height: 0 }}
                                                    animate={{ height: `${((item.after - 60) / 40) * 100}%` }}
                                                    transition={{ duration: 0.8, delay: 0.4 + idx * 0.1 }}
                                                    whileHover={{ scale: 1.05 }}
                                                />
                                            </div>
                                            <span className="text-xs text-gray-500">{item.month}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Legend */}
                            <div className="flex items-center justify-center gap-6 mt-2">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-gray-300 rounded-sm"></div>
                                    <span className="text-sm text-gray-500">Before AI</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-blue-600 rounded-sm"></div>
                                    <span className="text-sm text-blue-600 font-medium">After AI</span>
                                </div>
                            </div>
                        </motion.div>

                        {/* Area-wise Success Rate */}
                        <motion.div
                            variants={itemVariants}
                            whileHover={{ boxShadow: "0 10px 40px rgba(0,0,0,0.08)" }}
                            className="bg-white rounded-xl p-6 border border-gray-200 transition-shadow"
                        >
                            <h3 className="text-lg font-semibold text-gray-900 mb-6">Area-wise Success Rate</h3>

                            <div className="space-y-4">
                                {areaData.map((area, idx) => (
                                    <div
                                        key={idx}
                                        className="flex items-center gap-4 group cursor-pointer relative"
                                        onMouseEnter={() => setHoveredArea(area)}
                                        onMouseLeave={() => setHoveredArea(null)}
                                    >
                                        <div className="w-20 text-sm text-gray-600 text-right">{area.name}</div>
                                        <div className="flex-1 h-8 bg-gray-100 rounded-lg overflow-hidden relative">
                                            <motion.div
                                                className="h-full bg-[#22C55E] rounded-lg"
                                                initial={{ width: 0 }}
                                                animate={{ width: `${area.rate}%` }}
                                                transition={{ duration: 1, delay: 0.3 + idx * 0.15, ease: "easeOut" }}
                                                whileHover={{ filter: "brightness(1.1)" }}
                                            />
                                            {hoveredArea?.name === area.name && (
                                                <motion.div
                                                    initial={{ opacity: 0, scale: 0.9 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white shadow-lg border border-gray-200 rounded-lg px-4 py-3 z-20"
                                                >
                                                    <div className="font-semibold text-gray-900 text-sm">{area.name}</div>
                                                    <div className="text-[#22C55E] text-sm">Success Rate : {area.rate}%</div>
                                                </motion.div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* X-axis labels */}
                            <div className="flex justify-between ml-24 mt-4 text-xs text-gray-500">
                                <span>0%</span>
                                <span>25%</span>
                                <span>50%</span>
                                <span>75%</span>
                                <span>100%</span>
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* Section 4 & 5: Slot Adherence Rate & Agent Performance Distribution */}
                    <motion.div variants={containerVariants} className="grid grid-cols-2 gap-6">
                        {/* Slot Adherence Rate */}
                        <motion.div
                            variants={itemVariants}
                            whileHover={{ boxShadow: "0 10px 40px rgba(0,0,0,0.08)" }}
                            className="bg-white rounded-xl p-6 border border-gray-200 transition-shadow"
                        >
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Slot Adherence Rate</h3>

                            <svg viewBox="0 0 600 220" className="w-full h-48">
                                <defs>
                                    <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                        <stop offset="0%" stopColor="#E9D5FF" stopOpacity="0.8" />
                                        <stop offset="100%" stopColor="#E9D5FF" stopOpacity="0.2" />
                                    </linearGradient>
                                </defs>

                                {/* Y-axis labels */}
                                <text x="25" y="25" className="text-xs fill-gray-500">100%</text>
                                <text x="25" y="65" className="text-xs fill-gray-500">86%</text>
                                <text x="25" y="115" className="text-xs fill-gray-500">78%</text>
                                <text x="25" y="165" className="text-xs fill-gray-500">70%</text>

                                {/* Horizontal grid lines */}
                                <line x1="50" y1="20" x2="580" y2="20" stroke="#E5E7EB" strokeWidth="1" />
                                <line x1="50" y1="60" x2="580" y2="60" stroke="#E5E7EB" strokeWidth="1" />
                                <line x1="50" y1="110" x2="580" y2="110" stroke="#E5E7EB" strokeWidth="1" />
                                <line x1="50" y1="160" x2="580" y2="160" stroke="#E5E7EB" strokeWidth="1" />

                                {/* Area fill */}
                                <motion.path
                                    d={getAreaPath()}
                                    fill="url(#areaGradient)"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 1, delay: 0.5 }}
                                />

                                {/* Line */}
                                <motion.path
                                    d={getLinePath()}
                                    fill="none"
                                    stroke="#A855F7"
                                    strokeWidth="2"
                                    initial={{ pathLength: 0 }}
                                    animate={{ pathLength: 1 }}
                                    transition={{ duration: 1.5, delay: 0.5, ease: "easeInOut" }}
                                />

                                {/* Data points with hover */}
                                {getChartPoints().map((point, i) => (
                                    <g key={i}>
                                        {/* Vertical line on hover */}
                                        {hoveredSlot?.time === point.time && (
                                            <line
                                                x1={point.x}
                                                y1={20}
                                                x2={point.x}
                                                y2={160}
                                                stroke="#E5E7EB"
                                                strokeWidth="1"
                                                strokeDasharray="4,4"
                                            />
                                        )}
                                        <motion.circle
                                            cx={point.x}
                                            cy={point.y}
                                            r="6"
                                            fill="#A855F7"
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ delay: 0.8 + i * 0.1 }}
                                            style={{ cursor: 'pointer' }}
                                            onMouseEnter={() => setHoveredSlot({ time: point.time, rate: point.rate, x: point.x, y: point.y })}
                                            onMouseLeave={() => setHoveredSlot(null)}
                                        />
                                        {hoveredSlot?.time === point.time && (
                                            <foreignObject
                                                x={point.x + 10}
                                                y={point.y - 10}
                                                width="120"
                                                height="60"
                                            >
                                                <div className="bg-white shadow-lg border border-gray-200 rounded-lg px-3 py-2">
                                                    <div className="font-semibold text-gray-900 text-sm">{point.time}</div>
                                                    <div className="text-purple-500 text-sm">Adherence : {point.rate}%</div>
                                                </div>
                                            </foreignObject>
                                        )}
                                    </g>
                                ))}

                                {/* X-axis labels */}
                                {slotAdherenceData.map((d, i) => (
                                    <text
                                        key={i}
                                        x={40 + (i * 520) / (slotAdherenceData.length - 1)}
                                        y="195"
                                        className="text-xs fill-gray-500"
                                        textAnchor="middle"
                                    >
                                        {d.time}
                                    </text>
                                ))}
                            </svg>
                        </motion.div>

                        {/* Agent Performance Distribution */}
                        <motion.div
                            variants={itemVariants}
                            whileHover={{ boxShadow: "0 10px 40px rgba(0,0,0,0.08)" }}
                            className="bg-white rounded-xl p-6 border border-gray-200 transition-shadow"
                        >
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Agent Performance Distribution</h3>

                            <div className="flex items-center justify-center relative">
                                <svg viewBox="0 0 200 200" className="w-48 h-48">
                                    {getDonutSegments().map((segment, idx) => (
                                        <motion.path
                                            key={idx}
                                            d={segment.path}
                                            fill={segment.color}
                                            initial={{ scale: 0, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            transition={{ duration: 0.5, delay: 0.5 + idx * 0.15 }}
                                            style={{ cursor: 'pointer', transformOrigin: '100px 100px' }}
                                            whileHover={{ scale: 1.05 }}
                                            onMouseEnter={() => setHoveredSegment({ label: segment.label, value: segment.value })}
                                            onMouseLeave={() => setHoveredSegment(null)}
                                        />
                                    ))}
                                    {/* Center text when hovered */}
                                    {hoveredSegment && (
                                        <g>
                                            <text
                                                x="100"
                                                y="95"
                                                textAnchor="middle"
                                                fill="#374151"
                                                fontSize="20"
                                                fontWeight="bold"
                                            >
                                                {hoveredSegment.value}%
                                            </text>
                                            <text
                                                x="100"
                                                y="115"
                                                textAnchor="middle"
                                                fill="#6B7280"
                                                fontSize="10"
                                            >
                                                {hoveredSegment.label.split(' ')[0]}
                                            </text>
                                        </g>
                                    )}
                                </svg>
                            </div>

                            {/* Legend */}
                            <motion.div
                                className="flex flex-wrap justify-center gap-4 mt-4"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 1.2 }}
                            >
                                {performanceDistribution.map((item, idx) => (
                                    <motion.div
                                        key={idx}
                                        className="flex items-center gap-2 cursor-pointer"
                                        whileHover={{ scale: 1.05 }}
                                        onMouseEnter={() => setHoveredSegment({ label: item.label, value: item.value })}
                                        onMouseLeave={() => setHoveredSegment(null)}
                                    >
                                        <div
                                            className="w-3 h-3 rounded-full"
                                            style={{ backgroundColor: item.color }}
                                        />
                                        <span className="text-sm text-gray-600">{item.label}</span>
                                    </motion.div>
                                ))}
                            </motion.div>
                        </motion.div>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
}
