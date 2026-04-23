"use client"

import { Disclaimer } from "@/components/disclaimer"
<<<<<<< Updated upstream
import { useAppStore } from "@/lib/store"
import { cn } from "@/lib/utils"
=======
import { cn, formatDate } from "@/lib/utils"
>>>>>>> Stashed changes
import { X, Plus, CheckCircle2 } from "lucide-react"
import { useI18n } from "@/lib/i18n"
<<<<<<< Updated upstream
import { useAppStore } from "@/lib/store"
import { TelecomCompareBar } from "./telecom-compare-bar"
=======
import type { TelecomProvider, DataBundle } from "@prisma/client"
>>>>>>> Stashed changes

const promos = [
  { providerId: "econet", provider: "Econet Wireless", name: "Weekend Data Blast", detail: "Double data on all bundles purchased Friday-Sunday", validUntil: "2026-03-31" },
  { providerId: "netone", provider: "NetOne", name: "OneFusion Family", detail: "Share data across 5 lines with OneFusion packages", validUntil: "2026-04-15" },
  { providerId: "telecel", provider: "Telecel", name: "Night Data x3", detail: "Triple night data on all night bundles", validUntil: "2026-02-28" },
  { providerId: "telone", provider: "TelOne", name: "Fibre Upgrade Free", detail: "Free speed upgrade for 3 months on new fibre installs", validUntil: "2026-03-15" },
  { providerId: "liquid", provider: "Liquid Telecom", name: "Business Fibre Discount", detail: "20% off first 6 months for SME fibre plans", validUntil: "2026-04-30" },
]

interface TelecomPackagesProps {
  location?: string
  bundles?: DataBundle[]
  providers?: TelecomProvider[]
}

