"use client"

import { useState } from "react"
import { universities } from "@/lib/mock/universities"
import { cn } from "@/lib/utils"
import { ScoreBadge } from "@/components/score-badge"
import { Disclaimer } from "@/components/disclaimer"
import { useAppStore } from "@/lib/store"
import { Check, Plus, AlertCircle, X } from "lucide-react"

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

import { X } from "lucide-react"

interface UniversitiesOverviewProps {
    onTabChange: (tab: string) => void
    location?: string
}

export function UniversitiesOverview({ onTabChange, location = "All Locations" }: UniversitiesOverviewProps) {
    const { compareTray, addToCompareTray, removeFromCompareTray } = useAppStore()
    const [typeFilter, setTypeFilter] = useState<string>("all")
    const [error, setError] = useState<string | null>(null)

    const filtered = universities.filter((u) => {
        const typeMatch = typeFilter === "all" || u.type === typeFilter
        const locationMatch = location === "All Locations" || u.city === location
        return typeMatch && locationMatch
    })

    const bestUniversity = filtered[0] || universities.find(u => u.id === "uz") || universities[0]

    return (
        <div className="space-y-6">
            {/* Best for You Highlight */}
            <div className="rounded-xl border border-primary/20 bg-primary/5 p-5">
                <p className="text-xs text-muted-foreground mb-1">Best University for You {location !== "All Locations" ? `in ${location}` : ""}</p>
                <p className="text-lg font-semibold text-foreground">{bestUniversity.name}</p>
                <p className="text-sm text-muted-foreground mt-1">
                    Based on your affordability, academic strength, and employability preferences.
                </p>
                <Disclaimer />
            </div>

            {/* Quick Recommendation Cards */}
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {summaryCards.map((c) => {
                    const uni = universities.find(u => u.name === c.value)
                    const isLocal = location === "All Locations" || (uni && uni.city === location)
                    if (!isLocal) return null
                    return (
                        <div key={c.label} className="rounded-xl border border-border bg-card p-4">
                            <p className="text-xs text-muted-foreground">{c.label}</p>
                            <p className="text-sm font-semibold text-foreground mt-1">{c.value}</p>
                            <p className="text-xs text-primary mt-1">{c.detail}</p>
                        </div>
                    )
                })}
            </div>

            {/* Overview Highlight Cards */}
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {tabCards.map((card) => (
                    <button
                        key={card.key}
                        onClick={() => onTabChange(card.key)}
                        className="rounded-xl border border-border bg-card p-4 text-left hover:border-primary/20 hover:shadow-md transition-all"
                    >
                        <p className="text-sm font-semibold text-foreground">{card.label}</p>
                        <p className="text-xs text-muted-foreground mt-1">{card.subtitle}</p>
                    </button>
                ))}
            </div>

            {/* Institution Type Filters */}
            <div className="flex flex-wrap gap-1">
                {institutionTypes.map((t) => (
                    <button
                        key={t.key}
                        onClick={() => setTypeFilter(t.key)}
                        className={cn(
                            "shrink-0 h-8 glass-tab-base",
                            typeFilter === t.key
                                ? "glass-tab-active"
                                : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        {t.label}
                    </button>
                ))}
            </div>

            {/* All Institutions or Empty State */}
            <section>
                <h3 className="text-sm font-semibold text-foreground mb-3">
                    {typeFilter === "all" ? "All Institutions" : institutionTypes.find(t => t.key === typeFilter)?.label} ({filtered.length})
                </h3>

                {filtered.length === 0 ? (
                    <div className="rounded-2xl border-2 border-dashed border-border p-12 text-center">
                        <div className="bg-muted w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <X className="w-8 h-8 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-bold text-foreground mb-2">No institutions found for {location}</h3>
                        <p className="text-muted-foreground mb-6 max-w-xs mx-auto">There are no universities or colleges matching your filters in this location.</p>
                    </div>
                ) : (
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {filtered.map((uni) => (
                            <div
                                key={uni.id}
                                className={cn(
                                    "rounded-xl border bg-card p-4 transition-all duration-300 relative group overflow-hidden",
                                    compareTray.ids.includes(uni.id)
                                        ? "bg-teal-50 border-teal-200 shadow-teal-500/10 ring-1 ring-teal-200"
                                        : "border-border hover:border-teal-200/50 hover:shadow-md transition-colors"
                                )}
                            >
                                {/* Error Toast locally */}
                                {error && compareTray.ids.length >= 3 && !compareTray.ids.includes(uni.id) && (
                                    <div className="absolute top-2 left-2 right-2 bg-destructive/90 text-white text-[10px] font-bold px-2 py-1 rounded-lg flex items-center gap-1 z-20 animate-in fade-in slide-in-from-top-1">
                                        <AlertCircle size={10} />
                                        {error}
                                    </div>
                                )}
                                <div className="flex items-center justify-between mb-2">
                                    <p className="text-sm font-semibold text-foreground group-hover:text-teal-600 transition-colors uppercase tracking-tight">{uni.name}</p>
                                    <span className="text-[9px] font-black uppercase tracking-widest bg-teal-50 text-teal-700 px-2 py-0.5 rounded-full border border-teal-100">
                                        {uni.type.replace("_", " ")}
                                    </span>
                                </div>
                                <div className="flex gap-2 flex-wrap mb-2">
                                    <ScoreBadge score={uni.academicScore} label="Academic" />
                                    <ScoreBadge score={uni.affordabilityScore} label="Affordability" />
                                </div>
                                <div className="flex items-center justify-between mt-auto pt-2 border-t border-border/50">
                                    <div>
                                        <p className="text-[10px] text-muted-foreground">{uni.city}, {uni.province}</p>
                                        <p className="text-xs font-bold text-teal-600 mt-0.5">${uni.annualFees.toLocaleString()}/year</p>
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
                                            "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all",
                                            compareTray.ids.includes(uni.id)
                                                ? "bg-teal-600 text-white shadow-lg shadow-teal-600/20"
                                                : "bg-teal-50 text-teal-700 border border-teal-100 hover:bg-teal-100"
                                        )}
                                    >
                                        {compareTray.ids.includes(uni.id) ? (
                                            <>
                                                <Check size={12} strokeWidth={3} />
                                                <span>Added</span>
                                            </>
                                        ) : (
                                            <>
                                                <Plus size={12} strokeWidth={3} />
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
