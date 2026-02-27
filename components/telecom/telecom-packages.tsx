"use client"

import { dataBundles, telecomProviders } from "@/lib/mock/telecoms"
import { Disclaimer } from "@/components/disclaimer"
import { cn } from "@/lib/utils"
import { X } from "lucide-react"
import { useI18n } from "@/lib/i18n"

const promos = [
  { providerId: "econet", provider: "Econet Wireless", name: "Weekend Data Blast", detail: "Double data on all bundles purchased Friday-Sunday", validUntil: "2026-03-31" },
  { providerId: "netone", provider: "NetOne", name: "OneFusion Family", detail: "Share data across 5 lines with OneFusion packages", validUntil: "2026-04-15" },
  { providerId: "telecel", provider: "Telecel", name: "Night Data x3", detail: "Triple night data on all night bundles", validUntil: "2026-02-28" },
  { providerId: "telone", provider: "TelOne", name: "Fibre Upgrade Free", detail: "Free speed upgrade for 3 months on new fibre installs", validUntil: "2026-03-15" },
  { providerId: "liquid", provider: "Liquid Telecom", name: "Business Fibre Discount", detail: "20% off first 6 months for SME fibre plans", validUntil: "2026-04-30" },
]

interface TelecomPackagesProps {
  location?: string
}

export function TelecomPackages({ location = "All Locations" }: TelecomPackagesProps) {
  const { t } = useI18n()
  const displayLocation = location === "All Locations" ? t("common.allLocations") : location

  const filteredProviders = location === "All Locations"
    ? telecomProviders
    : telecomProviders.filter(p => p.coverageCities.includes(location))

  const bestValue = filteredProviders.map((p) => {
    const providerBundles = dataBundles.filter((b) => b.providerId === p.id && b.category === "monthly")
    const best = providerBundles.sort((a, b) => a.costPerGB - b.costPerGB)[0]
    return best ? { provider: p.name, bundle: best } : null
  }).filter(Boolean)

  const filteredPromos = location === "All Locations"
    ? promos
    : promos.filter(pr => {
      const provider = telecomProviders.find(p => p.id === pr.providerId)
      return provider?.coverageCities.includes(location)
    })

  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-sm font-semibold text-foreground mb-3">{t("telecom.activePromos", { location: displayLocation })}</h3>
        {filteredPromos.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-border p-8 text-center bg-card">
            <p className="text-sm text-muted-foreground">{t("telecom.noPromosFound", { location: displayLocation })}</p>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {filteredPromos.map((p) => (
              <div
                key={p.name}
                className={cn(
                  "rounded-2xl border bg-teal-50 border-teal-200/50 p-5 transition-all duration-300 relative group overflow-hidden",
                  "hover:shadow-lg hover:shadow-teal-500/5 hover:-translate-y-1"
                )}
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-bold text-foreground leading-tight">{p.name}</p>
                  <div className="bg-teal-600 text-white px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-sm">
                    Promo
                  </div>
                </div>
                <p className="text-[11px] font-bold text-teal-700/70 mb-3 uppercase tracking-wider">{p.provider}</p>
                <p className="text-xs text-foreground/80 mb-4 font-medium leading-relaxed">{p.detail}</p>
                <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-bold">
                  <div className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
                  {t("telecom.validUntil", { date: new Date(p.validUntil).toLocaleDateString() })}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <h3 className="text-sm font-semibold text-foreground mb-3">{t("telecom.bestValueMonthly", { location: displayLocation })}</h3>
        {bestValue.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-border p-12 text-center bg-card col-span-full">
            <div className="bg-muted w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <X className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-bold text-foreground mb-2">{t("telecom.noBundlesFound", { sub: t("telecom.subTabs.monthly"), location: displayLocation })}</h3>
            <p className="text-muted-foreground mb-6 max-w-xs mx-auto">{t("telecom.noBundlesDetail", { sub: t("telecom.subTabs.monthly") })}</p>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {bestValue.map((item) => {
              if (!item) return null
              return (
                <div
                  key={item.provider}
                  className={cn(
                    "rounded-2xl border border-border bg-card p-5 transition-all duration-300 group",
                    "hover:border-teal-200/50 hover:shadow-xl hover:shadow-teal-500/5 hover:-translate-y-1"
                  )}
                >
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">{item.provider}</p>
                  <p className="text-sm font-bold text-foreground mt-1 group-hover:text-teal-600 transition-colors uppercase tracking-tight">{item.bundle.name}</p>
                  <div className="flex items-center gap-4 mt-4 mb-1">
                    <div className="flex flex-col">
                      <span className="text-[9px] text-muted-foreground font-black uppercase tracking-tighter">{t("telecom.data")}</span>
                      <span className="text-sm font-black text-foreground">{item.bundle.dataGB}GB</span>
                    </div>
                    <div className="flex flex-col border-l border-border pl-4">
                      <span className="text-[9px] text-muted-foreground font-black uppercase tracking-tighter">{t("telecom.price")}</span>
                      <span className="text-sm font-black text-teal-600">${item.bundle.price.toFixed(2)}</span>
                    </div>
                  </div>
                  <p className="text-[10px] font-bold text-muted-foreground mt-2 italic">${item.bundle.costPerGB.toFixed(2)} / GB Value</p>
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
