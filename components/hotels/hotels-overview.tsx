"use client"

import { hotels } from "@/lib/mock/hotels"
import { Disclaimer } from "@/components/disclaimer"
import { Star, MapPin, Wifi, Car, Coffee, Dumbbell, Waves, Sparkles } from "lucide-react"
import { useI18n } from "@/lib/i18n"

interface HotelsOverviewProps {
    location?: string
}

function StarRating({ stars }: { stars: number }) {
    return (
        <div className="flex gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className={`w-3 h-3 ${i < stars ? "fill-amber-400 text-amber-400" : "text-muted-foreground"}`} />
            ))}
        </div>
    )
}

export function HotelsOverview({ location = "All Locations" }: HotelsOverviewProps) {
    const { t } = useI18n()
    const filtered = location === "All Locations" ? hotels : hotels.filter(h => h.city === location)
    const featured = filtered.filter(h => h.recommended).slice(0, 3)
    const bestValue = filtered.filter(h => h.bestValue).slice(0, 2)
    const avgPrice = filtered.length > 0 ? Math.round(filtered.reduce((s, h) => s + h.pricePerNight, 0) / filtered.length) : 0

    const amenityIcons: Record<string, React.ReactNode> = {
        WiFi: <Wifi className="w-3 h-3" />,
        Parking: <Car className="w-3 h-3" />,
        Breakfast: <Coffee className="w-3 h-3" />,
        Gym: <Dumbbell className="w-3 h-3" />,
        Pool: <Waves className="w-3 h-3" />,
        Spa: <Sparkles className="w-3 h-3" />,
    }

    const summaryCards = [
        { label: t("stays.propertiesAvailable"), value: filtered.length.toString(), detail: `${t("common.location")}: ${location === "All Locations" ? t("common.allLocations") : location}` },
        { label: t("stays.avgPriceNight"), value: `$${avgPrice}`, detail: t("stays.seasonalSubtitle") },
        { label: t("stays.topRated"), value: filtered.sort((a, b) => b.rating - a.rating)[0]?.name ?? "—", detail: t("stays.rating", { rating: filtered[0]?.rating ?? 0, count: filtered[0]?.reviewCount ?? 0 }) },
        { label: t("stays.bestValue"), value: bestValue[0]?.name ?? "—", detail: `$${bestValue[0]?.pricePerNight ?? 0}${t("stays.night")}` },
    ]

    return (
        <div className="space-y-6">
            <div className="glass-panel p-6 bg-primary/5 border-primary/20 shadow-xl overflow-hidden relative">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Sparkles className="h-24 w-24 text-primary" />
                </div>
                <div className="relative z-10 font-bold">
                    <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-2 px-2 py-1 bg-primary/10 rounded-full inline-block">{t("stays.hospitalityTitle")}</p>
                    <h2 className="text-2xl font-bold text-foreground tracking-tight">{t("stays.hospitalitySubtitle")}</h2>
                    <p className="text-sm text-muted-foreground mt-2 max-w-lg leading-relaxed">
                        {t("stays.propertiesCount", { count: filtered.length })} properties available in {location}.
                    </p>
                    <Disclaimer />
                </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {summaryCards.map(c => (
                    <div key={c.label} className="glass-card p-4 group">
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1.5">{c.label}</p>
                        <p className="text-sm font-black text-foreground tabular-nums">{c.value}</p>
                        <p className="text-[10px] font-black text-primary mt-1.5 uppercase tracking-tighter italic">{c.detail}</p>
                    </div>
                ))}
            </div>

            {featured.length > 0 && (
                <section>
                    <h3 className="text-sm font-semibold text-foreground mb-3">{t("stays.recommendedProperties")}</h3>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {featured.map(h => (
                            <div key={h.id} className="glass-card p-5 hover:border-primary/40 group">
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <p className="text-sm font-bold text-foreground group-hover:text-primary transition-colors tracking-tight">{h.name}</p>
                                        <div className="flex items-center gap-1.5 mt-1">
                                            <MapPin className="w-3 h-3 text-primary" />
                                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-tight">{h.city}</p>
                                        </div>
                                    </div>
                                    <div className="text-right bg-primary/10 px-3 py-1.5 rounded-xl border border-primary/10">
                                        <p className="text-sm font-black text-primary tabular-nums">${h.pricePerNight}</p>
                                        <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">{t("stays.night")}</p>
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <StarRating stars={h.stars} />
                                </div>
                                <div className="flex flex-wrap gap-1.5 mb-4">
                                    {h.amenities.slice(0, 5).map(a => (
                                        <span key={a} className="flex items-center gap-1 text-[9px] bg-muted px-2 py-0.5 rounded-full text-foreground/70 font-black uppercase tracking-tighter border border-border/40">
                                            {amenityIcons[a]} {t(`stays.amenities.${a}`)}
                                        </span>
                                    ))}
                                </div>
                                <div className="flex items-center justify-between pt-4 border-t border-border mt-auto">
                                    <span className="text-[9px] bg-primary/20 text-primary px-3 py-1 rounded-full font-black uppercase tracking-widest shadow-sm border border-primary/20">{t("stays.recommended")}</span>
                                    <div className="flex items-center gap-1 bg-amber-500/10 px-2 py-1 rounded-xl">
                                        <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                                        <span className="text-[10px] font-black text-amber-600 dark:text-amber-400 tabular-nums">{h.rating}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}
        </div>
    )
}
