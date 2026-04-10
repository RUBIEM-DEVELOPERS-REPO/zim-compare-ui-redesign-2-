"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { apiGet } from "@/lib/api"
import { useAppStore } from "@/lib/store"
import { Disclaimer } from "@/components/disclaimer"
import { Suspense, useState, useMemo, useEffect } from "react"
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
    Target
} from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

function AccountsCompareContent() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const ids = searchParams.get("ids")?.split(",") ?? []
    const { addSavedComparison, clearCompareTray } = useAppStore()

    const [bankingProducts, setBankingProducts] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        clearCompareTray()
        apiGet('/banking/products')
            .then(res => {
                setBankingProducts(res.products || [])
                setLoading(false)
            })
            .catch(() => {
                setBankingProducts([])
                setLoading(false)
            })
    }, [clearCompareTray])

    const compareProducts = useMemo(() =>
        bankingProducts.filter((p) => ids.includes(p.id)),
        [ids, bankingProducts])

    if (loading) {
        return <div className="flex items-center justify-center py-20 text-muted-foreground">Loading products...</div>
    }

    const subcategory = compareProducts[0]?.category || "savings"
    const capitalizedSub = subcategory.charAt(0).toUpperCase() + subcategory.slice(1)

    if (compareProducts.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="p-4 bg-secondary/50 rounded-full mb-6">
                    <Wallet size={48} className="text-muted-foreground" />
                </div>
                <h2 className="text-xl font-bold text-foreground mb-2">No {subcategory} accounts selected</h2>
                <p className="text-muted-foreground mb-8 max-w-xs">
                    Please select at least 2 accounts to see a side-by-side comparison and AI insights.
                </p>
                <Link
                    href="/banking"
                    className="bg-primary text-primary-foreground px-6 py-2.5 rounded-xl font-bold hover:scale-105 transition-transform flex items-center gap-2"
                >
                    <ArrowLeft size={16} />
                    Go back to {capitalizedSub}
                </Link>
            </div>
        )
    }

    // Best Value Calculations
    const bestInterest = Math.max(...compareProducts.map(p => p.interestRate))
    const bestFee = Math.min(...compareProducts.map(p => p.monthlyFee))
    const bestMinBal = Math.min(...compareProducts.map(p => p.minBalance))

    // AI Recommendations Logic
    const recommendations = useMemo(() => {
        const overall = [...compareProducts].sort((a, b) => {
            let scoreA = a.interestRate * 2 - a.monthlyFee - (a.minBalance / 10)
            let scoreB = b.interestRate * 2 - b.monthlyFee - (b.minBalance / 10)
            return scoreB - scoreA
        })[0]

        const lowFee = [...compareProducts].sort((a, b) => a.monthlyFee - b.monthlyFee)[0]
        const highInterest = [...compareProducts].sort((a, b) => b.interestRate - a.interestRate)[0]

        return {
            overall: {
                item: overall,
                reasoning: [
                    "Balanced combination of interest and fees",
                    "Superior overall value for medium-term saving",
                    "Highly competitive perks relative to entry cost"
                ]
            },
            lowFee: {
                item: lowFee,
                reasoning: [
                    `Industry-leading $${lowFee.monthlyFee} monthly maintenance fee`,
                    "Ideal for users with frequent, small transactions",
                    "Reduces hidden costs significantly over time"
                ]
            },
            highInterest: {
                item: highInterest,
                reasoning: [
                    `Top-tier ${highInterest.interestRate}% interest rate (APY)`,
                    "Maximizes passive growth of your capital",
                    "Best for long-term wealth accumulation"
                ]
            }
        }
    }, [compareProducts])

    const handleSave = () => {
        addSavedComparison({
            id: Math.random().toString(36).substr(2, 9),
            category: "banking",
            itemIds: ids,
            createdAt: new Date().toISOString(),
            name: `${capitalizedSub} Comparison: ${compareProducts.map(p => p.bankName).join(" vs ")}`
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
                    <h1 className="text-3xl font-bold text-foreground">
                        {capitalizedSub} Accounts Comparison
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Comparing {compareProducts.length} {subcategory} products side-by-side
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
                            {compareProducts.map((p) => (
                                <th key={p.id} className="p-6">
                                    <div className="flex flex-col">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-[10px] font-bold text-primary uppercase tracking-tighter">{p.bankName}</span>
                                            <button
                                                onClick={() => {
                                                    const newIds = ids.filter(i => i !== p.id)
                                                    router.push(`?ids=${newIds.join(",")}`)
                                                }}
                                                className="text-muted-foreground hover:text-destructive transition-colors"
                                                title="Remove"
                                            >
                                                <Info size={14} className="rotate-45" />
                                            </button>
                                        </div>
                                        <span className="text-base font-bold text-foreground">{p.name}</span>
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50">
                        {/* Interest Rate */}
                        <tr>
                            <td className="p-6 text-sm font-medium text-muted-foreground bg-muted/5">
                                <div className="flex items-center gap-2">
                                    <BadgePercent size={16} className="text-primary" />
                                    Interest Rate (APY)
                                </div>
                            </td>
                            {compareProducts.map((p) => (
                                <td key={p.id} className={cn(
                                    "p-6 text-center transition-colors",
                                    p.interestRate === bestInterest && "bg-teal-500/5"
                                )}>
                                    <span className={cn(
                                        "inline-block px-3 py-1 rounded-full text-sm font-bold",
                                        p.interestRate === bestInterest ? "bg-teal-500/20 text-teal-700 border border-teal-500/30" : "bg-secondary text-foreground"
                                    )}>
                                        {p.interestRate}%
                                    </span>
                                </td>
                            ))}
                        </tr>

                        {/* Monthly Fee */}
                        <tr>
                            <td className="p-6 text-sm font-medium text-muted-foreground bg-muted/5">
                                <div className="flex items-center gap-2">
                                    <Wallet size={16} className="text-primary" />
                                    Monthly Fee
                                </div>
                            </td>
                            {compareProducts.map((p) => (
                                <td key={p.id} className={cn(
                                    "p-6 text-center transition-colors",
                                    p.monthlyFee === bestFee && "bg-teal-500/5"
                                )}>
                                    <span className={cn(
                                        "text-sm font-semibold",
                                        p.monthlyFee === bestFee ? "text-teal-700 underline decoration-teal-500/30 underline-offset-4" : "text-foreground"
                                    )}>
                                        ${p.monthlyFee}
                                    </span>
                                </td>
                            ))}
                        </tr>

                        {/* Minimum Balance */}
                        <tr>
                            <td className="p-6 text-sm font-medium text-muted-foreground bg-muted/5">
                                <div className="flex items-center gap-2">
                                    <Target size={16} className="text-primary" />
                                    Minimum Balance
                                </div>
                            </td>
                            {compareProducts.map((p) => (
                                <td key={p.id} className={cn(
                                    "p-6 text-center transition-colors",
                                    p.minBalance === bestMinBal && "bg-teal-500/5"
                                )}>
                                    <span className="text-sm font-medium">${p.minBalance}</span>
                                </td>
                            ))}
                        </tr>

                        {/* Perks / Features */}
                        <tr>
                            <td className="p-6 text-sm font-medium text-muted-foreground bg-muted/5 align-top">
                                <div className="flex items-center gap-2">
                                    <Star size={16} className="text-primary" />
                                    Key Features
                                </div>
                            </td>
                            {compareProducts.map((p) => (
                                <td key={p.id} className="p-6">
                                    <div className="flex flex-wrap justify-center gap-1.5">
                                        {p.perks?.map?.((perk: string) => (
                                            <span key={perk} className="text-[10px] bg-primary/5 text-primary border border-primary/10 px-2 py-0.5 rounded-full whitespace-nowrap">
                                                {perk}
                                            </span>
                                        ))}
                                    </div>
                                </td>
                            ))}
                        </tr>
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
                        <p className="text-sm text-muted-foreground">Personalized picks based on your priority</p>
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    {/* Best Overall */}
                    <div className="bg-gradient-to-br from-primary/10 to-background border border-primary/20 rounded-2xl p-6 shadow-xl shadow-primary/5 relative overflow-hidden group hover:scale-[1.02] transition-transform">
                        <div className="absolute top-0 right-0 p-4 text-primary/10 rotate-12 group-hover:rotate-0 transition-transform">
                            <Star size={64} />
                        </div>
                        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-primary/20 text-primary text-[10px] font-bold uppercase tracking-wider mb-4">
                            Best Overall
                        </div>
                        <h3 className="text-lg font-bold mb-1">{recommendations.overall.item.bankName}</h3>
                        <p className="text-xs text-muted-foreground mb-4">{recommendations.overall.item.name}</p>
                        <ul className="space-y-2 mb-6">
                            {recommendations.overall.reasoning.map((r, i) => (
                                <li key={i} className="flex items-start gap-2 text-xs text-foreground/80">
                                    <CheckCircle2 size={12} className="text-primary mt-0.5" />
                                    {r}
                                </li>
                            ))}
                        </ul>
                        <p className="text-[10px] text-muted-foreground italic flex items-center gap-1 border-t border-border/50 pt-4">
                            <Lightbulb size={12} />
                            Recommended based on balanced usage
                        </p>
                    </div>

                    {/* Best for Low Fees */}
                    <div className="bg-background border border-border rounded-2xl p-6 shadow-lg shadow-black/5 hover:border-teal-500/30 transition-all group">
                        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-600 text-[10px] font-bold uppercase tracking-wider mb-4">
                            Best for Low Fees
                        </div>
                        <h3 className="text-lg font-bold mb-1">{recommendations.lowFee.item.bankName}</h3>
                        <p className="text-xs text-muted-foreground mb-4">{recommendations.lowFee.item.name}</p>
                        <ul className="space-y-2 mb-6">
                            {recommendations.lowFee.reasoning.map((r, i) => (
                                <li key={i} className="flex items-start gap-2 text-xs text-foreground/80">
                                    <CheckCircle2 size={12} className="text-teal-500 mt-0.5" />
                                    {r}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Best for High Interest */}
                    <div className="bg-background border border-border rounded-2xl p-6 shadow-lg shadow-black/5 hover:border-orange-500/30 transition-all group">
                        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-600 text-[10px] font-bold uppercase tracking-wider mb-4">
                            Best Interest
                        </div>
                        <h3 className="text-lg font-bold mb-1">{recommendations.highInterest.item.bankName}</h3>
                        <p className="text-xs text-muted-foreground mb-4">{recommendations.highInterest.item.name}</p>
                        <ul className="space-y-2 mb-6">
                            {recommendations.highInterest.reasoning.map((r, i) => (
                                <li key={i} className="flex items-start gap-2 text-xs text-foreground/80">
                                    <CheckCircle2 size={12} className="text-orange-500 mt-0.5" />
                                    {r}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            {/* Smart Summary + Insights */}
            <div className="grid md:grid-cols-2 gap-8 pt-6 border-t border-border">
                <div className="space-y-4">
                    <h3 className="font-bold flex items-center gap-2">
                        <Lightbulb size={18} className="text-amber-500" />
                        Smart Summary & Insights
                    </h3>
                    <div className="space-y-3">
                        <div className="p-4 bg-secondary/30 rounded-xl">
                            <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Key Differences</h4>
                            <ul className="space-y-2">
                                <li className="text-sm text-foreground/80 flex items-start gap-2">
                                    <span className="text-primary">•</span>
                                    Interest rates range from {Math.min(...compareProducts.map(p => p.interestRate))}% to {bestInterest}%, a {(bestInterest - Math.min(...compareProducts.map(p => p.interestRate))).toFixed(1)}% variance.
                                </li>
                                <li className="text-sm text-foreground/80 flex items-start gap-2">
                                    <span className="text-primary">•</span>
                                    Maintenance fees vary by up to ${(Math.max(...compareProducts.map(p => p.monthlyFee)) - bestFee).toFixed(2)} per month.
                                </li>
                                <li className="text-sm text-foreground/80 flex items-start gap-2">
                                    <span className="text-primary">•</span>
                                    Min balance requirements start at ${bestMinBal} but can go up to ${Math.max(...compareProducts.map(p => p.minBalance))}.
                                </li>
                            </ul>
                        </div>
                        <div className="p-4 bg-secondary/30 rounded-xl">
                            <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Critical Trade-offs</h4>
                            <div className="space-y-2">
                                <p className="text-sm text-foreground/80">
                                    <strong>High Interest vs. Accessibility:</strong> Accounts with higher APY often require higher minimum balances or have limited fee-free transactions.
                                </p>
                                <p className="text-sm text-foreground/80">
                                    <strong>Low Fees vs. Features:</strong> The lowest fee accounts may lack premium digital features like goal-based auto-saving.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="font-bold flex items-center gap-2">
                        <Target size={18} className="text-primary" />
                        What to choose if...
                    </h3>
                    <div className="grid gap-3">
                        <div className="p-4 border border-border rounded-xl hover:border-primary/30 transition-colors">
                            <h4 className="text-sm font-bold text-foreground mb-1">...you have high monthly transactions</h4>
                            <p className="text-xs text-muted-foreground">Choose <strong>{recommendations.lowFee.item.bankName}</strong> to minimize recurring maintenance costs.</p>
                        </div>
                        <div className="p-4 border border-border rounded-xl hover:border-primary/30 transition-colors">
                            <h4 className="text-sm font-bold text-foreground mb-1">...you want to maximize goal growth</h4>
                            <p className="text-xs text-muted-foreground">Choose <strong>{recommendations.highInterest.item.bankName}</strong> for the leading yield in this group.</p>
                        </div>
                        <div className="p-4 border border-border rounded-xl hover:border-primary/30 transition-colors">
                            <h4 className="text-sm font-bold text-foreground mb-1">...you need basic access and low commitment</h4>
                            <p className="text-xs text-muted-foreground">Look for accounts with the lowest Minimum Balance requirement.</p>
                        </div>
                    </div>
                </div>
            </div>

            <Disclaimer />
        </div>
    )
}

export default function AccountsComparePage() {
    return (
        <div className="max-w-6xl mx-auto py-12 px-4">
            <Suspense fallback={<div className="flex items-center justify-center py-20 text-muted-foreground">Loading comparison...</div>}>
                <AccountsCompareContent />
            </Suspense>
        </div>
    )
}
