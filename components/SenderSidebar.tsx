"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
    Squares2X2Icon,
    PlusIcon,
    ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";

const senderMenuItems = [
    { name: "Dashboard", href: "/sender_page/dashboard", icon: Squares2X2Icon },
    { name: "New Delivery", href: "/sender_page/delivery-form", icon: PlusIcon },
    { name: "Emergency SOS", href: "/sender_page/emergency", icon: ExclamationTriangleIcon },
];

export default function SenderSidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const [hoveredItem, setHoveredItem] = useState<string | null>(null);

    useEffect(() => {
        senderMenuItems.forEach((item) => router.prefetch(item.href));
    }, [router]);

    return (
        <aside className="w-20 bg-neutral-900 text-white flex flex-col items-center py-6 px-0 flex-shrink-0 overflow-y-auto relative">
            {/* Logo */}
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center font-bold text-sm mb-6">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
            </div>

            {/* Navigation */}
            <nav className="flex flex-col gap-2 items-center">
                {senderMenuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                    const isExactActive = pathname === item.href;
                    return (
                        <div key={item.name} className="relative">
                            <Link
                                href={item.href}
                                className={`p-2.5 rounded-lg transition block ${
                                    isExactActive
                                        ? "bg-orange-500 text-white"
                                        : isActive
                                        ? "bg-orange-500/50 text-white"
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
