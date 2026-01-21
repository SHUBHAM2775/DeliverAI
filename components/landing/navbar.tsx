"use client"

import { useRouter } from "next/navigation"
import GoogleTranslate from "@/components/GoogleTranslate"

export function Navbar() {
  const router = useRouter()

  return (
    <nav className="fixed left-1/2 top-6 z-50 w-[calc(100%-2rem)] max-w-4xl -translate-x-1/2 rounded-full border border-gray-200 bg-white/95 shadow-lg backdrop-blur supports-[backdrop-filter]:bg-white/90">
      <div className="flex items-center justify-between px-6 py-2">
        <a
          href="/"
          className="flex items-center gap-2 font-semibold text-gray-900 hover:opacity-90"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-amber-600 font-bold text-white text-sm bg-[#E17100] text-bold">
            D
          </div>
          <span>DeliverAI</span>
        </a>
        <div className="flex gap-4">
          <GoogleTranslate />
          <button
            type="button"
            onClick={() => router.push("/login")}
            className="rounded-full border-2 border-gray-200 px-5 py-2.5 text-sm font-bold text-black transition hover:border-gray-300 hover:bg-gray-50 bg-[#E17100]"
          >
            Login
          </button>
        </div>
      </div>
    </nav>
  )
}
