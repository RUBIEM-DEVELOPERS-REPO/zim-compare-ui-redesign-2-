"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { universities } from "@/lib/mock/universities"
import { useAppStore } from "@/lib/store"
import { cn } from "@/lib/utils"
import { ArrowLeft, Sparkles, GraduationCap } from "lucide-react"
import Link from "next/link"
import { useEffect } from "react"
import { University } from "@/lib/types"

interface SelectedProgram {
    university: University
    id: string
}

export default function UniversityProgramsComparePage() {
    const searchParams = useSearchParams()
    const { clearCompareTray } = useAppStore()
    const ids = searchParams.get("ids")?.split(",") || []

    useEffect(() => {
        clearCompareTray()
    }, [clearCompareTray])

    const selectedPrograms: SelectedProgram[] = ids
        .map((uniId) => {
            const university = universities.find((u) => u.id === uniId)
            if (university) {
                return { university, id: uniId }
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
<<<<<<< Updated upstream
                    <h2 className="text-xl font-bold text-foreground mb-2">No institutions selected for comparison</h2>
=======
                    <h2 className="text-xl font-medium text-foreground mb-2">No programs selected for comparison</h2>
>>>>>>> Stashed changes
                    <p className="text-sm text-muted-foreground mb-6">
                        Please select at least 2 institutions from the Universities page to compare.
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
<<<<<<< Updated upstream
                    <h1 className="text-xl font-semibold text-foreground">Programme Comparison</h1>
=======
                    <h1 className="text-xl font-medium text-foreground">Program Comparison</h1>
>>>>>>> Stashed changes
                    <p className="text-sm text-muted-foreground">
                        Comparing {selectedPrograms.length} institution{selectedPrograms.length > 1 ? "s" : ""}
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
<<<<<<< Updated upstream
<<<<<<< Updated upstream
                        <div className="font-bold text-sm text-foreground bg-secondary/30 rounded-lg p-3 flex items-center col-span-1">
=======
                        <div className="font-medium text-sm text-foreground bg-secondary/30 rounded-lg p-3 flex items-center col-span-1">
>>>>>>> Stashed changes
                            Program Detail
                        </div>
                        {selectedPrograms.map((p) => (
                            <div key={p.id} className="bg-teal-50 border border-teal-100 rounded-lg p-4 col-span-1">
<<<<<<< Updated upstream
                                <h3 className="font-bold text-sm text-foreground uppercase tracking-tight mb-1">{p.programName}</h3>
                                <p className="text-[10px] text-teal-700 font-bold uppercase tracking-wider">{p.university.name}</p>
=======
                        <div className="font-bold text-sm text-foreground bg-secondary/30 rounded-lg p-3 flex items-center">
                            Detail
                        </div>
                        {selectedPrograms.map((p) => (
                            <div key={p.id} className="bg-teal-50 border border-teal-100 rounded-lg p-4">
                                <h3 className="font-bold text-sm text-foreground uppercase tracking-tight mb-1">{p.university.university}</h3>
                                <p className="text-[10px] text-teal-700 font-bold uppercase tracking-wider">{p.university.location}</p>
>>>>>>> Stashed changes
=======
                                <h3 className="font-medium text-sm text-foreground uppercase tracking-tight mb-1">{p.programName}</h3>
                                <p className="text-[10px] text-teal-700 font-medium uppercase tracking-wider">{p.university.name}</p>
>>>>>>> Stashed changes
                            </div>
                        ))}

                        {/* University Details */}
                        <ComparisonRow label="Institution Type">
                            {selectedPrograms.map((p) => (
                                <span key={p.id} className="text-xs font-medium capitalize">
                                    {p.university.type.replace("_", " ")}
                                </span>
                            ))}
                        </ComparisonRow>

                        <ComparisonRow label="Region">
                            {selectedPrograms.map((p) => (
                                <span key={p.id} className="text-xs font-medium">
                                    {p.university.provinceArea}
                                </span>
                            ))}
                        </ComparisonRow>

<<<<<<< Updated upstream
                        <ComparisonRow label="Min Fees (USD)" highlight>
                            {selectedPrograms.map((p) => (
                                <span key={p.id} className="text-sm font-bold text-teal-600">
                                    ${p.university.feeMinUSD || 0}
=======
                        {/* Program Scores */}
                        <ComparisonRow label="Academic Strength" highlight>
                            {selectedPrograms.map((p) => (
                                <span key={p.id} className="text-sm font-medium text-foreground">
                                    {p.university.academicScore}%
                                </span>
                            ))}
                        </ComparisonRow>

                        <ComparisonRow label="Employability" highlight>
                            {selectedPrograms.map((p) => (
                                <span key={p.id} className="text-sm font-medium text-foreground">
                                    {p.university.employabilityScore}%
                                </span>
                            ))}
                        </ComparisonRow>

                        {/* Fees associated with University */}
                        <ComparisonRow label="Estimated Annual Fees">
                            {selectedPrograms.map((p) => (
                                <span key={p.id} className="text-sm font-medium text-teal-600">
                                    ${p.university.annualFees.toLocaleString()}
>>>>>>> Stashed changes
                                </span>
                            ))}
                        </ComparisonRow>

                        <ComparisonRow label="Max Fees (USD)">
                            {selectedPrograms.map((p) => (
                                <span key={p.id} className="text-xs font-medium">
                                    ${p.university.feeMaxUSD || 0}
                                </span>
                            ))}
                        </ComparisonRow>

                        <ComparisonRow label="Fee Confidence">
                            {selectedPrograms.map((p) => (
                                <span key={p.id} className="text-xs font-medium">
                                    {p.university.feeConfidence || "—"}
                                </span>
                            ))}
                        </ComparisonRow>

                        <ComparisonRow label="Programme Summary">
                            {selectedPrograms.map((p) => (
                                <span key={p.id} className="text-xs font-medium">
                                    {p.university.programmeSummary || "Data unavailable"}
                                </span>
                            ))}
                        </ComparisonRow>

                        <ComparisonRow label="Source URL">
                            {selectedPrograms.map((p) => (
                                <span key={p.id} className="text-xs font-medium">
                                    {p.university.programmeSourceUrl ? (
                                        <a href={p.university.programmeSourceUrl} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">View →</a>
                                    ) : "—"}
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
<<<<<<< Updated upstream
                    <h2 className="text-lg font-bold text-foreground">Programme Insights</h2>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                    <div className="bg-white rounded-xl p-4 border border-teal-100 shadow-sm">
                        <p className="text-[10px] font-bold text-teal-600 uppercase mb-1">Most Affordable</p>
                        <p className="text-sm font-bold text-foreground">
                            {[...selectedPrograms].sort((a, b) => (a.university.feeMinUSD || 999999) - (b.university.feeMinUSD || 999999))[0].university.university}
=======
                    <h2 className="text-lg font-medium text-foreground">Program Insights</h2>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="bg-white rounded-xl p-4 border border-teal-100 shadow-sm">
                        <p className="text-[10px] font-medium text-teal-600 uppercase mb-1">Most Renowned</p>
                        <p className="text-sm font-medium text-foreground">
                            {selectedPrograms.sort((a, b) => b.university.academicScore - a.university.academicScore)[0].programName}
>>>>>>> Stashed changes
                        </p>
                        <p className="text-[10px] text-muted-foreground mt-1">Lowest minimum fees among selected.</p>
                    </div>
                    <div className="bg-white rounded-xl p-4 border border-teal-100 shadow-sm">
<<<<<<< Updated upstream
                        <p className="text-[10px] font-bold text-teal-600 uppercase mb-1">Highest Fee Band</p>
                        <p className="text-sm font-bold text-foreground">
                            {[...selectedPrograms].sort((a, b) => (b.university.feeMaxUSD || 0) - (a.university.feeMaxUSD || 0))[0].university.university}
                        </p>
                        <p className="text-[10px] text-muted-foreground mt-1">Highest maximum fees among selected.</p>
=======
                        <p className="text-[10px] font-medium text-teal-600 uppercase mb-1">Best Career Path</p>
                        <p className="text-sm font-medium text-foreground">
                            {selectedPrograms.sort((a, b) => b.university.employabilityScore - a.university.employabilityScore)[0].programName}
                        </p>
                        <p className="text-[10px] text-muted-foreground mt-1">Based on graduate employability scores.</p>
                    </div>
                    <div className="bg-white rounded-xl p-4 border border-teal-100 shadow-sm">
                        <p className="text-[10px] font-medium text-teal-600 uppercase mb-1">Best Value</p>
                        <p className="text-sm font-medium text-foreground">
                            {selectedPrograms.sort((a, b) => a.university.annualFees - b.university.annualFees)[0].programName}
                        </p>
                        <p className="text-[10px] text-muted-foreground mt-1">Lowest annual fees among selected.</p>
>>>>>>> Stashed changes
                    </div>

                    {/* Apply Now */}
                    <div className="bg-teal-600 rounded-xl p-4 border border-teal-500 shadow-xl flex flex-col relative overflow-hidden group">
                        <div className="absolute -bottom-2 -right-2 text-white/10 group-hover:scale-110 transition-transform">
                            <GraduationCap className="h-12 w-12" />
                        </div>
                        <p className="text-[9px] font-black text-teal-100 uppercase mb-1 relative z-10">Neural Admission</p>
                        <p className="text-sm font-bold text-white mb-4 relative z-10">Apply Now</p>
                        
                        <div className="flex-1 mb-4 relative z-10">
                            <p className="text-[10px] text-teal-50/80 leading-relaxed italic">
                                Initialize program enrollment for {selectedPrograms.sort((a, b) => b.university.academicScore - a.university.academicScore)[0].programName}.
                            </p>
                        </div>

                        <button className="w-full bg-white py-2 rounded-lg text-[9px] font-black uppercase tracking-widest text-teal-700 hover:bg-teal-50 transition-colors relative z-10">
                            Start Application
                        </button>
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

