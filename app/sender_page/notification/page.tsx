"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SenderHeader from "@/components/SenderHeader";
import {
    CheckCircleIcon,
    CubeIcon,
    TruckIcon,
    XCircleIcon,
    ArrowPathIcon,
} from "@heroicons/react/24/outline";

interface NotificationItem {
    id: string;
    type: string;
    message: string;
    orderId?: string;
    isRead?: boolean;
    createdAt?: string;
}

const getIconStyles = (type: string) => {
    switch (type) {
        case "ALERT":
            return { Icon: XCircleIcon, iconBg: "bg-red-500", iconColor: "text-white", border: "border-red-200" };
        case "REMINDER":
        default:
            return { Icon: BellIcon, iconBg: "bg-orange-50", iconColor: "text-orange-600", border: "border-orange-200" };
    }
};

const formatTimestamp = (value?: string) => {
    if (!value) return "";
    const date = new Date(value);
    return date.toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
    });
};

export default function NotificationPage() {
    const router = useRouter();
    const [items, setItems] = useState<NotificationItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                setIsLoading(true);
                const response = await fetch("/api/notifications");
                if (response.ok) {
                    const data = await response.json();
                    setItems(data.notifications || []);
                } else {
                    console.error("Failed to fetch notifications");
                }
            } catch (error) {
                console.error("Error fetching notifications:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchNotifications();
    }, []);

    return (
        <div className="flex-1 overflow-y-auto bg-gray-50">
            <div className="p-8 min-h-full">
                <SenderHeader title="Notifications" subtitle="Stay updated with your deliveries" />

                {/* Notifications List */}
                <div className="space-y-4">
                    {isLoading ? (
                        <div className="bg-white rounded-xl p-6 text-center text-gray-500 border border-gray-100">
                            Loading notifications...
                        </div>
                    ) : items.length === 0 ? (
                        <div className="bg-white rounded-xl p-6 text-center text-gray-500 border border-gray-100">
                            No notifications found
                        </div>
                    ) : (
                        items.map((notification) => {
                            const { Icon, iconBg, iconColor, border } = getIconStyles(notification.type);
                            const isUnread = notification.isRead === false;
                            return (
                                <div
                                    key={notification.id}
                                    className={`bg-white rounded-xl p-5 hover:shadow-md transition-shadow cursor-pointer ${
                                        isUnread ? `border-2 ${border}` : 'border border-gray-100'
                                    }`}
                                >
                                    <div className="flex items-start gap-4">
                                        {/* Icon */}
                                        <div className={`w-12 h-12 rounded-full ${iconBg} flex items-center justify-center flex-shrink-0`}>
                                            <Icon className={`w-6 h-6 ${iconColor}`} />
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1">
                                            <h3 className="text-base font-medium text-gray-900 mb-1">
                                                {notification.message}
                                            </h3>
                                            <div className="flex items-center gap-3">
                                                {notification.orderId && (
                                                    <span className="text-sm font-medium text-orange-500">
                                                        {notification.orderId}
                                                    </span>
                                                )}
                                                <span className="text-sm text-gray-400">
                                                    {formatTimestamp(notification.createdAt)}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Unread indicator */}
                                        {isUnread && (
                                            <div className="w-2 h-2 bg-orange-500 rounded-full flex-shrink-0 mt-2" />
                                        )}
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
}
