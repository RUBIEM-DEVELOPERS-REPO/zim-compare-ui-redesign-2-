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
                        className={cn("rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
                            routeFilter === f ? "bg-primary text-primary-foreground" : "bg-secondary/50 text-muted-foreground hover:bg-secondary"
                        )}>{f}</button>
                ))}
            </div>

            <div className="grid gap-3">
                {filtered.map(route => (
                    <div key={route.id} className="rounded-xl border border-border bg-card p-4 hover:border-primary/20 transition-colors">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                                    <Bus className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-0.5">
                                        <p className="text-sm font-semibold text-foreground">{route.origin} → {route.destination}</p>
                                        {route.crossBorder && (
                                            <span className="flex items-center gap-0.5 text-[10px] bg-amber-500/15 text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded-full font-bold">
                                                <Globe className="w-2.5 h-2.5" /> Cross-Border
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-xs text-muted-foreground">{route.providerName} · {route.busType}</p>
                                    {route.borderCrossing && (
                                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                                            <MapPin className="w-2.5 h-2.5" /> via {route.borderCrossing}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center gap-4 sm:gap-6">
                                <div className="text-center">
                                    <div className="flex items-center gap-1">
                                        <DollarSign className="w-3 h-3 text-emerald-500" />
                                        <p className="text-lg font-bold text-foreground">${route.price}</p>
                                    </div>
                                    <p className="text-[10px] text-muted-foreground">per person</p>
                                </div>
                                <div className="text-center">
                                    <div className="flex items-center gap-1">
                                        <Clock className="w-3 h-3 text-muted-foreground" />
                                        <p className="text-sm font-bold text-foreground">{route.durationHours}h</p>
                                    </div>
                                    <p className="text-[10px] text-muted-foreground">duration</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-3 flex flex-wrap gap-2">
                            <div className="flex flex-wrap gap-1">
                                <span className="text-[10px] text-muted-foreground">Departures:</span>
                                {route.departureTimes.map(t => (
                                    <span key={t} className="text-[10px] bg-secondary px-1.5 py-0.5 rounded-full text-foreground font-medium">{t}</span>
                                ))}
                            </div>
                            <div className="flex flex-wrap gap-1 ml-auto">
                                {route.amenities.map(a => (
                                    <span key={a} className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">{a}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
