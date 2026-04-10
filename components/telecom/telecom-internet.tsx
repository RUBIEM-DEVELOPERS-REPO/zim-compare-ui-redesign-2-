"use client"

import { useState } from "react"
import { dataBundles, telecomProviders } from "@/lib/mock/telecoms"
import { useAppStore } from "@/lib/store"
import { cn } from "@/lib/utils"
import { Disclaimer } from "@/components/disclaimer"
import { X, Wifi, ShieldCheck, Zap, Globe } from "lucide-react"
import { useI18n } from "@/lib/i18n"
import { TelecomCompareBar } from "./telecom-compare-bar"

type SortKey = "price" | "costPerGB" | "dataGB" | "speed"

interface TelecomInternetProps {
  location?: string
}

export function TelecomInternet({ location = "All Locations" }: TelecomInternetProps) {
  const [sort, setSort] = useState<SortKey>("price")
  const { addToCompareTray, compareTray } = useAppStore()
  const { t } = useI18n()

  const filtered = dataBundles
    .filter((b) => b.category === "internet")
    .filter((b) => {
      if (location === "All Locations") return true
      const provider = telecomProviders.find(p => p.id === b.providerId)
      return provider?.coverageCities.includes(location)
    })
    .sort((a, b) => {
      if (sort === "speed") {
        // Simple speed extraction for sorting: e.g. "Fibre 50Mbps" -> 50
        const speedA = parseInt(a.speedClass.match(/\d+/)?.[0] || "0")
        const speedB = parseInt(b.speedClass.match(/\d+/)?.[0] || "0")
        return speedB - speedA
      }
      return (a[sort as keyof typeof a] as number) - (b[sort as keyof typeof b] as number)
    })

  return (
    <div className="space-y-4">
      <TelecomCompareBar />
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/40 p-4 rounded-2xl border border-white/5 backdrop-blur-md">
        <div>
          <h3 className="text-sm font-bold text-slate-100 uppercase tracking-tight">Home & Office Internet</h3>
          <p className="text-[10px] text-slate-400 font-medium">Fibre, WiMAX, and Satellite ISP plans</p>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{t("common.sortBy")}</span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="rounded-xl border border-white/10 bg-slate-800 text-[11px] font-bold text-slate-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500/50 appearance-none cursor-pointer hover:bg-slate-700 transition-all shadow-xl"
            title="Sort by"
          >
            <option value="price">{t("telecom.sort.price")}</option>
            <option value="speed">{t("telecom.sort.speed")}</option>
            <option value="dataGB">{t("telecom.sort.data")}</option>
            <option value="costPerGB">{t("telecom.sort.costPerGB")}</option>
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-3xl border-2 border-dashed border-white/5 p-16 text-center bg-slate-900/20 backdrop-blur-sm">
          <div className="bg-slate-800/50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/5">
            <Wifi className="w-10 h-10 text-slate-600" />
          </div>
          <h3 className="text-xl font-bold text-slate-200 mb-2">
            No ISP plans found for {location}
          </h3>
          <p className="text-slate-400 mb-8 max-w-sm mx-auto text-sm leading-relaxed">
            We couldn't find any home internet or private WiFi plans specifically for this location. Try searching for "All Locations".
          </p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((b) => {
            const inTray = compareTray.ids.includes(b.id)
            const isFibre = b.speedClass.toLowerCase().includes("fibre")
            const isUnlimited = b.name.toLowerCase().includes("unlimited") || b.dataGB >= 100

            return (
              <div
                key={b.id}
                className={cn(
                  "glass-card p-6 flex flex-col transition-all duration-500 group relative overflow-hidden",
                  "border-white/5 hover:border-teal-500/30 hover:shadow-2xl hover:shadow-teal-500/10 hover:-translate-y-1.5",
                  isFibre && "bg-gradient-to-br from-slate-900/80 to-teal-900/10"
                )}
              >
                {/* Status Badges */}
                <div className="flex items-center gap-2 mb-4">
                  {isFibre && (
                    <span className="flex items-center gap-1 bg-teal-500/20 text-teal-400 text-[9px] font-black px-2 py-0.5 rounded-full border border-teal-500/30 uppercase tracking-widest">
                      <Zap size={10} className="fill-current" /> High Speed Fibre
                    </span>
                  )}
                  {isUnlimited && (
                    <span className="flex items-center gap-1 bg-purple-500/20 text-purple-400 text-[9px] font-black px-2 py-0.5 rounded-full border border-purple-500/30 uppercase tracking-widest">
                      <ShieldCheck size={10} /> Unlimited
                    </span>
                  )}
                </div>

                <div className="mb-2">
                  <h4 className="text-lg font-black text-white group-hover:text-teal-400 transition-colors leading-tight">{b.name}</h4>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter mt-1">{b.providerName}</p>
                </div>

                <div className="my-6 space-y-4">
                  <div className="flex items-end justify-between border-b border-white/5 pb-4">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-none mb-1">Monthly Price</span>
                      <span className="text-2xl font-black text-white leading-none">${b.price.toFixed(2)}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest block mb-1">Speed Class</span>
                      <span className="text-sm font-bold text-teal-400">{b.speedClass}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/5 rounded-2xl p-3 border border-white/5">
                      <span className="text-[9px] text-slate-500 font-black uppercase tracking-tight block mb-1">Data Allowance</span>
                      <span className="text-sm font-bold text-slate-200">{b.dataGB >= 1000 ? "Unlimited" : `${b.dataGB} GB`}</span>
                    </div>
                    <div className="bg-white/5 rounded-2xl p-3 border border-white/5">
                      <span className="text-[9px] text-slate-500 font-black uppercase tracking-tight block mb-1">Cost / GB</span>
                      <span className="text-sm font-bold text-slate-200">${b.costPerGB.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {b.fupNote && (
                  <div className="mb-6 p-3 rounded-xl bg-amber-500/5 border border-amber-500/20">
                    <p className="text-[10px] font-medium text-amber-400/80 italic leading-relaxed">
                      {b.fupNote}
                    </p>
                  </div>
                )}

                <div className="mt-auto grid grid-cols-5 gap-2">
                  <button
                    onClick={() => addToCompareTray("telecom", b.id, "internet")}
                    className={cn(
                      "col-span-4 h-11 rounded-xl font-black text-[11px] uppercase tracking-widest transition-all duration-300",
                      inTray 
                        ? "bg-teal-600/20 text-teal-400 border border-teal-500/30" 
                        : "bg-teal-600 text-white shadow-lg shadow-teal-500/20 hover:bg-teal-500 hover:shadow-teal-500/40"
                    )}
                  >
                    {inTray ? "Already Comparing" : "Add to Comparison"}
                  </button>
                  <button 
                    className="h-11 flex items-center justify-center rounded-xl bg-slate-800 border border-white/5 text-slate-300 hover:bg-slate-700 transition-all shadow-lg"
                    title="Website"
                  >
                    <Globe size={16} />
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
