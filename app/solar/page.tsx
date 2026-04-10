"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { SolarOverview } from "@/components/solar/solar-overview"
import { SolarPackages } from "@/components/solar/solar-packages"
import { BoreholePackages } from "@/components/solar/borehole-packages"
import { SolarProviders } from "@/components/solar/solar-providers"
import { SolarRoiCalculator } from "@/components/solar/solar-roi-calculator"
import { SolarRoiCharts } from "@/components/solar/solar-roi-charts"
import { SolarMaintenance } from "@/components/solar/solar-maintenance"
import { LocationFilterPill } from "@/components/location-filter-pill"
import { useEffect } from "react"
import { useAppStore } from "@/lib/store"

const tabs = [
    { key: "overview", label: "Overview" },
    { key: "solar", label: "Solar Packages" },
    { key: "borehole", label: "Borehole Packages" },
    { key: "providers", label: "Providers" },
    { key: "roi", label: "ROI Calculator" },
    { key: "charts", label: "ROI Charts" },
    { key: "maintenance", label: "Maintenance & Warranty" },
] as const

export default function SolarPage() {
    const [tab, setTab] = useState<string>("overview")
    const [location, setLocation] = useState<string>("All Locations")
    const { compareTray, clearCompareTray } = useAppStore()

    // Clear stale comparison state if not solar or boreholes
    useEffect(() => {
        if (compareTray.ids.length > 0 && !["solar", "boreholes"].includes(compareTray.category)) {
            clearCompareTray()
        }
    }, [compareTray.category, compareTray.ids.length, clearCompareTray])

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-xl font-semibold text-foreground">Solar & Borehole</h1>
                <p className="text-sm text-muted-foreground">Compare Zimbabwe solar energy and borehole drilling companies</p>
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-none">
                    {tabs.map((t) => (
                        <button
                            key={t.key}
                            onClick={() => setTab(t.key)}
                            className={cn(
                                "shrink-0 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                                tab === t.key
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-secondary/50 text-muted-foreground hover:text-foreground hover:bg-secondary"
                            )}
                        >
                            {t.label}
                        </button>
                    ))}
                </div>
                <LocationFilterPill selectedLocation={location} onLocationChange={setLocation} />
            </div>

            {tab === "overview" && <SolarOverview location={location} />}
            {tab === "solar" && <SolarPackages location={location} />}
            {tab === "borehole" && <BoreholePackages location={location} />}
            {tab === "providers" && <SolarProviders location={location} />}
            {tab === "roi" && <SolarRoiCalculator />}
            {tab === "charts" && <SolarRoiCharts />}
            {tab === "maintenance" && <SolarMaintenance />}
        </div>
    )
}
