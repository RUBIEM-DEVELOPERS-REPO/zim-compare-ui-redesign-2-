"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { useEffect, useState, Suspense } from "react"
import { apiGet } from "@/lib/api"
import { useAppStore } from "@/lib/store"
import { cn } from "@/lib/utils"
import { ArrowLeft, Check, X, Sparkles } from "lucide-react"
import Link from "next/link"
import { University } from "@/lib/types"
import { PaymentModal } from "@/components/payment-modal"

function UniversitiesCompareContent() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const { clearCompareTray } = useAppStore()
    const ids = searchParams.get("ids")?.split(",") || []

    const [universities, setUniversities] = useState<University[]>([])
    const [loading, setLoading] = useState(true)

    const [isPaymentOpen, setIsPaymentOpen] = useState(false)
    const [paymentItem, setPaymentItem] = useState<{ id: string, name: string, price: number, category: string, provider?: string }>({
        id: "", name: "", price: 0, category: "", provider: ""
    })

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
                    <h2 className="text-xl font-medium text-foreground mb-2">No universities selected for comparison</h2>
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
                    <h1 className="text-xl font-medium text-foreground">University Comparison</h1>
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
                        <div className="font-medium text-sm text-foreground bg-secondary/30 rounded-lg p-3 flex items-center col-span-1">
                            Criteria
                        </div>
                        {selectedUniversities.map((uni) => (
                            <div key={uni.id} className="bg-teal-50 border border-teal-100 rounded-lg p-4 col-span-1">
                                <h3 className="font-medium text-sm text-foreground uppercase tracking-tight mb-1">{uni.university}</h3>
                                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{uni.location}</p>
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
                                    ) : (uni.acceptanceRate ? `${uni.acceptanceRate}%` : "-")}
                                </span>
                            ))}
                        </ComparisonRow>

                        {/* Academic Score */}
                        <ComparisonRow label="Academic Score" highlight>
                            {selectedUniversities.map((uni) => (
                                <span key={uni.id} className="text-sm font-medium text-foreground">
                                    {uni.academicScore}%
                                </span>
                            ))}
                        </ComparisonRow>

                        {/* Affordability Score */}
                        <ComparisonRow label="Affordability Score" highlight>
                            {selectedUniversities.map((uni) => (
                                <span key={uni.id} className="text-sm font-medium text-foreground">
                                    {uni.affordabilityScore}%
                                </span>
                            ))}
                        </ComparisonRow>

                        {/* Employability Score */}
                        <ComparisonRow label="Employability Score" highlight>
                            {selectedUniversities.map((uni) => (
                                <span key={uni.id} className="text-sm font-medium text-foreground">
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
                                    {(uni.faculties || []).slice(0, 3).map((f) => (
                                        <span key={f} className="text-[9px] font-medium bg-teal-50 text-teal-700 px-2 py-0.5 rounded-full">
                                            {f}
                                        </span>
                                    ))}
                                    {(uni.faculties || []).length > 3 && (
                                        <span className="text-[9px] text-muted-foreground">+{(uni.faculties || []).length - 3}</span>
                                    )}
                                </div>
                            ))}
                        </ComparisonRow>

                        {/* Location */}
                        <ComparisonRow label="Location">
                            {selectedUniversities.map((uni) => (
                                <span key={uni.id} className="text-xs font-medium">
                                    {uni.location || uni.city}, {uni.provinceArea || uni.province}
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
                    <h2 className="text-lg font-medium text-foreground">AI Recommendations</h2>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                    {/* Best for Affordability */}
                    <div className="bg-white rounded-xl p-4 border border-teal-100">
                        <h3 className="text-sm font-medium text-teal-600 mb-2 uppercase tracking-wide">Best for Affordability</h3>
                        <p className="text-sm font-medium text-foreground mb-2">{recommendations.affordability.name}</p>
                        <ul className="space-y-1">
                            {recommendations.affordability.reasons.map((reason, idx) => (
                                <li key={idx} className="text-xs text-muted-foreground flex items-start gap-2">
                                    <span className="text-teal-600 mt-0.5">•</span>
                                    <span>{reason}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Strategic Admission Path */}
                    <div className="bg-white rounded-xl p-4 border border-teal-100 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-3 text-teal-500/5 rotate-12 group-hover:rotate-0 transition-all duration-700">
                             <Sparkles size={40} />
                        </div>
                        <h3 className="text-sm font-medium text-teal-600 mb-2 uppercase tracking-wide">Strategic Admission Path</h3>
                        <p className="text-sm font-medium text-foreground mb-2">{recommendations.affordability.name}</p>
                        <p className="text-xs text-muted-foreground leading-relaxed italic">
                            Optimizing your entry vector into the {recommendations.affordability.name} neural cluster yields a 12% increase in fiscal efficiency.
                        </p>
                    </div>

                    {/* Best for Academics */}
                    <div className="bg-white rounded-xl p-4 border border-teal-100">
                        <h3 className="text-sm font-medium text-teal-600 mb-2 uppercase tracking-wide">Best for Academics</h3>
                        <p className="text-sm font-medium text-foreground mb-2">{recommendations.academics.name}</p>
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
                        <h3 className="text-sm font-medium text-teal-600 mb-2 uppercase tracking-wide">Best for Career Opportunities</h3>
                        <p className="text-sm font-medium text-foreground mb-2">{recommendations.career.name}</p>
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
                        <h3 className="text-sm font-medium text-teal-600 mb-2 uppercase tracking-wide">Best Overall</h3>
                        <p className="text-sm font-medium text-foreground mb-2">{recommendations.overall?.name || recommendations.affordability.name}</p>
                        <ul className="space-y-1">
                            {(recommendations.overall?.reasons || recommendations.affordability.reasons).map((reason, idx) => (
                                <li key={idx} className="text-xs text-muted-foreground flex items-start gap-2">
                                    <span className="text-teal-600 mt-0.5">•</span>
                                    <span>{reason}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Apply Now */}
                    <div className="bg-teal-600 rounded-xl p-6 border border-teal-500 shadow-xl flex flex-col relative overflow-hidden group">
                        <div className="absolute -bottom-2 -right-2 text-white/10 group-hover:scale-110 transition-transform duration-700">
                            <Sparkles className="w-20 h-20" />
                        </div>
                        <h3 className="text-[10px] font-black text-teal-100 mb-2 uppercase tracking-widest relative z-10">Neural Direct Path</h3>
                        <p className="text-lg font-bold text-white mb-1 relative z-10">Apply Now</p>
                        <p className="text-[10px] font-medium text-teal-100/80 mb-6 relative z-10">{recommendations.overall.name}</p>
                        
                        <div className="flex-1 mb-8 relative z-10">
                            <p className="text-[11px] text-teal-50/90 leading-relaxed italic">
                                Initialize your academic portfolio at {recommendations.overall.name}. Currently accepting digital admissions.
                            </p>
                        </div>

                        <div className="flex flex-col gap-2 relative z-10">
                            <button 
                                onClick={() => router.push(`/universities/apply?id=${recommendations.overall.id}`)}
                                className="w-full bg-white py-3 rounded-lg text-xs font-black uppercase tracking-widest text-teal-700 hover:bg-teal-50 transition-colors shadow-lg"
                            >
                                Apply Now
                            </button>
                            <button 
                                onClick={() => {
                                    setPaymentItem({
                                        id: recommendations.overall.id || "uni-01",
                                        name: `Admission Fee: ${recommendations.overall.name}`,
                                        price: recommendations.overall.applicationFee || 50,
                                        category: "Education",
                                        provider: recommendations.overall.name
                                    })
                                    setIsPaymentOpen(true)
                                }}
                                className="w-full bg-teal-500/50 backdrop-blur-md border border-teal-400/30 py-3 rounded-lg text-xs font-black uppercase tracking-widest text-white hover:bg-teal-500/70 transition-colors"
                            >
                                Pay Admission
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <PaymentModal 
                isOpen={isPaymentOpen}
                onClose={() => setIsPaymentOpen(false)}
                item={paymentItem}
            />
        </div>
    )
}

export default function UniversitiesComparePage() {
    return (
        <Suspense fallback={<div className="flex items-center justify-center min-h-[60vh] text-muted-foreground">Loading university comparison...</div>}>
            <UniversitiesCompareContent />
        </Suspense>
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

    // Best Overall (combination of affordability and academic score if available)
    const overall = [...unis].sort((a, b) => {
        const scoreA = (a.academicScore || 0) + (100 - ((a.feeMinUSD || 1000) / 100))
        const scoreB = (b.academicScore || 0) + (100 - ((b.feeMinUSD || 1000) / 100))
        return scoreB - scoreA
    })[0]

    // Best for Academics
    const bestAcademics = [...unis].sort((a, b) => (b.academicScore || 0) - (a.academicScore || 0))[0]
    
    // Best for Career
    const bestCareer = [...unis].sort((a, b) => (b.employabilityScore || 0) - (a.employabilityScore || 0))[0]

    return {
        affordability: {
            name: mostAffordable.university,
            reasons: [
                `Lowest minimum fees at $${mostAffordable.feeMinUSD || 0}`,
                `Fee confidence level: ${mostAffordable.feeConfidence || "Unknown"}`
            ]
        },
        academics: {
            name: bestAcademics.university,
            reasons: [
                `High academic ranking: ${bestAcademics.academicScore || 0}%`,
                `Diverse faculty selection: ${bestAcademics.faculties?.length || 0} faculties`
            ]
        },
        career: {
            name: bestCareer.university,
            reasons: [
                `Strong employability score: ${bestCareer.employabilityScore || 0}%`,
                `High graduate placement rates`
            ]
        },
        overall: {
            id: overall.id,
            name: overall.university,
            applicationFee: overall.applicationFee || 50,
            reasons: [
                `Balanced cost-to-quality ratio`,
                `Highly rated student life and facilities`
            ]
        }
    }
}

