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
  const [minutes, setMinutes] = useState(60)
  const [sms, setSms] = useState(30)
  const { addToCompareTray, compareTray } = useAppStore()

  const filteredProviders = location === "All Locations"
    ? telecomProviders
    : telecomProviders.filter(p => p.coverageCities.includes(location))

  const costByProvider = filteredProviders
    .filter((p) => p.type === "MNO")
    .map((p) => {
      const onNet = voiceRates.find((v) => v.providerId === p.id && v.type === "on_net")
      const offNet = voiceRates.find((v) => v.providerId === p.id && v.type === "off_net")
      const voiceCost = (onNet ? onNet.ratePerMin * minutes * 0.6 : 0) + (offNet ? offNet.ratePerMin * minutes * 0.4 : 0)
      const smsCost = (onNet ? onNet.smsRate * sms * 0.6 : 0) + (offNet ? offNet.smsRate * sms * 0.4 : 0)
      return {
        provider: p.name,
        onNetRate: onNet?.ratePerMin ?? 0,
        offNetRate: offNet?.ratePerMin ?? 0,
        onNetSms: onNet?.smsRate ?? 0,
        offNetSms: offNet?.smsRate ?? 0,
        totalCost: voiceCost + smsCost,
      }
    })
    .sort((a, b) => a.totalCost - b.totalCost)

  return (
    <div className="space-y-6">
      <TelecomCompareBar />

      {/* Calculator */}
      {/* Calculator - Redesigned for Dark Mode */}
      <div className="rounded-3xl border border-teal-500/20 bg-slate-900/40 p-6 shadow-xl backdrop-blur-sm">
        <h3 className="text-sm font-bold text-slate-200 mb-4 uppercase tracking-widest text-center italic">Effective Cost Calculator</h3>
        <div className="grid gap-6 sm:grid-cols-2 mb-6">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label htmlFor="minutes-range" className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Minutes/month</label>
              <span className="text-xs font-bold text-teal-400">{minutes} mins</span>
            </div>
            <input
              id="minutes-range"
              title="Minutes per month"
              type="range" min={0} max={300} value={minutes}
              onChange={(e) => setMinutes(Number(e.target.value))}
              className="w-full accent-teal-500 h-1.5 bg-slate-800 rounded-full appearance-none cursor-pointer"
            />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label htmlFor="sms-range" className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">SMS/month</label>
              <span className="text-xs font-bold text-teal-400">{sms} SMS</span>
            </div>
            <input
              id="sms-range"
              title="SMS per month"
              type="range" min={0} max={200} value={sms}
              onChange={(e) => setSms(Number(e.target.value))}
              className="w-full accent-teal-500 h-1.5 bg-slate-800 rounded-full appearance-none cursor-pointer"
            />
          </div>
        </div>

        {filteredProviders.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-white/10 p-12 text-center col-span-full">
            <div className="bg-slate-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <X className="w-8 h-8 text-slate-500" />
            </div>
            <h3 className="text-lg font-bold text-slate-200 mb-2">No voice services found for {location}</h3>
            <p className="text-slate-400 mb-6 max-w-xs mx-auto">There are no providers with voice services reporting coverage in this location.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {costByProvider.map((c, i) => (
              <div
                key={c.provider}
                className={cn(
                  "flex items-center justify-between rounded-2xl border px-4 py-4 transition-all duration-300 group",
                  i === 0
                    ? "bg-teal-500/10 border-teal-500/30 shadow-lg shadow-teal-500/10 scale-[1.01]"
                    : "bg-slate-900/60 border-white/5 hover:border-white/10 hover:bg-slate-900/80"
                )}
              >
                <div className="flex items-center gap-3">
                  {i === 0 && (
                    <div className="bg-teal-500 text-white p-1 rounded-full shadow-lg shadow-teal-500/40">
                      <Check size={10} strokeWidth={4} />
                    </div>
                  )}
                  <span className="text-sm font-bold text-slate-100">{c.provider}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-sm font-black text-white">${c.totalCost.toFixed(2)}</span>
                    <span className="text-[10px] text-slate-400 font-bold ml-1 uppercase">/mo</span>
                  </div>

                  {(() => {
                    const providerId = telecomProviders.find(p => p.name === c.provider)?.id || c.provider
                    const inTray = compareTray.ids.includes(providerId)
                    return (
                      <button
                        onClick={() => addToCompareTray("telecom", providerId, "voice")}
                        className={cn(
                          "btn-compare-standard bg-slate-800 hover:bg-teal-600 border-white/5",
                          inTray && "opacity-60 bg-teal-600 text-white"
                        )}
                      >
                        {inTray ? (
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        ) : (
                          <Plus className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                        )}
                      </button>
                    )
                  })()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Rate Table */}
      <section>
        <h3 className="text-sm font-semibold text-foreground mb-3">Voice & SMS Rates</h3>
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border bg-secondary/30">
                <th className="text-left px-3 py-2 text-muted-foreground font-medium">Provider</th>
                <th className="text-right px-3 py-2 text-muted-foreground font-medium">On-Net/min</th>
                <th className="text-right px-3 py-2 text-muted-foreground font-medium">Off-Net/min</th>
                <th className="text-right px-3 py-2 text-muted-foreground font-medium">On-Net SMS</th>
                <th className="text-right px-3 py-2 text-muted-foreground font-medium">Off-Net SMS</th>
              </tr>
            </thead>
            <tbody>
              {costByProvider.map((c) => (
                <tr key={c.provider} className="border-b border-border last:border-0 hover:bg-secondary/20">
                  <td className="px-3 py-2 text-foreground">{c.provider}</td>
                  <td className="px-3 py-2 text-right text-foreground">${c.onNetRate.toFixed(2)}</td>
                  <td className="px-3 py-2 text-right text-foreground">${c.offNetRate.toFixed(2)}</td>
                  <td className="px-3 py-2 text-right text-foreground">${c.onNetSms.toFixed(2)}</td>
                  <td className="px-3 py-2 text-right text-foreground">${c.offNetSms.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <Disclaimer />
    </div>
  )
}
