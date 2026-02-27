"use client"

import { useState } from "react"
import { solarPackages } from "@/lib/mock/solar"
import { cn } from "@/lib/utils"
import { Sun, Clock, Shield, TrendingUp, Zap } from "lucide-react"

interface SolarPackagesProps {
    location?: string
}

const sizeFilters = ["All", "1kW", "2kW", "3kW", "5kW", "10kW+"]
const sortOptions = ["Best Value", "Price: Low to High", "Price: High to Low", "Fastest Payback", "Best Warranty"]

export function SolarPackages({ location = "All Locations" }: SolarPackagesProps) {
    const [sizeFilter, setSizeFilter] = useState("All")
    const [sortBy, setSortBy] = useState("Best Value")
    const [selected, setSelected] = useState<string[]>([])

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

    const toggleSelect = (id: string) => {
        setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : prev.length < 3 ? [...prev, id] : prev)
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
                                "rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
                                sizeFilter === f ? "bg-primary text-primary-foreground" : "bg-secondary/50 text-muted-foreground hover:bg-secondary"
                            )}
                        >
                            {f}
                        </button>
                    ))}
                </div>
                <select
                    value={sortBy}
                    onChange={e => setSortBy(e.target.value)}
                    className="rounded-lg border border-border bg-secondary text-xs text-foreground px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary"
                >
                    {sortOptions.map(o => <option key={o}>{o}</option>)}
                </select>
            </div>

            {selected.length > 0 && (
                <div className="rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 flex items-center justify-between">
                    <p className="text-sm text-foreground font-medium">{selected.length} package{selected.length > 1 ? "s" : ""} selected</p>
                    <button className="rounded-lg bg-primary px-4 py-1.5 text-xs font-bold text-primary-foreground hover:bg-primary/90 transition-colors">
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
                        <div className="flex items-start justify-between mb-3">
                            <div>
                                <div className="flex gap-1.5 mb-1">
                                    {pkg.bestValue && <span className="text-[10px] bg-amber-500/15 text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded-full font-bold">Best Value</span>}
                                    {pkg.recommended && <span className="text-[10px] bg-primary/15 text-primary px-2 py-0.5 rounded-full font-bold">Recommended</span>}
                                </div>
                                <p className="text-sm font-semibold text-foreground">{pkg.name}</p>
                                <p className="text-xs text-muted-foreground">{pkg.providerName}</p>
                            </div>
                            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center shrink-0">
                                <Sun className="w-5 h-5 text-amber-500" />
                            </div>
                        </div>

                        <div className="text-2xl font-bold text-foreground mb-3">${pkg.price.toLocaleString()}</div>

                        <div className="grid grid-cols-2 gap-2 mb-3">
                            <div className="rounded-lg bg-secondary/50 p-2">
                                <div className="flex items-center gap-1 mb-0.5">
                                    <Zap className="w-3 h-3 text-amber-500" />
                                    <p className="text-[10px] text-muted-foreground">System Size</p>
                                </div>
                                <p className="text-xs font-bold text-foreground">{pkg.systemKW}kW</p>
                            </div>
                            <div className="rounded-lg bg-secondary/50 p-2">
                                <div className="flex items-center gap-1 mb-0.5">
                                    <TrendingUp className="w-3 h-3 text-emerald-500" />
                                    <p className="text-[10px] text-muted-foreground">Monthly Savings</p>
                                </div>
                                <p className="text-xs font-bold text-foreground">${pkg.monthlySavings}</p>
                            </div>
                            <div className="rounded-lg bg-secondary/50 p-2">
                                <div className="flex items-center gap-1 mb-0.5">
                                    <Clock className="w-3 h-3 text-blue-500" />
                                    <p className="text-[10px] text-muted-foreground">Payback Period</p>
                                </div>
                                <p className="text-xs font-bold text-foreground">{pkg.paybackMonths} months</p>
                            </div>
                            <div className="rounded-lg bg-secondary/50 p-2">
                                <div className="flex items-center gap-1 mb-0.5">
                                    <Shield className="w-3 h-3 text-primary" />
                                    <p className="text-[10px] text-muted-foreground">Warranty</p>
                                </div>
                                <p className="text-xs font-bold text-foreground">{pkg.warrantyYears} years</p>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-1">
                            <span className="text-[10px] bg-secondary px-2 py-0.5 rounded-full text-muted-foreground">{pkg.inverterBrand}</span>
                            <span className="text-[10px] bg-secondary px-2 py-0.5 rounded-full text-muted-foreground">{pkg.panelBrand}</span>
                            {pkg.batteryIncluded && <span className="text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full">Battery Included</span>}
                            <span className="text-[10px] bg-secondary px-2 py-0.5 rounded-full text-muted-foreground">{pkg.installDays}d install</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
