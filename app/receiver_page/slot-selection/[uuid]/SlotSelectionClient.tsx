"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
    MapPinIcon,
    SparklesIcon,
    ClockIcon,
    ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import ReceiverHeader from "@/components/ReceiverHeader";

interface OrderData {
    id: string;
    commodityName: string;
    commodityCategory?: string;
    description?: string;
    quantity?: string;
    isFragile: boolean;
    imageUrl?: string;
    deliveryAddress: string;
    area: string;
    pincode: string;
    workingStartTime?: string;
    workingEndTime?: string;
    orderStatus: string;
    deliveryDate?: Date;
    receiverName?: string;
    receiverEmail?: string;
    receiverPhone?: string;
    senderName?: string;
    senderEmail?: string;
    createdAt?: Date;
}

interface SlotRecommendation {
    date: string;
    slot: string;
    datetime: string;
    success_probability: number;
    day_of_week: number;
    hour: number;
    period: string;
    risk_score: number;
    risk_reasons: string | string[];
    day_name: string;
}

interface RecommendationsResponse {
    success: boolean;
    recommendations_by_date?: Record<string, SlotRecommendation[]>;
    message?: string;
}

interface SlotSelectionClientProps {
    orderData: OrderData;
    uuid: string;
}

// Generate 7 days window fallback
const generateDaysWindow = (): { dayName: string; date: number; fullDate: string }[] => {
    const days = [];
    const today = new Date();
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    for (let i = 0; i < 7; i++) {
        const d = new Date(today);
        d.setDate(today.getDate() + i);
        days.push({
            dayName: dayNames[d.getDay()],
            date: d.getDate(),
            fullDate: d.toISOString().split("T")[0],
        });
    }
    return days;
};

function slotToLabel(slot: string): string {
    const [a, b] = slot.split("-").map((x) => x.trim());
    if (!a || !b) return slot;
    const ha = parseInt(a, 10);
    const hb = parseInt(b, 10);
    const am = (h: number) => (h < 12 ? `${h} AM` : h === 12 ? "12 PM" : `${h - 12} PM`);
    return `${am(ha)} - ${am(hb)}`;
}

function slotStyle(success: number, risk: number): { bg: string; text: string } {
    if (success >= 90) return { bg: "bg-[#D1FAE5]", text: "text-green-700" };
    if (success >= 70 || risk < 18) return { bg: "bg-[#FEF3C7]", text: "text-yellow-700" };
    return { bg: "bg-[#FECACA]", text: "text-red-700" };
}

