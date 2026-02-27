"use client"

import { useState } from "react"
import { CategorySelector } from "@/components/category-selector"
import { LocationFilterPill } from "@/components/location-filter-pill"
import { TransportOverview } from "@/components/transport/transport-overview"
import { TransportVehicles } from "@/components/transport/transport-vehicles"
import { TransportDrivingSchools } from "@/components/transport/transport-driving-schools"
import { TransportBusSection } from "@/components/transport/transport-bus-section"

const tabs = [
    { key: "overview", label: "Overview" },
    { key: "cars", label: "Cars" },
    { key: "schools", label: "Driving Schools" },
    { key: "bus", label: "Bus" },
] as const

export default function MobilityPage() {
    const [tab, setTab] = useState<string>("overview")
    const [location, setLocation] = useState<string>("All Locations")

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <CategorySelector
                    value={tab}
                    onValueChange={setTab}
                    categories={tabs}
                />

                {(tab === "overview" || tab === "cars" || tab === "schools" || tab === "bus") && (
                    <LocationFilterPill
                        selectedLocation={location}
                        onLocationChange={setLocation}
                    />
                )}
            </div>

            {/* Tab Content */}
            <div className="mt-6">
                {tab === "overview" && <TransportOverview location={location} />}
                {tab === "cars" && <TransportVehicles location={location} />}
                {tab === "schools" && <TransportDrivingSchools location={location} />}
                {tab === "bus" && <TransportBusSection location={location} />}
            </div>
        </div>
    )
}
