"use client";

import Header from "@/components/Header";
import { useEffect, useState } from "react";

interface Route {
    routeId: string;
    agentName: string;
    routeDate: string;
    totalOrders: number;
    routeDistance: string;
    routeDuration: string;
    conflicts: string[];
}

export default function RoutePlannerPage() {
    const [routes, setRoutes] = useState<Route[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchRoutes = async () => {
            try {
                const response = await fetch("/api/admin_apis/routes");
                if (!response.ok) throw new Error("Failed to fetch routes");
                const data = await response.json();
                setRoutes(data?.data || []);
            } catch (err: any) {
                setError(err?.message || "Unable to load routes");
            } finally {
                setLoading(false);
            }
        };
        fetchRoutes();
    }, []);

    if (loading) {
        return (
            <div className="flex-1 overflow-y-auto">
                <div className="p-8">
                    <Header title="Route Planner" />
                    <div className="bg-white rounded-2xl p-8 border border-gray-200 text-center text-gray-600">
                        Loading routes...
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex-1 overflow-y-auto">
                <div className="p-8">
                    <Header title="Route Planner" />
                    <div className="bg-white rounded-2xl p-8 border border-gray-200 text-center text-red-600">
                        {error}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 overflow-y-auto">
            <div className="p-8 min-h-full bg-gray-50">
                <Header title="Route Planner" />
                <div className="grid grid-cols-1 gap-6">
                    {routes.map((route) => (
                        <div key={route.routeId} className="bg-white rounded-xl border border-gray-200 p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">{route.agentName}</h3>
                                    <p className="text-sm text-gray-600">Date: {new Date(route.routeDate).toLocaleDateString()}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-2xl font-bold text-blue-600">{route.totalOrders}</p>
                                    <p className="text-sm text-gray-600">orders</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-4 mb-4">
                                <div className="bg-gray-50 rounded-lg p-3">
                                    <p className="text-xs text-gray-600">Distance</p>
                                    <p className="font-bold text-gray-900">{route.routeDistance}</p>
                                </div>
                                <div className="bg-gray-50 rounded-lg p-3">
                                    <p className="text-xs text-gray-600">Duration</p>
                                    <p className="font-bold text-gray-900">{route.routeDuration}</p>
                                </div>
                                <div className="bg-gray-50 rounded-lg p-3">
                                    <p className="text-xs text-gray-600">Status</p>
                                    <p className="font-bold text-green-600">Ready</p>
                                </div>
                            </div>
                            {route.conflicts && route.conflicts.length > 0 && (
                                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                                    <p className="text-xs font-bold text-yellow-700">⚠ Conflicts:</p>
                                    <p className="text-sm text-yellow-600">{route.conflicts.join(", ")}</p>
                                </div>
                            )}
                        </div>
                    ))}
                    {routes.length === 0 && (
                        <div className="bg-white rounded-2xl p-8 border border-gray-200 text-center text-gray-600">
                            No routes available
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
