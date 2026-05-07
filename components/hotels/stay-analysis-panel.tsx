"use client"

import { Hotel } from "@/lib/mock/hotels"
import { cn } from "@/lib/utils"
import { Progress } from "@/components/ui/progress"
import { CheckCircle2, Zap, ShieldCheck, Star, DollarSign, Trash2, MapPin, Sparkles } from "lucide-react"

interface StayAnalysisPanelProps {
  selectedHotels: Hotel[]
  onClear: () => void
}

export function StayAnalysisPanel({ selectedHotels, onClear }: StayAnalysisPanelProps) {
  if (selectedHotels.length < 2) return null

  // Recommendation logic: mix of rating and price (value for money)
  const recommended = [...selectedHotels].sort((a, b) => {
    const scoreA = (a.rating * 20) - (a.pricePerNight / 10)
    const scoreB = (b.rating * 20) - (b.pricePerNight / 10)
    return scoreB - scoreA
  })[0]

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom duration-700">
      <div className="glass-panel p-8 relative overflow-hidden border-primary/20 bg-primary/5">
        <div className="absolute top-0 right-0 p-8 text-primary/10 -rotate-12">
          <Sparkles size={120} />
        </div>

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/20 rounded-xl">
                <CheckCircle2 className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-display font-bold text-white tracking-tight uppercase">Recommended Hospitality Node</h2>
                <p className="text-xs text-muted-foreground uppercase tracking-[0.2em] mt-1 font-bold">Neural Stay Optimization Result</p>
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
                <div className="flex items-center gap-2 mb-2">
                    <MapPin size={12} className="text-primary" />
                    <span className="text-[10px] font-bold text-primary uppercase tracking-widest">{recommended.city}, {recommended.province}</span>
                </div>
                <h3 className="text-3xl font-display font-black text-primary uppercase tracking-tighter mb-4">{recommended.name}</h3>
                <p className="text-sm text-slate-300 leading-relaxed font-medium italic">
                  Recommended based on its exceptional {recommended.rating} rating and superior value proposition at ${recommended.pricePerNight}/night. This property offers {recommended.amenities.length} premium amenities and is currently flagged as a top-tier neural match for your profile.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold mb-1">Value Score</p>
                  <p className="text-2xl font-display font-bold text-white">96.8%</p>
                </div>
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold mb-1">Trust Rating</p>
                  <p className="text-2xl font-display font-bold text-emerald-400 uppercase tracking-tighter">Verified</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-[10px] font-bold text-white uppercase tracking-[0.3em] opacity-50 mb-4">Property Comparison Matrix</h4>
              <div className="space-y-4">
                {[
                  { label: "Price Efficiency", score: Math.max(20, 100 - (recommended.pricePerNight / 5)), color: "bg-emerald-500", icon: DollarSign },
                  { label: "Rating Performance", score: recommended.rating * 20, color: "bg-amber-500", icon: Star },
                  { label: "Amenity Density", score: (recommended.amenities.length / 10) * 100, color: "bg-blue-500", icon: Zap },
                  { label: "Service Standards", score: 92, color: "bg-purple-500", icon: ShieldCheck },
                  { label: "Neural Match", score: 98, color: "bg-primary", icon: Sparkles },
                ].map((factor, i) => (
                  <div key={i} className="h-[24px] flex flex-col justify-center space-y-1.5">
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
            {selectedHotels.map(hotel => (
              <div key={hotel.id} className="p-4 rounded-2xl bg-white/5 border border-white/10 group hover:border-primary/30 transition-all">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[10px] font-bold text-white uppercase tracking-tight truncate max-w-[120px]">{hotel.name}</p>
                  <div className="h-1.5 w-1.5 rounded-full bg-primary teal-glow animate-pulse" />
                </div>
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-[9px] text-muted-foreground uppercase font-bold tracking-widest">Rate</p>
                    <p className="text-lg font-display font-bold text-white">${hotel.pricePerNight}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] text-muted-foreground uppercase font-bold tracking-widest">Rating</p>
                    <p className="text-xs font-bold text-primary uppercase">{hotel.rating} / 5</p>
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
