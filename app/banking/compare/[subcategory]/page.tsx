"use client"

import { useSearchParams, useRouter, useParams } from "next/navigation"
import { banks, bankingProducts, bankLoans, bankFees } from "@/lib/mock/banks"
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
    Wallet,
    TrendingUp,
    BadgePercent,
    Lightbulb,
    Target,
    Zap,
    Clock,
    ShieldCheck,
    CreditCard,
    DollarSign
} from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

function BankingCompareContent() {
    const searchParams = useSearchParams()
    const params = useParams()
    const router = useRouter()
    const ids = searchParams.get("ids")?.split(",") ?? []
    const subcategory = (params.subcategory as string) || "accounts"
    const { addSavedComparison, clearCompareTray } = useAppStore()
    const { t } = useI18n()

    useEffect(() => {
        clearCompareTray()
    }, [clearCompareTray])

    const compareItems = useMemo(() => {
        if (subcategory === "accounts") {
            return bankingProducts.filter((p) => ids.includes(p.id))
        } else if (subcategory === "loans") {
            return bankLoans.filter((l) => ids.includes(l.id))
        } else if (subcategory === "fees") {
            return bankFees.filter((f) => ids.includes(f.id))
        } else {
            return banks.filter((b) => ids.includes(b.id))
        }
    }, [ids, subcategory])

    if (compareItems.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="p-4 bg-secondary/50 rounded-full mb-6">
                    <Wallet size={48} className="text-muted-foreground" />
                </div>
                <h2 className="text-xl font-bold text-foreground mb-2">No items selected to compare</h2>
                <p className="text-muted-foreground mb-8 max-w-xs">
                    Please select at least 2 items to see a side-by-side comparison and AI insights.
                </p>
                <Link
                    href="/banking"
                    className="bg-primary text-primary-foreground px-6 py-2.5 rounded-xl font-bold hover:scale-105 transition-transform flex items-center gap-2"
                >
                    <ArrowLeft size={16} />
                    Go back to Banking
                </Link>
            </div>
        )
    }

    const isAccounts = subcategory === "accounts"
    const isLoans = subcategory === "loans"
    const isFees = subcategory === "fees"

    // Recommendation Logic
    const recommendations = useMemo(() => {
        if (isAccounts) {
            const products = compareItems as any[]
            const overall = [...products].sort((a, b) => {
                let scoreA = a.interestRate * 2 - a.monthlyFee - (a.minBalance / 10)
                let scoreB = b.interestRate * 2 - b.monthlyFee - (b.minBalance / 10)
                return scoreB - scoreA
            })[0]
            const lowFee = [...products].sort((a, b) => a.monthlyFee - b.monthlyFee)[0]
            const highInterest = [...products].sort((a, b) => b.interestRate - a.interestRate)[0]

            return {
                primary: { label: "Best Overall", item: overall, reasoning: ["Balanced interest and fees", "Superior medium-term value", "Competitive perks"] },
                secondary: { label: "Low Fees", item: lowFee, reasoning: [`Only $${lowFee.monthlyFee}/mo`, "Ideal for small transactions", "Reduces hidden costs"] },
                tertiary: { label: "High Interest", item: highInterest, reasoning: [`Top-tier ${highInterest.interestRate}% APY`, "Maximizes passive growth", "Best for long-term saving"] }
            }
        } else if (isLoans) {
            const loans = compareItems as any[]
            const bestAPR = [...loans].sort((a, b) => a.apr - b.apr)[0]
            const bestFee = [...loans].sort((a, b) => a.initiationFee - b.initiationFee)[0]

            return {
                primary: { label: "Lowest APR", item: bestAPR, reasoning: [`Industry leading ${bestAPR.apr}% APR`, "Lowest total cost of credit", "Transparent pricing"] },
                secondary: { label: "Lowest Entry Cost", item: bestFee, reasoning: [`Initiation fee: $${bestFee.initiationFee}`, "Easiest to access upfront", "Fewer initial hurdles"] },
                tertiary: { label: "Flexible Term", item: loans[0], reasoning: ["Extended repayment options", "Manageable monthly installments", "Early settlement allowed"] }
            }
        } else {
            const generic = compareItems as any[]
            return {
                primary: { label: "Top Choice", item: generic[0], reasoning: ["Strong market reputation", "Extensive branch network", "Reliable digital tools"] },
                secondary: { label: "Digital Leader", item: generic[1] || generic[0], reasoning: ["Best-in-class mobile app", "Fast digital onboarding", "24/7 support"] },
                tertiary: { label: "Value Pick", item: generic[generic.length - 1], reasoning: ["Competitive fee structure", "Transparent policies", "Community focused"] }
            }
        }
    }, [compareItems, isAccounts, isLoans])

    const handleSave = () => {
        addSavedComparison({
            id: Math.random().toString(36).substr(2, 9),
            category: "banking",
            itemIds: ids,
            createdAt: new Date().toISOString(),
            name: `${subcategory.charAt(0).toUpperCase() + subcategory.slice(1)} Comparison: ${compareItems.map((item: any) => item.name || item.bankName).join(" vs ")}`
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
                    <h1 className="text-3xl font-bold text-foreground capitalize">
                        {subcategory} Comparison
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Comparing {compareItems.length} items side-by-side
                    </p>
                </div>
                <button
                    onClick={handleSave}
                    className="bg-primary/10 text-primary hover:bg-primary/20 px-5 py-2.5 rounded-xl text-sm font-bold transition-all border border-primary/20"
                >
                    Save this comparison
                </button>
            </div>

            {/* Comparison Table */}
            <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-xl shadow-primary/5">
                <table className="w-full text-left border-collapse min-w-[600px]">
                    <thead>
                        <tr className="border-b border-border bg-muted/20">
                            <th className="p-6 text-xs font-bold uppercase tracking-widest text-muted-foreground w-1/4">Metric</th>
                            {compareItems.map((item: any) => (
                                <th key={item.id} className="p-6">
                                    <div className="flex flex-col">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-[10px] font-bold text-primary uppercase tracking-tighter">{item.bankName || item.name}</span>
                                            <button
                                                onClick={() => {
                                                    const newIds = ids.filter(i => i !== item.id)
                                                    router.push(`?ids=${newIds.join(",")}`)
                                                }}
                                                className="text-muted-foreground hover:text-destructive transition-colors"
                                                title="Remove"
                                            >
                                                <Info size={14} className="rotate-45" />
                                            </button>
                                        </div>
                                        <span className="text-base font-bold text-foreground">{item.name}</span>
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50">
                        {isAccounts ? (
                            <>
                                <tr>
                                    <td className="p-6 text-sm font-medium text-muted-foreground bg-muted/5">Interest Rate</td>
                                    {compareItems.map((p: any) => (
                                        <td key={p.id} className="p-6 text-center text-sm font-bold text-foreground">{p.interestRate}%</td>
                                    ))}
                                </tr>
                                <tr>
                                    <td className="p-6 text-sm font-medium text-muted-foreground bg-muted/5">Monthly Fee</td>
                                    {compareItems.map((p: any) => (
                                        <td key={p.id} className="p-6 text-center text-sm font-bold text-primary">${p.monthlyFee}</td>
                                    ))}
                                </tr>
                                <tr>
                                    <td className="p-6 text-sm font-medium text-muted-foreground bg-muted/5">Min Balance</td>
                                    {compareItems.map((p: any) => (
                                        <td key={p.id} className="p-6 text-center text-sm text-foreground">${p.minBalance}</td>
                                    ))}
                                </tr>
                            </>
                        ) : isLoans ? (
                            <>
                                <tr>
                                    <td className="p-6 text-sm font-medium text-muted-foreground bg-muted/5">APR</td>
                                    {compareItems.map((l: any) => (
                                        <td key={l.id} className="p-6 text-center text-sm font-bold text-foreground">{l.apr}%</td>
                                    ))}
                                </tr>
                                <tr>
                                    <td className="p-6 text-sm font-medium text-muted-foreground bg-muted/5">Initiation Fee</td>
                                    {compareItems.map((l: any) => (
                                        <td key={l.id} className="p-6 text-center text-sm font-bold text-primary">${l.initiationFee}</td>
                                    ))}
                                </tr>
                                <tr>
                                    <td className="p-6 text-sm font-medium text-muted-foreground bg-muted/5">Max Term</td>
                                    {compareItems.map((l: any) => (
                                        <td key={l.id} className="p-6 text-center text-sm text-foreground">{l.maxTermMonths} months</td>
                                    ))}
                                </tr>
                            </>
                        ) : isFees ? (
                            <>
                                <tr>
                                    <td className="p-6 text-sm font-medium text-muted-foreground bg-muted/5">Amount</td>
                                    {compareItems.map((f: any) => (
                                        <td key={f.id} className="p-6 text-center text-sm font-bold text-foreground">${f.amount.toFixed(2)}</td>
                                    ))}
                                </tr>
                                <tr>
                                    <td className="p-6 text-sm font-medium text-muted-foreground bg-muted/5">Unit</td>
                                    {compareItems.map((f: any) => (
                                        <td key={f.id} className="p-6 text-center text-xs font-bold uppercase text-primary">{f.unit}</td>
                                    ))}
                                </tr>
                            </>
                        ) : (
                            <>
                                <tr>
                                    <td className="p-6 text-sm font-medium text-muted-foreground bg-muted/5">Branches</td>
                                    {compareItems.map((b: any) => (
                                        <td key={b.id} className="p-6 text-center text-sm font-bold text-foreground">{b.branches || 'N/A'}</td>
                                    ))}
                                </tr>
                                <tr>
                                    <td className="p-6 text-sm font-medium text-muted-foreground bg-muted/5">Transparency</td>
                                    {compareItems.map((b: any) => (
                                        <td key={b.id} className="p-6 text-center"><ScoreBadge score={b.transparencyScore} label="" /></td>
                                    ))}
                                </tr>
                                <tr>
                                    <td className="p-6 text-sm font-medium text-muted-foreground bg-muted/5">Digital Score</td>
                                    {compareItems.map((b: any) => (
                                        <td key={b.id} className="p-6 text-center"><ScoreBadge score={b.digitalScore} label="" /></td>
                                    ))}
                                </tr>
                            </>
                        )}
                    </tbody>
                </table>
            </div>

            {/* AI Recommendations Panel */}
            <div className="space-y-6">
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                        <TrendingUp size={24} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold">AI Recommendations</h2>
                        <p className="text-sm text-muted-foreground">Smart choice based on usage patterns</p>
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    {/* Primary */}
                    <div className="bg-gradient-to-br from-primary/10 to-background border border-primary/20 rounded-2xl p-6 shadow-xl shadow-primary/5 relative overflow-hidden group hover:scale-[1.02] transition-transform">
                        <div className="absolute top-0 right-0 p-4 text-primary/10 rotate-12 group-hover:rotate-0 transition-transform">
                            <Star size={64} />
                        </div>
                        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-primary/20 text-primary text-[10px] font-bold uppercase tracking-wider mb-4">
                            {recommendations.primary.label}
                        </div>
                        <h3 className="text-lg font-bold mb-1">{recommendations.primary.item.bankName || recommendations.primary.item.name}</h3>
                        <p className="text-xs text-muted-foreground mb-4">{recommendations.primary.item.name}</p>
                        <ul className="space-y-2 mb-6">
                            {recommendations.primary.reasoning.map((r, i) => (
                                <li key={i} className="flex items-start gap-2 text-xs text-foreground/80">
                                    <CheckCircle2 size={12} className="text-primary mt-0.5" />
                                    {r}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Secondary */}
                    <div className="bg-background border border-border rounded-2xl p-6 shadow-lg shadow-black/5 hover:border-primary/30 transition-all group">
                        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 text-[10px] font-bold uppercase tracking-wider mb-4">
                            {recommendations.secondary.label}
                        </div>
                        <h3 className="text-lg font-bold mb-1">{recommendations.secondary.item.bankName || recommendations.secondary.item.name}</h3>
                        <p className="text-xs text-muted-foreground mb-4">{recommendations.secondary.item.name}</p>
                        <ul className="space-y-2 mb-6">
                            {recommendations.secondary.reasoning.map((r, i) => (
                                <li key={i} className="flex items-start gap-2 text-xs text-foreground/80">
                                    <CheckCircle2 size={12} className="text-blue-500 mt-0.5" />
                                    {r}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Tertiary */}
                    <div className="bg-background border border-border rounded-2xl p-6 shadow-lg shadow-black/5 hover:border-orange-500/30 transition-all group">
                        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-600 text-[10px] font-bold uppercase tracking-wider mb-4">
                            {recommendations.tertiary.label}
                        </div>
                        <h3 className="text-lg font-bold mb-1">{recommendations.tertiary.item.bankName || recommendations.tertiary.item.name}</h3>
                        <p className="text-xs text-muted-foreground mb-4">{recommendations.tertiary.item.name}</p>
                        <ul className="space-y-2 mb-6">
                            {recommendations.tertiary.reasoning.map((r, i) => (
                                <li key={i} className="flex items-start gap-2 text-xs text-foreground/80">
                                    <CheckCircle2 size={12} className="text-orange-500 mt-0.5" />
                                    {r}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            <Disclaimer />
        </div>
    )
}

export default function BankingComparePage() {
    return (
        <div className="max-w-6xl mx-auto py-12 px-4 text-foreground bg-background min-h-screen">
            <Suspense fallback={<div className="flex items-center justify-center py-20 text-muted-foreground">Loading comparison...</div>}>
                <BankingCompareContent />
            </Suspense>
        </div>
    )
}
