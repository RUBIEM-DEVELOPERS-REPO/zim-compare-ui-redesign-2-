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
                <div className="glass-card p-4">
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Schools Available</p>
                    <p className="text-2xl font-bold text-foreground tabular-nums">{filtered.length}</p>
                </div>
                <div className="glass-card p-4">
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Avg Pass Rate</p>
                    <p className="text-2xl font-bold text-foreground tabular-nums">
                        {filtered.length > 0 ? Math.round(filtered.reduce((s, d) => s + d.passRate, 0) / filtered.length) : 0}%
                    </p>
                </div>
                <div className="glass-card p-4">
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Cheapest Package</p>
                    <p className="text-2xl font-bold text-foreground tabular-nums">
                        ${filtered.length > 0 ? Math.min(...filtered.map(d => d.packagePrice)) : 0}
                    </p>
                </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                {sorted.map((school, i) => (
                    <div key={school.id} className="glass-card p-5 hover:border-primary/40">
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <p className="text-sm font-bold text-foreground">{school.name}</p>
                                    {school.verified && <CheckCircle className="w-3.5 h-3.5 text-emerald-500 fill-emerald-500/10" />}
                                    {i === 0 && <span className="text-[9px] bg-primary/15 text-primary px-2 py-0.5 rounded-full font-black uppercase tracking-tighter">Top Rated</span>}
                                </div>
                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-tight">{school.city} &middot; {school.yearsActive} years active</p>
                            </div>
                            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 shadow-lg">
                                <GraduationCap className="w-5 h-5 text-primary" />
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-2 mb-4">
                            <div className="rounded-xl bg-muted/30 p-2.5 text-center border border-white/5">
                                <p className="text-sm font-black text-foreground tabular-nums">${school.pricePerLesson}</p>
                                <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Per Lesson</p>
                            </div>
                            <div className="rounded-xl bg-muted/30 p-2.5 text-center border border-white/5">
                                <p className="text-sm font-black text-foreground tabular-nums">${school.packagePrice}</p>
                                <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">{school.lessonsInPackage}-Lesson Pkg</p>
                            </div>
                            <div className="rounded-xl bg-emerald-500/10 p-2.5 text-center border border-emerald-500/10">
                                <div className="flex items-center justify-center gap-0.5">
                                    <TrendingUp className="w-3 h-3 text-emerald-500" />
                                    <p className="text-sm font-black text-emerald-600 dark:text-emerald-400 tabular-nums">{school.passRate}%</p>
                                </div>
                                <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Pass Rate</p>
                            </div>
                        </div>

                        <div className="h-2 rounded-full bg-muted/50 overflow-hidden mb-4 shadow-inner">
                            <DynamicBar
                                value={school.passRate}
                                variableName="--bar-width"
                                className="h-full rounded-full bg-emerald-500 transition-all shadow-[0_0_8px_rgba(16,185,129,0.3)] dynamic-bar-width"
                            />
                        </div>

                        <a href={`tel:${school.phone}`} className="flex items-center gap-2 text-[10px] font-black text-muted-foreground hover:text-primary transition-colors uppercase tracking-widest">
                            <Phone className="w-3 h-3" /> {school.phone}
                        </a>
                    </div>
                ))}
            </div>
        </div>
    )
}
