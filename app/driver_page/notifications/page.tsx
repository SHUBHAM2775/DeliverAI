"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import {
    BellIcon,
    CheckIcon,
    ExclamationTriangleIcon,
    TruckIcon,
    MapPinIcon,
    ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";

interface Notification {
    id: string;
    type: "reminder" | "update" | "alert";
    message: string;
    timestamp: string;
    isRead: boolean;
    icon: React.ReactNode;
}

// Mock notifications data
// TODO: Replace with API data
const notificationsData: Notification[] = [
    {
        id: "NOTIF-001",
        type: "reminder",
        message: "Upcoming delivery slot: ORD-2401 in Koramangala (9:00 AM - 11:00 AM)",
        timestamp: "2 min ago",
        isRead: false,
        icon: <BellIcon className="h-5 w-5" />,
    },
    {
        id: "NOTIF-002",
        type: "alert",
        message: "ORD-2405 in BTM Layout is at risk - heavy traffic detected",
        timestamp: "8 min ago",
        isRead: false,
        icon: <ExclamationTriangleIcon className="h-5 w-5" />,
    },
    {
        id: "NOTIF-003",
        type: "update",
        message: "Route optimized - New efficient path suggested",
        timestamp: "15 min ago",
        isRead: true,
        icon: <MapPinIcon className="h-5 w-5" />,
    },
    {
        id: "NOTIF-004",
        type: "reminder",
        message: "Delivery completed: ORD-2402 marked as delivered",
        timestamp: "32 min ago",
        isRead: true,
        icon: <CheckIcon className="h-5 w-5" />,
    },
    {
        id: "NOTIF-005",
        type: "update",
        message: "New delivery assignment: ORD-2406 added to your route",
        timestamp: "45 min ago",
        isRead: true,
        icon: <TruckIcon className="h-5 w-5" />,
    },
    {
        id: "NOTIF-006",
        type: "alert",
        message: "Fragile item alert - ORD-2401 requires careful handling",
        timestamp: "1 hour ago",
        isRead: true,
        icon: <ExclamationTriangleIcon className="h-5 w-5" />,
    },
    {
        id: "NOTIF-007",
        type: "reminder",
        message: "Daily briefing: 5 deliveries scheduled for today",
        timestamp: "2 hours ago",
        isRead: true,
        icon: <BellIcon className="h-5 w-5" />,
    },
];

export default function NotificationsPage() {
    const router = useRouter();
    const [notifications, setNotifications] = useState<Notification[]>(notificationsData);
    const [filter, setFilter] = useState<"all" | "unread">("all");

    const filteredNotifications = filter === "unread" 
        ? notifications.filter(n => !n.isRead)
        : notifications;

    const getTypeColor = (type: string) => {
        switch (type) {
            case "reminder":
                return "bg-blue-50 border-blue-200 text-blue-700";
            case "update":
                return "bg-green-50 border-green-200 text-green-700";
            case "alert":
                return "bg-red-50 border-red-200 text-red-700";
            default:
                return "bg-gray-50 border-gray-200 text-gray-700";
        }
    };

    const getTypeLabel = (type: string) => {
        switch (type) {
            case "reminder":
                return "Reminder";
            case "update":
                return "Update";
            case "alert":
                return "Alert";
            default:
                return "Notification";
        }
    };

    const markAsRead = (id: string) => {
        setNotifications((prev) =>
            prev.map((n) =>
                n.id === id ? { ...n, isRead: true } : n
            )
        );
    };

    const markAllAsRead = () => {
        setNotifications((prev) =>
            prev.map((n) => ({ ...n, isRead: true }))
        );
    };

    const unreadCount = notifications.filter(n => !n.isRead).length;

    return (
        <div className="flex-1 overflow-y-auto bg-gray-50">
            <div className="p-6 min-h-full">
                <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-200">
                    <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
                    <div className="flex items-center gap-4">
                        {unreadCount > 0 && (
                            <button
                                onClick={markAllAsRead}
                                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                            >
                                Mark all as read
                            </button>
                        )}
                        <button
                            onClick={() => router.push("/")}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition border border-gray-200"
                        >
                            <ArrowRightOnRectangleIcon className="h-4 w-4" />
                            Logout
                        </button>
                    </div>
                </div>

                {/* Filter Tabs */}
                <div className="flex gap-2 mb-6">
                    <button
                        onClick={() => setFilter("all")}
                        className={`px-4 py-2 rounded-lg font-medium transition ${
                            filter === "all"
                                ? "bg-blue-600 text-white"
                                : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                        }`}
                    >
                        All Notifications
                    </button>
                    <button
                        onClick={() => setFilter("unread")}
                        className={`px-4 py-2 rounded-lg font-medium transition flex items-center gap-2 ${
                            filter === "unread"
                                ? "bg-blue-600 text-white"
                                : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                        }`}
                    >
                        Unread
                        {unreadCount > 0 && (
                            <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                                {unreadCount}
                            </span>
                        )}
                    </button>
                </div>

                {/* Notifications List */}
                <div className="space-y-3">
                    {filteredNotifications.length === 0 ? (
                        <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
                            <BellIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                            <p className="text-gray-600 font-medium">No notifications</p>
                            <p className="text-sm text-gray-500 mt-1">All caught up! You're all set.</p>
                        </div>
                    ) : (
                        filteredNotifications.map((notification) => (
                            <div
                                key={notification.id}
                                className={`border rounded-lg p-4 cursor-pointer transition ${
                                    notification.isRead
                                        ? "bg-white border-gray-200 hover:bg-gray-50"
                                        : "bg-blue-50 border-blue-200 hover:bg-blue-100"
                                }`}
                                onClick={() => markAsRead(notification.id)}
                            >
                                <div className="flex items-start gap-4">
                                    {/* Icon */}
                                    <div
                                        className={`flex-shrink-0 h-10 w-10 rounded-lg flex items-center justify-center ${
                                            notification.type === "reminder"
                                                ? "bg-blue-100 text-blue-600"
                                                : notification.type === "update"
                                                    ? "bg-green-100 text-green-600"
                                                    : "bg-red-100 text-red-600"
                                        }`}
                                    >
                                        {notification.icon}
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-2">
                                            <div>
                                                <p
                                                    className={`text-sm font-medium ${
                                                        notification.isRead ? "text-gray-900" : "text-gray-900 font-bold"
                                                    }`}
                                                >
                                                    {notification.message}
                                                </p>
                                                <div className="flex items-center gap-2 mt-2">
                                                    <span
                                                        className={`text-xs font-medium px-2 py-1 rounded-full ${getTypeColor(
                                                            notification.type
                                                        )}`}
                                                    >
                                                        {getTypeLabel(notification.type)}
                                                    </span>
                                                    <p className="text-xs text-gray-500">{notification.timestamp}</p>
                                                </div>
                                            </div>

                                            {/* Read Status */}
                                            <div className="flex-shrink-0">
                                                {!notification.isRead && (
                                                    <div className="h-2.5 w-2.5 rounded-full bg-blue-600"></div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
