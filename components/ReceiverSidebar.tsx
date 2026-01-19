"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
    ClipboardDocumentListIcon,
    CheckCircleIcon,
    BellIcon,
    UserIcon,
} from "@heroicons/react/24/outline";

const receiverMenuItems = [
    { name: "Slot Selection", href: "/receiver_page/slot-selection", icon: ClipboardDocumentListIcon },
    { name: "My Orders", href: "/receiver_page/orders", icon: CheckCircleIcon },
    { name: "Notifications", href: "/receiver_page/notifications", icon: BellIcon },
];

export default function ReceiverSidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const [hoveredItem, setHoveredItem] = useState<string | null>(null);

    useEffect(() => {
        receiverMenuItems.forEach((item) => router.prefetch(item.href));
    }, [router]);

    return (
        <aside className="w-20 bg-neutral-900 text-white flex flex-col items-center py-6 px-0 flex-shrink-0 overflow-y-auto relative">
            {/* Logo */}
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center font-bold text-sm mb-6">
                S
            </div>

            {/* Navigation */}
            <nav className="flex flex-col gap-2 items-center">
                {receiverMenuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                    const isExactActive = pathname === item.href;
                    return (
                        <div key={item.name} className="relative">
                            <Link
                                href={item.href}
                                className={`p-2.5 rounded-lg transition block ${
                                    isExactActive
                                        ? "bg-yellow-500 text-white"
                                        : isActive
                                        ? "bg-yellow-500/50 text-white"
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

            {/* Bottom section */}
            <div className="mt-auto pt-4 border-t border-neutral-800 relative">
                <Link
                    href="/receiver_page/slot-selection"
                    className="p-2.5 rounded-lg text-yellow-400 hover:bg-neutral-800 transition block"
                    onMouseEnter={() => setHoveredItem("Profile")}
                    onMouseLeave={() => setHoveredItem(null)}
                >
                    <UserIcon className="h-6 w-6" />
                </Link>
                {hoveredItem === "Profile" && (
                    <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 bg-black px-3 py-1.5 rounded-md whitespace-nowrap text-sm font-medium text-white pointer-events-none z-50">
                        Profile
                    </div>
                )}
            </div>
        </aside>
    );
}
