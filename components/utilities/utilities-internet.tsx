"use client"

import React, { useState } from "react"
import { internetProviders } from "@/lib/mock/utilities"
import { useAppStore } from "@/lib/store"
import { cn } from "@/lib/utils"
import { Disclaimer } from "@/components/disclaimer"
import { Wifi, Globe, Zap, Cpu, ArrowRight, CheckCircle2, ShieldCheck, Clock } from "lucide-react"
import { useI18n } from "@/lib/i18n"

type ConnectionType = "All" | "Fibre" | "LTE/5G" | "Satellite"

const ProgressBar = ({ progress }: { progress: number }) => {
    const ref = React.useRef<HTMLDivElement>(null);
    React.useEffect(() => {
        if (ref.current) {
            ref.current.style.width = `${progress}%`;
        }
    }, [progress]);
    return <div ref={ref} className="h-full bg-teal-500 rounded-full transition-all duration-500" />;
};

interface UtilitiesInternetProps {
    location?: string
}

export function UtilitiesInternet({ location = "All Locations" }: UtilitiesInternetProps) {
    const { addToCompareTray, compareTray } = useAppStore()
    const { t } = useI18n()
    const [typeFilter, setTypeFilter] = useState<ConnectionType>("All")
    const [noContractOnly, setNoContractOnly] = useState(false)
    const [unlimitedOnly, setUnlimitedOnly] = useState(false)
    const [maxPrice, setMaxPrice] = useState(200)
    const [minSpeed, setMinSpeed] = useState(0)

    const filtered = internetProviders.filter((p) => {
        if (typeFilter !== "All" && p.type !== typeFilter) return false
        if (noContractOnly && p.contractMonths !== 0) return false
        if (unlimitedOnly && p.fairUsageGB !== undefined) return false
        if (p.monthlyPrice > maxPrice) return false
        if (p.speedMbps < minSpeed) return false
        if (location !== "All Locations" && !p.availableCities.includes(location) && !p.availableCities.includes("All Locations")) return false
        return true
    })

    const sorted = [...filtered].sort((a, b) => a.monthlyPrice - b.monthlyPrice)

    return (
        <div className="space-y-6">
            {/* Filters */}
            <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                    {(["All", "Fibre", "LTE/5G", "Satellite"] as ConnectionType[]).map((f) => (
                        <button
                            key={f}
                            onClick={() => setTypeFilter(f)}
                            className={cn(
                                "shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
                                typeFilter === f
                                    ? "bg-teal-500 text-white"
                                    : "bg-secondary/50 text-muted-foreground hover:text-foreground hover:bg-secondary"
                            )}
                        >
                            {f}
                        </button>
                    ))}
                    <button
                        onClick={() => setNoContractOnly(!noContractOnly)}
                        className={cn(
                            "shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-colors border",
                            noContractOnly
                                ? "bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-900/30 dark:text-teal-300 dark:border-teal-800"
                                : "border-border text-muted-foreground hover:bg-secondary"
                        )}
                    >
                        No Contract Only
                    </button>
                    <button
                        onClick={() => setUnlimitedOnly(!unlimitedOnly)}
                        className={cn(
                            "shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-colors border",
                            unlimitedOnly
                                ? "bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-900/30 dark:text-teal-300 dark:border-teal-800"
                                : "border-border text-muted-foreground hover:bg-secondary"
                        )}
                    >
                        Unlimited Only
                    </button>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                        <label className="text-xs font-medium text-muted-foreground mb-1 block">
                            Max Price: <span className="text-foreground font-bold">${maxPrice}/mo</span>
                        </label>
                        <input
                            type="range"
                            min={20}
                            max={200}
                            step={5}
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(Number(e.target.value))}
                            className="w-full accent-teal-500"
                            title="Max Price"
                        />
                    </div>
                    <div>
                        <label className="text-xs font-medium text-muted-foreground mb-1 block">
                            Min Speed: <span className="text-foreground font-bold">{minSpeed}Mbps</span>
                        </label>
                        <input
                            type="range"
                            min={0}
                            max={200}
                            step={10}
                            value={minSpeed}
                            onChange={(e) => setMinSpeed(Number(e.target.value))}
                            className="w-full accent-teal-500"
                            title="Min Speed"
                        />
                    </div>
                </div>
            </div>

            {/* Speed vs Price visual summary */}
            {sorted.length > 0 && (
                <div className="rounded-xl border border-border bg-card p-4">
                    <p className="text-xs font-semibold text-muted-foreground mb-3">Speed vs Price Overview</p>
                    <div className="space-y-2">
                        {sorted.slice(0, 6).map((p) => {
                            const maxSpeed = Math.max(...sorted.map(x => x.speedMbps))
                            const widthPct = Math.max(8, (p.speedMbps / maxSpeed) * 100)
                            return (
                                <div key={p.id} className="flex items-center gap-3 text-xs">
                                    <span className="w-28 shrink-0 text-muted-foreground truncate">{p.planName}</span>
                                    <div className="flex-1 bg-secondary/30 rounded-full h-2 overflow-hidden">
                                        <ProgressBar progress={widthPct} />
                                    </div>
                                    <span className="w-16 shrink-0 text-right font-bold text-foreground">{p.speedMbps}Mbps</span>
                                    <span className="w-14 shrink-0 text-right text-primary">${p.monthlyPrice}/mo</span>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}

            {/* Provider cards */}
            {sorted.length === 0 ? (
                <div className="rounded-2xl border-2 border-dashed border-border p-12 text-center">
                    <Wifi className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                    <h3 className="text-lg font-bold text-foreground mb-2">No plans found</h3>
                    <p className="text-muted-foreground">Try adjusting your filters.</p>
                </div>
            ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {sorted.map((p) => {
                        const inTray = compareTray.ids.includes(p.id)
                        return (
                            <div
                                key={p.id}
                                className={cn(
                                    "rounded-2xl border bg-card p-5 flex flex-col transition-all duration-300",
                                    "border-border hover:border-teal-200/50 hover:shadow-xl hover:shadow-teal-500/5 hover:-translate-y-1"
                                )}
                            >
                                <div className="flex items-start justify-between mb-1">
                                    <div>
                                        <p className="text-sm font-bold text-foreground">{p.name}</p>
                                        <p className="text-xs text-muted-foreground">{p.planName}</p>
                                    </div>
                                    {p.badge && (
                                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-100 dark:bg-teal-900/30 dark:text-teal-300 dark:border-teal-800 shrink-0 ml-2">
                                            {p.badge}
                                        </span>
                                    )}
                                </div>

                                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-secondary text-muted-foreground w-fit mb-3">{p.type}</span>

                                <div className="grid grid-cols-2 gap-2 mb-4 text-[11px] font-bold">
                                    <div className="rounded-xl bg-secondary/30 p-3">
                                        <p className="text-muted-foreground uppercase tracking-tight mb-0.5">Speed</p>
                                        <p className="text-teal-600 dark:text-teal-400">{p.speedMbps}Mbps</p>
                                    </div>
                                    <div className="rounded-xl bg-secondary/30 p-3">
                                        <p className="text-muted-foreground uppercase tracking-tight mb-0.5">Monthly</p>
                                        <p className="text-foreground">${p.monthlyPrice}</p>
                                    </div>
                                    <div className="rounded-xl bg-secondary/30 p-3">
                                        <p className="text-muted-foreground uppercase tracking-tight mb-0.5">Install</p>
                                        <p className="text-foreground">{p.installationFee === 0 ? "Free" : `$${p.installationFee}`}</p>
                                    </div>
                                    <div className="rounded-xl bg-secondary/30 p-3">
                                        <p className="text-muted-foreground uppercase tracking-tight mb-0.5">Data</p>
                                        <p className="text-foreground">{p.fairUsageGB ? `${p.fairUsageGB}GB` : "Unlimited"}</p>
                                    </div>
                                </div>

                                <div className="flex gap-1 mb-4">
                                    <span className={cn(
                                        "text-[10px] font-medium px-2 py-0.5 rounded-full",
                                        p.contractMonths === 0
                                            ? "bg-green-50 text-green-700 border border-green-100 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800"
                                            : "bg-secondary text-muted-foreground"
                                    )}>
                                        {p.contractMonths === 0 ? "No Contract" : `${p.contractMonths}-month contract`}
                                    </span>
                                </div>

                                <div className="flex flex-wrap gap-1 mb-4">
                                    {p.features.slice(0, 3).map((f) => (
                                        <span key={f} className="text-[10px] px-2 py-0.5 rounded-full bg-secondary/50 text-muted-foreground">{f}</span>
                                    ))}
                                </div>

                                <div className="mt-auto">
                                    <button
                                        onClick={() => addToCompareTray("utilities", p.id, "internet")}
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
