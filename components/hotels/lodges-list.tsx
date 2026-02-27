"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { hotels } from "@/lib/mock/hotels"
import { cn } from "@/lib/utils"
import { Star, MapPin, Waves, Sparkles, Coffee, Dumbbell, Wifi, Car, UtensilsCrossed, Plus, CheckCircle2 } from "lucide-react"
import { useI18n } from "@/lib/i18n"

interface LodgesListProps {
    location?: string
}

function StarRating({ stars }: { stars: number }) {
    return (
        <div className="flex gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className={`w-3.5 h-3.5 ${i < stars ? "fill-amber-400 text-amber-400" : "text-slate-200 dark:text-slate-800"}`} />
            ))}
        </div>
    )
}

export function LodgesList({ location = "All Locations" }: LodgesListProps) {
    const { t } = useI18n()
    const router = useRouter()
    const [selected, setSelected] = useState<string[]>([])

    const amenityIcons: Record<string, React.ReactNode> = {
        WiFi: <Wifi className="w-3.5 h-3.5" />,
        Parking: <Car className="w-3.5 h-3.5" />,
        Breakfast: <Coffee className="w-3.5 h-3.5" />,
        Gym: <Dumbbell className="w-3.5 h-3.5" />,
        Pool: <Waves className="w-3.5 h-3.5" />,
        Spa: <Sparkles className="w-3.5 h-3.5" />,
        Restaurant: <UtensilsCrossed className="w-3.5 h-3.5" />,
    }

    const filtered = hotels
        .filter(h => h.type === "lodge")
        .filter(h => location === "All Locations" || h.city === location)

    const toggleSelect = (id: string, e: React.MouseEvent) => {
        e.stopPropagation()
        setSelected(prev => {
            if (prev.includes(id)) return prev.filter(x => x !== id)
            if (prev.length >= 3) return prev
            return [...prev, id]
        })
    }

    const handleCompare = () => {
        if (selected.length < 2) return
        router.push(`/hotels/compare?ids=${selected.join(",")}`)
    }

    return (
        <div className="space-y-6">
            {/* Compare Bar */}
            {selected.length > 0 && (
                <div className="rounded-2xl border-2 border-primary/30 bg-primary/5 px-6 py-4 flex items-center justify-between animate-in fade-in slide-in-from-top-4 backdrop-blur-md sticky top-20 z-40 shadow-xl shadow-primary/10">
                    <div className="flex items-center gap-4">
                        <div className="flex -space-x-3">
                            {selected.map(id => {
                                const h = hotels.find(x => x.id === id)
                                return (
                                    <div key={id} className="h-10 w-10 rounded-full border-2 border-background overflow-hidden bg-muted relative shadow-md">
                                        <img src={h?.imageUrl || "/placeholder.svg"} alt={h?.name} className="h-full w-full object-cover" />
                                    </div>
                                )
                            })}
                        </div>
                        <div>
                            <p className="text-sm text-foreground font-black uppercase tracking-tight">
                                {t("stays.lodgesSelected", { count: selected.length })}
                            </p>
                            <p className="text-[10px] text-muted-foreground">{t("stays.selectUpTo3")}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleCompare}
                        disabled={selected.length < 2}
                        className={cn("rounded-xl px-6 py-2.5 text-xs font-black uppercase tracking-widest transition-all shadow-lg",
                            selected.length >= 2
                                ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-primary/30 hover:scale-105 active:scale-95"
                                : "bg-slate-200 dark:bg-slate-800 text-muted-foreground cursor-not-allowed"
                        )}>
                        {t("stays.analyzeComparison")}
                    </button>
                </div>
            )}

            {/* Grid */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filtered.map(h => (
                    <div key={h.id}
                        className={cn("group flex flex-col rounded-2xl border bg-card overflow-hidden transition-all hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-1 relative",
                            selected.includes(h.id) ? "border-primary ring-1 ring-primary/20" : "border-border"
                        )}>

                        {/* Image Container */}
                        <div className="relative h-56 w-full overflow-hidden">
                            <img
                                src={h.imageUrl || "/placeholder.svg"}
                                alt={h.name}
                                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                                loading="lazy"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />

                            {/* Top Badges */}
                            <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                                {h.bestValue && (
                                    <span className="px-3 py-1 bg-amber-500 text-white text-[10px] font-black uppercase tracking-wider rounded-lg shadow-lg">
                                        {t("stays.bestValue")}
                                    </span>
                                )}
                                {h.recommended && (
                                    <span className="px-3 py-1 bg-primary text-white text-[10px] font-black uppercase tracking-wider rounded-lg shadow-lg">
                                        {t("stays.safariPick")}
                                    </span>
                                )}
                            </div>

                            {/* Price Overlay */}
                            <div className="absolute bottom-3 right-3 text-right">
                                <p className="text-2xl font-black text-white drop-shadow-md">${h.pricePerNight}</p>
                                <p className="text-[10px] text-white/80 font-bold uppercase tracking-widest">{t("stays.perNight")}</p>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-5 flex-1 flex flex-col">
                            <div className="flex-1">
                                <h3 className="text-lg font-bold text-foreground leading-tight group-hover:text-primary transition-colors">{h.name}</h3>

                                <div className="flex items-center justify-between mt-2">
                                    <div className="flex items-center gap-1.5">
                                        <MapPin className="w-3.5 h-3.5 text-primary" />
                                        <p className="text-xs font-medium text-muted-foreground">{h.city}</p>
                                    </div>
                                    <StarRating stars={h.stars} />
                                </div>

                                <p className="text-xs text-muted-foreground mt-4 line-clamp-2 italic leading-relaxed">
                                    "{h.description}"
                                </p>

                                {/* Amenities Row */}
                                <div className="flex flex-wrap gap-2 mt-4">
                                    {h.amenities.slice(0, 4).map(a => (
                                        <div key={a} className="flex items-center gap-1.5 bg-secondary/50 dark:bg-secondary/10 px-2.5 py-1.5 rounded-xl border border-border/50">
                                            <span className="text-primary">{amenityIcons[a] ?? null}</span>
                                            <span className="text-[10px] font-bold text-muted-foreground uppercase">{t(`stays.amenities.${a}`)}</span>
                                        </div>
                                    ))}
                                    {h.amenities.length > 4 && (
                                        <span className="text-[10px] font-bold text-muted-foreground self-center ml-1">{t("stays.moreAmenities", { count: h.amenities.length - 4 })}</span>
                                    )}
                                </div>
                            </div>

                            {/* Footer / Stats */}
                            <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center font-black text-primary text-sm">
                                        {h.rating}
                                    </div>
                                    <div>
                                        <p className="text-[11px] font-bold text-foreground leading-none">{t("stays.safariRating")}</p>
                                        <p className="text-[10px] text-muted-foreground mt-0.5">{t("stays.guestReviews", { count: h.reviewCount })}</p>
                                    </div>
                                </div>

                                <button
                                    onClick={(e) => toggleSelect(h.id, e)}
                                    className={cn(
                                        "btn-compare-standard",
                                        selected.includes(h.id) && "opacity-60"
                                    )}
                                >
                                    {selected.includes(h.id) ? (
                                        <>
                                            <CheckCircle2 className="w-3.5 h-3.5" />
                                            {t("common.addedToCompare")}
                                        </>
                                    ) : (
                                        <>
                                            <Plus className="w-3.5 h-3.5" />
                                            {t("common.addToCompare")}
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
