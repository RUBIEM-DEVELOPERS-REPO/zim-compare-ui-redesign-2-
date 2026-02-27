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
            <div className="rounded-xl border border-primary/20 bg-primary/5 p-5">
                <p className="text-xs text-muted-foreground mb-1">{t("stays.hospitalityTitle")}</p>
                <p className="text-lg font-semibold text-foreground">{t("stays.hospitalitySubtitle")}</p>
                <p className="text-sm text-muted-foreground mt-1">
                    {t("stays.propertiesCount", { count: filtered.length })}
                </p>
                <Disclaimer />
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {summaryCards.map(c => (
                    <div key={c.label} className="rounded-xl border border-border bg-card p-4">
                        <p className="text-xs text-muted-foreground">{c.label}</p>
                        <p className="text-sm font-semibold text-foreground mt-1">{c.value}</p>
                        <p className="text-xs text-primary mt-1">{c.detail}</p>
                    </div>
                ))}
            </div>

            {featured.length > 0 && (
                <section>
                    <h3 className="text-sm font-semibold text-foreground mb-3">{t("stays.recommendedProperties")}</h3>
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {featured.map(h => (
                            <div key={h.id} className="rounded-xl border border-border bg-card p-4 hover:border-primary/20 transition-colors">
                                <div className="flex items-start justify-between mb-2">
                                    <div>
                                        <p className="text-sm font-semibold text-foreground">{h.name}</p>
                                        <div className="flex items-center gap-1 mt-0.5">
                                            <MapPin className="w-3 h-3 text-muted-foreground" />
                                            <p className="text-xs text-muted-foreground">{h.city}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-bold text-foreground">${h.pricePerNight}</p>
                                        <p className="text-[10px] text-muted-foreground">{t("stays.night")}</p>
                                    </div>
                                </div>
                                <StarRating stars={h.stars} />
                                <div className="flex flex-wrap gap-1 mt-2">
                                    {h.amenities.slice(0, 5).map(a => (
                                        <span key={a} className="flex items-center gap-0.5 text-[10px] bg-secondary px-1.5 py-0.5 rounded-full text-muted-foreground">
                                            {amenityIcons[a]} {t(`stays.amenities.${a}`)}
                                        </span>
                                    ))}
                                </div>
                                <div className="flex items-center justify-between mt-2">
                                    <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold">{t("stays.recommended")}</span>
                                    <span className="text-xs text-muted-foreground">{t("stays.rating", { rating: h.rating, count: h.reviewCount })}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}
        </div>
    )
}
