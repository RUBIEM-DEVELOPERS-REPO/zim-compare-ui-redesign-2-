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
import { SwitchSaveSimulator } from "@/components/dashboard/switch-save-simulator"

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
                <h2 className="text-xl font-medium text-foreground mb-2">No insurance policies selected for comparison.</h2>
                <p className="text-muted-foreground mb-8 max-w-xs">
                    Please select at least 2 policies to see a side-by-side comparison and AI recommendations.
                </p>
                <Link
                    href="/insurance"
                    className="bg-primary text-primary-foreground px-6 py-2.5 rounded-xl font-medium hover:scale-105 transition-transform flex items-center gap-2 shadow-lg"
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
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
                <div>
                    <button
                        onClick={() => router.push("/insurance")}
                        className="flex items-center gap-2 text-[10px] font-medium text-muted-foreground hover:text-primary uppercase tracking-[0.2em] transition-all mb-6 group"
                    >
                        <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                        Back to Policy Index
                    </button>
                    <h1 className="text-5xl font-display font-medium text-foreground tracking-tighter uppercase leading-tight">
                        Risk Analysis
                    </h1>
                    <p className="text-sm text-muted-foreground mt-2 font-medium font-sans opacity-70">
                        Synthesizing side-by-side performance metrics for {selectedPolicies.length} insurance contracts.
                    </p>
                </div>
                <button
                    onClick={handleSave}
                    className="glass-floating px-8 py-3 rounded-2xl text-[10px] font-medium uppercase tracking-[0.2em] bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 transition-all teal-glow active:scale-95"
                >
                    Archive This Logic
                </button>
            </div>

            {/* Comparison Table */}
            <div className="overflow-x-auto glass-floating shadow-2xl teal-glow border-border/50">
                <table className="w-full text-left border-collapse min-w-[800px]">
                    <thead>
                        <tr className="border-b border-border/30 bg-secondary/50">
                            <th className="p-8 text-[10px] font-medium uppercase tracking-[0.3em] text-primary/70 w-1/5 sticky left-0 bg-background z-10 transition-colors backdrop-blur-3xl">Risk Vector</th>
                            {selectedPolicies.map((p) => {
                                const provider = getProvider(p.providerId)
                                return (
                                    <th key={p.id} className="p-8 text-center border-l border-white/5">
                                        <div className="relative flex flex-col items-center gap-4">
                                            <button
                                                onClick={() => handleRemove(p.id)}
                                                className="absolute -top-4 -right-4 p-1.5 rounded-full glass-floating border-white/10 hover:bg-destructive/10 hover:text-destructive transition-all group/close"
                                                title="Remove Entity"
                                            >
                                                <X size={12} strokeWidth={3} />
                                            </button>
                                            <span className="text-[10px] font-medium text-primary uppercase tracking-[0.2em] bg-primary/5 px-3 py-1.5 rounded-xl border border-primary/20 shadow-inner">
                                                {p.category.replace("_", " & ")}
                                            </span>
                                            <div className="text-center">
                                                <p className="text-[10px] font-medium text-muted-foreground uppercase mt-2 tracking-[0.1em] opacity-60 font-sans mb-1">{p.providerName}</p>
                                                <p className="text-xl font-display font-black text-foreground uppercase tracking-tight leading-none">{p.name}</p>
                                            </div>
                                        </div>
                                    </th>
                                )
                            })}
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="hover:bg-secondary/30 transition-colors">
                            <td className="p-8 text-[10px] font-medium text-muted-foreground uppercase tracking-[0.2em] sticky left-0 bg-background/80 backdrop-blur-3xl z-10">Neural Benefits</td>
                            {selectedPolicies.map((p) => (
<<<<<<< Updated upstream
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
=======
                                <td key={p.id} className="p-8 border-l border-white/5">
                                    <div className="flex flex-wrap justify-center gap-2">
                                        {p.benefits.map(b => (
                                            <span key={b} className="text-[9px] font-medium uppercase tracking-widest bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-lg border border-emerald-500/20 shadow-inner">
>>>>>>> Stashed changes
                                                {b}
                                            </span>
                                        ))}
                                    </div>
                                </td>
                            ))}
                        </tr>
                        <tr className="hover:bg-white/5 transition-colors">
                            <td className="p-8 text-[10px] font-medium text-muted-foreground uppercase tracking-[0.2em] sticky left-0 bg-[#0A0A0A]/80 backdrop-blur-3xl z-10">Risk Exclusions</td>
                            {selectedPolicies.map((p) => (
<<<<<<< Updated upstream
                                <td key={p.id} className="p-6 border-l border-border/50">
                                    <div className="flex flex-wrap justify-center gap-1">
                                        {p.exclusions.map((e: string) => (
                                            <span key={e} className="text-[9px] font-black uppercase tracking-tight bg-red-50 text-red-700 px-2 py-0.5 rounded-full border border-red-100">
=======
                                <td key={p.id} className="p-8 border-l border-white/5">
                                    <div className="flex flex-wrap justify-center gap-2">
                                        {p.exclusions.map(e => (
                                            <span key={e} className="text-[9px] font-medium uppercase tracking-widest bg-red-500/10 text-red-400 px-3 py-1 rounded-lg border border-red-500/20 shadow-inner">
>>>>>>> Stashed changes
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
            <div className="space-y-10">
                <div className="flex items-center gap-4">
                    <div className="p-3 glass-floating bg-primary/10 text-primary teal-glow">
                        <Zap size={28} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-display font-medium text-foreground uppercase tracking-tight">Neural Optimization</h2>
                        <p className="text-sm text-muted-foreground font-medium opacity-60">Cognitive risk/value mapping based on selection fingerprints</p>
                    </div>
                </div>

                <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-5">
                    {/* Best Value */}
                    <div className="glass-floating bg-gradient-to-br from-primary/10 to-transparent border-primary/30 p-8 shadow-2xl teal-glow relative overflow-hidden group hover:scale-[1.03] transition-all duration-500">
                        <div className="absolute -top-4 -right-4 bg-primary text-primary-foreground p-10 rounded-full opacity-5 group-hover:scale-110 transition-transform duration-1000">
                            <Zap size={64} />
                        </div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-primary text-primary-foreground text-[10px] font-medium uppercase tracking-[0.2em] mb-6 shadow-xl">
                            Best Value
                        </div>
                        <h3 className="text-xl font-display font-medium text-white uppercase tracking-tight leading-none mb-1">{bestValue.name}</h3>
                        <p className="text-[10px] font-medium text-primary uppercase tracking-[0.1em] mb-8 opacity-70">{bestValue.providerName}</p>
                        <ul className="space-y-4 mb-8">
                            <li className="text-[11px] font-medium text-foreground/90 flex gap-3">
                                <ShieldCheck size={14} className="text-primary shrink-0" strokeWidth={3} />
                                <span>Highest coverage per dollar spent</span>
                            </li>
                            <li className="text-[11px] font-medium text-foreground/90 flex gap-3">
                                <ShieldCheck size={14} className="text-primary shrink-0" strokeWidth={3} />
                                <span>Includes {bestValue.benefits.length} core benefits</span>
                            </li>
                        </ul>
                        <p className="text-[10px] font-medium text-primary bg-primary/5 px-3 py-1.5 rounded-xl border border-primary/20 uppercase tracking-widest text-center">Neural Logic: High efficiency</p>
                    </div>

                    {/* Claims Reliability */}
                    <div className="glass-floating p-8 shadow-xl border-white/5 hover:border-primary/40 transition-all duration-500 group floating-hover lg:col-span-1">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-white/5 text-muted-foreground text-[10px] font-medium uppercase tracking-[0.2em] mb-6 border border-white/10">
                            Claims Leader
                        </div>
                        <h3 className="text-xl font-display font-medium text-white uppercase tracking-tight leading-none mb-1 group-hover:text-primary transition-colors">{bestClaims.name}</h3>
                        <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-[0.1em] mb-8 opacity-60">{bestClaims.providerName}</p>
                        <ul className="space-y-4 mb-8">
                            <li className="text-[11px] font-medium text-foreground/80 flex gap-3">
                                <HeartHandshake size={14} className="text-primary/60 shrink-0" strokeWidth={3} />
                                <span>Top provider claims score of {getProvider(bestClaims.providerId)?.claimsScore}%</span>
                            </li>
                            <li className="text-[11px] font-medium text-foreground/80 flex gap-3">
                                <HeartHandshake size={14} className="text-primary/60 shrink-0" strokeWidth={3} />
                                <span>Fastest turnaround: {getProvider(bestClaims.providerId)?.avgClaimDays} d</span>
                            </li>
                        </ul>
                        <p className="text-[10px] font-medium text-muted-foreground bg-white/5 px-3 py-1.5 rounded-xl border border-white/10 uppercase tracking-widest text-center opacity-60">High reliability</p>
                    </div>

                    {/* Best Coverage */}
                    <div className="glass-floating p-8 shadow-xl border-white/5 hover:border-primary/40 transition-all duration-500 group floating-hover lg:col-span-1">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-white/5 text-muted-foreground text-[10px] font-medium uppercase tracking-[0.2em] mb-6 border border-white/10">
                            Maximum Shield
                        </div>
                        <h3 className="text-xl font-display font-medium text-white uppercase tracking-tight leading-none mb-1 group-hover:text-primary transition-colors">{bestCoverage.name}</h3>
                        <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-[0.1em] mb-8 opacity-60">{bestCoverage.providerName}</p>
                        <ul className="space-y-4 mb-8">
                            <li className="text-[11px] font-medium text-foreground/80 flex gap-3">
                                <BarChart3 size={14} className="text-primary/60 shrink-0" strokeWidth={3} />
                                <span>Cover: ${(bestCoverage.coverLimit / 1000).toFixed(0)}k total</span>
                            </li>
                            <li className="text-[11px] font-medium text-foreground/80 flex gap-3">
                                <BarChart3 size={14} className="text-primary/60 shrink-0" strokeWidth={3} />
                                <span>Extensive benefits package</span>
                            </li>
                        </ul>
                        <p className="text-[10px] font-medium text-muted-foreground bg-white/5 px-3 py-1.5 rounded-xl border border-white/10 uppercase tracking-widest text-center opacity-60">High limits</p>
                    </div>

                    {/* Cheapest premium / Switch & Save Simulator */}
                    <SwitchSaveSimulator
                        category="insurance"
                        current={selectedPolicies[0]}
                        recommended={cheapest}
                    />

                    {/* Get Covered */}
                    <div className="glass-floating p-8 shadow-2xl border-primary/20 bg-primary/5 hover:bg-primary/10 transition-all duration-500 group relative overflow-hidden flex flex-col teal-glow">
                        <div className="absolute -bottom-4 -right-4 p-6 text-primary/10 group-hover:scale-110 transition-transform duration-700">
                             <ShieldCheck size={140} />
                        </div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-primary text-primary-foreground text-[10px] font-black uppercase tracking-[0.2em] mb-6 shadow-lg">
                            Instant Shield
                        </div>
                        <h3 className="text-2xl font-display font-black text-white uppercase tracking-tight leading-none mb-1">Get Covered</h3>
                        <p className="text-[11px] font-black text-primary uppercase tracking-[0.1em] mb-8 opacity-80 leading-tight">
                            {bestValue.providerName}: {bestValue.name}
                        </p>
                        
                        <div className="flex-1 space-y-4 mb-10">
                            <p className="text-xs text-muted-foreground font-medium leading-relaxed">
                                Our neural analysis indicates maximum risk absorption for this configuration. Start your coverage immediately with {bestValue.providerName}.
                            </p>
                        </div>

                        <button className="w-full bg-primary py-4 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-primary-foreground hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-primary/30 flex items-center justify-center gap-3 relative z-10">
                            Get Cover / Request Quote
                        </button>
                    </div>
                </div>
            </div>

            {/* Smart Summary */}
            <div className="grid gap-10 md:grid-cols-2">
                <div className="glass-floating p-8 shadow-2xl teal-glow border-white/5">
                    <h3 className="text-xl font-display font-medium text-white uppercase tracking-tight mb-8 flex items-center gap-4">
                        <TrendingUp size={24} className="text-primary" />
                        Vector Analysis
                    </h3>
                    <ul className="space-y-6">
                        <li className="text-sm text-foreground/80 flex gap-4 font-medium font-sans">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0 shadow-lg shadow-primary/50" />
                            <span>
                                <strong className="text-foreground font-bold">{cheapest.providerName}</strong> offers terms at the lowest monthly premium but mandates a significant excess threshold of <strong>${cheapest.excess}</strong>.
                            </span>
                        </li>
                        <li className="text-sm text-foreground/80 flex gap-4 font-medium font-sans">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0 shadow-lg shadow-primary/50" />
                            <span>
                                <strong className="text-foreground font-bold">{bestCoverage.providerName}</strong> provides <strong>${(bestCoverage.coverLimit - cheapest.coverLimit).toLocaleString()}</strong> in additional risk absorption vs budget variants.
                            </span>
                        </li>
                        <li className="text-sm text-foreground/80 flex gap-4 font-medium font-sans">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0 shadow-lg shadow-primary/50" />
                            <span>
                                Waiting periods vary from <strong>0</strong> to <strong>{Math.max(...selectedPolicies.map(p => p.waitingPeriodDays))}</strong> days across selected institutional contracts.
                            </span>
                        </li>
                    </ul>
                </div>

                <div className="glass-floating p-8 bg-primary/5 border-primary/20 shadow-2xl teal-glow">
                    <h3 className="text-xl font-display font-medium text-white uppercase tracking-tight mb-8 flex items-center gap-4">
                        <Award size={24} className="text-primary" />
                        Strategic Alignment
                    </h3>
                    <div className="space-y-8">
                        <div>
                            <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-primary mb-2">Cost Optimization</p>
                            <p className="text-sm text-foreground/80 font-medium font-sans leading-relaxed">Go with <strong className="text-white font-medium">{cheapest.name}</strong>. It optimizes monthly liquidity by <strong>${Math.max(...selectedPolicies.map(p => p.monthlyPremium)) - cheapest.monthlyPremium}</strong> vs max-tier options.</p>
                        </div>
                        <div>
                            <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-primary mb-2">Maximum Resilience</p>
                            <p className="text-sm text-foreground/80 font-medium font-sans leading-relaxed">Choose <strong className="text-white font-medium">{bestCoverage.name}</strong> for industry-leading <strong>${bestCoverage.coverLimit.toLocaleString()}</strong> coverage thresholds.</p>
                        </div>
                        <div>
                            <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-primary mb-2">Risk Sensitivity</p>
                            <p className="text-sm text-foreground/80 font-medium font-sans leading-relaxed">The <strong>${lowestExcess}</strong> excess on <strong className="text-white font-medium">{selectedPolicies.find(p => p.excess === lowestExcess)?.name}</strong> minimizes out-of-pocket friction during incidents.</p>
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
            <Suspense fallback={<div className="flex items-center justify-center py-20 text-teal-600 font-medium animate-pulse">Analyzing Insurance Policies...</div>}>
                <InsuranceCompareContent />
            </Suspense>
        </div>
    )
}

