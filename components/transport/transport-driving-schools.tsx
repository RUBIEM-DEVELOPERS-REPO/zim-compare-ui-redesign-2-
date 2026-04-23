"use client"

import { drivingSchools } from "@/lib/mock/transport"
import { cn } from "@/lib/utils"
import { GraduationCap, Phone, CheckCircle, TrendingUp } from "lucide-react"
import { DynamicBar } from "@/components/ui/dynamic-bar"

interface TransportDrivingSchoolsProps {
    location?: string
}

export function TransportDrivingSchools({ location = "All Locations" }: TransportDrivingSchoolsProps) {
    const filtered = location === "All Locations"
        ? drivingSchools
        : drivingSchools.filter(s => s.city === location)

    const sorted = [...filtered].sort((a, b) => b.passRate - a.passRate)

    return (
        <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-3">
                <div className="glass-floating p-3 floating-hover border-white/5 bg-white/5 rounded-xl">
                    <p className="text-[9px] font-medium text-muted-foreground uppercase tracking-[0.2em] mb-2 opacity-70">Schools Signal</p>
                    <p className="text-xl font-display font-medium text-white tabular-nums">{filtered.length}</p>
                </div>
                <div className="glass-floating p-3 floating-hover border-white/5 bg-white/5 rounded-xl">
                    <p className="text-[9px] font-medium text-muted-foreground uppercase tracking-[0.2em] mb-2 opacity-70">Neural Pass Rate</p>
                    <p className="text-xl font-display font-medium text-primary tabular-nums">
                        {filtered.length > 0 ? Math.round(filtered.reduce((s, d) => s + d.passRate, 0) / filtered.length) : 0}%
                    </p>
                </div>
                <div className="glass-floating p-3 floating-hover border-white/5 bg-primary/5 teal-glow rounded-xl">
                    <p className="text-[9px] font-medium text-muted-foreground uppercase tracking-[0.2em] mb-2 opacity-70">Efficiency Floor</p>
                    <p className="text-xl font-display font-medium text-white tabular-nums">
                        ${filtered.length > 0 ? Math.min(...filtered.map(d => d.packagePrice)) : 0}
                    </p>
                </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
                {sorted.map((school, i) => (
                    <div key={school.id} className="glass-floating p-4 transition-all duration-500 relative group overflow-hidden floating-hover border-white/5 rounded-xl">
                        <div className="absolute top-0 right-0 p-3 text-primary/5 -rotate-12 group-hover:rotate-0 transition-transform duration-1000">
                            <GraduationCap size={60} />
                        </div>

                        <div className="flex items-start justify-between mb-4 relative z-10">
                            <div>
                                <div className="flex items-center gap-1.5 mb-2">
                                    <p className="text-base font-display font-medium text-white group-hover:text-primary transition-colors tracking-tight uppercase leading-tight">{school.name}</p>
                                    {school.verified && <CheckCircle className="w-3.5 h-3.5 text-emerald-500 fill-emerald-500/10" />}
                                    {i === 0 && <span className="text-[8px] font-medium uppercase tracking-widest bg-primary/10 text-primary px-2 py-0.5 rounded-md border border-primary/20 shadow-inner">Top Rated</span>}
                                </div>
                                <p className="text-[9px] font-medium text-muted-foreground uppercase tracking-[0.2em] opacity-60 font-sans">{school.city} · {school.yearsActive} years active</p>
                            </div>
                            <div className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0 shadow-lg group-hover:bg-primary/20 group-hover:border-primary/30 transition-all duration-500 teal-glow">
                                <GraduationCap className="w-4 h-4 text-primary" />
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-2.5 mb-4 relative z-10">
                            <div className="glass-floating bg-white/5 p-2 rounded-lg border-white/10 shadow-inner group-hover:bg-primary/5 group-hover:border-primary/20 transition-all duration-500 text-center">
                                <p className="text-xs font-display font-medium text-white tabular-nums">${school.pricePerLesson}</p>
                                <p className="text-[8px] font-medium text-muted-foreground uppercase tracking-widest opacity-60 mt-0.5">Per Lesson</p>
                            </div>
                            <div className="glass-floating bg-white/5 p-2 rounded-lg border-white/10 shadow-inner group-hover:bg-primary/5 group-hover:border-primary/20 transition-all duration-500 text-center border-primary/20 bg-primary/5">
                                <p className="text-xs font-display font-medium text-white tabular-nums">${school.packagePrice}</p>
                                <p className="text-[8px] font-medium text-muted-foreground uppercase tracking-widest opacity-60 mt-0.5">{school.lessonsInPackage} Lsn Pkg</p>
                            </div>
                            <div className="glass-floating bg-white/5 p-2 rounded-lg border-white/10 shadow-inner group-hover:bg-primary/5 group-hover:border-primary/20 transition-all duration-500 text-center">
                                <div className="flex items-center justify-center gap-1">
                                    <TrendingUp className="w-2.5 h-2.5 text-emerald-500" />
                                    <p className="text-xs font-display font-medium text-emerald-400 tabular-nums">{school.passRate}%</p>
                                </div>
                                <p className="text-[8px] font-medium text-muted-foreground uppercase tracking-widest opacity-60 mt-0.5">Pass Rate</p>
                            </div>
                        </div>

                        <div className="h-1 rounded-full bg-white/5 overflow-hidden mb-4 shadow-inner relative z-10">
                            <DynamicBar
                                value={school.passRate}
                                variableName="--bar-width"
                                className="h-full rounded-full bg-emerald-500/80 transition-all shadow-[0_0_8px_rgba(16,185,129,0.3)] dynamic-bar-width"
                            />
                        </div>

                        <a href={`tel:${school.phone}`} className="flex items-center gap-1.5 text-[9px] font-medium text-muted-foreground hover:text-primary transition-all uppercase tracking-[0.15em] relative z-10">
                            <Phone className="w-3 h-3" /> {school.phone}
                        </a>
                    </div>
                ))}
            </div>
        </div>
    )
}

