"use client"

import { telecomProviders } from "@/lib/mock/telecoms"
import { useAppStore } from "@/lib/store"
import { ScoreBadge } from "@/components/score-badge"
import { Disclaimer } from "@/components/disclaimer"
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
}

export function TelecomOverview({ location = "All Locations" }: TelecomOverviewProps) {
  const { preferences, addToCompareTray, compareTray } = useAppStore()
  const { t } = useI18n()
  const bestProvider = preferences.scenario === "sme" ? "Liquid Telecom" : preferences.scenario === "student" ? "NetOne" : "Econet Wireless"

  const filteredProviders = location === "All Locations"
    ? telecomProviders
    : telecomProviders.filter(p => p.coverageCities.includes(location))

  return (
    <div className="space-y-6">
      <TelecomCompareBar />
      <div className="glass-panel p-5 bg-primary/5 border-primary/20">
        <p className="text-xs text-muted-foreground mb-1">{t("telecom.bestNetworkForYou")}</p>
        <p className="text-lg font-semibold text-foreground">{bestProvider}</p>
        <p className="text-sm text-muted-foreground mt-1">
          {t("telecom.basedOnProfile", { profile: t(`dashboard.${preferences.scenario}`) })}
        </p>
        <Disclaimer />
      </div>

      {filteredProviders.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-border p-12 text-center">
          <div className="bg-muted w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-bold text-foreground mb-2">{t("telecom.noProvidersFound", { location: location === "All Locations" ? t("common.allLocations") : location })}</h3>
          <p className="text-muted-foreground mb-6 max-w-xs mx-auto">{t("telecom.noProvidersDetail")}</p>
        </div>
      ) : (
        <>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {summaryCards.map((c) => (
              <div key={c.labelKey} className="glass-card p-4 h-full">
                <p className="text-xs text-muted-foreground">{t(`telecom.highlights.${c.labelKey}`)}</p>
                <p className="text-sm font-semibold text-foreground mt-1">{c.value}</p>
                <p className="text-xs text-primary mt-1">{t(`telecom.highlights.${c.detailKey}`, c.detailVars as any)}</p>
              </div>
            ))}
          </div>

          <section>
            <h3 className="text-sm font-semibold text-foreground mb-3">
              {t("telecom.providersAvailable", { location: location === "All Locations" ? t("common.allLocations") : location, count: filteredProviders.length })}
            </h3>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {filteredProviders.map((p) => {
                const inTray = compareTray.ids.includes(p.id)
                return (
                  <div key={p.id} className="glass-card p-4 flex flex-col h-full">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-semibold text-foreground">{p.name}</p>
                      {(() => {
                        return (
                          <button
                            onClick={() => addToCompareTray("telecom", p.id, "overview")}
                            className={cn(
                              "p-1.5 rounded-full transition-colors",
                              inTray ? "text-teal-600 bg-teal-50" : "text-muted-foreground hover:text-teal-600 hover:bg-teal-50"
                            )}
                          >
                            {inTray ? <CheckCircle2 className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                          </button>
                        )
                      })()}
                    </div>
                    <div className="flex gap-2 flex-wrap mb-2">
                      <ScoreBadge score={p.coverageScore} label={t("telecom.coverage")} />
                      <ScoreBadge score={p.transparencyScore} label={t("telecom.transparency")} />
                    </div>
                    <p className="text-xs text-muted-foreground mt-auto">{p.type} &middot; {p.networkType}</p>
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
