"use client"

import { useState } from "react"
import { useAppStore } from "@/lib/store"
import { cn } from "@/lib/utils"
import { ScoreBadge } from "@/components/score-badge"
import { Disclaimer } from "@/components/disclaimer"
<<<<<<< Updated upstream
import { X, Plus, CheckCircle2 } from "lucide-react"
import { useI18n } from "@/lib/i18n"
import { useAppStore } from "@/lib/store"
import { cn } from "@/lib/utils"
import { TelecomCompareBar } from "./telecom-compare-bar"
=======
import { X, MapPin, Signal, Battery, Network, Globe2, AlertTriangle, ShieldCheck } from "lucide-react"
import { useI18n } from "@/lib/i18n"
import type { TelecomProvider } from "@prisma/client"
>>>>>>> Stashed changes

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
  providers?: TelecomProvider[]
}

export function TelecomCoverage({ location = "All Locations", providers = [] }: TelecomCoverageProps) {
  const { t } = useI18n()
  const { addToCompareTray, compareTray } = useAppStore()
  const displayLocation = location === "All Locations" ? t("common.allLocations") : location

  const filteredProviders = location === "All Locations"
    ? providers
    : providers.filter(p => (p.coverageCities || "[]").includes(location))

  return (
    <div className="space-y-6">
      <TelecomCompareBar />
      <section>
        <div className="flex items-center gap-3 mb-6">
            <CheckCircle2 size={16} className="text-primary" />
            <h3 className="text-[10px] font-medium text-white uppercase tracking-[0.3em] opacity-70">{t("telecom.providerOverview", { location: displayLocation })}</h3>
        </div>
        {filteredProviders.length === 0 ? (
            <div className="glass-floating border-dashed border-white/10 p-12 text-center col-span-full bg-white/5 floating-hover">
            <div className="bg-white/5 w-16 h-16 rounded-[1.5rem] flex items-center justify-center mx-auto mb-4 border border-white/10 shadow-inner">
              <X className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-2xl font-display font-medium text-white mb-2 uppercase tracking-tight">{t("telecom.noCoverageData", { location: displayLocation })}</h3>
            <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-[0.2em] mb-6 max-w-xs mx-auto opacity-60">{t("telecom.noCoverageDetail")}</p>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProviders.map((p) => (
              <div key={p.id} className="glass-floating p-6 transition-all duration-500 flex flex-col relative group overflow-hidden floating-hover border-white/5 bg-white/5">
                <div className="absolute top-0 right-0 p-4 text-primary/5 -rotate-12 group-hover:rotate-0 transition-transform duration-1000">
                    <CheckCircle2 size={80} />
                </div>
                <div className="flex items-start justify-between mb-6 relative z-10">
                  <div>
                    <p className="text-xl font-display font-medium text-white group-hover:text-primary transition-colors tracking-tight uppercase leading-tight">{p.name}</p>
                    <p className="text-[10px] font-medium text-muted-foreground uppercase mt-2 tracking-[0.2em] opacity-60 font-sans">{p.networkType}</p>
                  </div>
                  {(() => {
                    const inTray = compareTray.ids.includes(p.id)
                    return (
                      <button
                        onClick={() => addToCompareTray("telecom", p.id, "coverage")}
                        className={cn(
                          "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500 shadow-xl teal-glow",
                          inTray ? "bg-primary text-primary-foreground scale-110" : "bg-white/5 border border-white/10 text-muted-foreground hover:bg-primary/20 hover:text-primary"
                        ) }
                        title={inTray ? t("common.addedToCompare") : t("common.addToCompare")}
                      >
                        {inTray ? <CheckCircle2 className="w-5 h-5" strokeWidth={3} /> : <Plus className="w-5 h-5" strokeWidth={3} />}
                      </button>
                    )
                  })()}
                </div>
                <div className="flex gap-4 flex-wrap mt-auto relative z-10">
                  <ScoreBadge score={p.coverageScore} label={t("telecom.coverage")} />
                  <ScoreBadge score={p.transparencyScore} label={t("telecom.transparency")} />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <div className="flex items-center gap-3 mb-6">
            <CheckCircle2 size={16} className="text-primary" />
            <h3 className="text-[10px] font-medium text-white uppercase tracking-[0.3em] opacity-70">{t("telecom.regionalCoverage")}</h3>
        </div>
        <div className="overflow-x-auto glass-floating border-white/10 bg-white/5">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-white/5 bg-white/5">
                <th className="text-left px-6 py-4 text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">{t("telecom.region")}</th>
                <th className="text-center px-4 py-4 text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">Econet</th>
                <th className="text-center px-4 py-4 text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">NetOne</th>
                <th className="text-center px-4 py-4 text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">Telecel</th>
                <th className="text-center px-4 py-4 text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">TelOne</th>
                <th className="text-center px-4 py-4 text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">Liquid</th>
              </tr>
            </thead>
            <tbody>
              {coverageByRegion.map((r) => (
                <tr key={r.region} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                  <td className="px-6 py-4 text-white font-display font-medium uppercase tracking-tight text-sm">{r.region}</td>
                  {[r.econet, r.netone, r.telecel, r.telone, r.liquid].map((val, i) => (
                    <td key={i} className="px-4 py-4 text-center">
                      <span className={cn("inline-block rounded-lg px-3 py-1 text-[10px] font-medium uppercase tracking-widest border shadow-inner", getCellColor(val))}>
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
        <div className="flex items-center gap-3 mb-6">
            <CheckCircle2 size={16} className="text-primary" />
            <h3 className="text-[10px] font-medium text-white uppercase tracking-[0.3em] opacity-70">{t("telecom.avgSpeeds")}</h3>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {speedData.map((s) => (
            <div key={s.provider} className="glass-floating p-6 border-white/5 bg-white/5 floating-hover">
              <div className="flex items-center justify-between mb-6">
                 <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-[0.2em] opacity-60">{s.provider}</p>
                 <div className="w-1.5 h-1.5 rounded-full bg-primary teal-glow animate-pulse" />
              </div>
              <div className="space-y-4 text-[10px] font-medium uppercase tracking-[0.2em]">
                {s.avg4G > 0 && (
                  <>
                    <div className="flex justify-between items-center group/metric">
                      <span className="text-muted-foreground group-hover:text-white transition-colors">{t("telecom.avg4G")}</span>
                      <span className="text-white tabular-nums">{s.avg4G} Mbps</span>
                    </div>
                    <div className="flex justify-between items-center group/metric">
                      <span className="text-muted-foreground group-hover:text-white transition-colors">{t("telecom.avg3G")}</span>
                      <span className="text-white tabular-nums">{s.avg3G} Mbps</span>
                    </div>
                    <div className="flex justify-between items-center border-t border-white/10 pt-4 group/metric">
                      <span className="text-primary">{t("telecom.peak4G")}</span>
                      <span className="text-xl font-display text-white tabular-nums">{s.peak4G} Mb</span>
                    </div>
                  </>
                )}
                {"fibre" in s && s.fibre && (
                  <div className="flex justify-between items-center border-t border-white/10 pt-4 group/metric">
                    <span className="text-primary">{t("telecom.avgFibre")}</span>
                    <span className="text-xl font-display text-white tabular-nums">{s.fibre} Mb</span>
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

