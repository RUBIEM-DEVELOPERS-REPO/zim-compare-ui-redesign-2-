"use client"

import { useState } from "react"
import { policies } from "@/lib/mock/insurance"
import { useAppStore } from "@/lib/store"
import { cn } from "@/lib/utils"
import { Disclaimer } from "@/components/disclaimer"
import { X } from "lucide-react"
import { insuranceProviders } from "@/lib/mock/insurance"
import { useI18n } from "@/lib/i18n"

type SortKey = "monthlyPremium" | "coverLimit" | "excess"

export function InsurancePolicies({ location = "All Locations" }: { location?: string }) {
  const [cat, setCat] = useState<string>("motor")
  const [sort, setSort] = useState<SortKey>("monthlyPremium")
  const { addToCompareTray, compareTray } = useAppStore()
  const { t } = useI18n()

  const categories = [
    { key: "motor", label: t("insurance.subTabs.motor") },
    { key: "medical", label: t("insurance.subTabs.medical") },
    { key: "life_funeral", label: t("insurance.subTabs.life_funeral") },
    { key: "property_business", label: t("insurance.subTabs.property_business") },
  ]

  const filtered = policies
    .filter((p) => {
      const categoryMatch = p.category === cat
      if (!categoryMatch) return false
      if (location === "All Locations") return true
      const provider = insuranceProviders.find(ip => ip.id === p.providerId)
      return provider?.serviceAreas.includes(location)
    })
    .sort((a, b) => {
      if (sort === "monthlyPremium") return a.monthlyPremium - b.monthlyPremium
      if (sort === "coverLimit") return b.coverLimit - a.coverLimit
      return a.excess - b.excess
    })

  const displayLocation = location === "All Locations" ? t("common.allLocations") : location

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-2">
            {categories.map((c) => (
              <button
                key={c.key}
                onClick={() => setCat(c.key)}
                className={cn(
                  "rounded-full px-4 py-2 text-[10px] font-bold uppercase tracking-wider border transition-all duration-300 text-center",
                  cat === c.key
                    ? "bg-teal-50 border-teal-200 text-teal-700 shadow-sm"
                    : "bg-white border-gray-100 text-gray-400 hover:border-gray-200 hover:bg-gray-50"
                )}
              >
                {c.label}
              </button>
            ))}
          </div>

          <div className="flex justify-end">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="rounded-full border border-gray-200 bg-white text-[11px] font-bold uppercase tracking-wider text-gray-500 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500/20 transition-all appearance-none cursor-pointer hover:border-gray-300 shadow-sm"
            >
              <option value="monthlyPremium">{t("insurance.sort.monthlyPremium")}</option>
              <option value="coverLimit">{t("insurance.sort.coverLimit")}</option>
              <option value="excess">{t("insurance.sort.excess")}</option>
            </select>
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-border p-12 text-center">
          <div className="bg-muted w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-bold text-foreground mb-2">{t("insurance.noPoliciesFound", { location: displayLocation })}</h3>
          <p className="text-muted-foreground mb-6 max-w-xs mx-auto">{t("insurance.noPoliciesDetail")}</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => {
            const inTray = compareTray.ids.includes(p.id)
            return (
              <div
                key={p.id}
                className={cn(
                  "rounded-2xl border bg-card p-5 flex flex-col transition-all duration-300 relative group overflow-hidden",
                  "border-border hover:border-teal-200/50 hover:shadow-2xl hover:shadow-teal-500/5 hover:-translate-y-1"
                )}
              >
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-bold text-foreground group-hover:text-teal-600 transition-colors uppercase tracking-tight">{p.name}</p>
                </div>
                <p className="text-xs font-medium text-muted-foreground mb-4">{p.providerName}</p>

                <div className="grid grid-cols-2 gap-2 mb-4 text-[11px] font-bold">
                  <div className="rounded-xl bg-secondary/30 p-3">
                    <p className="text-muted-foreground uppercase tracking-tight mb-0.5">{t("insurance.monthly")}</p>
                    <p className="text-foreground">${p.monthlyPremium}</p>
                  </div>
                  <div className="rounded-xl bg-secondary/30 p-3">
                    <p className="text-muted-foreground uppercase tracking-tight mb-0.5">{t("insurance.annual")}</p>
                    <p className="text-foreground">${p.annualPremium}</p>
                  </div>
                  <div className="rounded-xl bg-secondary/30 p-3">
                    <p className="text-muted-foreground uppercase tracking-tight mb-0.5">{t("insurance.coverLimit")}</p>
                    <p className="text-teal-600 dark:text-teal-400">${p.coverLimit.toLocaleString()}</p>
                  </div>
                  <div className="rounded-xl bg-secondary/30 p-3">
                    <p className="text-muted-foreground uppercase tracking-tight mb-0.5">{t("insurance.excess")}</p>
                    <p className="text-foreground font-black">${p.excess}</p>
                  </div>
                </div>

                {p.waitingPeriodDays > 0 && (
                  <p className="text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-900/30 rounded-lg px-3 py-1.5 mb-3 italic">
                    {t("insurance.waitingPeriod", { days: p.waitingPeriodDays })}
                  </p>
                )}

                <div className="mb-3">
                  <p className="text-[10px] font-black text-muted-foreground mb-2 uppercase tracking-widest">{t("insurance.coreBenefits")}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {p.benefits.slice(0, 4).map((b) => (
                      <span key={b} className="text-[10px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-100 dark:border-emerald-800">{b}</span>
                    ))}
                    {p.benefits.length > 4 && (
                      <span className="text-[10px] font-bold text-muted-foreground self-center">+{p.benefits.length - 4}</span>
                    )}
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-[10px] font-black text-muted-foreground mb-2 uppercase tracking-widest">{t("insurance.keyExclusions")}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {p.exclusions.slice(0, 3).map((e) => (
                      <span key={e} className="text-[10px] font-bold bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300 px-2 py-0.5 rounded-full border border-red-100 dark:border-red-800">{e}</span>
                    ))}
                  </div>
                </div>

                <div className="mt-auto pt-2">
                  <button
                    onClick={() => addToCompareTray("insurance", p.id, "policies")}
                    className={cn(
                      "btn-compare-standard w-full",
                      inTray && "opacity-60"
                    )}
                  >
                    {inTray ? t("common.addedToCompare") : t("common.addToCompare")}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <Disclaimer />
    </div>
  )
}
