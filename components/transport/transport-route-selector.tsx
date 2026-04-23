"use client"

import { useState } from "react"
import { busRoutes } from "@/lib/mock/transport"
import { MapPin, Calendar, Bus, Clock, DollarSign, Globe } from "lucide-react"
import { cn } from "@/lib/utils"

const zimbabweCities = ["Harare", "Bulawayo", "Mutare", "Gweru", "Masvingo", "Victoria Falls", "Chinhoyi"]
const internationalCities = ["Lusaka", "Johannesburg", "Gaborone", "Maputo"]
const allDestinations = [...zimbabweCities, ...internationalCities]
const transportTypes = ["All", "Bus", "Taxi", "Car Hire", "Private Shuttle"]

export function TransportRouteSelector() {
    const [origin, setOrigin] = useState("")
    const [destination, setDestination] = useState("")
    const [transportType, setTransportType] = useState("All")
    const [results, setResults] = useState<typeof busRoutes | null>(null)

    const search = () => {
        const found = busRoutes.filter(r => {
            const matchOrigin = !origin || r.origin === origin
            const matchDest = !destination || r.destination === destination
            return matchOrigin && matchDest
        })
        setResults(found)
    }

    return (
        <div className="space-y-4">
            <div className="glass-floating p-3 bg-primary/5 border-primary/20 shadow-xl rounded-xl group teal-glow">
                <div className="flex items-center gap-2 mb-1 relative z-10">
                    <MapPin className="w-3.5 h-3.5 text-primary" />
                    <p className="text-[10px] font-medium text-white uppercase tracking-[0.2em] opacity-70">Neural Route Selector</p>
                </div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest opacity-60 relative z-10">Strategic inter-city navigation engine.</p>
            </div>

            <div className="glass-floating p-4 border-white/5 bg-white/5 rounded-xl">
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    <div>
                        <label htmlFor="origin-select" className="text-[9px] font-medium text-muted-foreground uppercase tracking-widest mb-1 block opacity-60">Origin</label>
                        <select id="origin-select" value={origin} onChange={e => setOrigin(e.target.value)}
                            className="w-full rounded-lg border border-white/10 bg-white/5 text-[11px] text-white px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary shadow-inner">
                            <option value="" className="bg-[#0A0A0A]">Any city</option>
                            {zimbabweCities.map(c => <option key={c} className="bg-[#0A0A0A]">{c}</option>)}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="destination-select" className="text-[9px] font-medium text-muted-foreground uppercase tracking-widest mb-1 block opacity-60">Destination</label>
                        <select id="destination-select" value={destination} onChange={e => setDestination(e.target.value)}
                            className="w-full rounded-lg border border-white/10 bg-white/5 text-[11px] text-white px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary shadow-inner">
                            <option value="" className="bg-[#0A0A0A]">Any city</option>
                            {allDestinations.map(c => <option key={c} className="bg-[#0A0A0A]">{c}</option>)}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="vehicle-class-select" className="text-[9px] font-medium text-muted-foreground uppercase tracking-widest mb-1 block opacity-60">Vehicle Class</label>
                        <select id="vehicle-class-select" value={transportType} onChange={e => setTransportType(e.target.value)}
                            className="w-full rounded-lg border border-white/10 bg-white/5 text-[11px] text-white px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary shadow-inner">
                            {transportTypes.map(t => <option key={t} className="bg-[#0A0A0A]">{t}</option>)}
                        </select>
                    </div>
                    <div className="flex items-end">
                        <button onClick={search}
                            className="w-full rounded-lg bg-primary py-2 text-[10px] font-medium text-primary-foreground hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 uppercase tracking-[0.2em] teal-glow font-display">
                            Execute Search
                        </button>
                    </div>
                </div>
            </div>

            {results !== null && (
                <div className="space-y-2.5">
                    <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-[0.2em] opacity-70 mb-1">{results.length} results identified</p>
                    {results.length === 0 ? (
                        <div className="rounded-xl border border-dashed border-white/10 p-8 text-center bg-white/5">
                            <Bus className="w-8 h-8 text-muted-foreground mx-auto mb-2 opacity-50" />
                            <p className="text-[10px] text-muted-foreground uppercase tracking-widest">No matching routes in neural database.</p>
                        </div>
                    ) : (
                        results.map(route => (
                            <div key={route.id} className="glass-floating p-3.5 transition-all duration-500 relative group overflow-hidden floating-hover border-white/5 bg-white/5 rounded-xl">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <p className="text-sm font-display font-medium text-white uppercase tracking-tight group-hover:text-primary transition-colors">{route.origin} → {route.destination}</p>
                                            {route.crossBorder && (
                                                <span className="flex items-center gap-1 text-[8px] font-medium uppercase tracking-widest bg-amber-500/10 text-amber-500 px-2 py-0.5 rounded-md border border-amber-500/20">
                                                    <Globe className="w-2 h-2" /> Cross-border
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-[9px] font-medium text-muted-foreground uppercase tracking-widest opacity-60 font-sans">{route.providerName} &middot; {route.busType}</p>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="text-right">
                                            <p className="text-xl font-display font-medium text-white tabular-nums">${route.price}</p>
                                            <p className="text-[8px] font-medium text-muted-foreground uppercase tracking-widest opacity-60 mt-0.5">Price</p>
                                        </div>
                                        <div className="w-px h-8 bg-white/10" />
                                        <div className="text-center">
                                            <div className="flex items-center gap-1">
                                                <Clock className="w-3 h-3 text-primary" />
                                                <p className="text-xs font-display font-medium text-white tabular-nums">{route.durationHours}h</p>
                                            </div>
                                            <p className="text-[8px] font-medium text-muted-foreground uppercase tracking-widest opacity-60 mt-0.5">Runtime</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-3 flex flex-wrap gap-1.5 pt-3 border-t border-white/10">
                                    {route.departureTimes.map(t => (
                                        <span key={t} className="text-[8px] font-medium uppercase tracking-widest bg-white/5 text-muted-foreground px-2 py-0.5 rounded-md border border-white/10">{t}</span>
                                    ))}
                                    {route.amenities.map(a => (
                                        <span key={a} className="text-[8px] font-medium uppercase tracking-widest bg-primary/10 text-primary px-2 py-0.5 rounded-md border border-primary/20">{a}</span>
                                    ))}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    )
}

