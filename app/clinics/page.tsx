"use client"

import { useState } from "react"
import { PageHeader } from "@/components/page-header"
import { CategorySelector } from "@/components/category-selector"
import { healthcareProviders } from "@/lib/mock/clinics"
import { Star, MapPin, Clock, Stethoscope, Activity, ShieldCheck, HeartPulse, DollarSign } from "lucide-react"
import { cn } from "@/lib/utils"

import { analyzeInput, AnalysisResult } from "@/lib/neural-engine"
import { NeuralAnalysisPanel } from "@/components/neural-analysis-panel"
import { ClinicsOverview } from "@/components/clinics/clinics-overview"
import { LocationFilterPill } from "@/components/location-filter-pill"
import { ClinicsAnalysisPanel } from "@/components/clinics/clinics-analysis-panel"
import { Trash2, Plus } from "lucide-react"

const categories = [
    { key: "all", label: "Overview" },
    { key: "hospital", label: "Hospitals" },
    { key: "private_clinic", label: "Private Clinics" },
    { key: "pharmacy", label: "Pharmacies" },
]

export default function ClinicsPage() {
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

    const filteredProviders = category === "all" || category === "analysis"
        ? healthcareProviders 
        : healthcareProviders.filter(p => p.type === category)

    const selectedProviders = healthcareProviders.filter(p => selectedIds.includes(p.id))

    return (
        <div className="space-y-6 animate-in fade-in duration-700">
            <PageHeader 
                title="Medical Intelligence"
                subtitle="Compare consultation fees, wait times, and care quality across Zimbabwe’s healthcare providers."
            />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <CategorySelector 
                    value={category}
                    onValueChange={setCategory}
                    categories={categories}
                    mainCategory="clinics"
                    label="Facility Type"
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
                            <HeartPulse className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-white uppercase tracking-widest">{selectedIds.length} Facilities Selected</p>
                            <p className="text-[10px] text-muted-foreground uppercase font-medium mt-0.5">
                                {selectedIds.length < 2 ? "Select 1 more to unlock medical analysis" : "Ready for neural healthcare matching"}
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
                        <ClinicsAnalysisPanel 
                            selectedProviders={selectedProviders} 
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
                                    Enter your medical requirements in the input above for neural healthcare matching.
                                </p>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="space-y-8">
                        {category === "all" && <ClinicsOverview location={location} />}

                        <div className="space-y-4">
                            {category !== "all" && (
                                <h3 className="text-[10px] font-medium text-white uppercase tracking-widest mb-2.5 opacity-70">
                                    {category.replace('_', ' ')} Listings in {location}
                                </h3>
                            )}
                            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                {filteredProviders.map(provider => {
                                    const isSelected = selectedIds.includes(provider.id)
                                    return (
                                        <div 
                                            key={provider.id} 
                                            className={cn(
                                                "glass-floating p-6 floating-hover group relative overflow-hidden transition-all duration-500",
                                                isSelected && "border-primary/60 bg-primary/10 ring-2 ring-primary/20 shadow-xl shadow-primary/20 teal-glow"
                                            )}
                                        >
                                            <div className="absolute top-0 right-0 p-4 text-primary/5 -rotate-12 group-hover:rotate-0 transition-transform">
                                                <HeartPulse size={64} />
                                            </div>
                                            
                                            <div className="flex justify-between items-start mb-4 relative z-10">
                                                <div>
                                                    <h3 className="text-xl font-display font-bold text-white uppercase tracking-tight group-hover:text-primary transition-colors">{provider.name}</h3>
                                                    <p className="text-[10px] text-primary font-bold uppercase tracking-[0.2em] mt-1">{provider.type.replace('_', ' ')}</p>
                                                </div>
                                                <div className="bg-primary/20 px-2 py-1 rounded-lg flex items-center gap-1 border border-primary/20 shadow-[0_0_10px_rgba(20,184,166,0.1)]">
                                                    <Star className="w-3 h-3 text-primary fill-primary" />
                                                    <span className="text-xs font-bold text-white">{provider.rating}</span>
                                                </div>
                                            </div>

                                            <div className="space-y-3 mb-6 relative z-10">
                                                <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                                                    <div className="flex items-center gap-2">
                                                        <MapPin size={12} className="text-primary" />
                                                        {provider.location}
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Clock size={12} className="text-primary" />
                                                        {provider.waitingTimeMinutes} min wait
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2 text-primary text-[10px] font-black uppercase tracking-widest">
                                                    <DollarSign size={12} />
                                                    {provider.type === 'pharmacy' ? 'Service Fee' : 'Consultation'}: ${provider.consultationFee}
                                                </div>
                                            </div>

                                            <div className="flex flex-wrap gap-2 mb-6 relative z-10">
                                                {provider.tags?.map(tag => (
                                                    <span key={tag} className="text-[8px] font-black text-muted-foreground uppercase tracking-widest bg-white/5 px-2 py-1 rounded-md border border-white/10 group-hover:border-primary/20 transition-colors">
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>

                                            <div className="pt-6 border-t border-white/5 relative z-10">
                                                <button
                                                    onClick={() => toggleCompare(provider.id)}
                                                    className={cn(
                                                        "w-full h-11 rounded-xl flex items-center justify-center gap-2 transition-all duration-500 font-black text-[10px] uppercase tracking-[0.2em]",
                                                        isSelected 
                                                            ? "bg-primary text-primary-foreground shadow-[0_0_20px_rgba(20,184,166,0.4)]" 
                                                            : "bg-white/5 border border-white/10 text-muted-foreground hover:border-primary/50 hover:text-white"
                                                    )}
                                                >
                                                    {isSelected ? (
                                                        <>
                                                            <CheckCircle2 size={14} strokeWidth={3} />
                                                            Added to Match
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Plus size={14} strokeWidth={3} />
                                                            Compare Facility
                                                        </>
                                                    )}
                                                </button>
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
