"use client"

import { useState } from "react"
import type { TelecomProvider, DataBundle } from "@prisma/client"
import { useAppStore } from "@/lib/store"
import { cn } from "@/lib/utils"
import { ScoreBadge } from "@/components/score-badge"
import { Disclaimer } from "@/components/disclaimer"
<<<<<<< Updated upstream
import { X, Plus, CheckCircle2 } from "lucide-react"
import { useAppStore } from "@/lib/store"
import { TelecomCompareBar } from "./telecom-compare-bar"
import { useI18n } from "@/lib/i18n"
=======
import { X, Search } from "lucide-react"
>>>>>>> Stashed changes

const providerDetails: Record<string, { summary: string; strengths: string[]; weaknesses: string[]; ussd: string }> = {
  econet: {
    summary: "Zimbabwe's largest mobile network with the most extensive coverage. Offers EcoCash mobile money integration.",
    strengths: ["Best nationwide coverage (92%)", "EcoCash ecosystem", "4G LTE in most urban areas", "Widest USSD service"],
    weaknesses: ["Most expensive data rates", "Auto-renewal on bundles", "Customer service wait times"],
    ussd: "*143#",
  },
  netone: {
    summary: "State-owned MNO with competitive pricing and the OneFusion bundled packages.",
    strengths: ["Competitive pricing", "OneFusion all-in-one bundles", "Government backing", "Good urban coverage"],
    weaknesses: ["Limited rural coverage", "Fewer digital features", "Network congestion"],
    ussd: "*111#",
  },
  telecel: {
    summary: "Third MNO offering budget-friendly options, recently upgraded parts of network to 4G.",
    strengths: ["Cheapest data per GB", "No top-up fees", "Budget-friendly", "Improving 4G rollout"],
    weaknesses: ["Weakest coverage", "Limited 4G areas", "Fewer subscribers means fewer on-net savings"],
    ussd: "*123#",
  },
  telone: {
    summary: "Fixed-line and fibre ISP providing home and business internet solutions.",
    strengths: ["Affordable fibre plans", "Stable connection", "Good for home users", "Unlimited options"],
    weaknesses: ["Limited geographic coverage", "Installation delays", "No mobile service"],
    ussd: "N/A",
  },
  liquid: {
    summary: "Enterprise-focused ISP with premium fibre offerings and business solutions.",
    strengths: ["Fastest fibre speeds (50Mbps+)", "Best for business", "Lowest cost per GB at scale", "Reliable uptime"],
    weaknesses: ["Premium pricing", "Limited residential coverage", "Long installation times"],
    ussd: "N/A",
  },
  utande: {
    summary: "Business and residential ISP offering high-performance fibre and WiMAX solutions.",
    strengths: ["Strong WiMAX presence", "Competitive business fibre", "Personalized support", "Good urban reliability"],
    weaknesses: ["Higher setup costs", "Limited reach outside major cities", "Smaller network footprint"],
    ussd: "N/A",
  },
  dandemutande: {
    summary: "Leading ICT solutions provider and ISP with a focus on VSAT and enterprise fibre.",
    strengths: ["Extensive VSAT network (nationwide)", "High-end enterprise solutions", "Reliable support", "Microsoft partner"],
    weaknesses: ["VSAT latency", "Niche residential market", "Higher price point for high-end gear"],
    ussd: "N/A",
  },
}

interface TelecomProfilesProps {
  location?: string
  providers?: TelecomProvider[]
  bundles?: DataBundle[]
}

