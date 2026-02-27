"use client"

import { universities } from "@/lib/mock/universities"
import { cn } from "@/lib/utils"
import { ScoreBadge } from "@/components/score-badge"
import { Disclaimer } from "@/components/disclaimer"
import { useAppStore } from "@/lib/store"
import { Check, Plus, AlertCircle } from "lucide-react"
import { useState } from "react"

interface UniversitiesFeesProps {
    location?: string
}

export function UniversitiesFees({ location }: UniversitiesFeesProps) {
    const { compareTray, addToCompareTray, removeFromCompareTray } = useAppStore()
    const [error, setError] = useState<string | null>(null)

    const filteredUniversities = location && location !== "All Locations"
        ? universities.filter(u => u.city === location)
        : universities

    const sorted = [...filteredUniversities].sort((a, b) => a.annualFees - b.annualFees)

    const handleCompare = (e: React.MouseEvent, id: string) => {
        e.stopPropagation()
        const isSelected = compareTray.ids.includes(id)
        if (isSelected) {
            removeFromCompareTray(id)
        } else {
            if (compareTray.ids.length >= 3) {
                setError("You can only compare up to 3 universities.")
                setTimeout(() => setError(null), 3000)
                return
            }
            addToCompareTray("universities", id, "fees")
        }
    }

    return (
        <div className="space-y-6">
            <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
                <div className="rounded-2xl border border-teal-200/50 bg-teal-50/50 p-4 transition-all duration-300 hover:shadow-lg hover:shadow-teal-500/5 hover:-translate-y-1">
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Most Affordable</p>
                    <p className="text-sm font-black text-foreground mt-2 uppercase tracking-tight">{sorted[0].name}</p>
                    <p className="text-[11px] font-bold text-teal-600 mt-1">${sorted[0].annualFees.toLocaleString()}/year</p>
                </div>
                <div className="rounded-2xl border border-teal-200/50 bg-teal-50/50 p-4 transition-all duration-300 hover:shadow-lg hover:shadow-teal-500/5 hover:-translate-y-1">
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Top Ranked</p>
                    <p className="text-sm font-black text-foreground mt-2 uppercase tracking-tight">
                        {universities.find(u => u.ranking.local === 1)?.name}
                    </p>
                    <p className="text-[11px] font-bold text-teal-600 mt-1">#1 Local Ranking</p>
                </div>
                <div className="rounded-2xl border border-teal-200/50 bg-teal-50/50 p-4 transition-all duration-300 hover:shadow-lg hover:shadow-teal-500/5 hover:-translate-y-1">
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Best Value</p>
                    <p className="text-sm font-black text-foreground mt-2 uppercase tracking-tight">
                        {[...universities].sort((a, b) => b.affordabilityScore - a.affordabilityScore)[0].name}
                    </p>
                    <p className="text-[11px] font-bold text-teal-600 mt-1">
                        {[...universities].sort((a, b) => b.affordabilityScore - a.affordabilityScore)[0].affordabilityScore}% Affordability
                    </p>
                </div>
                <div className="rounded-2xl border border-teal-200/50 bg-teal-50/50 p-4 transition-all duration-300 hover:shadow-lg hover:shadow-teal-500/5 hover:-translate-y-1">
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Best Employment</p>
                    <p className="text-sm font-black text-foreground mt-2 uppercase tracking-tight">
                        {[...universities].sort((a, b) => b.employabilityScore - a.employabilityScore)[0].name}
                    </p>
                    <p className="text-[11px] font-bold text-teal-600 mt-1">
                        {[...universities].sort((a, b) => b.employabilityScore - a.employabilityScore)[0].employabilityScore}% Employability
                    </p>
                </div>
            </div>

            <section>
                <h3 className="text-sm font-semibold text-foreground mb-3">All Institutions by Fees</h3>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {sorted.map((uni) => (
                        <div
                            key={uni.id}
                            className={cn(
                                "rounded-2xl border bg-card p-5 transition-all duration-300 relative group overflow-hidden",
                                compareTray.ids.includes(uni.id)
                                    ? "bg-teal-50 border-teal-200 shadow-teal-500/10 ring-1 ring-teal-200"
                                    : "border-border hover:border-teal-200/50 hover:shadow-2xl hover:shadow-teal-500/5 hover:-translate-y-1"
                            )}
                        >
                            {/* Error Toast locally */}
                            {error && compareTray.ids.length >= 3 && !compareTray.ids.includes(uni.id) && (
                                <div className="absolute top-2 left-2 right-2 bg-destructive/90 text-white text-[10px] font-bold px-2 py-1 rounded-lg flex items-center gap-1 z-20 animate-in fade-in slide-in-from-top-1">
                                    <AlertCircle size={10} />
                                    {error}
                                </div>
                            )}
                            <div className="flex items-center justify-between mb-3">
                                <p className="text-sm font-bold text-foreground group-hover:text-teal-600 transition-colors uppercase tracking-tight">
                                    {uni.name}
                                </p>
                            </div>
                            <p className="text-[10px] font-bold text-muted-foreground mb-4 uppercase tracking-wider">
                                {uni.city}, {uni.province}
                            </p>

                            <div className="flex gap-2 flex-wrap mb-4">
                                <ScoreBadge score={uni.affordabilityScore} label="Affordability" />
                                <ScoreBadge score={uni.academicScore} label="Academic" />
                            </div>

                            <div className="grid grid-cols-2 gap-2 mb-4 text-[11px] font-bold">
                                <div className="rounded-xl bg-secondary/30 p-3">
                                    <p className="text-muted-foreground uppercase tracking-tight mb-0.5">Annual Fees</p>
                                    <p className="text-teal-600">${uni.annualFees.toLocaleString()}</p>
                                </div>
                                <div className="rounded-xl bg-secondary/30 p-3">
                                    <p className="text-muted-foreground uppercase tracking-tight mb-0.5">App Fee</p>
                                    <p className="text-foreground">${uni.applicationFee}</p>
                                </div>
                                <div className="rounded-xl bg-secondary/30 p-3 col-span-2">
                                    <p className="text-muted-foreground uppercase tracking-tight mb-0.5">Ranking</p>
                                    <p className="text-foreground">
                                        {uni.ranking.local && `#${uni.ranking.local} Local`}
                                        {uni.ranking.local && uni.ranking.global && " • "}
                                        {uni.ranking.global && `#${uni.ranking.global} Global`}
                                        {!uni.ranking.local && !uni.ranking.global && "Not Ranked"}
                                    </p>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-border/50 flex items-center justify-between">
                                <div>
                                    <p className="text-[10px] font-bold text-muted-foreground mb-1 uppercase tracking-wider text-[8px]">Accreditation</p>
                                    <p className="text-[10px] font-medium text-foreground">{uni.accreditationStatus}</p>
                                </div>
                                <button
                                    onClick={(e) => handleCompare(e, uni.id)}
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
            </section>
            <Disclaimer />
        </div>
    )
}
