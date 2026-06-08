"use client"

import { busRoutes } from "@/lib/mock/transport"
import { cn } from "@/lib/utils"
import { Bus, Clock, DollarSign, Globe, MapPin } from "lucide-react"
import { useState } from "react"

const fallbackBusRoutes = [
  {
    id: "br-intercape-byo",
    origin: "Harare",
    destination: "Bulawayo",
    providerName: "Intercape Pathfinder",
    busType: "Luxury Coach",
    crossBorder: false,
    borderCrossing: null,
    price: 25,
    durationHours: 6,
    departureTimes: ["06:00 AM", "02:00 PM"],
    amenities: ["WiFi", "AC", "Charging", "Refreshments"]
  },
  {
    id: "br-tenda-mutare",
    origin: "Harare",
    destination: "Mutare",
    providerName: "Tenda Bus Service",
    busType: "Standard Coach",
    crossBorder: false,
    borderCrossing: null,
    price: 15,
    durationHours: 4,
    departureTimes: ["07:00 AM", "11:00 AM", "03:00 PM"],
    amenities: ["AC", "Refreshments"]
  },
  {
    id: "br-greyhound-joburg",
    origin: "Harare",
    destination: "Johannesburg",
    providerName: "Greyhound Zimbabwe",
    busType: "Super Luxury",
    crossBorder: true,
    borderCrossing: "Beitbridge",
    price: 50,
    durationHours: 16,
    departureTimes: ["08:00 AM", "05:00 PM"],
    amenities: ["WiFi", "AC", "Reclining Seats", "Charging", "Meals"]
  }
]

interface TransportBusRoutesProps {
    location?: string
    routes?: any[]
}

const routeFilters = ["All Routes", "Local", "Cross-Border"]

export function TransportBusRoutes({ location = "All Locations", routes = [] }: TransportBusRoutesProps) {
    const [routeFilter, setRouteFilter] = useState("All Routes")

    const rawRoutes = routes.length > 0 ? routes : fallbackBusRoutes
    
    // Parse departureTimes and amenities if they are JSON strings from the database
    const activeRoutes = rawRoutes.map(r => ({
      ...r,
      departureTimes: typeof r.departureTimes === 'string' ? JSON.parse(r.departureTimes) : r.departureTimes,
      amenities: typeof r.amenities === 'string' ? JSON.parse(r.amenities) : r.amenities
    }))

    const filtered = activeRoutes
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
            <div className="flex gap-1.5 bg-white/5 p-1 rounded-xl border border-white/10 shadow-inner w-fit">
                {routeFilters.map(f => (
                    <button key={f} onClick={() => setRouteFilter(f)}
                        className={cn("px-3 py-1.5 rounded-lg text-[9px] font-medium uppercase tracking-[0.2em] transition-all duration-500",
                            routeFilter === f 
                                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-[1.02]" 
                                : "text-muted-foreground hover:text-white hover:bg-white/5"
                        )}>{f}</button>
                ))}
            </div>

            <div className="grid gap-2.5">
                {filtered.map(route => (
                    <div key={route.id} className="glass-floating p-4 transition-all duration-500 relative group overflow-hidden floating-hover border-white/5 bg-white/5 rounded-xl">
                        <div className="absolute top-0 right-0 p-3 text-primary/5 -rotate-12 group-hover:rotate-0 transition-transform duration-1000">
                            <Bus size={60} />
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0 shadow-lg group-hover:scale-110 transition-all duration-500 teal-glow">
                                    <Bus className="w-4 h-4 text-primary" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <p className="text-base font-display font-medium text-white group-hover:text-primary transition-colors uppercase tracking-tight leading-tight">{route.origin} → {route.destination}</p>
                                        {route.crossBorder && (
                                            <span className="flex items-center gap-1.5 text-[8px] font-medium uppercase tracking-widest bg-amber-500/10 text-amber-500 px-2 py-0.5 rounded-md border border-amber-500/20 shadow-inner">
                                                <Globe className="w-2.5 h-2.5" /> Cross-Border
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-[9px] font-medium text-muted-foreground uppercase tracking-[0.2em] opacity-60 font-sans">{route.providerName} &middot; {route.busType}</p>
                                    {route.borderCrossing && (
                                        <p className="text-[9px] text-primary/80 flex items-center gap-1 mt-1 font-medium uppercase tracking-widest">
                                            <MapPin className="w-2.5 h-2.5 text-primary" /> via {route.borderCrossing}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center gap-4 bg-white/5 px-4 py-2.5 rounded-xl border border-white/10 shadow-inner group-hover:bg-primary/5 transition-colors duration-500">
                                <div className="text-center">
                                    <p className="text-xl font-display font-medium text-white tabular-nums">${route.price}</p>
                                    <p className="text-[8px] font-medium text-muted-foreground uppercase tracking-widest opacity-60 mt-0.5">per person</p>
                                </div>
                                <div className="w-px h-8 bg-white/10" />
                                <div className="text-center">
                                    <div className="flex items-center gap-1 justify-center">
                                        <Clock className="w-3 h-3 text-primary" />
                                        <p className="text-sm font-display font-medium text-white tabular-nums">{route.durationHours}h</p>
                                    </div>
                                    <p className="text-[8px] font-medium text-muted-foreground uppercase tracking-widest opacity-60 mt-0.5">duration</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-4 pt-3.5 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 relative z-10">
                            <div className="flex flex-wrap items-center gap-1.5">
                                <span className="text-[8px] font-medium text-muted-foreground uppercase tracking-[0.2em] opacity-60 mr-1.5">Intervals:</span>
                                {route.departureTimes.map(t => (
                                    <span key={t} className="text-[8px] font-medium uppercase tracking-widest bg-white/5 text-white px-2 py-0.5 rounded-md border border-white/10 shadow-inner">{t}</span>
                                ))}
                            </div>
                            <div className="flex flex-wrap gap-1.5 sm:ml-auto">
                                {route.amenities.map(a => (
                                    <span key={a} className="text-[8px] font-medium uppercase tracking-widest bg-primary/10 text-primary px-2 py-0.5 rounded-md border border-primary/20">{a}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

