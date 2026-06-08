"use client"

import { useSearchParams, useRouter, useParams } from "next/navigation"
import type { DataBundle, VoiceRate, TelecomProvider } from "@/lib/types"
import { useAppStore } from "@/lib/store"
import { Disclaimer } from "@/components/disclaimer"
import { Suspense, useMemo, useEffect, useState } from "react"
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
import { 
    getTelecomRecommendations, 
    normalizeTelecomProduct, 
    UserNeed, 
    NormalizedTelecomProduct 
} from "@/lib/telecom-logic"

function TelecomCompareContent() {
    const searchParams = useSearchParams()
    const params = useParams()
    const router = useRouter()
    const ids = searchParams.get("ids")?.split(",") ?? []
    const subcategory = (params.subcategory as string) || "data"
    const { addSavedComparison, clearCompareTray } = useAppStore()

    const [providers, setProviders] = useState<TelecomProvider[]>([])
    const [bundles, setBundles] = useState<DataBundle[]>([])
    const [voiceRates, setVoiceRates] = useState<VoiceRate[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        clearCompareTray()
    }, [clearCompareTray])

    useEffect(() => {
        async function fetchCompareData() {
            try {
                const res = await fetch("/api/telecom")
                if (!res.ok) {
                    throw new Error("Failed to load telecom data")
                }
                const data = await res.json()
                setProviders(data.providers || [])
                setBundles(data.bundles || [])
                setVoiceRates(data.voiceRates || [])
            } catch (err: any) {
                console.error(err)
                setError(err.message || "Failed to fetch comparison data.")
            } finally {
                setLoading(false)
            }
        }
        fetchCompareData()
    }, [])

    const compareItems = useMemo(() => {
        const cleanIds = ids.map(id => id.trim()).filter(Boolean);
        
        // Map database records back to the UI shape
        const mappedBundles = bundles.map((b: any) => ({
            id: b.id,
            providerId: b.operator,
            providerName: b.operator === "tel-econet" ? "Econet" : b.operator === "tel-netone" ? "NetOne" : b.operator === "tel-telecel" ? "Telecel" : "MNO",
            name: b.bundle_name,
            price: b.price,
            dataGB: (b.total_data_mb || 0) / 1024,
            validityDays: b.validity_value || 30,
            category: b.bundle_group,
            unlimited: false
        }))

        const mappedVoiceRates = voiceRates.map((v: any) => ({
            id: v.id,
            providerId: v.operator,
            providerName: v.operator === "tel-econet" ? "Econet" : v.operator === "tel-netone" ? "NetOne" : v.operator === "tel-telecel" ? "Telecel" : "MNO",
            type: v.offer_type || "prepaid",
            ratePerMin: v.price || 0,
            smsRate: v.sms_count || 0,
            validityDays: 30
        }))

        const mappedProviders = providers.map((p: any) => ({
            ...p,
            providerId: p.id,
            providerName: p.name
        }))

        const allItems = [
            ...mappedBundles,
            ...mappedVoiceRates,
            ...mappedProviders
        ];
        
        const filtered = allItems.filter(item => cleanIds.includes(item.id));
        return filtered;
    }, [ids, providers, bundles, voiceRates])

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center bg-background min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4" />
                <p className="text-muted-foreground font-sans">Retrieving verified comparison nodes...</p>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center bg-background min-h-screen">
                <div className="p-4 bg-red-500/10 rounded-full mb-6 text-red-500">
                    <Info size={48} />
                </div>
                <h2 className="text-xl font-bold text-foreground mb-2">Failed to load comparison data. Please try again later.</h2>
                <p className="text-muted-foreground mb-8 max-w-md">{error}</p>
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

    if (compareItems.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center bg-background min-h-screen">
                <div className="p-4 bg-secondary/50 rounded-full mb-6">
                    <Wifi size={48} className="text-muted-foreground" />
                </div>
                <h2 className="text-xl font-bold text-foreground mb-2">No verified data available yet for this category.</h2>
                <p className="text-muted-foreground mb-8 max-w-xs">
                    Please select at least 2 items to see a side-by-side comparison and AI insights.
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

    // ── Telecom Comparison Logic Framework Integration ──
    const { preferences } = useAppStore()
    
    // Map scenario to UserNeed
    const userNeed = useMemo((): UserNeed => {
        const scenario = preferences.scenario || "student"
        return {
            type: subcategory === "voice" ? "voice" : subcategory === "internet" ? "home-internet" : "data",
            usageVolume: scenario === "sme" ? "high" : "medium",
            budget: scenario === "student" ? 5 : 50
        }
    }, [preferences.scenario, subcategory])

    const { recommendations: rankedRecs, excluded } = useMemo(() => {
        return getTelecomRecommendations(compareItems as any, userNeed)
    }, [compareItems, userNeed])

    // Adapt new recommendations to existing UI structure
    const recommendations = useMemo(() => {
        const primary = rankedRecs[0]
        const secondary = rankedRecs[1]
        const tertiary = rankedRecs[2]

        const formatRec = (rec: any, label: string) => {
            if (!rec) return null
            return {
                label,
                item: rec.product,
                score: rec.score,
                reasoning: [
                    rec.matchReason,
                    ...rec.tradeOffs.map((t: string) => `Trade-off: ${t}`),
                    `Confidence: ${rec.confidenceLevel.toUpperCase()}`
                ],
                goodFor: (rec.product.validityDays || rec.product.validityPeriod || "30") + " Days " + (rec.product.productType || "data").replace('-', ' '),
                confidence: rec.confidenceLevel
            }
        }

        return {
            primary: formatRec(primary, "Neural Leader"),
            secondary: formatRec(secondary, "Digital Edge"),
            tertiary: formatRec(tertiary, "Network Reach"),
            all: rankedRecs,
            excluded
        }
    }, [rankedRecs, excluded])

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
    const ComparisonRow = ({ label, attr, formatter, isNormalized = false }: { label: string, attr: string, formatter?: (val: any) => React.ReactNode, isNormalized?: boolean }) => {
        const hasData = compareItems.some((item: any) => {
            const val = isNormalized ? normalizeTelecomProduct(item)[attr as keyof NormalizedTelecomProduct] : item[attr];
            return val !== undefined && val !== null;
        });
        if (!hasData) return null;

        return (
            <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
                <td className="p-6 text-sm font-medium text-muted-foreground bg-white/2">{label}</td>
                {compareItems.map((item: any) => {
                    const normalized = normalizeTelecomProduct(item);
                    const val = isNormalized ? normalized[attr as keyof NormalizedTelecomProduct] : item[attr];
                    return (
                        <td key={item.id} className="p-6 text-center text-sm font-bold text-foreground">
                            {val !== undefined ? (formatter ? formatter(val) : val) : "—"}
                        </td>
                    );
                })}
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
                        <ComparisonRow label="Normalized USD Cost" attr="normalizedPriceUSD" isNormalized formatter={(v) => `$${v.toFixed(2)}`} />
                        <ComparisonRow label="Data Volume" attr="dataGB" formatter={(v) => v >= 1 ? `${v}GB` : `${v * 1000}MB`} />
                        <ComparisonRow label="Cost per GB" attr="costPerGB" formatter={(v) => <span className="text-teal-400">${v.toFixed(2)}</span>} />
                        <ComparisonRow label="Comparison Group" attr="comparisonGroup" isNormalized formatter={(v: string) => <span className="text-[10px] uppercase tracking-widest text-teal-400/80">{v.replace(/-/g, ' ')}</span>} />
                        <ComparisonRow label="Realistic Unit Cost" attr="normalizedUnitCost" isNormalized formatter={(v: number) => <span className="text-teal-400 font-black">${v.toFixed(3)}</span>} />
                        <ComparisonRow label="Voice Rate (/min)" attr="ratePerMin" formatter={(v) => `$${v.toFixed(3)}`} />
                        <ComparisonRow label="SMS Rate" attr="smsRate" formatter={(v) => `$${v.toFixed(3)}`} />
                        <ComparisonRow label="Network Generation" attr="networkType" />
                        <ComparisonRow label="Coverage Score" attr="coverageScore" formatter={(v) => <span className="text-teal-400 font-black">{v}%</span>} />
                        <ComparisonRow label="Reliability Index" attr="reliabilityScore" isNormalized formatter={(v) => `${v}%`} />
                        <ComparisonRow label="Data Confidence" attr="confidenceScore" isNormalized formatter={(v) => `${v}%`} />
                        <ComparisonRow label="Digital Efficiency" attr="digitalScore" formatter={(v) => `${v}%`} />
                        <ComparisonRow label="Neural Transparency" attr="transparencyScore" formatter={(v) => `${v}%`} />
                        <ComparisonRow label="Validity Period" attr="validityDays" formatter={(v) => `${v} Days`} />
                    </tbody>
                </table>
            </div>

            {/* Comparability Warning & Excluded Items */}
            {recommendations.excluded.length > 0 && (
                <div className="p-6 border-2 border-dashed border-red-500/20 bg-red-500/5 rounded-2xl animate-in fade-in slide-in-from-bottom-4">
                    <div className="flex items-center gap-3 mb-4">
                        <X className="w-6 h-6 text-red-400" />
                        <h3 className="text-xl font-display font-black text-white uppercase tracking-tight">Direct Comparison Limited</h3>
                    </div>
                    <p className="text-sm text-white/60 mb-6 max-w-2xl font-medium leading-relaxed">
                        The following items were excluded from the neural ranking because they differ in category, validity, or technology. 
                        Direct side-by-side ranking requires a normalized comparison group.
                    </p>
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {recommendations.excluded.map(({ product, reason }) => (
                            <div key={product.id} className="p-4 bg-white/5 border border-white/10 rounded-xl">
                                <p className="text-[10px] font-black text-red-400 uppercase tracking-widest mb-1">{product.providerName}</p>
                                <p className="text-sm font-bold text-white mb-2">{product.name}</p>
                                <p className="text-[10px] text-white/40 leading-relaxed font-medium">{reason}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

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
                    {([recommendations.primary, recommendations.secondary, recommendations.tertiary].filter((r): r is NonNullable<typeof r> => r !== null)).map((rec, i) => (
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
                                rec.confidence === 'high' ? "bg-teal-500/20 text-teal-400" : rec.confidence === 'medium' ? "bg-yellow-500/20 text-yellow-400" : "bg-red-500/20 text-red-400"
                            )}>
                                {rec.label} &middot; {rec.confidence.toUpperCase()} CONFIDENCE
                            </div>
                            
                            <h3 className="text-2xl font-display font-black text-white mb-1">
                                {rec.item.providerName}
                            </h3>
                            <p className="text-[10px] text-teal-400/60 font-black uppercase tracking-widest mb-6">
                                {rec.item.name} &middot; Score: {rec.score.toFixed(1)}
                            </p>
                            
                            <ul className="space-y-4 mb-8">
                                {rec.reasoning.map((r: string, idx: number) => (
                                    <li key={idx} className="flex items-start gap-3 text-[13px] text-white/70 font-medium">
                                        {r.startsWith('Trade-off') ? (
                                            <Info size={16} className="text-yellow-400 mt-0.5 shrink-0" />
                                        ) : (
                                            <CheckCircle2 size={16} className="text-teal-400 mt-0.5 shrink-0" />
                                        )}
                                        {r}
                                    </li>
                                ))}
                            </ul>
                            
                            <div className="text-[10px] text-teal-400 font-black uppercase tracking-widest flex items-center gap-2 border-t border-white/5 pt-6">
                                <Zap size={14} className="animate-pulse" />
                                Optimal for: {rec.goodFor}
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
                            Our neural engine has identified <span className="text-teal-400">{recommendations.primary?.item.providerName}</span> as the superior choice for your current requirements. 
                            With a realistic unit cost of <span className="text-teal-400">${recommendations.primary?.item.price !== undefined ? (recommendations.primary.item.price / (recommendations.primary.item.dataGB || 1)).toFixed(3) : "0.000"}</span>, this selection maximizes cost efficiency while maintaining peak network reach.
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
