"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { solarPackages } from "@/lib/mock/solar"
import { cn } from "@/lib/utils"
import { Sun, Clock, Shield, TrendingUp, Zap, ChevronLeft } from "lucide-react"
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
                <div className="flex gap-2 flex-wrap bg-white/5 p-1.5 rounded-2xl border border-white/10 shadow-inner">
                    {sizeFilters.map(f => (
                        <button
                            key={f}
                            onClick={() => setSizeFilter(f)}
                            className={cn(
                                "px-3 py-2 rounded-xl text-[10px] font-medium uppercase tracking-[0.2em] transition-all duration-500",
                                sizeFilter === f 
                                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-[1.02]" 
                                    : "text-muted-foreground hover:text-white hover:bg-white/5"
                            )}
                        >
                            {f}
                        </button>
                    ))}
                </div>
                <div className="relative">
                    <select
                        value={sortBy}
                        onChange={e => setSortBy(e.target.value)}
                        className="glass-floating text-[10px] font-medium uppercase tracking-[0.2em] text-primary/80 px-6 py-2.5 focus:outline-none cursor-pointer bg-primary/5 border-primary/20 hover:bg-primary/10 transition-all appearance-none outline-none ring-0 shadow-xl teal-glow pr-10"
                        title="Sort Logic"
                    >
                        {sortOptions.map(o => <option key={o} className="bg-[#0A0A0A] text-white">{o}</option>)}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-primary/60">
                        <ChevronLeft size={14} className="-rotate-90" />
                    </div>
                </div>
            </div>

            {selected.length > 0 && compareTray.category === "solar" && (
                <div className="glass-card px-4 py-4 flex items-center justify-between border-primary/40 bg-primary/5 shadow-xl shadow-primary/10 animate-in slide-in-from-top-4 backdrop-blur-xl">
                    <p className="text-[11px] text-foreground font-medium uppercase tracking-widest">{selected.length} package{selected.length > 1 ? "s" : ""} selected for comparison</p>
                    <button 
                        onClick={handleCompare}
                        disabled={selected.length < 2}
                        className="rounded-xl bg-primary px-6 py-2 text-[10px] font-medium uppercase tracking-widest text-primary-foreground hover:bg-primary/90 transition-all shadow-lg shadow-primary/30 hover:scale-105 active:scale-95 disabled:scale-100 disabled:opacity-50 disabled:cursor-not-allowed"
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
                            "glass-floating p-6 flex flex-col transition-all duration-500 relative group overflow-hidden floating-hover border-white/5",
                            selected.includes(pkg.id) ? "border-primary/40 bg-primary/5 teal-glow" : "border-white/5"
                        )}
                        onClick={(e) => toggleSelect(pkg.id, e)}
                    >
                        <div className="absolute top-0 right-0 p-4 text-primary/5 -rotate-12 group-hover:rotate-0 transition-transform duration-1000">
                            <Sun size={80} />
                        </div>

                        <div className="flex items-start justify-between mb-4 relative z-10">
                            <div>
                                <div className="flex gap-1.5 mb-3">
                                    {pkg.bestValue && <span className="text-[9px] font-medium uppercase tracking-widest bg-amber-500/10 text-amber-500 px-3 py-1 rounded-lg border border-amber-500/20 shadow-inner">Best Value</span>}
                                    {pkg.recommended && <span className="text-[9px] font-medium uppercase tracking-widest bg-primary/10 text-primary px-3 py-1 rounded-lg border border-primary/20 shadow-inner">Recommended</span>}
                                </div>
                                <p className="text-lg font-display font-medium text-white group-hover:text-primary transition-colors uppercase tracking-tight leading-tight">{pkg.name}</p>
                                <p className="text-[10px] font-medium text-muted-foreground uppercase mt-2 tracking-[0.1em] opacity-60 font-sans">{pkg.providerName}</p>
                            </div>
                            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all shadow-lg teal-glow",
                                selected.includes(pkg.id) ? "bg-primary text-white scale-110" : "bg-white/5 border border-white/10"
                            )}>
                                <Sun className={cn("w-5 h-5", selected.includes(pkg.id) ? "text-white" : "text-amber-500")} />
                            </div>
                        </div>

                        <div className="text-3xl font-display font-medium text-white mb-6 relative z-10 tabular-nums">${pkg.price.toLocaleString()}</div>

                        <div className="grid grid-cols-2 gap-4 mb-6 relative z-10">
                            <div className="glass-floating bg-white/5 p-3 border-white/10 shadow-inner group-hover:bg-primary/5 group-hover:border-primary/20 transition-all duration-500">
                                <div className="flex items-center gap-1.5 mb-1.5 opacity-60">
                                    <Zap className="w-3 h-3 text-amber-500" />
                                    <p className="text-[9px] font-medium text-muted-foreground uppercase tracking-widest">Size</p>
                                </div>
                                <p className="text-sm font-display font-medium text-white tabular-nums">{pkg.systemKW}kW System</p>
                            </div>
                            <div className="glass-floating bg-white/5 p-3 border-white/10 shadow-inner group-hover:bg-primary/5 group-hover:border-primary/20 transition-all duration-500">
                                <div className="flex items-center gap-1.5 mb-1.5 opacity-60">
                                    <TrendingUp className="w-3 h-3 text-emerald-500" />
                                    <p className="text-[9px] font-medium text-muted-foreground uppercase tracking-widest">Savings</p>
                                </div>
                                <p className="text-sm font-display font-medium text-primary tabular-nums">${pkg.monthlySavings}/mo</p>
                            </div>
                            <div className="glass-floating bg-white/5 p-3 border-white/10 shadow-inner group-hover:bg-primary/5 group-hover:border-primary/20 transition-all duration-500">
                                <div className="flex items-center gap-1.5 mb-1.5 opacity-60">
                                    <Clock className="w-3 h-3 text-blue-500" />
                                    <p className="text-[9px] font-medium text-muted-foreground uppercase tracking-widest">Payback</p>
                                </div>
                                <p className="text-sm font-display font-medium text-white tabular-nums">{pkg.paybackMonths} m</p>
                            </div>
                            <div className="glass-floating bg-white/5 p-3 border-white/10 shadow-inner group-hover:bg-primary/5 group-hover:border-primary/20 transition-all duration-500">
                                <div className="flex items-center gap-1.5 mb-1.5 opacity-60">
                                    <Shield className="w-3 h-3 text-primary" />
                                    <p className="text-[9px] font-medium text-muted-foreground uppercase tracking-widest">Warranty</p>
                                </div>
                                <p className="text-sm font-display font-medium text-white tabular-nums">{pkg.warrantyYears} y</p>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-2 pt-6 border-t border-white/10 mt-auto relative z-10">
                            <span className="text-[9px] font-medium uppercase tracking-widest bg-white/5 text-muted-foreground px-3 py-1 rounded-lg border border-white/10">{pkg.inverterBrand}</span>
                            <span className="text-[9px] font-medium uppercase tracking-widest bg-white/5 text-muted-foreground px-3 py-1 rounded-lg border border-white/10">{pkg.panelBrand}</span>
                            {pkg.batteryIncluded && <span className="text-[9px] font-medium uppercase tracking-widest bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-lg border border-emerald-500/20">Battery Included</span>}
                            <span className="text-[9px] font-medium uppercase tracking-widest bg-primary/10 text-primary px-3 py-1 rounded-lg border border-primary/20">{pkg.installDays}d install</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

