"use client"

import type { University } from "@/lib/types"
import { cn } from "@/lib/utils"
import { Disclaimer } from "@/components/disclaimer"
import { Check, Plus, AlertCircle } from "lucide-react"
import { useAppStore } from "@/lib/store"
import { useState } from "react"

interface UniversitiesCampusProps {
    universities: University[]
    location?: string
}

export function UniversitiesCampus({ universities, location }: UniversitiesCampusProps) {
    const { compareTray, addToCompareTray, removeFromCompareTray } = useAppStore()
    const [error, setError] = useState<string | null>(null)

    const filteredUniversities = location && location !== "All Locations"
        ? universities.filter((u) => u.location === location)
        : universities

    return (
        <div className="space-y-6">
            <section>
                <h3 className="text-sm font-semibold text-foreground mb-3">Campus &amp; Institution Detail</h3>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredUniversities.map((uni) => (
                        <div
                            key={uni.id}
                            className={cn(
                                "glass-card p-5 transition-all duration-300 relative group overflow-hidden",
                                compareTray.ids.includes(uni.id)
                                    ? "bg-teal-50 border-teal-200 shadow-teal-500/10 ring-1 ring-teal-200"
                                    : "border-border hover:border-teal-200/50 hover:shadow-2xl hover:shadow-teal-500/5 hover:-translate-y-1"
                            )}
                        >
                            {error && compareTray.ids.length >= 3 && !compareTray.ids.includes(uni.id) && (
                                <div className="absolute top-2 left-2 right-2 bg-destructive/90 text-white text-[10px] font-bold px-2 py-1 rounded-lg flex items-center gap-1 z-20 animate-in fade-in slide-in-from-top-1">
                                    <AlertCircle size={10} />
                                    {error}
                                </div>
                            )}
                            <div className="flex items-center justify-between mb-3">
                                <p className="text-sm font-bold text-foreground group-hover:text-teal-600 transition-colors uppercase tracking-tight">
                                    {uni.university}
                                </p>
                            </div>
                            <p className="text-[10px] font-bold text-muted-foreground mb-4 uppercase tracking-wider">
                                {uni.location}, {uni.provinceArea}
                            </p>

                            <div className="space-y-2 mb-4 text-xs">
                                <div className="rounded-xl bg-secondary/30 p-3">
                                    <p className="text-muted-foreground uppercase tracking-tight mb-0.5 text-[10px] font-bold">Type</p>
                                    <p className="font-medium capitalize">{uni.type.replace("_", " ")}</p>
                                </div>
                                {uni.programmeSummary && (
                                    <div className="rounded-xl bg-secondary/30 p-3">
                                        <p className="text-muted-foreground uppercase tracking-tight mb-0.5 text-[10px] font-bold">Programme Summary</p>
                                        <p className="font-medium">{uni.programmeSummary}</p>
                                    </div>
                                )}
                            </div>

                            <div className="pt-3 border-t border-border/50 flex items-center justify-between">
                                <div>
                                    <p className="text-[10px] font-bold text-muted-foreground mb-1">Min Fees</p>
                                    <p className="text-sm font-bold text-teal-600">${(uni.feeMinUSD || 0).toLocaleString()}</p>
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
                                            addToCompareTray("universities", uni.id, "campus")
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
            </section>
            <Disclaimer />
        </div>
    )
}
