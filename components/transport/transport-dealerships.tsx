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
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-xl border border-border bg-card p-4">
                    <p className="text-xs text-muted-foreground">Total Dealerships</p>
                    <p className="text-2xl font-bold text-foreground">{filtered.length}</p>
                </div>
                <div className="rounded-xl border border-border bg-card p-4">
                    <p className="text-xs text-muted-foreground">Verified Dealers</p>
                    <p className="text-2xl font-bold text-foreground">{filtered.filter(d => d.verified).length}</p>
                </div>
                <div className="rounded-xl border border-border bg-card p-4">
                    <p className="text-xs text-muted-foreground">Total Stock</p>
                    <p className="text-2xl font-bold text-foreground">{filtered.reduce((s, d) => s + d.stockCount, 0)}</p>
                </div>
                <div className="rounded-xl border border-border bg-card p-4">
                    <p className="text-xs text-muted-foreground">With Financing</p>
                    <p className="text-2xl font-bold text-foreground">{filtered.filter(d => d.financingAvailable).length}</p>
                </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filtered.map(d => (
                    <div key={d.id} className="rounded-xl border border-border bg-card p-5 hover:border-primary/20 transition-colors">
                        <div className="flex items-start justify-between mb-3">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <p className="text-sm font-semibold text-foreground">{d.name}</p>
                                    {d.verified && <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />}
                                </div>
                                <p className="text-xs text-muted-foreground">{d.city} · {d.yearsActive} years active</p>
                            </div>
                            <div className="flex items-center gap-1">
                                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                                <span className="text-xs font-bold text-foreground">{d.rating}</span>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-1 mb-3">
                            {d.brands.map(b => (
                                <span key={b} className="flex items-center gap-0.5 text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
                                    <Car className="w-2.5 h-2.5" /> {b}
                                </span>
                            ))}
                        </div>

                        <div className="grid grid-cols-2 gap-2 mb-3">
                            <div className="rounded-lg bg-secondary/50 p-2 text-center">
                                <p className="text-sm font-bold text-foreground">{d.stockCount}</p>
                                <p className="text-[10px] text-muted-foreground">In Stock</p>
                            </div>
                            <div className="rounded-lg bg-secondary/50 p-2 text-center">
                                <p className="text-sm font-bold text-foreground">{d.financingAvailable ? "Yes" : "No"}</p>
                                <p className="text-[10px] text-muted-foreground">Financing</p>
                            </div>
                        </div>

                        <a href={`tel:${d.phone}`} className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors">
                            <Phone className="w-3 h-3" /> {d.phone}
                        </a>
                    </div>
                ))}
            </div>
        </div>
    )
}
