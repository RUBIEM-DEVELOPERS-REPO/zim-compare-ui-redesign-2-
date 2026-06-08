"use client"

import { hotelReviews, hotels } from "@/lib/mock/hotels"
import { Star, CheckCircle } from "lucide-react"
import { useI18n } from "@/lib/i18n"
import { DynamicBar } from "@/components/ui/dynamic-bar"
import { formatDate } from "@/lib/utils"

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
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {topRated.map(h => (
                    <div key={h.id} className="glass-card p-5 hover:border-amber-500/40 group">
                        <div className="flex items-start justify-between mb-3">
                            <p className="text-sm font-medium text-foreground group-hover:text-amber-500 transition-colors tracking-tight">{h.name}</p>
                            <div className="px-2 py-1 bg-amber-500/10 rounded-lg border border-amber-500/10">
                                <span className="text-[10px] font-medium text-amber-600 dark:text-amber-400 tabular-nums">{h.rating}</span>
                            </div>
                        </div>
                        <div className="mb-2">
                            <StarRating rating={Math.round(h.rating)} />
                        </div>
                        <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest mt-1 italic">{h.reviewCount} {t("stays.reviews")} · {h.city}</p>
                        <div className="mt-4 h-2 rounded-full bg-muted/40 overflow-hidden border border-white/5 p-[1px]">
                            <DynamicBar 
                                value={h.rating}
                                max={5}
                                variableName="--rating-width"
                                className="rating-bar-amber"
                            />
                        </div>
                    </div>
                ))}
            </div>

            <section>
                <h3 className="text-sm font-medium text-foreground mb-3">{t("stays.guestReviews")}</h3>
                {filtered.length === 0 ? (
                    <div className="rounded-2xl border-2 border-dashed border-border p-12 text-center">
                        <p className="text-muted-foreground">{t("stays.noReviewsFound", { location: location === "All Locations" ? t("common.allLocations") : location })}</p>
                    </div>
                ) : (
                    <div className="grid gap-4 sm:grid-cols-2">
                        {filtered.map(r => {
                            const hotel = hotels.find(h => h.id === r.hotelId)
                            return (
                                <div key={r.id} className="glass-card p-5 group hover:border-primary/40">
                                    <div className="flex items-start justify-between mb-4">
                                        <div>
                                            <p className="text-xs font-medium text-foreground uppercase tracking-widest">{r.author}</p>
                                            <p className="text-[10px] font-medium text-primary uppercase tracking-tight mt-0.5">{hotel?.name}</p>
                                        </div>
                                        <div className="flex items-center gap-2 px-2 py-1 bg-muted/30 rounded-lg border border-white/5">
                                            {r.verified && <CheckCircle className="w-3 h-3 text-emerald-500" />}
                                            <span className="text-[9px] font-medium text-muted-foreground uppercase tracking-tighter">{formatDate(r.date)}</span>
                                        </div>
                                    </div>
                                    <div className="mb-4">
                                        <StarRating rating={r.rating} />
                                    </div>
                                    <p className="text-[11px] text-muted-foreground leading-relaxed italic font-medium">"{r.comment}"</p>
                                </div>
                            )
                        })}
                    </div>
                )}
            </section>
        </div>
    )
}

