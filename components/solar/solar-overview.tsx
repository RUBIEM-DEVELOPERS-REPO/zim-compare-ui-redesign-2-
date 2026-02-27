"use client"

import { solarProviders, solarPackages, boreholePackages } from "@/lib/mock/solar"
import { ScoreBadge } from "@/components/score-badge"
import { Disclaimer } from "@/components/disclaimer"
import { Sun, Droplets, TrendingUp, Shield } from "lucide-react"

interface SolarOverviewProps {
    location?: string
}

const summaryCards = [
    { label: "Best Solar Value", value: "SunPower Zimbabwe", detail: "5kW system, 36-month payback", icon: Sun },
    { label: "Best Borehole", value: "AquaWell Drilling", detail: "60m depth, 1500L/hr yield", icon: Droplets },
    { label: "Fastest ROI", value: "Greenergy Solutions", detail: "Budget 2kW, 30-month payback", icon: TrendingUp },
    { label: "Best Warranty", value: "SunPower Zimbabwe", detail: "20-year panel warranty", icon: Shield },
]

export function SolarOverview({ location = "All Locations" }: SolarOverviewProps) {
    const filteredProviders = location === "All Locations"
        ? solarProviders
        : solarProviders.filter(p => p.cities.includes(location))

    const totalPackages = solarPackages.length + boreholePackages.length

    return (
        <div className="space-y-6">
            <div className="rounded-xl border border-primary/20 bg-primary/5 p-5">
                <p className="text-xs text-muted-foreground mb-1">Zimbabwe Solar & Borehole Market</p>
                <p className="text-lg font-semibold text-foreground">Go off-grid. Save money. Secure your water.</p>
                <p className="text-sm text-muted-foreground mt-1">
                    Compare <span className="text-primary font-medium">{filteredProviders.length} providers</span> and{" "}
                    <span className="text-primary font-medium">{totalPackages} packages</span> in {location}.
                </p>
                <Disclaimer />
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {summaryCards.map((c) => (
                    <div key={c.label} className="rounded-xl border border-border bg-card p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
                                <c.icon className="w-4 h-4 text-primary" />
                            </div>
                            <p className="text-xs text-muted-foreground">{c.label}</p>
                        </div>
                        <p className="text-sm font-semibold text-foreground">{c.value}</p>
                        <p className="text-xs text-primary mt-1">{c.detail}</p>
                    </div>
                ))}
            </div>

            {filteredProviders.length === 0 ? (
                <div className="rounded-2xl border-2 border-dashed border-border p-12 text-center">
                    <Sun className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-foreground mb-2">No providers in {location}</h3>
                    <p className="text-muted-foreground">Try selecting a different location or view all providers.</p>
                </div>
            ) : (
                <section>
                    <h3 className="text-sm font-semibold text-foreground mb-3">
                        Providers in {location} ({filteredProviders.length})
                    </h3>
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {filteredProviders.map((p) => (
                            <div key={p.id} className="rounded-xl border border-border bg-card p-4 hover:border-primary/20 transition-colors">
                                <div className="flex items-start justify-between mb-2">
                                    <div>
                                        <p className="text-sm font-semibold text-foreground">{p.name}</p>
                                        <p className="text-xs text-muted-foreground capitalize">{p.type === "both" ? "Solar & Borehole" : p.type}</p>
                                    </div>
                                    {p.verified && (
                                        <span className="text-[10px] bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full font-bold">✓ Verified</span>
                                    )}
                                </div>
                                <div className="flex gap-2 flex-wrap mb-2">
                                    <ScoreBadge score={p.qualityScore} label="Quality" />
                                    <ScoreBadge score={p.transparencyScore} label="Transparency" />
                                </div>
                                <p className="text-xs text-muted-foreground">{p.projectsCompleted} projects · {p.yearsActive} yrs active</p>
                            </div>
                        ))}
                    </div>
                </section>
            )}
        </div>
    )
}
