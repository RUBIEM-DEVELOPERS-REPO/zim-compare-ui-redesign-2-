"use client"

import React from "react"
import { Check, X, ShieldCheck, Zap, Trophy, MessageSquare, Info, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface Platform {
  name: string
  price: number
  offline: boolean
  quality: string
  library: string
  bestFor: string
  logo: string
  popularity: number
}

interface GenZComparisonPanelProps {
  selectedPlatforms: Platform[]
  onClear: () => void
}

export function GenZComparisonPanel({ selectedPlatforms, onClear }: GenZComparisonPanelProps) {
  if (selectedPlatforms.length < 2) return null

  // Simple recommendation logic: best value (lowest price) or highest popularity
  const bestPlatform = [...selectedPlatforms].sort((a, b) => {
    const scoreA = (100 - a.price * 5) + (a.popularity)
    const scoreB = (100 - b.price * 5) + (b.popularity)
    return scoreB - scoreA
  })[0]

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom duration-700">
      <div className="glass-panel p-8 relative overflow-hidden border-primary/20 bg-primary/5 rounded-[2.5rem]">
        <div className="absolute top-0 right-0 p-8 text-primary/10 -rotate-12">
          <Trophy size={120} />
        </div>

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/20 rounded-xl">
                <ShieldCheck className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-display font-bold text-white tracking-tight uppercase">Platform Intelligence Match</h2>
                <p className="text-xs text-muted-foreground uppercase tracking-[0.2em] mt-1 font-bold">Neural Comparison Results</p>
              </div>
            </div>
            <button 
              onClick={onClear}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-muted-foreground hover:text-red-400 hover:bg-red-400/10 transition-all text-[10px] font-bold uppercase tracking-widest"
            >
              <Trash2 size={14} />
              Clear Selection
            </button>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* BEST MATCH SECTION */}
            <div className="lg:col-span-1 space-y-6">
              <div className="p-6 rounded-[2rem] bg-white/5 border border-white/10 backdrop-blur-md relative overflow-hidden group">
                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="flex items-center gap-4 mb-6 relative z-10">
                  <div className="w-12 h-12 rounded-xl bg-black/40 border border-white/10 p-2.5">
                    <img src={bestPlatform.logo} alt="" className="w-full h-full object-contain" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">Top Selection</p>
                    <h3 className="text-2xl font-bold text-white tracking-tight">{bestPlatform.name}</h3>
                  </div>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed font-medium italic relative z-10">
                   Intelligence suggests <span className="text-primary">{bestPlatform.name}</span> is the optimal match for you. It offers the best balance of {bestPlatform.bestFor.toLowerCase()} and value-per-dollar.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-white/5 border border-white/5">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold mb-1">Precision Score</p>
                  <p className="text-2xl font-display font-bold text-white">{(bestPlatform.popularity * 0.98).toFixed(1)}%</p>
                </div>
                <div className="p-5 rounded-2xl bg-white/5 border border-white/5">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold mb-1">Status</p>
                  <p className="text-lg font-display font-bold text-emerald-400 uppercase tracking-tighter">Verified</p>
                </div>
              </div>
            </div>

            {/* COMPARISON MATRIX SECTION */}
            <div className="lg:col-span-2 overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="py-4 px-4 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Feature</th>
                    {selectedPlatforms.map(p => (
                      <th key={p.name} className="py-4 px-4 text-[10px] font-black uppercase tracking-[0.2em] text-white text-center">{p.name}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  <tr>
                    <td className="py-4 px-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Price/mo</td>
                    {selectedPlatforms.map(p => (
                      <td key={p.name} className="py-4 px-4 text-sm font-bold text-white text-center">${p.price}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-4 px-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Offline Mode</td>
                    {selectedPlatforms.map(p => (
                      <td key={p.name} className="py-4 px-4 text-center">
                        <div className="flex justify-center">
                          {p.offline ? <Check className="text-primary" size={16} /> : <X className="text-red-400" size={16} />}
                        </div>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-4 px-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Audio/Video Quality</td>
                    {selectedPlatforms.map(p => (
                      <td key={p.name} className="py-4 px-4 text-xs font-medium text-white text-center uppercase tracking-tighter">{p.quality || "Standard"}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-4 px-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Library Size</td>
                    {selectedPlatforms.map(p => (
                      <td key={p.name} className="py-4 px-4 text-xs font-medium text-white text-center">{p.library || "—"}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-4 px-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Best For</td>
                    {selectedPlatforms.map(p => (
                      <td key={p.name} className="py-4 px-4 text-center">
                        <span className="px-2 py-1 rounded-lg bg-primary/10 text-[9px] font-black text-primary uppercase tracking-tighter">
                          {p.bestFor}
                        </span>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
