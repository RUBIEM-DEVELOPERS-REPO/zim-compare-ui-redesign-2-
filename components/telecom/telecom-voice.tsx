"use client"

import { useState } from "react"
import { voiceRates, telecomProviders } from "@/lib/mock/telecoms"
import { Disclaimer } from "@/components/disclaimer"
import { cn } from "@/lib/utils"
import { LucideIcon, X, Check } from "lucide-react"

interface TelecomVoiceProps {
  location?: string
}

export function TelecomVoice({ location = "All Locations" }: TelecomVoiceProps) {
  const [minutes, setMinutes] = useState(60)
  const [sms, setSms] = useState(30)

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
      {/* Calculator */}
      {/* Calculator - Redesigned */}
      <div className="rounded-3xl border border-teal-200/50 bg-teal-50/30 p-6 shadow-sm">
        <h3 className="text-sm font-bold text-foreground mb-4 uppercase tracking-widest text-center">Effective Cost Calculator</h3>
        <div className="grid gap-6 sm:grid-cols-2 mb-6">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Minutes/month</label>
              <span className="text-xs font-bold text-teal-600">{minutes} mins</span>
            </div>
            <input
              type="range" min={0} max={300} value={minutes}
              onChange={(e) => setMinutes(Number(e.target.value))}
              className="w-full accent-teal-600 h-1.5 bg-teal-100 rounded-full appearance-none cursor-pointer"
            />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">SMS/month</label>
              <span className="text-xs font-bold text-teal-600">{sms} SMS</span>
            </div>
            <input
              type="range" min={0} max={200} value={sms}
              onChange={(e) => setSms(Number(e.target.value))}
              className="w-full accent-teal-600 h-1.5 bg-teal-100 rounded-full appearance-none cursor-pointer"
            />
          </div>
        </div>

        {filteredProviders.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-border p-12 text-center col-span-full">
            <div className="bg-muted w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <X className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-bold text-foreground mb-2">No voice services found for {location}</h3>
            <p className="text-muted-foreground mb-6 max-w-xs mx-auto">There are no providers with voice services reporting coverage in this location.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {costByProvider.map((c, i) => (
              <div
                key={c.provider}
                className={cn(
                  "flex items-center justify-between rounded-2xl border px-4 py-3 transition-all duration-300",
                  i === 0
                    ? "bg-white border-teal-200 shadow-md shadow-teal-500/5"
                    : "bg-white/50 border-gray-100"
                )}
              >
                <div className="flex items-center gap-3">
                  {i === 0 && (
                    <div className="bg-teal-600 text-white p-1 rounded-full">
                      <Check size={10} strokeWidth={4} />
                    </div>
                  )}
                  <span className="text-sm font-bold text-foreground">{c.provider}</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-black text-foreground">${c.totalCost.toFixed(2)}</span>
                  <span className="text-[10px] text-muted-foreground font-bold ml-1 uppercase">/mo</span>
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
