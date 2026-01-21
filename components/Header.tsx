"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { BellIcon, ChevronDownIcon, ArrowRightOnRectangleIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import GoogleTranslate from "./GoogleTranslate";

interface HeaderProps {
    title?: string;
    role?: string;
}

export default function Header({ title = "Overview", role = "Admin" }: HeaderProps) {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement | null>(null);
    const [displayName, setDisplayName] = useState<string>(role);
    const [avatarUrl, setAvatarUrl] = useState<string>("https://i.pravatar.cc/40?img=3");

    const safeParseSession = (raw: string) => {
        try {
            return JSON.parse(raw) as { phone?: string; role?: string; name?: string; avatarSeed?: number };
        } catch (e) {
            return null;
        }
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        };
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
                const data = res.data;
                if (data?.name) setDisplayName(data.name);
            })
            .catch((err) => {
                console.warn("Could not fetch user name", err);
            });
    }, []);

    const handleLogout = () => {
        setOpen(false);
        try {
            localStorage.removeItem("rubixSession");
        } catch (e) {
            // ignore
        }
        router.push("/");
    };

    return (
        <header className="flex items-center justify-between mb-8 pb-6 border-b border-gray-200">
            <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
            <div className="flex items-center gap-6">
                <GoogleTranslate />
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
                            <p className="text-sm font-semibold text-gray-900">{displayName || role}</p>
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
