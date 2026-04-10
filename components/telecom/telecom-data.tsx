"use client"

import { useState } from "react"
import { dataBundles } from "@/lib/mock/telecoms"
import { useAppStore } from "@/lib/store"
import { cn } from "@/lib/utils"
import { Disclaimer } from "@/components/disclaimer"
import { X } from "lucide-react"
import { useI18n } from "@/lib/i18n"
import { TelecomCompareBar } from "./telecom-compare-bar"

const subTabs = [
  { key: "daily", labelKey: "telecom.subTabs.daily" },
  { key: "weekly", labelKey: "telecom.subTabs.weekly" },
  { key: "monthly", labelKey: "telecom.subTabs.monthly" },
  { key: "night", labelKey: "telecom.subTabs.night" },
  { key: "social", labelKey: "telecom.subTabs.social" },
  { key: "unlimited", labelKey: "telecom.subTabs.unlimited" },
] as const

type SortKey = "price" | "costPerGB" | "dataGB"

interface TelecomDataProps {
  location?: string
}

export function TelecomData({ location = "All Locations" }: TelecomDataProps) {
  const [sub, setSub] = useState<string>("monthly")
  const [sort, setSort] = useState<SortKey>("costPerGB")
  const { addToCompareTray, compareTray } = useAppStore()
  const { t } = useI18n()

  const filtered = dataBundles
    .filter((b) => b.category === sub)
    .sort((a, b) => (a[sort] as number) - (b[sort] as number))

  return (
    <div className="space-y-4">
      <TelecomCompareBar />
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex flex-col gap-2">
          {/* Sub-tabs - 3 Column Grid */}
          <div className="glass-tab-container grid grid-cols-3 sm:grid-cols-6 gap-1.5 p-1.5">
            {subTabs.map((t_item) => (
              <button
                key={t_item.key}
                onClick={() => setSub(t_item.key)}
                className={cn(
                  "glass-tab-base px-2 py-1 h-9 text-xs font-medium transition-all duration-300 text-center",
                  sub === t_item.key ? "glass-tab-active" : "text-muted-foreground"
                )}
              >
                {t(t_item.labelKey)}
              </button>
            ))}
          </div>

          <div className="flex justify-end">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="rounded-full border border-gray-200 bg-white text-[11px] font-bold uppercase tracking-wider text-gray-500 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500/20 transition-all appearance-none cursor-pointer hover:border-gray-300 shadow-sm"
              title="Sort by"
            >
              <option value="costPerGB">{t("telecom.sort.costPerGB")}</option>
              <option value="price">{t("telecom.sort.price")}</option>
              <option value="dataGB">{t("telecom.sort.data")}</option>
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
            {t("telecom.noBundlesFound", { sub: t(`telecom.subTabs.${sub}`), location: location === "All Locations" ? t("common.allLocations") : location })}
          </h3>
          <p className="text-muted-foreground mb-6 max-w-xs mx-auto">
            {t("telecom.noBundlesDetail", { sub: t(`telecom.subTabs.${sub}`) })}
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((b) => {
            const inTray = compareTray.ids.includes(b.id)
            return (
              <div
                key={b.id}
                className={cn(
                  "glass-card p-5 flex flex-col transition-all duration-300 group relative overflow-hidden",
                  "border-border hover:border-teal-200/50 hover:shadow-xl hover:shadow-teal-500/5 hover:-translate-y-1"
                )}
              >
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-bold text-foreground">{b.name}</p>
                </div>
                <p className="text-xs font-medium text-muted-foreground mb-4">{b.providerName}</p>

                <div className="grid grid-cols-2 gap-2 mb-4 text-[11px] font-bold">
                  <div className="rounded-xl bg-secondary/30 p-3">
                    <p className="text-muted-foreground uppercase tracking-tight mb-0.5">{t("telecom.price")}</p>
                    <p className="text-foreground">${b.price.toFixed(2)}</p>
                  </div>
                  <div className="rounded-xl bg-secondary/30 p-3">
                    <p className="text-muted-foreground uppercase tracking-tight mb-0.5">{t("telecom.data")}</p>
                    <p className="text-foreground">{b.dataGB >= 1 ? `${b.dataGB}GB` : `${b.dataGB * 1000}MB`}</p>
                  </div>
                  <div className="rounded-xl bg-secondary/30 p-3">
                    <p className="text-muted-foreground uppercase tracking-tight mb-0.5">{t("telecom.costPerGB")}</p>
                    <p className="text-teal-600 dark:text-teal-400">${b.costPerGB.toFixed(2)}</p>
                  </div>
                  <div className="rounded-xl bg-secondary/30 p-3">
                    <p className="text-muted-foreground uppercase tracking-tight mb-0.5">{t("telecom.validity")}</p>
                    <p className="text-foreground">{t("telecom.days", { count: b.validityDays, s: b.validityDays !== 1 ? "s" : "" })}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-teal-50 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-teal-100 dark:border-teal-800">
                    {b.speedClass}
                  </span>
                </div>

                {b.fupNote && (
                  <p className="text-[10px] font-medium text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-900/30 rounded-lg px-3 py-2 mb-4 italic">
                    {b.fupNote}
                  </p>
                )}

                <div className="mt-auto pt-2">
                  <button
                    onClick={() => addToCompareTray("telecom", b.id, "data")}
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
