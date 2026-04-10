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
      <div className="bg-background/80 backdrop-blur-3xl border border-primary/20 shadow-2xl rounded-2xl p-4 overflow-hidden relative group">
        {/* Animated background glow */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-primary/10 rounded-full blur-3xl animate-pulse" />

        <div className="flex items-center justify-between mb-4 relative z-10">
          <div className="flex items-center gap-2">
            <div className="bg-primary/20 p-1.5 rounded-lg">
              <Sparkles className="w-4 h-4 text-primary animate-pulse" />
            </div>
            <div>
              <h3 className="text-xs font-black uppercase tracking-tighter text-foreground flex items-center gap-1.5 leading-none">
                Smart Suggestions
                <span className="text-[10px] font-medium text-primary/70 bg-primary/5 px-1.5 py-0.5 rounded-full border border-primary/10 tracking-normal normal-case">AI-Powered</span>
              </h3>
              <p className="text-[10px] text-muted-foreground mt-1">Based on interest rates, fees, and value.</p>
            </div>
          </div>
          <button 
            onClick={() => setIsVisible(false)}
            className="p-1.5 rounded-full hover:bg-secondary/80 text-muted-foreground hover:text-foreground transition-all"
            title="Close recommendations"
          >
            <X size={14} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 relative z-10">
          {recommendations.map((rec, idx) => (
            <div 
              key={rec.product.id}
              className={cn(
                "group/card relative bg-secondary/30 hover:bg-secondary/50 border border-border/50 hover:border-primary/30 rounded-xl p-3 transition-all duration-300 hover:scale-[1.02] cursor-default",
                "animate-in fade-in slide-in-from-bottom-1",
                idx === 0 ? "delay-0" : idx === 1 ? "delay-75" : "delay-150"
              )}
            >
              <div className="flex flex-col h-full">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex flex-col">
                    <span className="text-[9px] font-black text-primary/80 uppercase tracking-tighter leading-none mb-1">
                      {rec.product.bankName}
                    </span>
                    <span className="text-xs font-bold text-foreground leading-tight line-clamp-1">
                      {rec.product.name}
                    </span>
                  </div>
                  {idx === 0 && (
                    <div className="bg-primary px-1.5 py-0.5 rounded text-[8px] font-black text-primary-foreground uppercase tracking-wider animate-bounce">
                      Best Match
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-3 my-2 border-y border-border/10 py-2">
                  <div className="flex flex-col">
                    <span className="text-[8px] text-muted-foreground uppercase font-medium">Interest</span>
                    <span className="text-xs font-black text-foreground flex items-center gap-0.5">
                      {rec.product.interestRate}% <TrendingUp size={10} className="text-emerald-500" />
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[8px] text-muted-foreground uppercase font-medium">Fee</span>
                    <span className="text-xs font-black text-foreground flex items-center gap-0.5">
                      ${rec.product.monthlyFee} <DollarSign size={10} className="text-amber-500" />
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 mb-3">
                  <Wallet size={10} className="text-primary hidden sm:block" />
                  <p className="text-[10px] text-primary font-bold italic leading-tight">
                    "{rec.insight}"
                  </p>
                </div>

                <button
                  onClick={() => addToCompareTray("banking", rec.product.id, rec.product.category)}
                  className="mt-auto w-full py-1.5 bg-primary/10 hover:bg-primary text-primary hover:text-primary-foreground border border-primary/20 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-1.5 group/btn"
                >
                  <Plus size={12} className="group-hover/btn:rotate-90 transition-transform" />
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
