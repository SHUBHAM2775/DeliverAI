"use client";

import { useRouter } from "next/navigation";
import Button from "@/components/Button";
import Card from "@/components/Card";
import {
  CheckCircleIcon,
  UserGroupIcon,
  MapPinIcon,
  BellAlertIcon,
  ChartBarIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";

const features = [
  {
    title: "Dual-Sided Slot Management",
    description: "Empowers both senders and receivers to propose and confirm delivery time slots",
    icon: UserGroupIcon,
  },
  {
    title: "AI-Based Slot Recommendation",
    description: "Intelligent suggestions based on historical delivery patterns and success rates",
    icon: ChartBarIcon,
  },
  {
    title: "Pre-Delivery Confirmation",
    description: "Real-time customer confirmation before delivery attempt",
    icon: CheckCircleIcon,
  },
  {
    title: "Route-Aware Scheduling",
    description: "Optimizes slots considering delivery agent routes and logistics constraints",
    icon: MapPinIcon,
  },
  {
    title: "Smart Notifications",
    description: "Proactive alerts for rescheduling and delivery status updates",
    icon: BellAlertIcon,
  },
  {
    title: "Analytics Dashboard",
    description: "Comprehensive metrics on delivery success, trends, and AI prediction accuracy",
    icon: ChartBarIcon,
  },
];

const steps = [
  {
    number: "01",
    title: "Sender Proposes",
    description: "Sender submits delivery slots based on their availability",
  },
  {
    number: "02",
    title: "Receiver Confirms",
    description: "Receiver selects or modifies proposed slots to fit their schedule",
  },
  {
    number: "03",
    title: "Slot Validation",
    description: "AI validates slots against route constraints and agent availability",
  },
  {
    number: "04",
    title: "Delivery Optimized",
    description: "Route planner executes delivery with optimized schedule",
  },
  {
    number: "05",
    title: "Analytics Refine",
    description: "System learns from outcomes to improve future recommendations",
  },
];

const problems = [
  {
    title: "Fixed Delivery Windows",
    description: "Inflexible time slots lead to customer unavailability",
  },
  {
    title: "Missed Deliveries",
    description: "High failed-first-attempt rates due to poor scheduling",
  },
  {
    title: "Route Inefficiencies",
    description: "Suboptimal delivery routes and agent utilization",
  },
];

const solutions = [
  {
    title: "Flexible Slot Selection",
    description: "Customers choose delivery times that work for them",
  },
  {
    title: "Collaboration",
    description: "Seamless sender–receiver communication and coordination",
  },
  {
    title: "AI Route Planning",
    description: "Intelligent scheduling respects logistics constraints",
  },
];

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="w-full h-full overflow-auto bg-white flex flex-col">
      {/* Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 px-8 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="h-10 w-10 rounded-lg bg-linear-to-br from-amber-400 to-amber-600 flex items-center justify-center font-bold text-white text-sm">
            D
          </div>
          <div className="flex gap-4">
            <Button
              variant="outline"
              size="md"
              onClick={() => router.push("/login")}
            >
              Login
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="px-6 py-16 max-w-6xl mx-auto">
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8 md:p-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold mb-4">
                <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                AI-Powered Delivery Platform
              </div>
              <h1 className="text-4xl font-bold text-gray-900 leading-tight mb-3">
                Customized Time Slot Delivery of Articles & Parcels
              </h1>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                AI-driven, customer-centric delivery slot planning for higher first-attempt success.
              </p>
              <div className="flex gap-3 flex-wrap">
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => router.push("/login")}
                  className="min-w-[170px]"
                >
                  Login to Platform <ArrowRightIcon className="ml-2 h-5 w-5" />
                </Button>
                <Button variant="outline" size="md" className="min-w-[170px]">
                  View Platform Features
                </Button>
              </div>
            </div>
            <div className="w-full md:w-72 lg:w-80 bg-gray-50 border border-gray-200 rounded-xl p-6 shadow-inner">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-semibold text-gray-700">Today’s Delivery Pulse</p>
                <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">Live</span>
              </div>
              <div className="space-y-3 text-sm text-gray-700">
                <div className="flex items-center justify-between">
                  <span>First-attempt success</span>
                  <span className="font-semibold text-gray-900">96%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>AI-picked slots</span>
                  <span className="font-semibold text-gray-900">74%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Pending confirmations</span>
                  <span className="font-semibold text-gray-900">38</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Route efficiency</span>
                  <span className="font-semibold text-gray-900">+12%</span>
                </div>
              </div>
              <div className="mt-5 h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full w-3/5 bg-blue-600"></div>
              </div>
              <p className="text-xs text-gray-500 mt-3">Prototype metrics for visual consistency.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Problem → Solution Section */}
      <section className="px-6 py-14 bg-gray-50 border-y border-gray-200">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-10">
            The Problem & Our Solution
          </h2>
          <div className="grid grid-cols-2 gap-8">
            {/* Problems */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Current Challenges
              </h3>
              <div className="space-y-4">
                {problems.map((problem, idx) => (
                  <Card key={idx} className="border-l-4 border-l-red-500">
                    <h4 className="font-semibold text-gray-900 mb-2">
                      {problem.title}
                    </h4>
                    <p className="text-sm text-gray-600">{problem.description}</p>
                  </Card>
                ))}
              </div>
            </div>

            {/* Solutions */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                How We Help
              </h3>
              <div className="space-y-4">
                {solutions.map((solution, idx) => (
                  <Card key={idx} className="border-l-4 border-l-green-500">
                    <h4 className="font-semibold text-gray-900 mb-2">
                      {solution.title}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {solution.description}
                    </p>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Features Section */}
      <section className="px-6 py-14">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-10">
            Core Features
          </h2>
          <div className="grid grid-cols-3 gap-5">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <Card key={idx} className="flex flex-col min-h-[200px]">
                  <div className="mb-4">
                    <Icon className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-600 grow">
                    {feature.description}
                  </p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="px-6 py-14 bg-gray-50 border-t border-gray-200">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-10">
            How It Works
          </h2>
          <div className="grid md:grid-cols-2 gap-5">
            {steps.map((step, idx) => (
              <Card key={idx} className="flex items-start gap-4">
                <div className="shrink-0 w-11 h-11 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                  {step.number}
                </div>
                <div className="grow">
                  <h3 className="text-base font-semibold text-gray-900 mb-1">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{step.description}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-10 border-t border-gray-200 bg-gray-50 text-center">
        <div className="max-w-6xl mx-auto">
          <p className="text-sm text-gray-600 mb-4">
            * Prototype UI – Authentication and payments are not implemented
          </p>
          <p className="text-xs text-gray-500">
            DeliverAI © 2026 | AI-Powered Delivery Optimization
          </p>
        </div>
      </footer>
    </div>
  );
}
