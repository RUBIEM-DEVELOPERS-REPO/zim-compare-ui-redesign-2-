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
            {/* Highlight Section */}
            <div className="glass-panel p-6 relative overflow-hidden bg-primary/5 border-primary/20 shadow-xl">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Car className="h-24 w-24 text-primary" />
                </div>
                <div className="relative z-10">
                    <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-2 px-2 py-1 bg-primary/10 rounded-full inline-block">Featured Insight</p>
                    <h2 className="text-2xl font-bold text-foreground tracking-tight">Simplify Your Mobility</h2>
                    <p className="text-sm text-muted-foreground mt-2 max-w-lg leading-relaxed">
                        From finding your next car to choosing the best driving school or planning a cross-border bus trip,
                        we've aggregated the best deals in {location}.
                    </p>
                    <Disclaimer />
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {summaryCards.map((c) => (
                    <div key={c.label} className="glass-card p-4 group h-full">
                        <div className="flex items-center gap-3 mb-3">
                            <div className={`p-2 rounded-xl bg-muted/50 group-hover:bg-primary/10 transition-colors shadow-inner`}>
                                <c.icon className={`h-4 w-4 ${c.color}`} />
                            </div>
                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-wider">{c.label}</p>
                        </div>
                        <p className="text-sm font-bold text-foreground">{c.value}</p>
                        <p className="text-[10px] text-primary mt-1 font-black uppercase tracking-tighter">{c.detail}</p>
                    </div>
                ))}
            </div>

            {/* Market Highlights */}
            <div className="grid gap-6 md:grid-cols-2">
                <section className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                            <Car className="h-4 w-4 text-primary" />
                            Top Dealerships in {location}
                        </h3>
                    </div>
                    <div className="space-y-3">
                        {filteredDealers.slice(0, 3).map((d) => (
                            <div key={d.id} className="glass-card flex items-center justify-between p-4 hover:border-primary/40">
                                <div>
                                    <p className="text-sm font-bold text-foreground">{d.name}</p>
                                    <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-tight">{d.brands.join(", ")}</p>
                                </div>
                                <div className="text-right">
                                    <div className="flex items-center gap-1 text-xs font-black text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full">
                                        <Star className="h-3 w-3 fill-current" />
                                        {d.rating}
                                    </div>
                                    <p className="text-[10px] font-bold text-muted-foreground mt-1 uppercase tracking-tighter">{d.stockCount} vehicles</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                            <Bus className="h-4 w-4 text-primary" />
                            Popular Bus Routes
                        </h3>
                    </div>
                    <div className="space-y-3">
                        {busRoutes.slice(0, 3).map((r) => (
                            <div key={r.id} className="glass-card flex items-center justify-between p-4 hover:border-primary/40">
                                <div>
                                    <p className="text-sm font-bold text-foreground">{r.origin} → {r.destination}</p>
                                    <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-tight">{r.providerName} &middot; {r.busType}</p>
                                </div>
                                <div className="text-right font-black text-primary text-sm bg-primary/10 px-3 py-1 rounded-lg">
                                    ${r.price}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    )
}
