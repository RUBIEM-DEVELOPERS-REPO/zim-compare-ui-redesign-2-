"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { InsuranceOverview } from "@/components/insurance/insurance-overview"
import { InsurancePolicies } from "@/components/insurance/insurance-policies"
import { InsuranceClaims } from "@/components/insurance/insurance-claims"
import { LocationFilterPill } from "@/components/location-filter-pill"
import { CategorySelector } from "@/components/category-selector"

const tabs = [
  { key: "overview", label: "Overview" },
  { key: "policies", label: "Policies" },
  { key: "claims", label: "Claims & Process" },
] as const

export default function InsurancePage() {
  const [tab, setTab] = useState<string>("overview")
  const [location, setLocation] = useState<string>("All Locations")

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-foreground">Insurance</h1>
        <p className="text-sm text-muted-foreground">Compare motor, medical, life, funeral and property insurance in Zimbabwe</p>
      </div>

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

      {tab === "overview" && <InsuranceOverview onTabChange={setTab} location={location} />}
      {tab === "policies" && <InsurancePolicies location={location} />}
      {tab === "claims" && <InsuranceClaims location={location} />}
    </div>
  )
}
