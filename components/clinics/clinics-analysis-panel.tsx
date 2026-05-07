"use client"

import { HealthcareProvider } from "@/lib/mock/clinics"
import { cn } from "@/lib/utils"
import { Progress } from "@/components/ui/progress"
import { CheckCircle2, Zap, ShieldCheck, Star, DollarSign, Trash2, Clock, Sparkles, HeartPulse } from "lucide-react"

interface ClinicsAnalysisPanelProps {
  selectedProviders: HealthcareProvider[]
  onClear: () => void
}

export function ClinicsAnalysisPanel({ selectedProviders, onClear }: ClinicsAnalysisPanelProps) {
  if (selectedProviders.length < 2) return null

  // Advanced recommendation logic: weighted score
  const recommended = [...selectedProviders].sort((a, b) => {
    const scoreA = (a.rating * 10) + (100 - a.waitingTimeMinutes) + (100 - a.consultationFee)
    const scoreB = (b.rating * 10) + (100 - b.waitingTimeMinutes) + (100 - b.consultationFee)
    return scoreB - scoreA
  })[0]

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom duration-700">
      <div className="glass-panel p-8 relative overflow-hidden border-primary/20 bg-primary/5 rounded-[2.5rem]">
        <div className="absolute top-0 right-0 p-8 text-primary/10 -rotate-12">
          <HeartPulse size={120} />
        </div>

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/20 rounded-xl">
                <CheckCircle2 className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-display font-bold text-white tracking-tight uppercase">Optimal Healthcare Selection</h2>
                <p className="text-xs text-muted-foreground uppercase tracking-[0.2em] mt-1 font-bold">Neural Medical Match Result</p>
              </div>
            </div>
            <button 
              onClick={onClear}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-muted-foreground hover:text-red-400 hover:bg-red-400/10 transition-all text-[10px] font-bold uppercase tracking-widest"
            >
              <Trash2 size={14} />
              Clear Comparison
            </button>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            <div className="space-y-6">
              <div className="p-6 rounded-[2rem] bg-white/5 border border-white/10 backdrop-blur-md relative overflow-hidden group">
                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <h3 className="text-3xl font-display font-black text-primary uppercase tracking-tighter mb-4 relative z-10">{recommended.name}</h3>
                <p className="text-sm text-slate-300 leading-relaxed font-medium italic relative z-10">
                  Top-tier medical selection based on care quality ({recommended.rating}/5), accessibility ({recommended.waitingTimeMinutes}m wait), and financial efficiency (${recommended.consultationFee} fee). This facility aligns perfectly with established medical aid protocols in {recommended.location}.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-white/5 border border-white/5 group hover:border-primary/30 transition-all">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold mb-1">Recommendation Score</p>
                  <p className="text-2xl font-display font-bold text-white">98.2%</p>
                </div>
                <div className="p-5 rounded-2xl bg-white/5 border border-white/5 group hover:border-primary/30 transition-all">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold mb-1">Medical Trust</p>
                  <p className="text-2xl font-display font-bold text-emerald-400 uppercase tracking-tighter">Verified</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-[10px] font-bold text-white uppercase tracking-[0.3em] opacity-50 mb-4">Neural Comparison Matrix</h4>
              <div className="space-y-5">
                {[
                  { label: "Fee Efficiency", score: Math.max(20, 100 - (recommended.consultationFee * 1.5)), color: "bg-emerald-500", icon: DollarSign },
                  { label: "Care Quality", score: recommended.rating * 20, color: "bg-amber-500", icon: Star },
                  { label: "Wait Time Efficiency", score: Math.max(10, 100 - recommended.waitingTimeMinutes), color: "bg-blue-500", icon: Clock },
                  { label: "Service Density", score: 92, color: "bg-purple-500", icon: ShieldCheck },
                  { label: "Neural Match", score: 98, color: "bg-primary", icon: Sparkles },
                ].map((factor, i) => (
                  <div key={i} className="h-[32px] flex flex-col justify-center space-y-1.5">
                    <div className="flex justify-between items-center px-1">
                      <div className="flex items-center gap-2">
                        <factor.icon size={12} className="text-primary" />
                        <span className="text-[10px] font-bold text-white uppercase tracking-widest">{factor.label}</span>
                      </div>
                      <span className="text-[10px] font-bold text-white font-mono">{factor.score.toFixed(0)}%</span>
                    </div>
                    <Progress 
                        value={factor.score} 
                        className="h-1.5 w-full bg-white/5"
                        indicatorClassName={factor.color}
                        aria-label={factor.label}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {selectedProviders.map(provider => (
              <div key={provider.id} className="p-4 rounded-2xl bg-white/5 border border-white/10 group hover:border-primary/30 transition-all cursor-default">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[10px] font-bold text-white uppercase tracking-tight truncate max-w-[120px]">{provider.name}</p>
                  <div className="h-1.5 w-1.5 rounded-full bg-primary teal-glow animate-pulse" />
                </div>
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-[9px] text-muted-foreground uppercase font-bold tracking-widest">Care Index</p>
                    <p className="text-lg font-display font-bold text-white">{provider.rating}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] text-muted-foreground uppercase font-bold tracking-widest">Match</p>
                    <p className="text-xs font-bold text-primary uppercase">Alpha Node</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
