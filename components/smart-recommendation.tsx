"use client"

import { useState, useEffect } from "react"
import { useAppStore } from "@/lib/store"
import { getBankingRecommendations, type Recommendation } from "@/lib/recommendations"
import { Sparkles, Plus, X, ChevronRight, TrendingUp, DollarSign, Wallet } from "lucide-react"
import { cn } from "@/lib/utils"

export function SmartRecommendation() {
  const { compareTray, addToCompareTray } = useAppStore()
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [isVisible, setIsVisible] = useState(false)
  const [lastProcessedId, setLastProcessedId] = useState<string | null>(null)

  useEffect(() => {
    // Only show for banking products
    if (compareTray.category !== "banking") {
      setIsVisible(false)
      return
    }

    // Trigger recommendations when a new item is added
    if (compareTray.lastAddedId && compareTray.lastAddedId !== lastProcessedId) {
      const recs = getBankingRecommendations(compareTray.lastAddedId, compareTray.ids)
      if (recs.length > 0) {
        setRecommendations(recs)
        setIsVisible(true)
        setLastProcessedId(compareTray.lastAddedId)
      }
    }

    // Hide if compare tray is cleared
    if (compareTray.ids.length === 0) {
      setIsVisible(false)
      setLastProcessedId(null)
    }
  }, [compareTray.lastAddedId, compareTray.ids, compareTray.category, lastProcessedId])

  if (!isVisible || recommendations.length === 0) return null

  return (
    <div className="absolute bottom-full left-0 w-full mb-4 animate-in fade-in slide-in-from-bottom-2 duration-500 pointer-events-auto">
      <div className="glass-floating border border-primary/20 shadow-2xl p-4 overflow-hidden relative group teal-glow">
        {/* Animated background glow */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-primary/10 rounded-full blur-3xl animate-pulse" />

        <div className="flex items-center justify-between mb-6 relative z-10">
          <div className="flex items-center gap-3">
            <div className="bg-primary/20 p-2 rounded-xl border border-primary/30 shadow-inner teal-glow">
              <Sparkles className="w-5 h-5 text-primary animate-pulse" strokeWidth={3} />
            </div>
            <div>
              <h3 className="text-lg font-display font-medium text-white tracking-tight uppercase leading-none">
                Smart Suggestions
              </h3>
              <p className="text-[9px] font-medium text-primary/60 uppercase tracking-widest mt-1 opacity-60">Neural Value Intelligence</p>
            </div>
          </div>
          <button 
            onClick={() => setIsVisible(false)}
            className="p-2 rounded-xl hover:bg-white/5 text-muted-foreground hover:text-white transition-all border border-transparent hover:border-white/10"
            title="Terminate suggestions"
          >
            <X size={16} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 relative z-10">
          {recommendations.map((rec, idx) => (
            <div 
              key={rec.product.id}
              className={cn(
                "group/card relative surface-glass hover:bg-card/20 hover:border-primary/50 rounded-2xl p-4 transition-all duration-500 floating-hover cursor-default",
                "animate-in fade-in slide-in-from-bottom-1",
                idx === 0 ? "delay-0" : idx === 1 ? "delay-75" : "delay-150"
              )}
            >
              <div className="flex flex-col h-full">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex flex-col">
                    <span className="text-[9px] font-medium text-primary uppercase tracking-[0.2em] leading-none mb-1 opacity-80">
                      {rec.product.bankName}
                    </span>
                    <span className="text-lg font-display font-medium text-white leading-tight line-clamp-1 uppercase tracking-tight">
                      {rec.product.name}
                    </span>
                  </div>
                  {idx === 0 && (
                    <div className="bg-primary px-3 py-1 rounded-lg text-[8px] font-medium text-white uppercase tracking-[0.2em] shadow-lg teal-glow animate-bounce">
                      Best Prime Match
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-4 my-4 border-y border-white/5 py-3">
                  <div className="flex flex-col">
                    <span className="text-[8px] text-muted-foreground uppercase font-medium tracking-widest opacity-60 mb-1">Return</span>
                    <span className="text-sm font-display font-medium text-white flex items-center gap-1 tabular-nums">
                      {rec.product.interestRate}% <TrendingUp size={12} className="text-primary teal-glow animate-pulse" />
                    </span>
                  </div>
                  <div className="flex flex-col border-l border-white/10 pl-4">
                    <span className="text-[8px] text-muted-foreground uppercase font-medium tracking-widest opacity-60 mb-1">Protocol Fee</span>
                    <span className="text-sm font-display font-medium text-primary flex items-center gap-1 tabular-nums">
                      ${rec.product.monthlyFee}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-6">
                  <p className="text-[10px] text-primary font-medium uppercase tracking-widest leading-relaxed opacity-80 font-sans italic">
                    "{rec.insight}"
                  </p>
                </div>

                <button
                  onClick={() => addToCompareTray("banking", rec.product.id, rec.product.category)}
                  className="mt-auto w-full py-3 bg-primary/10 hover:bg-primary text-primary hover:text-white border border-primary/20 rounded-xl text-[10px] font-medium uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 shadow-inner group/btn teal-glow hover:scale-[1.02] active:scale-95"
                >
                  <Plus size={14} className="group-hover/btn:rotate-90 transition-transform" strokeWidth={3} />
                  Add to Compare
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

