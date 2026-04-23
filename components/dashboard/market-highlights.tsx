import { useI18n } from "@/lib/i18n"
import { History, CheckCircle2 } from "lucide-react"

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
    <section className="surface-glass p-6 overflow-hidden group">
      <div className="absolute top-0 right-0 p-12 text-primary/5 -rotate-12 group-hover:rotate-0 transition-transform duration-1000">
          <History size={150} />
      </div>
      <div className="flex items-center justify-between mb-8 relative z-10">
        <div>
          <h3 className="text-2xl font-display font-medium text-white tracking-tight">{t("dashboard.marketHighlights")}</h3>
          <p className="text-[9px] text-primary/80 font-medium uppercase tracking-widest mt-1 bg-primary/10 px-2 py-0.5 rounded-lg border border-primary/20 w-fit">{t("dashboard.neuralIndicators")}</p>
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {highlights.map((h) => (
          <div
            key={h.labelKey}
            className="surface-glass p-5 h-full floating-hover relative overflow-hidden group/card"
          >
            <div className="absolute top-0 right-0 p-4 text-primary/5 -rotate-12 group-hover/card:rotate-0 transition-transform duration-1000">
                <CheckCircle2 size={40} />
            </div>
            <p className="text-[8px] font-medium text-muted-foreground uppercase tracking-[0.2em] mb-2 opacity-60 relative z-10">
              {t(`dashboard.highlights.${h.labelKey}`)}
            </p>
            <p className="text-lg font-display font-medium text-white mb-4 tracking-tight relative z-10 group-hover/card:text-primary transition-colors">{h.value}</p>
            <div className="pt-4 border-t border-white/10 relative z-10">
              <span className="text-[9px] font-medium text-primary uppercase tracking-widest teal-glow bg-primary/10 px-3 py-1.5 rounded-xl border border-primary/20 shadow-inner inline-block">
                {t(`dashboard.highlights.${h.detailKey}`, h.detailVars as unknown as Record<string, string | number>)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

