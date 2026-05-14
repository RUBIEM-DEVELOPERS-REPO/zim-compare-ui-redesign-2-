"use client"

import { useAppStore } from "@/lib/store"
import { cn } from "@/lib/utils"
import { X, ShieldCheck } from "lucide-react"
import { ScoreBadge } from "@/components/score-badge"
import { Policy } from "@/lib/types"

interface InsuranceComparisonTableProps {
    selectedPolicies: Policy[]
    insuranceProviders: any[]
    onRemove: (id: string) => void
}

export function InsuranceComparisonTable({ selectedPolicies, insuranceProviders, onRemove }: InsuranceComparisonTableProps) {
    const lowestPremium = Math.min(...selectedPolicies.map(p => p.monthlyPremium))
    const lowestExcess = Math.min(...selectedPolicies.map(p => p.excess))
    const lowestCoPay = Math.min(...selectedPolicies.map(p => p.coPay ?? 0))
    const lowestOOP = Math.min(...selectedPolicies.map(p => p.outOfPocketLimit ?? 0))
    const highestCover = Math.max(...selectedPolicies.map(p => p.coverLimit))

    const getProvider = (pid: string) => insuranceProviders.find(pr => pr.id === pid)

    return (
        <div className="overflow-x-auto glass-floating shadow-2xl teal-glow border-border/50 rounded-[2.5rem]">
            <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                    <tr className="border-b border-border/30 bg-secondary/50">
                        <th className="p-8 text-[10px] font-medium uppercase tracking-[0.3em] text-primary/70 w-1/5 sticky left-0 bg-[#0A0A0A] z-10 transition-colors backdrop-blur-3xl">Risk Vector</th>
                        {selectedPolicies.map((p) => (
                            <th key={p.id} className="p-8 text-center border-l border-white/5">
                                <div className="relative flex flex-col items-center gap-4">
                                    <button
                                        onClick={() => onRemove(p.id)}
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
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {/* Section: Core Cost Comparison */}
                    <tr className="bg-primary/5">
                        <td colSpan={selectedPolicies.length + 1} className="p-4 px-8 text-[10px] font-bold text-primary uppercase tracking-[0.4em]">1. Core Cost Comparison</td>
                    </tr>
                    <tr className="hover:bg-secondary/30 transition-colors">
                        <td className="p-8 text-[10px] font-medium text-muted-foreground uppercase tracking-[0.2em] sticky left-0 bg-[#0A0A0A]/80 backdrop-blur-3xl z-10">Monthly Premium</td>
                        {selectedPolicies.map((p) => (
                            <td key={p.id} className="p-8 text-center border-l border-white/5">
                                <span className={cn(
                                    "text-lg font-black",
                                    p.monthlyPremium === lowestPremium ? "text-emerald-500 teal-glow" : "text-foreground"
                                )}>
                                    ${p.monthlyPremium}
                                </span>
                                {p.monthlyPremium === lowestPremium && <p className="text-[9px] font-bold text-emerald-500 uppercase tracking-tighter mt-1 opacity-70">Best Entry Point</p>}
                            </td>
                        ))}
                    </tr>
                    <tr className="hover:bg-secondary/30 transition-colors">
                        <td className="p-8 text-[10px] font-medium text-muted-foreground uppercase tracking-[0.2em] sticky left-0 bg-[#0A0A0A]/80 backdrop-blur-3xl z-10">Deductibles & Excess</td>
                        {selectedPolicies.map((p) => (
                            <td key={p.id} className="p-8 text-center border-l border-white/5">
                                <span className={cn(
                                    "text-sm font-bold",
                                    p.excess === lowestExcess ? "text-emerald-500" : "text-foreground"
                                )}>
                                    ${p.excess}
                                </span>
                                {p.excess === lowestExcess && <p className="text-[9px] font-bold text-emerald-500 uppercase tracking-tighter mt-1 opacity-70">Min Friction</p>}
                            </td>
                        ))}
                    </tr>
                    <tr className="hover:bg-secondary/30 transition-colors">
                        <td className="p-8 text-[10px] font-medium text-muted-foreground uppercase tracking-[0.2em] sticky left-0 bg-[#0A0A0A]/80 backdrop-blur-3xl z-10">Co-pays</td>
                        {selectedPolicies.map((p) => (
                            <td key={p.id} className="p-8 text-center border-l border-white/5">
                                <span className={cn(
                                    "text-sm font-bold",
                                    (p.coPay ?? 0) === lowestCoPay ? "text-emerald-500" : "text-foreground"
                                )}>
                                    {p.coPay ?? 0}%
                                </span>
                            </td>
                        ))}
                    </tr>
                    <tr className="hover:bg-secondary/30 transition-colors">
                        <td className="p-8 text-[10px] font-medium text-muted-foreground uppercase tracking-[0.2em] sticky left-0 bg-[#0A0A0A]/80 backdrop-blur-3xl z-10">Out-of-Pocket Limits</td>
                        {selectedPolicies.map((p) => (
                            <td key={p.id} className="p-8 text-center border-l border-white/5">
                                <span className={cn(
                                    "text-sm font-bold",
                                    (p.outOfPocketLimit ?? 0) === lowestOOP ? "text-emerald-500" : "text-foreground"
                                )}>
                                    ${(p.outOfPocketLimit ?? 0).toLocaleString()}
                                </span>
                            </td>
                        ))}
                    </tr>

                    {/* Section: Coverage Analysis */}
                    <tr className="bg-primary/5">
                        <td colSpan={selectedPolicies.length + 1} className="p-4 px-8 text-[10px] font-bold text-primary uppercase tracking-[0.4em]">2. Coverage Analysis</td>
                    </tr>
                    <tr className="hover:bg-secondary/30 transition-colors">
                        <td className="p-8 text-[10px] font-medium text-muted-foreground uppercase tracking-[0.2em] sticky left-0 bg-[#0A0A0A]/80 backdrop-blur-3xl z-10">Coverage Breadth</td>
                        {selectedPolicies.map((p) => (
                            <td key={p.id} className="p-8 border-l border-white/5">
                                <div className="flex flex-wrap justify-center gap-2">
                                    {p.benefits.map((b: string) => (
                                        <span key={b} className="text-[9px] font-medium uppercase tracking-widest bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-lg border border-emerald-500/20 shadow-inner">
                                            {b}
                                        </span>
                                    ))}
                                </div>
                            </td>
                        ))}
                    </tr>
                    <tr className="hover:bg-secondary/30 transition-colors">
                        <td className="p-8 text-[10px] font-medium text-muted-foreground uppercase tracking-[0.2em] sticky left-0 bg-[#0A0A0A]/80 backdrop-blur-3xl z-10">Coverage Limits</td>
                        {selectedPolicies.map((p) => (
                            <td key={p.id} className="p-8 text-center border-l border-white/5">
                                <div className={cn(
                                    "flex flex-col",
                                    p.coverLimit === highestCover ? "text-primary" : "text-foreground"
                                )}>
                                    <span className="text-lg font-black">${p.coverLimit.toLocaleString()}</span>
                                    {p.coverLimit === highestCover && <span className="text-[9px] font-bold uppercase tracking-tighter opacity-70">Max Shield</span>}
                                </div>
                            </td>
                        ))}
                    </tr>
                    <tr className="hover:bg-secondary/30 transition-colors">
                        <td className="p-8 text-[10px] font-medium text-muted-foreground uppercase tracking-[0.2em] sticky left-0 bg-[#0A0A0A]/80 backdrop-blur-3xl z-10">Exclusions & Waiting</td>
                        {selectedPolicies.map((p) => (
                            <td key={p.id} className="p-8 border-l border-white/5">
                                <div className="flex flex-col items-center gap-4">
                                    <div className="flex flex-wrap justify-center gap-1.5">
                                        {p.exclusions.map((e: string) => (
                                            <span key={e} className="text-[8px] font-medium uppercase tracking-widest bg-red-500/10 text-red-400 px-2 py-0.5 rounded-md border border-red-500/20 shadow-inner">
                                                {e}
                                            </span>
                                        ))}
                                    </div>
                                    <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest">{p.waitingPeriodDays} Days Latency</span>
                                </div>
                            </td>
                        ))}
                    </tr>
                    <tr className="hover:bg-secondary/30 transition-colors">
                        <td className="p-8 text-[10px] font-medium text-muted-foreground uppercase tracking-[0.2em] sticky left-0 bg-[#0A0A0A]/80 backdrop-blur-3xl z-10">Claim Confidence</td>
                        {selectedPolicies.map((p) => {
                            const provider = getProvider(p.providerId)
                            return (
                                <td key={p.id} className="p-8 text-center border-l border-white/5">
                                    <div className="flex flex-col items-center gap-2">
                                        <ScoreBadge score={provider?.claimsScore || 0} label="" />
                                        <span className="text-[9px] text-muted-foreground uppercase tracking-widest opacity-50">Avg {provider?.avgClaimDays}d</span>
                                    </div>
                                </td>
                            )
                        })}
                    </tr>
                </tbody>
            </table>
        </div>
    )
}
