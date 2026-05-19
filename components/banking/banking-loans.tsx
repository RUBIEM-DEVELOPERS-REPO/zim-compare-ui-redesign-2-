"use client"

import { useState } from "react"
import { useAppStore } from "@/lib/store"
import { cn } from "@/lib/utils"
import { Disclaimer } from "@/components/disclaimer"
import { Plus, Check, AlertCircle, X, Sparkles } from "lucide-react"
import { useI18n } from "@/lib/i18n"
import { BankingCompareBar } from "./banking-compare-bar"
import { ScoreBadge } from "@/components/score-badge"

const subTabs = [
  { key: "personal", label: "Personal" },
  { key: "sme", label: "SME" },
  { key: "mortgage", label: "Mortgage" },
  { key: "vehicle", label: "Vehicle" },
  { key: "salary_based", label: "Salary-based" },
] as const

interface BankingLoansProps {
  location?: string
  banks?: any[]
  loans?: any[]
}

export function BankingLoans({ location = "All Locations", banks = [], loans = [] }: BankingLoansProps) {
  const [sub, setSub] = useState<string>("personal")
  const { addToCompareTray, removeFromCompareTray, compareTray } = useAppStore()
  const { t } = useI18n()

  const filtered = loans.filter((l) => {
    const categoryMatch = l.category === sub
    if (!categoryMatch) return false

    // Location filter
    const bank = banks.find(b => b.id === l.bankId)
    const locations = bank ? (typeof bank.locations === 'string' ? JSON.parse(bank.locations) : bank.locations) : []
    if (location !== "All Locations" && bank && !locations.includes(location)) {
      return false
    }

    return true
  })

  return (
    <div className="space-y-4">
      <BankingCompareBar />
      {/* Sub-tabs & Filters */}
      <div className="flex flex-col gap-4">
        <div className="glass-tab-container grid grid-cols-3 sm:grid-cols-5 gap-1.5 p-1.5">
          {subTabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setSub(t.key)}
              className={cn(
                "glass-tab-base text-[10px] font-medium uppercase tracking-wider h-10 w-full flex items-center justify-center",
                sub === t.key ? "glass-tab-active" : "text-muted-foreground"
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {filtered.map((l) => {
          const inTray = compareTray.ids.includes(l.id)
          const trayFull = compareTray.ids.length >= 4 && !inTray
          const totalCost12 = (1000 * (l.apr / 100)) + l.initiationFee
          const totalCost24 = (1000 * (l.apr / 100) * 2) + l.initiationFee

          const bank = banks.find(b => b.id === l.bankId)
          const recScore = bank?.recommendationScore || 85
          const isRecommended = recScore > 90
          const requirements = typeof l.requirements === 'string' ? JSON.parse(l.requirements) : l.requirements

          return (
            <div
              key={l.id}
              className={cn(
                "glass-card p-4 transition-all duration-300 relative group",
                inTray ? "border-primary ring-1 ring-primary/20 shadow-lg shadow-primary/5" : ""
              )}
            >
              {inTray && (
                <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground p-1 rounded-full shadow-lg z-10 animate-in zoom-in">
                  <Check size={12} />
                </div>
              )}

              {isRecommended && (
                <div className="absolute -top-2.5 left-4 z-10">
                  <span className="flex items-center gap-1 text-[8px] font-bold text-amber-400 bg-black/80 px-2 py-1 rounded-full border border-amber-500/30 uppercase tracking-widest shadow-lg">
                    <Sparkles size={8} /> Neural Recommended
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between mb-1">
                <div className="flex flex-col">
                  <p className="text-base font-display font-medium text-foreground tracking-tight uppercase">{l.name}</p>
                  <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest opacity-60">{l.bankName}</p>
                </div>
                <ScoreBadge score={recScore} label="AI Score" />
              </div>

              <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
                <div className="rounded-lg bg-secondary/50 p-2">
                  <p className="text-muted-foreground">APR</p>
                  <p className="text-foreground font-medium">{l.apr}%</p>
                </div>
                <div className="rounded-lg bg-secondary/50 p-2">
                  <p className="text-muted-foreground">Initiation Fee</p>
                  <p className="text-foreground font-medium">${l.initiationFee}</p>
                </div>
                <div className="rounded-lg bg-secondary/50 p-2">
                  <p className="text-muted-foreground">Early Settle Penalty</p>
                  <p className="text-foreground font-medium">{l.earlySettlementPenalty}%</p>
                </div>
                <div className="rounded-lg bg-secondary/50 p-2">
                  <p className="text-muted-foreground">Max Term</p>
                  <p className="text-foreground font-medium">{l.maxTermMonths} months</p>
                </div>
              </div>

              {/* Total cost preview */}
              <div className="glass-card bg-secondary/10 p-3 mb-3 border border-white/5">
                <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest mb-2 opacity-60">Cost of $1,000 borrowed</p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-[10px] text-muted-foreground">12 Months:</span>{" "}
                    <span className="text-sm font-medium text-foreground">${totalCost12.toFixed(0)}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground">24 Months:</span>{" "}
                    <span className="text-sm font-medium text-foreground">${totalCost24.toFixed(0)}</span>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-xs text-muted-foreground mb-1">Requirements</p>
                <div className="flex flex-wrap gap-1">
                  {Array.isArray(requirements) && requirements.map((r: string) => (
                    <span key={r} className="text-[10px] bg-secondary text-muted-foreground px-2 py-0.5 rounded-full">
                      {r}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => inTray ? removeFromCompareTray(l.id) : addToCompareTray("banking", l.id, l.category)}
                  className={cn(
                    "btn-compare-standard py-2.5",
                    (inTray || trayFull) && "opacity-60"
                  )}
                >
                  {inTray ? "Remove" : "Compare"}
                </button>
                <button
                  className="bg-primary text-primary-foreground text-[10px] font-black uppercase tracking-widest py-2.5 rounded-xl hover:scale-[1.02] transition-all shadow-lg shadow-primary/20"
                >
                  Apply Now
                </button>
              </div>
            </div>
          )
        })}
        {filtered.length === 0 && (
          <div className="rounded-2xl border-2 border-dashed border-border p-12 text-center col-span-full">
            <div className="bg-muted w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <X className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">No {sub} loans found for {location}</h3>
            <p className="text-muted-foreground mb-6 max-w-xs mx-auto">None of the banks offering {sub} loans are currently active in this location.</p>
          </div>
        )}
      </div>
      <Disclaimer />
    </div>
  )
}
