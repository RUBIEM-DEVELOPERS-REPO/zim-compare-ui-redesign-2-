"use client"

import { X } from "lucide-react"
import { banks } from "@/lib/mock/banks"
import { useAppStore } from "@/lib/store"
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
    <div className="space-y-4">
      {/* Best for you — only shown when bank is available in the selected location */}
      <div className="glass-floating p-4 bg-primary/5 border-primary/20 shadow-xl relative overflow-hidden group teal-glow">
        <div className="absolute -right-6 -top-6 w-24 h-24 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-all duration-1000" />
        <p className="text-[9px] font-medium text-primary uppercase tracking-[0.3em] mb-1.5">{t("banking.bestBankForYou")}</p>
        <h2 className="text-2xl font-display font-normal text-white tracking-tight leading-tight">{bestBank}</h2>
        <p className="text-xs text-muted-foreground mt-2 max-w-xl font-sans opacity-80 leading-relaxed font-medium">
          {t("banking.basedOnProfile", { profile: t(`dashboard.${preferences.scenario}`) })} Optimized for local efficiency and institutional stability.
        </p>
        <div className="mt-3 pt-3 border-t border-white/10">
          <Disclaimer />
        </div>
      </div>

      {filteredBanks.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-border p-12 text-center">
          <div className="bg-muted w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">{t("banking.noBanksFound", { location: location === "All Locations" ? t("common.allLocations") : location })}</h3>
          <p className="text-muted-foreground mb-6 max-w-xs mx-auto">{t("banking.noBanksDetail")}</p>
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4">
            {summaryCards.map((c) => (
              <div key={c.labelKey} className="glass-floating p-3 h-full floating-hover group rounded-xl">
                <p className="text-[9px] font-medium text-muted-foreground uppercase tracking-[0.2em] mb-1 opacity-70 group-hover:text-primary transition-colors">{t(`banking.highlights.${c.labelKey}`)}</p>
                <p className="text-sm font-display font-medium text-white mt-0.5 leading-tight">{c.value}</p>
                <p className="text-[10px] text-primary mt-1.5 font-medium tracking-widest uppercase">{t(`banking.highlights.${c.detailKey}`, c.detailVars as any)}</p>
              </div>
            ))}
          </div>

          {/* Market Highlights */}
          <section>
            <h3 className="text-[10px] font-medium text-white uppercase tracking-widest mb-2.5 opacity-70">{t("dashboard.marketHighlights")}</h3>
            <div className="grid gap-2.5 sm:grid-cols-3">
              <div className="glass-floating p-3 h-full floating-hover rounded-xl">
                <p className="text-[9px] font-medium text-muted-foreground uppercase tracking-[0.2em] mb-1 opacity-70">{t("banking.bestSavingsRate")}</p>
                <p className="text-sm font-display font-medium text-white mt-0.5 leading-tight">Stanbic PureSave</p>
                <p className="text-[10px] text-primary mt-1.5 font-medium tracking-widest uppercase">{t("banking.highlights.interestRate", { rate: "4.0" })}</p>
              </div>
              <div className="glass-floating p-3 h-full floating-hover rounded-xl">
                <p className="text-[9px] font-medium text-muted-foreground uppercase tracking-[0.2em] mb-1 opacity-70">{t("banking.lowestZipitFee")}</p>
                <p className="text-sm font-display font-medium text-white mt-0.5 leading-tight">POSB</p>
                <p className="text-[10px] text-primary mt-1.5 font-medium tracking-widest uppercase">{t("banking.highlights.zipitFee", { fee: "0.80" })}</p>
              </div>
              <div className="glass-floating p-3 h-full floating-hover rounded-xl border-primary/20 bg-primary/5">
                <p className="text-[9px] font-medium text-muted-foreground uppercase tracking-[0.2em] mb-1 opacity-70">{t("banking.bestMortgageRate")}</p>
                <p className="text-sm font-display font-medium text-white mt-0.5 leading-tight">CBZ Home Loan</p>
                <p className="text-[10px] text-primary mt-1.5 font-medium tracking-widest uppercase">{t("banking.highlights.mortgageRate", { rate: "8.5" })}</p>
              </div>
            </div>
          </section>

        </>
      )}
    </div>
  )
}