export function TelecomPackages({ location = "All Locations", bundles = [], providers = [] }: TelecomPackagesProps) {
  const { t } = useI18n()
  const { addToCompareTray, compareTray } = useAppStore()
  const displayLocation = location === "All Locations" ? t("common.allLocations") : location

  const filteredProviders = location === "All Locations"
    ? providers
    : providers.filter(p => p.coverageCities.includes(location))

  // Best value: cheapest bundle per provider by cost-per-MB
  const bestValue = filteredProviders.map((p) => {
    const providerBundles = bundles.filter((b) => b.operator === p.id && b.total_data_mb > 0)
    const best = providerBundles.sort((a, b) => (a.price / a.total_data_mb) - (b.price / b.total_data_mb))[0]
    return best ? { provider: p.name, bundle: best } : null
  }).filter(Boolean)

  const filteredPromos = location === "All Locations"
    ? promos
    : promos.filter(pr => {
      const provider = providers.find(p => p.id === pr.providerId)
      return provider?.coverageCities.includes(location)
    })

  const formatData = (mb: number) => {
    if (mb >= 1024) return `${(mb / 1024).toFixed(1)}GB`
    return `${mb}MB`
  }

  return (
    <div className="space-y-6">
      <TelecomCompareBar />
      <section>
        <h3 className="text-sm font-medium text-foreground mb-3">{t("telecom.activePromos", { location: displayLocation })}</h3>
        {filteredPromos.length === 0 ? (
          <div className="glass-panel border-dashed p-8 text-center">
            <p className="text-sm text-muted-foreground">{t("telecom.noPromosFound", { location: displayLocation })}</p>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {filteredPromos.map((p) => (
              <div
                key={p.name}
                className="glass-floating p-6 transition-all duration-500 relative group overflow-hidden floating-hover border-white/5 bg-primary/5 teal-glow"
              >
                <div className="flex items-center justify-between mb-4 relative z-10">
                  <p className="text-lg font-display font-medium text-white leading-tight group-hover:text-primary transition-colors uppercase tracking-tight">{p.name}</p>
                  <div className="bg-primary text-primary-foreground px-3 py-1 rounded-xl text-[9px] font-medium uppercase tracking-[0.2em] shadow-lg teal-glow">
                    Signal Promo
                  </div>
                </div>
                <p className="text-[10px] font-medium text-primary/80 mb-4 uppercase tracking-[0.2em] opacity-80">{p.provider}</p>
                <p className="text-[11px] text-muted-foreground mb-6 font-sans leading-relaxed uppercase tracking-widest opacity-80">{p.detail}</p>
                <div className="flex items-center gap-2 text-[9px] text-muted-foreground font-medium uppercase tracking-widest border-t border-white/10 pt-4 mt-auto">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse shadow-[0_0_8px_rgba(20,184,166,0.5)]" />
                  {t("telecom.validUntil", { date: formatDate(p.validUntil) })}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <h3 className="text-sm font-medium text-foreground mb-3">{t("telecom.bestValueMonthly", { location: displayLocation })}</h3>
        {bestValue.length === 0 ? (
          <div className="glass-panel border-dashed p-12 text-center col-span-full">
            <div className="bg-muted w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <X className="w-8 h-8 text-muted-foreground" />
            </div>
<<<<<<< Updated upstream
            <h3 className="text-lg font-bold text-foreground mb-2">No bundles found</h3>
            <p className="text-muted-foreground mb-6 max-w-xs mx-auto">Upload telecom data via the Admin panel to see best value bundles.</p>
=======
            <h3 className="text-lg font-medium text-foreground mb-2">{t("telecom.noBundlesFound", { sub: t("telecom.subTabs.monthly"), location: displayLocation })}</h3>
            <p className="text-muted-foreground mb-6 max-w-xs mx-auto">{t("telecom.noBundlesDetail", { sub: t("telecom.subTabs.monthly") })}</p>
>>>>>>> Stashed changes
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {bestValue.map((item) => {
              if (!item) return null
              return (
                <div
                  key={item.provider}
                  className="glass-floating p-6 transition-all duration-500 group relative overflow-hidden floating-hover border-white/5 bg-white/5"
                >
<<<<<<< Updated upstream
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">{item.provider}</p>
                  <p className="text-sm font-bold text-foreground mt-1 group-hover:text-teal-600 transition-colors uppercase tracking-tight">{item.bundle.bundle_name}</p>
                  <div className="flex items-center gap-4 mt-4 mb-1">
                    <div className="flex flex-col">
                      <span className="text-[9px] text-muted-foreground font-black uppercase tracking-tighter">{t("telecom.data")}</span>
                      <span className="text-sm font-black text-foreground">{formatData(item.bundle.total_data_mb)}</span>
                    </div>
                    <div className="flex flex-col border-l border-border pl-4">
                      <span className="text-[9px] text-muted-foreground font-black uppercase tracking-tighter">{t("telecom.price")}</span>
                      <span className="text-sm font-black text-teal-600">{item.bundle.currency} {item.bundle.price.toFixed(2)}</span>
=======
                  <div className="absolute top-0 right-0 p-4 text-primary/5 -rotate-12 group-hover:rotate-0 transition-transform duration-1000">
                    <CheckCircle2 size={80} />
                  </div>
                  <p className="text-[9px] font-medium text-muted-foreground uppercase tracking-[0.2em] mb-2 opacity-60">{item.provider}</p>
                  <p className="text-lg font-display font-medium text-white mt-1 group-hover:text-primary transition-colors uppercase tracking-tight leading-tight relative z-10">{item.bundle.name}</p>
                  
                  <div className="grid grid-cols-2 gap-4 mt-8 mb-6 relative z-10">
                    <div className="glass-floating bg-white/5 p-3 border-white/10 shadow-inner group-hover:bg-primary/5 transition-colors duration-500">
                      <span className="text-[9px] text-muted-foreground font-medium uppercase tracking-widest opacity-60 mb-1 block">{t("telecom.data")}</span>
                      <span className="text-sm font-display font-medium text-white tabular-nums">{item.bundle.dataGB}GB</span>
                    </div>
                    <div className="glass-floating bg-primary/5 p-3 border-primary/20 shadow-inner group-hover:bg-primary/10 transition-colors duration-500 teal-glow">
                      <span className="text-[9px] text-muted-foreground font-medium uppercase tracking-widest opacity-60 mb-1 block">{t("telecom.price")}</span>
                      <span className="text-sm font-display font-medium text-primary tabular-nums">${item.bundle.price.toFixed(2)}</span>
>>>>>>> Stashed changes
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-white/10 relative z-10 mt-auto">
                    <p className="text-[9px] font-medium text-muted-foreground uppercase tracking-widest opacity-60 italic tabular-nums">${item.bundle.costPerGB.toFixed(2)} / GB Signal</p>
                    {(() => {
                      const inTray = compareTray.ids.includes(item.bundle.id)
                      return (
                        <button
                          onClick={() => addToCompareTray("telecom", item.bundle.id, "packages")}
                          className={cn(
                            "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500 shadow-xl teal-glow",
                            inTray ? "bg-primary text-primary-foreground scale-110" : "bg-white/5 border border-white/10 text-muted-foreground hover:bg-primary/20 hover:text-primary"
                          )}
                        >
                          {inTray ? <CheckCircle2 className="w-5 h-5" strokeWidth={3} /> : <Plus className="w-5 h-5" strokeWidth={3} />}
                        </button>
                      )
                    })()}
                  </div>
<<<<<<< Updated upstream
                  <p className="text-[10px] font-bold text-muted-foreground mt-2 italic">
                    {item.bundle.total_data_mb > 0
                      ? `$${(item.bundle.price / (item.bundle.total_data_mb / 1024)).toFixed(2)} / GB`
                      : "Per bundle"}
                  </p>
=======
>>>>>>> Stashed changes
                </div>
              )
            })}
          </div>
        )}
      </section>
      <Disclaimer />
    </div>
  )
}

