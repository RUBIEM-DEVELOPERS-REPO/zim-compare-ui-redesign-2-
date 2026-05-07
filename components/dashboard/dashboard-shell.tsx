"use client"

import React, { useState, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { Sidebar } from "./sidebar"
import { AuthGuard } from "@/components/auth-guard"
import { CompareBar } from "@/components/compare-bar"
import { ChatWidget } from "@/components/chat-widget"
import { ScrollNav } from "@/components/scroll-nav"
import { SourcesSection } from "@/components/sources-section"
import { getSourcesForPath } from "@/lib/sources-config"
import { useAppStore } from "@/lib/store"
import { cn } from "@/lib/utils"

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { role } = useAppStore()
  
  // Derive active section from URL
  const [activeSection, setActiveSection] = useState<string>("dashboard")

  useEffect(() => {
    const segments = pathname.split("/").filter(Boolean)
    const firstSegment = segments[0] || "dashboard"
    const secondSegment = segments[1]
    
    // For /regulator root, set a special overview section
    if (pathname === "/regulator") {
      setActiveSection("regulator-overview")
      return
    }

    // For regulator sub-paths, use the second segment as the section ID
    let sectionId = firstSegment === "regulator" && secondSegment ? secondSegment : firstSegment

    // Normalize path segment to section ID (handles dashes vs underscores)
    sectionId = sectionId === "stayscape" ? "hospitality"
      : sectionId === "taxes-levies" ? "taxes"
      : sectionId === "smart-alerts" ? "alerts"
      : sectionId === "pricing-review" ? "pricing_review"
      : sectionId === "taxes-monitoring" ? "taxes_monitoring"
      : sectionId === "corporate" ? "dashboard"
      : sectionId
      
    setActiveSection(sectionId)
  }, [pathname])

  const handleSectionChange = (sectionId: string) => {
    
    // Regulator-specific section IDs and their URL slugs
    const regulatorSectionMap: Record<string, string> = {
      "monitoring": "regulator/monitoring",
      "compliance": "regulator/compliance",
      "pricing_review": "regulator/pricing-review",
      "analytics": "regulator/analytics",
      "complaints": "regulator/complaints",
      "tracking": "regulator/tracking",
      "taxes_monitoring": "regulator/taxes-monitoring",
      "regulator-overview": "regulator",
    }

    if (isRegulatorPath && regulatorSectionMap[sectionId]) {
      router.push(`/${regulatorSectionMap[sectionId]}`, { scroll: false })
      return
    }

    let urlPath = sectionId === "hospitality" ? "stayscape"
      : sectionId === "taxes" ? "taxes-levies"
      : sectionId === "alerts" ? "smart-alerts"
      : sectionId

    router.push(`/${urlPath}`, { scroll: false })
  }

  const sources = getSourcesForPath(pathname)

  const isRegulatorPath = role === "regulator" || pathname.startsWith("/regulator")

  return (
    <AuthGuard>
      <div className="workspace-shell bg-background">
        {pathname !== "/admin" && (
          <Sidebar 
            activeSection={activeSection} 
            onSectionChange={handleSectionChange} 
          />
        )}
        
        <main className={cn("workspace-content", activeSection === "chat" && "bg-background")}>
          <div className={cn("workspace-content-inner", activeSection === "chat" && "overflow-hidden h-full")}>
             {activeSection === "chat" ? (
               children
             ) : (
               <div className={cn("workspace-container", pathname === "/admin" && "max-w-none ml-0")}>
                 {children}
                 <SourcesSection sources={sources} />
               </div>
             )}
          </div>
        </main>

        {!isRegulatorPath && <CompareBar />}
        {activeSection !== "chat" && <ChatWidget />}
        <ScrollNav />
      </div>
    </AuthGuard>
  )
}
