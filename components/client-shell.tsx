"use client"

import React from "react"
import { cn } from "@/lib/utils"
import { usePathname } from "next/navigation"
import { TopNav } from "@/components/top-nav"
import { CompareBar } from "@/components/compare-bar"
import { ChatWidget } from "@/components/chat-widget"
import { AuthGuard } from "@/components/auth-guard"
import { PageTransition } from "@/components/page-transition"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { ThemeToggle } from "@/components/theme-toggle"
import { ScrollNav } from "@/components/scroll-nav"
import { SourcesSection } from "@/components/sources-section"
import { getSourcesForPath } from "@/lib/sources-config"

const dashboardRoutes = [
  "/dashboard", "/banking", "/telecom", "/schools", 
  "/universities", "/insurance", "/stayscape", 
  "/chat", "/mobility", "/utilities", "/gen-z", "/saved",
  "/admin", "/regulated", "/taxes", "/alerts", 
  "/applications", "/summaries", "/social-insights"
]

export function ClientShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  
  // Check if current path belongs to the dashboard app
  const isDashboardArea = dashboardRoutes.some(route => 
    pathname === route || pathname.startsWith(route + "/")
  )

  // Auth/Landing pages should use the classic layout
  const isLandingOrAuth = pathname === "/" || ["/signin", "/signup", "/auth", "/forgot-password", "/interface-selection"].includes(pathname)

  // Pure auth pages need full-viewport, no-scroll, no TopNav
  const isFullscreenAuth = ["/signin", "/signup", "/forgot-password"].includes(pathname)

  if (isFullscreenAuth) {
    return (
      <div className="h-screen overflow-hidden flex flex-col">
        {children}
      </div>
    )
  }

  if (isDashboardArea && !isLandingOrAuth) {
    return <DashboardShell>{children}</DashboardShell>
  }

  const sources = getSourcesForPath(pathname)

  return (
    <>
      <TopNav />
      <main className={cn(
        "flex-grow overflow-y-auto h-full",
        pathname === "/" ? "w-full m-0 p-0" : "mx-auto max-w-7xl px-4 py-2"
      )}>
        <AuthGuard>
          <PageTransition>
            <div className="flex flex-col min-h-full">
              <div className="flex-grow">
                {children}
              </div>
              {/* Show sources on all non-dashboard pages */}
              <div className={cn(pathname === "/" ? "px-6 md:px-12 lg:px-20 max-w-7xl mx-auto w-full" : "w-full")}>
                <SourcesSection sources={sources} />
              </div>
            </div>
          </PageTransition>
        </AuthGuard>
      </main>
      <CompareBar />
      <ChatWidget />
      <ScrollNav />
    </>
  )
}
