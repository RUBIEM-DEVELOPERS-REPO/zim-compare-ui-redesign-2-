"use client"

import { useState } from "react"
import { TransportDrivingSchools } from "@/components/transport/transport-driving-schools"
import { LocationFilterPill } from "@/components/location-filter-pill"

export default function DrivingSchoolsPage() {
    const [location, setLocation] = useState<string>("All Locations")

    return (
        <div className="space-y-6">
            <div className="flex justify-end">
                <LocationFilterPill selectedLocation={location} onLocationChange={setLocation} />
            </div>
            <TransportDrivingSchools location={location} />
        </div>
    )
}