<<<<<<< Updated upstream
export function TelecomProfiles({ location = "All Locations" }: TelecomProfilesProps) {
  const { t } = useI18n()
  const { addToCompareTray, compareTray } = useAppStore()
  const filteredProviders = location === "All Locations"
    ? telecomProviders
    : telecomProviders.filter(p => p.coverageCities.includes(location))
=======
export function TelecomProfiles({ location = "All Locations", providers = [], bundles = [] }: TelecomProfilesProps) {
  const [search, setSearch] = useState("")
  const { addToCompareTray, compareTray } = useAppStore()

  const filteredProviders = providers.filter((p) => {
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false
    const citiesStr = (p.coverageCities || "[]")
    if (location !== "All Locations" && !citiesStr.includes(location)) return false
    return true
  })
>>>>>>> Stashed changes

  return (
    <div className="space-y-6">
      <TelecomCompareBar />
      {filteredProviders.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-border p-12 text-center">
          <div className="bg-muted w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-bold text-foreground mb-2">No providers found for {location}</h3>
          <p className="text-muted-foreground mb-6 max-w-xs mx-auto">There are no telecom providers with reported coverage in this location.</p>
        </div>
      ) : (
        filteredProviders.map((p) => {
          const details = providerDetails[p.id.toLowerCase().replace('tel-','')] || providerDetails['econet'] // fallback details
          const bundleCount = bundles.filter((b) => b.operator === p.id).length
          const cheapest = [...bundles].filter((b) => b.operator === p.id && b.total_data_mb > 0).sort((a, b) => (a.price / a.total_data_mb) - (b.price / b.total_data_mb))[0]

          return (
            <div
              key={p.id}
              className={cn(
                "glass-card p-6 transition-all duration-300 relative group overflow-hidden",
                "border-border hover:border-teal-200/50 hover:shadow-2xl hover:shadow-teal-500/5 hover:-translate-y-1"
              )}
            >
              {/* ... header and details ... */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h3 className="text-lg font-bold text-foreground group-hover:text-teal-600 transition-colors uppercase tracking-tight">{p.name}</h3>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{p.type} &middot; {p.networkType}</p>
                </div>
                <div className="flex gap-2 flex-wrap items-center">
                  <ScoreBadge score={p.coverageScore} label="Coverage" />
                  <ScoreBadge score={p.transparencyScore} label="Transparency" />
                  {(() => {
                    const inTray = compareTray.ids.includes(p.id)
                    return (
                      <button
                        onClick={() => addToCompareTray("telecom", p.id, "profiles")}
                        className={cn(
                          "btn-compare-standard ml-2",
                          inTray && "opacity-60"
                        )}
                      >
                        {inTray ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                            {t("common.addedToCompare")}
                          </>
                        ) : (
                          <>
                            <Plus className="w-3.5 h-3.5 mr-1" />
                            {t("common.addToCompare")}
                          </>
                        )}
                      </button>
                    )
                  })()}
                </div>
              </div>

              {details && (
                <>
                  <p className="text-sm font-medium text-foreground/70 mb-6 leading-relaxed bg-secondary/20 p-4 rounded-xl border border-border/50">{details.summary}</p>
                  <div className="grid gap-6 sm:grid-cols-2 mb-6">
                    <div className="space-y-3">
                      <p className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest flex items-center gap-2">
                        <span className="w-4 h-4 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-[10px]">+</span>
                        Key Strengths
                      </p>
                      <ul className="space-y-2">
                        {details.strengths.map((s) => (
                          <li key={s} className="text-xs font-bold text-muted-foreground flex items-center gap-2">
                            <div className="w-1 h-1 rounded-full bg-emerald-400" />
                            {s}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="space-y-3">
                      <p className="text-[10px] font-black text-red-600 dark:text-red-400 uppercase tracking-widest flex items-center gap-2">
                        <span className="w-4 h-4 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-[10px]">-</span>
                        Critical Weaknesses
                      </p>
                      <ul className="space-y-2">
                        {details.weaknesses.map((w) => (
                          <li key={w} className="text-xs font-bold text-muted-foreground flex items-center gap-2">
                            <div className="w-1 h-1 rounded-full bg-red-400" />
                            {w}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="flex flex-col border-l border-border/50 pl-4">
                    <span className="text-[9px] font-black text-muted-foreground uppercase tracking-tighter">Flash Code</span>
                    <span className="text-xs font-mono font-bold text-foreground bg-gray-100 px-2 py-0.5 rounded-lg">{details.ussd}</span>
                  </div>
                </>
              )}
            </div>
          )
        })
      )}
      <Disclaimer />
    </div>
  )
}
