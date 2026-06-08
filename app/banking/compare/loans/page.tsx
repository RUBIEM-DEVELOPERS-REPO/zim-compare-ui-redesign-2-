"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { apiGet } from "@/lib/api"
import { useAppStore } from "@/lib/store"
import { useI18n } from "@/lib/i18n"
import { ScoreBadge } from "@/components/score-badge"
import { Disclaimer } from "@/components/disclaimer"
import { Suspense, useEffect, useState } from "react"
import { ArrowLeft, CheckCircle2, TrendingDown, Clock, ShieldCheck, ChevronLeft } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

function LoansCompareContent() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const ids = searchParams.get("ids")?.split(",") ?? []
    const { t } = useI18n()
    const { addSavedComparison, clearCompareTray } = useAppStore()

    const [bankLoans, setBankLoans] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        clearCompareTray()
        apiGet('/banking/loans')
            .then(res => {
                setBankLoans(res.loans || [])
                setLoading(false)
            })
            .catch(() => {
                setBankLoans([])
                setLoading(false)
            })
    }, [clearCompareTray])

    const compareLoans = bankLoans.filter((l) => ids.includes(l.id))

    if (loading) {
        return <div className="flex items-center justify-center py-20 text-muted-foreground">Loading loans...</div>
    }

    if (compareLoans.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="p-4 bg-secondary/50 rounded-full mb-6">
                    <Clock size={48} className="text-muted-foreground" />
                </div>
                <h2 className="text-xl font-bold text-foreground mb-2">No loans selected for comparison</h2>
                <p className="text-muted-foreground mb-8 max-w-xs">
                    Please select at least 2 loans to see a side-by-side comparison and AI insights.
                </p>
                <Link
                    href="/banking"
                    className="bg-primary text-primary-foreground px-6 py-2.5 rounded-xl font-bold hover:scale-105 transition-transform flex items-center gap-2"
                >
                    <ArrowLeft size={16} />
                    Go back to Loans
                </Link>
            </div>
        )
    }

    // Recommendation Logic
    const getWinner = () => {
        return compareLoans.reduce((prev, curr) => {
            let scorePrev = 0
            let scoreCurr = 0

            // Lower APR is better
            if (curr.apr < prev.apr) scoreCurr += 3
            else if (curr.apr > prev.apr) scorePrev += 3

            // Lower Initiation Fee is better
            if (curr.initiationFee < prev.initiationFee) scoreCurr += 2
            else if (curr.initiationFee > prev.initiationFee) scorePrev += 2

            // Lower Early Settlement Penalty is better
            if (curr.earlySettlementPenalty < prev.earlySettlementPenalty) scoreCurr += 1
            else if (curr.earlySettlementPenalty > prev.earlySettlementPenalty) scorePrev += 1

            return scoreCurr > scorePrev ? curr : prev
        })
    }

    const winner = getWinner()
    const reasons = [
        winner.apr === Math.min(...compareLoans.map(l => l.apr)) && "Lowest interest rate (APR) in this selection",
        winner.initiationFee === Math.min(...compareLoans.map(l => l.initiationFee)) && "Most affordable initiation fees",
        winner.earlySettlementPenalty === Math.min(...compareLoans.map(l => l.earlySettlementPenalty)) && "Lowest penalty for early repayment",
        winner.maxTermMonths >= Math.max(...compareLoans.map(l => l.maxTermMonths)) && "Flexible long-term repayment options",
    ].filter(Boolean) as string[]

    const handleSave = () => {
        addSavedComparison({
            id: Math.random().toString(36).substr(2, 9),
            category: "banking",
            itemIds: ids,
            createdAt: new Date().toISOString(),
            name: `Loan Comparison: ${compareLoans.map(l => l.bankName).join(" vs ")}`
        })
        router.push("/dashboard")
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div className="flex items-center justify-between">
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group"
                >
                    <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                    Back to list
                </button>
                <button
                    onClick={handleSave}
                    className="text-xs font-bold uppercase tracking-wider text-primary hover:text-primary/80 transition-colors"
                >
                    Save this comparison
                </button>
            </div>

            <div className="bg-gradient-to-br from-primary/10 via-background to-background rounded-3xl border border-primary/20 p-8 shadow-2xl shadow-primary/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                    <TrendingDown size={120} />
                </div>

                <div className="relative z-10 max-w-2xl">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 border border-primary/30 text-primary text-[10px] font-bold uppercase tracking-widest mb-4">
                        <CheckCircle2 size={12} />
                        AI Recommendation
                    </div>
                    <h2 className="text-3xl font-serif italic mb-4">
                        The best choice for you is <span className="text-primary not-italic font-sans font-bold">{winner.bankName}</span>
                    </h2>
                    <p className="text-muted-foreground mb-6 leading-relaxed">
                        Based on your selection of {compareLoans.length} banks, we recommend the <strong>{winner.name}</strong> due to its superior cost-to-benefit ratio.
                    </p>

                    <div className="grid gap-3 mb-8">
                        {reasons.map((reason, i) => (
                            <div key={i} className="flex items-start gap-3 text-sm text-foreground/80">
                                <div className="bg-primary/20 text-primary p-1 rounded-md shrink-0 mt-0.5">
                                    <ShieldCheck size={14} />
                                </div>
                                {reason}
                            </div>
                        ))}
                    </div>

                    <button
                        className="bg-primary text-primary-foreground px-8 py-3 rounded-xl font-bold hover:scale-105 transition-transform shadow-xl shadow-primary/20"
                    >
                        Apply Now with {winner.bankName}
                    </button>
                </div>
            </div>

            <div className="overflow-x-auto rounded-3xl border border-border bg-card shadow-sm">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-border bg-muted/30">
                            <th className="p-6 text-xs font-bold uppercase tracking-widest text-muted-foreground w-1/4">Feature</th>
                            {compareLoans.map((l) => (
                                <th key={l.id} className="p-6 text-center">
                                    <div className="flex flex-col items-center gap-1">
                                        <span className="text-[10px] font-bold text-primary uppercase tracking-tighter">{l.bankName}</span>
                                        <span className="text-sm font-bold text-foreground">{l.name}</span>
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50">
                        <tr>
                            <td className="p-6 text-sm font-medium text-muted-foreground bg-muted/5">Interest Rate (APR)</td>
                            {compareLoans.map((l) => (
                                <td key={l.id} className="p-6 text-center">
                                    <span className={cn(
                                        "inline-block px-3 py-1 rounded-full text-sm font-bold",
                                        l.id === winner.id ? "bg-primary/20 text-primary border border-primary/30" : "bg-secondary text-foreground"
                                    )}>
                                        {l.apr}%
                                    </span>
                                </td>
                            ))}
                        </tr>
                        <tr>
                            <td className="p-6 text-sm font-medium text-muted-foreground bg-muted/5">Initiation Fee</td>
                            {compareLoans.map((l) => (
                                <td key={l.id} className="p-6 text-center text-sm font-semibold">${l.initiationFee}</td>
                            ))}
                        </tr>
                        <tr>
                            <td className="p-6 text-sm font-medium text-muted-foreground bg-muted/5">Early Settlement</td>
                            {compareLoans.map((l) => (
                                <td key={l.id} className="p-6 text-center text-sm">{l.earlySettlementPenalty}% penalty</td>
                            ))}
                        </tr>
                        <tr>
                            <td className="p-6 text-sm font-medium text-muted-foreground bg-muted/5">Max Loan Term</td>
                            {compareLoans.map((l) => (
                                <td key={l.id} className="p-6 text-center text-sm font-medium">
                                    <div className="flex items-center justify-center gap-1.5">
                                        <Clock size={14} className="text-muted-foreground" />
                                        {l.maxTermMonths} months
                                    </div>
                                </td>
                            ))}
                        </tr>
                        <tr className="bg-primary/5">
                            <td className="p-6 text-sm font-bold text-primary italic">Total Cost ($1000)</td>
                            {compareLoans.map((l) => {
                                const cost12 = (1000 * (l.apr / 100)) + l.initiationFee
                                return (
                                    <td key={l.id} className="p-6 text-center">
                                        <div className="flex flex-col">
                                            <span className="text-lg font-bold text-foreground">${cost12.toFixed(0)}</span>
                                            <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-tight">12 months duration</span>
                                        </div>
                                    </td>
                                )
                            })}
                        </tr>
                        <tr>
                            <td className="p-6 text-sm font-medium text-muted-foreground bg-muted/5">Requirements</td>
                            {compareLoans.map((l) => (
                                <td key={l.id} className="p-6">
                                    <div className="flex flex-wrap justify-center gap-1">
                                        {l.requirements?.map?.((r: string) => (
                                            <span key={r} className="text-[10px] bg-secondary text-muted-foreground px-2 py-0.5 rounded-full whitespace-nowrap">
                                                {r}
                                            </span>
                                        ))}
                                    </div>
                                </td>
                            ))}
                        </tr>
                    </tbody>
                </table>
            </div>

            <Disclaimer />
        </div>
    )
}

export default function LoansComparePage() {
    return (
        <div className="max-w-6xl mx-auto py-8 px-4">
            <Suspense fallback={<div className="flex items-center justify-center py-20">Loading comparison...</div>}>
                <LoansCompareContent />
            </Suspense>
        </div>
    )
}
