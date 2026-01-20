"use client";

import { useRouter } from "next/navigation";
import {
    CalendarIcon,
    MapPinIcon,
    BellIcon,
    ArrowPathIcon,
    ChatBubbleBottomCenterTextIcon,
} from "@heroicons/react/24/outline";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import ReceiverHeader from "@/components/ReceiverHeader";

export default function ConfirmationPage() {
    const router = useRouter();

    const handleChangeSlot = () => {
        router.push("/receiver_page/slot-selection");
    };

    const handleContactSupport = () => {
        router.push("/receiver_page/notifications");
    };

    return (
        <div className="flex-1 overflow-y-auto bg-gray-50">
            <div className="p-8 min-h-full flex flex-col">
                <ReceiverHeader title="Confirmation" subtitle="Receiver workspace" />
                <div className="flex-1 flex items-center justify-center">
                    <div className="max-w-3xl w-full">
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
                                        <h3 className="text-2xl font-bold text-gray-900">10:00 - 12:00 PM</h3>
                                    </div>
                                    <p className="text-center text-gray-600 text-sm">85% Success Rate</p>
                                </div>

                                {/* Order Details */}
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 text-gray-700">
                                        <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                        </svg>
                                        <div>
                                            <p className="font-semibold">Organic Grocery Bundle</p>
                                            <p className="text-sm text-gray-500">Order #ORD-2847</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3 text-gray-700">
                                        <MapPinIcon className="w-5 h-5 text-indigo-600 mt-0.5" />
                                        <p className="text-sm">123 Green Valley Road, Apt 4B, New York, NY 10001</p>
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
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                onClick={handleChangeSlot}
                                className="py-4 bg-white border-2 border-gray-200 rounded-xl text-gray-700 font-semibold hover:bg-gray-50 transition flex items-center justify-center gap-2"
                            >
                                <ArrowPathIcon className="w-5 h-5" />
                                Change Slot
                            </button>
                            <button
                                onClick={handleContactSupport}
                                className="py-4 bg-indigo-600 rounded-xl text-white font-semibold hover:bg-indigo-700 transition flex items-center justify-center gap-2"
                            >
                                <ChatBubbleBottomCenterTextIcon className="w-5 h-5" />
                                Contact Support
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
