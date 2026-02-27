"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { TelecomOverview } from "@/components/telecom/telecom-overview"
import { TelecomData } from "@/components/telecom/telecom-data"
import { TelecomVoice } from "@/components/telecom/telecom-voice"
import { TelecomPackages } from "@/components/telecom/telecom-packages"
import { TelecomCoverage } from "@/components/telecom/telecom-coverage"
import { TelecomFees } from "@/components/telecom/telecom-fees"
import { TelecomProfiles } from "@/components/telecom/telecom-profiles"
import { LocationFilterPill } from "@/components/location-filter-pill"
import { CategorySelector } from "@/components/category-selector"

const tabs = [
  { key: "overview", label: "Overview" },
  { key: "data", label: "Data Bundles" },
  { key: "voice", label: "Voice & SMS" },
  { key: "packages", label: "Packages & Promos" },
  { key: "coverage", label: "Coverage & Quality" },
  { key: "fees", label: "Fees & Hidden Costs" },
  { key: "profiles", label: "Provider Profiles" },
] as const

export default function TelecomPage() {
  const [tab, setTab] = useState<string>("overview")
  const [location, setLocation] = useState<string>("All Locations")

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-foreground">Telecom</h1>
        <p className="text-sm text-muted-foreground">Compare Zimbabwe telecom providers, bundles, and coverage</p>
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

      {tab === "overview" && <TelecomOverview location={location} />}
      {tab === "data" && <TelecomData location={location} />}
      {tab === "voice" && <TelecomVoice location={location} />}
      {tab === "packages" && <TelecomPackages location={location} />}
      {tab === "coverage" && <TelecomCoverage location={location} />}
      {tab === "fees" && <TelecomFees location={location} />}
      {tab === "profiles" && <TelecomProfiles location={location} />}
    </div>
  )
}
