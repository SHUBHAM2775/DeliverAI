"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    BellIcon,
    ClockIcon,
    MapPinIcon,
    UserIcon,
    ChatBubbleBottomCenterTextIcon,
    CalendarIcon,
    SparklesIcon,
    FireIcon,
} from "@heroicons/react/24/outline";
import { StarIcon as StarIconSolid } from "@heroicons/react/24/solid";
import { StarIcon as StarIconOutline } from "@heroicons/react/24/outline";

const availableSlots = [
    { time: "8:00 - 11:00 AM", rate: 88, badge: "AI Pick" },
    { time: "11:00 - 1:00 PM", rate: 75, badge: null },
    { time: "3:00 - 5:00 PM", rate: 62, badge: null },
    { time: "5:00 - 7:00 PM", rate: 70, badge: "Popular" },
];

export default function NotificationsPage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<"reminder" | "reschedule" | "feedback">("reminder");
    const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
    const [preferredTime, setPreferredTime] = useState(12);
    const [selectedDate, setSelectedDate] = useState("");
    const [rating, setRating] = useState(0);
    const [feedback, setFeedback] = useState("");
    const [wasConvenient, setWasConvenient] = useState<boolean | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [submitMessage, setSubmitMessage] = useState<string | null>(null);

    const handleReschedule = () => {
        setActiveTab("reschedule");
    };

    const handleFeedback = () => {
        setActiveTab("feedback");
    };

    const handleConfirmNewSlot = () => {
        router.push("/receiver_page/confirmation");
    };

    const handleSubmitFeedback = async () => {
        setSubmitMessage(null);
        try {
            setSubmitting(true);
            const res = await fetch("/api/feedback", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    rating,
                    comment: feedback,
                    wasConvenient,
                }),
            });
            if (!res.ok) {
                throw new Error("Failed to submit feedback");
            }
            setSubmitMessage("Feedback submitted successfully");
            // Optionally navigate after success
            router.push("/receiver_page/confirmation");
        } catch (error) {
            console.error(error);
            setSubmitMessage("Could not submit feedback. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="flex-1 overflow-y-auto bg-gray-50">
            <div className="p-8 min-h-full">
                {/* Header */}
                <h1 className="text-2xl font-bold text-gray-900 mb-8">Notifications</h1>

                {/* Tabs */}
                <div className="flex gap-3 mb-8">
                    <button
                        onClick={() => setActiveTab("reminder")}
                        className={`px-6 py-2.5 rounded-lg font-medium transition flex items-center gap-2 ${
                            activeTab === "reminder"
                                ? "bg-indigo-600 text-white"
                                : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                        }`}
                    >
                        <BellIcon className="w-4 h-4" />
                        Reminder
                    </button>
                    <button
                        onClick={() => setActiveTab("reschedule")}
                        className={`px-6 py-2.5 rounded-lg font-medium transition flex items-center gap-2 ${
                            activeTab === "reschedule"
                                ? "bg-indigo-600 text-white"
                                : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                        }`}
                    >
                        <CalendarIcon className="w-4 h-4" />
                        Reschedule
                    </button>
                    <button
                        onClick={() => setActiveTab("feedback")}
                        className={`px-6 py-2.5 rounded-lg font-medium transition flex items-center gap-2 ${
                            activeTab === "feedback"
                                ? "bg-indigo-600 text-white"
                                : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                        }`}
                    >
                        <ChatBubbleBottomCenterTextIcon className="w-4 h-4" />
                        Feedback
                    </button>
                </div>

                {/* Content */}
                {activeTab === "reminder" && (
                    <div className="max-w-3xl mx-auto">
                        <div className="bg-gradient-to-br from-purple-100 to-indigo-100 rounded-3xl p-10">
                            {/* Bell Icon */}
                            <div className="flex justify-center mb-6">
                                <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center">
                                    <BellIcon className="w-8 h-8 text-white" />
                                </div>
                            </div>

                            {/* Title */}
                            <h2 className="text-3xl font-bold text-gray-900 text-center mb-2">
                                Your Delivery is Scheduled Today!
                            </h2>
                            <p className="text-gray-600 text-center mb-8">
                                Get ready to receive your package
                            </p>

                            {/* Confirmed Slot */}
                            <div className="bg-white rounded-2xl p-6 mb-6">
                                <p className="text-sm text-gray-500 text-center mb-2">Confirmed Delivery Slot</p>
                                <div className="flex items-center justify-center gap-3 mb-4">
                                    <ClockIcon className="w-6 h-6 text-indigo-600" />
                                    <h3 className="text-2xl font-bold text-gray-900">8:00 - 10:00 AM</h3>
                                </div>
                                <div className="flex items-center justify-center gap-2 text-gray-700 mb-1">
                                    <UserIcon className="w-5 h-5 text-indigo-600" />
                                    <p className="font-medium">Delivery Partner: <span className="text-indigo-600">Michael Rodriguez</span></p>
                                </div>
                            </div>

                            {/* Address */}
                            <div className="flex items-start justify-center gap-3 text-gray-700 mb-8">
                                <MapPinIcon className="w-5 h-5 text-indigo-600 mt-0.5" />
                                <p className="text-sm">123 Green Valley Road, Apt 4B, New York, NY 10001</p>
                            </div>

                            {/* Buttons */}
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    onClick={handleReschedule}
                                    className="py-4 bg-white border-2 border-gray-200 rounded-xl text-gray-700 font-semibold hover:bg-gray-50 transition flex items-center justify-center gap-2"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                    I Won't Be Available
                                </button>
                                <button className="py-4 bg-green-700 rounded-xl text-white font-semibold hover:bg-green-800 transition flex items-center justify-center gap-2">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    I Will Be Available
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === "reschedule" && (
                    <div>
                        {/* Warning Banner */}
                        <div className="bg-gradient-to-r from-purple-200 to-violet-200 rounded-xl p-4 mb-6 border border-purple-300">
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center flex-shrink-0">
                                    <svg className="w-5 h-5 text-purple-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-1">Reschedule Required</h3>
                                    <p className="text-sm text-gray-700">
                                        Due to high traffic congestion on your delivery route, we've updated the available time slots to ensure successful delivery.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-6">
                            {/* Left - Available Slots */}
                            <div className="col-span-2">
                                <div className="bg-white rounded-2xl p-4 border border-gray-100">
                                    <h3 className="text-base font-bold text-gray-900 mb-1">New Available Slots</h3>
                                    <p className="text-xs text-gray-500 mb-4">AI-recommended alternatives based on your area</p>

                                    <div className="grid grid-cols-2 gap-3">
                                        {availableSlots.map((slot, idx) => (
                                            <div
                                                key={idx}
                                                onClick={() => setSelectedSlot(slot.time)}
                                                className={`bg-green-200 rounded-lg p-2.5 cursor-pointer transition-all hover:scale-105 relative ${
                                                    selectedSlot === slot.time ? 'ring-4 ring-indigo-500 ring-offset-2' : ''
                                                }`}
                                            >
                                                {slot.badge && (
                                                    <div className={`absolute -top-1.5 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded-full text-[8px] font-medium flex items-center gap-0.5 ${
                                                        slot.badge === "AI Pick" 
                                                            ? "bg-gray-900 text-white" 
                                                            : "bg-white text-gray-700 border border-gray-200"
                                                    }`}>
                                                        {slot.badge === "AI Pick" ? (
                                                            <SparklesIcon className="w-2.5 h-2.5" />
                                                        ) : (
                                                            <FireIcon className="w-2.5 h-2.5" />
                                                        )}
                                                        {slot.badge}
                                                    </div>
                                                )}
                                                <div className="text-center">
                                                    <p className="text-xs font-medium text-gray-800 mb-1">{slot.time}</p>
                                                    <p className="text-2xl font-bold text-green-700 mb-0.5">{slot.rate}%</p>
                                                    <p className="text-xs text-gray-600">Success rate</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Right - Suggest Time */}
                            <div className="space-y-4">
                                <div className="bg-gradient-to-br from-pink-100 to-rose-100 rounded-2xl p-4 border border-pink-200">
                                    <div className="flex items-center gap-2 mb-3">
                                        <ClockIcon className="w-4 h-4 text-gray-700" />
                                        <h3 className="text-sm font-bold text-gray-900">Suggest Your Preferred Time</h3>
                                    </div>

                                    <div className="mb-4">
                                        <label className="block text-xs text-gray-600 mb-2">Date</label>
                                        <input
                                            type="date"
                                            value={selectedDate}
                                            onChange={(e) => setSelectedDate(e.target.value)}
                                            className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        />
                                    </div>

                                    <div className="mb-4">
                                        <label className="block text-xs text-gray-600 mb-2">Preferred Time: {preferredTime}:00</label>
                                        <div className="relative">
                                            <input
                                                type="range"
                                                min="6"
                                                max="23"
                                                value={preferredTime}
                                                onChange={(e) => setPreferredTime(Number(e.target.value))}
                                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                                            />
                                            <div className="flex justify-between text-xs text-gray-400 mt-1">
                                                <span>6 AM</span>
                                                <span>12 PM</span>
                                                <span>6 PM</span>
                                                <span>11 PM</span>
                                            </div>
                                        </div>
                                    </div>

                                    <button className="w-full py-2 bg-white border-2 border-pink-200 rounded-xl text-pink-600 font-medium text-sm hover:bg-pink-50 transition">
                                        Suggest This Slot
                                    </button>
                                </div>

                                <button
                                    onClick={handleConfirmNewSlot}
                                    disabled={!selectedSlot}
                                    className="w-full py-2.5 bg-green-700 rounded-xl text-white font-semibold text-sm hover:bg-green-800 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    <CalendarIcon className="w-5 h-5" />
                                    Confirm New Slot
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === "feedback" && (
                    <div className="max-w-2xl mx-auto">
                        <div className="bg-gradient-to-br from-blue-100 to-indigo-100 rounded-3xl p-10">
                            {/* Feedback Icon */}
                            <div className="flex justify-center mb-6">
                                <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center">
                                    <ChatBubbleBottomCenterTextIcon className="w-8 h-8 text-white" />
                                </div>
                            </div>

                            {/* Title */}
                            <h2 className="text-3xl font-bold text-gray-900 text-center mb-2">
                                How Was Your Delivery?
                            </h2>
                            <p className="text-gray-600 text-center mb-8">
                                Was this delivery time convenient for you?
                            </p>

                            {/* Quick Buttons */}
                            <div className="flex gap-4 justify-center mb-8">
                                <button
                                    onClick={() => setWasConvenient(true)}
                                    className={`px-8 py-3 rounded-xl font-semibold transition flex items-center gap-2 ${
                                        wasConvenient === true
                                            ? "bg-green-800 text-white"
                                            : "bg-green-700 text-white hover:bg-green-800"
                                    }`}
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    Yes, Perfect!
                                </button>
                                <button
                                    onClick={() => setWasConvenient(false)}
                                    className={`px-8 py-3 rounded-xl font-semibold transition flex items-center gap-2 ${
                                        wasConvenient === false
                                            ? "bg-gray-200 text-gray-800 border-2 border-gray-300"
                                            : "bg-white border-2 border-gray-200 text-gray-700 hover:bg-gray-50"
                                    }`}
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                    Could Be Better
                                </button>
                            </div>

                            {/* Star Rating */}
                            <div className="mb-8">
                                <p className="text-center text-gray-600 mb-4">Rate your experience</p>
                                <div className="flex justify-center gap-3">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            onClick={() => setRating(star)}
                                            className="transition-transform hover:scale-110"
                                        >
                                            {star <= rating ? (
                                                <StarIconSolid className="w-10 h-10 text-yellow-500" />
                                            ) : (
                                                <StarIconOutline className="w-10 h-10 text-gray-300" />
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Comment Box */}
                            <div className="mb-6">
                                <textarea
                                    value={feedback}
                                    onChange={(e) => setFeedback(e.target.value)}
                                    placeholder="Any additional comments? (optional)"
                                    rows={4}
                                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                                />
                            </div>

                            {/* Submit Button */}
                            <button
                                onClick={handleSubmitFeedback}
                                disabled={submitting}
                                className="w-full py-4 bg-indigo-600 rounded-xl text-white font-semibold hover:bg-indigo-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {submitting ? "Submitting..." : "Submit Feedback"}
                            </button>
                            {submitMessage && (
                                <p className="text-center text-sm text-gray-700 mt-3">{submitMessage}</p>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
