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

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  
  // Derive active section from URL
  const [activeSection, setActiveSection] = useState<string>("dashboard")

  useEffect(() => {
    const path = pathname.split("/")[1] || "dashboard"
    // Normalize path to section ID
    const sectionId = path === "stayscape" ? "hospitality" : path
    setActiveSection(sectionId)
  }, [pathname])

  const handleSectionChange = (sectionId: string) => {
    const urlPath = sectionId === "hospitality" ? "stayscape" : sectionId
    // Soft navigation to keep sidebar fixed and update only the content area
    router.push(`/${urlPath}`, { scroll: false })
  }

  const sources = getSourcesForPath(pathname)

  return (
    <AuthGuard>
      <div className="workspace-shell bg-background">
        <Sidebar 
          activeSection={activeSection} 
          onSectionChange={handleSectionChange} 
        />
        
        <main className="workspace-content">
          <div className="workspace-content-inner">
             {children}
             <SourcesSection sources={sources} />
          </div>
        </main>

        <CompareBar />
        {activeSection !== "chat" && <ChatWidget />}
        <ScrollNav />
      </div>
    </AuthGuard>
  )
}
