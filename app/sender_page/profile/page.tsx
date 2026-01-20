"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
    UserIcon,
    PhoneIcon,
    EnvelopeIcon,
    ArrowRightOnRectangleIcon,
    XMarkIcon,
    CubeIcon,
    CheckCircleIcon,
    XCircleIcon,
    ClockIcon,
    MapPinIcon,
} from "@heroicons/react/24/outline";

interface ProfileData {
    organizationName: string;
    phone: string;
    email: string;
    startHour?: number;
    endHour?: number;
    defaultPickupAddress?: string;
}

interface OrderStats {
    totalOrders: number;
    delivered: number;
    failed: number;
}

export default function ProfilePage() {
    const router = useRouter();
    const [profileData, setProfileData] = useState<ProfileData | null>(null);
    const [orderStats, setOrderStats] = useState<OrderStats>({
        totalOrders: 0,
        delivered: 0,
        failed: 0,
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setIsLoading(true);
                const response = await fetch("/api/sender-profile");
                if (response.ok) {
                    const data = await response.json();
                    setProfileData(data);
                } else {
                    console.error("Failed to fetch sender profile");
                }
            } catch (error) {
                console.error("Error fetching profile:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const formatWorkingHours = (startHour?: number, endHour?: number) => {
        if (startHour === undefined || endHour === undefined) return "Not set";
        const formatHour = (hour: number) => {
            const period = hour >= 12 ? "PM" : "AM";
            const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
            return `${displayHour}:00 ${period}`;
        };
        return `${formatHour(startHour)} - ${formatHour(endHour)}`;
    };

    const handleLogout = () => {
        alert("Logging out...");
        router.push("/");
    };

    const handleClose = () => {
        router.back();
    };

    if (isLoading) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <p className="text-gray-500">Loading profile...</p>
            </div>
        );
    }

    return (
        <div className="flex-1 flex relative">
            {/* Background - simulating previous page content */}
            <div className="flex-1 bg-gray-50 p-8 opacity-50 pointer-events-none">
                <div className="mb-6 pb-4 border-b border-gray-200">
                    <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
                </div>
                <div className="grid grid-cols-5 gap-4 mb-8">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="bg-white rounded-xl p-5 border border-gray-100 h-24" />
                    ))}
                </div>
                <div className="bg-white rounded-xl border border-gray-100 h-64" />
            </div>

            {/* Overlay backdrop */}
            <div 
                className="absolute inset-0 bg-black/20 z-10"
                onClick={handleClose}
            />

            {/* Profile Panel - Right side */}
            <div className="absolute right-0 top-0 h-full z-20 flex items-start justify-end p-6">
                <div className="w-[400px] bg-white rounded-2xl shadow-2xl overflow-hidden relative">
                    {/* Close button */}
                    <button
                        onClick={handleClose}
                        className="absolute top-4 right-4 p-1 hover:bg-gray-100 rounded-lg transition z-10"
                    >
                        <XMarkIcon className="w-5 h-5 text-gray-400" />
                    </button>

                    {/* Header with Shop Info */}
                    <div className="p-6 pb-4">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-orange-500 rounded-xl flex items-center justify-center">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">{profileData?.organizationName || "Loading..."}</h2>
                                <p className="text-sm text-orange-500 font-medium">Registered Sender</p>
                            </div>
                        </div>
                    </div>

                    {/* Profile Details */}
                    <div className="px-6 space-y-3">
                        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                            <PhoneIcon className="w-5 h-5 text-gray-400" />
                            <div>
                                <p className="text-xs text-gray-400">Contact</p>
                                <p className="text-sm font-semibold text-gray-900">{profileData?.phone || "N/A"}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                            <EnvelopeIcon className="w-5 h-5 text-gray-400" />
                            <div>
                                <p className="text-xs text-gray-400">Email</p>
                                <p className="text-sm font-semibold text-gray-900">{profileData?.email || "N/A"}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                            <ClockIcon className="w-5 h-5 text-gray-400" />
                            <div>
                                <p className="text-xs text-gray-400">Shop Working Hours</p>
                                <p className="text-sm font-semibold text-gray-900">
                                    {formatWorkingHours(profileData?.startHour, profileData?.endHour)}
                                </p>
                            </div>
                        </div>

                        {profileData?.defaultPickupAddress && (
                            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                                <MapPinIcon className="w-5 h-5 text-gray-400" />
                                <div>
                                    <p className="text-xs text-gray-400">Pickup Address</p>
                                    <p className="text-sm font-semibold text-gray-900">{profileData.defaultPickupAddress}</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Order Summary */}
                    <div className="px-6 pt-6 pb-4">
                        <h3 className="text-base font-bold text-gray-900 mb-4">Order Summary</h3>
                        <div className="grid grid-cols-3 gap-3">
                            <div className="bg-[#EDE9FE] rounded-xl p-4 text-center">
                                <CubeIcon className="w-6 h-6 text-gray-500 mx-auto mb-2" />
                                <p className="text-2xl font-bold text-gray-900">{orderStats.totalOrders}</p>
                                <p className="text-xs text-gray-500">Total Orders</p>
                            </div>

                            <div className="bg-[#D1FAE5] rounded-xl p-4 text-center">
                                <CheckCircleIcon className="w-6 h-6 text-gray-500 mx-auto mb-2" />
                                <p className="text-2xl font-bold text-gray-900">{orderStats.delivered}</p>
                                <p className="text-xs text-gray-500">Delivered</p>
                            </div>

                            <div className="bg-[#FEF3C7] rounded-xl p-4 text-center">
                                <XCircleIcon className="w-6 h-6 text-gray-500 mx-auto mb-2" />
                                <p className="text-2xl font-bold text-gray-900">{orderStats.failed}</p>
                                <p className="text-xs text-gray-500">Failed</p>
                            </div>
                        </div>
                    </div>

                    {/* Logout Button */}
                    <div className="px-6 pb-6 pt-2">
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center justify-center gap-2 py-3 bg-gray-50 rounded-xl text-gray-700 font-medium hover:bg-gray-100 transition border border-gray-200"
                        >
                            <ArrowRightOnRectangleIcon className="w-5 h-5" />
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
