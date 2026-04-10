"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { solarPackages } from "@/lib/mock/solar"
import { cn } from "@/lib/utils"
import { Sun, Clock, Shield, TrendingUp, Zap } from "lucide-react"
import { useAppStore } from "@/lib/store"

interface SolarPackagesProps {
    location?: string
}

const sizeFilters = ["All", "1kW", "2kW", "3kW", "5kW", "10kW+"]
const sortOptions = ["Best Value", "Price: Low to High", "Price: High to Low", "Fastest Payback", "Best Warranty"]

export function SolarPackages({ location = "All Locations" }: SolarPackagesProps) {
    const { compareTray, addToCompareTray, removeFromCompareTray } = useAppStore()
    const router = useRouter()
    const [sizeFilter, setSizeFilter] = useState("All")
    const [sortBy, setSortBy] = useState("Best Value")
    const selected = compareTray.ids

    const filtered = solarPackages.filter(p => {
        if (sizeFilter === "All") return true
        if (sizeFilter === "10kW+") return p.systemKW >= 10
        return p.systemKW === parseFloat(sizeFilter)
    })

    const sorted = [...filtered].sort((a, b) => {
        if (sortBy === "Price: Low to High") return a.price - b.price
        if (sortBy === "Price: High to Low") return b.price - a.price
        if (sortBy === "Fastest Payback") return a.paybackMonths - b.paybackMonths
        if (sortBy === "Best Warranty") return b.warrantyYears - a.warrantyYears
        return (b.bestValue ? 1 : 0) - (a.bestValue ? 1 : 0)
    })

    const toggleSelect = (id: string, e: React.MouseEvent) => {
        e.stopPropagation()
        if (selected.includes(id)) {
            removeFromCompareTray(id)
        } else {
            addToCompareTray("solar", id, "overview")
        }
    }

    const handleCompare = () => {
        router.push(`/solar/compare/overview?ids=${selected.join(",")}`)
    }

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
                <div className="flex gap-2 flex-wrap">
                    {sizeFilters.map(f => (
                        <button
                            key={f}
                            onClick={() => setSizeFilter(f)}
                            className={cn(
                                "glass-tab-base px-3 py-1.5 text-[10px] font-black uppercase tracking-widest transition-all",
                                sizeFilter === f ? "glass-tab-active" : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            {f}
                        </button>
                    ))}
                </div>
                <select
                    value={sortBy}
                    onChange={e => setSortBy(e.target.value)}
                    className="glass-input text-[10px] font-black uppercase tracking-widest text-muted-foreground px-4 py-2 focus:outline-none cursor-pointer hover:border-primary/40 transition-all appearance-none outline-none shadow-lg"
                    title="Sort by size or value"
                >
                    {sortOptions.map(o => <option key={o} className="bg-background text-foreground">{o}</option>)}
                </select>
            </div>

            {selected.length > 0 && compareTray.category === "solar" && (
                <div className="glass-card px-4 py-4 flex items-center justify-between border-primary/40 bg-primary/5 shadow-xl shadow-primary/10 animate-in slide-in-from-top-4 backdrop-blur-xl">
                    <p className="text-[11px] text-foreground font-black uppercase tracking-widest">{selected.length} package{selected.length > 1 ? "s" : ""} selected for comparison</p>
                    <button 
                        onClick={handleCompare}
                        disabled={selected.length < 2}
                        className="rounded-xl bg-primary px-6 py-2 text-[10px] font-black uppercase tracking-widest text-primary-foreground hover:bg-primary/90 transition-all shadow-lg shadow-primary/30 hover:scale-105 active:scale-95 disabled:scale-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Compare Packages
                    </button>
                </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {sorted.map(pkg => (
                    <div
                        key={pkg.id}
                        className={cn(
                            "rounded-xl border bg-card p-5 transition-all hover:border-primary/30 cursor-pointer",
                            selected.includes(pkg.id) ? "border-primary ring-1 ring-primary/30" : "border-border"
                        )}
                        onClick={(e) => toggleSelect(pkg.id, e)}
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <div className="flex gap-1.5 mb-2">
                                    {pkg.bestValue && <span className="text-[9px] bg-amber-500/20 text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded-full font-black uppercase tracking-tighter border border-amber-500/20 shadow-sm">Best Value</span>}
                                    {pkg.recommended && <span className="text-[9px] bg-primary/15 text-primary px-2 py-0.5 rounded-full font-black uppercase tracking-tighter border border-primary/20 shadow-sm">Recommended</span>}
                                </div>
                                <p className="text-sm font-bold text-foreground group-hover:text-primary transition-colors tracking-tight">{pkg.name}</p>
                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-tight">{pkg.providerName}</p>
                            </div>
                            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-lg transition-all",
                                selected.includes(pkg.id) ? "bg-primary text-white scale-110" : "bg-amber-500/10"
                            )}>
                                <Sun className={cn("w-5 h-5", selected.includes(pkg.id) ? "text-white" : "text-amber-500")} />
                            </div>
                        </div>

                        <div className="text-2xl font-bold text-foreground mb-3">${pkg.price.toLocaleString()}</div>

                        <div className="grid grid-cols-2 gap-2 mb-4">
                            <div className="rounded-xl bg-muted/30 p-2.5 border border-white/5">
                                <div className="flex items-center gap-1.5 mb-1">
                                    <Zap className="w-3 h-3 text-amber-500" />
                                    <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Size</p>
                                </div>
                                <p className="text-xs font-black text-foreground tabular-nums">{pkg.systemKW}kW System</p>
                            </div>
                            <div className="rounded-xl bg-muted/30 p-2.5 border border-white/5">
                                <div className="flex items-center gap-1.5 mb-1">
                                    <TrendingUp className="w-3 h-3 text-emerald-500" />
                                    <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Savings</p>
                                </div>
                                <p className="text-xs font-black text-foreground tabular-nums">${pkg.monthlySavings}/mo</p>
                            </div>
                            <div className="rounded-xl bg-muted/30 p-2.5 border border-white/5">
                                <div className="flex items-center gap-1.5 mb-1">
                                    <Clock className="w-3 h-3 text-blue-500" />
                                    <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Payback</p>
                                </div>
                                <p className="text-xs font-black text-foreground tabular-nums">{pkg.paybackMonths} Months</p>
                            </div>
                            <div className="rounded-xl bg-muted/30 p-2.5 border border-white/5">
                                <div className="flex items-center gap-1.5 mb-1">
                                    <Shield className="w-3 h-3 text-primary" />
                                    <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Warranty</p>
                                </div>
                                <p className="text-xs font-black text-foreground tabular-nums">{pkg.warrantyYears} Years</p>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-1.5">
                            <span className="text-[9px] bg-muted px-2 py-0.5 rounded-full text-foreground/70 font-black uppercase tracking-tighter border border-border/40">{pkg.inverterBrand}</span>
                            <span className="text-[9px] bg-muted px-2 py-0.5 rounded-full text-foreground/70 font-black uppercase tracking-tighter border border-border/40">{pkg.panelBrand}</span>
                            {pkg.batteryIncluded && <span className="text-[9px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full font-black uppercase tracking-tighter border border-emerald-500/20">Battery Included</span>}
                            <span className="text-[9px] bg-primary/5 px-2 py-0.5 rounded-full text-primary font-black uppercase tracking-tighter border border-primary/20">{pkg.installDays}d install</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
