"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import {
    CalendarIcon,
    MapPinIcon,
    BellIcon,
    ArrowPathIcon,
    ChatBubbleBottomCenterTextIcon,
} from "@heroicons/react/24/outline";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import ReceiverHeader from "@/components/ReceiverHeader";

interface OrderDetails {
    commodityName: string;
    orderId: string;
    deliveryAddress: string;
}

function ConfirmationPageContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
    const [selectedSlot, setSelectedSlot] = useState<string>("");
    const [selectedDate, setSelectedDate] = useState<string>("");
    const [isConfirmed, setIsConfirmed] = useState(false);
    const [confirmationError, setConfirmationError] = useState<string>("");

    useEffect(() => {
        const orderId = searchParams.get("orderId");
        const date = searchParams.get("date");
        const slot = searchParams.get("slot");
        const uuid = searchParams.get("uuid");

        if (!orderId || !date || !slot) {
            setConfirmationError("Missing order or slot information");
            return;
        }

        setSelectedDate(date);
        setSelectedSlot(slot);

        // Fetch order details
        const fetchOrderDetails = async () => {
            try {
                const response = await fetch(`/api/orders?orderId=${orderId}`);
                if (response.ok) {
                    const data = await response.json();
                    const order = data.orders?.[0];
                    if (order) {
                        setOrderDetails({
                            commodityName: order.commodity,
                            orderId: order.id,
                            deliveryAddress: order.area,
                        });
                    }
                }
            } catch (error) {
                console.error("Failed to fetch order details", error);
            }
        };

        // Save slot confirmation to database
        const saveConfirmation = async () => {
            try {
                const response = await fetch("/api/slot-confirmation", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ orderId, date, slot, uuid }),
                });

                const data = await response.json();
                if (!response.ok) {
                    console.error("Confirmation error:", data);
                    setConfirmationError(data.error || "Failed to confirm slot");
                } else {
                    setIsConfirmed(true);
                    console.log("Slot confirmed:", data);
                }
            } catch (error) {
                console.error("Error saving confirmation", error);
                setConfirmationError("Failed to save confirmation");
            }
        };

        fetchOrderDetails();
        saveConfirmation();
    }, [searchParams]);

    const handleChangeSlot = () => {
        router.push("/receiver_page/slot-selection");
    };

    const handleContactSupport = () => {
        router.push("/receiver_page/notifications");
    };

    const formatSlotTime = (slot: string): string => {
        // Handle custom slots like "custom-17:00"
        if (slot.startsWith("custom-")) {
            const time = slot.replace("custom-", "").replace(/:/g, "");
            const hour = parseInt(time);
            if (hour === 12) return "12 PM";
            if (hour === 0) return "12 AM";
            return hour > 12 ? `${hour - 12} PM` : `${hour} AM`;
        }
        
        // Handle time range slots like "10-11" or "8:00 - 10:00 AM"
        if (slot.includes("-")) {
            const parts = slot.split("-").map(p => p.trim());
            const formatHour = (hourStr: string): string => {
                const hour = parseInt(hourStr.replace(/[^0-9]/g, ""));
                if (isNaN(hour)) return hourStr;
                if (hour === 12) return "12 PM";
                if (hour === 0) return "12 AM";
                return hour > 12 ? `${hour - 12} PM` : `${hour} AM`;
            };
            return `${formatHour(parts[0])} - ${formatHour(parts[1])}`;
        }
        
        return slot;
    };

    return (
        <div className="flex-1 overflow-y-auto bg-gray-50">
            <div className="p-8 min-h-full flex flex-col">
                <ReceiverHeader title="Confirmation" subtitle="Receiver workspace" />
                <div className="flex-1 flex items-center justify-center">
                    <div className="max-w-3xl w-full">
                        {confirmationError ? (
                            <div className="bg-red-50 rounded-2xl p-6 border border-red-200">
                                <h2 className="text-2xl font-bold text-red-900 mb-2">Error</h2>
                                <p className="text-red-700 mb-4">{confirmationError}</p>
                                <button
                                    onClick={() => router.push("/receiver_page/slot-selection")}
                                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                                >
                                    Go Back to Slot Selection
                                </button>
                            </div>
                        ) : (
                            <>
                        {/* Success Confirmation Card */}
                        <div className="bg-gradient-to-br from-green-100 to-emerald-100 rounded-3xl p-10 mb-6 relative overflow-hidden">
                            {/* Decorative circles */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/20 rounded-full translate-y-1/2 -translate-x-1/2"></div>

                            <div className="relative z-10">
                                {/* Success Icon */}
                                <div className="flex justify-center mb-6">
                                    <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center">
                                        <CheckCircleIcon className="w-12 h-12 text-white" />
                                    </div>
                                </div>

                                {/* Title */}
                                <h2 className="text-3xl font-bold text-gray-900 text-center mb-3">
                                    Slot Confirmed!
                                </h2>
                                <p className="text-gray-600 text-center mb-8">
                                    Your delivery is being planned around this time.
                                </p>

                                {/* Time Slot Display */}
                                <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
                                    <div className="flex items-center justify-center gap-3 mb-2">
                                        <CalendarIcon className="w-6 h-6 text-indigo-600" />
                                        <h3 className="text-2xl font-bold text-gray-900">{formatSlotTime(selectedSlot)}</h3>
                                    </div>
                                    <p className="text-center text-gray-600 text-sm">Date: {selectedDate}</p>
                                </div>

                                {/* Order Details */}
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 text-gray-700">
                                        <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                        </svg>
                                        <div>
                                            <p className="font-semibold">{orderDetails?.commodityName || "Order"}</p>
                                            <p className="text-sm text-gray-500">Order #{orderDetails?.orderId || "N/A"}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3 text-gray-700">
                                        <MapPinIcon className="w-5 h-5 text-indigo-600 mt-0.5" />
                                        <p className="text-sm">{orderDetails?.deliveryAddress || "N/A"}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Reminder Card */}
                        <div className="bg-gradient-to-br from-amber-100 to-yellow-100 rounded-2xl p-6 mb-6 border border-amber-200">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 bg-amber-200 rounded-full flex items-center justify-center shrink-0">
                                    <BellIcon className="w-5 h-5 text-amber-700" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-1">Reminder Coming Soon</h3>
                                    <p className="text-sm text-gray-600">
                                        You will receive a reminder notification before your scheduled delivery time.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div>
                            <button
                                onClick={handleContactSupport}
                                className="w-full py-4 bg-indigo-600 rounded-xl text-white font-semibold hover:bg-indigo-700 transition flex items-center justify-center gap-2"
                            >
                                <ChatBubbleBottomCenterTextIcon className="w-5 h-5" />
                                Contact Support
                            </button>
                        </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function ConfirmationPage() {
    return (
        <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
            <ConfirmationPageContent />
        </Suspense>
    );
}
