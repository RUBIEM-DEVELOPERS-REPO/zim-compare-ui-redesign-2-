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
            <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
                <div className="glass-card p-5 group hover:-translate-y-1 transition-all duration-300">
                    <p className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em] leading-none mb-3">Most Affordable</p>
                    <p className="text-sm font-black text-foreground line-clamp-1 uppercase tracking-tight">{sorted[0].name}</p>
                    <p className="text-[11px] font-black text-primary mt-2 tabular-nums">${sorted[0].annualFees.toLocaleString()}/year</p>
                </div>
                <div className="glass-card p-5 group hover:-translate-y-1 transition-all duration-300">
                    <p className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em] leading-none mb-3">Top Ranked</p>
                    <p className="text-sm font-black text-foreground line-clamp-1 uppercase tracking-tight">
                        {universities.find(u => u.ranking.local === 1)?.name}
                    </p>
                    <p className="text-[11px] font-black text-primary mt-2 uppercase tracking-tighter">#1 Local Ranking</p>
                </div>
                <div className="glass-card p-5 group hover:-translate-y-1 transition-all duration-300">
                    <p className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em] leading-none mb-3">Best Value</p>
                    <p className="text-sm font-black text-foreground line-clamp-1 uppercase tracking-tight">
                        {[...universities].sort((a, b) => b.affordabilityScore - a.affordabilityScore)[0].name}
                    </p>
                    <p className="text-[11px] font-black text-primary mt-2 uppercase tracking-tighter">
                        {[...universities].sort((a, b) => b.affordabilityScore - a.affordabilityScore)[0].affordabilityScore}% Affordability
                    </p>
                </div>
                <div className="glass-card p-5 group hover:-translate-y-1 transition-all duration-300">
                    <p className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em] leading-none mb-3">Best Employment</p>
                    <p className="text-sm font-black text-foreground line-clamp-1 uppercase tracking-tight">
                        {[...universities].sort((a, b) => b.employabilityScore - a.employabilityScore)[0].name}
                    </p>
                    <p className="text-[11px] font-black text-primary mt-2 uppercase tracking-tighter">
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
                                "glass-card p-5 transition-all duration-500 relative group flex flex-col hover:-translate-y-1",
                                compareTray.ids.includes(uni.id)
                                    ? "border-primary/60 bg-primary/10 ring-2 ring-primary/20 shadow-2xl shadow-primary/20"
                                    : "hover:border-primary/40 shadow-xl"
                            )}
                        >
                            {error && compareTray.ids.length >= 3 && !compareTray.ids.includes(uni.id) && (
                                <div className="absolute top-2 left-2 right-2 glass-panel border-destructive/50 bg-destructive/20 text-foreground text-[9px] font-black px-3 py-1.5 rounded-xl flex items-center gap-2 z-20 animate-in fade-in slide-in-from-top-2">
                                    <AlertCircle size={12} className="text-destructive" />
                                    {error}
                                </div>
                            )}
                            <div className="flex items-start justify-between gap-3 mb-4">
                                <p className="text-sm font-black text-foreground group-hover:text-primary transition-colors tracking-tight uppercase leading-snug">{uni.name}</p>
                            </div>
                            <p className="text-[10px] font-black text-muted-foreground mb-5 uppercase tracking-widest">{uni.city}, {uni.province}</p>

                            <div className="flex gap-2 flex-wrap mb-5">
                                <ScoreBadge score={uni.affordabilityScore} label="Affordability" />
                                <ScoreBadge score={uni.academicScore} label="Academic" />
                            </div>

                            <div className="grid grid-cols-2 gap-2 mb-6">
                                <div className="rounded-2xl bg-muted/30 p-4 border border-white/5 relative group/stat overflow-hidden">
                                    <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-1.5 leading-none">Annual Fees</p>
                                    <p className="text-sm font-black text-primary tabular-nums tracking-tighter">${uni.annualFees.toLocaleString()}</p>
                                </div>
                                <div className="rounded-2xl bg-muted/30 p-4 border border-white/5 relative group/stat overflow-hidden">
                                    <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-1.5 leading-none">App Fee</p>
                                    <p className="text-sm font-black text-foreground tabular-nums tracking-tighter">${uni.applicationFee}</p>
                                </div>
                                <div className="rounded-2xl bg-muted/30 p-4 border border-white/5 col-span-2 relative group/stat overflow-hidden">
                                    <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-1.5 leading-none">Ranking</p>
                                    <p className="text-[10px] font-black text-foreground uppercase tracking-tight">
                                        {uni.ranking.local && `#${uni.ranking.local} Local`}
                                        {uni.ranking.local && uni.ranking.global && " • "}
                                        {uni.ranking.global && `#${uni.ranking.global} Global`}
                                        {!uni.ranking.local && !uni.ranking.global && "Not Ranked"}
                                    </p>
                                </div>
                            </div>

                            <div className="pt-5 border-t border-white/5 flex items-center justify-between mt-auto">
                                <div>
                                    <p className="text-[9px] font-black text-muted-foreground mb-1 uppercase tracking-widest leading-none">Accreditation</p>
                                    <p className="text-[10px] font-black text-foreground uppercase tracking-tight">{uni.accreditationStatus}</p>
                                </div>
                                <button
                                    onClick={(e) => handleCompare(e, uni.id)}
                                    className={cn(
                                        "flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] transition-all duration-300 shadow-lg active:scale-95",
                                        compareTray.ids.includes(uni.id)
                                            ? "bg-primary text-primary-foreground shadow-primary/20"
                                            : "bg-muted/40 text-foreground border border-white/5 hover:bg-muted/60"
                                    )}
                                >
                                    {compareTray.ids.includes(uni.id) ? (
                                        <><Check size={12} strokeWidth={4} /> <span>Added</span></>
                                    ) : (
                                        <><Plus size={12} strokeWidth={4} /> <span>Add</span></>
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
