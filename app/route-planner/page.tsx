"use client";

import Header from "@/components/Header";

export default function RoutePlannerPage() {
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-8 min-h-full">
        <Header title="Route Planner" />
        <div className="bg-white rounded-2xl p-8 border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Route Planner</h2>
          <p className="text-gray-600 mt-2">
            Optimize delivery routes with AI-powered planning
          </p>
        </div>
      </div>
    </div>
  );
}
