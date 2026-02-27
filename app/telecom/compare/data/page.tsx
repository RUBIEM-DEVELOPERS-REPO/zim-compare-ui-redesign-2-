"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { dataBundles } from "@/lib/mock/telecoms"
import { useAppStore } from "@/lib/store"
import { Disclaimer } from "@/components/disclaimer"
import { Suspense, useMemo, useEffect } from "react"
import {
    ArrowLeft,
    CheckCircle2,
    ChevronLeft,
    Star,
    Info,
    Wifi,
    TrendingUp,
    BadgePercent,
    Lightbulb,
    Target,
    Zap,
    Clock,
    Smartphone
} from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

function DataBundleCompareContent() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const ids = searchParams.get("ids")?.split(",") ?? []
    const { addSavedComparison, clearCompareTray } = useAppStore()

    useEffect(() => {
        clearCompareTray()
    }, [clearCompareTray])

    const compareBundles = useMemo(() =>
        dataBundles.filter((b) => ids.includes(b.id)),
        [ids])

    if (compareBundles.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="p-4 bg-secondary/50 rounded-full mb-6">
                    <Wifi size={48} className="text-muted-foreground" />
                </div>
                <h2 className="text-xl font-bold text-foreground mb-2">No data bundles selected</h2>
                <p className="text-muted-foreground mb-8 max-w-xs">
                    Please select at least 2 bundles to see a side-by-side comparison and AI insights.
                </p>
                <Link
                    href="/telecom"
                    className="bg-teal-600 text-white px-6 py-2.5 rounded-xl font-bold hover:scale-105 transition-transform flex items-center gap-2"
                >
                    <ArrowLeft size={16} />
                    Go back to Telecoms
                </Link>
            </div>
        )
    }

    // Best Value Calculations
    const bestPrice = Math.min(...compareBundles.map(b => b.price))
    const highestData = Math.max(...compareBundles.map(b => b.dataGB))
    const bestCostPerGB = Math.min(...compareBundles.map(b => b.costPerGB))
    const bestValidity = Math.max(...compareBundles.map(b => b.validityDays))

    // AI Recommendations Logic
    const recommendations = useMemo(() => {
        const bestValue = [...compareBundles].sort((a, b) => a.costPerGB - b.costPerGB)[0]
        const heavyUsage = [...compareBundles].sort((a, b) => b.dataGB - a.dataGB)[0]

        // For short term, we look at daily/night/social category priority
        const shortTerm = [...compareBundles].sort((a, b) => {
            const priority = { daily: 1, night: 1, social: 1, weekly: 2, monthly: 3, unlimited: 4 } as any
            const pA = priority[a.category] || 5
            const pB = priority[b.category] || 5
            if (pA !== pB) return pA - pB
            return a.price - b.price
        })[0]

        return {
            value: {
                item: bestValue,
                reasoning: [
                    `Lowest cost at $${bestValue.costPerGB.toFixed(2)} per GB`,
                    "Ideal for bulk downloads and software updates",
                    "Maximizes your data budget effectively"
                ],
                goodFor: "Streaming & Large Downloads"
            },
            heavy: {
                item: heavyUsage,
                reasoning: [
                    `Largest volume with ${heavyUsage.dataGB >= 1 ? `${heavyUsage.dataGB}GB` : `${heavyUsage.dataGB * 1000}MB`}`,
                    heavyUsage.fupNote ? "Includes FUP protection" : "High allowance for multi-device usage",
                    "Reduces frequency of top-ups"
                ],
                goodFor: "Remote Work & Family Sharing"
            },
            shortTerm: {
                item: shortTerm,
                reasoning: [
                    "Optimized for immediate, specific needs",
                    "Lowest entry price for quick connectivity",
                    "Perfect for social media or emergency use"
                ],
                goodFor: "Social Media & Quick Updates"
            }
        }
    }, [compareBundles])

    const handleSave = () => {
        addSavedComparison({
            id: Math.random().toString(36).substr(2, 9),
            category: "telecom",
            itemIds: ids,
            createdAt: new Date().toISOString(),
            name: `Data Comparison: ${compareBundles.map(b => b.providerName).join(" vs ")}`
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
                        Data Bundle Comparison
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Comparing {compareBundles.length} bundle{compareBundles.length !== 1 ? 's' : ''} side-by-side
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
            <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-xl shadow-teal-500/5">
                <table className="w-full text-left border-collapse min-w-[600px]">
                    <thead>
                        <tr className="border-b border-border bg-muted/20">
                            <th className="p-6 text-xs font-bold uppercase tracking-widest text-muted-foreground w-1/4">Metric</th>
                            {compareBundles.map((b) => (
                                <th key={b.id} className="p-6">
                                    <div className="flex flex-col">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-[10px] font-bold text-teal-600 uppercase tracking-tighter">{b.providerName}</span>
                                            <button
                                                onClick={() => {
                                                    const newIds = ids.filter(i => i !== b.id)
                                                    router.push(`?ids=${newIds.join(",")}`)
                                                }}
                                                className="text-muted-foreground hover:text-destructive transition-colors"
                                                title="Remove"
                                            >
                                                <Info size={14} className="rotate-45" />
                                            </button>
                                        </div>
                                        <span className="text-base font-bold text-foreground">{b.name}</span>
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50">
                        {/* Provider */}
                        <tr>
                            <td className="p-6 text-sm font-medium text-muted-foreground bg-muted/5">Provider</td>
                            {compareBundles.map((b) => (
                                <td key={b.id} className="p-6 text-center text-sm font-semibold text-foreground">
                                    {b.providerName}
                                </td>
                            ))}
                        </tr>

                        {/* Category */}
                        <tr>
                            <td className="p-6 text-sm font-medium text-muted-foreground bg-muted/5">Category</td>
                            {compareBundles.map((b) => (
                                <td key={b.id} className="p-6 text-center">
                                    <span className="bg-secondary text-secondary-foreground text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
                                        {b.category}
                                    </span>
                                </td>
                            ))}
                        </tr>

                        {/* Price */}
                        <tr>
                            <td className="p-6 text-sm font-medium text-muted-foreground bg-muted/5">
                                <div className="flex items-center gap-2">
                                    <BadgePercent size={16} className="text-teal-600" />
                                    Price
                                </div>
                            </td>
                            {compareBundles.map((b) => (
                                <td key={b.id} className={cn(
                                    "p-6 text-center transition-colors",
                                    b.price === bestPrice && "bg-teal-500/5"
                                )}>
                                    <span className={cn(
                                        "text-sm font-bold",
                                        b.price === bestPrice ? "text-teal-700" : "text-foreground"
                                    )}>
                                        ${b.price.toFixed(2)}
                                    </span>
                                </td>
                            ))}
                        </tr>

                        {/* Data Volume */}
                        <tr>
                            <td className="p-6 text-sm font-medium text-muted-foreground bg-muted/5">
                                <div className="flex items-center gap-2">
                                    <Zap size={16} className="text-teal-600" />
                                    Data Volume
                                </div>
                            </td>
                            {compareBundles.map((b) => (
                                <td key={b.id} className={cn(
                                    "p-6 text-center transition-colors",
                                    b.dataGB === highestData && "bg-teal-500/5"
                                )}>
                                    <span className={cn(
                                        "text-sm font-bold",
                                        b.dataGB === highestData ? "text-teal-700" : "text-foreground"
                                    )}>
                                        {b.dataGB >= 1 ? `${b.dataGB}GB` : `${b.dataGB * 1000}MB`}
                                    </span>
                                </td>
                            ))}
                        </tr>

                        {/* Validity */}
                        <tr>
                            <td className="p-6 text-sm font-medium text-muted-foreground bg-muted/5">
                                <div className="flex items-center gap-2">
                                    <Clock size={16} className="text-teal-600" />
                                    Validity
                                </div>
                            </td>
                            {compareBundles.map((b) => (
                                <td key={b.id} className={cn(
                                    "p-6 text-center transition-colors",
                                    b.validityDays === bestValidity && "bg-teal-500/5"
                                )}>
                                    <span className="text-sm font-medium">{b.validityDays} day{b.validityDays !== 1 ? 's' : ''}</span>
                                </td>
                            ))}
                        </tr>

                        {/* Cost per GB */}
                        <tr>
                            <td className="p-6 text-sm font-medium text-muted-foreground bg-muted/5">
                                <div className="flex items-center gap-2">
                                    <TrendingUp size={16} className="text-teal-600" />
                                    Cost per GB
                                </div>
                            </td>
                            {compareBundles.map((b) => (
                                <td key={b.id} className={cn(
                                    "p-6 text-center transition-colors",
                                    b.costPerGB === bestCostPerGB && "bg-teal-500/5"
                                )}>
                                    <span className={cn(
                                        "inline-block px-3 py-1 rounded-full text-sm font-bold",
                                        b.costPerGB === bestCostPerGB ? "bg-teal-500/20 text-teal-700 border border-teal-500/30" : "bg-secondary text-foreground"
                                    )}>
                                        ${b.costPerGB.toFixed(2)}
                                    </span>
                                </td>
                            ))}
                        </tr>

                        {/* Speed Class */}
                        <tr>
                            <td className="p-6 text-sm font-medium text-muted-foreground bg-muted/5">Speed Class</td>
                            {compareBundles.map((b) => (
                                <td key={b.id} className="p-6 text-center text-xs font-medium text-foreground">
                                    {b.speedClass}
                                </td>
                            ))}
                        </tr>

                        {/* FUP / Notes */}
                        <tr>
                            <td className="p-6 text-sm font-medium text-muted-foreground bg-muted/5 align-top">FUP / Limitations</td>
                            {compareBundles.map((b) => (
                                <td key={b.id} className="p-6">
                                    <p className="text-[10px] text-muted-foreground italic text-center leading-tight">
                                        {b.fupNote || "No specific limit notes"}
                                    </p>
                                </td>
                            ))}
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* AI Recommendations Panel */}
            <div className="space-y-6">
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-teal-600/10 rounded-lg text-teal-600">
                        <TrendingUp size={24} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold">AI Recommendations</h2>
                        <p className="text-sm text-muted-foreground">Smart choice based on usage patterns</p>
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    {/* Best Value */}
                    <div className="bg-gradient-to-br from-teal-500/10 to-background border border-teal-500/20 rounded-2xl p-6 shadow-xl shadow-teal-500/5 relative overflow-hidden group hover:scale-[1.02] transition-transform">
                        <div className="absolute top-0 right-0 p-4 text-teal-500/10 rotate-12 group-hover:rotate-0 transition-transform">
                            <Star size={64} />
                        </div>
                        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-700 text-[10px] font-bold uppercase tracking-wider mb-4">
                            Best Value
                        </div>
                        <h3 className="text-lg font-bold mb-1">{recommendations.value.item.providerName}</h3>
                        <p className="text-xs text-muted-foreground mb-4">{recommendations.value.item.name}</p>
                        <ul className="space-y-2 mb-6">
                            {recommendations.value.reasoning.map((r, i) => (
                                <li key={i} className="flex items-start gap-2 text-xs text-foreground/80">
                                    <CheckCircle2 size={12} className="text-teal-600 mt-0.5" />
                                    {r}
                                </li>
                            ))}
                        </ul>
                        <p className="text-[10px] text-teal-700 font-bold flex items-center gap-1 border-t border-teal-500/10 pt-4">
                            <Zap size={12} />
                            Good for: {recommendations.value.goodFor}
                        </p>
                    </div>

                    {/* Best for Heavy Usage */}
                    <div className="bg-background border border-border rounded-2xl p-6 shadow-lg shadow-black/5 hover:border-teal-500/30 transition-all group">
                        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 text-[10px] font-bold uppercase tracking-wider mb-4">
                            Heavy Usage
                        </div>
                        <h3 className="text-lg font-bold mb-1">{recommendations.heavy.item.providerName}</h3>
                        <p className="text-xs text-muted-foreground mb-4">{recommendations.heavy.item.name}</p>
                        <ul className="space-y-2 mb-6">
                            {recommendations.heavy.reasoning.map((r, i) => (
                                <li key={i} className="flex items-start gap-2 text-xs text-foreground/80">
                                    <CheckCircle2 size={12} className="text-blue-500 mt-0.5" />
                                    {r}
                                </li>
                            ))}
                        </ul>
                        <p className="text-[10px] text-blue-600 font-bold flex items-center gap-1 border-t border-border pt-4">
                            <Target size={12} />
                            Good for: {recommendations.heavy.goodFor}
                        </p>
                    </div>

                    {/* Best for Short Term */}
                    <div className="bg-background border border-border rounded-2xl p-6 shadow-lg shadow-black/5 hover:border-orange-500/30 transition-all group">
                        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-600 text-[10px] font-bold uppercase tracking-wider mb-4">
                            Short Term
                        </div>
                        <h3 className="text-lg font-bold mb-1">{recommendations.shortTerm.item.providerName}</h3>
                        <p className="text-xs text-muted-foreground mb-4">{recommendations.shortTerm.item.name}</p>
                        <ul className="space-y-2 mb-6">
                            {recommendations.shortTerm.reasoning.map((r, i) => (
                                <li key={i} className="flex items-start gap-2 text-xs text-foreground/80">
                                    <CheckCircle2 size={12} className="text-orange-500 mt-0.5" />
                                    {r}
                                </li>
                            ))}
                        </ul>
                        <p className="text-[10px] text-orange-600 font-bold flex items-center gap-1 border-t border-border pt-4">
                            <Smartphone size={12} />
                            Good for: {recommendations.shortTerm.goodFor}
                        </p>
                    </div>
                </div>
            </div>

            {/* Smart Summary + Insights */}
            <div className="grid md:grid-cols-2 gap-8 pt-6 border-t border-border">
                <div className="space-y-4">
                    <h3 className="font-bold flex items-center gap-2">
                        <Lightbulb size={18} className="text-amber-500" />
                        Key Differences & Trade-offs
                    </h3>
                    <div className="space-y-3">
                        <div className="p-4 bg-secondary/30 rounded-xl">
                            <ul className="space-y-2">
                                <li className="text-sm text-foreground/80 flex items-start gap-2">
                                    <span className="text-teal-600">•</span>
                                    Cost per GB ranges from ${bestCostPerGB.toFixed(2)} to ${Math.max(...compareBundles.map(b => b.costPerGB)).toFixed(2)}, a significant difference in long-term value.
                                </li>
                                <li className="text-sm text-foreground/80 flex items-start gap-2">
                                    <span className="text-teal-600">•</span>
                                    Validity periods vary from 1 day to {bestValidity} days, affecting how quickly you must consume the data.
                                </li>
                                <li className="text-sm text-foreground/80 flex items-start gap-2">
                                    <span className="text-teal-600">•</span>
                                    Speed classes range from {compareBundles.some(b => b.speedClass.includes('Fibre')) ? 'Fibre-optics' : 'MNO Mobile Data'}, with vastly different reliability.
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="font-bold flex items-center gap-2">
                        <Target size={18} className="text-teal-600" />
                        What to choose if...
                    </h3>
                    <div className="grid gap-3">
                        <div className="p-4 border border-border rounded-xl hover:border-teal-600/30 transition-colors">
                            <h4 className="text-sm font-bold text-foreground mb-1">...you want the cheapest per GB</h4>
                            <p className="text-xs text-muted-foreground">Go with <strong>{recommendations.value.item.name}</strong> at ${recommendations.value.item.costPerGB.toFixed(2)}/GB.</p>
                        </div>
                        <div className="p-4 border border-border rounded-xl hover:border-teal-600/30 transition-colors">
                            <h4 className="text-sm font-bold text-foreground mb-1">...you need WhatsApp/Social only</h4>
                            <p className="text-xs text-muted-foreground">Look for bundles in the <strong>Social</strong> category for highly optimized app-specific pricing.</p>
                        </div>
                        <div className="p-4 border border-border rounded-xl hover:border-teal-600/30 transition-colors">
                            <h4 className="text-sm font-bold text-foreground mb-1">...you download heavily at night</h4>
                            <p className="text-xs text-muted-foreground">Check the <strong>Night</strong> category for the absolute lowest pricing (off-peak hours).</p>
                        </div>
                    </div>
                </div>
            </div>

            <Disclaimer />
        </div>
    )
}

export default function DataBundleComparePage() {
    return (
        <div className="max-w-6xl mx-auto py-12 px-4 text-foreground bg-background min-h-screen">
            <Suspense fallback={<div className="flex items-center justify-center py-20 text-muted-foreground">Loading bundle comparison...</div>}>
                <DataBundleCompareContent />
            </Suspense>
        </div>
    )
}
