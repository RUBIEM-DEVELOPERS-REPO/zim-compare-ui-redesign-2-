import { 
  Layout, Landmark, Radio, GraduationCap, BookOpen, 
  Shield, Hotel, Sparkles, Car, Zap, Bookmark, 
  Settings, Calculator, Briefcase, LayoutGrid, LogOut,
  Smartphone, School, Coffee, MessageSquare,
  Scale, ReceiptText, BellRing, Play
} from "lucide-react"

export const iconMap = {
  Layout, Landmark, Radio, GraduationCap, BookOpen, 
  Shield, Hotel, Sparkles, Car, Zap, Bookmark, 
  Settings, Calculator, Briefcase, LayoutGrid, LogOut,
  Smartphone, School, Coffee, MessageSquare,
  Scale, ReceiptText, BellRing, Play
}

export interface NavItem {
  id: string
  labelKey: string
  href: string
  label: string
  icon: string
  children?: NavItem[]
}

export const primaryNav: readonly NavItem[] = [
  { id: "dashboard", labelKey: "nav.dashboard", href: "/dashboard", label: "Dashboard", icon: "Layout" },
  { id: "banking", labelKey: "nav.banking", href: "/banking", label: "Banking", icon: "Landmark" },
  { id: "telecom", labelKey: "nav.telecom", href: "/telecom", label: "Telecom", icon: "Radio" },
  { id: "schools", labelKey: "nav.schools", href: "/schools", label: "Schools", icon: "GraduationCap" },
  { id: "universities", labelKey: "nav.universities", href: "/universities", label: "Universities", icon: "BookOpen" },
  { 
    id: "insurance", 
    labelKey: "nav.insurance", 
    href: "/insurance", 
    label: "Insurance", 
    icon: "Shield"
  },
  { id: "hospitality", labelKey: "nav.stayscape", href: "/stayscape", label: "Hospitality", icon: "Hotel" },
] as const

export const secondaryNav: readonly NavItem[] = [
  { id: "mobility", labelKey: "nav.mobility", href: "/mobility", label: "Mobility", icon: "Car" },
  { id: "utilities", labelKey: "nav.utilities", href: "/utilities", label: "Utilities", icon: "Zap" },
  { id: "gen-z", labelKey: "nav.genz", href: "/gen-z", label: "Gen Z", icon: "Play" },
  { id: "regulated", labelKey: "nav.regulated", href: "/regulated-prices", label: "Prices", icon: "Scale" },
  { id: "taxes", labelKey: "nav.taxes", href: "/taxes-levies", label: "Taxes", icon: "ReceiptText" },
  { id: "alerts", labelKey: "nav.alerts", href: "/smart-alerts", label: "Alerts", icon: "BellRing" },
  { id: "applications", labelKey: "nav.applications", href: "/applications", label: "Apps", icon: "LayoutGrid" },
  { id: "saved", labelKey: "nav.saved", href: "/saved", label: "Saved", icon: "Bookmark" },
] as const

export const navItems = [...primaryNav, ...secondaryNav]
