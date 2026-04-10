"use client"

import { X } from "lucide-react"
import { banks } from "@/lib/mock/banks"
import { useAppStore } from "@/lib/store"
import { ScoreBadge } from "@/components/score-badge"
import { Disclaimer } from "@/components/disclaimer"
import { useI18n } from "@/lib/i18n"

const summaryCards = [
  { labelKey: "cheapestBank", detailKey: "bankFees", detailVars: { amount: "0.50" }, value: "POSB" },
  { labelKey: "bestDigitalBank", detailKey: "digitalScore", detailVars: { score: "90" }, value: "Steward Bank" },
  { labelKey: "bestForSalary", detailKey: "salaryDetail", value: "CBZ Bank" },
  { labelKey: "bestForSMEs", detailKey: "smeDetail", value: "Stanbic Bank" },
]

interface BankingOverviewProps {
  location?: string
}

export function BankingOverview({ location = "All Locations" }: BankingOverviewProps) {
  const { preferences } = useAppStore()
  const { t } = useI18n()
  const bestBank = preferences.scenario === "student" ? "Steward Bank" : preferences.scenario === "sme" ? "Stanbic Bank" : "CBZ Bank"

  const filteredBanks = banks // All licensed banks have national scope

  return (
    <div className="space-y-6">
      {/* Best for you - only show if bank is in location or if All Locations */}
      <div className="glass-panel p-5 bg-primary/5 border-primary/20">
        <p className="text-xs text-muted-foreground mb-1">{t("banking.bestBankForYou")}</p>
        <p className="text-lg font-semibold text-foreground">{bestBank}</p>
        <p className="text-sm text-muted-foreground mt-1">
          {t("banking.basedOnProfile", { profile: t(`dashboard.${preferences.scenario}`) })}
        </p>
        <Disclaimer />
      </div>

      {filteredBanks.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-border p-12 text-center">
          <div className="bg-muted w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-bold text-foreground mb-2">{t("banking.noBanksFound", { location: location === "All Locations" ? t("common.allLocations") : location })}</h3>
          <p className="text-muted-foreground mb-6 max-w-xs mx-auto">{t("banking.noBanksDetail")}</p>
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {summaryCards.map((c) => (
              <div key={c.labelKey} className="glass-card p-4 h-full">
                <p className="text-xs text-muted-foreground">{t(`banking.highlights.${c.labelKey}`)}</p>
                <p className="text-sm font-semibold text-foreground mt-1">{c.value}</p>
                <p className="text-xs text-primary mt-1">{t(`banking.highlights.${c.detailKey}`, c.detailVars as any)}</p>
              </div>
            ))}
          </div>

          {/* Market Highlights */}
          <section>
            <h3 className="text-sm font-semibold text-foreground mb-3">{t("dashboard.marketHighlights")}</h3>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="glass-card p-4 h-full">
                <p className="text-xs text-muted-foreground">{t("banking.bestSavingsRate")}</p>
                <p className="text-sm font-semibold text-foreground">Stanbic PureSave</p>
                <p className="text-xs text-primary">{t("banking.highlights.interestRate", { rate: "4.0" })}</p>
              </div>
              <div className="glass-card p-4 h-full">
                <p className="text-xs text-muted-foreground">{t("banking.lowestZipitFee")}</p>
                <p className="text-sm font-semibold text-foreground">POSB</p>
                <p className="text-xs text-primary">{t("banking.highlights.zipitFee", { fee: "0.80" })}</p>
              </div>
              <div className="rounded-xl border border-border bg-card p-4">
                <p className="text-xs text-muted-foreground">{t("banking.bestMortgageRate")}</p>
                <p className="text-sm font-semibold text-foreground">CBZ Home Loan</p>
                <p className="text-xs text-primary">{t("banking.highlights.mortgageRate", { rate: "8.5" })}</p>
              </div>
            </div>
          </section>

          {/* Top Banks */}
          <section>
            <h3 className="text-sm font-semibold text-foreground mb-3">
              {t("banking.banksAvailable", { location: location === "All Locations" ? t("common.allLocations") : location, count: filteredBanks.length })}
            </h3>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {filteredBanks.map((b) => (
                <div key={b.id} className="glass-card p-4 h-full">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-semibold text-foreground">{b.name}</p>
                    <span className="text-xs text-muted-foreground capitalize">{b.type.replace("_", " ")}</span>
                  </div>
                  <div className="flex gap-2 flex-wrap mb-2">
                    <ScoreBadge score={b.transparencyScore} label={t("banking.transparency")} />
                    {b.digitalScore && <ScoreBadge score={b.digitalScore} label={t("banking.digital")} />}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {t("banking.bankStats", { branches: b.branches, digitalFeatures: b.digitalFeatures.length })}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  )
}
