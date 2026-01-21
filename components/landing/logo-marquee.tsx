"use client"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"

const items = [
  "Slot Intelligence",
  "Pre-Delivery Confirm",
  "Route Planning",
  "Analytics",
  "Smart Notifications",
  "Dual-Sided Slots",
  "AI Recommendations",
  "First-Attempt Success",
]

export function LogoMarquee() {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section ref={ref} className="overflow-hidden border-y border-gray-100 bg-gray-50/50 py-12">
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.6 }}
        className="mb-8 text-center"
      >
        <p className="text-sm font-medium uppercase tracking-wider text-gray-500">
          Built for delivery and logistics
        </p>
      </motion.div>

      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 z-10 w-24 bg-gradient-to-r from-gray-50 to-transparent pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 z-10 w-24 bg-gradient-to-l from-gray-50 to-transparent pointer-events-none" />

        <div className="flex animate-marquee">
          {[...items, ...items].map((label, i) => (
            <div
              key={`${label}-${i}`}
              className="mx-6 flex min-w-[180px] items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-3 text-gray-600 shadow-sm transition hover:border-amber-200 hover:shadow"
            >
              <span className="font-medium">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
