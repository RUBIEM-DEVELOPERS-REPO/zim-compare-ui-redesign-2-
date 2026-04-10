"use client"

import { useState } from "react"
import { voiceRates, telecomProviders } from "@/lib/mock/telecoms"
import { Disclaimer } from "@/components/disclaimer"
import { cn } from "@/lib/utils"
import { LucideIcon, X, Check, Plus, CheckCircle2 } from "lucide-react"
import { useAppStore } from "@/lib/store"
import { TelecomCompareBar } from "./telecom-compare-bar"

interface TelecomVoiceProps {
  location?: string
}

export function TelecomVoice({ location = "All Locations" }: TelecomVoiceProps) {
  const { addToCompareTray, compareTray } = useAppStore()

  const filteredProviders = location === "All Locations"
    ? telecomProviders
    : telecomProviders.filter(p => p.coverageCities.includes(location))

  const providerData = filteredProviders
    .filter((p) => p.type === "MNO")
    .map((p) => {
      const onNet = voiceRates.find((v) => v.providerId === p.id && v.type === "on_net")
      const offNet = voiceRates.find((v) => v.providerId === p.id && v.type === "off_net")
      return {
        id: p.id,
        name: p.name,
        onNetRate: onNet?.ratePerMin ?? 0,
        offNetRate: offNet?.ratePerMin ?? 0,
        onNetSms: onNet?.smsRate ?? 0,
        offNetSms: offNet?.smsRate ?? 0,
      }
    })
    .sort((a, b) => a.name.localeCompare(b.name))

  return (
    <div className="space-y-6">
      <TelecomCompareBar />

      {/* Rate Table */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-foreground">Voice & SMS Rates</h3>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">Standard MNO Pricing</p>
        </div>
        <div className="overflow-x-auto rounded-2xl border border-border glass-card">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border bg-secondary/30">
                <th className="text-left px-4 py-3 text-muted-foreground font-bold uppercase tracking-tight">Provider</th>
                <th className="text-right px-4 py-3 text-muted-foreground font-bold uppercase tracking-tight">On-Net/min</th>
                <th className="text-right px-4 py-3 text-muted-foreground font-bold uppercase tracking-tight">Off-Net/min</th>
                <th className="text-right px-4 py-3 text-muted-foreground font-bold uppercase tracking-tight">On-Net SMS</th>
                <th className="text-right px-4 py-3 text-muted-foreground font-bold uppercase tracking-tight">Off-Net SMS</th>
                <th className="text-center px-4 py-3 text-muted-foreground font-bold uppercase tracking-tight w-24">Compare</th>
              </tr>
            </thead>
            <tbody>
              {providerData.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-muted-foreground italic">
                    No voice services found for this location.
                  </td>
                </tr>
              ) : (
                providerData.map((d) => {
                  const inTray = compareTray.ids.includes(d.id)
                  return (
                    <tr key={d.id} className="border-b border-border last:border-0 hover:bg-secondary/20 transition-colors">
                      <td className="px-4 py-3 font-semibold text-foreground">{d.name}</td>
                      <td className="px-4 py-3 text-right text-foreground">${d.onNetRate.toFixed(2)}</td>
                      <td className="px-4 py-3 text-right text-foreground">${d.offNetRate.toFixed(2)}</td>
                      <td className="px-4 py-3 text-right text-foreground">${d.onNetSms.toFixed(2)}</td>
                      <td className="px-4 py-3 text-right text-foreground">${d.offNetSms.toFixed(2)}</td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => addToCompareTray("telecom", d.id, "voice")}
                          className={cn(
                            "inline-flex items-center justify-center p-1.5 rounded-full transition-all",
                            inTray 
                              ? "bg-teal-500 text-white shadow-lg shadow-teal-500/20" 
                              : "text-muted-foreground hover:bg-teal-500/10 hover:text-teal-600 border border-transparent hover:border-teal-500/20"
                          )}
                          title={inTray ? "In comparison" : "Add to comparison"}
                        >
                          {inTray ? <CheckCircle2 className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                        </button>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </section>
      <Disclaimer />
    </div>
  )
}
