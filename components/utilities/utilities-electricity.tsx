"use client"

import { useState } from "react"
import { electricityProviders, usageTiers } from "@/lib/mock/utilities"
import { useAppStore } from "@/lib/store"
import { cn } from "@/lib/utils"
import { Disclaimer } from "@/components/disclaimer"
import { Zap } from "lucide-react"
import { useI18n } from "@/lib/i18n"

type PlanFilter = "All" | "Prepaid" | "Postpaid"
type CustomerFilter = "All" | "Residential" | "Commercial"

interface UtilitiesElectricityProps {
    location?: string
}

export function UtilitiesElectricity({ location = "All Locations" }: UtilitiesElectricityProps) {
    const { addToCompareTray, compareTray } = useAppStore()
    const { t } = useI18n()
    const [planFilter, setPlanFilter] = useState<PlanFilter>("All")
    const [customerFilter, setCustomerFilter] = useState<CustomerFilter>("Residential")

    const filtered = electricityProviders.filter((p) => {
        if (planFilter !== "All" && p.planType !== planFilter) return false
        if (customerFilter !== "All" && p.customerType !== customerFilter) return false
        if (location !== "All Locations" && !p.availableCities.includes(location)) return false
        return true
    })


    const reliabilityColor = (score: number) => {
        if (score >= 80) return "text-green-600 dark:text-green-400"
        if (score >= 60) return "text-yellow-600 dark:text-yellow-400"
        return "text-red-500 dark:text-red-400"
    }

    return (
        <div className="space-y-6">
            {/* Filters */}
            <div className="flex flex-wrap gap-3">
                <div className="flex gap-1">
                    {(["All", "Prepaid", "Postpaid"] as PlanFilter[]).map((f) => (
                        <button
                            key={f}
                            onClick={() => setPlanFilter(f)}
                            className={cn(
                                "shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
                                planFilter === f
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-secondary/50 text-muted-foreground hover:text-foreground hover:bg-secondary"
                            )}
                        >
                            {f}
                        </button>
                    ))}
                </div>
                <div className="flex gap-1">
                    {(["All", "Residential", "Commercial"] as CustomerFilter[]).map((f) => (
                        <button
                            key={f}
                            onClick={() => setCustomerFilter(f)}
                            className={cn(
                                "shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
                                customerFilter === f
                                    ? "bg-yellow-500 text-white"
                                    : "bg-secondary/50 text-muted-foreground hover:text-foreground hover:bg-secondary"
                            )}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>


            {/* Provider cards */}
            {filtered.length === 0 ? (
                <div className="rounded-2xl border-2 border-dashed border-border p-12 text-center">
                    <Zap className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                    <h3 className="text-lg font-bold text-foreground mb-2">No providers found</h3>
                    <p className="text-muted-foreground">Try adjusting your filters or location.</p>
                </div>
            ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {filtered.map((p) => {
                        const inTray = compareTray.ids.includes(p.id)
                        return (
                            <div
                                key={p.id}
                                className={cn(
                                    "rounded-2xl border bg-card p-5 flex flex-col transition-all duration-300",
                                    "border-border hover:border-yellow-200/50 hover:shadow-xl hover:shadow-yellow-500/5 hover:-translate-y-1"
                                )}
                            >
                                <div className="flex items-start justify-between mb-1">
                                    <div>
                                        <p className="text-sm font-bold text-foreground">{p.name}</p>
                                        <p className="text-xs text-muted-foreground">{p.type}</p>
                                    </div>
                                    {p.badge && (
                                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-yellow-50 text-yellow-700 border border-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800 shrink-0 ml-2">
                                            {p.badge}
                                        </span>
                                    )}
                                </div>

                                <div className="flex gap-1 mb-3">
                                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-secondary text-muted-foreground">{p.planType}</span>
                                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-secondary text-muted-foreground">{p.customerType}</span>
                                </div>

                                <div className="grid grid-cols-2 gap-2 mb-4 text-[11px] font-bold">
                                    <div className="rounded-xl bg-secondary/30 p-3">
                                        <p className="text-muted-foreground uppercase tracking-tight mb-0.5">Per kWh</p>
                                        <p className="text-foreground">${p.tariffPerKwh.toFixed(3)}</p>
                                    </div>
                                    <div className="rounded-xl bg-secondary/30 p-3">
                                        <p className="text-muted-foreground uppercase tracking-tight mb-0.5">Fixed/mo</p>
                                        <p className="text-foreground">${p.fixedMonthlyCharge.toFixed(2)}</p>
                                    </div>
                                    <div className="rounded-xl bg-secondary/30 p-3">
                                        <p className="text-muted-foreground uppercase tracking-tight mb-0.5">Reliability</p>
                                        <p className={reliabilityColor(p.reliabilityScore)}>{p.reliabilityScore}/100</p>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-1 mb-4">
                                    {p.features.slice(0, 3).map((f) => (
                                        <span key={f} className="text-[10px] px-2 py-0.5 rounded-full bg-secondary/50 text-muted-foreground">{f}</span>
                                    ))}
                                </div>

                                <div className="mt-auto">
                                    <button
                                        onClick={() => addToCompareTray("utilities", p.id, "electricity")}
                                        className={cn(
                                            "btn-compare-standard w-full",
                                            inTray && "opacity-60"
                                        )}
                                    >
                                        {inTray ? t("common.addedToCompare") : t("common.addToCompare")}
                                    </button>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
            <Disclaimer />
        </div>
    )
}
