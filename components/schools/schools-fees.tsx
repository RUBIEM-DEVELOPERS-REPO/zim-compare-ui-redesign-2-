"use client"

import { useState } from "react"
import { schools } from "@/lib/mock/schools"
import { cn } from "@/lib/utils"
import { useAppStore } from "@/lib/store"
import { Disclaimer } from "@/components/disclaimer"
import { X } from "lucide-react"
import { useI18n } from "@/lib/i18n"
import { SchoolsCompareBar } from "./schools-compare-bar"

type SortKey = "totalAnnualCost" | "passRate" | "studentTeacherRatio"
type TypeFilter = "all" | "boarding" | "day" | "both"

interface SchoolsFeesProps {
  location?: string
}

export function SchoolsFees({ location = "All Locations" }: SchoolsFeesProps) {
  const [sort, setSort] = useState<SortKey>("totalAnnualCost")
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all")
  const { addToCompareTray, compareTray } = useAppStore()
  const { t } = useI18n()

  const displayLocation = location === "All Locations" ? t("common.allLocations") : location

  const filtered = schools
    .filter((s) => {
      const typeMatch = typeFilter === "all" || s.type === typeFilter
      const locationMatch = location === "All Locations" || s.city === location
      return typeMatch && locationMatch
    })
    .sort((a, b) => {
      if (sort === "totalAnnualCost") return a.totalAnnualCost - b.totalAnnualCost
      if (sort === "passRate") return b.passRate - a.passRate
      return a.studentTeacherRatio - b.studentTeacherRatio
    })

  return (
    <div className="space-y-4">
      <SchoolsCompareBar />
      <div className="flex flex-col sm:flex-row items-end sm:items-center justify-between gap-4 mb-4">
        {/* Type Filter - Centralized glass-tab-base */}
        <div className="flex flex-wrap gap-1.5">
          {(["all", "boarding", "day", "both"] as TypeFilter[]).map((t_item) => (
            <button
              key={t_item}
              onClick={() => setTypeFilter(t_item)}
              className={cn(
                "glass-tab-base text-[10px] font-medium uppercase tracking-[0.15em] px-5 py-2.5 transition-all duration-300",
                typeFilter === t_item
                  ? "glass-tab-active"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {t(`schools.subTabs.${t_item}`)}
            </button>
          ))}
        </div>

        <div className="relative group">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="glass-input text-[10px] font-medium uppercase tracking-widest px-6 py-2.5 pr-10 appearance-none cursor-pointer focus:border-primary/50"
            title="Sort by"
          >
            <option value="totalAnnualCost">{t("schools.sort.costLowToHigh")}</option>
            <option value="passRate">{t("schools.sort.passRate")}</option>
            <option value="studentTeacherRatio">{t("schools.sort.studentTeacherRatio")}</option>
          </select>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-primary">
            <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-border p-12 text-center col-span-full">
          <div className="bg-muted w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">
            {location !== "All Locations"
              ? typeFilter === "boarding"
                ? t("schools.noBoardingSchoolsFound")
                : t("schools.noSchoolsInCategoryFound")
              : t("schools.noSchoolsFound", { location: displayLocation })}
          </h3>
          <p className="text-muted-foreground mb-6 max-w-xs mx-auto">{t("schools.noSchoolsDetail")}</p>
        </div>
      ) : (
        <div className="overflow-x-auto glass-card border-white/10 shadow-2xl">
          <table className="w-full text-[11px]">
            <thead>
              <tr className="border-b border-white/10 bg-muted/40 uppercase tracking-[0.2em]">
                <th className="text-left px-4 py-4 font-medium text-muted-foreground leading-none">Chikoro</th>
                <th className="text-left px-4 py-4 font-medium text-muted-foreground leading-none">{t("common.category")}</th>
                <th className="text-right px-4 py-4 font-medium text-muted-foreground leading-none">{t("schools.tuitionPerTerm")}</th>
                <th className="text-right px-4 py-4 font-medium text-muted-foreground leading-none">{t("schools.boardingPerTerm")}</th>
                <th className="text-right px-4 py-4 font-medium text-muted-foreground leading-none">{t("schools.annualTotal")}</th>
                <th className="text-right px-4 py-4 font-medium text-muted-foreground leading-none">{t("schools.passRate")}</th>
                <th className="text-center px-4 py-4 font-medium text-muted-foreground leading-none">{t("schools.ratio")}</th>
                <th className="text-center px-4 py-4 font-medium text-muted-foreground leading-none">{t("schools.compare")}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => {
                const inTray = compareTray.ids.includes(s.id)
                return (
                  <tr key={s.id} className="border-b border-white/5 last:border-0 hover:bg-primary/5 transition-colors group">
                    <td className="px-4 py-4 text-foreground font-medium tracking-tight">{s.name}</td>
                    <td className="px-4 py-4">
                      <span className="text-[9px] font-medium uppercase tracking-widest bg-muted/30 px-2 py-1 rounded-lg border border-white/5">{t(`schools.subTabs.${s.type}`)}</span>
                    </td>
                    <td className="px-4 py-4 text-right tabular-nums text-foreground font-medium">${s.tuitionPerTerm.toLocaleString()}</td>
                    <td className="px-4 py-4 text-right tabular-nums text-foreground">{s.boardingFeePerTerm ? `$${s.boardingFeePerTerm.toLocaleString()}` : <span className="opacity-20">--</span>}</td>
                    <td className="px-4 py-4 text-right tabular-nums text-primary font-medium uppercase tracking-widest text-[12px]">${s.totalAnnualCost.toLocaleString()}</td>
                    <td className="px-4 py-4 text-right tabular-nums font-medium text-foreground">{s.passRate}%</td>
                    <td className="px-4 py-4 text-center tabular-nums font-medium text-muted-foreground">1:{s.studentTeacherRatio}</td>
                    <td className="px-4 py-4 text-center">
                      <button
                        onClick={() => addToCompareTray("schools", s.id, "fees")}
                        disabled={inTray}
                        className={cn(
                          "rounded-xl px-5 py-2 text-[9px] font-medium uppercase tracking-[0.2em] transition-all duration-300 shadow-lg active:scale-95",
                          inTray
                            ? "bg-muted/40 text-muted-foreground border border-white/5 cursor-default opacity-50"
                            : "bg-primary text-primary-foreground hover:bg-primary/90 shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5"
                        )}
                      >
                        {inTray ? t("schools.added") : t("schools.add")}
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
      <Disclaimer />
    </div>
  )
}

