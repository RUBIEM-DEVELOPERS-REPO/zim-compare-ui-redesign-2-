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
        <div className="space-y-6">
            <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
                <div className="flex items-center gap-2 mb-1">
                    <MapPin className="w-4 h-4 text-primary" />
                    <p className="text-sm font-semibold text-foreground">Route Selector</p>
                </div>
                <p className="text-xs text-muted-foreground">Find transport options between any two cities in Zimbabwe or internationally.</p>
            </div>

            <div className="rounded-xl border border-border bg-card p-5">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div>
                        <label className="text-xs text-muted-foreground mb-1.5 block">From</label>
                        <select value={origin} onChange={e => setOrigin(e.target.value)}
                            className="w-full rounded-lg border border-border bg-secondary text-sm text-foreground px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary">
                            <option value="">Any city</option>
                            {zimbabweCities.map(c => <option key={c}>{c}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="text-xs text-muted-foreground mb-1.5 block">To</label>
                        <select value={destination} onChange={e => setDestination(e.target.value)}
                            className="w-full rounded-lg border border-border bg-secondary text-sm text-foreground px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary">
                            <option value="">Any city</option>
                            {allDestinations.map(c => <option key={c}>{c}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="text-xs text-muted-foreground mb-1.5 block">Transport Type</label>
                        <select value={transportType} onChange={e => setTransportType(e.target.value)}
                            className="w-full rounded-lg border border-border bg-secondary text-sm text-foreground px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary">
                            {transportTypes.map(t => <option key={t}>{t}</option>)}
                        </select>
                    </div>
                    <div className="flex items-end">
                        <button onClick={search}
                            className="w-full rounded-lg bg-primary py-2.5 text-sm font-bold text-primary-foreground hover:bg-primary/90 transition-colors">
                            Search Routes
                        </button>
                    </div>
                </div>
            </div>

            {results !== null && (
                <div className="space-y-3">
                    <p className="text-sm font-medium text-foreground">{results.length} route{results.length !== 1 ? "s" : ""} found</p>
                    {results.length === 0 ? (
                        <div className="rounded-2xl border-2 border-dashed border-border p-12 text-center">
                            <Bus className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                            <p className="text-muted-foreground">No routes found for this combination. Try different cities.</p>
                        </div>
                    ) : (
                        results.map(route => (
                            <div key={route.id} className="rounded-xl border border-border bg-card p-4 hover:border-primary/20 transition-colors">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <p className="text-sm font-semibold text-foreground">{route.origin} → {route.destination}</p>
                                            {route.crossBorder && (
                                                <span className="flex items-center gap-0.5 text-[10px] bg-amber-500/15 text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded-full font-bold">
                                                    <Globe className="w-2.5 h-2.5" /> Cross-Border
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-xs text-muted-foreground">{route.providerName} · {route.busType}</p>
                                        {route.borderCrossing && <p className="text-xs text-muted-foreground mt-0.5">via {route.borderCrossing}</p>}
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="text-center">
                                            <p className="text-lg font-bold text-foreground">${route.price}</p>
                                            <p className="text-[10px] text-muted-foreground">per person</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-sm font-bold text-foreground">{route.durationHours}h</p>
                                            <p className="text-[10px] text-muted-foreground">duration</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-2 flex flex-wrap gap-1">
                                    {route.departureTimes.map(t => (
                                        <span key={t} className="text-[10px] bg-secondary px-1.5 py-0.5 rounded-full text-foreground">{t}</span>
                                    ))}
                                    {route.amenities.map(a => (
                                        <span key={a} className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">{a}</span>
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
