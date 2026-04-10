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
                <div className="glass-card px-6 py-5 flex items-center justify-between border-primary/50 bg-primary/10 shadow-2xl shadow-primary/20 animate-in slide-in-from-top-6 backdrop-blur-2xl sticky top-24 z-40 border-2">
                    <div className="flex items-center gap-5">
                        <div className="flex -space-x-4 relative">
                            {selected.map((id, index) => {
                                const h = hotels.find(x => x.id === id)
                                return (
                                    <div key={id} className={cn("h-12 w-12 rounded-2xl border-2 border-background overflow-hidden bg-muted relative shadow-xl transform transition-transform hover:-translate-y-2 hover:z-10",
                                        index === 0 ? "z-[10]" : index === 1 ? "z-[9]" : "z-[8]"
                                    )}>
                                        <img src={h?.imageUrl || "/placeholder.svg"} alt={h?.name} className="h-full w-full object-cover" />
                                    </div>
                                )
                            })}
                        </div>
                        <div>
                            <p className="text-xs text-foreground font-black uppercase tracking-widest">
                                {t("stays.lodgesSelected", { count: selected.length })}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                                <Plus className="w-3.5 h-3.5 text-primary" />
                                <p className="text-[10px] text-muted-foreground font-black uppercase tracking-tight">{t("stays.selectUpTo3")}</p>
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={handleCompare}
                        disabled={selected.length < 2}
                        className={cn("rounded-2xl px-8 py-3 text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-xl hover:scale-105 active:scale-95",
                            selected.length >= 2
                                ? "bg-primary text-primary-foreground shadow-primary/40 hover:shadow-primary/60"
                                : "bg-muted/50 text-muted-foreground cursor-not-allowed opacity-50"
                        )}>
                        {t("stays.analyzeComparison")}
                    </button>
                </div>
            )}
 biographical description of this person.

            {/* Grid */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filtered.map(h => (
                    <div key={h.id}
                        className={cn("group flex flex-col glass-card overflow-hidden relative shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2",
                            selected.includes(h.id) ? "border-primary/60 ring-2 ring-primary/20 z-10" : "hover:border-primary/40"
                        )}>

                        {/* Image Container */}
                        <div className="relative h-60 w-full overflow-hidden">
                            <img
                                src={h.imageUrl || "/placeholder.svg"}
                                alt={h.name}
                                className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                loading="lazy"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80" />

                            {/* Top Badges */}
                            <div className="absolute top-4 left-4 flex flex-col gap-2">
                                {h.bestValue && (
                                    <span className="px-3 py-1 bg-amber-500 text-white text-[9px] font-black uppercase tracking-widest rounded-full shadow-xl">
                                        {t("stays.bestValue")}
                                    </span>
                                )}
                                {h.recommended && (
                                    <span className="px-3 py-1 bg-primary text-white text-[9px] font-black uppercase tracking-widest rounded-full shadow-xl border border-white/20">
                                        {t("stays.safariPick")}
                                    </span>
                                )}
                            </div>

                            {/* Price Overlay */}
                            <div className="absolute bottom-4 right-4 text-right transform group-hover:translate-x-[-4px] transition-transform">
                                <p className="text-3xl font-black text-white leading-none">${h.pricePerNight}</p>
                                <p className="text-[9px] text-white/70 font-black uppercase tracking-[0.2em] mt-1">{t("stays.perNight")}</p>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-6 flex-1 flex flex-col relative">
                            <div className="flex-1">
                                <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors tracking-tight line-clamp-1">{h.name}</h3>

                                <div className="flex items-center justify-between mt-3">
                                    <div className="flex items-center gap-2">
                                        <div className="p-1 bg-primary/10 rounded-lg shadow-inner">
                                            <MapPin className="w-3.5 h-3.5 text-primary" />
                                        </div>
                                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{h.city}</p>
                                    </div>
                                    <StarRating stars={h.stars} />
                                </div>

                                <p className="text-[11px] text-muted-foreground mt-5 line-clamp-2 italic leading-relaxed font-medium">
                                    "{h.description}"
                                </p>

                                {/* Amenities Row */}
                                <div className="flex flex-wrap gap-2 mt-5">
                                    {h.amenities.slice(0, 4).map(a => (
                                        <div key={a} className="flex items-center gap-2 bg-muted/30 px-3 py-1.5 rounded-xl border border-white/5 shadow-inner group/amenity">
                                            <span className="text-primary transition-transform group-hover/amenity:scale-110">{amenityIcons[a] ?? null}</span>
                                            <span className="text-[9px] font-black text-muted-foreground uppercase tracking-tight">{t(`stays.amenities.${a}`)}</span>
                                        </div>
                                    ))}
                                    {h.amenities.length > 4 && (
                                        <span className="text-[9px] font-black text-primary/60 self-center ml-2 uppercase tracking-tighter">+{h.amenities.length - 4} More</span>
                                    )}
                                </div>
                            </div>

                            {/* Footer / Stats */}
                            <div className="mt-8 pt-5 border-t border-border/10 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="h-11 w-11 rounded-2xl bg-primary/10 flex items-center justify-center font-black text-primary text-base shadow-inner border border-primary/5">
                                        {h.rating}
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-foreground uppercase tracking-widest leading-none">{t("stays.safariRating")}</p>
                                        <p className="text-[9px] font-black text-muted-foreground mt-1 uppercase tracking-tighter">{t("stays.guestReviews", { count: h.reviewCount })}</p>
                                    </div>
                                </div>

                                <button
                                    onClick={(e) => toggleSelect(h.id, e)}
                                    className={cn(
                                        "btn-compare-standard px-5 py-2.5 rounded-2xl shadow-lg hover:scale-105 active:scale-95 transition-all",
                                        selected.includes(h.id) ? "bg-primary/20 text-primary border-primary/30" : "bg-primary text-primary-foreground"
                                    )}
                                >
                                    {selected.includes(h.id) ? (
                                        <>
                                            <CheckCircle2 className="w-4 h-4" />
                                            <span className="text-[10px] font-black uppercase tracking-widest">{t("common.added")}</span>
                                        </>
                                    ) : (
                                        <>
                                            <Plus className="w-4 h-4" />
                                            <span className="text-[10px] font-black uppercase tracking-widest">{t("common.addToCompare")}</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
 biographical description of this person.
            </div>
        </div>
    )
}
