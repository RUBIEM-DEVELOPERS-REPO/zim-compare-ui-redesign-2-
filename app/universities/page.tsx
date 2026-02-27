"use client"

import { useState, useMemo } from "react"
import { cn } from "@/lib/utils"
import { universities } from "@/lib/mock/universities"
import { MapPin, X, ChevronDown } from "lucide-react"
import { UniversitiesOverview } from "@/components/universities/universities-overview"
import { UniversitiesFees } from "@/components/universities/universities-fees"
import { UniversitiesPrograms } from "@/components/universities/universities-programs"
import { UniversitiesCampus } from "@/components/universities/universities-campus"
import { UniversitiesProfiles } from "@/components/universities/universities-profiles"
import { CategorySelector } from "@/components/category-selector"

const tabs = [
    { key: "overview", label: "Overview" },
    { key: "fees", label: "Fees & Rankings" },
    { key: "programs", label: "Programs" },
    { key: "campus", label: "Campus Life" },
    { key: "profiles", label: "University Profiles" },
] as const

export default function UniversitiesPage() {
    const [tab, setTab] = useState<string>("overview")
    const [location, setLocation] = useState<string>("All Locations")
    const [isLocationOpen, setIsLocationOpen] = useState(false)

    const uniqueLocations = useMemo(() => {
        const cities = universities.map(u => u.city)
        return ["All Locations", ...Array.from(new Set(cities)).sort()]
    }, [])

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-xl font-semibold text-foreground">Universities</h1>
                <p className="text-sm text-muted-foreground">Compare Zimbabwe universities and colleges by fees, rankings, facilities and programs</p>
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                {/* Category Dropdown */}
                <CategorySelector
                    value={tab}
                    onValueChange={setTab}
                    categories={tabs}
                />

                {/* Location Filter */}
                <div className="relative shrink-0">
                    <button
                        onClick={() => setIsLocationOpen(!isLocationOpen)}
                        onBlur={() => setTimeout(() => setIsLocationOpen(false), 200)}
                        className={cn(
                            "flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition-all w-full md:w-auto justify-between md:justify-start",
                            location !== "All Locations"
                                ? "bg-teal-50 border-teal-200 text-teal-700"
                                : "bg-white border-border text-muted-foreground hover:border-gray-300"
                        )}
                    >
                        <div className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5" />
                            <span>{location}</span>
                        </div>
                        {location !== "All Locations" ? (
                            <div
                                role="button"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    setLocation("All Locations")
                                }}
                                className="hover:bg-teal-100 rounded-full p-0.5 ml-1"
                            >
                                <X className="w-3 h-3" />
                            </div>
                        ) : (
                            <ChevronDown className="w-3.5 h-3.5 opacity-50" />
                        )}
                    </button>

                    {/* Dropdown Menu */}
                    {isLocationOpen && (
                        <div className="absolute right-0 top-full mt-2 w-48 rounded-xl border border-border bg-popover p-1 shadow-lg z-50 animate-in fade-in zoom-in-95">
                            <div className="max-h-64 overflow-y-auto scrollbar-thin">
                                {uniqueLocations.map((loc) => (
                                    <button
                                        key={loc}
                                        onClick={() => {
                                            setLocation(loc)
                                            setIsLocationOpen(false)
                                        }}
                                        className={cn(
                                            "w-full rounded-lg px-3 py-2 text-xs font-medium text-left transition-colors flex items-center justify-between",
                                            location === loc
                                                ? "bg-teal-50 text-teal-700"
                                                : "text-foreground hover:bg-muted"
                                        )}
                                    >
                                        {loc}
                                        {location === loc && <MapPin className="w-3 h-3" />}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {tab === "overview" && <UniversitiesOverview onTabChange={setTab} location={location} />}
            {tab === "fees" && <UniversitiesFees location={location} />}
            {tab === "programs" && <UniversitiesPrograms location={location} />}
            {tab === "campus" && <UniversitiesCampus location={location} />}
            {tab === "profiles" && <UniversitiesProfiles location={location} />}
        </div>
    )
}
