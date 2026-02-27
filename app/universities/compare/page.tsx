"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { useEffect } from "react"
import { universities } from "@/lib/mock/universities"
import { useAppStore } from "@/lib/store"
import { cn } from "@/lib/utils"
import { ArrowLeft, Check, X, Sparkles } from "lucide-react"
import Link from "next/link"
import { University } from "@/lib/types"

export default function UniversitiesComparePage() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const { clearCompareTray } = useAppStore()
    const ids = searchParams.get("ids")?.split(",") || []

    useEffect(() => {
        clearCompareTray()
    }, [clearCompareTray])

    const selectedUniversities = ids
        .map((id) => universities.find((u) => u.id === id))
        .filter((uni): uni is University => !!uni)

    // Empty state
    if (selectedUniversities.length === 0) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center">
                <div className="text-center max-w-md">
                    <div className="w-16 h-16 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <X className="w-8 h-8 text-teal-600" />
                    </div>
                    <h2 className="text-xl font-bold text-foreground mb-2">No universities selected for comparison</h2>
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

    // Generate AI recommendations
    const recommendations = generateRecommendations(selectedUniversities)

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-semibold text-foreground">University Comparison</h1>
                    <p className="text-sm text-muted-foreground">
                        Comparing {selectedUniversities.length} institution{selectedUniversities.length > 1 ? "s" : ""}
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
                    <div className="grid gap-4" style={{ gridTemplateColumns: `200px repeat(${selectedUniversities.length}, 1fr)` }}>
                        {/* Header Row */}
                        <div className="font-bold text-sm text-foreground bg-secondary/30 rounded-lg p-3 flex items-center">
                            Criteria
                        </div>
                        {selectedUniversities.map((uni) => (
                            <div key={uni.id} className="bg-teal-50 border border-teal-100 rounded-lg p-4">
                                <h3 className="font-bold text-sm text-foreground uppercase tracking-tight mb-1">{uni.name}</h3>
                                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{uni.city}</p>
                            </div>
                        ))}

                        {/* Institution Type */}
                        <ComparisonRow label="Type">
                            {selectedUniversities.map((uni) => (
                                <span key={uni.id} className="text-xs font-medium capitalize">
                                    {uni.type.replace("_", " ")}
                                </span>
                            ))}
                        </ComparisonRow>

                        {/* Annual Fees */}
                        <ComparisonRow label="Annual Fees" highlight>
                            {selectedUniversities.map((uni) => (
                                <span key={uni.id} className="text-sm font-bold text-teal-600">
                                    ${uni.annualFees.toLocaleString()}
                                </span>
                            ))}
                        </ComparisonRow>

                        {/* Application Fee */}
                        <ComparisonRow label="Application Fee">
                            {selectedUniversities.map((uni) => (
                                <span key={uni.id} className="text-xs font-medium">
                                    ${uni.applicationFee}
                                </span>
                            ))}
                        </ComparisonRow>

                        {/* Ranking */}
                        <ComparisonRow label="Ranking">
                            {selectedUniversities.map((uni) => (
                                <span key={uni.id} className="text-xs font-medium">
                                    {uni.ranking.local ? `#${uni.ranking.local} Local` : "Not Ranked"}
                                    {uni.ranking.global && (
                                        <span className="block text-[10px] text-muted-foreground">
                                            #{uni.ranking.global} Global
                                        </span>
                                    )}
                                </span>
                            ))}
                        </ComparisonRow>

                        {/* Accreditation */}
                        <ComparisonRow label="Accreditation">
                            {selectedUniversities.map((uni) => (
                                <span key={uni.id} className="text-xs font-medium">
                                    {uni.accreditationStatus}
                                </span>
                            ))}
                        </ComparisonRow>

                        {/* Acceptance Rate */}
                        <ComparisonRow label="Acceptance Rate">
                            {selectedUniversities.map((uni) => (
                                <span key={uni.id} className="text-xs font-medium">
                                    {uni.acceptanceRate ? `${uni.acceptanceRate}%` : "N/A"}
                                </span>
                            ))}
                        </ComparisonRow>

                        {/* Academic Score */}
                        <ComparisonRow label="Academic Score" highlight>
                            {selectedUniversities.map((uni) => (
                                <span key={uni.id} className="text-sm font-bold text-foreground">
                                    {uni.academicScore}%
                                </span>
                            ))}
                        </ComparisonRow>

                        {/* Affordability Score */}
                        <ComparisonRow label="Affordability Score" highlight>
                            {selectedUniversities.map((uni) => (
                                <span key={uni.id} className="text-sm font-bold text-foreground">
                                    {uni.affordabilityScore}%
                                </span>
                            ))}
                        </ComparisonRow>

                        {/* Employability Score */}
                        <ComparisonRow label="Employability Score" highlight>
                            {selectedUniversities.map((uni) => (
                                <span key={uni.id} className="text-sm font-bold text-foreground">
                                    {uni.employabilityScore}%
                                </span>
                            ))}
                        </ComparisonRow>

                        {/* Student Life Rating */}
                        <ComparisonRow label="Student Life">
                            {selectedUniversities.map((uni) => (
                                <span key={uni.id} className="text-xs font-medium">
                                    {uni.studentLifeRating}%
                                </span>
                            ))}
                        </ComparisonRow>

                        {/* Graduate Employability */}
                        <ComparisonRow label="Graduate Employment">
                            {selectedUniversities.map((uni) => (
                                <span key={uni.id} className="text-xs font-medium">
                                    {uni.graduateEmployabilityScore}%
                                </span>
                            ))}
                        </ComparisonRow>

                        {/* Accommodation */}
                        <ComparisonRow label="Accommodation">
                            {selectedUniversities.map((uni) => (
                                <div key={uni.id}>
                                    {uni.accommodationAvailable ? (
                                        <Check className="w-4 h-4 text-teal-600" />
                                    ) : (
                                        <X className="w-4 h-4 text-gray-400" />
                                    )}
                                </div>
                            ))}
                        </ComparisonRow>

                        {/* Online Learning */}
                        <ComparisonRow label="Online Learning">
                            {selectedUniversities.map((uni) => (
                                <div key={uni.id}>
                                    {uni.onlineLearningAvailable ? (
                                        <Check className="w-4 h-4 text-teal-600" />
                                    ) : (
                                        <X className="w-4 h-4 text-gray-400" />
                                    )}
                                </div>
                            ))}
                        </ComparisonRow>

                        {/* Faculties */}
                        <ComparisonRow label="Faculties">
                            {selectedUniversities.map((uni) => (
                                <div key={uni.id} className="flex flex-wrap gap-1">
                                    {uni.faculties.slice(0, 3).map((f) => (
                                        <span key={f} className="text-[9px] font-medium bg-teal-50 text-teal-700 px-2 py-0.5 rounded-full">
                                            {f}
                                        </span>
                                    ))}
                                    {uni.faculties.length > 3 && (
                                        <span className="text-[9px] text-muted-foreground">+{uni.faculties.length - 3}</span>
                                    )}
                                </div>
                            ))}
                        </ComparisonRow>

                        {/* Location */}
                        <ComparisonRow label="Location">
                            {selectedUniversities.map((uni) => (
                                <span key={uni.id} className="text-xs font-medium">
                                    {uni.city}, {uni.province}
                                </span>
                            ))}
                        </ComparisonRow>
                    </div>
                </div>
            </div>

            {/* AI Recommendations */}
            <div className="rounded-2xl border border-teal-200 bg-gradient-to-br from-teal-50 to-blue-50 p-6">
                <div className="flex items-center gap-2 mb-4">
                    <Sparkles className="w-5 h-5 text-teal-600" />
                    <h2 className="text-lg font-bold text-foreground">AI Recommendations</h2>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                    {/* Best for Affordability */}
                    <div className="bg-white rounded-xl p-4 border border-teal-100">
                        <h3 className="text-sm font-bold text-teal-600 mb-2 uppercase tracking-wide">Best for Affordability</h3>
                        <p className="text-sm font-bold text-foreground mb-2">{recommendations.affordability.name}</p>
                        <ul className="space-y-1">
                            {recommendations.affordability.reasons.map((reason, idx) => (
                                <li key={idx} className="text-xs text-muted-foreground flex items-start gap-2">
                                    <span className="text-teal-600 mt-0.5">•</span>
                                    <span>{reason}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Best for Academics */}
                    <div className="bg-white rounded-xl p-4 border border-teal-100">
                        <h3 className="text-sm font-bold text-teal-600 mb-2 uppercase tracking-wide">Best for Academics</h3>
                        <p className="text-sm font-bold text-foreground mb-2">{recommendations.academics.name}</p>
                        <ul className="space-y-1">
                            {recommendations.academics.reasons.map((reason, idx) => (
                                <li key={idx} className="text-xs text-muted-foreground flex items-start gap-2">
                                    <span className="text-teal-600 mt-0.5">•</span>
                                    <span>{reason}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Best for Career Opportunities */}
                    <div className="bg-white rounded-xl p-4 border border-teal-100">
                        <h3 className="text-sm font-bold text-teal-600 mb-2 uppercase tracking-wide">Best for Career Opportunities</h3>
                        <p className="text-sm font-bold text-foreground mb-2">{recommendations.career.name}</p>
                        <ul className="space-y-1">
                            {recommendations.career.reasons.map((reason, idx) => (
                                <li key={idx} className="text-xs text-muted-foreground flex items-start gap-2">
                                    <span className="text-teal-600 mt-0.5">•</span>
                                    <span>{reason}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Best Overall */}
                    <div className="bg-white rounded-xl p-4 border border-teal-100">
                        <h3 className="text-sm font-bold text-teal-600 mb-2 uppercase tracking-wide">Best Overall</h3>
                        <p className="text-sm font-bold text-foreground mb-2">{recommendations.overall.name}</p>
                        <ul className="space-y-1">
                            {recommendations.overall.reasons.map((reason, idx) => (
                                <li key={idx} className="text-xs text-muted-foreground flex items-start gap-2">
                                    <span className="text-teal-600 mt-0.5">•</span>
                                    <span>{reason}</span>
                                </li>
                            ))}
                        </ul>
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

function generateRecommendations(unis: University[]) {
    // Best for Affordability
    const mostAffordable = [...unis].sort((a, b) => b.affordabilityScore - a.affordabilityScore)[0]

    // Best for Academics
    const bestAcademic = [...unis].sort((a, b) => b.academicScore - a.academicScore)[0]

    // Best for Career
    const bestCareer = [...unis].sort((a, b) => b.employabilityScore - a.employabilityScore)[0]

    // Best Overall (weighted average)
    const bestOverall = [...unis].sort((a, b) => {
        const scoreA = (a.academicScore * 0.35) + (a.affordabilityScore * 0.25) + (a.employabilityScore * 0.4)
        const scoreB = (b.academicScore * 0.35) + (b.affordabilityScore * 0.25) + (b.employabilityScore * 0.4)
        return scoreB - scoreA
    })[0]

    return {
        affordability: {
            name: mostAffordable.name,
            reasons: [
                `Lowest annual fees at $${mostAffordable.annualFees.toLocaleString()}`,
                `Affordability score of ${mostAffordable.affordabilityScore}%`,
                `Application fee only $${mostAffordable.applicationFee}`
            ]
        },
        academics: {
            name: bestAcademic.name,
            reasons: [
                `Highest academic score at ${bestAcademic.academicScore}%`,
                bestAcademic.ranking.local ? `Ranked #${bestAcademic.ranking.local} locally` : "Strong academic reputation",
                `${bestAcademic.faculties.length} faculties offering diverse programs`
            ]
        },
        career: {
            name: bestCareer.name,
            reasons: [
                `Top employability score of ${bestCareer.employabilityScore}%`,
                `Graduate employment rate of ${bestCareer.graduateEmployabilityScore}%`,
                `Strong industry connections and career support`
            ]
        },
        overall: {
            name: bestOverall.name,
            reasons: [
                `Balanced excellence across all metrics`,
                `Academic score: ${bestOverall.academicScore}%, Employability: ${bestOverall.employabilityScore}%`,
                `${bestOverall.accreditationStatus} with ${bestOverall.faculties.length} faculties`
            ]
        }
    }
}
