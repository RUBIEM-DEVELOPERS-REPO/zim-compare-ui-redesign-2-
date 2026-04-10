"use client"

import { useSearchParams, useRouter, useParams } from "next/navigation"
import { schools } from "@/lib/mock/schools"
import { useAppStore } from "@/lib/store"
import { useI18n } from "@/lib/i18n"
import { ScoreBadge } from "@/components/score-badge"
import { Disclaimer } from "@/components/disclaimer"
import { Suspense, useMemo, useEffect } from "react"
import {
    ArrowLeft,
    CheckCircle2,
    ChevronLeft,
    Star,
    Info,
    School,
    TrendingUp,
    ShieldCheck,
    GraduationCap,
    Lightbulb
} from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

function SchoolsCompareContent() {
    const searchParams = useSearchParams()
    const params = useParams()
    const router = useRouter()
    const ids = searchParams.get("ids")?.split(",") ?? []
    const subcategory = (params.subcategory as string) || "overview"
    const { addSavedComparison, clearCompareTray } = useAppStore()
    const { t } = useI18n()

    useEffect(() => {
        // We don't clear the tray immediately here so users can see highlighting
        // but Banking does it on mount in [subcategory]/page.tsx, let's follow that.
        // clearCompareTray() 
    }, [])

    const compareItems = useMemo(() => {
        return schools.filter((s) => ids.includes(s.id))
    }, [ids])

    if (compareItems.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="p-4 bg-secondary/50 rounded-full mb-6">
                    <School size={48} className="text-muted-foreground" />
                </div>
                <h2 className="text-xl font-bold text-foreground mb-2">No schools selected to compare</h2>
                <p className="text-muted-foreground mb-8 max-w-xs">
                    Please select at least 2 schools to see a side-by-side comparison and school insights.
                </p>
                <Link
                    href="/schools"
                    className="bg-teal-600 text-white px-6 py-2.5 rounded-xl font-bold hover:scale-105 transition-transform flex items-center gap-2"
                >
                    <ArrowLeft size={16} />
                    Go back to Schools
                </Link>
            </div>
        )
    }

    const orderedSelected = compareItems

    const handleSave = () => {
        addSavedComparison({
            id: Math.random().toString(36).substr(2, 9),
            category: "schools",
            itemIds: ids,
            createdAt: new Date().toISOString(),
            name: `Schools: ${compareItems.map((s) => s.name).join(" vs ")}`
        })
        router.push("/dashboard")
    }

    return (
        <div className="space-y-10 animate-in fade-in duration-700">
            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4 group"
                    >
                        <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                        Back to list
                    </button>
                    <h1 className="text-3xl font-bold text-foreground uppercase tracking-tight">
                        Schools Comparison
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Side-by-side analysis of {compareItems.length} institutions
                    </p>
                </div>
                <button
                    onClick={handleSave}
                    className="bg-teal-600/10 text-teal-700 hover:bg-teal-600/20 px-5 py-2.5 rounded-xl text-sm font-bold transition-all border border-teal-600/20"
                >
                    Save this comparison
                </button>
            </div>

            {/* Comparison Table */}
            <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-xl shadow-teal-900/5">
                <table className="w-full text-left border-collapse min-w-[700px]">
                    <thead>
                        <tr className="border-b border-border bg-muted/20">
                            <th className="p-6 text-xs font-bold uppercase tracking-widest text-muted-foreground w-1/4">{t("schools.competitiveMetrics")}</th>
                            {orderedSelected.map((s) => (
                                <th key={s.id} className="p-6">
                                    <div className="flex flex-col">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-[10px] font-bold text-teal-600 uppercase tracking-widest">{t(`schools.subTabs.${s.type}`)}</span>
                                            <button
                                                onClick={() => {
                                                    const newIds = ids.filter(i => i !== s.id)
                                                    router.push(`?ids=${newIds.join(",")}`)
                                                }}
                                                className="text-muted-foreground hover:text-destructive transition-colors"
                                                title="Remove"
                                            >
                                                <Info size={14} className="rotate-45" />
                                            </button>
                                        </div>
                                        <span className="text-base font-bold text-foreground uppercase tracking-tight">{s.name}</span>
                                        <span className="text-xs text-muted-foreground mt-0.5">{s.city}</span>
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50">
                        <tr>
                            <td className="p-6 text-sm font-medium text-muted-foreground bg-muted/5">{t("schools.annualTotal")}</td>
                            {orderedSelected.map(s => (
                                <td key={s.id} className="p-6 text-center font-black text-teal-600 text-lg">
                                    ${s.totalAnnualCost.toLocaleString()}
                                </td>
                            ))}
                        </tr>
                        <tr>
                            <td className="p-6 text-sm font-medium text-muted-foreground bg-muted/5">Pass Rate</td>
                            {orderedSelected.map(s => (
                                <td key={s.id} className="p-6 text-center font-bold text-foreground text-base">
                                    {s.passRate}%
                                </td>
                            ))}
                        </tr>
                        <tr>
                            <td className="p-6 text-sm font-medium text-muted-foreground bg-muted/5">Student–Teacher Ratio</td>
                            {orderedSelected.map(s => (
                                <td key={s.id} className="p-6 text-center text-sm font-bold text-foreground">
                                    1:{s.studentTeacherRatio}
                                </td>
                            ))}
                        </tr>
                        <tr>
                            <td className="p-6 text-sm font-medium text-muted-foreground bg-muted/5">Academic Curriculum</td>
                            {orderedSelected.map(s => (
                                <td key={s.id} className="p-6 text-center">
                                    <div className="flex flex-wrap justify-center gap-1">
                                        {s.curriculum.map(c => (
                                            <span key={c} className="text-[9px] font-bold bg-secondary px-2 py-0.5 rounded-full">{c}</span>
                                        ))}
                                    </div>
                                </td>
                            ))}
                        </tr>
                        <tr>
                            <td className="p-6 text-sm font-medium text-muted-foreground bg-muted/5">Performance Scores</td>
                            {orderedSelected.map(s => (
                                <td key={s.id} className="p-6">
                                    <div className="flex flex-col gap-2 items-center scale-90">
                                        <ScoreBadge score={s.academicScore} label="Academic" />
                                        <ScoreBadge score={s.safetyScore} label="Safety" />
                                        <ScoreBadge score={s.transparencyScore} label="Transp." />
                                    </div>
                                </td>
                            ))}
                        </tr>
                        <tr>
                            <td className="p-6 text-sm font-medium text-muted-foreground bg-muted/5">Facilities</td>
                            {orderedSelected.map(s => (
                                <td key={s.id} className="p-6">
                                    <div className="flex flex-wrap justify-center gap-1">
                                        {s.facilities.slice(0, 3).map(f => (
                                            <span key={f} className="text-[10px] bg-teal-50 text-teal-700 px-2 py-0.5 rounded-full border border-teal-100">{f}</span>
                                        ))}
                                        {s.facilities.length > 3 && <span className="text-[9px] text-muted-foreground">+{s.facilities.length - 3} more</span>}
                                    </div>
                                </td>
                            ))}
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* AI Insights Panel */}
            <div className="space-y-6">
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-teal-600/10 rounded-lg text-teal-600">
                        <Lightbulb size={24} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold">School Insights</h2>
                        <p className="text-sm text-muted-foreground">Comparative advantages and recommendations</p>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Academic Leader */}
                    <div className="bg-gradient-to-br from-teal-50 to-background border border-teal-200 rounded-2xl p-6 shadow-xl shadow-teal-900/5 group hover:scale-[1.02] transition-transform">
                        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-teal-100 text-teal-700 text-[10px] font-bold uppercase tracking-wider mb-4">
                            Academic Leader
                        </div>
                        {(() => {
                            const leader = [...compareItems].sort((a,b) => b.passRate - a.passRate)[0]
                            return (
                                <>
                                    <h3 className="text-lg font-bold mb-1">{leader.name}</h3>
                                    <ul className="space-y-2 mt-4">
                                        <li className="flex items-start gap-2 text-xs text-foreground/80">
                                            <CheckCircle2 size={12} className="text-teal-600 mt-0.5" />
                                            Top pass rate at {leader.passRate}%
                                        </li>
                                        <li className="flex items-start gap-2 text-xs text-foreground/80">
                                            <CheckCircle2 size={12} className="text-teal-600 mt-0.5" />
                                            Strong academic score of {leader.academicScore}
                                        </li>
                                    </ul>
                                </>
                            )
                        })()}
                    </div>

                    {/* Value Pick */}
                    <div className="bg-white border border-border rounded-2xl p-6 shadow-lg shadow-black/5 hover:border-teal-300 transition-all">
                        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 text-[10px] font-bold uppercase tracking-wider mb-4">
                            Value Pick
                        </div>
                        {(() => {
                            const value = [...compareItems].sort((a,b) => a.totalAnnualCost - b.totalAnnualCost)[0]
                            return (
                                <>
                                    <h3 className="text-lg font-bold mb-1">{value.name}</h3>
                                    <ul className="space-y-2 mt-4">
                                        <li className="flex items-start gap-2 text-xs text-foreground/80">
                                            <CheckCircle2 size={12} className="text-blue-500 mt-0.5" />
                                            Lowest annual cost: ${value.totalAnnualCost.toLocaleString()}
                                        </li>
                                        <li className="flex items-start gap-2 text-xs text-foreground/80">
                                            <CheckCircle2 size={12} className="text-blue-500 mt-0.5" />
                                            Balanced student-teacher ratio
                                        </li>
                                    </ul>
                                </>
                            )
                        })()}
                    </div>
                </div>
            </div>

            <Disclaimer />
        </div>
    )
}

export default function SchoolsComparePage() {
    return (
        <div className="max-w-6xl mx-auto py-12 px-4 text-foreground bg-background min-h-screen">
            <Suspense fallback={<div className="flex items-center justify-center py-20 text-muted-foreground">Loading comparison...</div>}>
                <SchoolsCompareContent />
            </Suspense>
        </div>
    )
}
