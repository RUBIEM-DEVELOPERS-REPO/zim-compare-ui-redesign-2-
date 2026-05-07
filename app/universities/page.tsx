"use client"

import { useState, useMemo, useEffect } from "react"
import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"
import { UniversitiesOverview } from "@/components/universities/universities-overview"
import { UniversitiesFees } from "@/components/universities/universities-fees"
import { UniversitiesPrograms } from "@/components/universities/universities-programs"
import { UniversitiesCampus } from "@/components/universities/universities-campus"
import { UniversitiesProfiles } from "@/components/universities/universities-profiles"
import { CategorySelector } from "@/components/category-selector"
import { useAppStore } from "@/lib/store"
import { UniversitiesCompareBar } from "@/components/universities/universities-compare-bar"
import { PageHeader } from "@/components/page-header"
import type { University } from "@/lib/types"


import { analyzeInput, AnalysisResult } from "@/lib/neural-engine"
import { NeuralAnalysisPanel } from "@/components/neural-analysis-panel"
import { UniversityResultsAnalyzer } from "@/components/universities/university-results-analyzer"
import { UniversityRecommendationForm } from "@/components/universities/university-recommendation-form"

const tabs = [
    { key: "overview", label: "Overview" },
    { key: "fees", label: "Fees & Rankings" },
    { key: "programs", label: "Programs" },
    { key: "campus", label: "Campus Life" },
    { key: "profiles", label: "University Profiles" },
    { key: "results", label: "Recommendation Engine" },
] as const

export default function UniversitiesPage() {
    const [tab, setTab] = useState<string>("overview")
    const [location, setLocation] = useState<string>("All Locations")
    const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)
    
    const { compareTray, clearCompareTray } = useAppStore()
    const [universities, setUniversities] = useState<University[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    // Clear stale comparison state if not universities
    useEffect(() => {
        if (compareTray.ids.length > 0 && compareTray.category !== "universities") {
            clearCompareTray()
        }
    }, [compareTray.category, compareTray.ids.length, clearCompareTray])

    const handleAnalysis = (result: AnalysisResult | null) => {
        setAnalysisResult(result)
        if (result && tab !== "results") {
            setTab("results")
        }
    }

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
                <div className="flex items-center gap-3 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
                    <CategorySelector
                        value={tab}
                        onValueChange={setTab}
                        categories={tabs}
                        mainCategory="schools"
                        onAnalysis={handleAnalysis}
                    />
                </div>

            </div>

            <UniversitiesCompareBar />

            <div className="animate-in fade-in duration-500">
                {tab === "overview" && <UniversitiesOverview universities={universities} onTabChange={setTab} location={location} />}
                {tab === "fees" && <UniversitiesFees universities={universities} location={location} />}
                {tab === "programs" && <UniversitiesPrograms universities={universities} location={location} />}
                {tab === "campus" && <UniversitiesCampus universities={universities} location={location} />}
                {tab === "profiles" && <UniversitiesProfiles universities={universities} location={location} />}
                {tab === "results" && <UniversityRecommendationForm />}
            </div>
        </div>
    )
}

