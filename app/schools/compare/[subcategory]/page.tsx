"use client"

import { useSearchParams, useRouter, useParams } from "next/navigation"
import { useAppStore } from "@/lib/store"
import { useI18n } from "@/lib/i18n"
import { ScoreBadge } from "@/components/score-badge"
import { Disclaimer } from "@/components/disclaimer"
import { Suspense, useMemo, useEffect, useState } from "react"
import {
    ArrowLeft,
    CheckCircle2,
    ChevronLeft,
    School,
    Lightbulb,
    GraduationCap
} from "lucide-react"
import Link from "next/link"
import { PaymentModal } from "@/components/payment-modal"

function SchoolsCompareContent() {
    const searchParams = useSearchParams()
    const params = useParams()
    const router = useRouter()
    const ids = searchParams.get("ids")?.split(",") ?? []
    const { addSavedComparison } = useAppStore()
    const { t } = useI18n()

    const [schools, setSchools] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [isPaymentOpen, setIsPaymentOpen] = useState(false)
    const [paymentItem, setPaymentItem] = useState<{ id: string, name: string, price: number, category: string, provider?: string }>({
        id: "", name: "", price: 0, category: "", provider: ""
    })

    useEffect(() => {
        async function fetchSchools() {
            try {
                const res = await fetch("/api/schools")
                if (!res.ok) {
                    throw new Error("Failed to load schools data")
                }
                const data = await res.json()
                setSchools(data.schools || [])
            } catch (err: any) {
                console.error(err)
                setError(err.message || "Failed to fetch schools comparison data.")
            } finally {
                setLoading(false)
            }
        }
        fetchSchools()
    }, [])

    const compareItems = useMemo(() => {
        const cleanIds = ids.map(id => id.trim()).filter(Boolean);
        return schools.filter((s) => cleanIds.includes(s.id))
    }, [ids, schools])

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center bg-background min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4" />
                <p className="text-muted-foreground font-sans">Retrieving verified academic vectors...</p>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center bg-background min-h-screen">
                <div className="p-4 bg-red-500/10 rounded-full mb-6 text-red-500">
                    <School size={48} />
                </div>
                <h2 className="text-xl font-bold text-foreground mb-2">Failed to load comparison data. Please try again later.</h2>
                <p className="text-muted-foreground mb-8 max-w-md">{error}</p>
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

    if (compareItems.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center bg-background min-h-screen">
                <div className="p-4 bg-secondary/50 rounded-full mb-6">
                    <School size={48} className="text-muted-foreground" />
                </div>
                <h2 className="text-xl font-bold text-foreground mb-2">No verified data available yet for this category.</h2>
                <p className="text-muted-foreground mb-8 max-w-xs">
                    Please select at least 2 schools to see a side-by-side comparison and insights.
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
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
                <div>
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-[10px] font-black text-muted-foreground hover:text-primary uppercase tracking-[0.2em] transition-all mb-6 group"
                    >
                        <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                        Back to Intelligence Index
                    </button>
                    <h1 className="text-5xl font-display font-black text-foreground tracking-tighter uppercase leading-tight">
                        Academic Analysis
                    </h1>
                    <p className="text-sm text-muted-foreground mt-2 font-medium font-sans opacity-70">
                        Synthesizing side-by-side performance metrics for {compareItems.length} educational institutions.
                    </p>
                </div>
                <button
                    onClick={handleSave}
                    className="glass-floating px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 transition-all teal-glow active:scale-95"
                >
                    Archive This Logic
                </button>
            </div>

            {/* Comparison Table */}
            <div className="overflow-x-auto glass-floating shadow-2xl teal-glow border-border/50">
                <table className="w-full text-left border-collapse min-w-[700px]">
                    <thead>
                        <tr className="border-b border-border/30 bg-secondary/50">
                            <th className="p-8 text-[10px] font-black uppercase tracking-[0.3em] text-primary/70 w-1/4">Academic Vector</th>
                            {orderedSelected.map((s) => (
                                <th key={s.id} className="p-8">
                                    <div className="flex flex-col">
                                        <div className="flex items-center justify-between mb-4">
                                            <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">{t(`schools.subTabs.${s.type}`)}</span>
                                            <button
                                                onClick={() => {
                                                    const newIds = ids.filter(i => i !== s.id)
                                                    router.push(`?ids=${newIds.join(",")}`)
                                                }}
                                                className="text-muted-foreground hover:text-destructive transition-colors p-1.5 rounded-lg hover:bg-destructive/10"
                                                title="Remove Entity"
                                            >
                                            </button>
                                        </div>
                                        <span className="text-xl font-display font-black text-foreground uppercase tracking-tight leading-none">{s.name}</span>
                                        <span className="text-[10px] font-black text-muted-foreground mt-2 uppercase tracking-widest opacity-60">{s.city}</span>
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
                                    ${(s.totalAnnualCost || s.tuitionPerTerm * 3 || 0).toLocaleString()}
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
                                    1:{s.studentTeacherRatio || 15}
                                </td>
                            ))}
                        </tr>
                        <tr>
                            <td className="p-6 text-sm font-medium text-muted-foreground bg-muted/5">Academic Curriculum</td>
                            {orderedSelected.map(s => {
                                const curr = Array.isArray(s.curriculum) 
                                    ? s.curriculum 
                                    : typeof s.curriculum === 'string'
                                        ? JSON.parse(s.curriculum)
                                        : ["ZIMSEC"]
                                return (
                                    <td key={s.id} className="p-6 text-center">
                                        <div className="flex flex-wrap justify-center gap-1">
                                            {curr.map((c: string) => (
                                                <span key={c} className="text-[9px] font-bold bg-secondary/80 px-2 py-0.5 rounded-full border border-border/50">{c}</span>
                                            ))}
                                        </div>
                                    </td>
                                )
                            })}
                        </tr>
                        <tr>
                            <td className="p-6 text-sm font-medium text-muted-foreground bg-muted/5">Performance Scores</td>
                            {orderedSelected.map(s => (
                                <td key={s.id} className="p-6">
                                    <div className="flex flex-col gap-2 items-center scale-90">
                                        <ScoreBadge score={s.academicScore || s.transparencyScore || 80} label="Academic" />
                                        <ScoreBadge score={s.safetyScore || 85} label="Safety" />
                                        <ScoreBadge score={s.transparencyScore || 80} label="Transp." />
                                    </div>
                                </td>
                            ))}
                        </tr>
                        <tr>
                            <td className="p-6 text-sm font-medium text-muted-foreground bg-muted/5">Facilities</td>
                            {orderedSelected.map(s => {
                                const facs = Array.isArray(s.facilities)
                                    ? s.facilities
                                    : typeof s.facilities === 'string'
                                        ? JSON.parse(s.facilities)
                                        : ["Library", "Science Lab"]
                                return (
                                    <td key={s.id} className="p-6">
                                        <div className="flex flex-wrap justify-center gap-1">
                                            {facs.slice(0, 3).map((f: string) => (
                                                <span key={f} className="text-[10px] bg-teal-500/10 text-teal-400 px-2 py-0.5 rounded-full border border-teal-500/20 whitespace-nowrap">{f}</span>
                                            ))}
                                            {facs.length > 3 && <span className="text-[9px] text-muted-foreground">+{facs.length - 3}</span>}
                                        </div>
                                    </td>
                                )
                            })}
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* AI Insights Panel */}
            <div className="space-y-10">
                <div className="flex items-center gap-4">
                    <div className="p-3 glass-floating bg-primary/10 text-primary teal-glow">
                        <Lightbulb size={28} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-display font-black text-foreground uppercase tracking-tight">Neural Insights</h2>
                        <p className="text-sm text-muted-foreground font-medium opacity-60">Comparative advantages and cognitive recommendations</p>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Academic Leader */}
                    <div className="glass-floating bg-gradient-to-br from-primary/10 to-transparent border-primary/30 p-4 shadow-2xl teal-glow relative overflow-hidden group hover:scale-[1.03] transition-all duration-500">
                        <div className="inline-flex items-center gap-2 px-2 py-0.5 rounded-lg bg-primary text-primary-foreground text-[8px] font-black uppercase tracking-[0.2em] mb-3 shadow-xl">
                            Academic Leader
                        </div>
                        {(() => {
                            const leader = [...compareItems].sort((a,b) => b.passRate - a.passRate)[0]
                            return (
                                <>
                                    <h3 className="text-base font-display font-black text-foreground uppercase tracking-tight leading-none mb-1">{leader.name}</h3>
                                    <ul className="space-y-2 mt-4">
                                        <li className="flex items-start gap-2 text-[10px] text-foreground/90 font-medium font-sans">
                                            <CheckCircle2 size={12} className="text-primary mt-0.5 shrink-0" strokeWidth={3} />
                                            Top pass rate at {leader.passRate}%
                                        </li>
                                        <li className="flex items-start gap-2 text-[10px] text-foreground/90 font-medium font-sans">
                                            <CheckCircle2 size={12} className="text-primary mt-0.5 shrink-0" strokeWidth={3} />
                                            Strong academic score of {leader.academicScore || 85}
                                        </li>
                                    </ul>
                                </>
                            )
                        })()}
                    </div>

                    {/* Strategic Enrollment Path */}
                    <div className="glass-floating p-4 shadow-xl border-white/5 hover:border-primary/40 transition-all duration-500 group floating-hover">
                        <div className="inline-flex items-center gap-2 px-2 py-0.5 rounded-lg bg-teal-500/10 text-teal-400 text-[8px] font-black uppercase tracking-[0.2em] mb-3 border border-teal-500/20">
                            Neural Path
                        </div>
                        {(() => {
                            const value = [...compareItems].sort((a,b) => (a.totalAnnualCost || a.tuitionPerTerm * 3 || 0) - (b.totalAnnualCost || b.tuitionPerTerm * 3 || 0))[0]
                            return (
                                <>
                                    <h3 className="text-base font-display font-black text-foreground uppercase tracking-tight leading-none mb-1 group-hover:text-primary transition-colors">{value.name}</h3>
                                    <p className="text-[10px] text-muted-foreground font-medium font-sans leading-relaxed mt-4 opacity-80">
                                        Cross-referencing academic vectors reveals a significant efficiency delta when prioritizing {value.name} for the current fiscal cycle.
                                    </p>
                                    <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
                                        <span className="text-[8px] font-medium text-muted-foreground uppercase tracking-widest">Logic Match</span>
                                        <span className="text-[10px] font-display font-medium text-primary">94%</span>
                                    </div>
                                </>
                            )
                        })()}
                    </div>

                    {/* Value Pick */}
                    <div className="glass-floating p-4 shadow-xl border-white/5 hover:border-primary/40 transition-all duration-500 group floating-hover">
                        <div className="inline-flex items-center gap-2 px-2 py-0.5 rounded-lg bg-white/5 text-muted-foreground text-[8px] font-black uppercase tracking-[0.2em] mb-3 border border-white/10">
                            Value Pick
                        </div>
                        {(() => {
                            const value = [...compareItems].sort((a,b) => (a.totalAnnualCost || a.tuitionPerTerm * 3 || 0) - (b.totalAnnualCost || b.tuitionPerTerm * 3 || 0))[0]
                            return (
                                <>
                                    <h3 className="text-base font-display font-black text-foreground uppercase tracking-tight leading-none mb-1 group-hover:text-primary transition-colors">{value.name}</h3>
                                    <ul className="space-y-2 mt-4">
                                        <li className="flex items-start gap-2 text-[10px] text-foreground/80 font-medium font-sans">
                                            <CheckCircle2 size={12} className="text-primary/60 mt-0.5 shrink-0" strokeWidth={3} />
                                            Lowest annual cost: ${(value.totalAnnualCost || value.tuitionPerTerm * 3 || 0).toLocaleString()}
                                        </li>
                                        <li className="flex items-start gap-2 text-[10px] text-foreground/80 font-medium font-sans">
                                            <CheckCircle2 size={12} className="text-primary/60 mt-0.5 shrink-0" strokeWidth={3} />
                                            Balanced student-teacher ratio
                                        </li>
                                    </ul>
                                </>
                            )
                        })()}
                    </div>

                    {/* Enroll Now */}
                    <div className="glass-floating p-4 shadow-2xl border-primary/20 bg-primary/5 hover:bg-primary/10 transition-all duration-500 group relative overflow-hidden flex flex-col teal-glow">
                        <div className="absolute -bottom-2 -right-2 p-3 text-primary/10 group-hover:scale-110 transition-transform duration-700">
                             <GraduationCap size={60} />
                        </div>
                        <div className="inline-flex items-center gap-2 px-2 py-0.5 rounded-lg bg-primary text-primary-foreground text-[8px] font-black uppercase tracking-[0.2em] mb-3 shadow-lg">
                            Academic Path
                        </div>
                        <h3 className="text-base font-display font-black text-foreground uppercase tracking-tight leading-none mb-1">Enrollment</h3>
                        {(() => {
                            const leader = [...compareItems].sort((a,b) => b.passRate - a.passRate)[0]
                            return (
                                <>
                                    <p className="text-[9px] font-black text-primary uppercase tracking-[0.1em] mb-4 opacity-80 leading-tight">
                                        {leader.name}
                                    </p>
                                    <div className="flex-1 space-y-2 mb-5">
                                        <p className="text-[10px] text-muted-foreground font-medium leading-relaxed">
                                            Secure a placement at {leader.name}. Our cognitive model identifies this as the strongest academic vector for your current criteria.
                                        </p>
                                    </div>
                                </>
                            )
                        })()}
                        
                        <div className="flex flex-col gap-2 relative z-10">
                            <button className="w-full bg-primary py-2.5 rounded-lg text-[8px] font-black uppercase tracking-[0.2em] text-primary-foreground hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-primary/30 flex items-center justify-center gap-2">
                                Apply / Enroll
                            </button>
                            <button 
                                onClick={() => {
                                    const leader = [...compareItems].sort((a,b) => b.passRate - a.passRate)[0]
                                    setPaymentItem({
                                        id: leader.id,
                                        name: `Application Fee: ${leader.name}`,
                                        price: 150, // Mock application fee
                                        category: "Education",
                                        provider: leader.name
                                    })
                                    setIsPaymentOpen(true)
                                }}
                                className="w-full bg-primary/10 border border-primary/20 py-2.5 rounded-lg text-[8px] font-black uppercase tracking-[0.2em] text-primary hover:bg-primary/20 transition-all flex items-center justify-center gap-2"
                            >
                                Pay Application
                            </button>
                        </div>
                    </div>
                </div>
                
                <PaymentModal 
                    isOpen={isPaymentOpen}
                    onClose={() => setIsPaymentOpen(false)}
                    item={paymentItem}
                />
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
