"use client"

import { useState } from "react"
import { vehicles } from "@/lib/mock/transport"
import { cn } from "@/lib/utils"
import { Car, Fuel, Settings, DollarSign, Check, Plus, AlertCircle, Sparkles, ChevronLeft } from "lucide-react"
import { useAppStore } from "@/lib/store"
import { useI18n } from "@/lib/i18n"

interface TransportVehiclesProps {
    location?: string
}

const fuelFilters = ["All", "Petrol", "Diesel", "Hybrid", "Electric"]
const conditionFilters = ["All", "New", "Used"]
const sortOptions = ["Price: Low to High", "Price: High to Low", "Newest First", "Best Value"]

const fuelColors: Record<string, string> = {
    petrol: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    diesel: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    hybrid: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    electric: "bg-primary/10 text-primary",
}

export function TransportVehicles({ location = "All Locations" }: TransportVehiclesProps) {
    const { compareTray, addToCompareTray, removeFromCompareTray } = useAppStore()
    const { t } = useI18n()
    const [fuelFilter, setFuelFilter] = useState("All")
    const [conditionFilter, setConditionFilter] = useState("All")
    const [sortBy, setSortBy] = useState("Price: Low to High")
    const [error, setError] = useState<string | null>(null)

    const filtered = vehicles
        .filter(v => fuelFilter === "All" || v.fuelType === fuelFilter.toLowerCase())
        .filter(v => conditionFilter === "All" || v.condition === conditionFilter.toLowerCase())
        .filter(v => location === "All Locations" || v.location === location)

    const sorted = [...filtered].sort((a, b) => {
        if (sortBy === "Price: High to Low") return b.price - a.price
        if (sortBy === "Newest First") return b.year - a.year
        if (sortBy === "Best Value") return (b.bestValue ? 1 : 0) - (a.bestValue ? 1 : 0)
        return a.price - b.price
    })

    const handleCompare = (e: React.MouseEvent, id: string) => {
        e.stopPropagation()
        const isSelected = compareTray.ids.includes(id)
        if (isSelected) {
            removeFromCompareTray(id)
        } else {
            if (compareTray.ids.length >= 3) {
                setError("You can only compare up to 3 vehicles.")
                setTimeout(() => setError(null), 3000)
                return
            }
            addToCompareTray("mobility", id, "cars")
        }
    }

    // Recommendation logic: Similar cars based on price/fuel
    const recommendations = sorted.length > 0 ? vehicles
        .filter(v => !compareTray.ids.includes(v.id)) // Not currently selected
        .filter(v => v.fuelType === fuelFilter.toLowerCase() || fuelFilter === "All")
        .filter(v => Math.abs(v.price - (sorted[0]?.price || 0)) < 15000)
        .slice(0, 3) : []

    return (
        <div className="space-y-4">
            <div className="flex flex-col gap-2">
                <div className="flex flex-wrap gap-2 items-center justify-between">
                <div className="flex flex-wrap gap-3 items-center justify-between">
                    <div className="flex gap-1.5 flex-wrap bg-white/5 p-1 rounded-xl border border-white/10 shadow-inner">
                        {fuelFilters.map(f => (
                            <button key={f} onClick={() => setFuelFilter(f)}
                                className={cn("px-2.5 py-1.5 rounded-lg text-[9px] font-medium uppercase tracking-[0.2em] transition-all duration-500",
                                    fuelFilter === f 
                                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-[1.02]" 
                                        : "text-muted-foreground hover:text-white hover:bg-white/5"
                                )}>{f}</button>
                        ))}
                    </div>
                    <div className="flex gap-1.5 flex-wrap bg-white/5 p-1 rounded-xl border border-white/10 shadow-inner">
                        {conditionFilters.map(f => (
                            <button key={f} onClick={() => setConditionFilter(f)}
                                className={cn("px-2.5 py-1.5 rounded-lg text-[9px] font-medium uppercase tracking-[0.2em] transition-all duration-500",
                                    conditionFilter === f 
                                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-[1.02]" 
                                        : "text-muted-foreground hover:text-white hover:bg-white/5"
                                )}>{f}</button>
                        ))}
                    </div>
                    <div className="relative">
                        <select 
                            value={sortBy} 
                            onChange={e => setSortBy(e.target.value)}
                            className="glass-floating text-[9px] font-medium uppercase tracking-[0.15em] text-primary/80 px-4 py-1.5 focus:outline-none cursor-pointer bg-primary/5 border-primary/20 hover:bg-primary/10 transition-all appearance-none outline-none ring-0 shadow-xl teal-glow pr-8"
                            title="Sort Logic"
                        >
                            {sortOptions.map(o => <option key={o} className="bg-[#0A0A0A] text-white">{o}</option>)}
                        </select>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-primary/60">
                            <ChevronLeft size={12} className="-rotate-90" />
                        </div>
                    </div>
                </div>
                </div>
            </div>

            {/* Empty State */}
            {sorted.length === 0 && (
                <div className="text-center py-20 bg-secondary/20 rounded-2xl border border-dashed border-border group transition-all hover:bg-secondary/30">
                    <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                        <Car className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-medium text-foreground mb-2">
                        {fuelFilter === "Electric" ? "No electric cars available for this selection" : "No vehicles found"}
                    </h3>
                    <p className="text-sm text-muted-foreground">Try adjusting your filters or location to see more options.</p>
                </div>
            )}

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {sorted.map(v => (
                    <div key={v.id}
                        className={cn("glass-floating p-4 flex flex-col transition-all duration-500 relative group overflow-hidden floating-hover border-white/5 rounded-xl",
                            compareTray.ids.includes(v.id)
                                ? "border-primary/40 bg-primary/5 teal-glow shadow-xl shadow-primary/5"
                                : "border-white/5 hover:-translate-y-1.5"
                        )}
                        onClick={(e) => handleCompare(e, v.id)}>

                        <div className="absolute top-0 right-0 p-3 text-primary/5 -rotate-12 group-hover:rotate-0 transition-transform duration-1000">
                            <Car size={60} />
                        </div>

                        {/* Error Toast locally */}
                        {error && compareTray.ids.length >= 3 && !compareTray.ids.includes(v.id) && (
                            <div className="absolute top-1.5 left-1.5 right-1.5 bg-destructive text-white text-[9px] font-medium px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 z-20 animate-in fade-in slide-in-from-top-1 shadow-lg">
                                <AlertCircle size={10} strokeWidth={3} />
                                {error}
                            </div>
                        )}

                        <div className="flex items-start justify-between mb-4 relative z-10">
                            <div>
                                <div className="flex items-center gap-1.5 mb-2">
                                    {v.bestValue && <span className="text-[8px] font-medium uppercase tracking-widest bg-amber-500/10 text-amber-500 px-2 py-0.5 rounded-md border border-amber-500/20 shadow-inner">Best Value</span>}
                                    <span className="text-[8px] font-medium uppercase tracking-widest bg-primary/10 text-primary px-2 py-0.5 rounded-md border border-primary/20 shadow-inner">{v.location}</span>
                                </div>
                                <p className="text-base font-display font-medium text-white group-hover:text-primary transition-colors uppercase tracking-tight leading-tight">{v.make} {v.model}</p>
                                <p className="text-[9px] font-medium text-muted-foreground uppercase mt-1.5 tracking-[0.1em] opacity-60 font-sans">{v.dealershipName}</p>
                            </div>
                            <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-all shadow-lg teal-glow",
                                compareTray.ids.includes(v.id) ? "bg-primary text-white scale-110" : "bg-white/5 border border-white/10 group-hover:bg-primary/20 group-hover:border-primary/30"
                            )}>
                                {compareTray.ids.includes(v.id) ? <Check className="w-4 h-4" strokeWidth={4} /> : <Car className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />}
                            </div>
                        </div>

                        <div className="text-2xl font-display font-medium text-white mb-4 relative z-10 tabular-nums">${v.price.toLocaleString()}</div>

                        <div className="grid grid-cols-2 gap-2.5 mb-4 relative z-10">
                            <div className="glass-floating bg-white/5 p-2 rounded-lg border-white/10 shadow-inner group-hover:bg-primary/5 group-hover:border-primary/20 transition-all duration-500">
                                <p className="text-[8px] font-medium text-muted-foreground uppercase tracking-widest mb-1 opacity-60">Year</p>
                                <p className="text-xs font-display font-medium text-white">{v.year}</p>
                            </div>
                            <div className="glass-floating bg-white/5 p-2 rounded-lg border-white/10 shadow-inner group-hover:bg-primary/5 group-hover:border-primary/20 transition-all duration-500">
                                <div className="flex items-center gap-1 mb-1 opacity-60">
                                    <Fuel className="w-2 h-2 text-muted-foreground" />
                                    <p className="text-[8px] font-medium text-muted-foreground uppercase tracking-widest">Fuel</p>
                                </div>
                                <p className={`text-[8px] font-medium px-2 py-0.5 rounded-md inline-block uppercase tracking-widest ${fuelColors[v.fuelType]}`}>{v.fuelType}</p>
                            </div>
                            <div className="glass-floating bg-white/5 p-2 rounded-lg border-white/10 shadow-inner group-hover:bg-primary/5 group-hover:border-primary/20 transition-all duration-500">
                                <div className="flex items-center gap-1 mb-1 opacity-60">
                                    <Settings className="w-2 h-2 text-muted-foreground" />
                                    <p className="text-[8px] font-medium text-muted-foreground uppercase tracking-widest">Engine</p>
                                </div>
                                <p className="text-xs font-display font-medium text-white">{v.engineCC}cc</p>
                            </div>
                            <div className="glass-floating bg-white/5 p-2 rounded-lg border-white/10 shadow-inner group-hover:bg-primary/5 group-hover:border-primary/20 transition-all duration-500">
                                <p className="text-[8px] font-medium text-muted-foreground uppercase tracking-widest mb-1 opacity-60">Mileage</p>
                                <p className="text-xs font-display font-medium text-white">{v.mileage === 0 ? "New" : `${v.mileage.toLocaleString()}km`}</p>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-1.5 pt-4 border-t border-white/10 mt-auto relative z-10">
                            <span className="text-[8px] font-medium uppercase tracking-widest bg-white/5 text-muted-foreground px-2 py-0.5 rounded-md border border-white/10">{v.transmission}</span>
                            <span className="text-[8px] font-medium uppercase tracking-widest bg-white/5 text-muted-foreground px-2 py-0.5 rounded-md border border-white/10">{v.color}</span>
                            {v.financingAvailable && <span className="text-[8px] font-medium uppercase tracking-widest bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-md border border-emerald-500/20">Financing</span>}
                            <span className={`text-[8px] font-medium uppercase tracking-widest px-2 py-0.5 rounded-md ${v.condition === "new" ? "bg-primary text-primary-foreground teal-glow" : "bg-white/5 text-muted-foreground border border-white/10"}`}>{v.condition}</span>
                        </div>

                        {/* Compare Button Toggle */}
                        <div className="mt-4 flex items-center justify-between relative z-10">
                            <span className="text-[8px] font-medium text-muted-foreground uppercase tracking-[0.2em] opacity-60">{v.mileage === 0 ? "Direct Import" : "Local Certified"}</span>
                            <button
                                onClick={(e) => handleCompare(e, v.id)}
                                className={cn(
                                    "flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-[9px] font-medium uppercase tracking-widest transition-all duration-500",
                                    compareTray.ids.includes(v.id)
                                        ? "bg-white/5 text-muted-foreground border border-white/10"
                                        : "bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:scale-[1.05] active:scale-95 teal-glow"
                                )}
                            >
                                {compareTray.ids.includes(v.id) ? (
                                    <>
                                        <Check size={10} strokeWidth={4} />
                                        <span>Added</span>
                                    </>
                                ) : (
                                    <>
                                        <Plus size={10} strokeWidth={4} />
                                        <span>Compare</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {recommendations.length > 0 && (
                <div className="mt-16 glass-floating p-8 animate-in fade-in duration-1000 bg-primary/5 border-primary/20 teal-glow relative overflow-hidden">
                    <div className="absolute -top-10 -right-10 text-primary/10 rotate-12 pointer-events-none">
                        <Sparkles size={160} />
                    </div>
                    <div className="flex items-center gap-3 mb-8 relative z-10">
                        <div className="p-2.5 bg-primary/10 rounded-xl shadow-inner border border-primary/20">
                            <Sparkles className="w-5 h-5 text-primary fill-primary/20" />
                        </div>
                        <h3 className="text-[10px] font-medium uppercase tracking-[0.3em] text-white">Neural Recommendations</h3>
                    </div>
                    <div className="grid gap-6 sm:grid-cols-3 relative z-10">
                        {recommendations.map(r => (
                            <div key={r.id}
                                onClick={(e) => handleCompare(e, r.id)}
                                className="glass-floating flex items-center gap-4 p-4 cursor-pointer group/rec floating-hover border-white/5 bg-white/5 hover:bg-primary/10 hover:border-primary/20 transition-all duration-500">
                                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center shrink-0 shadow-inner group-hover/rec:bg-primary/20 transition-all duration-500">
                                    <Car className="w-6 h-6 text-muted-foreground group-hover/rec:text-primary transition-colors" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-display font-medium text-white group-hover/rec:text-primary transition-colors truncate">{r.make} {r.model}</p>
                                    <p className="text-[10px] text-primary font-medium tracking-widest mt-1 uppercase">${r.price.toLocaleString()}</p>
                                </div>
                                <div className={cn("w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500 shadow-xl",
                                    compareTray.ids.includes(r.id) ? "bg-primary text-white scale-110" : "bg-primary/10 text-primary group-hover/rec:bg-primary/20"
                                )}>
                                    {compareTray.ids.includes(r.id) ? <Check size={14} strokeWidth={4} /> : <Plus size={14} strokeWidth={4} />}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

