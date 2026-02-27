"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { TransportDealerships } from "@/components/transport/transport-dealerships"
import { TransportVehicles } from "@/components/transport/transport-vehicles"
import { TransportVehicleCompare } from "@/components/transport/transport-vehicle-compare"
import { TransportDrivingSchools } from "@/components/transport/transport-driving-schools"
import { TransportBusRoutes } from "@/components/transport/transport-bus-routes"
import { TransportRouteSelector } from "@/components/transport/transport-route-selector"
import { TransportEmiCalculator } from "@/components/transport/transport-emi-calculator"
import { TransportCrossBorder } from "@/components/transport/transport-crossborder"
import { LocationFilterPill } from "@/components/location-filter-pill"

const tabs = [
    { key: "dealerships", label: "Car Dealerships" },
    { key: "vehicles", label: "Car Prices" },
    { key: "compare", label: "Vehicle Comparison" },
    { key: "schools", label: "Driving Schools" },
    { key: "routes", label: "Bus Routes" },
    { key: "selector", label: "Route Selector" },
    { key: "emi", label: "EMI Calculator" },
    { key: "crossborder", label: "Cross-Border" },
] as const

export default function TransportPage() {
    const [tab, setTab] = useState<string>("dealerships")
    const [location, setLocation] = useState<string>("All Locations")

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-xl font-semibold text-foreground">Transport & Automotive</h1>
                <p className="text-sm text-muted-foreground">Compare car dealerships, vehicles, driving schools, and bus routes in Zimbabwe</p>
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

            {tab === "dealerships" && <TransportDealerships location={location} />}
            {tab === "vehicles" && <TransportVehicles location={location} />}
            {tab === "compare" && <TransportVehicleCompare />}
            {tab === "schools" && <TransportDrivingSchools location={location} />}
            {tab === "routes" && <TransportBusRoutes location={location} />}
            {tab === "selector" && <TransportRouteSelector />}
            {tab === "emi" && <TransportEmiCalculator />}
            {tab === "crossborder" && <TransportCrossBorder />}
        </div>
    )
}
