"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { useRouter } from "next/navigation";
import ProfileDropdown from "@/components/ProfileDropdown";
import {
    MagnifyingGlassIcon,
    BellIcon,
    EyeIcon,
    PencilIcon,
    XMarkIcon,
} from "@heroicons/react/24/outline";

// Order data
const ordersData = [
    {
        id: "ORD-001",
        commodity: "iPhone 15 Pro Max",
        category: "Electronics",
        customer: "Priya Patel",
        area: "Koramangala",
        pincode: "560034",
        slots: "2026-01-20 • 2:00 PM - 4:00 PM",
        status: "Confirmed",
    },
    {
        id: "ORD-002",
        commodity: "Legal Documents Bundle",
        category: "Documents",
        customer: "Amit Kumar",
        area: "Indiranagar",
        pincode: "560038",
        slots: "2026-01-21, 2026-01-21",
        status: "Waiting",
    },
    {
        id: "ORD-003",
        commodity: "Homemade Cake",
        category: "Food",
        customer: "Sneha Reddy",
        area: "Marathahalli",
        pincode: "560037",
        slots: "2026-01-19 • 11:00 AM - 1:00 PM",
        status: "Delivered",
    },
    {
        id: "ORD-004",
        commodity: "Winter Jacket Collection",
        category: "Clothes",
        customer: "Vikram Singh",
        area: "Whitefield",
        pincode: "560066",
        slots: "2026-01-22, 2026-01-22",
        status: "Waiting",
    },
    {
        id: "ORD-005",
        commodity: "Blood Pressure Medicine",
        category: "Medicine",
        customer: "Lakshmi Narayan",
        area: "BTM Layout",
        pincode: "560029",
        slots: "2026-01-20 • 9:00 AM - 10:00 AM",
        status: "Out for Delivery",
    },
    {
        id: "ORD-006",
        commodity: "Samsung Galaxy Tab",
        category: "Electronics",
        customer: "Kiran Rao",
        area: "Electronic City",
        pincode: "560100",
        slots: "2026-01-18 • 2:00 PM - 4:00 PM",
        status: "Failed",
    },
];

