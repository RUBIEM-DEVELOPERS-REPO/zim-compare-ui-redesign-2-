"use client"

import { useState } from "react"
import { HotelsOverview } from "@/components/hotels/hotels-overview"
import { HotelsList } from "@/components/hotels/hotels-list"
import { LodgesList } from "@/components/hotels/lodges-list"
import { HotelsDeals } from "@/components/hotels/hotels-deals"
import { HotelsSeasonal } from "@/components/hotels/hotels-seasonal"
import { HotelsReviews } from "@/components/hotels/hotels-reviews"
import { LocationFilterPill } from "@/components/location-filter-pill"
import { CategorySelector } from "@/components/category-selector"
import { useEffect } from "react"
import { useAppStore } from "@/lib/store"
import { useI18n } from "@/lib/i18n"
import { PageHeader } from "@/components/page-header"


import { analyzeInput, AnalysisResult } from "@/lib/neural-engine"
import { NeuralAnalysisPanel } from "@/components/neural-analysis-panel"

export default function HospitalityPage() {
    const [tab, setTab] = useState<string>("overview")
    const [location, setLocation] = useState<string>("All Locations")
    const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)
    const { t } = useI18n()
    const { compareTray, clearCompareTray } = useAppStore()

    // Clear stale comparison state if not stayscape
    useEffect(() => {
        if (compareTray.ids.length > 0 && compareTray.category !== "stayscape") {
            clearCompareTray()
        }
    }, [compareTray.category, compareTray.ids.length, clearCompareTray])

    const handleAnalysis = (result: AnalysisResult | null) => {
        setAnalysisResult(result)
        if (result && tab !== "analysis") {
            setTab("analysis")
        }
    }

    const localizedTabs = [
        { key: "overview", label: t("common.overview") },
        { key: "hotels", label: t("stays.hotels") || "Hotels" },
        { key: "lodges", label: t("stays.lodges") || "Lodges" },
        { key: "deals", label: t("stays.currentDeals") },
        { key: "seasonal", label: t("stays.priceTrends") },
        { key: "reviews", label: t("stays.guestReviews") },
        { key: "analysis", label: "Hospitality Insights" },
    ]

    return (
        <div className="space-y-6">
            <PageHeader
                title="Hospitality Intelligence"
                subtitle={t("stays.hospitalitySubtitle")}
            />


            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <CategorySelector
                    value={tab}
                    onValueChange={setTab}
                    categories={localizedTabs}
                    label={t("common.category")}
                    mainCategory="hospitality"
                    onAnalysis={handleAnalysis}
                />
                <LocationFilterPill selectedLocation={location} onLocationChange={setLocation} />
            </div>

            <div className="animate-in fade-in duration-500">
                {tab === "overview" && <HotelsOverview location={location} />}
                {tab === "hotels" && <HotelsList location={location} />}
                {tab === "lodges" && <LodgesList location={location} />}
                {tab === "deals" && <HotelsDeals location={location} />}
                {tab === "seasonal" && <HotelsSeasonal />}
                {tab === "reviews" && <HotelsReviews location={location} />}
                {tab === "analysis" && (
                    <div className="space-y-6">
                        {analysisResult ? (
                            <NeuralAnalysisPanel result={analysisResult} />
                        ) : (
                            <div className="glass-panel p-12 text-center">
                                <p className="text-muted-foreground font-playfair italic">
                                    Enter your nightly budget or stay requirements in the input above for neural hospitality optimization.
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

