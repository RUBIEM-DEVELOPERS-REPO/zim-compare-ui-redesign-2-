"use client"

import * as React from "react"
import { Sparkles, TrendingUp, Info, CheckCircle2, ChevronRight, Zap } from "lucide-react"
import { cn } from "@/lib/utils"
import { AnalysisResult } from "@/lib/neural-engine"

interface NeuralAnalysisPanelProps {
    result: AnalysisResult | null
    isLoading?: boolean
    className?: string
}

export function NeuralAnalysisPanel({ result, isLoading, className }: NeuralAnalysisPanelProps) {
    if (!result && !isLoading) return null

    return (
        <div className={cn(
            "mt-4 p-6 rounded-[2rem] glass-floating border border-primary/20 shadow-2xl animate-in fade-in slide-in-from-top-4 duration-700 overflow-hidden relative group",
            className
        )}>
            {/* Background Effects */}
            <div className="absolute top-0 right-0 p-8 text-primary/5 -rotate-12 group-hover:rotate-0 transition-transform duration-1000">
                <Zap size={120} />
            </div>
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse" />

            <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                    <div className="bg-primary/20 p-2 rounded-xl border border-primary/30 shadow-inner teal-glow">
                        <Sparkles className="w-5 h-5 text-primary animate-pulse" strokeWidth={3} />
                    </div>
                    <div>
                        <h3 className="text-sm font-display font-bold text-white uppercase tracking-[0.2em] leading-none">
                            Neural Intelligence Report
                        </h3>
                        <p className="text-[9px] font-medium text-primary/60 uppercase tracking-[0.2em] mt-1 opacity-70">
                            Deep analysis of provided parameters
                        </p>
                    </div>
                </div>

                {isLoading ? (
                    <div className="space-y-4 py-4">
                        <div className="h-4 bg-white/5 rounded-full w-3/4 animate-pulse" />
                        <div className="h-4 bg-white/5 rounded-full w-1/2 animate-pulse" />
                        <div className="h-20 bg-white/5 rounded-2xl w-full animate-pulse" />
                    </div>
                ) : result ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Left Side: Analysis & Comparison */}
                        <div className="space-y-6">
                            <div>
                                <div className="flex items-center gap-2 mb-3 text-primary">
                                    <Info size={14} strokeWidth={3} />
                                    <span className="text-[10px] font-bold uppercase tracking-widest">Neural Analysis</span>
                                </div>
                                <p className="text-xs text-muted-foreground leading-relaxed font-medium uppercase tracking-tight opacity-80">
                                    {result.analysis}
                                </p>
                            </div>

                            <div>
                                <div className="flex items-center gap-2 mb-3 text-primary">
                                    <TrendingUp size={14} strokeWidth={3} />
                                    <span className="text-[10px] font-bold uppercase tracking-widest">Comparative Signals</span>
                                </div>
                                <div className="space-y-2">
                                    {result.comparison.map((item, idx) => (
                                        <div key={idx} className="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/5 group/item hover:bg-white/10 transition-colors">
                                            <div className="w-1 h-1 rounded-full bg-primary/40" />
                                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest group-hover/item:text-foreground transition-colors">{item}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Right Side: Recommendation */}
                        <div className="glass-floating bg-primary/5 border-primary/20 p-6 rounded-[1.5rem] flex flex-col justify-between teal-glow border shadow-2xl">
                            <div>
                                <div className="flex items-center gap-2 mb-6">
                                    <div className="bg-primary px-3 py-1 rounded-lg text-[8px] font-black text-white uppercase tracking-[0.2em] shadow-lg teal-glow">
                                        Neural Pick
                                    </div>
                                </div>
                                
                                <div className="mb-6">
                                    <span className="text-[9px] font-bold text-primary/60 uppercase tracking-[0.2em] mb-1 block">Best Protocol Option</span>
                                    <h4 className="text-2xl font-display font-bold text-white uppercase tracking-tight leading-tight">
                                        {result.bestOption}
                                    </h4>
                                    <p className="text-[11px] font-bold text-primary mt-1 uppercase tracking-widest opacity-80 italic">
                                        {result.recommendation}
                                    </p>
                                </div>

                                <div className="pt-6 border-t border-primary/20">
                                    <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-2 block">Reasoning Logic</span>
                                    <p className="text-[11px] font-medium text-muted-foreground leading-relaxed uppercase tracking-widest opacity-70 italic">
                                        "{result.reason}"
                                    </p>
                                </div>
                            </div>

                            <button className="mt-8 w-full py-4 bg-primary text-primary-foreground rounded-xl text-[10px] font-bold uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-2 shadow-2xl teal-glow hover:scale-[1.02] active:scale-95 group/btn">
                                Execute Recommendation
                                <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" strokeWidth={3} />
                            </button>
                        </div>
                    </div>
                ) : null}
            </div>
        </div>
    )
}
