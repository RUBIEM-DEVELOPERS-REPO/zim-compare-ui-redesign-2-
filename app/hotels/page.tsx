"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { HotelsOverview } from "@/components/hotels/hotels-overview"
import { HotelsList } from "@/components/hotels/hotels-list"
import { LodgesList } from "@/components/hotels/lodges-list"
import { HotelsDeals } from "@/components/hotels/hotels-deals"
import { HotelsSeasonal } from "@/components/hotels/hotels-seasonal"
import { HotelsReviews } from "@/components/hotels/hotels-reviews"
import { LocationFilterPill } from "@/components/location-filter-pill"
import { CategorySelector } from "@/components/category-selector"

const tabs = [
    { key: "overview", label: "Overview" },
    { key: "hotels", label: "Hotels" },
    { key: "lodges", label: "Lodges" },
    { key: "deals", label: "Deals & Packages" },
    { key: "seasonal", label: "Seasonal Prices" },
    { key: "reviews", label: "Reviews & Ratings" },
] as const

export default function HotelsPage() {
    const [tab, setTab] = useState<string>("overview")
    const [location, setLocation] = useState<string>("All Locations")

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-xl font-semibold text-foreground">Hotels & Lodges</h1>
                <p className="text-sm text-muted-foreground">Compare Zimbabwe hotels, lodges, and accommodation deals</p>
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <CategorySelector
                    value={tab}
                    onValueChange={setTab}
                    categories={tabs}
                />
                <LocationFilterPill selectedLocation={location} onLocationChange={setLocation} />
            </div>

            {tab === "overview" && <HotelsOverview location={location} />}
            {tab === "hotels" && <HotelsList location={location} />}
            {tab === "lodges" && <LodgesList location={location} />}
            {tab === "deals" && <HotelsDeals location={location} />}
            {tab === "seasonal" && <HotelsSeasonal />}
            {tab === "reviews" && <HotelsReviews location={location} />}
        </div>
    )
}
