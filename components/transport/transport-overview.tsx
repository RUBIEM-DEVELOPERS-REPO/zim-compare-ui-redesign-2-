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
            <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Car className="h-24 w-24" />
                </div>
                <div className="relative z-10">
                    <p className="text-xs font-bold text-primary uppercase tracking-wider mb-1">Featured Insight</p>
                    <h2 className="text-2xl font-bold text-foreground">Simplify Your Mobility</h2>
                    <p className="text-sm text-muted-foreground mt-2 max-w-lg">
                        From finding your next car to choosing the best driving school or planning a cross-border bus trip,
                        we've aggregated the best deals in {location}.
                    </p>
                    <Disclaimer />
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {summaryCards.map((c) => (
                    <div key={c.label} className="rounded-2xl border border-border bg-card/50 p-4 backdrop-blur-sm transition-all hover:border-primary/30 group">
                        <div className="flex items-center gap-3 mb-3">
                            <div className={`p-2 rounded-lg bg-muted group-hover:bg-primary/10 transition-colors`}>
                                <c.icon className={`h-4 w-4 ${c.color}`} />
                            </div>
                            <p className="text-xs font-medium text-muted-foreground">{c.label}</p>
                        </div>
                        <p className="text-sm font-bold text-foreground">{c.value}</p>
                        <p className="text-[10px] text-primary mt-1 font-medium">{c.detail}</p>
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
                            <div key={d.id} className="flex items-center justify-between p-3 rounded-xl border border-border bg-card/30 hover:bg-card/50 transition-colors">
                                <div>
                                    <p className="text-sm font-semibold">{d.name}</p>
                                    <p className="text-xs text-muted-foreground">{d.brands.join(", ")}</p>
                                </div>
                                <div className="text-right">
                                    <div className="flex items-center gap-1 text-xs font-bold text-yellow-500">
                                        <Star className="h-3 w-3 fill-current" />
                                        {d.rating}
                                    </div>
                                    <p className="text-[10px] text-muted-foreground">{d.stockCount} vehicles</p>
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
                            <div key={r.id} className="flex items-center justify-between p-3 rounded-xl border border-border bg-card/30 hover:bg-card/50 transition-colors">
                                <div>
                                    <p className="text-sm font-semibold">{r.origin} → {r.destination}</p>
                                    <p className="text-xs text-muted-foreground">{r.providerName} &middot; {r.busType}</p>
                                </div>
                                <div className="text-right font-bold text-primary">
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
