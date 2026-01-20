"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
    Squares2X2Icon,
    ClockIcon,
    MapIcon,
    UserGroupIcon,
    PaperAirplaneIcon,
    ExclamationTriangleIcon,
    ChartBarIcon,
} from "@heroicons/react/24/outline";

const menuItems = [
    { name: "Overview", href: "/admin_page/overview", icon: Squares2X2Icon },
    { name: "Slot Intelligence", href: "/admin_page/slot-intelligence", icon: ClockIcon },
    { name: "Route Planner", href: "/admin_page/route-planner", icon: MapIcon },
    { name: "Agents", href: "/admin_page/agents", icon: UserGroupIcon },
    { name: "Pre-Dispatch", href: "/admin_page/pre-dispatch", icon: PaperAirplaneIcon },
    { name: "Alerts", href: "/admin_page/alerts", icon: ExclamationTriangleIcon },
    { name: "Analytics", href: "/admin_page/analytics", icon: ChartBarIcon },
];

export default function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const [hoveredItem, setHoveredItem] = useState<string | null>(null);

    useEffect(() => {
        // Prefetch sidebar destinations so navigation feels instant
        menuItems.forEach((item) => router.prefetch(item.href));
    }, [router]);

    return (
        <aside className="w-20 bg-neutral-900 text-white flex flex-col items-center py-6 px-0 flex-shrink-0 overflow-y-auto relative">
            {/* Logo */}
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center font-bold text-sm mb-6">
                D
            </div>

            {/* Navigation */}
            <nav className="flex flex-col gap-2 items-center">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href || pathname.startsWith(item.href);
                    return (
                        <div key={item.name} className="relative">
                            <Link
                                href={item.href}
                                className={`p-2.5 rounded-lg transition block ${isActive
                                    ? "bg-blue-600 text-white"
                                    : "text-neutral-400 hover:bg-neutral-800 hover:text-white"
                                    }`}
                                onMouseEnter={() => setHoveredItem(item.name)}
                                onMouseLeave={() => setHoveredItem(null)}
                            >
                                <Icon className="h-6 w-6" />
                            </Link>
                            {hoveredItem === item.name && (
                                <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 bg-black px-3 py-1.5 rounded-md whitespace-nowrap text-sm font-medium text-white pointer-events-none z-50">
                                    {item.name}
                                </div>
                            )}
                        </div>
                    );
                })}
            </nav>

            {/* AI Powered Section */}
            <div className="mt-auto pt-4 border-t border-neutral-800 relative">
                <div
                    className="p-2.5 rounded-lg text-blue-400 hover:bg-neutral-800 transition cursor-pointer block"
                    onMouseEnter={() => setHoveredItem("AI Powered")}
                    onMouseLeave={() => setHoveredItem(null)}
                >
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
                    </svg>
                </div>
                {/* {hoveredItem === "AI Powered" && (
                    <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 bg-black px-3 py-1.5 rounded-md whitespace-nowrap text-sm font-medium text-white pointer-events-none z-50">
                        AI Powered
                    </div> */}
                {/* )} */}
            </div>
        </aside>
    );
}
