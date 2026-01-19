"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ProfileDropdown from "@/components/ProfileDropdown";
import {
    MagnifyingGlassIcon,
    BellIcon,
    CheckCircleIcon,
    CubeIcon,
    TruckIcon,
    XCircleIcon,
    ArrowPathIcon,
} from "@heroicons/react/24/outline";

// Notification data
const notifications = [
    {
        id: 1,
        type: "confirmed",
        title: "Customer confirmed delivery slot for iPhone 15 Pro Max",
        orderId: "ORD-001",
        timestamp: "Jan 18, 2:25 PM",
        icon: CheckCircleIcon,
        iconBg: "bg-green-50",
        iconColor: "text-green-600",
        isUnread: false,
    },
    {
        id: 2,
        type: "delivered",
        title: "Homemade Cake delivered successfully",
        orderId: "ORD-003",
        timestamp: "Jan 19, 12:15 PM",
        icon: CubeIcon,
        iconBg: "bg-green-500",
        iconColor: "text-white",
        isUnread: false,
    },
    {
        id: 3,
        type: "out-for-delivery",
        title: "Blood Pressure Medicine is out for delivery",
        orderId: "ORD-005",
        timestamp: "Jan 20, 8:45 AM",
        icon: TruckIcon,
        iconBg: "bg-blue-50",
        iconColor: "text-blue-600",
        isUnread: false,
    },
    {
        id: 4,
        type: "failed",
        title: "Delivery failed for Samsung Galaxy Tab - Customer unavailable",
        orderId: "ORD-006",
        timestamp: "Jan 18, 3:00 PM",
        icon: XCircleIcon,
        iconBg: "bg-red-500",
        iconColor: "text-white",
        isUnread: false,
    },
    {
        id: 5,
        type: "viewed",
        title: "Customer viewed the delivery request for Legal Documents",
        orderId: "ORD-002",
        timestamp: "Jan 19, 10:00 AM",
        icon: ArrowPathIcon,
        iconBg: "bg-orange-50",
        iconColor: "text-orange-600",
        isUnread: true,
        border: "border-orange-200",
    },
];

export default function NotificationPage() {
    const router = useRouter();
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    return (
        <div className="flex-1 overflow-y-auto bg-gray-50">
            <div className="p-8 min-h-full">
                {/* Header */}
                <header className="flex items-center justify-between mb-8 pb-6 border-b border-gray-200 relative z-10">
                    <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
                    <div className="flex items-center gap-6">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search orders..."
                                className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 w-56"
                            />
                            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        </div>
                        <button 
                            className="p-2 hover:bg-gray-100 rounded-lg transition relative"
                            onClick={() => router.push('/sender_page/notification')}
                        >
                            <BellIcon className="h-5 w-5 text-gray-600" />
                            <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">1</span>
                        </button>
                        <div 
                            className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition relative"
                            onClick={() => setIsProfileOpen(!isProfileOpen)}
                        >
                            <span className="text-sm font-medium text-gray-700">Rahul Sharma</span>
                            <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white font-semibold">
                                RS
                            </div>
                            <ProfileDropdown isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
                        </div>
                    </div>
                </header>

                {/* Notifications List */}
                <div className="space-y-4">
                    {notifications.map((notification) => {
                        const Icon = notification.icon;
                        return (
                            <div
                                key={notification.id}
                                className={`bg-white rounded-xl p-5 hover:shadow-md transition-shadow cursor-pointer ${
                                    notification.isUnread ? `border-2 ${notification.border}` : 'border border-gray-100'
                                }`}
                            >
                                <div className="flex items-start gap-4">
                                    {/* Icon */}
                                    <div className={`w-12 h-12 rounded-full ${notification.iconBg} flex items-center justify-center flex-shrink-0`}>
                                        <Icon className={`w-6 h-6 ${notification.iconColor}`} />
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1">
                                        <h3 className="text-base font-medium text-gray-900 mb-1">
                                            {notification.title}
                                        </h3>
                                        <div className="flex items-center gap-3">
                                            <span className="text-sm font-medium text-orange-500">
                                                {notification.orderId}
                                            </span>
                                            <span className="text-sm text-gray-400">
                                                {notification.timestamp}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Unread indicator */}
                                    {notification.isUnread && (
                                        <div className="w-2 h-2 bg-orange-500 rounded-full flex-shrink-0 mt-2" />
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
