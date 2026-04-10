"use client"

import { telecomProviders } from "@/lib/mock/telecoms"
import { ScoreBadge } from "@/components/score-badge"
import { Disclaimer } from "@/components/disclaimer"
import { X, Plus, CheckCircle2 } from "lucide-react"
import { useI18n } from "@/lib/i18n"
import { useAppStore } from "@/lib/store"
import { cn } from "@/lib/utils"
import { TelecomCompareBar } from "./telecom-compare-bar"

const coverageByRegion = [
  { regionKey: "harare", region: "Harare", econet: 98, netone: 95, telecel: 90, telone: 80, liquid: 85 },
  { regionKey: "bulawayo", region: "Bulawayo", econet: 95, netone: 90, telecel: 85, telone: 75, liquid: 70 },
  { regionKey: "mashonalandWest", region: "Mashonaland West", econet: 88, netone: 78, telecel: 65, telone: 40, liquid: 30 },
  { regionKey: "matabelelandSouth", region: "Matabeleland South", econet: 80, netone: 70, telecel: 55, telone: 30, liquid: 20 },
  { regionKey: "manicaland", region: "Manicaland", econet: 85, netone: 75, telecel: 60, telone: 35, liquid: 25 },
  { regionKey: "masvingo", region: "Masvingo", econet: 82, netone: 72, telecel: 58, telone: 32, liquid: 22 },
  { regionKey: "midlands", region: "Midlands", econet: 86, netone: 76, telecel: 63, telone: 38, liquid: 28 },
  { regionKey: "mashonalandCentral", region: "Mashonaland Central", econet: 84, netone: 74, telecel: 62, telone: 36, liquid: 26 },
]

const speedData = [
  { provider: "Econet Wireless", avg4G: 15.2, avg3G: 3.8, peak4G: 42 },
  { provider: "NetOne", avg4G: 12.1, avg3G: 3.2, peak4G: 35 },
  { provider: "Telecel", avg4G: 8.5, avg3G: 2.5, peak4G: 25 },
  { provider: "TelOne", avg4G: 0, avg3G: 0, peak4G: 0, fibre: 18.5 },
  { provider: "Liquid Telecom", avg4G: 0, avg3G: 0, peak4G: 0, fibre: 45.0 },
]

function getCellColor(val: number) {
  if (val >= 90) return "bg-emerald-500/20 text-emerald-400"
  if (val >= 75) return "bg-emerald-500/10 text-emerald-400/80"
  if (val >= 60) return "bg-amber-500/15 text-amber-400"
  if (val >= 40) return "bg-amber-500/10 text-amber-400/70"
  return "bg-red-500/10 text-red-400"
}

interface TelecomCoverageProps {
  location?: string
}

export function TelecomCoverage({ location = "All Locations" }: TelecomCoverageProps) {
  const { t } = useI18n()
  const { addToCompareTray, compareTray } = useAppStore()
  const displayLocation = location === "All Locations" ? t("common.allLocations") : location

  const filteredProviders = location === "All Locations"
    ? telecomProviders
    : telecomProviders.filter(p => p.coverageCities.includes(location))

  return (
    <div className="space-y-6">
      <TelecomCompareBar />
      <section>
        <h3 className="text-sm font-semibold text-foreground mb-3">{t("telecom.providerOverview", { location: displayLocation })}</h3>
        {filteredProviders.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-border p-12 text-center col-span-full">
            <div className="bg-muted w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <X className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-bold text-foreground mb-2">{t("telecom.noCoverageData", { location: displayLocation })}</h3>
            <p className="text-muted-foreground mb-6 max-w-xs mx-auto">{t("telecom.noCoverageDetail")}</p>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProviders.map((p) => (
              <div key={p.id} className="rounded-xl border border-border bg-card p-4 flex flex-col transition-all hover:border-teal-200/50">
                <div className="flex items-center justify-between mb-1">
                  <div>
                    <p className="text-sm font-semibold text-foreground mb-1">{p.name}</p>
                    <p className="text-xs text-muted-foreground mb-2">{p.networkType}</p>
                  </div>
                  {(() => {
                    const inTray = compareTray.ids.includes(p.id)
                    return (
                      <button
                        onClick={() => addToCompareTray("telecom", p.id, "coverage")}
                        className={cn(
                          "p-2 rounded-full transition-colors",
                          inTray ? "text-teal-600 bg-teal-50" : "text-muted-foreground hover:text-teal-600 hover:bg-teal-50"
                        )}
                        title={inTray ? t("common.addedToCompare") : t("common.addToCompare")}
                      >
                        {inTray ? <CheckCircle2 className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                      </button>
                    )
                  })()}
                </div>
                <div className="flex gap-2 flex-wrap mt-auto">
                  <ScoreBadge score={p.coverageScore} label={t("telecom.coverage")} />
                  <ScoreBadge score={p.transparencyScore} label={t("telecom.transparency")} />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <h3 className="text-sm font-semibold text-foreground mb-3">{t("telecom.regionalCoverage")}</h3>
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border bg-secondary/30">
                <th className="text-left px-3 py-2 text-muted-foreground font-medium">{t("telecom.region")}</th>
                <th className="text-center px-3 py-2 text-muted-foreground font-medium">Econet</th>
                <th className="text-center px-3 py-2 text-muted-foreground font-medium">NetOne</th>
                <th className="text-center px-3 py-2 text-muted-foreground font-medium">Telecel</th>
                <th className="text-center px-3 py-2 text-muted-foreground font-medium">TelOne</th>
                <th className="text-center px-3 py-2 text-muted-foreground font-medium">Liquid</th>
              </tr>
            </thead>
            <tbody>
              {coverageByRegion.map((r) => (
                <tr key={r.region} className="border-b border-border last:border-0">
                  <td className="px-3 py-2 text-foreground font-medium">{r.region}</td>
                  {[r.econet, r.netone, r.telecel, r.telone, r.liquid].map((val, i) => (
                    <td key={i} className="px-3 py-2 text-center">
                      <span className={`inline-block rounded px-2 py-0.5 font-medium ${getCellColor(val)}`}>
                        {val}%
                      </span>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h3 className="text-sm font-semibold text-foreground mb-3">{t("telecom.avgSpeeds")}</h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {speedData.map((s) => (
            <div key={s.provider} className="rounded-xl border border-border bg-card p-4">
              <p className="text-sm font-semibold text-foreground mb-2">{s.provider}</p>
              <div className="space-y-1.5 text-xs">
                {s.avg4G > 0 && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t("telecom.avg4G")}</span>
                      <span className="text-foreground font-medium">{s.avg4G} Mbps</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t("telecom.avg3G")}</span>
                      <span className="text-foreground font-medium">{s.avg3G} Mbps</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t("telecom.peak4G")}</span>
                      <span className="text-primary font-medium">{s.peak4G} Mbps</span>
                    </div>
                  </>
                )}
                {"fibre" in s && s.fibre && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t("telecom.avgFibre")}</span>
                    <span className="text-primary font-medium">{s.fibre} Mbps</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
      <Disclaimer />
    </div>
  )
}
