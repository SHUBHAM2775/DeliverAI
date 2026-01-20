"use client";

import {
    BellIcon,
} from "@heroicons/react/24/outline";

interface HeaderProps {
    title?: string;
}

export default function Header({ title = "Overview" }: HeaderProps) {
    return (
        <header className="flex items-center justify-between mb-8 pb-6 border-b border-gray-200">
            <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
            <div className="flex items-center gap-6">
                <button className="p-2 hover:bg-gray-100 rounded-lg transition relative">
                    <BellIcon className="h-5 w-5 text-gray-600" />
                    <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
                </button>
                <div className="flex items-center gap-3 pl-6 border-l border-gray-200">
                    <div className="text-right">
                        <p className="text-sm font-semibold text-gray-900">Admin</p>
                    </div>
                    <img
                        src="https://i.pravatar.cc/48?img=3"
                        className="h-10 w-10 rounded-full"
                        alt="avatar"
                    />
                </div>
            </div>
        </header>
    );
}
