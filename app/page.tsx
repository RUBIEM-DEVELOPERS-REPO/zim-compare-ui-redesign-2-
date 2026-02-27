"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { useI18n } from "@/lib/i18n"

export default function LandingPage() {
  const { t } = useI18n()

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f8fafc] dark:bg-[#0b0f14] selection:bg-teal-500/30 transition-colors duration-500">
      {/* Premium Adaptive Gradients */}
      <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-teal-200/40 dark:bg-teal-900/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[0%] left-[-10%] w-[500px] h-[500px] bg-emerald-100/30 dark:bg-emerald-900/10 rounded-full blur-[100px] pointer-events-none opacity-40" />
      <div className="absolute top-[40%] right-[10%] w-[400px] h-[400px] bg-teal-100/20 dark:bg-teal-800/10 rounded-full blur-[80px] pointer-events-none" />

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center pt-24 pb-32 text-center px-4 max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold text-teal-600 dark:text-teal-500 mb-2 animate-fade-in tracking-tight">Fintech</h2>
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white dark:bg-teal-950/30 border border-teal-100 dark:border-teal-800/50 text-teal-700 dark:text-teal-400 text-xs font-semibold mb-10 animate-fade-in backdrop-blur-sm shadow-sm">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
          </span>
          {t("landing.nextGen")}
        </div>

        <h1 className="text-6xl sm:text-8xl font-serif tracking-tighter text-[#1a1a1a] dark:text-white mb-8 leading-[1.05] animate-in slide-in-from-bottom-8 duration-700">
          {t("landing.headline").split(".")[0]} <br />
          <span className="italic text-teal-600 dark:text-teal-400 drop-shadow-[0_0_15px_rgba(20,184,166,0.1)] dark:drop-shadow-[0_0_15px_rgba(20,184,166,0.2)]">
            {t("landing.headline").split(".")[1]}
          </span>
        </h1>

        <p className="text-xl text-slate-600 dark:text-gray-400 max-w-2xl mb-12 leading-relaxed animate-in slide-in-from-bottom-10 duration-1000">
          {t("landing.subheadline")}
        </p>

        <div className="flex flex-col sm:flex-row gap-5 w-full max-w-md animate-in slide-in-from-bottom-12 duration-1000 fill-mode-both">
          <Link
            href="/signup"
            className="group flex-1 bg-teal-600 dark:bg-teal-500 text-white dark:text-[#0b0f14] py-4 px-8 rounded-full font-bold hover:bg-teal-700 dark:hover:bg-teal-400 transition-all flex items-center justify-center gap-2 shadow-xl shadow-teal-500/10"
          >
            {t("landing.getStarted")}
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/signin"
            className="flex-1 bg-white dark:bg-[#1a1f26] text-[#1a1a1a] dark:text-white py-4 px-8 rounded-full font-medium hover:bg-slate-50 dark:hover:bg-[#252b35] transition-all text-center border border-slate-200 dark:border-gray-800/50 shadow-sm"
          >
            {t("landing.signIn")}
          </Link>
        </div>


        {/* Categories Bar */}
        <div className="mt-40 pt-16 border-t border-slate-200 dark:border-gray-800/30 w-full">
          <p className="text-[10px] uppercase tracking-[0.3em] text-slate-400 dark:text-gray-500 font-bold mb-12 opacity-80">Trusted Data Channels</p>
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-60 hover:opacity-100 transition-opacity duration-700">
            {["Banking", "Telecom", "Schools", "Insurance"].map((cat) => (
              <div key={cat} className="text-2xl font-serif italic text-slate-900 dark:text-white/90 tracking-tight hover:text-teal-600 dark:hover:text-teal-400 transition-colors cursor-default">{cat}</div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .font-serif {
          font-family: var(--font-old-century), "Old Standard TT", serif;
        }
      `}</style>
    </div>
  )
}

