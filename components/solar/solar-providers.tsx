"use client"

import { useState } from "react"
import { solarProviders } from "@/lib/mock/solar"
import { cn } from "@/lib/utils"
import { ScoreBadge } from "@/components/score-badge"
import { Phone, Mail, Globe, Star, CheckCircle } from "lucide-react"

interface SolarProvidersProps {
    location?: string
}

const typeFilters = [
    { key: "all", label: "All" },
    { key: "solar", label: "Solar Only" },
    { key: "borehole", label: "Borehole Only" },
    { key: "both", label: "Solar & Borehole" },
]

export function SolarProviders({ location = "All Locations" }: SolarProvidersProps) {
    const [typeFilter, setTypeFilter] = useState("all")

    const filtered = solarProviders
        .filter(p => location === "All Locations" || p.cities.includes(location))
        .filter(p => typeFilter === "all" || p.type === typeFilter)

    return (
        <div className="space-y-4">
            <div className="flex gap-2 flex-wrap">
                {typeFilters.map(f => (
                    <button
                        key={f.key}
                        onClick={() => setTypeFilter(f.key)}
                        className={cn(
                            "rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
                            typeFilter === f.key ? "bg-primary text-primary-foreground" : "bg-secondary/50 text-muted-foreground hover:bg-secondary"
                        )}
                    >
                        {f.label}
                    </button>
                ))}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                {filtered.map(p => (
                    <div key={p.id} className="rounded-xl border border-border bg-card p-5 hover:border-primary/20 transition-colors">
                        <div className="flex items-start justify-between mb-3">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <p className="text-sm font-semibold text-foreground">{p.name}</p>
                                    {p.verified && (
                                        <span className="flex items-center gap-0.5 text-[10px] bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full font-bold">
                                            <CheckCircle className="w-2.5 h-2.5" /> Verified
                                        </span>
                                    )}
                                </div>
                                <p className="text-xs text-muted-foreground capitalize">{p.type === "both" ? "Solar & Borehole" : p.type}</p>
                            </div>
                        </div>

                        <div className="flex gap-2 mb-3">
                            <ScoreBadge score={p.qualityScore} label="Quality" />
                            <ScoreBadge score={p.transparencyScore} label="Transparency" />
                        </div>

                        <div className="grid grid-cols-2 gap-2 mb-3">
                            <div className="rounded-lg bg-secondary/50 p-2 text-center">
                                <p className="text-lg font-bold text-foreground">{p.projectsCompleted}</p>
                                <p className="text-[10px] text-muted-foreground">Projects Done</p>
                            </div>
                            <div className="rounded-lg bg-secondary/50 p-2 text-center">
                                <p className="text-lg font-bold text-foreground">{p.yearsActive}</p>
                                <p className="text-[10px] text-muted-foreground">Years Active</p>
                            </div>
                        </div>

                        <div className="mb-3">
                            <p className="text-xs text-muted-foreground mb-1.5">Certifications</p>
                            <div className="flex flex-wrap gap-1">
                                {p.certifications.map(c => (
                                    <span key={c} className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full">{c}</span>
                                ))}
                            </div>
                        </div>

                        <div className="mb-3">
                            <p className="text-xs text-muted-foreground mb-1.5">Coverage Cities</p>
                            <div className="flex flex-wrap gap-1">
                                {p.cities.map(c => (
                                    <span key={c} className="text-[10px] bg-secondary px-2 py-0.5 rounded-full text-muted-foreground">{c}</span>
                                ))}
                            </div>
                        </div>

                        {p.reviews.length > 0 && (
                            <div className="mb-3 rounded-lg bg-secondary/30 p-3">
                                <div className="flex items-center gap-1 mb-1">
                                    <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                                    <p className="text-xs font-medium text-foreground">Latest Review</p>
                                </div>
                                <p className="text-xs text-muted-foreground italic">"{p.reviews[0].comment}"</p>
                                <p className="text-[10px] text-muted-foreground mt-1">— {p.reviews[0].author}</p>
                            </div>
                        )}

                        <div className="flex flex-col gap-1.5 pt-2 border-t border-border">
                            <a href={`tel:${p.phone}`} className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors">
                                <Phone className="w-3 h-3" /> {p.phone}
                            </a>
                            <a href={`mailto:${p.email}`} className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors">
                                <Mail className="w-3 h-3" /> {p.email}
                            </a>
                            <a href={`https://${p.website}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xs text-primary hover:underline">
                                <Globe className="w-3 h-3" /> {p.website}
                            </a>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