export default function SenderDashboard() {
    const router = useRouter();
    const [orders, setOrders] = useState(ordersData);
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    // Calculate stats
    const totalOrders = orders.length;
    const waitingOrders = orders.filter(o => o.status === "Waiting").length;
    const confirmedOrders = orders.filter(o => o.status === "Confirmed").length;
    const deliveredOrders = orders.filter(o => o.status === "Delivered").length;
    const failedOrders = orders.filter(o => o.status === "Failed").length;

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

    const itemVariants = {
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

    const tableRowVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: {
            opacity: 1,
            x: 0,
            transition: {
                duration: 0.4,
                ease: [0.25, 0.1, 0.25, 1] as const
            }
        }
    };

    const getStatusStyle = (status: string) => {
        switch (status) {
            case "Confirmed":
                return "bg-green-50 text-green-600 border border-green-200";
            case "Waiting":
                return "bg-amber-50 text-amber-600 border border-amber-200";
            case "Delivered":
                return "bg-green-500 text-white";
            case "Out for Delivery":
                return "bg-blue-50 text-blue-600 border border-blue-200";
            case "Failed":
                return "bg-red-500 text-white";
            default:
                return "bg-gray-100 text-gray-600";
        }
    };

    const handleDelete = (orderId: string) => {
        setOrders(orders.filter(order => order.id !== orderId));
    };

    const handleView = (orderId: string) => {
        // Navigate to order details or show modal
        alert(`Viewing order: ${orderId}`);
    };

    const handleEdit = (orderId: string) => {
        // Navigate to edit form
        router.push(`/sender_page/delivery-form?edit=${orderId}`);
    };

    // Stats cards data
    const statsCards = [
        {
            title: "TOTAL ORDERS",
            value: totalOrders,
            subtitle: "",
            bgColor: "bg-white",
            icon: (
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
            ),
        },
        {
            title: "WAITING",
            value: waitingOrders,
            subtitle: "For customer response",
            bgColor: "bg-[#FEF3C7]",
            icon: (
                <svg className="w-6 h-6 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
        },
        {
            title: "CONFIRMED",
            value: confirmedOrders,
            subtitle: "",
            bgColor: "bg-[#E0E7FF]",
            icon: (
                <svg className="w-6 h-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
        },
        {
            title: "DELIVERED",
            value: deliveredOrders,
            subtitle: "",
            bgColor: "bg-[#D1FAE5]",
            icon: (
                <svg className="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>
            ),
        },
        {
            title: "FAILED",
            value: failedOrders,
            subtitle: "",
            bgColor: "bg-white",
            icon: (
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            hasCloseIcon: true,
        },
    ];

    return (
        <div className="flex-1 overflow-y-auto bg-gray-50">
            <div className="p-8 min-h-full">
                {/* Header */}
                <header className="flex items-center justify-between mb-8 pb-6 border-b border-gray-200 relative z-10">
                    <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                    <div className="flex items-center gap-6">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search orders..."
                                className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 w-56"
                            />
                            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        </div>
                        <button 
                            className="p-2 hover:bg-gray-100 rounded-lg transition relative"
                            onClick={() => router.push('/sender_page/notification')}
                        >
                            <BellIcon className="h-5 w-5 text-gray-600" />
                            <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">1</span>
                        </button>
                        <div 
                            className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition relative"
                            onClick={() => setIsProfileOpen(!isProfileOpen)}
                        >
                            <span className="text-sm font-medium text-gray-700">Rahul Sharma</span>
                            <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white font-semibold">
                                RS
                            </div>
                            <ProfileDropdown isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
                        </div>
                    </div>
                </header>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="space-y-8"
                    style={{ position: 'relative', zIndex: 1 }}
                >
                    {/* Stats Cards */}
                    <div className="grid grid-cols-5 gap-4">
                        {statsCards.map((card, idx) => (
                            <motion.div
                                key={idx}
                                variants={itemVariants}
                                className={`${card.bgColor} rounded-xl p-5 border border-gray-100 relative`}
                                whileHover={{ scale: 1.02, boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}
                            >
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{card.title}</p>
                                        <motion.p
                                            className="text-4xl font-bold text-gray-900 mt-2"
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ delay: 0.3 + idx * 0.1, type: "spring", stiffness: 200 }}
                                        >
                                            {card.value}
                                        </motion.p>
                                        {card.subtitle && (
                                            <p className="text-xs text-gray-500 mt-1">{card.subtitle}</p>
                                        )}
                                    </div>
                                    <div className="mt-1">
                                        {card.hasCloseIcon ? (
                                            <div className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center">
                                                <XMarkIcon className="w-4 h-4 text-gray-400" />
                                            </div>
                                        ) : (
                                            card.icon
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Recent Orders Table */}
                    <motion.div
                        variants={itemVariants}
                        className="bg-white rounded-xl border border-gray-100 overflow-hidden"
                    >
                        <div className="p-6 border-b border-gray-100">
                            <h2 className="text-lg font-bold text-gray-900">Recent Orders</h2>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-100">
                                        <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Order ID</th>
                                        <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Commodity</th>
                                        <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Customer</th>
                                        <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Area</th>
                                        <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Slots</th>
                                        <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Status</th>
                                        <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.map((order, idx) => (
                                        <motion.tr
                                            key={order.id}
                                            variants={tableRowVariants}
                                            initial="hidden"
                                            animate="visible"
                                            transition={{ delay: 0.1 * idx }}
                                            className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                                        >
                                            <td className="py-4 px-6">
                                                <span className="text-orange-500 font-medium">{order.id}</span>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900">{order.commodity}</p>
                                                    <p className="text-xs text-gray-400">{order.category}</p>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <span className="text-sm text-gray-700">{order.customer}</span>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900">{order.area}</p>
                                                    <p className="text-xs text-gray-400">{order.pincode}</p>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <span className="text-sm text-gray-700">{order.slots}</span>
                                            </td>
                                            <td className="py-4 px-6">
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(order.status)}`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-2">
                                                    <motion.button
                                                        onClick={() => handleView(order.id)}
                                                        className="p-1.5 hover:bg-gray-100 rounded-lg transition"
                                                        whileHover={{ scale: 1.1 }}
                                                        whileTap={{ scale: 0.95 }}
                                                    >
                                                        <EyeIcon className="w-5 h-5 text-gray-500" />
                                                    </motion.button>
                                                    {order.status === "Waiting" && (
                                                        <motion.button
                                                            onClick={() => handleEdit(order.id)}
                                                            className="p-1.5 hover:bg-gray-100 rounded-lg transition"
                                                            whileHover={{ scale: 1.1 }}
                                                            whileTap={{ scale: 0.95 }}
                                                        >
                                                            <PencilIcon className="w-5 h-5 text-gray-500" />
                                                        </motion.button>
                                                    )}
                                                    <motion.button
                                                        onClick={() => handleDelete(order.id)}
                                                        className="p-1.5 hover:bg-red-50 rounded-lg transition"
                                                        whileHover={{ scale: 1.1 }}
                                                        whileTap={{ scale: 0.95 }}
                                                    >
                                                        <XMarkIcon className="w-5 h-5 text-red-500" />
                                                    </motion.button>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
}
