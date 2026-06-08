"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { HotelsOverview } from "@/components/hotels/hotels-overview"
import { HotelsList } from "@/components/hotels/hotels-list"
import { LodgesList } from "@/components/hotels/lodges-list"
import { HotelsDeals } from "@/components/hotels/hotels-deals"
import { HotelsSeasonal } from "@/components/hotels/hotels-seasonal"
import { HotelsReviews } from "@/components/hotels/hotels-reviews"
import { LocationFilterPill } from "@/components/location-filter-pill"
import { CategorySelector } from "@/components/category-selector"

import { analyzeInput, AnalysisResult } from "@/lib/neural-engine"
import { NeuralAnalysisPanel } from "@/components/neural-analysis-panel"

const tabs = [
    { key: "overview", label: "Overview" },
    { key: "hotels", label: "Hotels" },
    { key: "lodges", label: "Lodges" },
    { key: "deals", label: "Deals & Packages" },
    { key: "seasonal", label: "Seasonal Prices" },
    { key: "reviews", label: "Reviews & Ratings" },
    { key: "analysis", label: "Recommendations / Analysis" },
] as const

export default function HotelsPage() {
    const [tab, setTab] = useState<string>("overview")
    const [location, setLocation] = useState<string>("All Locations")
    const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)

    const [hotels, setHotels] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchHotels() {
            setLoading(true)
            try {
                const res = await fetch('/api/hotels')
                const data = await res.json()
                setHotels(data.hotels || [])
            } catch (err) {
                console.error("Failed to fetch hotels:", err)
            } finally {
                setLoading(false)
            }
        }
        fetchHotels()
    }, [])

    const handleAnalysis = (result: AnalysisResult | null) => {
        setAnalysisResult(result)
        if (result && tab !== "analysis") {
            setTab("analysis")
        }
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-xl font-medium text-foreground">Hotels & Lodges</h1>
                <p className="text-sm text-muted-foreground">Compare Zimbabwe hotels, lodges, and accommodation deals</p>
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <CategorySelector
                    value={tab}
                    onValueChange={setTab}
                    categories={tabs}
                    mainCategory="hospitality"
                    onAnalysis={handleAnalysis}
                />
                <LocationFilterPill selectedLocation={location} onLocationChange={setLocation} />
            </div>

            <div className="animate-in fade-in duration-500">
                {loading ? (
                    <div className="flex items-center justify-center min-h-[400px]">
                        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : (
                    <>
                        {tab === "overview" && <HotelsOverview location={location} hotels={hotels} />}
                        {tab === "hotels" && <HotelsList location={location} hotels={hotels} />}
                        {tab === "lodges" && <LodgesList location={location} hotels={hotels} />}
                        {tab === "deals" && <HotelsDeals location={location} hotels={hotels} />}
                        {tab === "seasonal" && <HotelsSeasonal hotels={hotels} />}
                        {tab === "reviews" && <HotelsReviews location={location} hotels={hotels} />}
                    </>
                )}
                {tab === "analysis" && (
                    <div className="space-y-6">
                        {analysisResult ? (
                            <NeuralAnalysisPanel result={analysisResult} />
                        ) : (
                            <div className="glass-panel p-12 text-center">
                                <p className="text-muted-foreground font-playfair italic">
                                    Enter your nightly budget or stay requirements in the input above for neural stay optimization.
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

