"use client";

import Header from "@/components/Header";

export default function AgentsPage() {
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-8 min-h-full">
        <Header title="Agents" />
        <div className="bg-white rounded-2xl p-8 border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Agents</h2>
          <p className="text-gray-600 mt-2">
            Manage and monitor delivery agents
          </p>
        </div>
      </div>
    </div>
  );
}
