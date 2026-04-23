"use client"

import { useAppStore } from "@/lib/store"
import { useI18n } from "@/lib/i18n"
import { ConsumerDashboard } from "./consumer-dashboard"
import { CorporateDashboard } from "./corporate-dashboard"
import { AdminDashboard } from "./admin-dashboard"

export default function DashboardPage() {
    const { role } = useAppStore()

    if (role === "admin") {
      return <AdminDashboard />
    }

    if (role === "corporate") {
      return <CorporateDashboard />
    }

    // Default to consumer view for registered, paid, guest, and ai roles
    return <ConsumerDashboard />
}

/**
 * Note: Components like ConsumerDashboard, CorporateDashboard, and AdminDashboard 
 * will be implemented in separate files or below. For better organization, 
 * I'll place them in the components/dashboard/ directoy if they get too large.
 */
