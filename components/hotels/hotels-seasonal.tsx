"use client"

import { seasonalPricing } from "@/lib/mock/hotels"
import { TrendingUp, Calendar } from "lucide-react"
import { useI18n } from "@/lib/i18n"

const bestMonths = ["March", "April", "February"]
const peakMonths = ["June", "July", "August", "September"]

export function HotelsSeasonal() {
    const { t } = useI18n()
    const maxPrice = Math.max(...seasonalPricing.map(m => m.avgPrice))
    const maxOccupancy = Math.max(...seasonalPricing.map(m => m.occupancy))

    return (
        <div className="space-y-6">
            <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
                <div className="flex items-center gap-2 mb-1">
                    <Calendar className="w-4 h-4 text-primary" />
                    <p className="text-sm font-semibold text-foreground">{t("stays.priceTrends")}</p>
                </div>
                <p className="text-xs text-muted-foreground">{t("stays.seasonalSubtitle")}</p>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
                <div className="rounded-xl border border-border bg-card p-5">
                    <p className="text-xs font-medium text-muted-foreground mb-4">{t("stays.avgPriceNightUSD")}</p>
                    <div className="flex items-end gap-1 h-40">
                        {seasonalPricing.map(m => {
                            const isPeak = peakMonths.includes(m.month.replace(/\d+/g, "").trim()) || ["Jun", "Jul", "Aug", "Sep"].includes(m.month)
                            return (
                                <div key={m.month} className="flex-1 flex flex-col items-center gap-1">
                                    <span className="text-[9px] text-foreground font-bold">${m.avgPrice}</span>
                                    <div
                                        className="w-full rounded-t-sm transition-all"
                                        style={{
                                            height: `${(m.avgPrice / maxPrice) * 100}%`,
                                            backgroundColor: isPeak ? "rgb(20, 184, 166)" : "rgb(148, 163, 184)"
                                        }}
                                    />
                                    <span className="text-[9px] text-muted-foreground">{t(`stays.months.${m.month}`) || m.month}</span>
                                </div>
                            )
                        })}
                    </div>
                    <div className="flex gap-3 mt-3">
                        <div className="flex items-center gap-1"><div className="w-3 h-2 rounded-sm bg-teal-500" /><span className="text-[10px] text-muted-foreground">{t("stays.peakSeason")}</span></div>
                        <div className="flex items-center gap-1"><div className="w-3 h-2 rounded-sm bg-slate-400" /><span className="text-[10px] text-muted-foreground">{t("stays.offPeak")}</span></div>
                    </div>
                </div>

                <div className="rounded-xl border border-border bg-card p-5">
                    <p className="text-xs font-medium text-muted-foreground mb-4">{t("stays.occupancyRate")}</p>
                    <div className="flex items-end gap-1 h-40">
                        {seasonalPricing.map(m => (
                            <div key={m.month} className="flex-1 flex flex-col items-center gap-1">
                                <span className="text-[9px] text-foreground font-bold">{m.occupancy}%</span>
                                <div
                                    className="w-full rounded-t-sm bg-primary/60 transition-all"
                                    style={{ height: `${(m.occupancy / maxOccupancy) * 100}%` }}
                                />
                                <span className="text-[9px] text-muted-foreground">{t(`stays.months.${m.month}`) || m.month}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
                    <TrendingUp className="w-4 h-4 text-emerald-500 mb-2" />
                    <p className="text-xs font-semibold text-foreground mb-1">{t("stays.bestBookingMonths")}</p>
                    <div className="flex flex-wrap gap-1">
                        {bestMonths.map(m => <span key={m} className="text-[10px] bg-emerald-500/15 text-emerald-600 dark:text-amber-400 px-2 py-0.5 rounded-full">{t(`stays.months.${m}`) || m}</span>)}
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">{t("stays.lowestPricesAvailability")}</p>
                </div>
                <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
                    <Calendar className="w-4 h-4 text-amber-500 mb-2" />
                    <p className="text-xs font-semibold text-foreground mb-1">{t("stays.peakSeason")}</p>
                    <div className="flex flex-wrap gap-1">
                        {peakMonths.map(m => <span key={m} className="text-[10px] bg-amber-500/15 text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded-full">{t(`stays.months.${m}`) || m}</span>)}
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">{t("stays.bookEarlySubtitle")}</p>
                </div>
                <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
                    <TrendingUp className="w-4 h-4 text-primary mb-2" />
                    <p className="text-xs font-semibold text-foreground mb-1">{t("stays.bookingTip")}</p>
                    <p className="text-xs text-muted-foreground">{t("stays.vicFallsTip")}</p>
                </div>
            </div>
        </div>
    )
}
