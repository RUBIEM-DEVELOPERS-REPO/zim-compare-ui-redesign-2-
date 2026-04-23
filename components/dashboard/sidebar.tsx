"use client"

import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { iconMap, primaryNav, secondaryNav } from "@/lib/nav-config"
import { useI18n } from "@/lib/i18n"
import { useAppStore } from "@/lib/store"
import { 
  Plus, LayoutGrid, LogOut, Search, Bell, User, 
  Settings, Sparkles, Globe, Sun, Moon,
  ChevronDown, ChevronRight
} from "lucide-react"
import { useTheme } from "next-themes"
import { NavItem } from "@/lib/nav-config"

interface SidebarProps {
  activeSection: string
  onSectionChange: (section: string) => void
}

export function Sidebar({ activeSection, onSectionChange }: SidebarProps) {
  const { t, language } = useI18n()
  const { role, userName, savedComparisons, setLanguage } = useAppStore()
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)
  const [expandedItems, setExpandedItems] = React.useState<Record<string, boolean>>({
    insurance: true // Keep insurance expanded by default for the new feature
  })

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const toggleExpand = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setExpandedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }))
  }

  const handleSignOut = () => {
    localStorage.removeItem("zim_auth_token")
    window.location.href = "/"
  }

  const renderNavItem = (item: NavItem, isChild = false) => {
    const isActive = activeSection === item.id
    const hasChildren = item.children && item.children.length > 0
    const isExpanded = expandedItems[item.id]
    const Icon = (iconMap as any)[item.icon]

    return (
      <div key={item.id} className="flex flex-col gap-1">
        <button
          onClick={() => {
            if (hasChildren && !isChild) {
              setExpandedItems(prev => ({ ...prev, [item.id]: !prev[item.id] }))
            }
            onSectionChange(item.id)
          }}
          className={cn(
            "workspace-nav-item group floating-hover w-full flex items-center justify-between",
            isActive && "workspace-nav-item-active",
            isChild && "pl-9 text-sm opacity-80"
          )}
        >
          <div className="flex items-center gap-3">
            {Icon && <Icon size={isChild ? 14 : 18} className={cn("transition-colors", isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />}
            <span className={cn("font-medium", isChild ? "font-sans" : "font-playfair")}>{t(item.labelKey)}</span>
          </div>
          
          {hasChildren && !isChild && (
            <div 
              onClick={(e) => toggleExpand(item.id, e)}
              className="p-1 rounded-md hover:bg-primary/10 text-muted-foreground transition-colors"
            >
              {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </div>
          )}
        </button>

        {hasChildren && isExpanded && (
          <div className="flex flex-col gap-1 mt-1">
            {item.children?.map(child => renderNavItem(child, true))}
          </div>
        )}
      </div>
    )
  }

  return (
    <aside className="workspace-sidebar flex flex-col p-4 gap-4">
      {/* Brand Section */}
      <div className="flex items-center justify-between px-2 mb-2">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-white font-medium text-lg shadow-md">
            ZC
          </div>
          <span className="font-medium text-lg tracking-tight text-foreground">Fintech</span>
        </div>
        
        <button 
          onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
          className="p-2 rounded-lg hover:bg-primary/10 text-muted-foreground transition-all duration-300"
          title={resolvedTheme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {mounted && (resolvedTheme === "dark" ? <Sun size={18} /> : <Moon size={18} />)}
        </button>
      </div>

      {/* Chat Action Button */}
      <button 
        onClick={() => onSectionChange("chat")}
        className={cn(
          "workspace-nav-item w-full mb-2 group floating-hover",
          activeSection === "chat" && "workspace-nav-item-active"
        )}
      >
        <Sparkles size={18} className={cn("transition-colors", activeSection === "chat" ? "text-primary flex-shrink-0" : "text-primary/70 group-hover:text-primary flex-shrink-0")} />
        <span className="font-playfair font-medium">{t("nav.chat")}</span>
      </button>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto scrollbar-premium flex flex-col gap-1 pr-1">
        {(() => {
          const pathname = usePathname()
          const isCorporateDashboard = pathname === "/dashboard" && role === "corporate"
          const isAdminPage = (pathname === "/dashboard" || pathname === "/admin") && role === "admin"
          
          const corpItemsToHide = ["banking", "telecom", "schools", "universities", "insurance", "hospitality", "mobility"]
          const adminItemsToHide = [...corpItemsToHide, "utilities", "regulated", "taxes", "alerts", "applications", "saved"]
          
          const filteredPrimary = primaryNav.filter(item => {
            if (isCorporateDashboard && corpItemsToHide.includes(item.id)) return false
            if (isAdminPage && adminItemsToHide.includes(item.id)) return false
            return true
          })

          const filteredSecondary = secondaryNav.filter(item => {
            if (isCorporateDashboard && corpItemsToHide.includes(item.id)) return false
            if (isAdminPage && adminItemsToHide.includes(item.id)) return false
            return true
          })

          return (
            <>
              {filteredPrimary.map(item => renderNavItem(item, item.id !== "dashboard"))}
              {filteredSecondary.map(item => renderNavItem(item, true))}
            </>
          )
        })()}

        {/* Conditional Social Insights Tab - Appears after 2+ comparisons */}
        {savedComparisons.length >= 2 && (
          <button
            onClick={() => onSectionChange("social-insights")}
            className={cn(
              "workspace-nav-item group floating-hover mt-4 border-t border-white/5 pt-4",
              activeSection === "social-insights" && "workspace-nav-item-active"
            )}
          >
            <Sparkles size={18} className={cn("transition-colors", activeSection === "social-insights" ? "text-primary" : "text-primary/70 group-hover:text-primary")} />
            <span className="font-playfair font-medium">{t("nav.summaries")}</span>
            <div className="ml-auto flex h-4 w-4 items-center justify-center rounded-full bg-primary/20 text-[8px] font-bold text-primary animate-pulse">
              AI
            </div>
          </button>
        )}
      </div>

      {/* Bottom Profile & Utils */}
      <div className="pt-4 border-t border-border/50 flex flex-col gap-1">
        <div className="flex items-center gap-3 px-3 py-3 mb-4 rounded-[1.5rem] bg-secondary/50 border border-border/50 backdrop-blur-xl shadow-lg">
           <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center border border-primary/20">
              <User size={18} className="text-primary" />
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-medium text-foreground truncate leading-none mb-1">{userName || t("common.userProfile")}</span>
              <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium truncate">{role} {t("common.plan")}</span>
            </div>
        </div>

        <div className="flex items-center justify-between px-2 mb-2 gap-1.5">
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-secondary/30 border border-border/10">
              {(["en", "sn", "nd"] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={cn(
                    "text-[9px] font-bold w-6 h-6 rounded-lg flex items-center justify-center transition-all duration-300",
                    language === lang
                      ? "bg-primary text-white shadow-sm"
                      : "text-muted-foreground hover:bg-secondary/80"
                  )}
                >
                  {lang.toUpperCase()}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1.5 ml-auto">
              <button 
                className="p-2 rounded-lg hover:bg-primary/10 text-muted-foreground transition-colors"
                title={t("nav.admin")}
                onClick={() => onSectionChange("admin")}
              >
                <Settings size={18} />
              </button>
              <button 
                onClick={handleSignOut}
                className="p-2 rounded-lg hover:bg-destructive/10 text-destructive transition-colors"
                title={t("nav.signOut")}
              >
                <LogOut size={18} />
              </button>
            </div>
        </div>
      </div>
    </aside>
  )
}

