"use client"

import { carDealerships } from "@/lib/mock/transport"
import { cn } from "@/lib/utils"
import { CheckCircle, Phone, Star, Car } from "lucide-react"

interface TransportDealershipsProps {
    location?: string
}

export function TransportDealerships({ location = "All Locations" }: TransportDealershipsProps) {
    const filtered = location === "All Locations"
        ? carDealerships
        : carDealerships.filter(d => d.city === location)

    return (
        <div className="space-y-4">
            <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
                <div className="glass-floating p-3 border-white/5 bg-white/5 rounded-xl">
                    <p className="text-[9px] font-medium text-muted-foreground uppercase tracking-[0.2em] mb-2 opacity-70">Total Dealers</p>
                    <p className="text-xl font-display font-medium text-white tabular-nums">{filtered.length}</p>
                </div>
                <div className="glass-floating p-3 border-white/5 bg-white/5 rounded-xl">
                    <p className="text-[9px] font-medium text-muted-foreground uppercase tracking-[0.2em] mb-2 opacity-70">Verified Units</p>
                    <p className="text-xl font-display font-medium text-primary tabular-nums">{filtered.filter(d => d.verified).length}</p>
                </div>
                <div className="glass-floating p-3 border-white/5 bg-white/5 rounded-xl">
                    <p className="text-[9px] font-medium text-muted-foreground uppercase tracking-[0.2em] mb-2 opacity-70">Aggregated Stock</p>
                    <p className="text-xl font-display font-medium text-white tabular-nums">{filtered.reduce((s, d) => s + d.stockCount, 0)}</p>
                </div>
                <div className="glass-floating p-3 border-white/5 bg-primary/5 teal-glow rounded-xl">
                    <p className="text-[9px] font-medium text-muted-foreground uppercase tracking-[0.2em] mb-2 opacity-70">Financing Enabled</p>
                    <p className="text-xl font-display font-medium text-white tabular-nums">{filtered.filter(d => d.financingAvailable).length}</p>
                </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {filtered.map(d => (
                    <div key={d.id} className="glass-floating p-4 floating-hover border-white/5 bg-white/5 rounded-xl overflow-hidden group">
                        <div className="flex items-start justify-between mb-3 relative z-10">
                            <div>
                                <div className="flex items-center gap-1.5 mb-1.5">
                                    <p className="text-sm font-display font-medium text-white uppercase tracking-tight leading-tight group-hover:text-primary transition-colors">{d.name}</p>
                                    {d.verified && <CheckCircle className="w-3.5 h-3.5 text-emerald-500 fill-emerald-500/10" />}
                                </div>
                                <p className="text-[9px] font-medium text-muted-foreground uppercase tracking-[0.1em] opacity-60 font-sans">{d.city} · {d.yearsActive} yrs active</p>
                            </div>
                            <div className="flex items-center gap-1 text-[10px] font-medium text-amber-500 bg-amber-500/5 px-2 py-0.5 rounded-lg border border-amber-500/20">
                                <Star className="w-2.5 h-2.5 fill-current" />
                                {d.rating}
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-1.5 mb-4 relative z-10">
                            {d.brands.map(b => (
                                <span key={b} className="flex items-center gap-1 text-[8px] uppercase tracking-widest bg-primary/10 text-primary px-2 py-0.5 rounded-md border border-primary/20">
                                    <Car className="w-2 h-2" /> {b}
                                </span>
                            ))}
                        </div>

                        <div className="grid grid-cols-2 gap-2.5 mb-4 relative z-10">
                            <div className="glass-floating bg-white/5 p-2 rounded-lg border-white/10 shadow-inner group-hover:bg-primary/5 transition-all text-center">
                                <p className="text-xs font-display font-medium text-white tabular-nums">{d.stockCount}</p>
                                <p className="text-[8px] font-medium text-muted-foreground uppercase tracking-widest opacity-60 mt-0.5">Stock</p>
                            </div>
                            <div className={cn("glass-floating p-2 rounded-lg border-white/10 shadow-inner group-hover:bg-primary/5 transition-all text-center", d.financingAvailable ? "border-emerald-500/20 bg-emerald-500/5" : "bg-white/5")}>
                                <p className={cn("text-xs font-display font-medium tabular-nums", d.financingAvailable ? "text-emerald-400" : "text-white")}>{d.financingAvailable ? "YES" : "NO"}</p>
                                <p className="text-[8px] font-medium text-muted-foreground uppercase tracking-widest opacity-60 mt-0.5">Credit</p>
                            </div>
                        </div>

                        <a href={`tel:${d.phone}`} className="flex items-center gap-1.5 text-[9px] font-medium text-muted-foreground hover:text-primary transition-all uppercase tracking-[0.1em] relative z-10">
                            <Phone className="w-2.5 h-2.5" /> {d.phone}
                        </a>
                    </div>
                ))}
            </div>
        </div>
    )
}

