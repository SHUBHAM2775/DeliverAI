"use client"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"

const footerLinks = {
  Product: ["Features", "Pricing", "Slot Intelligence", "Analytics", "API"],
  Resources: ["Documentation", "Guides", "Blog", "Community", "Templates"],
  Company: ["About", "Careers", "Press", "Partners", "Contact"],
  Legal: ["Privacy", "Terms", "Security", "Cookies"],
}

export function Footer() {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })

  return (
    <footer
      ref={ref}
      className="border-t border-gray-200 bg-gray-50"
    >
      <div className="mx-auto max-w-6xl px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-2 gap-8 md:grid-cols-5"
        >
          <div className="col-span-2 md:col-span-1">
            <a href="/" className="mb-4 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500 text-white">
                R
              </div>
              <span className="font-semibold text-gray-900">Rubix</span>
            </a>
            <p className="mb-4 text-sm text-gray-600">
              AI-powered delivery slot intelligence for higher first-attempt success.
            </p>
            <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span className="text-xs text-gray-600">All systems operational</span>
            </div>
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="mb-4 text-sm font-semibold text-gray-900">{title}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-gray-600 transition hover:text-gray-900"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-gray-200 pt-8 sm:flex-row"
        >
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Rubix. AI-powered delivery optimization.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-sm text-gray-500 transition hover:text-gray-900">
              Twitter
            </a>
            <a href="#" className="text-sm text-gray-500 transition hover:text-gray-900">
              GitHub
            </a>
            <a href="#" className="text-sm text-gray-500 transition hover:text-gray-900">
              Contact
            </a>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}
