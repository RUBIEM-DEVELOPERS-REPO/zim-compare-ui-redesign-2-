"use client"

import type { University } from "@/lib/types"
import { cn } from "@/lib/utils"
import { Disclaimer } from "@/components/disclaimer"
import { useAppStore } from "@/lib/store"
import { Check, Plus, AlertCircle } from "lucide-react"
import { useState } from "react"

interface UniversitiesProgramsProps {
    universities: University[]
    location?: string
}

export function UniversitiesPrograms({ universities, location }: UniversitiesProgramsProps) {
    const { compareTray, addToCompareTray, removeFromCompareTray } = useAppStore()
    const [error, setError] = useState<string | null>(null)

    const filteredUniversities = location && location !== "All Locations"
        ? universities.filter((u) => u.location === location)
        : universities

    const handleCompare = (uniId: string) => {
        const isSelected = compareTray.ids.includes(uniId)
<<<<<<< Updated upstream

=======
>>>>>>> Stashed changes
        if (isSelected) {
            removeFromCompareTray(uniId)
        } else {
            if (compareTray.ids.length >= 3) {
<<<<<<< Updated upstream
                setError("You can only compare up to 3 institutions.")
=======
                setError("You can only compare up to 3 universities.")
>>>>>>> Stashed changes
                setTimeout(() => setError(null), 3000)
                return
            }
            addToCompareTray("universities", uniId, "programs")
        }
    }

    return (
        <div className="space-y-6">
            <section>
<<<<<<< Updated upstream
                <h3 className="text-sm font-semibold text-foreground mb-3">Programmes by Institution</h3>
=======
                <h3 className="text-sm font-medium text-foreground mb-3">Programs & Faculties by Institution</h3>
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
                                    <h4 className="text-sm font-bold text-foreground uppercase tracking-tight">{uni.university}</h4>
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mt-1">
                                        {uni.location}, {uni.provinceArea}
                                    </p>
                                </div>
<<<<<<< Updated upstream
                                <span className="text-[9px] font-black uppercase tracking-widest bg-teal-50 text-teal-700 px-2 py-0.5 rounded-full border border-teal-100">
=======
                                    <h4 className="text-sm font-medium text-foreground uppercase tracking-tight">{uni.name}</h4>
                                    <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mt-1">
                                        {uni.city}, {uni.province}
                                    </p>
                                </div>
                                <span className="text-[9px] font-medium uppercase tracking-widest bg-teal-50 text-teal-700 px-2 py-0.5 rounded-full border border-teal-100">
>>>>>>> Stashed changes
                                    {uni.type.replace("_", " ")}
                                </span>
                            </div>

                            <div className="space-y-3">
                                <div>
                                    <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">Faculties ({uni.faculties.length})</p>
                                    <div className="flex flex-wrap gap-1.5">
                                        {uni.faculties.map((faculty) => (
                                            <span
                                                key={faculty}
                                                className="text-[10px] font-medium bg-teal-50 text-teal-700 px-3 py-1 rounded-full border border-teal-100"
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
                                                        "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-medium uppercase tracking-widest transition-all border",
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
=======
                                <div className="flex items-center gap-2">
                                    <span className="text-[9px] font-black uppercase tracking-widest bg-teal-50 text-teal-700 px-2 py-0.5 rounded-full border border-teal-100">
                                        {uni.type.replace("_", " ")}
                                    </span>
                                    <button
                                        onClick={() => handleCompare(uni.id)}
                                        className={cn(
                                            "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border",
                                            compareTray.ids.includes(uni.id)
                                                ? "bg-teal-600 text-white border-teal-600 shadow-lg shadow-teal-600/20"
                                                : "bg-teal-50 text-teal-700 border-teal-100 hover:bg-teal-100"
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
                                                <span>Compare</span>
                                            </>
                                        )}
                                    </button>
>>>>>>> Stashed changes
                                </div>
                            </div>

                            {uni.programmeSummary && (
                                <div className="rounded-xl bg-secondary/30 p-3">
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-tight mb-1">Programme Summary</p>
                                    <p className="text-xs font-medium">{uni.programmeSummary}</p>
                                </div>
                            )}

                            {uni.programmeSourceUrl && (
                                <p className="mt-2 text-[11px] text-blue-600">
                                    <a href={uni.programmeSourceUrl} target="_blank" rel="noreferrer" className="hover:underline">
                                        View Programme Details →
                                    </a>
                                </p>
                            )}

                            {error && compareTray.ids.length >= 3 && (
                                <div className="mt-3 flex items-center gap-1.5 text-[10px] text-destructive font-medium animate-in fade-in slide-in-from-left-1">
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

