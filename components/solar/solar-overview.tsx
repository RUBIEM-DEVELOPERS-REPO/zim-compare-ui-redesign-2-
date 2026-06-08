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
            <div className="glass-panel p-6 bg-primary/5 border-primary/20 shadow-xl overflow-hidden relative">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Sun className="h-24 w-24 text-primary" />
                </div>
                <div className="relative z-10 font-medium">
                    <p className="text-[10px] font-medium text-primary uppercase tracking-widest mb-2 px-2 py-1 bg-primary/10 rounded-full inline-block">Zimbabwe Solar & Borehole Market</p>
                    <h2 className="text-2xl font-medium text-foreground tracking-tight">Go off-grid. Save money. Secure your water.</h2>
                    <p className="text-sm text-muted-foreground mt-2 max-w-lg leading-relaxed">
                        Compare <span className="text-primary font-medium uppercase tracking-tighter">{filteredProviders.length} providers</span> and{" "}
                        <span className="text-primary font-medium uppercase tracking-tighter">{totalPackages} packages</span> in {location}.
                    </p>
                    <Disclaimer />
                </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {summaryCards.map((c) => (
                    <div key={c.label} className="glass-card p-4 group">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-8 h-8 rounded-xl bg-muted/50 group-hover:bg-primary/10 flex items-center justify-center shadow-inner transition-colors">
                                <c.icon className="w-4.5 h-4.5 text-primary" />
                            </div>
                            <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">{c.label}</p>
                        </div>
                        <p className="text-sm font-medium text-foreground">{c.value}</p>
                        <p className="text-[10px] text-primary mt-1 font-medium uppercase tracking-tighter">{c.detail}</p>
                    </div>
                ))}
            </div>

            {filteredProviders.length === 0 ? (
                <div className="rounded-2xl border-2 border-dashed border-border p-12 text-center">
                    <Sun className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-foreground mb-2">No providers in {location}</h3>
                    <p className="text-muted-foreground">Try selecting a different location or view all providers.</p>
                </div>
            ) : (
                <section>
                    <h3 className="text-sm font-medium text-foreground mb-3">
                        Providers in {location} ({filteredProviders.length})
                    </h3>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {filteredProviders.map((p) => (
                            <div key={p.id} className="glass-card p-5 hover:border-primary/40 group">
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors tracking-tight">{p.name}</p>
                                        <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-tight italic">{p.type === "both" ? "Solar & Borehole" : p.type}</p>
                                    </div>
                                    {p.verified && (
                                        <span className="text-[9px] bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full font-medium uppercase tracking-tighter border border-emerald-500/20 shadow-sm">✓ Verified</span>
                                    )}
                                </div>
                                <div className="flex gap-2 flex-wrap mb-4">
                                    <ScoreBadge score={p.qualityScore} label="Quality" />
                                    <ScoreBadge score={p.transparencyScore} label="Transparency" />
                                </div>
                                <p className="text-[11px] font-medium text-muted-foreground mt-auto">{p.projectsCompleted} projects · {p.yearsActive} yrs active</p>
                            </div>
                        ))}
                    </div>
                </section>
            )}
        </div>
    )
}

