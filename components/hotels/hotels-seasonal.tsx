"use client"

import { seasonalPricing } from "@/lib/mock/hotels"
import { TrendingUp, Calendar } from "lucide-react"
import { useI18n } from "@/lib/i18n"
import { cn } from "@/lib/utils"
import { DynamicBar } from "@/components/ui/dynamic-bar"

const bestMonths = ["March", "April", "February"]
const peakMonths = ["June", "July", "August", "September"]

export function HotelsSeasonal() {
    const { t } = useI18n()
    const maxPrice = Math.max(...seasonalPricing.map(m => m.avgPrice))
    const maxOccupancy = Math.max(...seasonalPricing.map(m => m.occupancy))

    return (
        <div className="space-y-6">
            <div className="glass-panel p-5 bg-primary/5 border-primary/20 shadow-xl overflow-hidden relative">
                <div className="absolute -top-4 -right-4 opacity-5 pointer-events-none">
                    <Calendar size={100} className="text-primary" />
                </div>
                <div className="relative z-10 flex items-center gap-3 mb-2">
                    <div className="p-2 bg-primary/10 rounded-xl shadow-inner">
                        <Calendar className="w-5 h-5 text-primary" />
                    </div>
                    <p className="text-sm font-black text-foreground uppercase tracking-widest">{t("stays.priceTrends")}</p>
                </div>
                <p className="text-[11px] text-muted-foreground leading-relaxed max-w-lg">{t("stays.seasonalSubtitle")}</p>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
                <div className="glass-card p-6 group">
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-6">{t("stays.avgPriceNightUSD")}</p>
                    <div className="flex items-end gap-1.5 h-44 border-b border-white/5 pb-2">
                        {seasonalPricing.map(m => {
                            const isPeak = peakMonths.includes(m.month.replace(/\d+/g, "").trim()) || ["Jun", "Jul", "Aug", "Sep"].includes(m.month)
                            return (
                                <div key={m.month} className="flex-1 flex flex-col items-center gap-2 group/bar">
                                    <div className="opacity-0 group-hover/bar:opacity-100 transition-opacity bg-primary/90 px-1.5 py-0.5 rounded text-[8px] font-black text-white mb-1 shadow-lg pointer-events-none sticky bottom-full">
                                        ${m.avgPrice}
                                    </div>
                                    <DynamicBar
                                        value={m.avgPrice}
                                        max={maxPrice}
                                        orientation="vertical"
                                        variableName="--bar-height"
                                        className={cn("w-full rounded-t-lg transition-all duration-500 shadow-xl dynamic-bar-height",
                                            isPeak ? "bg-primary shadow-primary/20" : "bg-muted shadow-lg"
                                        )}
                                    />
                                    <span className="text-[9px] font-black text-muted-foreground uppercase tracking-tighter opacity-70 group-hover/bar:opacity-100 transition-opacity whitespace-nowrap overflow-hidden text-ellipsis w-full text-center tabular-nums">{t(`stays.months.${m.month}`) || m.month}</span>
                                </div>
                            )
                        })}
                    </div>
                    <div className="flex gap-4 mt-5">
                        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-primary" /><span className="text-[9px] font-black uppercase text-muted-foreground tracking-widest">{t("stays.peakSeason")}</span></div>
                        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-muted" /><span className="text-[9px] font-black uppercase text-muted-foreground tracking-widest">{t("stays.offPeak")}</span></div>
                    </div>
                </div>

                <div className="glass-card p-6 group">
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-6">{t("stays.occupancyRate")}</p>
                    <div className="flex items-end gap-1.5 h-44 border-b border-white/5 pb-2">
                        {seasonalPricing.map(m => (
                            <div key={m.month} className="flex-1 flex flex-col items-center gap-2 group/bar">
                                <div className="opacity-0 group-hover/bar:opacity-100 transition-opacity bg-primary/90 px-1.5 py-0.5 rounded text-[8px] font-black text-white mb-1 shadow-lg pointer-events-none sticky bottom-full">
                                    {m.occupancy}%
                                </div>
                                <DynamicBar
                                    value={m.occupancy}
                                    max={maxOccupancy}
                                    orientation="vertical"
                                    variableName="--bar-height"
                                    className="w-full rounded-t-lg bg-primary/60 shadow-xl transition-all duration-500 dynamic-bar-height"
                                />
                                <span className="text-[9px] font-black text-muted-foreground uppercase tracking-tighter opacity-70 group-hover/bar:opacity-100 transition-opacity whitespace-nowrap overflow-hidden text-ellipsis w-full text-center tabular-nums">{t(`stays.months.${m.month}`) || m.month}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
                <div className="glass-card p-5 hover:border-emerald-500/40">
                    <TrendingUp className="w-5 h-5 text-emerald-500 mb-3" />
                    <p className="text-[10px] font-black text-foreground uppercase tracking-widest mb-3">{t("stays.bestBookingMonths")}</p>
                    <div className="flex flex-wrap gap-1.5 mb-4">
                        {bestMonths.map(m => <span key={m} className="text-[9px] bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 px-3 py-1 rounded-full font-black titlecase border border-emerald-500/10 uppercase tracking-tighter">{t(`stays.months.${m}`) || m}</span>)}
                    </div>
                    <p className="text-[11px] text-muted-foreground leading-relaxed font-medium">{t("stays.lowestPricesAvailability")}</p>
                </div>
                <div className="glass-card p-5 hover:border-amber-500/40">
                    <Calendar className="w-5 h-5 text-amber-500 mb-3" />
                    <p className="text-[10px] font-black text-foreground uppercase tracking-widest mb-3">{t("stays.peakSeason")}</p>
                    <div className="flex flex-wrap gap-1.5 mb-4">
                        {peakMonths.map(m => <span key={m} className="text-[9px] bg-amber-500/15 text-amber-600 dark:text-amber-400 px-3 py-1 rounded-full font-black titlecase border border-amber-500/10 uppercase tracking-tighter">{t(`stays.months.${m}`) || m}</span>)}
                    </div>
                    <p className="text-[11px] text-muted-foreground leading-relaxed font-medium">{t("stays.bookEarlySubtitle")}</p>
                </div>
                <div className="glass-card p-5 hover:border-primary/40">
                    <TrendingUp className="w-5 h-5 text-primary mb-3" />
                    <p className="text-[10px] font-black text-foreground uppercase tracking-widest mb-3">{t("stays.bookingTip")}</p>
                    <p className="text-[11px] text-muted-foreground leading-relaxed font-medium">{t("stays.vicFallsTip")}</p>
                </div>
            </div>
        </div>
    )
}
