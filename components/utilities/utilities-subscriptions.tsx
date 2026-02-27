"use client"

import { useState } from "react"
import { subscriptionServices } from "@/lib/mock/utilities"
import { useAppStore } from "@/lib/store"
import { cn } from "@/lib/utils"
import { Disclaimer } from "@/components/disclaimer"
import { CreditCard, Users, Star } from "lucide-react"
import { useI18n } from "@/lib/i18n"

type SubCategory = "All" | "Streaming" | "Security" | "Maintenance" | "Software"
type PricingMode = "monthly" | "yearly"

export function UtilitiesSubscriptions() {
    const { addToCompareTray, compareTray } = useAppStore()
    const { t } = useI18n()
    const [categoryFilter, setCategoryFilter] = useState<SubCategory>("All")
    const [pricingMode, setPricingMode] = useState<PricingMode>("monthly")
    const [familyOnly, setFamilyOnly] = useState(false)

    const filtered = subscriptionServices.filter((s) => {
        if (categoryFilter !== "All" && s.category !== categoryFilter) return false
        if (familyOnly && !s.familySharing) return false
        return true
    })

    const getPrice = (s: typeof subscriptionServices[0]) => {
        if (pricingMode === "yearly") return s.annualPrice
        return s.monthlyPrice
    }

    const getAnnualSaving = (s: typeof subscriptionServices[0]) => {
        const monthlyCost = s.monthlyPrice * 12
        const saving = monthlyCost - s.annualPrice
        return saving > 0 ? saving : 0
    }

    const categoryColors: Record<SubCategory, string> = {
        All: "bg-primary text-primary-foreground",
        Streaming: "bg-purple-500 text-white",
        Security: "bg-red-500 text-white",
        Maintenance: "bg-orange-500 text-white",
        Software: "bg-blue-500 text-white",
    }

    const categoryActiveColors: Record<SubCategory, string> = {
        All: "bg-primary text-primary-foreground",
        Streaming: "bg-purple-500 text-white",
        Security: "bg-red-500 text-white",
        Maintenance: "bg-orange-500 text-white",
        Software: "bg-blue-500 text-white",
    }

    return (
        <div className="space-y-6">
            {/* Filters */}
            <div className="flex flex-wrap gap-3">
                <div className="flex flex-wrap gap-1">
                    {(["All", "Streaming", "Security", "Maintenance", "Software"] as SubCategory[]).map((f) => (
                        <button
                            key={f}
                            onClick={() => setCategoryFilter(f)}
                            className={cn(
                                "shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
                                categoryFilter === f
                                    ? categoryActiveColors[f]
                                    : "bg-secondary/50 text-muted-foreground hover:text-foreground hover:bg-secondary"
                            )}
                        >
                            {f}
                        </button>
                    ))}
                </div>

                {/* Monthly / Yearly toggle */}
                <div className="flex items-center gap-1 rounded-full border border-border p-0.5 bg-secondary/30">
                    <button
                        onClick={() => setPricingMode("monthly")}
                        className={cn(
                            "rounded-full px-3 py-1 text-xs font-medium transition-colors",
                            pricingMode === "monthly" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"
                        )}
                    >
                        Monthly
                    </button>
                    <button
                        onClick={() => setPricingMode("yearly")}
                        className={cn(
                            "rounded-full px-3 py-1 text-xs font-medium transition-colors",
                            pricingMode === "yearly" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"
                        )}
                    >
                        Yearly
                    </button>
                </div>

                <button
                    onClick={() => setFamilyOnly(!familyOnly)}
                    className={cn(
                        "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors border",
                        familyOnly
                            ? "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800"
                            : "border-border text-muted-foreground hover:bg-secondary"
                    )}
                >
                    <Users className="h-3.5 w-3.5" />
                    Family Sharing
                </button>
            </div>

            {/* Provider cards */}
            {filtered.length === 0 ? (
                <div className="rounded-2xl border-2 border-dashed border-border p-12 text-center">
                    <CreditCard className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                    <h3 className="text-lg font-bold text-foreground mb-2">No subscriptions found</h3>
                    <p className="text-muted-foreground">Try adjusting your filters.</p>
                </div>
            ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {filtered.map((s) => {
                        const inTray = compareTray.ids.includes(s.id)
                        const price = getPrice(s)
                        const annualSaving = getAnnualSaving(s)
                        return (
                            <div
                                key={s.id}
                                className={cn(
                                    "rounded-2xl border bg-card p-5 flex flex-col transition-all duration-300",
                                    "border-border hover:border-purple-200/50 hover:shadow-xl hover:shadow-purple-500/5 hover:-translate-y-1"
                                )}
                            >
                                <div className="flex items-start justify-between mb-1">
                                    <div>
                                        <p className="text-sm font-bold text-foreground">{s.name}</p>
                                        <p className="text-xs text-muted-foreground">{s.category}</p>
                                    </div>
                                    {s.badge && (
                                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-100 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800 shrink-0 ml-2 flex items-center gap-1">
                                            <Star className="h-2.5 w-2.5" />
                                            {s.badge}
                                        </span>
                                    )}
                                </div>

                                <div className="flex gap-1 mb-3">
                                    {s.familySharing && (
                                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-green-50 text-green-700 border border-green-100 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800 flex items-center gap-1">
                                            <Users className="h-2.5 w-2.5" />
                                            Family {s.maxUsers ? `(${s.maxUsers} users)` : ""}
                                        </span>
                                    )}
                                    {s.contractMonths === 0 && (
                                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-secondary text-muted-foreground">No Contract</span>
                                    )}
                                </div>

                                <div className="grid grid-cols-2 gap-2 mb-4 text-[11px] font-bold">
                                    <div className="rounded-xl bg-secondary/30 p-3 col-span-2">
                                        <p className="text-muted-foreground uppercase tracking-tight mb-0.5">
                                            {pricingMode === "monthly" ? "Monthly Price" : "Annual Price"}
                                        </p>
                                        <p className="text-foreground text-base">${price.toFixed(2)}</p>
                                        {pricingMode === "yearly" && annualSaving > 0 && (
                                            <p className="text-green-600 dark:text-green-400 text-[10px] mt-0.5">Save ${annualSaving.toFixed(2)}/year</p>
                                        )}
                                        {pricingMode === "monthly" && annualSaving > 0 && (
                                            <p className="text-muted-foreground text-[10px] mt-0.5">Annual: ${s.annualPrice.toFixed(2)} (save ${annualSaving.toFixed(2)})</p>
                                        )}
                                    </div>
                                    <div className="rounded-xl bg-secondary/30 p-3">
                                        <p className="text-muted-foreground uppercase tracking-tight mb-0.5">Contract</p>
                                        <p className="text-foreground">{s.contractMonths === 0 ? "None" : `${s.contractMonths}mo`}</p>
                                    </div>
                                    <div className="rounded-xl bg-secondary/30 p-3">
                                        <p className="text-muted-foreground uppercase tracking-tight mb-0.5">Sharing</p>
                                        <p className="text-foreground">{s.familySharing ? `Yes (${s.maxUsers ?? "∞"})` : "No"}</p>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-1 mb-4">
                                    {s.features.slice(0, 3).map((f) => (
                                        <span key={f} className="text-[10px] px-2 py-0.5 rounded-full bg-secondary/50 text-muted-foreground">{f}</span>
                                    ))}
                                </div>

                                <div className="mt-auto">
                                    <button
                                        onClick={() => addToCompareTray("utilities", s.id, "subscriptions")}
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
