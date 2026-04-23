"use client"

import type { University } from "@/lib/types"
import { cn } from "@/lib/utils"
import { Disclaimer } from "@/components/disclaimer"
import { useAppStore } from "@/lib/store"
import { Check, Plus, AlertCircle } from "lucide-react"
import { useState } from "react"

interface UniversitiesProfilesProps {
    universities: University[]
    location?: string
}

<<<<<<< Updated upstream
export function UniversitiesProfiles({ location }: UniversitiesProfilesProps) {
    const { compareTray, addToCompareTray, removeFromCompareTray } = useAppStore()
    const [error, setError] = useState<string | null>(null)

=======
export function UniversitiesProfiles({ universities, location }: UniversitiesProfilesProps) {
>>>>>>> Stashed changes
    const filteredUniversities = location && location !== "All Locations"
        ? universities.filter((u) => u.location === location)
        : universities

    return (
        <div className="space-y-6">
            <section>
                <h3 className="text-sm font-medium text-foreground mb-3">Detailed Institution Profiles</h3>
                <div className="grid gap-6">
                    {filteredUniversities.map((uni) => (
                        <div
                            key={uni.id}
                            className={cn(
                                "glass-card p-6 transition-all duration-500",
                                compareTray.ids.includes(uni.id)
                                    ? "border-primary/60 bg-primary/10 ring-2 ring-primary/20 shadow-2xl shadow-primary/20"
                                    : "hover:border-primary/40 shadow-xl"
                            )}
                        >
                            {/* Header */}
<<<<<<< Updated upstream
                            <div className="flex items-start justify-between mb-8 pb-6 border-b border-white/5 group">
                                <div className="space-y-1">
                                    <h4 className="text-xl font-medium text-foreground group-hover:text-primary transition-colors tracking-tight uppercase leading-none">{uni.name}</h4>
                                    <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-[0.2em]">
                                        {uni.city}, {uni.province}
=======
                            <div className="flex items-start justify-between mb-4 pb-4 border-b border-border/50">
                                <div>
                                    <h4 className="text-lg font-bold text-foreground uppercase tracking-tight">{uni.university}</h4>
                                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mt-1">
                                        {uni.location}, {uni.provinceArea}
>>>>>>> Stashed changes
                                    </p>
                                </div>
                                <div className="flex flex-col items-end gap-3">
                                    <span className="shrink-0 text-[10px] font-medium uppercase tracking-widest bg-muted/40 text-muted-foreground px-3 py-1.5 rounded-xl border border-white/5">
                                        {uni.type.replace("_", " ")}
                                    </span>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            if (compareTray.ids.includes(uni.id)) {
                                                removeFromCompareTray(uni.id)
                                            } else {
                                                if (compareTray.ids.length >= 3) {
                                                    setError("You can only compare up to 3 institutions.")
                                                    setTimeout(() => setError(null), 3000)
                                                    return
                                                }
                                                addToCompareTray("universities", uni.id, "profiles")
                                            }
                                        }}
                                        className={cn(
                                            "flex items-center gap-2 px-5 py-2.5 rounded-xl text-[10px] font-medium uppercase tracking-[0.15em] transition-all duration-300 shadow-lg active:scale-95",
                                            compareTray.ids.includes(uni.id)
                                                ? "bg-primary text-primary-foreground shadow-primary/20"
                                                : "bg-muted/40 text-foreground border border-white/5 hover:bg-muted/60"
                                        )}
                                    >
                                        {compareTray.ids.includes(uni.id) ? (
                                            <><Check size={14} strokeWidth={4} /> <span>Added</span></>
                                        ) : (
                                            <><Plus size={14} strokeWidth={4} /> <span>Add to Compare</span></>
                                        )}
                                    </button>
                                </div>
                            </div>

<<<<<<< Updated upstream
                            {/* Error Toast locally */}
                            {error && compareTray.ids.length >= 3 && !compareTray.ids.includes(uni.id) && (
                                <div className="mb-4 bg-destructive/10 text-destructive text-[10px] font-medium px-3 py-2 rounded-lg flex items-center gap-2 animate-in fade-in slide-in-from-top-1">
                                    <AlertCircle size={14} />
                                    {error}
                                </div>
                            )}

                            {/* Scores */}
                            <div className="flex gap-2 flex-wrap mb-6">
                                <ScoreBadge score={uni.academicScore} label="Academic" />
                                <ScoreBadge score={uni.affordabilityScore} label="Affordability" />
                                <ScoreBadge score={uni.employabilityScore} label="Employability" />
                                <ScoreBadge score={uni.studentLifeRating} label="Student Life" />
                                <ScoreBadge score={uni.graduateEmployabilityScore} label="Graduate Employment" />
                            </div>

=======
>>>>>>> Stashed changes
                            {/* Key Information Grid */}
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
                                <div className="rounded-xl bg-secondary/30 p-3">
<<<<<<< Updated upstream
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-tight mb-1">Min Fees (USD)</p>
                                    <p className="text-sm font-bold text-teal-600">${(uni.feeMinUSD || 0).toLocaleString()}</p>
                                </div>
                                <div className="rounded-xl bg-secondary/30 p-3">
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-tight mb-1">Max Fees (USD)</p>
                                    <p className="text-sm font-bold text-foreground">${(uni.feeMaxUSD || 0).toLocaleString()}</p>
                                </div>
                                <div className="rounded-xl bg-secondary/30 p-3">
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-tight mb-1">Fee Confidence</p>
                                    <p className="text-sm font-bold text-foreground">{uni.feeConfidence || "N/A"}</p>
                                </div>
                                <div className="rounded-xl bg-secondary/30 p-3">
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-tight mb-1">Fee Note</p>
                                    <p className="text-sm font-bold text-foreground">{uni.feeNote || "—"}</p>
                                </div>
                            </div>

                            {/* Programme Summary */}
                            {uni.programmeSummary && (
                                <div className="mb-6">
                                    <p className="text-xs font-bold text-muted-foreground mb-2 uppercase tracking-wide">Programme Summary</p>
                                    <p className="text-sm font-medium text-foreground">{uni.programmeSummary}</p>
=======
                                    <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-tight mb-1">Annual Fees</p>
                                    <p className="text-sm font-medium text-teal-600">${uni.annualFees.toLocaleString()}</p>
                                </div>
                                <div className="rounded-xl bg-secondary/30 p-3">
                                    <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-tight mb-1">Application Fee</p>
                                    <p className="text-sm font-medium text-foreground">${uni.applicationFee}</p>
                                </div>
                                <div className="rounded-xl bg-secondary/30 p-3">
                                    <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-tight mb-1">Ranking</p>
                                    <p className="text-sm font-medium text-foreground">
                                        {uni.ranking.local ? `#${uni.ranking.local}` : "N/A"}
                                    </p>
                                </div>
                                <div className="rounded-xl bg-secondary/30 p-3">
                                    <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-tight mb-1">Acceptance Rate</p>
                                    <p className="text-sm font-medium text-foreground">
                                        {uni.acceptanceRate ? `${uni.acceptanceRate}%` : "N/A"}
                                    </p>
                                </div>
                            </div>

                            {/* Accreditation */}
                            <div className="mb-6">
                                <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">Accreditation Status</p>
                                <p className="text-sm font-medium text-foreground">{uni.accreditationStatus}</p>
                            </div>

                            {/* Faculties */}
                            <div className="mb-6">
                                <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">Faculties ({uni.faculties.length})</p>
                                <div className="flex flex-wrap gap-2">
                                    {uni.faculties.map((faculty) => (
                                        <span
                                            key={faculty}
                                            className="text-[10px] font-medium bg-teal-50 text-teal-700 px-3 py-1.5 rounded-full border border-teal-100"
                                        >
                                            {faculty}
                                        </span>
                                    ))}
>>>>>>> Stashed changes
                                </div>
                            )}

<<<<<<< Updated upstream
                            {/* Source URL */}
                            {uni.programmeSourceUrl && (
                                <div>
                                    <p className="text-xs font-bold text-muted-foreground mb-2 uppercase tracking-wide">Programme Source</p>
                                    <a
                                        href={uni.programmeSourceUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-sm text-blue-600 hover:underline"
                                    >
                                        {uni.programmeSourceUrl}
                                    </a>
                                </div>
                            )}
=======
                            {/* Programs */}
                            <div className="mb-6">
                                <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">Key Programs ({uni.programs.length})</p>
                                <div className="flex flex-wrap gap-2">
                                    {uni.programs.map((program) => (
                                        <span
                                            key={program}
                                            className="text-[10px] font-medium bg-secondary/50 text-foreground px-3 py-1.5 rounded-full border border-border/30"
                                        >
                                            {program}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Facilities */}
                            <div className="mb-6">
                                <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">Facilities & Services</p>
                                <div className="flex flex-wrap gap-2">
                                    {uni.accommodationAvailable && (
                                        <span className="text-[10px] font-medium bg-teal-50 text-teal-700 px-3 py-1.5 rounded-full border border-teal-100">
                                            On-Campus Accommodation
                                        </span>
                                    )}
                                    {uni.onlineLearningAvailable && (
                                        <span className="text-[10px] font-medium bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full border border-blue-100">
                                            Online Learning
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Application Requirements */}
                            <div>
                                <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">Application Requirements</p>
                                <ul className="space-y-1">
                                    {uni.applicationRequirements.map((req, idx) => (
                                        <li key={idx} className="text-xs text-foreground flex items-start gap-2">
                                            <span className="text-teal-600 mt-0.5">•</span>
                                            <span>{req}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
>>>>>>> Stashed changes
                        </div>
                    ))}
                </div>
            </section>
            <Disclaimer />
        </div>
    )
}

