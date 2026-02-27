"use client"

import { useState } from "react"
import { waterProviders } from "@/lib/mock/utilities"
import { useAppStore } from "@/lib/store"
import { cn } from "@/lib/utils"
import { Disclaimer } from "@/components/disclaimer"
import { Droplets, Calculator } from "lucide-react"
import { useI18n } from "@/lib/i18n"

type WaterType = "All" | "Municipal" | "Borehole Delivery" | "Subscription"

interface UtilitiesWaterProps {
    location?: string
}

const householdSizes = [
    { label: "1–2 people", m3: 8 },
    { label: "3–4 people", m3: 15 },
    { label: "5+ people", m3: 25 },
]

export function UtilitiesWater({ location = "All Locations" }: UtilitiesWaterProps) {
    const { addToCompareTray, compareTray } = useAppStore()
    const { t } = useI18n()
    const [typeFilter, setTypeFilter] = useState<WaterType>("All")
    const [showCalculator, setShowCalculator] = useState(false)
    const [monthlyM3, setMonthlyM3] = useState(15)

    const filtered = waterProviders.filter((p) => {
        if (typeFilter !== "All" && p.type !== typeFilter) return false
        if (location !== "All Locations" && p.city !== location && p.city !== "All Locations") return false
        return true
    })

    const estimateBill = (p: typeof waterProviders[0]) => {
        return p.costPerCubicMeter * monthlyM3 + p.monthlyFixedCharge + (p.deliveryCost ?? 0)
    }

    const reliabilityColor = (score: number) => {
        if (score >= 80) return "text-green-600 dark:text-green-400"
        if (score >= 60) return "text-yellow-600 dark:text-yellow-400"
        return "text-red-500 dark:text-red-400"
    }

    return (
        <div className="space-y-6">
            {/* Filters */}
            <div className="flex flex-wrap gap-3">
                <div className="flex flex-wrap gap-1">
                    {(["All", "Municipal", "Borehole Delivery", "Subscription"] as WaterType[]).map((f) => (
                        <button
                            key={f}
                            onClick={() => setTypeFilter(f)}
                            className={cn(
                                "shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
                                typeFilter === f
                                    ? "bg-blue-500 text-white"
                                    : "bg-secondary/50 text-muted-foreground hover:text-foreground hover:bg-secondary"
                            )}
                        >
                            {f}
                        </button>
                    ))}
                </div>
                <button
                    onClick={() => setShowCalculator(!showCalculator)}
                    className={cn(
                        "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors border",
                        showCalculator
                            ? "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800"
                            : "border-border text-muted-foreground hover:bg-secondary"
                    )}
                >
                    <Calculator className="h-3.5 w-3.5" />
                    Usage Calculator
                </button>
            </div>

            {/* Usage Calculator */}
            {showCalculator && (
                <div className="rounded-xl border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20 p-5">
                    <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                        <Calculator className="h-4 w-4 text-blue-600" />
                        Water Usage Calculator
                    </h3>
                    <div className="space-y-4">
                        <div>
                            <label className="text-xs font-medium text-muted-foreground mb-2 block">
                                Monthly Usage: <span className="text-foreground font-bold">{monthlyM3} m³</span>
                            </label>
                            <input
                                type="range"
                                min={2}
                                max={60}
                                step={1}
                                value={monthlyM3}
                                onChange={(e) => setMonthlyM3(Number(e.target.value))}
                                className="w-full accent-blue-500"
                            />
                            <div className="flex justify-between text-xs text-muted-foreground mt-1">
                                <span>2 m³</span>
                                <span>60 m³</span>
                            </div>
                        </div>
                        <div className="grid gap-2 sm:grid-cols-3">
                            {householdSizes.map((h) => (
                                <button
                                    key={h.label}
                                    onClick={() => setMonthlyM3(h.m3)}
                                    className={cn(
                                        "rounded-lg p-3 text-left text-xs border transition-colors",
                                        monthlyM3 === h.m3
                                            ? "border-blue-400 bg-blue-100 dark:bg-blue-900/40"
                                            : "border-border bg-card hover:border-blue-300"
                                    )}
                                >
                                    <p className="font-bold text-foreground">{h.label}</p>
                                    <p className="text-muted-foreground">~{h.m3} m³/month</p>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Provider cards */}
            {filtered.length === 0 ? (
                <div className="rounded-2xl border-2 border-dashed border-border p-12 text-center">
                    <Droplets className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                    <h3 className="text-lg font-bold text-foreground mb-2">No providers found</h3>
                    <p className="text-muted-foreground">Try adjusting your filters or location.</p>
                </div>
            ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {filtered.map((p) => {
                        const inTray = compareTray.ids.includes(p.id)
                        const estimatedBill = estimateBill(p)
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
                                        <p className="text-sm font-bold text-foreground">{p.name}</p>
                                        <p className="text-xs text-muted-foreground">{p.city}</p>
                                    </div>
                                    {p.badge && (
                                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800 shrink-0 ml-2">
                                            {p.badge}
                                        </span>
                                    )}
                                </div>

                                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-secondary text-muted-foreground w-fit mb-3">{p.type}</span>

                                <div className="grid grid-cols-2 gap-2 mb-4 text-[11px] font-bold">
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

                                {showCalculator && (
                                    <div className="rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 p-3 mb-4 text-[11px] font-bold">
                                        <p className="text-blue-700 dark:text-blue-300 uppercase tracking-tight mb-0.5">Est. Monthly Bill</p>
                                        <p className="text-blue-700 dark:text-blue-300 text-base">${estimatedBill.toFixed(2)}</p>
                                    </div>
                                )}

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
