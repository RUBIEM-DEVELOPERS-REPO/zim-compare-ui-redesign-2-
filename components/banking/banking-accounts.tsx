"use client"

import { useState } from "react"
import { banks, bankingProducts } from "@/lib/mock/banks"
import { useAppStore } from "@/lib/store"
import { cn } from "@/lib/utils"
import { Disclaimer } from "@/components/disclaimer"
import { X } from "lucide-react"
import { useI18n } from "@/lib/i18n"

const subTabs = [
  { key: "savings", labelKey: "banking.subTabs.savings" },
  { key: "current", labelKey: "banking.subTabs.current" },
  { key: "student", labelKey: "banking.subTabs.student" },
  { key: "salary", labelKey: "banking.subTabs.salary" },
  { key: "sme", labelKey: "banking.subTabs.sme" },
] as const

interface BankingAccountsProps {
  location?: string
}

export function BankingAccounts({ location = "All Locations" }: BankingAccountsProps) {
  const [sub, setSub] = useState<string>("savings")
  const { addToCompareTray, compareTray } = useAppStore()
  const { t } = useI18n()

  const filtered = bankingProducts.filter((p) => {
    const categoryMatch = p.category === sub
    if (!categoryMatch) return false

    // National scope by default: if "All Locations" or nothing specific is passed, show all.
    // If a location is passed, we still show all national banks because they are available everywhere via digital/USSD.
    // We only filter if an institution is strictly local (none currently are).
    if (location === "All Locations") return true

    // Show products for all licensed banks as they have national reach
    return true
  })

  return (
    <div className="space-y-4">
      {/* Sub-tabs */}
      <div className="grid grid-cols-5 gap-2 rounded-2xl bg-white/20 dark:bg-black/20 backdrop-blur-xl border border-white/25 dark:border-white/10 shadow-[0_8px_25px_rgba(0,0,0,0.08)] p-2">
        {subTabs.map((t_item) => (
          <button
            key={t_item.key}
            onClick={() => setSub(t_item.key)}
            className={cn(
              "rounded-xl px-2 py-2 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider transition-all duration-300 text-center",
              sub === t_item.key
                ? "bg-white/40 dark:bg-white/10 text-foreground shadow-[0_0_15px_rgba(45,212,191,0.5)]"
                : "hover:bg-white/10 hover:backdrop-blur-2xl hover:brightness-125 hover:-translate-y-[1px] text-muted-foreground"
            )}
          >
            {t(t_item.labelKey)}
          </button>
        ))}
      </div>

      {/* Product Cards */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-border p-12 text-center">
          <div className="bg-muted w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-bold text-foreground mb-2">
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
            return (
              <div
                key={p.id}
                className="rounded-xl border border-border bg-card p-4 flex flex-col hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 backdrop-blur-sm bg-card/60"
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-semibold text-foreground">{p.name}</p>
                </div>
                <p className="text-xs text-muted-foreground mb-3">{p.bankName}</p>

                <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
                  <div className="rounded-lg bg-secondary/50 p-2">
                    <p className="text-muted-foreground">{t("banking.interestRate")}</p>
                    <p className="text-foreground font-medium">{p.interestRate}% APY</p>
                  </div>
                  <div className="rounded-lg bg-secondary/50 p-2">
                    <p className="text-muted-foreground">{t("banking.monthlyFee")}</p>
                    <p className="text-foreground font-medium">${p.monthlyFee}</p>
                  </div>
                  <div className="rounded-lg bg-secondary/50 p-2">
                    <p className="text-muted-foreground">{t("banking.minBalance")}</p>
                    <p className="text-foreground font-medium">${p.minBalance}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 mb-3">
                  {p.perks.map((perk) => (
                    <span key={perk} className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                      {perk}
                    </span>
                  ))}
                </div>

                <div className="mt-auto">
                  <button
                    onClick={() => addToCompareTray("banking", p.id, "accounts")}
                    className={cn(
                      "btn-compare-standard w-full",
                      inTray && "opacity-60"
                    )}
                  >
                    {inTray ? t("common.addedToCompare") : t("common.addToCompare")}
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
