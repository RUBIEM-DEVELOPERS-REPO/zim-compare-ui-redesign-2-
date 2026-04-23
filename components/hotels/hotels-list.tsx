"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { hotels } from "@/lib/mock/hotels"
import { cn } from "@/lib/utils"
import { Star, MapPin, Wifi, Car, Coffee, Dumbbell, Waves, Sparkles, UtensilsCrossed, Plus, CheckCircle2 } from "lucide-react"
import { useI18n } from "@/lib/i18n"

interface HotelsListProps {
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

export function HotelsList({ location = "All Locations" }: HotelsListProps) {
    const { t } = useI18n()
    const router = useRouter()

    const starFilters = [t("stays.allStars"), t("stays.stars", { count: 5 }), t("stays.stars", { count: 4 }), t("stays.stars", { count: 3 }), t("stays.stars", { count: 2 })]
    const sortOptions = [
        { label: t("stays.bestRating"), value: "Best Rating" },
        { label: t("stays.priceLowHigh"), value: "Price: Low to High" },
        { label: t("stays.priceHighLow"), value: "Price: High to Low" },
        { label: t("stays.mostReviews"), value: "Most Reviews" }
    ]
    const amenityFilters = ["WiFi", "Pool", "Breakfast", "Gym", "Spa", "Parking"]

    const [starFilter, setStarFilter] = useState(t("stays.allStars"))
    const [sortBy, setSortBy] = useState("Best Rating")
    const [amenityFilter, setAmenityFilter] = useState<string[]>([])
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
        .filter(h => h.type === "hotel")
        .filter(h => location === "All Locations" || h.city === location)
        .filter(h => starFilter === t("stays.allStars") || h.stars === parseInt(starFilter))
        .filter(h => amenityFilter.every(a => h.amenities.includes(a)))

    const sorted = [...filtered].sort((a, b) => {
        if (sortBy === "Price: Low to High") return a.pricePerNight - b.pricePerNight
        if (sortBy === "Price: High to Low") return b.pricePerNight - a.pricePerNight
        if (sortBy === "Most Reviews") return b.reviewCount - a.reviewCount
        return b.rating - a.rating
    })

    const toggleAmenity = (a: string) => setAmenityFilter(prev => prev.includes(a) ? prev.filter(x => x !== a) : [...prev, a])

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
            {/* Filter Bar */}
            <div className="glass-panel p-5 bg-card/40 border-border/50 shadow-xl relative overflow-hidden">
                <div className="flex flex-col gap-5">
                    <div className="flex flex-wrap gap-3 items-center justify-between">
                        <div className="flex gap-1.5 flex-wrap">
                            {starFilters.map(f => (
                                <button key={f} onClick={() => setStarFilter(f)}
                                    className={cn("glass-tab-base px-3 py-1 text-[8px] font-medium uppercase tracking-widest transition-all",
                                        starFilter === f ? "glass-tab-active" : "text-muted-foreground hover:text-foreground"
                                    )}>{f}</button>
                            ))}
                        </div>
                        <div className="relative group min-w-[180px]">
                            <select 
                                value={sortBy} 
                                onChange={e => setSortBy(e.target.value)}
                                className="glass-input w-full text-[10px] font-medium uppercase tracking-widest text-muted-foreground px-5 py-2.5 focus:outline-none cursor-pointer hover:border-primary/40 transition-all appearance-none outline-none shadow-lg pr-10"
                                title="Sort by"
                            >
                                {sortOptions.map(o => <option key={o.value} value={o.value} className="bg-background text-foreground">{o.label}</option>)}
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-primary">
                                <Plus className="w-3.5 h-3.5 rotate-45" />
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-3 flex-wrap items-center pt-4 border-t border-border/10">
                        <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-primary mr-3">{t("stays.filters")}:</span>
                        {amenityFilters.map(a => (
                            <button key={a} onClick={() => toggleAmenity(a)}
                                className={cn("flex items-center gap-2 rounded-xl px-3 py-1.5 text-[8px] font-medium uppercase tracking-widest transition-all border",
                                    amenityFilter.includes(a)
                                        ? "bg-primary/15 text-primary border-primary/40 shadow-[0_0_15px_rgba(var(--primary),0.1)]"
                                        : "bg-muted/30 text-muted-foreground border-white/5 hover:border-primary/30"
                                )}>
                                <span className="text-primary scale-75">{amenityIcons[a]}</span> {t(`stays.amenities.${a}`)}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

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
                            <p className="text-xs text-foreground font-medium uppercase tracking-widest">
                                {t("stays.propertiesSelected", { count: selected.length })}
                            </p>
                            <div className="flex items-center gap-1.5 mt-1">
                                <Plus className="w-3 h-3 text-primary" />
                                <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-tight">{t("stays.selectUpTo3")}</p>
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={handleCompare}
                        disabled={selected.length < 2}
                        className={cn("rounded-2xl px-8 py-3 text-[10px] font-medium uppercase tracking-[0.2em] transition-all shadow-xl hover:scale-105 active:scale-95",
                            selected.length >= 2
                                ? "bg-primary text-primary-foreground shadow-primary/40 hover:shadow-primary/60"
                                : "bg-muted/50 text-muted-foreground cursor-not-allowed opacity-50"
                        )}>
                        {t("stays.analyzeComparison")}
                    </button>
                </div>
            )}

            {/* Grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {sorted.map(h => (
                    <div key={h.id}
                        className={cn("group flex flex-col glass-card overflow-hidden relative shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2",
                            selected.includes(h.id) ? "border-primary/60 ring-2 ring-primary/20 z-10" : "hover:border-primary/40"
                        )}>

                        {/* Image Container */}
                        <div className="relative h-36 w-full overflow-hidden">
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
                                    <span className="px-3 py-1 bg-amber-500 text-white text-[9px] font-medium uppercase tracking-widest rounded-full shadow-xl">
                                        {t("stays.bestValue")}
                                    </span>
                                )}
                                {h.recommended && (
                                    <span className="px-3 py-1 bg-primary text-white text-[9px] font-medium uppercase tracking-widest rounded-full shadow-xl border border-white/20">
                                        {t("stays.aiRecommended")}
                                    </span>
                                )}
                            </div>

