"use client"

import { universities } from "@/lib/mock/universities"
import { cn } from "@/lib/utils"
import { Disclaimer } from "@/components/disclaimer"
import { useAppStore } from "@/lib/store"
import { Check, Plus, AlertCircle } from "lucide-react"
import { useState } from "react"

interface UniversitiesProgramsProps {
    location?: string
}

export function UniversitiesPrograms({ location }: UniversitiesProgramsProps) {
    const { compareTray, addToCompareTray, removeFromCompareTray } = useAppStore()
    const [error, setError] = useState<string | null>(null)

    const filteredUniversities = location && location !== "All Locations"
        ? universities.filter((u) => u.city === location)
        : universities

    const handleCompare = (uniId: string) => {
        const isSelected = compareTray.ids.includes(uniId)

        if (isSelected) {
            removeFromCompareTray(uniId)
        } else {
            if (compareTray.ids.length >= 3) {
                setError("You can only compare up to 3 institutions.")
                setTimeout(() => setError(null), 3000)
                return
            }
            addToCompareTray("universities", uniId, "programs")
        }
    }

    return (
        <div className="space-y-6">
            <section>
                <h3 className="text-sm font-semibold text-foreground mb-3">Programs & Faculties by Institution</h3>
                <div className="grid gap-4">
                    {filteredUniversities.map((uni) => (
                        <div
                            key={uni.id}
                            className={cn(
                                "glass-card p-5 transition-all duration-300",
                                "border-border hover:border-teal-200/50 hover:shadow-lg hover:shadow-teal-500/5"
                            )}
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h4 className="text-sm font-bold text-foreground uppercase tracking-tight">{uni.name}</h4>
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mt-1">
                                        {uni.city}, {uni.province}
                                    </p>
                                </div>
                                <span className="text-[9px] font-black uppercase tracking-widest bg-teal-50 text-teal-700 px-2 py-0.5 rounded-full border border-teal-100">
                                    {uni.type.replace("_", " ")}
                                </span>
                            </div>

                            <div className="space-y-3">
                                <div>
                                    <p className="text-xs font-bold text-muted-foreground mb-2 uppercase tracking-wide">Faculties ({uni.faculties.length})</p>
                                    <div className="flex flex-wrap gap-1.5">
                                        {uni.faculties.map((faculty) => (
                                            <span
                                                key={faculty}
                                                className="text-[10px] font-bold bg-teal-50 text-teal-700 px-3 py-1 rounded-full border border-teal-100"
                                            >
                                                {faculty}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <div className="flex flex-wrap gap-2">
                                        {uni.programs.map((program) => {
                                            const isSelected = compareTray.ids.includes(uni.id)
                                            return (
                                                <button
                                                    key={program}
                                                    onClick={() => handleCompare(uni.id)}
                                                    className={cn(
                                                        "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border",
                                                        isSelected
                                                            ? "bg-teal-600 text-white border-teal-600 shadow-lg shadow-teal-600/20"
                                                            : "bg-teal-50 text-teal-700 border-teal-100 hover:bg-teal-100"
                                                    )}
                                                >
                                                    {isSelected ? (
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
                                                    <span className="ml-1">{program}</span>
                                                </button>
                                            )
                                        })}
                                    </div>
                                </div>
                            </div>
                            {/* Error Toast locally */}
                            {error && compareTray.ids.length >= 3 && (
                                <div className="mt-3 flex items-center gap-1.5 text-[10px] text-destructive font-bold animate-in fade-in slide-in-from-left-1">
                                    <AlertCircle size={12} />
                                    {error}
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
