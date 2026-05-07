"use client"

import { RegulatorDashboard } from "@/app/dashboard/regulator-dashboard"
import { useAppStore } from "@/lib/store"
import { useHasHydrated } from "@/lib/use-has-hydrated"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function RegulatorPage() {
    const hasHydrated = useHasHydrated()
    const { role, isAuthenticated } = useAppStore()
    const router = useRouter()

    // Read selectedRole synchronously from localStorage (written by interface-selection
    // before navigation) — bypasses Zustand's async rehydration delay.
    const selectedRole = typeof window !== "undefined"
        ? (localStorage.getItem("selectedRole") ?? role)
        : role

    useEffect(() => {
        if (!hasHydrated) return
        if (!isAuthenticated) router.push("/signin")
    }, [hasHydrated, isAuthenticated, router])

    // Show spinner only if both localStorage and Zustand are inconclusive
    if (!hasHydrated && selectedRole !== "regulator" && selectedRole !== "admin") {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
            </div>
        )
    }

    if (selectedRole !== "regulator" && selectedRole !== "admin" && role !== "regulator" && role !== "admin") {
        return (
            <div className="max-w-lg mx-auto mt-20 text-center space-y-4">
                <h1 className="text-lg font-medium text-foreground">Regulator Access Required</h1>
                <p className="text-sm text-muted-foreground">Select the Regulator interface from the selection screen to access this page.</p>
                <button
                    onClick={() => router.push("/interface-selection")}
                    className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                >
                    Go to Interface Selection
                </button>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background">
            <RegulatorDashboard />
        </div>
    )
}
