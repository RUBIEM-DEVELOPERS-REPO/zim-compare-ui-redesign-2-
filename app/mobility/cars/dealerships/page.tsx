"use client"

import { useState } from "react"
import { TransportDealerships } from "@/components/transport/transport-dealerships"
import { LocationFilterPill } from "@/components/location-filter-pill"

export default function DealershipsPage() {
    const [location, setLocation] = useState<string>("All Locations")

    return (
        <div className="space-y-6">
            <div className="flex justify-end">
                <LocationFilterPill selectedLocation={location} onLocationChange={setLocation} />
            </div>
            <TransportDealerships location={location} />
        </div>
    )
}
