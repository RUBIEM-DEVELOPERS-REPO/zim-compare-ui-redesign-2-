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
                            "glass-tab-base px-3 py-1.5 text-[10px] font-medium uppercase tracking-widest transition-all",
                            typeFilter === f.key ? "glass-tab-active" : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        {f.label}
                    </button>
                ))}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                {filtered.map(p => (
                    <div key={p.id} className="glass-card p-5 hover:border-primary/40 group">
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors tracking-tight">{p.name}</p>
                                    {p.verified && (
                                        <span className="flex items-center gap-1 text-[9px] bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full font-medium uppercase tracking-tighter border border-emerald-500/20 shadow-sm">
                                            <CheckCircle className="w-2.5 h-2.5" /> Verified
                                        </span>
                                    )}
                                </div>
                                <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-tight italic">{p.type === "both" ? "Solar & Borehole" : p.type}</p>
                            </div>
                        </div>

                        <div className="flex gap-2 mb-3">
                            <ScoreBadge score={p.qualityScore} label="Quality" />
                            <ScoreBadge score={p.transparencyScore} label="Transparency" />
                        </div>

                        <div className="grid grid-cols-2 gap-3 mb-4">
                            <div className="rounded-xl bg-muted/30 p-2.5 text-center border border-white/5">
                                <p className="text-lg font-medium text-foreground tabular-nums">{p.projectsCompleted}</p>
                                <p className="text-[9px] font-medium text-muted-foreground uppercase tracking-widest">Projects Done</p>
                            </div>
                            <div className="rounded-xl bg-muted/30 p-2.5 text-center border border-white/5">
                                <p className="text-lg font-medium text-foreground tabular-nums">{p.yearsActive}</p>
                                <p className="text-[9px] font-medium text-muted-foreground uppercase tracking-widest">Years Active</p>
                            </div>
                        </div>

                        <div className="mb-4">
                            <p className="text-[9px] font-medium text-muted-foreground uppercase tracking-widest mb-1.5 ml-1">Certifications</p>
                            <div className="flex flex-wrap gap-1.5">
                                {p.certifications.map(c => (
                                    <span key={c} className="text-[9px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium uppercase tracking-tighter border border-primary/20">{c}</span>
                                ))}
                            </div>
                        </div>

                        <div className="mb-4">
                            <p className="text-[9px] font-medium text-muted-foreground uppercase tracking-widest mb-1.5 ml-1">Coverage Cities</p>
                            <div className="flex flex-wrap gap-1.5">
                                {p.cities.map(c => (
                                    <span key={c} className="text-[9px] bg-muted px-2 py-0.5 rounded-full text-foreground/70 font-medium uppercase tracking-tighter border border-border/40">{c}</span>
                                ))}
                            </div>
                        </div>

                        {p.reviews.length > 0 && (
                            <div className="mb-4 rounded-xl bg-muted/40 p-4 border border-white/5 relative group/review">
                                <div className="absolute top-3 right-3 opacity-10">
                                    <Star className="w-8 h-8 text-amber-500 fill-amber-500" />
                                </div>
                                <div className="flex items-center gap-1.5 mb-2 relative z-10">
                                    <p className="text-[9px] font-medium text-foreground uppercase tracking-widest">Latest Feedback</p>
                                </div>
                                <p className="text-[11px] text-muted-foreground italic leading-relaxed relative z-10 font-medium">"{p.reviews[0].comment}"</p>
                                <p className="text-[9px] font-medium text-primary mt-2 relative z-10 uppercase tracking-tighter">&mdash; {p.reviews[0].author}</p>
                            </div>
                        )}

                        <div className="flex flex-col gap-1.5 pt-2 border-t border-border">
                        <div className="flex flex-col gap-2 pt-4 border-t border-border">
                            <a href={`tel:${p.phone}`} className="flex items-center gap-2.5 text-[10px] font-medium text-muted-foreground hover:text-primary transition-colors uppercase tracking-widest">
                                <Phone className="w-3.5 h-3.5" /> {p.phone}
                            </a>
                            <a href={`mailto:${p.email}`} className="flex items-center gap-2.5 text-[10px] font-medium text-muted-foreground hover:text-primary transition-colors uppercase tracking-widest">
                                <Mail className="w-3.5 h-3.5" /> {p.email}
                            </a>
                            <a href={`https://${p.website}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 text-[10px] font-medium text-primary hover:text-primary/80 transition-all uppercase tracking-widest underline decoration-primary/30">
                                <Globe className="w-3.5 h-3.5" /> {p.website}
                            </a>
                        </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

