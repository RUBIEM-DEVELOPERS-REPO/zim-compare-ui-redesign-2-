"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { apiGet } from "@/lib/api"
import { useAppStore } from "@/lib/store"
import { useI18n } from "@/lib/i18n"
import { ScoreBadge } from "@/components/score-badge"
import { Disclaimer } from "@/components/disclaimer"
import { Suspense, useEffect, useState } from "react"
import { ArrowLeft, CheckCircle2, TrendingUp, Clock, ShieldCheck, ChevronLeft, X, Zap, Award, BarChart3, HeartHandshake } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

function InsuranceCompareContent() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const ids = searchParams.get("ids")?.split(",") ?? []
    const { t } = useI18n()
    const { addSavedComparison, removeFromCompareTray, clearCompareTray } = useAppStore()

    const [policies, setPolicies] = useState<any[]>([])
    const [insuranceProviders, setInsuranceProviders] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        clearCompareTray()
        Promise.all([
            apiGet('/insurance/policies').catch(() => ({ policies: [] })),
            apiGet('/insurance/providers').catch(() => ({ providers: [] }))
        ]).then(([pRes, prRes]) => {
            setPolicies(pRes.policies || [])
            setInsuranceProviders(prRes.providers || [])
            setLoading(false)
        })
    }, [clearCompareTray])

    const selectedPolicies = policies.filter((p) => ids.includes(p.id))

    if (loading) {
        return <div className="flex items-center justify-center py-20 text-muted-foreground">Loading insurance...</div>
    }

    if (selectedPolicies.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="p-4 bg-secondary/50 rounded-full mb-6">
                    <HeartHandshake size={48} className="text-muted-foreground" />
                </div>
                <h2 className="text-xl font-bold text-foreground mb-2">No insurance policies selected for comparison.</h2>
                <p className="text-muted-foreground mb-8 max-w-xs">
                    Please select at least 2 policies to see a side-by-side comparison and AI recommendations.
                </p>
                <Link
                    href="/insurance"
                    className="bg-teal-600 text-white px-6 py-2.5 rounded-xl font-bold hover:scale-105 transition-transform flex items-center gap-2 shadow-lg shadow-teal-500/20"
                >
                    <ArrowLeft size={16} />
                    Go back to Policies
                </Link>
            </div>
        )
    }

    const handleRemove = (id: string) => {
        removeFromCompareTray(id)
        const newIds = ids.filter(i => i !== id)
        if (newIds.length === 0) {
            router.push("/insurance")
        } else {
            router.push(`/insurance/compare/policies?ids=${newIds.join(",")}`)
        }
    }

    // Best values logic
    const lowestPremium = Math.min(...selectedPolicies.map(p => p.monthlyPremium))
    const lowestExcess = Math.min(...selectedPolicies.map(p => p.excess))
    const highestCover = Math.max(...selectedPolicies.map(p => p.coverLimit))

    const getProvider = (pid: string) => insuranceProviders.find(pr => pr.id === pid)
    const bestClaimScore = Math.max(...selectedPolicies.map(p => getProvider(p.providerId)?.claimsScore || 0))

    // AI Recommendations Logic (Simplified for mock)
    const bestValue = selectedPolicies.reduce((prev, curr) => (curr.coverLimit / curr.monthlyPremium > prev.coverLimit / prev.monthlyPremium ? curr : prev))
    const cheapest = selectedPolicies.reduce((prev, curr) => (curr.monthlyPremium < prev.monthlyPremium ? curr : prev))
    const bestCoverage = selectedPolicies.reduce((prev, curr) => (curr.coverLimit > prev.coverLimit ? curr : prev))
    const bestClaims = selectedPolicies.reduce((prev, curr) => {
        const pScore = getProvider(prev.providerId)?.claimsScore || 0
        const cScore = getProvider(curr.providerId)?.claimsScore || 0
        return cScore > pScore ? curr : prev
    })

    const handleSave = () => {
        addSavedComparison({
            id: Math.random().toString(36).substr(2, 9),
            category: "insurance",
            itemIds: ids,
            createdAt: new Date().toISOString(),
            name: `Insurance Comparison: ${selectedPolicies.map(p => p.providerName).join(" vs ")}`
        })
        router.push("/dashboard")
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-700 pb-20">
            <div className="flex items-center justify-between">
                <button
                    onClick={() => router.push("/insurance")}
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group"
                >
                    <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                    Back to Policies
                </button>
                <div className="flex items-center gap-4">
                    <button
                        onClick={handleSave}
                        className="text-xs font-bold uppercase tracking-wider text-teal-600 hover:text-teal-700 transition-colors"
                    >
                        Save this comparison
                    </button>
                </div>
            </div>

            <div className="text-center md:text-left">
                <h1 className="text-3xl font-bold text-foreground">Insurance Policy Comparison</h1>
                <p className="text-muted-foreground mt-2">Comparing {selectedPolicies.length} policies side-by-side</p>
            </div>

            {/* Comparison Table */}
            <div className="overflow-x-auto rounded-3xl border border-border bg-card shadow-xl shadow-teal-500/5">
                <table className="w-full text-left border-collapse min-w-[800px]">
                    <thead>
                        <tr className="border-b border-border bg-muted/30">
                            <th className="p-6 text-xs font-bold uppercase tracking-widest text-muted-foreground w-1/5 sticky left-0 bg-card z-10">Policy Details</th>
                            {selectedPolicies.map((p) => {
                                const provider = getProvider(p.providerId)
                                return (
                                    <th key={p.id} className="p-6 text-center border-l border-border/50">
                                        <div className="relative flex flex-col items-center gap-2">
                                            <button
                                                onClick={() => handleRemove(p.id)}
                                                className="absolute -top-4 -right-2 p-1 rounded-full bg-secondary hover:bg-destructive/10 hover:text-destructive transition-all"
                                                title="Remove item"
                                            >
                                                <X size={14} />
                                            </button>
                                            <span className="text-[10px] font-black text-teal-600 uppercase tracking-tighter bg-teal-50 px-2 py-0.5 rounded-full border border-teal-100">
                                                {p.category.replace("_", " & ")}
                                            </span>
                                            <div className="text-center">
                                                <p className="text-xs font-medium text-muted-foreground leading-tight uppercase tracking-widest mb-1">{p.providerName}</p>
                                                <p className="text-sm font-bold text-foreground">{p.name}</p>
                                            </div>
                                        </div>
                                    </th>
                                )
                            })}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50">
                        <tr>
                            <td className="p-6 text-sm font-medium text-muted-foreground bg-muted/5 sticky left-0 bg-muted/5 z-10">Monthly Premium</td>
                            {selectedPolicies.map((p) => (
                                <td key={p.id} className="p-6 text-center border-l border-border/50">
                                    <span className={cn(
                                        "text-lg font-black",
                                        p.monthlyPremium === lowestPremium ? "text-emerald-600 scale-110" : "text-foreground"
                                    )}>
                                        ${p.monthlyPremium}
                                    </span>
                                    {p.monthlyPremium === lowestPremium && <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-tighter mt-1">Best Price</p>}
                                </td>
                            ))}
                        </tr>
                        <tr>
                            <td className="p-6 text-sm font-medium text-muted-foreground bg-muted/5 sticky left-0 bg-muted/5 z-10">Annual Premium</td>
                            {selectedPolicies.map((p) => (
                                <td key={p.id} className="p-6 text-center text-sm font-semibold border-l border-border/50">${p.annualPremium}</td>
                            ))}
                        </tr>
                        <tr>
                            <td className="p-6 text-sm font-medium text-muted-foreground bg-muted/5 sticky left-0 bg-muted/5 z-10">Cover Limit</td>
                            {selectedPolicies.map((p) => (
                                <td key={p.id} className="p-6 text-center border-l border-border/50">
                                    <div className={cn(
                                        "inline-flex flex-col",
                                        p.coverLimit === highestCover ? "text-teal-600 font-bold" : "text-foreground"
                                    )}>
                                        <span className="text-lg font-black">${p.coverLimit.toLocaleString()}</span>
                                        {p.coverLimit === highestCover && <span className="text-[10px] uppercase tracking-tighter">Max Coverage</span>}
                                    </div>
                                </td>
                            ))}
                        </tr>
                        <tr>
                            <td className="p-6 text-sm font-medium text-muted-foreground bg-muted/5 sticky left-0 bg-muted/5 z-10">Excess / Deductible</td>
                            {selectedPolicies.map((p) => (
                                <td key={p.id} className="p-6 text-center border-l border-border/50">
                                    <span className={cn(
                                        "text-sm font-bold",
                                        p.excess === lowestExcess ? "text-emerald-600" : "text-foreground"
                                    )}>
                                        ${p.excess}
                                    </span>
                                    {p.excess === lowestExcess && <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-tighter mt-1">Lowest Risk</p>}
                                </td>
                            ))}
                        </tr>
                        <tr>
                            <td className="p-6 text-sm font-medium text-muted-foreground bg-muted/5 sticky left-0 bg-muted/5 z-10">Waiting Period</td>
                            {selectedPolicies.map((p) => (
                                <td key={p.id} className="p-6 text-center border-l border-border/50">
                                    <span className="text-sm font-medium">{p.waitingPeriodDays} days</span>
                                </td>
                            ))}
                        </tr>
                        <tr>
                            <td className="p-6 text-sm font-medium text-muted-foreground bg-muted/5 sticky left-0 bg-muted/5 z-10">Claim Reliability</td>
                            {selectedPolicies.map((p) => {
                                const provider = getProvider(p.providerId)
                                return (
                                    <td key={p.id} className="p-6 text-center border-l border-border/50">
                                        <div className="flex flex-col items-center gap-1">
                                            <ScoreBadge score={provider?.claimsScore || 0} label="" />
                                            <span className="text-[10px] text-muted-foreground">Avg. {provider?.avgClaimDays} days</span>
                                        </div>
                                    </td>
                                )
                            })}
                        </tr>
                        <tr>
                            <td className="p-6 text-sm font-medium text-muted-foreground bg-muted/5 sticky left-0 bg-muted/5 z-10">Key Benefits</td>
                            {selectedPolicies.map((p) => (
                                <td key={p.id} className="p-6 border-l border-border/50">
                                    <div className="flex flex-wrap justify-center gap-1">
                                        {p.benefits.map((b: string) => (
                                            <span key={b} className="text-[9px] font-black uppercase tracking-tight bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-100">
                                                {b}
                                            </span>
                                        ))}
                                    </div>
                                </td>
                            ))}
                        </tr>
                        <tr>
                            <td className="p-6 text-sm font-medium text-muted-foreground bg-muted/5 sticky left-0 bg-muted/5 z-10">Exclusions</td>
                            {selectedPolicies.map((p) => (
                                <td key={p.id} className="p-6 border-l border-border/50">
                                    <div className="flex flex-wrap justify-center gap-1">
                                        {p.exclusions.map((e: string) => (
                                            <span key={e} className="text-[9px] font-black uppercase tracking-tight bg-red-50 text-red-700 px-2 py-0.5 rounded-full border border-red-100">
                                                {e}
                                            </span>
                                        ))}
                                    </div>
                                </td>
                            ))}
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* AI Recommendations */}
            <div className="space-y-6">
                <div className="flex items-center gap-3">
                    <div className="p-1.5 rounded-lg bg-teal-600 text-white">
                        <Zap size={20} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-foreground">AI Intelligence Recommendations</h2>
                        <p className="text-sm text-muted-foreground italic">Based on your selection comparison</p>
                    </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {/* Best Value */}
                    <div className="rounded-2xl border border-teal-200/50 bg-teal-50/20 p-5 relative overflow-hidden group">
                        <div className="absolute -top-4 -right-4 bg-teal-600 text-white p-6 rounded-full opacity-5 group-hover:scale-110 transition-transform">
                            <Zap size={32} />
                        </div>
                        <div className="flex items-center gap-2 mb-3">
                            <span className="text-[10px] font-black uppercase tracking-widest text-teal-600">Best Value</span>
                        </div>
                        <p className="text-sm font-bold text-foreground mb-1">{bestValue.name}</p>
                        <p className="text-xs text-muted-foreground mb-4">{bestValue.providerName}</p>
                        <ul className="space-y-2 mb-4">
                            <li className="text-[11px] flex gap-2">
                                <ShieldCheck size={14} className="text-teal-600 shrink-0" />
                                <span>Highest coverage per dollar spent</span>
                            </li>
                            <li className="text-[11px] flex gap-2">
                                <ShieldCheck size={14} className="text-teal-600 shrink-0" />
                                <span>Includes {bestValue.benefits.length} core benefits</span>
                            </li>
                        </ul>
                        <p className="text-[11px] font-medium text-teal-700 bg-teal-100/50 px-2 py-1 rounded-lg">Good for: Maximum protection on a budget</p>
                    </div>

                    {/* Cheapest Premium */}
                    <div className="rounded-2xl border border-border bg-card p-5 group">
                        <div className="flex items-center gap-2 mb-3">
                            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Cheapest Premium</span>
                        </div>
                        <p className="text-sm font-bold text-foreground mb-1">{cheapest.name}</p>
                        <p className="text-xs text-muted-foreground mb-4">{cheapest.providerName}</p>
                        <ul className="space-y-2 mb-4">
                            <li className="text-[11px] flex gap-2">
                                <Award size={14} className="text-emerald-600 shrink-0" />
                                <span>Lowest monthly commitment: ${cheapest.monthlyPremium}</span>
                            </li>
                            <li className="text-[11px] flex gap-2">
                                <Award size={14} className="text-emerald-600 shrink-0" />
                                <span>Minimal upfront administration fees</span>
                            </li>
                        </ul>
                        <p className="text-[11px] font-medium text-emerald-700 bg-emerald-100/50 px-2 py-1 rounded-lg">Good for: Budget-conscious individuals</p>
                    </div>

                    {/* Best Coverage */}
                    <div className="rounded-2xl border border-border bg-card p-5 group">
                        <div className="flex items-center gap-2 mb-3">
                            <span className="text-[10px] font-black uppercase tracking-widest text-blue-600">Best Coverage</span>
                        </div>
                        <p className="text-sm font-bold text-foreground mb-1">{bestCoverage.name}</p>
                        <p className="text-xs text-muted-foreground mb-4">{bestCoverage.providerName}</p>
                        <ul className="space-y-2 mb-4">
                            <li className="text-[11px] flex gap-2">
                                <BarChart3 size={14} className="text-blue-600 shrink-0" />
                                <span>Highest cover limit: ${bestCoverage.coverLimit.toLocaleString()}</span>
                            </li>
                            <li className="text-[11px] flex gap-2">
                                <BarChart3 size={14} className="text-blue-600 shrink-0" />
                                <span>Extensive benefits package included</span>
                            </li>
                        </ul>
                        <p className="text-[11px] font-medium text-blue-700 bg-blue-100/50 px-2 py-1 rounded-lg">Good for: High-net-worth protection</p>
                    </div>

                    {/* Claims Reliability */}
                    <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5 group">
                        <div className="flex items-center gap-2 mb-3">
                            <span className="text-[10px] font-black uppercase tracking-widest text-primary">Claims Expert</span>
                        </div>
                        <p className="text-sm font-bold text-foreground mb-1">{bestClaims.name}</p>
                        <p className="text-xs text-muted-foreground mb-4">{bestClaims.providerName}</p>
                        <ul className="space-y-2 mb-4">
                            <li className="text-[11px] flex gap-2">
                                <HeartHandshake size={14} className="text-primary shrink-0" />
                                <span>Top provider claims score of {getProvider(bestClaims.providerId)?.claimsScore}%</span>
                            </li>
                            <li className="text-[11px] flex gap-2">
                                <HeartHandshake size={14} className="text-primary shrink-0" />
                                <span>Fastest turnaround: {getProvider(bestClaims.providerId)?.avgClaimDays} days</span>
                            </li>
                        </ul>
                        <p className="text-[11px] font-medium text-primary bg-primary/10 px-2 py-1 rounded-lg">Good for: Peace of mind & reliability</p>
                    </div>
                </div>
            </div>

            {/* Smart Summary */}
            <div className="grid gap-6 md:grid-cols-2">
                <div className="rounded-3xl border border-border bg-card p-8">
                    <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                        <TrendingUp size={20} className="text-teal-600" />
                        Key Differences & Trade-offs
                    </h3>
                    <ul className="space-y-3">
                        <li className="text-sm text-muted-foreground flex gap-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-teal-600 mt-2 shrink-0" />
                            <span>
                                <strong className="text-foreground">{cheapest.providerName}</strong> offers the lowest premium but has a higher excess of <strong>${cheapest.excess}</strong>.
                            </span>
                        </li>
                        <li className="text-sm text-muted-foreground flex gap-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-teal-600 mt-2 shrink-0" />
                            <span>
                                <strong className="text-foreground">{bestCoverage.providerName}</strong> provides <strong>${(bestCoverage.coverLimit - cheapest.coverLimit).toLocaleString()}</strong> more coverage than the budget option.
                            </span>
                        </li>
                        <li className="text-sm text-muted-foreground flex gap-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-teal-600 mt-2 shrink-0" />
                            <span>
                                Waiting periods vary from <strong>0</strong> to <strong>{Math.max(...selectedPolicies.map(p => p.waitingPeriodDays))}</strong> days across selected policies.
                            </span>
                        </li>
                        <li className="text-sm text-muted-foreground flex gap-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-teal-600 mt-2 shrink-0" />
                            <span>
                                <strong>{bestClaims.providerName}</strong> stands out with a <strong>{getProvider(bestClaims.providerId)?.claimsScore}%</strong> claims reliability rating.
                            </span>
                        </li>
                    </ul>
                </div>

                <div className="rounded-3xl border border-teal-600/10 bg-teal-600/5 p-8">
                    <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                        <Award size={20} className="text-teal-600" />
                        What to choose if...
                    </h3>
                    <div className="space-y-4">
                        <div>
                            <p className="text-xs font-black uppercase tracking-widest text-teal-700 mb-1">If you want the lowest monthly cost</p>
                            <p className="text-sm text-muted-foreground">Go with <strong className="text-foreground">{cheapest.name}</strong>. It saves you <strong>${Math.max(...selectedPolicies.map(p => p.monthlyPremium)) - cheapest.monthlyPremium}</strong> per month compared to the highest option.</p>
                        </div>
                        <div>
                            <p className="text-xs font-black uppercase tracking-widest text-teal-700 mb-1">If you want maximum cover</p>
                            <p className="text-sm text-muted-foreground">Choose <strong className="text-foreground">{bestCoverage.name}</strong> for its <strong>${bestCoverage.coverLimit.toLocaleString()}</strong> limit.</p>
                        </div>
                        <div>
                            <p className="text-xs font-black uppercase tracking-widest text-teal-700 mb-1">If you want lower excess</p>
                            <p className="text-sm text-muted-foreground">The <strong>${lowestExcess}</strong> excess on <strong className="text-foreground">{selectedPolicies.find(p => p.excess === lowestExcess)?.name}</strong> reduces your out-of-pocket costs during a claim.</p>
                        </div>
                    </div>
                </div>
            </div>

            <Disclaimer />
        </div>
    )
}

export default function InsuranceComparePage() {
    return (
        <div className="max-w-6xl mx-auto py-8 px-4">
            <Suspense fallback={<div className="flex items-center justify-center py-20 text-teal-600 font-bold animate-pulse">Analyzing Insurance Policies...</div>}>
                <InsuranceCompareContent />
            </Suspense>
        </div>
    )
}
