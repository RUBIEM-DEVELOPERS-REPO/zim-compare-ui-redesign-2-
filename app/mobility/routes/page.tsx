"use client"

import { useState } from "react"
import { TransportBusRoutes } from "@/components/transport/transport-bus-routes"
import { LocationFilterPill } from "@/components/location-filter-pill"

export default function BusRoutesPage() {
    const [location, setLocation] = useState<string>("All Locations")

    return (
        <div className="space-y-6">
            <div className="flex justify-end">
                <LocationFilterPill selectedLocation={location} onLocationChange={setLocation} />
            </div>
            <TransportBusRoutes location={location} />
        </div>
    )
}
