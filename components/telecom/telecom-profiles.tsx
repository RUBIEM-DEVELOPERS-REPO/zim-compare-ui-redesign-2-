"use client"

import { telecomProviders, dataBundles } from "@/lib/mock/telecoms"
import { cn } from "@/lib/utils"
import { ScoreBadge } from "@/components/score-badge"
import { Disclaimer } from "@/components/disclaimer"

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
}

import { X } from "lucide-react"

interface TelecomProfilesProps {
  location?: string
}

export function TelecomProfiles({ location = "All Locations" }: TelecomProfilesProps) {
  const filteredProviders = location === "All Locations"
    ? telecomProviders
    : telecomProviders.filter(p => p.coverageCities.includes(location))

  return (
    <div className="space-y-6">
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
          const details = providerDetails[p.id]
          const bundleCount = dataBundles.filter((b) => b.providerId === p.id).length
          const cheapest = dataBundles.filter((b) => b.providerId === p.id).sort((a, b) => a.costPerGB - b.costPerGB)[0]

          return (
            <div
              key={p.id}
              className={cn(
                "rounded-2xl border bg-card p-6 transition-all duration-300 relative group overflow-hidden",
                "border-border hover:border-teal-200/50 hover:shadow-2xl hover:shadow-teal-500/5 hover:-translate-y-1"
              )}
            >
              {/* ... header and details ... */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h3 className="text-lg font-bold text-foreground group-hover:text-teal-600 transition-colors uppercase tracking-tight">{p.name}</h3>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{p.type} &middot; {p.networkType}</p>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <ScoreBadge score={p.coverageScore} label="Coverage" />
                  <ScoreBadge score={p.transparencyScore} label="Transparency" />
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
