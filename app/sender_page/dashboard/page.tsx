"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import SenderHeader from "@/components/SenderHeader";
import {
    EyeIcon,
    PencilIcon,
    XMarkIcon,
    CalendarIcon,
    MapPinIcon,
    PhoneIcon,
    CheckCircleIcon,
} from "@heroicons/react/24/outline";
import { CubeIcon, UserCircleIcon } from "@heroicons/react/24/solid";

interface Order {
    id: string;
    commodity: string;
    category: string;
    customer: string;
    area: string;
    pincode: string;
    workingHours: string;
    status: string;
    description?: string;
    quantity?: string;
    isFragile?: boolean;
    createdAt?: string;
}

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
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setIsLoading(true);
                const response = await fetch("/api/orders");
                if (response.ok) {
                    const data = await response.json();
                    setOrders(data.orders || []);
                } else {
                    console.error("Failed to fetch orders");
                }
            } catch (error) {
                console.error("Error fetching orders:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchOrders();
    }, []);

    // Calculate stats
    const totalOrders = orders.length;
    const waitingOrders = orders.filter(o => o.status === "CREATED").length;
    const confirmedOrders = orders.filter(o => o.status === "CONFIRMED").length;
    const deliveredOrders = orders.filter(o => o.status === "DELIVERED").length;
    const failedOrders = orders.filter(o => o.status === "FAILED").length;

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
            case "CONFIRMED":
            case "Confirmed":
                return "bg-green-50 text-green-600 border border-green-200";
            case "CREATED":
            case "Waiting":
                return "bg-amber-50 text-amber-600 border border-amber-200";
            case "DELIVERED":
            case "Delivered":
                return "bg-green-500 text-white";
            case "Out for Delivery":
                return "bg-blue-50 text-blue-600 border border-blue-200";
            case "FAILED":
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
        const order = orders.find(o => o.id === orderId);
        if (order) {
            setSelectedOrder(order);
        }
    };

    const handleCloseOrderView = () => {
        setSelectedOrder(null);
    };

    const handleMarkAsConfirmed = async (orderId: string) => {
        // TODO: Implement API call to update order status
        console.log("Marking order as confirmed:", orderId);
        setOrders(orders.map(o => 
            o.id === orderId ? { ...o, status: "CONFIRMED" } : o
        ));
        if (selectedOrder?.id === orderId) {
            setSelectedOrder({ ...selectedOrder, status: "CONFIRMED" });
        }
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return "Jan 19, 2026";
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    };

    const formatTime = (dateString?: string) => {
        if (!dateString) return "9:15 AM";
        const date = new Date(dateString);
        return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
    };

    const getStatusDisplay = (status: string) => {
        if (status === "CREATED") return "Waiting";
        if (status === "CONFIRMED") return "Confirmed";
        if (status === "DELIVERED") return "Delivered";
        if (status === "FAILED") return "Failed";
        return status;
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
                <SenderHeader title="Dashboard" subtitle="Sender workspace" />

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
                            {isLoading ? (
                                <div className="py-12 text-center text-gray-500">
                                    <p>Loading orders...</p>
                                </div>
                            ) : orders.length === 0 ? (
                                <div className="py-12 text-center text-gray-500">
                                    <p>No orders found</p>
                                </div>
                            ) : (
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-100">
                                        <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Order ID</th>
                                        <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Commodity</th>
                                        <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Customer</th>
                                        <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Area</th>
                                        <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Working Hours</th>
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
                                                <span className="text-sm text-gray-700">{order.workingHours}</span>
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
                                                    {(order.status === "Waiting" || order.status === "CREATED") && (
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
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            </div>

            {/* Order Details Modal */}
            {selectedOrder && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                    onClick={handleCloseOrderView}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-orange-50 to-white p-6 border-b border-gray-200">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900">Order {selectedOrder.id}</h1>
                                    <div className="flex items-center gap-3 mt-2">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(selectedOrder.status)}`}>
                                            {getStatusDisplay(selectedOrder.status)}
                                        </span>
                                        <span className="text-sm text-gray-500">Created {formatDate(selectedOrder.createdAt)}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => handleEdit(selectedOrder.id)}
                                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition"
                                    >
                                        <PencilIcon className="w-4 h-4" />
                                        Edit
                                    </button>
                                    <button
                                        onClick={handleCloseOrderView}
                                        className="p-2 hover:bg-gray-100 rounded-lg transition"
                                    >
                                        <XMarkIcon className="w-6 h-6 text-gray-500" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Left Column - Order Details */}
                            <div className="lg:col-span-2 space-y-6">
                                {/* Commodity Details */}
                                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <CubeIcon className="w-6 h-6 text-purple-600" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-lg font-bold text-gray-900">{selectedOrder.commodity}</h3>
                                            <p className="text-sm text-gray-500 mt-1">{selectedOrder.category}</p>
                                            {selectedOrder.description && (
                                                <p className="text-sm text-gray-600 mt-3">{selectedOrder.description}</p>
                                            )}
                                            {selectedOrder.quantity && (
                                                <p className="text-sm text-gray-700 mt-2">
                                                    <span className="font-medium">Quantity:</span> {selectedOrder.quantity}
                                                </p>
                                            )}
                                            {selectedOrder.isFragile && (
                                                <span className="inline-block mt-2 px-2 py-1 bg-red-50 text-red-600 text-xs font-medium rounded border border-red-200">
                                                    Fragile
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Customer Details */}
                                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                                            <UserCircleIcon className="w-8 h-8 text-green-600" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-lg font-bold text-gray-900">{selectedOrder.customer}</h3>
                                            <div className="mt-3 space-y-2">
                                                <div className="flex items-start gap-2 text-sm text-gray-600">
                                                    <MapPinIcon className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                                                    <span>{selectedOrder.area}, {selectedOrder.pincode}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Delivery Slots */}
                                <div className="bg-white rounded-xl p-6 border border-gray-200">
                                    <div className="flex items-center gap-2 mb-4">
                                        <CalendarIcon className="w-5 h-5 text-gray-700" />
                                        <h3 className="text-lg font-bold text-gray-900">Delivery Slots</h3>
                                    </div>
                                    {selectedOrder.status === "CREATED" || selectedOrder.status === "Waiting" ? (
                                        <p className="text-sm text-gray-500 mb-4">Waiting for customer to select a slot</p>
                                    ) : null}
                                    <div className="space-y-2">
                                        {selectedOrder.workingHours && selectedOrder.workingHours.split(',').map((slot, idx) => (
                                            <div
                                                key={idx}
                                                className="bg-amber-50 border border-amber-200 rounded-lg p-4"
                                            >
                                                <p className="text-sm font-medium text-gray-900">
                                                    {slot.trim()}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Right Column - Actions & Timeline */}
                            <div className="space-y-6">
                                {/* Simulate Actions */}
                                {selectedOrder.status === "CREATED" && (
                                    <div className="bg-white rounded-xl p-6 border border-gray-200">
                                        <h3 className="text-lg font-bold text-gray-900 mb-4">Simulate Actions</h3>
                                        <button
                                            onClick={() => handleMarkAsConfirmed(selectedOrder.id)}
                                            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-50 text-green-700 border border-green-200 rounded-lg hover:bg-green-100 transition font-medium"
                                        >
                                            <CheckCircleIcon className="w-5 h-5" />
                                            Mark as Confirmed
                                        </button>
                                    </div>
                                )}

                                {/* Timeline */}
                                <div className="bg-white rounded-xl p-6 border border-gray-200">
                                    <h3 className="text-lg font-bold text-gray-900 mb-6">Timeline</h3>
                                    <div className="space-y-6 relative">
                                        {/* Timeline line */}
                                        <div className="absolute left-3 top-6 bottom-6 w-0.5 bg-gray-200"></div>

                                        {/* Order Created */}
                                        <div className="relative flex gap-4">
                                            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 z-10">
                                                <CheckCircleIcon className="w-4 h-4 text-white" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900">Order Created</p>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    {formatDate(selectedOrder.createdAt)} {formatTime(selectedOrder.createdAt)}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Sent to Customer */}
                                        <div className="relative flex gap-4">
                                            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 z-10">
                                                <CheckCircleIcon className="w-4 h-4 text-white" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900">Sent to Customer</p>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    {formatDate(selectedOrder.createdAt)} {formatTime(selectedOrder.createdAt)}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Viewed by Customer */}
                                        <div className="relative flex gap-4">
                                            <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0 z-10"></div>
                                            <div>
                                                <p className="font-medium text-gray-500">Viewed by Customer</p>
                                            </div>
                                        </div>

                                        {/* Slot Confirmed */}
                                        <div className="relative flex gap-4">
                                            <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0 z-10"></div>
                                            <div>
                                                <p className="font-medium text-gray-500">Slot Confirmed</p>
                                            </div>
                                        </div>

                                        {/* Out for Delivery */}
                                        <div className="relative flex gap-4">
                                            <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0 z-10"></div>
                                            <div>
                                                <p className="font-medium text-gray-500">Out for Delivery</p>
                                            </div>
                                        </div>

                                        {/* Delivered */}
                                        <div className="relative flex gap-4">
                                            <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0 z-10"></div>
                                            <div>
                                                <p className="font-medium text-gray-500">Delivered</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </div>
    );
}
