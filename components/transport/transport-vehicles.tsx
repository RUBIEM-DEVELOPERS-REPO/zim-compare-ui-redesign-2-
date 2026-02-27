"use client"

import { useState } from "react"
import { vehicles } from "@/lib/mock/transport"
import { cn } from "@/lib/utils"
import { Car, Fuel, Settings, DollarSign, Check, Plus, AlertCircle, Sparkles } from "lucide-react"
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
            <div className="flex flex-col gap-3">
                <div className="flex flex-wrap gap-2 items-center justify-between">
                    <div className="flex gap-2 flex-wrap">
                        {fuelFilters.map(f => (
                            <button key={f} onClick={() => setFuelFilter(f)}
                                className={cn("rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
                                    fuelFilter === f ? "bg-primary text-primary-foreground" : "bg-secondary/50 text-muted-foreground hover:bg-secondary"
                                )}>{f}</button>
                        ))}
                    </div>
                    <div className="flex gap-2">
                        {conditionFilters.map(f => (
                            <button key={f} onClick={() => setConditionFilter(f)}
                                className={cn("rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
                                    conditionFilter === f ? "bg-primary text-primary-foreground" : "bg-secondary/50 text-muted-foreground hover:bg-secondary"
                                )}>{f}</button>
                        ))}
                    </div>
                    <select value={sortBy} onChange={e => setSortBy(e.target.value)}
                        className="rounded-lg border border-border bg-secondary text-xs text-foreground px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary">
                        {sortOptions.map(o => <option key={o}>{o}</option>)}
                    </select>
                </div>
            </div>

            {/* Empty State */}
            {sorted.length === 0 && (
                <div className="text-center py-20 bg-secondary/20 rounded-2xl border border-dashed border-border group transition-all hover:bg-secondary/30">
                    <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                        <Car className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-bold text-foreground mb-2">
                        {fuelFilter === "Electric" ? "No electric cars available for this selection" : "No vehicles found"}
                    </h3>
                    <p className="text-sm text-muted-foreground">Try adjusting your filters or location to see more options.</p>
                </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {sorted.map(v => (
                    <div key={v.id}
                        className={cn("rounded-xl border bg-card p-4 transition-all duration-300 relative group overflow-hidden",
                            compareTray.ids.includes(v.id)
                                ? "border-primary bg-primary/5 shadow-lg shadow-primary/5 ring-1 ring-primary/20"
                                : "border-border hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1"
                        )}
                        onClick={(e) => handleCompare(e, v.id)}>

                        {/* Error Toast locally */}
                        {error && compareTray.ids.length >= 3 && !compareTray.ids.includes(v.id) && (
                            <div className="absolute top-2 left-2 right-2 bg-destructive text-white text-[10px] font-bold px-2 py-1 rounded flex items-center gap-1 z-20 animate-in fade-in slide-in-from-top-1">
                                <AlertCircle size={10} />
                                {error}
                            </div>
                        )}

                        <div className="flex items-start justify-between mb-2">
                            <div>
                                <div className="flex items-center gap-1.5 mb-1">
                                    {v.bestValue && <span className="text-[10px] bg-amber-500/15 text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded-full font-bold">Best Value</span>}
                                    <span className="text-[9px] bg-secondary text-muted-foreground px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">{v.location}</span>
                                </div>
                                <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">{v.make} {v.model}</p>
                                <p className="text-[11px] text-muted-foreground">{v.dealershipName}</p>
                            </div>
                            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all",
                                compareTray.ids.includes(v.id) ? "bg-primary text-white" : "bg-secondary group-hover:bg-primary/10 group-hover:text-primary"
                            )}>
                                {compareTray.ids.includes(v.id) ? <Check className="w-5 h-5" strokeWidth={3} /> : <Car className="w-5 h-5 text-muted-foreground group-hover:text-primary" />}
                            </div>
                        </div>

                        <div className="text-2xl font-bold text-foreground mb-3">${v.price.toLocaleString()}</div>

                        <div className="grid grid-cols-2 gap-2 mb-3">
                            <div className="rounded-lg bg-secondary/50 p-2">
                                <p className="text-[10px] text-muted-foreground">Year</p>
                                <p className="text-xs font-bold text-foreground">{v.year}</p>
                            </div>
                            <div className="rounded-lg bg-secondary/50 p-2">
                                <div className="flex items-center gap-1">
                                    <Fuel className="w-2.5 h-2.5 text-muted-foreground" />
                                    <p className="text-[10px] text-muted-foreground">Fuel</p>
                                </div>
                                <p className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full inline-block mt-0.5 ${fuelColors[v.fuelType]}`}>{v.fuelType}</p>
                            </div>
                            <div className="rounded-lg bg-secondary/50 p-2">
                                <div className="flex items-center gap-1">
                                    <Settings className="w-2.5 h-2.5 text-muted-foreground" />
                                    <p className="text-[10px] text-muted-foreground">Engine</p>
                                </div>
                                <p className="text-xs font-bold text-foreground">{v.engineCC}cc</p>
                            </div>
                            <div className="rounded-lg bg-secondary/50 p-2">
                                <p className="text-[10px] text-muted-foreground">Mileage</p>
                                <p className="text-xs font-bold text-foreground">{v.mileage === 0 ? "New" : `${v.mileage.toLocaleString()}km`}</p>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-1">
                            <span className="text-[10px] bg-secondary px-2 py-0.5 rounded-full text-muted-foreground capitalize">{v.transmission}</span>
                            <span className="text-[10px] bg-secondary px-2 py-0.5 rounded-full text-muted-foreground">{v.color}</span>
                            {v.financingAvailable && <span className="text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full">Financing</span>}
                            <span className={`text-[10px] px-2 py-0.5 rounded-full capitalize ${v.condition === "new" ? "bg-primary text-primary-foreground font-bold" : "bg-secondary text-muted-foreground"}`}>{v.condition}</span>
                        </div>

                        {/* Compare Button Toggle */}
                        <div className="mt-4 pt-3 border-t border-border flex items-center justify-between">
                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{v.mileage === 0 ? "Brand New" : "Certified Pre-Owned"}</span>
                            <button
                                onClick={(e) => handleCompare(e, v.id)}
                                className={cn(
                                    "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all",
                                    compareTray.ids.includes(v.id)
                                        ? "bg-primary text-white shadow-lg shadow-primary/20"
                                        : "bg-primary/10 text-primary hover:bg-primary/20"
                                )}
                            >
                                {compareTray.ids.includes(v.id) ? (
                                    <>
                                        <Check size={12} strokeWidth={3} />
                                        <span>Added</span>
                                    </>
                                ) : (
                                    <>
                                        <Plus size={12} strokeWidth={3} />
                                        <span>Add</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Recommendations */}
            {recommendations.length > 0 && (
                <div className="mt-12 rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5 p-6 animate-in fade-in duration-700">
                    <div className="flex items-center gap-2 mb-4 text-primary">
                        <Sparkles className="w-5 h-5 fill-current" />
                        <h3 className="text-sm font-bold uppercase tracking-tight">Smart Recommendations</h3>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-3">
                        {recommendations.map(r => (
                            <div key={r.id}
                                onClick={(e) => handleCompare(e, r.id)}
                                className="rounded-xl border border-border bg-card p-3 cursor-pointer hover:border-primary/30 transition-all flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                                    <Car className="w-5 h-5 text-muted-foreground" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-bold text-foreground truncate">{r.make} {r.model}</p>
                                    <p className="text-[10px] text-teal-600 font-bold">${r.price.toLocaleString()}</p>
                                </div>
                                <div className={cn("w-6 h-6 rounded-full flex items-center justify-center",
                                    compareTray.ids.includes(r.id) ? "bg-primary text-white" : "bg-primary/10 text-primary"
                                )}>
                                    {compareTray.ids.includes(r.id) ? <Check size={12} strokeWidth={3} /> : <Plus size={12} strokeWidth={3} />}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
