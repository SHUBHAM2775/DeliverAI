"use client";

import { useRouter } from "next/navigation";
import Button from "@/components/Button";
import Card from "@/components/Card";
import {
    UserGroupIcon,
    BriefcaseIcon,
    TruckIcon,
    ArrowRightIcon,
} from "@heroicons/react/24/outline";

const roles = [
    {
        id: "admin",
        name: "Admin",
        description: "Manage delivery operations, agents, routes, and analytics",
        icon: UserGroupIcon,
        href: "/admin_page/overview",
        color: "from-purple-500 to-purple-600",
    },
    {
        id: "sender",
        name: "Sender",
        description: "Create deliveries and propose time slots",
        icon: BriefcaseIcon,
        href: "/sender_page/dashboard",
        color: "from-blue-500 to-blue-600",
    },
    {
        id: "receiver",
        name: "Receiver",
        description: "Confirm deliveries and select your preferred slots",
        icon: TruckIcon,
        href: "/receiver_page/notifications",
        color: "from-green-500 to-green-600",
    },
    {
        id: "driver",
        name: "Driver",
        description: "Manage assigned deliveries and track your daily route",
        icon: TruckIcon,
        href: "/driver_page",
        color: "from-blue-400 to-blue-500",
    },
];

export default function LoginPage() {
    const router = useRouter();

    const handleRoleSelect = (href: string) => {
        router.push(href);
    };

    return (
        <div className="w-full h-full overflow-auto bg-white flex flex-col">
            {/* Navigation Bar */}
            <nav className="bg-white border-b border-gray-200 px-8 py-4">
                <div className="flex items-center justify-between max-w-7xl mx-auto">
                    <div
                        className="h-10 w-10 rounded-lg bg-linear-to-br from-amber-400 to-amber-600 flex items-center justify-center font-bold text-white text-sm cursor-pointer"
                        onClick={() => router.push("/")}
                    >
                        D
                    </div>
                    <p className="text-sm text-gray-600">Role-Based Access</p>
                </div>
            </nav>

            {/* Main Content */}
            <div className="grow flex items-center justify-center px-8 py-10">
                <div className="w-full max-w-4xl">
                    <Card className="p-8 md:p-10 shadow-md border-gray-200">
                        {/* Header */}
                        <div className="text-center mb-12">
                            <h1 className="text-3xl font-bold text-gray-900 mb-3">
                                Select Your Role
                            </h1>
                            <p className="text-base text-gray-600 mb-1.5">
                                Role-based access for this prototype. No authentication implemented.
                            </p>
                            <p className="text-sm text-gray-500">
                                Choose your role to access the appropriate dashboard
                            </p>
                        </div>

                        {/* Role Cards */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                            {roles.map((role) => {
                                const Icon = role.icon;
                                return (
                                    <Card
                                        key={role.id}
                                        className="flex flex-col cursor-pointer hover:shadow-lg transition-all duration-200 border-2 border-transparent hover:border-blue-200"
                                        onClick={() => handleRoleSelect(role.href)}
                                    >
                                        {/* Icon with gradient background */}
                                        <div
                                            className={`mb-5 w-14 h-14 rounded-lg bg-linear-to-br ${role.color} flex items-center justify-center`}
                                        >
                                            <Icon className="h-7 w-7 text-white" />
                                        </div>

                                        {/* Role name */}
                                        <h2 className="text-xl font-bold text-gray-900 mb-1.5">
                                            {role.name}
                                        </h2>

                                        {/* Description */}
                                        <p className="text-gray-600 text-sm mb-5 grow leading-relaxed">
                                            {role.description}
                                        </p>

                                        {/* Button */}
                                        <Button
                                            variant="primary"
                                            size="md"
                                            className="w-full"
                                            onClick={() => handleRoleSelect(role.href)}
                                        >
                                            Continue as {role.name}
                                            <ArrowRightIcon className="ml-2 h-4 w-4" />
                                        </Button>
                                    </Card>
                                );
                            })}
                        </div>

                        {/* Footer Info */}
                        <div className="text-center">
                            <p className="text-sm text-gray-600 mb-3">
                                * Role-based routing only. Data access depends on role.
                            </p>
                            <p className="text-xs text-gray-500">
                                This is a prototype UI. Authentication and payments are not implemented.
                            </p>
                        </div>

                        {/* Back to Landing */}
                        <div className="mt-8 text-center">
                            <button
                                onClick={() => router.push("/")}
                                className="text-blue-600 hover:text-blue-700 text-sm font-medium transition"
                            >
                                ← Back to Landing Page
                            </button>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
