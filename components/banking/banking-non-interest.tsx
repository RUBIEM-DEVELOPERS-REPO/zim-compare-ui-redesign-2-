"use client"

import { useState } from "react"
import { bankFees, banks } from "@/lib/mock/banks"
import { useAppStore } from "@/lib/store"
import { cn } from "@/lib/utils"
import { Disclaimer } from "@/components/disclaimer"
import { X, Plus, Check, AlertTriangle } from "lucide-react"
import { BankingCompareBar } from "./banking-compare-bar"
import { useEffect, useRef } from "react"

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
  const { compareTray, addToCompareTray, removeFromCompareTray } = useAppStore()
  const chartRef = useRef<HTMLDivElement>(null)

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

  useEffect(() => {
    if (chartRef.current) {
        const rows = chartRef.current.querySelectorAll('.chart-row')
        rows.forEach((row, rowIndex) => {
            const segments = row.querySelectorAll<HTMLElement>('.chart-segment')
            const data = bankBreakdown[rowIndex].byCategory
            Object.values(data).forEach((amt, segmentIndex) => {
                const segment = segments[segmentIndex]
                if (segment) {
                    segment.style.width = `${(amt / maxTotal) * 100}%`
                }
            })
        })
    }
  }, [bankBreakdown, maxTotal, sub])

  return (
    <div className="space-y-6">
      <BankingCompareBar />

      {/* Sub-tabs */}
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
                <th className="text-right px-3 py-2 text-muted-foreground font-medium">Compare</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((f) => {
                const inTray = compareTray.ids.includes(f.id)
                return (
                  <tr key={f.id} className={cn(
                    "border-b border-border last:border-0 hover:bg-secondary/20 transition-colors",
                    inTray && "bg-primary/5"
                  )}>
                    <td className="px-3 py-2 text-foreground font-medium">{f.name}</td>
                    <td className="px-3 py-2 text-foreground">{f.bankName}</td>
                    <td className="px-3 py-2 text-right font-bold text-foreground">${f.amount.toFixed(2)}</td>
                    <td className="px-3 py-2 text-muted-foreground">{f.unit}</td>
                    <td className="px-3 py-2 text-right">
                      <button
                        onClick={() => inTray ? removeFromCompareTray(f.id) : addToCompareTray("banking", f.id, "non-interest")}
                        className={cn(
                          "inline-flex items-center gap-1 px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest transition-all",
                          inTray ? "text-primary/60" : "text-primary hover:bg-primary/10"
                        )}
                      >
                        {inTray ? <Check className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                        {inTray ? "Added" : "Add"}
                      </button>
                    </td>
                  </tr>
                )
              })}
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
        <h3 className="text-sm font-semibold text-foreground mb-3 font-black uppercase tracking-tight">Total Fee Breakdown by Bank</h3>
        <div className="space-y-4" ref={chartRef}>
          {bankBreakdown.map((b) => (
            <div key={b.bank} className="flex items-center gap-3 group chart-row">
              <span className="text-xs text-foreground w-32 shrink-0 truncate font-medium group-hover:text-primary transition-colors">{b.bank}</span>
              <div className="flex-1 flex h-6 rounded-xl overflow-hidden bg-secondary/30 ring-1 ring-border shadow-inner">
                {Object.entries(b.byCategory).map(([cat, amt]) => (
                  <div
                    key={cat}
                    className={cn(
                      "h-full transition-all hover:brightness-110 chart-segment",
                      cat === "transaction" && "bg-primary",
                      cat === "atm_card" && "bg-blue-500",
                      cat === "hidden" && "bg-amber-500",
                      cat === "penalties" && "bg-red-500",
                      cat === "fx_transfers" && "bg-cyan-500"
                    )}
                    title={`${cat}: $${amt.toFixed(2)}`}
                  />
                ))}
              </div>
              <span className="text-xs text-foreground font-black w-16 text-right">${b.total.toFixed(2)}</span>
            </div>
          ))}
        </div>
        <div className="flex gap-4 mt-4 flex-wrap">
          {[
            { label: "Transaction", color: "bg-primary" },
            { label: "ATM & Card", color: "bg-blue-500" },
            { label: "Hidden", color: "bg-amber-500" },
            { label: "Penalties", color: "bg-red-500" },
          ].map((l) => (
            <div key={l.label} className="flex items-center gap-2">
              <div className={cn("h-3 w-3 rounded-md shadow-sm", l.color)} />
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{l.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Red Flag Warnings */}
      <section className="rounded-2xl border-2 border-amber-500/20 bg-amber-500/5 p-5 shadow-lg shadow-amber-500/5">
        <h3 className="text-sm font-black uppercase tracking-[0.2em] text-amber-500 mb-4 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" />
          Red Flag Warnings
        </h3>
        <ul className="space-y-2 text-xs text-muted-foreground leading-relaxed">
          <li className="flex items-start gap-2">
            <span className="text-amber-500 mt-0.5">•</span>
            <span>FBC Bank has increased ZIPIT fees twice in the last quarter</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-amber-500 mt-0.5">•</span>
            <span>CBZ hidden SMS alert fee ($0.50/month) often not disclosed at account opening</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-amber-500 mt-0.5">•</span>
            <span>Stanbic hidden account maintenance fee ($1.00/month) in addition to standard fees</span>
          </li>
        </ul>
      </section>
      <Disclaimer />
    </div>
  )
}
