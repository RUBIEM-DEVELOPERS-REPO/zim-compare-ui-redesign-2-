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
            <div className="glass-panel p-4 bg-primary/5 border-primary/20 shadow-xl overflow-hidden relative">
                <div className="absolute top-0 right-0 p-3 opacity-10">
                    <Sparkles className="h-16 w-16 text-primary" />
                </div>
                <div className="relative z-10 font-medium">
                    <p className="text-[8px] font-medium text-primary uppercase tracking-widest mb-1.5 px-2 py-0.5 bg-primary/10 rounded-full inline-block">{t("stays.hospitalityTitle")}</p>
                    <h2 className="text-lg font-medium text-foreground tracking-tight">{t("stays.hospitalitySubtitle")}</h2>
                    <p className="text-xs text-muted-foreground mt-1.5 max-w-lg leading-relaxed">
                        {t("stays.propertiesCount", { count: filtered.length })} properties available in {location}.
                    </p>
                    <Disclaimer />
                </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {summaryCards.map(c => (
                    <div key={c.label} className="glass-card p-3 group">
                        <p className="text-[8px] font-medium text-muted-foreground uppercase tracking-widest mb-1">{c.label}</p>
                        <p className="text-xs font-medium text-foreground tabular-nums">{c.value}</p>
                        <p className="text-[8px] font-medium text-primary mt-1 uppercase tracking-tighter italic">{c.detail}</p>
                    </div>
                ))}
            </div>

            {featured.length > 0 && (
                <section>
                    <h3 className="text-[10px] font-medium text-foreground mb-2">{t("stays.recommendedProperties")}</h3>
                    <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {featured.map(h => (
                            <div key={h.id} className="glass-card p-3.5 hover:border-primary/40 group">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex-1 min-w-0 mr-2">
                                        <p className="text-xs font-medium text-foreground group-hover:text-primary transition-colors tracking-tight truncate">{h.name}</p>
                                        <div className="flex items-center gap-1 mt-0.5">
                                            <MapPin className="w-2.5 h-2.5 text-primary" />
                                            <p className="text-[8px] font-medium text-muted-foreground uppercase tracking-tight truncate">{h.city}</p>
                                        </div>
                                    </div>
                                    <div className="text-right bg-primary/10 px-2 py-1 rounded-lg border border-primary/10 flex-shrink-0">
                                        <p className="text-xs font-medium text-primary tabular-nums">${h.pricePerNight}</p>
                                        <p className="text-[7px] font-medium text-muted-foreground uppercase tracking-widest leading-none">{t("stays.night")}</p>
                                    </div>
                                </div>
                                <div className="mb-2">
                                    <StarRating stars={h.stars} />
                                </div>
                                <div className="flex flex-wrap gap-1 mb-3">
                                    {h.amenities.slice(0, 4).map(a => (
                                        <span key={a} className="flex items-center gap-1 text-[8px] bg-muted px-2 py-0.5 rounded-full text-foreground/70 font-medium uppercase tracking-tighter border border-border/40">
                                            <span className="scale-75">{amenityIcons[a]}</span> {t(`stays.amenities.${a}`)}
                                        </span>
                                    ))}
                                </div>
                                <div className="flex items-center justify-between pt-3 border-t border-border mt-auto">
                                    <span className="text-[8px] bg-primary/20 text-primary px-2 py-0.5 rounded-full font-medium uppercase tracking-widest shadow-sm border border-primary/20">{t("stays.recommended")}</span>
                                    <div className="flex items-center gap-1 bg-amber-500/10 px-1.5 py-0.5 rounded-lg">
                                        <Star className="w-2.5 h-2.5 text-amber-500 fill-amber-500" />
                                        <span className="text-[8px] font-medium text-amber-600 dark:text-amber-400 tabular-nums">{h.rating}</span>
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

