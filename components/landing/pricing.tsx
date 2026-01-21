"use client"

import { useRouter } from "next/navigation"
import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import { UserGroupIcon, TruckIcon, ChartBarSquareIcon } from "@heroicons/react/24/outline"

const plans = [
  {
    name: "Senders",
    description: "Create orders, set slots, and get AI-backed suggestions.",
    icon: UserGroupIcon,
    features: ["Dual-sided slot proposals", "ML slot recommendations", "Receiver link & confirmations"],
  },
  {
    name: "Receivers",
    description: "Pick slots from your link with success and risk scores.",
    icon: TruckIcon,
    features: ["Slot selection by date & time", "Success & risk % per slot", "Pre-delivery confirmation"],
  },
  {
    name: "Admin & Drivers",
    description: "Dashboard, route planner, and delivery analytics.",
    icon: ChartBarSquareIcon,
    features: ["Analytics dashboard", "Route planner", "Pre-dispatch & alerts"],
  },
]

export function Pricing() {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-80px" })
  const router = useRouter()

  return (
    <section id="pricing" ref={ref} className="border-t border-gray-100 bg-gray-50/50 px-4 py-24">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-14 text-center"
        >
          <h2 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl">
            Built for every role
          </h2>
          <p className="mx-auto max-w-2xl text-gray-600">
            Senders, receivers, and operations teams use Rubix to align on slots and improve
            first-attempt delivery success.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid gap-6 md:grid-cols-3"
        >
          {plans.map((plan) => {
            const Icon = plan.icon
            return (
              <div
                key={plan.name}
                className="rounded-2xl border border-orange-200 bg-orange-50 p-6 shadow-sm transition hover:border-amber-300 hover:shadow-md"
              >
                <div className="mb-4 inline-flex rounded-lg bg-amber-50 p-2">
                  <Icon className="h-5 w-5 text-amber-600" strokeWidth={1.5} />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900">{plan.name}</h3>
                <p className="mb-6 text-sm text-gray-600">{plan.description}</p>
                <ul className="mb-6 space-y-2 text-sm text-gray-600">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                      {f}
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  onClick={() => router.push("/login")}
                  className="w-full rounded-xl border-2 border-gray-200 py-2.5 text-sm font-medium text-gray-700 transition hover:border-amber-300 hover:bg-amber-50"
                >
                  Get started
                </button>
              </div>
            )
          })}
        </motion.div>

        <p className="mt-8 text-center text-sm text-gray-500">
          Contact us for enterprise and custom deployments.
        </p>
      </div>
    </section>
  )
}
