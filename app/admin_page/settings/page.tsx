"use client";

import Header from "@/components/Header";
import { motion } from "framer-motion";
import { useState } from "react";

export default function SettingsPage() {
    // Slot Configuration state
    const [slotDuration, setSlotDuration] = useState("2 hours");
    const [confirmationLeadTime, setConfirmationLeadTime] = useState(4);

    // External Factors state
    const [trafficWeight, setTrafficWeight] = useState(70);
    const [weatherWeight, setWeatherWeight] = useState(50);

    // AI Configuration state
    const [aiAutomationLevel, setAiAutomationLevel] = useState(75);
    const [agentOptimization, setAgentOptimization] = useState(true);
    const [slotBalancing, setSlotBalancing] = useState(true);

    // Notifications state
    const [autoReschedule, setAutoReschedule] = useState(true);
    const [smartNotifications, setSmartNotifications] = useState(true);
    const [predictiveAlerts, setPredictiveAlerts] = useState(true);

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                ease: [0.25, 0.1, 0.25, 1] as const
            }
        }
    };

    const handleReset = () => {
        setSlotDuration("2 hours");
        setConfirmationLeadTime(4);
        setTrafficWeight(70);
        setWeatherWeight(50);
        setAiAutomationLevel(75);
        setAgentOptimization(true);
        setSlotBalancing(true);
        setAutoReschedule(true);
        setSmartNotifications(true);
        setPredictiveAlerts(true);
    };

    const handleSaveChanges = () => {
        // Save changes logic - could be API call
        alert("Settings saved successfully!");
    };

    // Toggle component
    const Toggle = ({ enabled, onChange }: { enabled: boolean; onChange: (val: boolean) => void }) => (
        <motion.button
            className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
                enabled ? 'bg-blue-600' : 'bg-gray-300'
            }`}
            onClick={() => onChange(!enabled)}
            whileTap={{ scale: 0.95 }}
        >
            <motion.div
                className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md"
                animate={{ left: enabled ? '26px' : '2px' }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
        </motion.button>
    );

    // Slider component
    const Slider = ({ 
        value, 
        onChange, 
        min = 0, 
        max = 100,
        showPercentage = true 
    }: { 
        value: number; 
        onChange: (val: number) => void; 
        min?: number; 
        max?: number;
        showPercentage?: boolean;
    }) => {
        const percentage = ((value - min) / (max - min)) * 100;
        
        return (
            <div className="relative w-full h-2 bg-gray-200 rounded-full">
                <motion.div
                    className="absolute top-0 left-0 h-2 bg-blue-600 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.3 }}
                />
                <input
                    type="range"
                    min={min}
                    max={max}
                    value={value}
                    onChange={(e) => onChange(Number(e.target.value))}
                    className="absolute top-0 left-0 w-full h-2 opacity-0 cursor-pointer"
                />
                <motion.div
                    className="absolute top-1/2 -translate-y-1/2 w-5 h-5 bg-white border-2 border-blue-600 rounded-full shadow-md cursor-pointer"
                    style={{ left: `calc(${percentage}% - 10px)` }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                />
            </div>
        );
    };

    return (
        <div className="flex-1 overflow-y-auto">
            <div className="p-8 min-h-full">
                <Header title="Settings" />
                
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="space-y-6"
                >
                    {/* Page Header */}
                    <motion.div 
                        variants={cardVariants}
                        className="flex items-center justify-between"
                    >
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
                            <p className="text-gray-500 mt-1">Configure your delivery system preferences</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <motion.button
                                onClick={handleReset}
                                className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                Reset
                            </motion.button>
                            <motion.button
                                onClick={handleSaveChanges}
                                className="flex items-center gap-2 px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                                </svg>
                                Save Changes
                            </motion.button>
                        </div>
                    </motion.div>

                    {/* Settings Grid - Row 1 */}
                    <div className="grid grid-cols-2 gap-6">
                        {/* Slot Configuration */}
                        <motion.div
                            variants={cardVariants}
                            className="bg-white rounded-xl border border-gray-200 p-6"
                            whileHover={{ boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}
                        >
                            <div className="flex items-start gap-4 mb-6">
                                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">Slot Configuration</h3>
                                    <p className="text-sm text-gray-500">Time slot duration and scheduling</p>
                                </div>
                            </div>

                            {/* Slot Duration */}
                            <div className="mb-6">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium text-gray-900">Slot Duration</span>
                                    <span className="text-sm text-gray-500">{slotDuration}</span>
                                </div>
                                <select
                                    value={slotDuration}
                                    onChange={(e) => setSlotDuration(e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
                                >
                                    <option value="1 hour">1 hour</option>
                                    <option value="2 hours">2 hours</option>
                                    <option value="3 hours">3 hours</option>
                                    <option value="4 hours">4 hours</option>
                                </select>
                            </div>

                            {/* Confirmation Lead Time */}
                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-sm font-medium text-gray-900">Confirmation Lead Time</span>
                                    <span className="text-sm text-gray-500">{confirmationLeadTime} hours before</span>
                                </div>
                                <Slider
                                    value={confirmationLeadTime}
                                    onChange={setConfirmationLeadTime}
                                    min={1}
                                    max={12}
                                    showPercentage={false}
                                />
                            </div>
                        </motion.div>

                        {/* External Factors */}
                        <motion.div
                            variants={cardVariants}
                            className="bg-white rounded-xl border border-gray-200 p-6"
                            whileHover={{ boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}
                        >
                            <div className="flex items-start gap-4 mb-6">
                                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                                    <svg className="w-6 h-6 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">External Factors</h3>
                                    <p className="text-sm text-gray-500">Traffic and weather consideration weights</p>
                                </div>
                            </div>

                            {/* Traffic Weight */}
                            <div className="mb-6">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                        </svg>
                                        <span className="text-sm font-medium text-gray-900">Traffic Weight</span>
                                    </div>
                                    <span className="text-sm text-gray-500">{trafficWeight}%</span>
                                </div>
                                <Slider value={trafficWeight} onChange={setTrafficWeight} />
                            </div>

                            {/* Weather Weight */}
                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                                        </svg>
                                        <span className="text-sm font-medium text-gray-900">Weather Weight</span>
                                    </div>
                                    <span className="text-sm text-gray-500">{weatherWeight}%</span>
                                </div>
                                <Slider value={weatherWeight} onChange={setWeatherWeight} />
                            </div>
                        </motion.div>
                    </div>

                    {/* Settings Grid - Row 2 */}
                    <div className="grid grid-cols-2 gap-6">
                        {/* AI Configuration */}
                        <motion.div
                            variants={cardVariants}
                            className="bg-white rounded-xl border border-gray-200 p-6"
                            whileHover={{ boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}
                        >
                            <div className="flex items-start gap-4 mb-6">
                                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">AI Configuration</h3>
                                    <p className="text-sm text-gray-500">AI automation and optimization level</p>
                                </div>
                            </div>

                            {/* AI Automation Level */}
                            <div className="mb-6">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-sm font-medium text-gray-900">AI Automation Level</span>
                                    <span className="text-sm text-gray-500">{aiAutomationLevel}%</span>
                                </div>
                                <Slider value={aiAutomationLevel} onChange={setAiAutomationLevel} />
                                <p className="text-xs text-blue-500 mt-2">Higher values give AI more decision-making authority</p>
                            </div>

                            {/* Agent Optimization */}
                            <div className="flex items-center justify-between py-4 border-t border-gray-100">
                                <div>
                                    <span className="text-sm font-medium text-gray-900">Agent Optimization</span>
                                    <p className="text-xs text-gray-500 mt-0.5">AI assigns agents to optimal routes</p>
                                </div>
                                <Toggle enabled={agentOptimization} onChange={setAgentOptimization} />
                            </div>

                            {/* Slot Balancing */}
                            <div className="flex items-center justify-between py-4 border-t border-gray-100">
                                <div>
                                    <span className="text-sm font-medium text-gray-900">Slot Balancing</span>
                                    <p className="text-xs text-gray-500 mt-0.5">Auto-balance orders across slots</p>
                                </div>
                                <Toggle enabled={slotBalancing} onChange={setSlotBalancing} />
                            </div>
                        </motion.div>

                        {/* Notifications */}
                        <motion.div
                            variants={cardVariants}
                            className="bg-white rounded-xl border border-gray-200 p-6"
                            whileHover={{ boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}
                        >
                            <div className="flex items-start gap-4 mb-6">
                                <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center">
                                    <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
                                    <p className="text-sm text-gray-500">Alert and notification preferences</p>
                                </div>
                            </div>

                            {/* Auto-Reschedule */}
                            <div className="flex items-center justify-between py-4 border-b border-gray-100">
                                <div>
                                    <span className="text-sm font-medium text-gray-900">Auto-Reschedule</span>
                                    <p className="text-xs text-gray-500 mt-0.5">Automatically reschedule failed deliveries</p>
                                </div>
                                <Toggle enabled={autoReschedule} onChange={setAutoReschedule} />
                            </div>

                            {/* Smart Notifications */}
                            <div className="flex items-center justify-between py-4 border-b border-gray-100">
                                <div>
                                    <span className="text-sm font-medium text-gray-900">Smart Notifications</span>
                                    <p className="text-xs text-gray-500 mt-0.5">AI-filtered important alerts only</p>
                                </div>
                                <Toggle enabled={smartNotifications} onChange={setSmartNotifications} />
                            </div>

                            {/* Predictive Alerts */}
                            <div className="flex items-center justify-between py-4">
                                <div>
                                    <span className="text-sm font-medium text-gray-900">Predictive Alerts</span>
                                    <p className="text-xs text-gray-500 mt-0.5">Get alerts before issues occur</p>
                                </div>
                                <Toggle enabled={predictiveAlerts} onChange={setPredictiveAlerts} />
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
