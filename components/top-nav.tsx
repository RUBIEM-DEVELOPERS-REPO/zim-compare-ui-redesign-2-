"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAppStore } from "@/lib/store"
import { GlobalSearch } from "@/components/global-search"
import { cn } from "@/lib/utils"
import { useState, useEffect, useRef, useMemo } from "react"
import { useTheme } from "next-themes"
import { useRouter } from "next/navigation"
import { useI18n } from "@/lib/i18n"
import { ChevronLeft, ChevronRight, Globe, LogOut, Moon, Sun } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

const navItems = [
  { labelKey: "nav.dashboard", href: "/dashboard", label: "Dashboard" },
  { labelKey: "nav.banking", href: "/banking", label: "Banking" },
  { labelKey: "nav.telecom", href: "/telecom", label: "Telecom" },
  { labelKey: "nav.schools", href: "/schools", label: "Schools" },
  { labelKey: "nav.universities", href: "/universities", label: "Universities" },
  { labelKey: "nav.insurance", href: "/insurance", label: "Insurance" },
  { labelKey: "nav.mobility", href: "/mobility", label: "Mobility" },
  { labelKey: "nav.utilities", href: "/utilities", label: "Utilities" },
  { labelKey: "nav.stayscape", href: "/stayscape", label: "Stayscape" },
  { labelKey: "nav.saved", href: "/saved", label: "Saved" },
  { labelKey: "nav.summaries", href: "/summaries", label: "Summaries" },
  { labelKey: "nav.chat", href: "/chat", label: "Chat" },
  { labelKey: "nav.admin", href: "/admin", label: "Admin" },
] as const


