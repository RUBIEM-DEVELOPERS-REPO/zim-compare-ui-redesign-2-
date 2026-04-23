"use client"

import { useAppStore } from "@/lib/store"
import { cn, formatDate } from "@/lib/utils"
import { regulatedPrices } from "@/lib/mock/regulated"
import { Fuel, Landmark, UtilityPole, AlertCircle, TrendingUp, TrendingDown } from "lucide-react"

export default function RegulatedPricesPage() {
  const categories = [
    { id: "all", name: "All Categories", icon: AlertCircle },
    { id: "fuel", name: "Fuel & Energy", icon: Fuel },
    { id: "banking", name: "Banking Caps", icon: Landmark },
    { id: "utilities", name: "Utility Rates", icon: UtilityPole },
  ]

  return (
    <div className="space-y-8 py-8 animate-in fade-in duration-700">
      <div>
        <h1 className="text-3xl font-medium text-foreground">Regulated & Reference Prices</h1>
        <p className="text-muted-foreground">Official price caps and reference markers set by ZERA, RBZ, and POTRAZ.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="grid gap-4">
            {regulatedPrices.map((price) => (
              <div key={price.id} className="glass-card overflow-hidden group">
                <div className="p-6 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-2xl bg-secondary group-hover:bg-primary/10 transition-colors">
                      {price.category === "fuel" ? <Fuel className="w-6 h-6" /> : 
                       price.category === "banking" ? <Landmark className="w-6 h-6" /> : 
                       <UtilityPole className="w-6 h-6" />}
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground">{price.item}</h3>
                      <p className="text-xs text-muted-foreground uppercase tracking-widest">{price.category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-medium text-foreground">
                      {price.unit === "%" ? "" : "$"}{price.regulatedPrice}{price.unit === "%" ? "%" : ""}
                    </p>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-tighter">{price.unit}</p>
                  </div>
                </div>
                
                {/* Comparison Bar (Simulated) */}
                <div className="px-6 pb-6 pt-2 border-t border-border/30 bg-secondary/10">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-medium text-muted-foreground uppercase">Provider Variance</span>
                    <span className="text-[10px] font-medium text-emerald-500 uppercase flex items-center gap-1">
                      <TrendingDown className="w-3 h-3" />
                      Within Range
                    </span>
                  </div>
                  <div className="h-2 w-full bg-secondary rounded-full overflow-hidden flex">
                    <div className="h-full bg-emerald-500 w-[70%] border-r border-background" />
                    <div className="h-full bg-amber-500 w-[20%] border-r border-background" />
                    <div className="h-full bg-red-500 w-[10%]" />
                  </div>
                  <div className="flex justify-between mt-2">
                    <span className="text-[9px] text-muted-foreground italic">Last update: {formatDate(price.lastUpdated)}</span>
                    <span className="text-[9px] text-primary font-medium hover:underline cursor-pointer">View Market Avg</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
           <div className="glass-card p-6 bg-primary/5 border-primary/20">
             <h3 className="font-medium text-foreground mb-4">Compliance Notice</h3>
             <p className="text-xs text-muted-foreground leading-relaxed mb-4">
               Providers found charging above these regulated caps are subject to penalties. Fintech automatically flags non-compliant prices in your comparisons.
             </p>
             <div className="flex items-start gap-3 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500">
               <AlertCircle className="w-4 h-4 shrink-0" />
               <p className="text-[10px] font-medium italic">Report a price variance if you notice a mismatch at the point of sale.</p>
             </div>
           </div>

           <section className="glass-card p-6">
             <h3 className="font-medium text-sm mb-4">Expected Movements</h3>
             <div className="space-y-4">
                {[
                  { label: "Petrol", arrow: TrendingUp, color: "text-red-500", desc: "Global uptick in crude" },
                  { label: "Data Caps", arrow: TrendingDown, color: "text-emerald-500", desc: "New competition entry" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <item.arrow className={cn("w-4 h-4", item.color)} />
                    <div>
                      <p className="text-xs font-medium text-foreground">{item.label}</p>
                      <p className="text-[10px] text-muted-foreground">{item.desc}</p>
                    </div>
                  </div>
                ))}
             </div>
           </section>
        </div>
      </div>
    </div>
  )
}

