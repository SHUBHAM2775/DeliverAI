"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";
import Card from "@/components/Card";
import { UserGroupIcon, BriefcaseIcon, TruckIcon, ShieldCheckIcon } from "@heroicons/react/24/outline";

const roles = [
    {
        id: "admin",
        name: "Admin",
        description: "Manage delivery operations, agents, routes, and analytics",
        href: "/admin_page/overview",
        icon: ShieldCheckIcon,
    },
    {
        id: "sender",
        name: "Sender",
        description: "Create deliveries and propose time slots",
        href: "/sender_page/dashboard",
        icon: BriefcaseIcon,
    },
    {
        id: "receiver",
        name: "Receiver",
        description: "Confirm deliveries and select your preferred slots",
        href: "/receiver_page/notifications",
        icon: TruckIcon,
    },
    {
        id: "driver",
        name: "Driver",
        description: "",
        href: "/driver_page",
        icon: UserGroupIcon,
    },
];

type Step = "credentials" | "name";

export default function LoginPage() {
    const router = useRouter();
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [role, setRole] = useState<string>(roles[0]?.id ?? "");
    const [error, setError] = useState<string | null>(null);
    const [step, setStep] = useState<Step>("credentials");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const persistSession = (data: { phone?: string; role?: string; name?: string }) => {
        try {
            const avatarSeed = Math.floor(Math.random() * 70) + 1;
            localStorage.setItem(
                "rubixSession",
                JSON.stringify({
                    phone: data.phone ?? phone.trim(),
                    role: data.role ?? role,
                    name: data.name ?? name.trim(),
                    avatarSeed,
                })
            );
        } catch (e) {
            console.warn("Unable to persist session", e);
        }
    };

    const selectedRoleHref = useMemo(
        () => roles.find((r) => r.id === role)?.href ?? "/",
        [role]
    );

    const callAuth = async (payload: { role: string; phone: string; password: string; name?: string }) => {
        const response = await fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data?.error || "Login failed");
        }
        return data;
    };

    const handleCredentialsSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setError(null);

        if (!phone.trim() || !password.trim() || !role) {
            setError("Role, phone, and password are required.");
            return;
        }

        setIsSubmitting(true);
        try {
            const data = await callAuth({ role, phone: phone.trim(), password });
            if (data.requiresName) {
                setStep("name");
                return;
            }
            persistSession({ phone: data.phone, role: data.role, name: data.name });
            router.push(data.redirect ?? selectedRoleHref);
        } catch (err) {
            const message = err instanceof Error ? err.message : "Login failed";
            setError(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleNameSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setError(null);

        if (!name.trim()) {
            setError("Name is required for first-time users.");
            return;
        }

        setIsSubmitting(true);
        try {
            const data = await callAuth({ role, phone: phone.trim(), password, name: name.trim() });
            persistSession({ phone: data.phone, role: data.role, name: data.name });
            router.push(data.redirect ?? selectedRoleHref);
        } catch (err) {
            const message = err instanceof Error ? err.message : "Login failed";
            setError(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="w-full h-full overflow-auto bg-white flex flex-col">
            <nav className="bg-white border-b border-gray-200 px-8 py-4">
                <div className="flex items-center justify-between max-w-7xl mx-auto">
                    <button
                        onClick={() => router.push("/")}
                        className="flex items-center gap-3 group"
                    >
                        <img src="/logo.png" alt="DeliverAI" className="h-10 w-10 rounded-lg object-contain" />
                        <div className="text-left">
                            <p className="text-base font-semibold text-gray-900">DeliverAI</p>
                            <p className="text-xs text-gray-500">Unified access</p>
                        </div>
                    </button>
                    <p className="text-sm text-gray-600">Secure Access</p>
                </div>
            </nav>

            <div className="grow flex items-center justify-center px-8 py-10">
                <div className="w-full max-w-3xl">
                    <Card className="p-8 md:p-10 shadow-md border-gray-200">
                        <div className="text-center mb-10">
                            <h1 className="text-3xl font-bold text-gray-900 mb-3">Login</h1>
                            <p className="text-base text-gray-600">
                                Enter your details to access your dashboard. First-time users should
                                share their name and role.
                            </p>
                        </div>

                        {step === "credentials" && (
                            <form className="space-y-6" onSubmit={handleCredentialsSubmit}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <label className="flex flex-col gap-2 text-sm font-medium text-gray-700">
                                        Role
                                        <div className="relative">
                                            <select
                                                value={role}
                                                onChange={(e) => setRole(e.target.value)}
                                                className="w-full h-[52px] appearance-none rounded-lg border border-gray-300 px-4 pr-10 text-base focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition bg-white"
                                                required
                                            >
                                                {roles.map((item) => (
                                                    <option key={item.id} value={item.id}>
                                                        {item.name}
                                                    </option>
                                                ))}
                                            </select>
                                            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                                                v
                                            </div>
                                        </div>
                                    </label>

                                    <label className="flex flex-col gap-2 text-sm font-medium text-gray-700">
                                        Phone
                                        <input
                                            type="tel"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            placeholder="Enter phone number"
                                            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-base focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
                                            required
                                        />
                                    </label>
                                </div>

                                <label className="flex flex-col gap-2 text-sm font-medium text-gray-700">
                                    Password
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Enter password"
                                        className="w-full rounded-lg border border-gray-300 px-4 py-3 text-base focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
                                        required
                                    />
                                </label>

                                {error && (
                                    <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                                        {error}
                                    </div>
                                )}

                                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                    <div className="flex items-center gap-3">
                                        <Button type="button" variant="outline" onClick={() => router.push("/")}>
                                            Back to Landing
                                        </Button>
                                        <Button type="submit" variant="primary" isLoading={isSubmitting} disabled={isSubmitting}>
                                            Continue
                                        </Button>
                                    </div>
                                </div>
                            </form>
                        )}

                        {step === "name" && (
                            <form className="space-y-6" onSubmit={handleNameSubmit}>
                                <div className="rounded-lg border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-800">
                                    We need your name to finish setting up this account.
                                </div>

                                <label className="flex flex-col gap-2 text-sm font-medium text-gray-700">
                                    Name
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Enter full name"
                                        className="w-full rounded-lg border border-gray-300 px-4 py-3 text-base focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
                                        required
                                    />
                                </label>

                                {error && (
                                    <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                                        {error}
                                    </div>
                                )}

                                <div className="flex items-center gap-3">
                                    <Button type="button" variant="outline" onClick={() => setStep("credentials")}>
                                        Back
                                    </Button>
                                    <Button type="submit" variant="primary" isLoading={isSubmitting} disabled={isSubmitting}>
                                        Finish
                                    </Button>
                                </div>
                            </form>
                        )}
                    </Card>
                </div>
            </div>
        </div>
    );
}
