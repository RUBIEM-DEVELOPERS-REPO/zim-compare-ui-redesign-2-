"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Disclaimer } from "@/components/disclaimer"
import { X } from "lucide-react"
import { telecomProviders } from "@/lib/mock/telecoms"

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
}

export function TelecomFees({ location = "All Locations" }: TelecomFeesProps) {
  const [cat, setCat] = useState<string>("activation")

  const filtered = telecomFees.filter((f) => {
    const categoryMatch = f.category === cat
    if (!categoryMatch) return false

    if (location === "All Locations") return true

    const provider = telecomProviders.find(p => p.name === f.provider)
    return provider?.coverageCities.includes(location)
  })

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-2">
        {feeCategories.map((c) => (
          <button
            key={c.key}
            onClick={() => setCat(c.key)}
            className={cn(
              "rounded-full px-4 py-2 text-[10px] font-bold uppercase tracking-wider border transition-all duration-300 text-center tab-hover",
              cat === c.key
                ? "bg-teal-50 border-teal-200 text-teal-700 shadow-sm"
                : "bg-white border-gray-100 text-gray-400 hover:border-gray-200 hover:bg-gray-50"
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
              </tr>
            </thead>
            <tbody>
              {filtered.map((f, i) => (
                <tr key={`${f.provider}-${f.name}`} className="border-b border-border last:border-0 hover:bg-secondary/20">
                  <td className="px-3 py-2 text-foreground">{f.provider}</td>
                  <td className="px-3 py-2 text-foreground">{f.name}</td>
                  <td className="px-3 py-2 text-right text-foreground font-medium">
                    {f.amount > 0 ? `$${f.amount.toFixed(2)}` : "--"}
                  </td>
                  <td className="px-3 py-2 text-muted-foreground">{f.unit}</td>
                  <td className="px-3 py-2 text-muted-foreground max-w-[200px] truncate">{f.note}</td>
                </tr>
              ))}
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
