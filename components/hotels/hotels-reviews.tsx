"use client"

import { hotelReviews, hotels } from "@/lib/mock/hotels"
import { Star, CheckCircle } from "lucide-react"
import { useI18n } from "@/lib/i18n"

interface HotelsReviewsProps {
    location?: string
}

function StarRating({ rating }: { rating: number }) {
    return (
        <div className="flex gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className={`w-3 h-3 ${i < rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground"}`} />
            ))}
        </div>
    )
}

export function HotelsReviews({ location = "All Locations" }: HotelsReviewsProps) {
    const { t } = useI18n()
    const filteredHotels = location === "All Locations" ? hotels : hotels.filter(h => h.city === location)
    const hotelIds = new Set(filteredHotels.map(h => h.id))
    const filtered = hotelReviews.filter(r => hotelIds.has(r.hotelId))

    const topRated = [...filteredHotels].sort((a, b) => b.rating - a.rating).slice(0, 5)

    return (
        <div className="space-y-6">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {topRated.map(h => (
                    <div key={h.id} className="rounded-xl border border-border bg-card p-4">
                        <div className="flex items-start justify-between mb-2">
                            <p className="text-sm font-semibold text-foreground">{h.name}</p>
                            <span className="text-xs font-bold text-foreground">{h.rating}</span>
                        </div>
                        <StarRating rating={Math.round(h.rating)} />
                        <p className="text-xs text-muted-foreground mt-1">{h.reviewCount} {t("stays.reviews")} · {h.city}</p>
                        <div className="mt-2 h-1.5 rounded-full bg-secondary overflow-hidden">
                            <div className="h-full rounded-full bg-amber-400" style={{ width: `${(h.rating / 5) * 100}%` }} />
                        </div>
                    </div>
                ))}
            </div>

            <section>
                <h3 className="text-sm font-semibold text-foreground mb-3">{t("stays.guestReviews")}</h3>
                {filtered.length === 0 ? (
                    <div className="rounded-2xl border-2 border-dashed border-border p-12 text-center">
                        <p className="text-muted-foreground">{t("stays.noReviewsFound", { location: location === "All Locations" ? t("common.allLocations") : location })}</p>
                    </div>
                ) : (
                    <div className="grid gap-3 sm:grid-cols-2">
                        {filtered.map(r => {
                            const hotel = hotels.find(h => h.id === r.hotelId)
                            return (
                                <div key={r.id} className="rounded-xl border border-border bg-card p-4">
                                    <div className="flex items-start justify-between mb-2">
                                        <div>
                                            <p className="text-xs font-semibold text-foreground">{r.author}</p>
                                            <p className="text-xs text-muted-foreground">{hotel?.name}</p>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            {r.verified && <CheckCircle className="w-3 h-3 text-emerald-500" />}
                                            <span className="text-xs text-muted-foreground">{new Date(r.date).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                    <StarRating rating={r.rating} />
                                    <p className="text-xs text-muted-foreground mt-2 italic">"{r.comment}"</p>
                                </div>
                            )
                        })}
                    </div>
                )}
            </section>
        </div>
    )
}
