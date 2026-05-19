"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { TelecomOverview } from "@/components/telecom/telecom-overview"
import { TelecomData } from "@/components/telecom/telecom-data"
import { TelecomVoice } from "@/components/telecom/telecom-voice"
import { TelecomPackages } from "@/components/telecom/telecom-packages"
import { TelecomCoverage } from "@/components/telecom/telecom-coverage"
import { TelecomFees } from "@/components/telecom/telecom-fees"
import { TelecomProfiles } from "@/components/telecom/telecom-profiles"
import { TelecomInternet } from "@/components/telecom/telecom-internet"
import { LocationFilterPill } from "@/components/location-filter-pill"
import { CategorySelector } from "@/components/category-selector"
import { useAppStore } from "@/lib/store"
import { PageHeader } from "@/components/page-header"
import type { TelecomProvider, DataBundle, VoiceRate } from "@/lib/types"

import { AnalysisResult } from "@/lib/neural-engine"
import { TelecomPaymentOptimizer } from "@/components/telecom/telecom-payment-optimizer"

const tabs = [
  { key: "overview", label: "Overview" },
  { key: "data", label: "Data Bundles" },
  { key: "internet", label: "Internet / Private WiFi" },
  { key: "voice", label: "Voice & SMS" },
  { key: "packages", label: "Packages & Promos" },
  { key: "coverage", label: "Coverage & Quality" },
  { key: "fees", label: "Fees & Hidden Costs" },
  { key: "profiles", label: "Provider Profiles" },
] as const

export default function TelecomPage() {
  const [tab, setTab] = useState<string>("overview")
  const [location, setLocation] = useState<string>("All Locations")
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)
  
  const { compareTray, clearCompareTray } = useAppStore()
  
  const [providers, setProviders] = useState<TelecomProvider[]>([])
  const [bundles, setBundles] = useState<DataBundle[]>([])
  const [voiceRates, setVoiceRates] = useState<VoiceRate[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/telecom")
        const data = await res.json()
        setProviders(data.providers || [])
        setBundles(data.bundles || [])
        setVoiceRates(data.voiceRates || [])
      } catch (err) {
        console.error("Failed to fetch telecom data:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  // Clear stale comparison state if not telecom
  useEffect(() => {
    if (compareTray.ids.length > 0 && compareTray.category !== "telecom") {
      clearCompareTray()
    }
  }, [compareTray.category, compareTray.ids.length, clearCompareTray])

  const handleAnalysis = (result: AnalysisResult | null) => {
    setAnalysisResult(result)
    if (result && tab !== "analysis") {
      setTab("analysis")
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Telecom Intelligence"
        subtitle="Compare Zimbabwe telecom providers, bundles, and coverage with high-fidelity signal analysis."
      />


      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <CategorySelector
          value={tab}
          onValueChange={setTab}
          categories={tabs}
          mainCategory="telecom"
          onAnalysis={handleAnalysis}
        />

        <LocationFilterPill
          selectedLocation={location}
          onLocationChange={setLocation}
        />
      </div>

      <div className="animate-in fade-in duration-500">
        {tab === "overview" && <TelecomOverview location={location} providers={providers} />}
        {tab === "data" && <TelecomData location={location} bundles={bundles} providers={providers} />}
        {tab === "internet" && <TelecomInternet location={location} bundles={bundles} providers={providers} />}
        {tab === "voice" && <TelecomVoice location={location} voiceRates={voiceRates} providers={providers} />}
        {tab === "packages" && <TelecomPackages location={location} bundles={bundles} providers={providers} />}
        {tab === "coverage" && <TelecomCoverage location={location} providers={providers} />}
        {tab === "fees" && <TelecomFees location={location} providers={providers} />}
        {tab === "profiles" && <TelecomProfiles location={location} providers={providers} bundles={bundles} />}
        {tab === "analysis" && (
          <div className="relative min-h-[600px] rounded-[2rem] overflow-hidden pt-0 pb-8 px-8">
            {/* Background Depth Effects */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#020617] to-[#031b1f] -z-10" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] -z-10" />
            
            <TelecomPaymentOptimizer />
          </div>
        )}
      </div>
    </div>
  )
}

