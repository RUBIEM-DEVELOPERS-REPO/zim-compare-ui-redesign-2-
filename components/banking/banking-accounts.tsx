"use client"

import { useState } from "react"
import { useAppStore } from "@/lib/store"
import { cn } from "@/lib/utils"
import { Disclaimer } from "@/components/disclaimer"
import { X, Plus, CheckCircle2, Zap, ArrowRight, CreditCard, Sparkles } from "lucide-react"
import { useI18n } from "@/lib/i18n"
import { BankingCompareBar } from "./banking-compare-bar"
import { ScoreBadge } from "@/components/score-badge"

const subTabs = [
  { key: "savings", labelKey: "banking.subTabs.savings" },
  { key: "current", labelKey: "banking.subTabs.current" },
  { key: "student", labelKey: "banking.subTabs.student" },
  { key: "salary", labelKey: "banking.subTabs.salary" },
  { key: "sme", labelKey: "banking.subTabs.sme" },
] as const

interface BankingAccountsProps {
  location?: string
  banks?: any[]
  products?: any[]
}

export function BankingAccounts({ location = "All Locations", banks = [], products = [] }: BankingAccountsProps) {
  const [sub, setSub] = useState<string>("savings")
  const { addToCompareTray, removeFromCompareTray, compareTray } = useAppStore()
  const { t } = useI18n()

  const [amount, setAmount] = useState<number>(0)

  const filtered = products.filter((p) => {
    const categoryMatch = p.category === sub
    if (!categoryMatch) return false

    // Location filter
    const bank = banks.find(b => b.id === p.bankId)
    const locations = bank ? (typeof bank.locations === 'string' ? JSON.parse(bank.locations) : bank.locations) : []
    if (location !== "All Locations" && bank && !locations.includes(location)) {
      return false
    }

    // Amount filter (minBalance)
    if (amount > 0 && p.minBalance > amount) {
      return false
    }

    return true
  })


  return (
    <div className="space-y-4 pb-10">
      <BankingCompareBar />
      

      {/* Sub-tabs & Filters */}
      <div className="flex flex-col gap-4">
        <div className="glass-tab-container grid grid-cols-5 gap-1.5 p-1.5">
          {subTabs.map((t_item) => (
            <button
              key={t_item.key}
              onClick={() => setSub(t_item.key)}
              className={cn(
                "glass-tab-base text-[10px] sm:text-[11px] font-medium uppercase tracking-wider h-10 w-full flex items-center justify-center",
                sub === t_item.key ? "glass-tab-active" : "text-muted-foreground"
              )}
            >
              {t(t_item.labelKey)}
            </button>
          ))}
        </div>
      </div>

      {/* Product Cards */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-border p-12 text-center">
          <div className="bg-muted w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">
            {t("banking.noAccountsFound", { sub: t(`banking.subTabs.${sub}`), location: location === "All Locations" ? t("common.allLocations") : location })}
          </h3>
          <p className="text-muted-foreground mb-6 max-w-xs mx-auto">
            {t("banking.noAccountsDetail", { sub: t(`banking.subTabs.${sub}`) })}
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => {
            const inTray = compareTray.ids.includes(p.id)
            const bank = banks.find(b => b.id === p.bankId)
            const recScore = p.aiScore || bank?.recommendationScore || 85
            const isRecommended = recScore >= 90
            
            // Handle perks parsing if it's a string
            const perks = typeof p.perks === 'string' ? JSON.parse(p.perks) : p.perks
            
            return (
              <div
                key={p.id}
                className={cn(
                  "glass-floating p-4 transition-all duration-500 relative group flex flex-col floating-hover rounded-2xl",
                  inTray ? "border-primary/60 bg-primary/10 ring-2 ring-primary/20 shadow-xl shadow-primary/20 teal-glow" : "hover:border-primary/40",
                  isRecommended && !inTray ? "border-amber-500/30 bg-amber-500/5 ring-1 ring-amber-500/20" : ""
                )}
              >
                {isRecommended && (
                  <div className="absolute -top-2.5 right-4 z-10">
                    <span className="flex items-center gap-1 text-[9px] font-bold text-amber-400 bg-black/80 px-2 py-1 rounded-full border border-amber-500/30 uppercase tracking-widest shadow-lg animate-pulse">
                      <Sparkles size={10} className="text-amber-400" />
                      Neural Recommended
                    </span>
                  </div>
                )}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex flex-col">
                    <p className="text-base font-display font-medium text-foreground group-hover:text-primary transition-colors tracking-tight uppercase leading-snug">{p.name}</p>
                    <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-[0.2em] opacity-60 mt-1">{p.bankName}</p>
                  </div>
                  <ScoreBadge score={recScore} label="AI Score" />
                </div>

                <div className="grid grid-cols-2 gap-2.5 mb-4">
                  <div className="rounded-xl bg-white/5 border border-white/5 p-2.5">
                    <p className="text-[9px] font-medium text-muted-foreground uppercase tracking-[0.15em] mb-1">{t("banking.interestRate")}</p>
                    <p className="text-sm font-display font-medium text-foreground">{p.interestRate}% <span className="text-[10px] opacity-60">APY</span></p>
                  </div>
                  <div className="rounded-xl bg-white/5 border border-white/5 p-2.5">
                    <p className="text-[9px] font-medium text-muted-foreground uppercase tracking-[0.15em] mb-1">{t("banking.monthlyFee")}</p>
                    <p className="text-sm font-display font-medium text-primary">${p.monthlyFee}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 mb-6">
                  {Array.isArray(perks) && perks.map((perk: string) => (
                    <span key={perk} className="text-[8px] font-medium uppercase tracking-wider bg-primary/10 text-primary px-2 py-1 rounded-lg border border-primary/20">
                      {perk}
                    </span>
                  ))}
                </div>

                  <div className="grid grid-cols-2 gap-2 mt-auto">
                    <button
                      onClick={() => inTray ? removeFromCompareTray(p.id) : addToCompareTray("banking", p.id, p.category)}
                      className={cn(
                        "btn-compare-standard py-2.5",
                        inTray && "opacity-60"
                      )}
                    >
                      {inTray ? t("common.addedToCompare") : "Compare"}
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
        </div>
      )}
      <Disclaimer />
    </div>
  )
}
