"use client"

import { useState, useMemo, useEffect } from "react"
import { cn } from "@/lib/utils"
import { MapPin, X, ChevronDown, Loader2 } from "lucide-react"
import { UniversitiesOverview } from "@/components/universities/universities-overview"
import { UniversitiesFees } from "@/components/universities/universities-fees"
import { UniversitiesPrograms } from "@/components/universities/universities-programs"
import { UniversitiesCampus } from "@/components/universities/universities-campus"
import { UniversitiesProfiles } from "@/components/universities/universities-profiles"
import { CategorySelector } from "@/components/category-selector"
<<<<<<< Updated upstream
import { useEffect } from "react"
import { useAppStore } from "@/lib/store"
import { UniversitiesCompareBar } from "@/components/universities/universities-compare-bar"
<<<<<<< Updated upstream
=======
import type { University } from "@/lib/types"
>>>>>>> Stashed changes
=======
import { PageHeader } from "@/components/page-header"

>>>>>>> Stashed changes

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
<<<<<<< Updated upstream
    const { compareTray, clearCompareTray } = useAppStore()

    // Clear stale comparison state if not universities
    useEffect(() => {
        if (compareTray.ids.length > 0 && compareTray.category !== "universities") {
            clearCompareTray()
        }
    }, [compareTray.category, compareTray.ids.length, clearCompareTray])
=======
    const [universities, setUniversities] = useState<University[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        async function fetchUniversities() {
            try {
                setLoading(true)
                const res = await fetch("/api/universities")
                if (!res.ok) throw new Error(`API error: ${res.status}`)
                const json = await res.json()
                setUniversities(json.universities || [])
            } catch (e: any) {
                console.error("Failed to fetch universities:", e)
                setError(e.message)
            } finally {
                setLoading(false)
            }
        }
        fetchUniversities()
    }, [])
>>>>>>> Stashed changes

    const uniqueLocations = useMemo(() => {
        const cities = universities.map(u => u.location)
        return ["All Locations", ...Array.from(new Set(cities)).sort()]
    }, [universities])

    if (loading) {
        return (
            <div className="min-h-[50vh] flex items-center justify-center">
                <div className="flex flex-col items-center gap-3 text-muted-foreground">
                    <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
                    <p className="text-sm">Loading universities...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-[50vh] flex items-center justify-center">
                <div className="text-center text-sm text-red-500">
                    <p className="font-medium">Failed to load university data</p>
                    <p className="text-xs mt-1 text-muted-foreground">{error}</p>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <PageHeader
                title="University Intelligence"
                subtitle="Compare Zimbabwe universities and colleges by fees, rankings, facilities and programs"
            />


            {universities.length === 0 && (
                <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                    No university data yet. Go to the <strong>Admin Dashboard</strong> and upload a CSV file to populate this page.
                </div>
            )}

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
                                aria-label="Clear location filter"
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

<<<<<<< Updated upstream
            <UniversitiesCompareBar />

            {tab === "overview" && <UniversitiesOverview onTabChange={setTab} location={location} />}
            {tab === "fees" && <UniversitiesFees location={location} />}
            {tab === "programs" && <UniversitiesPrograms location={location} />}
            {tab === "campus" && <UniversitiesCampus location={location} />}
            {tab === "profiles" && <UniversitiesProfiles location={location} />}
=======
            {tab === "overview" && <UniversitiesOverview universities={universities} onTabChange={setTab} location={location} />}
            {tab === "fees" && <UniversitiesFees universities={universities} location={location} />}
            {tab === "programs" && <UniversitiesPrograms universities={universities} location={location} />}
            {tab === "campus" && <UniversitiesCampus universities={universities} location={location} />}
            {tab === "profiles" && <UniversitiesProfiles universities={universities} location={location} />}
>>>>>>> Stashed changes
        </div>
    )
}

