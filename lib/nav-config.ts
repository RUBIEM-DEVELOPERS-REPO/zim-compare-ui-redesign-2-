import { 
  Layout, Landmark, Radio, GraduationCap, BookOpen, 
  Shield, Hotel, Sparkles, Car, Zap, Bookmark, 
  Settings, Calculator, Briefcase, LayoutGrid, LogOut,
  Smartphone, School, Coffee, MessageSquare,
  Scale, ReceiptText, BellRing, Play,
  Stethoscope, Utensils, Scale3D, FileText, AlertTriangle,
  Activity, FileCheck, BarChart3, MessageSquareWarning, RotateCcw, BadgePercent,
  Cpu
} from "lucide-react"

export const iconMap = {
  Layout, Landmark, Radio, GraduationCap, BookOpen, 
  Shield, Hotel, Sparkles, Car, Zap, Bookmark, 
  Settings, Calculator, Briefcase, LayoutGrid, LogOut,
  Smartphone, School, Coffee, MessageSquare,
  Scale, ReceiptText, BellRing, Play,
  Stethoscope, Utensils, Scale3D, FileText, AlertTriangle,
  Activity, FileCheck, BarChart3, MessageSquareWarning, RotateCcw, BadgePercent,
  Cpu
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
  { id: "food", labelKey: "nav.food", href: "/food", label: "Food & Dining", icon: "Utensils" },
  { id: "clinics", labelKey: "nav.clinics", href: "/clinics", label: "Healthcare", icon: "Stethoscope" },
] as const

export const secondaryNav: readonly NavItem[] = [
  { id: "mobility", labelKey: "nav.mobility", href: "/mobility", label: "Mobility", icon: "Car" },
  { id: "utilities", labelKey: "nav.utilities", href: "/utilities", label: "Utilities", icon: "Zap" },
  { id: "tech", labelKey: "nav.tech", href: "/tech", label: "Tech", icon: "Cpu" },
  { id: "gen-z", labelKey: "nav.genz", href: "/gen-z", label: "Gen Z", icon: "Play" },
  { id: "regulated", labelKey: "nav.regulated", href: "/regulated-prices", label: "Prices", icon: "Scale" },
  { id: "taxes", labelKey: "nav.taxes", href: "/taxes-levies", label: "Taxes", icon: "ReceiptText" },
  { id: "alerts", labelKey: "nav.alerts", href: "/smart-alerts", label: "Alerts", icon: "BellRing" },
  { id: "saved", labelKey: "nav.saved", href: "/saved", label: "Saved", icon: "Bookmark" },
] as const

export const regulatorNav: readonly NavItem[] = [
  { id: "monitoring", labelKey: "nav.monitoring", href: "/regulator/monitoring", label: "Provider Monitoring", icon: "Activity" },
  { id: "compliance", labelKey: "nav.compliance", href: "/regulator/compliance", label: "Compliance Data", icon: "FileCheck" },
  { id: "pricing_review", labelKey: "nav.pricingReview", href: "/regulator/pricing-review", label: "Pricing Review", icon: "Scale" },
  { id: "complaints", labelKey: "nav.complaints", href: "/regulator/complaints", label: "Complaints & Reports", icon: "MessageSquareWarning" },
  { id: "tracking", labelKey: "nav.tracking", href: "/regulator/tracking", label: "Service Tracking", icon: "RotateCcw" },
  { id: "taxes_monitoring", labelKey: "nav.taxesMonitoring", href: "/regulator/taxes-monitoring", label: "Tax Monitoring", icon: "ReceiptText" },
] as const

export const corporateNav: readonly NavItem[] = [
  { id: "dashboard", labelKey: "nav.dashboard", href: "/corporate", label: "Dashboard", icon: "Layout" },
  { id: "pricing", labelKey: "nav.pricing", href: "/corporate?tab=pricing", label: "Pricing", icon: "BadgePercent" },
  { id: "applications", labelKey: "nav.applications", href: "/corporate?tab=applications", label: "Applications", icon: "FileText" },
  { id: "upload", labelKey: "nav.upload", href: "/corporate?tab=upload", label: "Upload", icon: "LayoutGrid" },
  { id: "reports", labelKey: "nav.reports", href: "/corporate?tab=reports", label: "Reports", icon: "BarChart3" },
  { id: "alerts", labelKey: "nav.alerts", href: "/smart-alerts", label: "Alerts", icon: "BellRing" },
] as const

export const navItems = [...primaryNav, ...secondaryNav]