export function TopNav() {
  const pathname = usePathname()
  const { role, language, setLanguage } = useAppStore()
  const { t } = useI18n()
  const router = useRouter()
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)
  const navScrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSignOut = () => {
    localStorage.removeItem("zim_auth_token")
    router.push("/")
  }

  const visibleItems = useMemo(() => {
    return navItems.filter((item) => {
      if (item.labelKey === "nav.chat" && role !== "paid" && role !== "admin") return false
      if (item.labelKey === "nav.summaries" && role !== "paid" && role !== "admin") return false
      if (item.labelKey === "nav.saved" && role === "guest") return false
      if (item.labelKey === "nav.admin" && role !== "admin") return false
      return true
    })
  }, [role])

  const checkScroll = () => {
    const el = navScrollRef.current
    if (!el || !mounted) return
    
    const left = el.scrollLeft > 4
    const right = el.scrollLeft < el.scrollWidth - el.clientWidth - 4
    
    setCanScrollLeft((prev) => (prev !== left ? left : prev))
    setCanScrollRight((prev) => (prev !== right ? right : prev))
  }

  useEffect(() => {
    const el = navScrollRef.current
    if (!el) return
    checkScroll()
    el.addEventListener("scroll", checkScroll)
    const ro = new ResizeObserver(checkScroll)
    ro.observe(el)
    return () => {
      el.removeEventListener("scroll", checkScroll)
      ro.disconnect()
    }
  }, [visibleItems])

  const scrollNav = (dir: "left" | "right") => {
    const el = navScrollRef.current
    if (!el) return
    el.scrollBy({ left: dir === "left" ? -160 : 160, behavior: "smooth" })
  }

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    const el = navScrollRef.current
    if (!el) return
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      e.preventDefault()
      el.scrollBy({ left: e.deltaY, behavior: "smooth" })
    }
  }

  return (
    <header className="glass-navbar">
      <div className="mx-auto max-w-7xl px-4">
        {/* Top Row: Brand & Controls Grouped Left */}
        <div className="flex h-14 items-center gap-4 relative">
          <div className="flex-1" />
          <div className="flex items-center gap-2.5 shrink-0">
            {/* Brand Cluster */}
            <Link href={pathname === "/" ? "/" : "/dashboard"} className="flex items-center gap-2 mr-1">
              <div className={cn(
                "h-8 w-8 rounded-lg flex items-center justify-center transition-all duration-500",
                "bg-primary glass-premium border-white/20"
              )}>
                <span className="text-xs font-black text-white">FT</span>
              </div>
              <span className="font-semibold text-foreground hidden sm:block">
                Fintech
              </span>
            </Link>

            {/* Controls Cluster: Language, Theme, Auth */}
            {mounted && (
              <div className="flex items-center gap-2">
                {/* Language Options */}
                <div className="hidden md:flex items-center gap-1">
                  {(["en", "sn", "nd"] as const).map((lang) => (
                    <button
                      key={lang}
                      onClick={() => setLanguage(lang)}
                      className={cn(
                        "text-[10px] font-bold w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-300 backdrop-blur-md border",
                        language === lang 
                          ? "bg-primary text-white border-white/20 shadow-[0_0_10px_rgba(20,184,166,0.5)]" 
                          : "bg-white/5 text-muted-foreground border-white/5 hover:bg-white/10 hover:border-white/10"
                      )}
                    >
                      {lang.toUpperCase()}
                    </button>
                  ))}
                </div>

                <div className="md:hidden">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Globe className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                      <DropdownMenuItem onClick={() => setLanguage("en")}>English (EN)</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setLanguage("sn")}>Shona (SN)</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setLanguage("nd")}>Ndebele (ND)</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Dark Mode Toggle */}
                <div className="flex items-center gap-1.5">
                  <Switch
                    checked={resolvedTheme === "dark"}
                    onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
                    className="scale-75 data-[state=checked]:bg-teal-500 data-[state=unchecked]:bg-slate-300 dark:data-[state=unchecked]:bg-slate-800"
                    aria-label="Toggle dark mode"
                  />
                  <span className="text-[10px] font-medium hidden lg:inline-block text-muted-foreground uppercase tracking-tight">{t("common.darkMode")}</span>
                </div>

                {/* Sign Out */}
                <button
                  onClick={handleSignOut}
                  className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground px-2 py-1 rounded hover:bg-secondary transition-colors shrink-0"
                >
                  {t("nav.signOut")}
                </button>
              </div>
            )}
          </div>


          {/* Search Bar - Pushed to right */}
          {pathname !== "/" && pathname !== "/signin" && (
            <div className="hidden sm:block shrink-0">
              <GlobalSearch />
            </div>
          )}

          {/* Mobile Menu Trigger */}
          {pathname !== "/" && pathname !== "/signin" && (
            <button
              className="lg:hidden p-2 text-muted-foreground hover:text-foreground"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          )}
        </div>

        {/* Secondary Row: Navigation Tabs (Desktop) */}
        {pathname !== "/" && pathname !== "/signin" && (
          <div className="hidden lg:flex items-center border-t border-border/40 py-2 min-w-0 relative">
            <div className="flex items-center flex-1 min-w-0 relative">
              <div
                className={cn(
                  "absolute left-0 top-0 bottom-0 w-8 z-10 pointer-events-none transition-opacity duration-200",
                  "bg-gradient-to-r from-background/95 to-transparent",
                  canScrollLeft ? "opacity-100" : "opacity-0"
                )}
              />
              {canScrollLeft && (
                <button
                  onClick={() => scrollNav("left")}
                  className="absolute left-0 z-20 h-7 w-7 flex items-center justify-center rounded-full bg-background border border-border shadow-sm hover:bg-secondary transition-colors shrink-0"
                  aria-label="Scroll nav left"
                >
                  <ChevronLeft className="h-3.5 w-3.5 text-muted-foreground" />
                </button>
              )}

              <div
                ref={navScrollRef}
                onWheel={handleWheel}
                className="flex items-center gap-1 overflow-x-auto scroll-smooth px-1 scrollbar-none"
              >
                {visibleItems.map((item) => {
                  const isPremium = ["nav.mobility", "nav.utilities", "nav.stayscape"].includes(item.labelKey)
                  const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "shrink-0 whitespace-nowrap",
                        isPremium ? "premium-glass-tab" : "glass-tab-base",
                        isActive && (isPremium ? "premium-glass-tab-active" : "glass-tab-active")
                      )}
                    >
                      {t(item.labelKey)}
                    </Link>
                  )
                })}
              </div>

              <div
                className={cn(
                  "absolute right-0 top-0 bottom-0 w-8 z-10 pointer-events-none transition-opacity duration-200",
                  "bg-gradient-to-l from-background/95 to-transparent",
                  canScrollRight ? "opacity-100" : "opacity-0"
                )}
              />
              {canScrollRight && (
                <button
                  onClick={() => scrollNav("right")}
                  className="absolute right-0 z-20 h-7 w-7 flex items-center justify-center rounded-full bg-background border border-border shadow-sm hover:bg-secondary transition-colors shrink-0"
                  aria-label="Scroll nav right"
                >
                  <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Mobile Nav Drawer */}
        {pathname !== "/" && pathname !== "/signin" && (
          <div className={cn(
            "lg:hidden overflow-hidden transition-all duration-300 ease-in-out",
            mobileOpen ? "max-h-60 opacity-100 pb-3" : "max-h-0 opacity-0"
          )}>
            <div className="flex flex-col gap-1 py-1">
              {/* Search on Mobile should be prominent if navigation is open or even if not */}
              <div className="px-1 mb-2">
                <GlobalSearch />
              </div>
              <nav className="flex gap-1 overflow-x-auto pb-1 scrollbar-none">
                {visibleItems.map((item) => {
                  const isPremium = ["nav.mobility", "nav.utilities", "nav.stayscape"].includes(item.labelKey)
                  const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "shrink-0 whitespace-nowrap",
                        isPremium ? "premium-glass-tab" : "glass-tab-base",
                        isActive && (isPremium ? "premium-glass-tab-active" : "glass-tab-active")
                      )}
                    >
                      {t(item.labelKey)}
                    </Link>
                  )
                })}
              </nav>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
