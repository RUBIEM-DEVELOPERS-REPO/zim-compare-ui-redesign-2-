"use client"

import { useState } from "react"
import { schools } from "@/lib/mock/schools"
import { cn } from "@/lib/utils"
import { ScoreBadge } from "@/components/score-badge"
import { Disclaimer } from "@/components/disclaimer"
import { useI18n } from "@/lib/i18n"
import { useAppStore } from "@/lib/store"
import { SchoolsCompareBar } from "./schools-compare-bar"
import { X, Check } from "lucide-react"

const summaryCards = [
  { labelKey: "mostAffordable", value: "Prince Edward School", detailKey: "perYear", detailVars: { amount: "3,300" } },
  { labelKey: "bestAcademic", value: "Peterhouse Boys", detailKey: "passRate", detailVars: { rate: "98" } },
  { labelKey: "bestSafety", value: "Peterhouse Boys", detailKey: "safetyScore", detailVars: { score: "92" } },
  { labelKey: "bestBoarding", value: "Peterhouse Boys", detailKey: "academicScore", detailVars: { score: "95" } },
]

const tabCards = [
  { key: "fees", labelKey: "feesRankings", subtitleKey: "feesSubtitle" },
  { key: "academics", labelKey: "academics", subtitleKey: "academicsSubtitle" },
  { key: "facilities", labelKey: "facilitiesSafety", subtitleKey: "facilitiesSubtitle" },
  { key: "profiles", labelKey: "schoolProfiles", subtitleKey: "profilesSubtitle" },
]

const schoolTypes = [
  { key: "all", labelKey: "all" },
  { key: "day", labelKey: "day" },
  { key: "boarding", labelKey: "boarding" },
  { key: "both", labelKey: "both" },
] as const

interface SchoolsOverviewProps {
  onTabChange: (tab: string) => void
  location?: string
}

