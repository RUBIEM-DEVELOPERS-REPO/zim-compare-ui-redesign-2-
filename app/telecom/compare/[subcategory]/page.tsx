"use client"

import { useSearchParams, useRouter, useParams } from "next/navigation"
import { dataBundles, voiceRates, telecomProviders } from "@/lib/mock/telecoms"
import type { DataBundle, VoiceRate, TelecomProvider } from "@/lib/types"
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
    MessageSquare,
    X
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
        const cleanIds = ids.map(id => id.trim()).filter(Boolean);
        
        // Always search all sources to be safe, especially for 'overview' or 'internet'
        const allItems = [
            ...dataBundles,
            ...voiceRates,
            ...telecomProviders
        ];
        
        const filtered = allItems.filter(item => cleanIds.includes(item.id));
        return filtered;
    }, [ids])

    if (compareItems.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="p-4 bg-secondary/50 rounded-full mb-6">
                    <Wifi size={48} className="text-muted-foreground" />
                </div>
                <h2 className="text-xl font-bold text-foreground mb-2">
                    {ids.length > 0 ? "Telecom nodes not found" : "No items selected to compare"}
                </h2>
                <p className="text-muted-foreground mb-8 max-w-xs">
                    {ids.length > 0 
                        ? "The specific items selected could not be found. They may have been updated in the neural cache."
                        : "Please select at least 2 items to see a side-by-side comparison and AI insights."}
                </p>
                <Link
                    href="/telecom"
                    className="bg-primary text-primary-foreground px-6 py-2.5 rounded-xl font-bold hover:scale-105 transition-transform flex items-center gap-2"
                >
                    <ArrowLeft size={16} />
                    Go back to Telecoms
                </Link>
            </div>
        )
    }

    // Recommendation Logic - Highly Resilient
    const recommendations = useMemo(() => {
        const items = compareItems;
        
        // Helper to get a safe value for sorting
        const getScore = (item: any, key: string) => (item[key] || 0);

        // Best Overall (highest average of available scores or lowest price)
        const bestValue = [...items].sort((a: any, b: any) => {
            if (a.costPerGB && b.costPerGB) return a.costPerGB - b.costPerGB;
            if (a.ratePerMin && b.ratePerMin) return a.ratePerMin - b.ratePerMin;
            const scoreA = getScore(a, 'coverageScore') + getScore(a, 'digitalScore') + getScore(a, 'transparencyScore');
            const scoreB = getScore(b, 'coverageScore') + getScore(b, 'digitalScore') + getScore(b, 'transparencyScore');
            return scoreB - scoreA;
        })[0];

        // Innovation Leader (Digital Score)
        const techLeader = [...items].sort((a: any, b: any) => getScore(b, 'digitalScore') - getScore(a, 'digitalScore'))[0];

        // Reach Leader (Coverage)
        const reachLeader = [...items].sort((a: any, b: any) => getScore(b, 'coverageScore') - getScore(a, 'coverageScore'))[0];

        const getName = (item: any) => item.providerName || item.name || "Unknown Node";

        return {
            primary: {
                label: "Neural Leader",
                item: bestValue,
                reasoning: [
                    (bestValue as any).costPerGB ? `Optimized cost: $${(bestValue as any).costPerGB.toFixed(2)}/GB` : `Superior Network Efficiency`,
                    (bestValue as any).coverageScore ? `Coverage verified at ${(bestValue as any).coverageScore}%` : "Stable connection tier",
                    "Lowest latency in recent benchmarks"
                ],
                goodFor: (bestValue as any).dataGB ? "High Volume Usage" : "Reliable Connectivity"
            },
            secondary: {
                label: "Digital Edge",
                item: techLeader,
                reasoning: [
                    `Digital Score: ${(techLeader as any).digitalScore || 80}%`,
                    "Best self-service experience",
                    "Advanced neural app features"
                ],
                goodFor: "Tech-Savvy Users"
            },
            tertiary: {
                label: "Network Reach",
                item: reachLeader,
                reasoning: [
                    `Coverage Score: ${(reachLeader as any).coverageScore || 75}%`,
                    "Wide rural penetration",
                    "Consistent signal strength"
                ],
                goodFor: "Maximum Reliability"
            }
        };
    }, [compareItems])

    const handleSave = () => {
        addSavedComparison({
            id: Math.random().toString(36).substr(2, 9),
            category: "telecom",
            itemIds: ids,
            createdAt: new Date().toISOString(),
            name: `${subcategory.charAt(0).toUpperCase() + subcategory.slice(1)} Comparison: ${compareItems.map((b: any) => (b as any).name || (b as any).providerName).join(" vs ")}`
        })
        router.push("/dashboard")
    }

    // Dynamic Row Helper
    const ComparisonRow = ({ label, attr, formatter }: { label: string, attr: string, formatter?: (val: any) => React.ReactNode }) => {
        const hasData = compareItems.some((item: any) => item[attr] !== undefined && item[attr] !== null);
        if (!hasData) return null;

        return (
            <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
                <td className="p-6 text-sm font-medium text-muted-foreground bg-white/2">{label}</td>
                {compareItems.map((item: any) => (
                    <td key={item.id} className="p-6 text-center text-sm font-bold text-foreground">
                        {item[attr] !== undefined ? (formatter ? formatter(item[attr]) : item[attr]) : "—"}
                    </td>
                ))}
            </tr>
        );
    };

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
                    <h1 className="text-5xl font-display font-black text-foreground capitalize tracking-tight mb-2">
                        {subcategory} Intelligence
                    </h1>
                    <p className="text-muted-foreground mt-2 font-sans opacity-70">
                        Comparing {compareItems.length} neural nodes side-by-side
                    </p>
                </div>
                <button
                    onClick={handleSave}
                    className="bg-primary text-primary-foreground hover:scale-110 px-8 py-3 rounded-[1.25rem] text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-2xl teal-glow"
                >
                    Save Comparison Cache
                </button>
            </div>

            {/* Comparison Table */}
            <div className="overflow-x-auto glass-anti-gravity">
                <table className="w-full text-left border-collapse min-w-[800px]">
                    <thead>
                        <tr className="border-b border-white/10 bg-white/5">
                            <th className="p-6 text-[10px] font-black uppercase tracking-[0.3em] text-teal-400/60 w-1/4">Neural Metric</th>
                            {compareItems.map((item: any) => (
                                <th key={item.id} className="p-8">
                                    <div className="flex flex-col">
                                        <div className="flex items-center justify-between mb-3">
                                            <span className="text-[10px] font-black text-teal-400 uppercase tracking-[0.2em]">{item.providerName || "MNO Provider"}</span>
                                            <button
                                                onClick={() => {
                                                    const newIds = ids.filter(i => i !== item.id)
                                                    router.push(`?ids=${newIds.join(",")}`)
                                                }}
                                                className="p-1.5 rounded-lg text-muted-foreground hover:bg-red-500/10 hover:text-red-400 transition-all"
                                                title="Remove"
                                            >
                                                <X size={14} />
                                            </button>
                                        </div>
                                        <span className="text-xl font-display font-black text-white">{item.name || item.type?.replace('_', ' ')}</span>
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        <ComparisonRow label="Price / Monthly Cost" attr="price" formatter={(v) => `$${v.toFixed(2)}`} />
                        <ComparisonRow label="Data Volume" attr="dataGB" formatter={(v) => v >= 1 ? `${v}GB` : `${v * 1000}MB`} />
                        <ComparisonRow label="Cost per GB" attr="costPerGB" formatter={(v) => <span className="text-teal-400">${v.toFixed(2)}</span>} />
                        <ComparisonRow label="Voice Rate (/min)" attr="ratePerMin" formatter={(v) => `$${v.toFixed(3)}`} />
                        <ComparisonRow label="SMS Rate" attr="smsRate" formatter={(v) => `$${v.toFixed(3)}`} />
                        <ComparisonRow label="Network Generation" attr="networkType" />
                        <ComparisonRow label="Coverage Score" attr="coverageScore" formatter={(v) => <span className="text-teal-400 font-black">{v}%</span>} />
                        <ComparisonRow label="Digital Efficiency" attr="digitalScore" formatter={(v) => `${v}%`} />
                        <ComparisonRow label="Neural Transparency" attr="transparencyScore" formatter={(v) => `${v}%`} />
                        <ComparisonRow label="Validity Period" attr="validityDays" formatter={(v) => `${v} Days`} />
                    </tbody>
                </table>
            </div>

            {/* AI Recommendations Panel */}
            <div className="space-y-8">
                <div className="flex items-center gap-4 mb-2">
                    <div className="p-3 bg-teal-500/10 rounded-2xl text-teal-400 border border-teal-500/20">
                        <TrendingUp size={28} />
                    </div>
                    <div>
                        <h2 className="text-3xl font-display font-black uppercase tracking-tight text-white">Neural Analysis</h2>
                        <p className="text-[10px] text-teal-400/60 font-black uppercase tracking-[0.2em] mt-1">AI-driven selection matrix</p>
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    {[recommendations.primary, recommendations.secondary, recommendations.tertiary].map((rec, i) => (
                        <div 
                            key={i} 
                            className={cn(
                                "p-8 relative overflow-hidden group transition-all duration-500 glass-anti-gravity",
                                i === 0 ? "border-teal-500/30 bg-teal-500/5 shadow-[0_0_30px_rgba(20,184,166,0.1)]" : ""
                            )}
                        >
                            <div className="absolute top-0 right-0 p-6 text-teal-400/5 rotate-12 group-hover:rotate-0 transition-all duration-700">
                                {i === 0 ? <Star size={80} fill="currentColor" /> : i === 1 ? <Lightbulb size={80} /> : <Target size={80} />}
                            </div>
                            
                            <div className={cn(
                                "inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-6",
                                i === 0 ? "bg-teal-500/20 text-teal-400" : "bg-white/5 text-white/50"
                            )}>
                                {rec.label}
                            </div>
                            
                            <h3 className="text-2xl font-display font-black text-white mb-1">
                                {(rec.item as any).providerName || (rec.item as any).name}
                            </h3>
                            <p className="text-[10px] text-teal-400/60 font-black uppercase tracking-widest mb-6">
                                {(rec.item as any).name || (rec.item as any).type}
                            </p>
                            
                            <ul className="space-y-4 mb-8">
                                {rec.reasoning.map((r, idx) => (
                                    <li key={idx} className="flex items-start gap-3 text-[13px] text-white/70 font-medium">
                                        <CheckCircle2 size={16} className="text-teal-400 mt-0.5 shrink-0" />
                                        {r}
                                    </li>
                                ))}
                            </ul>
                            
                            <div className="text-[10px] text-teal-400 font-black uppercase tracking-widest flex items-center gap-2 border-t border-white/5 pt-6">
                                <Zap size={14} className="animate-pulse" />
                                Optimization: {rec.goodFor}
                            </div>
                        </div>
                    ))}
                </div>
                
                {/* Instant Action Card */}
                <div className="glass-anti-gravity p-10 border-teal-500/30 bg-teal-500/5 flex flex-col md:flex-row items-center justify-between gap-8 group">
                    <div className="max-w-2xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-teal-500 text-white text-[10px] font-black uppercase tracking-[0.2em] mb-6">
                            Recommended Action
                        </div>
                        <h3 className="text-3xl font-display font-black text-white uppercase tracking-tight mb-4">Deploy Optimal Configuration</h3>
                        <p className="text-sm text-white/60 font-medium leading-relaxed">
                            Our neural engine has identified <span className="text-teal-400">{(recommendations.primary.item as any).providerName || (recommendations.primary.item as any).name}</span> as the superior choice for your current requirements. This selection maximizes cost efficiency while maintaining peak network reach.
                        </p>
                    </div>
                    
                    <button className="whitespace-nowrap px-10 py-5 bg-teal-500 hover:bg-teal-400 text-white rounded-2xl text-xs font-black uppercase tracking-[0.3em] transition-all shadow-[0_10px_30px_rgba(20,184,166,0.3)] hover:scale-[1.02] active:scale-95 group-hover:shadow-[0_15px_40px_rgba(20,184,166,0.5)]">
                        Activate Plan Now
                    </button>
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
