"use client"

import { useState } from "react"
import type { University } from "@/lib/types"
import { cn } from "@/lib/utils"
import { Disclaimer } from "@/components/disclaimer"
import { useAppStore } from "@/lib/store"
import { Check, Plus, AlertCircle, X } from "lucide-react"

import { ScoreBadge } from "@/components/score-badge"

const summaryCards = [
    { label: "Most Affordable", value: "Gweru Polytechnic", detail: "$2,050/year" },
    { label: "Best Academics", value: "University of Zimbabwe", detail: "92% academic score" },
    { label: "Best Employability", value: "NUST", detail: "91% employability score" },
    { label: "Best Campus Life", value: "Africa University", detail: "88% student life rating" },
]

const tabCards = [
    { key: "fees", label: "Fees & Rankings", subtitle: "Compare tuition costs and rankings" },
    { key: "programs", label: "Programs", subtitle: "Explore faculties and courses offered" },
    { key: "campus", label: "Campus Life", subtitle: "Accommodation, sports, student life" },
    { key: "profiles", label: "University Profiles", subtitle: "Accreditation, location, institution details" },
]

const institutionTypes = [
    { key: "all", label: "All" },
    { key: "university", label: "Universities" },
    { key: "college", label: "Colleges" },
    { key: "polytechnic", label: "Polytechnics" },
    { key: "teacher_training", label: "Teacher Training" },
    { key: "private", label: "Private Institutions" },
] as const


interface UniversitiesOverviewProps {
    universities: University[]
    onTabChange: (tab: string) => void
    location?: string
}

