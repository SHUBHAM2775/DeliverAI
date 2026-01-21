"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { BellIcon, ChevronDownIcon, ArrowRightOnRectangleIcon, TrashIcon, CheckIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import GoogleTranslate from "./GoogleTranslate";

interface ReceiverHeaderProps {
    title?: string;
    subtitle?: string;
}

interface Notification {
    id: string;
    title: string;
    message: string;
    type: "delivery" | "alert" | "reschedule" | "confirmed";
    timestamp: Date;
    read: boolean;
}

export default function ReceiverHeader({
    title = "Overview",
    subtitle = "Receiver workspace",
}: ReceiverHeaderProps) {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [notifOpen, setNotifOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement | null>(null);
    const notifRef = useRef<HTMLDivElement | null>(null);
    const [displayName, setDisplayName] = useState<string>("Receiver");
    const [avatarUrl, setAvatarUrl] = useState<string>("https://i.pravatar.cc/40?u=receiver");
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);

    // Sample realistic notifications
    const initializeNotifications = () => {
        const now = new Date();
        const samples: Notification[] = [
            {
                id: "1",
                title: "🚚 Delivery Assigned",
                message: "Your order is being prepared for delivery. Driver will arrive between 2-3 PM today.",
                type: "delivery",
                timestamp: new Date(now.getTime() - 15 * 60000), // 15 min ago
                read: false,
            },
            {
                id: "2",
                title: "⏰ Reschedule Request",
                message: "Delivery disruption detected. Please reschedule your delivery slot.",
                type: "reschedule",
                timestamp: new Date(now.getTime() - 45 * 60000), // 45 min ago
                read: false,
            },
            {
                id: "3",
                title: "✓ Delivery Confirmed",
                message: "Your previous delivery has been confirmed. Tracking link: [View Details]",
                type: "confirmed",
                timestamp: new Date(now.getTime() - 2 * 3600000), // 2 hours ago
                read: true,
            },
        ];
        setNotifications(samples);
        setUnreadCount(samples.filter((n) => !n.read).length);
    };

    useEffect(() => {
        initializeNotifications();
    }, []);

    const handleClickOutside = (event: MouseEvent) => {
        if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
            setOpen(false);
        }
        if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
            setNotifOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        const sessionRaw = typeof window !== "undefined" ? localStorage.getItem("rubixSession") : null;
        if (!sessionRaw) return;
        const session = safeParseSession(sessionRaw);
        if (!session?.phone) return;

        const seed = session.avatarSeed ?? Math.floor(Math.random() * 70) + 1;
        setAvatarUrl(`https://i.pravatar.cc/80?img=${seed}`);
        if (session.name) setDisplayName(session.name);

        axios
            .get(`/api/users/by-phone?phone=${encodeURIComponent(session.phone)}`)
            .then((res) => {
                if (res.data?.name) setDisplayName(res.data.name);
            })
            .catch((err) => console.warn("Could not fetch user name", err));
    }, []);

    const safeParseSession = (raw: string) => {
        try {
            return JSON.parse(raw) as { phone?: string; role?: string; name?: string; avatarSeed?: number };
        } catch (e) {
            return null;
        }
    };

    const handleLogout = () => {
        setOpen(false);
        try {
            localStorage.removeItem("rubixSession");
        } catch (e) {
            // ignore
        }
        router.push("/");
    };

    const markAsRead = (id: string) => {
        setNotifications((prev) =>
            prev.map((n) =>
                n.id === id ? { ...n, read: true } : n
            )
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
    };

    const deleteNotification = (id: string) => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
    };

    const getNotificationBgColor = (type: string) => {
        switch (type) {
            case "delivery":
                return "bg-blue-50";
            case "alert":
                return "bg-red-50";
            case "reschedule":
                return "bg-yellow-50";
            case "confirmed":
                return "bg-green-50";
            default:
                return "bg-gray-50";
        }
    };

    const formatTime = (date: Date) => {
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        if (days < 7) return `${days}d ago`;
        return date.toLocaleDateString();
    };

    return (
        <header className="flex items-center justify-between mb-8 pb-6 border-b border-gray-200">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
                <p className="text-sm text-gray-500">{subtitle}</p>
            </div>
            <div className="flex items-center gap-6" ref={menuRef}>
                <GoogleTranslate />
                {/* Notifications Bell */}
                <div ref={notifRef} className="relative">
                    <button
                        onClick={() => setNotifOpen(!notifOpen)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition relative"
                    >
                        <BellIcon className="h-5 w-5 text-gray-600" />
                        {unreadCount > 0 && (
                            <>
                                <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full animate-pulse"></span>
                                <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                                    {unreadCount}
                                </span>
                            </>
                        )}
                    </button>

                    {/* Notifications Dropdown */}
                    {notifOpen && (
                        <div className="absolute right-0 top-full mt-2 w-96 bg-white border border-gray-200 rounded-lg shadow-2xl z-50 max-h-96 overflow-y-auto">
                            <div className="sticky top-0 bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between">
                                <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
                                {unreadCount > 0 && (
                                    <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">
                                        {unreadCount} new
                                    </span>
                                )}
                            </div>

                            {notifications.length === 0 ? (
                                <div className="px-4 py-8 text-center text-gray-500 text-sm">
                                    No notifications yet
                                </div>
                            ) : (
                                <div className="divide-y divide-gray-100">
                                    {notifications.map((notif) => (
                                        <div
                                            key={notif.id}
                                            className={`px-4 py-3 hover:bg-gray-50 transition ${
                                                !notif.read ? "bg-blue-50" : ""
                                            }`}
                                        >
                                            <div className="flex gap-3">
                                                <div className="flex-1">
                                                    <div className="flex items-start justify-between gap-2">
                                                        <p className="text-sm font-semibold text-gray-900">
                                                            {notif.title}
                                                        </p>
                                                        {!notif.read && (
                                                            <button
                                                                onClick={() => markAsRead(notif.id)}
                                                                className="text-blue-500 hover:text-blue-700"
                                                                title="Mark as read"
                                                            >
                                                                <CheckIcon className="h-4 w-4" />
                                                            </button>
                                                        )}
                                                    </div>
                                                    <p className="text-xs text-gray-600 mt-1">
                                                        {notif.message}
                                                    </p>
                                                    <p className="text-xs text-gray-400 mt-2">
                                                        {formatTime(notif.timestamp)}
                                                    </p>
                                                </div>
                                                <button
                                                    onClick={() => deleteNotification(notif.id)}
                                                    className="text-gray-400 hover:text-red-500 transition"
                                                    title="Delete notification"
                                                >
                                                    <TrashIcon className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-3 pl-6 border-l border-gray-200 relative">
                    <button
                        className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-gray-100 transition"
                        onClick={() => setOpen((prev) => !prev)}
                    >
                        <div className="text-right">
                            <p className="text-sm font-semibold text-gray-900">{displayName || "Receiver"}</p>
                            <p className="text-xs text-gray-500">Logged in</p>
                        </div>
                        <img
                            src={avatarUrl}
                            className="h-9 w-9 rounded-full object-cover"
                            alt="avatar"
                        />
                        <ChevronDownIcon className="h-4 w-4 text-gray-500" />
                    </button>
                    {open && (
                        <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-20">
                            <button
                                onClick={handleLogout}
                                className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                            >
                                <ArrowRightOnRectangleIcon className="h-4 w-4 text-gray-500" />
                                Logout to Landing
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
