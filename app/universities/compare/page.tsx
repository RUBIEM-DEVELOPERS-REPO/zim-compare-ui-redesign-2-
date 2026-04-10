"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { apiGet } from "@/lib/api"
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

    const [universities, setUniversities] = useState<University[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        clearCompareTray()
        apiGet('/universities')
            .then(res => {
                setUniversities(res.universities || [])
                setLoading(false)
            })
            .catch(() => {
                setUniversities([])
                setLoading(false)
            })
    }, [clearCompareTray])

    const selectedUniversities = ids
        .map((id) => universities.find((u) => u.id === id))
        .filter((uni): uni is University => !!uni)

    if (loading) {
        return <div className="flex items-center justify-center min-h-[60vh] text-muted-foreground">Loading universities...</div>
    }

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
                    <div className="grid-dynamic-cols gap-4" data-columns={selectedUniversities.length}>
                        {/* Header Row */}
                        <div className="font-bold text-sm text-foreground bg-secondary/30 rounded-lg p-3 flex items-center col-span-1">
                            Criteria
                        </div>
                        {selectedUniversities.map((uni) => (
<<<<<<< Updated upstream
                            <div key={uni.id} className="bg-teal-50 border border-teal-100 rounded-lg p-4 col-span-1">
                                <h3 className="font-bold text-sm text-foreground uppercase tracking-tight mb-1">{uni.name}</h3>
                                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{uni.city}</p>
=======
                            <div key={uni.id} className="bg-teal-50 border border-teal-100 rounded-lg p-4">
                                <h3 className="font-bold text-sm text-foreground uppercase tracking-tight mb-1">{uni.university}</h3>
                                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{uni.location}</p>
>>>>>>> Stashed changes
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
                        
                        {/* Location */}
                        <ComparisonRow label="Region">
                            {selectedUniversities.map((uni) => (
                                <span key={uni.id} className="text-xs font-medium capitalize">
                                    {uni.provinceArea}
                                </span>
                            ))}
                        </ComparisonRow>

                        {/* Min Fees */}
                        <ComparisonRow label="Min Fees (USD)" highlight>
                            {selectedUniversities.map((uni) => (
                                <span key={uni.id} className="text-sm font-bold text-teal-600">
                                    ${uni.feeMinUSD || 0}
                                </span>
                            ))}
                        </ComparisonRow>

                        {/* Max Fees */}
                        <ComparisonRow label="Max Fees (USD)">
                            {selectedUniversities.map((uni) => (
                                <span key={uni.id} className="text-xs font-medium">
                                    ${uni.feeMaxUSD || 0}
                                </span>
                            ))}
                        </ComparisonRow>

                        {/* Fee Note */}
                        <ComparisonRow label="Fee Note">
                            {selectedUniversities.map((uni) => (
                                <span key={uni.id} className="text-xs font-medium text-muted-foreground">
                                    {uni.feeNote || "-"}
                                </span>
                            ))}
                        </ComparisonRow>

                        {/* Fee Confidence */}
                        <ComparisonRow label="Fee Confidence">
                            {selectedUniversities.map((uni) => (
                                <span key={uni.id} className="text-xs font-medium">
                                    {uni.feeConfidence || "-"}
                                </span>
                            ))}
                        </ComparisonRow>

                        {/* Programs Summary */}
                        <ComparisonRow label="Programs">
                            {selectedUniversities.map((uni) => (
                                <span key={uni.id} className="text-xs font-medium">
                                    {uni.programmeSummary || "Data unavailable"}
                                </span>
                            ))}
                        </ComparisonRow>

                        {/* Source URL */}
                        <ComparisonRow label="Source URL">
                            {selectedUniversities.map((uni) => (
                                <span key={uni.id} className="text-xs font-medium">
                                    {uni.programmeSourceUrl ? (
                                        <a href={uni.programmeSourceUrl} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">Link</a>
                                    ) : "-"}
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
                        <h3 className="text-sm font-bold text-teal-600 mb-2 uppercase tracking-wide">Most Affordable</h3>
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

                    {/* Most Information */}
                    <div className="bg-white rounded-xl p-4 border border-teal-100">
                        <h3 className="text-sm font-bold text-teal-600 mb-2 uppercase tracking-wide">Target Range</h3>
                        <p className="text-sm font-bold text-foreground mb-2">{recommendations.info.name}</p>
                        <ul className="space-y-1">
                            {recommendations.info.reasons.map((reason, idx) => (
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
    const mostAffordable = [...unis].sort((a, b) => (a.feeMinUSD || 999999) - (b.feeMinUSD || 999999))[0]
    
    // Fallback recommendation
    const infoRich = [...unis].sort((a, b) => (b.feeMaxUSD || 0) - (a.feeMaxUSD || 0))[0]

    return {
        affordability: {
            name: mostAffordable.university,
            reasons: [
                `Lowest minimum fees at $${mostAffordable.feeMinUSD || 0}`,
                `Fee confidence level: ${mostAffordable.feeConfidence || "Unknown"}`
            ]
        },
        info: {
            name: infoRich.university,
            reasons: [
                `Maximum top band indicator: $${infoRich.feeMaxUSD || 0}`
            ]
        }
    }
}
