"use client"

import type { University } from "@/lib/types"
import { cn } from "@/lib/utils"
import { Disclaimer } from "@/components/disclaimer"
import { useAppStore } from "@/lib/store"
import { Check, Plus, AlertCircle } from "lucide-react"
import { useState } from "react"
import { ScoreBadge } from "@/components/score-badge"

interface UniversitiesProfilesProps {
    universities: University[]
    location?: string
}

export function UniversitiesProfiles({ universities, location }: UniversitiesProfilesProps) {
    const { compareTray, addToCompareTray, removeFromCompareTray } = useAppStore()
    const [error, setError] = useState<string | null>(null)
    const filteredUniversities = location && location !== "All Locations"
        ? universities.filter((u) => u.location === location)
        : universities

    return (
        <div className="space-y-6">
            <section>
                <h3 className="text-sm font-medium text-foreground mb-3">Detailed Institution Profiles</h3>
                <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredUniversities.map((uni) => (
                        <div
                            key={uni.id}
                            className={cn(
                                "glass-card p-5 transition-all duration-500 flex flex-col h-full",
                                compareTray.ids.includes(uni.id)
                                    ? "border-primary/60 bg-primary/10 ring-2 ring-primary/20 shadow-2xl shadow-primary/20"
                                    : "hover:border-primary/40 shadow-xl"
                            )}
                        >
                            {/* Header */}
                            <div className="flex flex-col gap-3 mb-4 flex-grow-0">
                                <div className="flex justify-between items-start">
                                    <div className="flex flex-col gap-1">
                                        <h4 className="text-sm font-black text-white uppercase tracking-tight leading-tight">{uni.university}</h4>
                                        <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">
                                            {uni.location || uni.city}, {uni.provinceArea || uni.province}
                                        </p>
                                    </div>
                                    <span className="shrink-0 text-[8px] font-black uppercase tracking-widest bg-white/5 text-primary px-2 py-1 rounded-lg border border-white/5">
                                        {uni.type.replace("_", " ")}
                                    </span>
                                </div>

                                <button
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        if (compareTray.ids.includes(uni.id)) {
                                            removeFromCompareTray(uni.id)
                                        } else {
                                            if (compareTray.ids.length >= 5) {
                                                setError("Max comparison limit reached.")
                                                setTimeout(() => setError(null), 3000)
                                                return
                                            }
                                            addToCompareTray("universities", uni.id, "profiles")
                                        }
                                    }}
                                    className={cn(
                                        "w-full flex items-center justify-center gap-2 py-2 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] transition-all duration-300 shadow-lg active:scale-95",
                                        compareTray.ids.includes(uni.id)
                                            ? "bg-primary text-primary-foreground shadow-primary/20"
                                            : "bg-white/5 text-white border border-white/10 hover:bg-white/10 hover:border-primary/30"
                                    )}
                                >
                                    {compareTray.ids.includes(uni.id) ? (
                                        <><Check size={12} strokeWidth={4} /> <span>Selected</span></>
                                    ) : (
                                        <><Plus size={12} strokeWidth={4} /> <span>Add to Compare</span></>
                                    )}
                                </button>
                            </div>

                            {/* Error Toast locally */}
                            {error && compareTray.ids.length >= 5 && !compareTray.ids.includes(uni.id) && (
                                <div className="mb-4 bg-destructive/10 text-destructive text-[9px] font-bold px-3 py-1.5 rounded-lg flex items-center gap-2 animate-in fade-in slide-in-from-top-1">
                                    <AlertCircle size={12} />
                                    {error}
                                </div>
                            )}

                            {/* Scores - Compact */}
                            <div className="grid grid-cols-3 gap-1.5 mb-4">
                                {[
                                    { label: "ACAD", score: uni.academicScore || 0 },
                                    { label: "AFFORD", score: uni.affordabilityScore || 0 },
                                    { label: "EMPL", score: uni.employabilityScore || 0 },
                                ].map(s => (
                                    <div key={s.label} className="bg-white/5 border border-white/5 rounded-xl p-2 text-center group/score hover:border-primary/20 transition-all">
                                        <p className="text-[7px] font-black text-muted-foreground uppercase tracking-widest mb-1 group-hover/score:text-primary transition-colors">{s.label}</p>
                                        <p className="text-xs font-black text-white">{s.score}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Key Information List */}
                            <div className="space-y-2 mb-4 flex-grow">
                                <div className="flex justify-between items-center py-2 border-b border-white/5">
                                    <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">Annual Fees</p>
                                    <p className="text-[11px] font-black text-primary tracking-tighter">${(uni.annualFees || uni.feeMinUSD || 0).toLocaleString()}</p>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-white/5">
                                    <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">App Fee</p>
                                    <p className="text-[10px] font-black text-white">${uni.applicationFee || 0}</p>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-white/5">
                                    <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">Local Rank</p>
                                    <p className="text-[10px] font-black text-white">{uni.ranking?.local ? `#${uni.ranking.local}` : "N/A"}</p>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-white/5">
                                    <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">Acceptance</p>
                                    <p className="text-[10px] font-black text-white">{uni.acceptanceRate ? `${uni.acceptanceRate}%` : "Comp."}</p>
                                </div>
                            </div>

                            {uni.programmeSourceUrl && (
                                <div className="pt-4 mt-auto">
                                    <a
                                        href={uni.programmeSourceUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-[9px] text-primary font-black uppercase tracking-widest hover:text-white transition-all flex items-center justify-center gap-2 group/link bg-primary/5 py-2 rounded-xl border border-primary/10 hover:border-primary/30"
                                    >
                                        Visit Official Site <Plus size={10} className="rotate-45 group-hover/link:translate-x-1 transition-transform" />
                                    </a>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </section>
            <Disclaimer />
        </div>
    )
}

