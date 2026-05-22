"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useI18n } from "@/lib/i18n"
import { useTheme } from "next-themes"

export default function LandingPage() {
  const { t } = useI18n()
  const { resolvedTheme } = useTheme()
  const [videoSrc, setVideoSrc] = useState<string>("")

  useEffect(() => {
    if (resolvedTheme === "dark") {
      setVideoSrc("/particle-background-dark.mov?v=2")
    } else {
      setVideoSrc("/particle-background-light.mov?v=2")
    }
  }, [resolvedTheme])

  return (
    <main className="h-screen w-full overflow-hidden bg-background relative flex flex-col items-center justify-center pt-[80px] pb-[80px]">
      {/* Background Video Layer */}
      {videoSrc && (
        <video
          key={videoSrc}
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover object-center z-0"
        >
          <source src={videoSrc} type="video/quicktime" />
          <source src={videoSrc} type="video/mp4" />
        </video>
      )}

      {/* Semi-transparent Overlay (above video, below content) */}
      <div 
        className="absolute inset-0 z-10 pointer-events-none backdrop-blur-[16px] bg-gradient-to-b from-[rgba(234,248,246,0.15)] to-[rgba(234,248,246,0.40)] dark:backdrop-blur-[24px] dark:from-[rgba(3,19,22,0.20)] dark:to-[rgba(3,19,22,0.65)]" 
      />

      {/* Content Container: Centered Column */}
      <div className="relative z-20 w-full max-w-[1200px] mx-auto flex flex-col items-center justify-center gap-[28px] px-10">

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
