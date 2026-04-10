"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { universities } from "@/lib/mock/universities"
import { useAppStore } from "@/lib/store"
import { cn } from "@/lib/utils"
import { ArrowLeft, Check, X, Sparkles, GraduationCap } from "lucide-react"
import Link from "next/link"
import { useEffect } from "react"
import { University } from "@/lib/types"

interface SelectedProgram {
    university: University
    programName: string
    id: string
}

export default function UniversityProgramsComparePage() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const { clearCompareTray } = useAppStore()
    const ids = searchParams.get("ids")?.split(",") || []

    useEffect(() => {
        clearCompareTray()
    }, [clearCompareTray])

    const selectedPrograms: SelectedProgram[] = ids
        .map((compositeId) => {
            const [uniId, programName] = compositeId.split(":")
            const university = universities.find((u) => u.id === uniId)
            if (university && university.programs.includes(programName)) {
                return { university, programName, id: compositeId }
            }
            return null
        })
        .filter((p): p is SelectedProgram => !!p)

    // Empty state
    if (selectedPrograms.length === 0) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center">
                <div className="text-center max-w-md">
                    <div className="w-16 h-16 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <GraduationCap className="w-8 h-8 text-teal-600" />
                    </div>
                    <h2 className="text-xl font-bold text-foreground mb-2">No programs selected for comparison</h2>
                    <p className="text-sm text-muted-foreground mb-6">
                        Please select at least 2 programs from the Universities page to compare.
                    </p>
                    <Link
                        href="/universities"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Go back to Universities
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-semibold text-foreground">Program Comparison</h1>
                    <p className="text-sm text-muted-foreground">
                        Comparing {selectedPrograms.length} academic program{selectedPrograms.length > 1 ? "s" : ""}
                    </p>
                </div>
                <Link
                    href="/universities"
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Universities
                </Link>
            </div>

            {/* Comparison Table */}
            <div className="overflow-x-auto">
                <div className="inline-block min-w-full align-middle">
                    <div className="grid-dynamic-cols gap-4" data-columns={selectedPrograms.length}>
                        {/* Header Row */}
                        <div className="font-bold text-sm text-foreground bg-secondary/30 rounded-lg p-3 flex items-center col-span-1">
                            Program Detail
                        </div>
                        {selectedPrograms.map((p) => (
                            <div key={p.id} className="bg-teal-50 border border-teal-100 rounded-lg p-4 col-span-1">
                                <h3 className="font-bold text-sm text-foreground uppercase tracking-tight mb-1">{p.programName}</h3>
                                <p className="text-[10px] text-teal-700 font-bold uppercase tracking-wider">{p.university.name}</p>
                            </div>
                        ))}

                        {/* University Details */}
                        <ComparisonRow label="University Type">
                            {selectedPrograms.map((p) => (
                                <span key={p.id} className="text-xs font-medium capitalize">
                                    {p.university.type.replace("_", " ")}
                                </span>
                            ))}
                        </ComparisonRow>

                        <ComparisonRow label="Location">
                            {selectedPrograms.map((p) => (
                                <span key={p.id} className="text-xs font-medium">
                                    {p.university.city}
                                </span>
                            ))}
                        </ComparisonRow>

                        {/* Program Scores */}
                        <ComparisonRow label="Academic Strength" highlight>
                            {selectedPrograms.map((p) => (
                                <span key={p.id} className="text-sm font-bold text-foreground">
                                    {p.university.academicScore}%
                                </span>
                            ))}
                        </ComparisonRow>

                        <ComparisonRow label="Employability" highlight>
                            {selectedPrograms.map((p) => (
                                <span key={p.id} className="text-sm font-bold text-foreground">
                                    {p.university.employabilityScore}%
                                </span>
                            ))}
                        </ComparisonRow>

                        {/* Fees associated with University */}
                        <ComparisonRow label="Estimated Annual Fees">
                            {selectedPrograms.map((p) => (
                                <span key={p.id} className="text-sm font-bold text-teal-600">
                                    ${p.university.annualFees.toLocaleString()}
                                </span>
                            ))}
                        </ComparisonRow>

                        {/* Rankings */}
                        <ComparisonRow label="Uni Local Ranking">
                            {selectedPrograms.map((p) => (
                                <span key={p.id} className="text-xs font-medium">
                                    {p.university.ranking.local ? `#${p.university.ranking.local}` : "N/A"}
                                </span>
                            ))}
                        </ComparisonRow>

                        {/* Facilities/Amenities */}
                        <ComparisonRow label="On-Campus Housing">
                            {selectedPrograms.map((p) => (
                                <div key={p.id}>
                                    {p.university.accommodationAvailable ? (
                                        <Check className="w-4 h-4 text-teal-600" />
                                    ) : (
                                        <X className="w-4 h-4 text-gray-400" />
                                    )}
                                </div>
                            ))}
                        </ComparisonRow>

                        <ComparisonRow label="Online Learning">
                            {selectedPrograms.map((p) => (
                                <div key={p.id}>
                                    {p.university.onlineLearningAvailable ? (
                                        <Check className="w-4 h-4 text-teal-600" />
                                    ) : (
                                        <X className="w-4 h-4 text-gray-400" />
                                    )}
                                </div>
                            ))}
                        </ComparisonRow>

                        {/* Duration (Mocked since not in dataset) */}
                        <ComparisonRow label="Typical Duration">
                            {selectedPrograms.map((p) => (
                                <span key={p.id} className="text-xs font-medium">
                                    3-4 Years
                                </span>
                            ))}
                        </ComparisonRow>
                    </div>
                </div>
            </div>

            {/* Smart Insights */}
            <div className="rounded-2xl border border-teal-200 bg-gradient-to-br from-teal-50 to-blue-50 p-6">
                <div className="flex items-center gap-2 mb-4">
                    <Sparkles className="w-5 h-5 text-teal-600" />
                    <h2 className="text-lg font-bold text-foreground">Program Insights</h2>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                    <div className="bg-white rounded-xl p-4 border border-teal-100 shadow-sm">
                        <p className="text-[10px] font-bold text-teal-600 uppercase mb-1">Most Renowned</p>
                        <p className="text-sm font-bold text-foreground">
                            {selectedPrograms.sort((a, b) => b.university.academicScore - a.university.academicScore)[0].programName}
                        </p>
                        <p className="text-[10px] text-muted-foreground mt-1">Based on university academic rating.</p>
                    </div>
                    <div className="bg-white rounded-xl p-4 border border-teal-100 shadow-sm">
                        <p className="text-[10px] font-bold text-teal-600 uppercase mb-1">Best Career Path</p>
                        <p className="text-sm font-bold text-foreground">
                            {selectedPrograms.sort((a, b) => b.university.employabilityScore - a.university.employabilityScore)[0].programName}
                        </p>
                        <p className="text-[10px] text-muted-foreground mt-1">Based on graduate employability scores.</p>
                    </div>
                    <div className="bg-white rounded-xl p-4 border border-teal-100 shadow-sm">
                        <p className="text-[10px] font-bold text-teal-600 uppercase mb-1">Best Value</p>
                        <p className="text-sm font-bold text-foreground">
                            {selectedPrograms.sort((a, b) => a.university.annualFees - b.university.annualFees)[0].programName}
                        </p>
                        <p className="text-[10px] text-muted-foreground mt-1">Lowest annual fees among selected.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

function ComparisonRow({ label, children, highlight = false }: { label: string; children: React.ReactNode; highlight?: boolean }) {
    const childArray = Array.isArray(children) ? children : [children]

    return (
        <>
            <div className={cn(
                "font-medium text-xs text-foreground rounded-lg p-3 flex items-center",
                highlight ? "bg-teal-50/50" : "bg-secondary/20"
            )}>
                {label}
            </div>
            {childArray.map((child, idx) => (
                <div key={idx} className={cn(
                    "rounded-lg p-3 flex items-center",
                    highlight ? "bg-teal-50/30" : "bg-card border border-border"
                )}>
                    {child}
                </div>
            ))}
        </>
    )
}
