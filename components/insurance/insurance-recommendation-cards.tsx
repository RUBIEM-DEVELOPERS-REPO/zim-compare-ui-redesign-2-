"use client"

import { Zap, Award, BarChart3, HeartHandshake, ShieldCheck } from "lucide-react"
import { cn } from "@/lib/utils"
import { Policy } from "@/lib/types"

interface InsuranceRecommendationCardsProps {
    scoredPolicies: (Policy & { calculatedScore: number })[]
    lowestCost: Policy
    bestCoverage: Policy
    lowestRisk: Policy
    bestOverall: Policy & { calculatedScore: number }
    onApply: (policy: Policy) => void
    onPay: (policy: Policy) => void
}

export function InsuranceRecommendationCards({ 
    bestOverall, 
    lowestCost, 
    bestCoverage, 
    lowestRisk,
    onApply,
    onPay
}: InsuranceRecommendationCardsProps) {
    return (
        <div className="space-y-10">
            <div className="flex items-center gap-4">
                <div className="p-3 glass-floating bg-primary/10 text-primary teal-glow">
                    <Zap size={28} />
                </div>
                <div>
                    <h2 className="text-2xl font-display font-medium text-foreground uppercase tracking-tight">Recommendation Engine</h2>
                    <p className="text-sm text-muted-foreground font-medium opacity-60">Neural risk/value mapping based on strategic scoring logic</p>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                {/* Best Overall */}
                <div className="glass-floating bg-gradient-to-br from-primary/20 to-transparent border-primary/40 p-8 shadow-2xl teal-glow relative overflow-hidden group hover:scale-[1.03] transition-all duration-500">
                    <div className="absolute -top-4 -right-4 bg-primary text-primary-foreground p-10 rounded-full opacity-5 group-hover:scale-110 transition-transform duration-1000">
                        <Award size={64} />
                    </div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-primary text-primary-foreground text-[10px] font-black uppercase tracking-[0.2em] mb-6 shadow-xl">
                        Best Overall
                    </div>
                    <h3 className="text-xl font-display font-black text-white uppercase tracking-tight leading-none mb-1">{bestOverall.name}</h3>
                    <p className="text-[10px] font-medium text-primary uppercase tracking-[0.1em] mb-6 opacity-70">{bestOverall.providerName}</p>
                    <p className="text-xs text-foreground/90 font-medium leading-relaxed mb-6">
                        Achieved the highest balanced score across all vectors. Offers a superior blend of cost efficiency, coverage breadth, and institutional reliability.
                    </p>
                    <div className="pt-6 border-t border-white/10">
                        <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest">
                            <span className="text-muted-foreground">Neural Score</span>
                            <span className="text-primary">{bestOverall.calculatedScore}%</span>
                        </div>
                    </div>
                </div>

                {/* Lowest Cost */}
                <div className="glass-floating p-8 shadow-xl border-white/5 hover:border-emerald-500/40 transition-all duration-500 group floating-hover">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase tracking-[0.2em] mb-6 border border-emerald-500/20">
                        Lowest Cost
                    </div>
                    <h3 className="text-xl font-display font-black text-white uppercase tracking-tight leading-none mb-1 group-hover:text-emerald-400 transition-colors">{lowestCost.name}</h3>
                    <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-[0.1em] mb-6 opacity-60">{lowestCost.providerName}</p>
                    <p className="text-xs text-foreground/80 font-medium leading-relaxed mb-6">
                        Optimizes monthly liquidity. This policy has the lowest entry threshold of ${lowestCost.monthlyPremium} while maintaining baseline required risk absorption.
                    </p>
                    <div className="pt-6 border-t border-white/5">
                        <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest">
                            <span className="text-muted-foreground">Premium</span>
                            <span className="text-emerald-500">${lowestCost.monthlyPremium}</span>
                        </div>
                    </div>
                </div>

                {/* Best Coverage */}
                <div className="glass-floating p-8 shadow-xl border-white/5 hover:border-primary/40 transition-all duration-500 group floating-hover">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.2em] mb-6 border border-primary/20">
                        Best Coverage
                    </div>
                    <h3 className="text-xl font-display font-black text-white uppercase tracking-tight leading-none mb-1 group-hover:text-primary transition-colors">{bestCoverage.name}</h3>
                    <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-[0.1em] mb-6 opacity-60">{bestCoverage.providerName}</p>
                    <p className="text-xs text-foreground/80 font-medium leading-relaxed mb-6">
                        Maximum risk shield. Boasts the highest coverage limit of ${bestCoverage.coverLimit.toLocaleString()} and the most comprehensive benefits package in your selection.
                    </p>
                    <div className="pt-6 border-t border-white/5">
                        <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest">
                            <span className="text-muted-foreground">Limit</span>
                            <span className="text-primary">${(bestCoverage.coverLimit / 1000).toFixed(0)}k</span>
                        </div>
                    </div>
                </div>

                {/* Lowest Risk Exposure */}
                <div className="glass-floating p-8 shadow-xl border-white/5 hover:border-amber-500/40 transition-all duration-500 group floating-hover">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-amber-500/10 text-amber-500 text-[10px] font-black uppercase tracking-[0.2em] mb-6 border border-amber-500/20">
                        Lowest Risk Exposure
                    </div>
                    <h3 className="text-xl font-display font-black text-white uppercase tracking-tight leading-none mb-1 group-hover:text-amber-400 transition-colors">{lowestRisk.name}</h3>
                    <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-[0.1em] mb-6 opacity-60">{lowestRisk.providerName}</p>
                    <p className="text-xs text-foreground/80 font-medium leading-relaxed mb-6">
                        Minimizes out-of-pocket friction. This contract requires the least amount of personal liquidity during a claim event (Excess + OOP: ${lowestRisk.excess + (lowestRisk.outOfPocketLimit ?? 0)}).
                    </p>
                    <div className="pt-6 border-t border-white/5">
                        <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest">
                            <span className="text-muted-foreground">Self-Risk</span>
                            <span className="text-amber-500">${lowestRisk.excess + (lowestRisk.outOfPocketLimit ?? 0)}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-1">
                <div className="glass-floating p-8 shadow-2xl border-primary/20 bg-primary/5 hover:bg-primary/10 transition-all duration-500 group relative overflow-hidden flex flex-col md:flex-row items-center gap-8 teal-glow">
                    <div className="p-6 rounded-2xl bg-primary/20 text-primary">
                         <ShieldCheck size={48} />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-2xl font-display font-black text-white uppercase tracking-tight leading-none mb-2">Final Neural Recommendation</h3>
                        <p className="text-sm text-muted-foreground font-medium mb-4">
                            Based on your current risk profile and selection, <strong className="text-primary">{bestOverall.providerName}</strong> provides the most resilient configuration.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <button 
                                onClick={() => onApply(bestOverall)}
                                className="bg-primary px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-primary-foreground hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-primary/30"
                            >
                                Apply Now
                            </button>
                            <button 
                                onClick={() => onPay(bestOverall)}
                                className="bg-primary/10 border border-primary/20 px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-primary hover:bg-primary/20 transition-all"
                            >
                                Pay Initial Premium
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
