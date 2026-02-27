"use client"

import { useState } from "react"
import { schools } from "@/lib/mock/schools"
import { cn } from "@/lib/utils"
import { useAppStore } from "@/lib/store"
import { Disclaimer } from "@/components/disclaimer"
import { X } from "lucide-react"
import { useI18n } from "@/lib/i18n"

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
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex flex-col gap-4">
          {/* Type Filter - Grid */}
          <div className="grid grid-cols-2 gap-2 rounded-2xl bg-white/20 dark:bg-black/20 backdrop-blur-xl border border-white/25 dark:border-white/10 shadow-[0_8px_25px_rgba(0,0,0,0.08)] p-2">
            {(["all", "boarding", "day", "both"] as TypeFilter[]).map((t_item) => (
              <button
                key={t_item}
                onClick={() => setTypeFilter(t_item)}
                className={cn(
                  "rounded-xl px-4 py-2 text-[10px] font-bold uppercase tracking-wider transition-all duration-300 text-center capitalize",
                  typeFilter === t_item
                    ? "bg-white/40 dark:bg-white/10 text-foreground shadow-[0_0_15px_rgba(45,212,191,0.5)]"
                    : "hover:bg-white/10 hover:backdrop-blur-2xl hover:brightness-125 hover:-translate-y-[1px] text-muted-foreground"
                )}
              >
                {t(`schools.subTabs.${t_item}`)}
              </button>
            ))}
          </div>

          <div className="flex justify-end">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="rounded-full border border-gray-200 bg-white text-[11px] font-bold uppercase tracking-wider text-gray-500 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500/20 transition-all appearance-none cursor-pointer hover:border-gray-300 shadow-sm"
            >
              <option value="totalAnnualCost">{t("schools.sort.costLowToHigh")}</option>
              <option value="passRate">{t("schools.sort.passRate")}</option>
              <option value="studentTeacherRatio">{t("schools.sort.studentTeacherRatio")}</option>
            </select>
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-border p-12 text-center col-span-full">
          <div className="bg-muted w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-bold text-foreground mb-2">
            {location !== "All Locations"
              ? typeFilter === "boarding"
                ? t("schools.noBoardingSchoolsFound")
                : t("schools.noSchoolsInCategoryFound")
              : t("schools.noSchoolsFound", { location: displayLocation })}
          </h3>
          <p className="text-muted-foreground mb-6 max-w-xs mx-auto">{t("schools.noSchoolsDetail")}</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border bg-secondary/30">
                <th className="text-left px-3 py-2 text-muted-foreground font-medium">Chikoro</th>
                <th className="text-left px-3 py-2 text-muted-foreground font-medium">{t("common.category")}</th>
                <th className="text-right px-3 py-2 text-muted-foreground font-medium">{t("schools.tuitionPerTerm")}</th>
                <th className="text-right px-3 py-2 text-muted-foreground font-medium">{t("schools.boardingPerTerm")}</th>
                <th className="text-right px-3 py-2 text-muted-foreground font-medium">{t("schools.annualTotal")}</th>
                <th className="text-right px-3 py-2 text-muted-foreground font-medium">{t("schools.passRate")}</th>
                <th className="text-center px-3 py-2 text-muted-foreground font-medium">{t("schools.ratio")}</th>
                <th className="text-center px-3 py-2 text-muted-foreground font-medium">{t("schools.compare")}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => {
                const inTray = compareTray.ids.includes(s.id)
                return (
                  <tr key={s.id} className="border-b border-border last:border-0 hover:bg-secondary/20">
                    <td className="px-3 py-2 text-foreground font-medium">{s.name}</td>
                    <td className="px-3 py-2 text-muted-foreground capitalize">{t(`schools.subTabs.${s.type}`)}</td>
                    <td className="px-3 py-2 text-right text-foreground">${s.tuitionPerTerm.toLocaleString()}</td>
                    <td className="px-3 py-2 text-right text-foreground">{s.boardingFeePerTerm ? `$${s.boardingFeePerTerm.toLocaleString()}` : "--"}</td>
                    <td className="px-3 py-2 text-right text-primary font-medium">${s.totalAnnualCost.toLocaleString()}</td>
                    <td className="px-3 py-2 text-right text-foreground">{s.passRate}%</td>
                    <td className="px-3 py-2 text-center text-foreground">1:{s.studentTeacherRatio}</td>
                    <td className="px-3 py-2 text-center">
                      <button
                        onClick={() => addToCompareTray("schools", s.id)}
                        disabled={inTray}
                        className={cn(
                          "rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider transition-all duration-300",
                          inTray
                            ? "bg-gray-100 text-gray-400 border border-gray-200 cursor-default"
                            : "bg-teal-600 text-white hover:bg-teal-700 shadow-md shadow-teal-500/10 active:scale-[0.98]"
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
