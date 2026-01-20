"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
    BellIcon,
    ChevronDownIcon,
    ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";

interface HeaderProps {
    title?: string;
}

export default function Header({ title = "Overview" }: HeaderProps) {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = () => {
        setOpen(false);
        router.push("/");
    };

    return (
        <header className="flex items-center justify-between mb-8 pb-6 border-b border-gray-200">
            <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
            <div className="flex items-center gap-6">
                <button className="p-2 hover:bg-gray-100 rounded-lg transition relative">
                    <BellIcon className="h-5 w-5 text-gray-600" />
                    <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
                </button>
                <div className="flex items-center gap-3 pl-6 border-l border-gray-200 relative" ref={menuRef}>
                    <button
                        className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-gray-100 transition"
                        onClick={() => setOpen((prev) => !prev)}
                    >
                        <div className="text-right">
                            <p className="text-sm font-semibold text-gray-900">Admin</p>
                            <p className="text-xs text-gray-500">Logged in</p>
                        </div>
                        <img
                            src="https://i.pravatar.cc/40?img=3"
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
