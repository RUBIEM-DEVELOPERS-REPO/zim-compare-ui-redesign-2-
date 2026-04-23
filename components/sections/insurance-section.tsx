"use client"

import { useState, useEffect } from "react"
import { useAppStore } from "@/lib/store"
import { InsuranceOverview } from "@/components/insurance/insurance-overview"
import { InsurancePolicies } from "@/components/insurance/insurance-policies"
import { InsuranceClaims } from "@/components/insurance/insurance-claims"
import { LocationFilterPill } from "@/components/location-filter-pill"
import { CategorySelector } from "@/components/category-selector"
import { InsuranceCompareBar } from "@/components/insurance/insurance-compare-bar"

const tabs = [
  { key: "overview", label: "Overview" },
  { key: "policies", label: "Policies" },
  { key: "claims", label: "Claims" },
] as const

export function InsuranceSection() {
  const [tab, setTab] = useState<string>("overview")
  const [location, setLocation] = useState<string>("All Locations")
  const { compareTray, clearCompareTray } = useAppStore()

  // Clear stale comparison state if not insurance
  useEffect(() => {
    if (compareTray.ids.length > 0 && compareTray.category !== "insurance") {
      clearCompareTray()
    }
  }, [compareTray.category, compareTray.ids.length, clearCompareTray])

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-medium text-foreground">Insurance</h1>
        <p className="text-sm text-muted-foreground">Compare Zimbabwe insurance providers, policies, and claims</p>
      </div>

      {/* Secondary tab bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <CategorySelector
          value={tab}
          onValueChange={setTab}
          categories={tabs}
        />

        <LocationFilterPill
          selectedLocation={location}
          onLocationChange={setLocation}
        />
      </div>

      {/* Compare bar */}
      <InsuranceCompareBar />

      {/* Scrollable Content Container */}
      <div className="flex-1 pb-10">
        {tab === "overview" && <InsuranceOverview location={location} onTabChange={setTab} />}
        {tab === "policies" && <InsurancePolicies location={location} />}
        {tab === "claims" && <InsuranceClaims location={location} />}
      </div>
    </div>
  )
}
