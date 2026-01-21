"use client"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import {
  ChartBarIcon,
  MapPinIcon,
  CheckCircleIcon,
  UserGroupIcon,
  BoltIcon,
} from "@heroicons/react/24/outline"

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as any },
  },
}

export function BentoGrid() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section id="features" className="px-4 py-24">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <h2 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl">
            Everything you need for delivery success
          </h2>
          <p className="mx-auto max-w-2xl text-gray-600">
            AI-driven slot intelligence, sender–receiver collaboration, and route-aware scheduling
            for higher first-attempt success.
          </p>
        </motion.div>

        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"
        >
          {/* Large: Delivery Pulse / Real-time */}
          <motion.div
            variants={itemVariants}
            className="group relative overflow-hidden rounded-2xl border border-orange-200 bg-orange-50 p-6 shadow-sm transition hover:border-amber-300 hover:shadow-md md:col-span-2"
          >
            <div className="mb-6 flex items-start justify-between">
              <div>
                <div className="mb-4 inline-flex rounded-lg bg-amber-50 p-2">
                  <ChartBarIcon className="h-5 w-5 text-amber-600" strokeWidth={1.5} />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-gray-900">Delivery Analytics & Pulse</h3>
                <p className="text-sm text-gray-600">
                  Track first-attempt success, AI-picked slots, pending confirmations, and route
                  efficiency in real time.
                </p>
              </div>
              <div className="flex gap-1">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                <span className="h-2 w-2 rounded-full bg-gray-300" />
              </div>
            </div>
            <div className="grid grid-cols-4 gap-4">
              {["Success rate", "AI slots", "Pending", "Efficiency"].map((m) => (
                <div key={m} className="text-center">
                  <div className="mb-1 text-2xl font-bold text-gray-900">
                    {m === "Success rate" ? "96%" : m === "AI slots" ? "74%" : m === "Pending" ? "38" : "+12%"}
                  </div>
                  <div className="text-xs text-gray-500">{m}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Dual-Sided Slots */}
          <motion.div
            variants={itemVariants}
            className="group relative overflow-hidden rounded-2xl border border-orange-200 bg-orange-50 p-6 shadow-sm transition hover:border-amber-300 hover:shadow-md"
          >
            <div className="mb-4 inline-flex rounded-lg bg-amber-50 p-2">
              <UserGroupIcon className="h-5 w-5 text-amber-600" strokeWidth={1.5} />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-gray-900">Dual-Sided Slot Management</h3>
            <p className="text-sm text-gray-600">
              Senders propose slots; receivers confirm or adjust. Everyone stays aligned before the
              delivery attempt.
            </p>
          </motion.div>

          {/* AI Slot Recommendation */}
          <motion.div
            variants={itemVariants}
            className="group relative overflow-hidden rounded-2xl border border-orange-200 bg-orange-50 p-6 shadow-sm transition hover:border-amber-300 hover:shadow-md"
          >
            <div className="mb-4 inline-flex rounded-lg bg-amber-50 p-2">
              <BoltIcon className="h-5 w-5 text-amber-600" strokeWidth={1.5} />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-gray-900">AI Slot Recommendations</h3>
            <p className="text-sm text-gray-600 mb-4">
              Success probability and risk scores per slot so receivers choose with confidence.
            </p>
            <p className="text-sm font-medium text-amber-700">Success & risk per slot</p>
          </motion.div>

          {/* Route-Aware */}
          <motion.div
            variants={itemVariants}
            className="group relative overflow-hidden rounded-2xl border border-orange-200 bg-orange-50 p-6 shadow-sm transition hover:border-amber-300 hover:shadow-md"
          >
            <div className="mb-4 inline-flex rounded-lg bg-amber-50 p-2">
              <MapPinIcon className="h-5 w-5 text-amber-600" strokeWidth={1.5} />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-gray-900">Route-Aware Scheduling</h3>
            <p className="text-sm text-gray-600">
              Slots are checked against agent routes and logistics so delivery stays on track.
            </p>
          </motion.div>

          {/* Pre-Delivery & Notifications */}
          <motion.div
            variants={itemVariants}
            className="group relative overflow-hidden rounded-2xl border border-orange-200 bg-orange-50 p-6 shadow-sm transition hover:border-amber-300 hover:shadow-md"
          >
            <div className="mb-4 inline-flex rounded-lg bg-amber-50 p-2">
              <CheckCircleIcon className="h-5 w-5 text-amber-600" strokeWidth={1.5} />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-gray-900">Pre-Delivery Confirmation</h3>
            <p className="text-sm text-gray-600 mb-4">
              Receivers confirm their slot via link before the driver is dispatched.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="rounded-md bg-gray-100 px-2 py-1 text-xs text-gray-600">Email link</span>
              <span className="rounded-md bg-gray-100 px-2 py-1 text-xs text-gray-600">Slot pick</span>
            </div>
          </motion.div>

        </motion.div>
      </div>
    </section>
  )
}
