"use client";

import Header from "@/components/Header";

export default function AlertsPage() {
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-8 min-h-full">
        <Header title="Alerts" />
        <div className="bg-white rounded-2xl p-8 border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Alerts</h2>
          <p className="text-gray-600 mt-2">
            Monitor and manage delivery alerts
          </p>
        </div>
      </div>
    </div>
  );
}
