"use client"

import { useState } from "react"
import { useAppStore } from "@/lib/store"
import { cn } from "@/lib/utils"
import { Disclaimer } from "@/components/disclaimer"
<<<<<<< Updated upstream
import { X, Plus, CheckCircle2 } from "lucide-react"
=======
import { AlertCircle, HelpCircle, X } from "lucide-react"
import { useI18n } from "@/lib/i18n"
import type { TelecomProvider } from "@prisma/client"
>>>>>>> Stashed changes
import { telecomProviders } from "@/lib/mock/telecoms"
import { useAppStore } from "@/lib/store"
import { TelecomCompareBar } from "./telecom-compare-bar"
import { useI18n } from "@/lib/i18n"

const feeCategories = [
  { key: "activation", label: "Activation & SIM" },
  { key: "topup", label: "Top-up Fees" },
  { key: "roaming", label: "Roaming" },
  { key: "hidden", label: "Hidden Costs" },
] as const

const telecomFees = [
  // Activation & SIM
  { provider: "Econet Wireless", category: "activation", name: "SIM Card Purchase", amount: 1.00, unit: "once", note: "" },
  { provider: "Econet Wireless", category: "activation", name: "SIM Replacement", amount: 2.00, unit: "once", note: "" },
  { provider: "NetOne", category: "activation", name: "SIM Card Purchase", amount: 0.50, unit: "once", note: "" },
  { provider: "Telecel", category: "activation", name: "SIM Card Purchase", amount: 0.50, unit: "once", note: "" },
  { provider: "TelOne", category: "activation", name: "Fibre Installation", amount: 50.00, unit: "once", note: "Standard installation" },
  { provider: "Liquid Telecom", category: "activation", name: "Fibre Installation", amount: 75.00, unit: "once", note: "Includes router" },
  // Top-up
  { provider: "Econet Wireless", category: "topup", name: "Agent Top-up Fee", amount: 0.10, unit: "per txn", note: "Some agents charge extra" },
  { provider: "Econet Wireless", category: "topup", name: "Bank Top-up Fee", amount: 0.05, unit: "per txn", note: "" },
  { provider: "NetOne", category: "topup", name: "Agent Top-up Fee", amount: 0.05, unit: "per txn", note: "" },
  { provider: "Telecel", category: "topup", name: "Top-up Fee", amount: 0.00, unit: "free", note: "No additional fees" },
  // Roaming
  { provider: "Econet Wireless", category: "roaming", name: "SA Roaming Data/MB", amount: 0.50, unit: "per MB", note: "South Africa" },
  { provider: "Econet Wireless", category: "roaming", name: "SA Roaming Calls/min", amount: 1.50, unit: "per min", note: "South Africa" },
  { provider: "NetOne", category: "roaming", name: "SA Roaming Data/MB", amount: 0.60, unit: "per MB", note: "South Africa" },
  { provider: "Telecel", category: "roaming", name: "Limited Roaming", amount: 0, unit: "N/A", note: "Very limited roaming partners" },
  // Hidden
  { provider: "Econet Wireless", category: "hidden", name: "Auto-renewal charges", amount: 0, unit: "varies", note: "Bundles auto-renew if balance available" },
  { provider: "Econet Wireless", category: "hidden", name: "Out-of-bundle rate", amount: 0.20, unit: "per MB", note: "Charged when bundle expires" },
  { provider: "NetOne", category: "hidden", name: "Out-of-bundle rate", amount: 0.15, unit: "per MB", note: "Charged when bundle expires" },
  { provider: "Telecel", category: "hidden", name: "Out-of-bundle rate", amount: 0.18, unit: "per MB", note: "Charged when bundle expires" },
  { provider: "TelOne", category: "hidden", name: "Late payment penalty", amount: 5.00, unit: "per month", note: "After 7 days overdue" },
  { provider: "Liquid Telecom", category: "hidden", name: "Early termination", amount: 100.00, unit: "once", note: "Contract break fee" },
]

interface TelecomFeesProps {
  location?: string
  providers?: TelecomProvider[]
}

