"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    MagnifyingGlassIcon,
    BellIcon,
    MapPinIcon,
    SparklesIcon,
    FireIcon,
    ClockIcon,
} from "@heroicons/react/24/outline";
import ProfileDropdown from "@/components/ProfileDropdown";

// Time slots data
const timeSlots = [
    { time: "8:00 - 10:00 AM", rate: 92, color: "bg-[#D1FAE5]", textColor: "text-green-700", badge: "AI Pick" },
    { time: "10:00 - 12:00 PM", rate: 85, color: "bg-[#D1FAE5]", textColor: "text-green-700", badge: "Popular" },
    { time: "12:00 - 2:00 PM", rate: 78, color: "bg-[#D1FAE5]", textColor: "text-green-700", badge: null },
    { time: "2:00 - 4:00 PM", rate: 65, color: "bg-[#D1FAE5]", textColor: "text-green-700", badge: null },
    { time: "4:00 - 6:00 PM", rate: 45, color: "bg-[#FEF3C7]", textColor: "text-yellow-700", badge: null },
    { time: "6:00 - 8:00 PM", rate: 72, color: "bg-[#D1FAE5]", textColor: "text-green-700", badge: "Popular" },
    { time: "8:00 - 10:00 PM", rate: 35, color: "bg-[#FECACA]", textColor: "text-orange-700", badge: null },
    { time: "10:00 - 11:00 PM", rate: 18, color: "bg-[#FECACA]", textColor: "text-red-700", badge: null },
];

// Generate 7 days window
const generateDaysWindow = () => {
    const days = [];
    const today = new Date();
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        days.push({
            dayName: dayNames[date.getDay()],
            date: date.getDate(),
            month: date.getMonth() + 1,
            year: date.getFullYear(),
            fullDate: date.toISOString().split('T')[0],
        });
    }
    return days;
};

