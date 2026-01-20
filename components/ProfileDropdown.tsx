"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
    UserIcon,
    PhoneIcon,
    EnvelopeIcon,
    ArrowRightOnRectangleIcon,
    CubeIcon,
    CheckCircleIcon,
    XCircleIcon,
    PencilIcon,
    CheckIcon,
    XMarkIcon as XIcon,
} from "@heroicons/react/24/outline";

interface ProfileDropdownProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function ProfileDropdown({ isOpen, onClose }: ProfileDropdownProps) {
    const router = useRouter();
    const [isEditing, setIsEditing] = useState(false);
    const dropdownRef = useRef<HTMLDivElement | null>(null);

    const [editData, setEditData] = useState({
        shopName: "Green Valley Apartments",
        ownerName: "John Doe",
        contact: "+1 555 123 4567",
        email: "john.doe@greenvalley.com",
    });

    useEffect(() => {
        if (!isOpen) return;

        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const handleLogout = () => {
        alert("Logging out...");
        router.push("/");
    };

    const handleEditProfile = () => {
        setIsEditing(true);
    };

    const handleSaveProfile = () => {
        setIsEditing(false);
        alert("Profile updated successfully!");
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setEditData({
            shopName: "Green Valley Apartments",
            ownerName: "John Doe",
            contact: "+1 555 123 4567",
            email: "john.doe@greenvalley.com",
        });
    };

    const profileData = editData;

    const orderStats = {
        totalOrders: 156,
        delivered: 142,
        failed: 8,
    };

    return (
        <div
            ref={dropdownRef}
            className="absolute top-[calc(100%+10px)] right-0 z-50 w-[360px] bg-white rounded-xl shadow-2xl border border-gray-100"
        >
                {/* Header with Shop Info */}
                <div className="p-5 pb-4 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
                            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        </div>
                        <div className="flex-1">
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={editData.shopName}
                                    onChange={(e) => setEditData({ ...editData, shopName: e.target.value })}
                                    className="text-lg font-bold text-gray-900 border border-gray-300 rounded px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
                                />
                            ) : (
                                <h2 className="text-lg font-bold text-gray-900">{profileData.shopName}</h2>
                            )}
                            <p className="text-xs text-orange-500 font-medium">Registered Sender</p>
                        </div>
                        {!isEditing && (
                            <button
                                onClick={handleEditProfile}
                                className="p-2 hover:bg-gray-50 rounded-lg transition"
                                title="Edit Profile"
                            >
                                <PencilIcon className="w-5 h-5 text-gray-400" />
                            </button>
                        )}
                    </div>
                </div>

                {/* Profile Details */}
                <div className="px-5 py-4 space-y-2.5">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <UserIcon className="w-4 h-4 text-gray-400" />
                        <div className="flex-1">
                            <p className="text-[10px] text-gray-400 uppercase">Owner Name</p>
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={editData.ownerName}
                                    onChange={(e) => setEditData({ ...editData, ownerName: e.target.value })}
                                    className="text-sm font-semibold text-gray-900 border border-gray-300 rounded px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
                                />
                            ) : (
                                <p className="text-sm font-semibold text-gray-900">{profileData.ownerName}</p>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <PhoneIcon className="w-4 h-4 text-gray-400" />
                        <div className="flex-1">
                            <p className="text-[10px] text-gray-400 uppercase">Contact</p>
                            {isEditing ? (
                                <input
                                    type="tel"
                                    value={editData.contact}
                                    onChange={(e) => setEditData({ ...editData, contact: e.target.value })}
                                    className="text-sm font-semibold text-gray-900 border border-gray-300 rounded px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
                                />
                            ) : (
                                <p className="text-sm font-semibold text-gray-900">{profileData.contact}</p>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <EnvelopeIcon className="w-4 h-4 text-gray-400" />
                        <div className="flex-1">
                            <p className="text-[10px] text-gray-400 uppercase">Email</p>
                            {isEditing ? (
                                <input
                                    type="email"
                                    value={editData.email}
                                    onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                                    className="text-sm font-semibold text-gray-900 border border-gray-300 rounded px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
                                />
                            ) : (
                                <p className="text-sm font-semibold text-gray-900">{profileData.email}</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Order Summary */}
                <div className="px-5 py-4 border-t border-gray-100">
                    <h3 className="text-sm font-bold text-gray-900 mb-3">Order Summary</h3>
                    <div className="grid grid-cols-3 gap-2.5">
                        <div className="bg-[#EDE9FE] rounded-lg p-3 text-center">
                            <CubeIcon className="w-5 h-5 text-gray-500 mx-auto mb-1.5" />
                            <p className="text-xl font-bold text-gray-900">{orderStats.totalOrders}</p>
                            <p className="text-[10px] text-gray-500">Total Orders</p>
                        </div>

                        <div className="bg-[#D1FAE5] rounded-lg p-3 text-center">
                            <CheckCircleIcon className="w-5 h-5 text-gray-500 mx-auto mb-1.5" />
                            <p className="text-xl font-bold text-gray-900">{orderStats.delivered}</p>
                            <p className="text-[10px] text-gray-500">Delivered</p>
                        </div>

                        <div className="bg-[#FEF3C7] rounded-lg p-3 text-center">
                            <XCircleIcon className="w-5 h-5 text-gray-500 mx-auto mb-1.5" />
                            <p className="text-xl font-bold text-gray-900">{orderStats.failed}</p>
                            <p className="text-[10px] text-gray-500">Failed</p>
                        </div>
                    </div>
                </div>

                {/* Logout Button */}
                <div className="px-5 pb-5">
                    {isEditing ? (
                        <div className="flex gap-2">
                            <button
                                onClick={handleCancelEdit}
                                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-gray-50 rounded-lg text-gray-700 font-medium hover:bg-gray-100 transition border border-gray-200"
                            >
                                <XIcon className="w-4 h-4" />
                                <span className="text-sm">Cancel</span>
                            </button>
                            <button
                                onClick={handleSaveProfile}
                                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-orange-500 rounded-lg text-white font-medium hover:bg-orange-600 transition"
                            >
                                <CheckIcon className="w-4 h-4" />
                                <span className="text-sm">Save</span>
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center justify-center gap-2 py-2.5 bg-gray-50 rounded-lg text-gray-700 font-medium hover:bg-gray-100 transition border border-gray-200"
                        >
                            <ArrowRightOnRectangleIcon className="w-4 h-4" />
                            <span className="text-sm">Logout</span>
                        </button>
                    )}
                </div>
        </div>
    );
}
