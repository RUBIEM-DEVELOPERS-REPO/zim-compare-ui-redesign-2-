"use client"

import { useSearchParams, useRouter, useParams } from "next/navigation"
import { dataBundles, voiceRates, telecomProviders } from "@/lib/mock/telecoms"
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
    Smartphone,
    Phone,
    MessageSquare
} from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

function TelecomCompareContent() {
    const searchParams = useSearchParams()
    const params = useParams()
    const router = useRouter()
    const ids = searchParams.get("ids")?.split(",") ?? []
    const subcategory = (params.subcategory as string) || "data"
    const { addSavedComparison, clearCompareTray } = useAppStore()

    useEffect(() => {
        clearCompareTray()
    }, [clearCompareTray])

    const compareItems = useMemo(() => {
        if (subcategory === "data") {
            return dataBundles.filter((b) => ids.includes(b.id))
        } else if (subcategory === "voice") {
            return voiceRates.filter((r) => ids.includes(r.id))
        } else {
            // For other categories, we might be comparing providers themselves
            return telecomProviders.filter((p) => ids.includes(p.id))
        }
    }, [ids, subcategory])

    if (compareItems.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="p-4 bg-secondary/50 rounded-full mb-6">
                    {subcategory === "data" ? <Wifi size={48} className="text-muted-foreground" /> : <Phone size={48} className="text-muted-foreground" />}
                </div>
                <h2 className="text-xl font-bold text-foreground mb-2">No items selected to compare</h2>
                <p className="text-muted-foreground mb-8 max-w-xs">
                    Please select at least 2 items to see a side-by-side comparison and AI insights.
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

    // Specialized Logic for Data
    const isData = subcategory === "data"
    const isVoice = subcategory === "voice"

    // Recommendation Logic
    const recommendations = useMemo(() => {
        if (isData) {
            const bundles = compareItems as any[]
            const bestValue = [...bundles].sort((a, b) => a.costPerGB - b.costPerGB)[0]
            const heavyUsage = [...bundles].sort((a, b) => b.dataGB - a.dataGB)[0]
            const shortTerm = [...bundles].sort((a, b) => {
                const priority = { daily: 1, night: 1, social: 1, weekly: 2, monthly: 3, unlimited: 4 } as any
                const pA = priority[a.category] || 5
                const pB = priority[b.category] || 5
                if (pA !== pB) return pA - pB
                return a.price - b.price
            })[0]

            return {
                primary: {
                    label: "Best Value",
                    item: bestValue,
                    reasoning: [`Lowest cost at $${bestValue.costPerGB.toFixed(2)} per GB`, "Ideal for bulk downloads", "Maximizes budget"],
                    goodFor: "Streaming & Downloads"
                },
                secondary: {
                    label: "Heavy Usage",
                    item: heavyUsage,
                    reasoning: [`Largest volume: ${heavyUsage.dataGB}GB`, "FUP protection included", "Reduces top-up frequency"],
                    goodFor: "Remote Work"
                },
                tertiary: {
                    label: "Short Term",
                    item: shortTerm,
                    reasoning: ["Optimized for quick needs", "Lowest entry price", "Perfect for emergencies"],
                    goodFor: "Quick Updates"
                }
            }
        } else if (isVoice) {
            const rates = compareItems as any[]
            const bestOnNet = [...rates].sort((a, b) => a.ratePerMin - b.ratePerMin)[0]
            const bestSMS = [...rates].sort((a, b) => a.smsRate - b.smsRate)[0]
            
            return {
                primary: {
                    label: "Best for Calls",
                    item: bestOnNet,
                    reasoning: [`Competitive $${bestOnNet.ratePerMin}/min rate`, "Lowest on-net calling costs", "Perfect for long conversations"],
                    goodFor: "Frequent Callers"
                },
                secondary: {
                    label: "Best for SMS",
                    item: bestSMS,
                    reasoning: [`Only $${bestSMS.smsRate} per message`, "Industry leading SMS rates", "Great for text-heavy users"],
                    goodFor: "Texting"
                },
                tertiary: {
                    label: "Balanced Choice",
                    item: rates[0],
                    reasoning: ["Reliable network coverage", "Transparent billing cycles", "Good all-rounder"],
                    goodFor: "General Use"
                }
            }
        } else {
            const providers = compareItems as any[]
            const bestCoverage = [...providers].sort((a, b) => b.coverageScore - a.coverageScore)[0]
            const bestDigital = [...providers].sort((a, b) => b.digitalScore - a.digitalScore)[0]

            return {
                primary: {
                    label: "Best Coverage",
                    item: bestCoverage,
                    reasoning: [`Highest score: ${bestCoverage.coverageScore}%`, "Wider reach in rural areas", "More consistent signal"],
                    goodFor: "Reliability"
                },
                secondary: {
                    label: "Digital Leader",
                    item: bestDigital,
                    reasoning: [`Digital score: ${bestDigital.digitalScore}%`, "Best app experience", "Modern self-service tools"],
                    goodFor: "Convenience"
                },
                tertiary: {
                    label: "Transparent Choice",
                    item: providers[0],
                    reasoning: ["Clear terms and conditions", "No hidden fees", "Fair usage policies"],
                    goodFor: "Trust"
                }
            }
        }
    }, [compareItems, isData, isVoice])

    const handleSave = () => {
        addSavedComparison({
            id: Math.random().toString(36).substr(2, 9),
            category: "telecom",
            itemIds: ids,
            createdAt: new Date().toISOString(),
            name: `${subcategory.charAt(0).toUpperCase() + subcategory.slice(1)} Comparison: ${compareItems.map((b: any) => b.name || b.providerName).join(" vs ")}`
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
                            {compareItems.map((item: any) => (
                                <th key={item.id} className="p-6">
                                    <div className="flex flex-col">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-[10px] font-bold text-teal-600 uppercase tracking-tighter">{item.providerName || item.name}</span>
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
                        {isData ? (
                            <>
                                <tr>
                                    <td className="p-6 text-sm font-medium text-muted-foreground bg-muted/5">Price</td>
                                    {compareItems.map((b: any) => (
                                        <td key={b.id} className="p-6 text-center text-sm font-bold text-foreground">${b.price.toFixed(2)}</td>
                                    ))}
                                </tr>
                                <tr>
                                    <td className="p-6 text-sm font-medium text-muted-foreground bg-muted/5">Data Volume</td>
                                    {compareItems.map((b: any) => (
                                        <td key={b.id} className="p-6 text-center text-sm font-bold text-foreground">{b.dataGB >= 1 ? `${b.dataGB}GB` : `${b.dataGB * 1000}MB`}</td>
                                    ))}
                                </tr>
                                <tr>
                                    <td className="p-6 text-sm font-medium text-muted-foreground bg-muted/5">Cost per GB</td>
                                    {compareItems.map((b: any) => (
                                        <td key={b.id} className="p-6 text-center text-sm font-bold text-teal-600">${b.costPerGB.toFixed(2)}</td>
                                    ))}
                                </tr>
                                <tr>
                                    <td className="p-6 text-sm font-medium text-muted-foreground bg-muted/5">Validity</td>
                                    {compareItems.map((b: any) => (
                                        <td key={b.id} className="p-6 text-center text-sm text-foreground">{b.validityDays} days</td>
                                    ))}
                                </tr>
                            </>
                        ) : isVoice ? (
                            <>
                                <tr>
                                    <td className="p-6 text-sm font-medium text-muted-foreground bg-muted/5">Rate per Min</td>
                                    {compareItems.map((r: any) => (
                                        <td key={r.id} className="p-6 text-center text-sm font-bold text-foreground">${r.ratePerMin.toFixed(3)}</td>
                                    ))}
                                </tr>
                                <tr>
                                    <td className="p-6 text-sm font-medium text-muted-foreground bg-muted/5">SMS Rate</td>
                                    {compareItems.map((r: any) => (
                                        <td key={r.id} className="p-6 text-center text-sm font-bold text-teal-600">${r.smsRate.toFixed(3)}</td>
                                    ))}
                                </tr>
                                <tr>
                                    <td className="p-6 text-sm font-medium text-muted-foreground bg-muted/5">Type</td>
                                    {compareItems.map((r: any) => (
                                        <td key={r.id} className="p-6 text-center text-xs font-bold uppercase text-foreground">{r.type.replace('_', ' ')}</td>
                                    ))}
                                </tr>
                            </>
                        ) : (
                            <>
                                <tr>
                                    <td className="p-6 text-sm font-medium text-muted-foreground bg-muted/5">Network Type</td>
                                    {compareItems.map((p: any) => (
                                        <td key={p.id} className="p-6 text-center text-sm font-bold text-foreground">{p.networkType || 'N/A'}</td>
                                    ))}
                                </tr>
                                <tr>
                                    <td className="p-6 text-sm font-medium text-muted-foreground bg-muted/5">Coverage Score</td>
                                    {compareItems.map((p: any) => (
                                        <td key={p.id} className="p-6 text-center text-sm font-bold text-teal-600">{p.coverageScore || '0'}%</td>
                                    ))}
                                </tr>
                                <tr>
                                    <td className="p-6 text-sm font-medium text-muted-foreground bg-muted/5">Digital Score</td>
                                    {compareItems.map((p: any) => (
                                        <td key={p.id} className="p-6 text-center text-sm font-bold text-foreground">{p.digitalScore || '0'}%</td>
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
                    <div className="p-2 bg-teal-600/10 rounded-lg text-teal-600">
                        <TrendingUp size={24} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold">AI Recommendations</h2>
                        <p className="text-sm text-muted-foreground">Smart choice based on usage patterns</p>
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    {/* Primary */}
                    <div className="bg-gradient-to-br from-teal-500/10 to-background border border-teal-500/20 rounded-2xl p-6 shadow-xl shadow-teal-500/5 relative overflow-hidden group hover:scale-[1.02] transition-transform">
                        <div className="absolute top-0 right-0 p-4 text-teal-500/10 rotate-12 group-hover:rotate-0 transition-transform">
                            <Star size={64} />
                        </div>
                        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-700 text-[10px] font-bold uppercase tracking-wider mb-4">
                            {recommendations.primary.label}
                        </div>
                        <h3 className="text-lg font-bold mb-1">{recommendations.primary.item.providerName || recommendations.primary.item.name}</h3>
                        <p className="text-xs text-muted-foreground mb-4">{recommendations.primary.item.name}</p>
                        <ul className="space-y-2 mb-6">
                            {recommendations.primary.reasoning.map((r, i) => (
                                <li key={i} className="flex items-start gap-2 text-xs text-foreground/80">
                                    <CheckCircle2 size={12} className="text-teal-600 mt-0.5" />
                                    {r}
                                </li>
                            ))}
                        </ul>
                        <p className="text-[10px] text-teal-700 font-bold flex items-center gap-1 border-t border-teal-500/10 pt-4">
                            <Zap size={12} />
                            Good for: {recommendations.primary.goodFor}
                        </p>
                    </div>

                    {/* Secondary */}
                    <div className="bg-background border border-border rounded-2xl p-6 shadow-lg shadow-black/5 hover:border-teal-500/30 transition-all group">
                        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 text-[10px] font-bold uppercase tracking-wider mb-4">
                            {recommendations.secondary.label}
                        </div>
                        <h3 className="text-lg font-bold mb-1">{recommendations.secondary.item.providerName || recommendations.secondary.item.name}</h3>
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
                        <h3 className="text-lg font-bold mb-1">{recommendations.tertiary.item.providerName || recommendations.tertiary.item.name}</h3>
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

export default function TelecomComparePage() {
    return (
        <div className="max-w-6xl mx-auto py-12 px-4 text-foreground bg-background min-h-screen">
            <Suspense fallback={<div className="flex items-center justify-center py-20 text-muted-foreground">Loading comparison...</div>}>
                <TelecomCompareContent />
            </Suspense>
        </div>
    )
}
