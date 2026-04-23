"use client"

import { carDealerships, vehicles, drivingSchools, busRoutes } from "@/lib/mock/transport"
import { Disclaimer } from "@/components/disclaimer"
import { Car, GraduationCap, Bus, Calculator, MapPin, Star } from "lucide-react"

const summaryCards = [
    { label: "Best Car Deal", value: "Toyota Hilux", detail: "$42,000 - Brand New", icon: Car, color: "text-blue-500" },
    { label: "Top Rated School", value: "Pro Drive Academy", detail: "92% Pass Rate", icon: GraduationCap, color: "text-green-500" },
    { label: "Cheapest Bus Route", value: "Harare to Mutare", detail: "Only $8.00", icon: Bus, color: "text-yellow-500" },
    { label: "Most Verified Dealers", value: "Harare", detail: "4 Verified Dealerships", icon: MapPin, color: "text-red-500" },
]

interface TransportOverviewProps {
    location?: string
}

export function TransportOverview({ location = "All Locations" }: TransportOverviewProps) {
    const filteredDealers = location === "All Locations"
        ? carDealerships
        : carDealerships.filter(d => d.city === location)

    const filteredSchools = location === "All Locations"
        ? drivingSchools
        : drivingSchools.filter(s => s.city === location)

    return (
        <div className="space-y-6">
            {/* Compact Mobility Hero/Highlight */}
            <div className="glass-floating p-4 relative overflow-hidden bg-primary/5 border-primary/20 shadow-xl group teal-glow rounded-2xl">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform duration-1000">
                    <Car className="h-20 w-20 text-primary" />
                </div>
                <div className="relative z-10 flex items-center justify-between">
                    <div>
                        <p className="text-[9px] font-medium text-primary uppercase tracking-[0.3em] mb-1">{location !== "All Locations" ? `Mobility in ${location}` : "Unified Mobility"}</p>
                        <h2 className="text-xl font-display font-medium text-white tracking-tight leading-tight">Neural Mobility Engine</h2>
                    </div>
                    <div className="pt-2">
                        <Disclaimer />
                    </div>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
                {summaryCards.map((c) => (
                    <div key={c.label} className="glass-floating p-3 group h-full floating-hover rounded-xl">
                        <div className="flex items-center gap-2 mb-2.5">
                            <div className={`p-1.5 rounded-lg bg-white/5 group-hover:bg-primary/10 transition-all duration-500 shadow-inner border border-white/5 group-hover:border-primary/20`}>
                                <c.icon className={`h-3.5 w-3.5 ${c.color} group-hover:scale-110 transition-transform`} />
                            </div>
                            <p className="text-[9px] font-medium text-muted-foreground uppercase tracking-[0.2em] opacity-70 group-hover:text-primary transition-colors">{c.label}</p>
                        </div>
                        <p className="text-sm font-display font-medium text-white mt-0.5 leading-tight">{c.value}</p>
                        <p className="text-[10px] text-primary mt-1.5 font-medium tracking-widest uppercase">{c.detail}</p>
                    </div>
                ))}
            </div>

            {/* Market Highlights */}
            <div className="grid gap-3 md:grid-cols-2">
                <section className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-[9px] font-medium text-white uppercase tracking-[0.3em] opacity-70 flex items-center gap-2">
                            <Car size={12} className="text-primary" />
                            Premium Dealers: {location}
                        </h3>
                    </div>
                    <div className="space-y-2.5">
                        {filteredDealers.slice(0, 3).map((d) => (
                            <div key={d.id} className="glass-floating flex items-center justify-between p-3.5 floating-hover border-white/5 rounded-xl">
                                <div>
                                    <p className="text-xs font-display font-medium text-white uppercase leading-tight">{d.name}</p>
                                    <p className="text-[9px] font-medium text-muted-foreground uppercase tracking-[0.1em] mt-1 opacity-60 font-sans">{d.brands.join(", ")}</p>
                                </div>
                                <div className="text-right">
                                    <div className="flex items-center gap-1.5 text-[9px] font-medium text-amber-500 bg-amber-500/5 px-2.5 py-0.5 rounded-lg border border-amber-500/20 shadow-md">
                                        <Star size={9} className="fill-current" />
                                        {d.rating}
                                    </div>
                                    <p className="text-[9px] font-medium text-muted-foreground mt-1.5 uppercase tracking-widest opacity-60 font-sans">{d.stockCount} UNITS</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-[9px] font-medium text-white uppercase tracking-[0.3em] opacity-70 flex items-center gap-2">
                            <Bus size={12} className="text-primary" />
                            Intelligence Routes
                        </h3>
                    </div>
                    <div className="space-y-2.5">
                        {busRoutes.slice(0, 3).map((r) => (
                            <div key={r.id} className="glass-floating flex items-center justify-between p-3.5 floating-hover border-white/5 rounded-xl">
                                <div>
                                    <p className="text-xs font-display font-medium text-white uppercase leading-tight">{r.origin} → {r.destination}</p>
                                    <p className="text-[9px] font-medium text-muted-foreground uppercase tracking-[0.1em] mt-1 opacity-60 font-sans">{r.providerName} &middot; {r.busType}</p>
                                </div>
                                <div className="text-right">
                                    <div className="font-display font-medium text-primary text-sm bg-primary/5 px-3 py-1 rounded-lg shadow-md border border-primary/20">
                                        ${r.price}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    )
}

