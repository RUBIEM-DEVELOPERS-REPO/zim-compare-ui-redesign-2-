"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { UtilitiesOverview } from "@/components/utilities/utilities-overview"
import { UtilitiesElectricity } from "@/components/utilities/utilities-electricity"
import { UtilitiesWater } from "@/components/utilities/utilities-water"
import { UtilitiesSubscriptions } from "@/components/utilities/utilities-subscriptions"
import { LocationFilterPill } from "@/components/location-filter-pill"
import { CategorySelector } from "@/components/category-selector"
import { Zap, Droplets, CreditCard, LayoutDashboard } from "lucide-react"
import { UtilitiesCompareBar } from "@/components/utilities/utilities-compare-bar"
import { PageHeader } from "@/components/page-header"


import { analyzeInput, AnalysisResult } from "@/lib/neural-engine"
import { NeuralAnalysisPanel } from "@/components/neural-analysis-panel"

const tabs = [
    { key: "overview", label: "Overview", icon: LayoutDashboard },
    { key: "electricity", label: "Electricity", icon: Zap },
    { key: "water", label: "Water", icon: Droplets },
    { key: "subscriptions", label: "Subscriptions", icon: CreditCard },
    { key: "analysis", label: "Utility Compare", icon: LayoutDashboard },
] as const

export default function UtilitiesPage() {
    const [tab, setTab] = useState<string>("overview")
    const [location, setLocation] = useState<string>("All Locations")
    const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)

    const [utilities, setUtilities] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchUtilities() {
            setLoading(true)
            try {
                const res = await fetch('/api/utilities')
                const data = await res.json()
                setUtilities(data.utilities || [])
            } catch (err) {
                console.error("Failed to fetch utilities:", err)
            } finally {
                setLoading(false)
            }
        }
        fetchUtilities()
    }, [])

    const handleAnalysis = (result: AnalysisResult | null) => {
        setAnalysisResult(result)
        if (result && tab !== "analysis") {
            setTab("analysis")
        }
    }

    return (
        <div className="space-y-6">
            <PageHeader
                title="Utility Intelligence"
                subtitle="Compare Zimbabwe recurring services — electricity, water, and subscriptions"
            />



            <UtilitiesCompareBar />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <CategorySelector
                    value={tab}
                    onValueChange={setTab}
                    categories={tabs}
                    mainCategory="utilities"
                    onAnalysis={handleAnalysis}
                />
                {(tab === "overview" || tab === "electricity" || tab === "water") && (
                    <LocationFilterPill selectedLocation={location} onLocationChange={setLocation} />
                )}
            </div>

            <div className="animate-in fade-in duration-500 mt-6">
                {loading ? (
                    <div className="flex items-center justify-center min-h-[400px]">
                        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : (
                    <>
                        {tab === "overview" && <UtilitiesOverview utilities={utilities} />}
                        {tab === "electricity" && <UtilitiesElectricity location={location} utilities={utilities} />}
                        {tab === "water" && <UtilitiesWater location={location} utilities={utilities} />}
                        {tab === "subscriptions" && <UtilitiesSubscriptions utilities={utilities} />}
                    </>
                )}
                {tab === "analysis" && (
                    <div className="space-y-6">
                        {analysisResult ? (
                            <NeuralAnalysisPanel result={analysisResult} />
                        ) : (
                            <div className="glass-panel p-12 text-center">
                                <p className="text-muted-foreground font-playfair italic">
                                    Enter your monthly utility spend in the input above for neural cost optimization.
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

