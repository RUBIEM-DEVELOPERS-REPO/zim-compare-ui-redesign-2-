"use client"

import { useState } from "react"
import { banks, bankLoans } from "@/lib/mock/banks"
import { useAppStore } from "@/lib/store"
import { cn } from "@/lib/utils"
import { Disclaimer } from "@/components/disclaimer"
import { Plus, Check, AlertCircle, X } from "lucide-react"
import { useI18n } from "@/lib/i18n"
import { BankingCompareBar } from "./banking-compare-bar"

const subTabs = [
  { key: "personal", label: "Personal" },
  { key: "sme", label: "SME" },
  { key: "mortgage", label: "Mortgage" },
  { key: "vehicle", label: "Vehicle" },
  { key: "salary_based", label: "Salary-based" },
] as const

interface BankingLoansProps {
  location?: string
}

export function BankingLoans({ location = "All Locations" }: BankingLoansProps) {
  const [sub, setSub] = useState<string>("personal")
  const { addToCompareTray, removeFromCompareTray, compareTray } = useAppStore()
  const { t } = useI18n()

  const filtered = bankLoans.filter((l) => {
    const categoryMatch = l.category === sub
    if (!categoryMatch) return false

    // National scope by default
    if (location === "All Locations") return true

    return true
  })

  return (
    <div className="space-y-4">
      <BankingCompareBar />
      {/* Sub-tabs - 3 Column Grid */}
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

      <div className="grid gap-4 sm:grid-cols-2">
        {filtered.map((l) => {
          const inTray = compareTray.ids.includes(l.id)
          const trayFull = compareTray.ids.length >= 4 && !inTray
          const totalCost12 = (1000 * (l.apr / 100)) + l.initiationFee
          const totalCost24 = (1000 * (l.apr / 100) * 2) + l.initiationFee

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

              <div className="flex items-center justify-between mb-1">
                <p className="text-sm font-medium text-foreground">{l.name}</p>
              </div>
              <p className="text-xs text-muted-foreground mb-3">{l.bankName}</p>

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
              <div className="glass-card bg-secondary/10 p-3 mb-3">
                <p className="text-xs text-muted-foreground mb-1">Total cost of $1,000 borrowed</p>
                <div className="flex gap-4 text-xs">
                  <div>
                    <span className="text-muted-foreground">12 months:</span>{" "}
                    <span className="text-foreground font-medium">${totalCost12.toFixed(0)}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">24 months:</span>{" "}
                    <span className="text-foreground font-medium">${totalCost24.toFixed(0)}</span>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-xs text-muted-foreground mb-1">Requirements</p>
                <div className="flex flex-wrap gap-1">
                  {l.requirements.map((r) => (
                    <span key={r} className="text-[10px] bg-secondary text-muted-foreground px-2 py-0.5 rounded-full">
                      {r}
                    </span>
                  ))}
                </div>
              </div>

              <button
                onClick={() => inTray ? removeFromCompareTray(l.id) : addToCompareTray("banking", l.id, "loans")}
                className={cn(
                  "btn-compare-standard w-full",
                  (inTray || trayFull) && "opacity-60"
                )}
              >
                {inTray ? (
                  <>{t("common.removeFromCompare")}</>
                ) : trayFull ? (
                  <>
                    <AlertCircle size={14} />
                    {t("common.compareLimitReached")}
                  </>
                ) : (
                  <>
                    <Plus size={14} />
                    {t("common.addToCompare")}
                  </>
                )}
              </button>
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

