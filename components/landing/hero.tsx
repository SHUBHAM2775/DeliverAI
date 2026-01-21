"use client"

import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowRightIcon } from "@heroicons/react/24/outline"

const textRevealVariants = {
  hidden: { y: "100%" },
  visible: (i: number) => ({
    y: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: i * 0.1 },
  }),
}

export function Hero() {
  const router = useRouter()

  return (
    <section className="relative flex min-h-[85vh] flex-col items-center justify-center overflow-hidden px-4 pt-28 pb-20">
      <div className="absolute inset-0 bg-gradient-to-b from-amber-50/80 via-white to-white pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 h-[500px] w-[600px] -translate-x-1/2 rounded-full bg-amber-100/50 blur-3xl pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-4xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8 inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-4 py-2"
        >
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          <span className="text-sm font-medium text-amber-800">AI-Powered Delivery Slots</span>
        </motion.div>

        <h1 className="mb-6 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
          <span className="block overflow-hidden">
            <motion.span
              className="block"
              variants={textRevealVariants}
              initial="hidden"
              animate="visible"
              custom={0}
            >
              Smarter delivery slots.
            </motion.span>
          </span>
          <span className="block overflow-hidden">
            <motion.span
              className="block text-amber-600"
              variants={textRevealVariants}
              initial="hidden"
              animate="visible"
              custom={1}
            >
              Higher first-attempt success.
            </motion.span>
          </span>
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mx-auto mb-10 max-w-2xl text-lg text-gray-600 sm:text-xl leading-relaxed"
        >
          Rubix connects senders, receivers, and drivers with AI-driven slot recommendations,
          pre-delivery confirmation, and route-aware scheduling.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mb-14 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <button
            type="button"
            onClick={() => router.push("/login")}
            className="inline-flex items-center rounded-full bg-gray-900 px-8 py-3 text-base font-medium text-white shadow-lg transition hover:bg-gray-800"
          >
            Get Started
            <ArrowRightIcon className="ml-2 h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => (document.getElementById("features")?.scrollIntoView({ behavior: "smooth" }))}
            className="inline-flex items-center rounded-full border-2 border-gray-300 bg-white px-8 py-3 text-base font-medium text-gray-700 transition hover:border-gray-400 hover:bg-gray-50"
          >
            See Features
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="flex gap-2 text-sm text-gray-500">
            <span className="rounded-md bg-gray-100 px-3 py-1 font-medium text-gray-700">Senders</span>
            <span className="rounded-md bg-gray-100 px-3 py-1 font-medium text-gray-700">Receivers</span>
            <span className="rounded-md bg-gray-100 px-3 py-1 font-medium text-gray-700">Drivers</span>
          </div>
          <p className="text-sm text-gray-500">
            Built for <span className="font-medium text-gray-700">logistics teams</span> and last-mile delivery.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
