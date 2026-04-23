"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { InsuranceOverview } from "@/components/insurance/insurance-overview"
import { InsurancePolicies } from "@/components/insurance/insurance-policies"
import { InsuranceClaims } from "@/components/insurance/insurance-claims"
import { LocationFilterPill } from "@/components/location-filter-pill"
import { CategorySelector } from "@/components/category-selector"
import { useEffect } from "react"
import { useAppStore } from "@/lib/store"
import { InsuranceCompareBar } from "@/components/insurance/insurance-compare-bar"
import { PropertyQuoteWizard } from "@/app/insurance/property-quote/wizard"
import { PageHeader } from "@/components/page-header"


const tabs = [
  { key: "overview", label: "Overview" },
  { key: "policies", label: "Policies" },
  { key: "claims", label: "Claims & Process" },
  { key: "quote", label: "Property Quote" },
] as const

export default function InsurancePage() {
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
    <div className="space-y-6">
      <PageHeader
        title="Insurance Intelligence"
        subtitle="Compare motor, medical, life, funeral and property insurance in Zimbabwe"
      />


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

      <InsuranceCompareBar />

      {tab === "overview" && <InsuranceOverview onTabChange={setTab} location={location} />}
      {tab === "policies" && <InsurancePolicies location={location} />}
      {tab === "claims" && <InsuranceClaims location={location} />}
      {tab === "quote" && <PropertyQuoteWizard />}
    </div>
  )
}

