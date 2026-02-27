"use client"

import { hotelDeals } from "@/lib/mock/hotels"
import { Tag, Calendar, CheckCircle } from "lucide-react"
import { useI18n } from "@/lib/i18n"

interface HotelsDealsProps {
    location?: string
}

export function HotelsDeals({ location = "All Locations" }: HotelsDealsProps) {
    const { t } = useI18n()

    return (
        <div className="space-y-4">
            <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
                <div className="flex items-center gap-2 mb-1">
                    <Tag className="w-4 h-4 text-amber-500" />
                    <p className="text-sm font-semibold text-foreground">{t("stays.currentDeals")}</p>
                </div>
                <p className="text-xs text-muted-foreground">{t("stays.dealsSubtitle")}</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                {hotelDeals.map(deal => {
                    const discount = Math.round(((deal.originalPrice - deal.dealPrice) / deal.originalPrice) * 100)
                    return (
                        <div key={deal.id} className="rounded-xl border border-border bg-card p-5 hover:border-primary/20 transition-colors">
                            <div className="flex items-start justify-between mb-3">
                                <div>
                                    <span className="text-[10px] bg-amber-500/15 text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded-full font-bold mb-1 inline-block">
                                        {t("stays.off", { count: discount })}
                                    </span>
                                    <p className="text-sm font-semibold text-foreground">{deal.dealName}</p>
                                    <p className="text-xs text-muted-foreground">{deal.hotelName}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-muted-foreground line-through">${deal.originalPrice}</p>
                                    <p className="text-xl font-bold text-foreground">${deal.dealPrice}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-1.5 mb-3">
                                <Calendar className="w-3 h-3 text-muted-foreground" />
                                <p className="text-xs text-muted-foreground">{t("stays.validUntil", { date: new Date(deal.validUntil).toLocaleDateString(t("common.location") === "All Locations" ? "en-ZW" : "en-ZW", { day: "numeric", month: "short", year: "numeric" }) })}</p>
                            </div>

                            <div className="space-y-1">
                                <p className="text-xs font-medium text-foreground">{t("stays.includes")}</p>
                                {deal.includes.map(item => (
                                    <div key={item} className="flex items-center gap-1.5">
                                        <CheckCircle className="w-3 h-3 text-emerald-500 shrink-0" />
                                        <p className="text-xs text-muted-foreground">{item}</p>
                                    </div>
                                ))}
                            </div>

                            <button className="mt-4 w-full rounded-lg bg-primary py-2 text-xs font-bold text-primary-foreground hover:bg-primary/90 transition-colors">
                                {t("stays.viewDeal")}
                            </button>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
