import { useI18n } from "@/lib/i18n"

const highlights = [
  { labelKey: "cheapestBank", detailKey: "bankFees", detailVars: { amount: "0.50" }, value: "POSB", category: "banking" },
  { labelKey: "bestDigitalBank", detailKey: "digitalScore", detailVars: { score: "90" }, value: "Steward Bank", category: "banking" },
  { labelKey: "cheapestData", detailKey: "fibreData", detailVars: { amount: "0.30" }, value: "Liquid Telecom", category: "telecom" },
  { labelKey: "bestCoverage", detailKey: "coverageScore", detailVars: { score: "92" }, value: "Econet Wireless", category: "telecom" },
  { labelKey: "highestPassRate", detailKey: "passRateDetail", detailVars: { score: "98" }, value: "Peterhouse Boys", category: "schools" },
  { labelKey: "fastestClaims", detailKey: "claimsDetail", detailVars: { days: "7" }, value: "CIMAS", category: "insurance" },
]

export function MarketHighlights() {
  const { t } = useI18n()

  return (
    <section>
      <h3 className="text-sm font-semibold text-foreground mb-3">{t("dashboard.marketHighlights")}</h3>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {highlights.map((h) => (
          <div
            key={h.labelKey}
            className="rounded-xl border border-border bg-card p-4 hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 backdrop-blur-sm bg-card/60"
          >
            <p className="text-xs text-muted-foreground mb-1">{t(`dashboard.highlights.${h.labelKey}`)}</p>
            <p className="text-sm font-semibold text-foreground">{h.value}</p>
            <p className="text-xs text-primary mt-1">{t(`dashboard.highlights.${h.detailKey}`, h.detailVars as unknown as Record<string, string | number>)}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
