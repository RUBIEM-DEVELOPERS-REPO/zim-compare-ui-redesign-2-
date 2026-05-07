"use client"

import type { University } from "@/lib/types"
import { cn } from "@/lib/utils"
import { Disclaimer } from "@/components/disclaimer"
import { useAppStore } from "@/lib/store"
import { Check, Plus, AlertCircle } from "lucide-react"
import { useState } from "react"

interface UniversitiesFeesProps {
    universities: University[]
    location?: string
}

export function UniversitiesFees({ universities, location }: UniversitiesFeesProps) {
    const { compareTray, addToCompareTray, removeFromCompareTray } = useAppStore()
    const [error, setError] = useState<string | null>(null)

    const filteredUniversities = location && location !== "All Locations"
        ? universities.filter(u => u.location === location)
        : universities

    const sorted = [...filteredUniversities].sort((a, b) => (a.feeMinUSD || 999999) - (b.feeMinUSD || 999999))

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
                <div className="glass-card p-5 group hover:-translate-y-1 transition-all duration-300 rounded-2xl">
                    <p className="text-[9px] font-medium text-muted-foreground uppercase tracking-[0.2em] leading-none mb-3">Most Affordable</p>
                    <p className="text-sm font-medium text-foreground line-clamp-1 uppercase tracking-tight">{sorted[0]?.university || "—"}</p>
                    <p className="text-[11px] font-medium text-primary mt-2 tabular-nums">${(sorted[0]?.feeMinUSD || 0).toLocaleString()}/year</p>
                </div>
                <div className="glass-card p-5 group hover:-translate-y-1 transition-all duration-300 rounded-2xl">
                    <p className="text-[9px] font-medium text-muted-foreground uppercase tracking-[0.2em] leading-none mb-3">Fee Range</p>
                    <p className="text-sm font-medium text-foreground line-clamp-1 uppercase tracking-tight">Market Variance</p>
                    <p className="text-[11px] font-medium text-primary mt-2 uppercase tracking-tighter">{filteredUniversities.length} Institutions Listed</p>
                </div>
                <div className="glass-card p-5 group hover:-translate-y-1 transition-all duration-300 rounded-2xl">
                    <p className="text-[9px] font-medium text-muted-foreground uppercase tracking-[0.2em] leading-none mb-3">Top Academic</p>
                    <p className="text-sm font-medium text-foreground line-clamp-1 uppercase tracking-tight">
                        {[...universities].sort((a, b) => (b.academicScore || 0) - (a.academicScore || 0))[0].university}
                    </p>
                    <p className="text-[11px] font-medium text-primary mt-2 uppercase tracking-tighter">
                        {[...universities].sort((a, b) => (b.academicScore || 0) - (a.academicScore || 0))[0].academicScore}% Excellence
                    </p>
                </div>
                <div className="glass-card p-5 group hover:-translate-y-1 transition-all duration-300 rounded-2xl">
                    <p className="text-[9px] font-medium text-muted-foreground uppercase tracking-[0.2em] leading-none mb-3">Highest Shield</p>
                    <p className="text-sm font-medium text-foreground line-clamp-1 uppercase tracking-tight">{sorted[sorted.length - 1]?.university || "—"}</p>
                    <p className="text-[11px] font-medium text-primary mt-2 tabular-nums">${(sorted[sorted.length - 1]?.feeMaxUSD || 0).toLocaleString()}/year</p>
                </div>
            </div>

            <section>
                <h3 className="text-sm font-medium text-foreground mb-3">All Institutions by Fees</h3>
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
                                <div className="absolute top-2 left-2 right-2 glass-panel border-destructive/50 bg-destructive/20 text-foreground text-[9px] font-medium px-3 py-1.5 rounded-xl flex items-center gap-2 z-20 animate-in fade-in slide-in-from-top-2">
                                    <AlertCircle size={12} className="text-destructive" />
                                    {error}
                                </div>
                            )}
                            <div className="flex items-start justify-between gap-3 mb-4">
                                <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors tracking-tight uppercase leading-snug">{uni.university}</p>
                            </div>
                            <p className="text-[10px] font-medium text-muted-foreground mb-5 uppercase tracking-widest">{uni.location || uni.city}, {uni.provinceArea || uni.province}</p>

                            <div className="grid grid-cols-2 gap-2 mb-6">
                                <div className="rounded-2xl bg-muted/30 p-4 border border-white/5 relative group/stat overflow-hidden">
                                    <p className="text-[9px] font-medium text-muted-foreground uppercase tracking-widest mb-1.5 leading-none">Min Fees</p>
                                    <p className="text-sm font-medium text-primary tabular-nums tracking-tighter">${(uni.feeMinUSD || 0).toLocaleString()}</p>
                                </div>
                                <div className="rounded-2xl bg-muted/30 p-4 border border-white/5 relative group/stat overflow-hidden">
                                    <p className="text-[9px] font-medium text-muted-foreground uppercase tracking-widest mb-1.5 leading-none">Max Fees</p>
                                    <p className="text-sm font-medium text-foreground tabular-nums tracking-tighter">${(uni.feeMaxUSD || 0).toLocaleString()}</p>
                                </div>
                                <div className="rounded-2xl bg-muted/30 p-4 border border-white/5 col-span-2 relative group/stat overflow-hidden">
                                    <p className="text-[9px] font-medium text-muted-foreground uppercase tracking-widest mb-1.5 leading-none">Type</p>
                                    <p className="text-sm font-medium text-foreground uppercase tracking-tight">
                                        {uni.type.replace("_", " ")}
                                    </p>
                                </div>
                            </div>

                            <div className="pt-5 border-t border-white/5 flex items-center justify-between mt-auto">
                                <div>
                                    <p className="text-[9px] font-medium text-muted-foreground mb-1 uppercase tracking-widest leading-none">Accreditation</p>
                                    <p className="text-[10px] font-medium text-foreground uppercase tracking-tight">{uni.accreditationStatus || uni.feeConfidence || "Verified"}</p>
                                </div>
                                <button
                                    onClick={(e) => handleCompare(e, uni.id)}
                                    className={cn(
                                        "flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-medium uppercase tracking-[0.15em] transition-all duration-300 shadow-lg active:scale-95",
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

