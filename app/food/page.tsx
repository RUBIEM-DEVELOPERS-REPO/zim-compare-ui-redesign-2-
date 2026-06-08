"use client"

import { useState, useMemo } from "react"
import { PageHeader } from "@/components/page-header"
import { CategorySelector } from "@/components/category-selector"
import { foodProviders, FoodProvider } from "@/lib/mock/food"
import { Star, MapPin, Clock, Utensils, Plus, CheckCircle2, Search, Trash2 } from "lucide-react"
import { FoodOverview } from "@/components/food/food-overview"
import { LocationFilterPill } from "@/components/location-filter-pill"
import { AnalysisResult } from "@/lib/neural-engine"
import { NeuralAnalysisPanel } from "@/components/neural-analysis-panel"
import { FoodAnalysisPanel } from "@/components/food/food-analysis-panel"
import { cn } from "@/lib/utils"

const categories = [
    { key: "all", label: "Overview" },
    { key: "fast_food", label: "Fast Food" },
    { key: "restaurant", label: "Fine Dining" },
    { key: "cafe", label: "Cafes" },
]

export default function FoodPage() {
    const [category, setCategory] = useState("all")
    const [location, setLocation] = useState<string>("All Locations")
    const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)
    const [selectedIds, setSelectedIds] = useState<string[]>([])

    const handleAnalysis = (result: AnalysisResult | null) => {
        setAnalysisResult(result)
        if (result && category !== "analysis") {
            setCategory("analysis")
        }
    }

    const toggleCompare = (id: string) => {
        setSelectedIds(prev => 
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        )
    }

    const clearComparison = () => setSelectedIds([])

    const filteredFood = useMemo(() => {
        let base = category === "all" || category === "analysis"
            ? foodProviders 
            : foodProviders.filter(f => f.type === category)
        
        if (location !== "All Locations") {
            base = base.filter(f => f.location.includes(location))
        }
        return base
    }, [category, location])

    const selectedOutlets = useMemo(() => 
        foodProviders.filter(f => selectedIds.includes(f.id)),
    [selectedIds])

    return (
        <div className="space-y-6 animate-in fade-in duration-700">
            <PageHeader 
                title="Gastronomic Intelligence"
                subtitle="Compare menus, pricing, and neural hygiene ratings across Zimbabwe's top dining nodes with precision analytics."
            />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <CategorySelector 
                    value={category}
                    onValueChange={setCategory}
                    categories={categories}
                    mainCategory="food"
                    label="Dining Type"
                    onAnalysis={handleAnalysis}
                />
                <LocationFilterPill 
                    selectedLocation={location} 
                    onLocationChange={setLocation} 
                />
            </div>

            {selectedIds.length > 0 && (
                <div className="flex items-center justify-between bg-primary/10 border border-primary/20 p-4 rounded-2xl animate-in slide-in-from-top duration-500 shadow-[0_0_20px_rgba(20,184,166,0.1)]">
                    <div className="flex items-center gap-4">
                        <div className="p-2 bg-primary/20 rounded-xl">
                            <Utensils className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-white uppercase tracking-widest">{selectedIds.length} Outlets Selected</p>
                            <p className="text-[10px] text-muted-foreground uppercase font-medium mt-0.5">
                                {selectedIds.length < 2 ? "Select 1 more to unlock neural comparison" : "Ready for neural analysis"}
                            </p>
                        </div>
                    </div>
                    <button 
                        onClick={clearComparison}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-muted-foreground hover:text-red-400 hover:bg-red-400/10 transition-all text-[10px] font-bold uppercase tracking-widest"
                    >
                        <Trash2 size={14} />
                        Clear
                    </button>
                </div>
            )}

            <div className="animate-in fade-in duration-500">
                {selectedIds.length >= 2 && (
                    <div className="mb-12">
                        <FoodAnalysisPanel 
                            selectedOutlets={selectedOutlets} 
                            onClear={clearComparison}
                        />
                    </div>
                )}

                {category === "analysis" ? (
                    <div className="space-y-6">
                        {analysisResult ? (
                            <NeuralAnalysisPanel result={analysisResult} />
                        ) : (
                            <div className="glass-panel p-12 text-center">
                                <p className="text-muted-foreground font-playfair italic">
                                    Enter your meal budget in the input above for neural dining optimization.
                                </p>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="space-y-8">
                        {category === "all" && <FoodOverview location={location} />}
                        
                        <div className="space-y-4">
                            {category !== "all" && (
                                <h3 className="text-[10px] font-medium text-white uppercase tracking-widest mb-2.5 opacity-70">
                                    {category.replace('_', ' ')} Listings in {location}
                                </h3>
                            )}
                            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                {filteredFood.map(food => {
                                    const isSelected = selectedIds.includes(food.id)
                                    return (
                                        <div 
                                            key={food.id} 
                                            className={cn(
                                                "group flex flex-col glass-card overflow-hidden relative shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2",
                                                isSelected ? "border-primary/60 ring-2 ring-primary/20 z-10 shadow-xl shadow-primary/20 teal-glow" : "hover:border-primary/40"
                                            )}
                                        >
                                            {/* Image Container */}
                                            <div className="relative h-44 w-full overflow-hidden bg-black/40">
                                                <div className="absolute inset-0 flex items-center justify-center p-8 bg-gradient-to-br from-primary/5 to-primary/10">
                                                    <img 
                                                        src={food.logo} 
                                                        alt={food.name} 
                                                        className="h-full w-full object-contain filter group-hover:scale-110 transition-transform duration-1000 opacity-80" 
                                                    />
                                                </div>
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80" />

                                                {/* Top Badges */}
                                                <div className="absolute top-4 left-4 flex flex-col gap-2">
                                                    {food.popularityScore > 90 && (
                                                        <span className="px-3 py-1 bg-amber-500 text-white text-[8px] font-black uppercase tracking-widest rounded-full shadow-xl">
                                                            Trending
                                                        </span>
                                                    )}
                                                    {food.rating > 4.5 && (
                                                        <span className="px-3 py-1 bg-primary text-white text-[8px] font-black uppercase tracking-widest rounded-full shadow-xl border border-white/20">
                                                            Elite Choice
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Price Overlay */}
                                                <div className="absolute bottom-4 right-4 text-right transform group-hover:translate-x-[-2px] transition-transform">
                                                    <p className="text-xl font-bold text-white leading-none">${food.avgMealPrice.toFixed(2)}</p>
                                                    <p className="text-[8px] text-white/70 font-black uppercase tracking-[0.2em] mt-1">Avg Meal</p>
                                                </div>
                                            </div>

                                            {/* Content */}
                                            <div className="p-5 flex-1 flex flex-col relative">
                                                <div className="flex-1">
                                                    <div className="flex justify-between items-start gap-2">
                                                        <h3 className="text-base font-display font-bold text-white group-hover:text-primary transition-colors tracking-tight uppercase">{food.name}</h3>
                                                        <div className="flex shrink-0">
                                                            {Array.from({ length: 5 }).map((_, i) => (
                                                                <Star key={i} className={`w-3 h-3 ${i < Math.floor(food.rating) ? "fill-primary text-primary" : "text-white/10"}`} />
                                                            ))}
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-2 mt-3 mb-4">
                                                        <div className="p-1 bg-primary/10 rounded-lg">
                                                            <MapPin className="w-3.5 h-3.5 text-primary" />
                                                        </div>
                                                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{food.location}</p>
                                                    </div>

                                                    <div className="flex flex-wrap gap-1.5 mt-4">
                                                        {food.tags.map(tag => (
                                                            <div key={tag} className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1.5 rounded-xl border border-white/5 shadow-inner hover:border-primary/20 transition-colors cursor-default">
                                                                <span className="text-[8px] font-black text-primary uppercase tracking-tight">{tag}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* Footer */}
                                                <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center font-bold text-primary text-sm shadow-inner border border-primary/5">
                                                            {food.rating}
                                                        </div>
                                                        <div>
                                                            <p className="text-[8px] font-black text-white uppercase tracking-widest leading-none">Exceptional</p>
                                                            <p className="text-[7px] font-bold text-muted-foreground mt-1 uppercase tracking-tighter">Neural Verified</p>
                                                        </div>
                                                    </div>

                                                    <button
                                                        onClick={() => toggleCompare(food.id)}
                                                        className={cn(
                                                            "h-10 px-4 rounded-xl flex items-center justify-center gap-2 transition-all duration-500 font-black text-[9px] uppercase tracking-[0.2em] shadow-lg",
                                                            isSelected 
                                                                ? "bg-primary/20 text-primary border border-primary/30" 
                                                                : "bg-primary text-primary-foreground hover:scale-105 active:scale-95"
                                                        )}
                                                    >
                                                        {isSelected ? (
                                                            <>
                                                                <CheckCircle2 size={12} strokeWidth={4} />
                                                                <span>Added</span>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Plus size={12} strokeWidth={4} />
                                                                <span>Compare</span>
                                                            </>
                                                        )}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