export function SchoolsOverview({ onTabChange, location = "All Locations" }: SchoolsOverviewProps) {
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const { compareTray, addToCompareTray, removeFromCompareTray } = useAppStore()
  const { t } = useI18n()

  const displayLocation = location === "All Locations" ? t("common.allLocations") : location

  const filtered = schools.filter((s) => {
    const typeMatch = typeFilter === "all" || s.type === typeFilter
    const locationMatch = location === "All Locations" || s.city === location
    return typeMatch && locationMatch
  })

  const bestSchool = filtered.length > 0 ? filtered[0] : null

  return (
    <div className="space-y-6">
      <SchoolsCompareBar />
      {filtered.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-border p-12 text-center">
          <div className="bg-muted w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-bold text-foreground mb-2">{t("schools.noSchoolsFound", { location: displayLocation })}</h3>
          <p className="text-muted-foreground mb-6 max-w-xs mx-auto">{t("schools.noSchoolsDetail")}</p>
        </div>
      ) : (
        <>
          {bestSchool && (
            <div className="glass-panel p-6 bg-primary/5 border-primary/20 shadow-xl overflow-hidden relative">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Check className="h-24 w-24 text-primary" />
              </div>
              <div className="relative z-10">
                <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-2 px-2 py-1 bg-primary/10 rounded-full inline-block">{t("schools.recommendedForYou")}</p>
                <h2 className="text-2xl font-bold text-foreground tracking-tight">{bestSchool.name}</h2>
                <p className="text-sm text-muted-foreground mt-2 max-w-lg leading-relaxed">
                  {t("schools.basedOnPreferences", { location: displayLocation })}
                </p>
                <Disclaimer />
              </div>
            </div>
          )}

          {/* Quick Recommendation Cards */}
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {summaryCards.map((c) => (
              <div key={c.labelKey} className="glass-card p-4 group">
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1.5">{t(`schools.${c.labelKey}`)}</p>
                <p className="text-sm font-black text-foreground tabular-nums">{c.value}</p>
                <p className="text-[10px] font-black text-primary mt-1.5 uppercase tracking-tighter italic">
                  {c.detailKey === "perYear"
                    ? t("schools.perYear", c.detailVars as unknown as Record<string, string | number>)
                    : c.detailKey === "passRate"
                      ? `${c.detailVars?.rate}% ${t("schools.passRate").toLowerCase()}`
                      : `${c.detailVars?.score}% ${t("schools.safety").toLowerCase()}`
                  }
                </p>
              </div>
            ))}
          </div>

          {/* Overview Highlight Cards */}
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {tabCards.map((card) => (
              <button
                key={card.key}
                onClick={() => onTabChange(card.key)}
                className="glass-card p-5 text-left group hover:border-primary/40 transition-all"
              >
                <p className="text-[11px] font-black text-foreground uppercase tracking-widest group-hover:text-primary transition-colors">{t(`schools.${card.labelKey}`)}</p>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-tight mt-1.5 group-hover:text-foreground transition-colors">{t(`schools.${card.subtitleKey}`)}</p>
              </button>
            ))}
          </div>

          {/* School Type Filters */}
          <div className="flex flex-wrap gap-1">
            {schoolTypes.map((t_item) => (
              <button
                key={t_item.key}
                onClick={() => setTypeFilter(t_item.key)}
                className={cn(
                  "shrink-0 h-8 glass-tab-base",
                  typeFilter === t_item.key
                    ? "glass-tab-active"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {t(`schools.subTabs.${t_item.key}`)}
              </button>
            ))}
          </div>

          {/* All Schools */}
          <section>
            <h3 className="text-sm font-semibold text-foreground mb-3">
              {t("schools.schoolsInLocation", {
                type: typeFilter === "all" ? t("schools.allSchools") : t(`schools.subTabs.${typeFilter}`),
                location: displayLocation,
                count: filtered.length
              })}
            </h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((school) => (
                <div key={school.id} className="glass-card p-5 group hover:border-primary/40">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="text-sm font-bold text-foreground group-hover:text-primary transition-colors tracking-tight">{school.name}</p>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-tight mt-1">{school.city}, {school.province}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-black uppercase tracking-widest bg-primary/10 text-primary px-2.5 py-1 rounded-full border border-primary/10 shadow-sm">
                        {t(`schools.subTabs.${school.type}`)}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2 flex-wrap mb-4">
                    <ScoreBadge score={school.academicScore} label={t("schools.academic")} />
                    <ScoreBadge score={school.safetyScore} label={t("schools.safety")} />
                  </div>
                  
                  <div className="bg-muted/30 p-3 rounded-xl border border-white/5 mb-5 relative group/cost overflow-hidden">
                    <div className="absolute right-0 top-0 p-2 opacity-5 scale-150 rotate-12">
                      <Check className="text-primary w-8 h-8" />
                    </div>
                    <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-1">{t("schools.annualCost")}</p>
                    <p className="text-sm font-black text-primary tabular-nums">${school.totalAnnualCost.toLocaleString()}</p>
                  </div>
                  
                  <div className="mt-auto pt-4 border-t border-border flex justify-end">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        if (compareTray.ids.includes(school.id)) {
                          removeFromCompareTray(school.id)
                        } else {
                          addToCompareTray("schools", school.id, "overview")
                        }
                      }}
                      className={cn(
                        "rounded-xl px-5 py-2 text-[10px] font-black uppercase tracking-widest transition-all duration-300 border shadow-lg hover:scale-105 active:scale-95",
                        compareTray.ids.includes(school.id)
                          ? "bg-primary/20 border-primary/30 text-primary"
                          : "bg-primary text-primary-foreground border-transparent shadow-primary/20"
                      )}
                    >
                      {compareTray.ids.includes(school.id) ? (
                        <span className="flex items-center gap-1.5"><Check size={12} /> {t("common.added")}</span>
                      ) : (
                        t("common.addToCompare")
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  )
}
