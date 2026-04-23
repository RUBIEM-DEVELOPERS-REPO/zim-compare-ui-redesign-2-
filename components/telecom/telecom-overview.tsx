"use client"

import { useAppStore } from "@/lib/store"
import { cn } from "@/lib/utils"
import { ScoreBadge } from "@/components/score-badge"
import { Disclaimer } from "@/components/disclaimer"
import { Signal, Activity, Zap, Shield, Smartphone } from "lucide-react"
import type { TelecomProvider } from "@prisma/client"
import { useI18n } from "@/lib/i18n"
import { X, Plus, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { TelecomCompareBar } from "./telecom-compare-bar"

const summaryCards = [
  { labelKey: "bestNetwork", value: "Econet Wireless", detailKey: "coverageDetail", detailVars: { score: "92" } },
  { labelKey: "cheapestData", value: "Telecel", detailKey: "dataDetail", detailVars: { price: "1.33" } },
  { labelKey: "bestFibre", value: "Liquid Telecom", detailKey: "fibreDetail", detailVars: { speed: "50", price: "0.30" } },
  { labelKey: "bestValueBundles", value: "NetOne", detailKey: "valueDetail" },
]

interface TelecomOverviewProps {
  location?: string
  providers?: TelecomProvider[]
}

<<<<<<< Updated upstream
export function TelecomOverview({ location = "All Locations" }: TelecomOverviewProps) {
  const { preferences, addToCompareTray, compareTray } = useAppStore()
=======
export function TelecomOverview({ location = "All Locations", providers = [] }: TelecomOverviewProps) {
  const { preferences } = useAppStore()
>>>>>>> Stashed changes
  const { t } = useI18n()
  const providerContext = "Based on aggregate analysis of all available mobile network operators and fixed-line fibre ISPs across Zimbabwe's coverage areas."
  const bestProvider = preferences.scenario === "sme" ? "Liquid Telecom" : preferences.scenario === "student" ? "NetOne" : "Econet Wireless"

  const filteredProviders = location === "All Locations"
    ? providers
    : providers.filter(p => (p.coverageCities || "[]").includes(location))

  return (
    <div className="space-y-4">
      <TelecomCompareBar />
      <div className="glass-floating p-4 bg-primary/5 border-primary/20 shadow-xl relative overflow-hidden group teal-glow">
        <div className="absolute -right-6 -top-6 w-24 h-24 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-all duration-1000" />
        <p className="text-[9px] font-medium text-primary uppercase tracking-[0.3em] mb-1.5">{t("telecom.bestNetworkForYou")}</p>
        <h2 className="text-2xl font-display font-medium text-white tracking-tight leading-tight">{bestProvider}</h2>
        <p className="text-xs text-muted-foreground mt-2 max-w-xl font-sans opacity-80 leading-relaxed font-medium">
          {t("telecom.basedOnProfile", { profile: t(`dashboard.${preferences.scenario}`) })} Optimized for rural penetration and institutional bandwidth.
        </p>
        <div className="mt-3 pt-3 border-t border-white/10">
          <Disclaimer />
        </div>
      </div>

      {filteredProviders.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-border p-12 text-center">
          <div className="bg-muted w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">{t("telecom.noProvidersFound", { location: location === "All Locations" ? t("common.allLocations") : location })}</h3>
          <p className="text-muted-foreground mb-6 max-w-xs mx-auto">{t("telecom.noProvidersDetail")}</p>
        </div>
      ) : (
        <>
          <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
            {summaryCards.map((c) => (
              <div key={c.labelKey} className="glass-floating p-3 h-full floating-hover group rounded-xl">
                <p className="text-[9px] font-medium text-muted-foreground uppercase tracking-[0.2em] mb-1 opacity-70 group-hover:text-primary transition-colors">{t(`telecom.highlights.${c.labelKey}`)}</p>
                <p className="text-sm font-display font-medium text-white mt-0.5 leading-tight">{c.value}</p>
                <p className="text-[10px] text-primary mt-1.5 font-medium tracking-widest uppercase">{t(`telecom.highlights.${c.detailKey}`, c.detailVars as any)}</p>
              </div>
            ))}
          </div>

          <section>
            <h3 className="text-[10px] font-medium text-foreground mb-2.5">
              {t("telecom.providersAvailable", { location: location === "All Locations" ? t("common.allLocations") : location, count: filteredProviders.length })}
            </h3>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {filteredProviders.map((p) => {
                const inTray = compareTray.ids.includes(p.id)
                return (
                  <div key={p.id} className={cn(
                    "glass-floating p-3 transition-all duration-500 relative group flex flex-col floating-hover rounded-xl",
                    inTray ? "border-primary/60 bg-primary/10 ring-2 ring-primary/20 shadow-xl shadow-primary/20 teal-glow" : "hover:border-primary/40"
                  )}>
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <p className="text-sm font-display font-medium text-foreground group-hover:text-primary transition-colors tracking-tight uppercase leading-snug">{p.name}</p>
                      <button
                        onClick={() => addToCompareTray("telecom", p.id, "overview")}
                        className={cn(
                          "flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[9px] font-medium uppercase tracking-[0.2em] transition-all duration-500 shadow-lg",
                          inTray ? "bg-primary text-primary-foreground shadow-primary/30 teal-glow" : "bg-white/5 text-foreground border border-white/10 hover:bg-white/10"
                        )}
                      >
                        {inTray ? <CheckCircle2 size={12} strokeWidth={4} /> : <Plus size={12} strokeWidth={4} />}
                      </button>
                    </div>
                    <div className="flex gap-1.5 flex-wrap mb-3">
                      <ScoreBadge score={p.coverageScore} label={t("telecom.coverage")} />
                      <ScoreBadge score={p.transparencyScore} label={t("telecom.transparency")} />
                    </div>
                    <p className="text-[9px] font-medium text-muted-foreground uppercase tracking-[0.2em] opacity-60 mt-auto">{p.type} &middot; {p.networkType}</p>
                  </div>
                )
              })}
            </div>
          </section>
        </>
      )}
    </div>
  )
}

