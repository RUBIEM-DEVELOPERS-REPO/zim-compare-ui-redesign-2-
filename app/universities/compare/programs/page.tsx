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
                    <h2 className="text-xl font-bold text-foreground mb-2">No institutions selected for comparison</h2>
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
                    <h1 className="text-xl font-semibold text-foreground">Programme Comparison</h1>
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
                        <div className="font-bold text-sm text-foreground bg-secondary/30 rounded-lg p-3 flex items-center col-span-1">
                            Program Detail
                        </div>
                        {selectedPrograms.map((p) => (
                            <div key={p.id} className="bg-teal-50 border border-teal-100 rounded-lg p-4 col-span-1">
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

                        <ComparisonRow label="Min Fees (USD)" highlight>
                            {selectedPrograms.map((p) => (
                                <span key={p.id} className="text-sm font-bold text-teal-600">
                                    ${p.university.feeMinUSD || 0}
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
                    <h2 className="text-lg font-bold text-foreground">Programme Insights</h2>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                    <div className="bg-white rounded-xl p-4 border border-teal-100 shadow-sm">
                        <p className="text-[10px] font-bold text-teal-600 uppercase mb-1">Most Affordable</p>
                        <p className="text-sm font-bold text-foreground">
                            {[...selectedPrograms].sort((a, b) => (a.university.feeMinUSD || 999999) - (b.university.feeMinUSD || 999999))[0].university.university}
                        </p>
                        <p className="text-[10px] text-muted-foreground mt-1">Lowest minimum fees among selected.</p>
                    </div>
                    <div className="bg-white rounded-xl p-4 border border-teal-100 shadow-sm">
                        <p className="text-[10px] font-bold text-teal-600 uppercase mb-1">Highest Fee Band</p>
                        <p className="text-sm font-bold text-foreground">
                            {[...selectedPrograms].sort((a, b) => (b.university.feeMaxUSD || 0) - (a.university.feeMaxUSD || 0))[0].university.university}
                        </p>
                        <p className="text-[10px] text-muted-foreground mt-1">Highest maximum fees among selected.</p>
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
