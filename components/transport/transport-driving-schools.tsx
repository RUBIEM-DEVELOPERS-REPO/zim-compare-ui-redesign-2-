"use client"

import { drivingSchools } from "@/lib/mock/transport"
import { cn } from "@/lib/utils"
import { GraduationCap, Phone, CheckCircle, TrendingUp } from "lucide-react"

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
                <div className="rounded-xl border border-border bg-card p-4">
                    <p className="text-xs text-muted-foreground">Schools Available</p>
                    <p className="text-2xl font-bold text-foreground">{filtered.length}</p>
                </div>
                <div className="rounded-xl border border-border bg-card p-4">
                    <p className="text-xs text-muted-foreground">Avg Pass Rate</p>
                    <p className="text-2xl font-bold text-foreground">
                        {filtered.length > 0 ? Math.round(filtered.reduce((s, d) => s + d.passRate, 0) / filtered.length) : 0}%
                    </p>
                </div>
                <div className="rounded-xl border border-border bg-card p-4">
                    <p className="text-xs text-muted-foreground">Cheapest Package</p>
                    <p className="text-2xl font-bold text-foreground">
                        ${filtered.length > 0 ? Math.min(...filtered.map(d => d.packagePrice)) : 0}
                    </p>
                </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                {sorted.map((school, i) => (
                    <div key={school.id} className="rounded-xl border border-border bg-card p-5 hover:border-primary/20 transition-colors">
                        <div className="flex items-start justify-between mb-3">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <p className="text-sm font-semibold text-foreground">{school.name}</p>
                                    {school.verified && <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />}
                                    {i === 0 && <span className="text-[10px] bg-primary/15 text-primary px-2 py-0.5 rounded-full font-bold">Top Rated</span>}
                                </div>
                                <p className="text-xs text-muted-foreground">{school.city} · {school.yearsActive} years active</p>
                            </div>
                            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                                <GraduationCap className="w-5 h-5 text-primary" />
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-2 mb-3">
                            <div className="rounded-lg bg-secondary/50 p-2 text-center">
                                <p className="text-sm font-bold text-foreground">${school.pricePerLesson}</p>
                                <p className="text-[10px] text-muted-foreground">Per Lesson</p>
                            </div>
                            <div className="rounded-lg bg-secondary/50 p-2 text-center">
                                <p className="text-sm font-bold text-foreground">${school.packagePrice}</p>
                                <p className="text-[10px] text-muted-foreground">{school.lessonsInPackage}-Lesson Pkg</p>
                            </div>
                            <div className="rounded-lg bg-emerald-500/10 p-2 text-center">
                                <div className="flex items-center justify-center gap-0.5">
                                    <TrendingUp className="w-3 h-3 text-emerald-500" />
                                    <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{school.passRate}%</p>
                                </div>
                                <p className="text-[10px] text-muted-foreground">Pass Rate</p>
                            </div>
                        </div>

                        <div className="h-1.5 rounded-full bg-secondary overflow-hidden mb-3">
                            <div className="h-full rounded-full bg-emerald-500 transition-all" style={{ width: `${school.passRate}%` }} />
                        </div>

                        <a href={`tel:${school.phone}`} className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors">
                            <Phone className="w-3 h-3" /> {school.phone}
                        </a>
                    </div>
                ))}
            </div>
        </div>
    )
}
