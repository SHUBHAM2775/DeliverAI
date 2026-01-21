"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
    Squares2X2Icon,
    TruckIcon,
    MapIcon,
    BellIcon,
    DocumentChartBarIcon,
    UserCircleIcon,
    ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";

const menuItems = [
    { name: "Dashboard", href: "/driver_page", icon: Squares2X2Icon },
    { name: "Route Timeline", href: "/driver_page/route", icon: MapIcon },
    { name: "Assigned Deliveries", href: "/driver_page/deliveries", icon: TruckIcon },
    { name: "Notifications", href: "/driver_page/notifications", icon: BellIcon },
    { name: "Profile", href: "/driver_page/profile", icon: UserCircleIcon },
    { name: "Emergency SOS", href: "/driver_page/emergency", icon: ExclamationTriangleIcon },
];

export default function DriverSidebar() {
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
            <img src="/logo.png" alt="DeliverAI" className="h-10 w-10 rounded-lg object-contain mb-6" />

            {/* Navigation */}
            <nav className="flex flex-col gap-2 items-center">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== "/driver_page");
                    return (
                        <div key={item.name} className="relative">
                            <Link
                                href={item.href}
                                className={`p-2.5 rounded-lg transition block ${isActive
                                    ? "bg-blue-600 text-white shadow-sm"
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
        </aside>
    );
}
