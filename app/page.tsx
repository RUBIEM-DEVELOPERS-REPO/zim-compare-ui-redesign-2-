"use client"

import Link from "next/link"
import { useI18n } from "@/lib/i18n"

export default function LandingPage() {
  const { t } = useI18n()

  return (
    <main className="h-screen w-full overflow-hidden bg-background relative flex flex-col items-center justify-center pt-[80px] pb-[80px]">
      {/* Background Layer: Full Bleed Teal Glass & Glows */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Top Center Glow */}
        <div className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-[420px] h-[420px] bg-[rgba(19,145,135,0.08)] rounded-full blur-[80px]" />

        {/* Bottom Right Glow */}
        <div className="absolute bottom-[-100px] right-[-100px] w-[360px] h-[360px] bg-[rgba(19,145,135,0.10)] rounded-full blur-[60px]" />

        {/* Glass Overlay Layer */}
        <div className="absolute inset-0 bg-gradient-to-br from-[rgba(19,145,135,0.06)] to-[rgba(19,145,135,0.10)] backdrop-blur-[10px]" />
      </div>

      {/* Content Container: Centered Column */}
      <div className="relative z-10 w-full max-w-[1200px] mx-auto flex flex-col items-center justify-center gap-[28px] px-10">

        {/* Badge */}
        <div className="mb-[20px] px-[14px] py-[6px] rounded-[20px] bg-primary/10 border border-primary/20 text-primary text-[14px] font-medium tracking-tight">
          {t("landing.nextGen")}
        </div>

        {/* Main Heading */}
        <h1 className="text-[48px] md:text-[80px] lg:text-[108px] font-medium font-display text-foreground tracking-[-0.04em] leading-[0.92] text-center max-w-[1200px] animate-in fade-in slide-in-from-bottom-8 duration-700">
          {t("landing.headline")}
        </h1>

        {/* Description Text */}
        <p className="text-[16px] leading-[1.6] text-muted-foreground text-center max-w-[600px] mt-[16px] animate-in fade-in slide-in-from-bottom-10 duration-1000">
          {t("landing.subheadline")}
        </p>

        {/* Buttons */}
        <div className="flex items-center gap-[16px] mt-[32px] animate-in fade-in slide-in-from-bottom-12 duration-1000 fill-mode-both">

          {/* Get Started — teal pill */}
          <Link
            href="/signup"
            className="h-[48px] px-[28px] rounded-[24px] bg-primary text-primary-foreground text-sm font-medium flex items-center justify-center hover:opacity-90 transition-all shadow-xl shadow-primary/10 active:scale-[0.98]"
          >
            {t("landing.getStarted")}
          </Link>

          {/* Sign In — smoky gray glass pill */}
          <Link
            href="/signin"
            className="signin-glass-button h-[48px] px-[28px] rounded-[24px] text-sm font-medium text-foreground"
          >
            {t("landing.signIn")}
          </Link>

        </div>
      </div>
    </main>
  )
}
