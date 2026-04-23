"use client"

import { useAppStore } from "@/lib/store"
import { cn } from "@/lib/utils"
import { taxesAndLevies } from "@/lib/mock/taxes"
import { Scale, Landmark, Smartphone, Zap, Car, BookOpen, HeartPulse, Building2 } from "lucide-react"
import { useState } from "react"

const sectors = [
  { id: "all", name: "All Sectors", icon: Scale },
  { id: "banking", name: "Banking", icon: Landmark },
  { id: "telecom", name: "Telecom", icon: Smartphone },
  { id: "insurance", name: "Insurance", icon: HeartPulse },
  { id: "mobility", name: "Mobility", icon: Car },
  { id: "utilities", name: "Utilities", icon: Zap },
  { id: "general", name: "General Statutory", icon: Building2 },
]

export default function TaxesModulePage() {
  const [activeSector, setActiveSector] = useState("all")

  const filteredTaxes = activeSector === "all" 
    ? taxesAndLevies 
    : taxesAndLevies.filter(t => t.sector === activeSector || t.sector === "general")

  return (
    <div className="space-y-8 py-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-medium text-foreground">Taxes, Levies & Licenses</h1>
          <p className="text-muted-foreground">Statutory charges that determine the true cost of services in Zimbabwe.</p>
        </div>
        <div className="px-4 py-2 rounded-2xl bg-secondary border border-border flex items-center gap-2">
          <Scale className="w-4 h-4 text-muted-foreground" />
          <span className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">Updated for FY 2026</span>
        </div>
      </div>

      {/* Sector Filter */}
      <div className="flex flex-wrap gap-2">
        {sectors.map((s) => (
          <button
            key={s.id}
            onClick={() => setActiveSector(s.id)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition-all border",
              activeSector === s.id 
                ? "bg-primary border-primary text-primary-foreground shadow-lg shadow-primary/20" 
                : "bg-card border-border text-muted-foreground hover:border-primary/30"
            )}
          >
            <s.icon className="w-4 h-4" />
            {s.name}
          </button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
           <div className="glass-card overflow-hidden">
             <table className="w-full text-left border-collapse">
               <thead>
                 <tr className="bg-secondary/30">
                   <th className="p-4 text-xs font-medium text-muted-foreground uppercase tracking-widest">Tax / Levy Name</th>
                   <th className="p-4 text-xs font-medium text-muted-foreground uppercase tracking-widest text-center">Rate</th>
                   <th className="p-4 text-xs font-medium text-muted-foreground uppercase tracking-widest">Applies To</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-border/50">
                 {filteredTaxes.map((tax) => (
                   <tr key={tax.id} className="hover:bg-secondary/10 transition-colors group">
                     <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-card border border-border flex items-center justify-center text-muted-foreground group-hover:text-primary transition-colors">
                            {tax.sector === "banking" && <Landmark className="w-4 h-4" />}
                            {tax.sector === "telecom" && <Smartphone className="w-4 h-4" />}
                            {tax.sector === "mobility" && <Car className="w-4 h-4" />}
                            {tax.sector === "general" && <Building2 className="w-4 h-4" />}
                            {!["banking", "telecom", "mobility", "general"].includes(tax.sector) && <Scale className="w-4 h-4" />}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-foreground">{tax.name}</p>
                            <p className="text-[10px] text-muted-foreground uppercase tracking-tighter">{tax.sector}</p>
                          </div>
                        </div>
                     </td>
                     <td className="p-4 text-center">
                        <span className={cn(
                          "px-2 py-1 rounded-lg font-mono text-sm font-medium",
                          tax.rate > 10 ? "text-red-500 bg-red-500/10" : "text-primary bg-primary/10"
                        )}>
                          {tax.type === "fixed" ? "$" : ""}{tax.rate}{tax.type === "percentage" ? "%" : ""}
                        </span>
                     </td>
                     <td className="p-4">
                        <p className="text-xs text-foreground font-medium">{tax.appliesTo}</p>
                        {tax.rate > 5 && <p className="text-[9px] text-amber-500 italic mt-0.5">High Impact on Total Cost</p>}
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
           </div>
        </div>

        <div className="space-y-6">
           <section className="glass-card p-6 border-amber-500/20 bg-gradient-to-br from-amber-500/5 to-transparent">
             <h3 className="font-medium text-foreground mb-4">IMTT Breakdown</h3>
             <p className="text-xs text-muted-foreground leading-relaxed mb-4">
               The Intermediated Money Transfer Tax is charged on most electronic transfers in Zimbabwe.
             </p>
             <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-xl bg-card border border-border">
                  <span className="text-xs font-medium">ZiG Transactions</span>
                  <span className="text-sm font-medium text-primary">1.5%</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-card border border-border">
                   <span className="text-xs font-medium">USD Transactions</span>
                   <span className="text-sm font-medium text-primary">2.0%</span>
                </div>
             </div>
             <p className="mt-4 text-[10px] text-muted-foreground italic">
               Note: Exemptions apply for small transactions and charitable payments.
             </p>
           </section>

           <section className="glass-card p-6 overflow-hidden relative">
             <div className="absolute -top-4 -right-4 w-20 h-20 bg-primary/10 rounded-full blur-2xl" />
             <h3 className="font-medium text-sm mb-4">License Deadlines</h3>
             <div className="space-y-4">
                {[
                  { name: "Vehicle License", date: "Apr 30", status: "Upcoming" },
                  { name: "Radio License", date: "Jun 30", status: "Quarterly" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium">{item.name}</p>
                      <p className="text-[10px] text-muted-foreground">{item.status}</p>
                    </div>
                    <span className="text-xs font-mono text-primary font-medium">{item.date}</span>
                  </div>
                ))}
             </div>
             <button className="w-full mt-6 py-2 rounded-xl bg-secondary text-foreground text-xs font-medium hover:bg-primary hover:text-white transition-all">
                Sync with Calendar
             </button>
           </section>
        </div>
      </div>
    </div>
  )
}

