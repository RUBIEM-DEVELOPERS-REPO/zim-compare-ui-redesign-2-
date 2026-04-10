"use client"

import { useState } from "react"
import { boreholePackages } from "@/lib/mock/solar"
import { cn } from "@/lib/utils"
import { Droplets, Clock, Shield, TrendingUp, Waves } from "lucide-react"

interface BoreholePackagesProps {
    location?: string
}

const depthFilters = ["All", "≤30m", "31–60m", "61–100m", "100m+"]
const sortOptions = ["Best Value", "Price: Low to High", "Price: High to Low", "Fastest Payback", "Best Yield"]

export function BoreholePackages({ location = "All Locations" }: BoreholePackagesProps) {
    const [depthFilter, setDepthFilter] = useState("All")
    const [sortBy, setSortBy] = useState("Best Value")
    const [selected, setSelected] = useState<string[]>([])

    const filtered = boreholePackages.filter(p => {
        if (depthFilter === "All") return true
        if (depthFilter === "≤30m") return p.depthMeters <= 30
        if (depthFilter === "31–60m") return p.depthMeters > 30 && p.depthMeters <= 60
        if (depthFilter === "61–100m") return p.depthMeters > 60 && p.depthMeters <= 100
        if (depthFilter === "100m+") return p.depthMeters > 100
        return true
    })

    const sorted = [...filtered].sort((a, b) => {
        if (sortBy === "Price: Low to High") return a.price - b.price
        if (sortBy === "Price: High to Low") return b.price - a.price
        if (sortBy === "Fastest Payback") return a.paybackMonths - b.paybackMonths
        if (sortBy === "Best Yield") return b.yieldLitersPerHour - a.yieldLitersPerHour
        return (b.bestValue ? 1 : 0) - (a.bestValue ? 1 : 0)
    })

    const toggleSelect = (id: string) => {
        setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : prev.length < 3 ? [...prev, id] : prev)
    }

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
                <div className="flex gap-2 flex-wrap">
                    {depthFilters.map(f => (
                        <button
                            key={f}
                            onClick={() => setDepthFilter(f)}
                            className={cn(
                                "glass-tab-base px-3 py-1.5 text-[10px] font-black uppercase tracking-widest transition-all",
                                depthFilter === f ? "glass-tab-active" : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            {f}
                        </button>
                    ))}
                </div>
                <div className="relative group">
                    <select
                        value={sortBy}
                        onChange={e => setSortBy(e.target.value)}
                        className="glass-input text-[10px] font-black uppercase tracking-widest text-muted-foreground px-4 py-2 focus:outline-none cursor-pointer hover:border-primary/40 transition-all appearance-none outline-none shadow-lg pr-8"
                        title="Sort borehole packages"
                    >
                        {sortOptions.map(o => <option key={o} className="bg-background text-foreground">{o}</option>)}
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
                        <Waves className="w-3 h-3" />
                    </div>
                </div>
            </div>

            {selected.length > 0 && (
                <div className="glass-card px-4 py-4 flex items-center justify-between border-blue-500/40 bg-blue-500/5 shadow-xl shadow-blue-500/10 animate-in slide-in-from-top-4 backdrop-blur-xl">
                    <p className="text-[11px] text-foreground font-black uppercase tracking-widest">{selected.length} borehole package{selected.length > 1 ? "s" : ""} ready</p>
                    <button className="rounded-xl bg-blue-600 px-6 py-2 text-[10px] font-black uppercase tracking-widest text-white hover:bg-blue-500 transition-all shadow-lg shadow-blue-500/30 hover:scale-105 active:scale-95">
                        Compare Selected
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
                        onClick={() => toggleSelect(pkg.id)}
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <div className="flex gap-1.5 mb-2">
                                    {pkg.bestValue && <span className="text-[9px] bg-amber-500/20 text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded-full font-black uppercase tracking-tighter border border-amber-500/20 shadow-sm">Best Value</span>}
                                    {(pkg as any).recommended && <span className="text-[9px] bg-primary/15 text-primary px-2 py-0.5 rounded-full font-black uppercase tracking-tighter border border-primary/20 shadow-sm">Recommended</span>}
                                </div>
                                <p className="text-sm font-bold text-foreground group-hover:text-blue-500 transition-colors tracking-tight">{pkg.name}</p>
                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-tight">{pkg.providerName}</p>
                            </div>
                            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-lg transition-all",
                                selected.includes(pkg.id) ? "bg-blue-600 text-white scale-110" : "bg-blue-500/10"
                            )}>
                                <Droplets className={cn("w-5 h-5", selected.includes(pkg.id) ? "text-white" : "text-blue-500")} />
                            </div>
                        </div>

                        <div className="text-2xl font-bold text-foreground mb-3">${pkg.price.toLocaleString()}</div>

                        <div className="grid grid-cols-2 gap-2 mb-4">
                            <div className="rounded-xl bg-muted/30 p-2.5 border border-white/5">
                                <div className="flex items-center gap-1.5 mb-1">
                                    <Waves className="w-3 h-3 text-blue-500" />
                                    <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Depth</p>
                                </div>
                                <p className="text-xs font-black text-foreground tabular-nums">{pkg.depthMeters}m Depth</p>
                            </div>
                            <div className="rounded-xl bg-muted/30 p-2.5 border border-white/5">
                                <div className="flex items-center gap-1.5 mb-1">
                                    <TrendingUp className="w-3 h-3 text-emerald-500" />
                                    <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Yield</p>
                                </div>
                                <p className="text-xs font-black text-foreground tabular-nums">{pkg.yieldLitersPerHour} L/hr</p>
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
                            <span className="text-[9px] bg-muted px-2 py-0.5 rounded-full text-foreground/70 font-black uppercase tracking-tighter border border-border/40">{pkg.pumpType}</span>
                            {pkg.pumpIncluded && <span className="text-[9px] bg-blue-500/10 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-full font-black uppercase tracking-tighter border border-blue-500/20">Pump Included</span>}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