export function TelecomFees({ location = "All Locations", providers = [] }: TelecomFeesProps) {
  const [cat, setCat] = useState<string>("activation")
  const { addToCompareTray, compareTray } = useAppStore()
  const { t } = useI18n()

  const filtered = telecomFees.filter((f) => {
    const categoryMatch = f.category === cat
    if (!categoryMatch) return false

    if (location === "All Locations") return true

    const provider = providers.find(p => p.name === f.provider)
    return provider?.coverageCities.includes(location)
  })

  return (
    <div className="space-y-4">
      <TelecomCompareBar />
      <div className="flex gap-2 flex-wrap bg-white/5 p-1.5 rounded-2xl border border-white/10 shadow-inner w-full sm:w-auto">
        {feeCategories.map((c) => (
          <button
            key={c.key}
            onClick={() => setCat(c.key)}
            className={cn(
              "px-5 py-2.5 rounded-xl text-[10px] font-medium uppercase tracking-[0.2em] transition-all duration-500",
              cat === c.key 
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-[1.02] teal-glow" 
                : "text-muted-foreground hover:text-white hover:bg-white/5"
            )}
          >
            {c.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="glass-floating border-dashed border-white/10 p-12 text-center col-span-full bg-white/5 floating-hover">
          <div className="bg-white/5 w-16 h-16 rounded-[1.5rem] flex items-center justify-center mx-auto mb-4 border border-white/10 shadow-inner">
            <X className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-2xl font-display font-medium text-white mb-2 uppercase tracking-tight">Access Restricted: No protocols for {location}</h3>
          <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-[0.2em] mb-6 max-w-xs mx-auto opacity-60">None of the providers with {cat} protocols currently have reported signal in this location.</p>
        </div>
      ) : (
        <div className="overflow-x-auto glass-floating border-white/10 bg-white/5 overflow-hidden">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-white/5 bg-white/5">
                <th className="text-left px-6 py-4 text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">Provider</th>
                <th className="text-left px-4 py-4 text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">Fee</th>
                <th className="text-right px-4 py-4 text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">Amount</th>
                <th className="text-left px-4 py-4 text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">Unit</th>
                <th className="text-left px-6 py-4 text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">Note</th>
                <th className="w-[60px]"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((f, i) => {
                const providerId = telecomProviders.find(p => p.name === f.provider)?.id || f.provider
                const inTray = compareTray.ids.includes(providerId)
                return (
                  <tr key={`${f.provider}-${f.name}`} className="border-b border-white/5 hover:bg-white/5 transition-colors group/row">
                    <td className="px-6 py-4 text-white font-display font-medium uppercase tracking-tight text-sm">{f.provider}</td>
                    <td className="px-4 py-4 text-muted-foreground uppercase font-medium tracking-widest text-[10px] opacity-80">{f.name}</td>
                    <td className="px-4 py-4 text-right text-primary font-display font-medium text-sm tabular-nums">
                      {f.amount > 0 ? `$${f.amount.toFixed(2)}` : "--"}
                    </td>
                    <td className="px-4 py-4 text-muted-foreground uppercase font-medium tracking-widest text-[9px] opacity-60">{f.unit}</td>
                    <td className="px-6 py-4 text-muted-foreground font-sans text-[11px] leading-relaxed opacity-70 italic max-w-[200px] truncate">{f.note}</td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => addToCompareTray("telecom", providerId, "fees")}
                        className={cn(
                          "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500 shadow-xl teal-glow",
                          inTray ? "bg-primary text-primary-foreground scale-110" : "bg-white/5 border border-white/10 text-muted-foreground hover:bg-primary/20 hover:text-primary"
                        )}
                        title={inTray ? t("common.addedToCompare") : t("common.addToCompare")}
                      >
                        {inTray ? <CheckCircle2 className="w-5 h-5" strokeWidth={3} /> : <Plus className="w-5 h-5" strokeWidth={3} />}
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {cat === "hidden" && (
        <div className="glass-floating border-amber-500/20 bg-amber-500/5 p-6 teal-glow">
          <div className="flex items-center gap-3 mb-3">
              <div className="p-1.5 bg-amber-500/20 rounded-lg">
                  <X className="w-4 h-4 text-amber-500" />
              </div>
              <p className="text-[10px] font-medium text-amber-500 uppercase tracking-[0.2em]">Neural Warning: Hidden Protocols</p>
          </div>
          <p className="text-[11px] text-muted-foreground leading-relaxed uppercase tracking-widest opacity-80 font-sans">
            Out-of-bundle rates can be extremely expensive. Auto-renewal may charge your airtime without notice.
            Always check your balance and bundle status regularly.
          </p>
        </div>
      )}
      <Disclaimer />
    </div>
  )
}

