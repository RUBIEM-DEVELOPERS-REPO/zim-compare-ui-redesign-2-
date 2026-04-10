"use client"

import { useSearchParams, useRouter, useParams } from "next/navigation"
import { 
    electricityProviders, 
    waterProviders, 
    internetProviders, 
    subscriptionServices 
} from "@/lib/mock/utilities"
import { useAppStore } from "@/lib/store"
import { useI18n } from "@/lib/i18n"
import { Disclaimer } from "@/components/disclaimer"
import { Suspense, useMemo, useEffect } from "react"
import {
    ArrowLeft,
    CheckCircle2,
    ChevronLeft,
    Star,
    Info,
    TrendingUp,
    Zap,
    Droplets,
    Wifi,
    CreditCard
} from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

function UtilitiesCompareContent() {
    const searchParams = useSearchParams()
    const params = useParams()
    const router = useRouter()
    const ids = searchParams.get("ids")?.split(",") ?? []
    const subcategory = (params.subcategory as string) || "electricity"
    const { addSavedComparison, clearCompareTray } = useAppStore()
    const { t } = useI18n()

    useEffect(() => {
        clearCompareTray()
    }, [clearCompareTray])

    const compareItems = useMemo(() => {
        if (subcategory === "electricity") {
            return electricityProviders.filter((p) => ids.includes(p.id))
        } else if (subcategory === "water") {
            return waterProviders.filter((w) => ids.includes(w.id))
        } else if (subcategory === "internet") {
            return internetProviders.filter((i) => ids.includes(i.id))
        } else if (subcategory === "subscriptions") {
            return subscriptionServices.filter((s) => ids.includes(s.id))
        } else {
            return []
        }
    }, [ids, subcategory])

    const Icon = useMemo(() => {
        switch (subcategory) {
            case "electricity": return Zap
            case "water": return Droplets
            case "internet": return Wifi
            case "subscriptions": return CreditCard
            default: return LayoutDashboard
        }
    }, [subcategory])

    if (compareItems.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="p-4 bg-amber-500/10 rounded-full mb-6">
                    <Icon size={48} className="text-amber-600" />
                </div>
                <h2 className="text-xl font-bold text-foreground mb-2">No items selected to compare</h2>
                <p className="text-muted-foreground mb-8 max-w-xs">
                    Please select at least 2 items to see a side-by-side comparison.
                </p>
                <Link
                    href="/utilities"
                    className="bg-amber-500 text-white px-6 py-2.5 rounded-xl font-bold hover:scale-105 transition-transform flex items-center gap-2"
                >
                    <ArrowLeft size={16} />
                    Go back to Utilities
                </Link>
            </div>
        )
    }

    const handleSave = () => {
        addSavedComparison({
            id: Math.random().toString(36).substr(2, 9),
            category: "utilities",
            itemIds: ids,
            createdAt: new Date().toISOString(),
            name: `${subcategory.charAt(0).toUpperCase() + subcategory.slice(1)} Comparison: ${compareItems.map((item: any) => item.name).join(" vs ")}`
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
                        Side-by-side analysis of {compareItems.length} {subcategory} options
                    </p>
                </div>
                <button
                    onClick={handleSave}
                    className="bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 px-5 py-2.5 rounded-xl text-sm font-bold transition-all border border-amber-500/20 shadow-lg shadow-amber-500/5"
                >
                    Save this comparison
                </button>
            </div>

            {/* Comparison Table */}
            <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-xl shadow-amber-500/5 backdrop-blur-sm">
                <table className="w-full text-left border-collapse min-w-[600px]">
                    <thead>
                        <tr className="border-b border-border bg-muted/20">
                            <th className="p-6 text-xs font-bold uppercase tracking-widest text-muted-foreground w-1/4">Metric</th>
                            {compareItems.map((item: any) => (
                                <th key={item.id} className="p-6">
                                    <div className="flex flex-col">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-[10px] font-bold text-amber-600 uppercase tracking-tighter">{item.type || subcategory}</span>
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
                        {subcategory === "electricity" ? (
                            <>
                                <tr>
                                    <td className="p-6 text-sm font-medium text-muted-foreground bg-muted/5">Tariff per kWh</td>
                                    {compareItems.map((p: any) => (
                                        <td key={p.id} className="p-6 text-center text-sm font-bold text-foreground">${p.tariffPerKwh}</td>
                                    ))}
                                </tr>
                                <tr>
                                    <td className="p-6 text-sm font-medium text-muted-foreground bg-muted/5">Monthly Fixed Charge</td>
                                    {compareItems.map((p: any) => (
                                        <td key={p.id} className="p-6 text-center text-sm font-bold text-amber-600">${p.fixedMonthlyCharge}</td>
                                    ))}
                                </tr>
                                <tr>
                                    <td className="p-6 text-sm font-medium text-muted-foreground bg-muted/5">Reliability Score</td>
                                    {compareItems.map((p: any) => (
                                        <td key={p.id} className="p-6 text-center text-sm text-foreground">{p.reliabilityScore}/100</td>
                                    ))}
                                </tr>
                            </>
                        ) : subcategory === "water" ? (
                            <>
                                <tr>
                                    <td className="p-6 text-sm font-medium text-muted-foreground bg-muted/5">Cost per m³</td>
                                    {compareItems.map((w: any) => (
                                        <td key={w.id} className="p-6 text-center text-sm font-bold text-foreground">${w.costPerCubicMeter}</td>
                                    ))}
                                </tr>
                                <tr>
                                    <td className="p-6 text-sm font-medium text-muted-foreground bg-muted/5">Fixed Charge</td>
                                    {compareItems.map((w: any) => (
                                        <td key={w.id} className="p-6 text-center text-sm font-bold text-amber-600">${w.monthlyFixedCharge}</td>
                                    ))}
                                </tr>
                            </>
                        ) : subcategory === "internet" ? (
                            <>
                                <tr>
                                    <td className="p-6 text-sm font-medium text-muted-foreground bg-muted/5">Monthly Price</td>
                                    {compareItems.map((i: any) => (
                                        <td key={i.id} className="p-6 text-center text-sm font-bold text-amber-600">${i.monthlyPrice}</td>
                                    ))}
                                </tr>
                                <tr>
                                    <td className="p-6 text-sm font-medium text-muted-foreground bg-muted/5">Speed</td>
                                    {compareItems.map((i: any) => (
                                        <td key={i.id} className="p-6 text-center text-sm font-bold text-foreground">{i.speedMbps}Mbps</td>
                                    ))}
                                </tr>
                                <tr>
                                    <td className="p-6 text-sm font-medium text-muted-foreground bg-muted/5">Installation Fee</td>
                                    {compareItems.map((i: any) => (
                                        <td key={i.id} className="p-6 text-center text-sm text-foreground">${i.installationFee}</td>
                                    ))}
                                </tr>
                            </>
                        ) : (
                            <>
                                <tr>
                                    <td className="p-6 text-sm font-medium text-muted-foreground bg-muted/5">Monthly Price</td>
                                    {compareItems.map((s: any) => (
                                        <td key={s.id} className="p-6 text-center text-sm font-bold text-amber-600">${s.monthlyPrice}</td>
                                    ))}
                                </tr>
                                <tr>
                                    <td className="p-6 text-sm font-medium text-muted-foreground bg-muted/5">Annual Total</td>
                                    {compareItems.map((s: any) => (
                                        <td key={s.id} className="p-6 text-center text-sm text-foreground">${s.annualPrice}</td>
                                    ))}
                                </tr>
                            </>
                        )}
                        <tr>
                            <td className="p-6 text-sm font-medium text-muted-foreground bg-muted/5">Key Features</td>
                            {compareItems.map((item: any) => (
                                <td key={item.id} className="p-6">
                                    <ul className="space-y-1">
                                        {item.features.slice(0, 3).map((f: string, idx: number) => (
                                            <li key={idx} className="text-[10px] flex items-center gap-1.5 text-foreground/70">
                                                <CheckCircle2 size={10} className="text-amber-500" />
                                                {f}
                                            </li>
                                        ))}
                                    </ul>
                                </td>
                            ))}
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* AI Insights placeholder matching Banking style */}
            <div className="bg-amber-500/5 border border-amber-500/20 rounded-2xl p-8 relative overflow-hidden backdrop-blur-md">
                <div className="absolute top-0 right-0 p-8 text-amber-500/10 rotate-12">
                    <TrendingUp size={120} />
                </div>
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-amber-500/20 rounded-xl text-amber-600">
                        <TrendingUp size={24} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold">Smart Analysis</h2>
                        <p className="text-sm text-muted-foreground">Automated value assessment for {subcategory}</p>
                    </div>
                </div>
                <div className="grid md:grid-cols-2 gap-8 relative z-10">
                    <div className="space-y-4">
                        <div className="bg-background/50 rounded-xl p-5 border border-border">
                            <h3 className="font-bold mb-2 flex items-center gap-2">
                                <Star size={16} className="text-amber-500" />
                                Best Economic Value
                            </h3>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                                Based on current {subcategory} rates, <strong>{compareItems.sort((a:any, b:any) => (a.monthlyPrice || a.tariffPerKwh) - (b.monthlyPrice || b.tariffPerKwh))[0]?.name}</strong> offers the lowest entry cost for basic usage.
                            </p>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div className="bg-background/50 rounded-xl p-5 border border-border">
                            <h3 className="font-bold mb-2 flex items-center gap-2">
                                <Zap size={16} className="text-amber-500" />
                                Reliability Ranking
                            </h3>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                                <strong>{compareItems.sort((a:any, b:any) => (b.reliabilityScore || 0) - (a.reliabilityScore || 0))[0]?.name}</strong> leads in quality and uptime metrics according to recent consumer data.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <Disclaimer />
        </div>
    )
}

function LayoutDashboard({ size, className }: { size: number, className: string }) {
    return <TrendingUp size={size} className={className} />
}

export default function UtilitiesComparePage() {
    return (
        <div className="max-w-6xl mx-auto py-12 px-4 text-foreground bg-background min-h-screen">
            <Suspense fallback={<div className="flex items-center justify-center py-20 text-muted-foreground">Loading comparison...</div>}>
                <UtilitiesCompareContent />
            </Suspense>
        </div>
    )
}
