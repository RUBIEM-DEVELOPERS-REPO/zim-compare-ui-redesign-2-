"use client"

import { useState } from "react"
import { bankFees, banks } from "@/lib/mock/banks"
import { cn } from "@/lib/utils"
import { Disclaimer } from "@/components/disclaimer"

import { X } from "lucide-react"

const subTabs = [
  { key: "transaction", label: "Transaction Fees" },
  { key: "atm_card", label: "ATM & Card Fees" },
  { key: "fx_transfers", label: "FX & Transfers" },
  { key: "penalties", label: "Penalties" },
  { key: "hidden", label: "Hidden Fees" },
] as const

interface BankingNonInterestProps {
  location?: string
}

export function BankingNonInterest({ location = "All Locations" }: BankingNonInterestProps) {
  const [sub, setSub] = useState<string>("transaction")

  const filteredBanks = location === "All Locations"
    ? banks
    : banks.filter(b => b.locations.includes(location))

  const filteredBankFees = location === "All Locations"
    ? bankFees
    : bankFees.filter(f => {
      const bank = banks.find(b => b.id === f.bankId)
      return bank?.locations.includes(location)
    })

  const filtered = filteredBankFees.filter((f) => f.category === sub)

  // Build stacked breakdown per bank
  const bankBreakdown = filteredBanks.map((b) => {
    const fees = bankFees.filter((f) => f.bankId === b.id)
    const total = fees.reduce((sum, f) => sum + f.amount, 0)
    const byCategory: Record<string, number> = {}
    for (const f of fees) {
      byCategory[f.category] = (byCategory[f.category] || 0) + f.amount
    }
    return { bank: b.name, total, byCategory }
  }).sort((a, b) => b.total - a.total)

  const maxTotal = Math.max(...bankBreakdown.map((b) => b.total), 1)

  return (
    <div className="space-y-6">
      {/* Sub-tabs */}
      {/* Sub-tabs - 3 Column Grid */}
      <div className="grid grid-cols-3 gap-2 rounded-2xl bg-white/20 dark:bg-black/20 backdrop-blur-xl border border-white/25 dark:border-white/10 shadow-[0_8px_25px_rgba(0,0,0,0.08)] p-2">
        {subTabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setSub(t.key)}
            className={cn(
              "rounded-xl px-4 py-2 text-[10px] font-bold uppercase tracking-wider transition-all duration-300 text-center",
              sub === t.key
                ? "bg-white/40 dark:bg-white/10 text-foreground shadow-[0_0_15px_rgba(45,212,191,0.5)]"
                : "hover:bg-white/10 hover:backdrop-blur-2xl hover:brightness-125 hover:-translate-y-[1px] text-muted-foreground"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Comparison table for selected sub-tab */}
      {filtered.length > 0 ? (
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border bg-secondary/30">
                <th className="text-left px-3 py-2 text-muted-foreground font-medium">Fee</th>
                <th className="text-left px-3 py-2 text-muted-foreground font-medium">Bank</th>
                <th className="text-right px-3 py-2 text-muted-foreground font-medium">Amount</th>
                <th className="text-left px-3 py-2 text-muted-foreground font-medium">Unit</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((f) => (
                <tr key={f.id} className="border-b border-border last:border-0 hover:bg-secondary/20">
                  <td className="px-3 py-2 text-foreground">{f.name}</td>
                  <td className="px-3 py-2 text-foreground">{f.bankName}</td>
                  <td className="px-3 py-2 text-right font-medium text-foreground">${f.amount.toFixed(2)}</td>
                  <td className="px-3 py-2 text-muted-foreground">{f.unit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="rounded-2xl border-2 border-dashed border-border p-12 text-center col-span-full">
          <div className="bg-muted w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-bold text-foreground mb-2">No {sub} found for {location}</h3>
          <p className="text-muted-foreground mb-6 max-w-xs mx-auto">There are no {sub} records for banks active in this location.</p>
        </div>
      )}

      {/* Visual stacked breakdown */}
      <section>
        <h3 className="text-sm font-semibold text-foreground mb-3">Total Fee Breakdown by Bank</h3>
        <div className="space-y-3">
          {bankBreakdown.map((b) => (
            <div key={b.bank} className="flex items-center gap-3">
              <span className="text-xs text-foreground w-32 shrink-0 truncate">{b.bank}</span>
              <div className="flex-1 flex h-4 rounded-full overflow-hidden bg-secondary/30">
                {Object.entries(b.byCategory).map(([cat, amt]) => (
                  <div
                    key={cat}
                    className={cn(
                      "h-full transition-all",
                      cat === "transaction" && "bg-primary",
                      cat === "atm_card" && "bg-blue-500",
                      cat === "hidden" && "bg-amber-500",
                      cat === "penalties" && "bg-red-500",
                      cat === "fx_transfers" && "bg-cyan-500"
                    )}
                    style={{ width: `${(amt / maxTotal) * 100}%` }}
                    title={`${cat}: $${amt.toFixed(2)}`}
                  />
                ))}
              </div>
              <span className="text-xs text-foreground font-medium w-16 text-right">${b.total.toFixed(2)}</span>
            </div>
          ))}
        </div>
        <div className="flex gap-3 mt-3 flex-wrap">
          {[
            { label: "Transaction", color: "bg-primary" },
            { label: "ATM & Card", color: "bg-blue-500" },
            { label: "Hidden", color: "bg-amber-500" },
            { label: "Penalties", color: "bg-red-500" },
          ].map((l) => (
            <div key={l.label} className="flex items-center gap-1">
              <div className={cn("h-2.5 w-2.5 rounded-sm", l.color)} />
              <span className="text-[10px] text-muted-foreground">{l.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Red Flag Warnings */}
      <section className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
        <h3 className="text-sm font-semibold text-amber-400 mb-2">Red Flag Warnings</h3>
        <ul className="space-y-1 text-xs text-muted-foreground">
          <li>- FBC Bank has increased ZIPIT fees twice in the last quarter</li>
          <li>- CBZ hidden SMS alert fee ($0.50/month) often not disclosed at account opening</li>
          <li>- Stanbic hidden account maintenance fee ($1.00/month) in addition to standard fees</li>
        </ul>
      </section>
      <Disclaimer />
    </div>
  )
}
