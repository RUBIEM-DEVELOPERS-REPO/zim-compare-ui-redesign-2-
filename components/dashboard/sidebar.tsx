"use client"

import React from "react"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { iconMap, primaryNav, secondaryNav, regulatorNav, corporateNav } from "@/lib/nav-config"
import { useI18n } from "@/lib/i18n"
import { useAppStore } from "@/lib/store"
import {
  LogOut, User, Settings, Sparkles, Sun, Moon,
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
  const { role, userName, setLanguage } = useAppStore()
  const { setTheme, resolvedTheme } = useTheme()
  const pathname = usePathname()
  const [mounted, setMounted] = React.useState(false)
  const [expandedItems, setExpandedItems] = React.useState<Record<string, boolean>>({})
  const [sidebarUserName, setSidebarUserName] = React.useState("")

  React.useEffect(() => {
    setMounted(true)
    // Always read the freshest username from localStorage
    const stored = localStorage.getItem("username")
    setSidebarUserName(stored?.trim() || userName?.trim() || "")
  }, [])

  const handleSignOut = () => {
    localStorage.removeItem("zim_auth_token")
    localStorage.removeItem("username")
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
          title={t(item.labelKey)}
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
            {Icon && (
              <Icon
                size={isChild ? 14 : 18}
                className={cn(
                  "transition-colors",
                  isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                )}
              />
            )}
            <span className={cn("font-medium", isChild ? "font-sans" : "font-playfair")}>
              {t(item.labelKey)}
            </span>
          </div>

          {hasChildren && !isChild && (
            <div
              onClick={(e) => {
                e.stopPropagation()
                setExpandedItems(prev => ({ ...prev, [item.id]: !prev[item.id] }))
              }}
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

  // ─── Compute nav items based on role ────────────────────────────────────────
  const isRegulator = role === "regulator" || pathname.startsWith("/regulator")
  const isCorporate = (pathname === "/dashboard" || pathname === "/corporate") && role === "corporate"
  const isAdmin = (pathname === "/dashboard" || pathname === "/admin") && role === "admin"

  const adminItemsToHide = [
    "banking", "telecom", "schools", "universities",
    "insurance", "hospitality", "mobility", "utilities", "regulated", "taxes", "alerts", "saved"
  ]

  const corporateItemsToHide = [
    "banking", "telecom", "schools", "universities", "insurance", 
    "hospitality", "food", "clinics", "mobility", "utilities", "gen-z"
  ]

  const navItems = React.useMemo(() => {
    if (isRegulator) {
      return { primary: regulatorNav as unknown as NavItem[], secondary: [] }
    }
    
    // Check if we are specifically on the corporate page to filter out consumer categories
    const isCorporatePage = pathname === "/corporate"

    if (isCorporate && isCorporatePage) {
      return { 
        primary: (corporateNav as unknown as NavItem[]).filter(item => !corporateItemsToHide.includes(item.id)), 
        secondary: [] 
      }
    }
    
    // For standard dashboard or other roles, filter based on admin/corporate status
    const filteredPrimary = (primaryNav as unknown as NavItem[]).filter(item => {
      if (isAdmin && adminItemsToHide.includes(item.id)) return false
      if (isCorporatePage && corporateItemsToHide.includes(item.id)) return false
      return true
    })
    const filteredSecondary = (secondaryNav as unknown as NavItem[]).filter(item => {
      if (isAdmin && adminItemsToHide.includes(item.id)) return false
      if (isCorporatePage && corporateItemsToHide.includes(item.id)) return false
      return true
    })
    
    // If it's a corporate user on dashboard (not /corporate), they still get corporateNav
    if (isCorporate && !isCorporatePage) {
        return { primary: corporateNav as unknown as NavItem[], secondary: [] }
    }

    return { primary: filteredPrimary, secondary: filteredSecondary }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role, pathname])

  return (
    <aside className="workspace-sidebar flex flex-col p-4 gap-4">

      {/* ── Brand ── */}
      <div className="flex items-center justify-between px-2 mb-2">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-white font-medium text-lg shadow-md">
            ZC
          </div>
          <span className="font-medium text-lg tracking-tight text-foreground">
            {isRegulator ? "Regulator" : "Fintech"}
          </span>
        </div>

        <button
          onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
          className="p-2 rounded-lg hover:bg-primary/10 text-muted-foreground transition-all duration-300"
          title={mounted ? (resolvedTheme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode") : "Toggle Theme"}
          suppressHydrationWarning
        >
          {mounted && (resolvedTheme === "dark" ? <Sun size={18} /> : <Moon size={18} />)}
        </button>
      </div>

      {/* ── Chat button (hidden for regulators) ── */}
      {!isRegulator && (
        <button
          title={t("nav.chat")}
          onClick={() => onSectionChange("chat")}
          className={cn(
            "workspace-nav-item w-full mb-2 group floating-hover",
            activeSection === "chat" && "workspace-nav-item-active"
          )}
        >
          <Sparkles
            size={18}
            className={cn(
              "transition-colors flex-shrink-0",
              activeSection === "chat" ? "text-primary" : "text-primary/70 group-hover:text-primary"
            )}
          />
          <span className="font-playfair font-medium">{t("nav.chat")}</span>
        </button>
      )}

      {/* ── Navigation list ── */}
      <div className="flex-1 overflow-y-auto scrollbar-premium flex flex-col gap-1 pr-1">
        {navItems.primary.map(item =>
          renderNavItem(item, !isRegulator && item.id !== "dashboard")
        )}
        {navItems.secondary.map(item => renderNavItem(item, true))}
      </div>

      {/* ── Profile & bottom utils ── */}
      <div className="pt-4 border-t border-border/50 flex flex-col gap-1">
        <div className="flex items-center gap-3 px-3 py-3 mb-4 rounded-[1.5rem] bg-secondary/50 border border-border/50 backdrop-blur-xl shadow-lg">
          <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center border border-primary/20">
            <User size={18} className="text-primary" />
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="text-sm font-medium text-foreground truncate leading-none mb-1">
              {sidebarUserName || t("common.userProfile")}
            </span>
            <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium truncate">
              {role} {t("common.plan")}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between px-2 mb-2 gap-1.5">
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-secondary/30 border border-border/10">
            {(["en", "sn", "nd"] as const).map((lang) => (
              <button
                key={lang}
                title={lang.toUpperCase()}
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
            {!isRegulator && (
              <button
                className="p-2 rounded-lg hover:bg-primary/10 text-muted-foreground transition-colors"
                title={t("nav.admin")}
                onClick={() => onSectionChange("admin")}
              >
                <Settings size={18} />
              </button>
            )}
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
