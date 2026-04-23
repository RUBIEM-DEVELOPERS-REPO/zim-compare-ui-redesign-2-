"use client"

import { useState } from "react"
import { waterProviders } from "@/lib/mock/utilities"
import { useAppStore } from "@/lib/store"
import { cn } from "@/lib/utils"
import { Disclaimer } from "@/components/disclaimer"
import { Droplets } from "lucide-react"
import { useI18n } from "@/lib/i18n"

type WaterType = "All" | "Municipal" | "Borehole Delivery" | "Subscription"

interface UtilitiesWaterProps {
    location?: string
}


export function UtilitiesWater({ location = "All Locations" }: UtilitiesWaterProps) {
    const { addToCompareTray, compareTray } = useAppStore()
    const { t } = useI18n()
    const [typeFilter, setTypeFilter] = useState<WaterType>("All")

    const filtered = waterProviders.filter((p) => {
        if (typeFilter !== "All" && p.type !== typeFilter) return false
        if (location !== "All Locations" && p.city !== location && p.city !== "All Locations") return false
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
            <div className="glass-tab-container flex flex-wrap gap-1.5 p-1.5 w-fit">
                {(["All", "Municipal", "Borehole Delivery", "Subscription"] as WaterType[]).map((f) => (
                    <button
                        key={f}
                        onClick={() => setTypeFilter(f)}
                        className={cn(
                            "glass-tab-base px-4 py-1.5 text-xs font-medium h-9 flex items-center justify-center",
                            typeFilter === f ? "glass-tab-active" : "text-muted-foreground"
                        )}
                    >
                        {f}
                    </button>
                ))}
            </div>


            {/* Provider cards */}
            {filtered.length === 0 ? (
                <div className="rounded-2xl border-2 border-dashed border-border p-12 text-center">
                    <Droplets className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                    <h3 className="text-lg font-medium text-foreground mb-2">No providers found</h3>
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
                                    "border-border hover:border-blue-200/50 hover:shadow-xl hover:shadow-blue-500/5 hover:-translate-y-1"
                                )}
                            >
                                <div className="flex items-start justify-between mb-1">
                                    <div>
                                        <p className="text-sm font-medium text-foreground">{p.name}</p>
                                        <p className="text-xs text-muted-foreground">{p.city}</p>
                                    </div>
                                    {p.badge && (
                                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800 shrink-0 ml-2">
                                            {p.badge}
                                        </span>
                                    )}
                                </div>

                                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-secondary text-muted-foreground w-fit mb-3">{p.type}</span>

                                <div className="grid grid-cols-2 gap-2 mb-4 text-[11px] font-medium">
                                    <div className="rounded-xl bg-secondary/30 p-3">
                                        <p className="text-muted-foreground uppercase tracking-tight mb-0.5">Per m³</p>
                                        <p className="text-foreground">${p.costPerCubicMeter.toFixed(2)}</p>
                                    </div>
                                    <div className="rounded-xl bg-secondary/30 p-3">
                                        <p className="text-muted-foreground uppercase tracking-tight mb-0.5">Fixed/mo</p>
                                        <p className="text-foreground">${p.monthlyFixedCharge.toFixed(2)}</p>
                                    </div>
                                    {p.deliveryCost !== undefined && (
                                        <div className="rounded-xl bg-secondary/30 p-3">
                                            <p className="text-muted-foreground uppercase tracking-tight mb-0.5">Delivery</p>
                                            <p className="text-foreground">${p.deliveryCost.toFixed(2)}</p>
                                        </div>
                                    )}
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
                                        onClick={() => addToCompareTray("utilities", p.id, "water")}
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

