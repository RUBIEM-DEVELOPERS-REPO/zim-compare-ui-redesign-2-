"use client"

import { useState } from "react"
import { TransportVehicles } from "@/components/transport/transport-vehicles"
import { LocationFilterPill } from "@/components/location-filter-pill"

export default function CarPricesPage() {
    const [location, setLocation] = useState<string>("All Locations")

    return (
        <div className="space-y-6">
            <div className="flex justify-end">
                <LocationFilterPill selectedLocation={location} onLocationChange={setLocation} />
            </div>
            <TransportVehicles location={location} />
        </div>
    )
}
