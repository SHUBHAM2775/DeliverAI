"use client";

import { useState } from "react";
import Header from "@/components/Header";
import {
    UserCircleIcon,
    StarIcon,
    MapPinIcon,
    CheckCircleIcon,
    TruckIcon,
} from "@heroicons/react/24/outline";

interface DriverProfile {
    name: string;
    driverId: string;
    rating: number;
    totalDeliveries: number;
    preferredAreas: string[];
    currentStatus: "Available" | "On Route" | "On Break";
    joinDate: string;
}

// Mock driver profile data
// TODO: Replace with API data
const driverProfileData: DriverProfile = {
    name: "Rakesh Kumar",
    driverId: "DRV-2401",
    rating: 4.8,
    totalDeliveries: 347,
    preferredAreas: ["Koramangala", "Indiranagar", "Marathahalli", "Whitefield", "BTM Layout"],
    currentStatus: "Available",
    joinDate: "January 2024",
};

export default function DriverProfilePage() {
    const [profile] = useState<DriverProfile>(driverProfileData);

    const getStatusColor = (status: string) => {
        switch (status) {
            case "Available":
                return "bg-green-100 text-green-700";
            case "On Route":
                return "bg-blue-100 text-blue-700";
            case "On Break":
                return "bg-yellow-100 text-yellow-700";
            default:
                return "bg-gray-100 text-gray-700";
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "Available":
                return <CheckCircleIcon className="h-4 w-4" />;
            case "On Route":
                return <TruckIcon className="h-4 w-4" />;
            default:
                return null;
        }
    };

    return (
        <div className="flex-1 overflow-y-auto bg-gray-50">
            <div className="p-6 min-h-full">
                <Header title="Driver Profile" role="Driver" />

                {/* Profile Header Card */}
                <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm mb-6">
                    <div className="flex flex-col md:flex-row md:items-start md:gap-8">
                        {/* Avatar & Name */}
                        <div className="flex flex-col items-center md:items-start">
                            <div className="h-24 w-24 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center mb-4">
                                <UserCircleIcon className="h-12 w-12 text-white" strokeWidth="1" />
                            </div>
                            <h1 className="text-2xl font-bold text-gray-900">{profile.name}</h1>
                            <p className="text-sm text-gray-600 mt-1">{profile.driverId}</p>
                        </div>

                        {/* Status & Rating */}
                        <div className="flex-1 mt-6 md:mt-0">
                            <div className="space-y-4">
                                {/* Current Status */}
                                <div>
                                    <p className="text-xs uppercase font-semibold text-gray-600 mb-2">Current Status</p>
                                    <div
                                        className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold ${getStatusColor(
                                            profile.currentStatus
                                        )}`}
                                    >
                                        {getStatusIcon(profile.currentStatus)}
                                        {profile.currentStatus}
                                    </div>
                                </div>

                                {/* Rating */}
                                <div>
                                    <p className="text-xs uppercase font-semibold text-gray-600 mb-2">Rating</p>
                                    <div className="flex items-center gap-2">
                                        <div className="flex items-center gap-1">
                                            {[...Array(5)].map((_, i) => (
                                                <StarIcon
                                                    key={i}
                                                    className={`h-5 w-5 ${i < Math.floor(profile.rating)
                                                        ? "fill-yellow-400 text-yellow-400"
                                                        : i < profile.rating
                                                            ? "fill-yellow-200 text-yellow-400"
                                                            : "text-gray-300"
                                                        }`}
                                                />
                                            ))}
                                        </div>
                                        <span className="font-bold text-gray-900">{profile.rating}</span>
                                        <span className="text-sm text-gray-600">({profile.totalDeliveries} deliveries)</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Profile Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {/* Personal Information */}
                    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                        <h2 className="text-lg font-bold text-gray-900 mb-4">Personal Information</h2>

                        <div className="space-y-4">
                            <div>
                                <p className="text-xs uppercase font-semibold text-gray-600 mb-1">Full Name</p>
                                <p className="text-sm font-medium text-gray-900">{profile.name}</p>
                            </div>

                            <div>
                                <p className="text-xs uppercase font-semibold text-gray-600 mb-1">Driver ID</p>
                                <p className="text-sm font-medium text-gray-900">{profile.driverId}</p>
                            </div>

                            <div>
                                <p className="text-xs uppercase font-semibold text-gray-600 mb-1">Member Since</p>
                                <p className="text-sm font-medium text-gray-900">{profile.joinDate}</p>
                            </div>

                            <div>
                                <p className="text-xs uppercase font-semibold text-gray-600 mb-1">Total Deliveries</p>
                                <p className="text-sm font-medium text-gray-900">{profile.totalDeliveries}</p>
                            </div>
                        </div>
                    </div>

                    {/* Performance Summary */}
                    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                        <h2 className="text-lg font-bold text-gray-900 mb-4">Performance Summary</h2>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between py-3 border-b border-gray-100">
                                <p className="text-sm text-gray-700">On-Time Delivery Rate</p>
                                <p className="text-sm font-bold text-gray-900">92%</p>
                            </div>

                            <div className="flex items-center justify-between py-3 border-b border-gray-100">
                                <p className="text-sm text-gray-700">Customer Satisfaction</p>
                                <p className="text-sm font-bold text-gray-900">96%</p>
                            </div>

                            <div className="flex items-center justify-between py-3 border-b border-gray-100">
                                <p className="text-sm text-gray-700">Fragile Item Handling</p>
                                <p className="text-sm font-bold text-gray-900">100%</p>
                            </div>

                            <div className="flex items-center justify-between py-3">
                                <p className="text-sm text-gray-700">Average Delay</p>
                                <p className="text-sm font-bold text-gray-900">4 min</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Preferred Areas */}
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">Preferred Delivery Areas</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {profile.preferredAreas.map((area, index) => (
                            <div
                                key={index}
                                className="flex items-center gap-2 px-4 py-3 bg-blue-50 border border-blue-200 rounded-lg"
                            >
                                <MapPinIcon className="h-4 w-4 text-blue-600 flex-shrink-0" />
                                <p className="text-sm font-medium text-gray-900">{area}</p>
                            </div>
                        ))}
                    </div>

                    <p className="text-xs text-gray-600 mt-4">
                        These are your preferred areas for delivery assignments. You will receive optimal delivery routes in these zones.
                    </p>
                </div>

                {/* Additional Information */}
                <div className="mt-6 bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">Account Settings</h2>

                    <p className="text-sm text-gray-600">
                        ℹ️ Edit profile, change password, and update preferences are UI placeholders.
                        <br />
                        <span className="font-semibold">Backend integration needed for full functionality.</span>
                    </p>

                    <div className="mt-4 space-y-2">
                        <button className="w-full px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed" disabled>
                            Edit Profile
                        </button>
                        <button className="w-full px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed" disabled>
                            Change Password
                        </button>
                        <button className="w-full px-4 py-2.5 border border-red-300 text-red-600 rounded-lg font-medium hover:bg-red-50 transition disabled:opacity-50 disabled:cursor-not-allowed" disabled>
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
