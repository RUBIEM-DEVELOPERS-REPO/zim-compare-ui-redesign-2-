"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAppStore } from "@/lib/store"
import { cn } from "@/lib/utils"
import React, { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import { useRouter } from "next/navigation"
import { useI18n } from "@/lib/i18n"
import { Globe, Sun, Moon } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

export function TopNav() {
  const pathname = usePathname()
  const { language, setLanguage } = useAppStore()
  const { t } = useI18n()
  const router = useRouter()
  const { setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  const isAuthPage = ["/signin", "/signup", "/auth", "/forgot-password"].includes(pathname)
  const isLandingPage = pathname === "/"

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSignOut = () => {
    localStorage.removeItem("zim_auth_token")
    router.push("/")
  }

  // If in dashboard area, TopNav is not rendered (handled by ClientShell logic)
  // This is just a fallback safety
  const authRoutes = ["/signin", "/signup", "/auth", "/forgot-password"]
  const hideOnChat = pathname === "/chat" || pathname === "/interface-selection"

  return (
    <header className={cn(
      "fixed top-0 left-0 w-full z-50 h-[64px] px-[40px] flex items-center justify-between transition-all duration-500",
      isLandingPage ? "bg-transparent" : "bg-background/80 backdrop-blur-xl border-b border-border/50"
    )}>
      <div className="w-full max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Cluster */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="h-9 w-9 rounded-xl bg-primary flex items-center justify-center shadow-[0_0_15px_rgba(19,145,135,0.3)] group-hover:shadow-[0_0_25px_rgba(19,145,135,0.4)] transition-all">
            <span className="text-[10px] font-medium text-white px-1">FT</span>
          </div>
          <span className="text-xl font-display font-medium text-primary tracking-tighter hidden sm:block">
            Fintech
          </span>
        </Link>

        {/* Controls Cluster: Language, Theme, Auth */}
        {mounted && (
          <div className="flex items-center gap-4">
            {!isAuthPage && (
              <div className="hidden md:flex items-center gap-1 bg-secondary/50 p-1 rounded-xl border border-border/50">
                {(["en", "sn", "nd"] as const).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setLanguage(lang)}
                    className={cn(
                      "text-[10px] font-medium w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-300",
                      language === lang
                        ? "bg-primary text-white shadow-lg"
                        : "text-muted-foreground hover:bg-secondary"
                    )}
                  >
                    {lang.toUpperCase()}
                  </button>
                ))}
              </div>
            )}

            <button
              onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
              className="p-2.5 rounded-xl bg-secondary/80 border border-border/50 text-muted-foreground hover:text-primary hover:bg-secondary transition-all duration-300 shadow-sm"
              title={resolvedTheme === "dark" ? t("settings.lightMode") : t("settings.darkMode")}
            >
              {mounted && (resolvedTheme === "dark" ? <Sun size={18} /> : <Moon size={18} />)}
            </button>

          </div>
        )}
      </div>
    </header>
  )
}
