"use client"

import { hotelDeals } from "@/lib/mock/hotels"
import { Tag, Calendar, CheckCircle } from "lucide-react"
import { useI18n } from "@/lib/i18n"
import { formatDateShort } from "@/lib/utils"

interface HotelsDealsProps {
    location?: string
}

export function HotelsDeals({ location = "All Locations" }: HotelsDealsProps) {
    const { t } = useI18n()

    return (
        <div className="space-y-4">
            <div className="glass-panel p-5 bg-amber-500/5 border-amber-500/20 shadow-xl overflow-hidden relative">
                <div className="absolute -top-4 -right-4 opacity-5 pointer-events-none">
                    <Tag size={100} className="text-amber-500" />
                </div>
                <div className="relative z-10 flex items-center gap-3 mb-2">
                    <div className="p-2 bg-amber-500/10 rounded-xl shadow-inner">
                        <Tag className="w-5 h-5 text-amber-500" />
                    </div>
                    <p className="text-sm font-medium text-foreground uppercase tracking-widest">{t("stays.currentDeals")}</p>
                </div>
                <p className="text-[11px] text-muted-foreground leading-relaxed max-w-lg">{t("stays.dealsSubtitle")}</p>
            </div>
 biographical description of this person.

            <div className="grid gap-4 sm:grid-cols-2">
                {hotelDeals.map(deal => {
                    const discount = Math.round(((deal.originalPrice - deal.dealPrice) / deal.originalPrice) * 100)
                    return (
                        <div key={deal.id} className="glass-card p-4 hover:border-amber-500/40 group">
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-[9px] bg-amber-500/20 text-amber-600 dark:text-amber-400 px-3 py-1 rounded-full font-medium uppercase tracking-widest border border-amber-500/20 shadow-sm animate-pulse-slow">
                                            {t("stays.off", { count: discount })}
                                        </span>
                                    </div>
                                    <p className="text-sm font-medium text-foreground tracking-tight group-hover:text-amber-500 transition-colors">{deal.dealName}</p>
                                    <p className="text-[8px] font-medium text-muted-foreground uppercase tracking-widest">{deal.hotelName}</p>
                                </div>
                                <div className="text-right bg-muted/30 px-2 py-1 rounded-lg border border-white/5">
                                    <p className="text-[7px] text-muted-foreground line-through font-medium tabular-nums">${deal.originalPrice}</p>
                                    <p className="text-sm font-medium text-foreground tabular-nums">${deal.dealPrice}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 mb-3 py-1.5 px-2 bg-muted/20 rounded-xl border border-white/5 w-fit">
                                <p className="text-[8px] font-medium text-muted-foreground uppercase tracking-widest">{t("stays.validUntil", { date: formatDateShort(deal.validUntil) })}</p>
                            </div>

                             <div className="space-y-1.5 mb-4">
                                <p className="text-[8px] font-medium text-foreground uppercase tracking-[0.2em] mb-2 ml-1">{t("stays.includes")}</p>
                                <div className="grid grid-cols-1 gap-1.5">
                                    {deal.includes.map(item => (
                                        <div key={item} className="flex items-center gap-2 group/item">
                                            <div className="p-0.5 bg-emerald-500/10 rounded group-hover/item:bg-emerald-500/20 transition-colors">
                                                <CheckCircle className="w-2 h-2 text-emerald-500 shrink-0" />
                                            </div>
                                            <p className="text-[8px] font-medium text-muted-foreground">{item}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <button className="w-full rounded-xl bg-primary py-2 text-[8px] font-medium uppercase tracking-[0.2em] text-primary-foreground hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95">
                                {t("stays.viewDeal")}
                            </button>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