export function UniversitiesOverview({ universities, onTabChange, location = "All Locations" }: UniversitiesOverviewProps) {
    const { compareTray, addToCompareTray, removeFromCompareTray } = useAppStore()
    const [typeFilter, setTypeFilter] = useState<string>("all")
    const [error, setError] = useState<string | null>(null)

    const filtered = universities.filter((u) => {
        const typeMatch = typeFilter === "all" || u.type === typeFilter
        const locationMatch = location === "All Locations" || u.location === location
        return typeMatch && locationMatch
    })

    const bestUniversity = filtered[0] || universities.find(u => u.id === "uz") || universities[0]

    return (
        <div className="space-y-4">
            {/* Best for You Highlight - Premium Glass Panel */}
            <div className="glass-floating p-4 bg-primary/5 border-primary/20 shadow-xl relative overflow-hidden group teal-glow rounded-2xl">
                <div className="absolute -right-6 -top-6 w-24 h-24 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-all duration-1000" />
                <p className="text-[9px] font-medium text-primary uppercase tracking-[0.3em] mb-1.5">Neural Best Fit {location !== "All Locations" ? `in ${location}` : ""}</p>
                <h2 className="text-2xl font-display font-medium text-foreground tracking-tight uppercase leading-tight">{bestUniversity.university}</h2>
                <p className="text-xs text-muted-foreground mt-2 max-w-xl leading-relaxed font-medium font-sans opacity-80">
                    Optimized for your affordability profile, academic strength, and employability benchmarks within the Zimbabwean diaspora.
                </p>
                <div className="mt-3 pt-3 border-t border-white/10">
                    <Disclaimer />
                </div>
            </div>

            {/* Dynamic Recommendation Cards */}
            {(() => {
                const sorted = [...filtered].sort((a, b) => (a.feeMinUSD || 999999) - (b.feeMinUSD || 999999))
                const mostAffordable = sorted[0]
                const dynamicCards = [
                    mostAffordable && { label: "Most Affordable", value: mostAffordable.university, detail: `$${mostAffordable.feeMinUSD?.toLocaleString() || "N/A"}/sem` },
                    filtered.length > 1 && { label: "Top Academic", value: [...filtered].sort((a,b) => (b.academicScore || 0) - (a.academicScore || 0))[0].university, detail: `${[...filtered].sort((a,b) => (b.academicScore || 0) - (a.academicScore || 0))[0].academicScore || 0}% score` },
                ].filter(Boolean)
                
                return dynamicCards.length > 0 ? (
                    <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
                        {dynamicCards.map((c: any) => (
                            <div key={c.label} className="glass-floating p-3 h-full floating-hover group rounded-xl">
                                <p className="text-[9px] font-medium text-muted-foreground uppercase tracking-[0.2em] mb-1 opacity-70 group-hover:text-primary transition-colors">{c.label}</p>
                                <p className="text-sm font-display font-medium text-white mt-0.5 leading-tight">{c.value}</p>
                                <p className="text-[10px] text-primary mt-1.5 font-medium tracking-widest uppercase">{c.detail}</p>
                            </div>
                        ))}
                    </div>
                ) : null
            })()}

            {/* Overview Highlight Cards - Navigation Tiles */}
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                {tabCards.map((card) => (
                    <button
                        key={card.key}
                        onClick={() => onTabChange(card.key)}
                        className="glass-card p-3 text-left group h-full hover:border-primary/40 transition-all duration-300 active:scale-[0.98] rounded-xl"
                    >
                        <p className="text-[10px] font-medium text-foreground group-hover:text-primary transition-colors tracking-tight uppercase leading-none mb-1">{card.label}</p>
                        <p className="text-[9px] font-medium text-muted-foreground leading-relaxed">{card.subtitle}</p>
                    </button>
                ))}
            </div>

            {/* Institution Type Filters */}
            <div className="flex flex-wrap gap-1 p-1 rounded-xl bg-white/5 border border-white/10 w-fit backdrop-blur-3xl">
                {institutionTypes.map((t) => (
                    <button
                        key={t.key}
                        onClick={() => setTypeFilter(t.key)}
                        className={cn(
                            "shrink-0 h-6 px-3 rounded-lg text-[9px] font-medium uppercase tracking-[0.2em] transition-all duration-500",
                            typeFilter === t.key
                                ? "bg-primary text-primary-foreground shadow-md shadow-primary/20 teal-glow"
                                : "text-muted-foreground hover:text-white hover:bg-white/5"
                        )}
                    >
                        {t.label}
                    </button>
                ))}
            </div>

            {/* All Institutions or Empty State */}
            <section>
                <h3 className="text-[10px] font-medium text-foreground mb-2">
                    {typeFilter === "all" ? "All Institutions" : institutionTypes.find(t => t.key === typeFilter)?.label} ({filtered.length})
                </h3>

                {filtered.length === 0 ? (
                    <div className="rounded-2xl border-2 border-dashed border-border p-8 text-center">
                        <div className="bg-muted w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                            <X className="w-6 h-6 text-muted-foreground" />
                        </div>
                        <h3 className="text-sm font-medium text-foreground mb-1.5">No institutions found for {location}</h3>
                        <p className="text-xs text-muted-foreground mb-4 max-w-xs mx-auto">There are no universities or colleges matching your filters in this location.</p>
                    </div>
                ) : (
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {filtered.map((uni) => (
                            <div
                                key={uni.id}
                                className={cn(
                                    "glass-floating p-3 transition-all duration-500 relative group flex flex-col floating-hover rounded-xl",
                                    compareTray.ids.includes(uni.id)
                                        ? "border-primary/60 bg-primary/10 ring-2 ring-primary/20 shadow-xl shadow-primary/20 teal-glow"
                                        : "hover:border-primary/40"
                                )}
                            >
                                {error && compareTray.ids.length >= 3 && !compareTray.ids.includes(uni.id) && (
                                    <div className="absolute top-1.5 left-1.5 right-1.5 glass-floating border-destructive/50 bg-destructive/20 text-foreground text-[9px] font-medium px-3 py-1.5 rounded-lg flex items-center gap-2 z-20 animate-in fade-in slide-in-from-top-2">
                                        <AlertCircle size={12} className="text-destructive" />
                                        {error}
                                    </div>
                                )}
                                <div className="flex items-start justify-between gap-3 mb-3">
                                    <p className="text-sm font-display font-medium text-foreground group-hover:text-primary transition-colors tracking-tight uppercase leading-snug">{uni.university}</p>
                                    <span className="shrink-0 text-[8px] font-medium uppercase tracking-[0.2em] bg-white/5 text-muted-foreground px-2 py-1 rounded-lg border border-white/10 shadow-inner">
                                        {uni.type.replace("_", " ")}
                                    </span>
                                </div>
                                <div className="flex gap-1.5 flex-wrap mb-3">
                                    <ScoreBadge score={uni.academicScore || 0} label="Academic" />
                                    <ScoreBadge score={uni.affordabilityScore || 0} label="Affordability" />
                                </div>
                                <div className="flex items-center justify-between mt-auto pt-3 border-t border-white/10">
                                    <div>
                                        <p className="text-[9px] font-medium text-muted-foreground uppercase tracking-[0.2em]">{uni.location || uni.city}</p>
                                        <p className="text-sm font-display font-medium text-primary mt-0.5 tabular-nums tracking-tighter">${(uni.annualFees || uni.feeMinUSD || 0).toLocaleString()}/yr</p>
                                    </div>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            if (compareTray.ids.includes(uni.id)) {
                                                removeFromCompareTray(uni.id)
                                            } else {
                                                if (compareTray.ids.length >= 3) {
                                                    setError("You can only compare up to 3 universities.")
                                                    setTimeout(() => setError(null), 3000)
                                                    return
                                                }
                                                addToCompareTray("universities", uni.id, "overview")
                                            }
                                        }}
                                        className={cn(
                                            "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[9px] font-medium uppercase tracking-[0.2em] transition-all duration-500 shadow-lg",
                                            compareTray.ids.includes(uni.id)
                                                ? "bg-primary text-primary-foreground shadow-primary/30 teal-glow"
                                                : "bg-white/5 text-foreground border border-white/10 hover:bg-white/10"
                                        )}
                                    >
                                        {compareTray.ids.includes(uni.id) ? (
                                            <>
                                                <Check size={12} strokeWidth={4} />
                                                <span>Added</span>
                                            </>
                                        ) : (
                                            <>
                                                <Plus size={12} strokeWidth={4} />
                                                <span>Add</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    )
}

