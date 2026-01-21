"use client"

import { useRouter } from "next/navigation"
import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import { ArrowRightIcon } from "@heroicons/react/24/outline"

export function FinalCTA() {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const router = useRouter()

  return (
    <section ref={ref} className="px-4 py-24">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto max-w-4xl text-center"
      >
        <h2 className="mb-6 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
          Ready to improve delivery success?
        </h2>
        <p className="mx-auto mb-10 max-w-2xl text-lg text-gray-600 sm:text-xl">
          Join teams using Rubix for AI-driven slot selection, pre-delivery confirmation, and
          route-aware scheduling. Start with login—no credit card required.
        </p>

        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <button
            type="button"
            onClick={() => router.push("/login")}
            className="inline-flex items-center rounded-full bg-gray-900 px-8 py-4 text-base font-medium text-white shadow-lg transition hover:bg-gray-800"
          >
            Get Started for Free
            <ArrowRightIcon className="ml-2 h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => (document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" }))}
            className="inline-flex items-center rounded-full border-2 border-gray-300 bg-white px-8 py-4 text-base font-medium text-gray-700 transition hover:border-gray-400 hover:bg-gray-50"
          >
            See plans
          </button>
        </div>

        <p className="mt-8 text-sm text-gray-500">
          Free to start. Sender, receiver, and admin roles available after login.
        </p>
      </motion.div>
    </section>
  )
}
