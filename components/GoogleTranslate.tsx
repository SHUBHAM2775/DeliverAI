"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { LanguageIcon, ChevronDownIcon } from "@heroicons/react/24/outline";

declare global {
  interface Window {
    googleTranslateElementInit?: () => void;
    google?: {
      translate?: {
        TranslateElement: (new (
          opts: {
            pageLanguage: string;
            includedLanguages?: string;
            layout?: unknown;
            autoDisplay?: boolean;
          },
          containerId: string
        ) => unknown) & {
          InlineLayout?: { SIMPLE?: unknown };
        };
      };
    };
  }
}

const SCRIPT_ID = "google-translate-script";

type Language = { code: "en" | "hi" | "mr" | "gu"; label: string };

function setGoogTransCookie(lang: Language["code"]) {
  // Google uses this cookie to decide the translation pair.
  // Note: We keep "en" as the source language as per your app's default.
  document.cookie = `googtrans=/en/${lang}; path=/`;
}

function resetGoogTransCookie() {
  document.cookie = "googtrans=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
}

function readGoogTransCookie(): string | null {
  const match = document.cookie.match(/(?:^|;\s*)googtrans=([^;]+)/);
  return match?.[1] ?? null;
}

function cookieToLang(cookieValue: string | null): Language["code"] {
  // Expected format: /en/<lang>
  if (!cookieValue) return "en";
  const parts = cookieValue.split("/");
  const maybeLang = parts[2] as Language["code"] | undefined;
  if (maybeLang === "hi" || maybeLang === "mr" || maybeLang === "gu" || maybeLang === "en") return maybeLang;
  return "en";
}

export default function GoogleTranslate() {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const [currentLang, setCurrentLang] = useState<Language["code"]>(() => {
    if (typeof document === "undefined") return "en";
    return cookieToLang(readGoogTransCookie());
  });

  const languages = useMemo<Language[]>(
    () => [
      { code: "en", label: "English" },
      { code: "hi", label: "हिंदी" },
      { code: "mr", label: "मराठी" },
      { code: "gu", label: "ગુજરાતી" },
    ],
    []
  );

  // Load Google Translate script once (robustly).
  useEffect(() => {
    if (typeof window === "undefined") return;

    window.googleTranslateElementInit = () => {
      // Create the hidden widget that powers translation.
      // We intentionally hide it via CSS (see globals.css).
      const TranslateElement = window.google?.translate?.TranslateElement;
      if (!TranslateElement) return;

      new TranslateElement(
        {
          pageLanguage: "en",
          includedLanguages: "en,hi,mr,gu",
          layout: TranslateElement.InlineLayout?.SIMPLE,
          autoDisplay: false,
        },
        "google_translate_element_hidden"
      );
    };

    if (document.getElementById(SCRIPT_ID)) return;

    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      delete window.googleTranslateElementInit;
    };
  }, []);

  // Close dropdown when clicking outside.
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLanguageChange = (lang: Language["code"]) => {
    if (lang === "en") {
      resetGoogTransCookie();
    } else {
      setGoogTransCookie(lang);
    }

    // Google translate reads cookie on load; simplest reliable path is reload.
    // This ensures translation works "at any stage" from any page.
    setCurrentLang(lang);
    setOpen(false);
    window.location.reload();
  };

  const currentLabel = languages.find((l) => l.code === currentLang)?.label ?? "Translate";

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2 hover:bg-gray-50 transition text-sm text-gray-700 shadow-sm"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <LanguageIcon className="h-5 w-5 text-gray-500" />
        <span className="hidden sm:inline">{currentLabel}</span>
        <ChevronDownIcon className="h-4 w-4 text-gray-500" />
      </button>

      {open && (
        <div className="absolute top-full right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg py-1 min-w-[180px] z-50 overflow-hidden">
          {languages.map((lang) => (
            <button
              key={lang.code}
              type="button"
              className={`w-full text-left px-3 py-2 transition text-sm ${
                currentLang === lang.code ? "bg-gray-50 text-gray-900 font-semibold" : "text-gray-700 hover:bg-gray-50"
              }`}
              onClick={() => handleLanguageChange(lang.code)}
            >
              {lang.label}
            </button>
          ))}
        </div>
      )}

      {/* Hidden div to hold the actual Google widget */}
      <div id="google_translate_element_hidden" style={{ display: "none" }} />
    </div>
  );
}