export default function SlotSelectionClient({ orderData, uuid }: SlotSelectionClientProps) {
    const router = useRouter();
    const [recommendations, setRecommendations] = useState<RecommendationsResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
    const [selectedDate, setSelectedDate] = useState<string>("");
    const [preferredTime, setPreferredTime] = useState(12);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        let cancelled = false;
        setLoading(true);
        setError(null);
        fetch(`/api/slots/recommend/${encodeURIComponent(uuid)}`)
            .then((r) => r.json())
            .then((data: RecommendationsResponse & { error?: string }) => {
                if (cancelled) return;
                if (data.error) {
                    setError(data.error);
                    setRecommendations(null);
                    return;
                }
                setRecommendations(data);
                const byDate = data?.recommendations_by_date;
                const dates = byDate ? Object.keys(byDate).sort() : [];
                if (dates.length > 0 && !selectedDate) setSelectedDate(dates[0]);
            })
            .catch((e) => {
                if (!cancelled) {
                    setError(e?.message || "Failed to load recommendations");
                    setRecommendations(null);
                }
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });
        return () => { cancelled = true; };
    }, [uuid]);

    const byDate = recommendations?.recommendations_by_date ?? {};
    const dates = Object.keys(byDate).sort();
    const daysWindow = dates.length > 0
        ? dates.map((fullDate) => {
            const d = new Date(fullDate);
            const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
            return { dayName: dayNames[d.getDay()], date: d.getDate(), fullDate };
        })
        : generateDaysWindow();
    const effectiveDate = selectedDate || daysWindow[0]?.fullDate || "";
    const slotsForDay = (byDate[effectiveDate] ?? []) as SlotRecommendation[];

    const handleConfirmSlot = async () => {
        if (!selectedSlot) {
            alert("Please select a time slot first");
            return;
        }
        setIsSubmitting(true);
        try {
            const [d, slot] = selectedSlot.includes("_") ? selectedSlot.split("_") : [effectiveDate, selectedSlot];
            router.push(`/receiver_page/confirmation?orderId=${orderData.id}&date=${d || effectiveDate}&slot=${encodeURIComponent(slot || selectedSlot)}`);
        } catch (e) {
            console.error("Failed to confirm slot", e);
            alert("Failed to confirm slot. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const formatOrderId = (id: string) => `ORD-${id.slice(-4).toUpperCase()}`;

    // Sync selectedDate when we have days from API or fallback and none selected
    useEffect(() => {
        if (loading || selectedDate) return;
        const first = daysWindow[0]?.fullDate;
        if (first) setSelectedDate(first);
    }, [loading, selectedDate, daysWindow]);

    const bestSlotForDay = slotsForDay.length > 0
        ? slotsForDay.reduce((a, b) => (a.success_probability >= b.success_probability ? a : b))
        : null;

    return (
        <div className="flex-1 overflow-y-auto bg-gray-50">
            <div className="p-8 min-h-full">
                <ReceiverHeader title="Slot Selection" subtitle="Align on delivery time" />
                <div className="grid grid-cols-3 gap-6">
                    {/* Left Column - Order Details */}
                    <div className="col-span-2 space-y-6">
                        {/* Order Card */}
                        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-100">
                            <div className="flex items-start gap-4">
                                {orderData.imageUrl ? (
                                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-indigo-100 flex-shrink-0">
                                        <img
                                            src={orderData.imageUrl}
                                            alt={orderData.commodityName}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                ) : (
                                    <div className="w-16 h-16 bg-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                        <svg className="w-10 h-10 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                        </svg>
                                    </div>
                                )}
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-xs font-medium text-gray-500">ORDER #{formatOrderId(orderData.id)}</span>
                                        {orderData.senderName && (
                                            <span className="px-3 py-1 bg-pink-100 text-pink-600 rounded-full text-xs font-medium">
                                                {orderData.senderName}
                                            </span>
                                        )}
                                    </div>
                                    <h2 className="text-xl font-bold text-gray-900 mb-2">{orderData.commodityName}</h2>
                                    {orderData.commodityCategory && (
                                        <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium mb-2">
                                            {orderData.commodityCategory}
                                        </span>
                                    )}
                                    {orderData.description && (
                                        <p className="text-sm text-gray-600 mb-3">
                                            {orderData.description}
                                        </p>
                                    )}
                                    {orderData.quantity && (
                                        <p className="text-sm text-gray-600 mb-2">
                                            <span className="font-medium">Quantity:</span> {orderData.quantity}
                                        </p>
                                    )}
                                    {orderData.isFragile && (
                                        <span className="inline-block px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-medium mb-2">
                                            ⚠️ Fragile
                                        </span>
                                    )}
                                    <div className="flex items-center gap-2 text-sm text-indigo-600 mt-3">
                                        <MapPinIcon className="w-4 h-4" />
                                        <span>{orderData.deliveryAddress}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Choose Delivery Slot - ML recommendations by date */}
                        <div className="bg-white rounded-2xl p-6 border border-gray-100">
                            <h3 className="text-lg font-bold text-gray-900 mb-2">Choose Your Delivery Slot</h3>
                            <p className="text-sm text-gray-500 mb-6">Select a time slot with higher success rate for guaranteed delivery</p>

                            {loading && (
                                <div className="grid grid-cols-4 gap-3">
                                    {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                                        <div key={i} className="rounded-xl p-4 bg-gray-100 animate-pulse h-24" />
                                    ))}
                                </div>
                            )}
                            {error && !loading && (
                                <div className="flex items-center gap-2 p-4 rounded-xl bg-red-50 border border-red-100 text-red-700">
                                    <ExclamationTriangleIcon className="w-5 h-5 flex-shrink-0" />
                                    <span>{error}</span>
                                </div>
                            )}
                            {!loading && !error && (
                                <div className="grid grid-cols-4 gap-3">
                                    {slotsForDay.map((s) => {
                                        const key = `${s.date}_${s.slot}`;
                                        const style = slotStyle(s.success_probability, s.risk_score);
                                        const reasons = Array.isArray(s.risk_reasons) ? s.risk_reasons : (s.risk_reasons ? [String(s.risk_reasons)] : []);
                                        const isAiPick = bestSlotForDay && bestSlotForDay.slot === s.slot && bestSlotForDay.date === s.date;
                                        return (
                                            <div
                                                key={key}
                                                onClick={() => setSelectedSlot(key)}
                                                className={`${style.bg} rounded-xl p-4 cursor-pointer transition-all hover:scale-[1.02] relative ${selectedSlot === key ? "ring-4 ring-indigo-500 ring-offset-2" : ""}`}
                                            >
                                                {isAiPick && (
                                                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full text-[10px] font-medium flex items-center gap-1 bg-gray-900 text-white">
                                                        <SparklesIcon className="w-3 h-3" /> AI Pick
                                                    </div>
                                                )}
                                                <div className="text-center">
                                                    <p className={`text-lg font-bold ${style.text} mb-1`}>{slotToLabel(s.slot)}</p>
                                                    <p className={`text-xl font-semibold ${style.text}`}>{Number(s.success_probability).toFixed(1)}%</p>
                                                    <p className="text-xs text-gray-500 mt-1">Success</p>
                                                    <p className="text-xs text-gray-600 mt-0.5">Risk: {Number(s.risk_score).toFixed(1)}%</p>
                                                    {reasons.length > 0 && (
                                                        <p className="text-[10px] text-amber-700 mt-1 line-clamp-2">{reasons.join(", ")}</p>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
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
                                            className={`p-2 rounded-lg text-center transition ${selectedDate === day.fullDate
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
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-3">
                                    Your Available Time: <span className="text-indigo-600">{preferredTime}:00 - {preferredTime + 1}:00</span>
                                </label>
                                <p className="text-xs text-gray-500 mb-2">Set your preferred time when you're available for delivery</p>
                                <div className="relative">
                                    <input
                                        type="range"
                                        min="6"
                                        max="23"
                                        value={preferredTime}
                                        onChange={(e) => {
                                            const newTime = Number(e.target.value);
                                            setPreferredTime(newTime);
                                            // Set this custom time as the selected slot
                                            setSelectedSlot(`custom-${effectiveDate}-${newTime}:00`);
                                        }}
                                        className="w-full h-3 bg-gradient-to-r from-orange-200 via-yellow-200 to-orange-200 rounded-lg appearance-none cursor-pointer slider-thumb"
                                        style={{
                                            background: `linear-gradient(to right, #fed7aa 0%, #fef3c7 50%, #fed7aa 100%)`
                                        }}
                                    />
                                    <style jsx>{`
                                        input[type="range"]::-webkit-slider-thumb {
                                            appearance: none;
                                            width: 20px;
                                            height: 20px;
                                            background: #4f46e5;
                                            border-radius: 50%;
                                            cursor: pointer;
                                            border: 3px solid white;
                                            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                                        }
                                        input[type="range"]::-moz-range-thumb {
                                            width: 20px;
                                            height: 20px;
                                            background: #4f46e5;
                                            border-radius: 50%;
                                            cursor: pointer;
                                            border: 3px solid white;
                                            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                                        }
                                    `}</style>
                                    <div className="flex justify-between text-xs text-gray-500 mt-3 font-medium">
                                        <span>6 AM</span>
                                        <span>12 PM</span>
                                        <span>6 PM</span>
                                        <span>11 PM</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Confirm Button */}
                        <button
                            onClick={handleConfirmSlot}
                            disabled={!selectedSlot || isSubmitting}
                            className="w-full py-4 bg-green-700 rounded-xl text-white font-semibold hover:bg-green-800 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            {isSubmitting ? "Confirming..." : "Confirm My Slot"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
