"use client"

import { useState } from "react"
import { schools } from "@/lib/mock/schools"
import { cn } from "@/lib/utils"
import { ScoreBadge } from "@/components/score-badge"
import { Disclaimer } from "@/components/disclaimer"
import { useI18n } from "@/lib/i18n"
import { X } from "lucide-react"

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
            <div className="rounded-xl border border-primary/20 bg-primary/5 p-5">
              <p className="text-xs text-muted-foreground mb-1">{t("schools.recommendedForYou")}</p>
              <p className="text-lg font-semibold text-foreground">{bestSchool.name}</p>
              <p className="text-sm text-muted-foreground mt-1">
                {t("schools.basedOnPreferences", { location: displayLocation })}
              </p>
              <Disclaimer />
            </div>
          )}

          {/* Quick Recommendation Cards */}
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {summaryCards.map((c) => (
              <div key={c.labelKey} className="rounded-xl border border-border bg-card p-4">
                <p className="text-xs text-muted-foreground">{t(`schools.${c.labelKey}`)}</p>
                <p className="text-sm font-semibold text-foreground mt-1">{c.value}</p>
                <p className="text-xs text-primary mt-1">
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
                className="rounded-xl border border-border bg-card p-4 text-left hover:border-primary/20 hover:shadow-md transition-all"
              >
                <p className="text-sm font-semibold text-foreground">{t(`schools.${card.labelKey}`)}</p>
                <p className="text-xs text-muted-foreground mt-1">{t(`schools.${card.subtitleKey}`)}</p>
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
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((school) => (
                <div key={school.id} className="rounded-xl border border-border bg-card p-4 hover:border-primary/20 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-semibold text-foreground">{school.name}</p>
                    <span className="text-[9px] font-black uppercase tracking-widest bg-teal-50 text-teal-700 px-2 py-0.5 rounded-full border border-teal-100">
                      {t(`schools.subTabs.${school.type}`)}
                    </span>
                  </div>
                  <div className="flex gap-2 flex-wrap mb-2">
                    <ScoreBadge score={school.academicScore} label={t("schools.academic")} />
                    <ScoreBadge score={school.safetyScore} label={t("schools.safety")} />
                  </div>
                  <p className="text-xs text-muted-foreground">{school.city}, {school.province}</p>
                  <p className="text-xs text-primary mt-1">{t("schools.perYear", { amount: school.totalAnnualCost.toLocaleString() })}</p>
                </div>
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  )
}
