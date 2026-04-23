"use client"

import { useState } from "react"
import { useAppStore } from "@/lib/store"
import { cn } from "@/lib/utils"
import { Disclaimer } from "@/components/disclaimer"
import { X } from "lucide-react"
import { useI18n } from "@/lib/i18n"
<<<<<<< Updated upstream
import { TelecomCompareBar } from "./telecom-compare-bar"
=======
import type { DataBundle, TelecomProvider } from "@prisma/client"
>>>>>>> Stashed changes

type SortKey = "price" | "total_data_mb"

interface TelecomDataProps {
  location?: string
  bundles?: DataBundle[]
  providers?: TelecomProvider[]
}

export function TelecomData({ location = "All Locations", bundles = [], providers = [] }: TelecomDataProps) {
  const [sort, setSort] = useState<SortKey>("price")
  const [selectedGroup, setSelectedGroup] = useState<string>("all")
  const { addToCompareTray, compareTray } = useAppStore()
  const { t } = useI18n()

  // Derive unique bundle groups from actual data
  const bundleGroups = ["all", ...Array.from(new Set(bundles.map((b) => b.bundle_group).filter(Boolean)))]

  const filtered = bundles
    .filter((b) => selectedGroup === "all" || b.bundle_group === selectedGroup)
    .sort((a, b) => {
      if (sort === "price") return a.price - b.price
      if (sort === "total_data_mb") return b.total_data_mb - a.total_data_mb
      return 0
    })

  const formatData = (mb: number) => {
    if (mb >= 1024) return `${(mb / 1024).toFixed(1)} GB`
    return `${mb} MB`
  }

  const formatValidity = (value: number, unit: string) => {
    if (unit === "days" && value === 1) return "1 day"
    if (unit === "days") return `${value} days`
    return `${value} ${unit}`
  }

  return (
    <div className="space-y-4">
<<<<<<< Updated upstream
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
              className="rounded-full border border-gray-200 bg-white text-[11px] font-medium uppercase tracking-wider text-gray-500 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500/20 transition-all appearance-none cursor-pointer hover:border-gray-300 shadow-sm"
              title="Sort by"
=======
      <div className="flex flex-col gap-2">
        {/* Bundle Group filter tabs */}
        <div className="flex flex-wrap gap-2">
          {bundleGroups.map((g) => (
            <button
              key={g}
              onClick={() => setSelectedGroup(g)}
              className={cn(
                "rounded-full px-4 py-1.5 text-xs font-semibold capitalize transition-all duration-200",
                selectedGroup === g
                  ? "bg-teal-600 text-white shadow"
                  : "bg-secondary text-muted-foreground hover:bg-secondary/80"
              )}
>>>>>>> Stashed changes
            >
              {g === "all" ? "All Bundles" : g}
            </button>
          ))}
        </div>

        {/* Sort */}
        <div className="flex justify-end">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="rounded-full border border-gray-200 bg-white text-[11px] font-bold uppercase tracking-wider text-gray-500 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500/20 transition-all appearance-none cursor-pointer hover:border-gray-300 shadow-sm"
          >
            <option value="price">{t("telecom.sort.price")}</option>
            <option value="total_data_mb">{t("telecom.sort.data")}</option>
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-border p-12 text-center col-span-full">
          <div className="bg-muted w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="w-8 h-8 text-muted-foreground" />
          </div>
<<<<<<< Updated upstream
          <h3 className="text-lg font-bold text-foreground mb-2">No bundles found</h3>
          <p className="text-muted-foreground mb-6 max-w-xs mx-auto">Upload telecom data via the Admin panel to see bundles here.</p>
=======
          <h3 className="text-lg font-medium text-foreground mb-2">
            {t("telecom.noBundlesFound", { sub: t(`telecom.subTabs.${sub}`), location: location === "All Locations" ? t("common.allLocations") : location })}
          </h3>
          <p className="text-muted-foreground mb-6 max-w-xs mx-auto">
            {t("telecom.noBundlesDetail", { sub: t(`telecom.subTabs.${sub}`) })}
          </p>
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
                <div className="flex items-start justify-between mb-1">
                  <p className="text-sm font-bold text-foreground leading-tight">{b.bundle_name}</p>
                  {b.bundle_group && (
                    <span className="ml-2 shrink-0 bg-teal-50 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300 text-[9px] font-bold px-2 py-0.5 rounded-full border border-teal-100 dark:border-teal-800 capitalize">
                      {b.bundle_group}
                    </span>
                  )}
=======
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-medium text-foreground">{b.name}</p>
>>>>>>> Stashed changes
                </div>
                <p className="text-xs font-medium text-muted-foreground mb-4 capitalize">{b.operator.replace(/^tel-/, "").replace(/-/g, " ")}</p>

                <div className="grid grid-cols-2 gap-2 mb-4 text-[11px] font-medium">
                  <div className="rounded-xl bg-secondary/30 p-3">
                    <p className="text-muted-foreground uppercase tracking-tight mb-0.5">{t("telecom.price")}</p>
                    <p className="text-foreground">{b.currency} {b.price.toFixed(2)}</p>
                  </div>
                  <div className="rounded-xl bg-secondary/30 p-3">
                    <p className="text-muted-foreground uppercase tracking-tight mb-0.5">{t("telecom.data")}</p>
                    <p className="text-foreground">{formatData(b.total_data_mb)}</p>
                  </div>
                  <div className="rounded-xl bg-secondary/30 p-3">
                    <p className="text-muted-foreground uppercase tracking-tight mb-0.5">{t("telecom.validity")}</p>
                    <p className="text-foreground">{formatValidity(b.validity_value, b.validity_unit)}</p>
                  </div>
                  {b.peak_data_mb != null && (
                    <div className="rounded-xl bg-secondary/30 p-3">
                      <p className="text-muted-foreground uppercase tracking-tight mb-0.5">Peak</p>
                      <p className="text-foreground">{formatData(b.peak_data_mb)}</p>
                    </div>
                  )}
                  {b.offpeak_data_mb != null && (
                    <div className="rounded-xl bg-secondary/30 p-3">
                      <p className="text-muted-foreground uppercase tracking-tight mb-0.5">Off-Peak</p>
                      <p className="text-foreground">{formatData(b.offpeak_data_mb)}</p>
                    </div>
                  )}
                  {b.sms_count != null && (
                    <div className="rounded-xl bg-secondary/30 p-3">
                      <p className="text-muted-foreground uppercase tracking-tight mb-0.5">SMS</p>
                      <p className="text-foreground">{b.sms_count}</p>
                    </div>
                  )}
                </div>

<<<<<<< Updated upstream
                {/* Social media extras */}
                {(b.facebook_mb != null || b.instagram_mb != null || b.x_mb != null) && (
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {b.facebook_mb != null && (
                      <span className="bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 text-[9px] font-bold px-2 py-0.5 rounded-full border border-blue-100">
                        FB {formatData(b.facebook_mb)}
                      </span>
                    )}
                    {b.instagram_mb != null && (
                      <span className="bg-pink-50 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300 text-[9px] font-bold px-2 py-0.5 rounded-full border border-pink-100">
                        IG {formatData(b.instagram_mb)}
                      </span>
                    )}
                    {b.x_mb != null && (
                      <span className="bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 text-[9px] font-bold px-2 py-0.5 rounded-full border border-gray-200">
                        X {formatData(b.x_mb)}
                      </span>
                    )}
                  </div>
                )}
=======
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-teal-50 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300 text-[10px] font-medium px-2 py-0.5 rounded-full border border-teal-100 dark:border-teal-800">
                    {b.speedClass}
                  </span>
                </div>
>>>>>>> Stashed changes

                {b.extras && (
                  <p className="text-[10px] font-medium text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-900/30 rounded-lg px-3 py-2 mb-4 italic">
                    {b.extras}
                  </p>
                )}

                {b.ussd_code && (
                  <p className="text-[10px] font-mono text-muted-foreground mb-3">Dial: {b.ussd_code}</p>
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

