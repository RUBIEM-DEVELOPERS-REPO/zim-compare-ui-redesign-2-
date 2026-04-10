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
      <div className="glass-tab-container grid grid-cols-2 sm:grid-cols-4 gap-1.5 p-1.5">
        {feeCategories.map((c) => (
          <button
            key={c.key}
            onClick={() => setCat(c.key)}
            className={cn(
              "glass-tab-base text-[10px] font-bold uppercase tracking-wider h-10 w-full flex items-center justify-center",
              cat === c.key ? "glass-tab-active" : "text-muted-foreground"
            )}
          >
            {c.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-border p-12 text-center col-span-full">
          <div className="bg-muted w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-bold text-foreground mb-2">No fees found for {location}</h3>
          <p className="text-muted-foreground mb-6 max-w-xs mx-auto">None of the providers with {cat} fees currently have reported coverage in this location.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border bg-secondary/30">
                <th className="text-left px-3 py-2 text-muted-foreground font-medium">Provider</th>
                <th className="text-left px-3 py-2 text-muted-foreground font-medium">Fee</th>
                <th className="text-right px-3 py-2 text-muted-foreground font-medium">Amount</th>
                <th className="text-left px-3 py-2 text-muted-foreground font-medium">Unit</th>
                <th className="text-left px-3 py-2 text-muted-foreground font-medium">Note</th>
                <th className="w-[40px]"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((f, i) => {
                const providerId = telecomProviders.find(p => p.name === f.provider)?.id || f.provider
                const inTray = compareTray.ids.includes(providerId)
                return (
                  <tr key={`${f.provider}-${f.name}`} className="border-b border-border last:border-0 hover:bg-secondary/20">
                    <td className="px-3 py-2 text-foreground">{f.provider}</td>
                    <td className="px-3 py-2 text-foreground">{f.name}</td>
                    <td className="px-3 py-2 text-right text-foreground font-medium">
                      {f.amount > 0 ? `$${f.amount.toFixed(2)}` : "--"}
                    </td>
                    <td className="px-3 py-2 text-muted-foreground">{f.unit}</td>
                    <td className="px-3 py-2 text-muted-foreground max-w-[200px] truncate">{f.note}</td>
                    <td className="px-3 py-2 text-right">
                      <button
                        onClick={() => addToCompareTray("telecom", providerId, "fees")}
                        className={cn(
                          "p-1 rounded-full transition-colors",
                          inTray ? "text-teal-600 bg-teal-50" : "text-muted-foreground hover:text-teal-600 hover:bg-teal-50"
                        )}
                        title={inTray ? t("common.addedToCompare") : t("common.addToCompare")}
                      >
                        {inTray ? <CheckCircle2 className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
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
        <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
          <p className="text-xs font-medium text-amber-400 mb-1">Watch out for hidden costs</p>
          <p className="text-xs text-muted-foreground">
            Out-of-bundle rates can be extremely expensive. Auto-renewal may charge your airtime without notice.
            Always check your balance and bundle status regularly.
          </p>
        </div>
      )}
      <Disclaimer />
    </div>
  )
}
