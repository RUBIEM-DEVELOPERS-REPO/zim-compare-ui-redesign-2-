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
import { SwitchSaveSimulator } from "@/components/dashboard/switch-save-simulator"

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
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
                <div>
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-[10px] font-black text-muted-foreground hover:text-primary uppercase tracking-[0.2em] transition-all mb-6 group"
                    >
                        <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                        Back to Utility Index
                    </button>
                    <h1 className="text-5xl font-display font-black text-foreground tracking-tighter uppercase leading-tight">
                        Neural {subcategory} Analysis
                    </h1>
                    <p className="text-sm text-muted-foreground mt-2 font-medium font-sans opacity-70">
                        Synthesizing side-by-side performance metrics for {compareItems.length} distribution networks.
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
            <div className="overflow-x-auto glass-floating shadow-2xl teal-glow border-white/5">
                <table className="w-full text-left border-collapse min-w-[600px]">
                    <thead>
                        <tr className="border-b border-white/10 bg-white/5">
                            <th className="p-8 text-[10px] font-black uppercase tracking-[0.3em] text-primary/70 w-1/4">Supply Vector</th>
                            {compareItems.map((item: any) => (
                                <th key={item.id} className="p-8">
                                    <div className="flex flex-col">
                                        <div className="flex items-center justify-between mb-4">
                                            <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">{item.type || subcategory}</span>
                                            <button
                                                onClick={() => {
                                                    const newIds = ids.filter(i => i !== item.id)
                                                    router.push(`?ids=${newIds.join(",")}`)
                                                }}
                                                className="text-muted-foreground hover:text-destructive transition-colors p-1.5 rounded-lg hover:bg-destructive/10"
                                                title="Remove Entity"
                                            >
                                                <Info size={14} className="rotate-45" />
                                            </button>
                                        </div>
                                        <span className="text-xl font-display font-black text-foreground uppercase tracking-tight leading-none">{item.name}</span>
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
            <div className="glass-floating p-10 bg-primary/5 border-primary/20 shadow-2xl teal-glow relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-12 text-primary/5 -rotate-12 group-hover:rotate-0 transition-transform duration-1000">
                    <TrendingUp size={160} />
                </div>
                <div className="flex items-center gap-4 mb-10">
                    <div className="p-3 glass-floating bg-primary/10 text-primary teal-glow">
                        <TrendingUp size={28} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-display font-black text-foreground uppercase tracking-tight">Neural Supply Mapping</h2>
                        <p className="text-sm text-muted-foreground font-medium opacity-60">Probabilistic value assessment based on historical telemetry</p>
                    </div>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 relative z-10">
                    <div className="space-y-6">
                        <div className="glass-floating bg-white/5 p-6 border-white/10 hover:border-primary/40 transition-all duration-500 group/item">
                            <h3 className="text-lg font-display font-black text-foreground uppercase tracking-tight mb-3 flex items-center gap-3">
                                <Star size={18} className="text-primary" />
                                Optimal Fiscal Logic
                            </h3>
                            <p className="text-xs text-foreground/70 font-medium font-sans leading-relaxed">
                                Based on current {subcategory} rates, <strong className="text-white font-black">{compareItems.sort((a:any, b:any) => (a.monthlyPrice || a.tariffPerKwh) - (b.monthlyPrice || b.tariffPerKwh))[0]?.name}</strong> optimizes fiscal liquidity for basic consumption tiers.
                            </p>
                        </div>
                    </div>
                    <div className="space-y-6">
                        <div className="glass-floating bg-white/5 p-6 border-white/10 hover:border-primary/40 transition-all duration-500 group/item">
                            <h3 className="text-lg font-display font-black text-foreground uppercase tracking-tight mb-3 flex items-center gap-3">
                                <Zap size={18} className="text-primary" />
                                Signal Reliability
                            </h3>
                            <p className="text-xs text-foreground/70 font-medium font-sans leading-relaxed">
                                <strong className="text-white font-black">{compareItems.sort((a:any, b:any) => (b.reliabilityScore || 0) - (a.reliabilityScore || 0))[0]?.name}</strong> leads the network in supply integrity metrics according to recent diagnostic data.
                            </p>
                        </div>
                    </div>

                    {/* Switch & Save Simulator */}
                    <SwitchSaveSimulator
                        category="utilities"
                        current={compareItems[0]}
                        recommended={compareItems.sort((a:any, b:any) => (a.monthlyPrice || a.tariffPerKwh) - (b.monthlyPrice || b.tariffPerKwh))[0]}
                    />

                    {/* Subscription Action */}
                    <div className="glass-floating p-6 shadow-2xl border-primary/20 bg-primary/5 hover:bg-primary/10 transition-all duration-500 group relative overflow-hidden flex flex-col teal-glow">
                        <div className="absolute -bottom-4 -right-4 p-4 text-primary/10 group-hover:scale-110 transition-transform duration-700">
                             <Icon size={120} />
                        </div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-primary text-primary-foreground text-[10px] font-black uppercase tracking-[0.2em] mb-4 shadow-lg">
                            Instant Access
                        </div>
                        <h3 className="text-lg font-display font-black text-foreground uppercase tracking-tight leading-none mb-1">Subscription</h3>
                        {(() => {
                            const optimal = compareItems.sort((a:any, b:any) => (a.monthlyPrice || a.tariffPerKwh) - (b.monthlyPrice || b.tariffPerKwh))[0]
                            return (
                                <>
                                    <p className="text-[10px] font-black text-primary uppercase tracking-[0.1em] mb-6 opacity-80">
                                        {optimal.name}
                                    </p>
                                    <div className="flex-1 mb-8">
                                        <p className="text-[10px] text-muted-foreground font-medium leading-relaxed italic">
                                            Initialize service delivery from {optimal.name}. Cognitive validation successful.
                                        </p>
                                    </div>
                                </>
                            )
                        })()}
                        
                        <button className="w-full bg-primary py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-primary-foreground hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-primary/30 relative z-10">
                            Subscribe / Get Service
                        </button>
                    </div>
                </div>
            </div>

            <Disclaimer />
        </div>
    )
}

function LayoutDashboard({ size, className }: { size: number, className?: string }) {
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
