"use client";

import Header from "@/components/Header";
import {
    BellAlertIcon,
    ExclamationTriangleIcon,
    InformationCircleIcon,
    MapPinIcon,
    XMarkIcon,
} from "@heroicons/react/24/solid";
import { CheckCircleIcon } from "@heroicons/react/24/outline";

type AlertSeverity = "critical" | "warning" | "info";

interface AlertItem {
    id: string;
    title: string;
    severity: AlertSeverity;
    description: string;
    location: string;
    timeAgo: string;
    unread?: boolean;
}

const summaryCards = [
    { label: "Total Alerts", value: 7, tone: "bg-[#DBEAFE]", text: "text-blue-600", icon: BellAlertIcon },
    { label: "Critical", value: 2, tone: "bg-[#FEE2E2]", text: "text-rose-600", icon: ExclamationTriangleIcon },
    { label: "Warnings", value: 3, tone: "bg-[#FEF3C7]", text: "text-amber-600", icon: ExclamationTriangleIcon },
    { label: "Unread", value: 3, tone: "bg-[#F3E8FF]", text: "text-purple-600", icon: InformationCircleIcon },
];

const alerts: AlertItem[] = [
    {
        id: "major-traffic",
        title: "Major Traffic Disruption",
        severity: "critical",
        description: "Highway I-95 closed due to accident. Expected delay of 45+ minutes for Downtown deliveries.",
        location: "Downtown · Midtown",
        timeAgo: "5 min ago",
        unread: true,
    },
    {
        id: "rain",
        title: "Heavy Rain Expected",
        severity: "warning",
        description: "Weather forecast predicts heavy rain between 4-7 PM. Consider rescheduling outdoor deliveries.",
        location: "All Areas",
        timeAgo: "15 min ago",
        unread: true,
    },
    {
        id: "agent-delay",
        title: "Agent Delay Reported",
        severity: "warning",
        description: "Agent A-034 (Sarah Chen) running 25 minutes behind schedule. 3 deliveries affected.",
        location: "All Areas",
        timeAgo: "20 min ago",
        unread: true,
    },
    {
        id: "slot-overbook",
        title: "Slot Overbooking Alert",
        severity: "critical",
        description: "5-7 PM slot has exceeded capacity by 15%. AI recommends redistributing 8 orders to adjacent slots.",
        location: "Downtown",
        timeAgo: "30 min ago",
    },
    {
        id: "road-construction",
        title: "Road Construction Notice",
        severity: "info",
        description: "Lane closures on Main Street through Friday. Minor delays expected.",
        location: "Uptown",
        timeAgo: "1 hour ago",
    },
    {
        id: "new-agent",
        title: "New Agent Onboarded",
        severity: "info",
        description: "Agent A-145 (Tom Anderson) has completed training and is now available for assignments.",
        location: "All Areas",
        timeAgo: "2 hours ago",
    },
    {
        id: "low-confirm",
        title: "Low Confirmation Rate",
        severity: "warning",
        description: "7-9 PM slot showing 65% confirmation rate. AI suggests proactive outreach.",
        location: "All Areas",
        timeAgo: "3 hours ago",
    },
];

const severityStyles: Record<AlertSeverity, string> = {
    critical: "bg-rose-50 border border-rose-200/80",
    warning: "bg-amber-50 border border-amber-200/80",
    info: "bg-blue-50 border border-blue-200/80",
};

const severityBadge: Record<AlertSeverity, { label: string; className: string; Icon: typeof ExclamationTriangleIcon }>
    = {
        critical: {
            label: "critical",
            className: "bg-rose-100 text-rose-700 ring-1 ring-rose-200",
            Icon: ExclamationTriangleIcon,
        },
        warning: {
            label: "warning",
            className: "bg-amber-100 text-amber-700 ring-1 ring-amber-200",
            Icon: ExclamationTriangleIcon,
        },
        info: {
            label: "info",
            className: "bg-blue-100 text-blue-700 ring-1 ring-blue-200",
            Icon: InformationCircleIcon,
        },
    };

export default function AlertsPage() {
    return (
        <div className="flex-1 overflow-y-auto">
            <div className="p-8 min-h-full">
                <Header title="Alerts" />
                <div className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                        {summaryCards.map((card) => {
                            const Icon = card.icon;
                            return (
                                <div
                                    key={card.label}
                                    className={`${card.tone} rounded-xl p-5 flex items-start gap-3 shadow-sm`}
                                >
                                    <div className={`${card.text} bg-white/70 rounded-lg p-2 shadow-inner`}>{<Icon className="h-6 w-6" />}</div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">{card.label}</p>
                                        <p className="text-3xl font-bold text-gray-900 mt-1">{card.value}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900">All Alerts</h2>
                                <p className="text-sm text-gray-600">Monitor and resolve delivery incidents</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition">
                                    Mark all as read
                                </button>
                            </div>
                        </div>

                        <div className="divide-y divide-gray-100">
                            {alerts.map((alert) => {
                                const badge = severityBadge[alert.severity];
                                const Icon = badge.Icon;
                                return (
                                    <div
                                        key={alert.id}
                                        className={`px-6 py-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between ${severityStyles[alert.severity]}`}
                                    >
                                        <div className="flex items-start gap-4">
                                            <div className="h-11 w-11 rounded-xl bg-white shadow-sm flex items-center justify-center text-gray-700">
                                                <Icon className="h-6 w-6" />
                                            </div>
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <p className="text-base font-semibold text-gray-900">{alert.title}</p>
                                                    <span className={`${badge.className} px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wide flex items-center gap-1`}>
                                                        <Icon className="h-4 w-4" />
                                                        {badge.label}
                                                    </span>
                                                    {alert.unread && <span className="h-2 w-2 rounded-full bg-blue-600" aria-hidden />}
                                                </div>
                                                <p className="text-sm text-gray-700 max-w-3xl leading-relaxed">{alert.description}</p>
                                                <div className="flex items-center gap-4 text-sm text-gray-600">
                                                    <span className="inline-flex items-center gap-1"> <MapPinIcon className="h-4 w-4" /> {alert.location}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 self-start md:self-auto">
                                            <span className="text-sm text-gray-500 whitespace-nowrap">{alert.timeAgo}</span>
                                            <button className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-800 bg-white/80 hover:bg-white rounded-lg border border-gray-200 shadow-sm transition">
                                                <CheckCircleIcon className="h-5 w-5" />
                                                Resolve
                                            </button>
                                            <button className="p-2 text-gray-500 hover:text-gray-800 rounded-lg hover:bg-white" aria-label="Dismiss">
                                                <XMarkIcon className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
