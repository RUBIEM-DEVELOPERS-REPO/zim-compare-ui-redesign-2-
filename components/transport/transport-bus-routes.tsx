"use client"

import { busRoutes } from "@/lib/mock/transport"
import { cn } from "@/lib/utils"
import { Bus, Clock, DollarSign, Globe, MapPin } from "lucide-react"
import { useState } from "react"

interface TransportBusRoutesProps {
    location?: string
}

const routeFilters = ["All Routes", "Local", "Cross-Border"]

export function TransportBusRoutes({ location = "All Locations" }: TransportBusRoutesProps) {
    const [routeFilter, setRouteFilter] = useState("All Routes")

    const filtered = busRoutes
        .filter(r => {
            if (location !== "All Locations") return r.origin === location || r.destination === location
            return true
        })
        .filter(r => {
            if (routeFilter === "Local") return !r.crossBorder
            if (routeFilter === "Cross-Border") return r.crossBorder
            return true
        })

    return (
        <div className="space-y-4">
            <div className="flex gap-2">
                {routeFilters.map(f => (
                    <button key={f} onClick={() => setRouteFilter(f)}
                        className={cn("glass-tab-base px-3 py-1.5 text-[10px] font-black uppercase tracking-widest transition-all",
                            routeFilter === f ? "glass-tab-active" : "text-muted-foreground hover:text-foreground"
                        )}>{f}</button>
                ))}
            </div>

            <div className="grid gap-3">
                {filtered.map(route => (
                    <div key={route.id} className="glass-card p-4 hover:border-primary/40 group">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 shadow-lg group-hover:scale-110 transition-transform">
                                    <Bus className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <p className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">{route.origin} → {route.destination}</p>
                                        {route.crossBorder && (
                                            <span className="flex items-center gap-1 text-[9px] bg-amber-500/20 text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded-full font-black uppercase tracking-tighter border border-amber-500/20 shadow-sm">
                                                <Globe className="w-2.5 h-2.5" /> Cross-Border
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-tight">{route.providerName} &middot; {route.busType}</p>
                                    {route.borderCrossing && (
                                        <p className="text-[10px] text-muted-foreground flex items-center gap-1 mt-1 font-medium italic">
                                            <MapPin className="w-2.5 h-2.5 text-primary" /> via {route.borderCrossing}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center gap-4 sm:gap-6 bg-muted/30 px-4 py-2 rounded-xl border border-white/5">
                                <div className="text-center">
                                    <div className="flex items-center gap-1 justify-center">
                                        <p className="text-lg font-black text-foreground tabular-nums">${route.price}</p>
                                    </div>
                                    <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">per person</p>
                                </div>
                                <div className="w-px h-8 bg-border/40" />
                                <div className="text-center">
                                    <div className="flex items-center gap-1 justify-center">
                                        <Clock className="w-3 h-3 text-primary" />
                                        <p className="text-sm font-black text-foreground tabular-nums">{route.durationHours}h</p>
                                    </div>
                                    <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">duration</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-4 pt-4 border-t border-border flex flex-wrap items-center justify-between gap-3">
                            <div className="flex flex-wrap items-center gap-1.5">
                                <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mr-1">Departures:</span>
                                {route.departureTimes.map(t => (
                                    <span key={t} className="text-[9px] bg-muted px-2 py-0.5 rounded-full text-foreground font-black tracking-tighter shadow-sm border border-border/40">{t}</span>
                                ))}
                            </div>
                            <div className="flex flex-wrap gap-1.5 ml-auto">
                                {route.amenities.map(a => (
                                    <span key={a} className="text-[9px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-black uppercase tracking-tighter border border-primary/20">{a}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
