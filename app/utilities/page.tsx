"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { UtilitiesOverview } from "@/components/utilities/utilities-overview"
import { UtilitiesElectricity } from "@/components/utilities/utilities-electricity"
import { UtilitiesWater } from "@/components/utilities/utilities-water"
import { UtilitiesSubscriptions } from "@/components/utilities/utilities-subscriptions"
import { LocationFilterPill } from "@/components/location-filter-pill"
import { CategorySelector } from "@/components/category-selector"
import { Zap, Droplets, CreditCard, LayoutDashboard } from "lucide-react"
import { UtilitiesCompareBar } from "@/components/utilities/utilities-compare-bar"

const tabs = [
    { key: "overview", label: "Overview", icon: LayoutDashboard },
    { key: "electricity", label: "Electricity", icon: Zap },
    { key: "water", label: "Water", icon: Droplets },
    { key: "subscriptions", label: "Subscriptions", icon: CreditCard },
] as const

export default function UtilitiesPage() {
    const [tab, setTab] = useState<string>("overview")
    const [location, setLocation] = useState<string>("All Locations")

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-xl font-semibold text-foreground">Utilities</h1>
                <p className="text-sm text-muted-foreground">Compare Zimbabwe recurring services — electricity, water, and subscriptions</p>
            </div>

            <UtilitiesCompareBar />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <CategorySelector
                    value={tab}
                    onValueChange={setTab}
                    categories={tabs}
                />
                {tab !== "subscriptions" && (
                    <LocationFilterPill selectedLocation={location} onLocationChange={setLocation} />
                )}
            </div>

            {tab === "overview" && <UtilitiesOverview />}
            {tab === "electricity" && <UtilitiesElectricity location={location} />}
            {tab === "water" && <UtilitiesWater location={location} />}
            {tab === "subscriptions" && <UtilitiesSubscriptions />}
        </div>
    )
}
