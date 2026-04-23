"use client"

import { useState } from "react"
import { policies } from "@/lib/mock/insurance"
import { useAppStore } from "@/lib/store"
import { cn } from "@/lib/utils"
import { Disclaimer } from "@/components/disclaimer"
import { X, ShieldCheck, Clock, ChevronLeft } from "lucide-react"
import { insuranceProviders } from "@/lib/mock/insurance"
import { useI18n } from "@/lib/i18n"

const CATEGORY_SORT_OPTIONS: Record<string, string[]> = {
  motor: ["Full Cover", "Third Party", "Third Party Fire and Theft"],
  medical: ["Individual Cover", "Family Cover", "Corporate Cover", "In-Patient Cover", "Out-Patient Cover"],
  life_funeral: ["Individual Plan", "Family Plan", "Extended Family Plan", "Cash Plan", "Service Plan"],
  property_business: ["Building Cover", "Contents Cover", "Combined Home Cover", "All Risks Cover", "Landlord Cover"],
}

export function InsurancePolicies({ location = "All Locations" }: { location?: string }) {
  const [cat, setCat] = useState<string>("motor")
  const [sort, setSort] = useState<string>(CATEGORY_SORT_OPTIONS["motor"][0])
  const { addToCompareTray, compareTray } = useAppStore()
  const { t } = useI18n()

  const categories = [
    { key: "motor", label: t("insurance.subTabs.motor") },
    { key: "medical", label: t("insurance.subTabs.medical") },
    { key: "life_funeral", label: t("insurance.subTabs.life_funeral") },
    { key: "property_business", label: t("insurance.subTabs.property_business") },
  ]

  const handleCatChange = (newCat: string) => {
    setCat(newCat)
    setSort(CATEGORY_SORT_OPTIONS[newCat][0])
  }

  const filtered = policies
    .filter((p) => {
      const categoryMatch = p.category === cat
      if (!categoryMatch) return false
      
      const typeMatch = p.type === sort
      if (!typeMatch) return false

      if (location === "All Locations") return true
      const provider = insuranceProviders.find(ip => ip.id === p.providerId)
      return provider?.serviceAreas.includes(location)
    })
    .sort((a, b) => a.monthlyPremium - b.monthlyPremium)

  const displayLocation = location === "All Locations" ? t("common.allLocations") : location

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-white/5 p-1 rounded-xl border border-white/10 shadow-inner">
            {categories.map((c) => (
              <button
                key={c.key}
                onClick={() => handleCatChange(c.key)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-[9px] font-medium uppercase tracking-[0.2em] transition-all duration-500",
                  cat === c.key
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/20 scale-[1.02]"
                    : "text-muted-foreground hover:text-white hover:bg-white/5"
                )}
              >
                {c.label}
              </button>
            ))}
          </div>

          <div className="flex justify-end relative">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="glass-floating text-[9px] font-medium uppercase tracking-[0.2em] text-primary/80 px-4 py-1.5 focus:outline-none cursor-pointer bg-primary/5 border-primary/20 hover:bg-primary/10 transition-all appearance-none outline-none ring-0 shadow-lg teal-glow pr-8"
              title="Sort Logic"
            >
              {CATEGORY_SORT_OPTIONS[cat].map((option) => (
                <option key={option} value={option} className="bg-[#0A0A0A] text-white">
                  {option}
                </option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-primary/60">
                <ChevronLeft size={14} className="-rotate-90" />
            </div>
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-border p-12 text-center">
          <div className="bg-muted w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">{t("insurance.noPoliciesFound", { location: displayLocation })}</h3>
          <p className="text-muted-foreground mb-6 max-w-xs mx-auto">{t("insurance.noPoliciesDetail")}</p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => {
            const inTray = compareTray.ids.includes(p.id)
            return (
              <div
                key={p.id}
                className="glass-floating p-3.5 flex flex-col transition-all duration-500 relative group overflow-hidden floating-hover border-white/5 rounded-xl"
              >
                <div className="absolute top-0 right-0 p-2 text-primary/5 -rotate-12 group-hover:rotate-0 transition-transform duration-1000">
                    <ShieldCheck size={60} />
                </div>

                <div className="flex items-center justify-between mb-0.5 relative z-10">
                  <p className="text-base font-display font-medium text-white group-hover:text-primary transition-colors uppercase tracking-tight leading-tight">{p.name}</p>
                </div>
                <p className="text-[9px] font-medium text-muted-foreground uppercase mt-1 tracking-[0.1em] opacity-60 font-sans mb-3.5 relative z-10">{p.providerName}</p>

                <div className="grid grid-cols-2 gap-2 mb-3.5 relative z-10">
                  <div className="glass-floating bg-white/5 p-2 border-white/10 shadow-inner group-hover:bg-primary/5 group-hover:border-primary/20 transition-all duration-500 rounded-lg">
                    <p className="text-[8px] font-medium text-muted-foreground uppercase tracking-[0.15em] mb-0.5 opacity-60">{t("insurance.monthly")}</p>
                    <p className="text-xs font-display font-medium text-white tabular-nums">${p.monthlyPremium}</p>
                  </div>
                  <div className="glass-floating bg-white/5 p-2 border-white/10 shadow-inner group-hover:bg-primary/5 group-hover:border-primary/20 transition-all duration-500 rounded-lg">
                    <p className="text-[8px] font-medium text-muted-foreground uppercase tracking-[0.15em] mb-0.5 opacity-60">{t("insurance.excess")}</p>
                    <p className="text-xs font-display font-medium text-primary tabular-nums">${p.excess}</p>
                  </div>
                  <div className="glass-floating bg-white/5 p-2 border-white/10 shadow-inner group-hover:bg-primary/5 group-hover:border-primary/20 transition-all duration-500 col-span-2 rounded-lg">
                    <p className="text-[8px] font-medium text-muted-foreground uppercase tracking-[0.15em] mb-0.5 opacity-60">{t("insurance.coverLimit")}</p>
                    <p className="text-base font-display font-medium text-white tabular-nums">${p.coverLimit.toLocaleString()}</p>
                  </div>
                </div>

                {p.waitingPeriodDays > 0 && (
                  <div className="flex items-center gap-1.5 text-[9px] font-medium text-amber-500 uppercase tracking-widest bg-amber-500/5 border border-amber-500/20 px-2.5 py-1.5 rounded-lg mb-3.5 relative z-10 shadow-inner">
                    <Clock size={11} strokeWidth={3} />
                    {t("insurance.waitingPeriod", { days: p.waitingPeriodDays })}
                  </div>
                )}

                <div className="mb-3.5 relative z-10">
                  <p className="text-[8px] font-medium text-muted-foreground mb-1.5 uppercase tracking-[0.2em] opacity-70">{t("insurance.coreBenefits")}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {p.benefits.slice(0, 3).map((b) => (
                      <span key={b} className="text-[8px] font-medium uppercase tracking-widest bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-md border border-emerald-500/20 shadow-inner">{b}</span>
                    ))}
                  </div>
                </div>

                <div className="mb-4 relative z-10">
                  <p className="text-[8px] font-medium text-muted-foreground mb-1.5 uppercase tracking-[0.2em] opacity-70">{t("insurance.keyExclusions")}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {p.exclusions.slice(0, 2).map((e) => (
                      <span key={e} className="text-[8px] font-medium uppercase tracking-widest bg-red-500/10 text-red-400 px-2 py-0.5 rounded-md border border-red-500/20 shadow-inner">{e}</span>
                    ))}
                  </div>
                </div>

                <div className="mt-auto pt-3 relative z-10 flex gap-2">
                  <button
                    onClick={() => addToCompareTray("insurance", p.id, "policies")}
                    className={cn(
                      "flex-1 px-3 py-2 rounded-lg text-[9px] font-medium uppercase tracking-[0.2em] transition-all duration-500",
                      inTray 
                        ? "bg-white/5 text-muted-foreground border border-white/10 opacity-50 cursor-not-allowed" 
                        : "bg-primary text-primary-foreground shadow-md shadow-primary/20 hover:scale-[1.05] active:scale-95 teal-glow"
                    )}
                    disabled={inTray}
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

