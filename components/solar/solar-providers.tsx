"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Star, CheckCircle, Zap, Wrench } from "lucide-react"

interface SolarProvidersProps {
    location?: string
    providers?: any[]
}

const typeFilters = [
    { key: "all", label: "All" },
    { key: "solar", label: "Solar" },
    { key: "commercial", label: "Commercial" },
    { key: "residential", label: "Residential" },
]

export function SolarProviders({ location = "All Locations", providers = [] }: SolarProvidersProps) {
    const [typeFilter, setTypeFilter] = useState("all")

    const filtered = providers
        .filter((p: any) => typeFilter === "all" || p.type === typeFilter)

    return (
        <div className="space-y-4">
            <div className="flex gap-2 flex-wrap">
                {typeFilters.map(f => (
                    <button
                        key={f.key}
                        onClick={() => setTypeFilter(f.key)}
                        className={cn(
                            "glass-tab-base px-3 py-1.5 text-[10px] font-medium uppercase tracking-widest transition-all",
                            typeFilter === f.key ? "glass-tab-active" : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        {f.label}
                    </button>
                ))}
            </div>

            {filtered.length === 0 && (
                <div className="glass-card p-12 text-center">
                    <Zap className="w-10 h-10 text-primary/30 mx-auto mb-4" />
                    <p className="text-muted-foreground italic text-sm">No solar providers found for this filter.</p>
                </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
                {filtered.map((p: any) => (
                    <div key={p.id} className="glass-card p-5 hover:border-primary/40 group">
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors tracking-tight">{p.name}</p>
                                    <span className="flex items-center gap-1 text-[9px] bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full font-medium uppercase tracking-tighter border border-emerald-500/20 shadow-sm">
                                        <CheckCircle className="w-2.5 h-2.5" /> Verified
                                    </span>
                                </div>
                                <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-tight italic">{p.type}</p>
                            </div>
                            <div className="flex items-center gap-1.5 bg-amber-500/10 px-2 py-1 rounded-lg text-[10px] text-amber-500 font-medium">
                                <Star className="w-3 h-3 fill-current" />
                                {p.rating}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 mb-4">
                            <div className="rounded-xl bg-muted/30 p-2.5 text-center border border-white/5">
                                <p className="text-lg font-medium text-foreground tabular-nums">{p.installationCount ?? 0}</p>
                                <p className="text-[9px] font-medium text-muted-foreground uppercase tracking-widest">Installations</p>
                            </div>
                            <div className="rounded-xl bg-muted/30 p-2.5 text-center border border-white/5">
                                <p className="text-lg font-medium text-foreground tabular-nums">{p.warrantyYears ?? 5}yr</p>
                                <p className="text-[9px] font-medium text-muted-foreground uppercase tracking-widest">Warranty</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 pt-2 border-t border-border/40">
                            <Wrench className="w-3 h-3 text-primary/60" />
                            <p className="text-[10px] text-muted-foreground uppercase tracking-widest">DB-backed · Live Data</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

