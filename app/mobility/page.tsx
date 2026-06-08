"use client"

import { useState } from "react"
import { CategorySelector } from "@/components/category-selector"
import { LocationFilterPill } from "@/components/location-filter-pill"
import { TransportOverview } from "@/components/transport/transport-overview"
import { TransportVehicles } from "@/components/transport/transport-vehicles"
import { TransportDrivingSchools } from "@/components/transport/transport-driving-schools"
import { TransportBusSection } from "@/components/transport/transport-bus-section"
import { useEffect } from "react"
import { useAppStore } from "@/lib/store"
import { TransportCompareBar } from "@/components/transport/transport-compare-bar"
import { PageHeader } from "@/components/page-header"


import { analyzeInput, AnalysisResult } from "@/lib/neural-engine"
import { NeuralAnalysisPanel } from "@/components/neural-analysis-panel"


const tabs = [
    { key: "overview", label: "Overview" },
    { key: "cars", label: "Cars" },
    { key: "schools", label: "Driving Schools" },
    { key: "bus", label: "Bus" },
    { key: "analysis", label: "Mobility Compare" },
] as const

export default function MobilityPage() {
    const [tab, setTab] = useState<string>("overview")
    const [location, setLocation] = useState<string>("All Locations")
    const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)
    const { compareTray, clearCompareTray } = useAppStore()

    const [vehicles, setVehicles] = useState<any[]>([])
    const [dealerships, setDealerships] = useState<any[]>([])
    const [busRoutes, setBusRoutes] = useState<any[]>([])
    const [drivingSchools, setDrivingSchools] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchData() {
            setLoading(true)
            try {
                const [vehRes, dealRes, busRes, drvRes] = await Promise.all([
                    fetch('/api/mobility/vehicles'),
                    fetch('/api/mobility/dealerships'),
                    fetch('/api/mobility/bus-routes'),
                    fetch('/api/mobility/driving-schools')
                ])
                const [vehData, dealData, busData, drvData] = await Promise.all([
                    vehRes.json(),
                    dealRes.json(),
                    busRes.json(),
                    drvRes.json()
                ])
                setVehicles(vehData.vehicles || [])
                setDealerships(dealData.dealerships || [])
                setBusRoutes(busData.busRoutes || [])
                setDrivingSchools(drvData.drivingSchools || [])
            } catch (err) {
                console.error("Failed to fetch mobility data:", err)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    // Clear stale comparison state if not mobility
    useEffect(() => {
        if (compareTray.ids.length > 0 && compareTray.category !== "mobility") {
            clearCompareTray()
        }
    }, [compareTray.category, compareTray.ids.length, clearCompareTray])

    const handleAnalysis = (result: AnalysisResult | null) => {
        setAnalysisResult(result)
        if (result && tab !== "analysis") {
            setTab("analysis")
        }
    }

    return (
        <div className="space-y-6">
            <PageHeader
                title="Mobility Intelligence"
                subtitle="Compare vehicle dealerships, driving schools and bus routes in Zimbabwe with high-fidelity accuracy."
            />



            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <CategorySelector
                    value={tab}
                    onValueChange={setTab}
                    categories={tabs}
                    mainCategory="mobility"
                    onAnalysis={handleAnalysis}
                />

                {(tab === "overview" || tab === "cars" || tab === "schools" || tab === "bus") && (
                    <LocationFilterPill
                        selectedLocation={location}
                        onLocationChange={setLocation}
                    />
                )}
            </div>

            <TransportCompareBar />

            {/* Tab Content */}
            <div className="mt-6 animate-in fade-in duration-500">
                {loading ? (
                    <div className="flex items-center justify-center min-h-[400px]">
                        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : (
                    <>
                        {tab === "overview" && <TransportOverview location={location} dealerships={dealerships} />}
                        {tab === "cars" && <TransportVehicles location={location} vehicles={vehicles} dealerships={dealerships} />}
                        {tab === "schools" && <TransportDrivingSchools location={location} schools={drivingSchools} />}
                        {tab === "bus" && <TransportBusSection location={location} routes={busRoutes} />}
                    </>
                )}
                {tab === "analysis" && (
                    <div className="space-y-6">
                        {analysisResult ? (
                            <NeuralAnalysisPanel result={analysisResult} />
                        ) : (
                            <div className="glass-panel p-12 text-center">
                                <p className="text-muted-foreground font-playfair italic">
                                    Enter your mobility budget or requirements in the input above for neural transport optimization.
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

