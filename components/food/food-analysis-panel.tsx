"use client"

import { FoodProvider } from "@/lib/mock/food"
import { cn } from "@/lib/utils"
import { Progress } from "@/components/ui/progress"
import { CheckCircle2, TrendingUp, Zap, ShieldCheck, Clock, DollarSign, Star, Trash2, Sparkles, Utensils } from "lucide-react"

interface FoodAnalysisPanelProps {
  selectedOutlets: FoodProvider[]
  onClear: () => void
}

export function FoodAnalysisPanel({ selectedOutlets, onClear }: FoodAnalysisPanelProps) {
  if (selectedOutlets.length < 2) return null

  // Simple recommendation logic: highest rating
  const recommended = [...selectedOutlets].sort((a, b) => b.rating - a.rating)[0]

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom duration-700">
      <div className="glass-panel p-8 relative overflow-hidden border-primary/20 bg-primary/5">
        <div className="absolute top-0 right-0 p-8 text-primary/10 -rotate-12">
          <Zap size={120} />
        </div>

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/20 rounded-xl">
                <CheckCircle2 className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-display font-bold text-white tracking-tight uppercase">Recommended Fast Food Option</h2>
                <p className="text-xs text-muted-foreground uppercase tracking-[0.2em] mt-1 font-bold">Neural Engine Optimization Result</p>
              </div>
            </div>
            <button 
              onClick={onClear}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-muted-foreground hover:text-red-400 hover:bg-red-400/10 transition-all text-[10px] font-bold uppercase tracking-widest"
            >
              <Trash2 size={14} />
              Clear Comparison
            </button>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            <div className="space-y-6">
              <div className="p-6 rounded-[2rem] bg-white/5 border border-white/10 backdrop-blur-md">
                <h3 className="text-3xl font-display font-black text-primary uppercase tracking-tighter mb-4">{recommended.name}</h3>
                <p className="text-sm text-slate-300 leading-relaxed font-medium italic">
                  Best overall value based on affordability, availability, customer rating, and meal variety. This outlet demonstrates consistent hygiene standards and high popularity across {recommended.location}.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold mb-1">Overall Match %</p>
                  <p className="text-2xl font-display font-bold text-white">98.4%</p>
                </div>
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold mb-1">Neural Trust</p>
                  <p className="text-2xl font-display font-bold text-emerald-400 uppercase tracking-tighter">Certified</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-[10px] font-bold text-white uppercase tracking-[0.3em] opacity-50 mb-4">Comparison Matrix</h4>
              <div className="space-y-4">
                {(recommended.type === "restaurant" ? [
                  { label: "Price Value", score: recommended.avgMealPrice < 25 ? 90 : recommended.avgMealPrice < 35 ? 75 : 60, color: "bg-emerald-500", icon: DollarSign },
                  { label: "Ambience Score", score: recommended.hygieneScore - 2, color: "bg-blue-500", icon: Sparkles },
                  { label: "Service Quality", score: recommended.serviceScore, color: "bg-purple-500", icon: Clock },
                  { label: "Dining Experience", score: Math.min(100, recommended.rating * 15 + recommended.varietyScore * 0.3), color: "bg-teal-500", icon: Utensils },
                  { label: "Overall Match %", score: 99, color: "bg-primary", icon: Star },
                ] : [
                  { label: "Price Score", score: recommended.avgMealPrice < 7 ? 95 : recommended.avgMealPrice < 12 ? 80 : 65, color: "bg-emerald-500", icon: DollarSign },
                  { label: "Popularity Score", score: recommended.popularityScore, color: "bg-blue-500", icon: Zap },
                  { label: "Service Score", score: recommended.serviceScore, color: "bg-purple-500", icon: Clock },
                  { label: "Hygiene Score", score: recommended.hygieneScore, color: "bg-teal-500", icon: ShieldCheck },
                  { label: "Overall Match %", score: 98, color: "bg-primary", icon: Star },
                ]).map((factor, i) => (
                  <div key={i} className="space-y-2">
                    <div className="h-[24px] flex flex-col justify-center space-y-1.5">
                      <div className="flex justify-between items-center px-1">
                        <div className="flex items-center gap-2">
                          <factor.icon size={12} className="text-primary" />
                          <span className="text-[10px] font-bold text-white uppercase tracking-widest">{factor.label}</span>
                        </div>
                        <span className="text-[10px] font-bold text-white font-mono">{factor.score}%</span>
                      </div>
                      <Progress 
                        value={factor.score} 
                        className="h-1.5 w-full bg-white/5"
                        indicatorClassName={factor.color}
                        aria-label={factor.label}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {selectedOutlets.map(outlet => (
              <div key={outlet.id} className="p-4 rounded-2xl bg-white/5 border border-white/10 group hover:border-primary/30 transition-all">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[10px] font-bold text-white uppercase tracking-tight truncate max-w-[120px]">{outlet.name}</p>
                  <div className="h-1.5 w-1.5 rounded-full bg-primary teal-glow animate-pulse" />
                </div>
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-[9px] text-muted-foreground uppercase font-bold tracking-widest">Score</p>
                    <p className="text-lg font-display font-bold text-white">{(outlet.rating * 18.5 + outlet.hygieneScore * 0.1).toFixed(1)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] text-muted-foreground uppercase font-bold tracking-widest">Rank</p>
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
