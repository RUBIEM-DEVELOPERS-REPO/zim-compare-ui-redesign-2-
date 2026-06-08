"use client"

import { useState, useEffect } from "react"
import { useAppStore } from "@/lib/store"
import { cn } from "@/lib/utils"
import { SchoolsOverview } from "@/components/schools/schools-overview"
import { SchoolsFees } from "@/components/schools/schools-fees"
import { SchoolsProfiles } from "@/components/schools/schools-profiles"
import { LocationFilterPill } from "@/components/location-filter-pill"
import { CategorySelector } from "@/components/category-selector"
import { PageHeader } from "@/components/page-header"

import { analyzeInput, AnalysisResult } from "@/lib/neural-engine"
import { NeuralAnalysisPanel } from "@/components/neural-analysis-panel"

import { AcademicResultsAnalyzer } from "@/components/schools/academic-results-analyzer"

const tabs = [
  { key: "overview", label: "Overview" },
  { key: "fees", label: "Fees & Rankings" },
  { key: "academics", label: "Academics" },
  { key: "facilities", label: "Facilities & Safety" },
  { key: "profiles", label: "School Profiles" },
  { key: "results", label: "Academic Results Analyzer" },
] as const

export function SchoolsSection() {
  const [tab, setTab] = useState<string>("overview")
  const [location, setLocation] = useState<string>("All Locations")
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)
  const { compareTray, clearCompareTray } = useAppStore()

  const [schools, setSchools] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchSchools() {
      setLoading(true)
      try {
        const res = await fetch('/api/schools')
        const data = await res.json()
        setSchools(data.schools || [])
      } catch (err) {
        console.error("Failed to fetch schools:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchSchools()
  }, [])

  // Clear stale comparison state if not schools
  useEffect(() => {
    if (compareTray.ids.length > 0 && compareTray.category !== "schools") {
      clearCompareTray()
    }
  }, [compareTray.category, compareTray.ids.length, clearCompareTray])

  const handleAnalysis = (result: AnalysisResult | null) => {
    setAnalysisResult(result)
    if (result && tab !== "results") {
      setTab("results")
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <PageHeader
        title="Academic Intelligence"
        subtitle="Compare Zimbabwean schools by fees, academics, and facilities with high-fidelity performance metrics."
      />


      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <CategorySelector
          value={tab}
          onValueChange={setTab}
          categories={tabs}
          label="School Category"
          mainCategory="schools"
          onAnalysis={handleAnalysis}
        />

        <LocationFilterPill
          selectedLocation={location}
          onLocationChange={setLocation}
        />
      </div>

      <div className="flex-1 pb-10">
        {loading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {tab === "overview" && <SchoolsOverview onTabChange={setTab} location={location} schools={schools} />}
            {tab === "fees" && <SchoolsFees location={location} schools={schools} />}
            {tab === "academics" && <SchoolsFees location={location} schools={schools} />}
            {tab === "facilities" && <SchoolsProfiles location={location} schools={schools} />}
            {tab === "profiles" && <SchoolsProfiles location={location} schools={schools} />}
            {tab === "results" && <AcademicResultsAnalyzer />}
          </>
        )}
      </div>
    </div>
  )
}