export default function SlotSelectionPage() {
    const router = useRouter();
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
    const [selectedDate, setSelectedDate] = useState<string>(generateDaysWindow()[0].fullDate);
    const [preferredTime, setPreferredTime] = useState(12);

    const daysWindow = generateDaysWindow();

    const handleSuggestSlot = () => {
        alert(`Suggested slot for ${preferredTime}:00 on ${selectedDate}`);
    };

    const handleConfirmSlot = () => {
        if (!selectedSlot) {
            alert("Please select a time slot first");
            return;
        }
        router.push("/receiver_page/confirmation");
    };

    return (
        <div className="flex-1 overflow-y-auto bg-gray-50">
            <div className="p-8 min-h-full">
                <div className="grid grid-cols-3 gap-6">
                    {/* Left Column - Order Details */}
                    <div className="col-span-2 space-y-6">
                        {/* Order Card */}
                        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-100">
                            <div className="flex items-start gap-4">
                                <div className="w-16 h-16 bg-indigo-100 rounded-xl flex items-center justify-center">
                                    <svg className="w-10 h-10 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                    </svg>
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-xs font-medium text-gray-500">ORDER #ORD-2847</span>
                                        <span className="px-3 py-1 bg-pink-100 text-pink-600 rounded-full text-xs font-medium">Fresh Mart</span>
                                    </div>
                                    <h2 className="text-xl font-bold text-gray-900 mb-2">Organic Grocery Bundle</h2>
                                    <p className="text-sm text-gray-600 mb-3">
                                        Fresh vegetables, fruits, and dairy products from local farms. Includes seasonal items and premium organic selections.
                                    </p>
                                    <div className="flex items-center gap-2 text-sm text-indigo-600">
                                        <MapPinIcon className="w-4 h-4" />
                                        <span>123 Green Valley Road, Apt 4B, New York, NY 10001</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Choose Delivery Slot */}
                        <div className="bg-white rounded-2xl p-6 border border-gray-100">
                            <h3 className="text-lg font-bold text-gray-900 mb-2">Choose Your Delivery Slot</h3>
                            <p className="text-sm text-gray-500 mb-6">Select a time slot with higher success rate for guaranteed delivery</p>

                            {/* Time Slots Grid */}
                            <div className="grid grid-cols-4 gap-3">
                                {timeSlots.map((slot, idx) => (
                                    <div
                                        key={idx}
                                        onClick={() => setSelectedSlot(slot.time)}
                                        className={`${slot.color} rounded-xl p-4 cursor-pointer transition-all hover:scale-105 relative ${
                                            selectedSlot === slot.time ? 'ring-4 ring-indigo-500 ring-offset-2' : ''
                                        }`}
                                    >
                                        {/* Badge */}
                                        {slot.badge && (
                                            <div className={`absolute -top-2 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full text-[10px] font-medium flex items-center gap-1 ${
                                                slot.badge === "AI Pick" 
                                                    ? "bg-gray-900 text-white" 
                                                    : "bg-white text-gray-700 border border-gray-200"
                                            }`}>
                                                {slot.badge === "AI Pick" ? (
                                                    <SparklesIcon className="w-3 h-3" />
                                                ) : (
                                                    <FireIcon className="w-3 h-3" />
                                                )}
                                                {slot.badge}
                                            </div>
                                        )}
                                        
                                        <div className="text-center">
                                            <p className={`text-lg font-bold ${slot.textColor} mb-1`}>{slot.time}</p>
                                            <p className={`text-xl font-semibold ${slot.textColor}`}>{slot.rate}%</p>
                                            <p className="text-xs text-gray-500 mt-1">Success rate</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Date & Time Selection */}
                    <div className="flex flex-col justify-end gap-6">
                        {/* Suggest Preferred Time */}
                        <div className="bg-gradient-to-br from-orange-50 to-pink-50 rounded-2xl p-6 border border-orange-100">
                            <div className="flex items-center gap-2 mb-4">
                                <ClockIcon className="w-5 h-5 text-gray-700" />
                                <h3 className="text-base font-bold text-gray-900">Suggest Your Preferred Time</h3>
                            </div>

                            {/* Date Selection - 7 Days Window */}
                            <div className="mb-5">
                                <label className="block text-sm text-gray-600 mb-3">Date</label>
                                <div className="grid grid-cols-7 gap-1">
                                    {daysWindow.map((day, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setSelectedDate(day.fullDate)}
                                            className={`p-2 rounded-lg text-center transition ${
                                                selectedDate === day.fullDate
                                                    ? 'bg-indigo-500 text-white'
                                                    : 'bg-white text-gray-700 hover:bg-gray-100'
                                            }`}
                                        >
                                            <div className="text-[10px] font-medium">{day.dayName}</div>
                                            <div className="text-sm font-bold">{day.date}</div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Time Slider */}
                            <div className="mb-5">
                                <label className="block text-sm text-gray-600 mb-3">Preferred Time: {preferredTime}:00</label>
                                <div className="relative">
                                    <input
                                        type="range"
                                        min="6"
                                        max="23"
                                        value={preferredTime}
                                        onChange={(e) => setPreferredTime(Number(e.target.value))}
                                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                                    />
                                    <div className="flex justify-between text-xs text-gray-400 mt-2">
                                        <span>6 AM</span>
                                        <span>12 PM</span>
                                        <span>6 PM</span>
                                        <span>11 PM</span>
                                    </div>
                                </div>
                            </div>

                            {/* Suggest Button */}
                            <button
                                onClick={handleSuggestSlot}
                                className="w-full py-3 bg-white border-2 border-orange-200 rounded-xl text-orange-600 font-medium hover:bg-orange-50 transition"
                            >
                                Suggest This Slot
                            </button>
                        </div>

                        {/* Confirm Button */}
                        <button
                            onClick={handleConfirmSlot}
                            disabled={!selectedSlot}
                            className="w-full py-4 bg-green-700 rounded-xl text-white font-semibold hover:bg-green-800 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Confirm My Slot
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
