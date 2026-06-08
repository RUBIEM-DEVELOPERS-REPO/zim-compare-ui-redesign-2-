"use client"

import { useState } from "react"
import { useAppStore } from "@/lib/store"
import { cn } from "@/lib/utils"
import { Disclaimer } from "@/components/disclaimer"
import { X } from "lucide-react"
import { useI18n } from "@/lib/i18n"
import type { DataBundle, TelecomProvider } from "@/lib/types"
import { TelecomCompareBar } from "./telecom-compare-bar"

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
  const bundleGroups = ["all", ...Array.from(new Set(bundles.map((b) => b.bundle_group || b.category).filter(Boolean)))]

  const filtered = bundles
    .filter((b) => selectedGroup === "all" || (b.bundle_group === selectedGroup || b.category === selectedGroup))
    .sort((a, b) => {
      if (sort === "price") return a.price - b.price
      if (sort === "total_data_mb") return (b.total_data_mb || 0) - (a.total_data_mb || 0)
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
      <TelecomCompareBar />
      <div className="flex flex-col gap-4">
        {/* Bundle Group filter tabs - Premium Glass Styling */}
        <div className="glass-tab-container flex flex-wrap gap-1.5 p-1.5 max-w-fit">
          {bundleGroups.map((g) => (
            <button
              key={g}
              onClick={() => setSelectedGroup(g)}
              className={cn(
                "glass-tab-base px-4 py-2 text-[10px] font-bold uppercase tracking-widest transition-all duration-300",
                selectedGroup === g ? "glass-tab-active" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {g === "all" ? "Neural All" : g}
            </button>
          ))}
        </div>

        {/* Sort Controls */}
        <div className="flex justify-end items-center gap-3">
          <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Sort Intelligence:</span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            title="Sort bundles"
            className="rounded-xl border border-white/10 bg-white/5 text-[10px] font-bold uppercase tracking-widest text-foreground px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500/20 transition-all appearance-none cursor-pointer hover:bg-white/10 shadow-sm"
          >
            <option value="price" className="bg-slate-900">{t("telecom.sort.price")}</option>
            <option value="total_data_mb" className="bg-slate-900">{t("telecom.sort.data")}</option>
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-border p-12 text-center col-span-full">
          <div className="bg-muted w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-bold text-foreground mb-2">No Bundles Detected</h3>
          <p className="text-muted-foreground mb-6 max-w-xs mx-auto text-xs uppercase tracking-widest leading-relaxed">
            {t("telecom.noBundlesDetail", { sub: selectedGroup === "all" ? "selected" : selectedGroup })}
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
                <div className="flex items-start justify-between mb-1">
                  <p className="text-sm font-bold text-foreground leading-tight uppercase tracking-tight">
                    {b.bundle_name || (b as any).name}
                  </p>
                  {(b.bundle_group || b.category) && (
                    <span className="ml-2 shrink-0 bg-teal-500/10 text-teal-500 text-[8px] font-black px-2 py-0.5 rounded-full border border-teal-500/20 uppercase tracking-tighter">
                      {b.bundle_group || b.category}
                    </span>
                  )}
                </div>
                <p className="text-xs font-medium text-muted-foreground mb-4 capitalize">
                  {(b.operator || (b as any).providerId || "provider").replace(/^tel-/, "").replace(/-/g, " ")}
                </p>

                <div className="grid grid-cols-2 gap-2 mb-4 text-[11px] font-medium">
                  <div className="rounded-xl bg-secondary/30 p-3">
                    <p className="text-muted-foreground uppercase tracking-tight mb-0.5">{t("telecom.price")}</p>
                    <p className="text-foreground">{b.currency || "$"} {b.price.toFixed(2)}</p>
                  </div>
                  <div className="rounded-xl bg-secondary/30 p-3">
                    <p className="text-muted-foreground uppercase tracking-tight mb-0.5">{t("telecom.data")}</p>
                    <p className="text-foreground">{formatData(b.total_data_mb || ((b as any).dataGB * 1024))}</p>
                  </div>
                  <div className="rounded-xl bg-secondary/30 p-3">
                    <p className="text-foreground">
                      {formatValidity(
                        b.validity_value || (b as any).validityDays || 0, 
                        b.validity_unit || ((b as any).validityDays ? "days" : "unknown")
                      )}
                    </p>
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

                {/* Signal Metrics & Social Extras */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {b.speedClass && (
                    <span className="bg-teal-500/10 text-teal-500 text-[8px] font-black px-2 py-0.5 rounded-full border border-teal-500/20 uppercase tracking-tighter">
                      {b.speedClass}
                    </span>
                  )}
                  {b.facebook_mb != null && (
                    <span className="bg-blue-500/10 text-blue-500 text-[8px] font-black px-2 py-0.5 rounded-full border border-blue-500/20 uppercase tracking-tighter">
                      FB {formatData(b.facebook_mb)}
                    </span>
                  )}
                  {b.instagram_mb != null && (
                    <span className="bg-pink-500/10 text-pink-500 text-[8px] font-black px-2 py-0.5 rounded-full border border-pink-500/20 uppercase tracking-tighter">
                      IG {formatData(b.instagram_mb)}
                    </span>
                  )}
                  {b.x_mb != null && (
                    <span className="bg-slate-500/10 text-slate-400 text-[8px] font-black px-2 py-0.5 rounded-full border border-slate-500/20 uppercase tracking-tighter">
                      X {formatData(b.x_mb)}
                    </span>
                  )}
                </div>

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