                            {/* Price Overlay */}
                            <div className="absolute bottom-3 right-3 text-right transform group-hover:translate-x-[-2px] transition-transform">
                                <p className="text-xl font-medium text-white leading-none">${h.pricePerNight}</p>
                                <p className="text-[8px] text-white/70 font-medium uppercase tracking-[0.2em] mt-1">{t("stays.perNight")}</p>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-4 flex-1 flex flex-col relative text-balance">
                            <div className="flex-1">
                                <h3 className="text-sm font-medium text-foreground group-hover:text-primary transition-colors tracking-tight line-clamp-1">{h.name}</h3>

                                <div className="flex items-center justify-between mt-3">
                                    <div className="flex items-center gap-2">
                                        <div className="p-1 bg-primary/10 rounded-lg shadow-inner">
                                            <MapPin className="w-3.5 h-3.5 text-primary" />
                                        </div>
                                        <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">{h.city}</p>
                                    </div>
                                    <StarRating stars={h.stars} />
                                </div>

                                <p className="text-[11px] text-muted-foreground mt-5 line-clamp-2 italic leading-relaxed font-medium">
                                    "{h.description}"
                                </p>

                                {/* Amenities Row */}
                                <div className="flex flex-wrap gap-1.5 mt-3">
                                    {h.amenities.slice(0, 4).map(a => (
                                        <div key={a} className="flex items-center gap-1.5 bg-muted/30 px-2 py-1 rounded-xl border border-white/5 shadow-inner group/amenity">
                                            <span className="text-primary scale-75 transition-transform group-hover/amenity:scale-90">{amenityIcons[a] ?? null}</span>
                                            <span className="text-[8px] font-medium text-muted-foreground uppercase tracking-tight">{t(`stays.amenities.${a}`)}</span>
                                        </div>
                                    ))}
                                    {h.amenities.length > 4 && (
                                        <span className="text-[8px] font-medium text-primary/60 self-center ml-1.5 uppercase tracking-tighter">+{h.amenities.length - 4}</span>
                                    )}
                                </div>
                            </div>

                            {/* Footer / Stats */}
                            <div className="mt-5 pt-3 border-t border-border/10 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="h-8 w-8 rounded-xl bg-primary/10 flex items-center justify-center font-medium text-primary text-sm shadow-inner border border-primary/5">
                                        {h.rating}
                                    </div>
                                    <div>
                                        <p className="text-[8px] font-medium text-foreground uppercase tracking-widest leading-none">{t("stays.exceptional")}</p>
                                        <p className="text-[7px] font-medium text-muted-foreground mt-0.5 uppercase tracking-tighter">{t("stays.verifiedReviews", { count: h.reviewCount })}</p>
                                    </div>
                                </div>

                                <button
                                    onClick={(e) => toggleSelect(h.id, e)}
                                    className={cn(
                                        "btn-compare-standard px-3 py-2 rounded-xl shadow-lg hover:scale-105 active:scale-95 transition-all text-[8px]",
                                        selected.includes(h.id) ? "bg-primary/20 text-primary border-primary/30" : "bg-primary text-primary-foreground"
                                    )}
                                >
                                    {selected.includes(h.id) ? (
                                        <>
                                            <CheckCircle2 className="w-3 h-3" />
                                            <span>{t("common.added")}</span>
                                        </>
                                    ) : (
                                        <>
                                            <Plus className="w-3 h-3" />
                                            <span>{t("common.addToCompare")}</span>
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

